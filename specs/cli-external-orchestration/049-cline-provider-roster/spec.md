---
title: "Feature Specification: Cline Provider Roster — DeepSeek V4 Flash in cli-opencode, and cli pi parity investigation"
description: "Phase parent: add the Cline provider's DeepSeek V4 Flash to the cli-opencode roster (Phase 1, done), then investigate whether cli pi can reach the same Cline provider its /login does not currently offer (Phase 2, investigation)."
trigger_phrases:
  - "cline provider roster cli-opencode"
  - "cline-pass deepseek v4 flash opencode"
  - "add cline support to cli pi"
  - "cli pi cline login parity"
  - "cline provider phase parent 049"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster"
    last_updated_at: "2026-08-18T18:42:01Z"
    last_updated_by: "claude"
    recent_action: "All seven phases complete; phase 7 added the cline testing playbook scenario"
    next_safe_action: "Commit and push to v4 and main"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-phase-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Cline Provider Roster — DeepSeek V4 Flash in cli-opencode, and cli pi parity investigation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/049-cline-provider-roster |
| **Predecessor** | cli-external-orchestration/047-cli-pi-opencode-openrouter-roster (the OpenRouter roster-add precedent this mirrors) |
| **Successor** | None |
| **Handoff Criteria** | Each phase passes `validate.sh --strict` independently and `validate.sh --recursive --strict` passes on this parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator authenticated the Cline provider inside opencode (it registers as `cline-pass`, not `cline`), which exposes `cline-pass/cline-pass/deepseek-v4-flash`. The cli-opencode skill roster did not document this provider, so an operator or dispatcher had no catalog entry telling them the model id, its reasoning-tier behavior, or how it differs from the direct/OpenRouter DeepSeek Flash ids. Separately, cli pi's `/login` does not list Cline at all, so the same model is unreachable from pi even though opencode can already dispatch it.

### Purpose
Document Cline once, correctly, in the mode that can already reach it (cli-opencode), then determine whether cli pi can be brought to parity. Phase 1 adds the roster entry with its true tiers. Phase 2 investigates — before touching any pi runtime file — whether and how a Cline provider can be surfaced in pi's `/login`/model picker.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and continuity live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cataloguing the Cline provider (`cline-pass`) and its DeepSeek V4 Flash model in the cli-opencode roster docs.
- The reasoning-tier facts that make Cline's Flash different from the direct/opencode-go/OpenRouter Flash ids (no `max` tier; top is `xhigh`).
- Investigating whether cli pi can register/authenticate the Cline provider and surface its models in `/login` and the model picker, to reach opencode parity.

