---
title: "Feature Specification: Deep research of the Skilled v4 release line v4.0.0.0 to v4.0.2.0: drift, bugs, alignment, over-engineering and extension opportunities"
description: "Fifty-plus iterations of DeepSeek-driven deep research over the v4.0.0.0 to v4.0.2.0 release line, split into five scope clusters, ending in one ranked synthesis."
trigger_phrases:
  - "v4 release line research phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research"
    last_updated_at: "2026-11-08T00:00:00Z"
    last_updated_by: "claude-opus-lead"
    recent_action: "Scaffolded five research children; orchestrators briefed"
    next_safe_action: "Run each child research loop to its iteration ceiling, then synthesize"
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

# Feature Specification: Deep research of the Skilled v4 release line v4.0.0.0 to v4.0.2.0: drift, bugs, alignment, over-engineering and extension opportunities

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/047-v4-release-line-research |
| **Predecessor** | None |
| **Successor** | Remediation packets proposed by the synthesis |
| **Handoff Criteria** | Every child clears the depth bar and `research/research.md` holds verified, ranked findings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nineteen releases shipped between v4.0.0.0 (2026-09-21) and v4.0.2.0 (2026-11-08): 3,687 commits across spec kit, the authoring hubs, the CLI executors, the deep loops, the skill advisor, hooks, doctor commands and git tooling. Release notes, code and docs moved at that pace without one pass that checks them against each other, so drift, latent bugs, standard misalignment and over-built surfaces are likely and unmeasured.

### Purpose
Run forced-depth deep research (no early convergence) per scope cluster, each finding backed by `file:line` evidence and the release that introduced it, then synthesize one ranked report with an over-engineering cut list, extension ideas and proposed remediation phases. This packet only researches; it changes nothing outside itself.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every surface a v4 release touched, read against its release note in `.skilled/changelog/skilled/v4.0.*.md` and the tag diffs
- Seven finding types: drift, standard misalignment (sk-code, sk-doc, Skilled canon), bugs, improvement, UX, over-engineering, logic extension
- One synthesis at `research/research.md` in this parent

### Out of Scope
- Any fix, edit or commit outside this packet
- Releases before v4.0.0.0 and commits after the v4.0.2.0 tag, except as context

### Files to Change
Every write stays inside this packet.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/system-speckit/047-v4-release-line-research/**` | Create | all | Research state, iterations and synthesis; nothing else is written |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-spec-kit-core/ | system-spec-kit: gates, validate, trigger index, continuity, goal, upgrade | Complete |
| 2 | 002-authoring-hubs/ | sk-doc, sk-code, sk-design, sk-prompt | Complete |
| 3 | 003-cli-and-deep-loop/ | cli-external-orchestration, cli-classifier, DeepSeek harness, system-deep-loop runtime | Complete |
| 4 | 004-advisor-hooks-relaunch/ | system-skill-advisor, compiled routing, hooks and plugins, session relaunch, compaction history | Complete |
| 5 | 005-doctor-git-ci-runtime/ | doctor commands, Skilled-in-your-project, overlays, sk-git, CI, agents, commands, runtime mirrors, repo-rules | Complete |

### Phase Transition Rules

- The five phases run in parallel; each must pass `validate.sh` independently before synthesis
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-spec-kit-core | 002-authoring-hubs | None: phases run in parallel | Each child validates on its own |
| 002-authoring-hubs | 003-cli-and-deep-loop | None: phases run in parallel | Each child validates on its own |
| 003-cli-and-deep-loop | 004-advisor-hooks-relaunch | None: phases run in parallel | Each child validates on its own |
| 004-advisor-hooks-relaunch | 005-doctor-git-ci-runtime | None: phases run in parallel | Each child validates on its own |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Run decision: `/deep:research` fan-out lineages share one topic, so per-cluster focus uses five child phases, each its own single-executor `/deep:research:auto` run (goal fallback clause).
- Run decision: decisions are recorded in each child's `decision-record.md`; the phase-parent template forbids one at parent level.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
