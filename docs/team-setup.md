# チーム開発での運用構成（提案）

個人で試すだけなら `claude` を起動するだけで十分です。チームで使い続けるには、「誰が使っても同じ品質で動く」ための設定をリポジトリと組織の側に置くことが大切です。
このドキュメントは、その構成案と段階的な導入手順をまとめたものです。内容は 2026年10月時点の公式ドキュメントにもとづいています。

## 1. 全体像: 設定を置く4つの層

| 層 | 置き場所 | 中身 | 誰が管理 |
| --- | --- | --- | --- |
| 組織 | 管理者設定（managed settings）、社内プラグインマーケットプレイス | 禁止事項、使ってよい MCP、全員に配るプラグイン | 管理者 |
| リポジトリ | `CLAUDE.md`、`.claude/settings.json`、`.claude/skills/`、`.mcp.json` | そのプロジェクトのルール、許可するコマンド、手順書、つなぐツール | チーム（git で管理・レビュー） |
| 個人 | `~/.claude/CLAUDE.md`、`~/.claude/settings.json`、`CLAUDE.local.md` | 口調や言語の好み、個人用のショートカット | 各自 |
| CI | `.github/workflows/` | `@claude` で動く自動対応、PR の自動レビュー | チーム |

**原則**: チームで共有すべきもの（ルール・許可・手順）は必ずリポジトリに置き、PR でレビューする。個人の好みは個人の層に置き、リポジトリを汚さない。

## 2. SaaS と MCP をつないだ推奨構成

MCP は「Claude に外部サービスを道具として渡す仕組み」です。チーム開発でよく使う SaaS とつなぐと、情報を貼り付ける手間が消え、調査から修正、報告までを一続きで任せられます。

| 役割 | サービス例 | つなぎ方 | Claude ができるようになること |
| --- | --- | --- | --- |
| コード・Issue・PR | GitHub | `gh` CLI（推奨）または GitHub MCP | Issue を読んで直し PR を作る、レビューコメントに対応する |
| タスク管理 | Linear / Jira | 各社の公式 MCP（claude.ai のコネクタ一覧から追加） | チケットの要件を読んで実装、進捗を更新 |
| 仕様・議事録 | Notion / Confluence | Notion: `https://mcp.notion.com/mcp` | 仕様書を読んで実装、実装後にドキュメントを更新 |
| エラー監視 | Sentry | `https://mcp.sentry.dev/mcp` | スタックトレースから原因を調べて修正 |
| 連絡 | Slack | Claude in Slack（`/install-slack-app`） | Slack のスレッドから作業を依頼、結果を共有 |
| 画面の確認 | Playwright MCP | `.mcp.json`（このリポジトリに設定済み） | 実際にブラウザを操作して動作確認 |

追加コマンドの例:

```bash
# リモートの MCP サーバーを追加（--scope project で .mcp.json に書かれ、チームで共有される）
claude mcp add --transport http notion --scope project https://mcp.notion.com/mcp
claude mcp add --transport http sentry --scope project https://mcp.sentry.dev/mcp
```

追加したら、会話の中で `/mcp` を開いてブラウザでログイン（OAuth）します。**認証情報は各自のもの**なので、`.mcp.json` には URL だけを書き、トークンは書きません。

claude.ai の「コネクタ」で設定済みのサービスは、Claude Code からもそのまま使えます。チーム全員が claude.ai で同じコネクタを有効にしておくと、追加設定が要りません。

### この構成で回る一日の流れ（例）

1. Sentry にエラーが上がる
2. 開発者が `Sentry の最新エラーを調べて原因を特定し、直してPRを作って` と依頼する
3. Claude が Sentry のスタックトレースを読み、コードを調べて修正し、テストを追加して PR を作る
4. CI の E2E が走り、Claude の自動レビューが PR にコメントする
5. 人がレビューしてマージ。Claude に `Notion の障害記録に今回の原因と対応を追記して` と頼む

**人がやるのは「依頼」「判断」「承認」だけ**、という状態を目指します。

## 3. リポジトリに置くもの（チェックリスト）

- [ ] `CLAUDE.md` — 構成、主要コマンド（起動・テスト・lint）、守るべきルール。短く保つ（毎回読まれるのでコストに効く）
- [ ] `.claude/settings.json` — 確認なしで実行してよいコマンド（テスト、lint、`git status` など）と、読ませないファイル（`.env` など）
- [ ] `.claude/skills/` — チームの定型作業の手順書（リリース手順、障害調査の進め方など）
- [ ] `.mcp.json` — チームで使う MCP サーバー（URL のみ。トークンは書かない）
- [ ] E2E / ユニットテスト — Claude が「自分で確かめる」ための土台。テストがないと修正の正しさを判断できない
- [ ] `.npmrc` などの依存パッケージ方針 — 公開直後の版を避け、バージョンを固定する（このリポジトリでは `min-release-age=3`）

