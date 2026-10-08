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
    last_updated_at: "2026-10-08T06:30:00Z"
    last_updated_by: "planning-agent"
    recent_action: "Authored acceptance criteria for phase 13"
    next_safe_action: "Operator chooses option 1, 2, or 3"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: ["Which anchor rules should ANCHORS_VALID check?"]
    answered_questions: []
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
**Status:** Planned
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a spec.md whose `questions` anchor wraps `nfr`, and a decision record whose `adr-001` wraps `adr-001-context`, When ANCHORS_VALID runs, Then the first is reported and the second is not | Vitest fixtures for both cases pass | Unmet | - |
| AC-002 | REQ-002 | Given a document that closes `questions` twice and opens it once, When ANCHORS_VALID runs, Then a duplicate closer is reported | Vitest fixture passes | Unmet | - |
| AC-003 | REQ-003 | Given validator-registry.json, When ANCHORS_VALID description is updated, Then it matches what the code actually checks | Read registry and compare to orchestrator.ts logic | Unmet | - |
| AC-004 | REQ-004 | Given validation-rules.md, When Anchor Rules section is updated, Then it matches the code behavior, including the `adr-NNN` allowance | Read validation-rules.md section 6 (lines 368-393) and compare to code | Unmet | - |
| AC-005 | REQ-005 | Given a corpus baseline before each step, When validation is run on the entire specs/ tree, Then a before/after report documents the impact | baseline counts in T003, new counts in T010, delta recorded | Unmet | - |
| AC-006 | REQ-006 | Given the spec-kit test suite, When all tests are run, Then no test failures are introduced | Run npm test in spec-kit directory | Unmet | - |
| AC-007 | REQ-007 | Given phase 011 has not landed, When a nested document is validated, Then the finding is a warning and `--strict` still passes. After 011 lands, Then it is an error | Vitest fixture checks the severity. The error step lands only after 011 | Unmet | - |

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

**Closeable:** Unmet (packet is planned, not built)

Operator chose option 2 on 2026-10-08: a nesting check that allows `adr-NNN` to contain `adr-NNN-*`, plus duplicate-closer detection. Nesting ships as a warning after phase 001 and as an error after phase 011. Template-sequence order was rejected. When closed, record the corpus impact from the baseline comparison in T010-T011.
<!-- /ANCHOR:closure -->

---
