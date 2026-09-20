---
title: "Task Breakdown: Program-Surface Leftovers"
description: "Tasks for program-surface leftovers."
trigger_phrases:
  - "program leftovers task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/019-program-surface-leftovers"
    last_updated_at: "2026-07-30T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed four program-surface leftovers"
    next_safe_action: "Proceed to phase 018"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/019-program-surface-leftovers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Program-Surface Leftovers

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Confirm each of the four findings still reproduces against the current tree [evidence: workflow had no `permissions:`, catalog said "twelve packets", `sync.ts` advertised the full writer, parent REQ-001 said "before Phase 1" — all confirmed against the live tree]
- [x] T-02 Search for callers of the deprecated derived-sync writer to decide deletion versus documentation [evidence: `grep` for `derived/sync` importers found only two test files, no production caller → documented as deprecated rather than deleted]
- [x] T-03 Read the live mode registry to establish the real mode-to-packet relationship [evidence: `sk-doc/mode-registry.json` has 12 modes over 11 packets; `sk-create-skill` backs `sk-create-skill` and `sk-create-skill-parent`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Declare an explicit least-privilege token grant on the routing workflow [evidence: `permissions: { contents: read }` added at the top level of `routing-registry-drift.yml`, sequenced after 014's edit to the same file]
- [x] T-05 Correct the feature catalog's mode-versus-packet framing and any count that implied one-to-one [evidence: three "twelve packets" statements rewritten to "twelve modes over eleven packets"; no "twelve packets" text remains]
- [x] T-06 Delete the deprecated writer if no caller reaches it, otherwise document accurately what it honours [evidence: no production caller, so a `@deprecated` banner on `syncDerivedMetadata` states it is off the serving path and retained only for its tests]
- [x] T-07 Amend the requirement wording so it matches where the baseline capture actually sits [evidence: parent REQ-001 now reads "recorded by the baseline-capture phase (Phase 2), ahead of every gate/delete/migration/rewire"]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [~] T-08 Confirm a CI run passes under the narrowed permission grant [evidence: operator-gated — a GitHub Actions run needs a push this program forbids; the grant is `contents: read` and the jobs only read, so it is safe by inspection, recorded in the impl-summary]
- [x] T-09 Confirm the catalog matches the live mode registry [evidence: catalog now states 12 modes / 11 packets with `sk-create-skill` backing two modes, matching `mode-registry.json`]
- [x] T-10 Re-read the parent spec and confirm no requirement still contradicts the phase map [evidence: the only remaining "Phase 1" reference is the corrected REQ-001; success criteria and transition rules already agree with the map]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The workflow declares explicit permissions and still passes CI under them; the feature catalog describes the real mode-to-packet relationship; the deprecated writer is gone or accurately documented with the caller search recorded; the requirement wording agrees with the phase map; and each fix carries a verification specific to it.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
