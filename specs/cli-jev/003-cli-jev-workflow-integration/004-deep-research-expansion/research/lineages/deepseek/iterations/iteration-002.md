---
title: "Iteration 2 — deepseek-02: The compaction seams: the function-hook budget and the transcript after a compact boundary"
trigger_phrases: []
---

# Iteration 2 — deepseek-02: The compaction seams

## Focus

Angle **deepseek-02** (W1): *The compaction seams: the function-hook budget and the transcript after a compact boundary (questions 18 and 25).* Maps to RQ2; answers angle questions 1 to 5. All record shapes below were read this iteration from the operator's transcripts — counts, lengths and field names only, never text. No round-2 sibling file was read (W1).

## Actions Taken

1. Read `.claude/settings.json` env and PreCompact blocks; confirmed `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS: "1"` at `:38` and the PreCompact command hook at `:215-222` (3 s timeout).
2. Ran `command -v claude` and `claude --version` (not a Jev call): installed Claude Code is **2.1.283** at `~/.local/share/claude/versions/2.1.283` (225 MB Mach-O arm64; `~/.local/bin/claude` symlinks to it; versions 2.1.280–2.1.283 are present).
3. Read the vendored `claude-code.d.ts` at the cited ranges (`:2337-2356`, `:3018-3030`, `:3315-3325`, `:3793-3822`, `:7278-7292`, `:10170-10185`) and grepped all `budget` mentions.
4. Read `fast-jev.ts` whole (305 lines): the version note at `:9-10`, defaults at `:26-31`, key resolution at `:237-253`, the `session.compact` handler at `:269-287` and the auto-compact handler at `:289-303`.
5. Read `compact-inject.ts:260-520`: the merge builder `:284-370`, the cache write `:404-421`, the deadline `:494`, the tail read `:511`.
6. Probed one transcript (`00ef27e6-….jsonl`, 14,868 records) with a read-only Node one-liner: record-type histogram, the compact boundary record shape, the records around each boundary, attachment-type histograms, and which records carry the brief's marker strings. Field names, record types and lengths only.
7. Attempted a context extraction of budget phrases from the installed binary (`grep -a -o -E` with surrounding bytes); it timed out after 180 s on the 225 MB Mach-O and was abandoned. The count-level probes (`grep -a -c`) did complete.

## Findings

**F1 (new; answers angle question 1's version half). The vendored type reference describes Claude Code 2.1.274 and says to regenerate it after upgrades; the installed binary is 2.1.283.** `fast-jev.ts:9-10`: "The checked-in type reference in ./types/claude-code.d.ts was written by Claude Code 2.1.274; regenerate with /plugin-types after upgrades." `claude --version` prints `2.1.283 (Claude Code)`. The types are therefore at least four patch releases stale against the installed host, and any budget or trigger semantics read from them carry that gap. [SOURCE: context/external repo's/jev-cli-main/plugin/hooks/fast-jev.ts:9-10; `claude --version` run this iteration]

