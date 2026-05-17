---
title: "Tasks: cli-devin extraction rerun"
description: "Numbered tasks for build + re-run + synthesis"
trigger_phrases:
  - "113/005 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/005-extraction-rerun"
    last_updated_at: "2026-05-17T05:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded tasks"
    next_safe_action: "Start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000116002"
      session_id: "113-005-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: cli-devin extraction rerun

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Verify 113/002 rig dry-run green
- [ ] T002 Verify claude CLI auth (`claude --version`) + devin CLI auth (`devin auth status`)
- [ ] T003 Create 113/005 directory tree (scripts/, state/, iterations/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Build `scripts/extract-files-from-markdown.cjs` — parse fenced blocks, infer paths (comment headers / markdown headers / context), write to fixture CWD with conservative skip-on-ambiguity
- [ ] T011 Add canned-output extraction tests (a passing canned output should extract N files to expected paths)
- [ ] T012 Modify `../002-eval-rig/scripts/score-variant.cjs` to call extraction when `EVAL_LOOP_EXTRACT=true`; add seed snapshot/restore between variants
- [ ] T013 Build `scripts/loop-v2.cjs` wrapper that sets env vars + invokes 113/003 loop with output dir redirected to 113/005/state
- [ ] T014 Smoke-test on 1 variant × 1 fixture in mock mode; verify extraction wrote expected files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run full re-run: `node scripts/loop-v2.cjs --real --max-iters 5` (no mutation; just 5 seeded variants)
- [ ] T021 Verify all 5 iterations completed (state-v2.jsonl has 5 iteration rows + loop_end)
- [ ] T022 Synthesize v2: `node scripts/synthesize-v2.cjs` writes synthesis-v2.md
- [ ] T023 Manually inspect synthesis-v2.md — confirm verdict (ranking stable vs shifted)
- [ ] T024 If shifted: draft `cli-devin-v1.0.6.0-draft.md` with new winner
- [ ] T025 strict-validate 113/005 packet
- [ ] T026 Commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T001-T013, T020-T023, T025-T026) pass
- [ ] synthesis-v2.md ratified (operator-reviewed)
- [ ] Cost stayed within $10 ceiling
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Upstream**: 113/002 rig, 113/003 loop, 113/003 synthesis.md (v1 baseline)
<!-- /ANCHOR:cross-refs -->
