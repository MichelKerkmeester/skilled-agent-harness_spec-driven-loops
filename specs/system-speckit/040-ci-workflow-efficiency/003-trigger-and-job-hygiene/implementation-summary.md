---
title: "Implementation Summary"
description: "Complete: this phase added a concurrency group to the 30 PR-triggered workflows, filtered command-tree-parity and agent-mirror-sync to the inputs their checkers read, deleted dispatch-enforcement-guard's duplicate dispatch-audit step, removed one suppression layer from the two report-only workflows and checks out at the depth each job reads. The CI probes ran on 2026-10-24 and the 24 h delta was measured on 2026-10-25 against the 001 research dataset. All 17 acceptance rows are met, AC-009 on the operator ruling of 2026-10-25 that reads its checkout shortening as a floor of at least about 20 s (ADR-012)."
trigger_phrases:
  - "trigger and job hygiene implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene"
    last_updated_at: "2026-10-25T07:02:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded ADR-012, which reads AC-009 as a floor, and marked all 17 rows Met"
    next_safe_action: "Phase closed; no further work in this phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-003-trigger-and-job-hygiene"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-trigger-and-job-hygiene |
| **Completed** | 2026-10-25, on the operator's AC-009 ruling (closure commit `055ba93b35`) |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Built, probed, measured and closed on its criteria. The six concern commits landed on `main`: 30 PR-triggered workflows carry the concurrency block, `command-tree-parity.yml` and `agent-mirror-sync.yml` are filtered to their checkers' inputs, the duplicate dispatch-audit step is gone, both suppression layers are removed, and the three checkouts read only the history they need. The README table matches the YAML, and `scratch/pre-commit-inventory.md` records the 13 gate keys with a `Reason` column. The CI probes T027 to T035 ran on 2026-10-24. On 2026-10-25, by the operator's ruling ("Use the 001 research data as the baseline for this phase"), T006 and T036 ran with the 001 dataset as the before-state and the 002 24 h window as the after-state, and all 17 acceptance rows are `Met`. AC-009 closed on the operator's ruling of 2026-10-25 that its "about 20 s shorter" reads as a floor, "at least about 20 s shorter" (`decision-record.md` ADR-012): `repo-rules-corpus` is 21 s shorter, `deep-loop-runtime` 23 s and `rule-canary-sync` 52 s. Only the T038 closure commit, which follows, remains.

### Phase 3: trigger-and-job-hygiene

