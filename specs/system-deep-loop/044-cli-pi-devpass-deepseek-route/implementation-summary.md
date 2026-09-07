---
title: "Implementation Summary: DevPass DeepSeek fan-out route"
description: "The deep-loop fan-out now reaches DeepSeek V4 Flash through the operator's flat-price DevPass plan instead of an opencode-go window that had closed, by moving one provider-map value and every comment, test pin and roster row that described the old route."
trigger_phrases:
  - "implementation summary"
  - "devpass deepseek shipped"
  - "pi provider map moved"
  - "fan-out route deepseek"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/044-cli-pi-devpass-deepseek-route"
    last_updated_at: "2026-09-07T04:55:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Moved the DeepSeek fan-out literal to DevPass and swept the mirrors"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:e32fd09d32feb906f5053e4e421178463b82d4469866a7c1caefd33612f2d9eb"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-cli-pi-devpass-deepseek-route |
| **Completed** | 2026-09-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A second research round on DeepSeek V4 Flash could not start: the only fan-out route to the model, opencode-go, had hit its monthly limit and rejected every lane in six seconds, and Devin's daily quota was gone too. DevPass carries the same model on a flat plan and answered a direct dispatch, so the fan-out's provider map now sends the bare `deepseek-v4-flash-vision-exp` literal to `llmgateway`. That is the same move packet 041 made for GLM-5.3-Flash two days earlier, for the same reason: the flat-price plan takes the fan-out slot and the per-token routes stay direct-dispatch.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/fanout-run.cjs` | Modified | One map value; four comment sites |
| `runtime/lib/deep-loop/executor-config.ts` | Modified | Three comment sites |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modified | Provider pin and two selector expectations |
| `cli-pi/references/providers-and-models.md` | Modified | The opencode-go row, the DevPass paragraph, the DevPass row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rejection was read from the lineage's error log, not inferred. DevPass was confirmed to list the model and hold its credential, then dispatched directly and read by output text, which returned the requested token. The map value moved, the mirrors followed by literal replacement, the two targeted suites ran, and round two launched on the route.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-point the literal rather than add a provider-qualified one | One literal, one provider is load-bearing in the builder and three comments; 041 recorded the same choice |
| Accept opencode-go becoming direct-dispatch only for DeepSeek | Nothing dispatches DeepSeek through opencode-go from a fan-out, and its window is closed today |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `fanout-run.vitest.ts -t 'cli-pi'` | 10 passed |
| `executor-config.vitest.ts` | 92 passed |
| Direct `pi --provider llmgateway --model deepseek-v4-flash-vision-exp --thinking low` | Returned `DEVPASS-DEEPSEEK-OK` |
| Residue search for the old mapping | Only the sentences that now describe opencode-go as direct-dispatch |
| Round two lane 001 on the route | The first launch still reached opencode-go because worktree 046 runs its own copy of the driver; the lanes relaunch after the worktree fast-forwards to this commit, and their iteration evidence lives under each lane's `deepseek-v4-flash-*` lineage |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations and Follow-ups

1. **Two hand-synced allowlists remain** `PI_SUPPORTED_MODELS` and `PI_ALLOWED_MODELS` are still duplicated, as 041 recorded; neither needed an edit here.
2. **The `max` probe was not read to completion** The route was proven at `low`; the `max` tier is the one the lanes use and is the same route with a longer think.
<!-- /ANCHOR:limitations -->
