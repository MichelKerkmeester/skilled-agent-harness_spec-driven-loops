# Iteration 003: Stale completion_pct:0 Frontmatter Across Child Phases

## Focus
- Scope: _memory.continuity.completion_pct values across all child phase documents
- Question: How widespread is the stale completion_pct:0 drift?

## Findings

### F-003: Systemic completion_pct:0 drift across spec.md/plan.md/tasks.md while implementation-summary.md says 100

**Severity: High (3-way metadata contradiction)**

A systematic 3-way contradiction exists across child phase documents:
- `implementation-summary.md`: `completion_pct: 100` (correctly updated after implementation)
- `spec.md`: `completion_pct: 0` (never updated from template default)
- `plan.md`: `completion_pct: 0` (never updated from template default)
- `tasks.md`: `completion_pct: 0` (never updated from template default)

**Quantified scope (from rg scan):**

At least **50+ files** carry stale `completion_pct: 0` despite their sibling `implementation-summary.md` confirming `completion_pct: 100`. Examples by phase:

**002-deep-loop-runtime (18 sub-phases, all affected):**
Every sub-phase has spec.md/plan.md/tasks.md at `completion_pct: 0` while implementation-summary.md says 100.
[SOURCE: `002-deep-loop-runtime/001-atomic-state-serialize-diff/{spec,plan,tasks}.md:24-25`]
[SOURCE: `002-deep-loop-runtime/002-atomic-state-integrity-helpers/{spec,plan,tasks}.md:24-25`]
(...and 16 more sub-phases — pattern is uniform)

**003-deep-loop-workflows (12 sub-phases, all affected):**
Same pattern.
[SOURCE: `003-deep-loop-workflows/001-anti-convergence-floor/{spec,plan,tasks}.md:24-27`]
(...and 11 more)

**006-ux-observability-automation (6 sub-phases, all affected):**
Same pattern.
[SOURCE: `006-ux-observability-automation/001-dashboard-sparkline-trend/{spec,plan,tasks}.md:24-27`]
(...and 5 more)

**001-reference-research (top-level phase):**
- `plan.md:25`: `completion_pct: 0`
- `tasks.md:24`: `completion_pct: 0`
- `implementation-summary.md:24`: `completion_pct: 0`
- BUT the parent spec Phase Doc Map says this phase is "Complete"
[SOURCE: `001-reference-research/plan.md:25, tasks.md:24, implementation-summary.md:24`]

**008-loop-systems-remediation (parent):**
- `plan.md:25`: `completion_pct: 0`
- `tasks.md:24`: `completion_pct: 0`
- `implementation-summary.md:24`: `completion_pct: 0`
- BUT the parent spec says `completion_pct: 100` at line 27
[SOURCE: `008-loop-systems-remediation/plan.md:25, tasks.md:24, implementation-summary.md:24, spec.md:27`]

**Root cause:** The `speckit:complete` workflow (or `generate-context.js`) updates `completion_pct` in the `implementation-summary.md` (the canonical continuity surface) but does NOT propagate the same value back to `spec.md`, `plan.md`, and `tasks.md` frontmatter. These three files retain the template default of 0.

**Impact:**
1. **Resume ambiguity:** `/speckit:resume` reads `_memory.continuity` from `implementation-summary.md` (correct), but a human or agent reading `spec.md` or `plan.md` first will see `completion_pct: 0` and believe the phase is unstarted.
2. **Graph-metadata staleness:** `graph-metadata.json` derivation may read from the wrong source if the source-doc list includes spec.md/plan.md.
3. **Validation noise:** `validate.sh` may not flag this because each file's frontmatter is internally valid; the contradiction is cross-file.

**Recommendation:**
1. Add a `step_completion_pct_sync` to the `speckit:complete` workflow that writes `completion_pct` from `implementation-summary.md` into all sibling doc frontmatter in the same folder.
2. For immediate remediation: a one-shot script that reads each `implementation-summary.md` `completion_pct` and patches `spec.md`, `plan.md`, `tasks.md` in the same directory.
3. Add a validate.sh check that flags cross-file `completion_pct` contradictions within the same folder.

## Novelty Justification
Quantified the scope at 50+ files (prior review iterations noted individual cases). Identified the 4-way split (spec/plan/tasks at 0 vs implementation-summary at 100 vs parent spec at 100 vs graph-metadata null). Discovered the 001-reference-research case where even implementation-summary.md itself says 0 despite being marked Complete.

## What Was Tried and Failed
- Checked whether graph-metadata.json compensated via derived status (it did not — parent last_active_child_id is null)

## Ruled-Out Directions
- The drift is NOT intentional (parent specs claim Complete and REQ-002 requires children to reach Complete)
