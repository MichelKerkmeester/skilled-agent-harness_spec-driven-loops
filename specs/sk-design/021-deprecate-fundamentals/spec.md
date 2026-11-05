---
title: "Feature Specification: Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes"
description: "Give sk-code-frontend the screen value guidance, reduce sk-design to three authoring modes and make every design rule state its own case."
trigger_phrases:
  - "deprecate fundamentals phase parent spec"
  - "sk-design three modes"
  - "sk-code frontend visual values"
  - "chart reference research cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals"
    last_updated_at: "2026-11-05T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the parent purpose, scope and phase map for three complete phases"
    next_safe_action: "None, the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-deprecate-fundamentals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Deprecate sk-design-fundamentals into sk-code-frontend and strip research references from sk-design modes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/316-deprecate-design-fundamentals` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-design/021-deprecate-fundamentals |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All three phases validate under `--strict`, the sk-design hub registers three modes and the four chart files state every rule without a research citation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two design surfaces owned the same rules. The sk-design hub registered a fundamentals mode for value questions while `sk-code-frontend`, the surface that writes web UI, carried no spacing, type, colour, hierarchy or motion values. A padding prompt compiled against sk-design reached the fundamentals mode, and the same prompt on sk-code returned defer. The chart references had a related gap: they cited a research packet for rules a chart author needs in the file itself.

### Purpose
Give `sk-code-frontend` its own visual value, hierarchy and motion guidance, leave sk-design with its three authoring modes and make every design rule state its own case.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the frontend value, hierarchy and motion references with their measured scales (phase 001).
- Place the token asset in `sk-code-frontend/assets` and route screen-design vocabulary to the frontend surface (phase 001).
- Register three sk-design modes and point the design agent's decide path at the frontend references (phase 002).
- Remove the research citations from the chart references and state each rule on its own figures and decisions (phase 003).
- Keep every rule the phased work touches, so no deletion leaves a chart author without guidance.

### Out of Scope
- Slides and print guidance - chart owns a measured type scale and diagram owns a 4px grid, so neither mode needs that guidance.
- The chart, diagram and md-generator authoring contracts - each keeps its own contract.
- The changelog "Spec folder:" lines, the dated benchmark run report and the style-library site descriptions that use the word research - each names its own record and not a rule's source.

### Files to Change
Summary for audit only. Per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md` | Create | 001 | Spacing, type, colour, elevation, radius, opacity and duration values, items V1 to V41 |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md` | Create | 001 | Hierarchy method, diagnosis tables, build procedure and UX laws, items H1 to H36 and up |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md` | Create | 001 | Motion, input, focus, keyboard and feedback rules, items M1 to M57 |
| `.skilled/skills/sk-code/sk-code-frontend/assets/tokens.css` | Move | 001 | Token file placed in the frontend assets |
| `.skilled/skills/sk-design/sk-design-fundamentals/` | Delete | 002 | Fourth mode removed from the hub |
| `.skilled/skills/sk-design/mode-registry.json`, `hub-router.json`, `ROUTER.md` and `SKILL.md` | Modify | 002 | Three modes, no default mode |
| `.skilled/agents/design.md` and the runtime mirrors | Modify | 002 | Decide path points at the sk-code-frontend references |
| `.skilled/skills/sk-design/sk-design-chart/references/color-system.md`, `catalog.md` and `template-contract.md` | Modify | 003 | Research citations removed, every rule stated on its own |
| `.skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/origin.md` | Modify | 003 | Provenance read from the measured source file |
| `.skilled/skills/sk-design/sk-design-chart/SKILL.md` | Modify | 003 | Version 0.23.7.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-frontend-upgrade/ | Three frontend visual references, the token asset and the screen-design routing | Complete |
| 2 | 002-retire-fundamentals/ | A three-mode sk-design hub, the agent decide path and every repointed link | Complete |
| 3 | 003-chart-research-cleanup/ | Four chart documents with every research citation removed and every rule stated on its own | Complete |
| 4 | 004-review-remediation/ | Nine deep-review findings fixed across the sk-code routing vocabulary, the sk-design metadata and two frontend references | Complete |
| 5 | 005-advisor-negation-and-routing/ | A negated write that stays neutral in the advisor, two borderline routes sent to their modes and the republished v4.0.1.0 release | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-frontend-upgrade | 002-retire-fundamentals | Three visual references and the token asset exist in `sk-code-frontend`, and the five baseline value prompts route there | `compiled-route --hub sk-code` returns `sk-code-frontend` for all five prompts |
| 002-retire-fundamentals | 003-chart-research-cleanup | The sk-design hub registers three modes and no live hub file names the deleted folder | `parent-skill-check sk-design` prints OK with 0 warnings and the hub search prints no line |
| 003-chart-research-cleanup | 004-review-remediation | The deep review is complete with nine active findings and each one has a phase 4 requirement | The review report lists nine active findings and phase 4 `spec.md` names REQ-001 to REQ-009 |
| 004-review-remediation | Packet close | Every finding is fixed, the four visual-review phrases return a surfaceBundle and the packet gate passes | `compiled-route --hub sk-code` returns `sk-code-review` and `sk-code-frontend` for the four phrases and `validate.sh specs/sk-design/021-deprecate-fundamentals --strict --recursive` prints RESULT: PASSED |
| 004-review-remediation | 005-advisor-negation-and-routing | The alignment run left one advisor regression and two borderline routes | The negated-write test passes and the v4.0.1.0 release body matches the entry |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator fixed the folder removal, the worktree and the drop of slides and print guidance on 2026-11-05.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
