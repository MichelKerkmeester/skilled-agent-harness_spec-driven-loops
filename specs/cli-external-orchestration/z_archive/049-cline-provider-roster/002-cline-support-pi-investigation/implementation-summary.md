---
title: "Implementation Summary: cli pi Cline-parity investigation — config-only-feasible"
description: "Verdict: cli pi can reach the Cline provider config-only, no code or extension. Add a cline-pass provider block (api openai-completions) to .pi/models.json + an enabledModels entry; auth via pi's own login."
trigger_phrases:
  - "cline pi investigation verdict"
  - "pi cline config-only feasible"
  - "add cline-pass to pi models.json"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/002-cline-support-pi-investigation"
    last_updated_at: "2026-08-18T13:09:28Z"
    last_updated_by: "claude"
    recent_action: "Investigation done; verdict config-only-feasible, claims verified"
    next_safe_action: "None; phase 003 consumed the verdict and wired the pi config"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - "scratch/pi-cline-findings.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-002"
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
| **Spec Folder** | 002-cline-support-pi-investigation |
| **Completed** | 2026-08-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The investigation ran and reached a verdict: **cli pi can reach the Cline provider with configuration alone — no code, extension, or registry change.** Nothing in `.pi` was modified; this phase produced the feasibility answer, not the wiring. The investigation itself was executed by `cli-opencode` dispatching `cline-pass/cline-pass/deepseek-v4-flash` at `--variant xhigh`, then every load-bearing claim was re-verified independently against the live pi install.

### The verdict: config-only-feasible

pi (`@earendil-works/pi-coding-agent` 0.84.2) builds its provider set from two sources — a compiled-in builtin catalog (`@earendil-works/pi-ai/providers/all`) **plus** every `providers.*` block in `.pi/models.json`, unioned by `getProviderIds()` (model-runtime.js:114/129). pi does **not** consult the models.dev registry that opencode uses (zero `models.dev` references in pi's dist). So a config block turns into a first-class runtime provider, surfaced in `pi --list-models`, `/login`, and the model picker.

Cline is absent today purely because it is neither a pi builtin nor in `.pi/models.json` (the string `cline` appears nowhere in pi's compiled tree) — a config gap, not a registry gap a refresh could heal.

### The concrete mechanism (for a follow-on implementation phase)

1. Add a provider block to `.pi/models.json`:
   ```json
   "cline-pass": {
     "name": "Cline (cline.bot)",
     "api": "openai-completions",
     "baseUrl": "https://api.cline.bot/api/v1",
     "apiKey": "{env:CLINE_API_KEY}",
     "models": [{ "id": "deepseek-v4-flash", "name": "DeepSeek V4 Flash", "reasoning": true, "contextWindow": 1000000, "maxTokens": 393216 }]
   }
   ```
2. Add `"cline-pass/deepseek-v4-flash"` to `enabledModels` in `.pi/settings.json` (the pattern list unions, so existing models are preserved).
3. Supply the key to pi: `pi /login cline-pass` (api-key dialog) or the `{env:CLINE_API_KEY}` value above.

Note the pi model id is the flat **`cline-pass/deepseek-v4-flash`** (provider/modelId), pi's equivalent of opencode's three-segment `cline-pass/cline-pass/deepseek-v4-flash`.

### Gotcha that would silently break it

The provider `api` must be **`"openai-completions"`**, not a bare `"openai"`. A bare `openai` passes `pi auth check` and listing but throws at stream time (`No API provider registered for api: openai`). Every builtin OpenAI-compatible model (e.g. deepseek) declares `api: "openai-completions"`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none in `.pi`) | — | Investigation only; the config wiring is a gated follow-on phase |
| `scratch/pi-cline-findings.md` | Created | Full worker report with file:line evidence (git-ignored) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Executed as a hands-on local spike, not a `/deep:research` loop. `cli-opencode` dispatched `cline-pass/cline-pass/deepseek-v4-flash @ --variant xhigh` (a background `opencode run`, read-only on `.pi`, with a throwaway `PI_CODING_AGENT_DIR` harness so the live config was never touched). The worker's four claims — provider resolution, config-only feasibility, auth path, why-omitted — were then re-verified from this session against the real pi install before the verdict was accepted.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verdict: config-only-feasible | pi unions `.pi/models.json` provider blocks into its runtime set (`getProviderIds()`); no models.dev dependency, no builtin needed |
| Auth stays pi-local, not shared from opencode | pi keeps its own `~/.pi/agent/auth.json` (keys: openai-codex, minimax, xiaomi, deepseek, opencode-go, openrouter — no cline-pass); opencode's `cline-pass` key is not auto-imported |
| Do not wire `.pi` in this phase | Phase 2 is investigation-only; the actual config change is a gated follow-on that needs a Cline API key decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| pi provider set unions `.pi/models.json` blocks (`getProviderIds`) | PASS (model-runtime.js:114/129) |
| pi does not use models.dev registry | PASS (0 `models.dev` refs in pi dist) |
| `cline` unknown to pi's compiled catalog | PASS (0 `cline` refs in pi dist) |
| `api:"openai-completions"` required (bare `openai` throws at stream) | PASS (worker temp-harness + provider-composer.js:318-320) |
| pi auth store separate; no `cline-pass` | PASS (pi auth keys re-read this session) |
| `.pi/` unmodified by the investigation | PASS (`git status .pi/` clean) |
| `cline-pass/cline-pass/deepseek-v4-flash` dispatches live in opencode | PASS (smoke test returned `CLINE_FLASH_OK`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live Cline round-trip through pi.** Feasibility is proven up to model resolution, auth attach, and listing; an actual streaming chat against `https://api.cline.bot/api/v1` was not run (needs a real Cline key + network). High-confidence via the `openai-completions` path, but UNKNOWN until a key is used once.
2. **Implementation is deferred.** This phase only decided *how*; adding the `cline-pass` block to `.pi` is a separate, gated phase — it needs a decision on where the Cline key comes from (`pi /login` vs `CLINE_API_KEY` env).
<!-- /ANCHOR:limitations -->
