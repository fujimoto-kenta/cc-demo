// PostToolUse フック: 編集された .js / .mjs ファイルを node --check で構文チェックする。
// 構文エラーがあれば終了コード 2 で終わり、stderr の内容が Claude に伝わる。
import { spawnSync } from 'node:child_process';

let input = '';
for await (const chunk of process.stdin) input += chunk;

const filePath = JSON.parse(input).tool_input?.file_path ?? '';
if (!/\.(m?js)$/.test(filePath)) process.exit(0);

const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
if (result.status !== 0) {
  process.stderr.write(`構文エラーがあります: ${filePath}\n${result.stderr}`);
  process.exit(2);
}
