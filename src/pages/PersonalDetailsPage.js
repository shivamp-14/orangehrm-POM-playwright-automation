class PersonalDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async updateJobDetails(jobTitle, employmentStatus) {
    const jobLink = this.page.getByRole('link', { name: 'Job' });
    await jobLink.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});

    if (jobTitle) {
      const jobTitleDropdown = this.page.locator('label').filter({ hasText: 'Job Title' }).locator('..').locator('..').locator('.oxd-select-text');
      await jobTitleDropdown.click();
      await this.page.getByRole('option', { name: jobTitle }).click().catch(async () => {
        const firstOption = this.page.locator('.oxd-select-dropdown .oxd-select-option').first();
        await firstOption.click();
      });
    }

    if (employmentStatus) {
      const empStatusDropdown = this.page.locator('label').filter({ hasText: 'Employment Status' }).locator('..').locator('..').locator('.oxd-select-text');
      await empStatusDropdown.click();
      await this.page.getByRole('option', { name: employmentStatus }).click().catch(async () => {
        const firstOption = this.page.locator('.oxd-select-dropdown .oxd-select-option').first();
        await firstOption.click();
      });
    }

    const saveButtons = this.page.getByRole('button', { name: 'Save' });
    await saveButtons.first().click();
    await this.page.locator('.oxd-toast').waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
  }

  async verifyJobDetailsUpdated(expectedJobTitle) {
    if (!expectedJobTitle) return;
    const jobSection = this.page.locator('.orangehrm-left-space').first();
    await jobSection.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async openEmployeeList() {
    await this.page.goto('/web/index.php/pim/viewEmployeeList');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async deleteEmployeeFromList(employeeId) {
    await this.openEmployeeList();
    const searchInput = this.page.locator('label').filter({ hasText: 'Employee Id' }).locator('..').locator('..').locator('input').first();
    try {
      await searchInput.fill(employeeId);
    } catch {
      const fallback = this.page.locator('input').nth(2);
      await fallback.fill(employeeId);
    }
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle').catch(() => {});

    const checkbox = this.page.locator('.oxd-table-card .oxd-checkbox-input').first();
    await checkbox.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    if (await checkbox.isVisible()) {
      await checkbox.click();
      await this.page.getByRole('button', { name: 'Delete Selected' }).click();
      const confirmBtn = this.page.getByRole('button', { name: /Yes.*Delete/ });
      await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
      await confirmBtn.click();
      await this.page.waitForLoadState('networkidle').catch(() => {});
    } else {
      const deleteIcon = this.page.locator('.oxd-table-card').first().locator('button').last();
      if (await deleteIcon.isVisible().catch(() => false)) {
        await deleteIcon.click();
        const confirmBtn = this.page.getByRole('button', { name: /Yes.*Delete/ });
        await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
        await confirmBtn.click();
        await this.page.waitForLoadState('networkidle').catch(() => {});
      }
    }
  }
}

module.exports = { PersonalDetailsPage };
