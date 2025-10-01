

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://futera.onrender.com/api/v1";

// API Endpoints
export const API_ENDPOINTS = {
  // User Authentication
  login: `${API_BASE_URL}/user/login`,
  register: `${API_BASE_URL}/user/create`,
  
  // User Management (Admin)
  getAllUsers: `${API_BASE_URL}/user/admin/all-users`,
  getUserById: `${API_BASE_URL}/user`,
  updateUser: `${API_BASE_URL}/user/update`,
  deleteUser: `${API_BASE_URL}/user/delete`,
  
  // Document/Paper formatting (assuming these exist)
  formatDocument: `${API_BASE_URL}/document/format`,
  getUserDocuments: `${API_BASE_URL}/document/user`,
};

// Generic API request function
export const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    // Get token from localStorage (adjust key names as needed)
    const token = localStorage.getItem('adminToken') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('token');
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    });

    // Handle different HTTP status codes
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }

    if (response.status === 403) {
      throw new Error('Access denied. Insufficient permissions.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Interface definitions
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  registrationDate: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
  documentsFormatted: number;
  role: string;
}

export interface ApiResponse<T> {
  data?: T;
  users?: T[];
  user?: T;
  message?: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserData {
  status?: string;
  role?: string;
  [key: string]: unknown;
}

export interface RawUserData {
  id?: string;
  _id?: string;
  username?: string;
  name?: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  registrationDate?: string;
  createdAt?: string;
  dateJoined?: string;
  lastLogin?: string;
  updatedAt?: string;
  status?: string;
  isActive?: boolean;
  documentsFormatted?: number;
  documentsCount?: number;
  role?: string;
}

export interface RawApiResponse {
  data?: unknown;
  users?: unknown;
  user?: unknown;
  message?: string;
  [key: string]: unknown;
}

// Helper function to safely convert status string to the allowed types
const normalizeStatus = (status: string | undefined, isActive?: boolean): 'active' | 'inactive' | 'suspended' => {
  if (status === 'active' || status === 'inactive' || status === 'suspended') {
    return status;
  }
  
  // Fallback based on isActive flag
  if (isActive !== undefined) {
    return isActive ? 'active' : 'inactive';
  }
  
  // Default fallback
  return 'inactive';
};

// Helper functions to extract data from API responses
const extractUserData = (response: RawApiResponse | RawUserData): User => {
  const userData = (response as RawApiResponse).data || (response as RawApiResponse).user || response;
  const rawUser = userData as RawUserData;
  
  return {
    id: rawUser.id || rawUser._id || '',
    username: rawUser.username || rawUser.name || '',
    email: rawUser.email || '',
    fullName: rawUser.fullName || 
             (rawUser.firstName && rawUser.lastName 
              ? `${rawUser.firstName} ${rawUser.lastName}` 
              : rawUser.name || ''),
    registrationDate: rawUser.registrationDate || rawUser.createdAt || rawUser.dateJoined || '',
    lastLogin: rawUser.lastLogin || rawUser.updatedAt || '',
    status: normalizeStatus(rawUser.status, rawUser.isActive),
    documentsFormatted: rawUser.documentsFormatted || rawUser.documentsCount || 0,
    role: rawUser.role || 'user'
  };
};

const extractUsersData = (response: RawApiResponse): User[] => {
  const usersData = response.data || response.users || response;
  
  if (!Array.isArray(usersData)) {
    throw new Error('Expected array of users');
  }
  
  return usersData.map((user: unknown) => extractUserData(user as RawUserData));
};

// User API functions
export const userAPI = {
  // Authentication
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    const response = await apiRequest<ApiResponse<User>>(API_ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response;
  },

  register: async (userData: RegisterData): Promise<ApiResponse<User>> => {
    const response = await apiRequest<ApiResponse<User>>(API_ENDPOINTS.register, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  },

  // User management (Admin functions)
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiRequest<RawApiResponse>(API_ENDPOINTS.getAllUsers);
    return extractUsersData(response);
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiRequest<RawApiResponse>(`${API_ENDPOINTS.getUserById}/${userId}`);
    return extractUserData(response);
  },

  updateUser: async (userId: string, updateData: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await apiRequest<ApiResponse<User>>(`${API_ENDPOINTS.updateUser}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return response;
  },

  updateUserStatus: async (userId: string, status: string): Promise<ApiResponse<User>> => {
    // Validate the status before sending to API
    const normalizedStatus = normalizeStatus(status);
    const response = await apiRequest<ApiResponse<User>>(`${API_ENDPOINTS.updateUser}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: normalizedStatus })
    });
    return response;
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await apiRequest<ApiResponse<void>>(`${API_ENDPOINTS.deleteUser}/${userId}`, {
      method: 'DELETE'
    });
    return response;
  }
};

// Document interfaces
export interface DocumentData {
  [key: string]: unknown;
}

export interface FormattedDocument {
  [key: string]: unknown;
}

// Document/Paper API functions
export const documentAPI = {
  formatDocument: async (documentData: DocumentData): Promise<FormattedDocument> => {
    const response = await apiRequest<FormattedDocument>(API_ENDPOINTS.formatDocument, {
      method: 'POST',
      body: JSON.stringify(documentData)
    });
    return response;
  },

  getUserDocuments: async (userId: string): Promise<FormattedDocument[]> => {
    const response = await apiRequest<ApiResponse<FormattedDocument[]>>(`${API_ENDPOINTS.getUserDocuments}/${userId}`);
    return response.data || (response as unknown as FormattedDocument[]) || [];
  }
};

export default {
  API_ENDPOINTS,
  apiRequest,
  userAPI,
  documentAPI
};
