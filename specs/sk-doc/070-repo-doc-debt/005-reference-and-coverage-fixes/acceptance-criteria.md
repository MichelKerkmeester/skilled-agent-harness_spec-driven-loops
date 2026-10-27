---
title: "Acceptance Criteria: Repo doc debt reference and coverage fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "reference and coverage fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/005-reference-and-coverage-fixes"
    last_updated_at: "2026-10-27T14:00:00Z"
    last_updated_by: "lane-b-conductor"
    recent_action: "Recorded evidence for every criterion"
    next_safe_action: "None; criteria are met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-b-reference-and-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Repo doc debt reference and coverage fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/070-repo-doc-debt/005-reference-and-coverage-fixes
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
| AC-001 | REQ-001 | Given the 96 broken-reference findings, When each is classified, Then every one has a rule and a stated reason or fix | the evidence table in implementation-summary.md: 96 rows, 19 rule 1, 10 rule 2, 11 rule 3, 56 rule 4 | Met | - |
| AC-002 | REQ-002 | Given the final tree, When the fast checker reruns, Then only rule-1 and rule-2 items remain broken | 27 broken, being 17 rule-1 and 10 rule-2 items; no rule-3 or rule-4 finding survives | Met | - |
| AC-003 | REQ-003 | Given the 13 coverage findings, When each README is read after the edit, Then it names the artifact its folder holds | fast checker coverage count 13 before, 0 after; one mention each for `package.json`, `tsconfig.json`, `tsconfig.tests.json`, `tsconfig.pi.json` and `tests/` | Met | - |
| AC-004 | REQ-004 | Given the 59 READMEs, When the README validator runs on each, Then every one is valid | `validate_document.py --type readme`: exit 0 on 59 of 59, before and after | Met | - |
| AC-005 | REQ-004 | Given the rewritten tree, When the manifest test runs, Then discovery still reproduces | `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible`, exit 0 | Met | - |
| AC-006 | REQ-004 | Given the rewritten tree, When the verdict parity test runs, Then the verdict diff is empty | `PARITY PASS: verdict diff is empty`, exit 0, no baseline rewrite | Met | - |
| AC-007 | REQ-005 | Given the whole repo, When the markdown link guard runs, Then no link is broken | `7663 files, 13976 links checked, 0 broken`, exit 0 | Met | - |
| AC-008 | REQ-006 | Given the 11 touched skills, When each patch entry is written, Then every carrier for that skill names the same version | 11 entries exist and pass their validators: system-spec-kit 2.12.7.0, sk-git 1.9.9.0, system-skill-advisor 0.17.6.0, sk-doc 2.3.18.0, sk-create-agent 1.0.2.0, sk-create-goal 1.4.3.0, sk-create-skill 1.5.8.0, sk-code 3.9.5.0, mcp-aside-devtools 1.1.3.0, system-deep-loop 1.6.10.0, deep-loop runtime 1.9.10.0 | Met | - |
| AC-009 | REQ-007 | Given this packet, When strict validation runs, Then it passes with no error and no warning | `validate.sh --strict` prints `RESULT: PASSED`, Errors 0, Warnings 0 | Met | - |

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

Every criterion is met: the 27 references left are accurate ones the audit cannot resolve, each with its reason recorded, and the 59 READMEs still pass their own checks.
<!-- /ANCHOR:closure -->
