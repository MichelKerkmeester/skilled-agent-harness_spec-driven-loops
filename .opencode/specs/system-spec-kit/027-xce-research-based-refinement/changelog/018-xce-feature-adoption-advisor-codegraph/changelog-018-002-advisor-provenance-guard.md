---
title: "Changelog: 002-advisor-provenance-guard"
description: "Advisor edge propagation now stamps server-derived source_kind and protects manual/trusted provenance from automated overwrites."
trigger_phrases:
  - "018 002 advisor provenance changelog"
  - "advisor source_kind guard"
  - "manual edge protection"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph`

### Summary

Automated advisor edge propagation now records where edge writes came from and refuses to replace manually maintained provenance. Automated propagation stamps `source_kind: "automated"`; trusted-maintainer server writes can intentionally update protected fields and stamp `source_kind: "trusted"`.

### Added

- Edge source and write-intent types.
- Guard coverage for provenance derivation, manual protection, trusted updates, and legacy tolerance.

### Changed

- Cross-skill edge application derives provenance from server-side write intent rather than candidate payload fields.
- `skill_graph_propagate_enhances` forces propagation writes to automated server intent.

### Fixed

- Automated propagation skips protected manual/trusted edges instead of overwriting them.

### Verification

| Check | Result |
|-------|--------|
| Advisor typecheck | PASS |
| Advisor build | PASS |
| Targeted cross-skill/skill-graph Vitest suites | PASS: 8 files, 30 passed, 1 skipped |
| Alignment drift | PASS: 269 files, 0 findings |
| Comment hygiene | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `apply-graph-metadata-patch.ts` | Modified | Derived `source_kind` and protected manual overwrites |
| `cross-skill-edges/index.ts` | Modified | Write intent passed into apply helper |
| `cross-skill-edges/types.ts` | Modified | Edge source and write-intent types |
| `propagate-enhances.ts` | Modified | Automated intent enforced |
| `cross-skill-edges.vitest.ts` | Modified | Guard tests added |

### Follow-Ups

- Full-suite settings parity failures remained out of scope in the source summary.
