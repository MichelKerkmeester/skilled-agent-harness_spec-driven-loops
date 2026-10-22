---
title: "Implementation Summary"
description: "From origin/main, all 17 repository plugins showed their checked effect live on OpenCode 1.19.3 and on OpenCode 2.0.32, every tracked suite is at or above its starting count, and recursive validation of 082 passes. The OpenCode 1 default-model dispatch still stops on the opencode-go usage limit."
trigger_phrases:
  - "final two version proof implementation summary"
  - "live plugin matrix 17 of 17"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/046-final-two-version-proof"
    last_updated_at: "2026-10-21T12:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded CI on both pushed commits and closed the phase"
    next_safe_action: "None; the OpenCode 1 default dispatch waits on the opencode-go quota"
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/046-final-two-version-proof/scratch/live-runs/results-matrix.md"
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/046-final-two-version-proof/scratch/suites/suites.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-046-final-two-version-proof"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 046-final-two-version-proof |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every repository plugin now does its job on both OpenCode versions. On origin/main `eb0c18f7e9`, all 17 plugins showed their checked effect live on OpenCode 1.19.3 and on OpenCode 2.0.32, where phase 034 had found only 10 of 17 working on v2.

### Phase 46: final-two-version-proof

This phase changes no code. It ran each `plugin-utilization` scenario exactly as its playbook file documents it, reran every suite the open-work goal tracks, ran one OpenCode 1 dispatch on the skill's default model, and validated the packet. Each verdict comes from evidence files, not from what the model said.

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
| `046-final-two-version-proof/` | Created | Phase docs, the matrix, the run logs and effect files, the suite summary and the v1 default result |
| `../spec.md`, `../graph-metadata.json` | Modified | Register phase 46 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Worktree 190 was created from origin/main with sk-git's `create` and provisioned. A driver ran the 17 scenario blocks one after another, so no two sessions shared the watched log and state folders. Every block exited 0, so no rerun was needed. The suites ran at the same commit in worktree 188, in parallel with the live runs. The evidence was scanned for the llmgateway key, with 0 matches, before it was copied here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run the scenario files' own command blocks unchanged | The proof is of the documented playbook, so a hand-edited command would prove something else |
| Run the suites in a second worktree at the same commit | The live runner reports changes under the log and state folders, and suite writes there would read as plugin effects |
| Keep the event and capture files in the gitignored state folder | They hold full system prompts and are 4.8 MB; the run logs and effect files carry each verdict's evidence |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Start of goal | Final |
|-------|--------|-------|
| Plugin suite | 436 | 516 of 516 (first full run 515 of 516, see limitation 2) |
| Battery unit | 51 | 51 of 51 |
| Hooks node:test, 29 files | 836 | 870 of 870 |
| Hook installer test | none | 4 of 4 |
| Hooks vitest | 217 | 401 of 401 |
| Dispatch rule-checks | 38 | 42 of 42 |
| Dispatch audit vitest | 114 | 124 of 124 |
| Plugin folder purity | 1 | 1 of 1 |
| worktree-naming.test.sh | 157 | 162 of 162 |
| Pi cache optimizer | 118 | 118 of 118 |
| Pi fast mode | 81 | 81 of 81 |
| cli-opencode default-model | none tracked | 5 of 5 |
| cli-opencode models-form | 8 | 16 of 16 |
| Live matrix | v2 10 of 17 | v1 17 of 17, v2 17 of 17 |
| OpenCode 1 default dispatch (`opencode-go/deepseek-v4.1-flash --variant max`) | none | Stopped by the 180 s alarm, exit 142; the OpenCode log shows `Go usage limit exceeded` (`scratch/v1-default/`) |
| Recursive strict validation of 082 | none | 47 of 47 folders print `RESULT: PASSED`, exit 0, at commit `81566567ed` |

This phase was checked by orchestrator reruns only: the live blocks and every suite were rerun from the same commit by the orchestrating session, and no separate read-only session reviewed it. Luna was not used, because the operator moved review to DeepSeek v4.1 flash on 2026-10-21 and kept Luna as a fallback only.

### CI

Pushed to main as `eb0c18f7e9..586e3bb152`; the trigger-index bot then committed `ebadbe1edf` on top.

