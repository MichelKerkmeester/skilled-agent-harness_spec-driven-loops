---
title: "Tasks: Phase 39: hub-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli classifier cleanup tasks"
  - "rename and repoint tasks"
  - "version sweep tasks"
  - "deem playbook tasks"
  - "cleanup verification checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 39: hub-cleanup

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

`C` is `.skilled/skills/cli-classifier/`. `H` is the packet folder after the rename, `C/cli-jev/`. `N` is the design note under `scratch/` (proposed: `scratch/design/notes.md` and `scratch/design/version-table.md`). The plan's seven phases map onto the three sections below: the design phase (plan phase 1) sits in Phase 1, the rename, version and playbook phases (plan phases 2 to 4) in Phase 2, and the regenerate, review and closure phases (plan phases 5 to 7) in Phase 3. Every batch is written by DeepSeek V4.1 Flash and reviewed by MiMo v2.6 Pro, with the reverse for any MiMo fix (parent goal D5, this phase's D6). Every check runs from the start HEAD or the final state. No task is `[x]` while the phase is Planned.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Design read, executor DeepSeek V4.1 Flash (D6). Read every file in `scratch/context/refs.txt` (53 paths) at the start HEAD, one by one, and classify each `cli-usage` hit as a path to repoint or an alias to keep. Read the compiled-routing build at `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs` and the Hermes sync at `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, and fix each regeneration command. Fix the version table from the version grep over `C`, naming the source line and the target for every field, including the six changelog renames. Outline the `cli-deem/manual-testing-playbook/` scenarios: the health-check gate, each judgment type and the dormant path, each on a stub or a refused call. Write it all in `N`. Check: the note gives all 53 paths a verdict, the table covers every version field the grep reads with its source line, the outline names each scenario and its stub, the regeneration commands are named, and the read-only sources are unchanged.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Rename and repoint, executor DeepSeek V4.1 Flash (D6), after T001. `git mv C/cli-usage H`, set the frontmatter `name: cli-jev` in `H/SKILL.md`, set `C/mode-registry.json` lines 60-61 and 76 to `cli-jev`, set `C/hub-router.json` lines 19-20 to `cli-jev/SKILL.md`, set `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:46` to `packetPath: 'cli-classifier/cli-jev'`, and repoint the routing build's source map at lines 66-70. Keep `cli-usage` in the mode registry alias list and in the `hub-router.json` vocabulary at line 37. Repoint each live reference T001 marked as a path, including `dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs` and the 038 Planned docs. Leave every alias and every closed spec folder as written (D1, D3). Check: `H/SKILL.md` exists, `cli-usage/` does not, the routing replay answers mode `cli-jev` for a `cli-usage` prompt, and the path grep prints nothing outside `specs/` and benchmark reports once T005 regenerates the artifacts.
- [ ] T003 [P] Versions, executor DeepSeek V4.1 Flash (D6), after T001. Apply the T001 table to every version field in `C`: hub `SKILL.md:5`, `mode-registry.json:4`, `description.json:4`, `ROUTER.md:12` and `hub-router.json:3` to `0.5.0.0`, hub `README.md:8` to `0.4.0.0` (proposed) and its table at lines 86-88, the Jev packet `SKILL.md:5` to `0.1.2.0`, its `README.md:15` to `0.1.0.3` (proposed) and its two benchmark READMEs at lines 10 and 9 to `0.1.0.0` (proposed), cli-deem `SKILL.md:5` and `README.md:8` to `0.1.0.0`, and every other field in the table. `git mv C/changelog/v1.0.0.0.md`, `v1.1.0.0.md` and `v1.2.0.0.md` to `v0.3.0.0.md`, `v0.4.0.0.md` and `v0.5.0.0.md`, and `C/cli-jev/changelog/v1.0.0.0.md`, `v1.0.1.0.md` and `v1.0.2.0.md` to `v0.1.0.0.md`, `v0.1.1.0.md` and `v0.1.2.0.md`, plus `C/cli-deem/changelog/v1.0.0.0.md` to `v0.1.0.0.md`. Retitle each renamed file, update the hub `SKILL.md:158` and cli-deem `README.md:150` links and keep the history (D2). Check: the version grep over `C` finds no value at or above `1.0.0.0`, the renamed changelog files exist and every link resolves.
- [ ] T004 [P] Deem playbook, executor DeepSeek V4.1 Flash (D6), after T001. Author `C/cli-deem/manual-testing-playbook/` through sk-doc's sk-create-manual-testing-playbook mode, modelled on the Jev packet's playbook at `H/manual-testing-playbook/`, covering the health-check gate, each judgment type and the dormant path. Every scenario runs on a stub or a refused call, so none needs a served model (D4). Check: `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/cli-deem/manual-testing-playbook` prints status PASS, and no scenario reads a served model.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Regenerate and gate, executor the orchestrating session, after T002, T003 and T004. Run the compiled-routing build, the leaf-manifest generator and the Hermes sync from the edited tree, then run `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs .skilled/skills/cli-classifier` and `sync-skills-hermes.cjs --check`, the path grep and the version grep, then `validate.sh --strict` on this phase. Record every result line under `scratch/verify/`. Check: each gate prints its own PASS line or exits 0, the path grep prints nothing outside `specs/` and benchmark reports, the version grep finds nothing at or above `1.0.0.0`, the playbook validator prints PASS, and `validate.sh --strict` prints `RESULT: PASSED`.
- [ ] T006 Cross-family review, executor MiMo v2.6 Pro (D6), after T005. Review every DeepSeek diff read-only, and DeepSeek reviews any MiMo fix. Write one review file under `scratch/verify/`. Check: one verdict per batch, every P0 and P1 finding named with file and line, each review's file hashes equal before and after the read, and every P2 finding is recorded in `implementation-summary.md` under Known Limitations.
- [ ] T007 Closure, executor the orchestrating session (D6), after T006. Run the five proof commands from the final state and read each result line. Record them in `goal.md`'s log and `acceptance-criteria.md`, tick each criterion from its evidence, and rewrite `implementation-summary.md` with the build, the review and the proof results. Refresh the derived metadata with `repair-derived.cjs --folder <this phase> --apply`, then run `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: the five criteria in `goal.md` pass from the final state, `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, `goal.cjs packet` prints `packet_durable_chars` at or under 4000, and the commit is path-scoped.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it.
- [ ] No `[B]` blocked task remains.
- [ ] Manual verification passed: the 53 `refs.txt` hits were each read and classified before their edit, and the five proof commands run from the final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Sources**: `scratch/context/context.md` and `scratch/context/refs.txt`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-009. Planned: `spec.md` section 4.
- [ ] CHK-002 [P0] Technical approach defined in plan.md with the seven phases and their checks. Planned: `plan.md` section 4.
- [ ] CHK-003 [P1] Dependencies identified and available: the two context files, the generation tools, the gates and the parent D5 executors. Planned: `plan.md` section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The path grep prints nothing outside `specs/` and benchmark reports, and `cli-usage/` no longer exists. Planned: REQ-001 and REQ-002.
- [ ] CHK-011 [P0] The version grep over `.skilled/skills/cli-classifier/` finds no field at or above `1.0.0.0`. Planned: REQ-003.
- [ ] CHK-012 [P1] A `cli-usage` prompt still routes to mode `cli-jev`, and `cli-usage` stays in the alias vocabulary and the mode registry alias list. Planned: REQ-001.
- [ ] CHK-013 [P1] No generated artifact was hand-edited: the compiled routing, the leaf manifest and the Hermes copies come from their generators. Planned: REQ-005.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`.
- [ ] CHK-021 [P0] `validate-playbook-package.cjs` prints PASS on `cli-deem/manual-testing-playbook`. Planned: T004.
- [ ] CHK-022 [P1] `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs` and `sync-skills-hermes.cjs --check` pass. Planned: T005.
- [ ] CHK-023 [P1] The Deem playbook runs no served model: every scenario uses a stub or a refused call. Planned: REQ-004.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Planned: this is a cleanup phase, so the rename is one class over the live references and the version sweep is one class over the version fields.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Planned: `plan.md`'s FIX ADDENDUM records the 13 full-path producers and the 53 alias hits from `refs.txt`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed paths, policies, schema fields, docs and tests. Planned: `plan.md`'s FIX ADDENDUM names the routing consumers, the changelog links and the two dispatch tests.
- [ ] CHK-FIX-004 [P0] Path renames include adversarial table tests for the old path, the new path and the alias. Planned: the routing replay covers a `cli-usage` prompt and a `cli-jev` prompt, and the path grep covers the whole tree.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Planned: `plan.md`'s FIX ADDENDUM lists the three changes, two executors and two artifact classes, with the authoring totals.
- [ ] CHK-FIX-006 [P1] Hostile env or global-state variant executed when tests or code read process-wide state. Planned: not applicable. The changes are paths, versions, docs and generated artifacts, and no changed file reads new process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the start HEAD or the build commit, not a moving branch-relative range. Planned: T005 and T007 record the start HEAD, the build commit and each output under `scratch/verify/`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any changed file. Planned: no changed file carries a key, and the Jev call path is unchanged.
- [ ] CHK-031 [P0] No `.env` file is read, written or printed by any changed file. Planned: REQ-006.
- [ ] CHK-032 [P1] The playbook scenarios reach no served model, and the Deem server is not called. Planned: REQ-004 and NFR-P02.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Planned: the closure pass updates all four in one pass.
- [ ] CHK-041 [P1] No changed file embeds a spec path, phase number or requirement id in a code comment. Planned: the changed scripts are read-only repoints, and the hygiene check runs in the broad comment-hygiene gate the repo already has.
- [ ] CHK-042 [P2] The renamed changelog files keep their history and every link to them resolves. Planned: T003.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files and the design note stay in `scratch/` only. Planned: T001 and T005.
- [ ] CHK-051 [P1] The proof outputs stay under `scratch/verify/`, and the two context files stay in `scratch/context/`. Planned: T005 and T007.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending. This phase is Planned, so no row carries observed evidence yet.
<!-- /ANCHOR:summary -->

---
