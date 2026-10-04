# Iteration 002 — Long-lived `/doctor:update` test environment

## Focus
Design the long-lived local worktree that gives `check`, `align`, `apply`, `rollback` and `record-base` real `customized`, `conflict`, `removed` and `local` units: worktree creation under sk-git rules, the current-updater overlay, the four unit fixtures, the sk-code option choice, the Barter sk-git plan, commit requirements, `record-base` preconditions, and the apply/rollback reset recipe.

## Actions Taken
- Traced unit enumeration, file classification and unit-status aggregation in `release-update.cjs`; read base-evidence, record-base, prepare-writes, apply and rollback.
- Read the worktree naming allocator, the worktree lane decision matrix and the release-tag constants.
- Compared the `.0`/`.2` tag trees for `.skilled/commands/doctor`, `sk-code` and `sk-git` with read-only git tree/diff commands.
- Read the sk-code hub, mode registry and webflow packet to compare the two fixture options.

## Findings

### 1. The requested directory name is outside the sk-git worktree grammar; create it with the allocator

The naming contract fixes both names: `WORKTREE_BRANCH := "worktrees/" NNN "-" SLUG`, `WORKTREE_DIR := BASE "/" NNN "-" SLUG`, `BASE` defaulting to `.worktrees`, with `SLUG` lowercase `[a-z0-9-]` and no leading, trailing or double hyphen. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:5-17] The directory base resolves from `SPECKIT_WORKTREE_BASE`, then `speckit.worktreeBase`, then `<main-toplevel>/.worktrees`. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:57-84] `is_valid_branch` accepts only `main`, `skilled/vN.N.N.N`, the wrapper/backup lanes, and `worktrees|branches/NNN-slug`; `is_valid_pair` requires the directory basename to equal the branch tail. These validators are sourceable and the pre-push hook consumes them. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:108-124] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:185-202] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:33-34] So `.worktrees/.doctor-update-test-environment` is not a legal worktree name and cannot be produced by the allocator; the checkout must be `worktrees/{NNN}-doctor-update-test-environment` with directory `.worktrees/{NNN}-doctor-update-test-environment`.

The allocator's named lane is exactly the right one: `create_named_worktree <slug> [base]` allocates the number, creates the branch and directory together with `git worktree add -b`, and prints `<branch> <dir>`. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:395-421] The detached lane `create_detached_worktree` creates `{NNN}-detached-{slug}` with `--detach` and no branch. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:436-449] The reference decision matrix assigns detached to "quick throwaway experiment" and the numbered branch to long-running work kept across days. [SOURCE: .skilled/skills/sk-git/references/worktree-workflows.md:63] [SOURCE: .skilled/skills/sk-git/references/worktree-workflows.md:83] [SOURCE: .skilled/skills/sk-git/references/worktree-workflows.md:394]

A detached HEAD is wrong for this fixture: the overrides must be committed (finding 5) and `apply` refuses planned targets dirty against `HEAD`, while detached commits survive only while referenced. Use a local named branch and never push it. Suggested creation (in the fixture-build step, not in this research): from the main checkout,

```bash
bash .skilled/skills/sk-git/scripts/worktree-naming.sh create doctor-update-test-environment v4.0.0.0 --no-provision
# -> worktrees/{NNN}-doctor-update-test-environment .worktrees/{NNN}-doctor-update-test-environment
```

The base argument places the branch at the `v4.0.0.0` tag; `--no-provision` keeps the build cheap (the engine needs only git and Node). [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:398-420] `.worktrees/` is already gitignored, so the directory does not pollute the main checkout status. [SOURCE: .gitignore:282] If some external tool insists on the literal `.doctor-update-test-environment` path, add an untracked symlink to the numbered directory; the tracked worktree must remain the numbered one.

### 2. Overlay the current updater assets; the tags carry only the legacy updater

`COMMAND EVIDENCE`: `git ls-tree -r v4.0.0.0 -- .skilled/commands/doctor` and the same for `v4.0.0.2` list `assets/doctor-update.yaml` and no `doctor-update-check|align|apply|rollback|record-base.yaml`, no `scripts/release-update.cjs` and no `doctor-update-presentation.txt`. The current tree owns all of them. [SOURCE: .skilled/commands/doctor/update.md:26-31] The `.0` and `.2` doctor trees also carry retired assets (`doctor-embeddings.yaml`, `doctor-fable-mode.yaml`, `doctor-skill-advisor.yaml`, `doctor-skill-budget.yaml`, …) that the current tree does not. The fixture therefore overlays `update.md`, `_routes.yaml`, `assets/doctor-update-presentation.txt`, the five action YAMLs and `scripts/release-update.cjs` onto the tagged tree, exactly as the scenario contract needs; otherwise the actions under test do not exist.

