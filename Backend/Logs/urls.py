from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SystemLogViewSet, AuditLogViewSet, ErrorLogViewSet, PerformanceLogViewSet,
    SecurityLogViewSet, DataChangeLogViewSet, LogAnalyticsViewSet
)

router = DefaultRouter()
router.register(r'system-logs', SystemLogViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'error-logs', ErrorLogViewSet)
router.register(r'performance-logs', PerformanceLogViewSet)
router.register(r'security-logs', SecurityLogViewSet)
router.register(r'data-change-logs', DataChangeLogViewSet)
router.register(r'analytics', LogAnalyticsViewSet, basename='log-analytics')

urlpatterns = [
    path('', include(router.urls)),
]
