---
title: "Implementation Summary"
description: "The runtime package now documents one test entry point: the sharded runner and its script entry are gone, and the dual-version workflow runs its config-shape tests once in the v1 matrix entry instead of once per family."
trigger_phrases:
  - "dead runner and step cleanup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/014-dead-runner-and-step-cleanup"
    last_updated_at: "2026-11-12T08:22:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Removed the sharded runner nothing calls, its script entry and its doc mentions, and guarded one duplicated workflow step"
    next_safe_action: "None. The cleanup passes on the pull request"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-dead-runner-and-step-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-dead-runner-and-step-cleanup |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The runtime package now has one documented test entry point. `npm test` is the only way in, because the sharded runner and its `test:sharded` script are gone, and every document that named them now names the bounded runner instead. In CI, the config-shape tests run once per workflow run rather than once per matrix family.

### Phase 14: dead-runner-and-step-cleanup

`run-tests-sharded.mjs` split the suite into twelve serial shards, and nothing invoked it. Removing it leaves `npm test` as the supported lane, which already bounds a run with a process-group timeout. The three runtime READMEs, `ARCHITECTURE.md` and `.env.example` lost every line that pointed at the runner, its script entry or `SPECKIT_TEST_SHARDS`, so no document describes an entry point that no longer exists.

The `battery` job runs the config-shape step before either OpenCode package is installed, and its fixtures and repository reads do not vary by family. A step-level guard on the `v1` entry keeps the four tests running while the `v2` entry goes straight to its install.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` | Deleted | Removes the 44-line sharded runner that no workflow, hook or script called. |
| `.skilled/skills/system-spec-kit/runtime/package.json` | Modified | Drops `test:sharded`; 17 scripts remain and `test` still maps to `node scripts/run-tests.mjs`. |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | Modified | Drops the trigger phrase, overview bullet, tree entry, inventory row and usage line for the deleted runner. |
| `.skilled/skills/system-spec-kit/runtime/README.md` | Modified | Removes the usage line and rewrites the lane paragraph around `test:spec-validation`. |
| `.skilled/skills/system-spec-kit/runtime/tests/README.md` | Modified | Removes the entrypoint row, the sharded-command advice and the shard paragraph. |
| `.skilled/skills/system-spec-kit/ARCHITECTURE.md` | Modified | The `scripts/` comment names the build finalizer and the bounded runner only. |
| `.env.example` | Modified | Removes the `SPECKIT_TEST_SHARDS` example and keeps `SPECKIT_TEST_RUN_TIMEOUT_MS`. |
| `.github/workflows/opencode-dual-version.yml` | Modified | Guards the config-shape step to `matrix.family == 'v1'` and extends its comment with the one-execution rationale and the rename dependency. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every check is a static read; no test suite runs for this change. The reference census ran first (`refs=8 files=4`), and the workflow census confirmed one config-shape definition at index 3 of 7 over a two-entry matrix. Then the runner was deleted, the script entry and the twelve documentation lines were removed, and the step gained its guard. Each task's own Verify command ran immediately after its edit and printed the expected line before the task was ticked.

The phase ended with the reference grep, the package parse and script count, the workflow parse, the four-test count and the scoped status count, all green. The runtime `dist` was rebuilt first (`npm run build`) because the checked-out attestation was stale, which writes only gitignored output. `validate.sh --strict` then reported `RESULT: PASSED` after an automatic repair of derived metadata.

No task was skipped. Nothing in this phase pushes a branch, opens a pull request or needs an operator decision.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the runner rather than keep it as an unlisted manual escape hatch | Nothing invoked it, and it spawned twelve worker processes for a suite `npm test` already runs in one. |
| Guard the existing step to `v1` instead of moving it into its own job | A new job pays a checkout and provisioning for a step the research prices at 19 s; the guard adds no runner cost. |
| Clean all five documentation surfaces, not only the two files the finding counted | The other three also name the runner, its script or its variable, and each would be false after the deletion. |
| Leave `trigger-index.json` and `phrase-variants.json` alone | Both are generated data; the index rebuild workflow owns the stale phrase, and hand-editing them would be overwritten. |
| Reword the surrounding prose while removing the lines | Deleting the second runner left plural subjects ("Two of them", "test runners") and a `shard split` clause that named behavior no file provides. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 reference census before edits | `refs=8 files=4` |
| T002 config-shape census before edits | `matrix entries: ['v1', 'v2']` and `config-shape step index: 3 of 7 steps` |
| T003 runner deleted | `RUNNER_GONE` |
| T004 `test:sharded` removed | `test:sharded absent` |
| T005 `scripts/README.md` cleaned | `SCRIPTS_README_CLEAN` |
| T006 `runtime/README.md` cleaned | `RUNTIME_README_CLEAN` |
| T007 `tests/README.md` cleaned | `TESTS_README_CLEAN` |
| T008 `ARCHITECTURE.md` cleaned | `ARCHITECTURE_CLEAN` |
| T009 `.env.example` cleaned | `ENV_CLEAN` |
| T010 step guard and comment | `definitions=1 guard=matrix.family == 'v1' entries=['v1', 'v2'] tests=4` |
| T011 reference grep | `GREP_CLEAN` |
| T012 package parse and default script | `node scripts/run-tests.mjs / 17` |
| T013 workflow jobs | `jobs=battery,both` |
| T014 config-shape test paths | `tests=4` |
| T015 scoped diff | `8` |
| Five-file sharded sweep | `rg -n -i 'sharded'` over the READMEs, `ARCHITECTURE.md` and `.env.example` printed nothing, exit 1 |
| `test:sharded` and `SPECKIT_TEST_SHARDS` sweep | `git grep` over the tracked tree excluding `specs/` printed nothing, exit 1 |
| Packet validation, auto-repair pass | `Draft auto-repair: spec.md is Draft and every error is derived metadata, so repair-derived.cjs --apply ran once.` exit 1 |
| Packet validation, confirming pass | `RESULT: PASSED (errors=0 warnings=0)` exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Renaming the `v1` matrix entry silences the four config-shape tests.** The guard keys on `matrix.family == 'v1'`, and the step comment records that dependency. Any rename must update the guard in the same change.
2. **The generated trigger index keeps the phrase "sharded test runner" until its next rebuild.** `runtime/data/trigger-index.json` is generated data, so this phase leaves it to the index rebuild workflow rather than hand-editing it.
3. **The 19 s saving is not re-measured.** The step price comes from the research. This phase proves the second execution is gone from the matrix, not the wall-clock delta.
<!-- /ANCHOR:limitations -->

---
