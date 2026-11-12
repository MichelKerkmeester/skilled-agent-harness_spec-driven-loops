---
title: "Feature Specification: Phase 4: name-file-in-plan-phase-lines"
description: "The phase example leaves target-file selection to the implementer. The authoring card repeats the fileless example, and the skill's entry sentence overstates when the card loads."
trigger_phrases:
  - "name file in plan phase lines"
  - "phase 4 name file in plan phase lines"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: name-file-in-plan-phase-lines

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-refuse-single-lineage-fanout-run |
| **Successor** | 005-point-chat-sessions-at-authoring-card |
| **Handoff Criteria** | The three source edits and generated snapshot are aligned; the focused snapshot test passes without update mode; strict child validation prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the parent packet that builds confirmed recommendations from the fresh-context plan-check research.

**Scope Boundary**: Change only the core plan template example, authoring-card example, system-spec-kit skill entry sentence, and the existing generated plan snapshot listed in Section 3. Do not edit the Vitest source, router, commands, hooks, other templates, or implementation summary.

**Dependencies**:
- The parent lists Phase 3 as the sequence predecessor and Phase 5 as the successor; this documentation update has no runtime dependency.
- Use the existing Vitest package and snapshot suite; add no dependency.

**Deliverables**:
- Matching phase examples that name a file for Setup, Implementation, and Verification.
- A skill entry sentence scoped to plan and implement requests.
- Regenerated plan snapshots and passing focused snapshot and child-packet validation checks.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The plan template's phase example describes actions without naming target files, so a fresh implementer must infer which file to change. The authoring card has a matching fileless example, and the skill's entry sentence says a write starts with the card even though its router loads the card for recognized plan and implement intents. The template example is pinned in generated snapshots, so a source-only edit would leave scaffold output stale.

### Purpose
Make each phase example name its file and state the card's plan and implement entry intent, so an implementer can identify the scoped files without guessing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c -F 'Setup counts the archives.' .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap
.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:1
.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap:4
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update the core plan template example so each one-line phase names the file it reads, changes, or exercises.
- Align the authoring-card example with the same file-naming pattern.
- Change the skill entry sentence to name plan and implement requests.
- Regenerate the existing golden snapshot entries for the plan template.

### Out of Scope
- Add a `Verify:` clause to plan-phase lines — task lines already own the command and proof contract (authoring-card section 7; `tasks.md.tmpl:53`).
- Change router intent keywords or generic write routing — this phase updates the existing plan and implement entry sentence only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` | Modify | Give each phase example a file path. |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modify | Align the matching phase example. |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Scope the card entry sentence to plan and implement requests. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Regenerate the rendered plan examples. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The core plan template and authoring-card examples name a file in each Setup, Implementation, and Verification sentence, while keeping each phase on one line and leaving command proof on task lines. | `rg -n 'Setup .*scripts/rotate-logs[.]sh.*Implementation .*scripts/rotate-logs[.]sh.*Verification .*scripts/rotate-logs[.]sh' .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` prints one matching line for each source. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The skill says a plan or implement request starts with the authoring card, and the generated snapshot reflects the template. | `rg -n -F 'A plan or implement request starts with `references/workflows/spec-authoring-card.md`.' .skilled/skills/system-spec-kit/SKILL.md` prints one line; the focused snapshot test passes without update mode. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The path-presence check in REQ-001 returns one line for the plan template and one for the authoring card.
- **SC-002**: The focused scaffold snapshot test passes without update mode, and strict validation prints `RESULT: PASSED` for this child packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing Vitest dev dependency in `.skilled/skills/system-spec-kit/runtime/cli/package.json` | Snapshot regeneration and comparison cannot run if the CLI package is unavailable. | Use the repository's existing targeted Vitest invocation; add no package. |
| Risk | Snapshot update rewrites unrelated stale entries in the shared snapshot file. | Medium | T005 checks that `git diff --numstat` reports exactly 4 added and 4 removed lines. Any other number blocks the task and goes to `goal.md` as an open question. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. This packet changes static documentation and generated snapshots, so it adds no runtime response-time path.
- **NFR-P02**: N/A. The packet adds no service or throughput surface.

### Security
- **NFR-S01**: N/A. The requirements add no authentication or authorization behavior.
- **NFR-S02**: N/A. The requirements add no data storage, credential handling or transport path.

### Reliability
- **NFR-R01**: N/A. The packet adds no service whose availability can be measured.
- **NFR-R02**: N/A. The packet adds no runtime request or error-rate behavior; T005 and T006 check the generated snapshot.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A. This documentation-only change consumes no runtime input.
- Maximum input: N/A. It defines no input size or cardinality limit; T006 checks the fixed plan-template snapshot output.
- Failure path: A snapshot mismatch or failed strict validation leaves the related acceptance criterion Unmet; T006 and T007 must report their specified pass results before closure.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Four existing outputs: the plan template, authoring card, skill entry and generated snapshot. |
| Risk | 13/25 | The wording affects future plan guidance and scaffold snapshots, with no runtime or data contract change. |
| Research | 16/20 | The plan example, card, skill entry, four snapshot pins and focused snapshot test contract must align. |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Snapshot freshness and the no-update run are resolved. T005's numstat printed 4 insertions and 4 deletions, and its phrase search printed 4. The recorded T006 run has exit=0, 12 tests passed and no obsolete or written snapshot lines (../scratch/build-evidence.md:152).
<!-- /ANCHOR:questions -->

---


