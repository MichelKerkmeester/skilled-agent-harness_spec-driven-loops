---
title: "Implementation Summary: cline DeepSeek V4 Pro added, cline set as pi default"
description: "DeepSeek V4 Pro now runs through the Cline provider across .pi config and both cli rosters at xhigh-only, and pi's default provider is cline-pass with deepseek-v4-flash. Proven via pi --list-models and pi auth check."
trigger_phrases:
  - "cline pro added done"
  - "pi default cline live"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/005-cline-pro-and-pi-default"
    last_updated_at: "2026-08-18T14:15:43Z"
    last_updated_by: "claude"
    recent_action: "cline pro live in pi; default provider set to cline-pass"
    next_safe_action: "Operator supplies CLINE_API_KEY for a live pro round-trip"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-005"
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
| **Spec Folder** | 005-cline-pro-and-pi-default |
| **Completed** | 2026-08-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

DeepSeek V4 Pro now runs through the Cline provider everywhere Flash already did, and pi defaults to the cline route. You can pick `cline-pass/deepseek-v4-pro` in pi's picker or dispatch `cline-pass/cline-pass/deepseek-v4-pro` in opencode, and an unqualified `pi` run now resolves to cline-pass with Flash.

### The Pro model across every cline-pass surface

`.pi/models.json` gained a second cline-pass model, `deepseek-v4-pro` (reasoning, context 1M, output 384K, taken from the live `opencode models cline-pass --verbose` catalog). `.pi/settings.json` `enabledModels` now lists `cline-pass/deepseek-v4-pro`, and both cli rosters plus `.pi/custom-providers.md` document it. Like Flash, Pro has no `max` tier on Cline, so it runs **only at `--thinking xhigh`** (pi) / `--variant xhigh` (opencode).

### pi default set to cline

`.pi/settings.json` `defaultProvider` is now `cline-pass` and `defaultModel` is `deepseek-v4-flash`, so a pi dispatch that names no provider lands on the cline route rather than the prior openrouter default. The global `defaultThinkingLevel` stays `xhigh`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/models.json` | Modified | Added the `deepseek-v4-pro` cline-pass model |
| `.pi/settings.json` | Modified | Enabled pro; set default provider cline-pass / model deepseek-v4-flash |
| `.pi/custom-providers.md` | Modified | Documents both models and the new default |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modified | Pro roster row + §4 lever |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modified | Pro roster row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the Pro model's real id, limits and tiers from `opencode models cline-pass --verbose` before declaring it, then edited the five surfaces and verified from this session: `pi --list-models` shows both cline models and `pi auth check` reports Pro ready.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pro is xhigh-only, like Flash | Cline exposes no `max` tier for Pro (`opencode models cline-pass --verbose`), and the operator's policy is top-tier-only for these entries |
| Declare Pro in `.pi/models.json` before enabling it | An `enabledModels` entry with no matching model in the provider block would not resolve |
| Default provider cline-pass, default model Flash | The operator drives the cline route daily; Flash is the lower-latency default, Pro stays a deliberate pick |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pi --list-models` lists both cline models | PASS (`deepseek-v4-flash` 1M/393.2K, `deepseek-v4-pro` 1M/384K) |
| `pi auth check --provider cline-pass --model cline-pass/deepseek-v4-pro --json` | PASS (`{"status":"ready","authType":"api_key"}`) |
| pi default fields | PASS (`defaultProvider: cline-pass`, `defaultModel: deepseek-v4-flash`) |
| Both `.pi` JSON parse | PASS (`python3 -m json.tool`) |
| Pro row in both rosters + custom-providers.md | PASS (`rg deepseek-v4-pro`) |
| `validate.sh 049-cline-provider-roster --recursive --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live Pro round-trip.** Pro is list-verified and auth-ready, but no streaming chat has run against it because that needs a real `CLINE_API_KEY` (same operator step as Flash). Supply the key, then send one Pro prompt to confirm end to end.
<!-- /ANCHOR:limitations -->
