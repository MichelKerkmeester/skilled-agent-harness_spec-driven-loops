---
title: "Feature Specification: Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-small-model model-craft hub"
description: "Phase parent for Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-small-model model-craft hub"
trigger_phrases:
  - "130-prompt-knowledge-layering"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "opus-orchestrator"
    recent_action: "Spec 130 shipped and verified"
    next_safe_action: "None; spec complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
      - ".opencode/skills/sk-prompt-small-model/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-130-prompt-knowledge-layering"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Where does per-model prompt-craft prose live? -> Architecture A: sk-prompt-small-model/references/models/ (model-knowledge hub)"
      - "Model coverage scope? -> All active small models at equal depth"
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

# Feature Specification: Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-small-model model-craft hub

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/130-prompt-knowledge-layering |
| **Predecessor** | `120-cli-opencode-minimax-optimization`, `126-cli-opencode-mimo-pro-optimization` (benchmark sources) |
| **Successor** | None |
| **Handoff Criteria** | All 8 phases shipped: 3-layer architecture in place, framework-table duplication removed, sync checker green across all 5 CLIs, every active small model carries a prompt-craft profile, sentinel referenced in all 5 CLI SKILL.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Prompt-engineering knowledge across the skills system is duplicated, structurally inconsistent, and poorly connected. The 7-framework table + CLEAR check are copy-pasted across the CLI quality cards even though a canonical card already exists; the card sync-checker is wired to a non-existent path and covers only 3 of 5 CLIs; per-model prompt-craft (MiniMax M3, MiMo V2.5 Pro, SWE-1.6, …) is stranded inside individual CLI skills with no single source of truth for "model → best framework + scaffold + gotchas"; and `sk-prompt-small-model` is referenced by zero CLI SKILL.md files while delegation rules contradict each other (cli-devin mandates sk-prompt; four others escalate to @prompt-improver).

### Purpose
Establish a clean **3-layer prompt-knowledge architecture** — framework craft (`sk-prompt`), per-model craft (`sk-prompt-small-model` as the content hub), and executor mechanics (`cli-*`) — with one home per concept. Remove the duplication, make the CLI cards thin and consistent, give every active small model a proper prompt-craft profile, and wire the delegation so each layer references the next instead of inlining it.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 3-layer architecture + `recommended_frameworks` data contract (phases 001, 003)
- Repair + extension of the prompt-quality-card sync substrate (phase 002)
- `sk-prompt-small-model` matured into the per-model prompt-craft content hub (phase 004)
- Per-model prompt-craft profiles for all active small models: minimax-m3, mimo-v2.5-pro, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1, minimax-2.7 (phases 004–005)
- Thin + consistent CLI quality cards delegating frameworks upward; cli-devin fork reconciled (phase 006)
- Single precedence/delegation rule + cross-links across all 5 CLI skills (phase 007)
- Validation, per-skill changelogs, advisor re-index (phase 008)

### Out of Scope
- Frontier-model prompt-craft (gpt-5.5 / claude / gemini) — remains out of scope for the small-model hub
- Detailed per-phase implementation plans at the parent level (these live in child folders)
- Re-running the MiniMax/MiMo benchmarks — existing evidence (120/003, 126/004) is reused; carried-forward findings are marked as such

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `sk-prompt/assets/model-profiles.json` | Modify | 003 | Add `recommended_frameworks` to 8 active models |
| `sk-prompt/references/model-profiles.md` | Modify | 003 | Rebuild stale prose; document the new field |
| `sk-prompt-small-model/SKILL.md` + `references/models/*.md` | Modify/Create | 004–005 | Router→hub; per-model prompt-craft profiles |
| `cli-*/assets/prompt_quality_card.md` | Modify | 006 | Thin to canonical card; reconcile cli-devin |
| `cli-*/SKILL.md` + `cli-*/assets/prompt_templates.md` | Modify | 007 | Precedence rule + sentinel cross-links + template stubs |
| `system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modify | 002 | Fix path; cover all 5 CLIs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-design-architecture-and-data-contract/ | Ratify Architecture A; define `recommended_frameworks` schema, per-model profile template, precedence rule (L3, decision-record) | Complete |
| 2 | 002-repair-and-extend-sync-substrate/ | Fix broken sync-checker path in all cards; cover all 5 CLIs; hash the CLEAR block (L2) | Complete |
| 3 | 003-land-recommended-frameworks-data/ | Add `recommended_frameworks` to 8 models; rebuild stale `model-profiles.md` prose (L2) | Complete |
| 4 | 004-model-hub-and-priority-profiles/ | Mature sentinel router→hub; author MiniMax M3 + MiMo V2.5 Pro profiles (L3) | Complete |
| 5 | 005-backfill-remaining-profiles/ | Profiles for swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1, minimax-2.7 (L2) | Complete |
| 6 | 006-thin-and-standardize-cli-cards/ | Delegate framework table to sk-prompt; canonical order; reconcile cli-devin fork (L3) | Complete |
| 7 | 007-wire-precedence-and-crosslinks/ | One precedence rule in all 5 SKILL.md; sentinel cross-links; template stubs (L2) | Complete |
| 8 | 008-validate-sweep-changelog-reindex/ | `validate.sh --recursive --strict`; duplication grep; changelogs; advisor re-index (L2) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-design-architecture-and-data-contract | 002 + 003 | decision-record ratifies Architecture A; schema + template + precedence rule agreed | decision-record.md complete; validate.sh --strict |
| 002-repair-and-extend-sync-substrate | 006 | Checker path fixed; opencode + devin in the file set | Checker runs; reports drift for opencode/devin |
| 003-land-recommended-frameworks-data | 004 | `recommended_frameworks` present on 8 models; prose rebuilt | `jq empty`; field count ≥8; prose count == JSON count |
| 004-model-hub-and-priority-profiles | 005 | Sentinel hub live; MiniMax M3 + MiMo profiles authored | `profile_ref`↔`model_id` round-trip resolves |
| 005-backfill-remaining-profiles | 006 | Profiles exist for all active models | profile count == active-model count |
| 006-thin-and-standardize-cli-cards | 007 | Framework table de-duplicated; cli-devin reconciled | grep table count 6→2; sync checker green |
| 007-wire-precedence-and-crosslinks | 008 | Sentinel referenced in all 5 SKILL.md; precedence rule identical | grep sentinel in 5; no dangling links |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **RESOLVED — Prose home:** Architecture A (model-knowledge hub). Per-model prompt-craft prose lives in `sk-prompt-small-model/references/models/<id>.md`; the `recommended_frameworks` DATA stays in `sk-prompt/assets/model-profiles.json`.
- **RESOLVED — Model scope:** All active small models at equal depth (priority: minimax-m3, mimo-v2.5-pro).
- **Open:** How should the `recommended_frameworks` for models WITHOUT direct benchmark evidence (qwen3.6, deepseek-v4-pro, kimi-k2.6, glm-5.1) be marked — `default-unverified` vs `carried`? (To finalize in phase 001/003.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
