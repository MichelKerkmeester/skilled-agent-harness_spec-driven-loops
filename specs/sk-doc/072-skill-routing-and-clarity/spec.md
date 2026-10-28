---
title: "Feature Specification: Skill routing and clarity"
description: "Phase parent for making every skill and hub under .skilled/skills route from one source per decision and read clearly, starting with ten iterations of deep research."
trigger_phrases:
  - "skill routing and clarity phase parent spec"
  - "skill routing restatement cleanup"
  - "skill doc clarity program"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity"
    last_updated_at: "2026-10-28T09:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase 002 complete: baseline recorded and routing-correctness fixes landed"
    next_safe_action: "Run /speckit:plan on 003-routing-canon-and-tooling"
    blockers: []
    key_files:
      - "001-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-orchestrator"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md: these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Skill routing and clarity

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/254-skill-routing-and-clarity` |
| **Parent Spec** | None |
| **Parent Packet** | sk-doc/072-skill-routing-and-clarity |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each phase passes `validate.sh --strict` before the next begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill docs under `.skilled/skills/` are hard to read. In sk-code the same routing decision is written in two to six places that have drifted apart, and routing prose fills 37 to 54 percent of each mode `SKILL.md` before the reader reaches an instruction. The operator wants every skill and hub to state each routing decision once and to read clearly.

### Purpose
Give every skill one source per routing decision, a routing shape that fits its type, and prose a reader can act on after one pass, without breaking the checks, generators and mirrors that read the current shape.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every skill and hub under `.skilled/skills/`, and the command and agent docs that teach routing.
- The canon, templates, checks and generators that pin the routing shape.
- A prose-clarity pass over the skill docs.

### Out of Scope
- Advisor scoring changes beyond removing restated routing vocabulary.
- Operator-local surfaces, which are not tracked here.
- sk-vision and the mcp-magicpath mode, which another session is deprecating.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/` | Create | 001 | Research loop artifacts and synthesis |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `.skilled/skills/sk-code/ROUTER.md`, `.skilled/skills/mcp-tooling/ROUTER.md` | Modify | 002 | Routing correctness fixes |
| `.skilled/skills/sk-doc/sk-create-skill/`, `.skilled/commands/create/` | Modify | 003 | Packet routing canon, sk-create-skill producing it by default, and the creation check that rejects the old shape |
| `.skilled/skills/*/hub-router.json`, `mode-registry.json`, `ROUTER.md` | Modify | 004 | One authored vocabulary per hub |
| `.skilled/skills/<hub>/` and `.skilled/skills/<standalone>/SKILL.md` | Modify | 005 to 009 | Canon routing shape per hub and skill |
| `.skilled/skills/**/SKILL.md`, `.skilled/commands/`, `.skilled/agents/` | Modify | 010 | Prose clarity, also built into sk-create-skill with the human-voice check in its default flow |
| `.hermes/skills/`, leaf manifests, compiled routes, changelogs | Modify | 011 | Regeneration and the full gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Ten iterations of deep research that decided the routing shape per skill type and this plan | Complete |
| 2 | 002-baseline-and-routing-correctness/ | Record a baseline for every routing gate; fix the routing bugs the research found, with no shape change | Complete |
| 3 | 003-routing-canon-and-tooling/ | Packet routing canon in the templates, proven on one packet against parseRouter, verify-router-sync, package_skill and parent-skill-check; sk-create-skill produces it by default and its creation check rejects the old shape | Planned |
| 4 | 004-single-vocabulary-source/ | One authored vocabulary per hub; generate or check every copy against it; re-mint compiled routes | Planned |
| 5 | 005-sk-code-hub/ | sk-code hub and its four packets to the canon shape, review last | Planned |
| 6 | 006-sk-doc-hub/ | sk-doc hub and the five packets that still carry machine blocks | Planned |
| 7 | 007-sk-design-and-deep-loop-hubs/ | sk-design and system-deep-loop hubs and packets | Planned |
| 8 | 008-cli-and-mcp-hubs/ | cli-external-orchestration, cli-classifier and mcp-tooling hubs and packets | Planned |
| 9 | 009-standalone-skills/ | The seven standalone skills: short inline router, machine block last, generated leaf manifest | Planned |
| 10 | 010-prose-clarity-pass/ | Prose clarity over every skill doc and the command and agent docs that teach routing, and in sk-create-skill so new skills start clear | Planned |
| 11 | 011-regeneration-and-verification/ | Regenerate every mirror and generated file; rerun the phase 002 baseline and report the delta | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-baseline-and-routing-correctness | research.md verdict and plan, with citations checked | research/research.md marks each finding Confirmed or Unconfirmed |
| 002-baseline-and-routing-correctness | 003-routing-canon-and-tooling | Baseline recorded; correctness fixes pass every gate | scratch/baseline.md and the rerun delta |
| 003-routing-canon-and-tooling | 004-single-vocabulary-source | Canon proven on one packet | The three gates pass on the proof packet |
| 004-single-vocabulary-source | 005-sk-code-hub | One authored vocabulary per hub, checked | The vocabulary check and compiled-route-guard pass |
| 005-sk-code-hub | 006-sk-doc-hub | sk-code at the canon shape | sk-code gates pass |
| 006-sk-doc-hub | 007-sk-design-and-deep-loop-hubs | sk-doc at the canon shape | sk-doc gates pass |
| 007-sk-design-and-deep-loop-hubs | 008-cli-and-mcp-hubs | Both hubs at the canon shape | Both hubs' gates pass |
| 008-cli-and-mcp-hubs | 009-standalone-skills | Three hubs at the canon shape | The three hubs' gates pass |
| 009-standalone-skills | 010-prose-clarity-pass | Seven standalone skills at the canon shape | package_skill and leaf-manifest checks pass |
| 010-prose-clarity-pass | 011-regeneration-and-verification | Prose pass complete | check-rule-copies, package_skill and verify-doc-claims pass |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. Phase 001 settled the routing shape per skill type: one hub-root `ROUTER.md` for hubs, a short routing section plus a final machine-router appendix for mode packets, and a short inline router for standalone skills. Per-mode `ROUTER.md` and JSON-only are rejected. Detail: `001-deep-research/research/research.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
