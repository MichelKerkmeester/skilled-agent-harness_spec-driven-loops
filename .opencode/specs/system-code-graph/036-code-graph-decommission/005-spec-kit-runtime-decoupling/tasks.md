---
title: "Tasks: Phase 5: spec-kit-runtime-decoupling"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/005-spec-kit-runtime-decoupling"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-005-spec-kit-runtime-decoupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: spec-kit-runtime-decoupling

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

- [x] T001 Confirm phase 002 disposition (remove the enrichment path, not fallback) — evidence: `scratch/closeout-facts.md`
- [x] T002 Enumerate 25 call sites across 9 importers — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delete `code-graph-boundary.ts` (launcher spawn boundary)
- [x] T004 Rewrite 25 call sites across 9 importers to remove graph dependency — evidence: `scratch/closeout-facts.md`
- [x] T005 Remove context-server enrichment call; keep session-warning step only (`context-server.ts`)
- [x] T006 Remove graph readiness reporting from session bootstrap, health, resume, memory-context handlers — evidence: `scratch/closeout-facts.md`
- [x] T007 Set trust states to permanently 'absent' (honest value) — evidence: `scratch/closeout-facts.md`
- [x] T008 Remove mirrored code-graph schema entries from `tool-schemas.ts`
- [x] T009 Delete `code-graph-contracts.ts` after proving it unimported (commit `1e548b0ed5`)
- [x] T010 Remove dead structural routing nudge from context-server and memory-context (commit `b54aeea89e`)
- [x] T011 Reweight quality-score to 0.44/0.31/0.25 (commit `1ea5f7c1b4`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 TypeScript typecheck passes with zero unresolved references
- [x] T013 Confirm no spec-kit production source spawns the launcher — evidence: `scratch/closeout-facts.md`
- [x] T014 Confirm session output omits graph fields rather than reporting them unavailable — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (typecheck + sweep)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
