---
title: "Implementation Summary"
description: "In progress, built but unclosed: this phase added a concurrency group to the 30 PR-triggered workflows, filtered command-tree-parity and agent-mirror-sync to the inputs their checkers read, deleted dispatch-enforcement-guard's duplicate dispatch-audit step, removed one suppression layer from the two report-only workflows, and checks out at the depth each job reads. The CI probes, the inventory re-check and the 24 h delta remain."
trigger_phrases:
  - "trigger and job hygiene implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene"
    last_updated_at: "2026-10-24T09:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Reconciled the summary with the six landed concern commits and the open probe and delta work"
    next_safe_action: "Run the CI probes T027 to T034, then T035's inventory re-check and T036's 24 h delta once the 002 baseline exists; T037 and T038 close the phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-003-trigger-and-job-hygiene"
      parent_session_id: null
    completion_pct: 60
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
| **Completed** | Built, not closed (probes and delta pending) |
| **Level** | 3 |
| **Status** | In progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Built but not closed. The six concern commits landed on `main`: 30 PR-triggered workflows carry the concurrency block, `command-tree-parity.yml` and `agent-mirror-sync.yml` are filtered to their checkers' inputs, the duplicate dispatch-audit step is gone, both suppression layers are removed, and the three checkouts read only the history they need. The README table matches the YAML, and `scratch/pre-commit-inventory.md` records the 13 gate keys with a `Reason` column. Still open: the T027 to T034 CI probes, the T035 inventory re-check, the T036 delta (blocked on the 002 24 h baseline via T006), and T037/T038 closure.

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
| `scratch/phase-baseline.md`, `scratch/phase-result.md`, `scratch/runs-after.json` | Pending | The 002 baseline rows and the measured delta; blocked on the 002 24 h snapshot |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in six steps per `tasks.md`: the five operator answers (T001 to T005), the content edits (T007 to T021), the concurrency block and the whole-tree gates (T022 to T025), and the six concern commits (T026) are done; T006's baseline copy and the probes, review, delta and closure (T027 to T038) remain. The gates pass: `check-gate-inputs.sh` prints `RESULT: PASSED` (`twin_pairs=340`), the YAML parse exits 0 over all 33 workflows, and `check-gate-inputs: 54 passed, 0 failed`. Still owed: one positive and one negative trigger probe per filtered workflow, the hooks-suite log check, the inventory re-check, the delta, and the closure commit.
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
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .github/scripts/check-gate-inputs.sh` | `files=45 inputs_resolved=235 dynamic_inputs=9 twin_pairs=340 failures=0`, `RESULT: PASSED` (AC-013) |
| YAML parse of all 33 workflows | Exit 0, no output (AC-014) |
| Seven hooks vitest suites | CI run `40026353792` is green with all seven suites. On 2026-10-24, the focused test printed `Tests 7 passed (7)` with `opencode` hidden from `PATH` and `OPENCODE_BIN=/nonexistent/opencode`; with local OpenCode v2.1.4 visible it printed `Tests 2 failed \| 5 passed (7)`. T013 is done; the local version-resolution issue is a dispatch-hooks limitation (AC-005) |
| Two trigger probes per filtered workflow | Not run; T027 to T034 remain (AC-003, AC-010, AC-011) |
| `scratch/phase-result.md` against the 002 baseline | Not run; blocked on the 002 24 h snapshot via T006 (AC-016) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No number is measured yet.** Every saving in this packet comes from `001-research/research/synthesis-reviews/final-review.md` and is restated as a target, not an observation. `scratch/phase-result.md` replaces it with a measured delta against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`.
2. **The PR-side cancellation cannot be measured from the 23.5 h window**, which held no pull-request runs. It is recorded as unmeasured rather than as zero, and the T027 probe is the direct observation.
3. **The delta cannot start until 002 records its baseline.** T006 stops when `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` is absent, because no research figure may stand in for a measured before number; the implementation landed ahead of it, so only T006 and T036 wait.
4. **The dispatch test is not hermetic to OpenCode version.** `no-bare-agent-general` in `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` declares `appliesTo: ["v1"]`; `evaluate()` resolves the local binary through `resolveOpencodeVersionSync`. Local OpenCode v2.1.4 skips the rule and causes 2 failures in `.skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs`. With `opencode` hidden from `PATH` and `OPENCODE_BIN=/nonexistent/opencode`, the version resolves to `unknown`, the rule remains, and the focused test prints `Tests 7 passed (7)`. CI has no OpenCode binary, so it also resolves `unknown`; run `40026353792` is green. Pinning the resolved version belongs to the dispatch-hooks owner, outside this packet.
<!-- /ANCHOR:limitations -->

---

