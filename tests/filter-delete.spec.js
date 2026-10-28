import { test, expect } from '@playwright/test';
import { addTodos } from './helpers.js';

// 回帰テスト: フィルタ表示中に削除すると、別のTODOが消えていた
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('「未完了」フィルタ中に削除すると、押したTODOだけが消える', async ({ page }) => {
  await addTodos(page, '牛乳を買う', '本を読む', '散歩する');
  await page.getByRole('checkbox', { name: '牛乳を買う' }).check();
  await page.getByRole('button', { name: '未完了' }).click();

  await page.getByRole('button', { name: '「散歩する」を削除' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['本を読む×']);
  await page.getByRole('button', { name: 'すべて' }).click();
  await expect(page.getByRole('listitem')).toHaveText(['牛乳を買う×', '本を読む×']);

  // 保存された内容も正しいこと
  await page.reload();
  await expect(page.getByRole('listitem')).toHaveText(['牛乳を買う×', '本を読む×']);
});

test('「完了」フィルタ中に削除すると、押したTODOだけが消える', async ({ page }) => {
  await addTodos(page, '牛乳を買う', '本を読む', '散歩する');
  await page.getByRole('checkbox', { name: '本を読む' }).check();
  await page.getByRole('checkbox', { name: '散歩する' }).check();
  await page.getByRole('button', { name: '完了', exact: true }).click();

  await page.getByRole('button', { name: '「散歩する」を削除' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['本を読む×']);
  await page.getByRole('button', { name: 'すべて' }).click();
  await expect(page.getByRole('listitem')).toHaveText(['牛乳を買う×', '本を読む×']);

  await page.reload();
  await expect(page.getByRole('listitem')).toHaveText(['牛乳を買う×', '本を読む×']);
});
