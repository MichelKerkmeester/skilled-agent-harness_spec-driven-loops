---
title: "Acceptance Criteria: Phase 8: remediation-deep-review"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "remediation deep review acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/008-remediation-deep-review"
    last_updated_at: "2026-10-10T22:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "r4-t4-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: remediation-deep-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/066-feature-catalog-template-anchor-deprecation/008-remediation-deep-review
**Level:** 2
**Status:** Complete
**Date:** 2026-10-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the auto workflow, When five iterations run on cli-pi, Then each passes its iteration check | `verify-iteration.cjs` printed `OK iteration N complete: narrative + route-proof + delta` for N = 1 to 5, each on the first dispatch; the state log holds 5 iteration records | Met | - |
| AC-002 | REQ-002 | Given the iteration findings, When synthesis reruns each proof, Then the report keeps only confirmed ones with file:line, evidence and a fix | `review/review-report.md`: verdict PASS, 5 confirmed P2, 1 iteration finding not kept with its reason | Met | - |
| AC-003 | REQ-003 | Given the run, When the tree is inspected, Then no product file changed | `git status --short` lists only this phase folder, the parent's `spec.md`, `goal.md` and `graph-metadata.json`, and the regenerated trigger index with its three retrieval fixtures | Met | - |

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

The review ran its five iterations and the report keeps only re-proved findings. Fixing the five P2 advisories is left to a follow-up, by design of a review-only phase.
<!-- /ANCHOR:closure -->
