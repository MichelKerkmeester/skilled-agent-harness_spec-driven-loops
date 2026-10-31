# Compaction recall census: build contract (read only)

S = `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs`
T = `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts`
F = `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall-fixtures/` (six synthetic `.jsonl` files)

## 1. File conventions

- S is an ES module run as `node S ...`. Line 1 `#!/usr/bin/env node`, then the header
  `// ` + 67 x `─` / `// MODULE: Compaction Recall Census` / `// ` + 67 x `─`, then two comment lines:
  `// Scores what host compactions keep, from transcripts the operator names, with zero model calls.` and
  `// The report holds counts, scores, labels, file basenames, boundary uuids and line numbers, never transcript text.`
- Numbered section dividers: `// ` + 77 x `─`, `// N. NAME`, `// ` + 77 x `─`. Sections in order:
  1. IMPORTS, 2. CONSTANTS, 3. ESTIMATOR PORT, 4. MESSAGES AND REDUCTION, 5. MUST-SURVIVE RULES,
  6. TRANSCRIPT PARSER, 7. SESSION SELECTION, 8. REPORT, 9. MAIN.
- Imports only from `node:fs`, `node:path`, `node:url`, `node:util`. Never import `node:child_process`; S spawns nothing.
- camelCase functions, UPPER_SNAKE constants, single quotes, JSDoc on every export, WHY comments only.
- Export every function named in this contract. Run `main(process.argv.slice(2))` only when S is the entry
  script: `if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))`, then
  `process.exitCode = await main(...)`.

## 2. CLI

`parseArgs` from `node:util`, `strict: true`, `allowPositionals: false`. Options: `transcripts` (string, multiple),
`out` (string), `newest-compacted` (string), `replay` (boolean), `max-file-bytes` (string). Checks in this order,
each printing one line to stderr and returning exit 2 before any transcript is read:
1. parseArgs throws: `usage error: <error.message>`.
2. no `--transcripts`: `no transcripts named`.
3. no `--out`: `no report path named`.
4. `--newest-compacted` or `--max-file-bytes` not a positive integer: `invalid --newest-compacted` / `invalid --max-file-bytes`.
5. a named path that does not exist: `transcripts path not found`.
6. `--out` inside any named transcript directory: `refused: report path inside transcript directory`. Compare every
   pair of D in { resolve(dir), realpathSync(dir) } and O in { resolve(out), realOut }, where realOut is
   `realpathSync` of the nearest existing ancestor of `resolve(out)` joined with the rest of the path (symlinks such
   as `/tmp` on macOS must not hide the match). Inside when `relative(D, O)` is `''`, or does not start with `..`
   and is not absolute. A named file (not a directory) is checked against its parent directory.
Default `--max-file-bytes` is `1073741824`.

## 3. Discovery and parser

- Without `--newest-compacted`: each named file is read; each named directory contributes every `*.jsonl`
  under it, recursively, sorted by full path. A file is a subagent file when its path relative to the named
  directory has a `subagents` segment; every other file is a main-session file.
- A file larger than `--max-file-bytes` is never opened: push `{ file: basename, bytes }` to `skippedOversized`.
- `async function* splitLines(file, byteLimit)`: `createReadStream(file, { start: 0, end: byteLimit - 1 })`
  when byteLimit > 0 (yield nothing when 0); split the bytes on 0x0A only (never `readline`, which also breaks at
  U+2028); strip one trailing 0x0D; yield `{ line, text, terminated }` with 1-based line numbers counting every
  line; the last piece has `terminated: false` and is yielded only when non-empty.
- `parseTranscript(file, options)` reads the file up to the size it had when stat'ed. For each yielded line:
  empty text is skipped; an unterminated last line that fails `JSON.parse` sets `partialTail: true` and is not
  an error; otherwise a line that fails `JSON.parse` is error `not_json` / message `not JSON`; a value that is
  not an object or has no string `type` is `missing_field` / `missing field type`; a `type` not in KNOWN_TYPES is
  `unknown_type` / `unknown type <type>` when the type is under 40 characters and matches `^[a-z-]+$`, else
  `unknown type (label withheld)`; a record with `type` `system` and `subtype` `compact_boundary` whose
  `compactMetadata` is not a plain object is `missing_field` / `missing field compactMetadata`, and one whose
  `uuid` is not a string is `missing_field` / `missing field uuid`.
