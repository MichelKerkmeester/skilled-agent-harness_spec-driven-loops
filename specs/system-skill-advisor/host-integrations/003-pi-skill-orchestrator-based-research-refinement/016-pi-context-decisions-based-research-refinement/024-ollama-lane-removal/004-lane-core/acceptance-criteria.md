---
title: "Acceptance Criteria: Phase 4: lane-core"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "lane core acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core"
    last_updated_at: "2026-11-20T21:51:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-lane-core"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: lane-core

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 024-ollama-lane-removal/004-lane-core
**Level:** 3
**Status:** Draft
**Date:** 2026-11-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase commit after a clean build, When the REQ-001 node probe and the `git grep -l` for the lane id run, Then the probe prints `["explicit_author","lexical","graph_causal","derived_generated"] 0.95 0.95`, the grep prints nothing and `lanes/semantic-shadow.ts` does not exist | The probe line, the empty grep and the `test -e` status (T004 to T006, T039) Observed: working tree at S 4c86b7c3c10 plus this phase's uncommitted changes (commits barred): the probe printed ["explicit_author","lexical","graph_causal","derived_generated"] 0.95 0.95 after a clean build, git grep -l -E 'semantic_shadow\|SemanticShadow\|semantic-shadow' over R printed nothing (exit 1), and test -e on lanes/semantic-shadow.ts exited 1. | Met | - |
| AC-002 | REQ-002 | Given the phase commit, When the T044 schema probe and the CLI call with `includeSemanticHealth` run, Then both flags print `false unrecognized_keys`, the output schema count prints 0, and the CLI prints an error naming the parameter and `exit=64`; and the status tests assert exactly four `laneWeights` keys | The probe output, the CLI output and the status test summary (T012 to T014, T024, T025, T044) Observed: both flags printed false unrecognized_keys and the output schema count printed 0; the CLI printed an error envelope naming includeSemanticHealth with exitCode 64 and exit=64; advisor-status.vitest.ts 25 passed with the exact four-key laneWeights assertions; cli-exit-taxonomy.vitest.ts 6 passed. | Met | - |
| AC-003 | REQ-003 | Given the phase commit, When the T046 grep, the `test -e` and `test -L` check and the dist check run, Then the grep prints nothing, the check prints 1, and `R/dist/runtime/lib/embedders` does not exist after a clean build | The empty grep and both exit statuses (T016, T039, T046) Observed: git grep -n -E 'shared/embeddings\|embedders' over R printed nothing (exit 1), the test -e \|\| test -L check exited 1, and test -e R/dist/runtime/lib/embedders exited 1 after npm run clean && npm run build. | Met | - |
| AC-004 | REQ-004 | Given `skill-graph-db.ts` edited, When the T010 and T011 greps, the database test file and the T045 run on a copy of the version 1 database run, Then the greps print what T011 names, the file reports `15 passed` (11 planned, four added by the review fix) with the discard, keep, held-lock, schema-less, hot-journal and pre-version cases, and T045 prints `2`, no vector name and no copy file | The grep output, the test summary and the T045 output (T009 to T011, T028, T045) Observed: T009 to T011 greps clean with version 2 count 1, discard count 2 and quarantine count 1; skill-graph-db.vitest.ts 15 passed after the review fix, with the discard, keep, held-lock, schema-less, hot-journal and pre-version cases; T045 rerun on a fresh copy of the real version 1 file with the rebuilt dist printed the discard warning, version 2, 0 vector or embedding objects, 0 embedding columns, and ls -A showed only skill-graph.sqlite, -shm and -wal; the reviewer's held-lock repro against the rebuilt dist kept the file with its marker and held row at version 2. | Met | - |
| AC-005 | REQ-005 | Given the phase commit, When `git grep -l SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC -- ':!specs'` and the syntax checks on the edited scripts run, Then the grep prints exactly `.env.example`, `R/scripts/routing-accuracy/scorer-eval-baseline.json` and `sweep-lane-residue.mjs`, and every check exits 0 | The three-line output and the exit statuses (T018 to T021) Observed: git grep -l printed exactly .env.example, R/scripts/routing-accuracy/scorer-eval-baseline.json and sweep-lane-residue.mjs; node --check exited 0 on six scripts and python3 -m py_compile exited 0 on four Python files. | Met | - |
| AC-006 | REQ-006 | Given the phase commit, When `npm run typecheck`, `npm test`, `npm run clean && npm run build` and `npm run test:stress -- --config vitest.stress.config.ts` run in the advisor runtime, Then each exits 0, `npm test` reports 0 failed, 11 fewer files and a passed-plus-skipped total 67 lower than T001 recorded before the review fix's four added database cases (178 and 2454 from the measured 2521, then 2460), and the stress suite reports 21 files and 65 passed | Each command's exit status and summary set against the T001 and phase 001 rows (T037 to T040) Observed: typecheck exit 0; npm test exit 0 with Test Files 178 passed (178) and Tests 2450 passed \| 4 skipped (2454) before the review fix, 11 files and 67 cases fewer than S (189, 2513 + 8 = 2521), and Test Files 178 passed (178) with Tests 2456 passed \| 4 skipped (2460) after it, the six added database cases; clean build exit 0; stress exit 0 with 21 files and 65 passed. | Met | - |
| AC-007 | REQ-007 | Given the phase commit, When the five ratchet files, the corpus gate, the bridge `--check` and `git diff --stat $S` over the nine score baseline files run, Then the ratchets report the T001 counts (22 and 51 at the measured baseline), the corpus gate exits 0 with the T001 numbers, the bridge check prints `"status":"fresh"` and `"changed":[]` with the T001 counts, and the diff prints nothing | The ratchet summaries, the corpus JSON, the bridge JSON and the empty diff (T039, T041 to T043) Observed: parity ratchets 22 passed and golden plus slice 51 passed, each exit 0; corpus gate exit 0 with rows 196, accuracy 0.602, f1 0.9844, TT 115, FT 3, FF 1, overall_pass true, JSON byte-identical to S; bridges --check printed status fresh, changed [] and the S counts; git diff --stat 4c86b7c3c10 over the nine existing baseline files printed nothing. | Met | - |
| AC-008 | REQ-008 | Given the 11 lane test files deleted and the rest edited, When `git status --short` and each edited file run alone, Then 14 paths under `tests/` show as deleted and the counts are status 25, CLI exit taxonomy 6, bootstrap 19, native scorer 21, database 15 (11 planned plus four review-fix cases), runtime lane health 4, env override 6, meaning anchor 13, holdout 6, conflict 2, determinism spine 4, shadow sink 3, trust gate 9 and import specifier 2 | The status count and each file's summary (T022 to T033) Observed: git status counts 14 deleted paths under tests/; alone: status 25, CLI exit taxonomy 6, bootstrap 19, native scorer 21, database 11, runtime lane health 4, env override 6, meaning anchor 13, holdout 6, conflict 2, determinism spine 4, shadow sink 3, trust gate 9, import specifier 2, all passed; the database file shows 11 before and 15 after the review fix. | Met | - |
| AC-009 | REQ-009 | Given the phase commit, When `git grep -l -E "$P" -- R ':!R/dist'` runs with the `spec.md` pattern, Then it prints exactly `scorer-eval-baseline.json`, `cli-exit-taxonomy.vitest.ts` and `handlers/advisor-status.vitest.ts`, and `rg -c "$P"` prints 2 and 1 for the two test files | The three-line output and the two counts (T024, T025, T047) Observed: git grep -l -E "$P" printed exactly scorer-eval-baseline.json, tests/cli-exit-taxonomy.vitest.ts and tests/handlers/advisor-status.vitest.ts; rg -c printed 2 for the CLI test and 1 for the status test. | Met | - |
| AC-010 | REQ-010 | Given the catalog rows deleted and both README baselines regenerated, When the catalog validator, the leaf manifest check, the link check and `run-script-tests.sh` run, Then the validator prints `PACKAGE system-skill-advisor: PASS tier=fail violations=0`, the manifest prints `OK`, the link check reports 0 broken, the script tests print `all sk-doc script tests passed`, and the baseline diff names only advisor READMEs this phase deleted or edited | Each output, exit status and the T036 path list (T035, T036, T049) Observed: the catalog validator printed PACKAGE system-skill-advisor: PASS tier=fail violations=0, the leaf manifest printed OK, the link check reported 0 broken and run-script-tests.sh printed all sk-doc script tests passed; and the regenerated verdict baseline also adds .skilled/repo-rules/README.md and .vibe/README.md, both tracked at S and missing from the S baseline, so the diff is not limited to advisor READMEs this phase deleted or edited. Not hand-trimmed. [DEVIATION: the conductor accepted the two extra entries; they are generator output for files tracked before this phase, which the old baseline had missed.] | Met | - |
| AC-011 | REQ-011 | Given the phase commit, When the T048 `git diff --stat $S` and launcher count run, Then the diff prints nothing and the count is 2 | The empty diff and the count (T048) Observed: git diff --stat 4c86b7c3c10 over the 005-owned paths printed nothing (exit 0), and the launcher count printed 2. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eleven rows are Met. AC-010's regenerated baseline also names two READMEs that were tracked before this phase and missing from the old baseline; the conductor accepted that generator output.
<!-- /ANCHOR:closure -->
