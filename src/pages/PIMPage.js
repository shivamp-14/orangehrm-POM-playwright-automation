class PIMPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.employeeListHeader = page.getByRole('heading', { name: 'Employee Information' });
  }

  async clickAddEmployee() {
    await this.addButton.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await this.addButton.click();
    await this.page.waitForURL('**/pim/addEmployee');
  }

  async searchByEmployeeId(employeeId) {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    const empIdInput = this.page.locator('label').filter({ hasText: 'Employee Id' }).locator('..').locator('..').locator('input').first();
    const idInputFallback = this.page.locator('input').nth(2);
    try {
      await empIdInput.fill(employeeId);
    } catch (e) {
      try {
        await idInputFallback.fill(employeeId);
      } catch {
        console.log('Warning: Could not fill employee ID, skipping search');
      }
    }
    const searchButton = this.page.getByRole('button', { name: 'Search' });
    await searchButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async getFirstResultRow() {
    return this.page.locator('.oxd-table-row').nth(1);
  }

  async verifyEmployeePresent(employeeId) {
    const row = this.page.locator(`.oxd-table-card:has-text("${employeeId}")`);
    await row.waitFor({ state: 'visible', timeout: 10000 });
    return row;
  }

  async verifyEmployeeNotPresent(employeeId) {
    const noRecords = this.page.getByText('No Records Found');
    const row = this.page.locator('.oxd-table-card').filter({ hasText: employeeId });

    await this.page.waitForLoadState('networkidle').catch(() => {});
    const rowCount = await row.count();
    if (rowCount === 0) return true;

    try {
      await noRecords.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return (await row.count()) === 0;
    }
  }

  async waitForTableReady() {
    await this.page.locator('.oxd-table-body').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }
}

module.exports = { PIMPage };
