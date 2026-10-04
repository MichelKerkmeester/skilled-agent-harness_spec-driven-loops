# Doctor contract gaps and long-lived doctor test environments

Merged synthesis of two lineages: `deepseek-v4-1-flash-cline` (3 iterations, cli-pi through Cline, thinking `xhigh`) and `luna-6-max-fast` (2 iterations, cli-codex `gpt-6-luna`, effort `max`, fast tier). Lineage reports: `lineages/deepseek-v4-1-flash-cline/research.md`, `lineages/luna-6-max-fast/research.md`. Attribution: `fanout-attribution.md`. Resource map: `resource-map.md`.

## 1. Executive summary

Both lineages reached the same answers on the three questions, and the orchestrator re-checked the load-bearing claims against the source (section 9).

- `/doctor:speckit` should report phrase quality as an advisory outside `severity_max`, so a fresh index reports OK. No threshold, no bulk clean-up, no generator filter.
- `/doctor:mcp` needs an `unknown_flag` error beside the existing cross-sub-action error.
- `/doctor:update` gets a long-lived local worktree from `v4.0.0.0`, with the current updater overlaid and four committed fixtures that produce `customized`, `conflict`, `removed` and `local` units. For sk-code, add a derived `sk-code-web-dev` packet rather than stripping modes.
- The other doctor suites gain from a long-lived environment too, but not this one: they test current code, and the updater fixture deliberately replaces sk-git and sits on an old release.

## 2. `/doctor:speckit`: phrase quality becomes advisory

**Today.** `corpus_pollution` is a medium staleness signal that fires on any non-zero class in the `phraseQuality` bucket. It feeds `staleness_classes` and `severity_max`, and only "no staleness" yields OK. [SOURCE: `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:135-137,191-215`] The committed corpus carries 251 flagged phrases of 33,719 (about 0.74%). [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json:32-51`]

**The stated rationale is wrong.** Phase 2 says the phrases "never rank". `scorePhrase` returns 1 for an exact match before its two-token floor, then scores containment (0.94, 0.88) and token overlap at 0.8 coverage or above. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs:129-151`] The lookup keeps each document's best phrase and never reads `phraseQuality`. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:160-211`] The generator counts the classes and removes nothing. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:253-296`]

**Decision.**
- Remove `corpus_pollution` from `staleness_signals`, `staleness_classes` and `severity_max`.
- Report every non-zero class, with its phrase count, document count and share, in a `quality_advisories` block.
- Only freshness evidence decides the status.

**Secondary gap.** The YAML status lists are `OK|DEGRADED|STALE|MISSING` (phase 2) and `OK|DEGRADED|STALE|MISSING|FAIL|CANCELLED` (state log), while the presentation renders `OK|STALE|MISSING|ATTENTION|CANCELLED|FAIL`. [SOURCE: `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:217,252`] [SOURCE: `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt:70`] Align the YAML on the presentation vocabulary.

**Scenarios and tests.**
- DOC-349: expect OK on a fresh index, with the advisory visible.
- DOC-350: stays stale because of `index_content_stale`, and the advisory adds no severity.
- The generator's phrase-quality tests stay unchanged. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:562-592`]
- Add doctor-level coverage for two cases: fresh index plus non-zero classes gives OK, and stale index plus non-zero classes gives STALE from freshness alone.

## 3. `/doctor:mcp`: the unknown-flag error

The router parses flags against the selected sub-action's schema and rejects only cross-sub-action flags. The presentation defines the unknown-sub-action error and both cross-sub-action errors, but no unknown-flag error. [SOURCE: `.skilled/commands/doctor/mcp.md:42-65`] [SOURCE: `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt:22-45`]

**Design.**
- A flag in neither schema is refused before YAML load with `STATUS=FAIL ERROR="unknown_flag"`. The message names the flag and the sub-action, and lists that sub-action's valid flags: `--runtime <name>` for install, `--fix` for debug.
- A flag known to the other sub-action keeps `cross_sub_action_flag_injection`.

Every sibling doctor router already refuses unknown arguments. [SOURCE: `.skilled/commands/doctor/git.md:43`] [SOURCE: `.skilled/commands/doctor/skill-advisor.md:44`] [SOURCE: `.skilled/commands/doctor/speckit.md:64`] [SOURCE: `.skilled/commands/doctor/env.md:30`] [SOURCE: `.skilled/commands/doctor/runtime-mirrors.md:33`] [SOURCE: `.skilled/commands/doctor/deep-loop.md:33`] [SOURCE: `.skilled/commands/doctor/update.md:44`]

A new scenario covers `install --server` and an unknown flag on `debug`.

## 4. The `/doctor:update` test environment

