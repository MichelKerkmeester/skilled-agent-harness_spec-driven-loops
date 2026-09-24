---
title: "Resource Map — v3.x Spec-Kit Packets to v4 Strict Validation"
description: "Synthesis resource map for the five-iteration detached research lineage."
trigger_phrases: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 29
- **By category**: Specs=3, Harness=3, Validator registry and orchestrator=3, Rule bridges=6, Repair and backfill tools=6, Pipeline wrappers=2, Versioned tag surfaces=2, Runtime policy=1, Lineage state=3
- **Missing on disk**: 0 among the consulted current-runtime paths; versioned tag surfaces were read from Git objects
- **Scope**: final synthesis for `fanout-luna-1790242274086-9tq1wi`
- **Generated**: 2026-09-24T09:54:46.000Z

> **Action vocabulary**: `Analyzed` · `Cited` · `Validated`.
> **Status vocabulary**: `OK` · `INFERENCE`.

## Evidence Inventory

| Category | Source | Role | Status |
| --- | --- | --- | --- |
| Spec | `specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md` | Scope, measured baseline, ordering and failure caveats | OK |
| Harness | `scratch/harness/data/v3.0.0.0.final.jsonl` | v3.0 residual rows | OK |
| Harness | `scratch/harness/data/v3.6.0.0.pipeline.jsonl` | v3.6 residual rows | OK |
| Harness | `scratch/harness/validate-all.cjs` | Packet rows, archive labels, bounded details | OK |
| Harness | `scratch/harness/agg.cjs` | Rule-frequency aggregation | OK |
| Runtime | `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Registry and rule grouping | OK |
| Runtime | `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Structural and authored-content boundary | OK |
| Runtime | `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Grandfather and graduation policy | OK |
| Legacy tags | `git show v3.0.0.0:.../scripts/rules/*` | v3.0 contract surface | OK |
| Legacy tags | `git show v3.6.0.0:.../scripts/*` | v3.6 continuity, graph, and save surface | OK |
| Rule bridges | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-files.sh` | File existence | OK |
| Rule bridges | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-level-match.sh` | Level projection | OK |
| Rule bridges | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh` | Provenance | OK |
| Rule bridges | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention-helper.mjs` | Convention and trigger semantics | OK |
| Rule bridges | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-status-cross-doc-consistency.sh` | Status authority | OK |
| Rule bridges | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-scaffold-never-touched.sh` | Authored scaffold protection | OK |
| Repair | `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Deterministic repair, re-derivation, frozen trees | OK |
| Backfill | `.skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts` | Source normalization and archive flag | OK |
| Backfill | `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts` | Scope, hashes, reports, failure arrays | OK |
| Wrapper | `.skilled/skills/system-spec-kit/runtime/cli/continuity/bf-pipeline.sh` | Existing order and status handling | OK |
| Wrapper | `.skilled/skills/system-spec-kit/runtime/cli/spec/fullrun.sh` | Existing validation/repair sequence | OK |
| Lineage | `iterations/iteration-001.md` | Baseline | OK |
| Lineage | `iterations/iteration-002.md` | Validator implementation boundary | OK |
| Lineage | `iterations/iteration-003.md` | Tag provenance | OK |
| Lineage | `iterations/iteration-004.md` | Policy and archive contract | OK |
| Lineage | `iterations/iteration-005.md` | Ordering and idempotence proof | OK |
| Lineage | `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl` | Structured findings and negative knowledge | OK |
| Lineage | `deep-research-state.jsonl` | Canonical gateway projection | OK |
