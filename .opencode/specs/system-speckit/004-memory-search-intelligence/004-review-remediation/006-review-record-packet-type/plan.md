---
title: "Implementation Plan: Marker-Gated Review Packet Type in the Validator"
description: "The approach for adding a marker-gated review packet type to the feature-spec validator: one entry marker, a review path that requires only the two real review docs, and a strictly-additive guarantee proven against a clean baseline."
trigger_phrases:
  - "review packet type plan"
  - "SPECKIT_LEVEL review path plan"
  - "additive validator change plan"
  - "lean review template plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/004-review-remediation/006-review-record-packet-type"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the additive review-path approach and the two-way proof"
    next_safe_action: "Mark the remaining lean deep-review packets as review records"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
      - ".opencode/skills/system-spec-kit/scripts/utils/template-structure.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-028-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Marker-Gated Review Packet Type in the Validator

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash validator over TypeScript validation services |
| **Framework** | system-spec-kit spec validator and its docs manifest |
| **Storage** | The templates manifest and the compiled validator dist |
| **Testing** | Vitest review-record suite plus valid and missing-report fixtures |

### Overview
An additive change that teaches the validator a new packet shape without touching any existing shape. A spec.md carrying `<!-- SPECKIT_LEVEL: review -->` enters a review path that requires only spec.md and `review/review-report.md` and waives the rest of the Level 1 doc set. The marker is the sole entry, so the bash validator, the template-structure utility, the docs manifest, the lean review template, and the production resolver and orchestrator and structure gate all gate on it, and every pre-existing packet keeps its prior result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The lean review-record shape identified: spec.md plus `review/review-report.md` only
- [x] The marker chosen as the sole entry into the review path
- [x] The additive requirement stated: no existing Level 1, Level 2, Level 3, or phase folder changes

### Definition of Done
- [x] The review path passes a valid review record and fails a missing report
- [x] The waived docs are not demanded and the freeform report is excluded from the wrong gates
- [x] The additive claim proven two ways and the 009 packet validates clean at exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Marker-gated additive path. A single `SPECKIT_LEVEL: review` marker is the only thing that routes a packet onto the review path, so the path is opt-in per packet and the default behavior is unchanged. Both validator surfaces, the bash entry point and the compiled TypeScript services, read the same marker, so the result is consistent whether the packet is validated by the shell script or by the production dist.

### Key Components
- **The bash detector**: `detect_level` in `validate.sh` recognizes the review marker and the help text lists it
- **The template-structure utility**: adds the review level, the review template path, and the review allowed-anchors
- **The docs manifest**: a review level row, a review-record taxonomy, and the freeform review-report doc entry
- **The lean review template**: a subset of the L1 spec anchors, metadata, problem, scope, review-summary, and questions
- **The production validator**: the resolver, orchestrator, and structure gate gain review handling and exclude the freeform report from three gates
- **The numeric-level guard**: `check-files.sh` guards its numeric comparison so a string level does not crash

### Data Flow
A spec.md is read and its `SPECKIT_LEVEL` marker is detected. A numeric level routes to the existing Level 1, Level 2, or Level 3 path unchanged. The `review` marker routes to the review path, which requires spec.md and `review/review-report.md`, waives plan, tasks, checklist, implementation-summary, and decision-record, and excludes the freeform review-report from the template-source, frontmatter-continuity, and sufficiency gates. The production dist applies the same routing so the compiled validator agrees with the shell script.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Define the lean review-record shape and choose the marker as the sole entry
- [x] State the additive requirement that no existing path changes behavior
- [x] Plan the two-way proof against a clean baseline

### Phase 2: Core Implementation
- [x] Teach `detect_level` and the help text the review marker in `validate.sh`
- [x] Add the review level, template path, and allowed anchors to `template-structure.js`
- [x] Add the review level row, taxonomy, and freeform report entry to the docs manifest
- [x] Create the lean review spec template and wire the production resolver, orchestrator, and structure gate
- [x] Guard the numeric-level comparison in `check-files.sh`

### Phase 3: Verification
- [x] Add four review-record tests and the valid and missing-report fixtures
- [x] Confirm the fixture suites return identical pass and fail before and after
- [x] Stash the change, rebuild the dist to HEAD, and confirm an unrelated failure is identical with and without it
- [x] Mark the 009 packet as a review record and confirm it validates at exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The review path passes valid and fails missing report | `review-record-validation.vitest.ts`, 4 tests |
| Fixture | A valid review record and a missing-report record | `068-review-record-valid`, `069-review-record-missing-report` |
| Regression | Existing fixture suites unchanged before and after | Pass and fail comparison on a clean baseline |
| Baseline | An unrelated phase-parent failure is unchanged | Stash, rebuild dist to HEAD, compare with and without |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The templates manifest | Internal | Green | No review level row or freeform report entry to add |
| The production validator dist | Internal | Green | The compiled validator would not honor the review path |
| The Vitest fixture harness | Internal | Green | The valid and missing-report cases cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The review path leaks into an existing packet or the dist disagrees with the shell script
- **Procedure**:
  1. Revert the resolver, orchestrator, and structure-gate edits and rebuild the dist
  2. Revert the bash detector, the template-structure utility, the manifest, and the new template
  3. Re-run the fixture suites and confirm the pre-change pass and fail set is restored
<!-- /ANCHOR:rollback -->
