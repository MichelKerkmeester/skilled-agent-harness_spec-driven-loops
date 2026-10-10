---
title: "Feature Specification: Round-two research recommendations for sk-code"
description: "Five child phases that build the open recommendations from the second Ponytail research round: restraint routing, the review contract, agent disclosure lines, a ceiling-marker report with a Hermes mirror gate, and repo-rule amendments."
trigger_phrases:
  - "round two recommendations"
  - "ponytail round two build"
  - "restraint routing"
  - "review reproducing case"
  - "ceiling marker report"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations"
    last_updated_at: "2026-10-10T10:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, verified and committed all five children"
    next_safe_action: "Operator reviews the worktree branch before it merges"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "round-two-recommendations-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Round-two research recommendations for sk-code

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/092-sk-code-ponytail-refinement` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 007-follow-up-fixes |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass, each child is one commit, and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The second Ponytail research round ranked 29 recommendations (`../001-ponytail-deep-research/research/lineages/r2-dsflash-llmgw/research.md` section 7). A recheck against the tree on 2026-10-10 left 23 to build. Restraint requests ("yagni", "simplify", "over-engineering", "bloat") match no sk-code router vocabulary. A review finding needs no reproducing case, and review never reads the connected code as a step. The code, debug and orchestrate agents lack the reach list and the "Not checked" disclosure their own hub now carries. Nothing reports `ceiling:` markers, the Hermes mirror is checked only in CI, and the repo rules miss accessibility, a decodability floor, an edge-case tiebreak, a full reach set, behavior-preserving moves and a residual-risk line.

### Purpose
Build every recommendation that still holds, one child phase per group, each built by a haiku agent and verified by the orchestrator.

> **Phase-parent note:** This spec.md is the only authored document at this level. Planning, tasks, decisions and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restraint vocabulary in the sk-code router, registry, description and canary corpus, plus a vocabulary-parity check in the doctor
- A reproducing case for every review finding, a connected-code read step, findings numbered across severity groups, a stated report order and a fixture-backed checker for the case field
- The reach list and a "Not checked" line in `@code`, three disclosure and reading gaps in `@debug`, and a reach field in `@orchestrate`
- A report that lists `ceiling:` markers and tags those with no trigger or no measurable signal, and the Hermes mirror checks in the pre-commit mirror gate
- Accessibility, a decodability floor, an equal-cost edge-case tiebreak, the full reach set, behavior-preserving moves and a residual-risk close-out line in the repo rule files

### Out of Scope
- `AGENTS.md` and `REPO RULES.md`: the operator chose to keep the universal template unchanged and land both root-level recommendations in the rule files
- Rows 8 and 26 (three agent copies with no equality check): `.opencode/agents` and `.hermes/agents` are symlinks to `.skilled/agents`, so there is one copy
- Row 28 (citation lint for agent and rule docs): those docs hold one `path:line` reference and no `[SOURCE:]` tag outside two examples, so the lint would check nothing
- Rows 14, 24 and 25: already done by the review mode's workload note and phases 004 and 006
- The twelve transfers the research rejected, and the sk-code advisor-accuracy work owned by its own packet

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/hub-router.json`, `mode-registry.json`, `description.json`, `ROUTER.md` | Modify | 001 | Restraint vocabulary for the quality mode |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | 001 | Restraint canary case |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and its tests | Modify | 001 | Vocabulary-parity check |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `scripts/` | Modify, Create | 002 | Case field, connected-code step, numbering, case checker and fixtures |
| `.skilled/agents/review.md` and its runtime mirrors | Modify | 002 | Evidence table, read budget, report order |
| `.skilled/agents/code.md`, `debug.md`, `orchestrate.md` and their runtime mirrors | Modify | 003 | Reach list, disclosure lines, harness read, reach field |
| `.skilled/skills/sk-code/sk-code-quality/scripts/` | Create, Modify | 004 | Ceiling-marker report and its test |
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/hooks/git/pre-commit` | Modify | 004 | Hermes checks in the mirror gate |
| `.skilled/repo-rules/prevent-overengineering.md`, `evidence-and-proof.md` | Modify | 005 | Rule amendments |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-restraint-routing/ | Restraint requests reach the quality mode, with a canary case and a parity check | Complete |
| 2 | 002-review-contract/ | Reproducing case, connected-code read, numbering, report order, case checker | Complete |
| 3 | 003-agent-disclosure/ | Reach list and disclosure lines in the code, debug and orchestrate agents | Complete |
| 4 | 004-debt-report-and-hermes-gate/ | Ceiling-marker report and Hermes checks in the pre-commit mirror gate | Complete |
| 5 | 005-rule-amendments/ | Six amendments to two repo rule files | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before it is committed
- The children touch disjoint files, so they may be planned and built in parallel; commits land in folder order
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-restraint-routing | 002-review-contract | 001 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 002-review-contract | 003-agent-disclosure | 002 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 003-agent-disclosure | 004-debt-report-and-hermes-gate | 003 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
| 004-debt-report-and-hermes-gate | 005-rule-amendments | 004 goal criteria pass and it is committed | Orchestrator rerun, `validate.sh --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator chose the placement, the haiku builders and rule files over `AGENTS.md` on 2026-10-10.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Research**: `../001-ponytail-deep-research/research/lineages/r2-dsflash-llmgw/research.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
