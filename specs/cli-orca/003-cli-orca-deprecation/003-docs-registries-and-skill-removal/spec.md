---
title: "Feature Specification: Phase 3: docs-registries-and-skill-removal"
description: "Remove cli-orca from the root README, the skills index, three advisor graph edges and the mcp-tooling docs, then delete the skill, its changelog link and its two mirror links."
trigger_phrases:
  - "cli orca removal docs"
  - "delete cli-orca skill folder"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: docs-registries-and-skill-removal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/534-deprecate-cli-orca` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-runtime-code-and-tests |
| **Successor** | 004-regeneration-and-zero-reference-proof |
| **Handoff Criteria** | The skill tree and its links are gone and every manifest edit row is done |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Deprecate and remove the cli-orca skill specification.

**Scope Boundary**: The root README, the skills index, three `graph-metadata.json` edges, five mcp-tooling docs, then deletion of `.skilled/skills/cli-orca/` and its three tracked links.

**Dependencies**:
- Phase 2 finished, so no test expects the skill

**Deliverables**:
- Docs and registries that no longer name cli-orca
- The skill folder and links deleted through git
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README and the skills index advertise cli-orca, and three skills declare an advisor edge to it. The mcp-tooling docs tell readers that Orca work belongs to cli-orca. After deletion each of these would point at nothing.

### Purpose
Remove every live mention, then delete the skill so nothing advertises or routes to it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
git rm -r .skilled/skills/cli-orca .skilled/changelog/cli-orca .vibe/skills/cli-orca .dsh/skills/cli-orca
result: 62 tracked paths deleted (59 files and 3 symlinks)
rg -n -i orca .skilled/skills/mcp-tooling --glob '!**/changelog/**': before 10 lines, after none
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update the README skill counts from 15 to 14 and remove its cli-orca entry
- Remove the cli-orca row from `.skilled/skills/README.txt`
- Remove the cli-orca edge from the sk-git, cli-external-orchestration and mcp-tooling graph metadata
- Remove the Orca boundary text from five mcp-tooling docs
- Delete the skill, its changelog link and the `.vibe` and `.dsh` mirror links

### Out of Scope
- Released mcp-tooling changelog entries - they record past releases

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Counts and entry |
| `.skilled/skills/README.txt` | Modify | Index row |
| three `graph-metadata.json` | Modify | Advisor edges |
| five mcp-tooling docs | Modify | Boundary text |
| `.skilled/skills/cli-orca/`, `.skilled/changelog/cli-orca`, `.vibe/skills/cli-orca`, `.dsh/skills/cli-orca` | Delete | The skill and its links |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No doc or registry file in scope names cli-orca |
| REQ-002 | The skill folder and its three links are deleted, and no dangling symlink remains |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The three edited `graph-metadata.json` files parse as JSON |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n -i orca` over the edited files prints nothing
- **SC-002**: `git status` shows 62 deletions and `find . -xtype l` finds none outside `specs/`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek Flash dispatch through cli-opencode | Doc edits do not land | Diff every return before the next dispatch |
| Risk | Deleting an untracked file inside the skill | Medium | `git status --ignored` on the folder showed nothing untracked, so every deleted file is in git |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase removes code and documentation and runs no service, so it sets no performance, security or uptime target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an edge that was the last array element loses the comma before it.
- Maximum input: the README states the count in four places.
- Failure path: git restores every deleted path, because all 59 files and 3 links were tracked.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 5 file groups |
| Risk | 6/25 | Removal only; git restores every path |
| Research | 3/20 | Inventory and tool lookup |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose full removal on 2026-11-24.
<!-- /ANCHOR:questions -->

---
