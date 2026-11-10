---
title: "Feature Specification: Phase 2: skill-and-routing-rename"
description: "Rename the sk-code-opencode surface packet to sk-code-skilled, its bare alias to code-skilled and its surface id OPENCODE to SKILLED across the hub, code, tests, mirrors and generated routing artifacts."
trigger_phrases:
  - "skill and routing rename"
  - "phase 2 skill and routing rename"
  - "sk-code-skilled surface rename"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: skill-and-routing-rename

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/144-sk-code-skilled-rename` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-rename-impact-research |
| **Successor** | 003-markdown-reference-sweep |
| **Handoff Criteria** | Every baseline gate passes again under the new names, and the advisor and hub route a framework-code prompt to `sk-code-skilled` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-code-skilled rename. It changes every load-bearing surface outside `specs/`. Phase 003 handles spec docs and spec folder names.

**Scope Boundary**: everything outside `specs/` that names the surface, plus the generated routing artifacts rebuilt from it.

**Dependencies**:
- Phase 001's `research/research.md` (§4 safe patterns, §6 rename order)
- Operator decisions of 2026-10-18: rename everything, history included; rename spec folders too; rename the surface id OPENCODE to SKILLED

**Deliverables**:
- The packet folder at `.skilled/skills/sk-code/sk-code-skilled/`
- Hub JSONs, `SKILL.md`, `ROUTER.md`, README, shared references and playbooks naming `sk-code-skilled`, `code-skilled` and the SKILLED surface
- Rebuilt advisor DB, compiled routes, hermes mirror and trigger index

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The surface packet for this framework's own code is called `sk-code-opencode`, with the routing alias `code-opencode` and the surface id OPENCODE. The surface covers the Skilled framework, not the OpenCode runtime, and the runtime's own names (`.opencode/`, `cli-opencode`, the `opencode` binary) share the token, so the name misleads readers and makes searches ambiguous.

### Purpose
The surface answers to `sk-code-skilled`, `code-skilled` and SKILLED everywhere it is wired, and every gate that passed before the rename passes after it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` of the packet folder and the changelog alias symlink
- Text references outside `specs/`: hub JSONs, docs, scripts, tests, fixtures, plugins, benchmark ids
- The sk-code surface id OPENCODE, wherever it names this surface (surface detection, routing tables, playbook scenarios, the post-edit quality plugin)
- Rebuilds: advisor DB, compiled routes, the `.hermes/skills/` mirror, the trigger index

### Out of Scope
- The OpenCode runtime's names: `.opencode/`, `cli-opencode`, the `opencode` binary and the runtime id OPENCODE outside the sk-code surface meaning
- `specs/` content and spec folder names, which belong to phase 003
- Any behavior change beyond the name

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/` | Rename | Becomes `sk-code-skilled/` |
| `.skilled/changelog/sk-code/code-opencode` | Rename | Symlink becomes `code-skilled` |
| `.skilled/skills/sk-code/*.json`, `SKILL.md`, `ROUTER.md`, `README.md`, `shared/`, `manual-testing-playbook/` | Modify | New names and surface id |
| `.skilled/commands/doctor/scripts/*`, `.skilled/bin/tests/*`, compiled-routing fixtures, `.opencode/plugins/*` | Modify | Literal pins and tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet lives at `sk-code/sk-code-skilled/` and the hub routes to it | `parent-skill-check.cjs .skilled/skills/sk-code` passes; `compiled-route-status.cjs --hub sk-code` serves a policy naming `sk-code-skilled` |
| REQ-002 | The advisor routes a framework-code prompt to the new packet | `advisor_recommend` shows `packetId: sk-code-skilled` |
| REQ-003 | No runtime name changes | The `.opencode/` and `cli-opencode` match count equals the baseline |
| REQ-004 | Every baseline gate passes again | Drift guards, packet tests, doctor tests, surface-hint test, typo-flag test, plugin test, compiled-route guard and sync check all exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No live reference outside `specs/` keeps an old name | `rg` with the §4 family pattern outside `specs/` returns only the documented exclusions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All REQ-004 gates exit 0 after the rename, matching the baseline in `scratch/baseline/`
- **SC-002**: A framework-code prompt routes to `sk-code-skilled` through both stages (advisor and hub)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A replace pattern hits a runtime OPENCODE or `.opencode/` name | High | Prefixed and bare patterns require `code-` before `opencode`; OPENCODE is replaced only in sk-code surface files after review |
| Risk | A generated artifact is hand-edited and drifts | Med | Rebuild each one with its own tool and run its check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The three operator decisions are recorded in Dependencies.
<!-- /ANCHOR:questions -->

---
