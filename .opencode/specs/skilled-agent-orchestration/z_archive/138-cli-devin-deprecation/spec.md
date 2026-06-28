---
title: "Feature Specification: cli-devin Deprecation"
description: "Deprecate the cli-devin skill and remove all references (full Devin removal) across the framework"
trigger_phrases:
  - "cli-devin deprecation"
  - "remove cli-devin"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-cli-devin-deprecation"
    last_updated_at: "2026-06-08T00:00:00Z"
    last_updated_by: "deep-context-host"
    recent_action: "All 6 phases complete and deep-reviewed"
    next_safe_action: "Operator reviews the change-set and commits (nothing committed yet)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: cli-devin Deprecation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 138-cli-devin-deprecation |
| **Predecessor** | 132-cli-gemini-deprecation |
| **Successor** | None |
| **Handoff Criteria** | All child phases ship; zero active cli-devin references remain; skill directory deleted; validators green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `.opencode/skills/cli-devin` skill (and the broader Devin surface — the cli-devin executor plus the Devin IDE-runtime hooks) is being retired. It is wired into runtime executor routing, model-dispatch registries, the skill-advisor graph, agent rosters, governance docs, and CI scripts. Leaving these references after the skill is gone produces dangling dispatch targets, broken CI, and stale routing. A 10-iteration deep-context sweep (see `context/context-report.md`) mapped the full surface: ~45 active-wiring files plus a structural canonical-content dependency (`context-budget.md`) and a cli-devin-exclusive model (`swe-1.6`).

### Purpose
Remove cli-devin completely and safely, in dependency order, so the framework no longer references or dispatches to a non-existent skill — without corrupting the historical audit trail and without leaving any active executor, graph edge, hook, or registry entry pointing at the removed surface.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. The verified, line-resolved touch list and dependency-ordered phase plan live in `context/context-report.md` (+ `.json`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the `cli-devin` executor skill and all active references (skills, commands, YAMLs, agents, AGENTS.md/CLAUDE.md, README, registries).
- Full Devin removal: also remove the Devin IDE-runtime hooks (`.devin/hooks.v1.json`, `hooks/devin/` in skill-advisor + spec-kit + code-graph, the `'devin'` runtime enum).
- Re-home the canonical `context-budget.md` (+ `per-model-budgets.json`) out of cli-devin before deletion.
- Remove the cli-devin-exclusive `swe-1.6` model entirely; drop only the cli-devin executor row from deepseek-v4-pro / kimi-k2.6 / glm-5.1 (they keep cli-opencode).
- Make the `post-implementation-deep-review.md` constitutional rule executor-agnostic.
- Rebuild `skill-graph.sqlite` after graph-metadata edits.
- Per operator decision (D1), also sweep coherently-editable historical references.

### Out of Scope
- Machine-generated benchmark/eval state (`*.jsonl` run logs, `per-probe*.jsonl`, eval outputs) — editing falsifies recorded data.
- Spec packets whose subject IS cli-devin (`z_archive/104-cli-devin-creation`, `z_archive/113-cli-devin-prompt-quality`, `135/004-cli-devin-readme`) — cannot be de-cli-devin'd without making the record false.

### Files to Change
Full verified line-resolved touch list (~45 active files + historical sweep) lives in `context/context-report.md` §2 and `context/context-report.json`. Summary by phase below.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `cli-opencode/references/context-budget.md` (+ canonical re-home) | Modify | 001 | Re-home canonical budget content; patch CI scripts |
| `deep-loop-runtime/lib/deep-loop/executor-*.ts`, `fanout-run.cjs`, `dispatch-model.cjs`, `profile-validator.cjs` | Modify | 002 | Remove cli-devin executor + swe-1.6 |
| skill-graph + advisor (graph-metadata, sqlite, hooks/devin, CI) | Modify | 003 | Registry/graph removal + rebuild + Devin hooks |
| agents (3 runtimes), AGENTS.md, CLAUDE.md, README, cross-skill docs | Modify | 004 | Doc/governance/agent removal |
| `.opencode/specs/**` (coherently-editable historical prose) | Modify | 005 | Historical reference sweep (per D1) |
| `.opencode/skills/cli-devin/**` | Delete | 006 | Remove skill dir + verify zero active refs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-canonical-rehome-and-ci-gate/` | Re-home context-budget canonical + patch CI scripts (must be first) | Complete |
| 2 | `002-runtime-code-and-executor-removal/` | Runtime code executor removal + swe-1.6 removal + deep-loop YAMLs | Complete |
| 3 | `003-registry-graph-and-skill-advisor-removal/` | sk-prompt-models registry + skill-graph + advisor + Devin hooks + graph rebuild | Complete |
| 4 | `004-docs-agents-governance-removal/` | Agents (3 runtimes) + AGENTS/CLAUDE/README + cross-skill + constitutional | Complete |
| 5 | `005-historical-record-reference-sweep/` | Coherently-editable historical prose references (per D1) | Complete |
| 6 | `006-delete-skill-directory-and-verify/` | rm -rf cli-devin/ + final validation (zero active refs) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Canonical content re-homed; CI scripts no longer reference cli-devin paths | `check-prompt-quality-card-sync.sh` passes; grep of CI scripts clean |
| 002 | 003 | Runtime code + swe-1.6 removed; type-check/tests pass | `tsc`/vitest green; no cli-devin in EXECUTOR_KINDS |
| 003 | 004 | Graph edges removed + sqlite rebuilt; Devin hooks removed | skill-graph query shows no cli-devin; advisor rebuild clean |
| 004 | 005 | Agents/governance/cross-skill docs clean | grep of active dirs = 0 |
| 005 | 006 | Coherently-editable historical refs swept | grep with documented exclusions |
| 006 | — | Skill dir deleted; zero active references | `validate.sh --strict` + final grep = 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- D3 re-home target for `context-budget.md` defaults to `sk-prompt-models/references/` unless the operator redirects.
- D6 grader-prompt label neutralization is low-priority/optional (see `context-report.md` §1).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Context Report (the implementation plan)**: `context/context-report.md` (+ `.json`) — verified line-resolved touch list, active/historical ledger, 5-phase dependency order.
- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Predecessor precedent**: `132-cli-gemini-deprecation` (Level 3, shipped).
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
