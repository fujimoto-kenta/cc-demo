import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // json はテスト結果の Artifact 作成用（スクリーンショットのパスも入る）
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
    // 成功したテストも最後の画面を残し、レポートに載せられるようにする
    screenshot: 'on',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // テスト実行時にアプリを自動で起動する
  webServer: {
    command: 'npm start',
    url: `http://localhost:${port}/healthz`,
    env: { PORT: String(port) },
    reuseExistingServer: !process.env.CI,
  },
});
