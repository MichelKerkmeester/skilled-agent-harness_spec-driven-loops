---
title: "Tasks: CI Cleanup and Pi Gate-3 Live Proof"
description: "Task list and verification checklist for phase 050, the CI cleanup across six surfaces and the Pi Gate-3 live proof"
trigger_phrases:
  - "pi gate-3 live proof"
  - "ci cleanup pi proof"
  - "cli-jev run keyword"
  - "scorer baseline ratchet"
  - "hermes mirror drift"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CI Cleanup and Pi Gate-3 Live Proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Worktree and scaffold - **Evidence**: worktree `.worktrees/061-ci-cleanup-pi-proof` on branch `worktrees/061-ci-cleanup-pi-proof` from base commit `1cc5dfa692`, recorded in `evidence/dispatch/evidence.md`.
- [x] T002 Pre-change baseline - **Evidence**: the committed scorer baseline `152/195` full corpus and `27/32` memory_save captured at `a9c4bc0abc`, plus the pre-change `run-all-drift-guards.sh` baseline of nine errors, both recorded in `evidence/dispatch/evidence.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Pi headless probe - **Evidence**: `pi -p --offline` under `AI_SESSION_CHILD=0 SYSTEM_SPEC_GATE_ENFORCE=0` returned `pi_rc=0` with stdout exactly `HEADLESS PROBE ACK`, and `evidence/pi-headless-delivery-marker.json` records status open with questionDeliveredChannel classify-deferral and questionDeliveredCount 1 (captures in `evidence/pi-headless-*.txt`).
- [x] T004 Pi TUI drive - **Evidence**: `evidence/pi-tui-select.txt`, `evidence/pi-tui-input.txt`, `evidence/pi-tui-final.txt` and `evidence/pi-tui-state.json` record the select dialog, the path input, the first write refused with the bound-folder message, a passing retry and later edits with no second question, and the state file status satisfied with the bound path.
- [x] T005 Hermes and compiled contract regen - **Evidence**: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` reports PASS with 70 Hermes skill copies in sync at exit 0, and the deep-loop contract tests `check-contract-drift` and `render-command-contract` report 2 files and 42 tests passed at exit 0.
- [x] T006 cli-orca frontmatter - **Evidence**: `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh . --coverage` reports docs=101 violations=0 at exit 0 after the 14 cli-orca docs moved from `contextType: reference` to `contextType: general`.
- [x] T007 Graph metadata and sibling edges - **Evidence**: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` reports VALIDATION PASSED with 15 discovered and 1 route-excluded at exit 0, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` reports checked=15 fresh=15 stale=0 errored=0 at exit 0.
- [x] T008 Six link repoints - **Evidence**: `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 7834 files, 13510 links and 0 broken at exit 0, where the earlier run reported 2 broken at exit 1, after six broken links were repointed to their `z_archive/` locations.
- [x] T009 recursive-child-manifest paths - **Evidence**: the two hardcoded `.opencode/specs` paths in `recursive-child-manifest.vitest.ts` now point at the tracked `specs/` tree, and `npx vitest run --config ../../vitest.config.ts --project cli tests/recursive-child-manifest.vitest.ts` in `.skilled/skills/system-spec-kit/runtime/cli` reports 1 file and 2 tests passed at exit 0. The clean full CLI re-run reports 1441 tests passed at exit 0.
- [x] T010 Scorer root cause - **Evidence**: the git-archive experiments in `evidence/dispatch/evidence.md` record clean base 151/26, base with this phase's cli-jev edge 151/26, base without cli-jev 152/27 and base without the SKILL.md `run` keyword 152/27, which isolates the bare `run` keyword in cli-jev as the cause.
- [x] T011 cli-jev "run" removal and Hermes regen - **Evidence**: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-jev` reports OK with all hard invariants passed at exit 0, and `node .skilled/bin/compiled-route-admission.cjs --hub cli-jev` reports pass with 3 pass 0 drift 0 stale at exit 0. A re-score after the fix reports 152/195 full corpus and 27/32 memory_save, with row 26 routing to system-deep-loop.
- [x] T012 Baseline restore - **Evidence**: the system-skill-advisor runtime vitest run over `routing-registry-drift-guard`, `routing-parity-deep-skills`, `routing-parity-deep-council` and `parity/scorer-eval-baseline-ratchet` reports 4 files and 28 tests passed with the ratchet 7/7 at exit 0, and a fresh scorer capture equals the committed baseline on every metric and every fixture hash.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Packet docs and parent records - **Evidence**: the six packet docs were filled in wu5 and revised in wu8, the parent spec.md gained row 50 and the 049 to 050 handoff row in wu6, 048 gained its live-proof row in wu7, and `repair-derived.cjs --apply` added 050 to the parent `children_ids`.
- [x] T014 Strict validation - **Evidence**: `validate.sh --strict` printed RESULT: PASSED with 0 errors and 0 warnings on this packet and on 048.
- [ ] T015 Merge main and re-mint cli-jev
- [ ] T016 Merged-tree re-verification
- [ ] T017 Commit, push, CI watch and worktree removal
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The scope is stated before any fix: the Gate-3 dialog held no live Pi proof and six CI surfaces were red - **Evidence**: the problem and purpose sections of `evidence/dispatch/evidence.md` record the 048 fake-ExtensionAPI suite result 9/9 and name all six surfaces with the workflow each one feeds.
- [x] CHK-002 [P0] A pre-change baseline is captured before the first edit - **Evidence**: the committed scorer baseline `152/195` and `27/32` captured at `a9c4bc0abc` and the nine pre-existing `run-all-drift-guards.sh` errors that match the HANDOVER pre-change baseline, both recorded in `evidence/dispatch/evidence.md`.
- [x] CHK-003 [P1] The scorer drop is root-caused at the producer before the baseline is restored - **Evidence**: the four git-archive experiments in `evidence/dispatch/evidence.md` (clean base 151/26, base with this phase's cli-jev edge 151/26, base without cli-jev 152/27, base without the SKILL.md `run` keyword 152/27) isolate the cli-jev keyword as the cause.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The Hermes skill copies and the compiled deep-loop command contract are regenerated and in sync - **Evidence**: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` reports 70 copies in sync at exit 0, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` reports 33 prompts in sync at exit 0, and the deep-loop contract tests report 42 tests passed at exit 0.
- [x] CHK-011 [P0] Skill doc frontmatter is clean across the tree - **Evidence**: `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh . --coverage` reports docs=101 violations=0 at exit 0.
- [x] CHK-012 [P0] Skill graph metadata validates and the derived entries are fresh - **Evidence**: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` reports VALIDATION PASSED at exit 0 and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` reports checked=15 fresh=15 stale=0 errored=0 at exit 0.
- [ ] CHK-013 [P1] main is merged and cli-jev's compiled-routing manifest is re-minted so the guard reports fresh and CJ-001 routes compiled
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The Pi Gate-3 contract holds in a live headless parent-mode run - **Evidence**: `pi -p --offline` under `AI_SESSION_CHILD=0 SYSTEM_SPEC_GATE_ENFORCE=0` returns `pi_rc=0` with stdout exactly `HEADLESS PROBE ACK`, `evidence/pi-headless-delivery-marker.json` records status open with questionDeliveredChannel classify-deferral and questionDeliveredCount 1, and no spec-gate state residue remains.
- [x] CHK-021 [P0] The Pi Gate-3 contract holds in a live TUI run - **Evidence**: `evidence/pi-tui-select.txt`, `evidence/pi-tui-input.txt`, `evidence/pi-tui-final.txt` and `evidence/pi-tui-state.json` show the select dialog, the path input, the first write refused with the bound-folder message, a passing retry and later edits with no second question, and the state file status satisfied with the bound path.
- [x] CHK-022 [P1] The Markdown link surface is green - **Evidence**: `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` reports 7834 files, 13510 links and 0 broken at exit 0, where the earlier run reported 2 broken at exit 1.
- [x] CHK-023 [P1] A clean full run of the spec-kit CLI project passes - **Evidence**: `npx vitest run --config ../../vitest.config.ts --project cli` in `.skilled/skills/system-spec-kit/runtime/cli` reports 143 files passed and 3 skipped, 1441 tests passed and 19 skipped of 1460, at exit 0.
- [ ] CHK-024 [P1] The merged-tree re-verification of Hermes sync, the scorer ratchet, the link check and the route guard passes before any push
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each fix lands at the surface that owns the wrong bytes rather than at the checker - **Evidence**: frontmatter corrected in the 14 cli-orca docs, graph metadata corrected in the skill `graph-metadata.json` files with reciprocal sibling edges, links repointed at their sources, test paths corrected in `recursive-child-manifest.vitest.ts`, and the keyword removed at cli-jev.
- [x] CHK-FIX-002 [P0] The scorer collision is removed at both producer surfaces and the derived copy is regenerated - **Evidence**: `run` removed from `.skilled/skills/cli-jev/SKILL.md` line 8 Keywords and from `derived.key_topics` in `.skilled/skills/cli-jev/graph-metadata.json`, with `.hermes/skills/cli-jev/SKILL.md` regenerated afterwards.
- [x] CHK-FIX-003 [P0] Consumer impact of the cli-jev change is inventoried and checked - **Evidence**: corpus row 26 routes to system-deep-loop after the fix, row 157 moved from cli-jev to system-spec-kit with no count change, `parent-skill-check.cjs` passes all hard invariants and `compiled-route-admission.cjs --hub cli-jev` passes 3/3.
- [x] CHK-FIX-004 [P0] The scorer comparison is checked at the fixture level rather than by counts alone - **Evidence**: a fresh capture equals the committed baseline on every metric and every fixture hash.
- [x] CHK-FIX-005 [P1] The comparison axes and counts are stated: 195 full-corpus rows and 32 memory_save rows - **Evidence**: live results `152/195` and `27/32` match the committed `152/195` and `27/32` on both axes.
- [x] CHK-FIX-006 [P1] The headless probe proves the real parent classifier ran rather than a stub - **Evidence**: `spec-gate-core.mjs:105` treats a session as a child only when `AI_SESSION_CHILD` is exactly 1 and `spec-gate-core.mjs:1782` enforces only when `SYSTEM_SPEC_GATE_ENFORCE` is exactly 1, so the probe with both at 0 ran the parent classifier in advisory mode.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit artifacts and a base commit rather than a moving range - **Evidence**: every claim above cites an evidence file or a recorded command result and the tree is pinned to base commit `1cc5dfa692`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The scorer experiments run on git-archive copies so the worktree and its gates stay untouched - **Evidence**: the experiments section of `evidence/dispatch/evidence.md` records scratch copies with the worktree untouched, and `scorer-eval-baseline.json` was restored to its committed content rather than relaxed.
- [x] CHK-031 [P0] The live probes write nothing outside their scratch paths and leave no residue - **Evidence**: the probe files were removed afterwards, `docs/hermes-notes.md` is absent, and no spec-gate state residue was found after the headless run.
- [x] CHK-032 [P1] The refused TUI write is recorded for audit - **Evidence**: `evidence/pi-tui-warning.log` records a would-deny for write `docs/gate3-probe.md` at 2026-09-22T15:10:47Z.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The packet validates strict with RESULT: PASSED and the parent records are reconciled - **Evidence**: `validate.sh --strict` on this packet printed RESULT: PASSED with 0 errors and 0 warnings. The parent spec.md carries row 50 and the 049 to 050 handoff row, and the parent `graph-metadata.json` lists 050 in `children_ids`.
- [x] CHK-041 [P1] cli-jev's documentation and metadata agree after the keyword removal - **Evidence**: the keyword is gone from `SKILL.md` line 8 and from `derived.key_topics` in `graph-metadata.json`, and the Hermes `SKILL.md` copy is regenerated to match.
- [x] CHK-042 [P2] The worktree environment note is recorded for the missing shared library link - **Evidence**: the gitignored link `shared -> ../../../system-spec-kit/shared` was mirrored from the primary checkout so `parent-skill-check` could load its root-router library, and no tracked file changed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary artifacts live under the packet's `scratch/` directory - **Evidence**: temporary output lived under `scratch/` during the work. The cited captures and the dispatch trail then moved to `evidence/`, because the packet docs cite them and the spec-kit folder rules keep cited files out of `scratch/`.
- [x] CHK-051 [P1] `scratch/` is cleaned before completion - **Evidence**: `scratch/` holds only `.gitkeep` after the captures and the dispatch trail moved to `evidence/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 11/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-23
<!-- /ANCHOR:summary -->

---
