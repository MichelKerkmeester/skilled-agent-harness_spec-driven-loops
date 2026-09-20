---
title: "Implementation Summary: Cline provider wired into cli pi by config"
description: "cline-pass is now a live pi provider. Added a config block to .pi/models.json (api openai-completions, env-keyed), enabled cline-pass/deepseek-v4-flash in .pi/settings.json, and documented it in .pi/custom-providers.md. Proven via pi --list-models and pi auth check."
trigger_phrases:
  - "cline pi config done"
  - "pi cline-pass live"
  - "cline provider wired into pi"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/003-cline-pi-config-build"
    last_updated_at: "2026-08-18T14:01:37Z"
    last_updated_by: "claude"
    recent_action: "cline-pass wired into .pi and verified live via pi --list-models"
    next_safe_action: "Operator supplies CLINE_API_KEY or runs pi login for a live chat round-trip"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".pi/custom-providers.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-003"
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
| **Spec Folder** | 003-cline-pi-config-build |
| **Completed** | 2026-08-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Cline is now a first-class provider inside cli pi. Phase 2 proved this was reachable with configuration alone; this phase did the wiring. You can now pick `cline-pass/deepseek-v4-flash` in pi's model picker and route DeepSeek V4 Flash through the Cline account, giving pi the same reach opencode already had. No pi code was changed and no secret was committed.

### The cline-pass provider block

`.pi/models.json` gained a `providers["cline-pass"]` block. pi unions every `providers.*` block in that file into its runtime provider set, so the block alone makes the provider real — surfaced in `pi --list-models`, `/login`, and the picker. The block declares `api: "openai-completions"` (the value that actually streams — a bare `openai` would list fine but throw at stream time), the Cline base URL, `apiKey: "{env:CLINE_API_KEY}"` so no key lives in the repo, and one model, DeepSeek V4 Flash (1M context, 393.2K max tokens, reasoning on). The `compat.thinkingFormat: "deepseek"` hint matches how the OpenRouter Flash sibling is configured so thinking tokens parse.

### Enabled in the picker

`.pi/settings.json` `enabledModels` gained `"cline-pass/deepseek-v4-flash"` as its first entry; the list unions, so every previously enabled model is preserved. Because the global `defaultThinkingLevel` is already `"xhigh"`, the reasoning model runs at Extra High by default — the effort level the operator asked for.

### The .pi documentation

`.pi/custom-providers.md` is a new operator doc for providers added to pi by config rather than shipped in its builtin catalog. It covers what cline-pass is and why it is config-wired, where the two edits live, the `openai-completions` trap, both key paths (`CLINE_API_KEY` env or `pi /login cline-pass`), the fact that pi keeps its own auth store and does not import opencode's key, and how to verify or remove the provider.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | Added the `cline-pass` provider block (env-keyed, `openai-completions`) |
| `.pi/settings.json` | Modified | Added `cline-pass/deepseek-v4-flash` to `enabledModels` |
| `.pi/custom-providers.md` | Created | Durable doc for the custom provider (what/why/key/verify/remove) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Edited the two `.pi` JSON files directly against the live config, then verified from this session: `pi --list-models` shows the cline-pass row, and `pi auth check` reports the provider ready. The key is env-sourced, so the config surfaces cleanly whether or not a key is present.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `api: "openai-completions"`, not bare `openai` | A bare `openai` passes listing and auth-check but throws `No API provider registered for api: openai` at stream time (Phase 2 finding) |
| `apiKey: "{env:CLINE_API_KEY}"`, no literal key | Keeps the secret out of the repo; the key comes from the env or a one-time `pi /login cline-pass` |
| Do not import opencode's Cline key | pi keeps its own auth store (`~/.pi/agent/auth.json`); sharing opencode's credential would be surprising and cross-tool coupling |
| Add `.pi/custom-providers.md` | The provider is custom (not a pi builtin); a future reader needs the why, the gotcha, and the removal steps recorded next to the config |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pi --list-models` lists cline-pass | PASS (`cline-pass  deepseek-v4-flash  1M  393.2K  yes  no`) |
| `pi auth check --provider cline-pass --model cline-pass/deepseek-v4-flash --json` | PASS (`{"status":"ready","provider":"cline-pass","authType":"api_key"}`) |
| No secret committed | PASS (`apiKey: "{env:CLINE_API_KEY}"` in `.pi/models.json`) |
| `enabledModels` union preserved prior models | PASS (12 prior entries intact, cline-pass prepended) |
| `.pi/custom-providers.md` present | PASS (created) |
| `validate.sh 049-cline-provider-roster --recursive --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live Cline round-trip yet.** Feasibility is proven through model resolution, auth attach, and listing; an actual streaming chat against `https://api.cline.bot/api/v1` was not run because it needs a real Cline key. Supply `CLINE_API_KEY` in the environment or run `pi /login cline-pass`, then send one prompt to confirm end to end.
2. **pi and opencode keys are separate.** Opencode's existing `cline-pass` credential is not imported into pi; the key must be given to pi once.
<!-- /ANCHOR:limitations -->
