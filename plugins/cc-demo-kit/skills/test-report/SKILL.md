---
name: test-report
description: E2E テストを実行し、各テストの画面キャプチャ付きで結果を共有用の Artifact（Web ページ）にまとめる
disable-model-invocation: true
---

# テスト結果レポートを Artifact で作る（画面キャプチャ付き）

1. `npx playwright test` を実行する（失敗があっても止めずに次へ進む）
   - ユーザーが「画面を見せて」「headed で」と言った場合は `npx playwright test --headed` にする
   - 設定（`playwright.config.js`）で、全テストの最後の画面が `test-results/<テスト名>/test-finished-1.png`（失敗時は `test-failed-1.png`）に、結果が `test-results/results.json` に保存される
2. `test-results/results.json` を読み、次を集計する
   - 成功・失敗・スキップの件数と合計時間（`stats`）
   - テストごとの名前、結果、所要時間
   - 各テストの `attachments` のうち `name` が `screenshot` のもの（`path` が画像の場所）
   - 失敗したテストのエラーメッセージ（最初の数行）
3. 画像を Artifact と一緒に公開できるよう、スクラッチパッドの作業フォルダに `shots/01.png`, `shots/02.png` … と英数字の名前でコピーする（テスト名は日本語を含むため、そのままのパスは使わない）
4. 集計結果から、チームに共有できる1枚の Artifact を作る
   - 一番上に「全体の結論」（例: 15件中15件成功）を大きく出す
   - 実行日時、ブランチ名（`git branch --show-current`）、コミット（`git rev-parse --short HEAD`）を載せる
   - テストファイルごとに、テスト名・結果・時間と、そのテストの画面キャプチャを並べる（`<img src="shots/01.png">` のように相対パスで参照）
   - キャプチャは 1280×720 で下半分が空白になりやすいので、`aspect-ratio` と `object-fit: cover; object-position: top` で上側を見せ、クリックで原寸を開けるようにする
   - 失敗があれば、失敗したテストを先頭に出し、キャプチャとエラーメッセージを並べて、原因の見立てと次にやることを書く
5. Artifact ツールで公開する。画像は `files` に `{"shots/01.png": "<コピーした画像のパス>", …}` の形で渡す（data URI に埋め込まない）
6. 公開した URL をユーザーに伝える

$ARGUMENTS が渡された場合は、その内容（例: 「失敗だけ詳しく」）をレポートの方針に反映する。
