---
title: "Tasks: Astra on the OAuth route, two catalogs and one recorded failure"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "astra oauth"
  - "astra codex pi rosters"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/064-gpt-6-astra-oauth"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the twelve verification dispatches and broke the rest into four phases"
    next_safe_action: "Run T013, the codex catalog row"
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
# Tasks: Astra on the OAuth route, two catalogs and one recorded failure

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Verification, already spent

Twelve live dispatches on 2026-09-05. Recorded so implementation does not pay for them twice, and so a later reader can see which claims came from a turn rather than from a listing.

- [x] T001 Establish which providers are OAuth and which are API-key [evidence: `opencode auth list` shows `OpenAI` as the only `oauth` credential of eight, with OpenRouter, DevPass, ClinePass, DeepSeek, OpenCode Go, MiniMax and Xiaomi all `api`. `codex` `auth.json` carries `auth_mode = chatgpt`, `OPENAI_API_KEY` null, and refresh tokens. `.pi/models.json` declares four providers, all API-key, and `openai-codex` is not among them because it is a builtin]
- [x] T002 Prove the catalog is not authoritative [evidence: `opencode models openai` lists 13 slugs without Astra, and Astra dispatches anyway. The list is bundled, not a live account query]
- [x] T003 Dispatch Astra on cli-codex [evidence: `codex exec --model gpt-6-astra -c model_reasoning_effort="low" -c service_tier="fast" --sandbox read-only` returned `ASTRA-CODEX-OK`]
- [x] T004 Dispatch Astra on cli-pi [evidence: `pi --provider openai-codex --model gpt-6-astra --thinking high --mode text` returned `ASTRA-PI-OK`, after warning `Model "gpt-6-astra" not found for provider "openai-codex". Using custom model id`]
- [x] T005 Probe the full codex tier ladder, one dispatch per tier [evidence: `low`, `medium`, `high`, `xhigh`, `max` and `ultra` each returned their marker. `none` and `minimal` each returned HTTP 400]
- [x] T006 Probe the pi tier ladder [evidence: `off`, `xhigh` and `max` each returned their marker]
- [x] T007 Confirm fast mode on codex [evidence: every accepted-tier dispatch above carried `-c service_tier="fast"`]
- [x] T008 Reproduce the cli-opencode failure [evidence: `openai/gpt-6-astra` returned `UnknownError: Unexpected server error` three times, refs `err_2e5431fd` with no variant, `err_0ceab3e7` with `--variant high` and `err_cbd04430` with `--variant max`]
- [x] T009 Control the opencode failure against a known-good model [evidence: `opencode run --model openai/gpt-5.6-sol --variant high` returned `CONTROL-OK`, so the provider works and the failure is model-specific]
- [x] T010 Read the Pi fast-mode extension's provider gate from source [evidence: `SUPPORTED_PROVIDERS = ["openai", "openai-codex"]` at `.pi/extensions/pi-fast-mode-w-subagent-support/src/types.ts:63`, `DEFAULT_SERVICE_TIER = "priority"` at `:57`, and `config.ts:138` drops a target naming any other provider without erroring. Astra's provider is on the list]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Config, and the lever that actually turns on

- [ ] T011 Add `openai-codex/gpt-6-astra` to `enabledModels`, seventeen total (`.pi/settings.json`) [the model works without this, as a passed-through custom id. The entry makes it first-class so a typo fails instead of silently reaching the API]
- [ ] T012 Add two Astra `targets` entries, one per supported provider, fourteen total (`.pi/pi-fast-mode-w-subagent-support-config.json`) [match the shape the six GPT-5.x models already use: `{provider, model, serviceTier: "priority"}`]
- [ ] T013 Validate both edited files parse and keep operator formatting (`JSON.parse` clean, no trailing newline change)
- [ ] T014 Prove `/fast` now reaches Astra on Pi [an unsupported target is dropped silently, so the absence of an error proves nothing. Dispatch once with fast mode on and once off, and confirm the extension treats Astra as an eligible target]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: The rows

- [ ] T015 Add the Astra row to the cli-codex model table (`cli-codex/references/providers-and-models.md`) [ceiling `ultra`, and say plainly that it is the second model reaching that tier after `gpt-5.6-sol`]
- [ ] T016 Add Astra to the cli-codex per-model effort-ceiling table in §4, and name the rejected `none` and `minimal` [a caller who reads only the eight-tier ladder will otherwise assume the floor applies]
- [ ] T017 [P] Add the Astra row to the cli-pi `openai-codex` section (`cli-pi/references/providers-and-models.md`) [quote the custom-model-id warning so it does not read as a failure, and give the six accepted tiers]
- [ ] T018 [P] Record the cli-opencode failure (`cli-opencode/references/providers-and-models.md`) [the three error refs, the passing `gpt-5.6-sol` control, and the reading that opencode resolves against a bundled catalog. State it as observed behavior, not as a diagnosed cause]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: The correction this packet forces

- [ ] T019 Correct the cli-pi fast-mode claim in §4 (`cli-pi/references/providers-and-models.md`) [it currently ends "Pi uses the bare `--thinking <tier>` flag and has no confirmed service-tier control surface". Pi has one: `pi-fast-mode-w-subagent-support` v0.3.0, `/fast [on|off|toggle]` and `--fast`, `service_tier: "priority"`, propagated to child processes through `PI_FAST_MODE_W_SUBAGENT_SUPPORT`]
- [ ] T020 State the boundary in the same paragraph: the lever covers `openai` and `openai-codex` and nothing else, so it reaches Astra and would not reach an API-key route [cite `types.ts:63` so the next reader checks the source rather than the prose]
- [ ] T021 Add one line to both catalogs saying the bundled model list is not a live account query, and a dispatch is the real test [this packet exists because that was assumed the other way round, and the next release will pose the same question]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Close out

- [ ] T022 Confirm no API-key route was written anywhere: no `llmgateway` row, no `openrouter` row, no `.pi/models.json` change
- [ ] T023 Confirm `PI_SUPPORTED_MODELS` and `PI_MODEL_PROVIDERS` are untouched, so Astra stays direct-dispatch only
- [ ] T024 Confirm no default moved: model, provider, effort and service tier on all three CLIs
- [ ] T025 Rewrite `implementation-summary.md` from what ran
- [ ] T026 Regenerate the packet metadata, documents first then generators (`generate-description.js` then `backfill-graph-metadata.js`)
- [ ] T027 Validate the packet and require an explicit `RESULT: PASSED`
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks
- [ ] Every row backed by a dispatch on that CLI, not carried across from another
- [ ] `/fast` proven to reach Astra on Pi, not assumed from the config edit
- [ ] No tier offered that the model rejects, and no API-key route anywhere
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
