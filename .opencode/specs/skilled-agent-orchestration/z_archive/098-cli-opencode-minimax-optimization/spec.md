---
title: "Feature Specification: MiniMax 2.7 direct-API provider optimization for cli-opencode and sk-prompt-models"
description: "Phase parent for MiniMax 2.7 direct-API provider optimization for cli-opencode and sk-prompt-models"
trigger_phrases:
  - "120-cli-opencode-minimax-optimization"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All 3 phases complete (provider, research, benchmark)"
    next_safe_action: "Close packet, or open a follow-on to apply 002 research deltas"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
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

# Feature Specification: MiniMax 2.7 direct-API provider optimization for cli-opencode and sk-prompt-models

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet in `skilled-agent-orchestration`) |
| **Parent Packet** | `skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization` |
| **Predecessor** | `skilled-agent-orchestration/z_archive/093-small-ai-model-optimization` (small-model infra this work extends) |
| **Successor** | None |
| **Handoff Criteria** | Child 001 ships the MiniMax provider wiring; child 002 deep-research converges and produces `research.md` + a follow-on delta list |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-opencode currently supports two providers (`opencode-go` default, `deepseek` direct-API) and the shared small-model registry (`sk-prompt/assets/model-profiles.json`) covers SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1 (+ two optional stubs). MiniMax 2.7 — reachable via the MiniMax.io direct API — is not a supported provider, is absent from the registry, and has no documented context-budget / output-verification / prompt-quality patterns. We cannot route to it, and we have no guidance for using it efficiently.

### Purpose
Make MiniMax 2.7 a first-class, efficiently-used model in the cli-opencode dispatch path. Phase 001 wires the `minimax` direct-API provider into cli-opencode + the small-model registry + the `sk-prompt-models` sentinel. Phase 002 runs a deep-research loop to determine how to best use and maximize the efficiency of MiniMax 2.7 through that path, producing concrete deltas for `sk-prompt-models` and `cli-opencode`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `minimax` direct-API provider (model `minimax-2.7`) to cli-opencode's supported models (phase 001)
- Register MiniMax 2.7 in the shared small-model registry + surface it via the `sk-prompt-models` sentinel (phase 001)
- Deep-research how to best use / maximize efficiency of MiniMax 2.7 via cli-opencode direct API, producing follow-on deltas (phase 002)

### Out of Scope
- Implementing the phase-002 research findings (a separate follow-on packet acts on `research.md`)
- MiniMax via the `opencode-go` gateway (this packet covers the direct MiniMax.io API path only)
- Live auth setup (`MINIMAX_API_KEY` / `opencode providers login minimax`) — surfaced to the user, run in their own env
- Reusing 114's existing infra (registry schema, context-budget engine, fallback router, permissions matrix) without modification — extended, not rebuilt

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | 001 | Provider auth pre-flight + login template for `minimax` |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modify | 001 | §4 auth pre-flight row + §5 model-selection + `--variant` matrix |
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modify | 001 | Append `minimax-2.7` registry entry (version bump) |
| `.opencode/skills/sk-prompt-models/SKILL.md` + `graph-metadata.json` | Modify | 001 | Sentinel description + MiniMax trigger phrases |
| `002-minimax-efficiency-deep-research/research/**` | Create | 002 | Deep-research loop state + `research.md` + `resource-map.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-minimax-provider-integration/ | Wire `minimax` direct-API provider into cli-opencode + small-model registry + sentinel | Complete |
| 2 | 002-minimax-efficiency-deep-research/ | 10-iter deep-research (cli-codex gpt-5.5 high/fast) on MiniMax 2.7 efficiency via cli-opencode | Complete |
| 3 | 003-minimax-prompt-framework-benchmark/ | Empirical prompt-framework bake-off (real MiniMax M2.7 calls, 113 rig) + integrate winner (TIDD-EC + dense) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-minimax-provider-integration | 002-minimax-efficiency-deep-research | `minimax-2.7` present in `model-profiles.json` (valid JSON) + cli-opencode docs show the provider | `jq` parse + `rg -n minimax` + strict validate on 001 |
| 002-minimax-efficiency-deep-research | 003-minimax-prompt-framework-benchmark | research.md delta list available to seed the benchmark's framework variants | research.md present + 002 validated |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does `opencode providers list` expose `minimax` on the live install? (Cannot verify here; wired as active per user direction — depends on `MINIMAX_API_KEY` in the user's env.)
- What is MiniMax 2.7's real context length, reasoning/`--variant` behavior, and quota-pool semantics? (Phase 002 research seeds; placeholders in the registry until confirmed.)
- Should MiniMax 2.7 declare a `fallback_target` once a secondary path is identified? (Currently null / fail-fast.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