**Base and overlay.** `v4.0.0.0` and `v4.0.0.2` both carry only the legacy `doctor-update.yaml`, with no `release-update.cjs` and no action YAMLs (verified with `git ls-tree`). Base the worktree on `v4.0.0.0`, and overlay the current `update.md`, `_routes.yaml`, `doctor-update-presentation.txt`, `scripts/release-update.cjs` and the five `doctor-update-*.yaml` files. The engine groups `.skilled/commands/doctor/**` into one `command:commands/doctor` unit, so scenarios always pass `--scope` with the fixture units only. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:509-550`]

**Fixture units.** `classifyFile` and `unitStatus` drive the classification. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:670-689,949-963`]

| Status | Unit | How |
|---|---|---|
| `customized` | `skill:sk-code/sk-code-webflow` | Edit `SKILL.md`, which is identical in `.0` and `.2`, while its changelogs change in the release |
| `conflict` | `skill:sk-git` | Replace it with the 10-file Barter sk-git, and make sure one path changed between `.0` and `.2` also differs locally (anchor: `references/finish-workflows.md`) |
| `removed` | `skill:sk-code/sk-code-obsidian` | A local prerelease tag `v4.0.0.3-fixture` cut from `.2` with that packet deleted, selected with `--include-prerelease` |
| `local` | `skill:sk-code/sk-code-web-dev` | A new packet derived from `sk-code-webflow` without Webflow references |

**sk-code choice.** Add the derived `sk-code-web-dev` packet. Stripping every mode except opencode and webflow would rewrite the hub's registry, router and leaf manifest. It would also classify unevenly: deleting `sk-code-quality/SKILL.md`, which the release changed, becomes a `deleted-locally` conflict. [SOURCE: `.skilled/skills/sk-code/SKILL.md:13-17`] [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:519-542`]

