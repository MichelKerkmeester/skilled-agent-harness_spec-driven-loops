---
title: "Feature Specification: Phase 2: agent-registry-and-generated-rosters"
description: "The agent roster is typed by hand in four places and two agents are missing from three of them, so the orchestrator can never route to `design` or `prompt-improver`. This phase adds one registry and generates the rosters from it."
trigger_phrases:
  - "agent registry and generated rosters"
  - "phase 2 agent registry and generated rosters"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: agent-registry-and-generated-rosters

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/377-agent-contract-and-registry-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-fix-agent-contract-contradictions |
| **Successor** | 003-skill-binding-through-routers |
| **Handoff Criteria** | The roster check exits 0 in CI and both missing agents appear in every generated roster |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the agent contract and registry alignment packet.

**Scope Boundary**: The registry file, the script that writes and checks the rosters, the generated blocks in `orchestrate.md` and `README.txt`, and the CI step. No agent's own rules change here.

**Dependencies**:
- Phase 1, because it rewrites the tier wording for `ai-council` that the registry's tier field must match.

**Deliverables**:
- `.skilled/agents/agent-registry.json` with one record per agent
- `.skilled/bin/sync-agent-roster.cjs` with a write mode and a `--check` mode
- Three generated tables in `orchestrate.md` and a generated roster in `README.txt`, each listing all eleven agents
- A CI step that fails when a roster drifts from the registry
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The list of agents is written by hand in `.skilled/agents/README.txt` and three times in `orchestrate.md`: the routing table, the leaf list and the agent files table. The three orchestrator copies list eight agents and leave out `design` and `prompt-improver`, so the orchestrator has no route to either. `design` is also dispatched by no command, which leaves it reachable only when a person names it. Nothing checks these lists against the directory, so the next new agent will drift the same way.

### Purpose
One registry names every agent, its tier, who may dispatch it and which skill it binds to, and every roster is generated from it and checked in CI.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/agents/*.md | wc -l
      11
$ rg -c -e '@design' -e '@prompt-improver' .skilled/agents/orchestrate.md || echo 0
0
$ rg -l --no-config -e '@design\b' -e 'agents/design\.md' .skilled/commands | wc -l
       0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `.skilled/agents/agent-registry.json` holding, per agent, its name, tier, the dispatchers allowed to call it, the skills it binds to and its one-line task type. Editing the tables in place fails today: the same eleven names are typed in four places and the last hand edit left two of them out of three tables
- Add `.skilled/bin/sync-agent-roster.cjs`, which rewrites the marked roster blocks from the registry and, with `--check`, exits 1 when a block or the directory disagrees with the registry
- Mark the three roster tables in `orchestrate.md` and the roster in `README.txt` as generated blocks and regenerate them, which adds `design` and `prompt-improver`
- Run the `--check` mode in the existing `agent-mirror-sync.yml` workflow
- Record a dispatcher for every agent, including `design`

### Out of Scope
- Checking that skill paths cited inside agent bodies exist - phase 3 extends the same check for that
- Making the `/design:*` commands dispatch `@design` - those commands load the design skills directly today, and changing them is a behaviour change with its own owner
- Moving frontmatter permissions into the registry - the crosswalk already translates them and a second source would compete with it

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/agents/agent-registry.json` | Create | One record per agent |
| `.skilled/bin/sync-agent-roster.cjs` | Create | Writes the generated blocks and checks them |
| `.skilled/bin/sync-agent-roster.vitest.ts` | Create | Happy path and one missing-record case |
| `.skilled/agents/orchestrate.md` | Modify | Three roster tables become generated blocks |
| `.skilled/agents/README.txt` | Modify | The roster becomes a generated block |
| `.github/workflows/agent-mirror-sync.yml` | Modify | One step that runs the check |
| Six runtime trees under `.claude`, `.codex`, `.pi`, `.cursor`, `.devin`, `.dsh` | Regenerate | Copies of `orchestrate.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | The registry holds exactly one record for every `.md` file in `.skilled/agents/` and no record without a file. |
| REQ-002 | The routing table, the leaf list and the agent files table in `orchestrate.md` are generated from the registry and each lists `design` and `prompt-improver`. |
| REQ-003 | A hand edit inside a generated block makes the check fail and name the block. |
| REQ-004 | The runtime copies of `orchestrate.md` match the canonical file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-005 | The roster in `.skilled/agents/README.txt` is generated from the registry. |
| REQ-006 | The check runs in CI on every change to `.skilled/agents/`. |
| REQ-007 | Every registry record names at least one dispatcher, and `design` names one. |
| REQ-008 | The registry's tier for each agent agrees with that agent's own file. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 on the final tree.
- **SC-002**: `rg -c '@design' .skilled/agents/orchestrate.md` prints 3 or more, up from no match.
- **SC-003**: Deleting one registry record makes the check exit 1 and name the agent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | The Codex and Pi mirror generators | A generated block marker they do not expect could break a copy | Markers are HTML comments, and the mirror check runs after the first regenerated table before the other two are converted |
| Risk | The registry becomes a second source of truth beside the frontmatter | Med | It holds only what no frontmatter field carries today: tier, dispatchers, bound skills and task type |
| Risk | A generated table drops a note the hand-written row carried, such as the debug opt-in wording | Med | Each current row is diffed against its generated row in `scratch/row-parity.md` before the hand-written table is replaced |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The check finishes in under 2 seconds on this repository, measured with `time` in T012.

### Security
- **NFR-S01**: The script reads and writes only `.skilled/agents/`. It runs no shell command and takes no path from user input.

### Reliability
- **NFR-R01**: Running the write mode twice changes nothing the second time: `git diff --stat` prints nothing after the second run.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: Empty input: a registry with no records makes the check exit 1 with `registry holds no agents`.
- Maximum input: Maximum input: the script handles any number of records, and the vitest suite covers twelve.
- Failure path: Failure path: a registry that is not valid JSON makes both modes exit 2 and print the parse error.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 16/25 | Three new files, three modified files, about 350 lines |
| Risk | 12/25 | A generated block inside the file every orchestrated run reads |
| Research | 6/20 | The two existing generators' handling of comments |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- A cheaper design exists: no registry, only a check that every agent file name appears in each of the four rosters. It fixes the drift but leaves tier and dispatcher typed by hand. Operator answer: build the registry (2026-11-14).
- Should `/design:chart`, `/design:diagram` and `/design:extract` dispatch `@design`? Default: no. The registry records the operator and the orchestrator as its dispatchers and the commands stay as they are.
<!-- /ANCHOR:questions -->

---


