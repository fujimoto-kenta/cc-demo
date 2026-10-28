import { test, expect } from '@playwright/test';
import { addTodos } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('TODOを追加できる', async ({ page }) => {
  await addTodos(page, '牛乳を買う', '本を読む');

  await expect(page.getByRole('listitem')).toHaveText(['牛乳を買う×', '本を読む×']);
  await expect(page.getByText('残り 2 件')).toBeVisible();
});

test('空白だけのTODOは追加されない', async ({ page }) => {
  await addTodos(page, '   ');

  await expect(page.getByRole('listitem')).toHaveCount(0);
});

test('完了にすると残り件数が減る', async ({ page }) => {
  await addTodos(page, '牛乳を買う', '本を読む');

  await page.getByRole('checkbox', { name: '牛乳を買う' }).check();

  await expect(page.getByText('残り 1 件')).toBeVisible();
});

test('TODOを削除できる', async ({ page }) => {
  await addTodos(page, '牛乳を買う', '本を読む');

  await page.getByRole('button', { name: '「牛乳を買う」を削除' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['本を読む×']);
});

test('フィルタで未完了・完了を切り替えられる', async ({ page }) => {
  await addTodos(page, '牛乳を買う', '本を読む');
  await page.getByRole('checkbox', { name: '牛乳を買う' }).check();

  await page.getByRole('button', { name: '未完了' }).click();
  await expect(page.getByRole('listitem')).toHaveText(['本を読む×']);

  await page.getByRole('button', { name: '完了', exact: true }).click();
  await expect(page.getByRole('listitem')).toHaveText(['牛乳を買う×']);

  await page.getByRole('button', { name: 'すべて' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(2);
});

test('完了済みをまとめて削除できる', async ({ page }) => {
  await addTodos(page, '牛乳を買う', '本を読む');
  await page.getByRole('checkbox', { name: '牛乳を買う' }).check();

  await page.getByRole('button', { name: '完了済みを削除' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['本を読む×']);
});

test('リロードしてもTODOが残る', async ({ page }) => {
  await addTodos(page, '牛乳を買う');
  await page.getByRole('checkbox', { name: '牛乳を買う' }).check();

  await page.reload();

  await expect(page.getByRole('checkbox', { name: '牛乳を買う' })).toBeChecked();
});
