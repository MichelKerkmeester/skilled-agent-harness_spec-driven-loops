---
title: "Tasks: Deterministic Scoring Extensions — Over-Activation Lane + Scenario-Loader Scope"
description: "Task breakdown for the deterministic scoring extensions phase, reconstructed from spec.md. The original tasks.md was never written."
trigger_phrases:
  - "deterministic scoring extensions tasks"
  - "identity-scoped contamination lint tasks"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Deterministic Scoring Extensions — Over-Activation Lane + Scenario-Loader Scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Capture the current rejection of a generic-keyword over-activation negative as `contaminated-fixture` (`contamination-lint.cjs`)
- [ ] T002 Capture `10--intra-routing-recall` loader rows as the byte-identical baseline (`load-playbook-scenarios.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Identity scope

- [ ] T003 Add `scope: 'full' | 'identity'` (default `'full'`, back-compat) to `buildBannedVocab` (`contamination-lint.cjs`)
- [ ] T004 Implement identity scope — ban skill-id, basename, resource-path tokens and private-gold labels, but not intent keywords (`contamination-lint.cjs`)
- [ ] T005 Add the fixture metadata marker that opts a fixture into identity scope
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Over-activation scoring and loader scope

- [ ] T006 Flag an over-fire as a `negativeActivation` failure in deterministic router-mode scoring
- [ ] T007 Emit the `report.overActivation` summary
- [ ] T008 Relax the loader regex to any gold-bearing `.md` (`load-playbook-scenarios.cjs`)
- [ ] T009 Gate inclusion on gold presence (`expected_intent`/`expected_resources`); gold-less files warn, not error
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T010 RED/GREEN vitest: identity scope drops intent keywords, retains id/basename bans
- [ ] T011 RED/GREEN vitest: over-activation fixture scores deterministically in router mode with no network
- [ ] T012 Assert all existing `buildBannedVocab` callers are unchanged under the default `'full'` scope
- [ ] T013 Assert loader output for `10--intra-routing-recall` is byte-identical and back-compat holds
<!-- /ANCHOR:phase-4 -->

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
