---
title: "Tasks: Skill Advisor P1 Routing & Abstention Tuning"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "p1 routing tuning tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/006-p1-routing-tuning"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-p1-tuning"
    recent_action: "Specced per-class tasks"
    next_safe_action: "Implement class by class"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Skill Advisor P1 Routing & Abstention Tuning

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

- [ ] T001 Re-capture baseline behavior per class in both scorers
- [ ] T002 Decide Class A parity-vs-new-signal split (open question)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Class A: terse-phrase routing signals (mcp-code-mode / deep-agent-improvement / system-code-graph) in both scorers
- [ ] T004 Class B: code-edit context beats cli-opencode (skill_advisor.py)
- [ ] T005 [P] Class D: `:review:auto` / auto-review loop syntax -> deep-review (both scorers)
- [ ] T006 [P] Class E: audit + review-target -> sk-code-review over system-skill-advisor/deep-review (both scorers)
- [ ] T007 Class C: breadth abstention for greenfield/multi-concern prompts (both scorers; adversarial guards)
- [ ] T008 Add regression fixtures/guards for newly-introduced behavior
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Both regression harnesses: targeted P1 rows fixed; P0 12/12; no regression
- [ ] T010 Parity + full vitest green; tsc + alignment verifier PASS
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (or class deferred with rationale)
- [ ] No `[B]` blocked tasks remaining
- [ ] P0 12/12 both scorers; parity green; targeted P1 rows improved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source phase**: ../005-finding-remediation (P0 + alias work this builds on)
<!-- /ANCHOR:cross-refs -->