- The first error stops the file: return `{ error: { line, code, message }, boundariesSeen }` and no rows.
  main prints `parse error: <basename>:<line>: <message>` to stderr and counts the file in `sessions_stopped`.
- KNOWN_TYPES, a frozen Set: `agent-name`, `ai-title`, `artifact-autoreact-ledger`, `artifact-comment-monitor`,
  `assistant`, `atis-latch`, `attachment`, `bridge-session`, `cost-state`, `custom-title`, `file-history-delta`,
  `file-history-snapshot`, `frame-link`, `history-suppression`, `last-prompt`, `mode`, `permission-mode`,
  `pr-link`, `queue-operation`, `system`, `user`.
- A boundary is a record with `type` `system`, `subtype` `compact_boundary` and `compactMetadata`. Base row fields:
  `file` (basename), `uuid`, `line`, `trigger` (`auto` or `manual`, else `other`), `isSidechain` (`=== true`),
  `entrypoint` (one of `cli`, `sdk-cli`, `sdk-ts`, `sdk-py`, `claude-vscode`, `claude-desktop`, `mcp`, else
  `other`), `preTokens`, `postTokens`, `durationMs` (finite numbers from `compactMetadata`, else null).

## 4. Output

stdout, in order: the METHOD line
`method: parsed JSON records with type=system, subtype=compact_boundary and compactMetadata present`;
`scope: <a> main-session files, <b> subagent files, <c> boundaries (<d> main, <e> subagent)` counting the files
in the census (every file read, or the selected files under `--newest-compacted`) and the rows;
the `selection:` line only under `--newest-compacted`; one `row ` line per boundary; one `totals:` line; the stop
line last. Row line: `row <file> line=<line> uuid=<uuid> trigger=<t> sidechain=<bool> entrypoint=<e> pre=<n>
post=<n> ms=<n>` followed by ` <key>=<value>` for each later column the contract adds, in the order added.
null prints `n/a`. Totals line: `totals: compactions=<rows> sessions_read=<n> sessions_stopped=<n>
sessions_skipped_oversized=<n> partial_tails=<n>` followed by later totals in the order added.
The JSON report written to `--out` (parent dirs created, `JSON.stringify(report, null, 2) + '\n'`):
`{ method, scope: { mainFiles, subagentFiles, boundaries, mainBoundaries, subagentBoundaries }, selection:
{ newest, read } | null, rows: [...], totals: {...}, stoppedSessions: [{ file, line, code }],
skippedOversized: [{ file, bytes }], stop }`. Exit 1 when any session stopped or the census is void, else 0.

## 5. Stop line, checked in order

1. `sessions_read > 0` and `2 * sessions_stopped > sessions_read`: `stop: census void (unknown shape in <stopped> of <read> sessions)`.
2. the string guard fails (section 11): `stop: census void (free text in report)`.
3. zero rows: `stop: no boundaries`.
4. `stop: arm not built (fit_throws=<x>, offline_reduction_upper_bound=<y>, kept_tokens_ratio=<z>)` when x >= 0.50,
   or y is not null and y < 0.25, or z is not null and z > 3.
5. otherwise `stop: arm may be specified (...)` with the same three fields.
x = rows with `fitStage` `fit_throw` over all rows; y = median `offlineReduction` over rows whose `fitStage` is not
`fit_throw`; z = median non-null `keptTokensRatio` over the same rows. Each prints with `toFixed(2)`, null as `n/a`.
Rows not yet carrying a fit column count as fitted with null reduction and ratio.

## 6. Fit and reduction

V = `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main` (vendored npm `jevctl` 0.2.3).
- Section 3 ports `V/src/vendor/compaction/state.ts` lines 14-307 to JavaScript: STATE_CONTEXT, INPUT_CHARS,
  TEXT_HEAD, TEXT_TAIL, TOKEN_PIECES, estimateTokens, truncate, abridge, isPinned, collectToolCalls, inputText,
  resultNote, compactCall, mergeCallRuns, callsByMessage, historyEntries, goalFromMessages, fitState. Drop the
  types, keep every string, number and branch identical. Also port `truncatedResultText` from
  `V/src/vendor/compaction/compact.ts:138-144` with its note text unchanged. Put this comment at the top of the
  section: `// Ported from npm jevctl 0.2.3, src/vendor/compaction/state.ts and compact.ts (vendored there from`
  `// fast-jev-compaction), MIT license. Types dropped; logic unchanged so the fit matches the vendored procedure.`
