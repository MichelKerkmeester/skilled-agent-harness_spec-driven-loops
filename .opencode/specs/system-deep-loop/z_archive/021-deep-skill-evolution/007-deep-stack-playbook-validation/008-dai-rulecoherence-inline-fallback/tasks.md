---
title: "Tasks: deep-agent-improvement ruleCoherence inline fallback (008)"
description: "Task list for the deriveRules inline-fallback fix + stale-scenario findings."
trigger_phrases:
  - "rulecoherence inline fallback tasks"
  - "007 phase 008 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/007-deep-stack-playbook-validation/008-dai-rulecoherence-inline-fallback"
    last_updated_at: "2026-05-27T21:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Code fix + verification done; ledger flip pending"
    next_safe_action: "Flip 005 ledger PG-007/5D-012 PASS"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Tasks: deep-agent-improvement ruleCoherence inline fallback (008)

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

- [x] T001 Read deriveRules/extractRuleBlock; confirm section-only extraction (generate-profile.cjs)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add inline ALWAYS/NEVER fallback to deriveRules (generate-profile.cjs)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 generate-profile debug -> ruleCoherence yields 2 NEVER
- [x] T004 deep-agent-improvement vitest 99/99 (no regression)
- [ ] T005 Flip 005 ledger PG-007 + 5D-012 PASS; document stale-scenario findings

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Inline fallback shipped + verified
- [x] No vitest regression
- [ ] Ledger flipped + findings documented

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Consuming phase**: `../005-deep-agent-improvement-scenarios/`

<!-- /ANCHOR:cross-refs -->
