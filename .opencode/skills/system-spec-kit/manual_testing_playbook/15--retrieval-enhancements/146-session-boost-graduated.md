---
title: "146 -- Session attention boost graduated"
description: "Validates that session attention boost amplifies recently-attended results during Stage 2 fusion and respects the combined 0.20 ceiling shared with causal boost."
audited_post_018: true
---

# 146 -- Session attention boost graduated

## 1. OVERVIEW

This scenario validates the graduated default-ON session attention boost. It exercises the 0.15 multiplier applied to recently-attended results during Stage 2 fusion, the combined 0.20 ceiling with causal boost, and the `SPECKIT_SESSION_BOOST` kill-switch.

---

## 2. SCENARIO CONTRACT

- Objective: Verify session boost amplifies results matching active working-memory attention records and respects the combined ceiling with causal boost.
- Real user request: `Please validate session attention boost: prove the multiplier lifts recently-attended results, that the combined ceiling with causal boost is 0.20, and that I can disable the boost via SPECKIT_SESSION_BOOST=false.`
- Prompt: `Validate session attention boost and confirm Stage 2 fusion lifts attended results, respects the 0.20 ceiling, and reverts cleanly on the kill-switch.`
- Expected execution process: Establish session attention, run a search, compare pre- and post-boost ordering, toggle the flag, and assert reversion.
- Expected signals: results matching working_memory attention are lifted in Stage 2 fusion output; combined session+causal score boost never exceeds 0.20; `SPECKIT_SESSION_BOOST=false` removes the boost entirely.
- Desired user-visible outcome: Pass/fail verdict with cited fusion trace and rank evidence.
- Pass/fail: PASS when attended results lift in default-on, the ceiling holds, and the kill-switch reverts behavior. FAIL when attended results do not lift, the ceiling is exceeded, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate session attention boost and confirm Stage 2 fusion lifts attended results, respects the 0.20 ceiling, and reverts cleanly on the kill-switch.
```

### Commands

1. Pick a stable session ID `<S>` and two record IDs `<A>` and `<B>` already in `memory_index` where neither dominates the default ranking for a known query `<Q>`.
2. Establish working-memory attention for `<A>` under session `<S>` (via the existing working-memory write surface). Confirm the attention record exists.
3. `memory_search({ query: "<Q>", sessionId: "<S>", limit: 10, includeTrace: true })` and capture the Stage 2 trace with rank positions.
4. Run the same query under a fresh session ID (no attention) and capture rank positions.
5. Assert `<A>` lifts in the attended session compared to the fresh session.
6. Inspect the trace for combined session+causal boost. Assert no result's combined boost exceeds 0.20.
7. Set `SPECKIT_SESSION_BOOST=false` in MCP env, restart, repeat step 3. Assert ordering matches the fresh-session run (no lift).
8. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/stage2-fusion.vitest.ts`.

### Expected

- Attended-session run lifts `<A>` relative to fresh-session run.
- No result's combined session+causal boost exceeds 0.20.
- Flag-off run matches fresh-session ordering.
- Vitest exits 0.

### Evidence

- Three Stage 2 fusion trace envelopes (attended, fresh, flag-off)
- Working-memory attention record dump
- Vitest summary

### Pass / Fail

- **Pass**: attended lift visible, ceiling holds, kill-switch reverts, Vitest exits 0.
- **Fail**: no lift on attended results, ceiling exceeded, kill-switch ineffective, or Vitest fails.

### Failure Triage

Inspect `mcp_server/lib/search/session-boost.ts` for the 0.15 multiplier and ceiling check. Confirm `mcp_server/lib/search/pipeline/stage2-fusion.ts` invokes `applySessionBoost` for the active session. Verify `isSessionBoostEnabled()` reads `SPECKIT_SESSION_BOOST` at request time.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [15--retrieval-enhancements/10-session-boost-graduated.md](../../feature_catalog/15--retrieval-enhancements/10-session-boost-graduated.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-boost.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Retrieval enhancements
- Playbook ID: 146
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `15--retrieval-enhancements/146-session-boost-graduated.md`
