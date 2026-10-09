---
id: doctor-commands-readme
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
version: 2.3.0.0
---

# Doctor Commands

## 1. OVERVIEW

Manual testing scenarios for the doctor command surface.

## Scope

15 scenarios covering the four doctor commands this skill owns and the test environment they share:

- `/doctor:speckit`: 3 scenarios (DOC-349 to DOC-351): a healthy index, a stale index and a target another command owns now
- `/doctor:runtime-mirrors`: 2 scenarios (DOC-352 and DOC-353): every mirror in sync, and one drifted mirror
- `/doctor:env`: 3 scenarios (DOC-354 to DOC-356): inspecting switches, saving a preference behind a yes, and secrets and per-invocation switches that are never saved
- `/doctor:update`: 6 scenarios (DOC-357 to DOC-361 and DOC-381): `check`, `align`, `apply`, `rollback`, `record-base` and `compat`
- The `/doctor:update` test fixture: 1 scenario (DOC-379): building, checking and resetting it

The other doctor commands are tested in the playbook of the skill they check: `/doctor:skill-advisor` in system-skill-advisor (DOC-348 and DOC-362 to DOC-367), `/doctor:deep-loop` in system-deep-loop (DOC-331 to DOC-333 and DOC-368), `/doctor:git` in sk-git (DOC-369 to DOC-374) and `/doctor:mcp` in mcp-code-mode (DOC-375 to DOC-378 and DOC-380). DOC- numbers are shared across those playbooks, so a new doctor scenario takes the next free number in the whole series.

The memory and causal-graph doctor scenarios were removed with the memory server they diagnosed. Their former IDs (DOC-323 to DOC-330) are retired and must not be reused. The standalone rebuild-orchestrator and version-migration scenarios were removed with that command, and their former IDs (DOC-338 to DOC-342 and DOC-344 to DOC-347) are retired as well.

## Test Environments

Scenarios that change state run in one of two long-lived local worktrees instead of a throwaway copy. Both stay local: never push their branches, and never push the `v4.0.0.3-fixture` tag. Run one scenario at a time in each environment.

### Current-code environment

| Field | Value |
|---|---|
| Path | `.worktrees/.doctor-test-environment`, a symlink to the numbered worktree directory |
| Branch | `worktrees/088-doctor-test-environment`, following `origin/main` |
| Used by | DOC-349, DOC-350, DOC-352 to DOC-356 here, and the stateful doctor scenarios in system-skill-advisor, system-deep-loop, sk-git and mcp-code-mode |

- **Before a scenario:** run `git -C .worktrees/.doctor-test-environment fetch origin` and `git -C .worktrees/.doctor-test-environment merge --ff-only origin/main`, then confirm `git status --porcelain` prints nothing.
- **Dependencies:** the worktree is created without dependencies. A scenario that needs a built runtime runs `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .worktrees/.doctor-test-environment` once first.
- **Advisor state:** an advisor rebuild, which DOC-348 and DOC-362 both run, leaves `advisor_recommend` reporting `stale` with reason `advisor_rebuild` until the next trusted scan. Before DOC-364, run `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --json '{}'` in the environment, or every router-reach probe fails as `probe-error`.
- **After a scenario:** restore every file it changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.
- **Exceptions:** DOC-370 runs on a disposable clone, because a linked worktree shares the main checkout's `.git/config` and `git config --local` would change the real repository. DOC-381 builds its own disposable v3 fixture outside the checkout and deletes it afterwards, because the compat move renames the spec roots. DOC-331 to DOC-333 keep their own graph setup.
- **Recreate:** `bash .skilled/skills/sk-git/scripts/worktree-naming.sh create doctor-test-environment origin/main --no-provision`, then point the `.doctor-test-environment` symlink at the new numbered directory.

### `/doctor:update` fixture

| Field | Value |
|---|---|
| Path | `.worktrees/.doctor-update-test-environment`, a symlink to the numbered worktree directory |
| Branch | `worktrees/087-doctor-update-test-environment`, created from `v4.0.0.0` |
| Used by | DOC-357 to DOC-361 and DOC-379 |

The fixture's commits, in order:

1. The current updater copied over the v4.0.0.0 tree, because the old tags ship only the legacy `doctor-update.yaml`.
2. A local edit to `sk-code-webflow/SKILL.md`, and a new local packet `sk-code/sk-code-web-dev`.
3. sk-git replaced by the 10-file Barter skill.
4. `.skilled/release/base.json` recorded for `v4.0.0.0` with `--offline --trust-release`, so it reports `verified: false`.
5. The updater that reports a release path below a local symlink as a `symlink-parent` conflict, copied over the first one. An unscoped check therefore finishes, and `directory:changelog` reports `conflict` because v4.0.0.0 keeps `.skilled/changelog/sk-design` as a symlink.

The local tag `v4.0.0.3-fixture` is `v4.0.0.2` with `sk-code/sk-code-obsidian` deleted.

| Unit | Release | Expected status |
|---|---|---|
| `skill:sk-code/sk-code-webflow` | `v4.0.0.2` | `customized` |
| `skill:sk-code/sk-code-web-dev` | `v4.0.0.2` | `local` |
| `skill:sk-git` | `v4.0.0.2` | `conflict` |
| `skill:sk-code/sk-code-obsidian` | `v4.0.0.3-fixture` with `--include-prerelease` | `removed` |

- **Always** pass `--offline` and a `--scope` naming fixture units. The copied updater forms one `command:commands/doctor` unit that no scenario asserts.
- **Every file needs an explicit answer.** The engine ignores the prefilled decisions in `decisions.json`, so record each one with `decide`.
- **Reset after apply:** run `rollback --run=<runDir>`, require every written path under `restored` and `skipped` empty, confirm `git status --porcelain` prints nothing, then delete the run directory under `.skilled/release/runs/`. Never apply the same run twice.
- **Commits in the fixture:** the v4.0.0.0 hooks need dependencies the fixture does not have, so fixture commits set `SPECKIT_SKIP_MIRROR_PARITY=1 SPECKIT_SKIP_ROUTE_REMINT=1`, the two bypasses those hooks name. Never use `--no-verify`.
- **Recreate:** DOC-379 lists every build step.

## How to Run

Each scenario has a Markdown file named for its topic (`doctor-<short-name>.md`, with no numeric filename prefix) with its own numbered sections: overview, scenario contract, prompt, commands, expected results, evidence and pass/fail. Execute each scenario directly per the root playbook's execution policy: run the real commands, inspect real files and record a `PASS`, `FAIL`, or `SKIP` verdict. A scenario that cannot be run deterministically is a `SKIP` whose blocker names that limitation. See [`../manual-testing-playbook.md`](../manual-testing-playbook.md) for the full execution and evidence-capture policy.

## See Also

- Router sources: `.skilled/commands/doctor/speckit.md`, `runtime-mirrors.md`, `env.md` and `update.md`
- Route manifest: `.skilled/commands/doctor/_routes.yaml`
- CI assertion: `.skilled/commands/doctor/scripts/route-validate.sh`
- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)

Provenance: manual only - index. Each scenario listed here carries its own line.
