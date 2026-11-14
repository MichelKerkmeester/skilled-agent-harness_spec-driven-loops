---
title: "Feature Specification: Phase 5: hub-router-alignment"
description: "The hub router's prose names files that do not exist, knows only one of its three surfaces and never routes the implement doctrine, and the hub's own setup battery is red. This phase aligns the prose with the map and turns the battery green."
trigger_phrases:
  - "hub router alignment"
  - "phase 5 hub router alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: hub-router-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-vocabulary-single-source |
| **Successor** | 006-skilled-packet-fixes |
| **Handoff Criteria** | The setup battery prints `STATUS=PASS`, and the path check in REQ-001 prints 0 missing paths. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sk-code audit remediation specification.

**Scope Boundary**: This phase edits the hub root, the doctor script and the files the drift guard names. It changes no packet reference content and no keyword.

**Dependencies**:
- Phase 004 merged, because both phases touch the router-sync guard's inputs
- `.skilled/repo-rules/skill-hub-routing.md`, loaded before the first router edit
- The operator's answers to the two open questions

**Deliverables**:
- Section 4 prose that names real files
- CI and frontend rows in the tiers and the verification table
- `workflow-implement.md` routed under IMPLEMENTATION
- A green setup battery whose exit status matches its status line
- One statement of when the authoring checklists load
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader who follows hub `ROUTER.md` section 4 is sent to files that do not exist, because the prose still names the pre-split language files. Sections 2, 3 and 5 describe load tiers and verification for SKILLED only, so CI and frontend work gets no verification command. `workflow-implement.md` is never loaded by any route. The setup battery an operator runs to check the hub prints `STATUS=FAIL` and exits 0, so a script that reads the exit status sees a pass.

### Purpose
The hub router's prose matches its machine map for all three surfaces, and the setup battery reports PASS with an exit status that agrees.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at the commit this branch started from.

```text
$ node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs | tail -4
PASS  derived-freshness   node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --format json
PASS  probe               node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "fix a typescript bug in the opencode plugin"
PASS  quality             python3, executables, tables, node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests, quality route probe
STATUS=FAIL failed=1 skipped=0
exit=0

$ rg -c 'workflow-implement' .skilled/skills/sk-code/ROUTER.md
(no output)
exit=1

$ ls .skilled/skills/sk-code/sk-code-skilled/references/typescript
quality-standards
quick-reference
style-guide
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the language overlay, the VERIFICATION row and the implementation tier in `ROUTER.md` section 4 so every path exists and matches section 8.
- Add CI and frontend rows to the load tiers in section 3, the verification commands in section 5 and the surface notes in section 2.
- Route `shared/references/workflow-implement.md` under IMPLEMENTATION and list it in `SHARED_CONTROL_RESOURCES`, as debug and verify already are.
- State once when the four authoring checklists load, and make `ROUTER.md`, `sk-code-skilled/SKILL.md` and `sk-code-quality/SKILL.md` say the same thing.
- Clear the 23 drift-guard errors and make the setup battery's exit status follow its status line.
- Remove the section 10 pointer to another repository, raise the hub version and write the release note.

### Out of Scope
- Editing the 21 warnings the drift guard prints for `specs/` scratch scripts - they are warnings, they do not fail the guard and no finding names them
- Changing `sk-code-skilled` or `sk-code-quality` beyond the one checklist sentence - phases 006 and 008 own those packets
- Rewriting the section 11 pseudocode - no finding names a fault in it

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Sections 2, 3, 4, 5, 8 and 10 |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Version, and the reference line for the doctrine |
| `.skilled/skills/sk-code/description.json` | Modify | Version parity |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Version parity |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Version parity |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify | Only if the guard requires the doctrine entry |
| `.skilled/skills/sk-code/changelog/` | Create | One hub release note |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modify | The one sentence on the MCP server checklist |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | The one sentence on the MCP server checklist |
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | Modify | Exit status follows the status line |
| `.pi/extensions/*.ts` | Modify | Add the module header the guard requires, 22 files, per the open question |
| `.skilled/bin/skilled-loop-shell.sh` | Modify | Add strict mode, per the open question |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | The path check in `plan.md` section 5 prints `missing 0` for every backtick path in `ROUTER.md` sections 1 to 7, brace forms expanded. |
| REQ-002 | `rg -c 'workflow-implement.md' .skilled/skills/sk-code/ROUTER.md` prints 2 or more, and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0. |
| REQ-003 | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=PASS failed=0`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-004 | With a guard forced to fail in a scratch copy, `sk-code-setup-check.cjs` exits non-zero, or its header documents that exit 0 is deliberate and the open question records the operator's answer. |
| REQ-005 | `sed -n '/^## 3\./,/^## 4\./p;/^## 5\./,/^## 6\./p' .skilled/skills/sk-code/ROUTER.md | rg -c 'sk-code-ci|sk-code-frontend'` prints 4 or more. |
| REQ-006 | `rg -c 'by judgment' .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/sk-code-skilled/SKILL.md .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1, and each of the three files names the same selector for the MCP server checklist. |
| REQ-007 | `rg -c 'barter/' .skilled/skills/sk-code/ROUTER.md` prints nothing and exits 1. |
| REQ-008 | The `version` in `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` is the same string, and `.skilled/skills/sk-code/changelog/v<that version>.md` exists. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The setup battery prints `STATUS=PASS failed=0`, where the baseline printed `STATUS=FAIL failed=1`.
- **SC-002**: Every path the router's prose names exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | The owners of `.pi/extensions/` and `skilled-loop-shell.sh` | Another session has uncommitted work in `.pi/` | The open question asks the operator before those 23 files are touched, and the phase can close the hub-owned work first |
| Risk | A caller relies on the setup battery exiting 0 | Med | Setup task T003 lists every caller with `rg` before the exit status changes |
| Risk | Routing the implement doctrine changes what every implementation request loads | Med | It is one shared file, already loaded for debug and verify in the same way, and the router replay tests cover the map |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase runs no service. Its limits are the counts and exit statuses in section 4.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a section 4 row with no path, such as the spec-folder row that points at another skill, is skipped by the path check.
- Maximum input: the Rust row names folders, and the path check accepts a folder that exists.
- Failure path: a forced guard failure makes the battery print `STATUS=FAIL` and exit non-zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 18/25 | About 35 files, 23 of them one-line header fixes |
| Risk | 12/25 | A doctor script's exit contract and a shared router |
| Research | 6/20 | Callers of the battery and the checklist gating rule |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the 23 drift-guard errors be fixed in the files, or should the guard stop scanning `.pi/extensions/`? Default: fix the files, because the rule they break is the house rule for TypeScript modules and shell scripts.
- Is exit 0 on `STATUS=FAIL` deliberate for `sk-code-setup-check.cjs`? Default: no, the exit status should follow the status line, as the hub's other gates do.
<!-- /ANCHOR:questions -->

---


