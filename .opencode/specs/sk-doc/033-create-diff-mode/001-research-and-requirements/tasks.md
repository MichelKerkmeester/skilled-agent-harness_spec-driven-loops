---
title: "Tasks: Document Diff Research and Requirements"
description: "Preparation, command-owned research, synthesis, and handoff tasks for selecting a standalone document diff architecture."
trigger_phrases:
  - "document diff research tasks"
  - "document comparison research queue"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/001-research-and-requirements"
    last_updated_at: "2026-07-13T12:36:36Z"
    last_updated_by: "codex"
    recent_action: "Synthesized 30 research iterations"
    next_safe_action: "Resolve deep-loop state audit findings"
    blockers:
      - "Command-owned lineage deltas and canonical route-proof fields are missing."
    key_files:
      - "spec.md"
      - "plan.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-research-preparation"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Which v1 architecture will the synthesis recommend?"
    answered_questions: []
---

# Tasks: Document Diff Research and Requirements

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable only through a supported workflow |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the phase parent and child from Spec Kit templates (`../`, current child). [EVIDENCE: `create.sh` created both packet levels.]
- [x] T002 Render the Level 3 document contract with the approved inline-renderer fallback (current child). [EVIDENCE: `inline-gate-renderer.sh` produced the Level 3 files.]
- [x] T003 Record product decisions, primary questions, non-goals, stop conditions, risks, and edge cases (`spec.md`, `decision-record.md`).
- [x] T004 Record local workflow contracts and known-context pointers (`resource-map.md`).
- [x] T005 Refresh generated metadata and pass strict readiness validation (`description.json`, `graph-metadata.json`, `checklist.md`). [EVIDENCE: Child and recursive parent `validate.sh --strict` runs passed with 0 errors and 0 warnings.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Start a new `/deep:research:auto` run with this child as the explicit spec folder (`research/`). [EVIDENCE: `research/orchestration-summary.json` records three successful lineages.]
- [x] T007 [P] Compare format extraction, normalization, and capability-tier approaches (`research/iterations/`). [EVIDENCE: `research/research.md` §§3-4 synthesize the format tiers and canonical model.]
- [x] T008 [P] Compare semantic and structural diff algorithms, move detection, and noise controls (`research/iterations/`). [EVIDENCE: `research/research.md` §6 records the selected strategy and eliminated alternatives.]
- [x] T009 [P] Compare snapshot lifecycle, filesystem safety, privacy, and recovery designs (`research/iterations/`). [EVIDENCE: `research/research.md` §7 defines storage, atomicity, retention, locking, and recovery.]
- [x] T010 [P] Compare self-contained HTML rendering, accessibility, XSS isolation, and visual-fidelity options (`research/iterations/`). [EVIDENCE: `research/research.md` §§8 and 10 define the report and threat controls.]
- [x] T011 [P] Compare runtime, portable interface, skill boundary, dependencies, licenses, and maintenance health (`research/iterations/`). [EVIDENCE: `research/research.md` §§2, 5, and 11.]
- [x] T012 Define the fixture corpus, performance matrix, adversarial cases, and measurable quality thresholds (`research/iterations/`). [EVIDENCE: `research/research.md` §§12 and 14 define provisional budgets and 33+ fixture pairs.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Confirm legal stop, quality guards, and coverage of all primary questions (`research/deep-research-dashboard.md`). [BLOCKED: all three lineages reached the configured maximum, but the mechanical audit reports missing deltas and route-proof fields.]
- [x] T014 Review the canonical synthesis, citations, capability tiers, architecture recommendation, and eliminated alternatives (`research/research.md`). [EVIDENCE: post-synthesis review corrected runtime, CSP, license, identity, phase-order, and snapshot contradictions.]
- [x] T015 Confirm the synthesis proposes later phases without implementing them (`research/research.md`). [EVIDENCE: §13 contains a phase map and the scoped worktree contains no product implementation.]
- [x] T016 Re-run strict child and recursive parent validation after bounded write-back (current child, `../`). [EVIDENCE: child `validate.sh --strict` and parent `validate.sh --strict --recursive` both exited 0 with 0 errors and 0 warnings on 2026-07-13.]
- [ ] T017 Update the parent phase map only after the user accepts the research direction (`../spec.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All five primary research questions are answered or have explicit evidence gaps. [EVIDENCE: `research/research.md` and the generated findings fence.]
- [x] The synthesis recommends a v1 architecture, support tiers, snapshot policy, HTML contract, portable interface, and validation corpus. [EVIDENCE: `research/research.md` §§2-14.]
- [x] Eliminated alternatives and negative knowledge are preserved with citations. [EVIDENCE: `research/research.md` eliminated-alternatives and evidence sections.]
- [x] No product implementation is mixed into the research phase. [EVIDENCE: scoped path inspection shows only packet and command-owned research artifacts.]
- [x] Strict validation passes after research write-back. [EVIDENCE: strict child and recursive parent validation both exited 0 with 0 errors and 0 warnings on 2026-07-13.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision record**: `decision-record.md`
- **Preparation gates**: `checklist.md`
- **Known context**: `resource-map.md`
- **Future synthesis**: `research/research.md`
<!-- /ANCHOR:cross-refs -->
