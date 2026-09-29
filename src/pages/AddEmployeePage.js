const path = require('path');

class AddEmployeePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page.locator('label').filter({ hasText: 'Employee Id' }).locator('..').locator('..').locator('input');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.profileUpload = page.locator('input[type="file"]');
    this.successToast = page.locator('.oxd-toast');
  }

  async createEmployee({ firstName, lastName, employeeId, profileImagePath }) {
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);

    await this.employeeIdInput.waitFor({ state: 'visible' });
    await this.employeeIdInput.clear();
    await this.employeeIdInput.fill(employeeId);

    if (profileImagePath) {
      const absolutePath = path.resolve(profileImagePath);
      await this.profileUpload.setInputFiles(absolutePath);
      await this.page.waitForLoadState('networkidle').catch(() => {});
    }

    await this.saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.saveButton.click();
  }

  async verifyCreationSuccess() {
    await this.page.waitForURL('**/pim/viewPersonalDetails/**', { timeout: 45000 });
    await this.page.getByRole('heading', { name: 'Personal Details' }).waitFor({ state: 'visible' });
  }
}

module.exports = { AddEmployeePage };
