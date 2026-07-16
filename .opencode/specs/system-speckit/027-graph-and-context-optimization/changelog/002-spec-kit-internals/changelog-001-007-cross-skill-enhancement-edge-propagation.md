---
title: "Cross-Skill Enhancement Edge Auto-Propagation"
description: "Detects and proposes missing inbound enhances edges across skills using composite scoring. Supports report, propose, and apply modes with auto-marker fields for auditability."
trigger_phrases:
  - "skill_graph_propagate_enhances"
  - "cross-skill enhancement edge propagation"
  - "inbound enhances detection"
  - "skill graph edge auto-propagation"
  - "007-cross-skill-enhancement-edge-propagation"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/007-cross-skill-enhancement-edge-propagation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph`

### Summary

When a new skill ships, other skills' `edges.enhances[]` lists had no mechanism to auto-update. Operators had to manually backfill the same pattern repeatedly (twice in one day for a prior release). This packet ships an MCP tool and a `lib/cross-skill-edges/` module that detects missing inbound enhances edges across all skills with composite scoring, surfaces candidates with provenance and confidence, and optionally writes idempotent patches into source `graph-metadata.json` files with auto-marker fields for future audits.

### Added
- MCP tool `skill_graph_propagate_enhances` that scans all skills and detects missing inbound enhances edges using composite scoring: family-inference (max 0.45), asset-shape (max 0.30), and sibling-transitivity (max 0.15)
- Library module `lib/cross-skill-edges/` with type definitions, metadata loader, composite detector, deterministic payload inference, and idempotent graph-metadata patcher
- Three operating modes: report (default, no writes), propose (alias for report), and apply (writes auto-marker fields `auto_added_at` and `auto_added_reason` into source graph-metadata.json)
- `enhance_when` schema-additive field on `graph-metadata.json` enabling skills to declare asset-based and sibling-based matching rules
- Ten Vitest tests covering cli-family arrival, non-family arrival, idempotent re-run, edge-type filtering, weight clipping, high-confidence assertions, auto-marker round-trip verification, parse error surfacing, and malformed input guards

### Changed
- `system-skill-advisor` and `sk-prompt` graph-metadata.json files gained `enhance_when` rules to enable cross-detection between advisor-family and prompt tools

### Fixed
- None.

### Verification
| Check | Result |
|-------|--------|
| TypeScript typecheck | PASS (exit 0) |
| Vitest cross-skill-edges suite | 10 PASS |
| Full test suite | 383 pass, 1 fail, 4 skip (failures pre-existing and unrelated) |
| Manual smoke: HEAD with all edges present | 0 candidates, 0 errors |
| Strict spec validate | PASSED (0 errors, 0 warnings) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/cross-skill-edges/types.ts` | Created | Type definitions for propagation modes, candidates, options, and metadata records |
| `lib/cross-skill-edges/metadata-loader.ts` | Created | Recursive skill discovery with JSON parse, error capture, and family grouping |
| `lib/cross-skill-edges/detect-inbound-enhances.ts` | Created | Composite detector with three scorers, candidate hashing, and confidence sorting |
| `lib/cross-skill-edges/context-template.ts` | Created | Deterministic payload inference, weight clipping, and template substitution |
| `lib/cross-skill-edges/apply-graph-metadata-patch.ts` | Created | Idempotent JSON patcher with path-boundary guard and auto-marker fields |
| `lib/cross-skill-edges/index.ts` | Created | Public entry point orchestrating detection, payload inference, and optional apply |
| `handlers/skill-graph/propagate-enhances.ts` | Created | MCP handler with trusted-caller check and workspace-escape guard |
| `tools/skill-graph-tools.ts` | Modified | Registered `skillGraphPropagateEnhancesTool` with full inputSchema and handler dispatch |
| `handlers/skill-graph/index.ts` | Modified | Exported `handleSkillGraphPropagateEnhances` |
| `tests/cross-skill-edges.vitest.ts` | Created | Ten tests: three fixture suites plus edge-type, weight clipping, high-confidence, auto-marker, parse-error, and malformed-input regression tests |
| `skills/sk-prompt/graph-metadata.json` | Modified | Added `enhance_when` rule for prompt quality card asset matching |
| `skills/system-skill-advisor/graph-metadata.json` | Modified | Added `enhance_when` rule for delegation-request context template matching |
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Created | Scoped packet documentation |

### Follow-Ups
- Asset-shape detection requires exact file path match. Fuzzy or glob-based matching is deferred.
- Family-inference requires at least 3 existing enhances entries and 50% same-family share. Low-volume enhancers are not detected.
- No daemon-event-triggered auto-apply. Detection stays strictly on-demand for now.
- No semantic or embedding-based detection. Deterministic rule matching only.
- No continuous integration or pre-commit hook integration. Tool is operator-invoked.
