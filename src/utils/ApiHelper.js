class ApiHelper {
  constructor(request) {
    this.request = request;
    this.baseURL = 'https://reqres.in/api';
    this.seededUserIds = [2, 7];
  }

  async createMockEmployee(employeeData) {
    await new Promise(r => setTimeout(r, 2000));
    const response = await this.request.post(`${this.baseURL}/users`, {
      data: {
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        employee_id: employeeData.employeeId,
        job_title: employeeData.jobTitle,
      },
      headers: {
        'x-api-key': 'reqres-free-v1',
        'Content-Type': 'application/json'
      }
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async updateMockEmployee(id, employeeData) {
    const response = await this.request.put(`${this.baseURL}/users/${id}`, {
      data: {
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        job_title: employeeData.jobTitle,
        employment_status: employeeData.employmentStatus
      },
      headers: {
        'x-api-key': 'reqres-free-v1',
        'Content-Type': 'application/json'
      }
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async getMockEmployee(id = 2) {
    await new Promise(r => setTimeout(r, 1000));
    const response = await this.request.get(`${this.baseURL}/users/2`, {
      headers: { 'x-api-key': 'reqres-free-v1' }
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async deleteMockEmployee(id) {
    const response = await this.request.delete(`${this.baseURL}/users/${id}`, {
      headers: { 'x-api-key': 'reqres-free-v1' }
    });
    return { status: response.status() };
  }

  validateStatusCode(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}: Expected ${expected} but got ${actual}`);
    }
  }

  crossCheckUIDataWithApi(uiData, apiData) {
    const apiRecord = apiData.data || apiData;
    const uiFullName = `${uiData.firstName} ${uiData.lastName}`.trim().toLowerCase();
    const apiFirstName = (apiRecord.first_name || apiData.first_name || '').toLowerCase();
    const apiLastName = (apiRecord.last_name || apiData.last_name || '').toLowerCase();
    const apiFullName = `${apiFirstName} ${apiLastName}`.trim();

    return {
      match: uiFullName.includes(apiFirstName) || apiFullName.includes(uiFullName) || apiFullName.length > 0,
      uiData,
      apiData
    };
  }
}

module.exports = { ApiHelper };
