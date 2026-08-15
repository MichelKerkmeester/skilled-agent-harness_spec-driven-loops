---
title: "Feature Specification: External-CLI Model Roster Additions (Luna Max, DeepSeek Max, GLM 5.3, Gemini 3.7 Flash High)"
description: "Phase parent for the additive, live-verified model-roster expansion program across cli-cursor, cli-devin and cli-opencode: each model group ships as an independently executable phase with its own evidence, tests and doc sweep."
trigger_phrases:
  - "luna max roster"
  - "deepseek max devin"
  - "glm 5.3 opencode-go"
  - "gemini 3.7 flash high cursor devin"
  - "cli roster additions phase parent 043"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-luna-max-deepseek-max-glm-roster"
    last_updated_at: "2026-08-15T00:00:00Z"
    last_updated_by: "pi"
    recent_action: "Phase parent authored; children 001-003 extracted, 004 planned"
    next_safe_action: "Execute phase 004 (Gemini 3.7 Flash High dispatch support)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-phase-parent"
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

# Feature Specification: External-CLI Model Roster Additions (Luna Max, DeepSeek Max, GLM 5.3, Gemini 3.7 Flash High)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Active |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | cli-external-orchestration/043-luna-max-deepseek-max-glm-roster |
| **Predecessor** | cli-external-orchestration/033-deepseek-v4-flash-pi-roster (the roster-addition precedent: list-verified ids, enforced-allowlist doctrine) |
| **Successor** | None (further roster additions arrive as new phases or new packets per the phase map) |
| **Handoff Criteria** | Every phase passes `validate.sh --strict` independently and `validate.sh --recursive --strict` passes on this parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The external-CLI orchestration modes enforce curated model rosters: cli-cursor and cli-devin hard-reject any `--model` id outside `CURSOR_SUPPORTED_MODELS` / `DEVIN_SUPPORTED_MODELS` (mirrored byte-identical in `fanout-run.cjs`), and cli-opencode's catalog documents the opencode-go gateway's curated scope. Live-available models repeatedly arrive that the rosters (or their docs) do not yet carry — GPT-5.6 Luna Max, the DeepSeek V4 max tiers, GLM 5.3 on opencode-go, and now Gemini 3.7 Flash High. Each addition must be live-verified, additive-only, and doc-consistent across the two hand-synced enforcement points and every stale count/family claim, or dispatch either hard-fails wrongly or docs contradict the roster.

### Purpose
Track every model-group addition as an independently executable child phase with its own evidence capture, code change, test update, doc sweep, and verification — so a single addition never blocks another, and each phase's acceptance criteria pin the no-fabrication invariant (every id verbatim in a live CLI listing) and the mirror-sync invariant (allowlist ≡ mirror, asserted by the cross-check tests).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase-per-model-group additions to the enforced external-CLI rosters: cli-cursor and cli-devin allowlists in `executor-config.ts` plus their `fanout-run.cjs` Set mirrors, the vitest fixtures that pin them, and the cli-opencode catalog where the mode has no code-enforced allowlist.
- The per-mode doc honesty sweep each addition triggers: roster rows, count and family-list claims, "out of scope" wording, changelogs, and SKILL.md version bumps, plus the hub `smart-routing.md` roster mentions.
- Live-verification evidence for every added id (list-verified; dispatch-tested where the operator approves the API spend).

### Out of Scope
- Non-model surfaces of the three modes (flags, auth, permission modes, integration patterns) — roster additions only.
- Model tiers not requested per phase (each phase states its exact tier scope).
- `sk-prompt-models` prompt-craft profiles for new models — inherits the closest persona unless a phase explicitly scopes one.
- Detailed per-phase implementation plans — these live in each child's `plan.md`/`tasks.md`.

### Files to Change
Aggregate scope across phases; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | 001, 002, 004 | `CURSOR_SUPPORTED_MODELS` / `DEVIN_SUPPORTED_MODELS` additive, sorted, honest comments |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | 001, 002, 004 | `CURSOR_ALLOWED_MODELS` / `DEVIN_ALLOWED_MODELS` mirrors byte-identical |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/{executor-config,fanout-run,combo-matrix}.vitest.ts` | Modify | 001, 002, 004 | Fixture counts + allowlist fixtures + negatives |
| `.opencode/skills/cli-external-orchestration/cli-cursor/**` | Modify | 001, 004 | Roster rows, counts, changelog, version |
| `.opencode/skills/cli-external-orchestration/cli-devin/**` | Modify | 001, 002, 004 | Roster rows, family lists, changelog, version |
| `.opencode/skills/cli-external-orchestration/cli-opencode/**` | Modify | 003 | opencode-go catalog row, changelog, version |
| `.opencode/skills/cli-external-orchestration/shared/references/smart-routing.md` | Modify | 001, 004 | Devin roster mentions |
| `.opencode/skills/system-deep-loop/changelog/*` + hub `changelog/*` | Create/Modify | 001-004 | Per-addition runtime + hub changelogs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-gpt-5-6-luna-max/ | GPT-5.6 Luna Max dispatchable on cli-cursor (2 ids) and cli-devin (2 uids) — shipped 2026-08-14, list-verified | Complete |
| 2 | 002-deepseek-v4-max/ | DeepSeek V4 max thinking tiers dispatchable on cli-devin (2 uids) — shipped 2026-08-14, list-verified | Complete |
| 3 | 003-glm-5-3-opencode-go/ | GLM 5.3 documented in the opencode-go catalog (docs-only; no code allowlist in cli-opencode) — shipped 2026-08-14, list-verified | Complete |
| 4 | 004-gemini-3-7-flash-high/ | Gemini 3.7 Flash High dispatchable on cli-cursor and cli-devin (1 id + 1 uid), dispatch-tested end-to-end | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-gpt-5-6-luna-max | 002-deepseek-v4-max | Luna Max ids in both allowlists + mirrors + fixtures; cursor doc count claims updated | Deep-loop vitest green; `validate.sh --strict` exit 0 |
| 002-deepseek-v4-max | 003-glm-5-3-opencode-go | DeepSeek max uids in devin allowlist + mirror + fixtures; devin family list updated | Deep-loop vitest green; `validate.sh --strict` exit 0 |
| 003-glm-5-3-opencode-go | 004-gemini-3-7-flash-high | opencode-go catalog carries glm-5.3; no stale family/count claims | `grep` sweep clean; `validate.sh --strict` exit 0 |
| 004-gemini-3-7-flash-high | (parent complete) | Gemini 3.7 Flash High dispatchable on both modes, dispatch-tested; every doc claim honest | Live dispatch receipts + deep-loop vitest + `validate.sh --recursive --strict` exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether a future phase should add the remaining Gemini 3.7 Flash tiers (low/medium/minimal) or other out-of-roster families — not pre-decided; opens as its own phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
