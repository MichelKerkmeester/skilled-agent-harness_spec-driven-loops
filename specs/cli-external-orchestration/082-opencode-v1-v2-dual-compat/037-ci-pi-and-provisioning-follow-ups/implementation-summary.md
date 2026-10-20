---
title: "Implementation Summary"
description: "Four recorded follow-ups are closed or bounded. The Pi workflow finds its extensions at run time and also type-checks and pack-checks them, provisioning stamps the fingerprint taken before a build, the battery has an end-to-end test through a symlinked nested root, and the sk-doc runner names a failing subtest whether or not a terminal is attached, on Node 18.15 or later. The workflows README lists all 32 workflows."
trigger_phrases:
  - "ci pi and provisioning follow ups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/037-ci-pi-and-provisioning-follow-ups"
    last_updated_at: "2026-10-21T00:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built and verified the five changes; Luna review in progress"
    next_safe_action: "Merge main, push, and record the CI handoff"
    blockers: []
    key_files:
      - ".github/workflows/pi-extension-tests.yml"
      - ".github/workflows/README.md"
      - ".skilled/skills/sk-git/scripts/worktree-naming.sh"
      - ".skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh"
      - ".skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs"
      - ".skilled/skills/sk-doc/scripts/tests/run-script-tests.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-037-ci-pi-and-provisioning-follow-ups"
      parent_session_id: null
    completion_pct: 90
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
| **Spec Folder** | 037-ci-pi-and-provisioning-follow-ups |
| **Completed** | Pending the CI handoff |
| **Status** | In Progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new Pi extension now gets tested without anyone editing a workflow, and a type or pack error in one fails CI. A source you edit while provisioning builds is no longer recorded as built. A failing sk-doc node test now says which subtest failed.

### Phase 37: ci-pi-and-provisioning-follow-ups

The Pi workflow used to name its two extensions by hand and run only their test scripts. A `discover` job now lists every folder under `.pi/extensions/` that holds a `package.json`, and each leg runs the extension's `test` script, which is required, then `typecheck` and `check:pack` when the extension defines them. pi-fast-mode defines no `check:pack`, so its leg skips that step.

Provisioning used to fingerprint a package's tracked sources after its build. The fingerprint is now taken before the build and written only when the build succeeds. A source edited while the build ran therefore shows up as changed on the next provision.

The battery already isolated a root nested inside another checkout, and unit tests covered ancestor detection through a symlink. A new test now runs the whole battery through a symlinked alias of a nested root. A live OpenCode 2.0.32 run through a symlinked worktree alias passed every leg with the isolated line.

The cite-drift failure did not come back in 170 local runs or in the test's 57 other CI executions, and none of the three suspected causes holds up (`scratch/cite-drift-evidence.txt`). Nothing found in the test or the scanner explains it. What changed is that it can now be diagnosed: the runner pins node:test's TAP reporter, because on Node 26 the default spec format left the runner's `not ok` search with nothing to find.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/pi-extension-tests.yml` | Modified | Discovery job, matrix from its output, typecheck and pack steps |
| `.github/workflows/README.md` | Modified | Every workflow in the contents and push versus pull-request tables |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | Fingerprint before the build, stamp after success |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modified | A build that edits its own source is rebuilt next time |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modified | End-to-end battery run through a symlinked nested root |
| `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | Modified | TAP reporter pinned for the listed node tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at max thinking wrote each change through cli-pi on llmgateway, one short brief per change. GPT-6 Luna at max effort reviewed read-only through cli-codex. The orchestrator reran every suite, mutated each change against the old code, dry-ran the discovery step and provisioned the real worktree, with the evidence under `scratch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `[ ]` tests in the two shell files | Luna's round 1 P2 asked for `[[ ]]`. `worktree-naming.sh` uses `[ ]` in 60 conditions and `[[ ]]` in 7, and the test file uses no `[[ ]]`, so the new lines match the code around them |
| Bound the cite-drift failure rather than change the test | No run reproduced it and no candidate cause holds up. Changing the test on a guess would hide the next occurrence, so the runner was made to name it instead |
| Run `typecheck` and `check:pack` with `--if-present`, and `test` without it | pi-fast-mode defines no `check:pack`. A new extension without either optional script still gets its tests run, and one without a `test` script fails its leg so an untested extension cannot pass |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `worktree-naming.test.sh` | PASS=162 FAIL=0 (157 before); the old stamp order fails 2 (`scratch/mutation/stamp-old-order.txt`) |
| Battery unit tests | 51 of 51 (50 before); no `realpathSync` in ancestor detection fails 2 (`scratch/mutation/battery-no-realpath.txt`) |
| Pi extensions | pi-cache-optimizer 118 of 118, pi-fast-mode 81 of 81; both `typecheck` exit 0; pi-cache-optimizer `check:pack` exits 0, and pi-fast-mode defines none, so its step is skipped |
| Discovery dry run | Repository 2, fixture 3 with a `lib` folder left out, empty folder exit 1 (`scratch/pi-discovery-dry-run.txt`) |
| Provision twice | Five rebuilds with stamps moved aside, then 0 built; stamps identical (`scratch/provision-rebuild-then-idle.txt`) |
| Symlinked root, live | OpenCode 2.0.32 battery through a symlinked alias of worktree 179: every leg PASS with the isolated line (`scratch/symlinked-root-live-v2.txt`) |
| TAP pin | Failing fixture on Node 26: 0 `not ok` lines bare, 1 pinned; the four listed node tests PASS through the runner |
| README tables | 32 of 32 workflows in both tables (`scratch/readme-table-check.txt`); `validate_document.py` 0 issues |
| `actionlint`, gate inputs | Exit 0; `RESULT: PASSED` |
| sk-doc runner, full | Every test passes except `test_readme_manifest.py`, which fails on main too since `.skilled/hooks/session-relaunch/lib` was added |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The cite-drift failure is not explained.** It happened once in 58 CI executions and never locally. If it happens again, the runner's log now names the subtest.
2. **A build that rewrites its own tracked inputs now rebuilds once more.** Its pre-build fingerprint differs from the files it leaves behind, so the next provision rebuilds it once and then goes idle, provided the build is deterministic. None of the five listed builds does this: their stamps were identical before and after.
3. **A new source file counts only once git tracks it,** as before.
<!-- /ANCHOR:limitations -->

---
