---
title: "Acceptance Criteria: Phase 39: main-sk-doc-routing-repair"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "main sk doc routing repair acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair"
    last_updated_at: "2026-11-16T16:54:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-039-main-sk-doc-routing-repair"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 39: main-sk-doc-routing-repair

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `039-main-sk-doc-routing-repair`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the narrowed phrases, When the advisor suite runs with `AI_SESSION_CHILD` unset and set to 1 and `FLOOR` runs, Then 0 failed both ways and `FLOOR` prints 24/44, 0/35 and 2/44 | `scratch/after-pass-ten.txt`: 2353 passed 0 failed with the flag unset and set; FLOOR 24/44, 0/35, 2/44 | Met | - |
| AC-002 | REQ-002 | Given "git hooks", "git rules", "git standards", "git hooks broken" and "runtime mirror drift", When `doctor-bridge-isolation` and `doctor-routing-slice` run, Then each passes with no test or baseline file changed | both test files pass in `scratch/after.txt`; `git diff --stat` lists no test or baseline file | Met | - |
| AC-003 | REQ-003 | Given README requests for the session-handover hook, the git-preflight hook and a runtime folder, When the advisor CLI scores them, Then each tops sk-doc | `scratch/readme-probes.txt` | Met | - |
| AC-004 | REQ-004 | Given the independent holdout and the ratchet ledger, When their tests run, Then the holdout prints 49 of 63 or more and `rr-iter3-069` matches its ledger top, with no baseline or ledger edit | both test files pass; no baseline or ledger file changed | Met | - |
| AC-005 | REQ-005 | Given the regenerated intent signals and the recompiled graph, When `generate-router-intent-signals.cjs --check` and `skill-graph-freshness.cjs --strict` run, Then both exit 0 | `scratch/after.txt`: RESULT: PASSED and graph freshness exit 0 | Met | - |
| AC-006 | REQ-006 | Given `do not run '/create:readme' yet` and the doctor install files, When the guards test and `doctor-install-contract.test.cjs` run, Then the quoted refusal reads as a mention and the contract passes, and both fail without the fix | three quote cases fail without the fix and 167 pass with it; the contract passes 17/17 and fails with main's text; doctor tests 1266/0 | Met | - |

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

Every row is Met with the evidence it names.
<!-- /ANCHOR:closure -->
