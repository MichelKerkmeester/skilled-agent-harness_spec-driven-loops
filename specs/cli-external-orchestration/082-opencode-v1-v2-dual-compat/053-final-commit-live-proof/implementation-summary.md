---
title: "Implementation Summary"
description: "Phase 046 proved all 17 plugins live at commit eb0c18f7e9, and main has moved six phases since, so the two-version proof described a tree that was no longer shipping. The unchanged playbook now passes 17 of 17 on OpenCode 1.19.3 and 17 of 17 on 2.0.32 at origin/main dfdc523af5, with one rerun explained rather than hidden."
trigger_phrases:
  - "final commit live proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/053-final-commit-live-proof"
    last_updated_at: "2026-10-21T21:30:00Z"
    last_updated_by: "deepseek-v4.1-flash"
    recent_action: "Ran the 17-plugin playbook at dfdc523af5: 17 of 17 on both versions, plus one sentinel rerun"
    next_safe_action: "Push to main and record CI"
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/053-final-commit-live-proof/scratch/live-runs/results-matrix.md"
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/053-final-commit-live-proof/scratch/live-runs/summary.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "053-final-commit-live-proof"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the 046 proof still hold on the final main commit: yes, 17 of 17 on both versions at dfdc523af5"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 053-final-commit-live-proof |
| **Status** | Complete |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two-version proof now describes the tree that ships. Phase 046 showed all 17 plugins working on OpenCode 1.19.3 and 2.0.32, but it did so at `eb0c18f7e9`, and main moved through phases 047 to 052 afterwards. Rerunning the same playbook at origin/main `dfdc523af5` closes that gap: 17 of 17 pass on v1 and 17 of 17 pass on v2.

### Phase 53: final-commit-live-proof

This phase changes no code. A driver extracted each scenario file's own `Exact Command Sequence` bash block from `plugin-utilization/` and ran it unchanged, one after another, between 21:14 and 21:25 UTC, on both versions with `llmgateway/deepseek-v4.1-flash`. Nothing was edited between blocks, so a plugin that had stopped working in one of those six phases would have failed here rather than reading as green from a stale proof.

Each verdict comes from the evidence files - the events stream, the captured system prompt, the plugin's log lines and the state files - and never from the model's reply. That distinction did work: a block's exit code is its last command's, so `summary.txt` reported 0 for a block that had written nothing at all. The `system-completion-sentinel` scenario was the one case. Its first pass exited 0 with no advisory on either version, because the model added a disclaimer after the fixture sentence, which pushed the sentence outside the sentinel's 160-character claim tail and made `detectCompletionClaim` return false. The plugin behaved as designed against a reply that was not quite the fixture; the same block, run unchanged once more at 21:24 UTC, wrote the advisory on both versions. Both logs are kept, first pass and rerun, so the reader can see what happened rather than a cleaned-up result.

### Live matrix

| Plugin | v1 | v2 |
|---|---|---|
| classifier-injection-screen | PASS | PASS |
| cli-dispatch-audit (guard and audit log) | PASS | PASS |
| codex-hooks-watchdog | PASS | PASS |
| mcp-route-guard | PASS | PASS |
| opencode-goal | PASS | PASS |
| session-cleanup | PASS | PASS |
| session-relaunch | PASS | PASS |
| sk-code-post-edit-quality | PASS | PASS |
| sk-git-message-gate | PASS | PASS |
| sk-git-preflight-advisory | PASS | PASS |
| sk-vision | PASS | PASS |
| system-completion-sentinel | PASS | PASS |
| system-deep-loop-guard | PASS | PASS |
| system-dist-freshness-guard | PASS | PASS |
| system-skill-advisor | PASS | PASS |
| system-spec-gate | PASS | PASS |
| system-speckit-completion | PASS | PASS |

