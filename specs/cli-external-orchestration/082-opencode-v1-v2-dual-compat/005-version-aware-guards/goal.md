---
title: "Goal: Phase 5: version-aware-guards"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "version aware guards goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/005-version-aware-guards"
    last_updated_at: "2026-10-18T12:45:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-version-aware-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: version-aware-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the dispatch guards classify an `opencode2` run and evaluate only the rules that fit its version, so that no rule blocks a v2 run it cannot satisfy.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | An unknown version runs both-version rules at their own severity and version-specific rules at `warn`, so a failed probe silences nothing and blocks nothing it cannot prove. |
| L2 | The resolver cache key is the realpath, size and mtime of the binary. |
| L3 | The v2 slash-prompt rule warns and does not block, until a live probe shows that `run` expands a slash message. |
| L4 | A path-qualified binary resolves to `unknown` with no probe. |
| L5 | A rule without an `appliesTo` list reads as both versions. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test --test-reporter=tap .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` exits 0 with `# fail 0`.
- [x] `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` exits 0, and its `opencode2 run` cases pass.
- [x] The `opencode2 run` cases failed on the pre-change code, as recorded in the log below.
- [x] Every guard suite in CHK-002 reports zero failures and a pass count at or above the baseline recorded in the log below.
- [x] A v2 slash-command fixture produces no violation with block severity.
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
| Planning documents filled | Done | `validate.sh --strict` output in the orchestrator report |
| Baseline counts recorded (T002) | Done | `scratch/base-vitest.txt:23` (91 passed), `scratch/base-rule-checks.txt:125` (20 pass) and `scratch/base-rule-checks.txt:126` (0 fail), `scratch/base-shared.txt:348` (57 pass) and `scratch/base-shared.txt:349` (0 fail), `scratch/base-source-root.txt:10` (7 pass) and `scratch/base-source-root.txt:11` (0 fail) |
| Red run recorded (T005) | Done | `scratch/red-rule-checks.txt:284-288` (4 of 25 failed), `scratch/red-audit.txt:9` (the audit file failed at load, so no per-case assertion was recorded) |
| Resolver landed (T006) | Done | `.skilled/hooks/dispatch/lib/opencode-version.mjs`, `scratch/fix-vitest.txt:23`, `scratch/review-findings.log:52` |
| Rule sidecar carries `appliesTo` (T007) | Done | `scratch/evidence.md:33` |
| Classifier and rule engine widened (T008 to T011) | Done | `scratch/fix-rulechecks.txt:7-13`, `scratch/fix-vitest.txt:23`, `scratch/review-findings.log:65` |
| Green run recorded (T012 and T013) | Done | `scratch/fix-vitest.txt:23` (110 passed), `scratch/fix-rulechecks.txt:31` (28 pass) and `scratch/fix-rulechecks.txt:32` (0 fail), `scratch/fix-shared.txt:348` (57 pass) and `scratch/fix-shared.txt:349` (0 fail), `scratch/fix-source-root.txt:10` (7 pass) and `scratch/fix-source-root.txt:11` (0 fail) |
| Cross-family review (T014) | Done | `scratch/review-findings.log:93` (4 P1 and 2 P2 findings, CHANGES REQUESTED) |
| Review fixes and input replay (T015) | Done | `scratch/replay-review-inputs.txt:1-6`, `scratch/evidence.md:26-30` |
| Final regression and drift guards (T017, run half) | Done | `scratch/fix-*.txt`, `scratch/drift-guards.txt:42`, `scratch/evidence.md:20-22` |
| Orchestrator test edit | Done | The `v2-slash-prompt-route` fixture pair in `CHECK_FIXTURES`, `scratch/after3-rulechecks.txt:39`, `scratch/after4-rulechecks.txt:22`, `scratch/evidence.md:39` |
| Phase docs closed from the evidence (T018) | Done | acceptance-criteria.md rows AC-001 to AC-003, `implementation-summary.md` |
| Same-class search and scoped `git status` (T016) | Done | `scratch/inventories.txt:25-44` (same-class search), `scratch/inventories.txt:11-15` (scoped status lines), `scratch/evidence.md:52` |
| `scratch/backup/` deletion (T017 and CHK-051) | Done | Deleted after the final regression runs (`scratch/evidence.md:53`) |
| Round 2 captures (T016, T017, CHK-013, CHK-FIX-002, CHK-FIX-003, CHK-FIX-007, CHK-030, CHK-050, CHK-051 and the CHK-022 partial note) | Done | `scratch/evidence.md:44-60`, `scratch/inventories.txt`, `scratch/req007-v1-parity.txt:1-2` |

### Deviations and findings

| Item | Note |
|------|------|
| Runner split | `dispatch-audit.test.mjs` is a Vitest file. Run it with `npx vitest run`, not `node --test`. Running it under `node --test` fails at load time with a `TypeError`, and that failure is not an assertion. |
| Planning-time counts | Read-only, not the T002 record: `dispatch-rule-checks.test.mjs` 20 pass and 0 fail under `node --test`, and `dispatch-audit.test.mjs` 86 pass and 0 fail under Vitest. |
| Cache key conflict | The 005 brief says realpath and mtime. Research section 6 and the 006 brief say realpath, size and mtime. Default in L2: all three. Open question Q2 in spec.md. |
| Amendment to L1 | L1 first dropped v1-only rules on `unknown`. Q5 in spec.md now keeps them at `warn` instead, so a failed probe silences no rule. Plan rows R5 to R8 follow. |
| Orchestrator test edit | The enforcement guard needs a fixture pair for every check, and the new `v2-slash-prompt-route` check shipped without one. The orchestrator added the pair to `CHECK_FIXTURES`, test data only, and the review checks it. |
| Review outcome | `scratch/review-findings.log:93`: 4 P1 and 2 P2 findings under a CHANGES REQUESTED verdict. The fix round replayed the failing inputs against the real installed binaries and the final suites are green (`scratch/replay-review-inputs.txt:1-6`). |
| NFR-S01 amendment | The resolver probes the binary the command runs, and `OPENCODE_BIN` is the probe target only when the command runs `$OPENCODE_BIN` itself (`scratch/evidence.md:38`). |
| Q6 sync resolver | The async export stays for its timeout tests, and a synchronous sibling shares its cache for the synchronous callers (`scratch/evidence.md:37`). |
| Pre-existing Pi load failure | The one failed file in the Vitest run is `hooks/dispatch/pi/dispatch-preflight-lint.test.ts`, unchanged from the baseline and also failing on main (`scratch/evidence.md:10`, `scratch/evidence.md:16`). |
| Open item | `no-bare-agent-general` stays v1-only until a v2 probe shows whether `--agent general` is rejected (`scratch/evidence.md:42`). |
| Housekeeping closed in round 2 | T016's same-class search and scoped `git status` are in `scratch/inventories.txt`, `scratch/backup/` is deleted, and the checklist rows the round 2 evidence covers are now ticked in `tasks.md` (`scratch/evidence.md:52-53`). |
<!-- /ANCHOR:log -->
