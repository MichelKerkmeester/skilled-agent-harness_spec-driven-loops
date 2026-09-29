---
title: "Implementation Plan: Compaction Recall Census"
description: "One new read-only census script under system-spec-kit's runtime scripts: a closed-whitelist streaming parser over this project's 15 newest compacted transcripts, per-boundary rows for the stock summary, the recorded brief and the vendored staged fit, and one stop line, with zero model calls."
trigger_phrases:
  - "compaction recall census plan"
  - "score-compaction-recall plan"
  - "compaction census stop line"
  - "vendored fitState port"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Compaction Recall Census

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES module (`.mjs`), no new dependency |
| **Framework** | Node file streams split on the newline byte, not `readline`, which also breaks lines at U+2028 (`spec.md` section 6). The built spec-kit `dist` only for `--replay` |
| **Storage** | None in the repository. One JSON report at the `--out` path the run passes, outside the transcript directory and the repository |
| **Testing** | Vitest through the hoisted binary, `npx vitest run` from `runtime/`. The package's bounded runner, `npm test`, fails in this worktree before any test runs, because `runtime/scripts/run-tests.mjs:10` resolves a `runtime/node_modules/.bin/vitest` that does not exist. Synthetic fixtures with a canary string, stub `jev` and `cli-deem` (proposed, phase 008) binaries for the zero-call proof |

### Overview

The script picks this project's 15 newest compacted transcripts (parent D4), streams each one, checks every record against a closed type whitelist and finds each compaction boundary. For each boundary it reads the stock summary and the recorded brief from the records that follow, rebuilds the history before it in the vendored message shape, runs a port of the vendored staged fit and a no-model truncation pass, and scores both keepers under five must-survive rules. It prints one row per boundary and one stop line, and it never spawns `jev` or `cli-deem`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met. Level 1 has no `acceptance-criteria.md`, and all six `goal.md` criteria are ticked, two of them amended at close with logged reasons
- [x] Tests passing (if applicable). `Tests 24 passed (24)`, exit 0, rerun by the orchestrator session after the review fix
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A standalone offline census: stream, classify, score, print. It lives in a new `compaction-recall/` subfolder of `runtime/scripts/` so it deletes as one directory, and its test sits under `runtime/tests/`, where the vitest include glob finds it.

### Key Components

