---
title: "Implementation Summary: pi cline-pass model id restored to slashed form, dispatch fixed"
description: "The cline-pass model ids were bare, so pi sent a bare model to the Cline API and got 400 invalid model format. Restoring the slashed cline-pass/<model> id fixed dispatch, proven by a curl negative control and a live pi round-trip to both models."
trigger_phrases:
  - "cline pi 400 fixed slashed id"
  - "pi cline dispatch works done"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/006-cline-pi-model-id-format-fix"
    last_updated_at: "2026-08-18T17:51:54Z"
    last_updated_by: "claude"
    recent_action: "Slashed cline-pass ids restored; live pi dispatch to both models verified"
    next_safe_action: "Commit and push to v4 and main"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".pi/custom-providers.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-cline-pi-model-id-format-fix |
| **Completed** | 2026-08-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

pi can now dispatch both cline-pass models. Before this phase, the operator's first live cline dispatch returned `Error: 400 "invalid model format. Expected format: modelType/model"`. The cause was a bare model `id` in `.pi/models.json`; the fix restores the slashed `cline-pass/<model>` id that the Cline API accepts and that opencode already used.

### The root cause

pi builds each provider from `.pi/models.json` and, on dispatch, sends the selected model object's `id` verbatim as the API `model` parameter. Phases 3 and 5 declared the ids as bare `deepseek-v4-flash` / `deepseek-v4-pro`, so pi sent `model: "deepseek-v4-flash"` to `https://api.cline.bot/api/v1`. Cline requires the `modelType/model` slashed form and 400s a bare id. The failure hid from `pi --list-models` and `pi auth check`, which never send a completion, so it only appeared on a real dispatch.

### The fix across every cline-pass surface

`.pi/models.json` now declares both ids slashed (`cline-pass/deepseek-v4-flash`, `cline-pass/deepseek-v4-pro`). Because pi's model reference is `<provider>/<id>`, a slashed id makes the reference three-segment, so `.pi/settings.json` `enabledModels` now lists `cline-pass/cline-pass/deepseek-v4-flash` and `cline-pass/cline-pass/deepseek-v4-pro`, and `defaultModel` is `cline-pass/deepseek-v4-flash`. `.pi/custom-providers.md` and the cli-pi roster carry the corrected forms plus a documented slashed-id gotcha with the exact `400` string, so the three-segment reference is not mistaken for a typo and reverted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | Slashed `cline-pass/<model>` id for both cline models |
| `.pi/settings.json` | Modified | Three-segment `enabledModels` entries; `defaultModel` to `cline-pass/deepseek-v4-flash` |
| `.pi/custom-providers.md` | Modified | Corrected forms + slashed-id gotcha |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modified | Corrected roster forms + slashed-id gotcha + live-dispatch status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Confirmed pi forwards the model `id` verbatim, then ran a negative control against the live Cline API — a bare id returned `400 invalid model format`, the slashed id returned `200`. Changed the two ids in `.pi/models.json`, reconciled the settings mirrors and both doc surfaces, then proved the fix end to end with a live pi dispatch (key sourced from the opencode auth store into `CLINE_API_KEY`, never printed).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the `cline-pass/` prefix in the model `id` | It is the value pi forwards as `model`, and Cline requires the `modelType/model` form; opencode's working catalog uses the same slashed id |
| Leave the cli-opencode roster untouched | Its ids were already slashed and its dispatch was never broken — editing it would be out of scope |
| Document the slashed id as an explicit gotcha | The three-segment pi reference reads like a mistake; without the note a future edit would "fix" it back to bare and re-break dispatch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control: `curl` Cline API with bare id | PASS (returns `400 "invalid model format. Expected format: modelType/model"`) |
| Negative control: `curl` Cline API with slashed id | PASS (returns `200`) |
| Live pi dispatch `cline-pass/cline-pass/deepseek-v4-flash` | PASS (`CLINE_FLASH_OK` — model reply, no 400) |
| Live pi dispatch `cline-pass/cline-pass/deepseek-v4-pro` | PASS (`CLINE_PRO_OK` — model reply) |
| Live unqualified pi dispatch (cline default) | PASS (`CLINE_DEFAULT_OK` — resolves to cline-pass/flash and replies) |
| Both `.pi` JSON parse | PASS (`python3 -m json.tool`) |
| `validate.sh 049-cline-provider-roster --recursive --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live proof used a session-sourced key.** The dispatch verification read `CLINE_API_KEY` from the opencode auth store for this session. The operator's own pi environment must still carry the key (env or `pi /login cline-pass`) for cline dispatch to work in their runtime — the config fix does not supply a key.
<!-- /ANCHOR:limitations -->
