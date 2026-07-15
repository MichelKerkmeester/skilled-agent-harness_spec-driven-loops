---
title: "Implementation Plan: Recorded-Failure Closure"
description: "Plan and delivered notes for routing recorded detector failures to follow-up action."
trigger_phrases:
  - "recorded failure closure plan"
  - "unactioned recorded failure"
  - "recorded failure must route"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/005-speckit-surface-alignment/004-recorded-failure-closure"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Ship recorded-failure closure route"
    next_safe_action: "Run strict validation for the closure phase"
    completion_pct: 100
---
# Implementation Plan: Recorded-Failure Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown constitutional rule plus Node validation script |
| **Framework** | system-spec-kit constitutional rules and validation scripts |
| **Storage** | None |
| **Testing** | Node assertion test for surfacer behavior |

### Overview

This phase closed the "detector fired, nobody acted" class in two steps. First, the exemplar deep-research cap contradiction was reconciled in the strategy doc. Second, a reusable closure route shipped through a constitutional rule and a lightweight surfacer that flags recorded failures without nearby remediation routes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Failure class documented in `spec.md:9-21`.
- [x] Exemplar and closure route acceptance documented in `spec.md:23-25`.
- [x] Scope limited to docs, constitutional rule, surfacer, and focused test.

### Definition of Done

- [x] Deep-research cap contradiction reconciled.
- [x] Constitutional rule authored.
- [x] Unactioned recorded-failure surfacer implemented.
- [x] Four assertion cases pass for surfacer behavior.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Record-to-route closure: a recorded failure only counts as handled when a nearby remediation route or accepted-risk decision exists.

### Key Components

- **Strategy reconciliation**: `../../research/deep-research-strategy.md` records the operator-capped stop at iteration 20.
- **Constitutional rule**: `recorded-failure-must-route.md` defines the HALT-and-record behavior.
- **Surfacer**: `unactioned-recorded-failure-audit.mjs` scans text for failure markers that lack nearby remediation markers.
- **Focused test**: `unactioned-recorded-failure-audit.test.mjs` proves unrouted, routed, contradiction-routed, and clean cases.

### Data Flow

1. A scenario, validator, or loop records FAIL, contradiction, drift, or follow-up language.
2. The surfacer checks the local text window for remediation markers.
3. Missing route emits an unactioned recorded-failure hit and exits non-zero.
4. The constitutional rule makes an unactioned hit block completion claims.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Exemplar Fix

- [x] Reconcile the cap lines to record operator stop at iteration 20 (`../../research/deep-research-strategy.md:56`, `../../research/deep-research-strategy.md:135`).
- [x] Preserve the 40-iteration hard cap while documenting the operator override.

### Phase 2: Closure Route

- [x] Author constitutional rule (`recorded-failure-must-route.md:21-33`).
- [x] Implement marker-based surfacer (`unactioned-recorded-failure-audit.mjs:10-33`).
- [x] Implement windowed route detection (`unactioned-recorded-failure-audit.mjs:35-49`).
- [x] Implement CLI output and non-zero exit on hits (`unactioned-recorded-failure-audit.mjs:51-76`).

### Phase 3: Verification

- [x] Test unrouted FAIL surfaces (`unactioned-recorded-failure-audit.test.mjs:5-9`).
- [x] Test nearby remediation clears FAIL (`unactioned-recorded-failure-audit.test.mjs:11-21`).
- [x] Test routed contradiction clears (`unactioned-recorded-failure-audit.test.mjs:23-30`).
- [x] Test clean text stays clean (`unactioned-recorded-failure-audit.test.mjs:32-39`).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit assertions | Surfacer route-detection behavior | Node assert |
| Source readback | Rule, script, and strategy anchors | Read/Grep |
| Documentation review | Phase spec shipped status | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Constitutional rule directory | Internal | Green | Rule cannot always surface. |
| Validation script path | Internal | Green | Surfacer cannot be run from rule guidance. |
| Recorded transcripts or loop-state text | Input | Green | Surfacer needs text files to scan. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Surfacer produces too many unhelpful false positives or blocks legitimate completions.
- **Procedure**: Narrow marker patterns or require a larger remediation window, then update the four assertion cases. Remove or soften the README registration only if the rule itself is rescinded.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Exemplar fix | Recorded cap contradiction | Closure-route docs |
| Closure route | Constitutional rule and surfacer | Verification |
| Verification | Focused assertion test | Completion |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Exemplar fix | Low | 30 minutes |
| Closure route | Medium | 1-2 hours |
| Verification | Low | 30 minutes |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

- No persisted data migration exists.
- Rollback is a source/docs revert of the rule, surfacer, test, and README registration.
<!-- /ANCHOR:l2-rollback -->
