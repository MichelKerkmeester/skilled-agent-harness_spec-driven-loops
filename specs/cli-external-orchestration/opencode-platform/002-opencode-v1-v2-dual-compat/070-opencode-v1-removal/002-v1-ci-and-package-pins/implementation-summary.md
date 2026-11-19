---
title: "Implementation Summary"
description: "Phase 002 removes the v1 CI matrix leg and the both-versions job, pins OpenCode 2 at 2.3.2, and drops the unused @opencode-ai/plugin package. The CI run waits for the operator's push."
trigger_phrases:
  - "v1 ci and package pins implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins"
    last_updated_at: "2026-11-19T23:02:51Z"
    last_updated_by: "generate-context"
    recent_action: "Merged into main as 06d02096e90; v2 battery green, phase 002 complete"
    next_safe_action: "None; the packet is complete"
    packet_purpose: "Purpose: A CI workflow that tests one OpenCode major at the pinned version, with no v1 leg, and package manifests that pin only what v2 uses."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/tasks.md"
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:45aeff2412d861c7997d945af40b55c2735620ff6d72049c2edd36fc29700ad6"
      session_id: "closure-002-v1-ci-and-package-pins"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "df9261d4-6090-4b52-892b-db52ff291ccd"
      workspace: "/Users/michelkerkmeester/worktrees/public/477-opencode-v1-removal"
      savedAt: "2026-11-19T23:02:51Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-v1-ci-and-package-pins |
| **Completed** | 2026-11-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CI workflow now runs the OpenCode 2.3.2 battery only. The v1 matrix entry and the both-versions job are gone, the four suites that were gated on the v1 leg run in an unconditional step, and the workflow is named `OpenCode v2 Battery`. The setup helper pins `@opencode/cli@2.3.2`. The unused `@opencode-ai/plugin` package is removed from both manifests.

### Phase 2: v1-ci-and-package-pins

