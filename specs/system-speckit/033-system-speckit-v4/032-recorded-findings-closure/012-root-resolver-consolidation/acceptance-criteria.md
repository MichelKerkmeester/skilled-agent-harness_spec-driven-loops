---
title: "Acceptance Criteria: Phase 12: root-resolver-consolidation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "root resolver acceptance criteria"
  - "eval script merge closure gate"
  - "parity test ac traceability"
  - "shared readme waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/012-root-resolver-consolidation"
    last_updated_at: "2026-09-07T15:05:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-012-root-resolver-consolidation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 12: root-resolver-consolidation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/012-root-resolver-consolidation
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given check-source-dist-alignment.ts and check-architecture-boundaries.ts, When their resolvePackageRoot bodies are merged, Then one shared implementation serves both | `rg -n "function resolvePackageRoot"` returns one definition, not two | Met | - |
| AC-002 | REQ-002 | Given the surviving resolvers, When the parity test runs, Then every resolver returns the same root for each fixture tree | The parity test file under runtime/cli/tests/, run via vitest | Met | - |
| AC-003 | REQ-003 | Given the merge, When npm run check runs, Then it passes | `npm --prefix .opencode/skills/system-spec-kit/runtime/cli run check` | Met | - |
| AC-004 | REQ-004 | Given the config.ts/factory.ts caller audit, When a disposition is chosen, Then either they are collapsed into one predicate or shared/README.md states the reason each survives | shared/README.md's Paths and workspace section, cross-checked against the caller audit in goal.md's log | Met | - |
| AC-005 | REQ-005 | Given the final resolver set, When shared/README.md is read, Then it states the count and the boundary for each | Direct read of shared/README.md's Paths and workspace section | Met | - |
| AC-006 | REQ-006 | Given the four 035 lanes that touched these files, When each is re-validated, Then all four still validate clean | `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <lane-folder> --strict` for each of the four | Met | - |

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

Not started. This packet stays Planned until the six criteria above move from Unmet to Met, Waived or Superseded.
<!-- /ANCHOR:closure -->
