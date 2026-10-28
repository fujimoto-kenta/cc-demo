# cc-demo

Claude Code の使い方を紹介するためのデモ用 TODO アプリ。

## 構成

- `public/` — アプリ本体（HTML / CSS / JavaScript のみ。フレームワーク・ビルド不要）
- `server.mjs` — 依存なしの静的サーバー（`npm start` → http://localhost:3000）
- `tests/` — Playwright の E2E テスト
- `docs/` — 環境構築手順、デモ台本、デモパターン集、チーム運用の提案

## ブランチ

- `main` — 土台のみ。`public/` はない（ライブデモでここから作る）
- `demo/buggy-app` — 完成版。**わざと入れたバグ**（フィルタ中の削除で別の TODO が消える）があるので、頼まれない限り直さない
- `demo/fixed` — バグ修正と回帰テスト入り
- `demo/feature-due-date` — 期限日機能の参考実装
- `main` を更新したら、デモ用ブランチを順に（buggy-app → fixed → feature-due-date）`main` の上へリベースし、`git push --force-with-lease` で更新する

## コマンド

- `npm start` — アプリを起動
- `npm run test:e2e` — E2E テスト（サーバーは自動起動、ポート 3100）
- `npm run test:e2e:headed` — ブラウザを表示してテスト
- `npm run test:e2e:ui` — Playwright の UI モード
- スクリーンショットとトレースは `test-results/` に出る

## ルール

- アプリは素の JavaScript で書く。フレームワークやビルドツールを追加しない
- npm パッケージは公開から3日以上経った版を固定バージョンで入れる（`.npmrc` で強制済み）
- 機能を追加・修正したら E2E テストも追加し、`npm run test:e2e` が通ることを確認する
- 要素の取得は `getByRole` / `getByLabel` を優先し、CSS セレクタに頼らない
- Skill は `.claude/skills/` と `plugins/cc-demo-kit/skills/` に同じものがある。直すときは両方そろえる
- 機能やコマンドを変えたら `README.md` と `docs/` の記述も直す
- ドキュメントは日本語、コミットメッセージは英語で書く
