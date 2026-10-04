---
title: "DOC-379 -- Doctor update test environment"
description: "Manual scenario validating that the long-lived /doctor:update fixture worktree classifies its four fixture units as customized, local, conflict and removed, and returns to its committed state after an apply and rollback."
version: 1.0.0.0
id: doctor-commands-doctor-update-test-environment
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-379 -- Doctor update test environment

## 1. OVERVIEW

This scenario validates the shared fixture that DOC-357 to DOC-361 run against. The fixture is a local worktree created from `v4.0.0.0` that carries the current updater and four committed customizations, so the release updater has a real unit for each status: `customized`, `local`, `conflict` and `removed`. The scenario confirms the fixture is intact, runs the scoped checks, and proves that one apply followed by its rollback leaves the worktree exactly as committed.

When the fixture is missing, rebuild it from the main checkout before running this scenario:

1. `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create doctor-update-test-environment v4.0.0.0 --no-provision`, then `ln -s <numbered directory> .worktrees/.doctor-update-test-environment`.
2. Copy the current `update.md`, `_routes.yaml`, `scripts/release-update.cjs`, `assets/doctor-update-presentation.txt` and the five `assets/doctor-update-*.yaml` files from `.skilled/commands/doctor/` into the fixture, plus `.skilled/release/.gitignore`, and commit.
3. Add a line to `.skilled/skills/sk-code/sk-code-webflow/SKILL.md`, create `.skilled/skills/sk-code/sk-code-web-dev/SKILL.md`, and commit.
4. Replace `.skilled/skills/sk-git/` with the 10 files of the Barter sk-git snapshot from the main checkout's `barter/ai-speckit/coder-backup/ai-speckit-main/coder/.opencode/skills/sk-git/`, and commit.
5. Run `node .skilled/commands/doctor/scripts/release-update.cjs record-base --repo . --release v4.0.0.0 --offline --trust-release --json` and commit `.skilled/release/base.json`.
6. Cut the local tag: read `v4.0.0.2` into a temporary index with `GIT_INDEX_FILE`, remove `.skilled/skills/sk-code/sk-code-obsidian` with `git rm -r -f --cached`, write the tree, commit it with `git commit-tree` on `v4.0.0.2`, and tag that commit `v4.0.0.3-fixture`.

