---
title: "Tasks: sk-code Alignment & Drift Guards"
description: "Task breakdown for the RESOURCE_MAP doc-truth fix, the qualifiedIdToLeaf bijection test, the run-all-drift-guards.sh orchestrator, and the additive surfaceBundle request-context (Planned)."
trigger_phrases:
  - "sk-code alignment tasks"
  - "drift guards task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: sk-code Alignment & Drift Guards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

**Focus**: Doc-truth + authority interface groundwork.

- [ ] T001 Rename the RESOURCE_MAP-equality claim in `code-opencode/SKILL.md` (~L45, L51) to name `sk-code-router-sync.vitest.ts` explicitly.
- [ ] T002 Add a backlink to `sk-code-router-sync.vitest.ts` in `alignment-verification-automation.md §5` (~L48-52).
- [ ] T003 Publish the single code-opencode alignment-authority interface note (CF-SC-5): what this child owns, what 009/010/011 must consume instead of re-deriving.

**Evidence**: `grep -n "sk-code-router-sync.vitest.ts" code-opencode/SKILL.md alignment-verification-automation.md` returns hits in both files; no remaining sentence attributes RESOURCE_MAP-equality enforcement to `verify_alignment_drift.py` alone.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Focus**: Bijection proof + guard unification.

- [ ] T004 [B: T001-T003] Add `qualifiedIdToLeaf` to `leaf-resource-contract.cjs`, exposed via `selectResourceContract`.
- [ ] T005 Add a bidirectional Vitest suite: every compiled `targetQualifiedIds` entry resolves to a `leaf-manifest.json` leaf; every code-opencode RESOURCE_MAP entry matches a manifest leaf after normalization.
- [ ] T006 [P] Author `run-all-drift-guards.sh` invoking `verify_alignment_drift.py`, `verify_stack_folders.py`, and the `sk-code-router-sync.vitest.ts` suite in sequence; non-zero exit on any failure.
- [ ] T007 Update `code-opencode/SKILL.md`'s gate list (~L163) to name all three guard commands.

**Evidence**: the bijection suite reports zero orphans in both directions; `run-all-drift-guards.sh` exits non-zero when any one guard is seeded to fail, and 0 when all three pass.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Focus**: Stretch — markdown gate + surfaceBundle context (P1), then final verification.

- [ ] T008 [P1] Add `--check-router` (default off) to `verify_alignment_drift.py`: a markdown RESOURCE_MAP parser scoped to RESOURCE_MAP tables.
- [ ] T009 [P1] Add a positive fixture (aligned RESOURCE_MAP) and a drift fixture (seeded mismatch) for `--check-router`.
- [ ] T010 [P1][B: 002] Extend the promoted runtime request contract (post-002) with an additive optional composite-routing context field.
- [ ] T011 [P1][B: T010] Add one LUNA-high compiled-routing playbook case requiring a `surfaceBundle` containing `sk-code:code-opencode`.

**Evidence**: default (no-flag) `verify_alignment_drift.py` invocation is byte-behavior-identical to today; `--check-router` passes the positive fixture and fails the drift fixture; the LUNA-high case's recorded `surfaceBundle` includes `sk-code:code-opencode`.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T012 Re-hash the three frozen scorer files before and after this child's full diff; confirm unchanged.
- [ ] T013 Run `validate.sh --strict` on this child folder.
- [ ] All P0 requirements (REQ-001..REQ-004) implemented and evidenced.
- [ ] P1 requirements (REQ-005, REQ-006) implemented or explicitly deferred with user approval.
- [ ] No routing decision changed anywhere in this child's diff.

**Evidence**: pre/post SHA-256 identical for `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`; `validate.sh --strict` reports Errors: 0.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream evidence**: `../001-research/synthesis-v1.md` §2.6, `../001-research/verification-v1.md`, `../001-research/review-v1.md` §4

<!-- /ANCHOR:cross-refs -->
