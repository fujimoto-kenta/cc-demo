# 環境構築手順（参加者向け）

ハンズオン開始前に、ここまで済ませておくと当日スムーズです。所要時間は 15〜20 分ほどです。

## 0. 必要なもの

| 項目 | 内容 |
| --- | --- |
| アカウント | Claude の有料プラン（Pro / Max / Team / Enterprise）または Anthropic Console |
| OS | macOS / Linux / Windows（WSL2 推奨） |
| Node.js | 20 以上（`node -v` で確認） |
| git | 2.x（`git --version` で確認） |
| GitHub CLI | 任意。PR 作成のデモを手元で試すなら必要（`gh --version`） |

## 1. Claude Code をインストールする

どれか1つを実行します。

```bash
# macOS / Linux / WSL（推奨）
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Homebrew
brew install --cask claude-code

# npm（Node.js 22 以上）
npm install -g @anthropic-ai/claude-code
```

確認:

```bash
claude --version
claude doctor
```

## 2. ログインする

```bash
claude
```

初回はブラウザが開くのでログインします。終わったら `Ctrl+C` を2回押して終了します。

## 3. デモリポジトリを用意する

```bash
git clone https://github.com/fujimoto-kenta/cc-demo.git
cd cc-demo
npm ci
npx playwright install --with-deps chromium
npx @playwright/mcp@0.0.83 install-browser chrome-for-testing   # Playwright MCP 用のブラウザ
```

- `npm ci` は `.npmrc` の設定により、公開から3日未満のパッケージを拒否します。
- `--with-deps` は Linux / WSL で OS のライブラリも入れるため、sudo のパスワードを聞かれることがあります。

## 4. 動作確認

```bash
git switch demo/fixed      # 完成版のブランチ
npm start                  # http://localhost:3000 を開いて TODO アプリが動けば OK
npm run test:e2e           # 8 passed と出れば OK
git switch main            # ハンズオンは main から始める
```

## よくあるつまずき

| 症状 | 対処 |
| --- | --- |
| 許可済みのはずのコマンドで毎回確認される | そのフォルダで `claude` を対話起動し、「このフォルダを信頼する」を承認する。未承認だと `.claude/settings.json` の許可設定が無視される |
| `claude: command not found` | ターミナルを開き直す。それでも駄目なら `~/.local/bin` が PATH に入っているか確認 |
| ログイン画面が開かない（WSL） | 表示された URL を Windows 側のブラウザに貼り付ける |
| `npm ci` が `min-release-age` で失敗する | 公開直後の版を拾っている。`package-lock.json` を変更していないか確認 |
| Playwright MCP が `Browser "chrome-for-testing" is not installed` で失敗する | MCP はテストとは別版の Playwright を内蔵しているため、`npx @playwright/mcp@0.0.83 install-browser chrome-for-testing` を実行 |
| `Host system is missing dependencies` | `npx playwright install-deps chromium` を実行（sudo が必要） |
| `Error: http://localhost:3100 is already used` | 別のターミナルで起動中のテスト用サーバーを止める |
| `localhost:3000` が既に使われている | `PORT=3001 npm start` のように別ポートで起動する |
