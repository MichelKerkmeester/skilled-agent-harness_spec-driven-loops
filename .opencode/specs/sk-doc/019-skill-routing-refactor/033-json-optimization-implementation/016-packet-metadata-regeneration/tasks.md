---
title: "Task Breakdown: Packet Metadata Regeneration"
description: "Tasks for packet metadata regeneration."
trigger_phrases:
  - "metadata regeneration task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/016-packet-metadata-regeneration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Regenerated packet metadata; fixed phase map"
    next_safe_action: "Proceed to phase 017"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/016-packet-metadata-regeneration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Packet Metadata Regeneration

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Commit the packet so the generator pass is fully revertible [evidence: phases 013–015 committed (`f0a9574664`, `9f59480d24`, `1a140d828b`) before this pass]
- [x] T-02 Confirm the upstream honesty phase has established which completion state is truthful [evidence: phase 015 reconciled parent/012 to In Progress and 011 to Planned; this pass propagates that, not Complete]
- [x] T-03 Examine the frontmatter errors on the affected children and attribute them to a cause [evidence: attributed to narrative-overflow on `recent_action`/`next_safe_action`, already fixed by 015 — a separate cause from the missing generator pass]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Run the close-time metadata generator across the packet and its children [evidence: `backfill-graph-metadata --all` refreshed 21 folders, rewrote 13 stale ones, failed: []]
- [x] T-05 Confirm the pass resolved the phase map, continuity blocks, derived status and fingerprints together [evidence: fingerprints + derived status regenerated; the phase map (authored) was hand-corrected as it is outside the generator's reach]
- [x] T-06 List explicitly any residue the generator could not fix rather than hand-patching it quietly [evidence: impl-summary limitations record the derived-vs-authored status divergence and the phase-map's authored nature]
- [x] T-07 Make the phase map unambiguous about whether its status column means planning or execution state [evidence: the map now carries a header note "reflects execution state" and its Status column reads execution truth]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-08 Diff the result and confirm only derived and metadata fields changed [evidence: `git diff --name-only` excluding `graph-metadata.json`/`description.json` returned nothing — no authored prose, code, or requirements touched]
- [x] T-09 Confirm the generated-metadata integrity check passes across every folder [evidence: `validate --recursive --strict` → Errors: 0 across all 21 folders; the 13-folder GENERATED_METADATA_INTEGRITY group is cleared]
- [x] T-10 Confirm the propagated status matches the reconciled truth, not an assumed Complete [evidence: graph-metadata derived.status reads parent in_progress, 011 planned, 012 in_progress — 015's reconciliation, not a blanket Complete]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

One generator pass resolves all four symptoms; propagated status matches the reconciled truth rather than an assumed Complete; the generated-metadata integrity check passes across every folder; the frontmatter errors are attributed to a cause; and a diff review confirms no authored content was overwritten.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
