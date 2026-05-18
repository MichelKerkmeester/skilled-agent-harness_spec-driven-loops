---
title: "Tasks: Phase C 8-folder README work"
description: "Task tracker for Phase C: pipeline-author 8 system-spec-kit fixture and template READMEs."
trigger_phrases:
  - "054 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/054-code-folder-readmes"
    last_updated_at: "2026-05-15T12:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created task list"
    next_safe_action: "T004 Compose Pass 1 prompt"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:7ee393c6610293fde3016eb0bde0f2b39382f5fec5e574053304b9451db94344"
      session_id: "054-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase C 8-folder README work

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet (7 files)
- [x] T002 Discovery sweep: 8 of 116 folders need new READMEs
- [x] T003 Confirm cli-devin + cli-opencode auth carryover from Phase A/B
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T004 Compose Pass 1 prompt at `/tmp/devin-054-pass1.md` (8 folders, JSON bundle schema)
- [ ] T005 Dispatch cli-devin (SWE 1.6, permission-mode dangerous, redirected stdin)
- [ ] T006 Verify 8 bundle JSON files
- [ ] T007 3-check gate per bundle (imports grep + exports grep + validation_commands smoke-run); persist `research/bundle-verification.md`
- [ ] T008 Correct any hallucinations in bundle JSON
- [ ] T009 Compose Pass 2 prompt at `/tmp/opencode-054-pass2.md` (8 bundles + template + HVR + exemplars)
- [ ] T010 Dispatch cli-opencode + deepseek-v4-pro
- [ ] T011 Verify 8 README.md files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T012 Per-README sk-doc validate (8 exit 0)
- [ ] T013 Per-README HVR score check (>= 85)
- [ ] T014 Anchor presence grep
- [ ] T015 `audit_readmes.py` over system-spec-kit (0 blocking)
- [ ] T016 Strict-validate packet (exit 0)
- [ ] T017 Sonnet @markdown + @review parallel Task-tool dispatches
- [ ] T018 Patch any P0 findings
- [ ] T019 Fill implementation-summary with actual results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or `[B]` with rationale
- [ ] 8 READMEs pass validation
- [ ] Strict-validate exits 0
- [ ] Single commit on `main`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
