---
title: "Verification Checklist: Pi-Headless Fallback Directive De-Duplication"
description: "Completed verification checklist for headless Pi fallback de-duplication and its fail-open guardrails."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi headless fallback dedup checklist"
  - "pi headless fallback verification"
importance_tier: "normal"
contextType: "general"
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
      fingerprint: "sha256:dc0cda538ae5e1f92b0c946a2069ab09ad17295bb71c608cbccbcadc99511369"
      session_id: "2026-08-09-pi-headless-fallback-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi-Headless Fallback Directive De-Duplication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements will be documented in `spec.md`, including the intentional change to the predecessor's fallback behavior. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-002 [P0] The planned decision and assembly approach will be defined in `plan.md`. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-003 [P1] The research recommendation, current splitter behavior, existing fallback test, and lifecycle reset paths will be cross-checked before implementation. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The adapter passed the applicable focused Pi runtime gate. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-011 [P1] The implementation will reuse the existing bounded session store, `receiptSessionKey`, separator, kill-switch, and lifecycle reset patterns. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-012 [P0] Fail-open behavior will remain explicit for unknown or unconfirmed sessions, malformed briefs, content changes, lifecycle boundaries, kill-switch values, and decision errors. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-013 [P0] Any new code comment will state durable guardrail rationale and will contain no ephemeral identifiers or spec paths. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] The headed brief will remain full on first delivery and suppressed on an identical confirmed repeat while retaining its route line. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-021 [P0] The headless fallback will be full on first delivery and suppressed on an identical confirmed same-epoch repeat. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-022 [P0] Headless content changes, unknown sessions, the kill-switch, session isolation, `session_start`, and `session_compact` will re-deliver the full directive block. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-023 [P0] The final headless repeat prompt will retain the user text and `PI_SUBAGENT_DISPATCH_DIRECTIVE` and will contain no `Directives:` block. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-024 [P1] The full existing Pi dispatch suite will pass without unrelated test changes. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The splitter will recognize both headed and `Directives:`-first briefs and will preserve the exact directive block bytes. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-FIX-002 [P0] Suppression will require a confirmed session, byte-identical directive block, and current lifecycle epoch; all other paths will deliver full. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-FIX-003 [P0] The Pi dispatch directive will remain independently appended and will never be suppressed by the fallback reduction. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-FIX-004 [P1] The scoped implementation will leave shared renderers, central delivery state, activation data, non-Pi runtimes, and metadata generation untouched. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No guardrail will be silently dropped: lifecycle resets, exact-content checks, fail-open identity checks, and unconditional dispatch delivery will be covered. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-031 [P1] The phase will add no secrets, imports, I/O, network surface, or new persistence beyond the existing bounded in-memory map and environment flag. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The five packet documents were synchronized with the completed behavior and verification result. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-041 [P1] Any implementation comment will document why headless repeats are safe only after confirmed same-epoch delivery and why dispatch remains unconditional. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Documentation reconciliation was limited to the five requested Markdown documents and created no generated metadata. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).
- [x] CHK-051 [P1] The implementation scope remained limited to the Pi adapter and focused test changes. Evidence: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`, and `cd .opencode/hooks/dispatch && npx vitest run pi/` (70 passed).

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | N/A |

**Verification Date**: 2026-08-09
**Verified By**: sol

<!-- /ANCHOR:summary -->
