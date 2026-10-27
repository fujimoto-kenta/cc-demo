---
name: test-report
description: E2E テストを実行し、結果を共有用の Artifact（Web ページ）にまとめる
disable-model-invocation: true
---

# テスト結果レポートを Artifact で作る

1. `npx playwright test --reporter=json > test-results/report.json` を実行する（失敗があっても止めずに次へ進む）
2. `test-results/report.json` を読み、次を集計する
   - 成功・失敗・スキップの件数と合計時間
   - テストごとの名前、結果、所要時間
   - 失敗したテストのエラーメッセージ（最初の数行）
3. 集計結果から、チームに共有できる1枚の Artifact を作って公開する
   - 一番上に「全体の結論」（例: 8件中8件成功）を大きく出す
   - テスト一覧の表（名前・結果・時間）
   - 失敗があれば、原因の見立てと次にやることを書く
   - 実行日時、ブランチ名（`git branch --show-current`）、コミット（`git rev-parse --short HEAD`）を載せる
4. 公開した URL をユーザーに伝える

$ARGUMENTS が渡された場合は、その内容（例: 「失敗だけ詳しく」）をレポートの方針に反映する。
