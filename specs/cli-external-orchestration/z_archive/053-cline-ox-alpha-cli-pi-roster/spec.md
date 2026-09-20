---
title: "Feature Specification: Ox Alpha for cli-pi via the Cline provider"
description: "Register the free Ox Alpha model on cli-pi through the config-wired Cline provider (cline-pass), mirroring the Cline DeepSeek Flash treatment: a x-ai/ox-alpha entry in .pi/models.json, the three-segment enabledModels id, both pi doc surfaces, and the deep-loop cli-pi fan-out roster."
trigger_phrases:
  - "cline ox-alpha cli-pi"
  - "cline-pass ox-alpha roster"
  - "ox alpha cline provider pi"
  - "cli-pi cline ox-alpha fanout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/053-cline-ox-alpha-cli-pi-roster"
    last_updated_at: "2026-08-24T10:18:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped x-ai/ox-alpha across config, docs, fan-out roster, and guard tests; live-verified (PONG)"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-053-cline-ox-alpha-cli-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Ox Alpha for cli-pi via the Cline provider

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-24 |
| **Branch** | `skilled/v4.0.0.0` |

> **Sibling precedent:** `052-opencode-go-ox-alpha-free-roster` added the SAME model (Ox Alpha) through a DIFFERENT provider — OpenRouter (`openrouter/stealth/ox-alpha`). This packet adds it through the **Cline** provider instead. The two routes coexist; neither replaces the other.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
pi's **interactive** Cline picker already discovers **Ox Alpha** as a free model (`Free — Try with limited usage, separate from ClinePass quota`) and can run it live — it is the operator's active model in the current session. But the **config-wired** Cline provider (`cline-pass` in `.pi/models.json`, added in packet `049-cline-provider-roster`) only declares the two DeepSeek models. So Ox Alpha is invisible to every non-interactive path: it is not in `pi --list-models`, not in the cli-pi skill roster, and not dispatchable from the deep-loop fan-out. This is the exact gap that packet 049 closed for Cline's DeepSeek Flash.

### Purpose
Register Ox Alpha on cli-pi through the Cline provider, treated **the same way as the Cline DeepSeek Flash entry**: add a `x-ai/ox-alpha` model to the provider block, enable its three-segment picker id, document it on both pi doc surfaces, and (per operator decision, unlike the 049 DeepSeek add) also wire it into the deep-loop cli-pi fan-out roster so it can be dispatched from `fanout-run.cjs`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.pi/models.json` — a third model in the `cline-pass` provider block: `x-ai/ox-alpha`, reasoning, with a `thinkingLevelMap` that mirrors the DeepSeek Flash entry (top tier `xhigh`, no `max`).
- `.pi/settings.json` — the three-segment `cline-pass/x-ai/ox-alpha` added to `enabledModels` (the phase-006 slashed-id contract). `defaultModel` is left unchanged.
- `.pi/custom-providers.md` — §2 (Cline-Pass) updated to list Ox Alpha alongside the two DeepSeek models.
- `cli-pi/references/providers-and-models.md` — a new Ox Alpha row under `### cline-pass`.
- **Deep-loop cli-pi fan-out roster** — `x-ai/ox-alpha` added to `PI_SUPPORTED_MODELS` (`executor-config.ts`) and its `fanout-run.cjs` mirror `PI_ALLOWED_MODELS`, and mapped to the `cline-pass` provider in `PI_MODEL_PROVIDERS`.
- Guard tests (`executor-config.vitest.ts`, `fanout-run.vitest.ts`) — swap the roster/provider pins to include the new id.

