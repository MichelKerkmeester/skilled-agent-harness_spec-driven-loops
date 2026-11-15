---
title: "Feature Specification: Phase 21: dsh-remaining-direct-writers"
description: "Three more deep-loop writers append straight into a state log the append gateway rebuilds from its ledger, so a failed code verification and both write-containment findings vanish at the next refresh. The documented executor check also misses the executor on the opening row, and the research prompt pack still says the workflow patches the iteration record. This phase closes all five."
trigger_phrases:
  - "dsh remaining direct writers"
  - "phase 21 dsh remaining direct writers"
  - "verification degraded row lost on refresh"
  - "containment violation row gateway"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: dsh-remaining-direct-writers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/398-dsh-remaining-direct-writers` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-dsh-direct-writer-gateway |
| **Successor** | None |
| **Handoff Criteria** | The survival and executor tests pass and fail on the old sources, the typecheck exits 0, the stem census prints `"registered":91` and the contract drift check prints `[CONTRACT DRIFT] OK commands=3` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the DeepSeek Harness creation specification. Phase 020 routed three writers through the append gateway and listed what it left undone in its section 7. The operator asked on 2026-11-15 to fix all of it.

**Scope Boundary**: the `verification_degraded`, `containment_violation` and `containment_contested` writers, the `executor_missing` check in `validateIterationOutputs` and one sentence of the research prompt pack. Nothing else changes.

**Dependencies**:
- Phase 020 committed as `6bf2594282`, because this phase reuses its `ledgerModeFor` and `appendFailureRow` helpers

**Deliverables**:
- The three writers hand their rows to the gateway on a ledger-backed state log, with one survival test per writer for review and research
- The executor check accepts the executor from the iteration's opening row on a ledger-backed log
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In a deep review or deep research run, the JSONL state log beside a `deep-review-ledger/frames` or `deep-research-ledger/frames` folder is a projection the append gateway rewrites from the ledger after every append. `validateIterationOutputs` writes its `verification_degraded` row straight into that file and `enforceWriteContainment` does the same with its `containment_violation` and `containment_contested` rows, so each is gone one append later. On the same log the executor audit records the executor on the iteration's `iteration_start` row, yet the `executor_missing` check reads only the iteration record and fails a run that named its executor.

### Purpose
On a ledger-backed state log, every row these three writers produce reaches the ledger and is still in the state log after any later refresh. The executor check finds the executor where the audit put it, and a state log with no ledger beside it behaves exactly as today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
A scratch script opened a real review run and a real research run through the gateway, called each writer, then appended an iteration record through the gateway. It ran against this worktree at `73a8a2d9c1` on 2026-11-15.
```text
$ node --import <tsx> scratchpad/probe/measure.mts <worktree>
review: validate=verification_degraded verification_degraded rows before refresh=1 after refresh=0
review: containment_violation rows before refresh=1 after refresh=0; containment_contested rows before refresh=1 after refresh=0
review: opening row names executor=true; validate with executorKind=executor_missing
review: gateway on a raw verification_degraded row: 1 {"ok":false,"phase":"runtime","reason":"Unrecognized event format: expected object with stem or event_type","code":"RUNTIME_ERROR"}
research: validate=verification_degraded verification_degraded rows before refresh=1 after refresh=0
research: containment_violation rows before refresh=1 after refresh=0; containment_contested rows before refresh=1 after refresh=0
research: opening row names executor=true; validate with executorKind=executor_missing
research: gateway on a raw verification_degraded row: 1 {"ok":false,"phase":"runtime","reason":"Legacy deep-research record refused: unknown-legacy-record","code":"RUNTIME_ERROR"}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hand the `verification_degraded`, `containment_violation` and `containment_contested` rows to the append gateway when the state log sits beside ledger frames, through phase 020's `appendFailureRow`, and write them directly as today otherwise.
- Carry the three rows in review whole under the existing `deep_review.iteration_recorded` stem, and in research under three new reducer-read stems, `deep_research.verification_degraded`, `deep_research.containment_violation` and `deep_research.containment_contested`.
- Pass the run's session id to all twelve `enforceWriteContainment` calls and to the four `post_dispatch_validate` steps in the review and research workflows.
- Let the `executor_missing` check accept the executor from the iteration's opening `iteration_start` row on a ledger-backed state log.
- Reword the research prompt pack sentence that says the workflow patches the iteration record with the `executor` block.