The engine groups that overlay into one unit: `enumerateUnits` names every `.skilled/commands/<family>` tree `commands/<family>` with kind `command`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:545-548] The unit key is therefore `command:commands/doctor`, and it will appear locally changed because of the overlay. Keep it out of the update scopes while asserting skill-unit statuses (a scoped `check`/`align`/`apply` still reports it only if selected). [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:691-704]

### 3. Four statuses from real three-way comparisons

`classifyFile` compares base/local/release: identical local and release → `same`; local equal to base → `take-release`; release equal to base → `local-only`; local missing → `conflict` (`deleted-locally`); release missing → `conflict` (`deleted-in-release`); both differing → `conflict`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:670-689] `unitStatus` returns `blocked` when base evidence is `none`, `removed` when the base had files and the release has none, `current` when nothing changed, `conflict` if any conflict exists, `local` when every change is local-only, `customized` when some are local-only and others are not, `new` when nothing local remains and the release has files, and `update` when every change is take-release. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:949-963]

| Status | Fixture unit | Inputs and expected classification |
|---|---|---|
| `customized` | `skill:sk-code/sk-code-webflow` | `sk-code-webflow/SKILL.md` is identical between `v4.0.0.0` and `v4.0.0.2` (`COMMAND EVIDENCE`: `git diff --quiet v4.0.0.0 v4.0.0.2 -- .skilled/skills/sk-code/sk-code-webflow/SKILL.md` exits 0), while `changelog/v1.0.0.0.md` and `changelog/v1.1.0.0.md` changed in the release. Edit `SKILL.md` locally → `local-only`; leave the changelogs → `take-release`; some-but-not-all local-only → `customized`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:949-963] |
| `conflict` | `skill:sk-git` after the Barter replacement | Many sk-git paths changed between the tags (`graph-metadata.json`, `references/finish-workflows.md`, `scripts/worktree-naming.sh`, `scripts/worktree-provision-paths.txt`, `scripts/remote-branch-allowlist.txt`, `feature-catalog/feature-catalog.md`, changelogs; `COMMAND EVIDENCE`: `git diff --name-status v4.0.0.0 v4.0.0.2 -- .skilled/skills/sk-git`). Any locally differing file on one of those paths is a three-way conflict. The Barter snapshot is absent (`COMMAND EVIDENCE`: `ls barter/...` and `find . -maxdepth 3 -name 'barter*'` both empty), so exact overlap is UNKNOWN; make it deterministic by ensuring one release-changed path (recommended anchor: `references/finish-workflows.md`, appending a fixture marker when the Barter copy leaves it identical to `.0`). [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:670-689] |
| `removed` | `skill:sk-code/sk-code-obsidian`, removed by a local prerelease target | The stock tags remove no `.skilled` unit (`COMMAND EVIDENCE`: `git diff --name-status --diff-filter=D v4.0.0.0 v4.0.0.2 -- .skilled | grep SKILL.md` returns nothing under `.skilled`), so create one local fixture tag from `.2` whose tree deletes `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` (and its files). Base has files, release has none → `removed`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:949-955] |
| `local` | `skill:sk-code/sk-code-web-dev` | A new packet `derived from sk-code-webflow without Webflow references` contains only `SKILL.md` (plus optional references). It is absent from base and release, so `sameState(null, null)` is true and every file is `local-only` → unit `local`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:565-570] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:670-673] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:956-958] |

One discovery constraint: the local tree is built from `indexFiles` plus the release paths, so an untracked new packet is invisible to classification. `git add` (at minimum) the new `sk-code-web-dev` files. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:385-394]

The prerelease fixture tag must parse: stable tags match `^v\d+\.\d+\.\d+\.\d+$`, prereleases match the wider `VERSION_RE`, and `--include-prerelease` widens acceptance. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:21-22] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:257-267] Use a name such as `v4.0.0.3-fixture` pointing at a local commit, and select it only in the removed-unit scenario (`--release=v4.0.0.3-fixture --include-prerelease --offline`). Never push it.

### 4. sk-code: add the derived WebDev packet, do not strip modes

