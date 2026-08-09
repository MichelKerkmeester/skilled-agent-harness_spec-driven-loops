---
title: "Spec: OpenCode Directive Single-Source"
description: "Completed OpenCode bridge correction for canonical three-directive composition and a complete local fail-open fallback."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "OpenCode directive single source"
  - "OpenCode bridge directive drift"
  - "canonical directive renderer"
  - "proof over appearance bridge fallback"
importance_tier: "high"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/016-opencode-directive-single-source"
    last_updated_at: "2026-08-09T14:52:52Z"
    last_updated_by: "sol"
    recent_action: "Reconciled OpenCode directive single-source delivery"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/compat/index.ts"
    session_dedup:
      fingerprint: "sha256:b35a3e0c65e68045d6acd8bdfb05560d06a3b024f6394a5fdfa1c4364075cb8e"
      session_id: null
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: OpenCode Directive Single-Source

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-opencode-directive-single-source |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Predecessor** | None (independent correctness fix) |
| **Successor** | None |
| **Priority** | P0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The OpenCode bridge's local compiled-module-unavailable fallback emitted only two of the canonical three directives. It omitted proof-over-appearance, so renderer unavailability weakened the guardrail block.

The phase corrected the bridge to compose one shared three-directive block sourced from the canonical renderer and completed the local fallback with all three directives.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`, including its canonical renderer composition, compiled-first path, and complete local fallback.

Out of scope: `render.ts` changes, other runtimes, central delivery state, activation data, directive wording, and generated metadata.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** The bridge had to compose comment hygiene, governor, and proof-over-appearance in canonical order.
- **REQ-002 [P0]** The compiled-module-unavailable local fallback had to include all three directives.
- **REQ-003 [P0]** The bridge had to retain its compiled-first behavior and fail-open response semantics.
- **REQ-004 [P1]** Directive wording and ordering had to remain unchanged.
- **REQ-005 [P1]** The implementation had to remain confined to `mk-skill-advisor-bridge.mjs`.
- **REQ-006 [P0]** Bridge tests, negative controls, syntax checking, and a source grep had to pass.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** The bridge Vitest gate passes 9 tests.
- **SC-002** The negative-control gate passes 13 tests.
- **SC-003** `node --check` completes cleanly.
- **SC-004** A source grep confirms the proof-over-appearance directive is present.
- **SC-005** Only `mk-skill-advisor-bridge.mjs` changes for the implementation.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Fallback drift.** Parity coverage prevents the local fallback from returning to a two-directive form.
- **Compiled-module absence.** The complete local copy keeps the bridge operational when compiled output is unavailable.
- **Scope drift.** The implementation remained bridge-only.
- **Dependency.** The bridge continued to depend on the canonical renderer when available.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.

<!-- /ANCHOR:questions -->
