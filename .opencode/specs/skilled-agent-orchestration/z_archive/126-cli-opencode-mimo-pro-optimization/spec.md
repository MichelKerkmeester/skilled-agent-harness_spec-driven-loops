---
title: "Feature Specification: Xiaomi MiMo-V2.5-Pro (Token Plan Europe) optimization for cli-opencode + deep-skill executor integration"
description: "Phase parent: add the Xiaomi Token Plan (Europe) provider + MiMo-V2.5-Pro model to cli-opencode and the shared registry, wire MiMo and MiniMax as selectable executors across the deep skills, and benchmark MiMo's best prompting framework"
trigger_phrases:
  - "126-cli-opencode-mimo-pro-optimization"
  - "phase parent"
  - "mimo"
  - "mimo-v2.5-pro"
  - "xiaomi token plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 4 phases complete + strict-validated; COSTAR benchmark winner integrated"
    next_safe_action: "Packet complete — ready for review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-parent"
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

# Feature Specification: Xiaomi MiMo-V2.5-Pro optimization for cli-opencode + deep-skill executor integration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet in `skilled-agent-orchestration`) |
| **Parent Packet** | `skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization` |
| **Predecessor** | `skilled-agent-orchestration/120-cli-opencode-minimax-optimization` (the MiniMax equivalent this packet mirrors) |
| **Successor** | None |
| **Handoff Criteria** | 001 ships the Xiaomi/MiMo provider wiring; 002 makes MiMo + MiniMax selectable executors in the deep skills; 003 deep-research converges into `research.md` + deltas; 004 benchmarks MiMo's best prompting framework and integrates the winner |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-opencode supports three provider families (`opencode-go` default, `deepseek` direct-API, and MiniMax via the Token Plan `minimax-coding-plan` / Direct API `minimax`). The **Xiaomi Token Plan (Europe)** provider — live on the install as `xiaomi-token-plan-ams`, exposing `mimo-v2.5-pro` and siblings — is **not** a supported provider, is **absent** from the shared small-model registry (`sk-prompt/assets/model-profiles.json`), and has no documented context-budget / prompt-quality patterns. Separately, the deep skills (`deep-review`, `deep-research`, `deep-ai-council`, `deep-improvement`) hard-code `--agent general` on every `cli-opencode` dispatch; on opencode 1.15.13 that flag is treated as a subagent and warns + falls back (gateway models) or is rejected (token-plan providers), so **neither MiMo nor MiniMax can be cleanly dispatched as a deep-loop executor today**.

### Purpose
Make **MiMo-V2.5-Pro** a first-class, efficiently-used model in the cli-opencode dispatch path, make **both MiMo and MiniMax** selectable executors across the deep skills, and determine MiMo's best prompting framework empirically — mirroring the four-phase arc proven for MiniMax in packet 120.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute.

### Live ground truth (opencode 1.15.13, observed 2026-06-01)
- Provider id: **`xiaomi-token-plan-ams`** (credential shows as "Xiaomi Token Plan (Europe)"; api key configured).
- Target model: **`xiaomi-token-plan-ams/mimo-v2.5-pro`** (confirmed responsive via a live one-shot probe).
- Sibling live ids: `mimo-v2.5`, `mimo-v2-pro`, `mimo-v2-omni`, `mimo-v2.5-tts*`, `mimo-v2-tts`.
- Free gateway path: **`opencode/mimo-v2.5-free`** (opencode-go) — usable for cheap benchmark iteration / as a fallback target.
- `--agent general` on this version → warns ("subagent, not a primary agent") and falls back to the default agent for gateway models; omit `--agent` for clean dispatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `xiaomi-token-plan-ams` provider + `mimo-v2.5-pro` model to cli-opencode + the shared registry + the `sk-prompt-small-model` sentinel (phase 001).
- Make MiMo + MiniMax selectable executors across the deep skills by replacing the hard-coded `--agent general` with an optional-agent flag and documenting the model examples (phase 002).
- Deep-research how to best use / maximize efficiency of MiMo-V2.5-Pro via cli-opencode, producing follow-on deltas (phase 003).
- Empirically benchmark MiMo's best prompting framework and integrate the winner into the cli-opencode MiMo dispatch path (phase 004).