The workflow and the setup helper carried the old 2.3.0 pin and a v1 leg. This phase bumps both pins to 2.3.2, removes the v1 leg, decides the SDK question from the binary and the repository imports, and records the `variant` result before the manifests are read again.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/opencode-v2-battery.yml` | Modified | Removes the v1 matrix entry and the both-versions job, runs the four suites unconditionally, pins 2.3.2, and renames the workflow |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh` | Modified | Bumps `V2_PKG` to `@opencode/cli@2.3.2` (the phase 001 edits are in the same file) |
| `.opencode/package.json` | Modified | Removes `@opencode-ai/plugin` from `dependencies` and `overrides` |
| `.skilled/package.json` | Modified | Removes `@opencode-ai/plugin` from `dependencies` and `overrides`; keeps the devDependency `@opencode/plugin` at 2.2.6 |
| `.opencode/package-lock.json` | Modified | Regenerated after the manifest change (no `@opencode-ai/plugin` entry remains) |
| `.skilled/package-lock.json` | Modified | Regenerated after the manifest change (no `@opencode-ai/plugin` entry remains) |
| `.skilled/bin/tests/opencode-config-shape.test.cjs` | Modified | Renames the "keeps the v1 config shape" test |
| `.skilled/bin/tests/opencode-compat-layout.test.cjs` | Modified | Stops asserting the v1 SDK |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` | Modified | Replaces the v1 argv cases with v2 cases |
| `opencode.json` | Unchanged | The `variant` keys are kept, because the result is "read" |
| `scratch/versions.txt`, `scratch/sdk-usage.txt`, `scratch/variant.txt`, `scratch/gated-suites.txt`, `scratch/after.txt` | Created | Evidence named by the tasks |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The registry and the binary were checked first, and the results went into `scratch/versions.txt`. The SDK usage and the `variant` key were then decided and recorded, and the manifests and the lockfiles changed after that. The four formerly gated suites ran with no matrix condition, and the closure run reran them with the results in `scratch/after.txt`. The workflow YAML parses with Ruby, and `opencode-setup.sh` passes `bash -n`.

The branch was merged into main as 06d02096e90, and the OpenCode v2 Battery passed on that commit (run 44632438229). Three other suites failed on the same commit, each on a test that already failed on main before the merge: two pi executor-config tests, one Pi session-handover test and one plugin test.
After the operator asked for version-neutral names, the workflow file became `.github/workflows/opencode-v2-battery.yml`, the models-form test became `opencode-models-form.test.cjs`, and the catalog entry `opencode-dual-version-dispatch/` became `opencode-version-dispatch/`. These were `git mv` renames in their own commit, and every live reference and this packet's Verify lines were updated. The suite counts above were recorded under the old file names.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The v2 pin is `@opencode/cli@2.3.2` in both the workflow and the setup helper | 2.3.2 is the registry's latest tag and the live binary's version |
| `@opencode-ai/plugin` is removed from both manifests and both lockfiles | The v2 binary holds no occurrence of the string, and no repository file imports it at runtime |
| `@opencode/plugin` stays a devDependency of `.skilled/package.json` | Adding it as a dependency pulls peer packages that npm 7+ would install, and the v2 binary bundles its own copy |
| The root `variant` keys are kept | The `variant` key is a v2 concept that OpenCode keeps per model, so the result is "read" |
| The workflow file name is kept, and only its `name:` changes | Renaming the file would break references to it, and the `name:` change is enough to remove the dual-version label |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The four formerly gated suites, with no matrix condition | `opencode-config-shape` 5 pass, `opencode-version-battery` 49 pass, `default-model-id` 6 pass, `opencode2-models-form` 14 pass; 0 failed in each |
| `if: matrix.family == 'v1'` in the workflow | 0 |
| `family: v1`, `Both versions installed` and `Dual-Version` in the workflow | 0 |
| `2.3.0` in the workflow and the setup helper | 0 |
| `@opencode-ai/plugin` in the two manifests | 0 |
| "keeps the v1 config shape" test name | 0 |
| `opencode-compat-layout.test.cjs` | 19 pass, 0 failed, 1 skipped |
| `"variant"` keys in `opencode.json` | 2, matching the recorded result "read" |
| Workflow YAML parse (Ruby) | `ok` |
| `bash -n` on `opencode-setup.sh` | Exit 0 |
| `secret`, `token` or `password` matches in the workflow | 0 before this phase and 0 after |
| CI run on the final commit | UNKNOWN: not run. It needs the operator's push go-ahead |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The battery ran on main, not on the branch.** It triggers only on main or a pull request, and the operator chose a direct merge, so AC-008 rests on the merge commit's run.
2. **The `variant` decision rests on source evidence, not a live run.** `scratch/variant.txt` cites the OpenCode state code in `.skilled/hooks/session-handover/lib/context-usage.cjs`, and it records that no live `opencode run` was made. AC-006 is met on that basis.
3. **CHK-003 is waived by ADR-001.** The SDK record is correct but was written 49 seconds after the manifests changed.
4. **CHK-012 is met.** Rerunning `npm install --package-lock-only` reproduces both committed lockfiles with 0 diff lines (`scratch/lockfile-regen.txt`).
5. **CHK-013 is met.** The Files table gained a row for the 12 files in `scratch/files-outside-table.txt`.
6. **Three unrelated suites fail on main.** Deep-Loop Runtime (two pi executor-config tests, since `8bc8f71d2bf` dropped the private provider), Hook Vitest (one Pi session-handover test) and Plugin Tests (one Claude-source test) fail on the same tests as before the merge.

---

<!-- /ANCHOR:limitations -->

## Deviations From The Task Text

- **T003:** the `variant` check was recorded from source evidence, not from a live `opencode run`. `scratch/variant.txt` says so.
- **CHK-003:** the SDK record was written after the manifests changed (Known Limitation 3).
- **T015 and AC-008:** left open with UNKNOWN, as the closure brief directed.
