---
title: "Implementation Summary"
description: "Phase 13 is complete. ANCHORS_VALID now reports nesting, with an adr-NNN allowance, and duplicate closers. Nesting shipped as a warning first and is an error since the corpus census reached zero nested documents. The registry and the rules doc describe the same checks."
trigger_phrases:
  - "anchor contract alignment implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment"
    last_updated_at: "2026-10-09T11:20:00Z"
    last_updated_by: "closeout-worker"
    recent_action: "Third closeout pass: citations re-checked after the simplification pass, gate re-cited to tree5"
    next_safe_action: "None. Ship after or with 011's un-nesting commit"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json"
      - ".skilled/skills/system-spec-kit/references/validation/validation-rules.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-anchor-contract-alignment |
| **Status** | Complete |
| **Completed** | 2026-10-09 |
| **Level** | 2 |
| **Not committed** | The working tree holds this change. The closeout did not commit or push |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is **complete**. ANCHORS_VALID checks three things it did not check before: an anchor opened inside another one, a closer that arrives before its opener or while another anchor is still open, and a name closed more times than it is opened. The registry description and `validation-rules.md` section 6 describe the same checks.

- **Nesting check.** `anchorNestingFindings()` makes a stack pass over each document's anchor markers. An open inside another anchor is reported, except an `adr-NNN-*` child inside its `adr-NNN` parent. The decision-record template nests that way by design. A repeated open of an id already on the stack is left to the duplicate-anchor finding, so one defect is reported once.
- **Inline code is ignored by the nesting pass only.** `stripInlineCode()` blanks backtick spans before the nesting pass. The missing, unpaired, duplicate and never-opened checks still count markers in inline code. This follows an operator decision (see Deviations).
- **Duplicate closers.** A name closed more times than it is opened is an error, reported inside `validateAnchorIntegrity()`. A name that is closed but never opened keeps its single existing finding.
- **Severity.** Nesting findings are an error. The `ANCHOR_NESTING_SEVERITY` constant (orchestrator.ts:106, `'error'` since step B) carried that until 2026-10-09. The simplification pass removed it, and the nesting findings now join the error entry in `validateAnchorIntegrity()` at orchestrator.ts:846-851. It was `'warn'` during step A.
- **Registry and rules.** `validator-registry.json:109` and `validation-rules.md` section 6 (with the summary row at line 58) name the same scope, carve-outs, messages, severity and allowance.
- **Fixtures and tests.** New fixtures `078-anchors-nested-questions`, `079-anchors-adr-allowance` and `080-anchors-duplicate-closer`. `003-valid-level2/spec.md` moves its `questions` anchor below the `nfr` block so it no longer nests. `tests/anchor-contract.vitest.ts` holds 11 cases.

