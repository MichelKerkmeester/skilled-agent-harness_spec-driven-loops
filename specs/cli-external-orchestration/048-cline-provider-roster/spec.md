---
title: "Feature Specification: Cline Provider Roster — DeepSeek V4 Flash in cli-opencode, and cli pi parity investigation"
description: "Phase parent: add the Cline provider's DeepSeek V4 Flash to the cli-opencode roster (Phase 1, done), then investigate whether cli pi can reach the same Cline provider its /login does not currently offer (Phase 2, investigation)."
trigger_phrases:
  - "cline provider roster cli-opencode"
  - "cline-pass deepseek v4 flash opencode"
  - "add cline support to cli pi"
  - "cli pi cline login parity"
  - "cline provider phase parent 048"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/048-cline-provider-roster"
    last_updated_at: "2026-08-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 1 roster add shipped; Phase 2 pi investigation scoped"
    next_safe_action: "Run Phase 2 investigation into cline provider support for cli pi"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-048-phase-parent"
      parent_session_id: null
    completion_pct: 50
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
| **Status** | Active |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/048-cline-provider-roster |
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
| `specs/cli-external-orchestration/048-cline-provider-roster/002-cline-support-pi-investigation/**` | Create | 002 | Investigation findings (runtime pi files unchanged until a verdict lands) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, findings, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-cline-deepseek-flash-cli-opencode/ | Add `cline-pass/cline-pass/deepseek-v4-flash` to the cli-opencode roster (providers-and-models.md + SKILL.md + cli-reference.md), mirroring the packet-047 OpenRouter add, with the correct no-`max`-tier reasoning behavior. | Complete |
| 2 | 002-cline-support-pi-investigation/ | Investigate whether cli pi can register/authenticate the Cline provider and expose its models in `/login` + the picker, to reach opencode parity. Read-only until a verdict; runtime pi files unchanged. | Not started |

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
