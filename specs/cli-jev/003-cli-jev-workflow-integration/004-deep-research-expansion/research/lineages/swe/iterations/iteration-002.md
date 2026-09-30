# Iteration 002 — swe-02: R19's census as code: `score-compaction-recall.mjs` over the transcript format

- **Wave:** W1
- **Maps to:** RQ1, RQ2. Questions 25 and 30 (R19).
- **Executor:** cli-devin model=swe-2-max (inline, no dispatch)
- **Date:** 2025-12-02

## Focus Area

swe-02 — R19's census as code: `score-compaction-recall.mjs` over the transcript format. Translate the BASE R19 no-call census into a program over the real Claude transcript schema: the parser's record contract and stop rule, the vendored placeholder-state estimator, the must-survive rules as functions, the spot-check print shape, fixtures, and the LOC/location answer.

## Sources Read

- `TX/*.jsonl` under `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/` — two files sampled, record types and field names only; one file had 4 compact boundaries, another had 43; a third pass read assistant/user content-block types and tool names [SOURCE: transcript census, this session — counts and field names only]
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:117-178` (extractFilePaths, extractTopics, extractAttentionSignals), `:181-189` (detectSpecFolder), `:284-370` (buildMergedCompactResult → mergeCompactBrief), `:428-545` (stdin parse, `tailFile(transcript_path, 50)` at `:511`), `:105` (line split) [SOURCE: file]
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts:11-17` — `HOOK_TIMEOUT_MS = 1800`, `COMPACTION_TOKEN_BUDGET = 4000` [SOURCE: file]
- `R/jev-cli-main/src/vendor/compaction/state.ts:14-307` — `STATE_CONTEXT`, `INPUT_CHARS`, `estimateTokens`, `truncate`, `abridge`, `isPinned`, `collectToolCalls`, `inputText`, `resultNote`, `compactCall`, `mergeCallRuns`, `goalFromMessages`, `fitState` [SOURCE: file]
- `R/jev-cli-main/src/vendor/compaction/compact.ts:20-27` (DEFAULT_OPTIONS), `:76-102` (batchCalls), `:104-118` (decideCall), `:152-228` (applyDecisions), `:260-311` (compact) [SOURCE: file]
- `.skilled/skills/system-spec-kit/shared/compact-merger.ts` (exists; `mergeCompactBrief` imported at compact-inject.ts:20, called at `:350` over a `MergeInput` built solely from transcript lines at `:343-347`) [SOURCE: file]
- BASE R19 + proof plan [SOURCE: BASE]

## Findings

### Q1 — Record types and fields the parser needs; the unknown-shape stop rule

A census of two real transcripts (8,132 and ~110k records) produced this record-type inventory; every claim below is field-name level, no content read:

| record `type` | fields the parser consumes | role in census |
|---|---|---|
| `system` | `subtype`, `compactMetadata`, `uuid`, `timestamp` | `subtype=compact_boundary` marks a boundary; `compactMetadata` = `{trigger, preTokens, postTokens, cumulativeDroppedTokens, durationMs, preCompactDiscoveredTools[], preservedSegment{headUuid,anchorUuid,tailUuid}, preservedMessages{anchorUuid,uuids,allUuids}}` |
| `user` | `message{role,content}`, `isCompactSummary`, `isVisibleInTranscriptOnly`, `isSidechain`, `uuid`, `parentUuid`, `timestamp`, `cwd`, `gitBranch` | `content` = string or block array containing `tool_result` blocks `{tool_use_id,type,content,is_error}`; the stock summary is the first post-boundary user record with `isCompactSummary=true` |
| `assistant` | `message{role,content[]}`, `requestId`, `uuid`, `parentUuid`, `timestamp` | `content` blocks: `text{type,text}`, `thinking{type,thinking,signature}`, `tool_use{type,id,name,input,caller}`, `image`; 9,335 tool_use blocks observed, top names `Bash` 7,477, `Edit` 888, `Read` 444, `Write` 315 |
| `attachment` | `attachment{type,…type-specific}`, `uuid`, `timestamp`, `rendered` | attachment `type` census: `hook_additional_context{content,hookName,toolUseID,hookEvent}`, `async_hook_response{hookName,hookEvent,response,stdout,stderr,exitCode,processId}`, `instructions`, `session_context`, `date`, `compact_file_reference{filename,displayPath}`, plus ~20 other types (file, edited_text_file, invoked_skills, …) |
| `mode`, `permission-mode`, `atis-latch`, `queue-operation`, `file-history-snapshot`, `file-history-delta`, `last-prompt`, `cost-state`, `custom-title`, `agent-name`, `ai-title` | none | noise; skipped |

