---
title: "Changelog: Cross-Surface trigger_phrases Coherence Assertion [005-spec-data-quality/001-on-write-quality/005-trigger-coherence-assertion]"
description: "Chronological changelog for the Cross-Surface trigger_phrases Coherence Assertion phase."
trigger_phrases:
 - "phase changelog"
 - "nested changelog"
 - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-21

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/005-trigger-coherence-assertion` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Added

- No new additions recorded.

### Changed

- Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Fixed

- No fixes recorded.

### Verification

- bash .opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh <divergent-fixture> emits a warn finding naming the orphan phrases - PLANNED, not yet run
- bash .opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh <capped-fixture> reports no finding on a 12-entry derived subset against 15 frontmatter triggers - PLANNED, not yet run
- bash .opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh <no-derived-fixture> reports no coherence finding for the absent derived surface - PLANNED, not yet run
- rg -n 'trigger_phrases' .opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts confirms the normalization the rule mirrors at lines 387-390 - PLANNED, not yet run
- bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs --strict dry run exits non-error with warn findings across the live corpus - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh` | Planned create | Read the three surfaces, normalize each set, and emit a warn finding for any indexed or derived phrase absent from curated frontmatter |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Planned modify | Register the new rule at severity: warn next to the description and graph-metadata shape rules |
| `.opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts` | Read-only reference | Source of the dedupe([...]).slice(0, 12) normalization the rule must mirror at lines 387-390 |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- Land it default-off and warn first, then flip to error only after the corpus backfill reads zero, per the migration sequence in `028-governance-rollout`.
