---
title: "Goal: Phase 20: dsh-direct-writer-gateway"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh direct writer gateway goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/020-dsh-direct-writer-gateway"
    last_updated_at: "2026-11-14T22:20:26Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 20: dsh-direct-writer-gateway

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every row the dispatch failure writer, the receipt write failure writer and the post-dispatch executor audit produce on a ledger-backed deep-loop state log survives the next projection refresh, and a state log with no ledger beside it gets the same rows as today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator chose on 2026-11-14 to route these three writers through the append gateway, reusing phase 019's `ledgerModeFor` and `appendThroughGateway` |
| D2 | Review carries both failure rows whole under the existing `deep_review.iteration_recorded` stem. Research gets two new reducer-read stems, `deep_research.dispatch_failure` and `deep_research.dispatch_receipt_write_failed` |
| D3 | On a ledger-backed log the post-dispatch audit records the executor on the iteration's opening row through `writeFirstRecordExecutor`, never by editing a row the ledger already holds |
| D4 | A failure path never throws: with no session id or a gateway refusal, the row is written directly and stderr says the next refresh drops it |
| D5 | Each writer has a test that opens a real run through the gateway, writes the row, triggers a refresh and reads the row back, for review and for research |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/executor-audit-ledger-projection.vitest.ts` prints `Tests  85 passed (85)`
- [x] `npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/check-ledger-stem-producers.vitest.ts` in the same folder prints `Tests  62 passed (62)`
- [x] `npm run typecheck` in the same folder exits 0, and `node scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Plan | Done | `plan.md` holds 43 counted edits, a runner script and a contract regeneration. The count script printed `edits=43` and exited 0 at `216ba55452` |
| Plan check on a clone | Done | On an APFS clone of `216ba55452` with every edit applied, the two named files printed `Tests  85 passed (85)`, the typecheck exited 0 and the drift check printed `[CONTRACT DRIFT] OK commands=3` |
| Build | Pending | Not started |
| Build | Done | 2026-11-15: 43 planned edits and the E15 script applied on origin/main 23f6583b89. The two faults from the 019 live review were added and fixed: stdin read only for upsert --events - with an EAGAIN retry, and every deep loop save runs full-auto. Full suite 2929 passed and 8 skipped of 2937. Released as v1.6.28.0 |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 019 landed mid-plan | It was committed as `55d2f35341` while this plan was written. Its runtime is byte-identical to the uncommitted tree the first baselines ran on |
| The audit step was declarative | `record_executor_audit` named a target, a field and a value, not a call, so routing it through the gateway also means naming `appendExecutorAuditToLastRecord` in the four workflows |
| Dedup broke on the ledger path | The projection writes objects back with sorted keys, so the old `JSON.stringify` comparison never matched a row read back. The plan compares by content |

Open question: should review get a dedicated failure stem instead of reusing `deep_review.iteration_recorded`? The plan reuses it.
Open question: thread the session id through all sixteen runner calls, or accept the gateway's default `run-cli` scope for failure rows? The plan threads it.
Open question: do `verification_degraded`, `containment_violation` and `containment_contested`, which also write straight into the state log, get a phase of their own?
Open question: should `validateIterationOutputs` accept the executor from the opening row, and should the research prompt pack stop saying the workflow patches the iteration record?
Open question: does this phase get its own hub changelog and version bump?
<!-- /ANCHOR:log -->
