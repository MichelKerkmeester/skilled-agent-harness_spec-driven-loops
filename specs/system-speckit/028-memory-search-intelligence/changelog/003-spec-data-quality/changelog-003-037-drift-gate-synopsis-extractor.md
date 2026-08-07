---
title: "Changelog: Drift Gate and Synopsis Extractor [003-spec-data-quality/006-generated-metadata-build/037-drift-gate-synopsis-extractor]"
description: "Chronological changelog for the drift gate and synopsis extractor phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/037-drift-gate-synopsis-extractor` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality`

### Summary

Shipped a generated-metadata drift gate and one shared synopsis extractor that both the `description` and `causal_summary` fields derive from. The extractor uses one precedence over one source doc so the two fields can no longer diverge. The gate re-derives the stored fields, reports drift, never writes the folder, and skips the re-derive when a persisted `source_doc_hashes` freshness key still matches. Both behaviors shipped behind the default-OFF `SPECKIT_GENERATED_METADATA_DRIFT_GATE` flag and a grandfather report mode so a flag-off derive stays byte-identical.

### Added

- `derivePacketSynopsis(specContent, field)` in `mcp_server/lib/description/packet-synopsis.ts` with explicit precedence (Overview paragraph then Problem/Purpose first sentence then frontmatter description then title heading then first body line) and field-specific limits (`SYNOPSIS_FIELD_LIMITS`: description 150 causal_summary 600).
- `checkGeneratedMetadataDrift`, `resolveGeneratedMetadataDrift`, and `computeSourceDocHashes` in `mcp_server/lib/graph/generated-metadata-drift.ts`, re-exported from the parser and the api barrel.
- An optional `source_doc_hashes` freshness key persisted on `graph-metadata.json` under `derived`, a sha256 per source doc, flag-gated so legacy files and a flag-off derive omit it.
- The default-OFF `SPECKIT_GENERATED_METADATA_DRIFT_GATE` capability flag.
- A `GENERATED_METADATA_DRIFT` report-only rule in `validate.sh` and the validator registry via the `scripts/validation/generated-metadata-drift.ts` bridge.
- An 11-case vitest at `scripts/tests/generated-metadata-drift.vitest.ts` covering the drift detection, the no-write proof, the shared-extractor precedence, and the grandfather-vs-enforce verdict.

### Changed

- With the flag on, `extractDescription` in `folder-discovery.ts` and `deriveCausalSummary` in `graph-metadata-parser.ts` both route through the shared extractor, so the two fields derive from the same precedence over the same source doc and flip together. With the flag off both keep their legacy local extractors byte-identical.
- The dry-run backfill summary surfaces a `drift` array without mutating the folder it reads.
- The bridge sets grandfather mode from the flag, so with the flag off drift resolves to non-blocking `info` and the strict exit code is unchanged, and only with the flag on does drift become a hard `error`.

### Fixed

- No fixes recorded. This phase is hardening over an already-idempotent generator, not a fix.

### Verification

- Flag-off-vs-on verdict via `resolveGeneratedMetadataDrift` - PASS, vitest grandfather case resolves `info` and enforce case resolves `error`.
- Drift detection - PASS, vitest returns drift for a changed folder and none for an in-sync folder.
- No-write proof - PASS, vitest sha256 snapshot shows folder bytes unchanged across a drift check.
- Shared extractor - PASS, vitest confirms both fields derive from one extractor with the same precedence and flip together, each honoring its own limit.
- Freshness key - PASS, vitest shows a doc edit changes `source_doc_hashes` and hashes persist only when the flag is on.
- Typecheck both modules - PASS, `tsc --noEmit` exit 0 on `mcp_server` and `scripts`.
- Touched-module regression - PASS, 210 passed 2 skipped.
- ENV_REFERENCE drift guard - PASS, 3 tests.
- Docs gate - PASS, `validate.sh --strict` on this folder exit 0.
- Full phase vitest - PASS, 11 of 11.

### Files Changed

- `.opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts`: created the shared `derivePacketSynopsis` helper.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/generated-metadata-drift.ts`: created the drift gate and the source-doc-hash helpers.
- `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`: added the default-OFF `SPECKIT_GENERATED_METADATA_DRIFT_GATE` flag.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`: routed `description` through the shared helper behind the flag.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`: routed `causal_summary` through the shared helper, persisted `source_doc_hashes`, re-exported the drift gate.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`: added the optional `source_doc_hashes` field.
- `.opencode/skills/system-spec-kit/mcp_server/api/index.ts`: exported the drift gate and the shared extractor.
- `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-drift.ts`: created the validate.sh bridge for the drift rule.
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`: wired `GENERATED_METADATA_DRIFT` as a report-only strict rule.
- `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`: registered the `GENERATED_METADATA_DRIFT` rule.
- `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`: surfaced the drift report in the backfill summary without mutating the folder.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`: registered the new flag plus sibling flags.
- `.opencode/skills/system-spec-kit/scripts/tests/generated-metadata-drift.vitest.ts`: created the 11-case vitest.

### Follow-Ups

- The phase shipped default-OFF and deferred the scoped migration and the hard flip. `SPECKIT_GENERATED_METADATA_DRIFT_GATE` later GRADUATED to default-ON after the phase 039 migration was re-run with the flag set, which wrote `source_doc_hashes` tree-wide and gave the gate the freshness baseline it enforces against. Drift now fails strict.
