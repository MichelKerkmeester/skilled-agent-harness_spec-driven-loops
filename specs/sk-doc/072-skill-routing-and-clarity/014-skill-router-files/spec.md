---
title: "Feature Specification: Skill Router Files"
description: "Every SKILL.md carries its machine router inline, which takes 22% of all SKILL.md words and leaves three skills within 25 words of the 5,000-word cap. This phase moves each machine router into a sibling ROUTER.md so the skill body keeps its budget for its own rules."
trigger_phrases:
  - "skill router files"
  - "sibling router md"
  - "machine router out of skill md"
  - "phase 14 skill router files"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files"
    last_updated_at: "2026-10-29T08:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Built the router file resolver and moved its readers onto it"
    next_safe_action: "Build 003-check-and-template-canon"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 33
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill Router Files

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/269-skill-router-files` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/072-skill-routing-and-clarity |
| **Predecessor** | 013-mcp-tooling-routing-canon |
| **Successor** | None |
| **Handoff Criteria** | Every skill and mode keeps its machine router in a sibling `ROUTER.md`, the checks enforce it, and routing accuracy holds at its baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every SKILL.md ends with a `## MACHINE ROUTER` section, and that section loads whenever the skill does. Across the 54 skills and modes it is 39,159 of 176,952 words, 22%, with a median of 627 words per skill and 59% of system-skill-advisor. system-spec-kit (4,999 words), sk-design-md-generator (4,997) and mcp-mobbin (4,981) sit against the 5,000-word cap, so they cannot take a new rule. Much of the section is pseudocode that scripts read, such as router replay, compiled routing and the leaf manifest, and the agent does not need it in context on every load.

The two recorded reasons for keeping it inline are tooling limits: router replay reads the router from SKILL.md and falls back only to `references/*.md`, and the router-reach check reads only hub roots. Rule RS-004 then forbids a packet `ROUTER.md`.

### Purpose
Each skill and mode keeps its machine router in a sibling `ROUTER.md`. SKILL.md keeps short Smart Routing prose and a pointer, the tooling reads the new file, and routing accuracy holds.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research the tooling, canon and runtime-loading facts that decide the design, in three deep-research iterations.
- Teach every reader of the machine router to read a sibling `ROUTER.md`.
- Change the routing-shape checks, the canon docs and the create-skill templates to the new shape.
- Fold each hub's MACHINE ROUTER into the `ROUTER.md` it already has.
- Move every mode packet's and standalone skill's machine router into its own `ROUTER.md`.
- Regenerate every derived file and prove routing accuracy against the baseline.

### Out of Scope
- Changing what any skill routes to. The move changes where the router lives, not its decisions.
- The skills' own rule content beyond the router move.

### Files to Change
Set per phase from the research findings; each child's `spec.md` lists its files.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/**/SKILL.md`, `**/ROUTER.md` | Modify/Create | 004, 005 | The router move |
| Router readers and checks | Modify | 002, 003 | Read and enforce the new shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | Three Luna iterations on RQ-1 to RQ-5 and one DeepSeek iteration on RQ-6: every reader of the machine router, how each runtime loads a skill, the advisor changes and the design that keeps accuracy | Complete |
| 2 | 002-router-file-tooling/ | One shared resolver for a sibling `ROUTER.md` with a SKILL.md fallback. Router replay, router sync, the dead-route scan and the Hermes generator use it, and the advisor freshness signature, its plugin copy and the daemon watcher see `ROUTER.md` | Complete |
| 3 | 003-check-and-template-canon/ | RS-004 reversed, RS-005 rewritten to require a pointer, RS-002 restated so a section left in SKILL.md fails, the root-router gate widened, a known-debt ledger; both shape checks, the templates, the create-skill workflows and the canon docs | Pending |
| 4 | 004-hub-router-merge/ | Each hub's MACHINE ROUTER joins its existing root `ROUTER.md` | Pending |
| 5 | 005-packet-and-standalone-migration/ | The 47 mode packets and standalone skills each get their own `ROUTER.md`, in batches, until the debt ledger is empty | Pending |
| 6 | 006-regeneration-and-verification/ | Regenerate every derived file, recapture the advisor baseline, compare replay projections and regenerate the per-skill token table | Pending |
| 7 | 007-ai-systems-research/ | Three DeepSeek research iterations over the 16 skills in the AI Systems repository: what each router holds, what loads them, which checks read them and how a Claude Project receives the router | In Progress |
| 8 | 008-ai-systems-migration/ | Each AI Systems skill gets its own `ROUTER.md` and a link in SKILL.md, and its Claude Project knowledge files follow | Pending |
| 9 | 009-ai-systems-verification/ | The AI Systems checks pass, every router resolves and the Claude Project mirrors match their skills | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-router-file-tooling | The research names every router reader and recommends one design | `research/research.md` lists each reader with a file:line |
| 002-router-file-tooling | 003-check-and-template-canon | Every reader resolves a sibling `ROUTER.md` | The reader tests pass with a fixture in the new shape |
| 003-check-and-template-canon | 004-hub-router-merge | The checks enforce the new shape behind a debt ledger | Both routing-shape suites pass |
| 004-hub-router-merge | 005-packet-and-standalone-migration | Every hub passes the new shape | `parent-skill-check` 12b passes on every hub |
| 005-packet-and-standalone-migration | 006-regeneration-and-verification | Every skill and mode passes the new shape with an empty ledger | `package_skill.py --strict` passes on every skill |
| 003-check-and-template-canon | 007-ai-systems-research | The canon and the scaffold write the new shape, so the second repository has a target to move to | Both routing-shape suites pass. Phases 007 to 009 do not wait on 004 to 006 |
| 007-ai-systems-research | 008-ai-systems-migration | The research names a target shape for each of the 16 skills and the Claude Project path | `research/research.md` answers RQ-1 to RQ-5 |
| 008-ai-systems-migration | 009-ai-systems-verification | Every AI Systems skill has its router in `ROUTER.md` and a link from SKILL.md | Each skill resolves `router-md` through the resolver |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which runtimes load files beside SKILL.md on their own, and does any of them load `ROUTER.md` without being told to? Phase 001 answers it.
- Does the agent need any of the machine router in context, or only the scripts? Phase 001 answers it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
