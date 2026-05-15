from rest_framework import serializers
from .models import (
    SystemLog, AuditLog, ErrorLog, PerformanceLog,
    SecurityLog, DataChangeLog
)

class SystemLogSerializer(serializers.ModelSerializer):
    """Serializer for SystemLog model"""
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = SystemLog
        fields = [
            'id', 'user', 'user_info', 'action', 'details', 'severity',
            'ip_address', 'user_agent', 'session_id', 'request_id',
            'timestamp', 'duration_ms', 'metadata'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'timestamp': {'read_only': True},
        }
    
    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name
            }
        return None

class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer for AuditLog model"""
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_info', 'event_type', 'resource_type',
            'resource_id', 'old_values', 'new_values', 'changed_fields',
            'reason', 'ip_address', 'user_agent', 'timestamp'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'timestamp': {'read_only': True},
        }
    
    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name
            }
        return None

class ErrorLogSerializer(serializers.ModelSerializer):
    """Serializer for ErrorLog model"""
    user_info = serializers.SerializerMethodField()
    resolved_by_info = serializers.SerializerMethodField()
    
    class Meta:
        model = ErrorLog
        fields = [
            'id', 'level', 'message', 'exception_type', 'stack_trace',
            'file_path', 'line_number', 'function_name', 'user', 'user_info',
            'request_path', 'request_method', 'ip_address', 'user_agent',
            'session_id', 'timestamp', 'resolved', 'resolved_at',
            'resolved_by', 'resolved_by_info', 'resolution_notes'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'timestamp': {'read_only': True},
            'resolved_at': {'read_only': True},
            'resolved_by': {'read_only': True},
        }
    
    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name
            }
        return None
    
    def get_resolved_by_info(self, obj):
        if obj.resolved_by:
            return {
                'id': obj.resolved_by.id,
                'email': obj.resolved_by.email,
                'first_name': obj.resolved_by.first_name,
                'last_name': obj.resolved_by.last_name
            }
        return None

class ErrorLogUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating error log resolution"""
    class Meta:
        model = ErrorLog
        fields = ['resolved', 'resolution_notes']

class PerformanceLogSerializer(serializers.ModelSerializer):
    """Serializer for PerformanceLog model"""
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = PerformanceLog
        fields = [
            'id', 'endpoint', 'method', 'response_time_ms', 'status_code',
            'user', 'user_info', 'ip_address', 'user_agent', 'request_size',
            'response_size', 'query_count', 'query_time_ms', 'timestamp'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'timestamp': {'read_only': True},
        }
    
    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name
            }
        return None

class SecurityLogSerializer(serializers.ModelSerializer):
    """Serializer for SecurityLog model"""
    user_info = serializers.SerializerMethodField()
    resolved_by_info = serializers.SerializerMethodField()
    
    class Meta:
        model = SecurityLog
        fields = [
            'id', 'user', 'user_info', 'event_type', 'severity', 'description',
            'ip_address', 'user_agent', 'session_id', 'request_data',
            'geo_location', 'device_fingerprint', 'timestamp', 'is_resolved',
            'resolved_at', 'resolved_by', 'resolved_by_info', 'resolution_notes'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'timestamp': {'read_only': True},
            'resolved_at': {'read_only': True},
            'resolved_by': {'read_only': True},
        }
    
    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name
            }
        return None
    
    def get_resolved_by_info(self, obj):
        if obj.resolved_by:
            return {
                'id': obj.resolved_by.id,
                'email': obj.resolved_by.email,
                'first_name': obj.resolved_by.first_name,
                'last_name': obj.resolved_by.last_name
            }
        return None

class SecurityLogUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating security log resolution"""
    class Meta:
        model = SecurityLog
        fields = ['is_resolved', 'resolution_notes']

class DataChangeLogSerializer(serializers.ModelSerializer):
    """Serializer for DataChangeLog model"""
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = DataChangeLog
        fields = [
            'id', 'user', 'user_info', 'table_name', 'action', 'record_id',
            'old_data', 'new_data', 'changed_fields', 'timestamp',
            'ip_address', 'user_agent', 'session_id'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'timestamp': {'read_only': True},
        }
    
    def get_user_info(self, obj):
        if obj.user:
            return {
                'id': obj.user.id,
                'email': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name
            }
        return None

class LogSummarySerializer(serializers.Serializer):
    """Serializer for log summary statistics"""
    total_logs = serializers.IntegerField()
    system_logs = serializers.IntegerField()
    audit_logs = serializers.IntegerField()
    error_logs = serializers.IntegerField()
    performance_logs = serializers.IntegerField()
    security_logs = serializers.IntegerField()
    data_change_logs = serializers.IntegerField()
    unresolved_errors = serializers.IntegerField()
    unresolved_security = serializers.IntegerField()
    avg_response_time = serializers.FloatField()
    error_rate = serializers.FloatField()
    security_incidents_today = serializers.IntegerField()

class LogAnalyticsSerializer(serializers.Serializer):
    """Serializer for log analytics data"""
    action_counts = serializers.DictField()
    severity_counts = serializers.DictField()
    hourly_distribution = serializers.ListField()
    top_ips = serializers.ListField()
    top_users = serializers.ListField()
    error_trends = serializers.ListField()
    performance_trends = serializers.ListField()
    security_events = serializers.ListField()