The skill-advisor kill switch leaves 0 `Advisor:` lines on each version. What each cell observed and its evidence file are in `scratch/live-runs/results-matrix.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/live-runs/results-matrix.md` | Created | One row per plugin with the v1 and v2 verdict, its evidence file and what was observed, plus the totals, the rerun note, the kill-switch line and the shared-service line |
| `scratch/live-runs/*.txt`, `summary.txt`, `effects/` | Created | The scenario logs, the per-block exit codes and the per-run effect and exit files the verdicts are read from |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | This phase's packet, filled from the scaffold |
| `graph-metadata.json` | Regenerated | Derived metadata re-derived from these docs by `repair-derived` |
| `../spec.md` | Modified | The phase map row for 053 and the 052 to 053 handoff row |
| `../graph-metadata.json` | Regenerated | The parent packet's derived metadata, re-derived so its child list carries this phase |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A driver read the 17 scenario files, pulled each one's own command block out unmodified, and ran them in order on v1 and then on v2 from a worktree fast-forwarded to `dfdc523af5`. Evidence was copied into `scratch/live-runs/` as it landed, so the matrix does not depend on the gitignored state folder surviving.

The verdicts were read afterwards, per version, from the evidence rather than from `summary.txt`. That is how the silent sentinel pass surfaced, and it is also why the totals are trustworthy: an exit 0 with no plugin effect would have looked clean in the exit-code file alone. One rerun followed, on the same unchanged block, and both logs were kept.

Every v2 run used `--standalone`, so the shared OpenCode 2 service was never touched: PID 46220 was not stopped, started or attached to. A scan of the evidence for the llmgateway key returned 0 matches, so no credential reached a recorded file. Pushing to main and recording CI are the two tasks left to the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rerun the playbook at `dfdc523af5` instead of citing 046's result | 046 proved `eb0c18f7e9`, and six phases landed after it; a plugin that broke in one of them would still have read as green |
| Run the scenario files' own command blocks unmodified | Editing a block would prove a command nobody runs; the documented block is the thing the operator would follow |
| Read every verdict from the evidence files, not from `summary.txt` | A block's exit code is its last command's, so an exit 0 can sit beside a plugin that wrote nothing, which is exactly what happened once here |
| Record the sentinel rerun rather than only its passing log | The first pass is evidence too: it shows the plugin declining a completion claim whose tail did not match, which is the guard working rather than the plugin failing |
| Keep the phase code-free | The proof is what this phase is for; a fix folded into it would leave the question of what the green matrix actually tested |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live playbook, OpenCode 1.19.3 | PASS 17 of 17 (`scratch/live-runs/*.txt`, `scratch/live-runs/effects/`) |
| Live playbook, OpenCode 2.0.32 | PASS 17 of 17, every v2 run with `--standalone` (`scratch/live-runs/*.txt`, `scratch/live-runs/effects/`) |
| Block exit codes | PASS: every block exited 0 (`scratch/live-runs/summary.txt`), used to corroborate the run and never to decide a verdict |
| `system-completion-sentinel` rerun | PASS: the first pass exited 0 with no advisory on either version, and the unchanged rerun at 21:24 UTC logged `[completion-evidence-sentinel] claimed done but 4 completed P0/P1 checklist item(s) ...` on both (`scratch/live-runs/system-completion-sentinel.rerun1.txt`) |
| Skill-advisor kill switch | PASS: 0 `Advisor:` lines on v1 and 0 on v2 with `SYSTEM_SKILL_ADVISOR_DISABLED=1` (`scratch/live-runs/system-skill-advisor.txt`) |
| llmgateway key scan over the evidence | PASS: 0 matches |
| Shared OpenCode 2 service | PASS: every v2 run used `--standalone`, and PID 46220 was never stopped, started or attached to |
| Strict validation of this folder | `validate.sh 053-final-commit-live-proof --strict` - `RESULT: PASSED` |
| CI at the pushed commit | PENDING: the push is task T011 and the CI record is T012, both left to the orchestrator |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The proof is a point-in-time run, not a gate.** It shows the 17 plugins working at `dfdc523af5` during a ten-minute window on 2026-10-21; nothing reruns it when main moves again, so the next change to a plugin or a hook needs its own live pass.
2. **The sentinel depends on the reply's shape.** The block asks for one fixture sentence, and the model added a disclaimer after it, which put the claim outside the 160-character tail the plugin inspects. The plugin is behaving as designed, but a run can exit 0 with no advisory and only the evidence files tell the two apart.
3. **One verdict per plugin, not per branch.** Each scenario exercises its plugin's main path on each version. A different input path through the same plugin would not appear here.
4. **The evidence in this folder is a copy.** The originals lived in the gitignored state folder of worktree 196, and the runs cannot be replayed byte for byte; the copied logs and effect files are what the matrix was read from.
<!-- /ANCHOR:limitations -->

---
