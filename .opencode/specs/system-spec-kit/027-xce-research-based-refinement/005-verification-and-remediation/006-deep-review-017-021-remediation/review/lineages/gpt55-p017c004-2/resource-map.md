# Review Resource Map

Target `resource-map.md` was absent at init, so the resource-map coverage gate was skipped.

## Evidence Files Touched

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/confidence-calibration.vitest.ts`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/fit-calibration.mjs`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/004-confidence-calibration-labeled-set/assets/confidence-labeled-set.starter.json`

## Novel Logic Gaps

- F001: Starter labeled set wrapper shape is not accepted by `loadLabeledSet()`.
