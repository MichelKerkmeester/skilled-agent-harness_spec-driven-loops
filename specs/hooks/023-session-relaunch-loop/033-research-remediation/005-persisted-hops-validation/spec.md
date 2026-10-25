---
title: "Feature Specification: Phase 5: persisted-hops-validation"
description: "shouldRelaunch trusts any finite persisted hop count, so null, strings, negatives and fractions pass the hop cap. This phase accepts only a non-negative integer number."
trigger_phrases:
  - "persisted hops validation"
  - "phase 5 persisted hops validation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: persisted-hops-validation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 (wave 1) |
| **Predecessor** | ../004-manual-claim-goal-binding/spec.md |
| **Successor** | ../006-relaunch-coverage-gaps/spec.md |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and the relaunch test suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the research remediation packet. It closes finding R5: a malformed persisted hop count slips past the hop cap. It sits in wave 1 and is independent of the other phases. Build order follows the wave order in `../spec.md`, not the folder order.

**Scope Boundary**: The hop check inside `shouldRelaunch` and its tests. The wrapper and the decline reason set stay as they are.

**Dependencies**:
- None. Every producer already writes hops as a number (see section 6).

**Deliverables**:
- A stricter hop check in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`.
- A table test in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`shouldRelaunch` reads `const hops = Number(record.hops)` and declines only when the result is not finite or reaches the limit (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1044-1047`). `Number(null)` is 0, `Number("3")` is 3, and -1 and 1.5 are finite, so a tampered or malformed record passes the cap. Tests cover only hops 9 and 10 (`relaunch-core.test.cjs:841-860`), and the wrapper validates its own env count (`.skilled/bin/skilled-loop:642-645`) but never the record.

### Purpose
A relaunch record whose hop count is not a non-negative integer never relaunches.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept hops only when `typeof record.hops === 'number' && Number.isInteger(record.hops) && record.hops >= 0`.
- Return `{ relaunch: false, reason: 'hop-cap' }` for anything else.
- A failing-first table test named "shouldRelaunch declines malformed persisted hops".

### Out of Scope
- The `skilled-loop` wrapper - it already validates its env count and reads only the decline reason.
- New decline reasons - reusing `hop-cap` keeps every consumer unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Tighten the hop check in `shouldRelaunch` |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Add the malformed-hops table test and a hops 0 case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A persisted hop count that is not a number type declines. |
| REQ-002 | A negative or fractional count declines. |
| REQ-003 | null, NaN and Infinity decline. |
| REQ-004 | Valid counts under the limit still relaunch and the limit still declines. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The decline reason stays `hop-cap`, so the wrapper needs no change. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** an armed record with hops -1, 1.5, null, "3", NaN, Infinity or `undefined`, **When** `shouldRelaunch` runs with limit 10, **Then** each returns `relaunch: false`, reason `hop-cap`; `undefined`, NaN and Infinity are green before the change. Verify: table test, red before for -1, 1.5, null and "3".
- **SC-002**: **Given** hops 0 and 9 with limit 10, **When** it runs, **Then** it relaunches. Verify: test.
- **SC-003**: **Given** hops 10, **When** it runs, **Then** it declines. Verify: existing test unedited; no existing test changes (a full-suite run with the strict rule preloaded passed 868/868).
- **SC-004**: **Given** the producers, **When** read, **Then** each writes hops as a number. Verify: file:line in the implementation summary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Producers of `hops`: `preparePending` default `hops = 0` (`relaunch-core.cjs:734-766`, default at :741, record field at :756) and the CLI prepare path, which parses `SKILLED_LOOP_HOPS` to a checked integer (`bin/session-relaunch.cjs:496-532`) | A string producer would break every relaunch | Builder rereads both before choosing the number-type rule and stops if either writes a string |
| Risk | A producer that writes a string makes every relaunch decline | High | The producer check above, recorded as AC-004 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The check stays a constant-time type and integer test with no I/O.

### Security
- **NFR-S01**: A hand-edited or tampered record cannot reset or bypass the hop cap.

### Reliability
- **NFR-R01**: Valid records written by current producers relaunch exactly as before.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Hops 0: relaunches.
- Hops at the limit: declines with `hop-cap`.
- Hops missing (`undefined`): already declines today (`Number(undefined)` is NaN) and keeps declining; no behavior change. Every record has carried hops since the first commit, and a record over 10 minutes old declines as stale before the hop check.

### Error Scenarios
- Numeric string such as "3": declines rather than being coerced.
- null: declines rather than becoming 0.

### State Transitions
- NaN, Infinity, -1 and 1.5: each declines with `hop-cap`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One function, one test file, a few lines |
| Risk | 6/25 | Touches the relaunch gate; producers already checked |
| Research | 2/20 | Producer reads only |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Producers write numbers, so the number-type rule is safe to adopt.
<!-- /ANCHOR:questions -->
