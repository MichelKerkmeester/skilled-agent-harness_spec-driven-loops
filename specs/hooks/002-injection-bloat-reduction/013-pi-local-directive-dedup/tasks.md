---
title: "Tasks: Pi-Local Directive De-Duplication"
description: "Ordered tasks: locate the seam, add the dedup decision + resets, prove every branch and no regression."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi directive dedup tasks"
importance_tier: "high"
contextType: "tasks"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/013-pi-local-directive-dedup"
    last_updated_at: "2026-08-09T07:30:34Z"
    last_updated_by: "claude"
    recent_action: "Completed implementation and branch-coverage tests"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:8edf7805d219989056bd2a6c53dede5cba06167a82e9c42a2f25ba8ebf54c747"
      session_id: "2026-08-09-pi-directive-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Pi-Local Directive De-Duplication

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

- [x] T-001 Locate the input assembly point, the `\nDirectives:` separator, the session-key helper, and the two lifecycle handlers. Evidence: assembly at the `const text =` block; `DIRECTIVES_LABEL='\nDirectives:'` in render.ts; `receiptSessionKey`; `session_start`/`session_compact` handlers calling `resetPiDispatchLifecycle`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add `PI_DIRECTIVE_DEDUP_FLAG`, `isPiDirectiveDedupEnabled`, `splitPiDirectiveBrief`, `decidePiDirectiveDelivery`, the resets, and the `directiveDedupBySession` store field. Evidence: adapter helper block added; existing suite transpiles + passes.
- [x] T-003 Wire the decision into the input assembly (compute `effectiveContext`, keep the dispatch directive always) and the resets into both lifecycle handlers and the global reset. Evidence: `effectiveContext` block; `resetPiDirectiveDedupForSession` in both handlers.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-004 Prove every branch and no regression. Evidence: new suite 10/10 pass; full Pi dispatch suite 54/54 pass; off-config `tsc` delta = one benign `process`/@types-node artifact identical to the pre-existing sibling function (zero real new errors).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- A confirmed same-content repeat drops the directive block and keeps the route line; every uncertain case delivers full.
- Lifecycle events re-arm full delivery; the dispatch directive is always emitted; existing tests unbroken.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Verification evidence: `checklist.md`, `implementation-summary.md`.
- Sibling Pi phase (dispatch directive): `../006-pi-dispatch-and-compaction/`.
<!-- /ANCHOR:cross-refs -->
