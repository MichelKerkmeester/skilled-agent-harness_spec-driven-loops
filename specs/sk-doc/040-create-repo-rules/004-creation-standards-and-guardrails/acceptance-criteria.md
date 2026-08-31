---
title: "Acceptance Criteria: Phase 4: Creation Standards and Guardrails"
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
    packet_pointer: "sk-doc/040-create-repo-rules/004-creation-standards-and-guardrails"
    last_updated_at: "2026-08-31T11:33:10Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for creation standards and guardrails"
    next_safe_action: "Capture the corpus baseline, then derive candidate standards"
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
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: Creation Standards and Guardrails

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/004-creation-standards-and-guardrails
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given any standard, When a reader asks what breaks without it, Then the document answers | Every standard is stated as what breaks without it; the section test itself is framed as identifiability rather than a required phrase | Met | - |
| AC-002 | REQ-002 | Given the eight shipped rules, When every standard is applied, Then all eight pass | All eight shipped rules pass every checkable test: phrases 16-20 all in range, self-check items 5-11 all in range, 0 collisions across 144 phrases | Met | - |
| AC-003 | REQ-003 | Given a draft rule, When a reviewer applies the standards, Then no tooling is needed | Each of the five is a question a reviewer answers by reading; the document says outright that none can be automated | Met | - |
| AC-004 | REQ-004 | Given phase 3 thin sample, When the standards are applied, Then it fails and the failing tests are named | Phase 3's thin sample fails three: 6 trigger phrases against an aim of 15-20, a binding sentence joining two obligations with \"and\", and 2 self-check items against a floor of 5 | Met | - |
| AC-005 | REQ-005 | Given a don't, When its basis is checked, Then it is an observed failure rather than a preference | Each don't cites an observed failure - the best-practice one names the double standard it would create | Met | - |
| AC-006 | REQ-006 | Given the standards, When compared with phase 3 assertions, Then none is restated | No standard restates a phase-3 structural assertion; the document says structure is checkable and is not the bar | Met | - |
| AC-007 | REQ-007 | Given the misreading guard, When it is read, Then it cites the shipped rules that needed one | Section 5 names all three rules carrying a WHAT THIS RULE IS NOT section and why the other five do not need one | Met | - |
| AC-008 | REQ-008 | Given the standards document, When measured, Then it fits the bands it teaches | 163 lines - the "good" band, inside the 250 ceiling | Met | - |
| AC-009 | REQ-002 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict`: every rule passed and the only error was this row's own `AC_CLOSURE`, which clears once the row is marked | Met | - |

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

AC-002 and AC-004 carried it, as the pair they were written to be: all eight shipped rules
pass, and the thin sample fails three tests. Either result alone would prove nothing. The
phase also caught its own worst outcome in progress — a pattern-based measurement of the
section test reported six of eight rules as failing, and reading them showed the
measurement wrong rather than the corpus. Trusting it would have produced a bar describing
two files written this session.
<!-- /ANCHOR:closure -->
