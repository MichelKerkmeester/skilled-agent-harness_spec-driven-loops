---
title: "Implementation Summary: Phase 5: operational-caveats"
description: "Documented GLM-5.2 dispatch caveats observed in benchmark 008 (latency 6-161s with thinking-on, ~1/45 transient failure, cost-0) across the profile, registry, and cli-opencode."
trigger_phrases:
  - "glm-5.2 operational caveats"
  - "glm-5.2 latency transient failure"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/005-operational-caveats"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented benchmark-008 latency + transient-failure caveats"
    next_safe_action: "Packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/glm-5.2.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-support-005-operational-caveats"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-operational-caveats |
| **Completed** | 2026-06-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two GLM-5.2 dispatch gotchas were **confirmed by real observation** during the phase-2 bakeoff (run 008, n=45 dispatches) and documented across the canonical surfaces — framed as dated observations, not speculation:

1. **Latency variance from thinking-on-by-default.** Per-cell latency ranged 6–161s (avg ~26s, ~27x spread) on small code-gen tasks. A tight timeout kills the slow tail. Mitigation: budget generous timeouts for non-trivial scopes.
2. **Occasional transient dispatch failures.** 1 of 45 dispatches failed transiently (exit -1, `dispatch_failed`) — an infra blip, not a model error. Mitigation: retry the cell.

Also confirmed: dispatch cost is 0/null across all 45 cells (subscription billing, as the registry recorded). No 0-byte/600s hang (kimi's failure mode) was observed at this bounded single-fixture scope.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md` | Modified | §2 (avg wall-clock), §5 (timeout note), §6 (latency + transient-failure rows) |
| `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | Modified | weaknesses: latency-variance + transient-failure entries |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | GLM line operational caveat (latency 6–161s; ~1/45 transient failures) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Mined the real telemetry from benchmark 008's `results.json` (per-cell `latency_ms`, `dispatch_ok`, `exit_code`, `cost_usd`) rather than asserting doc-derived guesses. The candidate caveats listed in the phase-1 profile (reasoning_effort mapping, tool_stream, tool_choice) remain doc-sourced and are NOT promoted to observed — only the two facts the benchmark actually exercised are recorded as observed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record only the two observed gotchas | Honesty — only latency and the transient failure were actually exercised by the bakeoff; the rest stay labelled doc-sourced |
| Frame as dated observation (benchmark 008, n=45) | Matches the 149/006 Kimi-caveat convention; avoids over-generalizing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Card-sync guard (after additive edits) | PASS, exit 0 |
| JSON parse (model_profiles.json) | PASS |
| Source of caveats | benchmark 008 results.json telemetry (latency_ms, dispatch_ok, cost_usd) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Bounded scope.** Latency/failure data is from small single-fixture code-gen cells. Broad/large-repo behavior (over-exploration, the kimi-style hang) is NOT yet observed for GLM-5.2 and stays a candidate caveat.
2. **Doc-sourced quirks unverified.** reasoning_effort↔variant mapping, tool_stream, and tool_choice=auto remain from Z.AI docs, not yet exercised.
<!-- /ANCHOR:limitations -->
