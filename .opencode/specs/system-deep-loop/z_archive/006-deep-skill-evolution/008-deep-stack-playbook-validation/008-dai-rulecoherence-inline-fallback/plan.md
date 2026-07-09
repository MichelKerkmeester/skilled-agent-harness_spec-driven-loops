---
title: "Plan: deep-agent-improvement ruleCoherence inline fallback (008)"
description: "Fix plan for the deriveRules inline ALWAYS/NEVER fallback + stale-scenario documentation."
trigger_phrases:
  - "rulecoherence inline fallback plan"
  - "007 phase 008 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/008-deep-stack-playbook-validation/008-dai-rulecoherence-inline-fallback"
    last_updated_at: "2026-05-27T21:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Planned the deriveRules inline-fallback fix + stale-scenario findings"
    next_safe_action: "Flip 005 ledger and finish RT/RD/E2E"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Plan: deep-agent-improvement ruleCoherence inline fallback (008)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (.cjs) |
| **Surface** | OpenCode skill script |
| **Scope** | One function (`deriveRules`) + documented scenario findings |

### Overview
Add an inline ALWAYS/NEVER fallback to `deriveRules()` so agents with body-level `- NEVER`/`- ALWAYS` bullets (no dedicated section) still yield ruleCoherence. Document the four stale-scenario determinations.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed (deriveRules section-only; no inline path)
- [x] Stale scenarios distinguished from the code bug

### Definition of Done
- [x] Inline fallback shipped + debug yields 2 NEVER
- [x] vitest 99/99 (no regression)
- [ ] 005 ledger flipped + findings documented

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive fallback: section-based extraction runs first; the inline scan fires only when no ALWAYS/NEVER rule was found, so existing profiles are unchanged.

### Key Components
- **deriveRules(secs)**: section extraction + inline-bullet fallback over `Object.values(secs)`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read deriveRules + extractRuleBlock; confirm no inline path

### Phase 2: Implementation
- [x] Add inline ALWAYS/NEVER fallback to deriveRules

### Phase 3: Verification
- [x] generate-profile debug -> ruleCoherence 2 NEVER
- [x] vitest 99/99 (no regression)

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Targeted | debug ruleCoherence non-empty | generate-profile.cjs + python3 |
| Regression | full skill suite | vitest (8 files / 99 tests) |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| deep-agent-improvement vitest | Internal | Green | Cannot confirm no-regression |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The fallback over-extracts or regresses a profile.
- **Procedure**: Revert the deriveRules inline-fallback block (git checkout generate-profile.cjs); it is an isolated additive block.

<!-- /ANCHOR:rollback -->