- Constants from `V/src/vendor/compaction/compact.ts:20-27`: MAX_STATE_TOKENS 25000, PRESERVE_RECENT_MESSAGES 6,
  TRUNCATE_HEAD_CHARS 300.
- Section 4 `toMessage(record)`: port of `sessionRecordToMessage` and `blockText` from `V/src/core/transcript.ts:26-80`.
- At each boundary, messages = `toMessage` of every `user` and `assistant` record since the previous boundary or
  the file start (nulls dropped); calls = `collectToolCalls(messages, 6)`; `fitState(messages, calls,
  { maxStateTokens: 25000, preserveRecentMessages: 6, goal: '' })` gives `fitStage` = stage and `fitTokens` =
  tokens; a throw gives `fitStage` `fit_throw` and `fitTokens` null, and the census goes on. Host `preTokens` is
  never compared with 25000.
- `offlineReductionUpperBound(messages, calls, headChars = 300)`: unpinned = tool_use_id of every call whose
  `pinned` is false. Per message: estimateTokens(text) + estimateTokens(JSON.stringify(input)) per tool use +
  estimateTokens(result text) per tool result, where the truncated pass replaces an unpinned result's text with
  `truncatedResultText(text, isError, headChars)`. Returns `{ untruncated, truncated, reduction }`, reduction =
  untruncated === 0 ? 0 : 1 - truncated / untruncated. No model, prose untouched.
- Row fields in order: `fitStage`, `fitTokens`, then `untruncatedTokens`, `keptTokens` (= truncated),
  `offlineReduction`, `keptTokensRatio` (keptTokens / postTokens when postTokens > 0, else null).
  Printed: `fit=<stage with spaces as _>`, `fit_tokens=`, then `reduction=<toFixed(4)>`, `kept=`, `kept_ratio=<toFixed(2)>`.
  Totals: `fit_throws=<count>`.

## 7. Recorded brief and stock summary

- Window = the 30 records after the boundary record (every parsed record counts, whatever its type).
- Summary = the first `user` record in the window with `isCompactSummary === true`; its text is
  `message.content` when a string, else the `text` of its text blocks joined with `\n`.
- Candidates = window records with `type` `attachment` and `attachment.hookName === 'SessionStart:compact'`.
  Several hooks answer that event, so the brief is the first candidate whose `attachment.type` is `hook_success`
  and whose `attachment.command` is a string containing `session-prime`. Its text = `attachment.content` when a
  string, else `attachment.stdout` when a string, else `''`.
- Recorded: `briefStatus` `recorded`, `briefWindowStatus` `hook_success`, `briefMarker` =
  text includes `Recovered Context (Post-Compaction)`, `briefChars` = text length.
- No brief: `briefStatus` `absent`; `briefWindowStatus` = the `attachment.type` of the first candidate that is not
  `hook_success` when it is `hook_cancelled` or `hook_non_blocking_error`, `other` for any other type, `none` when
  no candidate is a non-success; `briefMarker` and `briefChars` null.
- Row fields in order: `summaryPresent`, `briefStatus`, `briefWindowStatus`, `briefMarker`, `briefChars`.
  Printed: `summary=`, `brief=`, `brief_window=`, `marker=`, `brief_chars=`. Totals: `briefs_recorded`,
  `briefs_absent`, `markers`. Summary and brief text stay in memory for section 8 only and never enter a row.

## 8. Must-survive rules (counts only)

- `identifiers(text)`: Set of matches of `/[A-Za-z_][A-Za-z0-9_]{3,}/g` that hold a letter and either an
  underscore or a match of `/[a-z0-9][A-Z]/`. `stringLeaves(value)`: every string nested in an object or array
  (keys excluded). Pre-segment text units: each pre-segment message's text, the string leaves of each tool input
  and each tool result text.
- Rule 1 items: identifiers from `assistant` records after the boundary up to the next boundary or end of file
  (their text blocks and the string leaves of their tool_use inputs) that are also identifiers of the
  pre-segment text units. Kept by a keeper when the item is in `identifiers(keeperText)`.
- Rule 2 items: distinct basenames of `input.file_path`, or `input.notebook_path`, of tool uses named `Write`,
  `Edit`, `MultiEdit` or `NotebookEdit` in the pre segment. Kept when keeperText includes the basename.
