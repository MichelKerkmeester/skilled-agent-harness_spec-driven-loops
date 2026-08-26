---
title: "Implementation Plan: Pre-Existing Runtime Test-Failure Triage"
description: "Plan for triaging the 10 pre-existing runtime test failures: verify each root cause, fix the one clean data drift, and classify the rest."
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-pre-existing-test-triage"
    last_updated_at: "2026-08-26T10:03:52.975Z"
    last_updated_by: "claude"
    recent_action: "Authored the triage plan"
    next_safe_action: "Commit the census fix + triage"
---
# Implementation Plan: Pre-Existing Runtime Test-Failure Triage

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Overview
Run the 10 pre-existing failing test files, read each real failure reason, fix the single cleanly-correct one (a stale sk-prompt census path that disagrees with disk and the manifest), and record a precise classification for the rest so they can be handled deliberately.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done
- [x] Every failure's root cause is read from real output
- [x] The census path fix lands and its test passes
- [ ] The remaining 9 are classified with recommendations

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The only change is a data correction in a census JSON. No runtime code changes. The census `resolvedPath` is verified against the projection manifest `pathTemplate` and the on-disk sk-prompt directory.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigate
- [x] Run the failing unit tests; capture real reasons
- [x] Confirm disk + manifest both use `sk-prompt-models`

### Phase 2: Fix + classify
- [x] Correct the census path
- [x] Verify `legacy-projections.test.ts` passes
- [ ] Record the classification of the other 9

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Targeted | `legacy-projections.test.ts` passes after the fix | vitest |
| Validity | The census JSON parses | `python3 -c json.load` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Projection manifest | Internal | Green | Defines the correct path |
| sk-prompt on-disk layout | Internal | Green | Ground truth for the path |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The census fix breaks another test.
- **Procedure**: `git checkout -- state-backend-census.json`; the change is a single string, fully reversible.

<!-- /ANCHOR:rollback -->
