---
title: "Code Graph Phase 010-008: blast_radius includeTransitive Flag Fix"
description: "The blast_radius operation now honors the documented includeTransitive flag. Default returns direct importers only (depth 1). Passing includeTransitive:true enables multi-hop closure up to maxDepth. Closes contract violation F-022-1."
trigger_phrases:
  - "blast radius transitive flag fix"
  - "includeTransitive blast radius"
  - "f-022-1 fix"
  - "effectiveDepth gate query handler"
  - "blast radius default depth change"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/008-blast-radius-transitive-flag`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening`

### Summary

The `code_graph_query` blast_radius operation silently ignored the `includeTransitive` flag. The blast_radius branch in `handlers/query.ts` derived traversal depth solely from `args.maxDepth` (defaulting to 3) and never read `includeTransitive`, making the flag a no-op. Blast_radius was therefore always multi-hop. Scenario 022's requirement that transitive results exceed non-transitive results was unachievable.

The fix introduces an `effectiveDepth` gate inside the blast_radius branch that reads the flag: default (false) caps depth at 1, returning only direct importers. Passing `includeTransitive:true` opts into multi-hop closure up to `maxDepth`. A prior consumer audit (phase 007) confirmed no programmatic caller relied on the implicit full-closure default, making the behavior change safe. All six in-branch depth uses were routed through `effectiveDepth`. The schema contract and runtime behavior now agree, closing finding F-022-1.

### Added

- New gating vitest case asserting that the default blast_radius returns depth-1 results while `includeTransitive:true` expands to depth-2 results

### Changed

- `effectiveDepth` gate added to the blast_radius branch in `handlers/query.ts`. Default behavior changes from full-closure (depth 3) to direct-importers-only (depth 1). The `includeTransitive:true` flag restores multi-hop traversal up to `maxDepth`.
- Four existing multi-hop blast_radius vitest cases updated to pass `includeTransitive:true`, preserving the original intent of those tests

### Fixed

- F-022-1: blast_radius ignored `includeTransitive`, making the flag a silent no-op and rendering scenario 022's transitive-vs-nontransitive assertion permanently unachievable

### Verification

| Check | Result |
|-------|--------|
| tsc build | PASS (BUILD_OK) |
| vitest query-handler, scan, parser | PASS (85/85) |
| New gating test (default depth-1, `includeTransitive` depth-2) | PASS |
| `verify_alignment_drift.py` (mcp_server) | PASS (125 files, 0 violations) |
| Scenario 022 satisfiable | Yes. Step-1 (depth-1) result is smaller than step-3 (`includeTransitive:true`, depth-3) result |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | Modified | Added `effectiveDepth` gate in the blast_radius branch. All six in-branch depth references routed through it. |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts` | Modified | Four multi-hop tests updated to pass `includeTransitive:true`. New gating test added for default depth-1 vs flag depth-2 behavior. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/022-code-graph-query-blast-radius.md` | Modified | Pass criteria updated to reflect corrected blast_radius contract. |

### Follow-Ups

- Any future caller that wants full-closure blast_radius must pass `includeTransitive:true`. Document this change in the code-graph operator guide so users are not surprised by the narrower default.
- The phase-007 consumer audit only covered programmatic callers. An interactive-use survey (agent prompts that call blast_radius) would confirm no agent workflow silently depended on the old full-closure default.
