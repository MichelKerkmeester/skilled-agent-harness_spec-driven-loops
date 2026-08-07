---
title: "Tasks: 076 sk-doc Router Coverage v3"
description: "Task list for OPTIMIZATION + INSTALL_GUIDE scenario authoring, v3 extractor build, matrix run, review-report-v3, and validation."
trigger_phrases: ["076 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/010-sk-doc-missing-router-intents-bullet-aware-matrix"
    last_updated_at: "2026-05-05T18:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "v3 matrix complete"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "076-final"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 076 sk-doc Router Coverage v3

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete |
| `[~]` | In progress |
| `[!]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author SD-016 (OPTIMIZATION) at `.opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/004-optimization.md`
- [x] T002 Author SD-017 (INSTALL_GUIDE) at `.opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/005-install-guide.md`
- [x] T003 Update manual_testing_playbook.md Categories table (row 1) + Scenario Index list
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Copy `071/002-matrix-execute/scripts/run-matrix.sh` to `076/scripts/run-matrix-076.sh`; adjust scenario filter to `01--intent-detection/00[45]-*.md`; redirect log/delta paths to 076
- [x] T005 Run dispatcher to produce 6 logs + 6 delta records (2 scenarios × 3 CLIs); all exit_code 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Author `076/scripts/extract_metrics_v3.py` (extends 072 v2 with markdown-bullet-aware `detect_resources_v3()`)
- [x] T007 Run v3 extractor across 51 cells to produce `076/matrix_v3.csv` (52 lines incl header)
- [x] T008 Author `076/review-report-v3.md` with per-CLI v3 numbers, v2-vs-v3 delta, OPTIMIZATION/INSTALL_GUIDE findings, recommendations
- [x] T009 Author Level 1 spec docs (spec.md, plan.md, tasks.md, implementation-summary.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T010 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/z_archive/010-sk-doc-missing-router-intents-bullet-aware-matrix --strict` exits 0
- [ ] T011 `git add` + commit "feat(076): sk-doc router coverage v3 — OPTIMIZATION + INSTALL_GUIDE intents + bullet-aware extractor"
- [ ] T012 `git push origin main` succeeds
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: `072/review-report-v2.md` (extractor v2; n=15)
- Caveat surface: `075/spec.md` (cli-copilot hallucination caveat in cli-copilot/SKILL.md + sk-doc/SKILL.md)
- Source matrix: `071/002-matrix-execute/` (logs + deltas re-used by v3)
- Plan reference: `076/plan.md`
- Synthesis: `076/review-report-v3.md`
<!-- /ANCHOR:cross-refs -->
