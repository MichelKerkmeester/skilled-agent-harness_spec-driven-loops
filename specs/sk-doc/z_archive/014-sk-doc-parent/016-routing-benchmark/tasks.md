---
title: "Tasks: Phase 016 — Hub routing benchmark + cross-hub parity gate"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-doc routing benchmark tasks"
  - "cross-hub parity gate tasks"
  - "routing gap remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 016 — Hub routing benchmark + cross-hub parity gate

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

- [ ] T001 Confirm the phase 001 deep-research rulings and that depends-on phases 013, 014 and 015 are available
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Benchmark advisor routing accuracy for each create-* verb + doc-quality intent (Skill Benchmark Report)
- [ ] T003 Benchmark discovery/efficiency and canon-conformance parity vs the sk-code/sk-design/deep-loop reference hubs (cross-hub parity scorecard)
- [ ] T004 Confirm the single sk-doc identity routes and the hub picks the right mode/bundle from wording
- [ ] T005 Emit the ranked, remediable Skill Benchmark Report and feed any routing gaps back to 014 (routing-gap remediation list)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Confirm the success criteria; exact benchmark output is Not recorded
- [ ] T007 Run `validate.sh` for this folder
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
