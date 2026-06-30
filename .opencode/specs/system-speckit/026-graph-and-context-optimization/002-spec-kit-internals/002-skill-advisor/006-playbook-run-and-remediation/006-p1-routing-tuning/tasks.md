---
title: "Tasks: Skill Advisor P1 Routing & Abstention Tuning"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "p1 routing tuning tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/006-p1-routing-tuning"
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

- [x] T001 Re-captured baseline behavior per class in both scorers (codex gpt-5.5 xhigh design review)
- [x] T002 Resolved Class A approach: domain anchors in the direct-evidence lane (confidence) + primaryIntentBonus (rank); Python booster bumps
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Class A: domain anchors (mcp-code-mode webflow/cms, deep-agent-improvement, system-code-graph) in both scorers — direct lane + ranking
- [x] T004 Class B: code-edit context beats cli-opencode (skill_advisor.py code-edit disambiguator) — fixes OPENCODE-001
- [x] T005 [P] Class D: `:review:auto` colon-syntax -> deep-review (both scorers); kept "auto review" -> sk-code-review per the documented decision (codex confirmed the split). Also Class E AUDIT-001 (audit recommendations -> sk-code-review)
- [x] T006 [P] Class E: "code audit" -> sk-code-review over deep-review (TS; Python already correct) — verified
- [x] T007 Class C: breadth/multi-concern abstention (both scorers); narrowly gated, top-must-be-code-like, narrow-anchor + single-concern bypass
- [x] T008 Added adversarial routable guards P2-BREADTH-GUARD-001/002 (must-route) to the regression fixtures
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Both regression harnesses: 0 failures across all 50 cases; P0 12/12 each; no regression
- [x] T010 Parity + full vitest 66/66; Python unit 57/0; tsc clean + alignment verifier PASS
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0 12/12 both scorers; parity green; all 50 regression cases pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source phase**: ../005-finding-remediation (P0 + alias work this builds on)
<!-- /ANCHOR:cross-refs -->
