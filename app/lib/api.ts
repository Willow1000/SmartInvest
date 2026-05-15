// API utility functions for Django backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

// Generic API request function
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get CSRF token if needed
  let csrfToken = '';
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfCookie) {
      csrfToken = csrfCookie.split('=')[1];
    }
  }

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };

  // Add CSRF token for POST/PUT/DELETE requests
  if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method || 'GET')) {
    defaultHeaders['X-CSRFToken'] = csrfToken;
  }

  // Add session cookie for authentication
  if (typeof window !== 'undefined') {
    defaultHeaders['Cookie'] = document.cookie;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // Important for session authentication
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || data.detail || 'Request failed',
        status: response.status,
        message: data.message
      };
    }

    return {
      data,
      status: response.status,
      message: data.message
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
      status: 500
    };
  }
}

// User Authentication APIs
export const authApi = {
  // Register new user
  register: async (userData: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    password: string;
    confirm_password: string;
  }) => {
    return apiRequest('/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }) => {
    return apiRequest('/users/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Logout user
  logout: async () => {
    return apiRequest('/users/logout/', {
      method: 'POST',
    });
  },

  // Change password
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    return apiRequest('/users/change_password/', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/users/me/');
  },
};

// Transaction APIs
export const transactionApi = {
  // Create transaction
  create: async (transactionData: {
    type: 'deposit' | 'withdrawal';
    amount: number;
    method: string;
    description?: string;
  }) => {
    return apiRequest('/transactions/', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  // Get user transactions
  list: async (params?: {
    type?: string;
    status?: string;
    page?: number;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/transactions/${queryString}`);
  },

  // Get transaction details
  get: async (id: string) => {
    return apiRequest(`/transactions/${id}/`);
  },
};

// Contact Form API
export const contactApi = {
  // Submit contact form
  submit: async (contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    return apiRequest('/contact/', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// Institutional Application API
export const institutionalApi = {
  // Submit application
  submit: async (applicationData: {
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    phone: string;
    source_of_capital: string;
    investment_amount: string;
    trading_experience: string;
    referral_source?: string;
  }) => {
    return apiRequest('/institutional-applications/', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  // Get user applications
  list: async () => {
    return apiRequest('/institutional-applications/');
  },

  // Get application details
  get: async (id: string) => {
    return apiRequest(`/institutional-applications/${id}/`);
  },
};

// Magic Link API
export const magicLinkApi = {
  // Request magic link
  request: async (email: string) => {
    return apiRequest('/magic-links/request_link/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Authenticate with magic link
  authenticate: async (token: string) => {
    return apiRequest('/magic-links/authenticate/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

// Portfolio API
export const portfolioApi = {
  // Get portfolio overview
  getOverview: async () => {
    return apiRequest('/portfolio/overview/');
  },

  // Get portfolio analytics
  getAnalytics: async () => {
    return apiRequest('/portfolio/analytics/');
  },
};

// Currency Profit API
export const currencyProfitApi = {
  // Get user currency profits
  list: async () => {
    return apiRequest('/currency-profits/');
  },

  // Create currency profit
  create: async (profitData: {
    symbol: string;
    name: string;
    investment: number;
    profit: number;
    profit_percent: number;
    projection: number;
  }) => {
    return apiRequest('/currency-profits/', {
      method: 'POST',
      body: JSON.stringify(profitData),
    });
  },
};

// Performance Data API
export const performanceApi = {
  // Get performance data
  list: async () => {
    return apiRequest('/performance-data/');
  },

  // Add performance data point
  create: async (dataPoint: {
    date: string;
    value: number;
    profit: number;
  }) => {
    return apiRequest('/performance-data/', {
      method: 'POST',
      body: JSON.stringify(dataPoint),
    });
  },
};

// News Insights API
export const newsApi = {
  // Get news insights
  list: async (params?: {
    category?: string;
    sentiment?: string;
    limit?: number;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/news-insights/${queryString}`);
  },

  // Create news insight
  create: async (newsData: {
    title: string;
    content: string;
    source: string;
    url?: string;
    published_at: string;
    category: string;
    sentiment: string;
  }) => {
    return apiRequest('/news-insights/', {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
  },
};

// User Management API
export const userApi = {
  // Update user balance
  updateBalance: async (balanceData: {
    amount: number;
    operation: 'add' | 'subtract';
  }) => {
    return apiRequest('/users/update_balance/', {
      method: 'POST',
      body: JSON.stringify(balanceData),
    });
  },

  // Get user details
  get: async (id: string) => {
    return apiRequest(`/users/${id}/`);
  },

  // Update user details
  update: async (id: string, userData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => {
    return apiRequest(`/users/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Error handling utility
export const handleApiError = (error: ApiResponse): string => {
  if (error.error) {
    // Handle specific error messages
    if (error.error.includes('credentials')) {
      return 'Invalid email or password';
    }
    if (error.error.includes('already exists')) {
      return 'An account with this email already exists';
    }
    if (error.error.includes('required')) {
      return 'Please fill in all required fields';
    }
    if (error.error.includes('invalid')) {
      return 'Invalid data provided';
    }
    return error.error;
  }
  return 'An unexpected error occurred';
};

// Success message utility
export const getSuccessMessage = (response: ApiResponse): string => {
  if (response.message) {
    return response.message;
  }
  if (response.data?.message) {
    return response.data.message;
  }
  return 'Operation completed successfully';
};

export default apiRequest;
