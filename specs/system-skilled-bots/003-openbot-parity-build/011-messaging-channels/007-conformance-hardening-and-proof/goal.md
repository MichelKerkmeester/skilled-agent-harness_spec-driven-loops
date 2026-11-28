---
title: "Goal: Phase 7: conformance-hardening-and-proof"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "conformance hardening and proof goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof"
    last_updated_at: "2026-11-28T18:00:00Z"
    last_updated_by: "unit-orchestrator-011-007"
    recent_action: "Built and verified the conformance suite and the documents"
    next_safe_action: "Merge the unit branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo09-011-007-conformance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: conformance-hardening-and-proof

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the messaging channels phase on evidence: the five numbered conformance rules over every cell of the capability matrix through one driver, three hardening cases, the third-party notices, the operator reference and the catalog lines and the recursive validator over all eight folders.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The capability matrix is the input, and one case exists for every transport and operation: 25 in all. |
| D2 | A failing case is fixed in the child that owns the module, and this child changes no runtime module. |
| D3 | The operator reference is built from `../002-adapter-and-record-contracts/design/operator-runbook.md` and keeps its Signal UNKNOWN. |
| D4 | No tinychannels code is copied, so no notice names it. |
| D5 | Each case runs the real transport over a fake platform that stands where the provider's API stands and records each wire call. The scripted fake transport of child 003 is not the conformance fixture. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-conformance.vitest.ts -t "^R2 "` prints `Tests  18 passed`.
- [x] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [x] `cd .skilled/skills/system-skilled-bots/runtime && npm run typecheck` exits 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels --strict --recursive` prints `RESULT: PASSED`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof --strict` prints `RESULT: PASSED`.
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
| Build | Built 2026-11-28, recursive strict 8 of 8 PASSED | Conformance file `Tests  29 passed (29)`, `-t "^R2 "` 18 passed, `-t "^hardening "` 3 passed, suite 57 files and 794 tests passed against the 56 and 765 floor, typecheck exit 0, cargo exit 0, four acceptance rows Met |

### Deviations and findings

| Item | Note |
|------|------|
| Tasks moved from the pre-expansion list | T006, T041, T043 to T049, T061, T062, T068 and T073. Each new task names its old id. |
| The fake transport | The work order places it here. Child 003 creates it, because every test from 003 on needs it and this child adds the matrix driver. |
| The fixture rule, amended on 2026-11-27 | D5 follows `plan.md` and `../002-adapter-and-record-contracts/design/conformance-rules.md` section 2. The fake transport in the row above stays for the queue and verb tests of children 003 and 004. The conformance cases and the hardening cases run over the fake platform. |
| The press hardening case | REQ-030 and AC-030 say a press from another sender is refused `answer-not-approver`. The frozen 001 catalog section 2 and `resolveLink` refuse it `channel-unlinked` with detail `sender mismatch`, in silence. The case asserts the catalog. Recorded for 014. |
| Lifted code | None. 011.005 and 011.006 lifted no third-party file, so the notices section says so. |
| Wave order | The docs tasks ran beside the test chain, split into seven single-file workers, under the operator's max-parallel order. |
<!-- /ANCHOR:log -->
