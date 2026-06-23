---
title: "023 — code_graph_apply sub-operations (rescan, prune-excludes, repair-nodes)"
description: "Verify each of the 5 code_graph_apply operations executes its pre/post gold-query battery and rollback semantics correctly."
trigger_phrases:
  - "023 apply sub-operations"
  - "code graph apply rescan prune repair"
importance_tier: "important"
contextType: "verification"
version: 1.2.0.3
---

# Scenario 023 — `code_graph_apply` sub-operations

> **Coverage gap closed (F018):** the existing playbook scenario 015 covers `doctor code-graph` route policy but not the apply tool's individual operations. This scenario exercises each of `rescan`, `prune-excludes`, `repair-nodes`, `recover-sqlite-corruption`, `rollback-bad-apply` to confirm the gate-then-apply-then-verify lifecycle.

## Preconditions

- Code graph index in any state (apply paths can recover from stale/error states).
- Working DB backup exists (apply-mode writes one before destructive operations).

## Steps

1. **Dry-run rescan** (safe, no mutation):
   ```jsonc
   mcp__mk_code_index__code_graph_apply({
     operation: "rescan",
     dryRun: true
   })
   ```
   Expected: returns the gold-query battery pre-state without performing the rescan. `status:"dry_run_complete"` or equivalent.

2. **prune-excludes classification dry-run** (no mutation):
   ```jsonc
   mcp__mk_code_index__code_graph_apply({
      operation: "prune-excludes",
      excludePatterns: ["**/__tests__/**", "**/*.test.ts"],
      lowTierOptIn: false,
      dryRun: true
    })
    ```
   Expected: returns the generic dry-run payload (`status:"dry-run"`, operation, apply-state classification, battery pre-state, message) — the dry-run path returns BEFORE dispatch, so it contains no per-pattern tier data. Pattern classification (`excludeRules`) appears only on non-dry dispatch results, and on production MCP paths every pattern currently reports `tier:"unknown"` because no confidence artifact is wired. Without `dryRun:true`, classified patterns trigger a mutating exclusion rescan; without `lowTierOptIn:true`, low-tier patterns make the dispatch THROW and roll back rather than report-and-skip.

3. **repair-nodes preflight** (without crash-root-cause flag):
   ```jsonc
   mcp__mk_code_index__code_graph_apply({
     operation: "repair-nodes",
     quarantineOlderThanDays: 7
   })
   ```
   Expected: returns `requiredAction:"set_crash_root_cause_addressed"` or equivalent refusal. `repair-nodes` is gated on `crashRootCauseAddressed:true` to prevent re-parsing files that are in parser_skip_list for valid reasons.

4. **recover-sqlite-corruption preflight** (without `confirm:true`):
   ```jsonc
   mcp__mk_code_index__code_graph_apply({
     operation: "recover-sqlite-corruption"
   })
   ```
   Expected: returns refusal requiring `confirm:true`. Hard-stale recovery is destructive and must be acknowledged.

5. **rollback-bad-apply** (only valid after a previous apply has been recorded):
   ```jsonc
   mcp__mk_code_index__code_graph_status({})
   // Read apply.lastResult; if a recent apply exists:
   mcp__mk_code_index__code_graph_apply({
     operation: "rollback-bad-apply",
     dryRun: true
   })
   ```
   Expected: dry-run returns the rollback target (the prior baseline) without applying. Live rollback restores prior DB state.

## Pass criteria

| # | Operation | Check | Pass |
|---|-----------|-------|------|
| 1 | rescan dry-run | Returns pre-battery state, no mutation | ☐ |
| 2 | prune-excludes | Classifies patterns without applying | ☐ |
| 3 | repair-nodes | Refuses without crashRootCauseAddressed | ☐ |
| 4 | recover-sqlite-corruption | Refuses without confirm | ☐ |
| 5 | rollback-bad-apply | Dry-run reports prior baseline | ☐ |

## Notes

Tests `mcp_server/handlers/apply.ts` → `mcp_server/lib/apply-orchestrator.ts` for operation dispatch and `mcp_server/lib/recovery-procedures.ts` for CG-RP-001/002/003 recovery procedures. Each operation runs the gold-query battery before AND after (verify via `apply.batteryPassRate` in `code_graph_status` post-apply).
