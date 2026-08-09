---
title: "Tasks: Pi-Headless Fallback Directive De-Duplication"
description: "Completed task record for headless fallback recognition, empty-context preservation, focused regression coverage, and Pi verification."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi headless fallback dedup tasks"
importance_tier: "high"
contextType: "tasks"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "013-pi-local-directive-dedup"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/015-pi-headless-fallback-dedup"
    last_updated_at: "2026-08-09T14:52:48Z"
    last_updated_by: "sol"
    recent_action: "Reconciled headless Pi fallback de-duplication"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/directive-dedup.test.ts"
    session_dedup:
      fingerprint: "sha256:be3b782d6118bc13e0d3197a592a6ef9d7bd5aa9d0a748c445ca0a5a48f53f56"
      session_id: "2026-08-09-pi-headless-fallback-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Pi-Headless Fallback Directive De-Duplication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Inspect the current splitter, decision helper, bounded session map, input assembly, and lifecycle reset paths in `prompt-advisor.ts`. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] T-002 Confirm the exact headed and headless brief shapes, the confirmed-session key contract, the kill-switch values, and the expected repeat-turn byte target. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Extend `splitPiDirectiveBrief` to recognize a brief beginning with `Directives:` and return an empty head with the exact directive block. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] T-004 Extend `decidePiDirectiveDelivery` to record and compare headless directive blocks while preserving confirmed-session, same-content, same-epoch, fail-open, bounded-map, and kill-switch guards. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] T-005 Update input-handler assembly to honor a suppressed empty head and keep `PI_SUBAGENT_DISPATCH_DIRECTIVE` appended on every turn. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] T-006 Replace the deliberate fallback non-suppression test and add focused coverage for headless first/repeat, content change, lifecycle reset, unknown session, kill-switch, isolation, and final prompt assembly. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-007 Run the focused Pi directive-dedup tests and the full Pi dispatch suite after implementation. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] T-008 Run the focused Pi gate and confirm the implementation stayed within the adapter and focused test files. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- A confirmed same-content headless fallback repeat will suppress the complete directive block while retaining the user text and Pi dispatch directive.
- Every unknown, changed, lifecycle-boundary, kill-switch, malformed, and error path will deliver the complete available brief, and the existing headed behavior will remain intact.
- The focused and regression tests, type checks, byte target, and scope review will be recorded only after implementation and verification occur.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach, testing, and rollback: `plan.md`.
- Intended verification gates: `checklist.md` and `implementation-summary.md`.
- Research recommendation and migration step: `../014-injection-surface-deprecation-research/research/research.md`.
- Predecessor Pi directive de-duplication phase: `../013-pi-local-directive-dedup/`.
<!-- /ANCHOR:cross-refs -->
