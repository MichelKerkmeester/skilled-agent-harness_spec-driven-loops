---
title: "Tasks: Phase 016 sk-code content coherence and reference integrity"
description: "Executed task list: audit-driven content-coherence tasks dispositioned verified already-satisfied (stale audit predated the 013 restructure); the one concrete change dropped 3 stale merger placeholder fields (af1170c663)."
trigger_phrases:
  - "sk-code content coherence tasks"
  - "sk-code reference repair tasks"
  - "phase 016 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/016-sk-code-content-coherence"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase closed by verification; sk-code STRICT 0/0"
    next_safe_action: "124 rollup"
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

**Disposition legend**: *executed* = a concrete change shipped (commit cited); *verified already-satisfied* = the audit predated the 013 two-axis restructure and re-verification found the flagged drift no longer exists (0 broken refs, STRICT 0/0, vocab-sync 0/0/0).

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture current sk-code link-check baseline for 30 broken refs, 8 useless refs, and 5 duplicate refs (`.opencode/skills/sk-code/`) [medium] — verified already-satisfied: re-check found 0 broken refs (audit predated 013)
- [x] T002 Inventory stale playbook body paths from flat `references/webflow`, `references/opencode`, `references/motion_dev`, and nonexistent `code_surface_detection.md` citations (`.opencode/skills/sk-code/manual_testing_playbook/`) [medium] — verified already-satisfied: playbook paths resolve post-013; 0 broken refs
- [x] T003 Inventory stale benchmark baseline path claims before any add-only benchmark update (`.opencode/skills/sk-code/benchmark/`) [small] — verified already-satisfied: parent-skill-check 9b baseline intact, no stale post-013 paths
- [x] T004 Confirm whether phase 017 canon vocabulary decisions affect hub metadata wording (`.opencode/skills/sk-code/description.json`, `.opencode/skills/sk-code/graph-metadata.json`) [small] — verified: no decision needed; metadata already two-axis coherent (3d-canon/5f pass)
- [x] T005 Inventory consumers of the misfiled hooks document before relocation (`.opencode/skills/sk-code/opencode/references/shared/hooks.md`, `.opencode/skills/system-spec-kit/references/`) [small] — verified already-satisfied: 0 broken hooks refs; relocation not a live defect (ADR-002 superseded)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Reference Integrity
- [x] T006 [P] Fix broken markdown references caused by post-013 `../../..` drift across sk-code packets (`.opencode/skills/sk-code/`) [large] — verified already-satisfied: 0 broken refs; 013 restructure already re-anchored paths
- [x] T007 [P] Remove or repoint useless references identified by the audit (`.opencode/skills/sk-code/`) [medium] — verified already-satisfied: audit stale; no live useless-ref defect after 013
- [x] T008 [P] Deduplicate duplicate references without losing needed navigation (`.opencode/skills/sk-code/`) [medium] — verified already-satisfied: audit stale; no live duplicate-ref defect after 013
- [x] T009 Repair stale `RESOURCE_MAP` paths and nested resource enumeration drift (`.opencode/skills/sk-code/shared/references/smart_routing.md`, router-sync tests) [medium] — verified already-satisfied: parent-skill-check 5d/5b resolve all router resource paths; non-vacuous

### Playbook and Benchmark Coherence
- [x] T010 Re-derive stale manual-testing playbook scenario bodies to nested surface-packet paths (`.opencode/skills/sk-code/manual_testing_playbook/`) [large] — verified already-satisfied: 0 broken refs; playbook bodies resolve post-013
- [x] T011 Replace nonexistent `code_surface_detection.md` citations with current shared stack-detection references (`.opencode/skills/sk-code/manual_testing_playbook/`) [small] — verified already-satisfied: no live broken citation after 013
- [x] T012 Re-derive stale checklist asset expectations where no one-to-one moved asset exists (`.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/webflow-detection.md`) [medium] — verified already-satisfied: 0 broken refs in the surface-detection playbook
- [x] T013 Add a fresh benchmark baseline against current post-013 paths without overwriting historical benchmark artifacts (`.opencode/skills/sk-code/benchmark/`) [medium] — verified already-satisfied: parent-skill-check 9b baseline intact; no stale-path re-derivation needed

