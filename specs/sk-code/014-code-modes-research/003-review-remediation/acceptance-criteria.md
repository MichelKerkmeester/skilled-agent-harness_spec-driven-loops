---
title: "Acceptance Criteria: Phase 3: review-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review remediation acceptance criteria"
  - "sk-code routing gap closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/014-code-modes-research/003-review-remediation"
    last_updated_at: "2026-10-25T18:15:14Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed AC-001 to AC-010 with observed evidence"
    next_safe_action: "None. Every criterion is Met"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-skcode-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 3: review-remediation

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** sk-code/014-code-modes-research/003-review-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Run every command from the repository root. Each row was observed on 2026-10-25 after the second pass.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three research goals and both research acceptance files, When their criteria are read, Then no criterion is unticked and AC-009 reads Superseded with ADR-003 in both phases | `grep -c "^- \[ \]"` on the three `goal.md` files prints 0, 0 and 0. Both AC-009 rows read `Superseded` with `ADR-003` | Met | - |
| AC-002 | REQ-002 | Given the finished packet, When it is validated recursively, Then validation passes | `validate.sh specs/sk-code/014-code-modes-research --recursive --strict` prints `RESULT: PASSED` | Met | - |
| AC-003 | REQ-003 | Given the rebuilt quality playbook root, When the playbook validator runs, Then it passes | `validate_document.py --type playbook` on the quality root prints `VALID` and `Total issues: 0`, exit 0 | Met | - |
| AC-004 | REQ-004 | Given the review playbook, When the package validator runs, Then it reports no warning | `validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-review/manual-testing-playbook` prints `PASS`, `scenarios=30`, `violations=0 warnings=0`, exit 0 | Met | - |
| AC-005 | REQ-005 | Given the sk-code-quality scripts, When the exact-header check runs, Then no script is flagged | `verify_alignment_drift.py --root .skilled/skills/sk-code/sk-code-quality/scripts --check-exact-headers` prints `Findings: 0`, exit 0 | Met | - |
| AC-006 | REQ-006 | Given the Extension Floors section, When the canary and its suite run, Then both pass and the suite covers a reworded floor | `check-rule-copies.js` prints `6 extension floor(s)` and exits 0. `check-rule-copies.test.sh` prints `All rule-canary test cases passed`, exit 0 | Met | - |
| AC-007 | REQ-007 | Given the refreshed manifest, When `fix this bug in foo.ts` and `how do I write a bash script here` are replayed, Then each routes single to `sk-code-skilled` and the controls keep their routes | `compiled-route.cjs --hub sk-code` printed `route single ['sk-code-skilled']` for both, where each printed `defer` before. `review my diff` stays single review, `review my typescript module for jank` stays review plus skilled, the CI, quality and TypeScript lookup controls stay single to their packets, policy hash `b2bc4860` | Met | - |
| AC-008 | REQ-008 | Given CB-CR-001 naming both bundle packets and the new CB-CR-005, When the scenario validator and admission run, Then all pass | `validate-compiled-routing-scenarios.cjs --dir .skilled/skills/sk-code/manual-testing-playbook/compiled-routing --strict` prints `pass=5 fail=0`. `compiled-route-admission.cjs --hub sk-code` prints `pass`, `7 pass, 0 drift`. The admission test passes 29 of 29 with `LIVE_CORPUS_SIZE` at 89 | Met | - |
| AC-009 | REQ-009 | Given test files that sit next to their scripts, When the exact-header check and its tests run, Then the test files are exempt and a non-test sibling is still flagged | The checker on `sk-code-quality/scripts` went from `Findings: 4`, all `*.test.sh`, to `Findings: 0`. `test_verify_alignment_drift.py` prints `Ran 30 tests` and `OK`, including the new sibling test | Met | - |
| AC-010 | REQ-010 | Given this folder at Level 2, When it is validated strictly, Then it passes with no warning | `validate.sh specs/sk-code/014-code-modes-research/003-review-remediation --strict` prints `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, against one LEVEL_MATCH warning before | Met | - |

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

AC-001 to AC-006 carry the deep review fixes and AC-007 to AC-010 carry the second pass. S-P2-13 and S-P2-14 were left out on purpose, as the spec records.
<!-- /ANCHOR:closure -->
