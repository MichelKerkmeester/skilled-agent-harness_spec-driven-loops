---
title: "Acceptance Criteria: Phase 13: anchor-contract-alignment"
description: "Operator chooses anchor rules, code and docs align, corpus impact recorded"
trigger_phrases:
  - "anchor contract alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment"
    last_updated_at: "2026-10-09T11:20:00Z"
    last_updated_by: "closeout-worker"
    recent_action: "Third pass: citations and gate evidence re-cited to tree5"
    next_safe_action: "None for this phase. The parent packet closes when 011 closes"
    blockers: []
    key_files: ["spec.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Which anchor rules should ANCHORS_VALID check? Operator chose option 2 on 2026-10-08"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: anchor-contract-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
**Closed:** 2026-10-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a spec.md whose `questions` anchor wraps `nfr`, and a decision record whose `adr-001` wraps `adr-001-context`, When ANCHORS_VALID runs, Then the first is reported and the second is not | Vitest fixtures for both cases pass. Evidence 2026-10-09: `anchor-contract.vitest.ts` case "errors when an anchor opens inside another one" (fixture 078) asserts `nfr` opened inside `questions` with exit 2, and case "accepts the decision-record per-ADR nesting" (fixture 079) asserts exit 0 with status pass. Gate `gates/tree5/focused-vitest.log` rc 0: 8 files, 152 tests passed, including this file. Full suite `gates/tree5/cli-test.log` rc 0. Code and tests: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:729` (nesting pass, `anchorNestingFindings()`, re-cited 2026-10-09), `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:97` (078 case) and `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:108` (079 case) | Met | - |
| AC-002 | REQ-002 | Given a document that closes `questions` twice and opens it once, When ANCHORS_VALID runs, Then a duplicate closer is reported | Vitest fixture passes. Evidence 2026-10-09: case "reports a name closed twice when it is opened once" (fixture 080) asserts "closed more times than it is opened" with exit 2. The boundary case "leaves a never-opened closer to the closed-but-never-opened finding" passes. Gate `gates/tree5/focused-vitest.log` rc 0. Code and tests: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:830-837` (closer count, finding at :835, re-cited 2026-10-09) and `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:56` (080 case) | Met | - |
| AC-003 | REQ-003 | Given validator-registry.json, When ANCHORS_VALID description is updated, Then it matches what the code actually checks | Read registry and compare to orchestrator.ts logic. Evidence 2026-10-09: line 109 of `validator-registry.json` was read and compared with `validateAnchorIntegrity()` in `orchestrator.ts` and with `FREEFORM_WORKFLOW_DOCS` in `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:223`. The scope, the phase-parent exemption, the two free-form skips, the error messages, the nesting-as-error severity, the inline-code exemption, the `adr-NNN` allowance and the template-order exclusion all match. Earlier mismatches were fixed in 013-F1, 013-F2 and 013-O6 (`logs/013-F1.out`, `logs/013-F2.out`, `logs/013-O6.out`). Cited: `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:109` | Met | - |
| AC-004 | REQ-004 | Given validation-rules.md, When Anchor Rules section is updated, Then it matches the code behavior, including the `adr-NNN` allowance | Read validation-rules.md section 6 (now lines 368-484) and compare to code. Evidence 2026-10-09: the section and the summary row at line 58 were read against the code. Each of the eight finding messages in rules 4 and 5 appears once in `orchestrator.ts`. Rule 6 matches the `adr-NNN` allowance in `anchorNestingFindings()`. Rule 7 matches the absence of any template comparison in `validateAnchorIntegrity()`. Cited: `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:368` and `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:729` | Met | - |
| AC-005 | REQ-005 | Given a corpus baseline before each step, When validation is run on the entire specs/ tree, Then a before/after report documents the impact | baseline counts in T003, new counts in T010, delta recorded. Evidence 2026-10-09: step A baseline `scratch/anchors-baseline-step-a.md` (committed validator, 4,642 packets, pass 4,612, error 30). Before the severity flip, census `gates/census3/census.md` (working tree, nesting findings 0, pass 4,613, error 29). After the flip, `scratch/anchors-baseline-step-b.md` (pass 4,613, warn 0, error 29, nesting findings 0, one packet changed from error to pass). The step B delta is recorded in that report. Its caveat applies: the step B run measures the working tree, so it does not isolate the validator change from the corpus edits. Cited: `scratch/anchors-baseline-step-b.md:41` | Met | - |
| AC-006 | REQ-006 | Given the spec-kit test suite, When all tests are run, Then no test failures are introduced | Run `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`. Evidence 2026-10-09: `gates/tree5/cli-test.log` rc 0, 171 test files passed and 3 skipped, 1,775 tests passed and 19 skipped, 0 failed. Tree3 had 1,752 passed. Tree4 and tree5 both have 1,775, and tree5 ran after the last change to this phase's code (the 2026-10-09 constant removal, OC-O4), so the extra 23 tests against tree3 come from other phases. The pre-wave-1 baseline was 1,639 passed and 0 failed. The one failure seen in tree1 (workflow-invariance over the 011 fixture prefix) passes in tree5, 2 of 2 isolated (`gates/tree5/workflow-invariance-isolated.rc` 0). The wider skill-level command `npm --prefix .skilled/skills/system-spec-kit test` ran to a verdict in tree5, with the runner's own `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`: exit 0 (`gates/tree5/root-test.rc`), runtime suite 281 files and 4,180 tests passed, CLI sub-step 171 files and 1,775 tests passed. Tree4 had hit the 600 s bound with no verdict. Command source: `.skilled/skills/system-spec-kit/runtime/cli/package.json:19` | Met | - |
| AC-007 | REQ-007 | Given phase 011 has not landed, When a nested document is validated, Then the finding is a warning and `--strict` still passes. After 011 lands, Then it is an error | Vitest fixture checks the severity. The error step lands only after 011. Evidence 2026-10-09. Warning state: the step A run of fixture 078 printed `! ANCHORS_VALID: 3 anchor integrity issue(s) found` (`gates/now-078-anchors-nested-questions.raw`, 2026-10-08), and the step A test "warns when an anchor opens inside another one" asserted status warn with a passing strict run (`gates/anchor-contract-expectations.log`). The step A gate `gates/013-vitest.log` ran rc 0, 24 tests. Error state: "errors when an anchor opens inside another one" asserts status error and exit 2, and passes in `gates/tree5/focused-vitest.log` rc 0. The warn test was replaced at step B, so no live fixture asserts the warning state now. The error step rests on 011's un-nesting: census3 finds zero nested documents. 011's own closeout sets its status, so reopen this row if 011 does not close. Checked 2026-10-09: 011 spec.md reads Status Complete. Cited: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:846-851` (the nesting findings join the error entry. The `ANCHOR_NESTING_SEVERITY` constant that stood at `:106` was removed on 2026-10-09, see implementation-summary.md deviation 9) and `.skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts:97` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is `Waived` or `Superseded`.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Met (closed 2026-10-09). All seven rows are Met with evidence. No row is waived.

Operator chose option 2 on 2026-10-08: a nesting check that allows `adr-NNN` to contain `adr-NNN-*`, plus duplicate-closer detection. Nesting shipped as a warning (step A) and became an error (step B) once the corpus census showed zero nested documents. Template-sequence order was rejected. The corpus impact is in T010 and T011: 4,613 packets pass, 29 error, nesting findings 0, and one packet changed status.
<!-- /ANCHOR:closure -->

---
