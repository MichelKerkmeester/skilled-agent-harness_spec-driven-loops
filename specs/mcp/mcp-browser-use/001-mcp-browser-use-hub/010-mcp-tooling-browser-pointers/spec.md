---
title: "Feature Specification: Phase 10: mcp-tooling-browser-pointers"
description: "Four mcp-tooling modes named the browser packets as standalone skills after they moved into the mcp-browser-use hub. This phase points their routing prose, related-skills lines and ClickUp's browser notes at the hub and its mode paths."
trigger_phrases:
  - "mcp tooling browser pointers"
  - "phase 10 mcp tooling browser pointers"
  - "clickup browser hub"
  - "mobbin refero figma browser hub"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: mcp-tooling-browser-pointers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-23 |
| **Branch** | `worktrees/524-mcp-tooling-browser-pointers` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-sk-code-browser-evidence |
| **Successor** | None |
| **Handoff Criteria** | No live mcp-tooling doc names a browser packet as a standalone skill, and the mcp-tooling hub check passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the mcp-browser-use hub program. The Chrome DevTools and Aside packets moved out of the mcp-tooling hub into `mcp-browser-use`. The mcp-tooling hub's own `SKILL.md`, README and playbook were updated then, but four of its modes still named the packets as if they were sibling skills.

**Scope Boundary**: the browser references in the live docs of `mcp-click-up`, `mcp-mobbin`, `mcp-refero` and `mcp-figma`, their version fields and changelog entries, and this packet with its parent amendments. No tool, program, routing signal or advisor file changes.

**Dependencies**:
- The `mcp-browser-use` hub and its mode folders `mcp-chrome-devtools` and `mcp-aside-devtools`.

**Deliverables**:
- 12 mode docs whose browser references name the `mcp-browser-use` hub, or a mode path inside it where one browser is meant.
- Mode changelogs: `mcp-click-up` 1.2.24.0, `mcp-mobbin` 1.1.8.0, `mcp-refero` 1.1.9.0, `mcp-figma` 1.2.4.0.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Mobbin, Refero and Figma sent browser work to `mcp-chrome-devtools`, two of them in their `ROUTER.md`. That name is now a mode of the `mcp-browser-use` hub, not a skill. ClickUp drives Aside and live Chrome for its signed-in doc page writes, but none of its files named the hub, and its related-skills lines called Chrome DevTools a structural sibling.

### Purpose
A reader or agent following a browser pointer from an mcp-tooling mode lands on the `mcp-browser-use` hub, which routes to whichever browser mode is installed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git grep -n "mcp-chrome-devtools\|mcp-aside-devtools" HEAD -- .skilled/skills/mcp-tooling ':!*/changelog/*' ':!*/benchmark/*' ':!*.json' | grep -v "mcp-browser-use/mcp-" | wc -l
22
$ git grep -c "mcp-browser-use" HEAD -- .skilled/skills/mcp-tooling/mcp-click-up | wc -l
0
```
Before the change, 22 live lines named a browser packet without its hub, and no ClickUp file named the hub.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Generic browser work (automation, live-page inspection, built-page previews) points at the `mcp-browser-use` hub.
- A line about one browser names its mode path: Figma's port 9222 owner and ClickUp's Aside and Chrome programs.
- Version bumps for each changed file and one changelog entry per changed mode.

### Out of Scope
- ClickUp's browser programs, tool names and the Aside-first, Chrome-fallback order: unchanged.
- Figma's F2C-003 `bdg` steps: unchanged, because they call the Chrome DevTools CLI directly and still work.
- Historical changelog entries that name `mcp-chrome-devtools`: they record what was true then.
- An advisor graph edge between the two hubs: not added, because the mcp-tooling hub holds no browser signal.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-tooling/mcp-click-up/SKILL.md`, `README.md`, `references/mcp-tools.md` | Modify | Name the hub and the Aside and Chrome DevTools mode paths |
| `.skilled/skills/mcp-tooling/mcp-mobbin/SKILL.md`, `ROUTER.md`, `README.md` | Modify | Browser work goes to the hub |
| `.skilled/skills/mcp-tooling/mcp-refero/SKILL.md`, `ROUTER.md`, `README.md` | Modify | Browser work goes to the hub |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md`, `README.md`, `references/troubleshooting.md` | Modify | Previews go to the hub; the 9222 owner is the hub's Chrome DevTools mode |
| `.skilled/skills/mcp-tooling/mcp-{click-up,mobbin,refero,figma}/changelog/` | Create | One entry per mode |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/` | Modify | Phase map row, handoff row and goal binding for 010 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No live mcp-tooling doc names a browser packet without its hub | The Measured Behavior grep, run on the working tree, prints 0 |
| REQ-002 | `parent-skill-check.cjs .skilled/skills/mcp-tooling` passes | The output line `OK: parent-skill-check — all hard invariants passed, 0 warnings`, and exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | ClickUp names the hub where it chooses a browser | `rg -c 'mcp-browser-use' .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md` prints 3 |
| REQ-004 | Every changed mode has a changelog entry matching its `SKILL.md` version | The hub check's `13d-packet-version` line passes for all six modes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A browser pointer in any mcp-tooling mode names the `mcp-browser-use` hub or a mode path inside it.
- **SC-002**: The mcp-tooling hub check and strict validation of this packet and its parent pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A routing prose change in `ROUTER.md` alters a route | A Mobbin or Refero request routes differently | Only the name of the place browser work goes changed. The commit gate re-mints both manifests, and the hub check passes |
| Dependency | The `mcp-browser-use` mode folder names | A later rename breaks the mode paths named here | The paths match the hub's `mode-registry.json` today |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. ClickUp's browser programs were read but not run in this phase. They use `openTab` and the Aside REPL, not `page.on` or `page.context`, so the Aside gaps recorded in phase 008 do not reach them. That is read from the code and not confirmed by a run.
<!-- /ANCHOR:questions -->

---
