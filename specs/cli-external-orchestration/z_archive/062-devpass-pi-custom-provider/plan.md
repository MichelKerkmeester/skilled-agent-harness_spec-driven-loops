---
title: "Implementation Plan: wire DevPass into cli-pi by config"
description: "Mirror the cline-pass config pattern for LLM Gateway, but establish the model-id format by negative control first, because the two providers require opposite forms and the wrong one only fails on a real dispatch."
trigger_phrases:
  - "devpass pi plan"
  - "llmgateway provider block"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/062-devpass-pi-custom-provider"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Config wired and verified; key export still pending"
    next_safe_action: "Get approval for the zshenv export"
    blockers:
      - "LLMGATEWAY_API_KEY not exported"
    key_files:
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-062-devpass-pi"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: wire DevPass into cli-pi by config

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config + Markdown |
| **Framework** | pi 0.84.3 |
| **Storage** | None — no pi code, no extension, no CLI change |
| **Testing** | Live `curl` against the gateway, then live `pi -p` dispatch per model |

### Overview
Config only. pi unions every `providers.*` block in `.pi/models.json` into its runtime provider set, so a block plus `enabledModels` entries makes the provider real.

The one place this could not be copied from cline-pass is the model-id form, so that was settled first by negative control against the live API rather than by pattern-matching the neighbouring block. That ordering is the whole plan: the Cline packet learned the hard way that a wrong id passes `--list-models` and `pi auth check` and only fails on a real dispatch, and repeating that mistake in the opposite direction was the obvious trap here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] pi has no llmgateway builtin — confirmed, no `llmgateway` string anywhere under `.pi/`
- [x] Credential available in opencode's auth store; no `LLMGATEWAY_API_KEY` in the environment
- [x] Wire id format settled by negative control before writing config
- [x] All four ladders and context/output limits captured live
- [x] The three cline-pass gotchas read from their own packets, not recalled

### Definition of Done
- [x] Four rows in `pi --list-models`
- [x] Four live dispatches, each at its own ceiling
- [x] Both JSON files parse; operator formatting preserved
- [ ] Key durably exported so dispatched shells work — **blocked on approval**
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A config-declared provider. `providers.llmgateway` gives pi the base URL, the API dialect, the credential reference and the model list; `enabledModels` gates the picker; per-model `thinkingLevelMap` tells the picker which effort tiers exist.

The invariant worth naming: **pi sends the model `id` verbatim as the API `model` parameter, and composes its own reference as `<provider>/<id>`.** Both consequences follow from that one fact — the id must be exactly what the API accepts, and the reference is two-segment here versus three for cline-pass, purely because the id is bare rather than slashed.

### Key Components
- **`providers.llmgateway`** — `api: openai-completions` (a bare `openai` lists fine and throws at stream time), base URL, `${LLMGATEWAY_API_KEY}`.
- **Per-model `thinkingLevelMap`** — four different ladders, so no provider-level effort policy is possible here, unlike cline-pass's uniform `xhigh`.
- **No `compat.thinkingFormat`** — deliberately absent; the block spans three model families and a provider-wide hint would apply one family's format to the other two.

### Data Flow
`--provider llmgateway --model llmgateway/glm-5.3-flash --thinking max` → pi resolves the block → sends `model: "glm-5.3-flash"` to `https://api.llmgateway.io/v1` → the gateway routes upstream (reporting e.g. `zai/glm-5.3-flash` back) and returns the completion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A beyond the verification tasks in `tasks.md`. Two levels were used and both mattered: `curl` proved the wire contract independently of pi, then `pi -p` proved pi's own resolution of it. Neither `pi --list-models` nor `pi auth check` counts as evidence here — both were green while the Cline block was broken, which is the documented reason they are not trusted.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| DevPass subscription | External | Green — four live turns | No dispatch |
| `LLMGATEWAY_API_KEY` in env | Operator machine | **Open** | Dispatched and non-interactive shells 401 |
| pi 0.84.3 config union behavior | External | Green — unchanged since packet 049 | Provider would not load |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: dispatches fail, or the provider interferes with an existing route.
- **Procedure**: delete the `providers["llmgateway"]` block from `.pi/models.json` and the four `"llmgateway/…"` lines from `.pi/settings.json`. Nothing else references it — not a default, not in the fan-out roster, no stored credential. Documented in `.pi/custom-providers.md` §6.
<!-- /ANCHOR:rollback -->
