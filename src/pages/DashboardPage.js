class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
    this.pimMenu = page.getByRole('link', { name: 'PIM' });
  }

  async verifyDashboardVisible() {
    await this.dashboardHeader.waitFor({ state: 'visible' });
  }

  async navigateToPIM() {
    await this.pimMenu.click();
    await this.page.waitForURL('**/pim/viewEmployeeList');
  }
}

module.exports = { DashboardPage };
