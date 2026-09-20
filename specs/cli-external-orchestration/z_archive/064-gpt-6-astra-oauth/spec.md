---
title: "Feature Specification: GPT-6 Astra on the OAuth GPT provider, across the two CLIs that can reach it"
description: "Adds gpt-6-astra to the cli-codex and cli-pi rosters over the official ChatGPT OAuth provider, at the six reasoning tiers it accepts and with fast mode on both. API-key routes are excluded by operator rule. cli-opencode cannot serve the model and that failure is recorded with its evidence."
trigger_phrases:
  - "gpt-6 astra"
  - "astra oauth roster"
  - "astra thinking tiers"
  - "astra fast mode"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/064-gpt-6-astra-oauth"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Dispatch-verified Astra on codex and pi, and reproduced the opencode failure"
    next_safe_action: "Add the codex catalog row and its ultra ceiling"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/references/providers-and-models.md"
      - ".pi/pi-fast-mode-w-subagent-support-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-064-astra-oauth"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the opencode failure is a bundled-catalog gap or something upstream"
      - "Whether pi off maps to a real tier or simply omits the parameter"
    answered_questions:
      - "Astra runs on the official OAuth provider, proven by dispatch on two CLIs"
      - "It accepts six of the eight codex tiers, low through ultra"
      - "Fast mode works on codex, and is two config entries away on pi"
      - "API-key routes are excluded by operator rule"
---
# Feature Specification: GPT-6 Astra on the OAuth GPT provider, across the two CLIs that can reach it

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator asked for GPT-6 Astra at all thinking levels and in fast mode, through cli-pi, cli-opencode and cli-codex, over the official GPT provider only. The model was released on 2026-09-03, so nothing here knew it existed, and the catalogs could not answer the question either.

**The catalogs were the wrong place to look.** `opencode models openai` lists thirteen slugs and Astra is not among them, which reads as proof the OAuth surface does not carry the model. It is not proof. That listing is a bundled catalog rather than a live account query, and a dispatch settles what the list cannot. Astra answered on the first try through `codex exec --model gpt-6-astra`, on `auth_mode = chatgpt` with no API key present.

**Two of the three CLIs reach it, and the third fails in a way worth recording.** cli-codex runs it directly. cli-pi runs it through the `openai-codex` builtin, printing `Model "gpt-6-astra" not found for provider "openai-codex". Using custom model id` and then succeeding, because Pi passes an unknown id through. cli-opencode returns `UnknownError: Unexpected server error` on every attempt, with or without a variant, while the same command against `openai/gpt-5.6-sol` succeeds. So the failure belongs to this model on that CLI, not to the provider.

**"All thinking levels" is six of eight, and the floor is the surprise.** Astra accepts `low`, `medium`, `high`, `xhigh`, `max` and `ultra`. It rejects `none` and `minimal` with a 400. The ceiling is the notable half: `ultra` is the tier the cli-codex catalog currently reserves for `gpt-5.6-sol` alone, and Astra reaches it.

**Fast mode works, contrary to what the documents say.** Every successful codex dispatch above carried `-c service_tier="fast"`. On Pi the lever exists too, through the `pi-fast-mode-w-subagent-support` extension, and it accepts exactly the two providers that matter here. So fast mode on Pi is two configuration entries rather than an impossibility, and the cli-pi reference document that says Pi has "no confirmed service-tier control surface" is simply wrong.

**What is excluded, and why it is not a gap.** Astra is also served by `llmgateway` and by `openrouter`. Both authenticate with an API key, and `opencode auth list` shows the OpenAI credential is the only `oauth` entry among eight. The operator's rule is official OAuth only, so neither route is specified here, and neither is a deferral.

### Purpose

Astra reachable on both CLIs that can serve it, at every tier it accepts, with fast mode on, and with the one CLI that cannot serve it saying so in writing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The Astra row in the cli-codex model table, with a `ultra` effort ceiling and the `none` and `minimal` floor rejection recorded.
- The Astra row in the cli-pi roster under `openai-codex`, including the custom-model-id warning a caller will see.
- `openai-codex/gpt-6-astra` in `.pi/settings.json`, so the model is first-class rather than passed through unrecognised.
- **Fast mode on Pi.** Two `targets` entries in `.pi/pi-fast-mode-w-subagent-support-config.json`, one per supported provider, so `/fast` and `--fast` cover Astra the way they cover the six GPT-5.x models.
- **The cli-pi fast-mode correction.** Its reference says Pi has no confirmed service-tier control surface. It has one, and this packet is what makes the omission load-bearing.
- **The cli-opencode failure**, recorded with its error references and the passing control, so the next reader does not spend the dispatches again.
- The catalog-versus-dispatch lesson, stated where the next model addition will read it.

### Out of Scope

