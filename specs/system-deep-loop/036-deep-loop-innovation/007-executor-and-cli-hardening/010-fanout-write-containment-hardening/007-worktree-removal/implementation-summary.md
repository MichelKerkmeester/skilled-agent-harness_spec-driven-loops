---
title: "Implementation Summary"
description: "The per-lineage worktree mechanism is removed; every lane runs in the shared checkout under preserve-by-default containment, proven by the suite, the wrapper tests and a live run."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/007-worktree-removal"
    last_updated_at: "2026-09-14T09:09:01Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Removed the worktree mechanism and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-worktree-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-worktree-removal |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The per-lineage worktree mechanism is gone. The five modules under `runtime/lib/deep-loop/worktree-*.ts` and their tests are deleted; `runtime/scripts/fanout-run.cjs` lost its dynamic imports, the `--worktrees` option, the lane worktree setup and settle, the `worktree_*` ledger events and the isolation summary (4222 to 3638 lines); `containment.worktrees` left the config schema; the feature catalog and playbooks describe the shared-checkout model only, and the isolated-run playbook is deleted. Every lane writes, spawns and is inspected at its run-keyed lineage directory inside the repo root. The launch wrapper's split-link provisioning stays because it serves the operator's session worktrees, not the fan-out. While closing, the cumulative churn test from the previous phase was made deterministic: it now disables the per-window arm instead of trying to out-pace it, because a late heartbeat under load folded spread writes into one window.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi with the full inventory in the brief and the wrapper named as off-limits. The orchestrator verified no module, key or flag remains, ran the launch-wrapper tests, ran the whole suite (one timing-dependent churn case failed once, was made deterministic, then the suite was rerun), and ran the live two-lane fan-out with a neighbour writer before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete rather than leave dormant | Dormant code behind a flag drifts from a runner nobody exercises it with |
| Keep the launch wrapper's split-link provisioning | It serves the operator's own session worktrees, which still need self-links that resolve inside their tree |
| Disable the per-window arm in the cumulative churn test | A proof that depends on the scheduler is not a proof |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Leftover references | zero worktree modules, keys or flags; only checkout wording remains |
| Launch-wrapper tests | session 25 pass, reaper 24 pass, exit 0 |
| Full deep-loop suite | `npm test` in the runtime after removal: 151 files, 2568 passed, 7 skipped, exit 0, 1264 s (one timing-dependent churn case was made deterministic and the suite rerun) |
| Live two-lane fan-out with neighbour writer | Run 1789402289626-dt269k, two DeepSeek V4.1 Flash lanes on cli-pi with a neighbour writing one untracked file every ten seconds outside the packet (60 files) plus a root file, while another session edited tracked files under specs/sk-communication: both lanes fulfilled with a containment advisory, `revertResult.reverted` empty for both, every neighbour file and every tracked edit still on disk afterwards, churn detector latched preserve; evidence in `research/orchestration-summary.json` and `research/orchestration-status.log` |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Changelogs and benchmark reports** still mention the worktree option as history; they are not maintained surfaces.
<!-- /ANCHOR:limitations -->

---


