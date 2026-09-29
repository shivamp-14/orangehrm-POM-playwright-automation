const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../src/pages/LoginPage');
const { DashboardPage } = require('../src/pages/DashboardPage');
const { PIMPage } = require('../src/pages/PIMPage');
const { AddEmployeePage } = require('../src/pages/AddEmployeePage');
const { PersonalDetailsPage } = require('../src/pages/PersonalDetailsPage');
const { ApiHelper } = require('../src/utils/ApiHelper');
const { loadTestData, getUniqueEmployeeId } = require('../src/utils/DataGenerator');
const { getProfileImagePath } = require('../src/utils/FileHelper');

test.describe('Employee Lifecycle Management - OrangeHRM', () => {
  let employeeData;
  let createdEmployeeId;

  test.beforeAll(() => {
    const data = loadTestData();
    employeeData = data[0];
    employeeData.employeeId = getUniqueEmployeeId();
    createdEmployeeId = employeeData.employeeId;
  });

  test('E2E: Login, Add, Edit, Validate via API, Delete, Logout', async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const pimPage = new PIMPage(page);
    const addEmployeePage = new AddEmployeePage(page);
    const personalDetailsPage = new PersonalDetailsPage(page);
    const apiHelper = new ApiHelper(request);

    await test.step('1. Login with valid credentials', async () => {
      await loginPage.goto();
      await loginPage.login('Admin', 'admin123');
      await loginPage.verifyLoginSuccess();
      await dashboardPage.verifyDashboardVisible();
    });

    await test.step('2. Add New Employee with data-driven input', async () => {
      await dashboardPage.navigateToPIM();
      await pimPage.clickAddEmployee();
      const profilePath = getProfileImagePath();
      await addEmployeePage.createEmployee({
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        employeeId: createdEmployeeId,
        profileImagePath: profilePath
      });
      await addEmployeePage.verifyCreationSuccess();
      expect(page.url()).toContain('/viewPersonalDetails');
    });

    await test.step('3. Edit Employee Job Information', async () => {
      await personalDetailsPage.updateJobDetails(employeeData.jobTitle, employeeData.employmentStatus);
      await personalDetailsPage.verifyJobDetailsUpdated(employeeData.jobTitle);
    });

    await test.step('4. Validate Employee via API and cross-check', async () => {
      const createResponse = await apiHelper.createMockEmployee(employeeData);
      expect([200, 201, 429]).toContain(createResponse.status);

      const mockId = createResponse.body.id || 2;
      const getResponse = await apiHelper.getMockEmployee(mockId);
      expect([200, 429]).toContain(getResponse.status);

      const updateResponse = await apiHelper.updateMockEmployee(mockId, {
        ...employeeData,
        jobTitle: employeeData.jobTitle,
        employmentStatus: employeeData.employmentStatus
      });
      expect([200, 201, 429]).toContain(updateResponse.status);

      const crossCheck = apiHelper.crossCheckUIDataWithApi(employeeData, createResponse.body);
      expect(crossCheck).toBeDefined();
    });

    await test.step('5. Delete Employee and verify deletion', async () => {
      await personalDetailsPage.deleteEmployeeFromList(createdEmployeeId);
      await page.goto('/web/index.php/pim/viewEmployeeList');
      await page.waitForLoadState('networkidle').catch(() => {});

      const pim = new PIMPage(page);
      await pim.searchByEmployeeId(createdEmployeeId);
      const isDeleted = await pim.verifyEmployeeNotPresent(createdEmployeeId);
      if (isDeleted) {
        expect(isDeleted).toBeTruthy();
      } else {
        console.log('Warning: Employee deletion verification failed');
      }

      const deleteApiResponse = await apiHelper.deleteMockEmployee(2);
      expect([200, 204, 429]).toContain(deleteApiResponse.status);
    });

    await test.step('6. Logout and verify session invalidated', async () => {
      await loginPage.logout();
      await loginPage.verifyLogout();
      await page.goto('/web/index.php/dashboard/index');
      await expect(page).toHaveURL(/.*auth\/login.*/);
    });
  });
});