### Out of Scope
- The **OpenRouter** Ox Alpha route (`openrouter/stealth/ox-alpha`) — already shipped in packet 052; untouched.
- **cli-opencode** — its cline-pass provider is a native login, not a config roster; no runtime change is required for it, and the operator's ask is cli-pi-scoped. A cli-opencode roster-doc parity row is a noted optional follow-up, not part of this packet.
- Changing pi's `defaultProvider` / `defaultModel` (they stay on DeepSeek V4 Flash).
- Adding any other Cline model (glm, kimi, mimo, minimax, qwen, laguna) to the curated roster.
- A manual-testing-playbook scenario for the Cline Ox Alpha dispatch (optional follow-up; the DeepSeek PI-023 scenario already documents the cline-pass slashed-id contract).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | Add `x-ai/ox-alpha` model to the `cline-pass` provider block |
| `.pi/settings.json` | Modify | Add `cline-pass/x-ai/ox-alpha` to `enabledModels` |
| `.pi/custom-providers.md` | Modify | List Ox Alpha under §2 Cline-Pass (models, dispatch, verify, remove) |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | New Ox Alpha row + note under `### cline-pass` |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `PI_SUPPORTED_MODELS`: add `x-ai/ox-alpha` |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `PI_ALLOWED_MODELS` mirror + `PI_MODEL_PROVIDERS` map (`x-ai/ox-alpha → cline-pass`) |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Exact-roster assertion swap |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | `providerByModel` coverage swap |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ox Alpha selectable on cli-pi via Cline | `pi --list-models` shows a `cline-pass  x-ai/ox-alpha` row; `cline-pass/x-ai/ox-alpha` is in `.pi/settings.json` `enabledModels` |
| REQ-002 | Model id follows the Cline slashed-id contract | The `.pi/models.json` `id` is `x-ai/ox-alpha` (the `x-ai/` vendor prefix, NOT `cline-pass/`); a live dispatch returns a model reply, not `400 invalid model format` / `404 model not found` |
| REQ-003 | Fan-out accepts `x-ai/ox-alpha` | Present in `PI_SUPPORTED_MODELS` AND the `fanout-run.cjs` `PI_ALLOWED_MODELS` mirror (byte-synced; guard asserts equality) |
| REQ-004 | Fan-out routes it via `cline-pass` | `PI_MODEL_PROVIDERS` maps `x-ai/ox-alpha → cline-pass`; builder emits `pi -p --offline --model cline-pass/x-ai/ox-alpha` |
| REQ-005 | Runtime stays green | `node --check fanout-run.cjs` passes; the three affected guard vitest files pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Ox Alpha documented on both pi doc surfaces | A row/section for `cline-pass/x-ai/ox-alpha` present in `.pi/custom-providers.md` §2 and the cli-pi `### cline-pass` roster section |
| REQ-007 | Route confirmed live | A `pi -p --provider cline-pass --model cline-pass/x-ai/ox-alpha --thinking xhigh` dispatch completes a real turn (returns the requested token) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deep-loop cli-pi fan-out dispatch of `x-ai/ox-alpha` is accepted and constructed as `pi -p --offline --model cline-pass/x-ai/ox-alpha`.
- **SC-002**: The two enforcement points stay in sync (guard asserts equality); the provider map resolves the new id.
- **SC-003**: Operators find Ox Alpha under `### cline-pass` in the cli-pi roster and in `.pi/custom-providers.md` §2.
- **SC-004**: A real Cline dispatch of the three-segment id returns a model reply, proving the slug and the slashed-id form.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wrong upstream Cline slug for Ox Alpha | `404 model not found` at first dispatch | **Materialized and resolved:** the DeepSeek-analogy guesses (`cline-pass/ox-alpha`, `…-free`) 404'd; a short authorized live-probe found the real id `x-ai/ox-alpha`, confirmed by a `PONG` turn. Do not assume the `cline-pass/` prefix generalizes across Cline models |
| Risk | Mirror drift between `executor-config.ts` and `fanout-run.cjs` | Fan-out rejects an allowlisted model | Guard asserts both rosters equal (`PI_ALLOWED_MODELS` == `PI_SUPPORTED_MODELS`) |
| Risk | Missing provider-map entry | Builder throws "no known provider mapping" | `PI_MODEL_PROVIDERS` gains `x-ai/ox-alpha → cline-pass` |
| Risk | `max`/`ultra` effort requested for a Cline model | Cline has no `max` tier; dispatch could fail | Roster + docs state the `xhigh` ceiling (no `max`), same policy as the Cline DeepSeek entries; no max-pin is added for this id |
| Dependency | Cline (ClinePass) auth on the machine | Cannot dispatch | pi holds a stored `cline-pass` credential (`pi /login cline-pass`); same auth the DeepSeek entries use |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `executor-config.ts` `PI_SUPPORTED_MODELS` and `fanout-run.cjs` `PI_ALLOWED_MODELS` MUST list identical ids (fail-closed sync invariant).
- **NFR-M02**: Every allowlisted pi model MUST carry a `PI_MODEL_PROVIDERS` entry.
- **NFR-M03**: The Cline Ox Alpha entry MUST mirror the Cline DeepSeek Flash entry's shape (slashed id, reasoning, `thinkingLevelMap` topping at `xhigh`), so the provider stays internally consistent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Dispatch
- **Three-segment id**: the `.pi/models.json` `id` is `x-ai/ox-alpha`, so the picker/enabledModels reference and the fan-out builder's `${provider}/${model}` both compose the three-segment `cline-pass/x-ai/ox-alpha` — the same shape as the DeepSeek entries.
- **No `max` tier**: like the Cline DeepSeek models, Ox Alpha here tops out at `xhigh`. pi's global `defaultThinkingLevel: xhigh` lands an unqualified dispatch on the correct tier; fan-out should pass `--thinking xhigh` explicitly and must not request `max`.
- **Same model, two providers**: `x-ai/ox-alpha` (this packet) and `openrouter/stealth/ox-alpha` (packet 052) are the same underlying model reached through two different providers. Both stay in the roster; a dispatcher picks the provider deliberately.
- **Interactive already works**: pi's logged-in Cline picker discovers Ox Alpha live; this packet only closes the config/roster/fan-out gap, it does not change interactive behavior.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Exact upstream Cline model slug for Ox Alpha. **RESOLVED: `x-ai/ox-alpha`** (three-segment reference `cline-pass/x-ai/ox-alpha`). Confirmed by live dispatch 2026-08-24 (real `PONG` at `off` and `xhigh`). The initial analogy guesses `cline-pass/ox-alpha` and `cline-pass/ox-alpha-free` both returned `404 model not found`; a short authorized candidate probe found `x-ai/ox-alpha`. Cline's own docs confirm Ox Alpha as a free rotating stealth model but do not publish the exact API id (they point to the model selector), so the live dispatch is the authority.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Prior art**: `049-cline-provider-roster` (the Cline provider + its DeepSeek roster/config pattern), `052-opencode-go-ox-alpha-free-roster` (the OpenRouter Ox Alpha route + the fan-out wiring pattern)
<!-- /ANCHOR:related-docs -->
