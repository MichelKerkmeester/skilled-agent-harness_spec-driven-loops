---
title: "Task Breakdown: Evidence Integrity and Completion-Claim Repair"
description: "Tasks for evidence integrity and completion-claim repair."
trigger_phrases:
  - "evidence integrity task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/015-evidence-integrity-repair"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Repaired evidence and withdrew false claims"
    next_safe_action: "Proceed to phase 016"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/015-evidence-integrity-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Evidence Integrity and Completion-Claim Repair

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Run the validator per folder and group its errors by root cause [evidence: `validate --recursive --strict` → Group A fingerprint (13 folders), Group B frontmatter-narrative (5 folders)]
- [x] T-02 Identify which error groups belong here and which share the metadata phase's generator cause [evidence: Group A shares 016's fingerprint-regeneration cause → assigned; Group B is authored-template → fixed here]
- [x] T-03 Scan the rollout checklist for repeated evidence text and record how many items share each blob [evidence: 012 checklist had 21 `[x]` items sharing exactly 1 evidence blob (`grep -oE '[evidence:…]' | sort -u | wc -l` = 1)]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Rewrite each checklist item so its evidence names the specific artifact section supporting that item [evidence: all 21 items now cite distinct locations (results/final-corpus-capture.md sections, plan.md §7, code file:lines); no two share text]
- [x] T-05 Re-open the three items covering top-1 delta, top-3 across slices, and absence of unexplained regression [evidence: CHK-006, CHK-007, CHK-012 unchecked to `[ ]` and marked RE-OPENED (plus CHK-019 parent-completion)]
- [x] T-06 Restate those three against the upstream measured figures, recording an accepted delta explicitly if the regression was accepted rather than fixed [evidence: each restated against 013's figures (51/72, 53/72, 8/11) with the fixed-to-pin outcome noted — the regression was fixed, not accepted]
- [x] T-07 Reconcile the command-metadata phase so status, delivery, verification and continuity agree [evidence: 011 Status→Planned and completion→0 in spec.md + implementation-summary.md, matching Delivered/Verification "Not yet"]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-08 Confirm no two checklist items share identical evidence text [evidence: `grep -oE '[evidence:…]' 012/checklist.md | sort | uniq -d` returns nothing across the 21 items]
- [x] T-09 Re-run the validator and confirm the assigned groups are resolved or explicitly deferred [evidence: post-edit `validate --recursive` shows only 13 GENERATED_METADATA_INTEGRITY (Group A, deferred to 016); Group B (frontmatter) fully resolved, no new error types]
- [x] T-10 Either confirm the completion gate passes, or withdraw the completion claim [evidence: the gate does not pass (13 fingerprint errors are 016's), so the parent and 012 were withdrawn Complete→In Progress and 011→Planned]
- [x] T-11 Sweep every remaining completion marker in the packet for evidence a reader can independently check [evidence: the disproven Complete claims (parent, 011, 012) were withdrawn; 001–010's Complete markers rest on their own shipped work and only carry the 016-owned fingerprint staleness, recorded in limitations]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

No two checklist items share evidence text; the three regression items are re-opened and restated against measured figures; the command-metadata phase states one truth; validation errors are grouped by cause and each group is fixed, assigned or deferred with reasons; and the completion gate either passes or the completion claim is withdrawn.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
