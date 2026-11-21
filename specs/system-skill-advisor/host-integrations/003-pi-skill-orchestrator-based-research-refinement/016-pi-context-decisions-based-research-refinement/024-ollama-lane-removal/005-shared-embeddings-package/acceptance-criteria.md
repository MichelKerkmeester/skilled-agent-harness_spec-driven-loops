---
title: "Acceptance Criteria: Phase 5: shared-embeddings-package"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "shared embeddings package acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package"
    last_updated_at: "2026-11-21T00:00:00Z"
    last_updated_by: "plan-author"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-shared-embeddings-package"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: shared-embeddings-package

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 024-ollama-lane-removal/005-shared-embeddings-package
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
| AC-001 | REQ-001 | Given the phase commit after a clean shared build, When the `test -e` checks, the code-file grep for `shared/embeddings` and the dist check run, Then no source or dist path of the package, `chunking` or `utils/retry` exists, and the grep prints exactly `sweep-lane-residue.mjs` | The two `echo $?` lines printing 1 and the one-line grep (T006, T042, T050). Observed: the source `test -e` line printed 1 (T006); after the clean rebuild the dist `test -e` line printed 1 (T042); `git grep -l 'shared/embeddings' -- ':!specs' ':!*.md' ':!*.json'` printed only `sweep-lane-residue.mjs` (T050) | Met | - |
| AC-002 | REQ-002 | Given `types.ts` edited and nothing yet deleted, When the shared `tsc --noEmit` runs before and after the deletion, Then the first run names only the nine files T006 deletes and the second exits 0, and the shared build and test exit 0 with `ℹ tests 9` and `ℹ pass 9` | Both compile outputs and the test summary (T005, T006, T042). Observed: before the deletion `tsc --noEmit` exited 2 with 32 errors in exactly the nine paths (T005); after it the same command printed `exit=0` (T006); shared `npm run build` exit 0 and `npm test` printed `ℹ tests 9`, `ℹ pass 9` (T042) | Met | - |
| AC-003 | REQ-003 | Given the phase commit, When `git ls-files \| grep -c -E '(^\|/)(hf-model-server\|model-server-supervision\|sidecar-env-allowlist)\.cjs$\|shared/chunking\.ts$\|shared/utils/retry\.ts$'` and the code-file grep for the server names run, Then the count is 0 and the grep prints exactly the residue check and its test | The count and the two-line grep (T010, T050). Observed: on disk none of the five paths exists and `git ls-files -d` lists all five; on a scratch index with the 55 deletions removed (the tree the phase commit records) the count printed 0, while the working index prints 5 because staging is barred; the code-file grep printed exactly `sweep-lane-residue.mjs` and `sweep-lane-residue.vitest.ts` (T010, T050) | Met | - |
| AC-004 | REQ-004 | Given the launcher edited, When `node --check`, the REQ-004 `rg` and the T011 `createChildEnv` probe run, Then the check exits 0, the `rg` prints nothing, the probe prints `0 0`, and the bin vitest suite reports its T003 counts | The exit status, empty output, probe line and suite summary (T011, T046). Observed: `node --check` exit 0, the `rg` printed nothing, the probe printed `0 0` (T011); the bin suite printed `Test Files 8 passed (8)`, `Tests 95 passed (95)`, exit 0, equal to T003 (T046) | Met | - |
| AC-005 | REQ-005 | Given the bridge edited, When the T012 probe and the residue check's machine mode run, Then the probe prints `function false`, the file has six `require` lines, and machine mode reaches its summary | The probe line, the count and the machine-mode output (T012, T051). Observed: the probe printed `function false` and `rg -c "require\('"` printed 6 (T012); machine mode ran to `result : exit 1 (remnants remain)` with no load error (T051) | Met | - |
| AC-006 | REQ-006 | Given the phase commit, When `npm run typecheck`, `npm run build` and `npm test` run in `K/` and `npm --prefix runtime/cli run check` runs, Then each exits 0 and the runtime suite reports 18 fewer files and 147 fewer passed plus skipped than T003 with 0 failed | The four exit statuses and the runtime totals (T043). Observed: `npm run typecheck` exit 0, `npm run build` exit 0, `npm test` exit 0 in `K/`; runtime `test:core` 96 files (93 passed, 3 skipped) and 1359 tests (1348 passed, 11 skipped) against 114 and 1508 at T003, CLI project 213 files and 2664 tests unchanged; `npm --prefix runtime/cli run check` exit 0 (T043). [DEVIATION: 149 fewer tests, not 147: the deleted `launcher-model-server-live-two-launcher.vitest.ts` ran 5 tests with 2 skipped at T003, and `vitest list` counted only its 3 unskipped cases. Passed fell by exactly 147 and skipped by exactly those 2] | Met | - |
| AC-007 | REQ-007 | Given the phase commit, When the advisor typecheck, `npm test`, `npm run clean && npm run build`, the stress suite, the parity ratchets and the score baseline diff run, Then each exits 0, `npm test` reports one file and 18 cases fewer than T003 (177 and 2438 from 004's expected baseline), stress reports 21 files and 65 passed, the ratchets print the T003 counts and the diff prints nothing | The exit statuses, the totals and the empty diff (T044, T045). Observed: typecheck exit 0; `npm test` exit 0 with 177 files and `2438 passed, 4 skipped (2442)`, one file and 18 cases fewer than T003; clean build exit 0; stress 21 files and 65 passed; ratchets 22 and golden plus slice 51, the T003 counts; corpus JSON byte-identical to T003; the nine-file diff printed nothing (T044, T045) | Met | - |
| AC-008 | REQ-008 | Given the two manifests edited and the lockfiles regenerated, When the lockfile key diffs and `git grep -l "@huggingface/transformers" -- ':!specs'` run, Then the diffs print `removed=78 added=0`, `removed=72 added=0` and one deleted deep-loop line, and the grep prints exactly `sweep-lane-residue.mjs` | The diff lines and the one-line grep (T017, T026, T027, T050). Observed: key diffs printed `removed=78 added=0` (`R/`), `removed=72 added=0` (`K/`) and one deleted deep-loop line with no `+` line (T027); `git grep -l "@huggingface/transformers" -- ':!specs'` printed exactly `sweep-lane-residue.mjs` (T050) | Met | - |
| AC-009 | REQ-009 | Given the orphan check, its docs, the route phrase and the fixtures edited, When `run-all.sh`, `shasum`, `doctor-helper-match.test.cjs` and the bridge `--check` run, Then `run-all.sh` prints `7 suite(s) passed, 0 failed` with the T003 test count, the digest is `4b90f1fa6ec1df05f3bbfa56face73f85d32e0df3fa3e7ce3edeeeb6a27ec45c`, the held-out line shows `rows=59` with top1 at least 0.800 and top3 at least 0.900, and the bridge check prints `"status":"fresh"` and `"changed":[]` | The run-all summary, the digest, the held-out line and the bridge output (T030 to T034, T047). Observed: `run-all.sh` exit 0 with `ℹ tests 1417` and `7 suite(s) passed, 0 failed`; digest `4b90f1fa...c45c`; held-out `top1=0.851 top3=0.915` with `rows=59`; bridge `--check` `"status":"fresh"` and `"changed":[]` (T030 to T034, T047, T049) | Met | - |
| AC-010 | REQ-010 | Given the sweeper edited and its allowlist row added, When `bash -n`, the term `rg`, the `ollama-preserve` grep and repo mode run, Then the syntax check exits 0, the `rg` prints nothing, the grep prints the guard line, and repo mode lists the sweeper as allowlisted | The exit status, the guard line and the repo-mode JSON (T035, T036, T051). Observed: `bash -n` exit 0, the term `rg` printed nothing, the `ollama-preserve` grep printed the guard line (T035); repo mode lists the sweeper among the allowlisted files and not the live ones, allowlisted 30 (T036, T051) | Met | - |
| AC-011 | REQ-011 | Given the validator deleted, When the validator grep, `typo-flags.test.cjs`, `run-script-tests.sh` and `check-gate-inputs.sh` run, Then the grep prints nothing, the typo test prints `ℹ tests 16` and `ℹ pass 16`, the suite prints `all sk-doc script tests passed`, and the gate check prints `failures=0` and `RESULT: PASSED` | The four outputs (T037, T038, T041, T048, T049). Observed: the validator grep printed nothing; typo flags `ℹ tests 16`, `ℹ pass 16`; `all sk-doc script tests passed`; gate inputs `failures=0` and `RESULT: PASSED` (T037, T038, T048, T049) | Met | - |
| AC-012 | REQ-012 | Given the READMEs, the router and the leaf metadata edited, When the link, leaf manifest, root metadata, mirror and env-table checks and the README greps run, Then the link check reports `0 broken`, the leaf check prints `leaf-manifest.json OK`, root metadata prints `failed=0`, the mirror check prints `PASS`, the env table matches with 8 data rows, and every README grep prints nothing | Each check's line and the empty greps (T007 to T009, T013, T028, T029, T049). Observed: links `7678 files, 15239 links checked, 0 broken`; `leaf-manifest.json OK`; root metadata `checked=14 passed=14 failed=0`; mirror `PASS: 260 mirrors`; env table `matches the code.` with 8 generated rows; every README `BODY` grep printed nothing (T007 to T009, T013, T021, T028, T029, T032, T049) | Met | - |
| AC-013 | REQ-013 | Given the 22 workflows edited, When the js-yaml count and `git grep -l ONNXRUNTIME -- .github` run, Then the count prints `workflows=35 parse_errors=0 onnx_env=0` and the grep prints nothing | The count line and the empty grep (T039, T040). Observed: `workflows=35 parse_errors=0 onnx_env=0` and `git grep -l ONNXRUNTIME -- .github` printed nothing (T039, T040) | Met | - |
| AC-014 | REQ-014 | Given the conductor's yes, When `npm ci --offline --no-audit --no-fund` runs in `R/`, `K/` and the deep-loop folder, Then each exits 0, `@huggingface` and `onnxruntime-node` are absent from the two `node_modules`, and both typechecks and the shared tests still exit 0 | The three exit statuses, the `ls` count and the rerun results (T053). Observed: the conducting session reports `npm ci` exit 0 in `R/`, `K/` and the deep-loop folder after the operator's yes, and does not record the flags; this record observed the `ls` check print two `No such file` lines, both typechecks exit 0 and the shared tests exit 0 with 9 of 9 (T053); phase commit `1f85a9dd6dd` | Met | - |
| AC-015 | REQ-015 | Given the phase commit, When the T052 boundary diff, the comment-id grep and repo mode run, Then the diff and the grep print nothing and repo mode lists no path this phase deleted | The empty outputs and the repo-mode JSON (T051, T052). Observed: the T052 boundary `git diff --stat` and the id grep printed nothing; repo mode lists none of the 55 deleted paths (T051, T052) | Met | - |

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

All fifteen rows are Met. AC-014 closed with T053, after the operator's `npm ci`. The other fourteen rows were verified on the working tree before the phase commit, `1f85a9dd6dd`, which records that tree. Goal criterion 4 reads with the residue check excluded, as `plan.md` ADR-011 records.
<!-- /ANCHOR:closure -->
