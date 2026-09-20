---
title: "Feature Specification: DevPass (LLM Gateway) as a config-wired custom provider in cli-pi"
description: "pi has no builtin for LLM Gateway, so the operator's DevPass subscription was unreachable from cli-pi even though opencode already used the same account. This adds a providers.llmgateway block to .pi/models.json with four dispatch-verified models, following the cline-pass precedent, and documents the one rule that is the exact inverse of it: LLM Gateway takes bare model ids and rejects prefixed ones."
trigger_phrases:
  - "devpass pi custom provider"
  - "llmgateway pi models.json"
  - "add llm gateway to pi"
  - "pi bare model id llmgateway"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/062-devpass-pi-custom-provider"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Provider wired and verified; key export confirmed"
    next_safe_action: "None - work is complete and verified"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/custom-providers.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-062-devpass-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: DevPass (LLM Gateway) as a config-wired custom provider in cli-pi

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `skilled/v4.0.0.0` |

> **Numbering.** The operator asked for `061`; that number was already taken by the GLM thinking-tier fix created earlier in the same session, so this packet is `062`.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
pi builds its runtime provider set from a compiled-in catalog plus every `providers.*` block in `.pi/models.json`. It ships no builtin for LLM Gateway, so DevPass — a paid subscription the operator already holds and opencode already authenticates against — was invisible to pi's picker, to `pi --list-models`, and to every headless `-p` dispatch. The subscription reached one of the two CLIs.

This is the same shape as the Cline gap that packet `049` closed, and the fix is the same shape too. What is **not** the same is the model-id rule, and that is where a careful copy of the Cline block would break: Cline requires a slashed `modelType/model` id and 400s a bare one, while LLM Gateway requires a **bare** id and 400s a prefixed one. The two providers sit adjacent in the same file with opposite requirements.

### Purpose
Give cli-pi the same DevPass reach opencode has, with every model id, thinking ladder and credential path proven by a real dispatch rather than inferred from the sibling block.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `providers.llmgateway` block in `.pi/models.json` — `api: "openai-completions"`, base `https://api.llmgateway.io/v1`, `apiKey: "${LLMGATEWAY_API_KEY}"`, four models each carrying its own `thinkingLevelMap`.
- Four `enabledModels` entries in `.pi/settings.json`.
- A provider section in `.pi/custom-providers.md`, with the bare-id gotcha stated against the Cline rule it inverts.
- An `llmgateway` section in the cli-pi roster.
- Correcting a residual claim in that roster's cline-pass section, which still asserted GLM-5.3-Flash's `xhigh` ceiling holds "on every route" — the belief packet `061` disproved.

### Out of Scope
- **`PI_SUPPORTED_MODELS` / the deep-loop fan-out.** The bare literals `deepseek-v4-flash` and `glm-5.3-flash` are already mapped to opencode-go in `PI_MODEL_PROVIDERS`, and one literal maps to one provider. These entries are direct-dispatch only, exactly as the Cline GLM route is.
- **Any of the other 179 llmgateway models.** Four is the roster the operator picked for packet `060`; this packet mirrors it rather than widening it.
- **`defaultProvider` / `defaultModel`.** Unchanged — `cline-pass` stays the default.
- **cli-opencode.** Its DevPass onboarding is packet `060`, still unimplemented.
- **Auditing the rest of `~/.zshenv`.** The one export was added; nothing else on that file was touched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | `providers.llmgateway` block, four models |
| `.pi/settings.json` | Modify | Four `enabledModels` entries |
| `.pi/custom-providers.md` | Modify | New §3; key section generalized to two providers; verify/remove extended; sections renumbered |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | New `llmgateway` section; residual GLM ceiling claim corrected; provider count 6 → 7 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | The provider loads in pi | `pi --list-models` shows all four `llmgateway` rows | Met |
| REQ-002 | Every model id is proven, not inferred | Each of the four returns a live reply through `pi -p` at its own ceiling | Met |
| REQ-003 | The id format is established by negative control | Bare returns 200 and prefixed returns 400 against the live API, both observed | Met |
| REQ-004 | No secret enters the repo | `apiKey` is `${LLMGATEWAY_API_KEY}`; no key literal in any tracked file | Met |
| REQ-005 | The credential resolves through config, not a stored login | pi's auth store holds no `llmgateway` entry, so the verified dispatches used the env reference | Met |
| REQ-006 | Both JSON files stay valid and keep operator formatting | `JSON.parse` clean on both; `models.json` keeps its no-trailing-newline form | Met |
| REQ-007 | Dispatched shells can authenticate | `LLMGATEWAY_API_KEY` exported from `~/.zshenv` | Met |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--provider llmgateway --model llmgateway/<id>` returns a model reply for all four ids.
- **SC-002**: A reader of `.pi/models.json` cannot mistake the two adjacent providers' opposite id rules, because both are stated where the blocks live.
- **SC-003**: No route claim in the cli-pi roster contradicts packet `061`'s per-route finding.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The Cline slashed-id form is copied here | Every dispatch 400s | Stated as an inversion in both the config doc and the roster, with the exact error string |
| Risk | `{env:VAR}` copied from opencode | pi sends the literal; provider 401s | `${VAR}` used; the gotcha is already documented from packet `049` phase 009 |
| Risk | Global `defaultThinkingLevel: xhigh` used unqualified | Two of the four models have no `xhigh` | Docs require an explicit `--thinking`; per-model `thinkingLevelMap` bounds the picker |
| Risk | A provider-wide `thinkingFormat` misparses two families | Thinking tokens garbled | None set; pi's default OpenAI parsing verified working across all four |
| Dependency | DevPass subscription | No dispatch | Green — four live turns on 2026-09-04 |
| Dependency | `LLMGATEWAY_API_KEY` in the environment | Dispatched shells 401 | Closed — exported by the operator, proven by a scrubbed-environment dispatch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Export `LLMGATEWAY_API_KEY` to `~/.zshenv`?** **RESOLVED (operator, 2026-09-04): done.** The operator set it themselves rather than have it written for them, which is the right split for a credential on their own machine. Verified by the strongest available control: the variable was scrubbed from the parent environment with `env -u`, so `~/.zshenv` was the only possible source, and the dispatch still returned its marker. Rollback remains deleting that one export line.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Precedent**: `049-cline-provider-roster` — phase 003 (the config build), 006 (the id-format gotcha), 009 (the `${VAR}` credential gotcha)
- **Sibling**: `060-devpass-roster-vision-gemini-3-8` (cli-opencode DevPass onboarding, unimplemented), `061-glm-5-3-flash-thinking-tier-per-route` (the per-route ceiling finding)
- **Operator doc**: `.pi/custom-providers.md` §3
<!-- /ANCHOR:related-docs -->
