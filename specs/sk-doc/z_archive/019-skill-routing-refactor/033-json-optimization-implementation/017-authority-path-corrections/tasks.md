---
title: "Task Breakdown: Authority Path and Contract Corrections"
description: "Tasks for authority path and contract corrections."
trigger_phrases:
  - "authority corrections task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/017-authority-path-corrections"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected dead citations and stale contract"
    next_safe_action: "Proceed to phase 019 or 020"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/017-authority-path-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Task Breakdown: Authority Path and Contract Corrections

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Confirm the dead citations appear in spec-folder metadata only, and not in any skill-root metadata [evidence: the dead `sk-doc/create-skill/` paths are cited only in packet spec/plan prose; a grep of skill-root metadata returns none — recorded in the impl-summary schema-conflation note]
- [x] T-02 Enumerate every occurrence across the packet's documents and metadata [evidence: 15 authority spec/plan files carried the dead path; historical review/alignment artifacts were enumerated separately and left untouched]
- [x] T-03 Confirm the command-metadata reversal is documented as deliberate in the sibling packet [evidence: the module `skill-root-metadata-contract.cjs` places command-metadata in `OPTIONAL_BY_CLASS[CLASS_HUB]` with a rationale comment; the standard was set in `019-skill-routing-refactor/021-skill-metadata-json-unification`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Correct every dead citation to a path that exists on disk, leaving historical evidence blocks untouched [evidence: `sk-doc/create-skill/` → `sk-doc/sk-create-skill/` across 15 authority docs; review/alignment historical artifacts excluded; no double-prefix corruption]
- [x] T-05 Update the contract document to match the implementing module, referencing the deciding packet [evidence: `skill-root-metadata-contract.md` command-metadata row and section changed required→optional, citing the module's OPTIONAL_BY_CLASS and packet 021]
- [x] T-06 Label, relocate or untrack the scratch artifact per operator preference [evidence: labelled in place via `010/scratch/README.md` marking `sk-doc-derived-patched.json` non-live; relocate/untrack left as an open operator preference]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-07 Confirm a search for the dead path returns no occurrences and every corrected path resolves [evidence: no `sk-doc/create-skill/` remains in authority docs; `sk-doc/sk-create-skill/` exists on disk with the contract doc at the corrected path]
- [x] T-08 Confirm the contract document and implementing module agree [evidence: both now say command-metadata is hub-optional — doc table/section updated to match `OPTIONAL_BY_CLASS[CLASS_HUB]`]
- [x] T-09 Record the schema-conflation correction durably in the packet [evidence: impl-summary records that spec-folder metadata and skill-root metadata are unrelated schemas sharing a filename, and the dead paths had no routing consequence]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

No dead citation remains and every corrected path resolves on disk; the contract document and the implementing module agree with the deciding packet referenced; the scratch artifact cannot be mistaken for live state; and the schema-conflation correction is written where a future reader will find it.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
