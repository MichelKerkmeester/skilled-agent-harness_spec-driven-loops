---
title: "Acceptance Criteria: Spec auto-healing research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "spec auto healing research acceptance criteria"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research"
    last_updated_at: "2026-10-07T22:40:00Z"
    last_updated_by: "claude-opus-5.5"
    recent_action: "Met every criterion with the evidence named in each row"
    next_safe_action: "None, the phase is closed. The follow-up work is the ranked table in research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-spec-auto-healing-research-close"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Spec auto-healing research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research
**Level:** 2
**Status:** Complete
**Date:** 2026-10-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fan-out config with three executors, When the run finishes, Then each lineage records 15 iterations and a `synthesis_complete` event with `stopReason: maxIterationsReached` | Each lineage state log holds 15 iteration rows and that event at research/lineages/pi-deepseek-flash-max/deep-research-state.jsonl:17, research/lineages/devin-swe-2-max/deep-research-state.jsonl:17 and research/lineages/codex-luna-6-max-fast/deep-research-state.jsonl:17. research/orchestration-summary.json:9 reports 3 succeeded | Met | - |
| AC-002 | REQ-002 | Given the merged lineages, When the synthesis is written, Then it answers all five questions and ranks recommendations with effort, risk, files touched and evidence | Sections 5 to 9, from research/research.md:65 to research/research.md:179, answer Q1 to Q5, and research/research.md:223 ranks 16 recommendations with those columns | Met | - |
| AC-003 | REQ-003 | Given the live repair lanes, When the run and synthesis finish, Then this phase wrote nothing outside this packet and ran no git write | research/research.md:307 records the containment result: 370 unique paths, none reverted, all inside Phase 13 lane folders except one re-derive report. No `git add`, commit, push or stash ran | Met | - |
| AC-004 | REQ-004 | Given the executor claims, When the synthesis is written, Then it records which claims the orchestrator confirmed, downgraded or refuted and the line it read | research/research.md:198 (3 refuted, 4 downgraded, 1 corrected) and research/research.md:346 (32 verification notes) | Met | - |
| AC-005 | REQ-005 | Given each recommendation, When it is ranked, Then it states idempotency, reversal and whether it changes what a document says | research/research.md:225 states the defaults, and each row's last column states the document effect | Met | - |
| AC-006 | REQ-006 | Given the filled packet, When `validate.sh --strict` runs on it, Then it ends with `RESULT: PASSED` | `validate.sh --strict` on this folder printed `RESULT: PASSED`, recorded at implementation-summary.md:119 | Met | - |

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

The fan-out run and the reviewed synthesis carried the packet. The fixes themselves are out of scope and wait in the ranked table for a follow-up packet the operator approves.
<!-- /ANCHOR:closure -->
