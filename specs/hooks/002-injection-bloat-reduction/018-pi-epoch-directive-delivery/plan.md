---
title: "Plan: Pi Epoch-Based Directive Delivery"
description: "Completed verification plan for full and compact Pi dispatch semantics, existing lifecycle resets, and deferred compact activation."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi epoch directive delivery plan"
  - "pi headed headless epoch plan"
  - "pi route only lifecycle replay"
importance_tier: "high"
contextType: "plan"
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
      fingerprint: "sha256:d6a979eb170a3988fee90977a8bf1cb9a0ecc6368befbaf581b8ea175d7486fd"
      session_id: "2026-08-09-pi-epoch-directive-delivery"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Pi Epoch-Based Directive Delivery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The full Pi dispatch directive was the active default. A compact text form existed behind `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE`, and existing lifecycle handlers already cleared the delivery epoch on startup, resume, fork, and compact.

### Overview

The phase added focused semantic coverage for both directive forms, ran the full Pi suite, confirmed that no runtime change was needed, and left compact activation disabled.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Identify the full and compact directive texts.
- Name the five required semantics.
- Locate the existing lifecycle reset behavior.

### Definition of Done

- The new test passes 11 assertions across both text forms.
- The Pi suite passes 70 tests.
- Existing lifecycle resets remain intact.
- The compact prototype remains off by default.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The phase used verification-only delivery: exercise the existing directive constants and runtime behavior without changing production code.

### Key Components

- `.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` held the 11 semantic assertions.
- Existing Pi lifecycle handlers supplied startup, resume, fork, and compact epoch resets.
- `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` remained the disabled activation gate.

### Data Flow

| Input | Verification | Result |
|-------|--------------|--------|
| Full directive text | Five semantic assertions | All five preserved |
| Compact directive text | Five semantic assertions | All five preserved |
| Lifecycle reset paths | Pi regression suite | Existing epoch clearing retained |
| Default prototype state | Flag inspection and tests | Compact emission remained disabled |

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

The existing full and compact texts, five semantic obligations, and lifecycle reset paths were inventoried.

### Phase 2: Core Implementation

`compact-dispatch-semantics.test.ts` was added with 11 focused assertions. No runtime implementation was needed.

### Phase 3: Verification

The focused assertions and the full 70-test Pi suite passed. Compact activation remained deferred.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`.opencode/hooks/dispatch/pi/compact-dispatch-semantics.test.ts` exercised native default behavior, current-turn override, preload, anti-signal handling, and child exclusion for the full and compact text forms. The complete Pi gate ran through `npx vitest run pi/` and passed 70 tests.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Existing Pi dispatch directive constants.
- Existing startup, resume, fork, and compact lifecycle reset handlers.
- The Pi Vitest harness.
- No new runtime dependency.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No runtime change was made. Reverting the focused test addition removes this phase's verification artifact. Keeping `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` off preserves the full dispatch directive as the emitted default.

<!-- /ANCHOR:rollback -->
