# Deep Review Report

## Executive Summary

- Verdict: **CONDITIONAL**
- hasAdvisories: false
- Active findings: P0=0, P1=4, P2=0
- Stop reason: `maxIterationsReached`
- Scope: routing-refactor parent contract, current routing explainers, advisor source paths, router-unification phase maps, live hub manifests, and compiled-routing safety surfaces.

The runtime-security pass found no confirmed P0/P1 issue. The release condition is documentation reconciliation: four P1 drifts make the packet's authoritative and phase-parent navigation surfaces unreliable.

## Planning Trigger

`/speckit:plan` is required because the verdict is CONDITIONAL.

Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F001", "F002", "F003", "F004"],
  "remediationWorkstreams": [
    "Reconcile the two routing explainers against the current seven-hub manifest rollout.",
    "Replace stale advisor mcp_server source paths with maintained mcp-server paths.",
    "Refresh the router-unification and unified-implementation phase maps."
  ],
  "specSeed": [
    "Define one current-state routing capability inventory and label historical snapshots.",
    "Require phase-parent maps to enumerate every direct numbered child."
  ],
  "planSeed": [
    "Inventory live routing carriers and update both explainers atomically.",
    "Validate every cited advisor path on disk.",
    "Regenerate parent phase maps from direct child packets and reconcile lifecycle wording."
  ],
  "findingClasses": ["documentation-drift", "broken-reference", "phase-map-drift"],
  "affectedSurfacesSeed": ["routing reference", "advisor maintenance", "phase-parent resume routing"],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

### F001 — P1 — Authoritative routing reference reports a two-hub manifest surface after fleet rollout

- Dimension: correctness / traceability
- Evidence: `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:122-124`, `:198-203`; live parent-hub manifests at line 1.
- Impact: planning and measurement decisions use an obsolete fleet boundary.
- Recommendation: rebuild the carrier matrix from the live seven parent hubs and reconcile it with `routing-before-after.md`.
- Disposition: active.

### F002 — P1 — Advisor reference points to non-authoritative underscore source paths

- Dimension: traceability
- Evidence: `.opencode/specs/sk-doc/019-skill-routing-refactor/routing-config-and-advisor-reference.md:167-174`; maintained files under `.opencode/skills/system-skill-advisor/mcp-server/`.
- Impact: documented verification and maintenance paths fail or enter the compatibility tree.
- Recommendation: cite `mcp-server` for TypeScript, graph, tools, tests, and plugin bridges; label `mcp_server` compatibility surfaces separately.
- Disposition: active.

### F003 — P1 — Router-unification parent still presents the implementation as a seven-phase planned program

- Dimension: traceability
- Evidence: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/spec.md:28-43`; completed runtime cutover at `007-unified-refactor-implementation/011-runtime-engine/implementation-summary.md:23`.
- Impact: parent-level resume and status guidance points at an obsolete program state.
- Recommendation: update the parent phase map and current-vs-historic section to reflect the expanded implementation program.
- Disposition: active.

### F004 — P1 — Unified implementation parent omits phases 009 through 015

- Dimension: maintainability
- Evidence: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:28-40`; later status-bearing child summaries.
- Impact: most current implementation work is absent from the mandatory phase-parent navigation contract.
- Recommendation: enumerate all direct numbered children, their current statuses, dependencies, and resume target.
- Disposition: active.

## Remediation Workstreams

1. Routing truth reconciliation: update the carrier matrix, typed-surface counts, and live-vs-aspirational narrative.
2. Advisor path repair: validate every cited path and separate maintained from compatibility trees.
3. Parent-map repair: bring both nested phase parents up to date from direct children and canonical summaries.

## Spec Seed

- One canonical current-state inventory should own carrier counts.
- Historical before/after claims should be timestamped or explicitly labeled as snapshots.
- Phase-parent maps should be exhaustive for direct numbered children.

## Plan Seed

- Generate a live carrier inventory from hub roots and compare both explainers.
- Run exact path-existence checks for every advisor code citation.
- Enumerate direct child packets under both affected phase parents and reconcile statuses.
- Re-run the same four review dimensions after edits.

## Traceability Status

### Core Protocols

- `spec_code`: fail — four current-state contradictions remain.
- `checklist_evidence`: pass — child summaries provide evidence for the implemented state.
- `AC_COVERAGE`: exempt — phase-parent target has no lifecycle-active checklist at its root.

### Overlay Protocols

- `skill_agent`: not applicable.
- `agent_cross_runtime`: not applicable.
- `feature_catalog_code`: pass for the compiled-routing behavior sampled.
- `playbook_capability`: pass; typed surfaces exist, while their accounting is stale.

## Deferred Items

- Generated `graph-metadata.json` lifecycle statuses were not treated as authoritative because several phase-parent derivations are known to lag canonical packet documents.
- Historical research and lineage artifacts retain as-of-when-written paths by policy.

## Dimension Expansion Map

- Correctness expanded from the definitive reference into all seven live hub manifests.
- Security expanded into fallback, kill-switch, activation-root containment, and symlink handling.
- Traceability expanded from the root phase parent into advisor maintained sources and nested program parents.
- Maintainability expanded into direct-child enumeration and resume navigation.
- Stabilization replayed all findings and found no severity upgrade or new P0.

## Search Ledger

- Graph coverage mode: graphless fallback; the available code graph was empty.
- Methods: direct reads, exact `rg`, filesystem carrier inventory, parent-to-child evidence trace, negative security inspection.
- Search debt: none within the declared review scope.
- Clean proof: all seven parent hubs checked for manifests; both affected phase parents checked against direct children.

## Audit Appendix

- Iterations: 5/5
- Dimensions: 4/4
- Findings trend: 1 → 0 → 2 → 1 → 0 new findings
- Final active findings: P0=0, P1=4, P2=0
- Resource Map Coverage Gate: skipped because no parent-level `resource-map.md` existed at initialization.
- Adversarial replay: all P1 claims re-read; no false positive or downgrade supported.
