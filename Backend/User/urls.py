from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, AccountViewSet, TransactionViewSet, ContactFormViewSet,
    InstitutionalApplicationViewSet, MagicLinkViewSet, AdminSettingsViewSet,
    CurrencyProfitViewSet, PerformanceDataPointViewSet, AnalyticsMetricsViewSet,
    NewsInsightViewSet, PortfolioViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'accounts', AccountViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'contact', ContactFormViewSet)
router.register(r'institutional-applications', InstitutionalApplicationViewSet)
router.register(r'magic-links', MagicLinkViewSet)
router.register(r'admin-settings', AdminSettingsViewSet)
router.register(r'currency-profits', CurrencyProfitViewSet)
router.register(r'performance-data', PerformanceDataPointViewSet)
router.register(r'analytics-metrics', AnalyticsMetricsViewSet)
router.register(r'news-insights', NewsInsightViewSet)
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')

urlpatterns = [
    path('', include(router.urls)),
]
