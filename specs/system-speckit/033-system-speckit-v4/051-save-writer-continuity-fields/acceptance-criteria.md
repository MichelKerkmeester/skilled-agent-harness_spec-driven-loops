---
title: "Acceptance Criteria: Phase 51: Save writer continuity fields"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "save writer continuity criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/051-save-writer-continuity-fields"
    last_updated_at: "2026-09-23T10:40:10Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "Await operator approval to commit this phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 51: Save writer continuity fields

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/051-save-writer-continuity-fields
**Level:** 2
**Status:** Complete
**Date:** 2026-09-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a leaf packet with an `implementation-summary.md`, When a full-auto save carries all seven continuity fields, Then the block holds those values with writer-set `last_updated_at` and `last_updated_by`, and no "Unknown field" warning prints. When a later save carries only some fields, Then valid existing fields survive and an invalid one is dropped and named | `runtime/cli/tests/save-continuity-write.vitest.ts:221` (fields written, valid stored fields kept) and `:240` (invalid stored field dropped and named); `input-normalizer-unit.vitest.ts:342` (no unknown-field warning) | Met | - |
| AC-002 | REQ-002 | Given a payload whose `recent_action` exceeds 96 characters, When a full-auto save runs, Then it exits non-zero with the validator's error code and the summary stays byte-identical | `runtime/cli/tests/save-continuity-write.vitest.ts:257`: an over-length `recent_action` exits 1 and the summary is byte-identical. On a real packet an invalid `next_safe_action` exited 1 with `MEMORY_007` and wrote nothing | Met | - |
| AC-003 | REQ-003 | Given a completed packet whose summary was just edited, When a full-auto save runs and then `validate.sh --strict`, Then validation prints `RESULT: PASSED` with no `SOURCE_FINGERPRINT_MISMATCH` and no repair step between | On `sk-doc/057-sk-create-changelog-v4-style`: summary edit, `--full-auto` save from `dist` (exit 0), then `validate.sh --strict` printed `RESULT: PASSED`, Errors 0, no `SOURCE_FINGERPRINT_MISMATCH`, no repair step. Reverted with `git checkout`. Also `runtime/cli/tests/save-continuity-write.vitest.ts:363` | Met | - |
| AC-004 | REQ-004 | Given a payload without continuity fields, or any payload in plan-only mode, When the save runs, Then the continuity block is unchanged apart from the fingerprint stamp | `runtime/cli/tests/save-continuity-write.vitest.ts:268` (no fields, and plan-only) and `:353` (a completed leaf saved without fields is only stamped) | Met | - |
| AC-005 | REQ-005 | Given the three save documents, When they are read, Then each names all seven fields and the `--full-auto` condition, and `save-workflow.md` describes the parent resolution order | `--help` at `generate-context.ts:156`; `save.md` Outputs and step 6 (the field list is at line 19 and routing at step 6); `save-workflow.md` Continuity Fields table and Phase Parent Save Routing | Met | - |
| AC-006 | REQ-006 | Given a nested fixture of parent, child parent and leaf, When a full-auto save targets the leaf, Then each ancestor's `last_active_child_id` points one level down toward the leaf and `/speckit:resume` on the top parent lands on the leaf | `runtime/cli/tests/save-continuity-write.vitest.ts:278`: each ancestor points one level down, and the runtime ladder's `followPhaseParentRedirect` from the top parent lands on the leaf | Met | - |
| AC-007 | REQ-007 | Given the same fixture, When a full-auto save targets the top parent with no payload path inside the tree and a pointer chain to the leaf, and again with payload paths inside the leaf while a valid pointer names another child, Then both saves write the leaf's continuity block | `runtime/cli/tests/save-continuity-write.vitest.ts:295` (payload paths win over a valid pointer to another child) and `:310` (pointer chain with no in-tree path) | Met | - |
| AC-008 | REQ-008 | Given a parent save whose payload paths span two children, When it runs, Then it writes no continuity, lists both children in its output and leaves every pointer byte-identical | `runtime/cli/tests/save-continuity-write.vitest.ts:323`: no continuity written, both children named, pointers unchanged. The table case after it covers a lone pointer that is stale, escapes or is malformed | Met | - |

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

Every criterion is Met with observed evidence, recorded in the rows above and in `implementation-summary.md`. Nothing is committed yet; committing waits on the operator.
<!-- /ANCHOR:closure -->
