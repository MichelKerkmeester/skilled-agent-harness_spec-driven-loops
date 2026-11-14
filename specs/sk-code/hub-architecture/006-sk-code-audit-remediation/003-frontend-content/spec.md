---
title: "Feature Specification: Phase 3: frontend-content"
description: "The frontend packet's load rules disagree, one reference mixes four topics and the playbook covers 3 of 11 intents. This phase makes the packet's documents agree with its router and gives every intent a scenario."
trigger_phrases:
  - "frontend content"
  - "phase 3 frontend content"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: frontend-content

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-frontend-reach |
| **Successor** | 004-vocabulary-single-source |
| **Handoff Criteria** | The playbook validator exits 0 with 11 scenarios, and the rule-id count in REQ-003 matches the baseline. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-code audit remediation specification.

**Scope Boundary**: This phase edits files inside `sk-code-frontend/` and one row of the hub registry. It changes no keyword.

**Dependencies**:
- Row `F7` of the ledger, verified in phase 001
- Phase 002 merged, because both phases edit `sk-code-frontend/ROUTER.md`

**Deliverables**:
- One load rule stated the same way in three documents
- A motion reference that holds motion and interaction rules only
- Eleven playbook scenarios
- A frontend row in the registry's quality checklists
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Once a request reaches `sk-code-frontend`, the packet tells the agent two different things about what to load: `SKILL.md` says to read the web layer first, and the router skips it for visual, motion and Figma intents. The motion reference is 642 lines and holds forms, typography, focus and performance rules that other topic files also own, so an accessibility request misses the focus rules filed there. Eight of the eleven intents have no playbook scenario, so nothing replays them.

### Purpose
Every document in the frontend packet states the same load rule the router runs, each rule lives in one topic file and every intent has a scenario.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at the commit this branch started from.

```text
$ wc -l .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md
     642 .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md
exit=0

$ ls .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/
figma-check.md
frontend-web.md
visual-values.md
exit=0

$ rg -c 'workflow-implement|tokens.css' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md
1
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the load rule in `SKILL.md` section 4 and `frontend-practice.md` section 6 to match the router: web intents load the web layer, and visual, motion and Figma intents load the core and their own file.
- State in the packet `ROUTER.md` how `assets/tokens.css` and the three `workflow-*.md` links are reached.
- Move each rule that row `F7` lists as duplicated to the topic file that owns it, and leave a link in the motion reference.
- Add one playbook scenario for each of the eight intents that has none.
- Add a `quality.checklists` row for frontend file extensions that points at `frontend-practice.md`, the way the `sk-code-ci` entry does.
- Settle the type-token unit, state where other frameworks live, close the rule-id gaps and correct the topic-file count.

### Out of Scope
- Adding Vue, Svelte or other framework sections - no current request needs them, so the section states where they live instead
- Changing any keyword or intent - phase 002 owns reach and phase 004 owns the copies
- Rewriting rule content - a moved rule keeps its wording and its id

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-frontend/SKILL.md` | Modify | Load rule, keyword comment and version |
| `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | Modify | Load path for the token file and the doctrine links, and the topic-file count |
| `.skilled/skills/sk-code/sk-code-frontend/README.md` | Modify | Scenario count and version |
| `.skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md` | Modify | Section 6 load rule |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md` | Modify | Move duplicated rules out |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-*.md` | Modify | Receive the moved rules, close the `I8` gap and order the `P` ids |
| `.skilled/skills/sk-code/sk-code-frontend/assets/tokens.css` | Modify | Type-token unit, per the open question |
| `.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/` | Create | Eight scenario files |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | `quality.checklists` row for the frontend entry |
| `.skilled/skills/sk-code/sk-code-frontend/changelog/` | Create | One release note for the packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | `rg -l 'visual, motion and Figma intents' .skilled/skills/sk-code/sk-code-frontend/SKILL.md .skilled/skills/sk-code/sk-code-frontend/ROUTER.md .skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md | wc -l` prints 3, and `rg -c 'web layer before applying a topic reference' .skilled/skills/sk-code/sk-code-frontend/SKILL.md` prints nothing and exits 1. |
| REQ-002 | `ls .skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/frontend-surface/*.md | wc -l` prints 11, and the playbook package validator exits 0. |
| REQ-003 | `cat .skilled/skills/sk-code/sk-code-frontend/references/*.md | rg -c '^### M[0-9]+\.'` prints 48, the count before the move, so no motion rule is lost or duplicated. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-004 | `wc -l .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md` prints 400 or fewer. |
| REQ-005 | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs` passes with the new frontend row in place. |
| REQ-006 | `rg -c -- '--text-[a-z0-9]+: *[0-9.]+px' .skilled/skills/sk-code/sk-code-frontend/assets/tokens.css` prints nothing and exits 1, unless the open question is answered the other way. |
| REQ-007 | `rg -c '^### I8\.' .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md` prints 1, and the `P` ids in `web-performance-and-loading.md` appear in ascending order. |
| REQ-008 | `rg -c 'nine web topic files' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints nothing and exits 1. |
| REQ-009 | `rg -c 'project mode' .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` prints a number above 0 inside section 8, naming where other frameworks live. |
| REQ-010 | `rg -c 'tokens.css' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` and `rg -c 'workflow-implement' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` each print a number above 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three documents state one load rule, and the playbook replays all 11 intents.
- **SC-002**: The motion reference is 400 lines or fewer with all 48 `M` rule ids still present once across the references.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Row `F7` verdict from phase 001 | A `Refuted` verdict removes the move | REQ-004 and the move tasks are then recorded as `no change` in the ledger |
| Risk | A moved rule breaks a link that points at its old anchor | Med | Leave a one-line link under the old heading and run the link check in the verification tasks |
| Risk | Changing the type tokens to `rem` alters a project that copied the file | Low | The file is a starter a project copies and retunes, and the release note names the change |
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

- Empty input: an intent with no topic file of its own, `FRONTEND_WEB`, still gets a scenario that expects the core and the web layer.
- Maximum input: `WEB_VISUAL_HIERARCHY` keeps its four resources, and its scenario lists all four.
- Failure path: a scenario whose `expected_resources` differ from the router map makes the playbook validator exit non-zero.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 15/25 | About 20 files in one packet |
| Risk | 6/25 | Documentation and one registry row |
| Research | 5/20 | The overlap list from row `F7` |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the starter type tokens move from `px` to `rem`? Default: yes, with the pixel value in a comment, because principle 5 requires text to survive font scaling and V5 already allows `rem`.
<!-- /ANCHOR:questions -->

---


