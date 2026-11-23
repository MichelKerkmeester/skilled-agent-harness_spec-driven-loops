---
title: "Feature Specification: Phase 9: sk-code-browser-evidence"
description: "Names the mcp-browser-use hub in sk-code's sk-code-frontend verification row, so a changed page is opened in whichever browser mode the user has installed, and records the change as sk-code 3.12.2.0."
trigger_phrases:
  - "sk code browser evidence"
  - "phase 9 sk code browser evidence"
  - "sk-code-frontend browser hub"
  - "frontend verification browser evidence"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: sk-code-browser-evidence

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/519-sk-code-browser-evidence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-live-runs-and-playbook-fixes |
| **Successor** | None |
| **Handoff Criteria** | The `sk-code-frontend` row in sk-code's `ROUTER.md` names the `mcp-browser-use` hub, and both sk-code router checks pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the mcp-browser-use hub program. It changes the sk-code skill, which reviews this repository's own system code. Its frontend verification row now points an agent at the browser-use hub, so a changed page is opened in a browser and checked, not judged from source alone.

**Scope Boundary**: the `sk-code-frontend` row in `ROUTER.md` section 5, the version fields that record the change, the changelog entry, and this packet with its three parent amendments. No routing, permission, advisor or browser file changes.

**Dependencies**:
- The `mcp-browser-use` hub and at least one of its browser modes installed: Chrome DevTools, Aside or Bladebro.

**Deliverables**:
- `.skilled/skills/sk-code/ROUTER.md` at 2.3.24.0, with the revised `sk-code-frontend` row.
- `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` at 3.12.2.0.
- `.skilled/skills/sk-code/changelog/v3.12.2.0.md`.
- This packet, plus the parent's phase map row, handoff row and binding row.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-code-frontend` row of sk-code's verification table asked for "the page rendered in a browser" and named no tool. An agent that changed a page had no pointer to the browser tooling this repository ships in the `mcp-browser-use` hub.

