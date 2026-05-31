---
title: "149 -- Dual-level retrieval"
description: "Validates the retrievalLevel parameter (local | global | auto) on memory_search and the auto-mode fallback to community search on weak results."
audited_post_018: true
---

# 149 -- Dual-level retrieval

## 1. OVERVIEW

This scenario validates the `retrievalLevel` parameter on `memory_search`. It exercises the three modes (`local`, `global`, `auto`), confirms auto mode falls back to community search on weak results, and validates the `SPECKIT_DUAL_RETRIEVAL` kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify the three retrieval levels behave as documented and that auto mode falls back to community search when local retrieval is weak.
- Real user request: `Please validate dual-level retrieval: prove local, global, and auto modes work, that auto mode falls back to community search on weak results, and that SPECKIT_DUAL_RETRIEVAL=false reverts to single-level behavior.`
- Prompt: `Validate dual-level retrieval modes and confirm auto-mode fallback fires on weak local results.`
- Expected execution process: Run the same query with each level, compare results, force weak local retrieval to trigger fallback, toggle the kill-switch.
- Expected signals: `retrievalLevel: "local"` runs only standard retrieval channels; `retrievalLevel: "global"` runs only community search; `retrievalLevel: "auto"` runs local first and falls back to community search when results are weak; `SPECKIT_DUAL_RETRIEVAL=false` rejects or ignores the parameter and reverts to single-level behavior.
- Desired user-visible outcome: Pass/fail verdict with cited trace evidence per mode.
- Pass/fail: PASS when each mode behaves as documented and the kill-switch reverts. FAIL when modes return identical output, auto fallback never fires, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate dual-level retrieval modes and confirm auto-mode fallback fires on weak local results.
```

### Commands

1. Pick a query `<Q-strong>` that has strong local hits and a query `<Q-weak>` that should produce weak local hits but shares words with a community summary.
2. `memory_search({ query: "<Q-strong>", retrievalLevel: "local", limit: 10, includeTrace: true })` and capture trace.
3. `memory_search({ query: "<Q-strong>", retrievalLevel: "global", limit: 10, includeTrace: true })` and capture trace.
4. `memory_search({ query: "<Q-strong>", retrievalLevel: "auto", limit: 10, includeTrace: true })` and capture trace.
5. Assert local-mode trace shows standard channels only, global-mode trace shows community search only, auto-mode trace matches local on strong query.
6. `memory_search({ query: "<Q-weak>", retrievalLevel: "auto", limit: 10, includeTrace: true })` and capture trace.
7. Assert auto-mode trace shows local channels first then fallback to community search.
8. Set `SPECKIT_DUAL_RETRIEVAL=false` in MCP env, restart, repeat step 4. Assert the level parameter is ignored or rejected and the handler reverts to single-level behavior.

### Expected

- Local mode runs standard channels only.
- Global mode runs community search only.
- Auto mode mirrors local on strong query, falls back to community on weak query.
- Flag-off run ignores the level parameter.

### Evidence

- Five `memory_search` trace envelopes covering the three modes plus weak-query and flag-off cases
- Compared rank lists per mode

### Pass / Fail

- **Pass**: per-mode behavior matches documented contract, weak-query auto fallback fires, kill-switch reverts.
- **Fail**: modes produce identical output, auto fallback never fires, kill-switch ineffective.

### Failure Triage

Inspect `mcp_server/handlers/memory-search.ts` for the `retrievalLevel` dispatch. Confirm `mcp_server/lib/search/search-flags.ts` registers the parameter and the kill-switch. Check the auto-mode threshold logic against the empty-result recovery thresholds.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/203-dual-level-retrieval.md](../../feature_catalog/15--retrieval-enhancements/203-dual-level-retrieval.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`

---

## 5. SOURCE METADATA

- Group: Retrieval enhancements
- Playbook ID: 149
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/149-dual-level-retrieval.md`
