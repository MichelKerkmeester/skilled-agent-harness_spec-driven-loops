---
title: "Acceptance Criteria: Phase 3: lane-feeders"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "lane feeders acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders"
    last_updated_at: "2026-11-20T21:51:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-lane-feeders"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: lane-feeders

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 024-ollama-lane-removal/003-lane-feeders
**Level:** 3
**Status:** Draft
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase commit, When the Measured Behavior call-site pipeline and the REQ-001 `rg` over `advisor-server.ts`, `watcher.ts` and `scan.ts` run, Then both print nothing and the pipeline's `wc -l` prints 0 | The empty outputs (T004 to T006, T036). Observed: on the uncommitted working tree over `0c2ab52b3b3`, the call-site pipeline piped to `wc -l` printed 0 (11 at the start commit), and `rg -n 'ensureActiveEmbedder\|refreshEmbeddingsInBackground\|refreshSkillEmbeddings\|embedders/'` over `advisor-server.ts`, `watcher.ts` and `scan.ts` printed nothing and exited 1 | Met | - |
| AC-002 | REQ-002 | Given the edited `skill-graph-db.ts`, When the T007 `rg` and the export count run, Then the `rg` prints nothing and the count is 4 | The empty `rg` and the count (T007). Observed: the T007 `rg` printed nothing and exited 1, and the `^export function (embeddingCoverage\|loadSkillEmbeddings\|readCommandEmbeddingSources\|providerModelId)\(` count printed 4 | Met | - |
| AC-003 | REQ-003 | Given the edited `advisor-recommend.ts`, When the T008 `rg` runs, Then it prints nothing, and `case 'cosine'` still appears once | The empty `rg` and the count of 1 (T008). Observed: the T008 `rg` printed nothing and exited 1, and `rg -c "case 'cosine'"` printed 1 | Met | - |
| AC-004 | REQ-004 | Given the edited `fusion.ts`, When the REQ-004 `rg` runs, Then it prints nothing and the only lane-module import is `scoreSemanticShadowLane` | The empty `rg` and the import count of 1 (T009). Observed: the REQ-004 `rg` printed nothing and exited 1, and the `scoreSemanticShadowLane` import count printed 1 | Met | - |
| AC-005 | REQ-005 | Given the edited `fusion.ts`, When the REQ-005 `rg` runs and `command-meaning-anchor.vitest.ts` and `doctor-ordering.vitest.ts` run, Then the `rg` prints nothing, `requireCommandPhraseAnchor` takes one parameter, and both test files pass | The empty `rg`, the signature and the two test results (T010, T026). Observed: the REQ-005 `rg` printed nothing and exited 1, `requireCommandPhraseAnchor` takes the one `ranked` parameter, `command-meaning-anchor.vitest.ts` printed `13 passed (13)` and `doctor-ordering.vitest.ts` printed `32 passed (32)` | Met | - |
| AC-006 | REQ-006 | Given the generator edited and run with no arguments, When `derive-command-bridges.cjs --check` and `git grep -c '"embeddingText"'` on the JSON run, Then `--check` prints `"status":"fresh"`, `"changed":[]` and the four T001 counts, the grep prints nothing, and no generated file but the JSON changed | The `--check` JSON, the empty grep and the empty `git diff --stat` over the three generated blocks (T011, T012, T038). Observed: after the plain generator run, `--check` printed `"status":"fresh"`, `"changed":[]` and `commandMetadata 27, doctorRoutes 35, generated 62, typescriptActive 46, pythonActive 52`, the same as at `0c2ab52b3b3`; `git grep -c '"embeddingText"'` on the JSON printed nothing; `git diff --stat` over `projection.ts`, `command-attach.ts`, `skill_advisor.py` and `scoring-compatibility.json` printed nothing, and the run added only the JSON to the diff stat | Met | - |
| AC-007 | REQ-007 | Given the phase commit, When the Measured Behavior `createChildEnv` command and the REQ-007 `git grep -l` run, Then the first prints `[]` and the second prints nothing | Both outputs (T015, T017, T018, T036). Observed: `createChildEnv` printed `[]` and the REQ-007 `git grep -l` printed nothing and exited 1 | Met | - |
| AC-008 | REQ-008 | Given the phase commit, When `npm run typecheck`, `npm test` and `npm run clean && npm run build` run in the advisor runtime, Then each exits 0, and `npm test` reports 0 failed, seven fewer files and a passed-plus-skipped total 55 lower than T001 recorded at the start commit (189 and 2523 from the 001 baseline) | Each command's exit status and the test summary set against phase 001's baseline row (T030 to T032). Observed: on the working tree over `0c2ab52b3b3`, `npm run typecheck` exited 0, `npm run clean && npm run build` exited 0, and `npm test` exited 0 with `189 passed (189)` files and `2513 passed \| 8 skipped (2521)`, 0 failed: seven fewer files and 55 fewer cases than the T001 record of 196 files and 2576 cases. The 2523 in this row assumed phase 001's 2570 passed; phase 002 had already moved the start to 2568 | Met | - |
| AC-009 | REQ-009 | Given the phase commit, When the five ratchet files, the corpus gate and `git diff --stat $S` over the nine score baseline files run, Then the ratchets report 22 and 51 passed, the corpus gate exits 0 with the seven Measured Behavior numbers, and the diff prints nothing | The ratchet summaries, the corpus JSON and the empty diff (T033 to T035). Observed: the three parity ratchets printed `22 passed (22)` and golden prompts plus `command-routing-slice.vitest.ts` printed `51 passed (51)`; the corpus gate exited 0 with `"rows": 196`, `"accuracy": 0.602`, `"f1": 0.9844`, `"TT": 115`, `"FT": 3`, `"FF": 1`, `"overall_pass": true`, byte-identical to the start capture; `git diff --stat 0c2ab52b3b3` over the nine score baseline files printed nothing | Met | - |
| AC-010 | REQ-010 | Given the edited capture script, When `node --check`, the T019 `rg` and `node capture-command-routing-baseline.mjs --real-embedding` run, Then the check exits 0, the `rg` prints nothing, and the run exits 2 with `unknown option: --real-embedding` | The exit statuses, the empty `rg` and the stderr line (T019). Observed: `node --check` exited 0, the T019 `rg` printed nothing and exited 1, and `node capture-command-routing-baseline.mjs --real-embedding` printed `capture-command-routing-baseline.mjs: unknown option: --real-embedding` and exited 2 | Met | - |
| AC-011 | REQ-011 | Given the seven feeder test files deleted and nine edited, When `git status --short` and each edited file run alone, Then seven files show as deleted and the counts are cosine 7, coverage 1, conflict 2, ablation 4 with its start-commit pass and skip split, meaning anchor 13, bootstrap 21, drift guard 6 and bin launcher 5 | The status count and each file's summary (T014, T016, T022 to T027). Observed: `git status --short -- $R/tests \| rg -c '^ ?D '` printed 7, and the files alone printed cosine `7 passed (7)`, coverage `1 passed (1)`, conflict `2 passed (2)`, ablation `2 passed \| 2 skipped (4)` (the start-commit split), meaning anchor `13 passed (13)`, bootstrap `21 passed (21)`, drift guard `6 passed (6)` and the bin launcher test `5 passed (5)` | Met | - |
| AC-012 | REQ-012 | Given the six docs edited, When the doc greps, the catalog validator, the link check and `run-script-tests.sh` run, Then the greps print nothing, the validator prints `PACKAGE system-skill-advisor: PASS tier=fail violations=0`, the link check reports 0 broken and the script tests print `all sk-doc script tests passed` | Each output and exit status (T013, T020, T021, T028, T029, T039). Observed: the T013, T020, T021 and T028 greps printed nothing; the catalog validator printed `PACKAGE system-skill-advisor: PASS tier=fail violations=0`; `check-markdown-links.cjs` exited 0 with `7690 files, 15275 links checked, 0 broken`; `run-script-tests.sh` exited 0 and its last line was `all sk-doc script tests passed` | Met | - |
| AC-013 | REQ-013 | Given the phase commit, When the T037 `git diff --stat $S` and the T015 count run, Then the diff prints nothing and the count is 2 | The empty diff and the count (T015, T037). Observed: the T037 `git diff --stat 0c2ab52b3b3` over `lane-registry.ts`, `lanes/semantic-shadow.ts`, `advisor-status.ts`, `schemas`, `tools`, `skill-advisor-cli-manifest.ts`, `projection.ts`, `types.ts` and `lib/embedders` printed nothing, and the T015 count printed 2 | Met | - |

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

All thirteen rows are Met on the uncommitted working tree over `0c2ab52b3b3`, and closure waits for the conductor's commit and implementation summary.
<!-- /ANCHOR:closure -->
