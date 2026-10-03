# Release-aware /doctor:update: design

Source: `../research/research.md` (ten iterations, DR-Q4-001). This file settles the research's open questions and fixes the engine contract the command workflows call.

## 1. Settled decisions

| Question | Decision | Why |
|---|---|---|
| One command or several | Two commands. `/doctor:update` is the release updater with three actions, `check`, `align` and `apply`, each with its own workflow YAML. Today's database rebuild moves unchanged in behaviour to `/doctor:rebuild`. | DR-Q4-001. The rebuild's mutation boundary forbids skill writes, and the two have different rollback disciplines. |
| Registration shape | One `standalone:` entry per command in `_routes.yaml`: `/doctor:update` and `/doctor:rebuild`. The doctor command count goes from 4 to 5. | Iterations 7 and 8. One router per command keeps the family's subaction pattern. |
| Bare `/doctor:update` | Runs `check`. | The read-only action is the only safe default. |
| Name of `align` | Kept. | The operator asked for skills that "align with latest release reality". The `v3.5.0.0` use of "alignment" is history, and changelogs are never rewritten. |
| Trigger phrases | `/doctor:update`: "spec-kit version migration", "doctor update", "update skills to latest release", "release update". `/doctor:rebuild`: "rebuild all spec-kit databases", "doctor rebuild", "doctor full sync". | DR-Q4-001 governs over iteration 9. |
| Deprecated alias | None. A bare `/doctor:update` now checks, which is read-only, so an operator who expected a rebuild loses nothing. The check report names `/doctor:rebuild`. | No silent mutation under an old name. |
| Base manifest and divergence ledger | Git-tracked, under `.skilled/release/`: `base.json` and `divergence.json`. Run directories `.skilled/release/runs/` are gitignored. | The ledger is the repository's record of its own overrides. It must survive clones and be reviewable in a diff. |
| Prereleases | Excluded from latest-upstream resolution. `--release=<tag>` may name one explicitly. | Iterations 1 and 6. |
| Merged text | Written only after an explicit per-file `merge` or `use-proposal` decision, and re-verified at apply. | Satisfies "suggest fixes that keep override specifics" without auto-writing. |

## 2. Update units

- Every hub `.skilled/skills/<hub>/`, excluding its child-skill directories.
- Every child skill `.skilled/skills/<hub>/<child>/` whose directory holds a `SKILL.md`.
- Every command family `.skilled/commands/<family>/`.
- Every other top-level directory under `.skilled/` as one unit, plus `.skilled/(root)` for the files directly under `.skilled/`.

Units come from the union of the local, base and release trees, so a unit added by a release shows up as `new`. Only tracked files take part. Untracked local files are never touched, except that one at a path the release adds is a conflict.

## 3. Engine contract

`node .skilled/commands/doctor/scripts/release-update.cjs <check|align|decide|apply|rollback> [options]`. CommonJS, Node built-ins only, and all git access through `child_process.execFileSync('git', ...)`.

Common options:

| Option | Meaning |
|---|---|
| `--repo <dir>` | Defaults to the git top-level of the current directory. |
| `--remote <name\|url>` | Defaults to `origin`. |
| `--release <tag>` | Overrides latest-upstream resolution. |
| `--scope all\|<unit,...>` | Selects units by name: `sk-git`, `sk-code/sk-code-review` or `commands/doctor`. |
| `--offline` | Never touches the network. |
| `--json` | Emits one JSON document on stdout. |

### Release resolution

- **Release tags.** A release tag matches `^v\d+\.\d+\.\d+\.\d+$`. Prereleases carry a suffix and are excluded unless named. Comparison is numeric by segment.
- **Local tags.** Read with `git for-each-ref refs/tags`.
- **Upstream.** Read with `git ls-remote --tags <remote>`, parsing the peeled `^{}` lines. If the remote is unreachable, or `--offline` is set, upstream is `unknown`. It is never reported as up to date.
- **Fetching objects.** A missing release commit is fetched with `git fetch --no-tags <remote> refs/tags/<tag>`, which creates no ref. This is the only network write, and it touches only the git object store and `FETCH_HEAD`.
- **Checkout position.** One of `at-release`, `ahead` (with N commits), `behind` or `unknown`, plus a separate `dirty` flag.

### Base per unit, in order

Each unit reports its `baseSource`.

1. **`recorded`:** the unit's entry in `.skilled/release/base.json`, as `{release, tree}`.
2. **`ancestry`:** the newest release tag that is an ancestor of HEAD.
3. **`inferred`:** the release tag whose unit tree differs from the local tree in the fewest files, with the newer tag winning a tie. This covers a vendored `.skilled/` with no shared history; the engine fetches tag objects as needed.
4. **`none`:** the unit is `blocked`.

### File classes

Classes compare base B, local L and release R by mode and blob id. The local blob id comes from `git hash-object`, and a symlink hashes its target string.

| Condition | Class |
|---|---|
| L = R | `same` |
| L = B and R ≠ B (also covers a release add or delete) | `take-release` |
| L ≠ B and R = B | `local-only` |
| L ≠ B, R ≠ B and L ≠ R | `conflict` |

A `conflict` has subkinds:

