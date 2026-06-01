---
title: "system-skill-advisor doc and config drift fixes"
description: "Three drift issues in system-skill-advisor are resolved: a TS5103 build failure from an out-of-range ignoreDeprecations value, disagreement on the 8-vs-9 tool count across docs, and a stale registration comment in opencode.json."
trigger_phrases:
  - "skill-advisor build failure"
  - "ignoreDeprecations TS5103"
  - "skill-advisor doc drift"
  - "advisor tool count 8 vs 9"
  - "opencode.json registration comment stale"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/003-fix-documentation-config-drift` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation`

### Summary

Three drift issues that surfaced during a routine analysis pass on system-skill-advisor are now resolved. The TS5103 build failure, a one-character fix, is unblocked and the tool-count narrative of "8 public + 1 internal trusted-caller" (9 total) reads identically across SKILL.md, ARCHITECTURE.md, README.md, and opencode.json.

### Added
- None.

### Changed
- `ignoreDeprecations` in `mcp_server/tsconfig.json` reduced from `"6.0"` to `"5.0"` for TypeScript 5.9.3 compatibility.
- Tool count narrative standardized to "8 public plus 1 internal trusted-caller (9 total)" across SKILL.md §3, ARCHITECTURE.md §1 and §6, and README.md §1.
- opencode.json `_NOTE_2_TOOLS` registration comment updated from 8 tools to 9 tools and now explicitly names `propagate_enhances`.

### Fixed
- TS5103 build failure (`Invalid value for '--ignoreDeprecations'`) in `system-skill-advisor/mcp_server`. The build now progresses past the config validation step.

### Verification
- `npm run build` TS5103 check: PASS. Zero TS5103 occurrences in build.log (was 1 before the fix).
- `npm run build` overall exit: EXIT 2 with 14 errors, all in `lib/shared/embeddings/` symlinked path (pre-existing, owned by follow-on packet 040 per spec §3 Out of Scope).
- `validate.sh --strict` on this packet: PASS. Zero errors, zero warnings.
- Manual grep for stale phrasing across SKILL.md, ARCHITECTURE.md, README.md, INSTALL_GUIDE.md, and opencode.json: PASS. No stale phrasing remains.
- opencode.json JSON validity after edit: PASS.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` | Modified | `"ignoreDeprecations": "6.0"` changed to `"5.0"` for TS 5.9.3 compatibility |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modified | §3 split into Public (8) and Internal trusted-caller (1) with tool-ids-reference pointer |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modified | §1 added Visibility column and internal row, §6 added propagate_enhances row and replaced stale disclaimer, §9 removed obsolete opencode.json future-work bullet |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | §1 clarified 8 public plus 1 internal split with reference link |
| `opencode.json` | Modified | `_NOTE_2_TOOLS` now reports 9 tools and names `propagate_enhances` |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/003-fix-documentation-config-drift/*` | Created | Level 1 spec packet (spec, plan, tasks, implementation-summary, description.json, graph-metadata.json) |

### Follow-Ups
- Embeddings module resolution regression in `lib/shared/embeddings/` symlink path needs investigation, owned by follow-on packet 040 per spec §3 Out of Scope.
- Regression fixture reconciliation remains on the future-work list.
