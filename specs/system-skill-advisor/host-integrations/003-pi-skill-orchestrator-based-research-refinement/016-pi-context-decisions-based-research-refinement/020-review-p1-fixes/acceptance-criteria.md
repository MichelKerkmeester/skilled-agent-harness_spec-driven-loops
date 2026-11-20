---
title: "Acceptance Criteria: Phase 20: review-p1-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review p1 fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/020-review-p1-fixes"
    last_updated_at: "2026-11-20T11:52:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-review-p1-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 20: review-p1-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `020-review-p1-fixes`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a background refresh whose first pass is still embedding, When a second skill is indexed and the refresh is requested again, Then `embeddingCoverage().complete` is true once the run resolves | `npx vitest run tests/skill-graph/refresh-in-background.vitest.ts` in the runtime passes, and the new case fails with the source at `03c7fb56e47`. Observed: `refresh-in-background.vitest.ts` 7 passed; on the old source the new case got `current: 1` | Met | - |
| AC-002 | REQ-002 | Given a process with no read-write handle open on the skill-graph database, When `scoreSemanticShadowLane` runs its coverage gate, Then `getDbReadOnly()` still returns a read-only handle afterwards | `npx vitest run tests/scorer/semantic-shadow-cosine.vitest.ts` passes, and the new case fails with the source at `03c7fb56e47`. Observed: `semantic-shadow-cosine.vitest.ts` 8 passed; on the old source `readonly` was false | Met | - |
| AC-003 | REQ-003 | Given a lane weight above 0 and one skill without a vector, When `readAdvisorStatus` runs with `includeSemanticHealth`, Then `disabledReason` is `incomplete_skill_vectors` and `laneEnabled` is false | `npx vitest run tests/handlers/advisor-status.vitest.ts` passes, and the changed case fails with the source at `03c7fb56e47`. Observed: `advisor-status.vitest.ts` 35 passed; on the old source `laneEnabled` was true | Met | - |
| AC-004 | REQ-004 | Given the fixes, When the full runtime suite runs after `skill_graph_scan --trusted`, Then it reports no failure absent from the baseline | Full `npx vitest run` output in the runtime. Observed: Exit 0 after `skill_graph_scan --trusted`: 195 files, 2559 passed, 8 skipped | Met | - |
| AC-005 | REQ-005 | Given the two catalog pages, When they are read, Then each states the shipped behavior | `rg -n "one more pass" .../background-vector-refresh.md` and `rg -n "incomplete_skill_vectors" .../advisor-status.md` each print a line. Observed: `background-vector-refresh.md:22` and `advisor-status.md:31` each print one line | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

All five criteria are Met with observed evidence.
<!-- /ANCHOR:closure -->
