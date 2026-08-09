---
title: "Spec: Pi Epoch-Based Directive Delivery"
description: "Verified full and compact Pi dispatch directive semantics, confirmed existing lifecycle epoch resets, and kept compact activation disabled."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi epoch directive delivery"
  - "pi headed headless directive dedup"
  - "pi full first route only repeats"
  - "Pi compact directive semantics"
importance_tier: "high"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "015-pi-headless-fallback-dedup; 006-pi-dispatch-and-compaction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/018-pi-epoch-directive-delivery"
    last_updated_at: "2026-08-09T14:53:00Z"
    last_updated_by: "sol"
    recent_action: "Verified Pi dispatch semantics and lifecycle resets"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/directive-dedup.test.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
    session_dedup:
      fingerprint: "sha256:a6ae8f57a187ff8f207a2c1d570fdfc7ec61976a0e3925753623e98df91e1e0a"
      session_id: "2026-08-09-pi-epoch-directive-delivery"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Pi Epoch-Based Directive Delivery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-pi-epoch-directive-delivery |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Predecessor** | 015-pi-headless-fallback-dedup; 006-pi-dispatch-and-compaction |
| **Successor** | None |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The compact Pi dispatch form needed semantic proof before any activation decision. Byte reduction alone could not establish that native default behavior, current-turn override, preload, anti-signal handling, and child exclusion all survived.

The existing runtime already reset the delivery epoch on startup, resume, fork, and compact. This phase therefore focused on proving both directive texts and confirming that no runtime migration was required.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: focused tests for the full and compact Pi dispatch directive texts, verification of all five semantics, confirmation of existing lifecycle resets, and the default-disabled compact prototype state.

Out of scope: enabling `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE`, changing `prompt-advisor.ts`, activating a matrix cell, or modifying any non-Pi runtime.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** The full Pi dispatch directive had to preserve native default behavior, current-turn override, preload, anti-signal handling, and child exclusion.
- **REQ-002 [P0]** The compact directive text had to preserve the same five semantics.
- **REQ-003 [P0]** Startup, resume, fork, and compact had to continue clearing the delivery epoch.
- **REQ-004 [P0]** The compact prototype had to remain disabled by default.
- **REQ-005 [P1]** Verification had to add focused assertions without requiring a runtime change.
- **REQ-006 [P0]** The full Pi suite had to remain green.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` passes 11 assertions covering all five semantics for both text forms.
- **SC-002** `npx vitest run pi/` passes 70 tests.
- **SC-003** Existing startup, resume, fork, and compact handlers continue to clear the epoch.
- **SC-004** `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` remains off by default.
- **SC-005** No runtime change is required.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Semantic regression.** The 11 focused assertions bind both text forms to the same five required behaviors.
- **Premature activation.** The compact prototype remained disabled even after its text passed semantic checks.
- **Lifecycle drift.** The 70-test Pi gate covered the existing lifecycle behavior.
- **Dependency.** Verification depended on the existing Pi dispatch test harness and directive constants.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Compact activation remains an operator decision. The phase supplied semantic evidence but did not enable the prototype.

<!-- /ANCHOR:questions -->
