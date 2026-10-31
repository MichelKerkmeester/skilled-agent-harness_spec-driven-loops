---
title: "Tasks: Retire the decommissioned code-index tool from the review agents and their documentation"
description: "Ordered task breakdown: canonical sources, regenerated mirrors, playbook and verifier, then the gates."
trigger_phrases:
  - "retire detect_changes tasks"
  - "code-index cleanup tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retire the decommissioned code-index tool from the review agents and their documentation

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Capture the baseline: the mirror verifier reports both review agents in sync before any edit.
- [ ] T002 Record the full site inventory so nothing is missed by a partial search.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Remove the permission grant, the review step and the tool-table row (`.opencode/agents/review.md`).
- [ ] T004 Remove the permission grant, both review steps and the retrieval-source bullet (`.opencode/agents/deep-review.md`).
- [ ] T005 Remove the two preflight steps and renumber (`sk-code-review/SKILL.md`).
- [ ] T006 Regenerate the Claude, Codex and Pi agent mirrors through the runtime-mirror sync. Never hand-edit a mirror.
- [ ] T007 Delete the scenario built on the retired tool (`sk-code-review/manual-testing-playbook/structural-impact-preflight/`).
- [ ] T008 Remove the scenario and its category from the playbook index.
- [ ] T009 [P] Drop the tool alias (`system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs`).
- [ ] T010 [P] Drop the alias assertions from its test.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Mirror verifier reports both agents in sync. Satisfies REQ-002.
- [ ] T012 Review playbook validator passes. Satisfies REQ-003.
- [ ] T013 Deep-loop mirror-sync tests pass. Satisfies REQ-003.
- [ ] T014 Live-tree residue search returns only historical records and generated fixtures. Satisfies REQ-001.
- [ ] T015 Packet gate prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All three P0 requirements satisfied with observed evidence.
- No mirror was hand-edited.
- `implementation-summary.md` records the gate output and anything left undone.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan and stage gates: `plan.md`
- Origin of this work: `sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters` ADR-006
<!-- /ANCHOR:cross-refs -->
