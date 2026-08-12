---
title: "Tasks: Directive-Lifecycle Documentation Alignment"
description: "Ordered tasks: locate the four doc targets + verify SAD-003, land the four doc edits (ENV-REFERENCE hook-level block, README cadence, .pi rows, cursor verify-and-note), then run the grep gates, stale-docs re-sweep, and scope diff audit."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle docs alignment tasks"
  - "directive lifecycle documentation tasks"
importance_tier: "high"
contextType: "tasks"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/015-directive-docs-alignment"
    last_updated_at: "2026-08-11T09:50:00Z"
    last_updated_by: "claude"
    recent_action: "All documentation alignment tasks and gates completed"
    next_safe_action: "None; historical packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".pi/extensions/README.md"
      - ".opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md"
    session_dedup:
      fingerprint: "sha256:5cac0101ce84e551aae5342b611036d57f0ac03bd17c5cb8ac17da2fa45a89f4"
      session_id: "2026-08-11-directive-docs-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Directive-Lifecycle Documentation Alignment

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

- [x] T-001 Locate the four targets by text anchor and verify SAD-003. Evidence: ENV-REFERENCE.md §1 (Feature Flags table ends, §1 closes before §2 INFRASTRUCTURE); skill-advisor README "OpenCode Plugin Note" paragraph after the Runtime Environment Ownership block; `.pi/extensions/README.md` prompt-advisor rows (adapter table + lifecycle table); `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md` `user-prompt-submit` row; SAD-003 (`system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md`) verified session-less fail-open compatible — Pi calls the shim without a session id, so the shim decision always fails open there and Pi's own 013 dedup is the only active mechanism.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Register the `Hook-level lifecycle flags` block in ENV-REFERENCE.md §1 with `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`, `SPECKIT_PI_DIRECTIVE_DEDUP`, `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` (defaults, kill-switch semantics, canonical-core pointers), marked as hook/plugin-level toggles outside the search-flags table. Evidence: `ENV-REFERENCE.md` §1 `Hook-level lifecycle flags` block (rows for model-context dedup, Pi dedup, and state dir).
- [x] T-003 Add the lifecycle-cadence sentence to the skill-advisor README OpenCode Plugin Note paragraph: since 014 the three constant directives deliver in full only on the first message of a session and after lifecycle boundaries; repeats carry the route line only; `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` reverts to always-full; fail-open. Evidence: README "OpenCode Plugin Note" paragraph ("Since phase 014 the three constant advisor directives are delivered in full only on the first message of a session and after lifecycle boundaries ...").
- [x] T-004 Document the 013 lifecycle in `.pi/extensions/README.md` prompt-advisor rows: `SPECKIT_PI_DIRECTIVE_DEDUP` default ON, full first + `session_start`/`session_compact` boundaries, route-only repeats, `0`/`false`/`off` restores always-full. Evidence: `.pi/extensions/README.md` prompt-advisor row (adapters table) and lifecycle table row ("013 lifecycle dedup of the constant directives (`SPECKIT_PI_DIRECTIVE_DEDUP`, full first + boundaries, route-only repeats)").
- [x] T-005 Verify-and-note the cursor catalog `user-prompt-submit` row: registered `beforeSubmitPrompt` proxy with unconfirmed delivery; directive delivery lifecycle-deduped via the shared compiled shim (full on first message + lifecycle boundaries, route-only on repeats; `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` restores always-full). Evidence: `cursor-hooks-and-spec-gate.md` `user-prompt-submit.ts` handler row.
- [x] T-006 Record SAD-003 as verified no-change. Evidence: SAD-003 file carries no stale lifecycle assertions; session-less invocation means the shim always fails open for Pi; no edit required.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-007 Re-sweep the named surfaces for stale assertions (claims of always-full per-turn directive delivery, missing or contradicting kill-switch values) — expect zero matches. Evidence: re-sweep returned zero matches; only benign mentions.
- [x] T-008 Run the grep gates: `Hook-level lifecycle flags` + the three env names present in ENV-REFERENCE §1; lifecycle-rule phrasing in the README, `.pi` rows, and cursor row; kill-switch values documented beside each env. Evidence: all gates passed (verified by parent re-run).
- [x] T-009 Scope diff audit: zero git diff on runtime code, tests, or the 007 activation folder; only the four doc files + this packet changed; recursive validate.sh on the parent spec folder clean. Evidence: scope audit passed; parent recursive validate Errors 0 (except pre-existing 011/012).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- ENV-REFERENCE §1 is the canonical hook-level env registry; every runtime-facing doc states the lifecycle rule and the kill-switch values.
- The re-sweep finds zero stale assertions; the scope diff proves docs-only; the grep gates pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Verification evidence: `checklist.md`, `implementation-summary.md`.
- Behavior being documented: `../013-pi-local-directive-dedup/`, `../014-cross-runtime-directive-lifecycle/`.
- Sibling playbook/catalog alignment phase: `../016-directive-playbook-alignment/`.
<!-- /ANCHOR:cross-refs -->
