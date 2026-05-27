---
title: "Tasks: Scorer P0 Routing Fixes (F1b)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "F1b tasks scorer routing"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/002-scorer-p0-routing-fixes"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced tasks"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Scorer P0 Routing Fixes (F1b)

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

- [x] T001 Read scorer regions in both fusion.ts + skill_advisor.py; established per-case ground truth for both
- [x] T002 Decided mcp-code-mode route (not relabel) for P0-UNC-002
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Low-information abstention in both scorers (fusion.ts phrase-anchor guard; skill_advisor.py ambiguous-ratio guard)
- [x] T004 [P] code-mode disambiguation + model-B owner normalization + prompt-improver/chrome parity fixes
- [x] T005 Verified the ambiguity rule against P0-UNC fixtures + the 193-row corpus (no over/under-abstention)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Both regression harnesses: P0 12/12, no regression; corpus 45→62 (0 lost)
- [x] T007 tsc clean + 448 vitest + Python 57/57 + alignment verifier PASS; over-abstention check ("code audit" still routes)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0 pass rate 12/12 in both scorers, no regression
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root cause**: See `../research/research.md` §3 F1b
<!-- /ANCHOR:cross-refs -->
