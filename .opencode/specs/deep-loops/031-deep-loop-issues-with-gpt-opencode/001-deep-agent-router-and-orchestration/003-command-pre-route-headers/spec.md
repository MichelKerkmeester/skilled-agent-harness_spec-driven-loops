---
title: "Feature Specification: Command Pre-Route Headers (4 deep modes)"
description: "Add pre-resolved Resolved route headers across all 4 deep modes (research/review/context/council) at their prompt-template + CLI/inline-dispatch seams, converting runtime role-negotiation into up-front pre-routing. Targets the dominant GPT-slow mechanism."
trigger_phrases:
  - "resolved route header"
  - "deep pre-route"
  - "deep prompt header"
  - "gpt role negotiation"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../../research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/003-command-pre-route-headers"
    last_updated_at: "2026-06-30T15:15:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Phase scaffolded from research decomposition (R4)"
    next_safe_action: "Wait for 002, then /speckit:plan"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-003-init"
      parent_session_id: "031-001-phase-parent"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Command Pre-Route Headers (4 deep modes)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-06-30 |
| **Parent Packet** | `001-deep-agent-router-and-orchestration` (phase parent) |
| **Predecessor** | `../002-agent-dispatch-hardening` |
| **Successor** | `../004-gpt-verification-smoke` |
| **Handoff Criteria** | All 4 deep modes carry pre-resolved route headers; native agent fields preserved; existing prompt bodies intact |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research (§3) found the **dominant GPT-slow mechanism is role-resolution overhead** (F13), not prompt size: native dispatch names the agent but backs it with `subagent_type:"general"`; CLI OpenCode has no agent flag (`opencode run … "$(cat prompt)"`). Pre-resolution exists in YAML native branches but is **not** expressed as a compact route contract in the prompt body (F14). Iteration 5 mapped the exact edit placement per mode (F28-F30): research/review share a template+CLI pattern; context has no standalone template (inline per-seat contract); council has no YAML-level CLI branch (script-owned dispatch via `orchestrate-session.cjs`).

### Purpose

Add a `Resolved route:` header at each mode's prompt/CLI seam so the dispatched agent receives a pre-resolved identity instead of inferring its role mid-loop — reducing GPT role-negotiation cost without stripping the contextual cues Claude uses well.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R4 — `Resolved route:` headers, all 4 modes** (per the iter-5 edit map, `../../research/research.md` §3 table):
  - **research**: template `deep-research/assets/prompt_pack_iteration.md.tmpl:1-5` (insert after line 1) + CLI `deep_research_auto.yaml:916-925` (prepend before `$(cat prompt)`); preserve native `agent: deep-research` `:853-856`.
  - **review**: template `deep-review/assets/prompt_pack_iteration.md.tmpl:1-5` + CLI `deep_review_auto.yaml:895-905`; preserve native `:803-806`.
  - **context**: no standalone template — inline seat prompt `deep_context_auto.yaml:379-386` + CLI one-shot contract `:442-456`; preserve native `:416-420`.
  - **ai-council**: round prompt `deep-ai-council/assets/prompt_pack_round.md:14-29` (insert before `## Role`) + pass route fields through `executor_config_json` (council has executor CLI input `deep_ai-council_auto.yaml:24-26` but dispatch is script-owned via `orchestrate-session.cjs:117-119`, no YAML `if_cli_opencode` branch).

### Out of Scope

- deep.md / orchestrate field — phase 002.
- Route-proof validator fields — phase 001.
- Host-runtime changes — phase 005.

### Findings Covered

F13 (latency root-cause), F14 (pre-resolution exists but not in prompt body), F15 (smallest fix = header at 3 seams), F28-F30 (per-mode edit placement).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-research/assets/prompt_pack_iteration.md.tmpl` | Modify | Insert Resolved route header |
| `deep_review_auto.yaml:916-925` (and review template) | Modify | Mirror for review |
| `deep_context_auto.yaml:379-386,442-456` | Modify | Inline seat + one-shot contracts |
| `deep_ai-council_auto.yaml` + `prompt_pack_round.md` | Modify | Round prompt + executor_config |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 modes carry Resolved route headers | Each mode's dispatched prompt begins with `Resolved route: mode=...; target_agent=@...; execution=...` before the body prose. |
| REQ-002 | Native agent fields preserved | The native `agent: <name>` dispatch fields remain intact; headers are additive. |
| REQ-003 | Council route propagation through script-owned dispatch | Council's route fields reach seat prompts via `executor_config_json` since there is no YAML `if_cli_opencode` branch. |
| REQ-004 | No prompt-body regression | Existing prompt-pack bodies (the cues Claude uses) are unchanged; only the header is added. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each deep mode's leaf receives a pre-resolved route identity.
- **SC-002**: Native dispatch paths unchanged.
- **SC-003**: `validate.sh --strict` passes.
<!-- /ANCHOR:success-criteria -->
