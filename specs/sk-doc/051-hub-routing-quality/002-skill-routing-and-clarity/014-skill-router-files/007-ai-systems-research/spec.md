---
title: "Feature Specification: Phase 7: ai-systems-research"
description: "The 16 skills in the AI Systems repository keep their routing inline in SKILL.md, and they also reach Claude Projects through a hand-written sync. Research finds what each router holds, what loads these skills and which checks read them, so the move to a sibling ROUTER.md can be planned without guessing."
trigger_phrases:
  - "ai systems research"
  - "ai systems router files research"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: ai-systems-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `main` in this repository. The research reads `/Users/michelkerkmeester/MEGA/Development/AI Systems` and writes nothing there |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 003-check-and-template-canon |
| **Successor** | 008-ai-systems-migration |
| **Handoff Criteria** | `research/research.md` answers RQ-1 to RQ-5 for all 16 skills and recommends one design per skill shape |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the skill router files phase. It extends the move to a second repository, `Barter-BV/marketing-ai-systems`, checked out at `/Users/michelkerkmeester/MEGA/Development/AI Systems`. It depends on the canon phase 003 sets, and it does not wait on phases 004 to 006.

**Scope Boundary**: research only. Nothing in the AI Systems repository changes in this phase.

**Dependencies**:
- The canon from phase 003: a sibling `ROUTER.md` holding the machine router under a final `## MACHINE ROUTER` heading, and a link from SKILL.md.
- The `/deep:research` loop through cli-pi on DeepSeek V4.1 Flash.

**Deliverables**:
- `research/research.md` with answers to RQ-1 to RQ-5, each claim cited or marked unconfirmed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 16 AI Systems skills carry their routing inside the SMART ROUTING section of SKILL.md as pseudocode, resource lists and a few assignment blocks, and none has a `## MACHINE ROUTER` section. Four already have a `ROUTER.md`, but only the Product Owner hub's holds a machine-readable block. These skills also reach Claude Projects through hand-written knowledge files, and no one has checked whether a sibling file survives that path.

### Purpose
Answer the five research questions well enough that phases 008 and 009 can move each router without breaking a runtime or a Claude Project.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run in `/Users/michelkerkmeester/MEGA/Development/AI Systems` at `8e4573b8f`. Four further SKILL.md files sit inside `node_modules` (dotenv package copies) and are not skills of this repository.
```text
$ find "AI Systems" -name SKILL.md -not -path "*/specs/*" -not -path "*/runtime/*" -not -path "*/scratch/*" -not -path "*/node_modules/*" | wc -l
16
$ find "AI Systems" -name ROUTER.md -not -path "*/specs/*" -not -path "*/runtime/*" -not -path "*/scratch/*" | wc -l
4
$ grep -l "^## .*MACHINE ROUTER" <the 16 SKILL.md files> | wc -l
0
$ grep -l "^## .*SMART ROUTING" <the 16 SKILL.md files> | wc -l
16
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- RQ-1: for each of the 16 skills, separate what its routing section holds into agent-facing prose and machine data (assignment blocks, pseudocode, resource lists), with the word count of each part.
- RQ-2: find what loads these skills (OpenCode through `opencode.json`, Claude Code through `.claude/`, Claude Projects through the sync loop, and any other runtime), and whether each one loads a file beside SKILL.md on its own.
- RQ-3: list every check, benchmark gate and script in the AI Systems repository that reads a SKILL.md routing section or a `ROUTER.md`, with file:line, and say which of this repository's tools (`package_skill.py`, the router resolver) apply there.
- RQ-4: classify the four existing `ROUTER.md` files against the new canon and say what each needs.
- RQ-5: design the per-skill migration: the target shape for each skill, what changes in its Claude Project knowledge files, the token saving per skill, and the order that avoids colliding with other sessions working in that repository.

### Out of Scope
- Changing any file in the AI Systems repository: phase 008 does that.
- Changing what any skill routes to: the move changes location, not decisions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/007-ai-systems-research/research/` | Create | The research state, iterations and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Three research iterations run on DeepSeek V4.1 Flash through cli-pi, and each writes its iteration file |
| REQ-002 | `research/research.md` answers RQ-1 to RQ-5 for all 16 skills, each claim cited with a file:line or marked unconfirmed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The research says how a Claude Project receives a skill's router once it leaves SKILL.md, and recommends one way |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/lineages/deepseek/iterations/` holds three iteration files.
- **SC-002**: The research names a target shape for each of the 16 skills.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The LLM Gateway route for DeepSeek | A failed route stops the loop | Fall back to Luna through cli-codex, per the operator's executor rule |
| Risk | Another session is working in the AI Systems repository (a Moneybird session is open) | A migration could collide with its edits | RQ-5 checks each skill's uncommitted state, and the research itself writes nothing there |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. Research runs no service.

### Security
- **NFR-S01**: The research reads no credential file in either repository, `.env` files included, and writes only under this phase's `research/` folder.

### Reliability
- **NFR-R01**: Each finding names its source, so phase 008 can recheck it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill whose routing section holds prose only is recorded as having no machine data, not guessed at.
- Maximum input: all 16 skills and the four existing `ROUTER.md` files are in range. Research corpora and backups under `specs/` are not.
- Failure path: an iteration that fails to write its file is rerun once, then reported.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One research folder |
| Risk | 4/25 | No code changes |
| Research | 15/20 | 16 skills, several runtimes and a hand-written Claude Project sync |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The five research questions in section 3 were this phase's open questions; all five are answered in `research/research.md`.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- RQ-1: 13,130 of the 17,935 routing words across the 16 skills are machine data (73.2 percent, about 17,460 tokens); three Moneybird packets already keep theirs in a sibling `ROUTER.md`.
- RQ-2: no loader reads a file beside `SKILL.md` on its own, so the pointer link is the load path; Claude Projects are written by hand since the sync compiler was retired.
- RQ-3: the Product Owner `check_hub.py` forbids a packet `ROUTER.md`, and two `differential.py` gates slice the routing prose out of `SKILL.md` by heading; both must change before the first move.
- RQ-4: none of the four existing `ROUTER.md` files ends with `## MACHINE ROUTER`; the Moneybird generator must emit the new heading before any hand edit.
- RQ-5: move in eight steps, Media Editor first and Product Owner last, with one `<System> - System - Routing.md` knowledge document per Claude Project.
- Still open: the kernel words that survive the interlock test, and whether the Moneybird hub gains a router of its own.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
