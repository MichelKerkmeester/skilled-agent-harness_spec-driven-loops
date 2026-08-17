---
title: "Tasks: Fix the five sk-vision host-adapter findings"
description: "Task ledger for the three-phase fix of the 048 research findings, implemented by DeepSeek V4 Flash."
trigger_phrases:
  - "sk-vision host-adapter findings fixes tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/018-host-adapter-findings-fixes"
    last_updated_at: "2026-08-17T20:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "DeepSeek Flash fixed all 5 findings across 3 phases; Claude verified."
    next_safe_action: "Commit the packet on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/018-host-adapter-findings-fixes/tasks.md"
      - ".opencode/skills/sk-vision/vision-runtime/python/runtime.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-018-host-adapter-findings-fixes"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix the five sk-vision host-adapter findings

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read exact targets + choose executor. Evidence: `runtime.py` lines 154/462, `types.ts` 66/86/96, `photon.ts` 185/222; cli-pi DeepSeek Flash.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 F5a tolerant base64 in `runtime.py`. Evidence: `runtime.py` diff; strict decode raises Incorrect padding, tolerant passes.
- [x] T003 F3a `_require_task("ocr")` in `handle_ocr`. Evidence: `runtime.py` line 478.
- [x] T004 F5b settings passthrough (3 files). Evidence: `tools.ts` diff; `tsc` exit 0.
- [x] T005 Docs F3b/F4/F1/F2 across 4 files. Evidence: grep confirms each recipe in `SKILL.md`/`README.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Verify base64 + OCR guard. Evidence: `python3` fail-then-pass probe; grep line 478.
- [x] T007 Verify settings + tsc + tests. Evidence: `tsc` 0; provider/server 6/6; runtime 3/3.
- [x] T008 Verify docs + packages. Evidence: sk-vision `--check` PASS; `ci-skill-root-metadata` 13/13.
- [ ] T009 Commit the packet on v4. Evidence: pending.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation tasks T002-T005 complete. Evidence: `tasks.md` T002-T005.
- [x] Verification tasks T006-T008 pass. Evidence: `implementation-summary.md` Verification.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [ ] Commit task T009 complete. Evidence: pending.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