Every fixture commit sets `SPECKIT_SKIP_MIRROR_PARITY=1 SPECKIT_SKIP_ROUTE_REMINT=1`, because the v4.0.0.0 hooks need dependencies the fixture does not have. The system-spec-kit doctor-commands README describes both test environments.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the fixture classifies its four units as designed and returns to its committed state after an apply and rollback.
- Playbook ID: DOC-379.
- Real user request: `Check that the doctor update test fixture still gives one unit of each status and resets cleanly.`
- Prompt: `Check that the doctor update test fixture still gives one unit of each status and resets cleanly.`
- Preconditions: The fixture worktree at `.worktrees/.doctor-update-test-environment` with its fixture commits, the local tag `v4.0.0.3-fixture`, an empty `git status --porcelain`, and no run directory under `.skilled/release/runs/`. Node and git available.
- Expected execution process: Confirm the fixture state, run the two scoped checks, run align, decide and apply on the Webflow unit, roll back, then compare the worktree with its committed state.
- Expected signals: `git ls-remote --tags origin v4.0.0.3-fixture` prints nothing. The `v4.0.0.2` check returns `ok: true`, overall `status: unknown` because it runs offline, and the units `skill:sk-code/sk-code-webflow` as `customized`, `skill:sk-code/sk-code-web-dev` as `local` and `skill:sk-git` as `conflict`. The `v4.0.0.3-fixture` check returns `skill:sk-code/sk-code-obsidian` as `removed`. Align writes a run directory below the ignored `.skilled/release/runs/`. After `decide` records `keep-local` for the Webflow `SKILL.md` and `adopt-release` for its two changelogs, the apply dry run lists the two changelogs, `base.json` and `divergence.json` and skips no unit. The real apply changes those paths. Rollback returns every written path under `restored` with `skipped` empty. Afterwards `git status --porcelain` prints nothing and the checksums of the two changelogs and `base.json` match their values before apply.
- Desired user-visible outcome: One unit of each status, and a fixture that is byte-identical to its committed state after the round trip.
- Pass/fail: PASS if the four units report their designed status, the apply writes only the decided paths, rollback restores them with nothing skipped, and the worktree matches its committed state.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Check that the doctor update test fixture still gives one unit of each status and resets cleanly.
```

### Commands

1. `cd .worktrees/.doctor-update-test-environment`, then confirm `git status --porcelain` prints nothing, `git tag -l v4.0.0.3-fixture` prints the tag and `git ls-remote --tags origin v4.0.0.3-fixture` prints nothing.
2. Run `node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --release v4.0.0.2 --offline --json --scope skill:sk-code/sk-code-webflow,skill:sk-code/sk-code-web-dev,skill:sk-git` and record each unit's status.
3. Run `node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --release v4.0.0.3-fixture --include-prerelease --offline --json --scope skill:sk-code/sk-code-obsidian` and record the unit's status.
4. Record the baseline: `git status --porcelain` and `shasum -a 256` of the two `sk-code-webflow/changelog/v1.*.md` files and `.skilled/release/base.json`.
5. Run `node .skilled/commands/doctor/scripts/release-update.cjs align --repo . --release v4.0.0.2 --offline --scope skill:sk-code/sk-code-webflow --json` and note the `runDir`.
6. Run `decide --repo . --run <runDir> --path <path> --decision <answer> --json` three times: `keep-local` for `.skilled/skills/sk-code/sk-code-webflow/SKILL.md`, and `adopt-release` for `changelog/v1.0.0.0.md` and `changelog/v1.1.0.0.md` in the same packet.
7. Run `apply --repo . --release v4.0.0.2 --offline --scope skill:sk-code/sk-code-webflow --decisions <runDir>/decisions.json --dry-run --json`, then the same command without `--dry-run`.
8. Run `rollback --repo . --run <runDir> --json` and record `restored` and `skipped`.
9. Compare `git status --porcelain` and the checksums with step 4, then delete the run directory.

### Expected

The checks report one unit of each status. Align writes only inside its run directory. The engine ignores the prefilled decisions, so the apply plan lists the Webflow files only after all three explicit `decide` answers. Apply writes the two changelogs and the release records, and rollback restores all of them and removes `divergence.json`. The worktree ends identical to its committed state.

### Evidence

- The step 1 outputs, including the empty `ls-remote` result.
- Both check results with each unit's status.
- The run directory, the three `decide` replies and the apply dry-run write list.
- The rollback result with `restored` and `skipped`.
- The baseline comparison from steps 4 and 9.

### Pass / Fail

- **Pass**: The four units report `customized`, `local`, `conflict` and `removed`, the apply writes only the decided paths and the release records, rollback restores every path with nothing skipped, and the worktree matches its committed state.
- **Fail**: A unit reports another status, the fixture tag is on the remote, apply writes an undecided path, rollback skips a path, or the worktree differs from its committed state afterwards.

### Failure Triage

If `check` aborts with `path parent is not a real directory`, the fixture carries an updater older than the one that reports a symlinked parent, so copy the current `release-update.cjs` again as rebuild step 2 describes. If a unit reports the wrong status, compare its files across `v4.0.0.0`, the fixture and the release with `git diff --name-status`, because each status comes from the three-way classification in `release-update.cjs`. If the apply plan skips the unit as undecided, record every non-same file with `decide`. If rollback skips a path, that path changed after apply, so restore it from the fixture commit and rerun the scenario.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../../../commands/doctor/scripts/release-update.cjs)
- Worktree allocator: [.skilled/skills/sk-git/scripts/worktree-naming.sh](../../../sk-git/scripts/worktree-naming.sh)
- Environment guide: [doctor-commands/README.md](README.md)

Provenance: manual only - /doctor:update

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-379
- Feature name: Doctor update test environment
- Command mode: `/doctor:update`
- YAML asset: `doctor-update-check.yaml`, `doctor-update-align.yaml`, `doctor-update-apply.yaml` and `doctor-update-rollback.yaml`
- Mutation boundary: the fixture worktree only. Apply writes are rolled back, and the run directory is deleted at the end.
- Feature file path: `doctor-commands/doctor-update-test-environment.md`
