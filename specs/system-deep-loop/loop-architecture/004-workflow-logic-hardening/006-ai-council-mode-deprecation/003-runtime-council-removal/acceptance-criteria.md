---
title: "Acceptance Criteria: Phase 3: runtime-council-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "runtime council removal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/003-runtime-council-removal"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-runtime-council-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: runtime-council-removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-ai-council-mode-deprecation/003-runtime-council-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. AC ids come from the criteria list this phase had before it was split, so a criterion keeps its id in the child that owns it. Ids from AC-018 up were added at the split. A new row takes the highest AC-ID across the five children plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-006 | REQ-006 | Given the final tree, When the divergent pivot tests run, Then they pass with the one kept council file | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0. Observed: prints 5 lines ending `Duration  200ms (transform 61ms, setup 38ms, import 51ms, tests 138ms, environment 0ms)`, exit 0. Evidence at `tasks.md:70` | Met | - |
| AC-011 | REQ-011 | Given the final tree, When the packet and council libraries are listed, Then they are gone except the dispatch file the pivot reads | `git ls-files .skilled/skills/system-deep-loop/deep-ai-council` prints nothing and `ls .skilled/skills/system-deep-loop/runtime/lib/council` prints `README.md` and `multi-seat-dispatch.cjs` only. Observed: command 1 prints nothing, exit 0; command 2 prints 2 lines ending `README.md`, exit 0. Evidence at `tasks.md:45` | Met | - |
| AC-012 | REQ-012 | Given each removed runtime file, When its caller check runs, Then no live caller remains | The caller checks in tasks T039 to T045 each print nothing. T042 to T045 each print nothing. T039 and T040 print only allowlisted history fixtures: two retrieval index fixtures and a frozen spec copy. Evidence at `tasks.md:46` | Met | - |
| AC-013 | REQ-013 | Given the final tree, When convergence is asked for the council loop type and the runtime suite runs, Then the type is rejected and the suite passes | `node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder <this folder> --session-id probe --loop-type council` prints an `INPUT_VALIDATION` error starting `loopType must be` that does not name `council`, and `cd .skilled/skills/system-deep-loop/runtime && npm test && npm run typecheck` exits 0. Observed: the probe prints `INPUT_VALIDATION` with `loopType must be "research", "review", or "context"` and exits 3, and `npm test && npm run typecheck` exits 0 with 172 files and 2904 tests passed. Evidence at `tasks.md:47` | Met | - |

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

Yes. Every criterion is met, with the observed result written in its Verification cell.
<!-- /ANCHOR:closure -->
