---
title: "Tasks: Phase 2: exempt-and-rewrite-guard"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "exempt and rewrite guard tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: exempt-and-rewrite-guard

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`SS` is `.skilled/skills/sk-doc/shared/scripts/`. `L` is `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json`. `G` is `SS/doc-rewrite-guard.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the replay fixture: find the base `diff-1.patch` applies to and record it (`specs/sk-doc/066-skill-readability-refinement/013-system-spec-kit/scratch/diff-1.patch`). Verify: `git apply --check` against a worktree at that base exits 0, and the base sha is logged in `goal.md` section 4. Evidence: `diff-1.patch` applies at `16e06ed2c6` with `git apply --cached --check`, exit 0; logged in `goal.md` section 4.
- [x] T002 Capture the pre-change outputs: the 13-skill strict loop, `validate_document.py` on `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md`, and a read-call scan for `.md` literals in `check-rule-copies.js`. Verify: each output is saved under `scratch/` and logged. Evidence: `scratch/baseline/strict-loop.txt` (13 of 13 exit 0) and `strict-loop-full.txt`, `dashboard-validate.txt` (one `render_h2_numbering`), `check-rule-copies-reads.txt` (one read, through `resolvePin(relPath)`, so a literal-path scan misses it).
- [x] T003 [P] List every exempt rule copy. Verify: `rg -n "FORMAT_SPEC_FILES|style-reference|def load_render_exempt|exempt" SS/validate_document.py .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py` output is logged. Evidence: `scratch/baseline/exempt-copies.txt`, 28 lines across the validator, the packager and `scope-gate.py`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the exempt and pinned loader in `SS` with doc-exists and consumer-names-doc checks (item 5, REQ-001, REQ-002). Verify: `python3 -m pytest -q` on its test file passes the entry matrix, and a ledger copy with a missing doc key exits non-zero naming the key. Evidence: `shared/scripts/render_exempt.py` with `check_ledger`, `load_exempt`, `load_pinned` and `--check`; `test_render_exempt.py` covers the entry matrix; `--check` on a ledger with a missing doc key exits 1 naming it. The real ledger first reported one bad entry, the contract snapshot, whose consumer never names it; its consumer is now `review-mode-contract.yaml`, which names the path. `--check` prints `8 exempt, 2 pinned, 0 problems`.
- [x] T005 Move the DESIGN.md and style-reference skips in `SS/validate_document.py` into the exempt map with their consumers, and make the validator call the loader and label exempt findings with the consumer (REQ-001, REQ-006). Verify: `python3 SS/validate_document.py .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md` names the consumer next to `render_h2_numbering`. Evidence: the Style Reference skip left `should_exclude_path` and its two DESIGN.md files joined the exempt map with `apply-design-md.cjs`; per the operator, the five `FORMAT_SPEC_FILES` stay a validator skip because no code file reads them. The dashboard prints `Exempt: read by system-deep-loop/deep-research/scripts/reduce-state.cjs` and labels `render_h2_numbering`; `--json` carries `exempt_consumer` and `--fix` refuses an exempt doc.
- [x] T006 Replace `load_render_exempt` in `package_skill.py` with the loader (REQ-001). Verify: the 13-skill strict loop output matches the T002 capture. Evidence: `load_render_exempt` removed, `_render_findings` calls `render_exempt.load_exempt()`; the strict loop output matches `scratch/baseline/strict-loop.txt`.
- [x] T007 Point `scope-gate.py` at the loader (REQ-001). Verify: a rerun on one finished 066 leaf prints the same `render_warnings` line as before. Evidence: `scope-gate.py` imports `render_exempt`; on the first leaf it printed `files=17 render_warnings=0 invalid=0 advisory=15` before and after; all 55 leaves still `render_warnings=0 invalid=0`.
- [x] T008 Add the `pinned` list to `L`, starting with `sk-code/shared/references/universal/code-quality-standards.md` and `sk-code/sk-code-review/references/review-core.md`, and add the advisory read-call scan (REQ-003, REQ-007). Verify: the scan lists both docs and reports no unlisted pinned doc, or logs each one it finds. Evidence: `pinned` lists both docs with `check-rule-copies.js`; `--scan-pinned` prints both as `PINNED-UNSEEN` (read through `resolvePin(relPath)`, a computed path) and finds no literal-path candidate.
- [x] T009 Write `G` with the hard checks (frontmatter beyond `version`, fenced blocks, citations, cited H2 numbers and anchors, exempt and pinned docs) and the advisory checks (lost lines, intro diff), ported from the seven 066 scratch tools (REQ-004). Verify: `python3 G --help` exits 0 and each check has a bad and a good pytest pair. Evidence: `shared/scripts/doc-rewrite-guard.py`; `--help` exits 0; `test_doc_rewrite_guard.py` has a bad and a good case per check.
- [x] T010 Add the replay test (REQ-005). Verify: the guard run on the T001 base with `diff-1.patch` applied reports `.skilled/skills/system-spec-kit/shared/parsing/README.md`, and on an unchanged tree prints no finding and exits 0. Evidence: `test_replayed_rewrite_is_reported` rebuilds the 56 patched files at `16e06ed2c6`, sees `0 hard, 0 advisory` unchanged, then after `diff-1.patch` names `shared/parsing/README.md` with the rewritten line; skipped when the base commit is absent.
- [x] T011 [P] Add a "refine existing docs" step that runs `G` to the Update Workflow in `sk-create-skill/references/skill/examples-and-maintenance.md` and to `creation-workflow.md` (REQ-008). Verify: `rg -n "doc-rewrite-guard.py" .skilled/skills/sk-doc/sk-create-skill/references/skill/` prints a line in each file. Evidence: `rg` prints `examples-and-maintenance.md:171` (new Update Workflow step 4) and `creation-workflow.md:406`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the full sk-doc suites from the final state. Verify: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed` and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0`. Evidence: `all sk-doc script tests passed`; sk-create-skill node suite pass 108, fail 0.
- [x] T013 Run the 13-skill strict loop, the compiled-route suite and the snake-case guard. Verify: 13 of 13 exit 0, `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`, and `python3 SS/check_no_new_snake_case.py --changed-since <phase start sha>` prints nothing. Evidence: strict loop 13 of 13 exit 0 (55 of 55 with modes); compiled-route pass 101, fail 0; `check_no_new_snake_case.py --changed-since 1fcb6ad54a` prints PASS.
- [x] T014 Orchestrator reads the whole diff, then an independent opus-medium review runs before the phase commit. Verify: the review verdict and the diff range are logged in `goal.md` section 4. Evidence: the orchestrator read the diff and fixed one line-number bug; the opus-medium review returned FIX with 3 P1 and 6 P2; the P1s and five P2s were fixed and one P2 kept with its reason, logged in `goal.md` section 4.
- [x] T015 Validate the packet. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard --strict` prints `RESULT: PASSED`. Evidence: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` Evidence: T001 to T015 are `[x]`.
- [x] No `[B]` blocked tasks remaining Evidence: no `[B]` marker.
- [x] Manual verification passed Evidence: the replay, a pinned-doc edit and the strict loop were run by hand.
- [x] Every row in `acceptance-criteria.md` is Met Evidence: every row is Met except AC-001, Superseded by ADR-003 and replaced by AC-014.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review report**: See `../scratch/review-report.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked P0 task stops the phase. A blocked P1 task needs a recorded reason in `goal.md` section 4 and operator approval.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md, each tied to a review item Evidence: REQ-001 to REQ-008 each cite a review item.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: `plan.md` holds the approach and ADR-001 to ADR-003.
- [x] CHK-003 [P1] Baselines from T001 logged in `goal.md` section 4 Evidence: the Setup row in `goal.md` section 4.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `python3 -m py_compile` on the loader, `doc-rewrite-guard.py`, `validate_document.py` and `package_skill.py` exits 0 Evidence: `py_compile` exit 0.
- [x] CHK-011 [P0] `python3 -c "import json;json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))"` exits 0 Evidence: the ledger parses; `render_exempt.py --check` reads it.
- [x] CHK-012 [P1] The guard prints file, rule and line for every finding Evidence: every line has the form `HARD|ADVISORY <kind> <file>[:<line>]: <detail>`.
- [x] CHK-013 [P1] No ephemeral ids in code comments: `rg -n "REQ-|ADR-|T0[0-9]{2}" .skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` prints nothing Evidence: `rg` over the guard and the loader prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion in `acceptance-criteria.md` is Met Evidence: every row Met, AC-001 Superseded with ADR-003.
- [x] CHK-021 [P0] Each loader rule and guard check has a bad and a good test Evidence: `test_render_exempt.py` and `test_doc_rewrite_guard.py` pair each rule and check.
- [x] CHK-022 [P1] Missing doc, missing consumer and consumer-without-name cases tested Evidence: missing doc, missing consumer, consumer without the name and a generic name without its folder are tested.
- [x] CHK-023 [P1] The replay of `diff-1.patch` is reported and an unchanged tree is quiet Evidence: `test_replayed_rewrite_is_reported`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: class-of-bug for the three exempt copies; algorithmic for the guard checks; cross-consumer for the loader read by the validator, the packager, `scope-gate.py` and the guard.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg "def load_render_exempt|exempt"` over sk-doc scripts lists only the loader and its callers.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: callers of the exempt map are the validator, the packager, `scope-gate.py`, the guard and the ratchet fixture; each was run.
- [x] CHK-FIX-004 [P0] Path handling in the loader and guard includes outside-root, missing-file, no-op and fallback table tests. Evidence: absolute, `../`, missing-file and clean-ledger cases for the loader; unknown base, unchanged tree, added, renamed and subdirectory runs for the guard.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: loader matrix is entry kind (exempt, pinned) by rule (doc, consumer, names doc, reason, keys, both lists); guard matrix is six checks by bad and good.
- [x] CHK-FIX-006 [P1] N/A unless a test reads process-wide state, in which case a hostile env variant runs. Evidence: the guard tests strip git redirect variables from the environment, the replay included.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: the diff over `1fcb6ad54a`, landed in the phase commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the changed files Evidence: a grep of the added lines for key, secret and password prints nothing.
- [x] CHK-031 [P0] The loader rejects a doc or consumer path outside the repository root Evidence: absolute and `../` doc and consumer paths are rejected in tests.
- [x] CHK-032 [P1] N/A: no auth surface Evidence: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md name the same checks and files Evidence: spec, plan and tasks name the loader, the guard, the pinned list and the two workflow docs.
- [x] CHK-041 [P1] Code comments state the durable why for each guard check Evidence: each check function opens with a docstring giving the reason.
- [x] CHK-042 [P2] The ledger description names the pinned list Evidence: the ledger description names the pinned list and the loader.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: replay experiments ran under the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/runs/` removed; `scratch/` keeps the briefs, `dispatch.sh` and `baseline/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section Evidence: `plan.md` ARCHITECTURE DECISION RECORD holds ADR-001 to ADR-003.
- [x] CHK-101 [P1] ADR-001 and ADR-002 carry a status Evidence: each ADR carries a status.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale Evidence: each ADR lists rejected alternatives with a reason.
- [x] CHK-103 [P2] N/A: no migration path Evidence: N/A.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] The guard on one skill diff finishes under 30 seconds (NFR-P01) Evidence: the guard on sk-doc over `HEAD~4` took 3 s.
- [x] CHK-111 [P1] The guard on an unchanged tree reports 0 hard findings (NFR-R01) Evidence: an unchanged tree prints `0 hard, 0 advisory`.
- [x] CHK-112 [P2] N/A: no load testing Evidence: N/A.
- [x] CHK-113 [P2] Guard wall time on the replay logged in `goal.md` section 4 Evidence: replay 0.89 s, logged in `goal.md` section 4.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback is one `git revert` of the phase commit Evidence: the code lands in one phase commit, so one revert restores the prior state.
- [x] CHK-121 [P1] The guard honors the sk-doc validation switch like the other shared scripts Evidence: `SKDOC_SKIP_VALIDATION=1` makes the guard print its skip line and exit 0.
- [x] CHK-123 [P1] N/A: no runbook, the gate command is the runbook Evidence: N/A.
- [x] CHK-124 [P2] N/A: no deployment Evidence: N/A.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Independent opus-medium review completed before commit Evidence: opus-medium review before the commit, logged in `goal.md`.
- [x] CHK-131 [P1] No new dependency added Evidence: both new scripts use the standard library only.
- [x] CHK-132 [P2] N/A: no web surface Evidence: N/A.
- [x] CHK-133 [P2] N/A: no user data Evidence: N/A.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized Evidence: spec, plan, tasks, acceptance criteria and the implementation summary agree.
- [x] CHK-141 [P1] The Update Workflow and creation-workflow name the same guard command Evidence: both docs give `doc-rewrite-guard.py --base HEAD <skill-folder>`.
- [x] CHK-142 [P2] N/A: no user-facing doc beyond the sk-create-skill docs Evidence: N/A.
- [x] CHK-143 [P2] The pinned entries and scan output logged for phase 003 Evidence: the Guard timing and pinned record row in `goal.md` section 4.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Operator, approves the phase commit | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
