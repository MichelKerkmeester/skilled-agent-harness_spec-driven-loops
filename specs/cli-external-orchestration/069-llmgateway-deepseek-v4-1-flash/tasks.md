---
title: "Tasks: The DevPass DeepSeek route moves to V4.1 Flash"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: The DevPass DeepSeek route moves to V4.1 Flash

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Probe the gateway's model listing for a V4.1 Flash id
- [x] T002 Call the candidate, the retired id and a prefixed form, and record all three status codes
- [x] T003 Probe every reasoning-effort tier before pointing a forced pin at the route
- [x] T004 [P] Inventory every live reference to the retired id, and every copy of the effort-pin pattern
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Move the allowlist entry, provider mapping, default and pin (`fanout-run.cjs`)
- [x] T006 Move the same four in the source of record (`lib/deep-loop/executor-config.ts`)
- [x] T007 Update the Pi provider block with the measured context, output ceiling and rates (`.pi/models.json`)
- [x] T008 [P] Update the picker entry and the gateway setup doc (`.pi/settings.json`, `.pi/custom-providers.md`)
- [x] T009 Rewrite the cli-pi gateway section: roster row, id-shape example, reachability prose
- [x] T010 Rewrite the cli-opencode gateway section: roster row, bare-id footgun, effort table, model count
- [x] T011 Write one changelog entry per skill and move both anchors
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run both deep-loop suites, and fix the third copy of the pin pattern the failure exposed
- [x] T013 Scan for any surviving live reference to the retired id
- [x] T014 Run the repository frontmatter gate
- [x] T015 Confirm the sibling routes were not caught by the replacement
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both deep-loop suites pass from the final state
- [x] CHK-011 [P0] No new warning from either suite
- [x] CHK-012 [P1] The comments state why the id moved, not which packet moved it
- [x] CHK-013 [P1] The script and its TypeScript source stay byte-mirrored on all four wiring points
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Live dispatch behaviour confirmed against the gateway, not inferred from a listing
- [x] CHK-022 [P1] Edge cases tested: retired id, prefixed id, every effort tier
- [x] CHK-023 [P1] Error scenarios validated: `410`, `400` and `200` each observed and told apart
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `cross-consumer`: one upstream deactivation, several surfaces that named the id.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the gateway is the only producer, and its listing was read in full.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the runtime, both mirrors, the private test copy, three Pi files and two rosters.
- [x] CHK-FIX-004 [P0] The invariant is stated and its adversarial case covered: one literal maps to one provider, so three lookalike literals had to survive untouched, confirmed by scan.
- [x] CHK-FIX-005 [P1] Axes listed: route (gateway, opencode-go, cline-pass, OpenRouter), surface class (runtime, config, roster, test) and id shape (bare, prefixed).
- [ ] CHK-FIX-006 [P1] Hostile env variant not run. The change is a string in a lookup table with no process-wide state to perturb.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the final working-tree state, with both suites rerun after the last edit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The gateway key stays env-keyed and appears in no doc or config literal.
- [x] CHK-031 [P0] Input validation implemented. The allowlist still refuses an off-roster id before dispatch.
- [x] CHK-032 [P1] Auth/authz working correctly. The credential shape is unchanged and was exercised by the probe.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. Each states why the id moved and what the gateway now answers.
- [x] CHK-042 [P2] README updated. Not applicable, neither skill README names a model id.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Probe output stayed in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

The one unverified P1 is CHK-FIX-006, which has no process-wide state to observe.

**Verification Date**: 2026-09-10
<!-- /ANCHOR:summary -->

---
