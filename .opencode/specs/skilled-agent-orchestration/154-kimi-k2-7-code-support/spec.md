---
title: "Feature Specification: kimi-k2-7-code-support"
description: "Phase parent for kimi-k2-7-code-support"
trigger_phrases:
  - "154-kimi-k2-7-code-support"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-kimi-k2-7-code-support"
    last_updated_at: "2026-06-15T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 1 registration shipped; bakeoff and promote phases planned"
    next_safe_action: "Resume 002-framework-bakeoff to run the prompt-framework bakeoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
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

# Feature Specification: kimi-k2-7-code-support

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/154-kimi-k2-7-code-support |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Phase 1 registration shipped (card-sync green); phases 2-3 carry the bakeoff and promotion |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The small-model rotation needs Kimi K2.7 Code (the "Kimi For Coding" coding-plan model, live slug `kimi-for-coding/k2p7`) available as a first-class small model in the cli-opencode and sk-prompt-small-model surfaces. The older Kimi entry ran on a shared gateway and no longer reflects the dedicated coding-plan provider, and no profile yet records which prompt framework gets the best output from the new model.

### Purpose
Make Kimi K2.7 Code a first-class, discoverable small model end to end: registered in the model profiles, dispatch matrix, aliases, and routing graph, then backed by an empirically chosen best prompt framework folded into its profile. Delivered across three serial phases so registration, measurement, and promotion stay independently verifiable.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for adding Kimi K2.7 Code to the small-model rotation
- Registration of `kimi-k2.7-code` across cli-opencode and sk-prompt-small-model (phase 1)
- Empirical prompt-framework bakeoff to pick the best framework (phase 2)
- Promotion of the bakeoff winner into the model profile (phase 3)
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level
- Changes to any model outside the Kimi rotation
- Provider authentication setup (the `kimi-for-coding` provider is already registered and authed)

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-prompt-small-model/**` | Modify/Create | 1, 3 | Model profile, references, SKILL.md, aliases, graph metadata |
| `.opencode/skills/cli-opencode/**` | Modify | 1 | Auth-login list, model selection, graph metadata |
| `002-framework-bakeoff/` artifacts | Create | 2 | Bakeoff harness inputs, judged results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-model-registration/ | Wire kimi-k2.7-code in, retire k2.6, smoke-test, card-sync green | Complete |
| 2 | 002-framework-bakeoff/ | 5-framework bakeoff (run 006); result: correctness-saturated TIE, no winner | Complete |
| 3 | 003-promote-results/ | Fold the bakeoff finding (TIE, RCAF retained) into the registry + profile | Complete |
| 4 | 004-discriminating-bakeoff/ | Strict-validator re-run (run 007); correctness separated, costar promoted, rcaf retired | Complete |
| 5 | 005-filename-underscore-alignment/ | Align sk-prompt-small-model doc/asset filenames to the underscore convention and repair live references (the four model-profile filenames stay dashed by the drift-guard contract) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-model-registration | 002-framework-bakeoff | Model registered, smoke dispatch returns, card-sync guard green | Card-sync exit 0; smoke `opencode run` returns "pong" |
| 002-framework-bakeoff | 003-promote-results | Bakeoff complete with an LLM-judged winning framework | Judged results identify one framework with a clear verdict |
| 003-promote-results | 004-discriminating-bakeoff | Strict-validator bakeoff separates frameworks; registry promoted to empirical | Run 007 status `separable`; `model-profiles.json` kimi-k2.7-code status empirical citing benchmark 007 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which prompt framework gives Kimi K2.7 Code the best output? (Resolved empirically in phase 2.)
- Does `--variant high` change output quality enough to recommend it by default? (Accepted by the CLI; effect is benchmark-unverified until phase 2.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
