---
title: "Acceptance Criteria: Phase 3: gate-b-realistic-corpus"
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
    packet_pointer: "sk-doc/052-routing-completeness/003-gate-b-realistic-corpus"
    last_updated_at: "2026-09-02T17:36:09Z"
    last_updated_by: "claude-code"
    recent_action: "Re-ran each criterion and recorded the observed output"
    next_safe_action: "None; every criterion is Met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-003-gate-b-realistic-corpus"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: gate-b-realistic-corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/052-routing-completeness/003-gate-b-realistic-corpus
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given at least three realistic phrasings per mode, When the corpus is committed, Then no row contains its own mode name | Re-checked 2026-09-02: `assets/realistic-corpus.tsv` holds 180 data rows, and `awk -F'\t' 'NR>1 && index(tolower($3),tolower($2))>0'` returns 0 rows | Met | |
| AC-002 | REQ-002 | Given the corpus, When it is measured through the daemon, Then the rate is recorded and reproducible | The second run against the state it was measured in returned 8 of 180 as top pick, matching `research/gate-b-measurement.md`, with cache hits observed on verbatim repeats. A third run on 2026-09-02 at HEAD `c328d601d8` returns 21 top-only and 24 any-position, which reproduces the 21 of 180 recorded in `08eb67a0de` and measures the post-fix state rather than this baseline | Met | |
| AC-003 | REQ-003 | Given the semantic lane, When its weight and embedding count are read, Then the structural cause is on record | Re-run 2026-09-02: `advisor_status --workspace-root "$PWD" --format json` reports `laneWeights.semantic_shadow: 0.05`, and `sqlite3 .../skill-graph.sqlite "select count(*) from skill_nodes where embedding is not null;"` returns 0 | Met | |
| AC-004 | REQ-004 | Given command-surface modes, When the denominator is fixed, Then they are excluded with the reason stated | Re-checked 2026-09-02: `research/gate-b-measurement.md` names `model-benchmark` and `skill-benchmark` with `advisorRouting.routingClass: "command-bridge"` at lines 128 and 461, and its denominator table reports 8 of 172 beside 8 of 180 | Met | |

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

AC-002 carried the packet: the rate is on record with its denominator and it reproduces, which
is what makes 4.4 percent an honest starting point rather than an impression. Enabling the
semantic lane was consciously left out, even though it is the structural cause of the largest
miss bucket, because switching it on would void every measurement taken here.
<!-- /ANCHOR:closure -->