- Rule 3 item: the most frequent match (ties to the one seen last) of
  `/specs\/[a-z0-9][a-z0-9._-]*\/[0-9]{3}-[a-z0-9._-]+(?:\/[0-9]{3}-[a-z0-9._-]+)*/g` over the pre-segment
  text units; the item is its last `/` segment; no match, no item. Kept when keeperText includes it.
- Rule 4 items: `identifiers` of the last user instruction before the boundary: the text of the last `user`
  record earlier in the file (not reset at a boundary) that is not `isCompactSummary`, not `isMeta`, and whose
  content is a string or holds a text block and no tool_result block. No items: `uncheckable`.
- Rule 5: `compactMetadata.preservedSegment` not an object gives `absent`; `ok` when `headUuid`, `anchorUuid` and
  `tailUuid` are strings that are each the `uuid` of a record in the same file (checked at end of file); else `fail`.
- Row fields in order: `r1Found`, `r1Summary`, `r1Brief`, `r2Found`, `r2Summary`, `r2Brief`, `r3Found`,
  `r3Summary`, `r3Brief`, `r4Found`, `r4Summary`, `r4Brief`, `uncheckable`, `r5`, `summaryRecall`, `briefRecall`,
  `violations`. The `*Brief` counts are null when there is no brief text; the three r4 counts are null and
  `uncheckable` is 1 when rule 4 is uncheckable, else 0. summaryRecall = kept / found summed over rules 1 to 4
  (rule 4 left out when uncheckable), null when found sums to 0; briefRecall the same, null without brief text.
  violations = sum over rules 1 to 4 of (found - summary kept) plus 1 when r5 is `fail`. No summary: kept 0.
- Printed: `r1=<found>/<summary>/<brief>` (null as n/a) for r1 to r3, `r4=` the same or `uncheckable`, `r5=`,
  `summary_recall=<toFixed(2)>`, `brief_recall=`, `violations=`. Totals: `summary_recall_avg` and
  `brief_recall_avg` (means of non-null values, toFixed(2), else n/a), `uncheckable` and `violations` (sums).

## 9. Replay (`--replay`, off by default)

- At start, before any transcript is read: DIST = `resolve(<dir of S>, '../../dist/hooks/claude/compact-inject.js')`;
  `await import(pathToFileURL(DIST).href)`; on a failed import or no `buildMergedCompactResult` function print
  `replay unavailable: build the runtime dist first` to stderr and return 2. REPLAY_VERSION =
  `Math.trunc(statSync(DIST).mtimeMs)`.
- The parser keeps the raw text of the last 50 non-empty lines before each boundary line. A boundary with no
  recorded brief gets `(await buildMergedCompactResult(lines)).text` as its brief text: `briefStatus` `replayed`,
  `briefWindowStatus` unchanged, `briefMarker` null (the marker is added at injection), `briefChars` = its length.
  A recorded brief is never replayed. Row field `replayVersion`: REPLAY_VERSION on replayed rows, else null.
  Printed: `replay_version=`. Totals: `briefs_replayed`.

## 10. Selection (`--newest-compacted <n>`)

- Every named path must be a directory, else stderr `--newest-compacted needs a directory` and exit 2.
- Candidates: entries directly in each directory (`readdirSync(dir, { withFileTypes: true })`) that are files
  named `*.jsonl`, each stat'ed once, ordered by `mtimeMs` descending, then name ascending. No subdirectory is read.
- Walk them and stop opening candidates once n are selected. An oversized candidate is skipped and counted, never
  read. Every other candidate is parsed (read + 1, bounded by the size from its stat): an error before its first
  boundary counts it stopped and gives it no place; an error after its first boundary counts it stopped and takes
  a place with no rows; no error and at least one row selects it; no error and no row leaves it out.
- After the scope line print `selection: newest <selected> compacted main-session files by modification time,
  <read> read`; report `selection: { newest: <selected>, read: <read> }`. The scope line counts the selected files.

## 11. String guard

Before anything is printed or written, walk every string value of the report object (keys excluded). A string
is allowed when it is a fixed label (the METHOD line, the eight vendored stage names, `fit_throw`, `auto`,
`manual`, `other`, the entrypoint list, `recorded`, `absent`, `replayed`, `hook_success`, `hook_cancelled`,
`hook_non_blocking_error`, `none`, `ok`, `fail`, `absent`, `not_json`, `unknown_type`, `missing_field`), the
basename of a file this run listed (read, stopped or skipped as oversized), a uuid matching `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`,
or a stop line of section 5. Any other string: print only `stop: census void (free text in report)`, write no
report, return 1.
