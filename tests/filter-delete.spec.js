import { test, expect } from '@playwright/test';

// 回帰テスト: フィルタ表示中に削除すると、別のTODOが消えていた
test('「未完了」フィルタ中に削除すると、押したTODOだけが消える', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel('新しいTODO');
  for (const title of ['牛乳を買う', '本を読む', '散歩する']) {
    await input.fill(title);
    await input.press('Enter');
  }
  await page.getByRole('checkbox', { name: '牛乳を買う' }).check();
  await page.getByRole('button', { name: '未完了' }).click();

  await page.getByRole('button', { name: '「散歩する」を削除' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['本を読む×']);
  await page.getByRole('button', { name: 'すべて' }).click();
  await expect(page.getByRole('listitem')).toHaveText(['牛乳を買う×', '本を読む×']);
});
