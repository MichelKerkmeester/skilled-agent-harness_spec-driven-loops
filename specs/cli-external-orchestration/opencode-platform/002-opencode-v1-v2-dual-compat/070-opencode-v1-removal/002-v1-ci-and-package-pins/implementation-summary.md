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
    last_updated_at: "2026-11-19T11:50:00Z"
    last_updated_by: "closure-run"
    recent_action: "Closed the local checks; the CI row and T015 stay open until the operator pushes"
    next_safe_action: "Operator: give the push go-ahead, then read the CI run for the final commit (T015, AC-008)"
    blockers:
      - "The push and CI run need the operator's go-ahead"
    key_files:
      - "scratch/after.txt"
      - "scratch/sdk-usage.txt"
      - "scratch/variant.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "closure-002-v1-ci-and-package-pins"
      parent_session_id: null
    completion_pct: 85
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
| **Completed** | Open: the CI run is pending |
| **Level** | 2 |
| **Status** | In Progress |
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
| `.github/workflows/opencode-dual-version.yml` | Modified | Removes the v1 matrix entry and the both-versions job, runs the four suites unconditionally, pins 2.3.2, and renames the workflow |
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

The CI run on the final commit has not happened. It needs the operator's push go-ahead, so T015 and AC-008 stay open.
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

1. **The CI run is UNKNOWN.** T015 and AC-008 stay open until the operator pushes the branch and the run on the final commit is read.
2. **The `variant` decision rests on source evidence, not a live run.** `scratch/variant.txt` cites the OpenCode state code in `.skilled/hooks/session-handover/lib/context-usage.cjs`, and it records that no live `opencode run` was made. AC-006 is met on that basis.
3. **CHK-003 is not met as written.** The manifests were edited at 10:28:36, and `scratch/sdk-usage.txt` was written at 10:29:25, so the SDK record came after the change.
4. **CHK-012 is not evidenced.** The lockfiles changed and no longer name `@opencode-ai/plugin`, but no log records the `npm install --package-lock-only` run.
5. **CHK-013 is not met as written.** The branch diff covers files outside the table, including both lockfiles, `opencode.json` and `.github/workflows/README.md`.
6. **Completion is blocked on the push.** The phase cannot be Complete while AC-008 is Unmet.

---

<!-- /ANCHOR:limitations -->

## Deviations From The Task Text

- **T003:** the `variant` check was recorded from source evidence, not from a live `opencode run`. `scratch/variant.txt` says so.
- **CHK-003:** the SDK record was written after the manifests changed (Known Limitation 3).
- **T015 and AC-008:** left open with UNKNOWN, as the closure brief directed.
