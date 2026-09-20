---
title: "Acceptance Criteria: Phase 1: utilization-review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/039-create-with-human-voice/001-utilization-review"
    last_updated_at: "2026-09-03T00:05:00Z"
    last_updated_by: "utilization-review"
    recent_action: "Added and met seven closing criteria"
    next_safe_action: "Hand the recorded hub vocabulary to the sk-doc hub owner"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: utilization-review

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 039-create-with-human-voice/001-utilization-review
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02, extended 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every Verification cell names a command and the output it must print. `PKT` stands for
`.opencode/skills/sk-doc/sk-create-with-human-voice`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given nine playbook scenarios, When the review closes, Then each carries an outcome and its evidence | `implementation-summary.md` heading `Playbook Results` lists nine rows, each with a verdict and a measured number, evidence at `implementation-summary.md:59` | Met | - |
| AC-002 | REQ-002 | Given the mode's own report template, When it is scanned, Then it reports no hard blocker | `python3 $PKT/scripts/hvr_scan.py $PKT/assets/voice-report-template.md` prints `hard blockers:          0` and exits 0, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/assets/voice-report-template.md:43` | Met | - |
| AC-003 | REQ-002 | Given the five edited files, When each is validated, Then each passes the sk-doc document contract | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <absolute path>` prints `VALID` with `Total issues: 0` and exits 0, for each of the five, evidence at `.opencode/skills/sk-doc/scripts/validate_document.py:246` | Met | - |
| AC-004 | REQ-001 | Given the two shipped fixtures, When the control pair runs after the fixes, Then both report what they reported before | `python3 $PKT/scripts/hvr_scan.py $PKT/scripts/tests/fixtures/voice-dirty.md` prints `hard blockers:          6`, `mechanical deductions:  -33`, `mechanical ceiling:     67/100` and exits 1. The clean fixture prints `no mechanical findings`, `100/100` and exits 0, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md:155` | Met | - |
| AC-005 | REQ-004 | Given the playbook was edited, When its package contract is re-checked, Then it still passes with a nonzero operator count | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package $PKT/manual-testing-playbook` prints `PASS package=sk-doc/sk-create-with-human-voice ... operator=9 ... violations=0 warnings=0` and exits 0, evidence at `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:12` | Met | - |
| AC-006 | REQ-002 | Given the shipped worked example, When the file it cites is scanned, Then the example's rows match the output | `python3 $PKT/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-repo-rule/README.md` prints the same six grouped rows the example lists: `harness` x2 hard, `do` x7, `take` x3, `get` x1, `might` x1 and `, and` x9, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md:132` | Met | - |
| AC-007 | REQ-003 | Given eight newcomer prompts, When each is routed, Then the result is recorded whether or not it reaches the mode | `implementation-summary.md` heading `Newcomer Routing` lists eight prompts with the skill, the score and the selected workflow mode or the absence of one, evidence at `implementation-summary.md:81` | Met | - |
| AC-008 | REQ-005 | Given findings outside the mode's authority, When the review closes, Then each is written up with the observation behind it | `implementation-summary.md` heading `Write-Ups` lists six entries, each naming the command or file that produced it, evidence at `implementation-summary.md:132` | Met | - |
| AC-009 | REQ-002 | Given this phase folder, When it is validated, Then it passes strict validation with its rule lines visible | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/scripts/spec/validate.sh" specs/sk-doc/039-create-with-human-voice/001-utilization-review --strict` prints `RESULT: PASSED`, evidence at `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1` | Met | - |
| AC-010 | REQ-005 | Given two scoring systems in the standard, When the closing pass ends, Then one arithmetic is stated and the other is named as the rubric it is | `hvr-rules.md` section 1 carries `### Scoring` then `### Where To Spend Attention`, section 9's table reads `Share of attention`, and `scoring-and-verification.md` section 3 says its arithmetic is the only one, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:38` | Met | - |
| AC-011 | REQ-005 | Given a template whose payload is code, When it is scanned, Then no statement terminator is reported as a punctuation blocker | `python3 $PKT/scripts/hvr_scan.py .opencode/skills/mcp-code-mode/assets/env-template.md` prints `hard blockers:          0` and exits 0, against 4 and exit 1 before, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:252` | Met | - |
| AC-012 | REQ-002 | Given the scanner's masking contract, When the tests run, Then each check states its own condition and the two new ones failed before the change | `python3 $PKT/scripts/tests/test_hvr_scan.py` prints six `PASS` lines, `ALL PASS` and exits 0. The same file printed `2 FAILED` and exit 1 against the unchanged scanner, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py:1` | Met | - |
| AC-013 | REQ-001 | Given six scenarios written against a placeholder, When the closing pass ends, Then each names a shipped fixture | `grep -rn '<target>' $PKT/manual-testing-playbook/` returns nothing, and precondition 7 maps all nine scenarios to a fixture, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md:77` | Met | - |
| AC-014 | REQ-004 | Given the playbook was rewired onto fixtures, When its package contract is re-checked, Then it still passes with nine operator scenarios | `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package $PKT/manual-testing-playbook` prints `PASS ... operator=9 routing_gold_excluded=0 violations=0 warnings=0` and exits 0, evidence at `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:12` | Met | - |
| AC-015 | REQ-002 | Given the prepared step 5 text, When `SKILL.md` is read, Then it carries that text verbatim | `SKILL.md:173` reads the replacement recorded under `Prepared Text, Now Applied`, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md:173` | Met | - |
| AC-016 | REQ-005 | Given the masking change, When the packet's pinned numbers are re-read, Then none of them moved | The dirty fixture reports `6 / -33 / 67` exit 1, the clean fixture `0 / -0 / 100` exit 0, `hvr-rules.md` `30 / -246` and `sk-create-repo-rule/README.md` `2 / -22 / 78`, evidence at `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md:155` | Met | - |

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

AC-001, AC-004 and AC-005 carried the packet: the playbook ran for the first time, the
controls held either side of the fixes, and the operator contract survived the playbook
edit. The closing pass then took the three decisions the first pass wrote up. AC-016 is the
row that matters most in it: the scanner's masking changed and not one pinned number moved,
so the fix is a fix rather than a sweep. Consciously left out: the hub routing vocabulary,
which belongs to `sk-doc/graph-metadata.json` and is recorded in `goal.md` for its owner,
and `validate_document.py` line 246, which sits outside this packet.
<!-- /ANCHOR:closure -->