Option A, stripping every mode except `sk-code-opencode` and `sk-code-webflow` and then editing Webflow, changes the hub's declared two-axis contract (workflow axis `sk-code-quality`/`sk-code-review`, surface axis `sk-code-webflow`/`sk-code-opencode`/`sk-code-obsidian`). [SOURCE: .skilled/skills/sk-code/SKILL.md:13-17] [SOURCE: .skilled/skills/sk-code/SKILL.md:41-49] [SOURCE: .skilled/skills/sk-code/mode-registry.json:4-6] It deletes whole packets, so each deletion is classified per path: `sk-code-quality/SKILL.md` also changed in the release, so deleting it locally is a `conflict` (`deleted-locally`), while `sk-code-review` and `sk-code-obsidian` mix local deletions with release-changed changelog/script files (`COMMAND EVIDENCE`: the `.0`→`.2` name-status list includes `sk-code-quality/SKILL.md`, and sk-code-review/sk-code-obsidian changelogs and scripts). [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:670-689] To keep the hub coherent the operator must also edit `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json` and the compiled routing, which inflates the customization and risks breaking real routing while testing the updater. The side effect is noisy check output and a hub that no longer matches its own registry contract.

Option B, adding `sk-code-web-dev` derived from `sk-code-webflow` without Webflow references, creates exactly one new `skill` unit (`local`) with no hub edits: any nested `.skilled/skills/<hub>/<packet>/SKILL.md` root becomes its own skill unit. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:519-542] The existing modes stay intact; the packet is fixture-only and never merged. Cost is one small file plus registration-free discovery by the engine.

Recommendation: Option B. It is the lower-blast-radius option and produces the required `local` status without discarding the hub's workflow axis. Keep the packet minimal (SKILL.md with `packetKind: surface` frontmatter and fixture wording) because no repo-level hub validation runs against the local-only branch. If a second customized unit is ever wanted, editing `sk-code-webflow/SKILL.md` already provides it.

### 5. Overrides must be committed; `record-base` needs a clean, committed base manifest

`prepareWrites` rejects any planned target dirty against `HEAD` before previewing and re-checks after the lock is acquired; `dirtyTargetError` says a release record written by an earlier apply or `record-base` must be committed with the applied files before `apply` runs again. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1795-1801] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1909-1915] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2159-2163] `record-base` itself refuses when `BASE_FILE` (`.skilled/release/base.json`) has staged or unstaged changes against `HEAD`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2310-2314] So the fixture baseline — overrides, new packet, base manifest — must be committed on the local branch before an action runs. Uncommitted edits to tracked files are visible for classification (worktree bytes override index bytes), but any path `apply` would write must be clean, so committing is the documented baseline, not a stylistic choice. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:385-394]

`record-base` records every unit of the named release as `{release, tree}` fingerprints into `.skilled/release/base.json`, resolves the tag locally, and refuses a named release that is not the nearest unless `--trust-release` is passed; with `--offline` no remote listing is possible, so `--trust-release` is required and the result reports `verified: false`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2257-2308] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2354-2361] `BASE_FILE` is `.skilled/release/base.json`, `DIVERGENCE_FILE` is `.skilled/release/divergence.json`, and run state lives under `.skilled/release/runs/` (ignored). [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:23-27] [SOURCE: .skilled/release/.gitignore:1-2]

Base evidence order is recorded base → newest release tag in `HEAD` ancestry → nearest tag by unit distance (which may fetch). [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:836-879] A branch created from `v4.0.0.0` already has that tag in ancestry, so classification works before `record-base`; recording is still the action to exercise and is required to model a copied/fresh install. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2254-2256]

Suggested sequence (fixture build):

```bash
node .skilled/commands/doctor/scripts/release-update.cjs record-base --repo . --release=v4.0.0.0 --offline --trust-release --dry-run --json
node .skilled/commands/doctor/scripts/release-update.cjs record-base --repo . --release=v4.0.0.0 --offline --trust-release --json
git add .skilled/release/base.json && git commit -m "fixture: record base"
```

Offline `check` still reports unit classifications while the overall upstream status is `unknown`; assert unit rows, not a global freshness verdict. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:781-793]

### 6. Apply and rollback reset the environment, and how to reuse it

`align` writes its plan and decisions into `.skilled/release/runs/<tag>-<stamp>/`, a gitignored run directory. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1231-1237] `apply` refuses a run that already has `rollback.json`, refuses an existing lock, re-verifies plan freshness and dirty targets, writes `rollback.json` (schema with per-path `before`/`after`) before the first mutation, then writes each file atomically. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2095-2101] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2113-2123] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2157-2184] `rollback` restores a path to `before` when the current state equals `after`, deletes it when `before` is null, records skipped paths (exit 1 when any are skipped), prevents restoring anything outside the plan's units or the two release records, and clears its lock. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2365-2439] The release records are part of the rollback path set, so the base and divergence files are restored too. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2375-2384]