### Out of Scope
- A changelog and a version bump - the caller releases the phase.
- `verify-iteration.cjs`, the executed post-dispatch gate - it does not read the executor, so item 4 changes only the documented validator.
- The review loop protocol, which also places the executor block on the iteration record - the operator named the research sentence only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Export `ledgerModeFor` and `appendFailureRow` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts` | Modify | `sessionId` on the input and the degraded row through `appendFailureRow`. The executor check reads the opening row |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | `sessionId` on the input, and both containment rows through `appendFailureRow` on a ledger-backed log |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modify | The review gateway accepts the three rows under `deep_review.iteration_recorded` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts`, `deep-research-ledger-schema.ts`, `legacy-compatibility.ts` | Modify | Register the three research stems, their fields and their upcast |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modify | Write the three rows back in the writers' key order |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Modify | Route the three stems to no plane |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modify | Each containment call and each validate step names the session id |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modify | The executor sentence |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modify | The same executor sentence in the review protocol, added on 2026-11-15 |
| `.skilled/skills/system-deep-loop/changelog/v1.6.29.0.md`, and the version in the hub `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` | Create, Modify | The release |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown`, `deep-ai-council.contract.markdown` | Regenerate | The contracts pin the workflow and prompt pack digests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts` | Modify | Survival tests per writer and mode, the no-session fallback and the opening-row executor check |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts` | Modify | Fixtures and round-trip cases for the three stems |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts` | Modify | The pinned census counts 91 registered and 68 reserved |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment-yaml-call-sites.vitest.ts` | Modify | Every containment call site passes a session id |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `verification_degraded` row on a ledger-backed state log with a session id survives a refresh, in review and in research | The two `keeps the ... verification_degraded row` cases in `executor-audit-ledger-projection.vitest.ts` pass, and fail on the old sources |
| REQ-002 | The `containment_violation` and `containment_contested` rows on a ledger-backed state log survive a refresh, in review and in research | The two `keeps the ... containment rows` cases pass, and fail on the old sources |
| REQ-003 | On a ledger-backed state log the `executor_missing` check accepts an executor on the iteration's opening `iteration_start` row | The two `accepts the ... executor from the opening row` cases pass, and fail on the old sources |
| REQ-004 | A state log with no ledger beside it gets the same rows and verdicts as today | `post-dispatch-validate.vitest.ts`, `write-containment.vitest.ts` and `dispatch-failure.vitest.ts` pass with no test changed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A diagnostic write never throws. With no session id, or when the gateway refuses, the row is written directly and one stderr line says the next refresh drops it | The `writes a containment row straight into a ledger-backed log` case passes |
| REQ-006 | Research carries the three rows losslessly: the projection writes back the same fields in the same key order | The three new round-trip cases in `deep-research-ledger-schema.vitest.ts` pass |
| REQ-007 | Every containment call and every validate step in the four workflows names the run's session id, and the compiled contracts match | The call-site test passes and `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` |
| REQ-008 | The research prompt pack says the executor lands on the iteration's opening `iteration_start` row | `rg -c 'patches the first canonical' .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` prints 0 |
| REQ-009 | The three research stems are registered and declared reserved | `check-ledger-stem-producers.cjs` prints `"ok":true` with `"registered":91` and `"reserved":68`, and `npm run typecheck` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new test in `executor-audit-ledger-projection.vitest.ts` fails with the source edits stashed and passes with them applied.
- **SC-002**: The full deep-loop suite fails no test in a changed file or one that loads a changed module, against a baseline of 2928 passed, 1 timing failure and 8 skipped.
- **SC-003**: `npm run typecheck` exits 0, and the stem census, projection coverage and append-site checks each print `"ok":true`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 020's `appendFailureRow`, committed as `6bf2594282` | Without it each writer needs its own gateway path | The helper is exported and reused, not copied |
| Risk | Each diagnostic row now spawns the gateway on a ledger-backed log, about one second per row | Low | Only a failed verification or a containment finding pays it, and phase 020 accepted the same cost |
| Risk | A ledger that holds one of the three new research stems does not replay on a runtime without them | Med | The stems are additive. Reverting needs a ledger with none of them, which `plan.md` section 7 checks |
| Risk | `write-containment.ts` must stay loadable under plain Node, which cannot load `executor-audit.ts` | Med | It loads the helper through a guarded top-level `import()` that yields null under plain Node, where no caller passes a state log |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should review carry these rows under dedicated stems? Decision: no. `deep_review.iteration_recorded` already carries any record whole, as phase 020 chose for the failure rows.
- Should the executor check also accept the opening row on a state log with no ledger? Decision: no. That log still gets the post-dispatch patch, so the check there stays as strict as today.
<!-- /ANCHOR:questions -->

---