**F2 (new; answers angle question 1's budget half). No production budget for `session.compact` is stated anywhere readable.** The only number on record remains the test-clock text at `claude-code.d.ts:10177-10178` — "one held past a hook's budget (ten seconds of real time) is let go, as a hook that overran" — and it is prose about the in-memory test clock, not a per-event production deadline. The failure type carries `budget: number` as "the handler's own grace" (`:3799-3818`), i.e. the runtime supplies it and no constant is documented per event. A count-level grep of the installed 2.1.283 binary found "its budget" twice, "overrun" nine times and `session.compact` seventeen times, but the context extraction timed out and nothing readable came out of it; the binary may embed minified or compressed copies of its docs. Production value: **UNKNOWN.** What would resolve it: a hook API reference for 2.1.28x, or one timed stub-hook run in a disposable session. [SOURCE: claude-code.d.ts:10177-10178, :3799-3818; grep counts on the installed binary; BASE open question 18]

**F3 (new; answers angle question 2). On throw, overrun or a malformed result the hook is skipped and core runs in its place; for `session.compact` core is the stock summary.** `claude-code.d.ts:3024-3026`: "a hook that fails (throws, overruns its budget, answers a wrong shape) is skipped: the hooks beneath and core run in its place, or its last `next` result stands; the failure is reported, naming it." The vendored hook implements the same shape at its own level: below the 25% minimum reduction it notifies and calls `next(event)` (`fast-jev.ts:277-280`), and any throw — including the no-key throw from `compactSession` at `:189` — is caught and falls back with `next(event)` (`:283-286`). So an overrun costs up to the hook's budget of wait before the stock summary runs; whether the stock summary "still runs in time" after that wait is a host scheduling question no local evidence answers. [SOURCE: claude-code.d.ts:3024-3026; fast-jev.ts:189, :277-286]

**F4 (new; answers angle question 3, question 25). The records around a compact boundary, from a 14,868-record transcript:**

| Position | Record | Subtype / key fields |
|---|---|---|
| boundary | `system` | `subtype: "compact_boundary"`; `compactMetadata` keys: `trigger`, `preTokens`, `postTokens`, `cumulativeDroppedTokens`, `durationMs`, `preCompactDiscoveredTools`, `preservedSegment`, `preservedMessages` |
| +1 | `user` | `isCompactSummary: true` — the host's own summary as a user record |
| +13 | `attachment` | `attachment.type: "hook_success"`, `hookEvent: "SessionStart"`, `hookName: "SessionStart:compact"`; fields `content`, `stdout` (identical, 2,335 chars in this sample, 3 `##` headings), `exitCode`, `durationMs`, `command` |

The `command` recorded on that attachment resolves to `node .opencode/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js` — the SessionStart hook that injects the cached brief. Both compactions in the file show the same pattern (two `compact_boundary` records, two SessionStart:compact attachments, each at +13). [SOURCE: transcript `00ef27e6-….jsonl` record census this iteration; record types and field names only]

**F5 (new; answers angle question 25 directly). The injected brief IS recorded — in the SessionStart:compact hook attachment's `stdout`/`content`, not in any PreCompact record.** The brief's marker strings (`hook-cache`, `## Recovered Context` — the anti-feedback guards at `compact-inject.ts:53-59`) appear twice in the whole file, both inside `hook_success`/`SessionStart`/`SessionStart:compact` attachments, both at +13 after a boundary. No record of the file carries `hookEvent: "PreCompact"`: the whole-file `hook_success` histogram is SessionStart 13, PreToolUse 1,607, PostToolUse 2,081, PostToolUseFailure 13, Stop 162. So the transcript records the **injection**, not the PreCompact cache write. Consequence for R19's brief column: read the recorded attachment first; replay `buildMergedCompactResult` only for what the attachment does not hold (the pre-truncation merged text). BASE's brief column asked "if the transcript does not record the injected brief (UNKNOWN), replay" — the record does exist, so the replay becomes a fallback. [SOURCE: transcript census this iteration; compact-inject.ts:53-59; BASE R19 record]

**F6 (confirms BASE with new evidence). `compactMetadata` carries three more fields than BASE listed, and the parser spec should name the record's own type/subtype.** BASE named `durationMs`, `preTokens`, `postTokens`, `trigger`, `cumulativeDroppedTokens` and `preservedSegment` "and others". The full key set read today adds `preCompactDiscoveredTools` and `preservedMessages`, and the record is `type: "system", subtype: "compact_boundary"`. This matters for R19's "unknown record shape stops the run" rule: the shape is identifiable by that pair, and the two extra fields are candidate must-survive inputs (`preservedMessages` names what the host kept). [SOURCE: transcript census this iteration; BASE R19 record]

**F7 (new). A `precompute` dispatch exists exactly so a pass can run before the compaction, and it installs nothing.** `claude-code.d.ts:7283-7287`: "`precompute` is the one dispatch that installs nothing: its result is kept for the compaction that comes, if the conversation it ran over still leads." The hook registers on `session.compact` with the trigger and can decline with `{ skip: reason }` (`:3320-3322`). Egress cost when the compaction never happens: the run's state send still happened and its result is discarded; how often the engine fires precompute relative to actual compactions is UNKNOWN from the types. If a live R19 form ever uses it, the ratio of precompute runs to compactions is the egress multiplier to measure first. [SOURCE: claude-code.d.ts:7283-7287, :3320-3322]

**F8 (confirms BASE with new evidence). The vendored hook's key resolution order is options → environment → settings `env`, read outside any gate.** `getApiKey` (`fast-jev.ts:237-253`): `config.apiKey`, then `$.env.get('TYPESAFE_API_KEY')`, then `$.settings.read()` and `env['TYPESAFE_API_KEY']`. The function-hook API hands the plugin an env accessor and a settings reader, which is why the npm package's own docs recommend the settings `env` placement; the key is read regardless of the D5 gate, as BASE row 6 and row 43 already hold. [SOURCE: fast-jev.ts:237-253; BASE rows 6 and 43]

**F9 (confirms BASE with new evidence). The vendored auto-compact at 60% runs through `turn.complete`, not a timer.** `fast-jev.ts:289-303`: on `turn.complete`, if `compactAtPercent > 0` and `$.session.usage()` reports `context.percent >= 60`, it calls `$.session.compact()`, guarded by an in-flight flag. The compaction it triggers then runs through the `session.compact` handler above, so it inherits the budget and fallback path. BASE's "auto-compacts at 60% unless `compactAtPercent` is 0" is confirmed with the exact hook. [SOURCE: fast-jev.ts:289-303; BASE section 6 item 4]

**F10 (confirms BASE with new evidence). The repository brief's replay inputs are transcript-only, and one input is already known to be gone.** `buildMergedCompactResult` (`compact-inject.ts:284-370`) takes transcript lines, strips recovered lines (`:287`), extracts file paths, topics, attention signals and the spec folder, builds recent context from non-`{` tail lines (`:317-322`), and merges with the 4000-token budget (`:350`, `shared.ts:14`). The final cache write stores `pendingCompactPrime.payload` (`:404-420`). The comment at `:291-293` records that the structural-status half of the session-state slot "came from a graph index that no longer exists", so a replay reproduces today's brief pipeline, not a historical one. The tail read is the last 50 lines (`:511`). [SOURCE: compact-inject.ts:284-370, :404-420, :511; shared.ts:14]

**F11 (new). Hook executions are recorded as `attachment` records with a typed vocabulary, which is what makes a zero-call census possible at all.** Whole-file attachment types include `hook_success` (3,876), `hook_additional_context` (723), `async_hook_response` (80), `hook_cancelled` (6), `compact_file_reference` (4) and non-hook types such as `total_tokens_reminder` (931). SessionStart injected content is recorded as `hook_success` `stdout`, not as `hook_additional_context` (that type's histogram is UserPromptSubmit and PreToolUse only). [SOURCE: transcript census this iteration]

## Per-Idea Records

### R19's census, brief column revised: read the recorded injection first, replay second

- **Idea:** R19 (census, build-now) as BASE records it, with its brief column's unknown resolved: the census parses `system/compact_boundary` + `compactMetadata` for cost and fit, the following `user/isCompactSummary` record for the stock summary, and the `hook_success` `SessionStart:compact` attachment's `stdout` for the injected brief. Type: `noul` deferred; the census itself is counting.
- **Builds on:** BASE R19 record and proof plan; angle questions 3 and 4.
- **Value:** The operator's fourth idea (compaction) gains a measurable recall pair — host summary vs injected brief — on the same events, with zero calls and zero egress.
- **Seam:** `.claude/settings.json:215-222` (the PreCompact command), `compact-inject.ts:1-8` (cache, not inject), `:284-370` (merge builder), `:404-420` (cache write), `:494`, `:511`. Record shapes: `system/compact_boundary` + `compactMetadata{trigger,preTokens,postTokens,cumulativeDroppedTokens,durationMs,preCompactDiscoveredTools,preservedSegment,preservedMessages}`; `user/isCompactSummary`; `attachment/hook_success` `SessionStart:compact` `stdout`.
- **Metric, baseline, harness:** Per compaction: wall time, pre/post tokens, 25,000-token fit estimate (unchanged), stock-summary recall, **recorded-brief length, heading count and noise share** (sample: 2,335 chars, 3 headings), and rule-derived must-survive recall against both. Harness: the R19 census script (proposed `score-compaction-recall.mjs`); no new harness needed for the brief column now.
- **Cost, latency, privacy:** Zero calls; reads a transcript directory only; no text in output.
- **Key gate and no-key behavior:** Census needs no key and never spawns `jev`; the D5 wording is unchanged. The later Jev arm keeps R19's flag and skip lines.
- **Rough LOC:** Net reduction against BASE: the brief-replay path becomes a fallback (~20 LOC deferred), so the census stays 200–300 LOC.
- **Verdict:** **build-now for the census (unchanged), with the brief column simplified.** The one change: read-first, replay-only-if-absent.
- **Confidence:** Record shapes confirmed from one transcript (2 compactions); "both show the pattern" is a count. That every compaction carries it is inferred — the census itself will count coverage across sessions.

### N-deepseek-02-1: The census's parser contract names the three record shapes and fails loudly on drift

- **Idea:** Write R19's parser contract as an explicit three-shape allowlist — `system/compact_boundary` (with its key set), `user/isCompactSummary` (summary column), `attachment/hook_success` filtered by `hookEvent: SessionStart` and `hookName: SessionStart:compact` (brief column) — and stop the run on any other compact-adjacent record shape, as BASE's Q8 boundary requires. Type: contract text plus ~30 LOC of guards.
- **Builds on:** BASE R19 "unknown record shape stops the run"; F4/F5/F6.
- **Value:** The census cannot silently under-read a host format that changes; a future Claude Code rename fails visibly instead of printing zeros.
- **Seam:** R19's census script (proposed) — no repo file edits.
- **Metric, baseline, harness:** Baseline: the shapes are UNKNOWN in BASE. Metric: on a fixture directory containing one well-formed and one mutated boundary record, the run stops with the mutated record's type named.
- **Cost, latency, privacy:** Zero.
- **Key gate and no-key behavior:** Unchanged; this is the unkeyed path.
- **Rough LOC:** ~30 LOC.
- **Verdict:** **next** (fold into 005 when written).
- **Confidence:** Shapes confirmed; the guard's design is proposed.

### N-deepseek-02-2: If a live R19 form is ever built, `precompute` is the only off-critical-path dispatch, with the egress multiplier as its kill criterion

- **Idea:** The function-hook deadline (F2) makes a live Jev pass risky; the `precompute` trigger is the one dispatch that runs ahead of the compaction and installs nothing (F7). Record it as the candidate shape for a live form, not a build. Type: `run`.
- **Builds on:** Angle question 4; d.ts `:3320-3322`, `:7283-7287`.
- **Value:** A Jev pass would not sit inside the compaction wait; its cost is speculative calls when no compaction follows.
- **Seam:** `fast-jev.ts:269-287` shows the on-`session.compact` handler shape the engine accepts; the trigger option is the variation.
- **Metric, baseline, harness:** Metric: precompute runs ÷ compactions, and the egress of discarded runs. Baseline: UNKNOWN. Harness: none exists; requires a disposable timed session.
- **Cost, latency, privacy:** One fitted-state send per precompute run, results discarded if the conversation changes; highest payload class.
- **Key gate and no-key behavior:** Behind R19's flag and D5 gate if ever built; with no key, hook absent and host summary unchanged.
- **Rough LOC:** UNKNOWN until the trigger's cadence is known.
- **Verdict:** **later,** conditional on the census clearing its stop boundary and the deadline becoming known.
- **Confidence:** Trigger semantics confirmed from the type docs; cadence UNKNOWN.

### Dropped: reading the PreCompact hook's own record from the transcript

- **Idea:** parse the PreCompact execution (its cache write) directly from the transcript as the brief source.
- **Verdict:** **drop.** No `hook_success` record carries `hookEvent: PreCompact` in the sampled file (whole-file histogram), and `compact-inject.ts:8` says stdout is not injected; the observable artifact is the SessionStart:compact injection (F5). [SOURCE: transcript census; compact-inject.ts:8]

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| The record after a boundary is `system/compact_boundary`; summary is `user/isCompactSummary`; brief is `attachment/hook_success` SessionStart:compact | new (resolves the brief-column UNKNOWN) | transcript census |
| The injected brief is recorded, 2,335 chars in the sample, at +13 after both boundaries | new | transcript census |
| `compactMetadata` adds `preCompactDiscoveredTools` and `preservedMessages` | confirms BASE with new evidence | transcript census; BASE R19 |
| No PreCompact `hook_success` record exists; the transcript records the injection | new | transcript census; `compact-inject.ts:8` |
| The vendored types describe 2.1.274; installed host is 2.1.283 | new | fast-jev.ts:9-10; `claude --version` |
| No production budget for `session.compact` is readable; ten seconds is test-clock prose | confirms BASE's UNKNOWN with new evidence; binary context probe timed out | claude-code.d.ts:10177-10178 |
| Overrun/throw/malformed → hook skipped, core runs; vendored hook falls back via `next(event)` | confirms BASE with new evidence | claude-code.d.ts:3024-3026; fast-jev.ts:277-286 |
| `precompute` installs nothing and its result is kept for the coming compaction | new | claude-code.d.ts:7283-7287 |
| Key resolution: options → env → settings `env` | confirms BASE rows 6/43 with exact order | fast-jev.ts:237-253 |
| Auto-compact at 60% runs on `turn.complete` via `session.usage()` | confirms BASE with the exact hook | fast-jev.ts:289-303 |
| Replay inputs are transcript-only; the graph-index half is gone | confirms BASE with new evidence | compact-inject.ts:284-370, :291-293, :511 |

## Sibling check

Independent: no round-2 sibling file read.

## Hand-off

- Iteration 3 (deepseek-03) takes the goal seams and Pi `turn_end`; keep the transcript work here — do not reopen it.
- If grok-01 or swe-02 cite a different brief source (e.g. the npm `jevctl` compaction state), compare their record claim against F4/F5 before agreeing; the host format is the ground truth for the census.
- Left open: whether every compaction across the transcript directory carries the SessionStart:compact attachment (counted by the census, not here); the production hook budget (question 18); precompute cadence.
