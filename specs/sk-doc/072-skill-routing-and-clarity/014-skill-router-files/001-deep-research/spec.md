---
title: "Feature Specification: Phase 1: deep-research"
description: "Before any machine router leaves SKILL.md, find every tool and runtime that reads it, what the agent needs in context, and a migration that keeps routing accuracy. Three deep-research iterations on Luna through cli-codex answer five questions."
trigger_phrases:
  - "skill router files research"
  - "phase 1 deep research router files"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: deep-research

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
| **Branch** | `worktrees/269-skill-router-files` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-router-file-tooling |
| **Handoff Criteria** | `research/research.md` names every reader of the machine router with a file:line and recommends one design |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the skill router files phase. Its findings set the scope of phases 002 to 006.

**Scope Boundary**: research only. No skill, script or test changes.

**Dependencies**:
- The `/deep:research` loop and the cli-codex executor on `gpt-6-luna`, max reasoning, fast tier.

**Deliverables**:
- `research/research.md` with answers to RQ-1 to RQ-6, each claim cited or marked unconfirmed.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router takes 22% of all SKILL.md words, and three skills sit within 25 words of the 5,000-word cap. Moving it to a sibling `ROUTER.md` touches router replay, the reach check, compiled routing, the leaf manifest, both routing-shape checks and seven runtimes, and no one has mapped all of them.

### Purpose
Answer the five research questions well enough that phases 002 to 006 can be scoped without guessing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on `main` at `6a9946a800` over the 54 SKILL.md files under `.skilled/skills`:
```text
54 files, machine-router words 39159 of 176952 (22%)
  system-skill-advisor: 2068 of 3481 words (59%)
  mcp-tooling/mcp-obsidian: 1711 of 4633 words (37%)
  system-spec-kit: 1619 of 4999 words (32%)
  median MR words: 627
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- RQ-1: list every script, test, generator and runtime adapter that reads a SKILL.md's MACHINE ROUTER section or its router markers, with file:line, and what each needs to read a sibling `ROUTER.md`.
- RQ-2: find how each of the seven runtimes (Claude Code, OpenCode, Codex, Cursor, Pi, Devin, Hermes) loads a skill, whether any loads files beside SKILL.md on its own, and what the Hermes copy step copies.
- RQ-3: separate what the agent uses from the machine router at run time from what only scripts read, and name the pointer SKILL.md must keep.
- RQ-4: find how a hub's MACHINE ROUTER can join its existing root `ROUTER.md` without breaking the router replay's mode projection.
- RQ-6: find what in `system-skill-advisor` must change when the router leaves SKILL.md: its freshness signature, its SKILL.md discovery and parsing, the skill graph and its embeddings, the leaf inventory and the scorer lanes. Answered by one extra iteration on DeepSeek V4.1 Flash through cli-pi.
- RQ-5: design a migration that holds the routing baseline (advisor accuracy 155/195, 49/66 and 19/24, router replay, compiled-route hashes), with a debt ledger and a measured token saving per skill.

### Out of Scope
- Implementing any of it - phases 002 to 006 do that.
- Changing what any skill routes to - the move changes location, not decisions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/001-deep-research/research/` | Create | The research state, iterations and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Three research iterations run on `gpt-6-luna` through cli-codex and each writes its iteration file |
| REQ-002 | `research/research.md` answers RQ-1 to RQ-6, each claim cited with a file:line or marked unconfirmed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The research recommends one design and names what would change the recommendation |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/lineages/luna/iterations/` holds three iteration files and `research/lineages/deepseek/iterations/` holds one.
- **SC-002**: Every reader named in RQ-1 carries a file:line that resolves on `main`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The cli-codex Luna quota | A spent quota stops the loop | Stop and ask; never route a GPT model elsewhere |
| Risk | A model claim that sounds right but is not | A phase is scoped on a wrong fact | Check each load-bearing claim against the cited line before scoping |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. Research only.

### Security
- **NFR-S01**: The research reads no credential file and writes only under this phase's `research/` folder.

### Reliability
- **NFR-R01**: Each finding names its source, so a later phase can recheck it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a runtime with no documented skill-loading behavior is reported as UNKNOWN, not guessed.
- Maximum input: all 54 SKILL.md files and seven hubs are in range.
- Failure path: an iteration that fails to write its file is rerun once, then reported.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One research folder |
| Risk | 4/25 | No code changes |
| Research | 16/20 | Seven runtimes and every router reader |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The six research questions in section 3 were this phase's open questions; all six are answered in `research/research.md`.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- RQ-1: five script readers parse the router from SKILL.md (router replay, router sync, the dead-route scan, `package_skill.py`, doctor 12b); the leaf-manifest generator and the measurement parser do not.
- RQ-2: no runtime loads a sibling `ROUTER.md` on its own; SKILL.md keeps an explicit pointer, and the Hermes generator copies only SKILL.md, so it must carry the new file.
- RQ-3: the agent needs the decision rule; scripts need the literal assignment grammar, which moves to `ROUTER.md`.
- RQ-4: a hub's moved prose becomes a named section of its existing root `ROUTER.md`, keeping one assignment block as the only replay source.
- RQ-5: freeze the baseline, change the contract and a shared resolver first, move in batches behind a debt ledger; compiled-route hashes change by design.
- RQ-6: the advisor freshness signature, its OpenCode plugin copy and the daemon watcher must include `ROUTER.md`; no scorer lane reads router content.
- Still open: the exact tokenizer for the 88,700-token saving, and the baseline recapture in phase 006.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
