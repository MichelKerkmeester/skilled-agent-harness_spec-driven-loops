---
title: "Acceptance Criteria: Phase 7: shared-references-and-detection-order"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "shared references and detection order acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/007-shared-references-and-detection-order"
    last_updated_at: "2026-10-25T19:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the acceptance criteria and marked the phase A rows"
    next_safe_action: "Phase B fills the regeneration and final-gate rows"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-shared-references-and-detection-order"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 7: shared-references-and-detection-order

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/013-private-surface-skills/007-shared-references-and-detection-order
**Level:** 3
**Status:** In Progress
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the hub, When `git status` lists `shared/references/`, Then the two checklists, `universal/error-recovery.md` and `universal/multi-agent-research.md` show `D` and the style guide shows `RM` to `sk-code-quality/references/` | `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:106` to `:110`, four `D` rows and one `RM` row | Met | - |
| AC-002 | REQ-001, REQ-007 | Given the regenerated trigger index and retrieval fixtures, When `rg` searches them for the four deleted names and the old style guide path, Then it prints nothing | `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:101` and `:102` still list `trigger-index.json` and `corpus-manifest.json`. Line 103 is the archived fixture, out of scope. The CI trigger-index job rebuilds both generated files after the push | Unmet | - |
| AC-003 | REQ-002, REQ-003 | Given the surface-hint suite, When it runs, Then a SKILLED hint leaves `[review, ci, skilled]` unchanged and a fixture specific surface leads SKILLED under every hint | `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:89`, surface-hint 12 pass, 0 fail, exit 0 | Met | - |
| AC-004 | REQ-004 | Given the advisor plugin, When it detects a generic Node workspace and a symlinked `local-*` path, Then the first is UNKNOWN and the second is not SKILLED | `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:85`, plugin and hint vitest 97 passed, exit 0 | Met | - |
| AC-005 | REQ-005 | Given a root whose `graph-metadata.json` has `surface_detection`, When the fleet gate checks it, Then an object passes and an array fails with `GRAPH_METADATA_INVALID_SURFACE_DETECTION` | `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:72`, the contract test with the accept and reject cases passes, exit 0. `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:70`, `checked=14 passed=14 failed=0` | Met | - |
| AC-006 | REQ-006 | Given `workflow-debug.md` and `workflow-verify.md`, When read, Then the no-debug-residue rule, the edge and error path row and the one-environment rule are present | `.skilled/skills/sk-code/shared/references/workflow-debug.md:127`, `.skilled/skills/sk-code/shared/references/workflow-verify.md:73`, `.skilled/skills/sk-code/shared/references/workflow-verify.md:129`, `.skilled/skills/sk-code/shared/references/workflow-verify.md:142` | Met | - |
| AC-007 | REQ-007 | Given phase B regeneration, When router-sync and parent-skill-check run, Then they print `5/5` and OK | `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:6` router-sync 5/5, `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:21` parent-skill-check OK, `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:16` all 4 drift guards PASSED, each exit 0 | Met | - |
| AC-008 | REQ-007 | Given the re-mint, When the compiled-route front-door and manifest suites run, Then both pass | Policy hash refreshed to `acbe381f` and copied to the authored twin. `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:90` manifest 48/0, `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:92` front-door 1/0, `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:91` admission test 29/0, `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:46` all 55 served copies match, `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:48` sk-code `7 pass, 0 drift` | Met | - |
| AC-009 | REQ-001 to REQ-007 | Given the final state, When recursive strict validation runs on the parent, Then it prints `RESULT: PASSED` | `specs/sk-code/013-private-surface-skills/007-shared-references-and-detection-order/scratch/evidence/phase-b-gates.log:111` to `:127`, all eight folders print `RESULT: PASSED`, exit 0. The parent keeps one non-blocking SOURCE_TAGS warning on two quarantined review copies | Met | - |

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

**Closeable:** No

AC-002 is unmet until the CI trigger-index job rebuilds the two generated files after the push. AC-001 and AC-003 to AC-009 are Met.
<!-- /ANCHOR:closure -->
