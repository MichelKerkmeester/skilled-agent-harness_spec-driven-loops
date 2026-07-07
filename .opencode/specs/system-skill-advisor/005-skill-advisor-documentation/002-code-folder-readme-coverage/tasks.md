---
title: "Tasks: Phase B scoped README work"
description: "Task tracker for Phase B: 2-track approach (pipeline-author 2 + TOC-insert 5) for system-skill-advisor README closure."
trigger_phrases:
  - "024 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/002-code-folder-readme-coverage"
    last_updated_at: "2026-05-15T11:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created task list"
    next_safe_action: "T004 Compose Pass 1 prompt"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:29ec8be1dac20a844577471937314be4a9982e87efc364e986c0eb239837b8b6"
      session_id: "024-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase B scoped README work

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

- [x] T001 Scaffold packet (description.json, graph-metadata.json, spec.md, plan.md, tasks.md, implementation-summary.md, resource-map.md)
- [x] T002 Discovery sweep: actual gap is 2 new + 5 TOC + 2 no-op (vs original 9-folder plan)
- [x] T003 Verify cli-devin install + auth carry-over from Phase A
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

### Track 1 — Pipeline authoring (2 fixture folders)

- [ ] T004 Compose Pass 1 prompt at `/tmp/devin-024-pass1.md` (2 fixture folders, JSON bundle schema, output paths)
- [ ] T005 Dispatch `devin -p --prompt-file /tmp/devin-024-pass1.md --model swe-1.6 --permission-mode dangerous </dev/null`
- [ ] T006 Verify 2 context bundles in `research/context-bundles/{tests-fixtures-lifecycle,tests-scorer-fixtures}.json`
- [ ] T007 Bundle verification gate: grep-verify internal_imports + validation_commands; persist `research/bundle-verification.md`
- [ ] T008 If any hallucinations: correct bundle JSON in place
- [ ] T009 Compose Pass 2 prompt at `/tmp/opencode-024-pass2.md` (verified bundles + sk-doc template + 2 exemplars + HVR)
- [ ] T010 Dispatch `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --dangerously-skip-permissions </dev/null`
- [ ] T011 Verify 2 README.md files written in target fixture folders

### Track 2 — TOC anchor insert (5 existing READMEs)

- [ ] T012 Generate TOC anchor block from existing section headers in each target README
- [ ] T013 Edit `lib/context/README.md`: insert TOC block
- [ ] T014 Edit `lib/scorer/lanes/README.md`: insert TOC block
- [ ] T015 Edit `lib/scorer/lanes/__tests__/README.md`: insert TOC block
- [ ] T016 Edit `scripts/routing-accuracy/README.md`: insert TOC block
- [ ] T017 Edit `stress_test/search-quality/README.md`: insert TOC block
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T018 Per-README `validate_document.py --type readme` exit 0 (7 files)
- [ ] T019 Per-README HVR score check via `--json` >= 85 (7 files)
- [ ] T020 Anchor presence grep (4 mandatory anchors per README)
- [ ] T021 Bulk audit via `audit_readmes.py` scoped to system-skill-advisor — 0 blocking errors
- [ ] T022 Strict-validate on this packet — exit 0
- [ ] T023 Sonnet @markdown + @review Task-tool dispatches, parallel
- [ ] T024 Patch any P0 findings from sonnet sweep
- [ ] T025 Fill implementation-summary.md with results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or `[B]` with rationale
- [ ] 2 new + 5 edited READMEs pass validation
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
