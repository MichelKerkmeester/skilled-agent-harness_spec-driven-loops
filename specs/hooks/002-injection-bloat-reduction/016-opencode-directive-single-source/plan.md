---
title: "Plan: OpenCode Directive Single-Source"
description: "Create one build-safe directive source, make the canonical renderer and OpenCode bridge consume it, and prove complete fail-open parity."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "OpenCode directive single source plan"
  - "OpenCode bridge fallback parity plan"
  - "canonical directive source plan"
importance_tier: "high"
contextType: "plan"
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
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/compat/plugin-bridge.vitest.ts"
    session_dedup:
      fingerprint: "sha256:56587ad4475d0b33c5b7f132200d0339fe89e3ae921b307fd16e8a30729ebb32"
      session_id: null
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: OpenCode Directive Single-Source

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The bridge preferred the compiled canonical renderer but retained a local fallback for module-unavailable operation. That fallback had drifted to two of the three required directives.

### Overview

The implementation composed one shared three-directive bridge block from the canonical renderer and completed the local fallback with all three directives. No file outside the bridge changed.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Identify the compiled-first and local fallback paths.
- Confirm the missing proof-over-appearance directive.
- Capture the canonical three-directive order.

### Definition of Done

- Both renderable paths contain all three directives.
- 9 bridge tests and 13 negative controls pass.
- `node --check` is clean.
- A source grep finds the third directive.
- Scope remains bridge-only.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The bridge retained compiled-first rendering and a complete local fail-open fallback. Both paths used the same three-directive composition contract.

### Key Components

- Canonical renderer-backed three-directive block.
- Local fallback containing all three directives.
- Existing native and CLI bridge selection behavior.

### Data Flow

| Condition | Result |
|-----------|--------|
| Compiled renderer available | Canonical three-directive bridge output |
| Compiled renderer unavailable | Complete local three-directive fallback |
| No renderable advisor result | Existing fail-open response semantics |

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

The compiled and local bridge paths were inspected and the two-of-three fallback drift was confirmed.

### Phase 2: Core Implementation

`mk-skill-advisor-bridge.mjs` was updated to compose the canonical three-directive block and retain a complete local fallback.

### Phase 3: Verification

The 9-test bridge gate, 13 negative controls, syntax check, and third-directive grep passed.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The bridge Vitest gate passed 9 tests, the negative-control gate passed 13 tests, `node --check` was clean, and a source grep confirmed the proof-over-appearance directive. These checks covered the complete fallback and preserved bridge syntax.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Existing canonical directive renderer.
- Existing OpenCode bridge native and CLI paths.
- Existing bridge Vitest and negative-control harnesses.
- No new dependency.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverting `mk-skill-advisor-bridge.mjs` restores the previous two-directive local fallback. The change introduced no activation state, data migration, or cross-runtime dependency.

<!-- /ANCHOR:rollback -->