### Out of Scope
- Wiring `cline-pass` flash into the deep-loop fan-out executor registry (its id matches the `--variant max` auto-pin, which Cline's Flash does not support — a separate, deliberate decision).
- Any cli pi runtime change in Phase 1 — pi changes are gated on the Phase 2 investigation verdict.
- Adding Cline's other models (glm-5.2, kimi-*, mimo-*, minimax-m3, qwen3.7-*) to the curated roster.

### Files to Change
Aggregate scope; per-phase detail lives in each child plan.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | 001 | New `### cline-pass` provider section + effort-lever row |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | 001 | Keywords + model-alternates + honor-overrides examples |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Modify | 001 | Provider login menu entry for Cline |
| `specs/cli-external-orchestration/049-cline-provider-roster/002-cline-support-pi-investigation/**` | Create | 002 | Investigation findings (runtime pi files unchanged until a verdict lands) |
| `.pi/models.json` | Modify | 003 | Add the `cline-pass` provider block (env-keyed, `openai-completions`) |
| `.pi/settings.json` | Modify | 003 | Add `cline-pass/deepseek-v4-flash` to `enabledModels` |
| `.pi/custom-providers.md` | Create | 003 | Document the custom pi provider |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | 004 | New `### cline-pass` roster section, xhigh-only (no lower thinking tiers) |
| `.pi/models.json` | Modify | 005 | Add the `deepseek-v4-pro` cline-pass model |
| `.pi/settings.json` | Modify | 005 | Enable pro; set default provider cline-pass / model deepseek-v4-flash |
| `.pi/custom-providers.md`, both cli rosters | Modify | 005 | Document the pro model, xhigh-only |
| `.pi/models.json` | Modify | 006 | Restore the slashed `cline-pass/<model>` id for both models |
| `.pi/settings.json` | Modify | 006 | Three-segment `enabledModels`; `defaultModel` to `cline-pass/deepseek-v4-flash` |
| `.pi/custom-providers.md`, cli-pi roster | Modify | 006 | Corrected forms + the slashed-id gotcha |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md` | Create | 007 | The PI-023 cline model-dispatch scenario |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Modify | 007 | Index count, Model Dispatch group, cross-reference |
| `.pi/models.json` | Modify | 008 | `thinkingLevelMap` (high + xhigh) on the cline-pass models |
| `.pi/settings.json` | Modify | 008 | `defaultThinkingLevel` restored to `xhigh` |
| `.pi/models.json` | Modify | 009 | cline-pass `apiKey` in pi's own `${VAR}` syntax |
| `.pi/custom-providers.md`, cli-pi roster | Modify | 009 | Credential syntax, precedence, and the `pi auth check` blind spot |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, findings, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-cline-deepseek-flash-cli-opencode/ | Add `cline-pass/cline-pass/deepseek-v4-flash` to the cli-opencode roster (providers-and-models.md + SKILL.md + cli-reference.md), mirroring the packet-047 OpenRouter add, with the correct no-`max`-tier reasoning behavior. | Complete |
| 2 | 002-cline-support-pi-investigation/ | Investigate whether cli pi can register/authenticate the Cline provider and expose its models in `/login` + the picker, to reach opencode parity. Read-only until a verdict; runtime pi files unchanged. | Complete |
| 3 | 003-cline-pi-config-build/ | Wire the Cline provider into cli pi by config (Phase 2's `config-only-feasible` verdict): `cline-pass` block in `.pi/models.json` + `enabledModels` entry in `.pi/settings.json`, env-keyed, plus `.pi/custom-providers.md`. | Complete |
| 4 | 004-cline-cli-pi-roster/ | Add the `cline-pass` DeepSeek V4 Flash entry to the cli-pi skill roster (`references/providers-and-models.md` §2), xhigh-only (no lower thinking tiers), so the mode's provider catalog documents the config-wired provider. | Complete |
| 5 | 005-cline-pro-and-pi-default/ | Add DeepSeek V4 Pro through the Cline provider across `.pi` config and both cli rosters (xhigh-only), and set pi's default provider to `cline-pass` with `deepseek-v4-flash`. | Complete |
| 6 | 006-cline-pi-model-id-format-fix/ | Fix the cline-pass model id format: the ids were bare, so pi sent a bare `model` and the Cline API returned `400 invalid model format`. Restore the slashed `cline-pass/<model>` id across `.pi` config and both pi doc surfaces, and document the slashed-id gotcha. | Complete |
| 7 | 007-cline-model-dispatch-playbook-scenario/ | Add PI-023 to the cli-pi manual testing playbook: a Model Dispatch scenario for the config-wired cline-pass provider's slashed model-id contract, plus its index wiring. | Complete |
| 8 | 008-cli-pi-cline-xhigh-thinking-tiers/ | Declare a `thinkingLevelMap` (high + xhigh) on the cline-pass models so pi's interactive picker can reach `xhigh`, matching opencode, and restore the `xhigh` default. | Complete |
| 9 | 009-cline-pi-apikey-env-syntax-fix/ | Fix the cline-pass `apiKey` placeholder: it used opencode's `{env:VAR}` form, which pi sends to Cline as a literal key for a `401`, masked by a `/login` credential so only sessions with their own agent directory failed. Switch to pi's `${VAR}` syntax and source the key from the environment. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-cline-deepseek-flash-cli-opencode | 002-cline-support-pi-investigation | Roster entry lands and reflects the live `opencode models cline-pass` metadata (reasoning tiers, no `max`) | `providers-and-models.md` shows the `### cline-pass` section; `validate.sh --strict` exit 0 |
| 002-cline-support-pi-investigation | (pi implementation phase, TBD) | Investigation reaches an evidence-backed feasibility verdict (a concrete mechanism, or a documented "not feasible / blocked" conclusion) | `implementation-summary.md` records the verdict; `validate.sh --strict` exit 0 |
| 002-cline-support-pi-investigation | 003-cline-pi-config-build | `cline-pass` surfaces as a live pi provider, env-keyed (no repo secret), with the custom provider documented in `.pi` | `pi --list-models` shows the cline-pass row; `pi auth check` returns `status: ready`; `.pi/custom-providers.md` present; `validate.sh --strict` exit 0 |
| 003-cline-pi-config-build | 004-cline-cli-pi-roster | The cli-pi skill roster documents `cline-pass/deepseek-v4-flash` at xhigh-only (no lower thinking tiers) | `cli-pi/references/providers-and-models.md` shows the `### cline-pass` section; `validate.sh --strict` exit 0 |
| 004-cline-cli-pi-roster | 005-cline-pro-and-pi-default | DeepSeek V4 Pro is live on every cline-pass surface at xhigh-only, and pi's default provider is cline-pass | `pi --list-models` shows both cline models; `pi auth check` on pro returns `status: ready`; both rosters show the pro row; `validate.sh --strict` exit 0 |
| 005-cline-pro-and-pi-default | 006-cline-pi-model-id-format-fix | A live pi dispatch to both cline models returns a model reply with no `400 invalid model format`; every cline-pass surface shows the slashed id | Live `pi --provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash` returns a reply; `.pi/models.json` ids are slashed; `validate.sh --strict` exit 0 |
| 006-cline-pi-model-id-format-fix | 007-cline-model-dispatch-playbook-scenario | The cli-pi testing playbook has a cline Model Dispatch scenario (PI-023), indexed and sk-doc VALID | `model-dispatch/cline-provider-id-format-dispatch.md` exists; the index lists PI-023; `validate.sh --strict` exit 0 |
| 007-cline-model-dispatch-playbook-scenario | 008-cli-pi-cline-xhigh-thinking-tiers | Both cline-pass models expose `xhigh` to the picker and a live `--thinking xhigh` dispatch completes | `thinkingLevelMap` present on both models; live xhigh turn at exit 0; `validate.sh --strict` exit 0 |
| 008-cli-pi-cline-xhigh-thinking-tiers | 009-cline-pi-apikey-env-syntax-fix | A cline dispatch authenticates from the environment alone, against an agent directory with an empty auth store | `apiKey` is `${CLINE_API_KEY}`; live dispatch through a fresh non-interactive shell returns a model reply; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether cli pi's provider system can register an OpenAI-compatible provider pointed at `https://api.cline.bot/api/v1` and reuse the operator's existing Cline auth, or whether pi's `/login` set is fixed to a built-in provider list.
- Whether reaching pi parity is a config-only change (`.pi/models.json` + `enabledModels`) or requires a pi extension/plugin — Phase 2 answers this.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