- `deleted-locally`;
- `deleted-in-release`;
- `binary`;
- `mergeable`, when `git merge-file -p` exits 0;
- `conflicting`, when it reports conflict markers.

A ledger entry suppresses a file when its recorded `localBlob` and `releaseBlob` still match. The file is then reported as `kept-local`, with the date it was decided.

### Unit status

| Status | Meaning |
|---|---|
| `current` | Nothing differs. |
| `update` | Only `take-release` files: not customized. |
| `new` | Absent locally. |
| `customized` | Has `local-only` files and possibly `take-release` files, but no conflict. |
| `local` | Only local-only differences, including a unit created locally: nothing to take from the release. |
| `conflict` | Has at least one conflict. |
| `removed` | Present in the base, absent in the release. |
| `blocked` | No base. |

### Subcommands

- **`check`:** read-only, apart from the fetch above.
  - Reports the release position, upstream latest and every unit's status, with class counts and the changelog entries the release adds under the unit.
  - Exits 0 when a report is produced, whatever the status. Exits 2 on usage errors.
- **`align [--out <dir>] [--dry-run]`:**
  - Writes a run directory, by default `.skilled/release/runs/<release>-<utc-stamp>/`, holding:
    - `plan.json`;
    - `decisions.json`;
    - `evidence/<path>.md`, one evidence card per conflicted or customized file: blobs, the base-to-release diff, the base-to-local diff, the merge summary, the changelog rationale and a recommended decision;
    - `proposals/<path>`, the merged text with markers where `git merge-file` conflicts.
  - It never writes outside the run directory. `--dry-run` prints the plan and writes nothing.
  - Recommended decisions:

    | File | Recommendation |
    |---|---|
    | `mergeable` | `merge` |
    | `conflicting` | `use-proposal`, after the markers are resolved |
    | deleted cases | `keep-local` |
    | `take-release` files inside customized units | prefilled `adopt-release` |
- **`decide --run <dir> (--path <p> --decision <adopt-release|keep-local|merge|use-proposal> | --unit <u> --defer)`:**
  - Validates each decision and writes it into `decisions.json`.
  - `merge` is allowed only for `mergeable` files.
  - `use-proposal` requires a proposal with no conflict markers and records its sha256.
- **`apply [--decisions <path>] [--dry-run]`:**
  - **Scope.** Applies `update` and `new` units, plus decided files of customized, conflict and removed units when a decision file is given. Without one, customized, conflict and removed units are listed and left untouched.
  - **Refusals, exit 1:**
    - any target path has staged or unstaged changes against HEAD;
    - drift since align: a recorded local or release blob no longer matches;
    - a `use-proposal` file still holds conflict markers or its sha256 changed;
    - the lock file `.skilled/release/.apply.lock` exists.
  - **Order:**
    1. Take the lock.
    2. Write `rollback.json` into the run directory before the first file write.
    3. Write the files, honouring the symlink and executable modes.
    4. Update `base.json` for the applied units.
    5. Append ledger entries for `keep-local`, `merge` and `use-proposal`.
    6. Release the lock on every exit path.
  - **Output** reports:
    - the paths written, added and deleted;
    - the skipped units;
    - `followUps`:
      - `regenerateHubs`, the hubs whose child skills changed;
      - `reinstallHooks`, set when `.skilled/hooks/**` or a git-hooks script changed;
      - `runtimeMirrors`, set when commands or skills were added or removed;
      - `rebuildDatabases: true`, always.
  - `--dry-run` prints the full write plan and writes nothing, the lock included.
- **`rollback --run <dir>`:**
  - Restores every path in `rollback.json` to its pre-apply state: the HEAD blob for files that existed, deletion for added files. It also restores `base.json` and `divergence.json`.
  - A path changed since apply is skipped and reported.
  - Exits 1 when any path was skipped.

## 4. Commands and workflows

| Command | Asset | Mutation class | Gates |
|---|---|---|---|
| `/doctor:update [check]` | `doctor-update-check.yaml` | read-only | none |
| `/doctor:update align` | `doctor-update-align.yaml` | add-only (run directory) | One consolidated decision batch per unit. Every `merge` or `use-proposal` shows its proposal before it is recorded. |
| `/doctor:update apply` | `doctor-update-apply.yaml` | mutates | Dry-run plan first, then one startup approval before any write. After the write, the post-apply battery runs. Then a prompt to run `/doctor:rebuild`. On failure, a prompt to roll back. |
| `/doctor:rebuild` | `doctor-rebuild.yaml` (today's `doctor-update.yaml`) | mutates | Unchanged phase gates. |

Shared presentation: `doctor-update-presentation.txt` for the three update actions and `doctor-rebuild-presentation.txt` for the rebuild.

The post-apply battery runs each check below and records pass or fail:

- `generate-leaf-manifest.cjs --check <hub>` for each hub in `regenerateHubs`;
- `regenerate-skill-derived.cjs --all --dry-run`, which is that script's check mode: exit 0 when every skill is fresh, 1 when one is stale, and `--all --write` repairs;
- `bash .skilled/commands/doctor/scripts/route-validate.sh`;
- `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`;
- `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`;
- the three `sync-prompts*.cjs --check` scripts;
- the hook installers' check counterparts, when `reinstallHooks` is set.

A failing check offers its write counterpart with approval, or a rollback.
