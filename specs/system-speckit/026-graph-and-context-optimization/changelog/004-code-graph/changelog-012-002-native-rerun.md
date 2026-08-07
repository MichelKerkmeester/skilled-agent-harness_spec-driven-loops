---
title: "Code Graph Phase 012/002: Native Rerun of Deferred Usefulness Cells"
description: "Native re-execution of usefulness cells deferred by the Phase 012/001 sandbox campaign. Reran code-graph failure-mode cells, validated advisor and hook fixes, and updated the usefulness verdict. Code-graph downgraded to OVERHEAD pending the tree-sitter parser crash fix."
trigger_phrases:
  - "012 002 native rerun"
  - "deferred usefulness cells rerun"
  - "code graph downgraded overhead"
  - "scope policy rerun"
  - "drift detector rerun"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-05

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `026-graph-and-context-optimization/004-code-graph`

### Summary

The Phase 012/001 sandbox campaign deferred several usefulness cells that could not be verified in a sandbox environment. These cells required live MCP server access, native runtime hooks, or file-system access that the sandbox blocked.

The native rerun packet re-executed the deferred cells against a live environment:

1. **Code-graph failure modes.** The broad-scope parser crash was confirmed on a live scan of 9,314 files. The crash rate was consistent with the sandbox finding: approximately 17 percent. The code-graph usefulness verdict was downgraded to OVERHEAD pending a fix.
2. **Copilot runtime payload transport.** The Copilot hook was confirmed to drop the structured startup payload on live runs. The fix was applied (same as the Phase 004 startup-payload-parity stream) and verified in the live environment.
3. **Stale skill-graph cache.** The advisor returned stale recommendations on 3 live test prompts. The cache invalidation fix was applied and verified.
4. **Scope-policy validation.** End-user scope queries returned correct results on all 20 live test queries. The scope policy was verified as working in a native environment.
5. **Drift-detector validation.** The drift detector correctly identified files changed since the last scan in a live environment with real file-system modifications.

The backlog fixes included two items that were not in the original deferred-cell list but were discovered during the native rerun: a scope-policy edge case where `includeSkills: false` still indexed skill files when the scan root was the workspace root, and a drift-detector timezone comparison bug.

The final usefulness verdict: code-graph downgraded to OVERHEAD until the tree-sitter parser crash is fixed. Advisor and hooks upgraded to READY after the cache-invalidation and payload-transport fixes.

### Added

- Native re-execution protocol for deferred cells
- Backlog fix for scope-policy edge case (skills-indexed-when-excluded)
- Backlog fix for drift-detector timezone comparison

### Changed

- Copilot runtime hook: structured-payload transport applied and verified
- Advisor cache: invalidation fix applied and verified
- Usefulness verdict: code-graph downgraded to OVERHEAD, advisor and hooks upgraded to READY

### Fixed

- Copilot runtime dropped the structured startup payload on live runs. Fix applied and verified.
- Advisor returned stale recommendations after skill-graph changes. Cache invalidation fix applied.
- Scope policy indexed skill files when `includeSkills: false` was set but scan root was workspace root. Fixed.
- Drift detector compared file times without timezone normalization. Fixed.

### Verification

- Live code-graph scan: 9,314 files indexed, confirmed 17 percent parse-error rate (consistent with sandbox finding).
- Live Copilot payload transport: structured payload verified in native runtime.
- Live advisor: 15 of 15 test prompts returned correct recommendations after cache fix.
- Scope policy: 20 of 20 end-user queries correct in native environment.
- Drift detector: all changed files correctly identified with timezone-normalized comparison.

### Files Changed

| File | What changed |
|------|--------------|
| `hooks/copilot/adapter.ts` | Structured-payload transport fix |
| `skill_advisor/cache.ts` | Cache invalidation on skill-graph change |
| `code_graph/lib/scope-policy.ts` | Skills-excluded-when-disabled edge case fix |
| `code_graph/lib/drift-detector.ts` | Timezone-normalized comparison fix |
| `usefulness-verdict.md` (NEW) | Updated verdict: code-graph OVERHEAD, advisor/hooks READY |

### Follow-Ups

- **Code-graph OVERHEAD verdict restoration.** The code-graph is downgraded pending the tree-sitter parser crash fix. Phase 012/007 will address this. The verdict should be re-evaluated after the 012/007 fix lands.
