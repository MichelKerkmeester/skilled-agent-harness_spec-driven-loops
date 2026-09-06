---
title: "Acceptance Criteria: Phase 1: source-inventory-and-placement"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/001-source-inventory-and-placement"
    last_updated_at: "2026-09-02T10:30:00Z"
    last_updated_by: "phase-1-implementer"
    recent_action: "Authored the criteria and marked each against observed evidence"
    next_safe_action: "Close the packet and start phase 002"
    blockers: []
    key_files:
      - "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/001-source-inventory-and-placement/research/inventory.md"
      - "specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/001-source-inventory-and-placement/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-1-source-inventory-and-placement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: source-inventory-and-placement

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/018-sk-design-parent-v2/001-sk-create-chart/001-source-inventory-and-placement
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 124-file clone, When the classifier runs, Then every file carries port, translate, adapt or drop | `scratch/classify.mjs` exits 0 and reports `total=124` across 4 dispositions. It exits 1 and names the file if any row matches no rule | Met | - |
| AC-002 | REQ-001 | Given a file classified as drop, When the inventory is read, Then a one-line reason is present | `research/inventory.md` section 5, DROP table, 47 rows each carrying a reason | Met | - |
| AC-003 | REQ-002 | Given the placement question, When the decision is read, Then it names the hub modes compared, with file counts and subject | `decision-record.md` ADR-001, comparison table of all 14 `sk-doc` mode folders with `find -type f` counts, `du -sk`, and subject, plus a second table of 9 standalone siblings | Met | - |
| AC-004 | REQ-003 | Given the Chinese content, When the census is read, Then per-file Han counts are reported | `research/inventory.md` section 6, per-file table of all 60 files carrying Han, totalling 45,778 | Met | - |
| AC-005 | REQ-004 | Given ported content, When provenance is checked, Then the licence and upstream commit are recorded | `research/inventory.md` section 1 records commit `4eef5ce00d0907a03b8eff42578b5a04942915e9` and the upstream URL. Section 8 records PolyForm Noncommercial 1.0.0 clause by clause | Met | - |
| AC-006 | REQ-005 | Given 57 binary assets, When their disposition is checked, Then it was decided explicitly rather than by default | `decision-record.md` ADR-003 splits 12 from 45 by reference tracing, citing `scripts/validate.mjs:44` and 12 references in `templates/reports/index.html` | Met | - |
| AC-007 | SC-001 | Given the inventory, When a fresh scan runs, Then the file count matches and nothing is unclassified | `git ls-files` sorted against the inventory path set: 124 paths, `diff` reports zero difference | Met | - |
| AC-008 | SC-002 | Given the decision record, When it is read, Then the losing option and the reason it lost are stated | `decision-record.md` ADR-001 scores three options and carries a "Why the standalone option lost" paragraph naming the missing cross-hub tie-break as the cause | Met | - |
| AC-009 | SC-003 | Given the census total, When it is recounted by a different method, Then the totals agree | Regex over Unicode ideograph ranges returns 45,778. An independent `python3` `unicodedata.name()` pass returns 45,778 | Met | - |
| AC-010 | US-001 | Given a phase 3 implementer, When they read this packet, Then they know which shape to build | ADR-001 names the target path, `packetKind`, `backendKind`, `routingClass`, and the root-level metadata files a mode packet must not carry | Met | - |
| AC-011 | US-002 | Given a phase 2 implementer, When they read this packet, Then they can size the work before starting | `research/inventory.md` section 6: 42,598 Han across 59 surviving files, with the per-file breakdown and the finding that the `.en.html` templates are only partly English | Met | - |

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

The packet closes on AC-003 and AC-008, which are the ones it existed for: the placement verdict
is backed by a comparison run before the verdict, and the option that lost is named with the
reason it lost. AC-007 and AC-009 make the counting trustworthy by checking it twice with
different tools.

What was consciously left out: the licence conflict found in AC-005 is escalated rather than
resolved, because deciding whether a noncommercial-only work may be redistributed under MIT is
the operator's judgment and not a fact this phase can measure. It is recorded as ADR-002 with
`Status: Proposed`, and it blocks phase 4 only. The `sk-create-diagram` overlap is identified and
left to phase 5, because it cannot be measured until one of the two modes exists.
<!-- /ANCHOR:closure -->