This phase gives 30 PR-triggered workflows one concurrency slot each, so a second push to a pull request cancels the run it superseded instead of paying for both. It filters `.github/workflows/command-tree-parity.yml` and `.github/workflows/agent-mirror-sync.yml` to the files their checkers read, deletes the duplicate `Run the dispatch audit core suite` step from `.github/workflows/dispatch-enforcement-guard.yml`, removes one suppression layer from `.github/workflows/advisory-checks.yml` and `.github/workflows/strict-pass-freshness-report.yml`, and drops full-history checkouts from `.github/workflows/rule-canary-sync.yml`, `.github/workflows/repo-rules-corpus.yml` and `.github/workflows/deep-loop-runtime.yml`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/*.yml` (30 PR-triggered files) | Modified | One `concurrency:` block above `jobs:` in each; `grep -L` returns only the two named exemptions |
| `.github/workflows/command-tree-parity.yml` | Modified | 23 `paths:` entries on both events (46 total), and the rewritten comment now sits at `:98-102` |
| `.github/workflows/agent-mirror-sync.yml` | Modified | 11 `paths:` entries under `pull_request:` |
| `.github/workflows/skill-doc-frontmatter.yml` | Modified | The guard at both roots and the workflow file in both filter lists (guard count 4 per AC-011) |
| `.github/workflows/dispatch-enforcement-guard.yml` | Modified | The duplicate dispatch-audit step is deleted; the fail-closed guard is byte-identical |
| `.github/workflows/advisory-checks.yml` | Modified | Three suppressed commands are explicit failing branches (`\|\| (true\|echo)` count 0) |
| `.github/workflows/strict-pass-freshness-report.yml` | Modified | The repair report keeps its status and exits after printing |
| `.github/workflows/rule-canary-sync.yml`, `.github/workflows/repo-rules-corpus.yml` | Modified | The `with: fetch-depth: 0` block is deleted |
| `.github/workflows/deep-loop-runtime.yml` | Modified | `fetch-depth: 0` became `fetch-depth: 2` at `:46` after the concurrency block (the pre-block position was `:42`) |
| `.github/workflows/README.md` | Modified | The push/PR table matches the YAML; `:71` carries the delivered three-input wording |
| `scratch/decisions.md`, `scratch/pre-commit-inventory.md` | Created | The five answers and the 13-gate inventory with its `Reason` column |
| `scratch/phase-baseline.md`, `scratch/phase-result.md`, `scratch/runs-after.json` | Created | The 001 baseline rows, the measured delta, and a copy of the 002 24 h window's run list (the after-state) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in six steps per `tasks.md`: the five operator answers (T001 to T005), the content edits (T007 to T021), the concurrency block and the whole-tree gates (T022 to T025), and the six concern commits (T026) are done, the probes and the inventory re-check (T027 to T035) ran on 2026-10-24. T006's baseline copy and T036's delta ran on 2026-10-25 under the operator's baseline ruling, and the operator's floor ruling for AC-009 (ADR-012) closed the last open row on the same day. The gates pass: `check-gate-inputs.sh` prints `RESULT: PASSED` (`twin_pairs=340`), the YAML parse exits 0 over all 33 workflows, and `check-gate-inputs: 54 passed, 0 failed`. The probes opened throwaway pull requests, observed the runs and deleted the branches. Still owed: the T038 closure commit, which the orchestrator makes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cancel only the superseded pull-request run | Main's supersession is almost entirely the rebuild commit's, and after R1 it is 23 pairs and 89 wall-minutes, which is not worth losing a per-commit verdict |
| Approve the command-tree-parity filter | 30 of 38 human pushes touch none of its inputs, and the "no filter is narrow enough" comment was never tested against the checkers |
| Keep the guard's two jobs and delete only the duplicate step | The guard is protected, a merge renames both checks, and the whole-tree vitest run already collects the audit suite |
| Depth follows the reader | Two checkers read no history, the deep-loop suites need the parent commit, and seven workflows diff against a base |
| Record the pre-commit inventory and act on nothing | Dropping a gate changes what a check verifies, which is outside this phase's scope |
| Read the checkout-shortening row as a floor | The operator ruled on 2026-10-25 that "about 20 s shorter" means "at least about 20 s shorter", because the canary's 52 s saving is a bigger win rather than a miss (ADR-012) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .github/scripts/check-gate-inputs.sh` | `files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0`, `RESULT: PASSED` (AC-013) |
| YAML parse of all 33 workflows | Exit 0, no output (AC-014) |
| Seven hooks vitest suites | CI run `40026353792` is green with all seven suites. On 2026-10-24, the focused test printed `Tests 7 passed (7)` with `opencode` hidden from `PATH` and `OPENCODE_BIN=/nonexistent/opencode`; with local OpenCode v2.1.4 visible it printed `Tests 2 failed \| 5 passed (7)`. T013 is done; the local version-resolution issue is a dispatch-hooks limitation (AC-005) |
| Concurrency probe | Older run `40100004699` `cancelled`, newest `40100024617` `success` (AC-002) |
| Positive and negative trigger probes | command-tree-parity `40100373828` and no run for a specs-only head, agent-mirror-sync `40102573620` and `40102589221`, no run for a specs-only head, skill-doc-frontmatter `40102614545` (AC-003, AC-010, AC-011) |
| Deleted rule suite | Run `40101163105` concluded `failure` with `##[error]Dispatch rule suite not found` (AC-006) |
| Report-only steps | Run `40101235126`: `##[error]doc-model drift` once in the log, one failure annotation, job `success`. Dispatch `40101537374`: 175 `would repair` lines and one error line, job `success` (AC-007, proof changed by the 2026-10-24 operator ruling) |
| Checkout depth | Against the 001 baseline medians: `repo-rules-corpus` 72 s to 51 s (-21), `deep-loop-runtime` 74 s to 51 s (-23), `rule-canary-sync` 73 s to 21 s (-52, run `40101304274`), canary job 24 s against 78 s. AC-009 is `Met` as a floor of at least about 20 s (ADR-012). The three PR runs were re-read with `gh run view` on 2026-10-25 and the baseline medians were recomputed from the 001 job files |
| Pre-commit inventory | 13 keys, 13 rows, 13 verdicts (AC-012) |
| `scratch/phase-result.md` delta | Ten workflows 1039 to 610 runner-min/day, raw -429. Net of phase 002: `command-tree-parity` -136, `rule-canary-sync` -49, `dispatch-enforcement-guard` 0; PR-side cancellation unmeasured (AC-016 `Met`) |
| Gates re-run at the current head 2026-10-25 | `check-gate-inputs.sh` `RESULT: PASSED` (`twin_pairs=336 failures=0`), `check-gate-inputs: 57 passed, 0 failed`, YAML parse exit 0 over 32 files, and the id grep over the six commits prints nothing. The PR-cancel count is 29 and the file count 32 because a sibling phase merged `hooks-node-tests.yml` away |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **The shortening is not a uniform 20 s, and the row became a floor (T032, T036).** Against the 001 baseline medians, `repo-rules-corpus` is 21 s shorter and `deep-loop-runtime` 23 s, but `rule-canary-sync` is 52 s shorter on the phase-only run (`40101304274`, checkout 21 s against 73 s). The 24 h window median for the canary is 2 s, which is a later phase's sparse checkout (`ea39cd7b2c`), not this phase. The row said about 20 s, and the operator ruled on 2026-10-25 that it reads as a floor, so AC-009 is `Met` (`decision-record.md` ADR-012).
2. **Probes needed pull requests (T027 to T034).** The push triggers of the probed workflows list `main` and `skilled/**` only, so a probe-branch push starts nothing. Each probe opened a throwaway pull request against `main`, and the branches and PRs were deleted afterwards.
3. **A shared scratch worktree after T029.** After T029, the probe commits ran in one shared scratch worktree instead of one worktree per probe. Its ignored `node_modules` and `dist` were cloned copy-on-write from the packet worktree, because a bare worktree makes the pre-commit hook fail with `Cannot find module`.
4. **Mirror regeneration in probe commits.** The mirror-parity hook blocked probes that touched a skill or agent file until `sync-skills-hermes.cjs` and `codex/sync-agents.cjs` ran and their output was staged. The spec-remint, route-remint and doc-version-bump hooks also added files to some probe commits.
5. **`SPECKIT_ALLOW_REMOTE_PUSH` approvals.** Each new non-allowlisted probe branch was pushed with `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`, and branch deletes used `SPECKIT_ALLOW_REMOTE_PUSH=1`. No `--no-verify` or hook skip was used. The operator's approval is in `scratch/probe-branch-approval.md`.
6. **The AC-007 proof changed (T031).** The operator ruled on 2026-10-24 that the proof is the step's error line and failure annotations while the job stays `success`. See `decision-record.md`, Amendments.
7. **Two proof wordings corrected (AC-005, AC-006).** The AC-005 grep needs a job filter to return seven paths, and AC-006 asserts on the printed `##[error]` line. See `decision-record.md`, Amendments. The operator has not yet confirmed these.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The measured figures carry confounds.** The 001 baseline holds phase 002's per-rebuild-commit fan-out (73 runs per unfiltered push workflow against 49 after), covers Thursday into Friday against a Saturday after-window, and shows 0 runs for pull-request-only workflows. `scratch/phase-result.md` records raw deltas and the figures netted against the same window's 49-run reference; the net figures are inferred, not observed with this phase reverted.
2. **The PR-side cancellation stays unmeasured.** The after-window shows 13 cancelled pull_request runs, but their job minutes are not sampled and there is no counterfactual, so no runner-minute figure is claimed. T027 is the direct observation.
3. **The baseline source was changed by ruling.** `spec.md` REQ-012 and T006 name the 002 summary as the baseline; on 2026-10-25 the operator ruled that the 001 research dataset is the baseline, because the 002 window postdates this phase. The 002 window is used as the after-state. The requirement text is not rewritten.
4. **The dispatch test is not hermetic to OpenCode version.** `no-bare-agent-general` in `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` declares `appliesTo: ["v1"]`; `evaluate()` resolves the local binary through `resolveOpencodeVersionSync`. Local OpenCode v2.1.4 skips the rule and causes 2 failures in `.skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs`. With `opencode` hidden from `PATH` and `OPENCODE_BIN=/nonexistent/opencode`, the version resolves to `unknown`, the rule remains, and the focused test prints `Tests 7 passed (7)`. CI has no OpenCode binary, so it also resolves `unknown`; run `40026353792` is green. Pinning the resolved version belongs to the dispatch-hooks owner, outside this packet.
<!-- /ANCHOR:limitations -->

---

