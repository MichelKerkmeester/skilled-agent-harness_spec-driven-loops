---
title: "Tasks: Phase 016 sk-code content coherence and reference integrity"
description: "Unchecked planned task breakdown for the headline sk-code content coherence phase."
trigger_phrases:
  - "sk-code content coherence tasks"
  - "sk-code reference repair tasks"
  - "phase 016 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/016-sk-code-content-coherence"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Start T001 by capturing the current sk-code reference and playbook baseline before edits"
    blockers:
      - "Phase 017 canon metadata-shape decisions may affect the exact description.json and graph-metadata.json wording."
    key_files:
      - ".opencode/skills/sk-code/manual_testing_playbook/"
      - ".opencode/skills/sk-code/description.json"
      - ".opencode/skills/sk-code/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does phase 017 land any metadata vocabulary decision before phase 016 edits begin?"
    answered_questions: []
---
# Tasks: Phase 016 sk-code content coherence and reference integrity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture current sk-code link-check baseline for 30 broken refs, 8 useless refs, and 5 duplicate refs (`.opencode/skills/sk-code/`) [medium]
- [ ] T002 Inventory stale playbook body paths from flat `references/webflow`, `references/opencode`, `references/motion_dev`, and nonexistent `code_surface_detection.md` citations (`.opencode/skills/sk-code/manual_testing_playbook/`) [medium]
- [ ] T003 Inventory stale benchmark baseline path claims before any add-only benchmark update (`.opencode/skills/sk-code/benchmark/`) [small]
- [ ] T004 Confirm whether phase 017 canon vocabulary decisions affect hub metadata wording (`.opencode/skills/sk-code/description.json`, `.opencode/skills/sk-code/graph-metadata.json`) [small]
- [ ] T005 Inventory consumers of the misfiled hooks document before relocation (`.opencode/skills/sk-code/opencode/references/shared/hooks.md`, `.opencode/skills/system-spec-kit/references/`) [small]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Reference Integrity
- [ ] T006 [P] Fix broken markdown references caused by post-013 `../../..` drift across sk-code packets (`.opencode/skills/sk-code/`) [large]
- [ ] T007 [P] Remove or repoint useless references identified by the audit (`.opencode/skills/sk-code/`) [medium]
- [ ] T008 [P] Deduplicate duplicate references without losing needed navigation (`.opencode/skills/sk-code/`) [medium]
- [ ] T009 Repair stale `RESOURCE_MAP` paths and nested resource enumeration drift (`.opencode/skills/sk-code/shared/references/smart_routing.md`, router-sync tests) [medium]

### Playbook and Benchmark Coherence
- [ ] T010 Re-derive stale manual-testing playbook scenario bodies to nested surface-packet paths (`.opencode/skills/sk-code/manual_testing_playbook/`) [large]
- [ ] T011 Replace nonexistent `code_surface_detection.md` citations with current shared stack-detection references (`.opencode/skills/sk-code/manual_testing_playbook/`) [small]
- [ ] T012 Re-derive stale checklist asset expectations where no one-to-one moved asset exists (`.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/webflow-detection.md`) [medium]
- [ ] T013 Add a fresh benchmark baseline against current post-013 paths without overwriting historical benchmark artifacts (`.opencode/skills/sk-code/benchmark/`) [medium]

### Sub-Skill Alignment
- [ ] T014 Close code-quality P0 by repointing dead `assets/opencode-checklists/` load paths (`.opencode/skills/sk-code/code-quality/SKILL.md`) [small]
- [ ] T015 Close code-verify P0 by re-anchoring the stack-folder verifier to the current hub layout (`.opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py`) [medium]
- [ ] T016 Repoint code-verify SKILL and README instructions after verifier repair (`.opencode/skills/sk-code/code-verify/SKILL.md`, `.opencode/skills/sk-code/code-verify/README.md`) [small]
- [ ] T017 [P] Close webflow P1 sk-doc alignment findings (`.opencode/skills/sk-code/webflow/`) [medium]
- [ ] T018 [P] Close opencode P1 sk-doc alignment findings (`.opencode/skills/sk-code/opencode/`) [medium]
- [ ] T019 [P] Close animation P1 sk-doc alignment findings (`.opencode/skills/sk-code/animation/`) [medium]
- [ ] T020 [P] Close shared P1 reference-layer findings and non-vacuous router-sync coverage (`.opencode/skills/sk-code/shared/`) [medium]

### Canon Metadata and Relocation
- [ ] T021 Refresh sk-code `description.json` prose to the two-axis model with mode-registry, hub-router, workflowMode, packetKind, and surfaceBundle tokens (`.opencode/skills/sk-code/description.json`) [medium]
- [ ] T022 Refresh sk-code `graph-metadata.json` prose and causal summary to name the three surface packets and surfaceBundle canon (`.opencode/skills/sk-code/graph-metadata.json`) [medium]
- [ ] T023 Relocate the misfiled spec-kit hooks document to system-spec-kit references (`.opencode/skills/sk-code/opencode/references/shared/hooks.md`, `.opencode/skills/system-spec-kit/references/`) [medium]
- [ ] T024 Repoint all live references to the relocated hooks document (`.opencode/skills/sk-code/`, `.opencode/skills/system-spec-kit/`) [medium]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [ ] T025 Run router-sync vitest and confirm nested packet resource coverage is non-vacuous [verified]
- [ ] T026 Run vocab-sync vitest and confirm vocabulary ownership remains aligned [verified]
- [ ] T027 Run code-verify stack-folder verifier from its current script location [verified]

### Integration Tests
- [ ] T028 Run sk-code markdown link checker and confirm 0 broken live references [verified]
- [ ] T029 Run parent-skill-check strict for sk-code and confirm 0 failures [verified]
- [ ] T030 Run stale-path grep across sk-code playbook and benchmark baseline for flat-era path strings [verified]

### Manual Verification
- [ ] T031 Review manual-testing playbook scenario bodies for semantic path correctness after re-derivation [verified]
- [ ] T032 Review `description.json` and `graph-metadata.json` for two-axis canon prose and no stale placeholder fields [verified]
- [ ] T033 Review relocated hooks doc ownership and references from both old and new locations [verified]

### Documentation
- [ ] T034 Update phase checklist with evidence after implementation checks pass (`checklist.md`) [verified]
- [ ] T035 Update phase implementation summary from planned to completed only after all gates pass (`implementation-summary.md`) [verified]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` after execution and evidence capture.
- [ ] No `[B]` blocked tasks remaining or unapproved deferrals.
- [ ] sk-code link check, router-sync, vocab-sync, and parent-skill-check strict pass.
- [ ] Benchmark baseline refresh is add-only and stale-path-free.
- [ ] Checklist.md evidence is filled only after verification runs.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
