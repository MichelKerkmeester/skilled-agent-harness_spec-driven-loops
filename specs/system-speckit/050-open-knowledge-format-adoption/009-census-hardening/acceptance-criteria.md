---
title: "Acceptance Criteria: Phase 9: census-hardening"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/009-census-hardening"
    last_updated_at: "2026-10-05T06:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "AC-004 superseded by ADR-001; all eight criteria closed"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: census-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/009-census-hardening
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
| AC-001 | REQ-001 | Given the phase starts, When any sample is drawn, Then `measurement-protocol.md` already names every size, the seed, the ground-truth rules and the thresholds | Protocol sha256 `8afc427486f599ac…` unchanged; file time 12:22:56Z precedes the first result file (implementation-summary.md:135) | Met | - |
| AC-002 | REQ-002 | Given a citation to `REPO RULES.md:88`, When the census runs, Then it resolves, a test covers it and the census delta is reported | 439 citations, all `REPO RULES.md` (4 at line 88), move from unresolved to in range (`scratch/space-fix-delta.jsonl`); tests `resolve spaced path` and `resolve spaced prose stays prose` (implementation-summary.md:81) | Met | - |
| AC-003 | REQ-003 | Given each census class, When the protocol's sample is drawn, Then each row's ground truth comes from a factual check wherever one exists | `scratch/sample-and-check.py`: moved by git rename history and line count, past end by line count, gone by presence, ignore rules and history (`scratch/samples/`) (implementation-summary.md:83) | Met | - |
| AC-004 | REQ-004 | Given rows with no factual answer, When two models from different families label them, Then Cohen's kappa is reported and the operator labels the most disputed rows | Luna 6 and DeepSeek V4.1 Flash labeled all 150 guessed rows, kappa 0.31 (`scratch/labels/agreement.json`); the operator labels were replaced by a three-family panel that settled 33 of the 40 disputed rows (`scratch/labels/panel/panel-scored.json`); census guessed class 80.6% intended over 93 settled rows (71.5–87.4%) | Superseded | ADR-001 |
| AC-005 | REQ-005 | Given the labeled samples, When accuracy is computed per class, Then each has a Wilson 95% interval compared with the protocol threshold | Moved 98/100 (93.0–99.4%), past end 100/100 (96.3–100%), gone 100/100 (96.3–100%) against 95/95/90%; moved lower bound sits under 95% (implementation-summary.md:87) | Met | - |
| AC-006 | REQ-006 | Given the whole gone class, When it is split by cause, Then each cause is counted | Whole class of 45,338: never existed 28,610, deleted 14,330, renamed without a rule 2,349, ignored 48, index only 1, parser miss 0 (implementation-summary.md:93) | Met | - |
| AC-007 | REQ-007 | Given batched git reads, When a full census is timed before and after, Then the output is byte-identical apart from the spaced-path delta, and the default run makes no model call and writes no file | Medians 735.6 s baseline and 214.9 s current (29%); outputs differ on only the 7 spaced-delta lines; 0 files written on current runs (`scratch/timing/timing.log`) (implementation-summary.md:108) | Met | - |
| AC-008 | REQ-008 | Given the rebuild flag, When it runs at the table's commit, Then the redirect table is byte-identical | `--rebuild-redirects` at `5285608745fe`: sha256 `6ef622e2…` equals the committed table (implementation-summary.md:110) | Met | - |

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

Seven criteria are met. AC-004 is superseded by ADR-001: the kappa half is met, and a model panel settled the disputed rows in place of operator labels, at the operator's request.
<!-- /ANCHOR:closure -->
