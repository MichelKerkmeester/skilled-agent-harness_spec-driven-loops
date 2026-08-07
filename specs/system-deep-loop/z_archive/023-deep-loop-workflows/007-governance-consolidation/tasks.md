---
title: "Tasks: Governance consolidation"
description: "Tasks for phase 007 of the deep-loop-workflows merge: Governance consolidation."
trigger_phrases:
  - "deep-loop-workflows phase 007"
  - "governance-consolidation"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/023-deep-loop-workflows/007-governance-consolidation"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 007 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-007-governance-consolidation-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Governance consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

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

- [ ] T001 Read predecessor continuity and `../research/research.md` for this phase's scope
- [ ] T002 Load the phase-001 parity baseline for the affected modes/surfaces

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Confirm deep-loop-workflows hub, mode-registry, hub graph metadata, and absence of nested mode graph-metadata files. (`.opencode/skills/deep-loop-workflows/mode-registry.json`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`)
- [ ] T002 Inventory declared totals, file counts, CP IDs, stale paths, helpers, and drift per mode. (`.opencode/skills/deep-loop-workflows/{context,research,review,improvement,ai-council}/feature_catalog/**`, `.opencode/skills/deep-loop-workflows/{context,research,review,improvement,ai-council}/manual_testing_playbook/**`)
- [ ] T003 Move five feature_catalog trees into one hub feature_catalog root partitioned by mode and normalize council root casing. (`.opencode/skills/deep-loop-workflows/feature_catalog/{context,research,review,improvement,ai-council}/**`)
- [ ] T004 Move five manual_testing_playbook trees into one hub playbook root partitioned by mode. (`.opencode/skills/deep-loop-workflows/manual_testing_playbook/{context,research,review,improvement,ai-council}/**`)
- [ ] T005 Rewrite stale old-skill paths and relative links in moved governance markdown while preserving deep-loop-runtime anchors. (`.opencode/skills/deep-loop-workflows/feature_catalog/{context,research,review,improvement,ai-council}/**/*.md`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/{context,research,review,improvement,ai-council}/**/*.md`)
- [ ] T006 Create merged root governance indexes with mode partitions and mode-qualified CP IDs. (`.opencode/skills/deep-loop-workflows/feature_catalog/feature_catalog.md`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/manual_testing_playbook.md`)
- [ ] T007 Dedupe the three CP sandbox setup helpers into one shared helper and update stress-test docs. (`.opencode/skills/deep-loop-workflows/manual_testing_playbook/shared/setup-cp-sandbox.sh`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/research/command-flow-stress-tests/*.md`)
- [ ] T008 Reconcile known drift: false council catalog prose, duplicate headings, and stale count self-checks. (`.opencode/skills/deep-loop-workflows/manual_testing_playbook/ai-council/council-graph-integration/*.md`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/{context,research,review,improvement,ai-council}/manual_testing_playbook.md`)
- [ ] T009 Run governance integrity verifier for links, ID mapping, and orphaned CP IDs. (`.opencode/skills/deep-loop-workflows/feature_catalog/**`, `.opencode/skills/deep-loop-workflows/manual_testing_playbook/**`)
- [ ] T010 Validate the phase spec folder after implementation evidence is recorded. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/007-governance-consolidation/`)
- [ ] T011 Re-run phase-001 artifact parity and compare post-phase outputs byte-for-byte. (`.opencode/specs/system-deep-loop/023-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr/`, `post-phase generated parity outputs`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the parity check: Re-run the phase-001 five-mode/eight-command artifact generation suite after phase 007 and compare every generated artifact with the phase-001 baseline using shasum -a 256 plus cmp -s. Governance docs intentionally move, so preservation is proven by inventory equivalence: declared totals remain 32/25/48/44/49, every pre-phase scenario maps to one post-phase mode:id, no per-file CP IDs are renumbered, and root indexes are the only collision-qualification layer.
- [ ] T015 `validate.sh --strict` on this phase folder
- [ ] T016 Confirm the phase success criteria in `spec.md` are met

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Parity check passed against the phase-001 baseline.
- [ ] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence**: `../research/research.md`, `../context/context-report.md`

<!-- /ANCHOR:cross-refs -->
