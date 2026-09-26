---
title: "Feature Specification: Phase 9: verification-and-closeout"
description: "Phase 009 closes sk-create-goal by exercising the playbook, proving a real authoring path, measuring routing and reconciling packet status."
trigger_phrases:
  - "sk-create-goal phase closeout"
  - "goal authoring playbook execution"
  - "real packet goal acceptance path"
  - "sk-doc newcomer routing count"
  - "goal mode release link"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: verification-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `worktrees/068-create-goal-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-command-and-playbook |
| **Successor** | None |
| **Handoff Criteria** | All eight playbook scenarios have observed final verdicts, a genuine `/create:goal` accept path yields a within-budget packet goal with every phase bound, ten plain-language prompts have recorded routing outcomes, every phase acceptance row is closeable, and recursive strict validation prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: Close the mode with observed playbook, accept-path and reachability evidence, release documentation and reconciled packet status. Keep goal-template and runtime goal ownership with system-spec-kit and the goal hooks (specs/sk-doc/060-create-goal-mode/spec.md:94-98, 127-129; specs/sk-doc/060-create-goal-mode/goal.md:49-54).

**Dependencies**:
- Phase 006 must provide a conformance check whose positive fixture passes and whose negative fixtures fail for their named reasons (specs/sk-doc/060-create-goal-mode/spec.md:147).
- Phase 007 must prove the advisor and compiled-route handoffs, including the ten fixed newcomer prompts and the session-goal exclusions (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:32, 51; specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:116-133).
- Phase 008 must meet its incoming handoff: all four command mirrors resolve and the playbook package validator reports `PASS` with eight scenarios (specs/sk-doc/060-create-goal-mode/spec.md:149; specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:24-33).
- The playbook execution contract requires recorded verdicts, reasons and evidence paths under `benchmark/reports/` (sk-create-manual-testing-playbook/SKILL.md:267-312).

**Deliverables**:
- Eight observed scenario verdicts in the sk-doc benchmark report and this phase's implementation summary (specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105-113).
- One real packet goal authored through `/create:goal`; `goal.cjs packet` reports `packet_budget=ok`, and every direct phase has a bound child goal (specs/sk-doc/060-create-goal-mode/goal.md:106-111; wave1-goal-system-audit.md:44).
- Results for the same ten newcomer prompts through the advisor and compiled-route commands, plus the fixed session-goal negative probes (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:110-133).
- A mode README authored through `sk-create-readme`, a real mode changelog file and the sibling-style hub directory link (specs/sk-doc/060-create-goal-mode/spec.md:86, 109; `ls -la .skilled/changelog/sk-doc/`).
- Reconciled acceptance, task and status records across all nine phases, followed by a passing recursive strict validation (specs/sk-doc/060-create-goal-mode/spec.md:121-136; validation-rules.md:68-93, 765-780).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 008's outgoing check verifies command mirrors and playbook package conformance, but it does not execute the scenarios against the mode or prove an accept path against a real packet (specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:24-33, 82-89, 105-113). Earlier closeouts show why execution evidence matters: the repo-rule packet recorded its accept path and advisor smoke test as unrun, while the frontmatter utilization review found that six of eight newcomer prompts did not reach the mode (specs/sk-doc/z_archive/040-create-repo-rules/007-validation-and-changelog/implementation-summary.md:130-149; specs/sk-doc/049-sk-create-frontmatter/008-utilization-review/implementation-summary.md:133-153).

### Purpose

Produce observed evidence that sk-create-goal can author a real packet goal and can close with every phase in a consistent state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute all eight scenarios named by Phase 008 and store each final verdict, reason and evidence path without changing the playbook corpus (specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105-113; sk-create-manual-testing-playbook/SKILL.md:297-312).
- Exercise one genuine `/create:goal` accept path against a real phased packet. The audit found a missing phase-007 child goal in `017-memory-database-decommission`, and its current phase map still lists phase 007 (wave1-goal-system-audit.md:44; specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md:164; specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md:68-74).
- Run the fixed ten newcomer prompts through the advisor and compiled-route commands, report each outcome and the count reaching sk-create-goal, then replay the six fixed session-goal and host-command probes (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:110-133).
- Author the mode README with `sk-create-readme` and its Human Voice standard, then write the mode changelog file and its relative hub directory link (sk-create-readme/SKILL.md:151-180, 316-327; specs/sk-doc/060-create-goal-mode/spec.md:109).
- Write the phase-local changelog required by this child template, using the spec-kit nested changelog generator (sk-create-changelog/SKILL.md:215-232).
- Close all nine phases' acceptance criteria and reconcile each child's status with the parent Phase Documentation Map and parent goal log (specs/sk-doc/060-create-goal-mode/spec.md:119-136; specs/sk-doc/060-create-goal-mode/goal.md:123-130).
- Run the goal conformance check from Phase 006, the explicit sk-doc parent-skill check and recursive strict validation after all edits (specs/sk-doc/060-create-goal-mode/goal.md:106-111; parent-skills-nested-packets.md:240-255; validation-rules.md:68-93, 775-780).

### Out of Scope
- Building or redesigning the mode, command or hub routes. Earlier phases own those outputs (specs/sk-doc/060-create-goal-mode/spec.md:85-92, 100-109, 121-129).
- Editing system-spec-kit templates, validators, goal hooks, host goal commands or session goal state (specs/sk-doc/060-create-goal-mode/spec.md:94-98; wave1-goal-system-audit.md:47-53).
- Rewriting the existing goal corpus beyond the single real packet goal used to prove the accept path (specs/sk-doc/060-create-goal-mode/spec.md:97-98).
- Changing unrelated phase deliverables or fixing unrelated repository findings.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-goal/README.md` | Create or modify | Author the mode overview through `sk-create-readme`. |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md` | Create | Write the real first-version mode changelog in the sibling mode format. |
| `.skilled/changelog/sk-doc/create-goal` | Create | Add a relative directory symlink to `../../skills/sk-doc/sk-create-goal/changelog`. |
| `.skilled/skills/sk-doc/benchmark/reports/README.md` | Create if absent | Index the manual playbook run required by the result-storage contract. |
| `.skilled/skills/sk-doc/benchmark/reports/<run-label>/{README.md,results.csv,source.md}` | Create | Record the eight scenario verdicts, reasons and evidence paths under a dated run label (sk-create-manual-testing-playbook/SKILL.md:273-312). |
| `specs/sk-doc/060-create-goal-mode/changelog/changelog-060-009-verification-and-closeout.md` | Create or update | Record this child phase closeout with the nested spec-kit changelog generator (sk-create-changelog/SKILL.md:219-230). |
| `specs/sk-doc/060-create-goal-mode/spec.md` | Modify | Reconcile the nine Phase Documentation Map rows after evidence is final. |
| `specs/sk-doc/060-create-goal-mode/goal.md` | Modify | Record phase progress and final parent completion evidence. |
| `specs/sk-doc/060-create-goal-mode/{001-goal-inventory-and-mode-contract,002-mode-scaffold,003-authoring-standards-and-exemplars,004-parent-and-nested-goal-authoring,005-budget-and-chat-slice-handoff,006-goal-conformance-check,007-hub-routing-integration,008-command-and-playbook,009-verification-and-closeout}/{spec.md,tasks.md,acceptance-criteria.md,implementation-summary.md}` | Modify as needed | Close evidenced acceptance rows and align each child's status. |
| `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/{spec.md,plan.md,tasks.md,acceptance-criteria.md,goal.md,implementation-summary.md}` | Modify | Record execution evidence and reconcile this phase's completion state. |
| `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/{goal.md,007-decommission-review-p1-p2-fixes/goal.md}` | Modify and create | The real accept path from T006: one binding row in the parent goal and the missing phase-007 child goal. Both folders' `description.json` and `graph-metadata.json` are regenerated afterwards so the packet validates. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Execute every one of the eight Phase 008 playbook scenarios. Record one final `PASS`, `FAIL` or `SKIP` verdict, its reason and evidence path for each. Resolve in-scope failures and rerun them before closure (specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105-113; sk-create-manual-testing-playbook/SKILL.md:297-312, 352-360). |
| REQ-002 | Exercise the Phase 006 goal conformance check on its positive and every named negative fixture. The positive fixture must pass, and each negative fixture must fail for its named reason (specs/sk-doc/060-create-goal-mode/spec.md:147; specs/sk-doc/060-create-goal-mode/goal.md:108-110). |
| REQ-003 | Use `/create:goal` on a real packet with a verified authoring need. Require `goal.cjs packet` to report `packet_budget=ok`, require every direct phase goal path to exist and prove every phase is bound. |
| REQ-004 | Run the same ten plain-language newcomer prompts through the advisor and compiled-route commands. Record one row per prompt and the count reaching sk-create-goal at each stage (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:110-127). |
| REQ-005 | Author or refresh `.skilled/skills/sk-doc/sk-create-goal/README.md` through `sk-create-readme` and pass its document and Human Voice checks (sk-create-readme/SKILL.md:165-180, 316-327). |
| REQ-006 | Write the real mode changelog, create the sibling-style hub directory symlink and write this phase's nested spec changelog. Verify that both changelog paths resolve (specs/sk-doc/060-create-goal-mode/spec.md:109; specs/sk-doc/z_archive/040-create-repo-rules/007-validation-and-changelog/implementation-summary.md:81-89, 101-103; sk-create-changelog/SKILL.md:219-230). |
| REQ-007 | Close every phase acceptance row on observed evidence. Reconcile all child statuses, the parent phase map and the parent goal log so they agree (specs/sk-doc/060-create-goal-mode/spec.md:119-136; validation-rules.md:68-93). |
| REQ-008 | Run recursive strict validation on the parent packet and require an explicit `RESULT: PASSED` after generated metadata is current (specs/sk-doc/060-create-goal-mode/spec.md:133-136; validation-rules.md:765-780). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | Resolve and record whether `sk-create-changelog` global component mode supports a nested target such as `sk-doc/create-goal`. The answer must not change the direct-write and symlink plan (sk-create-changelog/SKILL.md:58-60, 184-190). |
| REQ-010 | After the last edit, run every runtime-mirror check and require each to pass: `sync-runtime-mirrors.cjs --check`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check`, `hermes/sync-prompts-hermes.cjs --check` and `hermes/sync-skills-hermes.cjs --check` under `.skilled/skills/system-spec-kit/runtime/cli/` (operator-approved amendment, 2026-09-26; `.github/workflows/command-tree-parity.yml:65-66`). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the eight indexed scenarios, **When** the playbook is run, **Then** the result record contains eight observed verdicts with reasons and evidence paths.
- **SC-002**: **Given** a real phased packet with an unmet goal-authoring need, **When** `/create:goal` authors its parent and missing child goal, **Then** every direct phase goal path exists and `goal.cjs packet` reports `packet_budget=ok`.
- **SC-003**: **Given** the ten fixed newcomer prompts, **When** the advisor and compiled-route commands run on each, **Then** the record has ten rows and stage-specific reachability counts.
- **SC-004**: **Given** the release documents, **When** their paths are checked, **Then** the mode changelog exists and the hub symlink resolves to it.
- **SC-005**: **Given** all nine phase records, **When** recursive strict validation runs on the parent packet, **Then** it prints `RESULT: PASSED` and no phase acceptance criterion remains open.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 006-008 are Draft in the current planning snapshot (specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/spec.md:24-32; specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:23-32; specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:24-33). | Their output paths and handoff evidence are not yet available. | Do not start phase 009 execution until each incoming handoff is observed and accepted. |
| Dependency | The goal-system audit identified a real unbound phase in `017-memory-database-decommission` (wave1-goal-system-audit.md:44). | The target may be repaired before phase 009 runs. | Recheck the live map and binding first. Use another verified real gap if this one has closed. Do not manufacture an accept case. |
| Risk | A playbook package validator pass could be mistaken for scenario execution; Phase 040's phase 008 summary records a passing package with no executed scenarios (wave1-mode-anatomy-audit.md:64). | The playbook would have no observed behavior evidence. | Record an outcome, reason and evidence path for each of the eight scenarios in the benchmark run record (sk-create-manual-testing-playbook/SKILL.md:297-312). |
| Risk | `goal.cjs packet` measures goal slices but does not itself prove phase binding completeness (wave1-goal-system-audit.md:16-18). | A within-budget result could still omit a phase. | Run the Phase 006 completeness check and test each direct phase goal path separately. |
| Risk | The changelog workflow's global component target is unresolved for a nested name (sk-create-changelog/SKILL.md:58-60, 184-190). | Depending on it could block or misplace the release file. | Resolve the question during execution, but write the mode file directly and create the required relative symlink. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance change is planned. This phase records manual authoring and routing evidence.