- **The `llmgateway` and `openrouter` routes.** Both serve Astra and both are API-key authenticated. Operator rule on 2026-09-05 is official OAuth only. Not a deferral, and no row is written for either.
- **Repairing cli-opencode.** The server error is upstream of this repository. The packet records it and does not chase it.
- **The deep-loop fan-out roster.** `PI_SUPPORTED_MODELS` and `PI_MODEL_PROVIDERS` stay untouched, so Astra is direct-dispatch only.
- **Defaults.** No default model, provider, effort or service tier moves. Astra is opt-in.
- **The two `openai` catalog drifts found in passing.** The catalog claims six GPT-5.6 slugs including `-pro` tiers the live list does not have, and says the Terra persona was retired while `gpt-5.6-terra` is listed. Real, and not this packet's.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-codex/references/providers-and-models.md` | Modify | Astra row, `ultra` ceiling, the rejected floor tiers, and the second model reaching `ultra` |
| `cli-pi/references/providers-and-models.md` | Modify | Astra row under `openai-codex`, the custom-id warning, and the §4 fast-mode correction |
| `.pi/settings.json` | Modify | `openai-codex/gpt-6-astra` in `enabledModels`, seventeen total |
| `.pi/pi-fast-mode-w-subagent-support-config.json` | Modify | Two Astra `targets` entries, fourteen total |
| `cli-opencode/references/providers-and-models.md` | Modify | Records the model as not servable here, with the error refs and the control |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Astra dispatches on cli-codex over OAuth | `codex exec --model gpt-6-astra` returns its marker with no API key in `auth.json` | Met |
| REQ-002 | Astra dispatches on cli-pi over `openai-codex` | `pi --provider openai-codex --model gpt-6-astra` returns its marker | Met |
| REQ-003 | The accepted tier set is recorded, floor and ceiling | Six accepted, `none` and `minimal` rejected with 400, each tier dispatched individually | Met |
| REQ-004 | Fast mode is proven on codex | Every accepted-tier dispatch carried `-c service_tier="fast"` | Met |
| REQ-005 | Fast mode reaches Astra on Pi | `/fast` applies to Astra after the two target entries land | Planned |
| REQ-006 | The cli-opencode failure is recorded, not inferred | The row cites the error refs and the passing `gpt-5.6-sol` control | Planned |
| REQ-007 | No API-key route is specified anywhere in the packet | No `llmgateway` or `openrouter` row is authored | Planned |
| REQ-008 | pi config stays valid and operator-formatted | `JSON.parse` clean on both edited files | Planned |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can dispatch Astra on either working CLI from the catalog alone, at the right tier, with fast mode on.
- **SC-002**: Nobody repeats the opencode dispatches to rediscover that it does not work.
- **SC-003**: No row offers a tier the model rejects, and none offers an API-key route.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A caller asks for `none` or `minimal` | 400 from the API, and the tier looks broken rather than unsupported | Both rejected tiers named on the row, not just the accepted six |
| Risk | Pi's passthrough hides a typo | An unknown id warns and still dispatches, so a misspelling reaches the API as a custom id | The `enabledModels` entry makes the id first-class, and the row quotes the warning |
| Risk | The opencode failure is read as a config error | Someone spends dispatches re-testing | The row carries three error refs and the control that passed |
| Risk | `ultra` on a second model changes cost or quota behavior | `ultra` was the sol-only tier until now | Recorded on the row so the change is visible, and no default moves |
| Dependency | ChatGPT OAuth on codex | No dispatch | Green, `auth_mode = chatgpt`, verified 2026-09-05 |
| Dependency | Pi's `openai-codex` builtin | No pi route | Green, it is a builtin and not one of the four API-key providers in `models.json` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

**Why does cli-opencode fail?** Three attempts returned `UnknownError: Unexpected server error` with refs `err_2e5431fd`, `err_0ceab3e7` and `err_cbd04430`, with no variant, with `--variant high` and with `--variant max`. The same command shape against `openai/gpt-5.6-sol` returned its marker. The likely cause is that opencode resolves `--model` against a bundled catalog and sends something malformed for an id it does not know, which is exactly where Pi warns and succeeds instead. Not confirmed, and the packet records the behavior rather than the cause.

**Does Pi's `off` mean anything here?** `--thinking off` returned its marker, but that does not prove the model accepted an off tier, because Pi may simply omit the parameter. Codex rejects both `none` and `minimal` with a 400, so the model itself has a floor at `low`. Worth one check before the row claims Pi reaches below it.

**Should the catalog say how a model gets verified?** This packet found the model absent from a listing that reads as authoritative, and present on dispatch. That gap will recur on the next release. A sentence in both catalogs saying the model list is bundled and a dispatch is the real test would prevent it, and it is one line rather than a packet.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Builds on**: `063-devpass-gpt-5-6-luna` (the roster-row pattern), `061-glm-5-3-flash-thinking-tier-per-route` (per-route ladders differing for one model), `027-cli-codex-revival` (the codex OAuth contract)
<!-- /ANCHOR:related-docs -->