このリポジトリはすべて実例として入っているので、そのまま雛形にできます。

## 4. CI 連携（GitHub Actions）

### 4-1. `@claude` で動くようにする

Claude Code の中で次を実行すると、GitHub App のインストール、シークレットの登録、ワークフローの PR 作成までを案内してくれます（リポジトリの管理者権限と `gh` のログインが必要）。

```text
/install-github-app
```

設定後は、Issue や PR のコメントで次のように書くだけで Claude が作業します。

```text
@claude この Issue の内容で実装して PR を作って
@claude このレビューコメントに対応して
```

手動で設定する場合の最小構成:

```yaml
# .github/workflows/claude.yml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 4-2. 認証情報の選び方

| シークレット | 作り方 | 向いている場面 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Claude Console で API キーを発行 | チーム・組織で共有する。従量課金 |
| `CLAUDE_CODE_OAUTH_TOKEN` | 手元で `claude setup-token` | 個人のリポジトリ。サブスクリプションの枠を使う |

組織で共有する場合は、特定の個人に紐づく OAuth トークンではなく API キーを使います。

### 4-3. コストと暴走を抑える

- `claude_args: "--max-turns 10"` で1回あたりの作業量に上限を付ける
- ワークフローに `timeout-minutes` を付ける
- `CLAUDE.md` を短く保つ（毎回読まれる）
- `@claude` への依頼は具体的に書く（往復が減る）

## 5. Git 運用ルール

| ルール | 理由 |
| --- | --- |
| Claude の作業は必ずブランチで行い、`main` に直接コミットしない | 人のレビューを必ず通すため |
| 1つの依頼 = 1つのブランチ = 1つの PR | 差分が小さいほどレビューしやすく、巻き戻しも簡単 |
| PR は人がレビューしてからマージ。`/code-review` は補助として使う | 最終責任は人にある |
| こまめにコミットさせる | 途中で方針を変えても戻れる |
| 並行作業は `git worktree` で作業フォルダを分ける | 複数の Claude を同時に動かしても衝突しない |

## 6. セキュリティとデータの扱い

### 学習への利用

| プラン | 入力やコードがモデルの学習に使われるか |
| --- | --- |
| Free / Pro / Max（個人向け） | **設定次第**。claude.ai のプライバシー設定でオフにできる |
| Team / Enterprise / API（法人向け） | **使われない**（本人が明示的に提供を選んだ場合を除く） |

業務で使うなら Team / Enterprise か API を推奨します。保存期間などの詳細は [Data usage](https://code.claude.com/docs/en/data-usage) を参照してください。

### 事故を防ぐ設定

- **読ませない**: `.claude/settings.json` の `permissions.deny` に `Read(./.env)` や `Read(./secrets/**)` を入れる
- **やらせない**: 本番環境に触るコマンド（デプロイ、DB 操作）は `deny` に入れるか、確認必須のままにする
- **確認を全部飛ばさない**: `--dangerously-skip-permissions` は使い捨てのコンテナ以外で使わない
- **MCP とプラグインは中身を見てから入れる**: プラグインや MCP サーバーは自分の権限でコードを実行できる
- **依存パッケージ**: 公開直後の版を避ける（`min-release-age`）、`package-lock.json` をコミットする
- **組織で統制する**: managed settings で、使ってよい MCP やマーケットプレイスを制限できる

## 7. 段階的な導入プラン（提案）

| 時期 | やること | 完了の目安 |
| --- | --- | --- |
| 1週目 | 有志が個人で使う。このハンズオンを受ける | 小さなバグ修正を1件、Claude と一緒に PR にした |
| 2週目 | 対象リポジトリに `CLAUDE.md` と `.claude/settings.json` を入れる（`/init` から始める） | 誰が起動しても同じルールで動く |
| 3週目 | E2E テストと CI を整え、`/install-github-app` で `@claude` を使えるようにする | Issue から PR までを `@claude` で1件回した |
| 4週目 | よく使う手順を Skill にし、プラグインとして社内マーケットプレイスで配る。必要な MCP をつなぐ | 新メンバーが `/plugin install` だけで同じ環境を作れる |
| 以降 | `/insights` や `/usage` で使い方とコストを振り返り、CLAUDE.md や Skill を育てる | 月1回の振り返り |

## 参考リンク

- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions)
- [MCP](https://code.claude.com/docs/en/mcp)
- [Plugins](https://code.claude.com/docs/en/plugins)
- [Data usage](https://code.claude.com/docs/en/data-usage)
- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)
