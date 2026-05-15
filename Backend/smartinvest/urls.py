"""
URL configuration for smartinvest project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    """API root endpoint"""
    return JsonResponse({
        'message': 'SmartInvest API',
        'version': '1.0.0',
        'endpoints': {
            'users': '/api/users/',
            'accounts': '/api/accounts/',
            'transactions': '/api/transactions/',
            'contact': '/api/contact/',
            'institutional-applications': '/api/institutional-applications/',
            'magic-links': '/api/magic-links/',
            'admin-settings': '/api/admin-settings/',
            'currency-profits': '/api/currency-profits/',
            'performance-data': '/api/performance-data/',
            'analytics-metrics': '/api/analytics-metrics/',
            'news-insights': '/api/news-insights/',
            'portfolio': '/api/portfolio/',
            'logs': {
                'system-logs': '/api/logs/system-logs/',
                'audit-logs': '/api/logs/audit-logs/',
                'error-logs': '/api/logs/error-logs/',
                'performance-logs': '/api/logs/performance-logs/',
                'security-logs': '/api/logs/security-logs/',
                'data-change-logs': '/api/logs/data-change-logs/',
                'analytics': '/api/logs/analytics/'
            }
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/users/', include('User.urls')),
    path('api/logs/', include('Logs.urls')),
]
