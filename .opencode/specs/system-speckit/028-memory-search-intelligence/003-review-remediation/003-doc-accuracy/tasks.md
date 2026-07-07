---
title: "Tasks: Doc Accuracy Remediation"
description: "PENDING task list for the changelog mislabel and doc staleness cluster fixes."
trigger_phrases:
  - "028 doc accuracy tasks"
  - "doc staleness cluster tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-review-remediation/003-doc-accuracy"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING doc-accuracy tasks"
    next_safe_action: "Trace each doc claim to a commit"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-006-003-doc-accuracy"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Doc Accuracy Remediation

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Trace the mislabeled rollup rows (009/011/017/018/020) to their commits and child summaries. Traced to `ed53661043`, `5308401d95`, `8f8776e329` and each child implementation-summary. 008 confirmed no-code per its child.
- [x] T002 Enumerate the commits omitted by `timeline.md` and `before-vs-after.md`. Full `git log main..HEAD` enumerated. The omitted window runs `4aa6473b3f` through `885f0c662e`.
- [x] T003 Confirm phase 001 has applied its `benchmark-status.md` re-run update. Confirmed committed-clean at `885f0c662e` (criterion-4 re-derived).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reclassify the Memory rollup rows, keeping phase 008 as no-code-shipped (P1-6). Rows 009 (Complete, default-off), 011/017/018/020 (Partial) corrected in `changelog-001-root.md`. 008 and 010 left as no-code per their children.
- [x] T005 [P] Refresh the `timeline.md` epochs diagram and Section E classification. Diagram extended past commit 30 with the schema cluster, release-cleanup and benchmark commits. Section E reframed shipped-behind-flag vs held. New Section D2 added. Dangling 030 pointer repointed.
- [x] T006 [P] Advance `before-vs-after.md` CURRENT STATE and correct release-cleanup claims. CURRENT STATE advanced to `5ce5130b20`. Section 6 release-cleanup corrected from PENDING to executed. Benchmark present-tense and measured-benefit framing reconciled to the criterion-4 run.
- [x] T007 [P] Add `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` to the `benchmark-status.md` inventory (plus `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` and `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB`). The `ENV_REFERENCE.md` 17-flag portion is DEFERRED: that file is dirty with an active concurrent session's flag edits and is outside the parent-dispatched scope.
- [ ] T008 Reconcile the `000-release-cleanup/spec.md` phase-map and replace the zero-hash fingerprint. DEFERRED: outside the parent-dispatched scope (3-file cluster + P1-6). Overlaps phase 004 P2 triage and a sibling phase parent. Not executed.
- [ ] T009 Populate `changelog-028-root.md` verification, files-changed and follow-up evidence. DEFERRED: outside the parent-dispatched scope. Overlaps phase 004 P2 triage. Not executed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm every status edit traces to a commit or implementation-summary. Each reclassified row and narrative claim is traced to a named commit or child summary. HVR scan confirms 0 em-dashes and 0 semicolons in the added lines.
- [ ] T011 Re-run `validate.sh 000-release-cleanup --strict` after editing the sibling spec. N/A: the 005 sibling was not edited (T008 deferred), so no sibling re-validation was required.
- [x] T012 Run strict validation for this child folder. validate.sh --strict exits 0 for this child and for the 028 root.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All parent-dispatched tasks done: P1-6 (T004) plus the timeline / before-vs-after / benchmark-status cluster (T005-T007) plus tracing and validation (T001-T003, T010, T012).
- [x] No `[B]` blocked tasks. T008, T009 and the `ENV_REFERENCE.md` portion of T007 are DEFERRED out of scope with reasons recorded above.
- [x] Every executed status change has commit or child-summary evidence.
- [x] Strict validation exits 0 for this child folder and the 028 root.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Source review**: See `../../archive/review-report.md`
<!-- /ANCHOR:cross-refs -->
