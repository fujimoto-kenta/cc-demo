import { test, expect } from '@playwright/test';

// 「今日」がいつかで結果が変わるので、タイムゾーンと時計を固定する
test.use({ timezoneId: 'Asia/Tokyo', colorScheme: 'light' });

const DANGER = 'rgb(220, 38, 38)';

async function addTodo(page, title, due) {
  await page.getByLabel('新しいTODO').fill(title);
  if (due) await page.getByLabel('期限日').fill(due);
  await page.getByRole('button', { name: '追加' }).click();
}

function todoItem(page, title) {
  return page.getByRole('listitem').filter({ hasText: title });
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-28T10:00:00+09:00'));
  await page.goto('/');
});

test('期限日を付けてTODOを追加すると一覧に表示される', async ({ page }) => {
  await addTodo(page, '牛乳を買う', '2026-10-30');

  await expect(todoItem(page, '牛乳を買う')).toHaveText('牛乳を買う期限 2026/10/30×');
  await expect(page.getByText('期限 2026/10/30')).not.toHaveCSS('color', DANGER);
  await expect(page.getByRole('checkbox', { name: '牛乳を買う' })).toBeVisible();
});

test('期限日は任意で、追加後は入力欄が空に戻る', async ({ page }) => {
  await addTodo(page, '本を読む');
  await addTodo(page, '牛乳を買う', '2026-10-30');

  await expect(page.getByRole('listitem')).toHaveText(['本を読む×', '牛乳を買う期限 2026/10/30×']);
  await expect(page.getByLabel('期限日')).toHaveValue('');
});

test('期限切れの未完了TODOは赤く強調される', async ({ page }) => {
  await addTodo(page, '牛乳を買う', '2026-10-27');

  const due = page.getByText('期限 2026/10/27（期限切れ）');
  await expect(due).toBeVisible();
  await expect(due).toHaveCSS('color', DANGER);
  await expect(todoItem(page, '牛乳を買う').getByText('牛乳を買う', { exact: true })).toHaveCSS('color', DANGER);
});

test('期限が今日のTODOは期限切れにならない', async ({ page }) => {
  await addTodo(page, '牛乳を買う', '2026-10-28');

  await expect(todoItem(page, '牛乳を買う')).toHaveText('牛乳を買う期限 2026/10/28×');
  await expect(page.getByText('期限 2026/10/28')).not.toHaveCSS('color', DANGER);
});

test('完了済みのTODOは期限が過ぎていても強調されない', async ({ page }) => {
  await addTodo(page, '牛乳を買う', '2026-10-27');

  await page.getByRole('checkbox', { name: '牛乳を買う' }).check();

  await expect(todoItem(page, '牛乳を買う')).toHaveText('牛乳を買う期限 2026/10/27×');
  await expect(page.getByText('期限 2026/10/27')).not.toHaveCSS('color', DANGER);
});

test('日付が変わると期限切れとして表示される', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-28T23:59:00+09:00'));
  await page.reload();
  await addTodo(page, '牛乳を買う', '2026-10-28');
  await expect(page.getByText('期限 2026/10/28')).toBeVisible();
  await expect(page.getByText('（期限切れ）')).toHaveCount(0);

  await page.clock.setFixedTime(new Date('2026-10-29T00:01:00+09:00'));
  await page.reload();

  await expect(page.getByText('期限 2026/10/28（期限切れ）')).toHaveCSS('color', DANGER);
});

test('期限日はリロードしても残る', async ({ page }) => {
  await addTodo(page, '牛乳を買う', '2026-10-30');

  await page.reload();

  await expect(page.getByText('期限 2026/10/30')).toBeVisible();
});
