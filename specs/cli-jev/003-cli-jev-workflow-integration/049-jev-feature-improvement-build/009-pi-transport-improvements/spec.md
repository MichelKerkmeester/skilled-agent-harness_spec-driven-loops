---
title: "Feature Specification: Build: improve the Jev Pi native classifier transport (037)"
description: "The transport honors the caller's provider, can always be switched off, costs one runtime per process, and its benchmark can run both arms fresh the same day."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Build: improve the Jev Pi native classifier transport (037)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/009-pi-transport-improvements` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 12 |
| **Predecessor** | 008-folder-suggestion-improvements |
| **Successor** | 010-completion-claims-improvements |
| **Handoff Criteria** | Every completion criterion in `goal.md` is checked with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Build the recommendations from 048's research for each kept Jev feature, and fix the deep-research workflow faults found while running it specification.

**Scope Boundary**: The recommendations listed in scope below, from `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/research/research.md`. Corpus, label and default-on work stays out.

**Dependencies**:
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/009-pi-transport-research/research/research.md` ranks the recommendations

**Deliverables**:
- Make the benchmark's same-day paired run work, and record per-call usage, backend, prompt digest and raw counts
- Preserve provider intent, or refuse the Pi route when another provider is asked for
- Let `JEV_TRANSPORT=jev` override a per-call `pi` option
- One re-measure recorded in `goal.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Feature 037 adopted the Pi transport by one row, on a comparison whose CLI arm was a day older and used another provider. The adapter drops the caller's `--provider` and pins OpenRouter `typesafe/jev-1.13`, a per-call `pi` option outranks the `JEV_TRANSPORT` kill switch, and the runtime is rebuilt on every call.

### Purpose
The transport honors the caller's provider, can always be switched off, costs one runtime per process, and its benchmark can run both arms fresh the same day.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: Make the benchmark's same-day paired run work, and record per-call usage, backend, prompt digest and raw counts
- R2: Preserve provider intent: map each jev provider to the Pi classifier on the same host (`official` to Pi `typesafe`/`jev-latest`, `openrouter` to Pi `openrouter`/`typesafe/jev-1.13`), and keep any other provider on the CLI
- R3: Let `JEV_TRANSPORT=jev` override a per-call `pi` option
- R4: Cache the runtime per process, pin the Pi version in the gate, preflight once per process and bound the combined Pi and CLI latency
- R5: Add a margin-gated escalation arm to the benchmark and confirm it on the paired rerun

### Out of Scope
- R6 labels on the ambiguous rows - new labels, per 003 D4
- R7 adoption by more callers - other owners, one per later phase
- R9 `noul` and `score` arms and R10 default-on - new measurement and default-on, per 047 D6

### Files to Change

| File Path | Change Type | Description |
| ----------- | ------------- | ------------- |
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Modify | Provider handling, kill-switch precedence, runtime cache, version pin, preflight, latency budget |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | Modify | Cases for each new behavior |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | Modify | Paired run, usage and digest records, escalation arm |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs` | Modify | Cases for the paired run and the arm |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/README.md` | Modify | The provider map and the paired-provider choice |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` | Modify | Gate rows for the mapped Pi classifier |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` | Modify | Gate rows for the mapped Pi classifier |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-comparison.md` | Modify | Paired run on the official host |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-001 | A call takes the Pi route only on the Pi classifier for its own jev provider: `official` maps to Pi `typesafe`/`jev-latest`, `openrouter` to Pi `openrouter`/`typesafe/jev-1.13`, and any other provider stays on the CLI. | Tests assert each mapping and that `vercel` and `custom` take the CLI route. |
| REQ-002 | `JEV_TRANSPORT=jev` sends a call to the CLI even when the caller passes `pi`. | A test asserts the CLI route. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
| ---- | ------------- | --------------------- |
| REQ-003 | The runtime is built once per process, and the Pi gate pins its version. | A test counts runtime builds over three calls and asserts a version mismatch skips Pi. |
| REQ-004 | The benchmark records per-call usage, backend and prompt digest, and judges on raw counts. | A test reads each from a fixture run. |
| REQ-005 | A same-day paired run with the escalation arm is recorded, with both arms on the same host: the jev CLI on `official` and Pi on `typesafe`/`jev-latest`. | The verdict line and the arm's agreement sit in the goal log. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The kill switch always wins
- **SC-002**: No caller is silently moved to another provider
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| ------ | ------ | -------- | ------------ |
| Risk | Changing precedence breaks a caller that relies on the option winning | Low | Only two callers import the transport. Check both before the change |
| Dependency | `jev auth status` for the re-measure | Re-measure cannot run | Record the skip in the log; the code changes still close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scope follows 048's ranked table.
<!-- /ANCHOR:questions -->

---


