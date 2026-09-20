---
title: "Implementation Summary: Astra on the OAuth route"
description: "Nothing is implemented yet. This records the twelve live dispatches the specification was built from, including the one that overturned the answer the catalogs gave, so the next session starts from evidence rather than repeating them."
trigger_phrases:
  - "astra oauth summary"
  - "implementation summary"
  - "astra verification evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/064-gpt-6-astra-oauth"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the pre-implementation dispatch evidence"
    next_safe_action: "Run T011, the pi enabledModels entry"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/references/providers-and-models.md"
      - ".pi/pi-fast-mode-w-subagent-support-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-064-astra-oauth"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 064-gpt-6-astra-oauth |
| **Completed** | Not implemented |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. Neither `.pi/settings.json`, `.pi/pi-fast-mode-w-subagent-support-config.json`, nor any of the three `references/providers-and-models.md` catalogs has been touched by this packet.

This document exists ahead of the work because the Level 1 contract requires it, and because the verification behind the specification cost twelve live dispatches that should not be paid twice. What follows is that evidence, not a report of delivery.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. `tasks.md` holds the ordered work. Its first phase is already complete, because reachability, the tier set and fast mode had to be settled before the specification could say anything true.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Decisions Made

| Decision | Rationale |
|----------|-----------|
| OAuth routes only | Operator rule on 2026-09-05. `opencode auth list` shows the OpenAI credential is the only `oauth` entry of eight, and codex runs on `auth_mode = chatgpt` with no API key |
| No `llmgateway` and no `openrouter` row | Both serve Astra and both authenticate with an API key, so both are excluded by that rule rather than deferred |
| The rows carry six tiers and name the two rejected ones | `none` and `minimal` return 400. A row listing only what works leaves a caller to discover the floor by hitting it |
| Fast mode on Pi is built, not documented as absent | The extension already accepts `openai-codex`, so this is two config entries rather than an upstream change |
| The opencode failure is recorded rather than chased | Three reproductions against one passing control establish the behavior. The cause is upstream of this repository |
| Direct-dispatch only | The fan-out roster stays untouched, matching how the other GPT entries are wired |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every line was observed on 2026-09-05. None of it verifies an implementation, because there is none.

| What was checked | Command | Result |
|------------------|---------|--------|
| Which providers are OAuth | `opencode auth list`, `~/.codex/auth.json`, `.pi/models.json` | `OpenAI` is the only `oauth` credential of eight. codex is `auth_mode = chatgpt`, no API key. Pi's four declared providers are all API-key, and `openai-codex` is a builtin |
| Whether the model list is authoritative | `opencode models openai` | 13 slugs, no Astra. The model dispatches anyway, so the list is bundled rather than live |
| Astra on cli-codex | `codex exec --model gpt-6-astra -c model_reasoning_effort="low" -c service_tier="fast" --sandbox read-only` | `ASTRA-CODEX-OK` |
| Astra on cli-pi | `pi --provider openai-codex --model gpt-6-astra --thinking high --mode text` | `ASTRA-PI-OK`, after `Model "gpt-6-astra" not found for provider "openai-codex". Using custom model id` |
| The codex tier ladder, one dispatch per tier | `-c model_reasoning_effort=<tier>` across all eight | `low`, `medium`, `high`, `xhigh`, `max`, `ultra` accepted. `none` and `minimal` returned HTTP 400 |
| The pi tier ladder | `--thinking <tier>` | `off`, `xhigh`, `max` accepted |
| Fast mode on codex | `-c service_tier="fast"` on every accepted-tier call | Accepted throughout |
| Astra on cli-opencode | `opencode run --model openai/gpt-6-astra`, three attempts | `UnknownError: Unexpected server error` each time. Refs `err_2e5431fd` no variant, `err_0ceab3e7` at `--variant high`, `err_cbd04430` at `--variant max` |
| Control for that failure | `opencode run --model openai/gpt-5.6-sol --variant high` | `CONTROL-OK`, so the provider works and the failure is specific to this model |
| Whether Pi's fast lever can reach Astra | `src/types.ts:63`, `:57`, `src/config.ts:138` | `SUPPORTED_PROVIDERS = ["openai", "openai-codex"]`, tier `"priority"`, and an unsupported provider is dropped silently. Astra's provider is on the list |

**Not yet verified.** That `/fast` actually applies to Astra once the target entries land. A silently dropped target produces no error, so the config edit is not its own proof.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **cli-opencode cannot serve this model**, and this packet does not fix it. The likely cause is that opencode resolves `--model` against a bundled catalog and sends something malformed for an id it does not know, which is where Pi warns and succeeds instead. Reading, not diagnosis.
- **Pi's `off` tier is unexplained.** It returned a marker, but Pi may simply omit the parameter rather than send an off value, and codex rejects both tiers below `low`. The row should not claim Pi reaches under the model's floor until that is checked.
- **`ultra` on a second model is a change in kind.** Until now the cli-codex catalog reserved `ultra` for `gpt-5.6-sol`. Astra reaching it may have cost or quota consequences nobody has measured.
- **Two API-key routes exist and are deliberately unwritten.** `llmgateway/gpt-6-astra`, plus `openrouter/openai/gpt-6-astra` and its `-pro` sibling, all serve the model. They are excluded by the OAuth-only rule, and are noted here only so a later reader knows they were seen rather than missed.
- **Two `openai` catalog drifts were found while verifying and left alone.** The catalog claims six GPT-5.6 slugs including `-pro` tiers the live list does not carry, and says the Terra persona was retired while `gpt-5.6-terra` and `-terra-fast` are both listed.
<!-- /ANCHOR:limitations -->