### Security
- **NFR-S01**: Do not set, bind, update or resend runtime session-goal state; those surfaces remain outside this mode (specs/sk-doc/060-create-goal-mode/spec.md:94-98; wave1-goal-system-audit.md:47-53).
- **NFR-S02**: Keep the real goal exercise limited to one verified packet need and preserve its original goal file for rollback.

### Reliability
- **NFR-R01**: Every manual scenario and routing prompt receives an observed row, or a specific blocker is recorded rather than inferred (sk-create-manual-testing-playbook/SKILL.md:297-312, 354-360).
- **NFR-R02**: The parent and each child status agree with the evidence in its acceptance criteria before the recursive strict gate runs (validation-rules.md:68-93).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty playbook scenario or missing indexed file: stop that scenario and record the exact missing path; do not report a package-wide pass as scenario execution.
- Maximum parent goal size: `goal.cjs packet` must report `packet_budget=ok`, and the parent goal must remain within the 4,000-character durable-slice limit (validation-rules.md:683-702).
- Missing child goal: require the Phase 006 conformance check and `test -f` on every goal path in the target's live phase map.

### Error Scenarios
- Advisor or compiled-route command failure: record its output and exit status; do not infer a route (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:177-180).
- Unavailable README or Human Voice validator: record the exact blocker and leave the related acceptance criterion unmet.
- Recursive validator failure: repair only in-scope documentation or keep closeout blocked; do not waive a criterion without an existing decision record (validation-rules.md:78-93).

### State Transitions
- An already-fixed candidate goal gap is not a reason to force a new edit. Select another packet only if a live, genuine goal-authoring need is verified.
- A failed phase criterion remains open until observed evidence satisfies it or an approved decision record changes it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | Not rescored | This child inherits Level 2 and the parent packet's phase scope. |
| Risk | Not rescored | No new level decision is made in this phase. |
| Research | Not rescored | The parent specification, goal contract and verified audits define the inputs. |
| **Total** | **Not rescored** | **Level 2 inherited.** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- UNKNOWN: Does `sk-create-changelog` global component mode accept a nested component target such as `sk-doc/create-goal`? During execution, inspect its current contract and record the supported behavior. The direct mode changelog write and hub directory symlink do not depend on that answer (sk-create-changelog/SKILL.md:58-60, 184-190).
<!-- /ANCHOR:questions -->

---

---
