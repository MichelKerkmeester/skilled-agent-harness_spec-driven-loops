---
title: "Tasks: Governance + sk-doc + sk-code Drift Review Slice"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "governance skdoc skcode drift review tasks"
  - "constitutional standards drift tasks"
importance_tier: "normal"
contextType: "general"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Governance + sk-doc + sk-code Drift Review Slice

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

- [ ] T001 Confirm the slice scope and review focus from `spec.md` against the parent campaign plan (`../plan.md`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Audit the constitutional rule files under `.opencode/skills/system-spec-kit/constitutional/` for rules with no enforcement mechanism or rules contradicted by repo practice (`.opencode/skills/system-spec-kit/constitutional/`)
- [ ] T003 Audit `.opencode/skills/sk-doc/SKILL.md` and `.opencode/skills/sk-doc/assets/` for template, voice, and section-order rules that contradict the templates the repository actually uses (`.opencode/skills/sk-doc/`)
- [ ] T004 Audit `.opencode/skills/sk-code/SKILL.md` and `.opencode/skills/sk-code/assets/` for surface-detection and authoring-checklist contracts that drift from actual authoring and verification practice (`.opencode/skills/sk-code/`)
- [ ] T005 Cross-check AGENTS.md and CLAUDE.md guidance for internal contradictions with the constitutional rules (root guidance files)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Confirm every recorded finding carries evidence and that the audit requirements' acceptance criteria are satisfied (packet `review/` artifacts)
- [ ] T007 Record the verdict that governance and sk-doc / sk-code drift were assessed (packet `review/` artifacts)

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