### Files Changed (this phase's share)

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Nesting pass, closer counts, inline-code blanking, nesting findings in the error entry |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | ANCHORS_VALID description (line 109) |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Section 6 and the summary row at line 58 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts` | Create | 11 ANCHORS_VALID cases |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/078-anchors-nested-questions/` | Create | Nested questions layout |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/079-anchors-adr-allowance/` | Create | Decision record with an adr-001 child |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/080-anchors-duplicate-closer/` | Create | Questions closed twice |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md` | Modify | Questions anchor moved so the fixture does not nest |
| `scratch/anchors-baseline-step-a.{json,md}` | Create | Corpus baseline before any change |
| `scratch/anchors-baseline-step-b.{json,md}` | Create | Corpus after the severity flip, compared with step A |

The diff of orchestrator.ts and validation-rules.md holds only hunks from this phase.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:corpus-impact -->
## Corpus Impact

| Measurement | Packets | ANCHORS_VALID pass | warn | error | Nesting findings |
|-------------|---------|--------------------|------|-------|------------------|
| Step A baseline (committed validator, 2026-10-08) | 4,642 | 4,612 | 0 | 30 | 624 spec.md files carry the nested questions layout |
| Census before the flip (`gates/census3`, working tree) | 4,642 | 4,613 | 0 | 29 | 0 |
| Step B (`scratch/anchors-baseline-step-b.md`, working tree) | 4,642 | 4,613 | 0 | 29 | 0 |

Step B changed one packet's status, from error to pass: `z_archive/022-hybrid-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/merged-030-architecture-boundary-remediation`, a working-tree edit. The step B report measures the working tree, not HEAD, so the validator change is not isolated from the 2,083 modified spec files. Inferred, not measured: committed nested files would move from pass to error under this validator. One probe on committed `specs/agents/007-orchestrator-inline-authority/spec.md` shows three nesting errors, which supports that for one file.

<!-- /ANCHOR:corpus-impact -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Step A and step B were gated separately. Each step ran its own focused tests, and step B ran the corpus census before the flip.

### Whole-Tree Gate (tree5)

Run on 2026-10-09 against the final state, on the third closeout pass and after the last 013 change (OC-O4). HEAD moved during the run, from `02cc1fb948` to `c2a0a667e9`. That commit belongs to another session. It holds no runtime file and none of this phase's files, so the code under test did not change. The counts match tree4, except that the root suite now has a verdict.

| Gate | Result |
|------|--------|
| build, build-cli | rc 0, 0 |
| cli-check (lint, boundary, allowlist, alignment, AST checks) | rc 0 |
| typecheck, typecheck-cli | rc 0 |
| typecheck:tests | rc 2, 95 error lines, reported and not enforced. Same as tree1 to tree4, and none in the files this phase changed |
| cli-test (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`) | rc 0. 171 files passed and 3 skipped. 1,775 tests passed, 19 skipped, 0 failed (tree3: 1,752). Pre-wave-1 baseline was 1,639 passed |
| focused vitest (8 files, including `anchor-contract.vitest.ts`) | rc 0. 8 files, 152 tests passed (tree3: 129) |
| workflow-invariance, isolated | rc 0. 2 of 2 passed |
| hooks | rc 0. 184 tests, 181 passed, 0 failed, 3 skipped |
| doctor (run-all.sh) | rc 0. 7 of 7 suites passed |
| test-validation.sh | rc 0. 31 passed, 0 failed, RESULT: PASSED |
| doctor-update compat | rc 0. 22 of 22 passed (tree3: 21) |
| drift guards (`run-all-drift-guards.sh`) | rc 0. Both guards passed, with 247 alignment warnings and no errors. Not run in tree3 or tree4 |
| root-test (`npm --prefix .skilled/skills/system-spec-kit test`) | rc 0, with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`, the runner's own setting. Runtime suite 281 files and 4,180 tests passed, 21 skipped. CLI sub-step 171 files and 1,775 tests passed. Four RESULT: PASSED lines from the spec and validation sub-steps. Tree4 had no verdict: it hit the 600 s bound |

Raw logs are in `gates/tree5/`: the per-step `.rc` files, `delta.txt` (tree5 against tree4) and `failures.txt`.

### Review Rounds

| Round | Reviewer | Finding | Outcome |
|-------|----------|---------|---------|
| 1 | DeepSeek V4.1 Flash, read-only, OpenCode Go route (RDSO) | P2. The registry scope sentence omitted the phase-parent exemption and the `research/research.md` skip | Applied as 013-F1. The reviewer had no shell, so its confirmations came from reading the code |
| 2 | DeepSeek V4.1 Flash, read-only, cli-devin route (DEV) | P2. The registry description omitted the inline-code exemption | Applied as 013-F2. This reviewer also ran the anchor tests |
| Final | Fresh Opus high, read-only | P2 for this phase. The registry omitted the `review/review-report.md` skip. Its other findings belong to phases 003, 009, 011 and 015 | Applied as 013-O6 |
| Final 2 | Fresh Opus high, read-only, alignment and overengineering against sk-code-opencode and prevent-overengineering (2026-10-09) | P2 for this phase: the `ANCHOR_NESTING_SEVERITY` constant and its one-branch switch were left after the step B flip | Applied as OC-O4. The nesting findings join the error entry directly, with the same status and details in every case. The first run after the edit hit the dist-freshness guard, and the rebuilt run passed |

Logs: `logs/013-R1.out`, `logs/013-R2.out`, `logs/013-F1.out`, `logs/013-F2.out` and `logs/013-O6.out`.

The Luna test round (TR-R1) did not cover this phase: the round listed no 013 test. No test review is on record for `anchor-contract.vitest.ts`.

Route amendment (parent D1, 2026-10-09): the operator later added pi's `cline-pass` provider for DeepSeek, and brought back Luna max fast through cli-codex. Both were added after this phase's builds, reviews and tree3 gate had finished. No 013 build, review or fix ran on either route, so the rows above stand as recorded.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Decisions

Decided 2026-10-08 by the operator. Details and the measured cost are in spec.md section 10.
- Option 2: a nesting check that allows `adr-NNN` to contain `adr-NNN-*`
- Duplicate closers are detected
- Nesting is a warning after phase 001 and an error after phase 011
- Template-sequence order is rejected
- Nesting check skips markers quoted in inline code (recorded in the evidence log on 2026-10-08, the "Nesting check skips inline code (Recommended)" answer)
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Severity shipped in two steps, and step B waited for the census.** Nesting was a warning in step A. The flip to error (step B) followed the census that found zero nested documents, per parent D8. Step B depends on 011's un-nesting, which is in the working tree. Ship order: the corpus un-nesting commit lands before, or in the same commit as, this severity flip. The step B report states this.
2. **Inline-code skip was not in the original plan.** The 065-anchor-system-implementation packet quotes marker syntax in inline code, and the nesting check reported it. The operator chose to skip inline code in the nesting check on 2026-10-08. Other checks still count those markers.
3. **Follow-up: packet 065 keeps three duplicate-anchor errors.** Its `id` duplicates come from the same inline quotes. The nesting check no longer reports them, but the duplicate-anchor check outside the nesting pass still does. This phase did not change that, so it is left as a follow-up.
4. **Fixture 003-valid-level2 changed.** Its `questions` anchor moved below the `nfr` block. Its `GENERATED_METADATA_INTEGRITY` error predates this phase (`fixture-head.log` shows it at HEAD), so it is not a regression.
5. **The step A baseline JSON is 1,029,580 bytes** (about 1 MB). It is kept in `scratch/` and not deleted.
6. **The step B delta is not isolated.** The run measured the working tree, which holds 2,083 modified spec files and 18 runtime files. See Corpus Impact.
7. **Builders and reviewers used DeepSeek routes, not the Luna route named in the goal (D6).** Luna was dropped on 2026-10-08 after wave 2 (parent D1). opencode-go ran out of quota and llmgateway returned `reasoning_content` errors, so work moved to cli-devin per D7. The step B build and the round 2 review ran on cli-devin, and the round 1 review ran on OpenCode Go.
8. **Parent D1 amended on 2026-10-09.** The parent goal.md now also lists pi's `cline-pass` DeepSeek route and Luna max fast through cli-codex. No 013 work ran on either route. This phase's goal.md D6 and D7 were not edited, so the route record in deviation 7 and the review rounds table is what ran.
9. **The severity constant was removed after step B.** The Severity bullet and the step B evidence in tasks.md name `ANCHOR_NESTING_SEVERITY`. The simplification pass (OC-O4, 2026-10-09) removed it, and the nesting findings join the error entry in `validateAnchorIntegrity()`. The step B report under `scratch/` still names the constant, because it records the state measured before the removal.

<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:open-items -->
## Open Items

- **Changelog not written.** spec.md asks for a refresh of the matching file in `../changelog/` at close. The parent packet has no changelog folder, and that path is outside this phase's write set, so none was written.
- **Goal criterion for comparison reports.** goal.md asks for "a baseline and a comparison report" for each step as files in `scratch/`. Step B has a comparison file. Step A has a baseline only, and no separate after-step-A file exists. Criteria 1, 3 and 5 are ticked in goal.md on the evidence in this closeout. Criterion 2 stays unticked, because the warning state has no live fixture now. Criterion 4 stays unticked too. The parent decides on both.
- **Dependency on 011.** AC-007 and the step B flip rest on 011's un-nesting. 011 reads Status Complete (checked 2026-10-09). If that changes, reopen AC-007 and this status.
- **Root test verdict.** Resolved in tree5: `npm --prefix .skilled/skills/system-spec-kit test` exited 0 with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000` (`gates/tree5/root-test.rc`). Tree4 hit the 600 s bound with no verdict (`gates/tree4/root-test.log`, rc 124). The parent goal.md does not name this command in its completion criteria.
- **Not committed.** The change is in the working tree. Per the parent's D6, it ships with the other phases that share files.

<!-- /ANCHOR:open-items -->

---
