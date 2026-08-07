---
title: "Tasks: OpenCode Transform Dedup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "transform dedup tasks"
  - "message identity resolver task list"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/003-opencode-transform-dedup"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the task breakdown for the message-identity resolver and dedup gate"
    next_safe_action: "Author checklist.md verification items matching the requirements"
    blockers:
      - "Blocked on phase 001 shipping stable message identity and multi-transform receipts"
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-003"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Tasks: OpenCode Transform Dedup

<!-- SPECKIT_LEVEL: 2 -->
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

Status: In progress - the identity resolver, both plugin gates, receipt accessors, and regression fixtures are shipped; the generic adversarial-table checklist residual remains outside these tasks.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 001's stable message identity and multi-transform receipt infrastructure is shipped and green (`../001-measurement-and-receipts-foundation/`)
- [x] T002 Inventory both transform call sites' available session/message/turn fields (`.opencode/plugins/mk-skill-advisor.js`, `.opencode/plugins/mk-spec-memory.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Create `opencode-message-identity.js` with `resolveMessageIdentity` and `checkAndRegisterDelivery` (`.opencode/plugins/lib/opencode-message-identity.js`)
- [x] T004 Wire the resolver and dedup check into `mk-skill-advisor.js`'s system-transform path, behind the independent flag (`.opencode/plugins/mk-skill-advisor.js`)
- [x] T005 Wire the resolver and dedup check into `mk-spec-memory.js`'s `appendContinuityBrief` path, behind the same flag (`.opencode/plugins/mk-spec-memory.js`)
- [x] T006 Extend the multi-transform receipt to record per-message-identity delivery/suppression outcomes (`.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Add a same-message duplicate fixture proving suppression of the second transform (`.opencode/plugins/tests/mk-skill-advisor.test.cjs`)
- [x] T008 Add a distinct-message-identical-text fixture proving both messages receive full delivery (`.opencode/plugins/tests/mk-skill-advisor.test.cjs`)
- [x] T009 Add an identity-resolution-failure fixture proving fail-open delivery (`.opencode/plugins/tests/mk-spec-memory.test.cjs`)
- [x] T010 Add a flag-off parity fixture proving byte-identical output to the pre-change baseline (`.opencode/plugins/tests/mk-spec-memory.test.cjs`)
- [x] T011 Run both plugin test suites and confirm no regression in existing cases (`.opencode/plugins/tests/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Same-message suppression and distinct-message non-suppression fixtures both green
- [x] Flag-off parity confirmed byte-identical
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor phase**: `../002-opencode-route-line-bounding/`
- **Successor phase**: `../004-full-first-route-only-repeats/`
<!-- /ANCHOR:cross-refs -->
