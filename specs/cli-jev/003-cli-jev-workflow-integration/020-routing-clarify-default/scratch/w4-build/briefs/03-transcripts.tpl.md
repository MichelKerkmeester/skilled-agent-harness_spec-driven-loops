@@PREAMBLE_CODE@@

TASK: add a `--transcripts <dir>` count to score-clarify-default.cjs, counts only and never text, plus two tests.

FILE 1 (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
a. New section `5. TRANSCRIPTS` between PROMPT SOURCES and CLI. Renumber the CLI divider to 6 and EXPORTS to 7. Change nothing else in the existing sections except the edits below.
b. CONSTANTS, append: `FRONT_DOOR_PATTERN = /\\*"hubId\\*"\s*:\s*\\*"([A-Za-z0-9_.-]+)\\*"\s*,\s*\\*"action\\*"\s*:\s*\\*"(route|clarify|defer|reject)\\*"/g` with a one-line comment: the front door prints `hubId` then `action`, and a transcript may hold that line JSON-escaped once or more, so any run of backslashes may precede a quote.
c. In TRANSCRIPTS, with JSDoc: `countTranscripts(dir)` returns `{ files, linesMatched, byHub, perFile }`. Walk `dir` recursively with `fs.readdirSync(cur, { withFileTypes: true })`, entering directories and reading only regular files (`isFile()`), sorted by path. For each file read utf8 and split on `\n`. For each line collect the distinct `hub + '\t' + action` pairs that `FRONT_DOOR_PATTERN` matches (reset `lastIndex`, or use `matchAll`). A line with at least one pair adds 1 to `linesMatched` and to that file's count, and adds 1 to `byHub[hub][action]` once per distinct pair, where `byHub[hub]` starts as `{ route: 0, clarify: 0, defer: 0, reject: 0 }`. `files` is the number of files read. `perFile` is `[{ file: <path relative to dir>, lines: <matched lines> }]` for every file read.
d. `transcriptLines(result)` returns string[]: `transcripts: files=<files> lines_matched=<linesMatched>`, then one `transcript hub=<hub> route=<> clarify=<> defer=<> reject=<>` per hub in sorted order, then `real clarify rate: <clarify total>/<all actions total>`.
e. CLI. `parseArgs` gains `transcripts: null` and the value flag `--transcripts <dir>`, with the same missing-value rule. `USAGE` becomes `usage: score-clarify-default.cjs [--report <dir>] [--rows-out <file>] [--transcripts <dir>]`. In `main`, right after `parseArgs` and before any census work: when `args.transcripts` is set and is not an existing directory, `err('error: --transcripts is not a directory: ' + args.transcripts)` and return 2. Replace the single `out('real clarify rate: not measured')` with: when `args.transcripts` is set, print every line of `transcriptLines(countTranscripts(args.transcripts))`; otherwise print `real clarify rate: not measured`. In `report.json`, `realClarifyRate` becomes `{ clarify, total }` when counted (null otherwise) and a `transcripts` key holds the whole count result (null otherwise).
f. EXPORTS gains `countTranscripts, transcriptLines`.

FILE 2 (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs. Add `const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path'); const { spawnSync } = require('node:child_process');` to the requires. Append two tests:
7. `countTranscripts counts each front-door line once, escaped or plain`: temp dir from `fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-tx-'))` holding `a.jsonl` with three lines: line 1 `{"hubId":"sk-doc","action":"clarify","selectionKind":null,"targets":[]}`; line 2 a JSON line whose string value holds the escaped front-door text twice: `JSON.stringify({ content: '{"hubId":"sk-code","action":"route"}', copy: '{"hubId":"sk-code","action":"route"}' })`; line 3 `{"note":"secret-prompt-text"}`. Expect `files 1`, `linesMatched 2`, `byHub['sk-doc'].clarify === 1`, `byHub['sk-code'].route === 1`, `perFile` deepEqual `[{ file: 'a.jsonl', lines: 2 }]`. Remove the temp dir at the end.
8. `the transcript count prints counts and no transcript text`: same temp dir content; `spawnSync(process.execPath, [<path to score-clarify-default.cjs>, '--transcripts', dir], { encoding: 'utf8' })`. Expect `status === 0`, stdout includes `transcripts: files=1 lines_matched=2` and `real clarify rate: 1/2`, and stdout does not include `secret-prompt-text` nor `real clarify rate: not measured`. Pass `{ timeout: 120000 }` to `test()`, since the command also runs the full census.

Accept when: 2 files changed, `node --check` passes on both, and `grep -c "^test(" <test file>` prints 8.

@@TAIL@@

Checks to run: `node --check` on both files, and `grep -c "^test(" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`.

@@HANDBACK@@
