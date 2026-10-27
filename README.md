# cc-demo

Claude Code の使い方を紹介するためのデモリポジトリ。
シンプルな Web TODO アプリを Claude Code と一緒に作り、バグの発見から修正、PR 作成までの流れを見せる。

## ドキュメント

- [環境構築手順（参加者向け）](docs/setup.md)
- [デモ台本（発表者向け）](docs/demo-script.md)

## ブランチ

| ブランチ | 中身 |
| --- | --- |
| `main` | 土台のみ。ライブデモはここから TODO アプリを作る |
| `demo/buggy-app` | 完成した TODO アプリ（デモ用のバグ入り） |
| `demo/fixed` | バグ修正と回帰テスト入りの完成版 |

## クイックスタート

```bash
npm ci
npx playwright install --with-deps chromium
git switch demo/fixed
npm start            # http://localhost:3000
npm run test:e2e     # Playwright の E2E テスト
```

## Claude Code 向けの設定

| ファイル | 役割 |
| --- | --- |
| `CLAUDE.md` | プロジェクトのルールとコマンド。起動時に自動で読み込まれる |
| `.claude/settings.json` | 確認なしで実行してよいコマンド、読ませないファイルの設定 |
| `.claude/skills/run-e2e/SKILL.md` | E2E テストの実行と失敗調査の手順（Skill） |
| `.npmrc` | 公開から3日未満の npm パッケージを拒否、バージョン固定 |
