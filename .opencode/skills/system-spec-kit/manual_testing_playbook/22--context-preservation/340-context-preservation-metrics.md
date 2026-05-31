---
title: "290 -- Context preservation metrics"
description: "Validates the in-memory session quality scoring (QualityScore) computed from recency, recovery, graphFreshness, and continuity factors."
audited_post_018: true
---

# 290 -- Context preservation metrics

## 1. OVERVIEW

This scenario validates the context-metrics module that maintains per-session quality state. It exercises the QualityScore computation across four weighted factors (recency, recovery, graphFreshness, continuity), the quality-level mapping (healthy >= 0.7, degraded >= 0.4, critical < 0.4), and the integration with `session_health`.

---

## 2. SCENARIO CONTRACT

- Objective: Verify QualityScore is computed correctly from the four documented factors, mapped to the right quality level, and surfaced via session_health.
- Real user request: `Please validate context preservation metrics: prove QualityScore is computed from recency, recovery, graphFreshness, and continuity, mapped to healthy/degraded/critical, and visible in session_health.`
- Prompt: `Validate context preservation QualityScore and confirm session_health reports the score plus the quality level.`
- Expected execution process: Simulate session events (tool calls, memory recovery, spec folder transitions), call session_health, capture the score, and verify level boundaries.
- Expected signals: QualityScore is in the range 0.0-1.0; healthy maps to >= 0.7, degraded to >= 0.4, critical to < 0.4; recency decays over time when no tool calls happen; recovery becomes 1.0 once a memory recovery call lands in the session; graphFreshness reflects current graph state; continuity drops on spec folder transitions; state resets on server restart.
- Desired user-visible outcome: Pass/fail verdict with cited score values.
- Pass/fail: PASS when the score and level match expected values across the simulated session and the score resets on restart. FAIL when score boundaries are wrong, levels mismatched, or state persists across restart.

---

## 3. TEST EXECUTION

### Prompt

```
Validate context preservation QualityScore and confirm session_health reports the score plus the quality level.
```

### Commands

1. Restart the MCP server to start with a clean metrics state.
2. Immediately call `session_health({})` and capture the QualityScore. Assert the score is reported and the quality level is one of `healthy`, `degraded`, or `critical`.
3. Issue a `memory_context({ input: "any prompt" })` call to log a tool call. Re-run `session_health` and observe `recency` ticking up.
4. Issue a memory recovery action (`session_resume` or equivalent). Re-run `session_health` and assert `recovery` is now 1.0.
5. Walk the score through to `healthy` by issuing enough recent activity, then sleep long enough to trigger recency decay. Assert the score drops toward `degraded`.
6. Transition spec folder via the appropriate signal and assert `continuity` drops in the next `session_health` response.
7. Restart the MCP server. Re-run `session_health` immediately and assert the score is reset (no persisted state).

### Expected

- QualityScore is in `[0.0, 1.0]`.
- Levels follow the documented thresholds.
- Each factor responds to the simulated event as documented.
- State resets on restart.

### Evidence

- Six `session_health` responses across the simulated session
- Score and level evolution table

### Pass / Fail

- **Pass**: score in range, levels match thresholds, factors evolve as documented, state resets on restart.
- **Fail**: out-of-range score, wrong level mapping, factors do not respond to events, or state persists.

### Failure Triage

Inspect `mcp_server/lib/session/context-metrics.ts` for the four-factor computation and the level thresholds. Verify `mcp_server/handlers/session-health.ts` includes the score in its response. Confirm `mcp_server/lib/session/session-manager.ts` does not persist metrics state across restart.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation/309-context-preservation-metrics.md](../../feature_catalog/22--context-preservation/309-context-preservation-metrics.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/session/context-metrics.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts`

---

## 5. SOURCE METADATA

- Group: Context preservation
- Playbook ID: 290
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation/340-context-preservation-metrics.md`
