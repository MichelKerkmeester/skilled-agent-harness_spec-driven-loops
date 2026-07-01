# Iteration 009: graph-metadata.json key_files Omissions (P1-007) + Parent Metadata Gaps

## Focus
- Scope: Parent graph-metadata.json key_files, last_active_child_id, and description.json truncation
- Question: Does graph-metadata.json include real implementation surfaces in key_files?

## Findings

### F-009: Parent graph-metadata.json key_files omit ALL real implementation surfaces; last_active_child_id is null; description.json is truncated

**Severity: High (resume/navigation/metadata discovery broken)**

**Problem 1: key_files omission (P1-007 confirmed and deepened)**

The parent `graph-metadata.json` `derived.key_files` contains:
```json
"key_files": [
  "001-reference-research/research/research.md",
  "spec.md"
]
```

[SOURCE: `graph-metadata.json:44-47`]

This lists only 2 files — the reference research output and the parent spec. It completely omits:
- All 18 deep-loop-runtime implementation surfaces (atomic-state.ts, loop-lock.ts, convergence.cjs, fanout-pool.cjs, fanout-run.cjs, etc.)
- All 12 deep-loop-workflows implementation surfaces (deep_research_auto.yaml, reduce-state.cjs, etc.)
- All system-spec-kit command surfaces (complete.md, plan.md, implement.md)
- All skill-advisor surfaces (aliases.ts, skill_advisor.py)
- All observability surfaces (observability-events.cjs)
- All remediation child docs

The phase parent spec.md `key_files` continuity frontmatter is even worse — it's an empty array:
```yaml
key_files: []
```
[SOURCE: `spec.md:19`]

Meanwhile, phase children 002-007 DO list their key_files correctly in their own continuity frontmatter (e.g., 002 lists atomic-state.ts, loop-lock.ts, convergence.cjs, fanout-pool.cjs, fanout-run.cjs). But the parent never aggregated them.

**Problem 2: last_active_child_id is null**

```json
"last_active_child_id": null,
"last_active_at": null
```
[SOURCE: `graph-metadata.json:104-105`]

Despite 8 child phases with completed work, the parent has no `last_active_child_id` pointer. This breaks the resume flow: `/speckit:resume` on the parent has no derived "most recently active" child to jump to, forcing the operator to manually enumerate children.

**Problem 3: description.json truncation**

```json
"description": "Our loop-based systems (deep-loop-runtime, deep-loop-workflows, and the system-spec-kit commands/agents that drive them) carry known gaps in resilienc"
```
[SOURCE: `description.json:4`]

The description is truncated mid-word ("resilienc" — should be "resilience, ..."). This was likely caused by a `description` field extraction that sliced at a fixed character count without word-boundary awareness. The `keywords` array also contains a truncated token: `"resilienc"`.

**Root cause:**
- `key_files`: `generate-context.js` derives key_files from the source doc (spec.md only), which has `key_files: []` in its frontmatter. The derivation never falls through to child phases to aggregate their key_files.
- `last_active_child_id`: The graph-metadata derivation doesn't update the parent pointer when a child is saved.
- `description.json`: Likely a `description.slice(0, 200)` or similar fixed-width extraction without word-boundary handling.

**Recommendation:**
1. **key_files:** Add a `step_aggregate_child_key_files` to `generate-context.js` that reads each child's continuity `key_files` and aggregates them into the parent's `graph-metadata.json derived.key_files`
2. **last_active_child_id:** Update the parent's `last_active_child_id` whenever a child phase is saved (set to the child's folder slug + timestamp)
3. **description truncation:** Replace fixed-width slice with a word-boundary-aware truncation, or store the full description and truncate only for display
4. **Backfill:** Re-run `generate-context.js` against all 8 child phases to populate parent metadata

## Novelty Justification
Deepened P1-007 by discovering 3 distinct metadata failures in the same parent (key_files + last_active_child_id + description truncation). The description.json truncation is a new finding not in any prior review. The empty `key_files: []` in the parent spec.md frontmatter (as opposed to the graph-metadata derived key_files) is also new.

## What Was Tried and Failed
- Checked if child phases compensated by having rich key_files (they do, but the parent doesn't aggregate)
- Checked if description.json had the full description elsewhere (it does not — the truncation is in the primary field)

## Ruled-Out Directions
- The omissions are NOT acceptable for a phase parent (resume and navigation depend on these fields)
