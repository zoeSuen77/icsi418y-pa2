const { test, expect } = require('@playwright/test');
const { MongoClient } = require('mongodb');
const username = `ui_test_${Date.now()}`;

test.afterAll(async () => {
  const client = new MongoClient('mongodb://127.0.0.1:27018');
  try { await client.connect(); await client.db('pa2').collection('users').deleteOne({ username }); }
  finally { await client.close(); }
});

test('signup, database storage, duplicates, invalid login, and successful login', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Please fill in');
  async function fillSignup() {
    await page.getByLabel('First name', { exact: true }).fill('Alex');
    await page.getByLabel('Last name', { exact: true }).fill('Chen');
    await page.getByLabel('Username', { exact: true }).fill(username);
    await page.getByLabel('Password', { exact: true }).fill('DemoPass123!');
  }
  await fillSignup();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Account created successfully');
  const client = await new MongoClient('mongodb://127.0.0.1:27018').connect();
  try {
    const saved = await client.db('pa2').collection('users').findOne({ username });
    expect(saved.f_name).toBe('Alex');
    expect(saved.password).toMatch(/^scrypt\$/);
  } finally { await client.close(); }
  await fillSignup();
  await page.getByRole('button', { name: 'Create account', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('already taken');
  await page.getByRole('navigation').getByRole('button', { name: 'Log in', exact: true }).click();
  const submitLogin = page.getByRole('form', { name: 'Login' }).getByRole('button', { name: 'Log in', exact: true });
  await submitLogin.click();
  await expect(page.getByRole('alert')).toContainText('Please enter');
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Password', { exact: true }).fill('wrong');
  await submitLogin.click();
  await expect(page.getByRole('alert')).toContainText('Incorrect username or password');
  await page.getByLabel('Password', { exact: true }).fill('DemoPass123!');
  await submitLogin.click();
  await expect(page.getByRole('status')).toContainText('Login successful. Welcome back, Alex!');
  expect(errors).toEqual([]);
});

test('a failed network request shows feedback and enables retry', async ({ page }) => {
  await page.route('**/login', (route) => route.abort());
  await page.goto('/');
  await page.getByLabel('Username', { exact: true }).fill('offline');
  await page.getByLabel('Password', { exact: true }).fill('demo');
  const submit = page.getByRole('form').getByRole('button', { name: 'Log in', exact: true });
  await submit.click();
  await expect(page.getByRole('alert')).toContainText('Could not connect to the server');
  await expect(submit).toBeEnabled();
});

test('server errors appear in the form', async ({ page }) => {
  await page.route('**/login', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'A server or database error occurred. Please try again shortly.' }) }));
  await page.goto('/');
  await page.getByLabel('Username', { exact: true }).fill('demo');
  await page.getByLabel('Password', { exact: true }).fill('demo');
  await page.getByRole('form').getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('server or database error');
});

test('password visibility can be toggled without submitting', async ({ page }) => {
  await page.goto('/');
  const password = page.getByLabel('Password', { exact: true });
  await password.fill('private');
  await page.getByRole('button', { name: 'Show password' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(password).toHaveAttribute('type', 'password');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('both forms fit a mobile viewport without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Sign up', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Create an account.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