### Out of Scope
- Live auth setup for Xiaomi (`opencode auth login` / provider credentials) — already configured on the user's machine; this packet documents config, it does not store keys.
- MiMo TTS / omni / voice models — only the text/coding model `mimo-v2.5-pro` is in scope.
- Rewriting historical `changelog/*.md` files — they record past state and stay intact.
- Adding a brand-new deep-loop `EXECUTOR_KIND` — MiMo/MiniMax reach the deep loops through the existing `cli-opencode` executor (which accepts any `provider/model` string), so no new kind is required.

### Files to Change (aggregate — per-phase detail lives in child plans)

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modify | 001, 003 | Add `mimo-v2.5-pro` registry entry; backfill context budget from 003 |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | 001, 004 | Provider auth/pre-flight/model-selection + MiMo prompt-framework note |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modify | 001 | §4 pre-flight + §5 model rows + §6 agent flag |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modify | 001, 004 | MiMo dispatch template |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modify | 001, 004 | MiMo per-model override |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | 001 | MiMo trigger phrases |
| `.opencode/skills/sk-prompt-small-model/**` | Modify | 001 | Sentinel: SKILL.md/description.json/pattern-index/README/graph-metadata |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | 002 | Optional-agent flag (drop hard-coded `--agent general`) |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modify | 002 | Optional-agent flag |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modify | 002 | Omit `--agent` when general/unset; tests updated |
| `.opencode/commands/deep/start-*-loop.md` | Modify | 002 | Document mimo-v2.5-pro + minimax model examples in PRE-BOUND blocks |
| `003-mimo-efficiency-deep-research/research/**` | Create | 003 | Deep-research state + `research.md` + deltas |
| `004-mimo-prompt-framework-benchmark/**` | Create | 004 | Eval rig + framework variants + `synthesis.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-mimo-provider-integration/ | Wire `xiaomi-token-plan-ams` + `mimo-v2.5-pro` into cli-opencode + small-model registry + sentinel | Complete |
| 2 | 002-deep-skills-executor-integration/ | Make MiMo + MiniMax selectable executors in deep-review/research/ai-council/loop + benchmark; replace hard-coded `--agent general` | Complete |
| 3 | 003-mimo-efficiency-deep-research/ | 10-iter deep-research (cli-codex gpt-5.5 high/fast) on MiMo-V2.5-Pro efficiency via cli-opencode | Complete |
| 4 | 004-mimo-prompt-framework-benchmark/ | Empirical prompt-framework bake-off (real MiMo-V2.5-Pro calls) + integrate winner | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase is claimed complete.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-mimo-provider-integration | 002-deep-skills-executor-integration | `mimo-v2.5-pro` present in `model-profiles.json` (valid JSON) + cli-opencode docs show the provider | `jq` parse + `rg -n mimo` + strict validate on 001 |
| 002-deep-skills-executor-integration | 003-mimo-efficiency-deep-research | Deep loops dispatch `cli-opencode` without `--agent general`; deep-loop + benchmark vitest green | `rg -n "agent general"` returns nothing in dispatch paths + `vitest` pass |
| 003-mimo-efficiency-deep-research | 004-mimo-prompt-framework-benchmark | research.md delta list available to seed the benchmark's framework variants + context budget | research.md present + 003 validated |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- What is MiMo-V2.5-Pro's real context length, reasoning/`--variant` behavior, tool-calling style, and quota-pool semantics? (Phase 003 research seeds; placeholders in the registry until confirmed.)
- Does MiMo prefer the same guardrail-heavy framing (TIDD-EC + dense) as MiniMax, or a different framework? (Phase 004 benchmark settles it empirically.)
- Should the free `opencode/mimo-v2.5-free` path be a registered `fallback_target` for `mimo-v2.5-pro`? (Decided in 001 from the registry's fallback conventions.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Sibling packet**: `../120-cli-opencode-minimax-optimization/` (the MiniMax equivalent this mirrors)
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer
