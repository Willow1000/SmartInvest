from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.utils import timezone
from django.db.models import Sum, Avg, Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import (
    User, Account, Transaction, ContactForm, InstitutionalApplication,
    MagicLink, AdminSettings, CurrencyProfit, PerformanceDataPoint,
    AnalyticsMetrics, NewsInsight
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    AccountSerializer, TransactionSerializer, TransactionCreateSerializer,
    ContactFormSerializer, InstitutionalApplicationSerializer,
    InstitutionalApplicationCreateSerializer, MagicLinkSerializer,
    MagicLinkRequestSerializer, AdminSettingsSerializer,
    CurrencyProfitSerializer, PerformanceDataPointSerializer,
    AnalyticsMetricsSerializer, NewsInsightSerializer,
    UserBalanceSerializer, PasswordChangeSerializer
)
from Logs.models import SystemLog
import uuid
import secrets

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'verified']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email', 'last_name']
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Register a new user"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create account for user
            Account.objects.create(
                user=user,
                account_id=f"ACC-{uuid.uuid4().hex[:12].upper()}"
            )
            
            # Log registration
            SystemLog.objects.create(
                user=user,
                action='ACCOUNT_CREATED',
                details=f'User {user.email} registered successfully',
                severity='INFO',
                ip_address=self.get_client_ip(request)
            )
            
            return Response(
                UserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """Login user"""
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            # Log login
            SystemLog.objects.create(
                user=user,
                action='USER_LOGIN',
                details=f'User {user.email} logged in',
                severity='INFO',
                ip_address=self.get_client_ip(request)
            )
            
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logout user"""
        SystemLog.objects.create(
            user=request.user,
            action='USER_LOGOUT',
            details=f'User {request.user.email} logged out',
            severity='INFO',
            ip_address=self.get_client_ip(request)
        )
        
        logout(request)
        return Response({'message': 'Logged out successfully'})
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password"""
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            
            SystemLog.objects.create(
                user=request.user,
                action='PASSWORD_CHANGE',
                details=f'User {request.user.email} changed password',
                severity='INFO',
                ip_address=self.get_client_ip(request)
            )
            
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def update_balance(self, request):
        """Update user balance"""
        serializer = UserBalanceSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            operation = serializer.validated_data['operation']
            
            if operation == 'add':
                request.user.balance += amount
            else:
                request.user.balance -= amount
            
            request.user.save()
            
            SystemLog.objects.create(
                user=request.user,
                action='BALANCE_UPDATED',
                details=f'Balance {operation}ed: ${amount}',
                severity='INFO',
                ip_address=self.get_client_ip(request)
            )
            
            return Response({
                'balance': request.user.balance,
                'message': f'Balance updated successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

class AccountViewSet(viewsets.ModelViewSet):
    """ViewSet for Account model"""
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['account_type', 'is_active']
    search_fields = ['account_id', 'user__email']
    ordering_fields = ['created_at', 'account_id']
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return Account.objects.all()
        return Account.objects.filter(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for Transaction model"""
    queryset = Transaction.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status', 'currency', 'method']
    search_fields = ['transaction_id', 'user__email']
    ordering_fields = ['timestamp', 'amount']
    
    def get_serializer_class(self):
        if self.action in ['create', 'partial_update', 'update']:
            return TransactionCreateSerializer
        return TransactionSerializer
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return Transaction.objects.all()
        return Transaction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        transaction = serializer.save(user=self.request.user)
        
        # Update user balance
        if transaction.type == 'deposit':
            self.request.user.balance += transaction.amount
        elif transaction.type == 'withdrawal':
            self.request.user.balance -= transaction.amount
        self.request.user.save()
        
        # Log transaction
        SystemLog.objects.create(
            user=self.request.user,
            action='TRANSACTION_COMPLETED',
            details=f'{transaction.type} of ${transaction.amount} via {transaction.method}',
            severity='INFO',
            ip_address=self.get_client_ip(self.request)
        )
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

class ContactFormViewSet(viewsets.ModelViewSet):
    """ViewSet for ContactForm model"""
    queryset = ContactForm.objects.all()
    serializer_class = ContactFormSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_resolved']
    search_fields = ['name', 'email', 'subject']
    ordering_fields = ['submitted_at']
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        contact_form = serializer.save()
        
        # Log contact form submission
        SystemLog.objects.create(
            action='CONTACT_FORM_SUBMIT',
            details=f'Contact form submitted by {contact_form.email}: {contact_form.subject}',
            severity='INFO',
            ip_address=self.get_client_ip(self.request)
        )
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

class InstitutionalApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for InstitutionalApplication model"""
    queryset = InstitutionalApplication.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'country', 'source_of_capital']
    search_fields = ['first_name', 'last_name', 'email', 'company_name']
    ordering_fields = ['submitted_at', 'reviewed_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'partial_update', 'update']:
            return InstitutionalApplicationCreateSerializer
        return InstitutionalApplicationSerializer
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return InstitutionalApplication.objects.all()
        return InstitutionalApplication.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        application = serializer.save(user=self.request.user)
        
        # Log application submission
        SystemLog.objects.create(
            user=self.request.user,
            action='INSTITUTIONAL_APPLICATION',
            details=f'Institutional application submitted by {application.email}',
            severity='INFO',
            ip_address=self.get_client_ip(self.request)
        )
    
    @action(detail=True, methods=['patch'])
    def review(self, request, pk=None):
        """Review institutional application (admin only)"""
        if not request.user.is_superuser:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        application = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        
        if new_status not in ['APPROVED', 'REJECTED', 'REVIEW']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.reviewed_at = timezone.now()
        application.reviewed_by = request.user
        application.notes = notes
        application.save()
        
        SystemLog.objects.create(
            user=request.user,
            action='INSTITUTIONAL_APPLICATION',
            details=f'Application {application.id} reviewed: {new_status}',
            severity='INFO',
            ip_address=self.get_client_ip(request)
        )
        
        return Response(InstitutionalApplicationSerializer(application).data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

class MagicLinkViewSet(viewsets.ModelViewSet):
    """ViewSet for MagicLink model"""
    queryset = MagicLink.objects.all()
    serializer_class = MagicLinkSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_used']
    search_fields = ['email', 'token']
    ordering_fields = ['created_at', 'expires_at']
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def request_link(self, request):
        """Request magic link for login"""
        serializer = MagicLinkRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Generate magic link
            token = secrets.token_urlsafe(32)
            expires_at = timezone.now() + timezone.timedelta(hours=1)
            
            magic_link = MagicLink.objects.create(
                user=user,
                token=token,
                email=email,
                expires_at=expires_at,
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            # Log magic link creation
            SystemLog.objects.create(
                user=user,
                action='MAGIC_LINK_SENT',
                details=f'Magic link sent to {email}',
                severity='INFO',
                ip_address=self.get_client_ip(request)
            )
            
            return Response({
                'message': 'Magic link sent successfully',
                'token': token  # In production, send via email
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def authenticate(self, request):
        """Authenticate with magic link"""
        token = request.data.get('token')
        
        try:
            magic_link = MagicLink.objects.get(
                token=token,
                is_used=False,
                expires_at__gt=timezone.now()
            )
            
            # Mark as used
            magic_link.is_used = True
            magic_link.used_at = timezone.now()
            magic_link.save()
            
            # Login user
            login(request, magic_link.user)
            
            # Log magic link usage
            SystemLog.objects.create(
                user=magic_link.user,
                action='MAGIC_LINK_USED',
                details=f'Magic link used for login by {magic_link.user.email}',
                severity='INFO',
                ip_address=self.get_client_ip(request)
            )
            
            return Response(UserSerializer(magic_link.user).data)
            
        except MagicLink.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired magic link'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

class AdminSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for AdminSettings model"""
    queryset = AdminSettings.objects.all()
    serializer_class = AdminSettingsSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['key', 'description']
    ordering_fields = ['key', 'created_at']
    
    def get_permissions(self):
        return [permissions.IsAdminUser()]

class CurrencyProfitViewSet(viewsets.ModelViewSet):
    """ViewSet for CurrencyProfit model"""
    queryset = CurrencyProfit.objects.all()
    serializer_class = CurrencyProfitSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['symbol', 'name']
    ordering_fields = ['profit_percent', 'profit', 'last_updated']
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return CurrencyProfit.objects.all()
        return CurrencyProfit.objects.filter(user=self.request.user)

class PerformanceDataPointViewSet(viewsets.ModelViewSet):
    """ViewSet for PerformanceDataPoint model"""
    queryset = PerformanceDataPoint.objects.all()
    serializer_class = PerformanceDataPointSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['date']
    ordering_fields = ['date', 'value', 'profit']
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return PerformanceDataPoint.objects.all()
        return PerformanceDataPoint.objects.filter(user=self.request.user)

class AnalyticsMetricsViewSet(viewsets.ModelViewSet):
    """ViewSet for AnalyticsMetrics model"""
    queryset = AnalyticsMetrics.objects.all()
    serializer_class = AnalyticsMetricsSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    ordering_fields = ['last_calculated', 'sharpe_ratio', 'alpha', 'beta']
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return AnalyticsMetrics.objects.all()
        return AnalyticsMetrics.objects.filter(user=self.request.user)

class NewsInsightViewSet(viewsets.ModelViewSet):
    """ViewSet for NewsInsight model"""
    queryset = NewsInsight.objects.all()
    serializer_class = NewsInsightSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'sentiment']
    search_fields = ['title', 'source', 'content']
    ordering_fields = ['published_at', 'created_at']

class PortfolioViewSet(viewsets.ViewSet):
    """ViewSet for portfolio operations"""
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get portfolio overview"""
        user = request.user
        
        # Get user's transactions
        transactions = Transaction.objects.filter(user=user)
        deposits = transactions.filter(type='deposit').aggregate(
            total=Sum('amount'),
            count=Count('id')
        )
        withdrawals = transactions.filter(type='withdrawal').aggregate(
            total=Sum('amount'),
            count=Count('id')
        )
        
        # Get currency profits
        currency_profits = CurrencyProfit.objects.filter(user=user)
        total_profit = currency_profits.aggregate(
            total=Sum('profit'),
            total_investment=Sum('investment')
        )
        
        # Get performance data
        performance_data = PerformanceDataPoint.objects.filter(user=user).order_by('date')
        
        overview = {
            'user': UserSerializer(user).data,
            'balance': user.balance,
            'total_deposits': deposits['total'] or 0,
            'total_withdrawals': withdrawals['total'] or 0,
            'deposit_count': deposits['count'] or 0,
            'withdrawal_count': withdrawals['count'] or 0,
            'total_profit': total_profit['total'] or 0,
            'total_investment': total_profit['total_investment'] or 0,
            'currency_profits': CurrencyProfitSerializer(currency_profits, many=True).data,
            'performance_history': PerformanceDataPointSerializer(performance_data, many=True).data,
            'recent_transactions': TransactionSerializer(
                transactions.order_by('-timestamp')[:10], many=True
            ).data
        }
        
        return Response(overview)
    
    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Get portfolio analytics"""
        try:
            analytics = request.user.analytics
            return Response(AnalyticsMetricsSerializer(analytics).data)
        except AnalyticsMetrics.DoesNotExist:
            return Response({'error': 'Analytics data not available'}, status=404)
