from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    User, Account, Transaction, ContactForm, InstitutionalApplication,
    MagicLink, AdminSettings, CurrencyProfit, PerformanceDataPoint,
    AnalyticsMetrics, NewsInsight
)

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    password = serializers.CharField(write_only=True, required=False)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'phone',
            'role', 'verified', 'balance', 'created_at', 'updated_at', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'balance': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'phone', 'password', 'confirm_password'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Both email and password are required')

class AccountSerializer(serializers.ModelSerializer):
    """Serializer for Account model"""
    user_info = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Account
        fields = [
            'id', 'user', 'user_info', 'account_id', 'account_type',
            'is_active', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'account_id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model"""
    user_info = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'user_info', 'account', 'transaction_id', 'type',
            'amount', 'currency', 'method', 'status', 'timestamp', 'description'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'transaction_id': {'read_only': True},
            'timestamp': {'read_only': True},
        }

class TransactionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating transactions"""
    class Meta:
        model = Transaction
        fields = ['type', 'amount', 'method', 'description']
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive")
        return value
    
    def create(self, validated_data):
        user = self.context['request'].user
        account = user.account
        
        # Generate transaction ID
        import uuid
        transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        
        return Transaction.objects.create(
            user=user,
            account=account,
            transaction_id=transaction_id,
            **validated_data
        )

class ContactFormSerializer(serializers.ModelSerializer):
    """Serializer for ContactForm model"""
    class Meta:
        model = ContactForm
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message',
            'submitted_at', 'is_resolved'
        ]
        extra_kwargs = {
            'submitted_at': {'read_only': True},
            'is_resolved': {'read_only': True},
        }

class InstitutionalApplicationSerializer(serializers.ModelSerializer):
    """Serializer for InstitutionalApplication model"""
    user_info = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = InstitutionalApplication
        fields = [
            'id', 'user', 'user_info', 'first_name', 'last_name', 'email',
            'country', 'phone', 'source_of_capital', 'investment_amount',
            'trading_experience', 'referral_source', 'status',
            'submitted_at', 'reviewed_at', 'notes'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'submitted_at': {'read_only': True},
            'reviewed_at': {'read_only': True},
            'notes': {'read_only': True},
        }

class InstitutionalApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating institutional applications"""
    class Meta:
        model = InstitutionalApplication
        fields = [
            'first_name', 'last_name', 'email', 'country', 'phone',
            'source_of_capital', 'investment_amount', 'trading_experience',
            'referral_source'
        ]
    
    def create(self, validated_data):
        user = self.context['request'].user
        return InstitutionalApplication.objects.create(
            user=user,
            **validated_data
        )

class MagicLinkSerializer(serializers.ModelSerializer):
    """Serializer for MagicLink model"""
    user_info = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = MagicLink
        fields = [
            'id', 'user', 'user_info', 'token', 'email', 'created_at',
            'expires_at', 'is_used', 'used_at'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'token': {'read_only': True},
            'created_at': {'read_only': True},
            'used_at': {'read_only': True},
        }

class MagicLinkRequestSerializer(serializers.Serializer):
    """Serializer for requesting magic link"""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No account found with this email")
        return value

class AdminSettingsSerializer(serializers.ModelSerializer):
    """Serializer for AdminSettings model"""
    class Meta:
        model = AdminSettings
        fields = [
            'id', 'key', 'value', 'description', 'is_active',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

class CurrencyProfitSerializer(serializers.ModelSerializer):
    """Serializer for CurrencyProfit model"""
    user_info = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = CurrencyProfit
        fields = [
            'id', 'user', 'user_info', 'symbol', 'name', 'investment',
            'profit', 'profit_percent', 'projection', 'last_updated'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'last_updated': {'read_only': True},
        }

class PerformanceDataPointSerializer(serializers.ModelSerializer):
    """Serializer for PerformanceDataPoint model"""
    user_info = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = PerformanceDataPoint
        fields = ['id', 'user', 'user_info', 'date', 'value', 'profit']
        extra_kwargs = {
            'user': {'read_only': True},
        }

class AnalyticsMetricsSerializer(serializers.ModelSerializer):
    """Serializer for AnalyticsMetrics model"""
    user_info = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = AnalyticsMetrics
        fields = [
            'id', 'user', 'user_info', 'sharpe_ratio', 'alpha', 'beta',
            'volatility', 'time_weighted_return', 'cagr', 'last_calculated'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'last_calculated': {'read_only': True},
        }

class NewsInsightSerializer(serializers.ModelSerializer):
    """Serializer for NewsInsight model"""
    class Meta:
        model = NewsInsight
        fields = [
            'id', 'title', 'content', 'source', 'url', 'published_at',
            'category', 'sentiment', 'created_at'
        ]
        extra_kwargs = {
            'created_at': {'read_only': True},
        }

class UserBalanceSerializer(serializers.Serializer):
    """Serializer for updating user balance"""
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    operation = serializers.ChoiceField(choices=['add', 'subtract'])
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive")
        return value
    
    def validate(self, attrs):
        user = self.context['request'].user
        if attrs['operation'] == 'subtract' and user.balance < attrs['amount']:
            raise serializers.ValidationError("Insufficient balance")
        return attrs

class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("New passwords don't match")
        
        user = self.context['request'].user
        if not user.check_password(attrs['current_password']):
            raise serializers.ValidationError("Current password is incorrect")
        
        return attrs
    
    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
