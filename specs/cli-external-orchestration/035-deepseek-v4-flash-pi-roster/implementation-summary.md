---
title: "Implementation Summary: DeepSeek V4 Flash in the cli-pi enforced roster"
description: "deepseek-v4-flash now lands in the enforced pi roster so fanout dispatch accepts the model the cli-pi docs already advertised."
trigger_phrases:
  - "deepseek v4 flash implementation summary"
  - "pi allowlist flash summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-deepseek-v4-flash-pi-roster"
    last_updated_at: "2026-08-02T06:04:34Z"
    last_updated_by: "implementer"
    recent_action: "Add deepseek-v4-flash to pi enforced roster"
    next_safe_action: "Packet complete; optional follow-up sk-prompt-models Flash profile"
    blockers: []
    key_files:
      - "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - "system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-035-deepseek-v4-flash"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-deepseek-v4-flash-pi-roster |
| **Completed** | 2026-08-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fanout `cli-pi` dispatch that names `deepseek-v4-flash` is now accepted instead of rejected. The cli-pi docs already advertised the model, but the enforced allowlist omitted it, so any fanout dispatch failed the fail-closed gate. This packet closes that divergence and leaves the two providers that do not offer the model untouched.

### DeepSeek V4 Flash on cli-pi

You can now route a fanout pi lineage to `deepseek-v4-flash` for latency-optimized turns. The id was live-confirmed on the pi install before it was added, so the roster's "read from live, never fabricated" contract holds. cli-opencode already exposed the model and needed no change; cli-cursor and cli-devin were left alone because their providers serve no DeepSeek V4 Flash id at all.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | `PI_SUPPORTED_MODELS` gains `deepseek-v4-flash` (source of truth) |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | `PI_ALLOWED_MODELS` gains Flash; `PI_MODEL_PROVIDERS` maps `deepseek-v4-flash → deepseek` |
| `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modified | Roster assertion seven→eight; Flash added to the sorted expected list |
| `system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Provider-map coverage test gains `deepseek-v4-flash → deepseek` |
| `cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md` | Modified | PI-017 count seven→eight, Flash enumerated, stale `sed` range refreshed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Availability was probed live on all four CLIs first, then the id was added to the TS source and its CJS mirror together so the alignment guard stays green. Confidence comes from `vitest` (`188 passed` across executor-config, fanout-run, and combo-matrix), a clean `npm run typecheck`, and `validate.sh --strict`. The change is additive only, so it permits a previously-rejected model without altering any existing dispatch path.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skipped cli-cursor and cli-devin | Live rosters have no DeepSeek V4 Flash (`cursor-agent --list-models` shows 0 DeepSeek; `devin models list` shows only `deepseek-v4-pro`); adding an id would fabricate a nonexistent model and break the allowlist contract |
| Fixed code + docs for cli-pi (not docs-only) | Docs-only would leave fanout dispatch still rejecting Flash; the enforced allowlist had to change to match the doc claim |
| Inserted Flash after `deepseek-v4-pro` | Keeps `PI_SUPPORTED_MODELS[0]` = Pro so the combo-matrix first-model representative check is unaffected |
| No sk-prompt-models profile for Flash | That is a separate skill's governance; Flash inherits the `deepseek-v4-pro` prompt-craft profile |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest` executor-config + fanout-run + combo-matrix | PASS, `188 passed (188)` |
| `npm run typecheck` (`tsc --noEmit`) | PASS, exit 0, no output |
| `validate.sh --strict` | PASS |
| Live probe cli-opencode / cli-pi | PASS, `deepseek-v4-flash` present on both |
| Live probe cli-cursor / cli-devin | Confirmed absent, left unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **cli-cursor / cli-devin unchanged.** DeepSeek V4 Flash is not offered by those providers, so the request cannot be satisfied there without fabricating a model id. Documented, not worked around.
2. **Flash reasoning behavior on pi unverified.** Flash is latency-optimized; the fanout builder still forwards `--thinking` when a reasoningEffort is set. No evidence this errors (`models-store.json` tags `thinkingFormat: deepseek`), so no special-casing was added.
3. **No dedicated prompt-craft profile.** Flash inherits the `deepseek-v4-pro` sk-prompt-models profile; a Flash-specific profile is an optional follow-up.
<!-- /ANCHOR:limitations -->
