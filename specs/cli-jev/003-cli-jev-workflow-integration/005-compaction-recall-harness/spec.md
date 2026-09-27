---
title: "Build Phase: Compaction Recall Census"
description: "Measure, with zero Jev calls, what this project's host compactions keep in the stock summary and the recorded brief, and whether the vendored staged fit can hold these sessions at all. One printed stop line then decides whether an offline Jev deletion arm is worth specifying."
trigger_phrases:
  - "compaction recall census"
  - "score-compaction-recall"
  - "compact_boundary census"
  - "jev deletion arm stop line"
  - "compaction brief recall"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Build Phase: Compaction Recall Census

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-27 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-deep-research-expansion |
| **Successor** | 006-goal-criteria-lint |
| **Handoff Criteria** | The census has run over the 10 to 20 sessions the operator named and printed its `method:` and `scope:` lines, one row per boundary and one `stop:` line, and `implementation-summary.md` records that stop line. Not a hard gate for 006, whose lint reads goal files and no transcript |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the cli-jev workflow integration specification. It builds recommendation R19 with R11 folded in, from `../004-deep-research-expansion/research/research.md` (section 3, `### R19 (build-now)`; section 4; section 11, `### R19.`; section 13, `### 005-compaction-recall-harness`). R11, the compaction brief selection pass, lives here only as the census's brief column.

**Scope Boundary**: One new read-only census script, its test and its synthetic fixtures. It reads transcript files the operator names, writes one report outside them, never spawns `jev`, never installs or edits a hook and changes no existing behavior. Host compaction runs exactly as today.

**Dependencies**:
- The operator names 10 to 20 Claude Code session files. The census never discovers transcripts on its own
- The built spec-kit runtime `dist`, only for the `--replay` path that imports the brief builder
- None on 002 or 003 for the census. A later Jev arm waits on the conditions in section 3

**Deliverables**:
- `score-compaction-recall.mjs` with one row per boundary and one stop line
- A vitest file with ten cases over about six synthetic fixture transcripts
- One census report over the operator's named sessions, written where the operator says

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nobody has measured what a host compaction in this project keeps, so there is no baseline a Jev deletion pass could be judged against. Compaction happens often here: a parsed count on 2026-09-27 found 212 `compact_boundary` records in 93 main-session transcript files and 14 more in 999 subagent files, each a wait the operator's turn absorbs (p50 about 104 s, research section 4). Two keepers exist and neither has been scored: the host's stock summary, recorded as a `user` record with `isCompactSummary` after each boundary, and the recovered-context brief that the `SessionStart:compact` hook injects from the PreCompact cache (`.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:8`, `session-prime.ts:98`). The vendored Jev compaction procedure fits the whole history into a 25,000-token state before it asks any question (`state.ts:198-306`, `compact.ts:24`), and whether it can do that for sessions that start compacting at 450,019 tokens or more is UNKNOWN. The use-case map lists compaction keep-or-drop as "None today", so no harness exists.

### Purpose