- **Arguments**: `--transcripts <dir-or-file>` (repeatable, required), `--out <file>` (required, refused inside a named transcript directory), `--newest-compacted <n>` (proposed), `--replay` (off by default), `--max-file-bytes <n>` (default 1 GiB, proposed). No argument names a provider, a key or a backend, and the census has no `--jev` or `--deem` switch (both proposed for the later arm only).
- **`selectNewestCompacted()`**: only under `--newest-compacted <n>`. It lists the `*.jsonl` files directly in the named directory, orders them by modification time, newest first, and keeps the first n whose parsed records hold a boundary. It prints the `selection:` line. `spec.md` section 3, Session Source, holds the rule and parent D4's run: `--transcripts ~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public --newest-compacted 15`.
- **`parseTranscript()`**: a stream per file, split on the newline byte. Each line is parsed as JSON and its `type` checked against `KNOWN_TYPES`, the 21 record types seen in main-session files on 2026-09-27. A bad line, an unknown type or a boundary missing `compactMetadata` stops that session with `parse error: <file>:<line>: <reason>`. A file under a `subagents/` path segment is classed as a subagent file.
- **`findBoundaries()`**: `system` records whose `subtype` is `compact_boundary` and that carry `compactMetadata`. It reads `trigger`, `preTokens`, `postTokens`, `durationMs` and `preservedSegment`, plus `isSidechain` and `entrypoint` from the record.
- **`readStockSummary()`**: the first `user` record with `isCompactSummary` within 30 records after the boundary. Its text is held in memory for scoring only.
- **`readRecordedBrief()`**: the first `attachment` record within 30 records whose `attachment.type` is `hook_success`, whose `attachment.hookName` is `SessionStart:compact` and whose `attachment.command` contains `session-prime`, because several hooks answer that event. It records presence, the `Recovered Context (Post-Compaction)` marker (`session-prime.ts:98`) and the length in characters. With none, it records the window's other `SessionStart:compact` status.
- **`replayBrief()`**: only under `--replay` and only where no brief is recorded. It imports `buildMergedCompactResult` from the built `dist/hooks/claude/compact-inject.js` and stamps the row with `replay_version`.
- **`toMessages()`**: rebuilds the records between the previous boundary, or the file start, and this one as the vendored `Message` and `ToolCall` shapes.
- **Estimator port**: `estimateTokens` (`state.ts:31-41`) and `fitState` (`state.ts:198-307`) from npm `jevctl` 0.2.3, MIT, with a durable "ported from" comment. It prints the staged estimate and stage, or counts a throw. The defaults come from `compact.ts:22-26`: keep threshold 0.5, the newest 6 messages pinned, 25,000 state tokens and a 300-character head.
- **`offlineReductionUpperBound()`**: every unpinned tool result cut to the 300-character head, prose untouched, no model. It returns the truncated estimate and 1 minus the truncated estimate over the untruncated one.
- **Must-survive rules**: (1) identifiers used after the boundary that appear before it, (2) files written through Write or Edit, (3) the bound spec folder by a `specs/` pattern, not `detectSpecFolder`, (4) identifiers in the last user instruction, `uncheckable` when there are none, (5) a preserved-segment check that the `preservedSegment` head and tail records exist in the file. Each rule returns counts only.
- **`report()`**: the `method:` and `scope:` lines, one row per boundary, the totals and the stop line. Before writing it checks every string value against the allowed classes (enum labels, stage names, named file basenames, `uuid` values, fixed messages). Any other string prints `stop: census void (free text in report)`, writes nothing and exits 1.

### Data Flow

Selected files stream through the parser. Boundaries and the records after them feed the summary, brief and replay readers. Records before each boundary feed `toMessages()`, then the fit port and the truncation pass. Summary and brief text meet the rule items in memory and leave as counts. Rows and totals go through the string guard to the report and stdout, and the stop line closes both.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### First Slice, in Order

1. The session source is parent D4's: this project's 15 newest compacted transcripts, picked by `--newest-compacted 15` as `spec.md` section 3 says. The agent picks no other file.
2. Write the parser, boundary finder and report with the `method:` and `scope:` lines and the string guard, then the fixtures for a clean session, a malformed line and an unknown type. Confirm the boundary total against an independent parsed count.
3. Add `--newest-compacted` and its `selection:` line, with its two cases over a generated directory.
4. Add the fit column next, because it decides the arm: the estimator port, `toMessages()` and the throw count, with the generated oversized-state case.
5. Add the recorded-brief and stock-summary readers, the truncation pass and the five rules.
6. Add `--replay` last, off by default.
7. Update the system-spec-kit docs in `spec.md`'s Files to Change through sk-doc's matching modes (parent D6).
8. Run the census over parent D4's source with stub `jev` and `cli-deem` binaries first on PATH, read the stop line and record it in `implementation-summary.md`.
9. Stop there. Any model arm, on Jev or Deem, is a later amendment to this phase with its own `--deem` and `--jev` switches and the conditions in `spec.md` section 3.

### Build Route (parent D5)