### Purpose
A frontend completion claim cites rendered-page evidence from whichever browser mode the user has installed, or says why that evidence could not be gathered.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ for f in ROUTER.md SKILL.md description.json mode-registry.json hub-router.json; do git show HEAD:.skilled/skills/sk-code/$f | rg -o -m1 '"?version"?: ?"?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+"?' | sed "s|^|HEAD $f: |"; done; git show HEAD:.skilled/skills/sk-code/ROUTER.md | rg -n -o 'the page rendered in a browser[^|]*'
HEAD ROUTER.md: version: 2.3.23.0
HEAD SKILL.md: version: 3.12.1.0
HEAD description.json: "version": "3.12.1.0"
HEAD mode-registry.json: "version": "3.12.1.0"
HEAD hub-router.json: "version": "3.12.1.0"
193:the page rendered in a browser. A Figma comparison records the five passes in `sk-code-frontend/references/figma-to-code.md` 
```
Before the change, the row named no tool and the versions were the ones shown above. The Problem Statement quotes the row line and the Scope quotes the versions.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Name the `mcp-browser-use` hub and its three browser modes in the `sk-code-frontend` row. The row asks for a screenshot at the affected viewport and a console with no new errors, or NOT RUN with the reason.
- Move the router from 2.3.23.0 to 2.3.24.0, and sk-code from 3.12.1.0 to 3.12.2.0 in four files.
- Add the v3.12.2.0 changelog entry.
- Record this phase in the parent's phase map and handoff table, and in the parent goal's binding table.

### Out of Scope
- Agent `browser: deny` permissions: unchanged. This change edits the verification row only.
- Advisor signals and graph edges: unchanged. The change is a verification step, not routing.
- sk-design: unchanged.
- Amended 2026-11-22 by the operator ("Fix" the four follow-ups): `sk-code/SKILL.md:58` now names the hub, `web-performance-and-loading.md` asks a page-speed claim for two measured numbers, cli-orca hands non-Orca browser work to the hub, and the 11 dead `mcp-tooling/mcp-chrome-devtools` paths in the out-of-repo `local-webflow` skill point at `mcp-browser-use/mcp-chrome-devtools`. These are now in scope.
- A live browser run: not made. Section 7 names it as open.
- Amended 2026-11-23 by the operator ("create a manual testing conversation scenario for that"): the conversation scenario RD-006 in sk-code's playbook, `routing-disambiguation/frontend-browser-evidence-conversation.md`, its row and index entry in the playbook root (1.5.22.0 to 1.5.23.0), and live runs of it. The operator later approved two fixes so the browser step reaches a small frontend change: a checklist line in `frontend-practice.md` and an ALWAYS rule in `SKILL.md`. On 2026-11-23 the operator also approved a fix to sk-doc's shared conversation runner, which missed Claude Code 2.1.330's review screen. Then, after a run's Bladebro Chrome crashed in a loop, the operator asked for a fix "so that won't happen again": the runner passes its sandbox mode to scenarios, and RD-006 skips inside the sandbox and stops the browser daemons it started. The operator decided that an Aside call made without being asked fails the scenario, because Aside runs on the signed-in account. The §5 row still lists Aside as an allowed mode, and section 7 names that wording as open.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Section 5 `sk-code-frontend` row names the hub; version 2.3.23.0 to 2.3.24.0 |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Version 3.12.1.0 to 3.12.2.0 |
| `.skilled/skills/sk-code/description.json` | Modify | Version 3.12.1.0 to 3.12.2.0 |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Version 3.12.1.0 to 3.12.2.0 |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Version 3.12.1.0 to 3.12.2.0 |
| `.skilled/skills/sk-code/changelog/v3.12.2.0.md` | Create | Changelog entry for 3.12.2.0 |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` | Modify | Phase map row 9, and the handoff row from 008 to 009 |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` | Modify | Binding row for 009 |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence/` | Create | This packet |
| `.skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/frontend-browser-evidence-conversation.md` | Create | Conversation scenario RD-006, added 2026-11-23 |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | Modify | RD-006 row, index entry and scenario count; version 1.5.22.0 to 1.5.23.0 |
| `.skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md` | Modify | Browser step in the pre-completion checklist; 1.0.5.0 to 1.0.6.0 |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, `changelog/v3.12.4.0.md` | Modify, create | ALWAYS rule pointing completion reports at the §5 row; 3.12.3.0 to 3.12.4.0 |
| `.skilled/skills/sk-code/benchmark/reports/` | Create | Two recorded RD-006 runs |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` and its test and fixture | Modify, create | Confirms Claude Code's newer review screen; passes `CONVERSATION_SANDBOX` to setup and checks |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`, `changelog/v1.3.2.0.md`, `references/conversation-scenarios.md` | Modify, create | 1.3.1.0 to 1.3.2.0; reference 1.0.6.0 to 1.0.7.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `sk-code-frontend` row in `ROUTER.md` section 5 names the `mcp-browser-use` hub, Chrome DevTools, Aside and Bladebro, a screenshot at the affected viewport, a console with no new errors, and NOT RUN with a reason | `rg -c 'mcp-browser-use' .skilled/skills/sk-code/ROUTER.md` prints 1, and the row, read in full, names each item above |
| REQ-002 | sk-code is at 3.12.2.0 in `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json`, and the router is at 2.3.24.0 | The version command in tasks.md T003 prints 2.3.24.0 for `ROUTER.md` and 3.12.2.0 for the other four files |
| REQ-003 | `parent-skill-check.cjs` on `.skilled/skills/sk-code` exits 0 with 0 warnings | The output line `OK: parent-skill-check — all hard invariants passed, 0 warnings`, and exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `verify-router-sync.cjs` passes all router checks | The output line `router-sync: 5/5 checks passed`, and exit 0 |
| REQ-005 | The changelog entry exists and names this packet | `rg -n 'specs/mcp/mcp-browser-use' .skilled/skills/sk-code/changelog/v3.12.2.0.md` prints the spec folder line |
| REQ-006 | Routing is unchanged: the advisor still recommends local-webflow, then sk-code, for the pricing-page CSS prompt | Carried from the earlier run. The rerun in this worktree exited 69 because the advisor runtime has no build, so section 7 names it as open |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs` exits 0 with 0 warnings on `.skilled/skills/sk-code`, and `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`.
- **SC-002**: A reader of the `sk-code-frontend` verification row sees the `mcp-browser-use` hub named as the browser tooling to use.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `mcp-browser-use` hub and at least one installed browser mode | With no mode installed, no rendered-page evidence is gathered | The row allows NOT RUN with the reason, so the gap shows in the report |
| Risk | The row could be read as a request to open a signed-in browser | A user's signed-in session could be used without consent | The row says the agent uses a browser session it owns, and opens the user's signed-in browser only when the user asks |
| Risk | The row sits in `ROUTER.md` §5, which the compiled frontend route does not load | Frontend work is reported done without browser evidence or NOT RUN | The ALWAYS rule in `SKILL.md` carries the step, and RD-006 checks it live |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Has the new row's browser step run on a real page? The scenario RD-006 ran live on 2026-11-23 and FAILED. Claude Code loaded sk-code, took the compiled route, read only the frontend references, changed the color and reported it done without opening a browser or writing NOT RUN. The row lives in `ROUTER.md` §5, which that route never shows the agent. The operator approved two fixes. A checklist line in `frontend-practice.md` did not help, because the subject skipped the frontend guidance for a one-value change (run 5). An ALWAYS rule in `SKILL.md` reached it (run 6): the subject quoted the rule, then said it had no browser tool and stopped, although three browser CLIs are installed. It never opened the `mcp-browser-use` hub, and it wrote "Not checked" rather than NOT RUN. A third fix, approved by the operator, tells the agent to read the hub and check for the `bdg` and `bladebro` CLIs. In run 10 the subject then found `bladebro`, but Chrome crashed in a loop inside the runner's macOS sandbox. RD-006 now skips inside the sandbox and runs with `--no-sandbox`. With the operator's go-ahead, run 11 used `--no-sandbox` and PASSED: the subject opened the page in its own headless `bdg` session, saved a screenshot and reported a clean console, with no Chrome crash.
- Aside in the §5 row: the row lists Aside as an allowed mode, but the hub describes Aside as running on the signed-in account. The operator chose to fail an unasked Aside call in RD-006. Rewording the row to match is open.
- SD-004 carries the same outdated sign-in check that skipped RD-006's second run. Its fix is the same two patterns, outside this packet.
- Does the advisor replay still recommend local-webflow, then sk-code? Carried from the earlier run only. It needs the `system-skill-advisor` runtime built, which this worktree lacks.
- Should `.skilled/skills/sk-code/SKILL.md:58` and the LCP/INP baseline sentence in `web-performance-and-loading.md` also name the hub? Both are optional follow-ups, not done here.
- Does strict validation pass for this packet and the parent? Yes, after the repair ran with `tsx` linked into this worktree. The link points at worktree 514's copy, so a clean checkout needs its own `tsx` first.
<!-- /ANCHOR:questions -->

---
