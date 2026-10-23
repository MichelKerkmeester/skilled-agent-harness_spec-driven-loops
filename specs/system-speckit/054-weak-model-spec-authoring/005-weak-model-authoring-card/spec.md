---
title: "Feature Specification: Phase 5: weak-model-authoring-card"
description: "A weak model is told to follow a 1,200-line template guide and does not. This phase gives it one short card, routes the four authoring intents to that card, and guards the card, the router and the inventory against drift."
trigger_phrases:
  - "weak model authoring card"
  - "phase 5 weak model authoring card"
  - "spec authoring card"
  - "route authoring intents to a card"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 5: weak-model-authoring-card

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

This phase writes one short authoring card and makes the skill's router load it for the four authoring intents. The long template guide stays reachable on request. A sync guard and a vocabulary test keep the card, the router, the inventory and the authoring checklist in step.

**Key Decisions**: one card of at most 260 lines replaces the guide as the default authoring load, and a shell guard plus a vitest test make drift fail instead of warn.

**Critical Dependencies**: phases 003 and 004 are closed, so the card can name the v2.3 token form and the per-section fill notes that are already in the templates.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | 004-template-section-fill-guidance |
| **Successor** | 006-speckit-command-and-agent-alignment |
| **Handoff Criteria** | The card exists and is at most 260 lines, the four intents load it, `check-card-sync.sh` exits 0, and three Level 1 smoke runs are recorded in `scratch/card-bench/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm specification.

**Scope Boundary**: Writes land in `.skilled/skills/system-spec-kit/` for the card, the router, the inventory, the checklist, the tasks template and the sync guard, and in this phase folder for the plan and the measurements. No other skill changes.

**Dependencies**:
- Phase 003 is closed. The five core templates are stamped `v2.3` and carry `[YOUR_VALUE_HERE:` tokens, and the validator applies the Draft lifecycle to them.
- Phase 004 is closed. Each template section carries a fill note, and the four `Task Format` declarations are stable.
- The launch preconditions in `../spec.md` section 3 are met and recorded in `../goal.md` section 4.

**Deliverables**:
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`: the card.
- Four `RESOURCE_MAP` rows in `SKILL.md` that load the card, and one prose sentence that names the guide's new tier.
- `leaf-manifest.json` and `leaf-aliases.json` regenerated so both list the card.
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` and its wiring.
- `scratch/card-bench/`: three Level 1 smoke runs with five metrics each.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The router sends four authoring intents to `references/templates/template-guide.md`, a 1,200-line guide. A weak model that loads it writes less, not more: it samples the guide and copies the nearest example. The guide also mixes template-authoring rules with packet-authoring rules, so a model that only needs to fill a scaffold reads rules about `.tmpl` files it must not touch.

### Purpose
A weak model reaches one short card for the authoring intents, and the long guide is still one request away for a reader who needs it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One card at `references/workflows/spec-authoring-card.md`, at most 260 lines, whose text is frozen in `plan.md` section 3.
- Four `RESOURCE_MAP` rows, for PLAN, IMPLEMENT, INTAKE and TEMPLATE_AUTHORING, that load the card.
- One `SKILL.md` prose sentence that records the guide as an `ON_DEMAND` resource.
- `leaf-manifest.json` and `leaf-aliases.json` regenerated with the shipped generator and its companion fix command.
- One checklist line that sends a reader to a rendered example or a scaffold instead of the templates root.
- One `Verify:` slot in the `Task Format` declaration of `templates/core/tasks.md.tmpl`.
- `check-card-sync.sh`, a vitest test that runs it, and a README row that lists it.
- Three Level 1 smoke runs of the card by a DeepSeek V4.1 Flash worker, measured with five commands.

### Out of Scope
- Rewriting the template guide. Phase 2 owns the template and example defects, and phase 3 owns the guide's placeholder text. This phase only changes which tier loads the guide.
- Rewriting the filled example task lines. The card states the rule for new work, and phase 4 owns the example skeleton check.
- The full before-and-after benchmark. Phase 009 owns it, and this phase records a smoke test only.
- Any change to `references/templates/template-guide.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Create | The card, copied from `plan.md` section 3 |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Four intent rows plus one prose sentence |
| `.skilled/skills/system-spec-kit/leaf-manifest.json` | Modify | Regenerated by `generate-leaf-manifest.cjs --write` |
| `.skilled/skills/system-spec-kit/leaf-aliases.json` | Modify | Regenerated by `ci-skill-root-metadata.cjs --fix --skill` |
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` | Modify | One pre-check line |
| `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` | Modify | One `Task Format` line |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` | Create | The sync guard |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | One row in the package topology list |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/card-sync.vitest.ts` | Create | Runs the guard in the suite |
| `specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/scratch/card-bench/*` | Create | Three smoke runs and their metrics |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `references/workflows/spec-authoring-card.md` exists, its line count is at most 260, and every command in it is one the phase ran or read from `--help` or source. |
| REQ-002 | In `SKILL.md`, the `RESOURCE_MAP` lists load the card for PLAN, IMPLEMENT, INTAKE and TEMPLATE_AUTHORING, and `references/templates/template-guide.md` appears in the `ON_DEMAND` list only. |
| REQ-003 | `leaf-manifest.json` and `leaf-aliases.json` both list the card, and `generate-leaf-manifest.cjs --check` exits 0. |
| REQ-004 | The authoring checklist no longer tells a reader to read templates from the templates root. |
| REQ-005 | `templates/core/tasks.md.tmpl` declares the per-task `Verify:` slot in its `Task Format` line. |
| REQ-006 | `runtime/cli/spec/check-card-sync.sh` exits 0 on the changed tree and exits 1 on a copy with the card removed. |
| REQ-007 | `workflow-invariance.vitest.ts` passes with the card added to `WORKFLOW_INVARIANCE_EXTRA_PATHS`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | Three Level 1 smoke runs by a DeepSeek V4.1 Flash worker are recorded in `scratch/card-bench/` with five metrics each, and at least one run passes strict with zero leftover tokens. |
| REQ-009 | One read-only frontier review of the phase diff ran, and each finding is applied or recorded with a reason in `goal.md` section 4. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A worker told to follow the card reaches a `RESULT: PASSED` packet without opening the template guide.
- **SC-002**: A later edit that drops the card from one intent, or that moves the guide back into an intent, fails `check-card-sync.sh` and the suite.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 closed with the `v2.3` stamp and the token form | The card would teach a token form that does not exist | `tasks.md` T001 checks the stamp and the token on the real templates before the card is written |
| Dependency | Phase 004 closed with fill notes in each template section | The card would point at notes that are not there | The card names the note without quoting its shape, and T001 records what the notes look like |
| Risk | The card grows past 260 lines and becomes the guide again | A weak model samples it and the phase changes nothing | The guard fails above 260 lines and the card's own rule forbids a second topic per section |
| Risk | A worker copies from a `.tmpl` file and carries tokens into the packet | The packet fails strict or ships a token | The card's step 4 points at rendered examples, and the checklist line is changed in the same phase |
| Risk | The regenerated inventory rewrites another skill's files | A diff outside this phase's scope | The fix command runs with `--skill system-spec-kit` and T006 reads the file list it prints |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The card stays at or below 260 lines, and each of its sections stays under 20 lines. A section over 20 lines is split or cut.

### Security
- **NFR-S01**: The card and every brief carry no credential, token or key. Workers inherit provider login from the environment only.

### Reliability
- **NFR-R01**: The guard is deterministic. Two runs on the same tree print the same lines in the same order, and it reads no network and writes no file.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a missing card makes the guard print `FAIL card-exists` and exit 1, never a stack trace.
- Maximum length: a card at exactly 260 lines passes, and 261 fails. The boundary is the `-le` test in the guard.

### Error Scenarios
- External service failure: a provider error during a smoke run stops that run. The conductor records the error, retries once after 10 minutes, then records the run as failed.
- Network timeout: the smoke run is killed by its captured PID after 30 minutes and recorded as a failed run.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 11/25 | Files: 9 changed, 1 created card, 3 measurement files. Systems: router, inventory, templates, checklist |
| Risk | 6/25 | Auth: N, API: N, Breaking: N, one shared router |
| Research | 12/20 | The card must match four scripts and two prior phases |
| Multi-Agent | 8/15 | Workstreams: card, router, guard, three smoke runs, one review |
| Coordination | 8/15 | Dependencies: phases 003 and 004 closed, launch preconditions |
| **Total** | **45/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The card repeats the guide's scope and length | M | M | The 260-line guard, plus one topic per section |
| R-002 | A router edit lands in the wrong intent block | H | L | Each edit carries its intent header in the old text, so a wrong block cannot match |
| R-003 | The inventory fix writes outside system-spec-kit | H | L | `--skill system-spec-kit` scopes the run, and T006 reads the changed-file list |
| R-004 | A smoke run passes strict with tokens still in the packet | M | H | Metric M2 counts tokens separately from M1, and a run needs both to count as a pass |

---

## 11. USER STORIES

### US-001: One short card is the default (Priority: P0)

**As a** weak authoring model, **I want** one short card that names the files, the steps and the checks, **so that** I finish a packet without sampling a long guide.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Drift fails, not warns (Priority: P1)

**As the** operator, **I want** the card, the router, the inventory and the checklist checked by one command, **so that** a later edit cannot quietly undo this phase.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. Every choice it needs is frozen in `goal.md` section 1.
- The card's exact text is frozen in `plan.md` section 3. A change to that text is an amendment to this phase, not an executor choice.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---
