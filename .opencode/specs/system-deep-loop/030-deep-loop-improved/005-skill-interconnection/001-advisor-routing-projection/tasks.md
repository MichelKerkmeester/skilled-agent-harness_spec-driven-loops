---
title: "Tasks: Advisor Routing Projection Generator and workflowMode Publication"
description: "Completed task ledger for advisor routing projection and workflowMode response publication."
trigger_phrases:
  - "advisor routing projection"
  - "workflowMode publication"
  - "mode registry drift guard"
  - "advisor alias table"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/005-skill-interconnection/001-advisor-routing-projection"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/schemas/advisor-tool-schemas.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts"
      - ".opencode/commands/create/assets/create_parent_skill_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Advisor Routing Projection Generator and workflowMode Publication

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

- [x] T001 Read the completed spec and capture the projection and response-publication scope (`spec.md`).
- [x] T002 Identify drift guard, aliases, CLI, schema, handler, and scaffolder surfaces (`spec.md`).
- [x] T003 [P] Confirm scoring math and runtime daemon restart logic are out of scope (`spec.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Generate advisor aliases from `mode-registry.json` into `aliases.ts`.
- [x] T005 Replace static content comparison with projection hash freshness (`routing-registry-drift-guard.vitest.ts`).
- [x] T006 Publish `workflowMode` from the Python advisor response path (`skill_advisor.py`).
- [x] T007 Add optional `workflowMode` to advisor response schema and handler pass-through (`advisor-tool-schemas.ts`, `advisor-recommend.ts`).
- [x] T008 Include projection hash in the advisor cache signature (`aliases.ts`).
- [x] T009 Emit projection during parent-skill creation (`create_parent_skill_auto.yaml`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify the drift guard passes when projection is fresh and fails when registry changes without regeneration.
- [x] T011 Verify a deep-loop recommendation includes a non-null `workflowMode`.
- [x] T012 Verify no runtime advisor path reads `mode-registry.json` directly.
- [x] T013 Update plan and task docs to reflect completed implementation (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
