---
title: "Acceptance Criteria: Auto re-derive a spec packet's generated metadata at commit time"
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
    packet_pointer: "hooks/020-spec-metadata-auto-remint"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Every criterion verified from the final state"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-spec-metadata-auto-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Auto re-derive a spec packet's generated metadata at commit time

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/020-spec-metadata-auto-remint
**Level:** 2
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every track outside the exclusion, When the repair tool is applied, Then no packet reports a stale fingerprint | 450 packets repaired across 17 tracks plus the sk-design children, with `failed=0` on the final pass | Met | - |
| AC-002 | REQ-002 | Given a staged spec document, When the hook runs, Then the packet's derived metadata is regenerated and staged | Harness case "staged spec doc re-derives its packet", plus a companion case asserting both derived files reached the index | Met | - |
| AC-003 | REQ-003 | Given a packet staged and unstaged at once, When the hook runs, Then it refuses | Harness case "partly staged packet is refused" | Met | - |
| AC-004 | REQ-004 | Given a pathspec-narrowed commit, When the hook runs, Then it refuses rather than staging into a discarded index | Harness case "pathspec-narrowed spec commit is refused" | Met | - |
| AC-005 | REQ-005 | Given a commit staging no spec document, When the hook runs, Then it says nothing and starts no node process | Harness case "no spec doc is a silent no-op", which also asserts the gate never printed | Met | - |
| AC-006 | REQ-006 | Given a phase child, When its document is staged, Then the child resolves rather than its parent | Harness case "a phase child resolves to itself", which also asserts the parent was not re-derived | Met | - |
| AC-007 | REQ-007 | Given a repair tool that errors, When the hook runs, Then it blocks and prints the tool's own output | Harness case "repair failure blocks with its output" | Met | - |
| AC-008 | REQ-002 | Given a repair that writes nothing, When the hook runs, Then it passes without claiming work | Harness case "a no-op repair is silent" | Met | - |
| AC-009 | REQ-006 | Given a grouping directory carrying metadata but no spec.md, When a document under it is staged, Then the gate walks past it to the real packet | Harness case "a metadata-only directory resolves to its packet parent" | Met | - |
| AC-010 | REQ-001 | Given the reported apply failures, When their cause is traced, Then it is named rather than assumed | `backfill-graph-metadata.ts` tested two conditions and reported only the one that passed. All eight failures were the folder-name rule, never a missing `spec.md` | Met | - |
| AC-011 | REQ-001 | Given the corrected error, When a non-conforming name and a genuinely missing spec.md are each tried, Then each reports its own condition | `folder name "sandbox-test" is not NNN-slug` and `missing spec.md` observed from the two cases | Met | - |
| AC-012 | REQ-001 | Given the aligned caller, When the two packets that failed are re-applied, Then the failure count is zero | 026 reports `inspected=532 repaired=1 failed=0` against 535 and 3 before; 027 reports `inspected=162 repaired=3 failed=0` against 167 and 5 | Met | - |
| AC-013 | REQ-002 | Given the whole harness, When it runs against the real hook file, Then every case passes | 18 cases, 18 passed, 0 failed | Met | - |

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

AC-010 carried the packet, and it is the one worth reading. Eight packets failed the sweep, and the error said `missing spec.md` for folders that all had one. That single misleading message produced three wrong explanations in a row, each reported before it was tested: structural drift, then transient write collisions, then spurious metadata. The check tested two conditions and named the one that had passed. The fix is four lines.

AC-009 exists because of that investigation rather than despite it. Tracing the real cause exposed a live bug in the gate this packet adds, which resolved a packet by metadata alone and would have blocked any commit touching a document under a grouping directory.

One thing was deliberately not done. The eight folders could be made to pass by relaxing the name rule, which the operator explicitly allowed. Measuring first showed the three-digit prefix is what keeps the discovery walk out of benchmark fixtures and backup directories that also carry a `spec.md`, so relaxing it would write generated metadata into test fixtures. The permission was there and the evidence said not to use it.
<!-- /ANCHOR:closure -->
