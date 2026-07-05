# Iteration 001: Phase Documentation Map Status Drift

## Focus
- Scope: Phase Documentation Map status columns across all 8 phase parents
- Question: Are Phase Documentation Map statuses consistent with actual evidence?

## Findings

### F-001: Phase Documentation Map tables stuck at "Draft" despite Complete parent status

**Severity: High (systemic drift)**

Every phase parent (002-007) that uses a Phase Documentation Map shows its child rows stuck at **"Draft"** status, while the parent's own METADATA table claims **"Status: Complete"**. This is a direct internal contradiction within the same file.

**Evidence:**

| Phase | Parent Status | Phase Doc Map Child Status | Contradiction? |
|-------|--------------|---------------------------|----------------|
| 002-deep-loop-runtime | Complete (line 55) | ALL 18 rows = Draft (lines 123-140) | YES |
| 003-deep-loop-workflows | Complete (line 45) | ALL 12 rows = Draft (lines 105-116) | YES |
| 004-system-spec-kit | Complete (line 53) | 1 row = Draft (line 197) | YES |
| 005-skill-interconnection | Complete (line 53) | 1 row = Draft (line 200) | YES |
| 006-ux-observability-automation | Complete (line 56) | ALL 6 rows = Draft (lines 211-216) | YES |
| 007-testing | Complete (line 53) | ALL 2 rows = Draft (lines 198-199) | YES |

[SOURCE: `002-deep-loop-runtime/spec.md:55,123-140`]
[SOURCE: `003-deep-loop-workflows/spec.md:45,105-116`]
[SOURCE: `004-system-spec-kit/spec.md:53,197`]
[SOURCE: `005-skill-interconnection/spec.md:53,200`]
[SOURCE: `006-ux-observability-automation/spec.md:56,211-216`]
[SOURCE: `007-testing/spec.md:53,198-199`]

**Root cause:** The Phase Documentation Map tables were authored as templates during the spec scaffolding phase (with all rows set to "Draft") and were never updated when implementation completed. The parent METADATA table was updated to "Complete" but the phase map rows below it were left at the template default.

**Impact:** A future operator using `/speckit:resume [parent]/[child]/` or reading the phase map to triage status will see "Draft" for every child, directly contradicting the parent's "Complete" claim. This makes the phase map useless for status triage.

**Recommendation:** Add a `step_phase_map_status_sync` to the `speckit:complete` workflow (or a post-completion reducer pass) that reads each child's implementation-summary.md `completion_pct` and propagates it into the parent's Phase Documentation Map Status column. For immediate remediation, update all 40 child rows across phases 002-007 from "Draft" to "Complete" (or their actual status).

## Novelty Justification
First comprehensive cross-phase audit confirming the Draft-status drift is 100% systemic (all 40 child rows across 6 phases). Prior review lineages noted this in passing for specific phases but did not quantify the full scope.

## What Was Tried and Failed
- Checked if any phase map had been partially updated (none had — all rows uniformly "Draft")
- Checked if the graph-metadata.json compensated (it did not — parent last_active_child_id is null)

## Ruled-Out Directions
- The Draft status is NOT intentional (parent METADATA says Complete and REQ-002 in each parent says "All child deliverables reach Status: Complete")
