---
title: "Tasks: Phase 8 — rename sk-ai-small-model → sk-prompt-models"
description: "40 tasks across 3 canonical phases"
trigger_phrases: ["phase 8 tasks", "sk-prompt-models tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/008-sk-prompt-models-rename"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks.md"
    next_safe_action: "Execute Phase 1 setup"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "114-008-tasks-init"
      parent_session_id: "114-008-plan-init"
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 8 — rename sk-ai-small-model → sk-prompt-models

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[seq]` | Sequential |
| `[D:T###]` | Depends on |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] **T001** [seq] Verify predecessor 007 complete
- [ ] **T002** [P] Read cli-devin/SKILL.md
- [ ] **T003** [P] Read sk-ai-small-model/SKILL.md
- [ ] **T004** [P] Capture pre-rename rg baseline
- [ ] **T005** [P] Verify git status + git mv viability
- [ ] **T006** cli-devin context-gathering (SKIPPED per D-004)
- [ ] **T007** Bundle-gate via direct rg + jq
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Bucket 1
- [ ] **T010** [seq] git mv skill dir
- [ ] **T011** [D:T010] Edit SKILL.md
- [ ] **T012** [D:T010] [P] Edit README/description/graph-metadata/pattern-index
- [ ] **T013** [D:T010] [P] Sweep changelog v0.1-v0.3
- [ ] **T014** [D:T010] [P] Author new v0.4.0.0.md

### Bucket 2
- [ ] **T015** [P] cli-devin reverse edge
- [ ] **T016** [P] cli-opencode reverse edge

### Bucket 3
- [ ] **T017** [seq] Symlink rotation
- [ ] **T018** [D:T011-T017] Verify buckets 1+2+3

### Bucket 4
- [ ] **T019** [P] git mv 4 playbook files
- [ ] **T020** [D:T019] Content sweep
- [ ] **T021** [P] Sweep playbook indexes
- [ ] **T022** [P] Sweep permissions-matrix

### Bucket 5
- [ ] **T023** [P] Sweep root markdown
- [ ] **T024** [D:T023] Verify

### Bucket 6
- [ ] **T025** [D:T015,T016,T010] Run compiler
- [ ] **T026** [D:T025] Verify mirrors + restart advisor daemon

### Bucket 7
- [ ] **T027** [P] Sweep memory dir
- [ ] **T028** [D:T027] Re-grep

### Bucket 8 (REWRITE-ALL)
- [ ] **T029** [seq] Pre-sweep baseline
- [ ] **T030** [D:T029] Sweep 114/007/
- [ ] **T031** [D:T029] [P] Sweep 131/scratch/115
- [ ] **T032** [D:T029] [P] Sweep deep-ai-council/v1.2.0.0
- [ ] **T033** [D:T029] Sweep rename-pattern.md + worked-example rewrite
- [ ] **T034** [D:T030-T033] Restore 007 path-component refs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T035** validate.sh --strict exit 0
- [ ] **T036** Disambiguating rg residual sweep
- [ ] **T037** compiler --validate-only
- [ ] **T038** advisor smoke ≥0.7
- [ ] **T039** Symlink check
- [ ] **T040** Author impl-summary + canonical save
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] 40 tasks marked [x] with evidence
- [ ] validate.sh --strict exit 0
- [ ] Zero name-only residuals outside exemptions
- [ ] Advisor ≥0.7
- [ ] Symlink resolves
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: spec.md
- Plan: plan.md (3 phases, 8 buckets)
- Checklist: checklist.md
- Decision: decision-record.md (ADR-001..003)
- Predecessor: ../007-sk-ai-small-model-rename/implementation-summary.md
<!-- /ANCHOR:cross-refs -->
