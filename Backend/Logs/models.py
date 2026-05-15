from django.db import models
from django.utils import timezone
from User.models import User

class SystemLog(models.Model):
    """
    System activity logs
    """
    ACTION_CHOICES = [
        ('USER_LOGIN', 'User Login'),
        ('USER_LOGOUT', 'User Logout'),
        ('TRANSACTION_COMPLETED', 'Transaction Completed'),
        ('TRANSACTION_FAILED', 'Transaction Failed'),
        ('CONTACT_FORM_SUBMIT', 'Contact Form Submit'),
        ('INSTITUTIONAL_APPLICATION', 'Institutional Application'),
        ('MAGIC_LINK_SENT', 'Magic Link Sent'),
        ('MAGIC_LINK_USED', 'Magic Link Used'),
        ('ACCOUNT_CREATED', 'Account Created'),
        ('PASSWORD_RESET', 'Password Reset'),
        ('DEPOSIT_PROCESSED', 'Deposit Processed'),
        ('WITHDRAWAL_PROCESSED', 'Withdrawal Processed'),
        ('PORTFOLIO_UPDATED', 'Portfolio Updated'),
        ('ADMIN_ACTION', 'Admin Action'),
        ('SECURITY_ALERT', 'Security Alert'),
        ('API_ACCESS', 'API Access'),
        ('DATA_EXPORT', 'Data Export'),
        ('SYSTEM_ERROR', 'System Error'),
    ]
    
    SEVERITY_CHOICES = [
        ('INFO', 'Info'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('CRITICAL', 'Critical'),
        ('DEBUG', 'Debug'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='system_logs')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    details = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='INFO')
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    session_id = models.CharField(max_length=255, blank=True, null=True)
    request_id = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    duration_ms = models.IntegerField(blank=True, null=True)  # Request duration in milliseconds
    metadata = models.JSONField(default=dict, blank=True)  # Additional structured data
    
    class Meta:
        db_table = 'system_logs'
        verbose_name = 'System Log'
        verbose_name_plural = 'System Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['severity', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.action} - {self.user.email if self.user else 'Anonymous'} ({self.timestamp})"

class AuditLog(models.Model):
    """
    Detailed audit logs for compliance and security
    """
    EVENT_TYPES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('VIEW', 'View'),
        ('EXPORT', 'Export'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('FAILED_LOGIN', 'Failed Login'),
        ('PASSWORD_CHANGE', 'Password Change'),
        ('PERMISSION_CHANGE', 'Permission Change'),
        ('DATA_ACCESS', 'Data Access'),
        ('SYSTEM_CHANGE', 'System Change'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    resource_type = models.CharField(max_length=100)  # Model name being affected
    resource_id = models.CharField(max_length=100, blank=True, null=True)  # ID of affected resource
    old_values = models.JSONField(default=dict, blank=True)  # Previous state
    new_values = models.JSONField(default=dict, blank=True)  # New state
    changed_fields = models.JSONField(default=list, blank=True)  # List of changed field names
    reason = models.TextField(blank=True, null=True)  # Reason for the change
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'audit_logs'
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['event_type', 'timestamp']),
            models.Index(fields=['resource_type', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.event_type} {self.resource_type} - {self.user.email if self.user else 'System'}"

class ErrorLog(models.Model):
    """
    Application error logs for debugging and monitoring
    """
    ERROR_LEVELS = [
        ('DEBUG', 'Debug'),
        ('INFO', 'Info'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('CRITICAL', 'Critical'),
    ]
    
    level = models.CharField(max_length=20, choices=ERROR_LEVELS)
    message = models.TextField()
    exception_type = models.CharField(max_length=200, blank=True, null=True)
    stack_trace = models.TextField(blank=True, null=True)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    line_number = models.IntegerField(blank=True, null=True)
    function_name = models.CharField(max_length=200, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='error_logs')
    request_path = models.CharField(max_length=500, blank=True, null=True)
    request_method = models.CharField(max_length=10, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    session_id = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(blank=True, null=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_errors')
    resolution_notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'error_logs'
        verbose_name = 'Error Log'
        verbose_name_plural = 'Error Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['level', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['resolved', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.level}: {self.message[:100]} - {self.timestamp}"

class PerformanceLog(models.Model):
    """
    Performance monitoring logs
    """
    endpoint = models.CharField(max_length=500)
    method = models.CharField(max_length=10)
    response_time_ms = models.IntegerField()
    status_code = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='performance_logs')
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    request_size = models.IntegerField(blank=True, null=True)  # Request body size in bytes
    response_size = models.IntegerField(blank=True, null=True)  # Response body size in bytes
    query_count = models.IntegerField(blank=True, null=True)  # Database queries executed
    query_time_ms = models.IntegerField(blank=True, null=True)  # Total database query time
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'performance_logs'
        verbose_name = 'Performance Log'
        verbose_name_plural = 'Performance Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['endpoint', 'timestamp']),
            models.Index(fields=['method', 'timestamp']),
            models.Index(fields=['status_code', 'timestamp']),
            models.Index(fields=['response_time_ms']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.method} {self.endpoint} - {self.response_time_ms}ms ({self.timestamp})"

class SecurityLog(models.Model):
    """
    Security-related events and alerts
    """
    EVENT_TYPES = [
        ('FAILED_LOGIN', 'Failed Login'),
        ('SUSPICIOUS_ACTIVITY', 'Suspicious Activity'),
        ('BRUTE_FORCE_ATTEMPT', 'Brute Force Attempt'),
        ('UNAUTHORIZED_ACCESS', 'Unauthorized Access'),
        ('PERMISSION_DENIED', 'Permission Denied'),
        ('DATA_BREACH_ATTEMPT', 'Data Breach Attempt'),
        ('MALICIOUS_REQUEST', 'Malicious Request'),
        ('RATE_LIMIT_EXCEEDED', 'Rate Limit Exceeded'),
        ('SESSION_HIJACK', 'Session Hijack'),
        ('ACCOUNT_LOCKOUT', 'Account Lockout'),
        ('PASSWORD_CHANGE', 'Password Change'),
        ('TWO_FACTOR_AUTH', 'Two Factor Auth'),
        ('API_KEY_USAGE', 'API Key Usage'),
        ('ADMIN_ACCESS', 'Admin Access'),
        ('SECURITY_POLICY_VIOLATION', 'Security Policy Violation'),
    ]
    
    SEVERITY_LEVELS = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='security_logs')
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='MEDIUM')
    description = models.TextField()
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True, null=True)
    session_id = models.CharField(max_length=255, blank=True, null=True)
    request_data = models.JSONField(default=dict, blank=True)
    geo_location = models.JSONField(default=dict, blank=True)  # Country, city, etc.
    device_fingerprint = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    is_resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(blank=True, null=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_security_issues')
    resolution_notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'security_logs'
        verbose_name = 'Security Log'
        verbose_name_plural = 'Security Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['event_type', 'timestamp']),
            models.Index(fields=['severity', 'timestamp']),
            models.Index(fields=['ip_address', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.ip_address} ({self.timestamp})"

class DataChangeLog(models.Model):
    """
    Track all data changes for compliance and rollback purposes
    """
    ACTION_TYPES = [
        ('INSERT', 'Insert'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('BULK_INSERT', 'Bulk Insert'),
        ('BULK_UPDATE', 'Bulk Update'),
        ('BULK_DELETE', 'Bulk Delete'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='data_change_logs')
    table_name = models.CharField(max_length=100)
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    record_id = models.CharField(max_length=100)
    old_data = models.JSONField(default=dict, blank=True)
    new_data = models.JSONField(default=dict, blank=True)
    changed_fields = models.JSONField(default=list, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    session_id = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'data_change_logs'
        verbose_name = 'Data Change Log'
        verbose_name_plural = 'Data Change Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['table_name', 'timestamp']),
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.action} {self.table_name}:{self.record_id} - {self.user.email if self.user else 'System'}"