| Commit | Workflow | Run | Conclusion |
|---|---|---|---|
| `586e3bb152` | Advisory Checks | 39601195200 | success |
| `586e3bb152` | Changed Packet Validation | 39601195180 | success |
| `586e3bb152` | Command Tree Parity | 39601195211 | success |
| `586e3bb152` | Dispatch Enforcement Guard | 39601195134 | success |
| `586e3bb152` | Gate Inputs | 39601195305 | success |
| `586e3bb152` | Message Contract | 39601195195 | success |
| `586e3bb152` | Playbook Operator Contract | 39601195287 | success |
| `586e3bb152` | Rule Canary Sync | 39601195146 | success |
| `586e3bb152` | sk-doc Script Tests | 39601195183 | success |
| `586e3bb152` | Trigger Index Rebuild | 39601195330 | success |
| `ebadbe1edf` | Hook Node Tests | 39601446963 | success |
| `ebadbe1edf` | OpenCode Plugin Tests | 39601446934 | success |
| `ebadbe1edf` | Spec-Kit Check | 39601446991 | success |
| `ebadbe1edf` | Markdown Link Integrity | 39601447041 | success |
| `ebadbe1edf` | Advisory Checks | 39601447025 | success |
| `ebadbe1edf` | Changed Packet Validation | 39601446988 | success |
| `ebadbe1edf` | Command Tree Parity | 39601446822 | success |
| `ebadbe1edf` | Dispatch Enforcement Guard | 39601446725 | success |
| `ebadbe1edf` | Gate Inputs | 39601447089 | success |
| `ebadbe1edf` | Message Contract | 39601446727 | success |
| `ebadbe1edf` | Playbook Operator Contract | 39601446989 | success |
| `ebadbe1edf` | Rule Canary Sync | 39601446673 | success |
| `ebadbe1edf` | sk-doc Script Tests | 39601446969 | success |
| `ebadbe1edf` | Trigger Index Rebuild | 39601446987 | skipped, as on every bot commit |

The workflows that did not run on either commit, with their last run on main. Most are path-filtered; Strict Pass Freshness Report runs on a schedule, and Dependabot Updates and Dependency Graph are run by GitHub, so their run names are the update titles:

| Workflow | Run | Commit | Conclusion |
|---|---|---|---|
| Deep-Loop Runtime Tests | 39577580054 | `db82fdfd62` | success |
| OpenCode Dual-Version Battery | 39579717047 | `df71abbc47` | success |
| Pi Extension Tests | 39508434074 | `ff2ecb632a` | success |
| Routing Registry Drift Guard | 39579716962 | `df71abbc47` | success |
| Runtime No-Spec-Import Guard | 39602980597 | `00fb08a77d` | success |
| sk-code Script Tests | 39512563089 | `d704b466da` | success |
| sk-doc Rename Harness | 39526699911 | `e42bdbeaf2` | success |
| sk-git Script Tests | 39515394430 | `c818616abc` | success |
| Skill Advisor Stress Tests | 39564216421 | `53fd0cbbde` | success |
| Skill Doc Frontmatter | 39577580100 | `db82fdfd62` | success |
| Chart Corpus | 38363499258 | `0efd5a12b5` | success |
| Repo Rules Corpus | 38363499132 | `0efd5a12b5` | success |
| Strict Pass Freshness Report (scheduled) | 39200485518 | `33d619a538` | success |
| Dependabot Updates (GitHub-managed) | 39577752249 | `db82fdfd62` | success |
| Dependency Graph (GitHub-managed) | 36911226681 | `8a4f2ef459` | success |
| Diagram Corpus | 39165172090 | `be234e6f94` | failure, outside this goal: it failed on 2026-10-18, before the goal began, no phase of this packet touches its paths, and group 047, opened alongside this closeout, is fixing it |

Seven workflows have never run on main: Agent Mirror Sync, Comment Hygiene Gate, Copilot code review, Copilot coding agent, Dependabot Auto-merge, Naming Standard Guard and Prompt-Knowledge Card Sync.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The OpenCode 1 default model is out of quota here.** opencode-go answers `Go usage limit exceeded` and OpenCode 1.19.3 retries rather than exiting, so the dispatch only stops at the alarm. The command the skill builds is correct; a rerun after the quota resets is the operator's.
2. **One timing-sensitive plugin test.** `cache TTL starts when CLI work completes` in `.opencode/plugins/tests/system-skill-advisor.test.cjs` waits 30 ms against a 60 ms TTL. It failed once in the first full suite run, which shared the machine with the live sessions, then passed 10 of 10 alone and in a full rerun (516 of 516).
3. **opencode-goal on v1 leaves a `.tmp` state file.** The v1 run's state folder held one leftover `.tmp` file beside the goal record, the limit phase 041 recorded.
<!-- /ANCHOR:limitations -->

---