Reset recipe after any `apply`:

1. `/doctor:update rollback --run=<runDir> --dry-run` and confirm every path is `restored`, none `skipped`.
2. `/doctor:update rollback --run=<runDir>`; a non-empty skipped list is exit 1 and the environment is not back to baseline.
3. `git status --porcelain` must show no tracked change beyond the committed fixture baseline (ignored run dirs may remain).
4. Do not re-apply the same run: `rollback.json` now exists and `apply` refuses it; run `align` again for a new plan. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2095-2097]
5. If a lock is stale, `rollback` clears it; the engine also exposes an `unlock` subcommand. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:41] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1976-1982]

Because rollback restores the committed fixture content, no `git reset`/`checkout` is needed for reuse; the fixture commits stay. Deleting the ignored run directory resets decisions without touching tracked state.

### 7. Barter sk-git replacement plan (UNKNOWN overlap)

The path `barter/ai-speckit/coder-backup/ai-speckit-main/coder/.opencode/skills/sk-git` is absent from this checkout (`COMMAND EVIDENCE`: `ls` and `find` both report nothing), so its exact 10 files and their base/release overlap are UNKNOWN. Plan, to be confirmed when the snapshot is supplied: in the fixture branch, replace `.skilled/skills/sk-git/` content with the Barter 10-file tree (the current tree has 147 files, so this is a deliberate, large local customization of one scoped unit), `git add -A -- .skilled/skills/sk-git`, and commit. Then confirm at least one three-way conflict exists: choose a release-changed path such as `references/finish-workflows.md` or `scripts/worktree-naming.sh` and, if the Barter copy matches `.0` byte-for-byte, append a fixture marker so local differs from both base and release; that makes the unit status `conflict` under `unitStatus`. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:949-963] Ordering note: create the fixture worktree before this replacement, or invoke the allocator from the main checkout by absolute path, because the replacement removes the fixture's own `worktree-naming.sh`. Never push the branch; the Barter tree is local test data.

### 8. Token-cost controls for building and using the environment

- `--no-provision` at creation; the updater engine needs Node and git, not installed dependencies. If a later scenario needs a runtime, provision only then.
- Keep the scoped unit set to four skill units and always pass `--scope`; the `command:commands/doctor` overlay unit is noise for assertions. [SOURCE: .skilled/commands/doctor/update.md:43]
- Record the base once (dry-run first), then commit; keep every scenario to `--dry-run` before its real action; use `--json` and `--offline`.
- Do not run the doctor workflows themselves during fixture construction; run only the engine actions the scenario asserts.

## Questions Answered
- q3: How to build and reset a long-lived `/doctor:update` environment that exercises all four unit statuses across the five actions.

## Questions Remaining
- q4: Which other doctor commands reuse it, and the exact per-file playbook change list plus new scenarios.

## Next Focus
Iteration 3: map every doctor-command scenario in the five playbooks, decide reuse per command, enumerate the exact files to edit and the new scenarios, then write the ordered implementation plan.

## Sources Consulted
- `.skilled/commands/doctor/scripts/release-update.cjs` (constants, enumeration, classification, base, report, record-base, apply, rollback)
- `.skilled/commands/doctor/update.md`, `.skilled/commands/doctor/_routes.yaml`
- `.skilled/skills/sk-git/scripts/worktree-naming.sh`, `.skilled/skills/sk-git/references/worktree-workflows.md`, `.gitignore:282`, `.skilled/release/.gitignore`
- `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/mode-registry.json`
- Read-only Git tree/diff/tag commands against `v4.0.0.0` and `v4.0.0.2`
- `.skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md`

## Assessment
The fixture design is grounded in the engine's own classification and mutation rules. The only UNKNOWN is the Barter file list; the conflict anchor is designed to stay deterministic regardless of its contents. No fixture was created and no repository file was changed.

## Reflection
The two hard constraints that shape the fixture are commits: classification enumerates from the index, and `apply` refuses dirty targets, so a committed baseline is the only stable state. Rollback is the reset mechanism because it restores tracked bytes and the release records, leaving the fixture commits untouched.

## SCOPE VIOLATIONS
None. All Git commands used by this iteration were read-only (`ls-tree`, `diff`, `rev-parse`); no checkout, tag creation or commit was performed.
