class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginSuccess() {
    await this.dashboardHeader.waitFor({ state: 'visible', timeout: 15000 });
  }

  async logout() {
    const userDropdown = this.page.locator('.oxd-userdropdown-tab');
    await userDropdown.click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await this.page.waitForURL('**/auth/login');
  }

  async verifyLogout() {
    await this.page.waitForURL('**/auth/login');
    const loginBtn = this.page.getByRole('button', { name: 'Login' });
    await loginBtn.waitFor({ state: 'visible' });
  }
}

module.exports = { LoginPage };
