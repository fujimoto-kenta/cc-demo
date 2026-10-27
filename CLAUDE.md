# cc-demo

Claude Code の使い方を紹介するためのデモ用 TODO アプリ。

## 構成

- `public/` — アプリ本体（HTML / CSS / JavaScript のみ。フレームワーク・ビルド不要）
- `server.mjs` — 依存なしの静的サーバー（`npm start` → http://localhost:3000）
- `tests/` — Playwright の E2E テスト
- `docs/` — 環境構築手順とデモ台本

## コマンド

- `npm start` — アプリを起動
- `npm run test:e2e` — E2E テスト（サーバーは自動起動、ポート 3100）
- `npm run test:e2e:headed` — ブラウザを表示してテスト

## ルール

- アプリは素の JavaScript で書く。フレームワークやビルドツールを追加しない
- npm パッケージは公開から3日以上経った版を固定バージョンで入れる（`.npmrc` で強制済み）
- 機能を追加・修正したら E2E テストも追加し、`npm run test:e2e` が通ることを確認する
- 要素の取得は `getByRole` / `getByLabel` を優先し、CSS セレクタに頼らない
