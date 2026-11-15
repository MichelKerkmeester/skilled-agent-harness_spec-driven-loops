---
title: "Feature Specification: Phase 2: consume-locked-withdraw"
description: "Consume reads the relaunch record outside its lock, so a withdraw that lands between approval and consume is lost and the hop goes ahead. This phase moves the read, check and unlink into one lock and lets the wrapper decline a withdrawn record."
trigger_phrases:
  - "consume locked withdraw"
  - "phase 2 consume locked withdraw"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: consume-locked-withdraw

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 (wave 2) |
| **Predecessor** | ../001-model-effort-atomic-replay/spec.md |
| **Successor** | ../003-manual-claim-live-settings/spec.md |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and the test commands in `plan.md` pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the research remediation packet. It runs in wave 2, after phase 001 is Complete, and phases 004 and 006 follow it. The build order is the wave order in `../spec.md`, not the folder order.

**Scope Boundary**: The `consume` command in `bin/session-relaunch.cjs`, the approved path of `.skilled/bin/skilled-loop` and their tests. `shouldRelaunch` and the withdraw writer stay as they are.

**Dependencies**:
- Phase 001 (`../001-model-effort-atomic-replay/`) is Complete.

**Deliverables**:
- A consume that reads, checks and unlinks the record inside one `withAppendLock` call.
- A wrapper decline for a consume that reports `withdrawn: true`.
- Failing-first tests for both.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`consume` reads the relaunch record outside its lock (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:692`, `core.readRelaunchFile(loopId)`) and unlinks it later under `core.withAppendLock` (`:715-722`) without rechecking its status. A withdraw rewrites the record under that lock to `status: 'disarmed'` with a reason in `WITHDRAWN_DISARM_REASONS` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1021-1026`). The wrapper asks `should-relaunch` and then consumes in a separate call (`.skilled/bin/skilled-loop:667-729`, `consume_record` at `:72-79`), so a withdraw landing between approval and consume is lost and the hop goes ahead. The window is narrow: a hook firing as the runtime dies, or an operator `cancel` from another shell (research §9a). The decline path for a withdrawn record already exists at `skilled-loop:859-870`.

### Purpose
A hand-over withdrawn after the wrapper's approval can no longer relaunch, because consume reads, checks and removes the record in one locked step.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `consume` in `bin/session-relaunch.cjs` (about lines 689-730): read and unlink inside one lock, add `withdrawn: true` only for a withdrawn record.
- `.skilled/bin/skilled-loop` approved path (about lines 667-729) and a reader helper beside `consumed_note_state` at `:93`.
- Tests in `session-relaunch-cli.test.cjs`, `skilled-loop.test.cjs` and `withdraw.test.cjs`.

### Out of Scope
- `shouldRelaunch` - its verdict is correct when it runs; the race is after it.
- The withdraw writer - it already writes under the lock.
- The goal-switch question - phase 006 owns it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Read, check and unlink the record in one lock; add `withdrawn: true` for a withdrawn record |
| `.skilled/bin/skilled-loop` | Modify | Read `withdrawn` after `consume_record` and decline with the runtime's exit code |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Failing-first consume tests |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modify | Failing-first wrapper decline test |
| `.skilled/hooks/session-relaunch/tests/withdraw.test.cjs` | Modify | Withdraw then consume interleaving, if the builder needs it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | consume reads, checks and unlinks the record inside one lock. |
| REQ-002 | consume adds `withdrawn: true` only when the record it read is a withdrawn record. |
| REQ-003 | Output for every other record is byte-identical to today. |
| REQ-004 | The wrapper treats `withdrawn: true` on the approved path as a decline: withdrawn warning, no relaunch, the runtime's exit code. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | No hop line is written for a withdrawn decline. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A record withdrawn before consume never relaunches.
- **SC-002**: The exact-shape consume tests pass with unedited expectations.

### Acceptance Scenarios

- **AC-001**: **Given** a record disarmed with a withdrawn reason, **When** `consume` runs, **Then** its JSON holds `withdrawn: true` and the record file is gone. Verify: CLI test, red before.
- **AC-002**: **Given** an armed record, **When** consume runs, **Then** the output has no `withdrawn` key and the exact-shape tests pass with unedited expectations. Verify: `session-relaunch-cli.test.cjs`.
- **AC-003**: **Given** the wrapper got `relaunch: true` and the record is withdrawn before consume (test barrier or stub), **When** the wrapper continues, **Then** it prints the withdrawn warning, starts no second runtime and exits with the runtime's code. Verify: `skilled-loop.test.cjs`.
- **AC-004**: **Given** that withdrawn decline, **When** the hop history is read, **Then** it holds no `handed-over` line. Verify: test on the history file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 Complete | This phase waits | Build in wave order |
| Risk | The lock is held across a slow note read | Med | Read and unlink the record inside the lock; parse the note after it, outside the lock |
| Risk | The approved path in the wrapper is long | Med | Place the check right after `consume_record` and before any `consumed_note_state` use |
| Risk | An always-present `withdrawn` field breaks exact-shape tests (~1685, 1706, 1946, 2445, 2507) | High | Add the key only for a withdrawn record |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The lock covers only the record read and the unlink; no note file read happens inside it.
- **NFR-P02**: No added process spawn on the approved path beyond the existing consume call.

### Security
- **NFR-S01**: No new input surface; `--loop-id` handling is unchanged.
- **NFR-S02**: The record file is removed in every consume outcome, withdrawn or not.

### Reliability
- **NFR-R01**: A withdraw and a consume racing on one record give one outcome: the withdraw wins if it took the lock first.
- **NFR-R02**: The new tests are deterministic, using a barrier or stub instead of timing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing record file: consume keeps today's output, with no `withdrawn` key.
- Disarmed record with a reason outside `WITHDRAWN_DISARM_REASONS`: not withdrawn, output unchanged.
- Unreadable record JSON: today's behavior, no `withdrawn` key.

### Error Scenarios
- Consume fails or prints no JSON: the wrapper keeps its existing warning path.
- Unlink fails with an error other than ENOENT: it still throws, as today.
- Concurrent access: the withdraw and consume share `withAppendLock`, so one waits for the other.

### State Transitions
- Withdraw after consume took the lock: the record is gone and the withdraw finds nothing, as today.
- Withdraw before consume: consume reports `withdrawn: true` and the wrapper declines.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two code files, three test files, under 100 LOC |
| Risk | 12/25 | Lock ordering and an output shape other tests pin |
| Research | 4/20 | Root cause already traced in the parent research |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. The goal-switch question belongs to phase 006.
<!-- /ANCHOR:questions -->

---


