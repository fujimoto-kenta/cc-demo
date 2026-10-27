# cc-demo

Claude Code の使い方を紹介するためのデモリポジトリ。
シンプルな Web TODO アプリを Claude Code と一緒に作り、バグの発見から修正、PR 作成までの流れを見せる。

## ドキュメント

- [環境構築手順（参加者向け）](docs/setup.md)
- [デモ台本（発表者向け）](docs/demo-script.md) — バグ修正デモの詳しい台本
- [デモパターン集](docs/demo-patterns.md) — 9種類のデモと、聴き手に合わせた選び方
- [チーム開発での運用構成（提案）](docs/team-setup.md) — SaaS と MCP の連携、CI、Git 運用、セキュリティ

## ブランチ

| ブランチ | 中身 |
| --- | --- |
| `main` | 土台のみ。ライブデモはここから TODO アプリを作る |
| `demo/buggy-app` | 完成した TODO アプリ（デモ用のバグ入り） |
| `demo/fixed` | バグ修正と回帰テスト入りの完成版 |
| `demo/feature-due-date` | 完成版に期限日機能を追加したもの（新機能デモの参考実装） |

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
| `.claude/settings.json` | 返答の言語（日本語）、確認なしで実行してよいコマンド、読ませないファイルの設定 |
| `.claude/skills/run-e2e/SKILL.md` | E2E テストの実行と失敗調査の手順（Skill） |
| `.npmrc` | 公開から3日未満の npm パッケージを拒否、バージョン固定 |
| `.mcp.json` | Playwright MCP（Claude がブラウザを操作できるようにする）。初回起動時に承認が必要 |
| `plugins/cc-demo-kit/` | デモ用プラグイン（Skill・Subagent・Hook のセット） |
| `.claude-plugin/marketplace.json` | このリポジトリをプラグインのマーケットプレイスとして公開する定義 |

## デモ用プラグインのインストール

```text
/plugin install cc-demo-kit --marketplace fujimoto-kenta/cc-demo
```

インストールせずに試すときは `claude --plugin-dir ./plugins/cc-demo-kit` で起動する。
