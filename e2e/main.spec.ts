import { test, expect, Page } from '@playwright/test'

const URL      = 'https://feodorm14-hue.github.io/math-tools/'
const USERNAME = 'admin'
const PASSWORD = 'math2026'

// ── helper ────────────────────────────────────────────────────────────────────
async function loginAs(page: Page, username = USERNAME, password = PASSWORD) {
  await page.locator('#authBtn').click()
  await page.locator('#login-username').fill(username)
  await page.locator('#login-input').fill(password)
  await page.locator('#login-btn').click()
  // wait for popup to close
  await expect(page.locator('#login-overlay')).toHaveClass(/hidden/)
}

test.beforeEach(async ({ page }) => {
  await page.goto(URL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

// ── базовые ──────────────────────────────────────────────────────────────────
test('страница загружается и показывает заголовок', async ({ page }) => {
  await expect(page).toHaveTitle(/Maths Instruments/)
  await expect(page.locator('h1')).toContainText('Maths Instruments')
})

test('кнопка Войти открывает попап', async ({ page }) => {
  await page.locator('#authBtn').click()
  await expect(page.locator('#login-overlay')).not.toHaveClass(/hidden/)
})

test('неверный пароль показывает ошибку', async ({ page }) => {
  await page.locator('#authBtn').click()
  await page.locator('#login-username').fill(USERNAME)
  await page.locator('#login-input').fill('wrongpass')
  await page.locator('#login-btn').click()
  await expect(page.locator('#login-error')).toContainText('Неверный пароль')
})

test('неверный логин показывает ошибку', async ({ page }) => {
  await page.locator('#authBtn').click()
  await page.locator('#login-username').fill('nobody')
  await page.locator('#login-input').fill(PASSWORD)
  await page.locator('#login-btn').click()
  await expect(page.locator('#login-error')).toContainText('Неверный логин')
})

test('верные логин+пароль закрывают попап и меняют кнопку', async ({ page }) => {
  await loginAs(page)
  await expect(page.locator('#authBtn')).toContainText('Выйти')
})

// ── доступ без авторизации ───────────────────────────────────────────────────
test('дроби доступны без авторизации', async ({ page }) => {
  await page.locator('.tab-btn[data-tab="fraction"]').click()
  await expect(page.locator('#tab-fraction')).toHaveClass(/active/)
})

test('геометрия доступна без авторизации', async ({ page }) => {
  await page.locator('.tab-btn[data-tab="geometry"]').click()
  await expect(page.locator('#tab-geometry')).toHaveClass(/active/)
})

// ── lock-prompt ───────────────────────────────────────────────────────────────
test('клик на закрытый раздел показывает lock-prompt', async ({ page }) => {
  await page.locator('.tab-btn[data-tab="proportion"]').click()
  await expect(page.locator('#lock-prompt')).not.toHaveClass(/hidden/)
  await expect(page.locator('#lock-prompt')).toContainText('Войти')
})

test('из lock-prompt открывается попап входа', async ({ page }) => {
  await page.locator('.tab-btn[data-tab="proportion"]').click()
  await page.locator('#lock-prompt-btn').click()
  await expect(page.locator('#login-overlay')).not.toHaveClass(/hidden/)
})

test('после входа пропорция доступна', async ({ page }) => {
  await loginAs(page)
  await page.locator('.tab-btn[data-tab="proportion"]').click()
  await expect(page.locator('#tab-proportion')).toHaveClass(/active/)
})

// ── калькуляторы ─────────────────────────────────────────────────────────────
test('дроби: 1/2 + 1/3 = 5/6', async ({ page }) => {
  await page.locator('.tab-btn[data-tab="fraction"]').click()
  await page.locator('#f-expr').fill('1/2 + 1/3')
  await page.locator('button', { hasText: 'Вычислить' }).click()
  await expect(page.locator('#f-result')).toContainText('5/6')
})

test('степени: 2^10 = 1024', async ({ page }) => {
  await page.locator('.tab-btn[data-tab="power"]').click()
  await page.locator('#pw2-base').fill('2')
  await page.locator('#pw2-exp').fill('10')
  // use visible button inside the power sub-panel
  await page.locator('#pow-power button:visible', { hasText: 'Считать' }).first().click()
  await expect(page.locator('#pw2-result')).toContainText('1024')
})

// ── мини-тест ────────────────────────────────────────────────────────────────
test('мини-тест запускается', async ({ page }) => {
  await page.locator('.tab-btn[data-tab="fraction"]').click()
  // click the mini-test button specifically inside #tab-fraction
  await page.locator('#tab-fraction button', { hasText: 'Мини-тест' }).first().click()
  await expect(page.locator('.test-counter')).toContainText('Вопрос 1 из 5')
})

// ── тема / выход ─────────────────────────────────────────────────────────────
test('тёмная тема переключается', async ({ page }) => {
  await page.locator('#darkToggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.locator('#darkToggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('выход сбрасывает авторизацию', async ({ page }) => {
  await loginAs(page)
  await page.locator('#authBtn').click()   // теперь это выход
  await expect(page.locator('#authBtn')).toContainText('Войти')
})
