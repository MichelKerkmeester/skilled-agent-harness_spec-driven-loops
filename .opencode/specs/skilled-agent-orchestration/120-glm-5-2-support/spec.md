---
title: "Feature Specification: glm-5-2-support"
description: "Phase parent for glm-5-2-support"
trigger_phrases:
  - "157-glm-5-2-support"
  - "phase parent"
  - "glm-5.2"
  - "z.ai coding plan"
  - "glm coding plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-glm-5-2-support"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 6 done: GLM-5.2 vision transport proven; capability recorded in 3 surfaces"
    next_safe_action: "Packet complete (phases 1-6)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Opencode-native --file image config for glm-5.2 (would avoid the direct-API deviation)"
    answered_questions:
      - "Provider id zai-coding-plan; slug zai-coding-plan/glm-5.2 (confirmed live phase 1)"
      - "Best framework = COSTAR empirical (benchmark 008); RCAF avoided"
      - "GLM-5.2 is natively multimodal / vision-to-code (newest GLM, 2026-06-16); visual-design dispatch needs image input (pixels), not text transcription — see phase 6"
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

# Feature Specification: glm-5-2-support

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (phases 1-6) |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/120-glm-5-2-support |
| **Predecessor** | skilled-agent-orchestration/z_archive/116-kimi-k2-7-code-support (pattern reference) |
| **Successor** | None |
| **Handoff Criteria** | Phase 1 registration shipped (live slug discovered, card-sync green, smoke dispatch returns); phases 2-3 carry the bakeoff and promotion |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The small-model rotation needs GLM-5.2 (the Zhipu/Z.AI coding-plan model, served through the **Z.AI GLM Coding Plan** provider — shown in opencode's auth list as "Z.AI Coding Plan (api)") available as a first-class small model in the `cli-opencode` and `sk-prompt-models` surfaces. The operator has subscribed to the Z.AI Coding Plan and wants GLM-5.2 dispatchable, alias-resolvable, and advisor-routable by name, with a recorded prompt-craft profile that documents the best framework for the model — exactly the way Kimi K2.7 Code (`kimi-for-coding/k2p7`) was adopted in packet 149.

### Purpose
Make GLM-5.2 a first-class, discoverable small model end to end: registered in the model profiles, dispatch matrix, aliases, and routing graph; backed by a prompt-craft profile (default framework recorded, then made empirical by a bakeoff); and integrated into the cli-opencode auth pre-flight, model-selection, and login surfaces. Delivered across serial phases so registration, measurement, and promotion stay independently verifiable — mirroring the 149-kimi-k2-7-code-support arc.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for adding GLM-5.2 to the small-model rotation
- Registration of `glm-5.2` across cli-opencode and sk-prompt-models (phase 1)
- Empirical prompt-framework bakeoff to pick the best framework for GLM-5.2 (phase 2)
- Promotion of the bakeoff winner into the model profile (phase 3)
- Contingency phases for a discriminating re-run (phase 4) and operational caveats (phase 5)
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level
- Any code/config implementation in this scaffolding pass (planning only)
- Changes to any model outside the GLM rotation
- Provider authentication setup (the operator has subscribed to the Z.AI Coding Plan; phase 1 confirms it is authed, it does not set it up)

### Files to Change
Summary of aggregate file scope across the phases. Per-phase detail lives in child plans. (Nothing is changed by this parent scaffold — the tables below are the planned surface the phases will edit.)

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-prompt-models/**` | Modify/Create | 1, 3 | Model registry entry, references profile, SKILL.md, aliases, `_index.md`, graph metadata |
| `.opencode/skills/cli-opencode/**` | Modify | 1 | Auth pre-flight + login list, model-selection, provider table, graph metadata |
| `002-framework-bakeoff/` artifacts | Create | 2 | Bakeoff harness inputs, judged results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, decisions, continuity) live inside the phase children. This packet is currently **scaffolded only** — no phase has started.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-model-registration/ | Discover the live Z.AI provider id + GLM-5.2 slug, register glm-5.2 across both skills (9-step adoption + cli-opencode edits), author the initial prompt-craft profile, smoke-test, card-sync green | Complete |
| 2 | 002-framework-bakeoff/ | Empirical 5-framework bakeoff on GLM-5.2 (benchmark 008); verdict COSTAR primary, TIDD-EC fallback, avoid RCAF | Complete |
| 3 | 003-promote-results/ | Folded the benchmark-008 verdict into the registry `recommended_frameworks` + the profile (empirical) | Complete |
| 4 | 004-discriminating-bakeoff/ | **Contingency** — strict-validator re-run ONLY IF phase 2 saturates; phase 2 was separable, so **not triggered** | Contingency — not triggered |
| 5 | 005-operational-caveats/ | **Contingency** — documented the benchmark-008 GLM-5.2 dispatch caveats (latency 6–161s, ~1/45 transient failure, cost-0) | Complete |
| 6 | 006-vision-frontend-input/ | GLM-5.2 native vision-to-code capability + the correct image-input transport; root-caused weak visual output (lossy text transcription + opencode #20802 image-attachment drop on custom OpenAI-compatible providers). Transport proven via the direct Z.AI Coding Plan API; capability recorded in glm-5.2.md / model_profiles.json / cli-opencode | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-model-registration | 002-framework-bakeoff | Model registered, live slug confirmed, smoke dispatch returns, card-sync guard green | Card-sync exit 0; smoke `opencode run` returns "pong" |
| 002-framework-bakeoff | 003-promote-results | Bakeoff complete with an LLM-judged / oracle-scored winning framework (or a documented TIE) | Judged results identify one framework with a clear verdict, OR a TIE that triggers phase 4 |
| 003-promote-results | (done) | Registry `recommended_frameworks` promoted to empirical citing the bakeoff; profile updated; card-sync green | `model_profiles.json` glm-5.2 status empirical; card-sync exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- What is the live opencode **provider id** for the Z.AI GLM Coding Plan ("Z.AI Coding Plan (api)" in the auth list)? (Resolve in phase 1 via `opencode providers list`.)
- What is the live **GLM-5.2 model slug** (`<provider>/glm-5.2` or the provider's actual id)? (Resolve in phase 1 via `opencode models <provider>`.)
- What is GLM-5.2's context window / max output, and is billing subscription (cost 0) or pay-per-token? (Resolve in phase 1.)
- Which prompt framework gives GLM-5.2 the best output? (Recorded default-unverified in phase 1; resolved empirically in phase 2.)
- Does a `--variant` / reasoning-effort flag change GLM-5.2 output enough to recommend it by default? (Recorded accepted-unverified in phase 1; effect deferred to phase 2.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Pattern reference**: `../149-kimi-k2-7-code-support/` — the Kimi K2.7 Code adoption this packet mirrors
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Adoption checklist**: `.opencode/skills/sk-prompt-models/references/pattern_index.md` §4 "Adopting a New Provider"
