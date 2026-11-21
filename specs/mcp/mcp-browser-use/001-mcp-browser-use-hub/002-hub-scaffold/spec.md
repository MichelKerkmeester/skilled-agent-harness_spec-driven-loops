---
title: "Feature Specification: Phase 2: hub-scaffold"
description: "Create the mcp-browser-use parent hub with /create:skill-parent: mcp-tooling's file skeleton without transport-axis, three metadata/workflow/cli-plus-mcp modes."
trigger_phrases:
  - "phase 2 hub scaffold"
  - "mcp-browser-use hub scaffold"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: hub-scaffold

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/505-mcp-browser-use-hub` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-research |
| **Successor** | 003-mode-relocation |
| **Handoff Criteria** | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 and names that hub as its subject |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes specification.

Scope is refined from `../001-research/research/research.md` §5 (KQ3 hub contract), §7 (KQ5 naming) and §11 (per-phase synthesis).

**Scope Boundary**: The hub root and its registry, router, manifest and metadata files, plus the three mode stubs the scaffold command writes. Real packet content arrives in 003 (Chrome DevTools, Aside) and 004 (Bladebro).

**Dependencies**:
- `../001-research/research/research.md` §5 and §7.
- `/create:skill-parent` (`.skilled/commands/create/skill-parent.md`).

**Deliverables**:
- `.skilled/skills/mcp-browser-use/` hub root that passes the per-hub parent-skill check with three registered modes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No browser-use hub exists, so there is nowhere to register the three browser modes. The only template in this repository for a mode hub is `mcp-tooling`, whose `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `ROUTER.md` and `SKILL.md` describe eight unrelated modes and carry a `transport-axis` extension for read-only design transports that a browser hub does not have (`research.md` §5).

### Purpose
A hub root exists at `.skilled/skills/mcp-browser-use/` that the parent-skill checker accepts and that 003 and 004 can fill with mode packets.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/mcp-browser-use
ls: .skilled/skills/mcp-browser-use: No such file or directory
exit=1
$ jq '.extensions | keys' .skilled/skills/mcp-tooling/mode-registry.json
[
  "transport-axis"
]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `/create:skill-parent mcp-browser-use create --modes mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro`. The ids keep the `mcp-` prefix, and folder == `workflowMode` == `packetSkillName` for each (`research.md` §7).
- Shape the hub on `mcp-tooling`'s skeleton: `SKILL.md`, `mode-registry.json`, `hub-router.json`, root `ROUTER.md`, generated `leaf-manifest.json`, `description.json`, `graph-metadata.json`, `README.md`, `changelog/`, `manual-testing-playbook/` and `benchmark/` (`research.md` §5).
- `mode-registry.json`: top-level `skill`, `version`, `resourceContractVersion: 1`, `description`, `discriminator` and `advisorRoutingContract`, plus `modes[]` of three. Each mode is `packetKind: workflow`, `backendKind: cli-plus-mcp`, `advisorRouting.routingClass: metadata`, `toolSurface` allowing Write/Edit with `mutatesWorkspace: true`, `packet == packetSkillName`, `grandfatheredFolderMismatch: false`, `command: null`. No `extensions.transport-axis` block (`research.md` §5, which answers the earlier open question).
- `hub-router.json`: `routerPolicy` with `defaultMode: null`, `ambiguityDelta: 1`, fallback-only `defaultResource`, discovery-only classes; one `routerSignals` entry of `weight: 4` per mode; `vocabularyClasses`. The tie-break covers both overlaps: Chrome DevTools versus Bladebro on debugging, Aside versus Bladebro on signed-in work. Generic "browser automation" defers instead of fanning out (`research.md` §5, §10).
- Hub `SKILL.md` mode table naming all three modes; one hub `graph-metadata.json` identity with three member entities and `mcp-code-mode` as the external substrate (`research.md` §5).

### Out of Scope
- Real packet content: 003 moves Chrome DevTools and Aside in; 004 writes Bladebro.
- Stage-two `ROUTER.md` intent and resource maps (the scaffold writes `router_state: stage1-only`), advisor vocabulary and rebuild, mirrors: 005 owns them.
- Hand-writing `leaf-manifest.json`: it is generated only (`research.md` §5).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/mcp-browser-use/SKILL.md | Create | Thin hub contract and three-mode table |
| .skilled/skills/mcp-browser-use/ROUTER.md | Create | Stage-two control document, `stage1-only` until 005 |
| .skilled/skills/mcp-browser-use/mode-registry.json | Create | Three-mode registry, no `transport-axis` |
| .skilled/skills/mcp-browser-use/hub-router.json | Create | Stage-one signals, tie-break, defer rule |
| .skilled/skills/mcp-browser-use/leaf-manifest.json | Create | Generated by `generate-leaf-manifest.cjs` |
| .skilled/skills/mcp-browser-use/description.json | Create | Doctor metadata |
| .skilled/skills/mcp-browser-use/graph-metadata.json | Create | One hub identity, three member entities |
| .skilled/skills/mcp-browser-use/README.md, changelog/, manual-testing-playbook/, benchmark/ | Create | Hub companions the parent-skill canon requires |
| .skilled/skills/mcp-browser-use/mcp-{chrome-devtools,aside-devtools,bladebro}/ | Create | Scaffold stubs; 003 replaces two with the moved packets, 004 fills the third |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hub passes its own parent-skill check | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 and names that hub as its subject |
| REQ-002 | The registry names the three research modes | `jq -r '.modes[].workflowMode' .skilled/skills/mcp-browser-use/mode-registry.json` prints `mcp-chrome-devtools`, `mcp-aside-devtools` and `mcp-bladebro` |
| REQ-003 | Every mode carries the research contract | `jq '[.modes[] \| select(.packetKind=="workflow" and .backendKind=="cli-plus-mcp" and .advisorRouting.routingClass=="metadata")] \| length'` on the registry prints 3 |
| REQ-004 | No transport-axis extension | `jq '.extensions["transport-axis"]' .skilled/skills/mcp-browser-use/mode-registry.json` prints `null` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The hub SKILL.md mode table names every mode | `rg -c` for each of the three ids in the hub `SKILL.md` prints at least 1 |
| REQ-006 | Router signals and registry agree both ways | `jq -r '.routerSignals \| keys[]'` on `hub-router.json` and `jq -r '.modes[].workflowMode'` on the registry print the same three ids |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs` on the new hub path ends with `OK: parent-skill-check`.
- **SC-002**: `ls .skilled/skills/mcp-browser-use` lists `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `description.json` and `graph-metadata.json`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A bare checker run reports on another hub | High | Always pass the hub path and read the subject line |
| Risk | Check 3c fails when a registered packet directory does not exist | High | Let `/create:skill-parent` write the three mode stubs; 003 deletes the two stubs before moving the real packets in |
| Risk | A generic "browser" signal fans out to every mode | Med | Generic browser vocabulary stays discovery-only and defers (`research.md` §5) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The `transport-axis` question is answered: the hub has workflow modes only (`research.md` §5). The stub approach for check 3c is this plan's choice, not a research finding; confirm it against the scaffold command's output when the phase runs.
<!-- /ANCHOR:questions -->

---
