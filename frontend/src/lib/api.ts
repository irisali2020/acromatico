// Cliente API para Acromático OS conectado a Express Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('acromatico_admin_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('acromatico_admin_token', token);
      } else {
        localStorage.removeItem('acromatico_admin_token');
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('acromatico_admin_token');
    }
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al comunicarse con el servidor');
      }

      return data;
    } catch (error: any) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    this.setToken(null);
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Proyectos Públicos
  async submitProjectIntake(payload: any) {
    return this.request('/projects/intake', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async trackProject(trackingCode: string) {
    return this.request(`/projects/track/${encodeURIComponent(trackingCode.trim())}`);
  }

  // Proyectos Admin
  async getAdminProjects(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/projects${query ? `?${query}` : ''}`);
  }

  async getAdminProjectDetail(idOrCode: string) {
    return this.request(`/projects/${encodeURIComponent(idOrCode)}`);
  }

  async updateProjectStage(id: string, stageData: any) {
    return this.request(`/projects/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify(stageData),
    });
  }

  async updateChecklistItem(id: string, itemId: string, status: string, notes?: string) {
    return this.request(`/projects/${id}/checklist/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async addProjectNote(id: string, text: string, author?: string) {
    return this.request(`/projects/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text, author }),
    });
  }

  // Tareas Admin
  async getTasks(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/tasks${query ? `?${query}` : ''}`);
  }

  async createTask(taskData: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, taskData: any) {
    return this.request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Métricas
  async getAnalytics() {
    return this.request('/analytics');
  }

  // Obras & Portfolio (Proyectos Seleccionados)
  async getPortfolio(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/portfolio${query ? `?${query}` : ''}`);
  }

  async createPortfolio(projectData: any) {
    return this.request('/portfolio', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updatePortfolio(id: string, projectData: any) {
    return this.request(`/portfolio/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(projectData),
    });
  }

  async deletePortfolio(id: string) {
    return this.request(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  // Servicios Arquitectónicos
  async getServices(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/services${query ? `?${query}` : ''}`);
  }

  async createService(serviceData: any) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id: string, serviceData: any) {
    return this.request(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