**Commits.** Every override must be committed:
- Local enumeration starts from the git index, so an untracked file is invisible. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:385-394`]
- `apply` refuses a planned target that is dirty against `HEAD`. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2158-2163`]
- `record-base` refuses a dirty `.skilled/release/base.json`. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2310-2314`]

**record-base.** Run `--release=v4.0.0.0 --offline --trust-release`, which yields `verified: false`, then commit `base.json`. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2257-2361`] Offline `check` reports overall upstream status as `unknown` but still classifies units, so scenarios assert the unit rows. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:781-793`]

**Reset.** After `apply`, run `rollback --run=<runDir>`. It must report every written path restored, `skipped` empty and the lock gone, after which `git status --porcelain` matches the committed fixture. Never re-apply a run. Run `align` again instead. [SOURCE: `.skilled/commands/doctor/scripts/release-update.cjs:2095-2101,2365-2439`]

## 5. Worktree creation under the sk-git rules

The allocator produces `worktrees/{NNN}-{slug}` branches in matching `.worktrees/{NNN}-{slug}` directories, and its validators reject other names. [SOURCE: `.skilled/skills/sk-git/scripts/worktree-naming.sh:5-17,108-124,395-421`] The detached lane is for throwaway experiments, and a fixture that needs commits belongs on a branch. [SOURCE: `.skilled/skills/sk-git/references/worktree-workflows.md:63,83,394`] The requested `.worktrees/.doctor-update-test-environment` name is therefore outside the grammar. Both lineages recommend `worktree-naming.sh create doctor-update-test-environment v4.0.0.0 --no-provision`, kept local, with an untracked symlink carrying the requested name if a recognizable path is wanted. This is an operator decision, recorded in section 11.

## 6. Which other doctor suites gain from a long-lived environment

| Command | Fits the updater fixture? | Fits a current-code environment? | Notes |
|---|---|---|---|
| `/doctor:update` | Yes (owner) | No | DOC-357 to DOC-361 |
| `/doctor:speckit` | No | Yes | DOC-349, DOC-350 need the current index and corpus |
| `/doctor:runtime-mirrors` | No | Yes | DOC-352, DOC-353 |
| `/doctor:skill-advisor` | No | Yes | DOC-348, DOC-362, DOC-363, DOC-366 need the current runtime |
| `/doctor:env` | No | Yes | DOC-354 to DOC-356 |
| `/doctor:mcp` | No | Yes | DOC-375 to DOC-377 need the current mcp-server build |
| `/doctor:git` | No: the Barter sk-git replaces the templates `standards` copies | Yes, for standards | DOC-371 to DOC-373. DOC-370 stays on a disposable clone: a linked worktree shares the main checkout's `.git/config`, so `git config --local` would change the real repository (verified: `git rev-parse --git-path config` returns the main checkout's `.git/config`) |
| `/doctor:deep-loop` | No | DOC-368 only | DOC-331 to DOC-333 need empty or seeded graph states that a shared tree cannot hold at once |

LUNA proposed moving all 27 stateful scenarios onto the updater fixture. DeepSeek scoped them by fit and flagged the split. The orchestrator sides with the split: the non-update suites test current code, and the updater fixture sits on `v4.0.0.0` with sk-git replaced.

Already copy-free, no change: DOC-351, DOC-364, DOC-365, DOC-367, DOC-369, DOC-374, DOC-378.

## 7. Scenario changes

**Update:**
- system-spec-kit: DOC-349 to DOC-361 except DOC-351 (12 files), plus the README.
- system-skill-advisor: DOC-348, DOC-362, DOC-363, DOC-366.
- system-deep-loop: DOC-368, plus the README.
- sk-git: DOC-371, DOC-372, DOC-373, plus the README, which names the DOC-370 clone exception.
- mcp-code-mode: DOC-375, DOC-376, DOC-377, plus the README.

**Create:**
- DOC-379 `doctor-update-test-environment.md` (system-spec-kit): build, verify and reset the updater fixture.
- DOC-380 `doctor-mcp-unknown-flag.md` (mcp-code-mode).

DOC-378 is the last ID in use.

## 8. Eliminated alternatives

| Alternative | Why rejected |
|---|---|
| A phrase-share threshold for `corpus_pollution` | An arbitrary constant with no retrieval-precision evidence |
| Bulk corpus clean-up or a generator filter | Changes lookup results to turn a report green, and a real corpus always regrows flagged phrases |
| Stripping sk-code to opencode and webflow | Rewrites the hub contract and classifies unevenly |
| A detached HEAD for the fixture | The fixture needs commits, and the detached lane is for throwaway experiments |
| Running `/doctor:git hooks` scenarios in a linked worktree | `git config --local` reaches the main checkout's config |
| Uncommitted overrides | Invisible to enumeration (new files) and refused by `apply` (dirty targets) |

## 9. Orchestrator verification

| Claim | Check | Result |
|---|---|---|
| Linked worktrees share `.git/config` | `git rev-parse --git-path config` in a linked worktree | Returns the main checkout's `.git/config`, with `extensions.worktreeConfig` unset |
| Enumeration starts from the index | Read `release-update.cjs:385-394` | Confirmed |
| `apply` refuses dirty targets | Read `release-update.cjs:2158-2163` | Confirmed |
| Status lists disagree | `grep` of the retrieval YAML and presentation | Confirmed at `:217`, `:252` and presentation `:70` |
| Scorer behavior | Read `normalize.mjs:129-151` | Confirmed |
| Old tags carry the legacy updater | `git ls-tree -r v4.0.0.0 -- .skilled/commands/doctor` | Confirmed, only `doctor-update.yaml` |
| Barter sk-git exists | `find` in the main checkout | Present, 10 files. Both lineages reported it absent because `barter/` lives only in the main checkout, outside the research worktree |

## 10. Divergence map

- **Agreed:** the speckit fix, the mcp error design, the `v4.0.0.0` base with the updater overlay, the four fixture units, the sk-code choice, the commit requirement and the reset recipe.
- **Diverged:** the scope of reuse. LUNA proposed 27 scenarios on the one fixture, while DeepSeek scoped by fit and named a two-environment split. Only DeepSeek found the status-list mismatch and the DOC-370 config sharing.
- **Not pursued:** automated scenario runs and a run lock for the shared environment (DeepSeek, limits).
- **Process issue:** the DeepSeek lineage wrote state-log timestamps after its run window (runner `timestamp_anomalies`, 4 of 5 records). Its findings are unaffected, but those timestamps are not trustworthy.

## 11. Open questions for the operator

1. Worktree naming: an allocator-numbered branch and directory plus a `.doctor-update-test-environment` symlink, or the exact requested name outside the sk-git grammar.
2. Whether the non-update suites get their own long-lived current-code environment, or keep disposable copies.

## 12. Ordered implementation plan

1. Fix `/doctor:speckit`: advisory block, status-list alignment, DOC-349, DOC-350 and doctor-level tests.
2. Fix `/doctor:mcp`: the `unknown_flag` error and DOC-380.
3. Create the updater worktree from `v4.0.0.0`, overlay the current updater, commit.
4. Build and commit the four fixtures, cut the local `v4.0.0.3-fixture` tag, then run `record-base` and commit `base.json`.
5. Verify with a scoped offline `check` that the four units classify as designed.
6. Create the current-code environment if the operator chooses it.
7. Update the scenarios and READMEs in section 7, and create DOC-379.
8. Run the update lifecycle once (check, align, apply, rollback) and confirm a clean reset. Never push the fixture branch or tag.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5 (DeepSeek 3, LUNA 2)
- Questions answered: 4 / 4 in both lineages
- Remaining questions: none from research. Two operator decisions in section 11.
- Convergence threshold: 0.05, telemetry only under `stopPolicy: max-iterations`
- Lineage history: the first DeepSeek attempt on opencode-go failed six times with `This Go model requires Global regions` (a workspace privacy setting), so it was rerun on Cline at `xhigh`. The failed lineage folder is kept outside the packet as evidence.
