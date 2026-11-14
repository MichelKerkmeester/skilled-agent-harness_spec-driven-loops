---
title: "Feature Specification: Phase 3: skill-binding-through-routers"
description: "Agents reach skills in three different ways, and three of them hard-code paths to files inside a skill, so a renamed file breaks the agent with nothing to catch it. This phase binds agents through each skill's entry point and adds a path check."
trigger_phrases:
  - "skill binding through routers"
  - "phase 3 skill binding through routers"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: skill-binding-through-routers

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/377-agent-contract-and-registry-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-agent-registry-and-generated-rosters |
| **Successor** | 004-agent-template-conformance-and-drift-check |
| **Handoff Criteria** | No agent cites a file inside a skill that the skill's router can select, and the path check exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the agent contract and registry alignment packet.

**Scope Boundary**: How an agent file names and loads a skill, and one check on the paths it cites. The skills themselves, their routers and their files do not change.

**Dependencies**:
- Phase 2, because the path check extends `sync-agent-roster.cjs` and reads the bound skills from the registry.

**Deliverables**:
- `design.md`, `markdown.md` and `deep-review.md` loading their skills through the skill entry point
- `debug.md`, `context.md` and `prompt-improver.md` stating when each named skill loads and which file is its entry point
- A path check that fails when an agent cites a skill path that does not exist
- A parity table showing each removed path is still reachable through the router
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`code` and `review` load `sk-code/SKILL.md` and take whatever route it returns, which survives a reorganised skill. `design`, `markdown` and `deep-review` cite files inside a skill directly, and `debug`, `context` and `prompt-improver` list skills in a table without saying when or how to load them. No agent uses the routing command the skill hubs prescribe, and no check confirms that a cited skill path exists, so a renamed reference fails only when an agent tries to read it.

### Purpose
Every agent reaches a skill through that skill's entry point and router, and CI fails when an agent cites a skill path that is not on disk.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -l 'compiled-route' .skilled/agents | wc -l
       0
$ rg -o 'sk-code/sk-code-frontend/[a-z/.-]+' .skilled/agents/design.md | sort -u | wc -l
       4
$ rg -o '\.skilled/skills/sk-doc/sk-create-[a-z-]+/[A-Za-z0-9_./-]+' .skilled/agents/markdown.md | sort -u | wc -l
      17
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change `design.md` to load the frontend visual references through the `sk-code` entry point and its route, citing no file inside `sk-code-frontend`
- Change `markdown.md` to point each `/create:*` command at its `sk-doc` mode packet's `SKILL.md`, citing no template file under a packet's `assets/`
- Change `deep-review.md` to load the review doctrine through the `sk-code` review mode's `SKILL.md`
- Give each skill row in `debug.md`, `context.md` and `prompt-improver.md` a load condition and an entry file
- Extend the `--check` mode of `sync-agent-roster.cjs` to fail when an agent cites a `.skilled/skills/` path that does not exist. Extending the existing check is enough, so no new script is added

### Out of Scope
- Editing any skill's `ROUTER.md`, `hub-router.json` or `mode-registry.json` - a route the router cannot select is reported, not added here
- Changing `code.md` or `review.md` - they already use the sound pattern
- Checking paths outside `.skilled/skills/` - commands and specs have their own link checks

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/agents/design.md` | Modify | Skill binding through the `sk-code` entry point |
| `.skilled/agents/markdown.md` | Modify | Command map points at mode packets |
| `.skilled/agents/deep-review.md` | Modify | Review doctrine through the review mode |
| `.skilled/agents/debug.md`, `context.md`, `prompt-improver.md` | Modify | Load condition and entry file per skill row |
| `.skilled/bin/sync-agent-roster.cjs` | Modify | Path check in `--check` mode |
| `.skilled/bin/sync-agent-roster.vitest.ts` | Modify | One case for a missing cited path |
| Six runtime trees | Regenerate | Copies of the six changed agent files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | The check fails when an agent file cites a `.skilled/skills/` path that does not exist, and passes on the final tree. |
| REQ-002 | Every reference a removed path pointed at is still reachable through the skill's router, shown in a parity table written before the path is removed. |
| REQ-003 | The runtime copies of the changed agent files match the canonical files. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-004 | `design.md` cites no file inside `sk-code-frontend`, except any that the parity table marks as kept. |
| REQ-005 | `markdown.md` cites no template file under a mode packet's `assets/` folder. |
| REQ-006 | `deep-review.md` loads the review doctrine through the review mode's `SKILL.md`. |
| REQ-007 | Each skill row in `debug.md`, `context.md` and `prompt-improver.md` states when the skill loads and names its entry file. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/bin/sync-agent-roster.cjs --check` exits 0 with the path check on, and exits 1 when one cited path is renamed.
- **SC-002**: `rg -n 'sk-doc/sk-create-[a-z-]+/assets/' .skilled/agents/markdown.md` prints no line, down from the 17 unique `sk-create-*` paths the file cites today.
- **SC-003**: `scratch/route-parity.md` has a row for every removed path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | The `sk-code` and `sk-doc` routers | If a router cannot select a reference an agent needs, removing the path loses it | The parity table is written first. A path the router cannot select stays in the agent file and is raised as an open item for the skill's owner |
| Risk | An agent spends extra tool calls resolving a route it used to read directly | Low | Count tool calls for one dispatch of `design` before and after, and record both in `scratch/after.txt` |
| Risk | The path check flags an example path that is meant to be a placeholder | Med | The check reads only paths that begin with `.skilled/skills/`, and placeholders with angle brackets are skipped |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The path check adds under 1 second to the roster check, measured with `time` in T011.

### Security
- **NFR-S01**: The check resolves paths inside the repository root only and rejects a path containing `..`.

### Reliability
- **NFR-R01**: A path the router cannot select is never removed, so no agent loses a reference it could read before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: Empty input: an agent file citing no skill path passes the check.
- Maximum input: Maximum input: `markdown.md` cites 17 unique `sk-create-*` paths today, and each gets a parity row.
- Failure path: Failure path: a cited path that is a directory with no `SKILL.md` makes the check exit 1 and name it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 14/25 | Six agent files and one script, about 200 changed lines |
| Risk | 12/25 | Three agents change how they find their standards |
| Research | 12/20 | Two skill routers to run and compare |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Can the `sk-code` router select the frontend visual references for a design task? Decision: T002 runs it and records the result. If it cannot, the four paths stay and the gap is reported to the skill's owner.
- Should agents call `compiled-route.cjs` themselves? Decision: only where the skill's own `SKILL.md` tells a reader to. The agent names the entry file and follows what it says.
<!-- /ANCHOR:questions -->

---


