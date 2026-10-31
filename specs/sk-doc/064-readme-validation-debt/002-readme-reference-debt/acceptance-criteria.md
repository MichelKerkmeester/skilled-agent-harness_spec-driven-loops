---
title: "Acceptance Criteria: Triage and fix the README reference and derived-count check failures across the root and hub READMEs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "readme reference debt acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/071-readme-reference-debt"
    last_updated_at: "2026-10-27T23:30:00Z"
    last_updated_by: "readme-reference-debt-followup-worker"
    recent_action: "Marked every criterion with the evidence that met it"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py"
      - ".skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-reference-debt-071"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Triage and fix the README reference and derived-count check failures across the root and hub READMEs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/071-readme-reference-debt
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
| AC-001 | REQ-001 | Given the 573 baseline reference failures, When both checks rerun on the 12 READMEs, Then each baseline failure is fixed, removed by a class rule, or listed with its reason | `scratch/after-refs.txt:49` (36 unresolved over 12 files), each named in `implementation-summary.md` Known Limitations | Met | - |
| AC-002 | REQ-001 | Given the 83 baseline count failures, When the count check reruns, Then each failure left standing is a verified-correct claim with its reason | `scratch/after-counts.txt:17` (4 failures), each checked against its source | Met | - |
| AC-003 | REQ-002 | Given the old and new checkers on one tree, When both run over all 977 tracked READMEs, Then no line fails now that had no old failure | `scratch/regression-diff.txt:5` and `scratch/regression-diff.txt:9` both print 0 | Met | - |
| AC-004 | REQ-003 | Given the extended self-tests, When each checker runs `--self-test`, Then it prints `SELF-TEST PASS` with the broken-path and stale-count cases still failing | `scratch/verification.txt:10` and `scratch/verification.txt:13` print `SELF-TEST PASS`, exit 0 | Met | - |
| AC-005 | REQ-004 | Given the two edited READMEs, When `validate_document.py` runs on each, Then it prints `VALID` and exits 0 | `scratch/verification.txt:2` and `scratch/verification.txt:6` print `VALID`, exit 0 | Met | - |
| AC-006 | REQ-005 | Given a `readme-check` entry beside a broken path or an unproven count, When each checker runs `--self-test`, Then the marked token passes, the broken one still fails, and an unused or reasonless entry fails | `scratch/followup-verification.txt:35` and `scratch/followup-verification.txt:50` print `SELF-TEST PASS`, exit 0 | Met | - |
| AC-007 | REQ-005 | Given the four absent-by-design classes, When the reference self-test runs, Then one ordinary missing path per class still fails, and a README inside an ignored folder gets no pass | `scratch/followup-verification.txt:35`; a mutant with the weaker guard stops before `SELF-TEST PASS` | Met | - |
| AC-008 | REQ-002 | Given the follow-up checkers, When old and new run over all 987 tracked READMEs on one tree, Then no line fails now that had no old failure | `scratch/followup-regression-diff.txt:1` and `:20` print `new_failing_lines=0 newly_failing_files=0` | Met | - |
| AC-009 | REQ-001 | Given the 36 references and 4 counts left standing, When both checks rerun on the 12 READMEs, Then each failure left is in a README this packet may not edit and is named with the marker entry it needs | `scratch/followup-after-12.txt:16` and `:32` (`pass=10 fail=2`), each named in `implementation-summary.md` Known Limitations item 6 | Met | - |
| AC-010 | REQ-006 | Given the harness test, When it runs alone on a checkout with tracked files missing, Then it passes | `test_rename_tooling_fixture_harness.py`: `Ran 5 tests`, `OK`, exit 0 | Met | - |

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

Every criterion is met by a rerun whose output is saved in `scratch/` or quoted in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
