export async function addTodos(page, ...titles) {
  const input = page.getByLabel('新しいTODO');
  for (const title of titles) {
    await input.fill(title);
    await input.press('Enter');
  }
}
