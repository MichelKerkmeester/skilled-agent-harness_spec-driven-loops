---
title: "Feature Specification: Give the moved modes and their commands the hub's own name"
description: "Chart and diagram live under `sk-design` but still carry `sk-create-` in their mode names and `/create:` in their commands, which names the hub they left. Phase 004 decided the rename was cost without benefit; the operator has since decided the legib"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Give the moved modes and their commands the hub's own name

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`sk-create-chart` becomes `sk-design-chart` and `sk-create-diagram` becomes
`sk-design-diagram`, both as renames so 249 files keep their history. Their commands move from
`/create:chart` and `/create:diagram` to `/design:chart` and `/design:diagram`, a hard cut with no
forwarders, and both bind to the design agent rather than the markdown agent that still advertises
itself as the handler of every `/create:*` command.

**Key Decisions**: hard cut rather than aliases, because a forwarder doubles the surface every runtime mirror carries; rename as `git mv` so history survives

**Critical Dependencies**: the closing phase's measured baseline, so the rename lands on a fleet that is known-good rather than merely believed-good

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | `005-closure-and-routing-proof` |
| **Successor** | `007-close-inherited-failures` |
| **Handoff Criteria** | Both modes and both commands carry the hub's name, every live reference resolves, the compiled-routing guard is green, and the replay holds |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the design command surface and inherited failure closure specification.

**Scope Boundary**: The two mode directories, their commands and assets, both hubs' routing metadata, the design and
markdown agent definitions, and the runtime mirrors that regenerate from them. Historical records
under `specs/` keep the old names; only live references follow.

**Dependencies**:
- `005-closure-and-routing-proof`: the baseline this rename is measured against
- The design agent, which must claim the two commands the markdown agent currently advertises
- The compiled-routing guard, which runs on push and refuses a hub whose inputs do not compile

**Deliverables**:
- `sk-design-chart/` and `sk-design-diagram/`, 249 files moved as renames
- `/design:chart` and `/design:diagram` with their presentation and workflow assets
- `/create:chart` and `/create:diagram` removed, along with their assets
- The design agent claiming both commands; the markdown agent no longer claiming either
- A sixteen-phrase replay showing no phrase below its baseline after the rename

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Chart and diagram live under `sk-design` but still carry `sk-create-` in their mode names and
`/create:` in their commands, which names the hub they left. Phase 004 decided the rename was cost
without benefit; the operator has since decided the legibility is worth the cost. The mismatch is not
only cosmetic: the closing phase found a compiled bundle rule pairing a `sk-doc` mode with
`sk-create-diagram` that blocked every push, and four playbook fixtures still asserting `sk-doc` owns
FLOWCHART, both of which existed because the old name kept the old association alive.

### Purpose
Every name a reader or a router sees for chart and diagram says `sk-design`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renaming both mode directories and every live reference to them
- Moving both commands to the `/design:` surface and deleting the `/create:` entry points
- Rebinding both commands from the markdown agent to the design agent
- Regenerating every runtime mirror, leaf manifest and compiled-routing manifest that names them

### Out of Scope
- Historical records under `specs/` - they describe what the tree was called when they were written,
  and rewriting them falsifies the record
- The `sk-design-fundamentals` and `sk-design-md-generator` mode names - already hub-named
- Anything in `sk-doc` beyond removing the last references to the two departing modes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-create-chart/` | Rename | Becomes `sk-design-chart/`, 59 tracked files |
| `.opencode/skills/sk-design/sk-create-diagram/` | Rename | Becomes `sk-design-diagram/`, 190 tracked files |
| `.opencode/commands/create/chart.md`, `diagram.md` | Delete | Replaced by the `/design:` entry points |
| `.opencode/commands/create/assets/create-chart-*`, `create-diagram-*` | Rename | Move to `.opencode/commands/design/assets/` |
| `.opencode/commands/design/chart.md`, `diagram.md` | Create | The new entry points |
| `.opencode/skills/sk-design/mode-registry.json`, `hub-router.json`, `command-metadata.json`, `ROUTER.md`, `SKILL.md` | Modify | Mode and command names |
| `.opencode/skills/sk-design/graph-metadata.json`, `description.json` | Modify | Vocabulary and prose |
| `.opencode/agents/design.md` and its runtime mirrors | Modify | Claim both commands |
| `.opencode/agents/markdown.md` and its runtime mirrors | Modify | Stop claiming them |
| `.opencode/bin/lib/compiled-routing/**` and its authored source | Modify | Mode names in the compiled inputs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both mode directories are renamed and git records the move as renames, not delete-plus-add. |
| REQ-002 | `/design:chart` and `/design:diagram` exist and resolve; `/create:chart` and `/create:diagram` no longer exist. |
| REQ-003 | Both commands bind to the design agent. The markdown agent no longer advertises either. |
| REQ-004 | The compiled-routing guard reports every hub fresh, so the branch can be pushed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The sixteen-phrase replay shows no phrase below its baseline, measured after an explicit daemon rebuild. |
| REQ-006 | No live file resolves to `sk-create-chart` or `sk-create-diagram`; historical records under `specs/` still carry them, on purpose. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git diff --cached --name-status -M` shows all 249 moved files as renames.
- **SC-002**: The chart corpus checker prints `RESULT: PASSED` from `.opencode/skills/sk-design/sk-design-chart`.
- **SC-003**: The compiled-routing guard reports all hubs fresh.
- **SC-004**: Chart and diagram phrases still name `sk-design`, at or above their closing-phase scores.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled-routing guard | A hub whose inputs do not compile blocks every push | Fix the inputs, refresh the manifest, resync the authored copy in the same change |
| Dependency | The four runtime command mirrors | Hand-edited mirrors drift from their generators | Regenerate with their own scripts, never by hand |
| Risk | A rename leaves a live reference behind and something fails silently | High | Sweep every live reference, then re-run every gate and read its output |
| Risk | The rename records as delete-plus-add and 249 files lose their history | Medium | Verify `R` status before committing, not after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target. The measured quantity is advisor confidence per phrase.

### Security
- **NFR-S01**: No credential, dependency or network call is added.

### Reliability
- **NFR-R01**: The old command names stop working deliberately, so a caller gets a clean absence rather than a silent misroute.

---

## 8. EDGE CASES

### Data Boundaries
- A phrase that named the old command: reported as reaching nobody, never silently rerouted.
- A reference under `specs/`: left as written, because it records what the tree was called then.

### Error Scenarios
- A gate that prints nothing: treated as failed. A validator with no output has not run.
- The compiled-routing guard refusing the push: fix the inputs rather than override the gate.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 249 renamed, ~45 live references, 2 hubs, 4 runtime mirrors |
| Risk | 18/25 | Auth: N, API: N, Breaking: yes, both command names change with no forwarder |
| Research | 4/20 | The blast radius is measured, not investigated |
| Multi-Agent | 3/15 | Single workstream; the rename must be atomic |
| Coordination | 13/15 | Both hubs, the agents, the compiled routing and the command mirrors move together |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A live reference survives the rename and fails silently | M | H | Sweep, then re-run every gate and read its output |
| R-002 | The compiled-routing inputs stop compiling again | M | H | Run the guard before pushing, not at push time |
| R-003 | A hand-edited runtime mirror drifts from its generator | M | M | Regenerate every mirror with its own script |

---

## 11. USER STORIES

### US-001: A reader sees one hub name everywhere chart and diagram appear (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A caller reaching for the old command gets a clean absence rather than a silent misroute (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether any external consumer outside this repository invokes `/create:chart` or `/create:diagram`.
  A hard cut assumes not; if one exists, it gets a clean absence rather than a forwarder.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
