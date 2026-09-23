---
title: "Implementation Summary: CI Cleanup Follow-ups"
description: "The spec gate now gates a repository under /tmp like any other and the CI workaround is gone. Six recorded cli-jev probe scripts run under pipefail, which clears the drift guard's last errors."
trigger_phrases:
  - "ci cleanup follow-ups"
  - "spec gate tmp exemption"
  - "cli-jev pipefail"
  - "runtime vitest tmpdir"
  - "playbook test count"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups"
    last_updated_at: "2026-09-23T20:30:00Z"
    last_updated_by: "cli-pi-mimo-v2.6-pro"
    recent_action: "Closed the packet with every acceptance criterion met"
    next_safe_action: "None. The packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs"
      - "spec-gate-core.test.mjs"
      - ".github/workflows/spec-kit-check.yml"
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md"
      - ".skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md"
      - "benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing-run.sh"
      - "cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/auth-probe.sh"
      - "cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe.sh"
      - "cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe2.sh"
      - "cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.sh"
      - "cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-surface.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-054-ci-cleanup-follow-ups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CI Cleanup Follow-ups

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 054-ci-cleanup-follow-ups |
| **Completed** | 2026-09-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec gate now gates a repository under /tmp like any other, and the CI workaround that the old location rule forced is gone. Six recorded cli-jev probe scripts now run under pipefail, which clears the drift guard's last errors. Together these close the loose ends phase 050 left, so the gate behaves the same wherever the repository lives and the shell standard holds for every recorded probe.

### What changed and why

The old gate exempted every write under /tmp and /private/tmp by location. Any path outside the repository is already exempt, and that covers /tmp scratch space, so the extra rule only mattered for a repository that itself lives under /tmp and there it switched the gate off. Test workspaces made under os.tmpdir() hit exactly that when the temp dir is /tmp, as on the Linux CI runner. Phase 050 worked around it by pointing TMPDIR at the runner's temp dir in the runtime vitest step of the workflow file. This phase removes the location rule instead of keeping the workaround, so a repository under /tmp is gated like any other (REQ-001, AC-001) and the out-of-repo exemption still covers scratch space for a repository that lives elsewhere.

The core gate and its tests changed together. The helper isUnderAnyRoot and the /tmp and /private/tmp clause in isExemptTargetPath are gone, and the doc comment now says anything outside the repo already covers /tmp scratch space. The test file's makeWorkspace takes a base directory that defaults to os.tmpdir(), and a new test expects deny under enforcement for a repository rooted under /tmp. No spec-gate suite regresses with the temp dir at /tmp or elsewhere (REQ-002, AC-002). CI now runs the runtime vitest step with the runner's default temp dir (REQ-003, AC-003), and no doc still describes the /tmp exemption or the old count (REQ-004, AC-004). The six cli-jev scripts carry set -uo pipefail instead of set -u, and the drift guard reports 0 errors (REQ-005, AC-005). Every pipeline in those scripts starts with printf, so a recorded exit code only changes if printf itself fails.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | Removed the isUnderAnyRoot helper and the /tmp and /private/tmp clause in isExemptTargetPath and reworded the doc comment |
| `spec-gate-core.test.mjs` | Modified | makeWorkspace takes a base directory defaulting to os.tmpdir() and a new test expects deny for a repository rooted under /tmp. The path-traversal test's comment was reworded to match |
| `.github/workflows/spec-kit-check.yml` | Modified | Removed the 4-line TMPDIR workaround from the Runtime vitest project step |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | Modified | Step 3 says any fixture location works with /tmp included and step 2 expects 108 tests |
| `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` | Modified | Step 1 no longer says the core exempts /tmp |
| Six cli-jev scripts: `benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing-run.sh` plus `auth-probe.sh`, `preflight-probe.sh`, `preflight-probe2.sh`, `probe-matrix.sh` and `probe-surface.sh` under `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/` | Modified | set -u changed to set -uo pipefail in each recorded probe script |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation executor was cli-pi with MiMo v2.6 pro through the llmgateway provider. The orchestrator wrote the briefs, reviewed every diff and ran every check. The briefs and raw output live in evidence/dispatch/ as wu1 to wu8.

The tests ran red first. The new core test "a repository rooted under /tmp is gated like any other" expects deny under enforcement and failed against the old gate, then passed after the change. The core suite grew from 107 to 108 tests, which is why the playbook count moved in the same change. Every suite was then run twice, once with TMPDIR=/tmp and once with the default temp dir.

The tasks ran in order and all are done. T001 read the gate and its tests, T002 wrote the new /tmp test red, T003 made the gate change, T004 ran the four gate suites under both temp dirs, T005 ran the root project under /tmp, T006 removed the CI workaround, T007 fixed the playbook wording, T008 fixed the playbook count, T009 changed the cli-jev scripts to pipefail, T010 ran the drift guards, T011 made the commit and T012 wrote the packet docs and parent rows.

The work landed as two commits on branch worktrees/066-ci-cleanup-follow-ups, rebased onto origin/main. They are 9b95bd06b1 fix(system-spec-kit): gate a repository under /tmp like any other and 9ace27983c fix(cli-jev): run the recorded probe scripts under pipefail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the location rule rather than keep the CI workaround | The operator chose this scope on 2026-09-23 |
| Keep the out-of-repo exemption | It already covers /tmp scratch space for a repository that lives elsewhere |
| Update the playbook's expected count in the same change | The change added the test that moved the count from 107 to 108 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Core suite with `node --experimental-test-module-mocks --test spec-gate-core.test.mjs` | PASS. 108 of 108 pass, with TMPDIR=/tmp and with the default temp dir |
| devin, cursor and Pi spec-gate suites | PASS. devin 15 of 15, cursor 17 of 17 and Pi 9 of 9 with TMPDIR=/tmp and with the default temp dir |
| Runtime root vitest project with TMPDIR=/tmp | PASS after one local build. First 1,291 passed and 1 failed, since opencode-plugins-folder-purity.vitest.ts could not import the gitignored dist of sk-communication/cli-communication-projection, which this worktree had not built. After building it the project stands at 1,292 passed, 0 failed, 13 skipped |
| Rerun on the tree rebased onto origin/main | PASS. Runtime root vitest project 1,294 passed, 0 failed, 13 skipped with TMPDIR=/tmp and with the default temp dir. Core 108 of 108, devin 15 of 15 and cursor 17 of 17 under both temp dirs |
| `grep -c TMPDIR spec-kit-check.yml` and `bash -n` on the six scripts | PASS. grep count is 0 and all six scripts parse ok |
| sk-code drift guards with run-all-drift-guards.sh | PASS. All 2 guards passed with Errors 0, down from 6 |
| Repo-wide search for stale wording | PASS. No other text describes the /tmp exemption or the old 107 count |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A fresh worktree does not build the gitignored dists the suites import.** The shared package, the skill-advisor runtime, the spec-kit runtime and the communication-projection package all need a build before their tests can load. This is an observation to record and not a fix in this phase.

2. **Two items stayed out of scope.** The containment capture fix with the capture untrack is recorded in packet specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot, and the phase 030 goal trim is recorded in the log of specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/goal.md.
<!-- /ANCHOR:limitations -->

---

