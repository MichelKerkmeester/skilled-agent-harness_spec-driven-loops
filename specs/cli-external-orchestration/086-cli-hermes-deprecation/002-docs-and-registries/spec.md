---
title: "Feature Specification: Phase 2: docs-and-registries"
description: "Delete the .hermes runtime folder and the cli-hermes skill, and remove Hermes from the hub registries, root docs, AGENTS.md, agent mirrors, commands and workflows."
trigger_phrases:
  - "remove hermes from docs"
  - "delete hermes runtime folder"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: docs-and-registries

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `worktrees/321-deprecate-cli-hermes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-runtime-code-and-tests |
| **Successor** | 003-regeneration-and-alignment-sweep |
| **Handoff Criteria** | The hub gate passes with 7 modes and every mirror check passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Deprecate and remove the cli-hermes executor and the .hermes runtime folder specification.

**Scope Boundary**: The `.hermes/` folder, the cli-hermes skill, the cli-external-orchestration hub surfaces, system-spec-kit docs, root docs, agent mirrors, commands and GitHub workflows.

**Dependencies**:
- Phase 1 removed the runtime code the docs describe

**Deliverables**:
- `.hermes/` and `cli-hermes` deleted
- No live document names Hermes as a runtime
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hermes was advertised everywhere: a seventh runtime in the root README, a mode in the hub, a persona paragraph in AGENTS.md, a mirror in every sync check, and a 177-file `.hermes/` folder of generated copies that git touched in 553 commits.

### Purpose
Delete the Hermes runtime folder and skill, and remove Hermes from every registry and document so nothing advertises or routes to it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
git status --short -- .hermes | wc -l
177
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration
before: OK, 55 PASS, 8 modes
after: OK, 54 PASS, PASS: 3b: mode-registry.json declares 7 modes
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `.hermes/`, the `cli-hermes` skill, `.dsh/skills/cli-hermes` and the Hermes sync scripts
- Remove the mode from every hub surface: registry, router, ROUTER.md, SKILL.md, README, description, catalog, graph metadata, leaf manifest
- Remove Hermes from the root README, AGENTS.md, SECURITY.md, `.env.example`, `.gitignore`, CROSS-CLI and SYNC docs
- Remove Hermes from agent mirrors, commands, playbooks and GitHub workflows

### Out of Scope
- `specs/` history - it records what was built
- Released changelog files - they record past releases

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.hermes/` | Delete | The Hermes runtime folder, 177 tracked files |
| `.skilled/skills/cli-external-orchestration/cli-hermes/` | Delete | The executor mode |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/` | Delete | The skill and prompt sync scripts |
| `.skilled/skills/cli-external-orchestration/` hub files | Modify | Drop the mode, 8 to 7 |
| `README.md`, `AGENTS.md`, `SECURITY.md`, `.env.example`, `.gitignore` | Modify | Drop Hermes, fix runtime counts |
| `.skilled/agents/*.md` and their mirrors | Modify | Drop Hermes from orchestrate and prompt-improver |
| `.skilled/commands/**`, `.github/workflows/**` | Modify | Drop Hermes mirrors, routes and checks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `.hermes/` and the `cli-hermes` skill no longer exist |
| REQ-002 | The hub gate passes with 7 modes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Runtime counts in the README and docs match the remaining runtimes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls .hermes` reports no such directory
- **SC-002**: The runtime-mirror, agent-mirror and link checks all pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Generated hub surfaces | Hand edits drift from generators | Regenerate with the sk-doc generators |
| Risk | A mode left on one surface stays half-routed | Med | Walk every surface in the hub routing reference and replay a request |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase removes code and documentation and runs no service, so it sets no performance, security or uptime target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a hub with no Hermes mode still passes its gate.
- Maximum input: 177 `.hermes` files deleted in one change.
- Failure path: a stale `AGENTS.md` manifest would flag drift; it was regenerated.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 450 files including deletions |
| Risk | 8/25 | Doc and registry changes, reversible from git |
| Research | 4/20 | Inventory by grep |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose full removal with no backup on 2026-11-07.
<!-- /ANCHOR:questions -->

---