A fresh Opus 5.5 xhigh build orchestrator writes one single-change brief per step above and runs each through a CLI executor by Bash only. The operator's roster of 2026-09-28 (parent D5, amended in `3cbe44727e`) is Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro`, and the build and its review fix used only those two. The earlier roster also named Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` and Cursor `grok-4.7-xhigh-fast`. The orchestrator session verifies each result against section 5, gets a cross-family review of the script and test and commits the phase's files path-scoped on worktree 069, with no push or merge to main (parent D7). The script and test follow sk-code's OpenCode route (`sk-code/sk-code-opencode`), per parent D6.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root unless a row says otherwise, with `S=.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs`. `$STUB` is a temporary directory outside the repository holding executable `jev` and `cli-deem` stubs that append their arguments to `$STUB/jev.log` and `$STUB/cli-deem.log`. `$NAMED` is parent D4's source, `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public`, and `$OUT` a report path outside it and outside the repository.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Unit cases | from `.skilled/skills/system-spec-kit/runtime`: `npx vitest run tests/compaction-recall.vitest.ts`. The planned `npm test -- --run` form fails here before any test runs (section 1) | 12 passed, exit 0, then 24 after the review fix. The review fix added twelve cases: the symlinked script path, five `--out` containment cases, the in-process planted-string case, no transcripts named, `--max-file-bytes`, `partial_tails`, `uncheckable` and `stop: arm may be specified`. The planned cases: a missing written file gives 1 violation; an unknown type exits 1 with a named error; a malformed line does the same; an empty directory exits 0 with `compactions=0`; a clean session, which carries a raw U+2028 in one text field, gives 0 violations; an oversized state records `fit_throw` and continues; a recorded brief is read and not replayed; a boundary without one takes the replay path with `replay_version`; the report holds no `CANARY-` string; the stub `jev` and `cli-deem` logs stay empty; `--newest-compacted 1` picks the newer of two compacted files and skips a still newer file with no boundary and a file under `subagents/`; `--newest-compacted 5` over two compacted files takes both and its `selection:` line says 2 |
| No transcripts named | `node $S --out $OUT` | `no transcripts named` on stderr, empty stdout, exit 2, no report written |
| Report inside the transcripts | `node $S --transcripts $NAMED --out $NAMED/r.json` | `refused: report path inside transcript directory` on stderr, exit 2 |
| Census, zero calls | `PATH="$STUB:$PATH" node $S --transcripts $NAMED --newest-compacted 15 --out $OUT` | A `method:` line, a `scope:` line, a `selection:` line, one row per boundary, exactly one `stop:` line, exit 0 or exit 1 with each stopped session named. `$STUB/jev.log` and `$STUB/cli-deem.log` are empty |
| Boundary total | an independent parsed count over the 15 files the rows name: split each on the newline byte, parse each line as JSON and count records with `type` `system`, `subtype` `compact_boundary` and `compactMetadata` | The same total as the `scope:` line |
| No key names | `grep -niE 'api_key\|apikey\|secret\|bearer' $S .skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts` | No match, exit 1 |
| Code route | `python3 .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall` | Exit 0 with `Scanned files: 1` (parent D6). The checker skips untracked files, so before the commit it scans nothing, and a check then needs a copy outside any git tree |
| Skill docs | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc>` on each system-spec-kit doc in `spec.md`'s Files to Change | `VALID` and exit 0 on each (parent D6, parent criterion 3) |
| Code review | a cross-family review of the script and test, run by the orchestrator session | No open P0 or P1 finding (parent D5) |
| Read-only | `git status --porcelain` | Only the files in `spec.md`'s Files to Change |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness --strict` | `RESULT: PASSED` |
| Phase goal | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness` | Passes with no finding |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Parent D4's session source, this project's transcript directory named in section 5. The build route in section 4 (parent D5). The built spec-kit runtime `dist` for `--replay` only (`npm run build` under `.skilled/skills/system-spec-kit/runtime`). No package is installed, neither `jev` nor a Deem server is needed and no key is read.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before the orchestrator commits: delete `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/`, `runtime/tests/compaction-recall.vitest.ts`, `runtime/tests/compaction-recall-fixtures/` and the created changelog, catalog and playbook files, and revert each modified doc with `git checkout -- <file>`, starting with `.skilled/skills/system-spec-kit/runtime/scripts/README.md`. After the commit, `git revert <commit>` undoes the same set. Either way, delete the report at the `--out` path. No hook, setting or transcript changes, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---
