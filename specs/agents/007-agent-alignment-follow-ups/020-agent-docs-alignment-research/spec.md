---
title: "Feature Specification: Phase 20: agent-docs-alignment-research"
description: "Phases 1 to 19 changed the eleven agents and their runtime copies, but the READMEs and docs that describe them were only checked where a phase touched them. This phase runs five deep-research iterations to find every doc across the repo that still describes an agent wrongly."
trigger_phrases:
  - "agent docs alignment research"
  - "phase 20 agent docs alignment research"
  - "agent readme drift research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: agent-docs-alignment-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-vibe-agent-sync-check |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` lists each doc that misdescribes an agent, with `[SOURCE: path:line]` evidence, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the agent alignment follow-ups. It is research only and changes no agent or doc.

**Scope Boundary**: Read-only research over the docs that describe the agents. Fixes go to a later phase.

**Dependencies**:
- Phases 1 to 19 on origin/main

**Deliverables**:
- `research/research.md` with the misdescriptions found, ranked by how much they would mislead a reader
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The eleven agents in `.skilled/agents/` and their copies in nine runtime folders changed across phases 1 to 19. Each phase fixed the docs it touched, but no pass has read every README and reference that names an agent. One gap is already visible: `.skilled/agents/README.txt` says the canonical files generate only the `.codex` and `.pi` trees, while `.dsh` and `.vibe` are generated too.

### Purpose
Every doc that tells a reader what an agent does, where its copies live or how they sync matches the current files.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls -d .*/agents
.claude/agents .codex/agents .cursor/agents .devin/agents .dsh/agents .opencode/agents .pi/agents .skilled/agents .vibe/agents
$ sed -n 5,6p .skilled/agents/README.txt
Each .md file carries frontmatter (mode, temperature, permission) and behavioral instructions,
and is the canonical source the .codex and .pi trees are generated from.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five `/deep:research` iterations over READMEs, `AGENTS.md`, `CROSS-CLI.md`, runtime sync docs, skill and command docs, feature catalogs and playbooks that name an agent.
- Two Mistral Vibe lineages on DeepSeek V4.1 Flash max (`deepseek-flash`), with three and two iterations (operator answer 2026-11-15: "2 lineages, 3 + 2 iters").

### Out of Scope
- Fixing any doc or agent. Each fix becomes its own later phase.
- Changelogs and archived packets, which record history.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create | The research loop's state, iterations and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `research/research.md` exists and each finding cites the doc line and the agent file it contradicts. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Each finding the conductor spot-checks is confirmed or marked refuted in `research.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five iterations run across the two lineages and the loop writes `research/research.md`.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A lineage reports a drift that is not there | Medium | The conductor checks a sample of findings against the files before reporting |
| Dependency | `vibe` 3.1.2 and `MISTRAL_API_KEY` | High | Both confirmed before the run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the executor, model and run shape on 2026-11-15.
<!-- /ANCHOR:questions -->

---
