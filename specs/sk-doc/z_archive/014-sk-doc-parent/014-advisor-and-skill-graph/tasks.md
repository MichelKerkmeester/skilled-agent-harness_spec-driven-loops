---
title: "Tasks: Phase 014 — Advisor + skill-graph rewrite and re-fingerprint"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc advisor and skill graph tasks"
  - "advisor graph re-fingerprint tasks"
  - "skill graph one identity tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 014 — Advisor + skill-graph rewrite and re-fingerprint

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 Confirm the phase 001 deep-research rulings and the predecessor `013-command-rebinding/` gate before any build work
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Rewrite graph-metadata.json derived.trigger_phrases/intent_signals/key_files/entities/source_docs to span all workflow surfaces and repoint off monolith paths
- [ ] T003 Confirm description.json shape
- [ ] T004 Extend skill_advisor.py PHRASE_INTENT_BOOSTERS/SINGLE_WORD_INTENT for the missing verbs (benchmark/command/feature-catalog/changelog/skill)
- [ ] T005 Regenerate skill-graph.json via skill_graph_compiler.py and confirm skill_count keeps exactly one sk-doc entry (no phantom family)
- [ ] T006 Run advisor rebuild/scan so freshness re-fingerprints
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify no child packet or shared/ carries graph-metadata.json/description.json
- [ ] T008 Run `validate.sh` for this folder and confirm the success criteria; exact command output is Not recorded
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
