---
title: "Acceptance Criteria: Phase 8: context-type-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "context type hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening"
    last_updated_at: "2026-10-04T12:00:33Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked all seven criteria met with evidence"
    next_safe_action: "None"
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
# Acceptance Criteria: Phase 8: context-type-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/008-context-type-hardening
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase starts, When any data is drawn, Then `measurement-protocol.md` already names every set, size, seed and threshold | Protocol sha256 `9dde5cd11e235d2b…` unchanged; file time 2026-10-04T12:22:43Z precedes the first result file at 12:24:27Z (`stat`) (implementation-summary.md:119) | Met | - |
| AC-002 | REQ-002 | Given every generator that seeds the two keys, When each is rendered, Then its off-list rate is reported | `rg -n "(contextType\|importance_tier):\s*\S"` over the three generator trees: 90 seeds, 0 off-list (Wilson 0–4.1%), `scratch/generator-seeds.json` (implementation-summary.md:85) | Met | - |
| AC-003 | REQ-003 | Given three models and one fixed brief, When each writes the protocol's number of docs cold, Then each model's off-list rate is reported with a Wilson 95% interval | `scratch/model-writers-score.py`: contextType off-list DeepSeek 1/10 (1.8–40.4%), Luna 5/10 (23.7–76.3%), SWE 2 2/10 (5.7–51.0%); importance_tier 0/10 each; `scratch/model-writers-result.json` (implementation-summary.md:94) | Met | - |
| AC-004 | REQ-004 | Given the planted matrix, When both warnings run, Then recall and precision are reported for each, and each miss has a source fix | `scratch/matrix.py`: 1,188 rows, W1 and W2 each tp 180 fp 0 fn 0 tn 1,008, recall 100% (97.9–100%); no miss, so no fix was needed (`scratch/matrix-result.json`) (implementation-summary.md:81) | Met | - |
| AC-005 | REQ-005 | Given every existing spec doc and skill doc, When both warnings run, Then each warning printed is listed with its cause | `scratch/corpus.py`: 22,754 docs, W1 0 warnings, W2 0 warnings, so no warning needs a cause (`scratch/corpus-result.json`) (implementation-summary.md:83) | Met | - |
| AC-006 | REQ-006 | Given a defect the measurement found, When it is fixed, Then a regression test covers it and no packet changes its validation result | No measurement found a defect (matrix 0 misses, corpus 0 warnings, generators 0 off-list), so no fix landed and the conditional D1 rerun was not triggered; `vitest --project cli` 1,670 passed, 0 failed (implementation-summary.md:61) | Met | - |
| AC-007 | REQ-007 | Given the implementation summary, When a number appears, Then the command behind it is named | Every figure in `implementation-summary.md` names the script or command behind it (implementation-summary.md:79) | Met | - |

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

All seven criteria are met. Both warnings scored 100% on the planted matrix with no corpus false alarm and no off-list generator seed, so the phase changed no product code; the model-writer rates are descriptive and carry no threshold.
<!-- /ANCHOR:closure -->
