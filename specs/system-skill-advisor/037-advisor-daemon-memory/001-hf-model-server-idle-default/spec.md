---
title: "Feature Specification: Phase 1: hf-model-server-idle-default"
description: "The resident hf-local model server keeps its model loaded for as long as the launcher lives, because its idle timeout defaults to off. This phase measures the cold-start cost and then gives it a non-zero default, with 0 kept as the opt-out."
trigger_phrases:
  - "hf model server idle default"
  - "model server idle timeout"
  - "SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN default"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: hf-model-server-idle-default

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-21 |
| **Branch** | `main` (planning only) |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-lighter-advisor-launcher |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met or closed by a recorded decision, and strict validation of this folder prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Advisor daemon memory specification.

**Scope Boundary**: The default value of the model server idle timeout, its docs and its tests. How eviction works, and the advisor launcher itself, do not change.

**Dependencies**:
- The idle eviction already in `.skilled/bin/lib/model-server-supervision.cjs`, which today runs only when the variable is set.
- A measurement of the cold-start time of the first embedding after an eviction.

**Deliverables**:
- A measured cold-start figure recorded in the implementation summary.
- A non-zero default in `getModelServerIdleConfig`, with `0` still disabling eviction.
- Updated env docs and tests.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
With Ollama off, `EMBEDDINGS_PROVIDER=auto` resolves to hf-local, and the launcher keeps an hf-model-server process with its model loaded for every checkout. `getModelServerIdleConfig` (`.skilled/bin/lib/model-server-supervision.cjs`) returns `enabled: false` when `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` is unset, so the model stays in memory all day even when nothing embeds. The 2026-10-21 memory audit counted this as the largest resident cost of the advisor stack.

### Purpose
An idle model server unloads by default and comes back on the next embedding request, and an operator who wants it warm sets the variable to 0.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measure the time from an evicted server to the first embedding result, three runs, on this machine.
- Change the unset default in `getModelServerIdleConfig` from 0 to the chosen value, proposed 15 minutes.
- Keep `0` and negative values as "never evict", and keep invalid values falling back safely.
- Update `ENV-REFERENCE.md`, `.env.example` and the idle eviction tests.

### Out of Scope
- Changing how eviction or respawn works.
- The advisor launcher and advisor server processes; phase 002 owns those.
- The Ollama provider, which runs outside this repository.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/model-server-supervision.cjs` | Modify | New default in `getModelServerIdleConfig` |
| `launcher-model-server-idle-eviction.vitest.ts` | Modify | Default-enabled expectations instead of default-disabled |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Default column for the idle variable |
| `.env.example` | Modify | Commented default for the idle variable |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` unset, idle eviction is enabled with the chosen default. |
| REQ-002 | Setting the variable to `0` disables eviction, as it does today. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The cold-start cost after an eviction is measured before the default is chosen, and the number is recorded. |
| REQ-004 | `ENV-REFERENCE.md` and `.env.example` state the new default and the opt-out. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An idle launcher on this machine drops its model server after the default timeout, and the next advisor query embeds again.
- **SC-002**: The idle eviction tests pass with the new default.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The first query after an eviction is slow | Med | Measure first; choose a timeout long enough to cover a normal working pause |
| Risk | A test relied on eviction being off by default | Low | Update those expectations in the same change |
| Dependency | The existing respawn path after eviction | No reload | Covered by the current eviction tests |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The measured cold start is recorded, and the chosen default is justified against it.

### Security
- **NFR-S01**: No new input surface; the variable is read as before.

### Reliability
- **NFR-R01**: An invalid value never crashes the launcher; it falls back to the default.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Variable unset or blank: the new default applies.
- Variable `0` or negative: eviction stays off.

### Error Scenarios
- A non-numeric value: falls back to the default rather than disabling silently.

### State Transitions
- An eviction while a request is in flight: the existing eviction guard keeps working.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One default, its tests and two docs |
| Risk | 6/25 | Changes a resident-process default across every checkout |
| Research | 4/20 | One cold-start measurement |
| **Total** | **14/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is 15 minutes right, or should the measured cold start push it higher?
- Should a non-numeric value fall back to the default or to off? The current code treats it as off.
<!-- /ANCHOR:questions -->

---