### Sub-Skill Alignment
- [x] T014 Close code-quality P0 by repointing dead `assets/opencode-checklists/` load paths (`.opencode/skills/sk-code/code-quality/SKILL.md`) [small] — verified already-satisfied: 0 broken refs; STRICT 0/0
- [x] T015 Close code-verify P0 by re-anchoring the stack-folder verifier to the current hub layout (`.opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py`) [medium] — verified already-satisfied: parent-skill-check STRICT confirms hub/surface layout resolves
- [x] T016 Repoint code-verify SKILL and README instructions after verifier repair (`.opencode/skills/sk-code/code-verify/SKILL.md`, `.opencode/skills/sk-code/code-verify/README.md`) [small] — verified already-satisfied: 0 broken refs in code-verify docs
- [x] T017 [P] Close webflow P1 sk-doc alignment findings (`.opencode/skills/sk-code/webflow/`) [medium] — verified already-satisfied: vocab-sync 0/0/0; 0 broken refs
- [x] T018 [P] Close opencode P1 sk-doc alignment findings (`.opencode/skills/sk-code/opencode/`) [medium] — verified already-satisfied: vocab-sync 0/0/0; 0 broken refs
- [x] T019 [P] Close animation P1 sk-doc alignment findings (`.opencode/skills/sk-code/animation/`) [medium] — verified already-satisfied: vocab-sync 0/0/0; 0 broken refs
- [x] T020 [P] Close shared P1 reference-layer findings and non-vacuous router-sync coverage (`.opencode/skills/sk-code/shared/`) [medium] — verified already-satisfied: parent-skill-check 5b covers 8 modes / 21 vocab classes; non-vacuous

### Canon Metadata and Relocation
- [x] T021 Refresh sk-code `description.json` prose to the two-axis model with mode-registry, hub-router, workflowMode, packetKind, and surfaceBundle tokens (`.opencode/skills/sk-code/description.json`) [medium] — executed via `af1170c663` (dropped stale `merger_spec_folder`); two-axis prose verified already-canonical (3d-canon/5f pass)
- [x] T022 Refresh sk-code `graph-metadata.json` prose and causal summary to name the three surface packets and surfaceBundle canon (`.opencode/skills/sk-code/graph-metadata.json`) [medium] — executed via `af1170c663` (dropped stale `merger_packet` + `motion_dev_packet`); surface/canon prose verified already-current
- [x] T023 Relocate the misfiled spec-kit hooks document to system-spec-kit references (`.opencode/skills/sk-code/opencode/references/shared/hooks.md`, `.opencode/skills/system-spec-kit/references/`) [medium] — verified already-satisfied / superseded (ADR-002): 0 broken hooks refs; no live ownership defect forcing the move
- [x] T024 Repoint all live references to the relocated hooks document (`.opencode/skills/sk-code/`, `.opencode/skills/system-spec-kit/`) [medium] — verified already-satisfied: no relocation performed; 0 broken hooks refs remain

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T025 Run router-sync vitest and confirm nested packet resource coverage is non-vacuous [verified] — parent-skill-check 5b: routerSignals match registry (8 modes); 5c–5e resolve
- [x] T026 Run vocab-sync vitest and confirm vocabulary ownership remains aligned [verified] — parent-hub-vocab-sync: driftDetected false; 0 orphan / 0 collision / 0 ownership drift
- [x] T027 Run code-verify stack-folder verifier from its current script location [verified] — parent-skill-check STRICT 0/0 confirms hub/surface layout resolves

### Integration Tests
- [x] T028 Run sk-code markdown link checker and confirm 0 broken live references [verified] — check-markdown-links.cjs: 0 broken references under sk-code
- [x] T029 Run parent-skill-check strict for sk-code and confirm 0 failures [verified] — all hard invariants pass, 0 warnings, exit 0
- [x] T030 Run stale-path grep across sk-code playbook and benchmark baseline for flat-era path strings [verified] — 0 broken refs; af1170c663 removed the remaining stale metadata fields

### Manual Verification
- [x] T031 Review manual-testing playbook scenario bodies for semantic path correctness after re-derivation [verified] — playbook paths resolve post-013; 0 broken refs
- [x] T032 Review `description.json` and `graph-metadata.json` for two-axis canon prose and no stale placeholder fields [verified] — af1170c663 removed the 3 merger placeholder fields; 3d-canon/5f pass
- [x] T033 Review relocated hooks doc ownership and references from both old and new locations [verified] — relocation superseded (ADR-002); 0 broken hooks refs

### Documentation
- [x] T034 Update phase checklist with evidence after implementation checks pass (`checklist.md`) [verified] — checklist marked complete with inline evidence markers
- [x] T035 Update phase implementation summary from planned to completed only after all gates pass (`implementation-summary.md`) [verified] — implementation-summary flipped to Complete with verification table + deviations

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` after execution and evidence capture.
- [x] No `[B]` blocked tasks remaining or unapproved deferrals.
- [x] sk-code link check, router-sync, vocab-sync, and parent-skill-check strict pass.
- [x] Benchmark baseline refresh is add-only and stale-path-free (verified already-satisfied; baseline intact).
- [x] Checklist.md evidence is filled only after verification runs.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
