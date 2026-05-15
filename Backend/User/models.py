from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    """
    Extended User model for SmartInvest platform
    """
    ROLE_CHOICES = [
        ('USER', 'User'),
        ('ADMIN', 'Admin'),
        ('INSTITUTIONAL', 'Institutional'),
    ]
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='USER')
    verified = models.BooleanField(default=False)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} ({self.first_name} {self.last_name})"

class Account(models.Model):
    """
    User account information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='account')
    account_id = models.CharField(max_length=50, unique=True)
    account_type = models.CharField(max_length=20, default='individual')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'accounts'
        verbose_name = 'Account'
        verbose_name_plural = 'Accounts'
    
    def __str__(self):
        return f"{self.user.email} - {self.account_id}"

class Transaction(models.Model):
    """
    Transaction records for deposits and withdrawals
    """
    TRANSACTION_TYPE_CHOICES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    ]
    
    TRANSACTION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=TRANSACTION_STATUS_CHOICES, default='pending')
    timestamp = models.DateTimeField(default=timezone.now)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'transactions'
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user.email} - {self.type} - ${self.amount}"

class ContactForm(models.Model):
    """
    Contact form submissions
    """
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'contact_forms'
        verbose_name = 'Contact Form'
        verbose_name_plural = 'Contact Forms'
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"

class InstitutionalApplication(models.Model):
    """
    Institutional investor applications
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('REVIEW', 'Under Review'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='institutional_applications')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    source_of_capital = models.CharField(max_length=100)
    investment_amount = models.CharField(max_length=50)
    trading_experience = models.CharField(max_length=100)
    referral_source = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_applications')
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'institutional_applications'
        verbose_name = 'Institutional Application'
        verbose_name_plural = 'Institutional Applications'
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.email} - {self.status}"

class MagicLink(models.Model):
    """
    Magic link tokens for authentication
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='magic_links')
    token = models.CharField(max_length=255, unique=True)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'magic_links'
        verbose_name = 'Magic Link'
        verbose_name_plural = 'Magic Links'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.token[:20]}..."
    
    def is_expired(self):
        return timezone.now() > self.expires_at

class AdminSettings(models.Model):
    """
    Application-wide administrative settings
    """
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admin_settings'
        verbose_name = 'Admin Setting'
        verbose_name_plural = 'Admin Settings'
        ordering = ['key']
    
    def __str__(self):
        return f"{self.key}: {self.value}"

class CurrencyProfit(models.Model):
    """
    Individual currency profit tracking
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='currency_profits')
    symbol = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    investment = models.DecimalField(max_digits=15, decimal_places=2)
    profit = models.DecimalField(max_digits=15, decimal_places=2)
    profit_percent = models.DecimalField(max_digits=10, decimal_places=4)
    projection = models.DecimalField(max_digits=15, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'currency_profits'
        verbose_name = 'Currency Profit'
        verbose_name_plural = 'Currency Profits'
        unique_together = ['user', 'symbol']
        ordering = ['-profit_percent']
    
    def __str__(self):
        return f"{self.user.email} - {self.symbol} ({self.profit_percent}%)"

class PerformanceDataPoint(models.Model):
    """
    Historical performance data points
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='performance_history')
    date = models.DateField()
    value = models.DecimalField(max_digits=15, decimal_places=2)
    profit = models.DecimalField(max_digits=15, decimal_places=2)
    
    class Meta:
        db_table = 'performance_data'
        verbose_name = 'Performance Data Point'
        verbose_name_plural = 'Performance Data Points'
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.email} - {self.date} (${self.value})"

class AnalyticsMetrics(models.Model):
    """
    User analytics and performance metrics
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='analytics')
    sharpe_ratio = models.DecimalField(max_digits=10, decimal_places=4)
    alpha = models.DecimalField(max_digits=10, decimal_places=4)
    beta = models.DecimalField(max_digits=10, decimal_places=4)
    volatility = models.DecimalField(max_digits=10, decimal_places=4)
    time_weighted_return = models.DecimalField(max_digits=10, decimal_places=4)
    cagr = models.DecimalField(max_digits=10, decimal_places=4)
    last_calculated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'analytics_metrics'
        verbose_name = 'Analytics Metrics'
        verbose_name_plural = 'Analytics Metrics'
    
    def __str__(self):
        return f"{self.user.email} - Analytics"

class NewsInsight(models.Model):
    """
    Market news and insights
    """
    title = models.CharField(max_length=200)
    content = models.TextField()
    source = models.CharField(max_length=100)
    url = models.URLField(blank=True, null=True)
    published_at = models.DateTimeField()
    category = models.CharField(max_length=50)
    sentiment = models.CharField(max_length=20, choices=[
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'news_insights'
        verbose_name = 'News Insight'
        verbose_name_plural = 'News Insights'
        ordering = ['-published_at']
    
    def __str__(self):
        return f"{self.title} - {self.source}"