Produce, with zero Jev calls, one row per host compaction and one stop line that says whether an offline Jev deletion arm is worth specifying, while every run leaves the host's compaction, the hooks and the transcripts exactly as they are.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A streaming parser over the session files the operator names, with a closed whitelist of record types that stops on an unknown type, a malformed line or a missing field and names the file, the line and the reason.
- Boundary rows: every `system` record whose `subtype` is `compact_boundary` and that carries `compactMetadata`, with its `trigger`, `preTokens`, `postTokens`, `durationMs`, `isSidechain` and `entrypoint`.
- The recorded-brief column (R11's baseline): the first `attachment` record within 30 records after the boundary whose `attachment.type` is `hook_success` and `attachment.hookName` is `SessionStart:compact`, reported as present or absent, carrying the `Recovered Context (Post-Compaction)` marker or not, and its length in characters. A boundary with no brief reports the status of any other `SessionStart:compact` attachment in that window (`hook_cancelled`, `hook_non_blocking_error` or none), which answers research question 35.
- The fit column: a port of the vendored `estimateTokens` (`state.ts:31-41`) and `fitState` (`state.ts:198-306`) that prints, per boundary, the staged token estimate and the stage reached, or a counted throw.
- The offline reduction upper bound: every unpinned tool result cut to the vendored 300-character head (`truncateHeadChars`, `compact.ts:26`), the newest 6 messages pinned (`preserveRecentMessages`, `compact.ts:23`), prose left alone and no model called.
- Recall under five must-survive rules, for the stock summary and for the recorded brief: (1) identifiers used after the boundary that also appear before it, (2) files written through Write or Edit before the boundary, (3) the bound spec folder by a `specs/` path pattern, (4) the identifiers in the last user instruction before the boundary, reported `uncheckable` when it names none, and (5) a preserved-segment sanity check on `compactMetadata.preservedSegment`.
- A `--replay` path, off by default, that rebuilds a brief only where none is recorded, by importing the built `buildMergedCompactResult` (`compact-inject.ts:284`), and stamps each replayed row with `replay_version`.
- One stop line, defined in section 5.

### Out of Scope

- Any Jev arm, including the offline deletion arm. This phase ends at the stop line. The arm, if the stop line allows it, is a later amendment with its own `--jev` switch, the parent's D5 key gate (`command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider <the provider its judgments use>` exiting 0) with that one `--provider` on every check and call, the redaction cases in the plugin, the scrubber and goal-core (research question 17), the operator's acceptance of its payload, which is the highest class in the packet, and a per-call latency measured in 002.
- Any live form. The PreCompact command hook has a 3 s timeout (`.claude/settings.json:215-222`, What Not To Build row 5), and a function-hook form needs research question 18, the function-hook budget, answered first. Only the `precompute` trigger would ever be considered (`claude-code.d.ts:7278-7285`).
- Installing the vendored npm `jevctl` compaction hook, which runs unless disabled and reads a key outside the D5 gate (rows 6 and 43).
- Per-turn history pruning of the pi-jev-context kind (row 44).
- Dividing host `preTokens` by the 25,000-token `maxStateTokens` (row 45). The ceiling applies to the fitted state after staged shrinking.
- Reading the brief from PreCompact hook records, which hold no event (0 recorded), or from replay alone (row 57).
- Splitting compactions into watched and unattended by timestamps (row 71). The census prints `trigger`, `isSidechain` and `entrypoint` and claims nothing about attention.
- Reusing `detectSpecFolder`, whose regex matches only `.opencode/specs/` paths (`compact-inject.ts:181-190`), which do not exist here.
- Printing any transcript text, including the must-survive items themselves. See Privacy Rules.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` | Create | The census, about 690 to 730 LOC with the parser and the estimator port (swe-02's estimate). Proposed name and placement from the research |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts` | Create | Ten cases. It sits under `runtime/tests/` because the vitest include glob is `runtime/tests/**/*.{vitest,test}.ts` and the scripts README says the folder holds scripts only |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall-fixtures/*.jsonl` | Create | About six small synthetic transcripts. Every text field carries the canary string `CANARY-` so the test can prove no text reaches the report |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | Modify | Add the new subfolder to the structure block and the file inventory |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`, `session-prime.ts` | Read only | The brief builder and its marker. `--replay` imports the built `buildMergedCompactResult` from `dist` |
| `<operator-named report path>` | Create at run time | One JSON report. The script refuses a path inside a named transcript directory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The census makes zero Jev calls and has no Jev code path | With a stub `jev` first on PATH that appends one line per invocation to a log, every census run, with or without `--replay`, leaves the log empty. The script contains no `spawn` or `exec` of `jev` |
| REQ-002 | The census reads only what the operator names | Run with no `--transcripts` argument, it prints `no transcripts named`, reads nothing and exits 2. It never defaults to `~/.claude/projects` or any other directory |
| REQ-003 | The parser is a closed whitelist that fails loudly | A record whose `type` is not in `KNOWN_TYPES`, a line that is not JSON or a boundary missing `compactMetadata` stops that session with `parse error: <file>:<line>: <reason>`. Other sessions still run, the stopped session is counted in `sessions_stopped` and the process exits 1 when any session stopped. No record is skipped with only a warning |
| REQ-004 | The counting method and scope are printed | The report's first two lines are `method: parsed JSON records with type=system, subtype=compact_boundary and compactMetadata present` and `scope: <n> main-session files, <n> subagent files, <n> boundaries (<n> main, <n> subagent)`. A file under a `subagents/` path segment is a subagent file. The boundary total equals an independent parsed count over the same files, and a substring count of `compact_boundary` is never used |
| REQ-005 | No transcript text reaches the report | Every string value in the report is an enum label, a stage name, a file basename the operator passed, a boundary `uuid` or a fixed message. Before writing, the script checks each string against those classes and, on any other, prints `stop: census void (free text in report)`, writes no report and exits 1. The fixture run's report holds no `CANARY-` string |
| REQ-006 | The census never handles a credential | `grep -niE 'api_key\|apikey\|secret\|bearer'` on the script and its test returns no match. No key literal or key variable name appears in either file |
| REQ-007 | The census writes nothing but its report | After a run, `git status --porcelain` lists only this phase's new files and the README row, and no file under a named transcript directory changes. `--out` inside a named transcript directory prints `refused: report path inside transcript directory` and exits 2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | One row per boundary | Each row carries: file basename, boundary `uuid`, line number, `trigger`, `isSidechain`, `entrypoint`, `preTokens`, `postTokens`, `durationMs`, brief status, marker present, brief length, fit estimate with its stage or `fit_throw`, offline reduction upper bound, kept-token estimate, stock-summary recall, brief recall, an `uncheckable` count and the rule 5 result |
| REQ-009 | The fit column is the vendored staged estimate | The port of `estimateTokens` and `fitState` carries a durable "ported from" comment naming npm `jevctl` 0.2.3, `src/vendor/compaction/state.ts` and its MIT license. `preTokens` is never compared with 25,000 |
| REQ-010 | The recorded brief is read before any replay | A boundary with a recorded brief is never replayed. A boundary without one is replayed only under `--replay`, and its row carries `replay_version` and is counted apart from recorded briefs |
| REQ-011 | Recall is scored per rule | For each rule the row prints items found, items kept by the stock summary and items kept by the brief, as counts. Rule 4 with no identifier prints `uncheckable`, which leaves both recall averages |
| REQ-012 | The stop line is printed exactly once | The report ends with exactly one line starting `stop:`, chosen by the rules in section 5 |
| REQ-013 | Large files stream | Files are read line by line and never loaded whole, so the largest file seen today, 218,417,443 bytes, runs. A file above `--max-file-bytes` (default 1 GiB, proposed) is not parsed and counts as `sessions_skipped_oversized` with its size in bytes |

### Privacy Rules

- The report holds counts, scores, ratios, enum labels, stage names, file basenames, boundary `uuid` values and line numbers. It never holds transcript text, a must-survive item, a file path read from a transcript, a spec folder name, the brief or the summary.
- Summary and brief text are read in memory only to test item presence and are dropped after each boundary.
- Fixtures are synthetic and authored for the test. No line is copied from a real transcript.
- The research's report shape printed "counts, names and paths". This phase narrows it to counts and scores, because paths and identifiers come from transcript text. The operator's spot read (research question 27) uses the file basename and line number to open the transcript locally.

### Edge Cases

- **No transcripts named.** `no transcripts named`, exit 2, nothing read (REQ-002).
- **An empty directory.** `compactions=0`, the stop line `stop: no boundaries`, exit 0.
- **Malformed JSONL.** `parse error: <file>:<line>: not JSON`, that session stops and is counted, exit 1 (REQ-003).
- **An unknown record type.** `parse error: <file>:<line>: unknown type <type>` when the type label is under 40 characters and matches `[a-z-]+`, otherwise `unknown type (label withheld)`. Session stops, counted, exit 1. Today's main-session files hold 21 record types, and new ones appear as the host changes.
- **A boundary with no brief.** Brief status `absent`, with the window's other `SessionStart:compact` status. Its brief recall is `n/a` and leaves the brief average. Under `--replay` it takes the replay path instead.
- **An oversized file.** Streamed. Above `--max-file-bytes` it is counted `sessions_skipped_oversized`, named by basename and size and never parsed.
- **An oversized state.** `fitState` throws. The row records `fit_throw`, the count rises and the census continues.
- **A stub `jev` on PATH.** Never invoked (REQ-001).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The operator knows, from one run over 10 to 20 named sessions and with no key, whether a Jev deletion pass can fit these sessions, what the stock summary and the brief each keep and whether the arm is worth specifying.
- **SC-002**: No run changes a hook, a transcript, the host's compaction or any existing file, and no run spawns `jev`.

### Stop Line

The census prints exactly one of these, checked in this order:

1. `stop: census void (unknown shape in <n> of <m> sessions)` when more than half the named sessions stopped on a parse error.
2. `stop: census void (free text in report)` from the REQ-005 guard. No report is written.
3. `stop: no boundaries` when zero boundaries were found.
4. `stop: arm not built (fit_throws=<x>, offline_reduction_upper_bound=<y>, kept_tokens_ratio=<z>)` when `fit_throws` is at least 0.50, or `offline_reduction_upper_bound` is below 0.25, or `kept_tokens_ratio` is above 3.
5. `stop: arm may be specified (fit_throws=<x>, offline_reduction_upper_bound=<y>, kept_tokens_ratio=<z>)` otherwise.

Definitions. `fit_throws` is the share of boundaries whose `fitState` throws. `offline_reduction_upper_bound` is the median over fitted boundaries of 1 minus the truncated estimate over the untruncated estimate, the vendored `reduction` form with its `minReduction` default of 0.25 (npm `core/compact.ts:75`, `docs/compact.md:30`). `kept_tokens_ratio` is the median over fitted boundaries of the truncated estimate over the stock `postTokens`. Line 5 does not build anything. It lets a later amendment specify the arm, which still waits on the conditions in section 3.

### Proof Plan

1. The ten test cases pass with a stub `jev` first on PATH and an empty stub log.
2. Over the named sessions, the `scope:` boundary total matches an independent parsed count over the same files. Boundary: a mismatch voids the run.
3. The report holds no `CANARY-` string on the fixture run, and the key-name grep returns no match.
4. The stop line prints once. On this project's full transcript set the brief column should find a brief near 218 of 222 boundaries and the marker near 210, the research's counts on its own date. Counts drift upward as sessions run, so these are a sanity range, not a pass mark.
5. `git status --porcelain` shows only this phase's files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator names 10 to 20 sessions | The census has nothing to read | The script refuses to discover transcripts. T001 is the operator's task |
| Dependency | The built spec-kit `dist` | `--replay` cannot import the brief builder | Replay is off by default and only covers boundaries with no recorded brief |
| Risk | The transcript format is undocumented and drifts: 21 record types in main-session files today | High | Closed whitelist, a named error per session, a non-zero exit and the census-void rule |
| Risk | Transcript text leaks into the report | High | A typed report, the REQ-005 string guard and the canary test |
| Risk | Counts depend on the method: 226 parsed boundary records against 270 lines containing the word on 2026-09-27, and 210 or 222 in earlier counts | Med | The `method:` and `scope:` lines, and an independent parsed count as the check |
| Risk | Replay is not faithful: it reads today's code graph and session state, not the state at the boundary | Med | Off by default, stamped with `replay_version` and counted apart |
| Risk | The estimator port drifts from the vendored code | Med | A "ported from" comment with version and path, and the fixture that forces a throw |
| Risk | Rule-derived recall may not match a reader's judgment | Med | Research question 27: the operator reads 3 sessions after the census |
| Risk | The fit may throw on most boundaries (inferred) | Low | That is a valid result: it prints `arm not built` before any key is needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Can a Jev deletion pass fit these sessions at all (research question 24)? The fit column answers it.
- Are the unbriefed boundaries the cancelled `SessionStart:compact` hooks (question 35)? The brief column's window status answers it.
- Does rule-derived recall agree with an operator's reading (question 27)? The operator's 3-session read after the census answers it.
- Does Claude Code bound a `session.compact` function hook's run time in production, and at what (question 18)? Unresolved. It blocks any live form, not this census. One timed run with a stub hook on 2.1.283, or a host reference, answers it.
<!-- /ANCHOR:questions -->

---
