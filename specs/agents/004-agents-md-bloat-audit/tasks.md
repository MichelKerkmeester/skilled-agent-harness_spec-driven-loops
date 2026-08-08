---
title: "Tasks: AGENTS.md Bloat Audit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "agents.md bloat audit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/004-agents-md-bloat-audit"
    last_updated_at: "2026-08-08T08:58:31Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded audit tasks; all complete"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "specs/agents/004-agents-md-bloat-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-004-bloat-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: AGENTS.md Bloat Audit

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

- [x] T001 Launch deep-research loop, executor cli-pi/deepseek-v4-flash [evidence: `research/deep-research-config.json` kind=cli-pi model=deepseek-v4-flash]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run 5 read-only research iterations over AGENTS.md [evidence: `research/lineages/pi/iterations/iteration-001..005.md` present]
- [x] T003 Synthesize ranked findings report [evidence: `research/research.md` with Tier 1/2/3 + preserve set + convergence report]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Reconcile packet docs + strict validate [evidence: `validate.sh specs/agents/004-agents-md-bloat-audit --strict` clean; see implementation-summary]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: `T001`-`T004` complete]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] research.md synthesized [evidence: `research/research.md` exists, 5 iterations]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
