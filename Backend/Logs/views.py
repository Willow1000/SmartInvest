from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Avg, Q, F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from datetime import timedelta
from .models import (
    SystemLog, AuditLog, ErrorLog, PerformanceLog,
    SecurityLog, DataChangeLog
)
from .serializers import (
    SystemLogSerializer, AuditLogSerializer, ErrorLogSerializer,
    PerformanceLogSerializer, SecurityLogSerializer,
    DataChangeLogSerializer, ErrorLogUpdateSerializer,
    SecurityLogUpdateSerializer, LogSummarySerializer,
    LogAnalyticsSerializer
)

class SystemLogViewSet(viewsets.ModelViewSet):
    """ViewSet for SystemLog model"""
    queryset = SystemLog.objects.all()
    serializer_class = SystemLogSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['action', 'severity', 'user']
    search_fields = ['details', 'user__email']
    ordering_fields = ['timestamp', 'action', 'severity']
    
    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get system log summary"""
        queryset = self.get_queryset()
        
        # Count by action
        action_counts = queryset.values('action').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Count by severity
        severity_counts = queryset.values('severity').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Recent logs (last 24 hours)
        recent_logs = queryset.filter(
            timestamp__gte=timezone.now() - timedelta(days=1)
        ).count()
        
        return Response({
            'total_logs': queryset.count(),
            'recent_logs': recent_logs,
            'action_counts': dict(action_counts.values_list('action', 'count')),
            'severity_counts': dict(severity_counts.values_list('severity', 'count'))
        })

class AuditLogViewSet(viewsets.ModelViewSet):
    """ViewSet for AuditLog model"""
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['event_type', 'resource_type', 'user']
    search_fields = ['resource_type', 'resource_id', 'user__email']
    ordering_fields = ['timestamp', 'event_type', 'resource_type']
    
    def get_permissions(self):
        return [permissions.IsAdminUser()]
    
    @action(detail=False, methods=['get'])
    def resource_history(self, request):
        """Get history for a specific resource"""
        resource_type = request.query_params.get('resource_type')
        resource_id = request.query_params.get('resource_id')
        
        if not resource_type or not resource_id:
            return Response(
                {'error': 'resource_type and resource_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        logs = self.get_queryset().filter(
            resource_type=resource_type,
            resource_id=resource_id
        ).order_by('-timestamp')
        
        return Response(AuditLogSerializer(logs, many=True).data)

class ErrorLogViewSet(viewsets.ModelViewSet):
    """ViewSet for ErrorLog model"""
    queryset = ErrorLog.objects.all()
    serializer_class = ErrorLogSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['level', 'resolved', 'user']
    search_fields = ['message', 'exception_type', 'file_path']
    ordering_fields = ['timestamp', 'level', 'resolved']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
    
    def get_serializer_class(self):
        if self.action in ['partial_update', 'update']:
            return ErrorLogUpdateSerializer
        return ErrorLogSerializer
    
    @action(detail=False, methods=['get'])
    def unresolved(self, request):
        """Get unresolved errors"""
        unresolved = self.get_queryset().filter(resolved=False)
        return Response(ErrorLogSerializer(unresolved, many=True).data)
    
    @action(detail=False, methods=['get'])
    def error_trends(self, request):
        """Get error trends over time"""
        days = int(request.query_params.get('days', 7))
        start_date = timezone.now() - timedelta(days=days)
        
        trends = self.get_queryset().filter(
            timestamp__gte=start_date
        ).extra(
            select={'day': 'date(timestamp)'}
        ).values('day', 'level').annotate(
            count=Count('id')
        ).order_by('day', 'level')
        
        return Response(list(trends))
    
    @action(detail=True, methods=['patch'])
    def resolve(self, request, pk=None):
        """Resolve an error log"""
        error_log = self.get_object()
        serializer = ErrorLogUpdateSerializer(
            error_log,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            error_log = serializer.save(
                resolved=True,
                resolved_at=timezone.now(),
                resolved_by=request.user
            )
            return Response(ErrorLogSerializer(error_log).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PerformanceLogViewSet(viewsets.ModelViewSet):
    """ViewSet for PerformanceLog model"""
    queryset = PerformanceLog.objects.all()
    serializer_class = PerformanceLogSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['method', 'status_code', 'user']
    search_fields = ['endpoint', 'user__email']
    ordering_fields = ['timestamp', 'response_time_ms']
    
    def get_permissions(self):
        return [permissions.IsAdminUser()]
    
    @action(detail=False, methods=['get'])
    def slow_endpoints(self, request):
        """Get slow endpoints"""
        threshold = int(request.query_params.get('threshold', 1000))  # ms
        
        slow = self.get_queryset().filter(
            response_time_ms__gte=threshold
        ).order_by('-response_time_ms')[:50]
        
        return Response(PerformanceLogSerializer(slow, many=True).data)
    
    @action(detail=False, methods=['get'])
    def performance_stats(self, request):
        """Get performance statistics"""
        queryset = self.get_queryset()
        
        # Average response time
        avg_response_time = queryset.aggregate(
            avg=Avg('response_time_ms')
        )['avg'] or 0
        
        # Status code distribution
        status_codes = queryset.values('status_code').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Method distribution
        methods = queryset.values('method').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Top slowest endpoints
        slowest = queryset.values('endpoint').annotate(
            avg_response=Avg('response_time_ms'),
            count=Count('id')
        ).filter(count__gte=5).order_by('-avg_response')[:10]
        
        return Response({
            'avg_response_time': avg_response_time,
            'status_codes': dict(status_codes.values_list('status_code', 'count')),
            'methods': dict(methods.values_list('method', 'count')),
            'slowest_endpoints': list(slowest)
        })
    
    @action(detail=False, methods=['get'])
    def response_time_trends(self, request):
        """Get response time trends"""
        days = int(request.query_params.get('days', 7))
        start_date = timezone.now() - timedelta(days=days)
        
        trends = self.get_queryset().filter(
            timestamp__gte=start_date
        ).extra(
            select={'hour': 'strftime("%%Y-%%m-%%d %%H:00:00", timestamp)'}
        ).values('hour').annotate(
            avg_response=Avg('response_time_ms'),
            count=Count('id')
        ).order_by('hour')
        
        return Response(list(trends))

class SecurityLogViewSet(viewsets.ModelViewSet):
    """ViewSet for SecurityLog model"""
    queryset = SecurityLog.objects.all()
    serializer_class = SecurityLogSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['event_type', 'severity', 'is_resolved', 'user']
    search_fields = ['description', 'ip_address', 'user__email']
    ordering_fields = ['timestamp', 'severity', 'event_type']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
    
    def get_serializer_class(self):
        if self.action in ['partial_update', 'update']:
            return SecurityLogUpdateSerializer
        return SecurityLogSerializer
    
    @action(detail=False, methods=['get'])
    def unresolved(self, request):
        """Get unresolved security events"""
        unresolved = self.get_queryset().filter(is_resolved=False)
        return Response(SecurityLogSerializer(unresolved, many=True).data)
    
    @action(detail=False, methods=['get'])
    def high_severity(self, request):
        """Get high severity security events"""
        high_severity = self.get_queryset().filter(
            severity__in=['HIGH', 'CRITICAL']
        ).order_by('-timestamp')
        
        return Response(SecurityLogSerializer(high_severity, many=True).data)
    
    @action(detail=False, methods=['get'])
    def ip_analysis(self, request):
        """Get IP address analysis"""
        ip_stats = self.get_queryset().values('ip_address').annotate(
            event_count=Count('id'),
            unique_events=Count('event_type', distinct=True),
            latest_event=Count('id')
        ).filter(
            event_count__gte=2
        ).order_by('-event_count')
        
        return Response(list(ip_stats))
    
    @action(detail=False, methods=['get'])
    def security_summary(self, request):
        """Get security summary"""
        queryset = self.get_queryset()
        
        # Event type distribution
        event_types = queryset.values('event_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Severity distribution
        severity_counts = queryset.values('severity').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Recent events (last 24 hours)
        recent = queryset.filter(
            timestamp__gte=timezone.now() - timedelta(days=1)
        ).count()
        
        # Unresolved high severity
        unresolved_high = queryset.filter(
            is_resolved=False,
            severity__in=['HIGH', 'CRITICAL']
        ).count()
        
        return Response({
            'total_events': queryset.count(),
            'recent_events': recent,
            'unresolved_high_severity': unresolved_high,
            'event_types': dict(event_types.values_list('event_type', 'count')),
            'severity_counts': dict(severity_counts.values_list('severity', 'count'))
        })
    
    @action(detail=True, methods=['patch'])
    def resolve(self, request, pk=None):
        """Resolve a security event"""
        security_log = self.get_object()
        serializer = SecurityLogUpdateSerializer(
            security_log,
            data=request.data,
            partial=True
        )
        
        if serializer.is_valid():
            security_log = serializer.save(
                is_resolved=True,
                resolved_at=timezone.now(),
                resolved_by=request.user
            )
            return Response(SecurityLogSerializer(security_log).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DataChangeLogViewSet(viewsets.ModelViewSet):
    """ViewSet for DataChangeLog model"""
    queryset = DataChangeLog.objects.all()
    serializer_class = DataChangeLogSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['table_name', 'action', 'user']
    search_fields = ['table_name', 'record_id', 'user__email']
    ordering_fields = ['timestamp', 'table_name', 'action']
    
    def get_permissions(self):
        return [permissions.IsAdminUser()]
    
    @action(detail=False, methods=['get'])
    def table_history(self, request):
        """Get history for a specific table"""
        table_name = request.query_params.get('table_name')
        
        if not table_name:
            return Response(
                {'error': 'table_name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        history = self.get_queryset().filter(
            table_name=table_name
        ).order_by('-timestamp')
        
        return Response(DataChangeLogSerializer(history, many=True).data)
    
    @action(detail=False, methods=['get'])
    def record_history(self, request):
        """Get history for a specific record"""
        table_name = request.query_params.get('table_name')
        record_id = request.query_params.get('record_id')
        
        if not table_name or not record_id:
            return Response(
                {'error': 'table_name and record_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        history = self.get_queryset().filter(
            table_name=table_name,
            record_id=record_id
        ).order_by('-timestamp')
        
        return Response(DataChangeLogSerializer(history, many=True).data)
    
    @action(detail=False, methods=['get'])
    def change_summary(self, request):
        """Get change summary statistics"""
        queryset = self.get_queryset()
        
        # Action distribution
        actions = queryset.values('action').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Table distribution
        tables = queryset.values('table_name').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Recent changes (last 24 hours)
        recent = queryset.filter(
            timestamp__gte=timezone.now() - timedelta(days=1)
        ).count()
        
        return Response({
            'total_changes': queryset.count(),
            'recent_changes': recent,
            'actions': dict(actions.values_list('action', 'count')),
            'tables': dict(tables.values_list('table_name', 'count'))
        })

class LogAnalyticsViewSet(viewsets.ViewSet):
    """ViewSet for comprehensive log analytics"""
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard analytics"""
        # Get all log counts
        system_logs = SystemLog.objects.count()
        audit_logs = AuditLog.objects.count()
        error_logs = ErrorLog.objects.count()
        performance_logs = PerformanceLog.objects.count()
        security_logs = SecurityLog.objects.count()
        data_change_logs = DataChangeLog.objects.count()
        
        # Unresolved counts
        unresolved_errors = ErrorLog.objects.filter(resolved=False).count()
        unresolved_security = SecurityLog.objects.filter(is_resolved=False).count()
        
        # Performance metrics
        avg_response_time = PerformanceLog.objects.aggregate(
            avg=Avg('response_time_ms')
        )['avg'] or 0
        
        # Error rate (last 24 hours)
        total_requests = PerformanceLog.objects.filter(
            timestamp__gte=timezone.now() - timedelta(days=1)
        ).count()
        error_requests = PerformanceLog.objects.filter(
            timestamp__gte=timezone.now() - timedelta(days=1),
            status_code__gte=400
        ).count()
        error_rate = (error_requests / total_requests * 100) if total_requests > 0 else 0
        
        # Security incidents today
        security_incidents_today = SecurityLog.objects.filter(
            timestamp__date=timezone.now().date()
        ).count()
        
        return Response({
            'total_logs': system_logs + audit_logs + error_logs + performance_logs + security_logs + data_change_logs,
            'system_logs': system_logs,
            'audit_logs': audit_logs,
            'error_logs': error_logs,
            'performance_logs': performance_logs,
            'security_logs': security_logs,
            'data_change_logs': data_change_logs,
            'unresolved_errors': unresolved_errors,
            'unresolved_security': unresolved_security,
            'avg_response_time': avg_response_time,
            'error_rate': round(error_rate, 2),
            'security_incidents_today': security_incidents_today
        })
    
    @action(detail=False, methods=['get'])
    def trends(self, request):
        """Get log trends over time"""
        days = int(request.query_params.get('days', 7))
        start_date = timezone.now() - timedelta(days=days)
        
        # System log trends
        system_trends = SystemLog.objects.filter(
            timestamp__gte=start_date
        ).extra(
            select={'day': 'date(timestamp)'}
        ).values('day').annotate(
            count=Count('id')
        ).order_by('day')
        
        # Error log trends
        error_trends = ErrorLog.objects.filter(
            timestamp__gte=start_date
        ).extra(
            select={'day': 'date(timestamp)'}
        ).values('day').annotate(
            count=Count('id')
        ).order_by('day')
        
        # Security log trends
        security_trends = SecurityLog.objects.filter(
            timestamp__gte=start_date
        ).extra(
            select={'day': 'date(timestamp)'}
        ).values('day').annotate(
            count=Count('id')
        ).order_by('day')
        
        return Response({
            'system_trends': list(system_trends),
            'error_trends': list(error_trends),
            'security_trends': list(security_trends)
        })