**Stop rule (matches BASE proof plan's "unknown record shape stops the run with a named error"):** `parseTranscript` keeps a `KNOWN_TYPES` whitelist initialized to the observed set. Per non-empty line: (a) `JSON.parse` failure → `malformed JSONL at <file>:<n>`; (b) `record.type` not a string or not in `KNOWN_TYPES` → `unknown record type "<t>" at <file>:<n>`; (c) for `user`/`assistant`/`system`/`attachment`, missing `uuid` or `timestamp`, or `message` absent on user/assistant → `missing field <f> on <type> at <file>:<n>`; (d) `system` + `compactMetadata` but `subtype!=="compact_boundary"` → flagged `compactMetadata on unexpected subtype` and stopped. Any of these aborts the whole run non-zero — a silently skipped bad record corrupts the recall denominator. The whitelist is deliberately closed: a new host record type must be seen once and adjudicated, not auto-skipped.

### Q2 — Placeholder-state size estimate, reusing the vendored estimator

The npm `jevctl`-style pass sends `CompactionState{context, goal, history[]}` (state.ts:204-208, `STATE_CONTEXT` text at :14-15). The census estimates its size with the vendored formula, verbatim, and sends nothing:

- `estimateTokens(text)` (state.ts:31-41): `TOKEN_PIECES = /[A-Za-z]+|\d+|[^\sA-Za-z\d]/g` (:22); digits cost `len/2`, word chars `1 + floor((len-1)/6)`, other symbols `0.9` each. Comment :24-30: calibrated 2–18% above true usage on real transcripts — the census reports it as an upper bound and keeps the estimate, never a tokenizer dependency.
- `fitState` staging (state.ts:198-307) is replayed as a pure function over mapped messages: full inputs (1000 chars) → 200 → 60 (`INPUT_CHARS` :18) → abridge long texts to 400-head/150-tail (`TEXT_HEAD`/`TEXT_TAIL` :19-20, `abridge` :47-51) → collapse old messages → compact old calls to one-liners (`compactCall` :113-123) → drop old call-less messages → merge call runs (`mergeCallRuns` :129-142) → throw `history too large for Jev` (:304-306). `entryTokens = estimateTokens(JSON.stringify(entry)) + 1` (:209), `baseTokens` = the empty-history envelope (:210).
- Record→`Message` map: `assistant` → `{role:'assistant', text: concat(text blocks), toolUses: [{tool_use_id:block.id, tool:block.name, input:block.input, text: linked result text, isError}]}`; `user` → `{role:'user', text, toolResults: tool_result blocks→{tool_use_id, text:content, isError:is_error}}`. `collectToolCalls` pairs on `tool_use_id` (state.ts:69-74); calls with no result are not candidates (:62-63). `thinking` blocks are excluded — the vendored `Message` shape has no field for them — and counted separately as `thinkingChars` so the bias is visible. `isPinned` = first message or within last `preserveRecentMessages` (state.ts:53-59; default 6 at compact.ts:23).
- Per boundary the census then reports: `estStateTokens`, `fitStage` (or `fitError`), `candidates` = unpinned calls, `estNouls` = 2 × candidates (`questionsFor` asks call+result, compact.ts:59-70), `estRequests` from `batchCalls` with budget `maxRequestTokens − stateTokens − 20` (compact.ts:81). This is the arm's cost estimate with zero calls. A `fitError` row is itself a finding: a real boundary whose state can't shrink under 25,000 tokens (`maxStateTokens`, compact.ts:24) means the arm would refuse rather than truncate.

### Q3 — Question 25: does the transcript record the injected PreCompact brief?

**No — confirmed at record level, and the negative is now load-bearing evidence.** Across 47 compact boundaries in two real files:

- Zero `attachment` records of type `hook_additional_context` or `async_hook_response` occur within 15 records after any boundary (one `Stop` async_hook_response at distance 28 after one boundary is a Stop-hook, unrelated).
- The `hookEvent` census across both files is `{SessionStart:1, PreToolUse, UserPromptSubmit, Stop}` — **no `PreCompact` event is ever recorded as an attachment**, consistent with the hook writing stdout that the host does not inject on PreCompact and caching for SessionStart instead (BASE R19).
- Post-boundary records are only: `attachment` {`instructions`, `session_context`, `date`} then `user` with `isCompactSummary=true`, `isVisibleInTranscriptOnly=true` (the host's summary, `turnOrigin=human`).

So the brief text exists nowhere in the transcript. Replaying `buildMergedCompactResult` needs **nothing the transcript lacks**: the hook feeds it `tailFile(input.transcript_path, 50)` (compact-inject.ts:511, raw JSONL lines split at :105), and `mergeInput = {codeGraph, triggered:'', sessionState}` (:343-347) is built entirely from those lines before `mergeCompactBrief` runs (:350) — a pure function over `(lines, COMPACTION_TOKEN_BUDGET, selection)`. Replay requirements: (a) the same raw file bytes (census already reads them), (b) the built `compact-merger.js`/`compact-inject` at matching version — a dependency on repo build state, noted, (c) one caveat: `tailFile(…,50)` truncates to the last 50 lines at hook time, so the census must replay per-boundary tails (the tail *at that boundary's file position*), not the file's end — otherwise the reconstructed brief is the wrong one. Diff `brief_sections vs summary` then gives the real recall delta R19 wants.

### Q4 — Must-survive rules as functions + fixtures, and the Q27 print shape

Each rule runs per boundary; inputs are field names and identifier/path *names* only — no sentence-level content is printed, satisfying the operator's numbers-and-names constraint.

1. `identifiersUsedAfterBoundary(recs, i)` — identifiers (regexes reused from compact-inject.ts:147-149 camelCase-func / PascalCase, plus path regex :118) that appear in pre-boundary text or tool inputs **and** recur in post-boundary text or tool inputs must appear in the summary record's content. Fixture `f-id.jsonl`: 8 records, identifier `mergeCompactBrief` in a pre tool_use input and a post text block; summary omits it → expect 1 violation.
2. `writtenFiles(recs, i)` — `input.file_path` of every pre-boundary `tool_use` with `name ∈ {Write, Edit}` must appear in the summary. Fixture `f-write.jsonl`: `Write` to `/x/goal.md` pre-boundary, summary without it → 1 violation. (Write×315, Edit×888 in the real census make this the highest-yield rule.)
3. `boundSpecFolder(recs, i)` — most-frequent `specs/[\w-]+` path pre-boundary (extractTopics regex :133) must appear in the summary. **Do not reuse `detectSpecFolder`**: its regex is `\.opencode\/specs\/` (:182) — it structurally cannot match this repo's `specs/` layout on Claude transcripts, so the live brief's "Active spec folder" line almost never populates on this surface (confirmed from code; a transcript could only satisfy it by literally discussing `.opencode/specs/`). Fixture `f-spec.jsonl`: `specs/pkt/spec.md` in user text, absent from summary → 1 violation.
4. `lastUserInstruction(recs, i)` — last pre-boundary `user` record with non-empty text, excluding tool_result-only and `isCompactSummary` records. **This rule is only partially supportable from fields**: "instruction preserved" is a content claim fields cannot verify; the census extracts that record's identifiers+paths and checks their survival as a proxy, printing `uncheckable` when the instruction carries none. This is a rule the recorded fields cannot fully support — noted as new information, and it caps what any no-Jev census can claim about intent preservation.
5. `preservedSegmentSanity(boundary)` — `compactMetadata.preservedMessages.uuids ⊆ allUuids ⊆ record uuids`, and `preTokens ≥ postTokens` — a pure field check that catches parser/host skew; 0 expected violations, cheap insurance.

**Q27 spot-check print shape** — per session: `file`, `boundary#`, `timestamp`, `trigger`, `preTokens→postTokens`; then one row per rule item: `rule=<name> item=<path-or-identifier> survived=yes|no|uncheckable`. The operator opens the transcript once, greps each `item`, and marks agree/disagree per row — no transcript text ever enters the report.

### Q5 — LOC, location, tests

Script lives at `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` — spec-kit owns `compact-inject.ts`; the dir mirrors `system-skill-advisor/runtime/scripts/routing-accuracy/` (R1's home). CLI: `--tx-dir <dir> --out <json> [--replay]`. It is a leaf script with no imports from `dist` at runtime except the optional `--replay` path importing built `compact-merger`/`compact-inject` (mirroring R1's eval-import caveat: import the built file, not the TS source).

| function | LOC (est.) |
|---|---|
| `parseTranscript` + `KNOWN_TYPES`/stop rule | 130 |
| `toMessages` record→Message map | 90 |
| `estimateTokens`/`truncate`/`abridge`/`fitState` port | 160 |
| `collectToolCalls` port | 40 |
| 5 must-survive rules | 120 |
| summary presence-check + report | 90 |
| `--replay` hook | 40 |
| main/CLI | 60 |
| **total** | **~730** + ~6 fixture files (~40 lines each) |

Tests (vitest, one file per repo convention): boundary+summary-missing-written-file → violation=1; unknown `type` → non-zero exit + named error; malformed JSONL line → non-zero exit + named error; **zero-compaction tx-dir → zero boundaries, empty report, exit 0** (not an error — a directory that never compacted is the null case); all-rules-satisfied → 0 violations; oversized synthetic → `fitError` recorded, census continues to next boundary.

## Ruled Out

- **Skimming only `compactMetadata` and ignoring the message records** — rejected: the must-survive rules and the estimator both need `user`/`assistant`/`tool_result` fields; metadata alone can't score recall.
- **A real tokenizer (e.g. `tiktoken`) for the state estimate** — rejected: adds a dependency for ±10% accuracy when the vendored estimator's known +2–18% bias is already documented (state.ts:24-30) and the census only needs feasibility, not billing.
- **Counting `thinking` blocks as message text in the estimator** — rejected: vendored `Message` has no thinking field; folding 7,156 thinking blocks in would inflate estimates untraceably. Counted as a separate diagnostic instead.
- **Treating a new record `type` as skip-with-warning** — rejected: the BASE proof plan's stop-on-unknown is what keeps the denominator honest; a silent skip path was explicitly ruled out.
- **Assuming the PreCompact brief is recoverable from `hook_additional_context` records** — disproved this iteration: no `PreCompact` hookEvent exists in 47 boundaries; brief reconstruction must replay `buildMergedCompactResult`.

## New Information

- **Q25 resolved negatively at record level**: 47/47 boundaries carry no injected-brief record; `hookEvent` inventory has no `PreCompact` — the brief-vs-summary comparison must be computed by replay, not read. `[SOURCE: TX census, this session]`
- **Replay feasibility**: `tailFile(path,50)` + pure `mergeCompactBrief` means the census reconstructs exactly what the hook would have built at each boundary — provided tails are taken at the boundary's file position. [SOURCE: compact-inject.ts:105,350,511]
- **`detectSpecFolder` is OpenCode-shaped**: `\.opencode\/specs\/` can never match this repo's `specs/` paths, so the live brief's spec-folder line is structurally dead on Claude transcripts; the census uses the `specs/[\w-]+` topics regex instead. [SOURCE: compact-inject.ts:133,182]
- **A must-survive rule the fields cannot support**: `lastUserInstruction` is only proxiable via identifier/path overlap — content preservation of intent is not field-decidable. [SOURCE: TX census field inventory]

## Metrics

- **newInfoRatio:** 0.92 — record-type census, Q25 negative answer, estimator port design, detectSpecFolder defect, and the unverifiable rule are all new; only the stop-on-unknown rule restates BASE.
- **Novelty justification:** converts R19's census from a description into a runnable program over 47 observed boundaries, and answers Q25 with record-level evidence rather than code inference.

## Sibling Check

- No swe sibling dependencies this iteration (W1). swe-01's convention (closed whitelist, named-error stop, leaf `.mjs` scripts under the owning skill's `runtime/scripts/`) is carried forward into the parser design.
