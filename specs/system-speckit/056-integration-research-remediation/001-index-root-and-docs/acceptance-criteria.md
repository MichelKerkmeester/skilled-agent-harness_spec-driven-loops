---
title: "Acceptance Criteria: Phase 1: index-root-and-docs"
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
    packet_pointer: "scaffold/001-index-root-and-docs"
    last_updated_at: "2026-09-05T21:16:57Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-056-001-index-root-and-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: index-root-and-docs

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/056-integration-research-remediation/001-index-root-and-docs
**Level:** 3
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the generator module, When `DEFAULT_REPO_ROOT` is read, Then it equals the repository root and not `.opencode` | `node --input-type=module -e "…generate-trigger-index.mjs…DEFAULT_REPO_ROOT"` prints the repo path; `tests/retrieval-repo-root.vitest.ts` | Met | - |
| AC-002 | REQ-002 | Given two consecutive generator runs, When their hashes are compared, Then they match and the index lists documents under all three corpus roots | index sha `1792466ed4…` both runs; 1,864 `.opencode/skills` paths, 2 install guides, 11,597 spec paths | Met | - |
| AC-003 | REQ-003 | Given the skill docs, When every "<N>-rule registry" phrase is read, Then N equals the registry length | `tests/validator-registry-doc-count.vitest.ts` passes; `grep -c "46-rule" README.md` prints 0 | Met | - |
| AC-004 | REQ-004 | Given `runtime/api/README.md`, When its overview is read, Then it names the API as the internal runtime-to-CLI boundary | paragraph present in §1 | Met | - |

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

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
