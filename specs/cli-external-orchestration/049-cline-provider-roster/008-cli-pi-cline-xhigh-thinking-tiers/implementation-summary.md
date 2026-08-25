---
title: "Implementation Summary: pi cline-pass picker reaches xhigh via thinkingLevelMap"
description: "The pi picker capped cline-pass DeepSeek Flash/Pro at high because the models had no thinkingLevelMap. Adding the map (high + xhigh) lets the picker reach xhigh; restored defaultThinkingLevel to xhigh. Verified a live --thinking xhigh cline dispatch."
trigger_phrases:
  - "pi cline xhigh picker fixed"
  - "thinkingLevelMap cline-pass done"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/008-cli-pi-cline-xhigh-thinking-tiers"
    last_updated_at: "2026-08-25T05:06:09Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Linked the successor phase after 009 landed"
    next_safe_action: "Commit and push to v4 and main; operator confirms the picker tab-cycle"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".pi/custom-providers.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-008"
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
| **Spec Folder** | 008-cli-pi-cline-xhigh-thinking-tiers |
| **Completed** | 2026-08-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

pi's interactive picker can now reach the `xhigh` thinking tier for the cline-pass DeepSeek V4 Flash and Pro models — parity with opencode's official cline-pass support. Before this phase the picker could not cycle past `high`.

### The root cause

pi derives a model's *selectable* thinking tiers from its `thinkingLevelMap`. The cline-pass models in `.pi/models.json` declared only `reasoning: true` with no map, so pi fell back to a default that tops at `high` — the picker literally could not offer `xhigh`. opencode reaches `xhigh` because its official cline-pass catalog entry ships that map. The `--thinking xhigh` CLI flag was never affected; only the TUI picker was capped. Separately, `defaultThinkingLevel` in `.pi/settings.json` had drifted from `xhigh` to `high`.

### The fix

Both cline-pass models now carry `thinkingLevelMap: { "minimal": null, "low": null, "medium": null, "high": "high", "max": null, "xhigh": "xhigh" }`, mirroring pi's OpenRouter DeepSeek Flash entry (Cline has no `max` tier, so `xhigh` is the top). `defaultThinkingLevel` is restored to `xhigh`. `.pi/custom-providers.md` now records that the picker needs the map to offer `xhigh`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | `thinkingLevelMap` (high + xhigh) on both cline-pass models |
| `.pi/settings.json` | Modified | `defaultThinkingLevel` restored to `xhigh` |
| `.pi/custom-providers.md` | Modified | Note the `thinkingLevelMap` picker requirement |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Diagnosed by comparing pi's `models-store.json` schema: reasoning models that expose `xhigh` carry a `thinkingLevelMap` (e.g. the OpenRouter DeepSeek Flash entry), while the custom cline-pass models had none. Added the map to both models, restored the `xhigh` default, and confirmed pi still loads the config (`pi --list-models` lists both cline-pass models, no parse error) and that a live `pi --thinking xhigh` cline dispatch completes at exit 0. The picker tab-cycle is interactive, so the operator confirms it after restarting the pi TUI.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror the OpenRouter DeepSeek Flash map (`high` + `xhigh`, no `max`) | Same model family; Cline tops at `xhigh` with no `max`; it is how opencode's official entry reaches xhigh |
| Restore `defaultThinkingLevel: "xhigh"` | The committed value was `xhigh`; it had drifted to `high`. Restores the intended Extra-High default |
| Leave the fan-out `--thinking` mapping untouched | Deep-loop already caps effort per policy; this is a picker/config parity fix only |
| Document the map requirement | The three-null map reads like boilerplate; without the note a future edit could drop it and silently re-cap the picker |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.pi/models.json` + `.pi/settings.json` parse | PASS (`node -e JSON.parse`) |
| pi loads config; both cline-pass models listed | PASS (`pi --list-models` shows both, no error) |
| Live `pi --thinking xhigh` cline dispatch | PASS — real turn completed at exit 0, no invalid-level error |
| `thinkingLevelMap` exposes xhigh on both models | PASS (`grep -c thinkingLevelMap .pi/models.json` = 2) |
| `defaultThinkingLevel` = xhigh | PASS (`.pi/settings.json`) |
| `validate.sh --strict` (this phase) | PASS — recorded in this session |
| Picker tab-cycle to xhigh | DEFERRED to operator (interactive TUI; not headlessly testable) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Picker confirmation is interactive.** The tab-cycle to `xhigh` can only be verified in a live pi TUI; the operator confirms after restarting pi so it re-reads `.pi/models.json`.
2. **Cline level strings assumed from the DeepSeek family.** The map uses `xhigh: "xhigh"`, matching the OpenRouter sibling and the documented working `--thinking xhigh` dispatch; if Cline renames its top tier upstream, the map value would need updating.
<!-- /ANCHOR:limitations -->
