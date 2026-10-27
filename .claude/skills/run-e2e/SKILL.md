---
name: run-e2e
description: E2E テストを実行し、失敗したら原因を調べて報告する。テストを流したいとき、変更後の動作確認をするとき、テスト失敗を調査するときに使う。
---

# E2E テストの実行と失敗調査

1. `npm run test:e2e` を実行する（サーバーは Playwright が自動起動する）
2. すべて成功したら、件数と所要時間を一言で報告して終わる
3. 失敗したら次の順に調べる
   - 出力のエラーメッセージと、失敗した行
   - `test-results/` 配下のスクリーンショット（失敗時は `test-failed-1.png`、成功時も `test-finished-1.png` が残る）を Read で見る
   - 必要なら `npx playwright show-trace test-results/<テスト名>/trace.zip` の手順をユーザーに案内する
4. 原因が「アプリのバグ」か「テストの誤り」かを判断して報告する。勝手にテストを緩めて通さない
