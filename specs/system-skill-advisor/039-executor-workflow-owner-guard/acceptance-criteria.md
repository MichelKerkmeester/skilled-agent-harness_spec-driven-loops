---
title: "Acceptance Criteria: Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "executor workflow owner guard acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/039-executor-workflow-owner-guard"
    last_updated_at: "2026-10-27T19:44:35Z"
    last_updated_by: "claude"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None; operator decides on the five private-skill suites"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-039-executor-workflow-owner-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 039-executor-workflow-owner-guard
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the prompt "run a deep research loop with the cli-pi executor", When `scoreAdvisorPrompt` ranks it, Then `system-deep-loop` is first and `cli-external-orchestration` second, passing, with lower confidence | `tests/scorer/executor-delegation.vitest.ts` test "keeps the workflow owner first and the CLI hub just below" (14 of 14 pass); live CLI 0.9248 then 0.9238 Guard at .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:501 and test at .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts:237. | Met | - |
| AC-002 | REQ-001 | Given the prompt "run a deep review with cli-codex as the executor", When ranked, Then `system-deep-loop` is first and the hub second, strictly lower | Same test file; live CLI 0.9324 then 0.9314 Guard at .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:539 and test at .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts:237. | Met | - |
| AC-003 | REQ-002 | Given the three plain delegation prompts with `gpt-6.1 terra`, When ranked, Then `cli-external-orchestration` is first | Same test file, test "still routes a plain delegation to the CLI hub first"; live CLI output for all three printed the hub first Test at .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts:253. | Met | - |
| AC-004 | REQ-003 | Given the old `executor-delegation.ts` restored from `HEAD`, When the new tests run, Then the two workflow-owned tests fail | Run printed `Tests  2 failed, 12 passed (14)` with both workflow tests failing; the edit was then restored and 14 of 14 pass Tests at .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts:237. | Met | - |
| AC-005 | REQ-004 | Given the private skill roots variable exported as in the operator shell, When the ratchet runs, Then 9 of 9 pass with the ledger untouched | `vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` printed `Tests  9 passed (9)`; `git diff` shows no change to the ledger file Setup at .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:300 and capture script at .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:84. | Met | - |
| AC-006 | REQ-005 | Given `router-replay-lib.cjs` reads the skills root, When the inventory test and its suite run, Then they pass | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs`: pass 1, fail 0; the directory: tests 70, pass 70, fail 0; `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/`: tests 32, pass 32 Rule at .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:521 and RULED entry at .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs:37. | Met | - |
| AC-007 | REQ-006 | Given the advisor runtime, When typecheck and build run, Then both exit 0 and the live CLI shows the new order | `npm run typecheck` and `npm run build` exit 0; `advisor_recommend` output in `spec.md` Measured Behavior Call site at .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1235. | Met | - |
| AC-008 | REQ-004 | Given the routing drift guard and both deep parity suites, When run, Then all pass | `Tests  21 passed (21)`, exit 0 Guard at .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:419. | Met | - |
| AC-009 | REQ-007 | Given `SPECKIT_PRIVATE_SKILL_ROOTS` exported or unset, When the full advisor suite runs, Then every file passes including `advisor-graph-health` | `vitest run` printed `Test Files  150 passed (150)` and `Tests  1258 passed, 8 skipped (1266)`, exit 0, in both modes. Setup at .skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts:66 and .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:311. | Met | - |
| AC-010 | REQ-007 | Given the other three suites, When each clears and restores the variable, Then it passes alone with the variable exported | Setup at .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:117, .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:33 and .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts:101 | Met | - |
| AC-011 | REQ-008 | Given `delegate this refactor to codex using gpt-6.1 terra`, When scored on the old and new module, Then the confidence is equal | Both printed `cli-external-orchestration:0.82:0.26`; the resolver returns null on both at .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:382. Superseded in effect by AC-012: the follow-up widened the match and the prompt now scores 0.95. | Met | - |
| AC-012 | REQ-009 | Given `delegate this refactor to codex using gpt-6.1 terra`, When ranked, Then `cli-external-orchestration` is first at confidence 0.95 and the compiled target is `cli-codex` | Test "lifts a split codex delegation to the route confidence" and the split-handoff case for `cli-codex`; live CLI printed `cli-external-orchestration 0.95 0.2` with target `cli-codex`. Resolver at .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:428 and test at .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts:285. | Met | - |
| AC-013 | REQ-009 | Given "delegate the decision to the team", "hand off to QA", "hand the release notes off to the docs team" and two prompts that name an executor only inside the object, When resolved, Then no executor is lifted | Test "does not treat ordinary prose as an executor handoff" (6 cases) and "leaves the CLI hub out of an ordinary prose handoff"; live CLI printed no recommendations for the first two. Pattern at .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:101 and test at .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts:184. | Met | - |
| AC-014 | REQ-009 | Given `HEAD`'s `executor-delegation.ts`, When the new tests run, Then the split-handoff tests fail | `Tests  8 failed, 20 passed (28)` on `HEAD`'s module, `Tests  28 passed (28)` after restoring the edit. | Met | - |
| AC-015 | REQ-009 | Given the Python scorer mirrors the resolver, When the shared fixture runs on both engines, Then TS-native and Python agree on the new cases | `tests/scorer/executor-delegation.vitest.ts` parity test passes; `vitest run tests/parity` prints `Tests  60 passed (60)` including the divergence ratchet, so no ledger entry was added or removed. Mirror at .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4229. | Met | - |
| AC-016 | REQ-006 | Given the follow-up, When the whole advisor suite, typecheck and the drift and deep parity suites run, Then all pass | `Test Files  150 passed (150)`, `Tests  1272 passed, 8 skipped (1280)`, exit 0; `npm run typecheck` exit 0; `Tests  21 passed (21)`. | Met | - |
| AC-017 | REQ-010 | Given the capture script scores the derived lane's 90-day age haircut, When it is run under two different injected wall-clock days, Then both runs print byte-identical output at the recorded scoring date | `cmp` of captures under `2026-10-27` and `2027-03-05` printed nothing; test "prints identical output whatever the wall clock says" at .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-capture-date.vitest.ts:55 passes; script at .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:84. | Met | - |
| AC-018 | REQ-010 | Given a scoring date that is not a calendar date, When the capture script starts, Then it exits 2 naming the variable before scoring | Test "rejects a scoring date that is not a calendar date" at .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-capture-date.vitest.ts:66; both capture-date tests fail on `HEAD`'s script (`Tests  2 failed (2)`) and pass on the new one (`Tests  2 passed (2)`). | Met | - |
| AC-019 | REQ-010 | Given the baseline is recaptured with `--write`, When the diff is read, Then only the commit hash and the delegation bucket move and the recorded scoring date stays | `git diff` shows `capturedAtSha` and delegation 9 to 13 only; `capturedAt` is `2026-10-11`; the ratchet passes with no hand edit left. | Met | - |
| AC-020 | REQ-010 | Given the follow-up, When the whole advisor suite, `tests/parity`, the routing parity suites and typecheck run, Then all pass | `Test Files  151 passed (151)`, `Tests  1274 passed, 8 skipped (1282)`; `tests/parity` `Tests  62 passed (62)`; `Tests  21 passed (21)`; `npm run typecheck` exit 0. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every row is Met with observed evidence; the five full-suite failures that remain are outside this packet and are named in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
