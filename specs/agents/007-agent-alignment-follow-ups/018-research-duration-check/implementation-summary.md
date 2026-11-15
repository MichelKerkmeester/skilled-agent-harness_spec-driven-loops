---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "research duration check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/018-research-duration-check"
    last_updated_at: "2026-11-15T11:42:50Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the phase"
    next_safe_action: "Commit and push complete; no open follow-up remains in packet 007"
    packet_purpose: "Purpose: A deep-research run stops for synthesis on the first pass after its wall-clock budget runs out."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:4ee9adbda604f16ec4c28aa6beb66705bd8202a8e0b63a5542bc267f13935a4b"
      session_id: "scaffold-018-research-duration-check"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T11:42:50Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-research-duration-check |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-research run now checks its wall-clock budget on every pass. Before, the duration check sat above `step_read_state`, where the loop re-enters, so only the first pass ran it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-research.yaml` | Modified | `step_check_max_duration` moved after `step_read_state` |
| `compiled/deep-research.contract.markdown` | Regenerated | Source digest |
| `runtime/tests/unit/workflow-max-duration.vitest.ts` | Modified | Asserts the duration check comes after `step_read_state` in both workflows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

After the baseline in `scratch/baseline.txt`, DeepSeek V4.1 Flash `--thinking max` moved the block in one dispatch. I confirmed it is a pure move (26 lines out, the same 26 lines in), recompiled the contract and ran the checks in `scratch/after.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Apply both @review P2s after the approval, without a second review [DEVIATION] | Each was a line the review wrote out; the new test assertion is proven by a mutation run |
| Leave the per-pass lock refresh as it is | The review asked whether skipping `step_refresh_lock` lets the lock go stale; it does not, because `step_dispatch_iteration` refreshes it before and after every dispatch in both workflows |
| Place the check right after `step_read_state`, before `step_run_now_check` | It matches the deep-review loop, and it keeps the check ahead of run-now, pause and convergence as before |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Step order | `step_read_state` (833) before `step_check_max_duration` (882) |
| Pure move | every changed line appears once removed and once added |
| `npm test` in the runtime | 3019 passed, 0 failed (baseline 3019 passed) |
| `workflow-max-duration.vitest.ts` | 4 passed, including the new `step_read_state` assertion |
| `check-contract-drift.cjs` | `OK commands=2` |
| @review gate | APPROVED with two P2s, both fixed |
| Placement test mutation | fails on the old research order (1 failed, 3 passed), passes on the new one |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The workflow is traced, not run.** No live research run crossed its duration limit after the first pass.
<!-- /ANCHOR:limitations -->

---
