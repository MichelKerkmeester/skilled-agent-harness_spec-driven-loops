---
title: "Deep Research: what the v4.0.0.3 changelog still needs"
description: "Synthesis of three deep-research iterations on the v4.0.0.3 release notes. The entry has no doctor coverage, misses three git hook fixes and the commit-body rule, and states one hook trust rule too absolutely."
trigger_phrases:
  - "v4.0.0.3 changelog gaps"
  - "doctor changelog research"
  - "git hook changelog coverage"
importance_tier: important
contextType: research
---

# Deep Research: what the v4.0.0.3 changelog still needs

<!-- ANCHOR:deep-research-v4003-changelog-gaps -->

## 1. EXECUTIVE OVERVIEW

`.skilled/changelog/skilled/v4.0.0.3.md` was last edited on 2026-10-02. The newest tag is still `v4.0.0.2`, so the entry is unreleased and is the one to extend. Everything below is on `origin/main`.

- **The entry never mentions the doctor commands.** `rg -ci doctor` on the entry returns 0. Against the `v4.0.0.2` tag, the doctor surface changed for every user. `/doctor:speckit` went from a ten-target router to a retrieval check. `/doctor:update` went from a database rebuild to a release updater. Five commands are new.
- **Git hooks: three fixes and one rule are missing.** The trust rule for other repositories, the unreadable-staged-file block and the saved gate settings are absent. So is the commit-body rule from `f8e2b51aa19`. That commit landed after the `v4.0.0.2` tag and is in neither entry.
- **One sentence is too absolute.** Line 88 says another repository "never runs its own code at commit time". A repository that sets `skilled.trustRepoHooks=true` does.
- **One loop proposal was corrected.** The loop drafted an upgrade note saying `/doctor:rebuild` is gone. `/doctor:rebuild` existed only from 2026-10-02 to 2026-10-04 and never shipped in a tag. So the upgrade notes must start from what a `v4.0.0.2` user had.
- **The glance list is already over its limit.** It has 16 bullets against a ceiling of 12, so new bullets need merges.

## 2. BACKGROUND & CONTEXT

The operator asked what v4.0.0.3 must add about the doctor command changes and the git workflow and hook changes, including the hook hardening in `specs/sk-git/032-template-driven-message-enforcement`. The run was research only and did not edit the changelog. Before work began, the entry's spec line named three packets: `sk-communication/007`, `sk-git/032` and `system-deep-loop/039`.

## 3. RESEARCH QUESTIONS

- Q1: Which doctor command changes alter what an operator runs or sees, and which does the entry mention? Answered.
- Q2: What does the entry need about saved hook gate settings, `/doctor:git` and `.sk-git/` overrides? Answered.
- Q3: Which `sk-git/032` hook fixes does Repository Checks cover, and which are missing? Answered.
- Q4: Which statements did later work make wrong or stale, and what must Upgrade Notes add? Answered, with one correction from the verification pass.

## 4. METHODOLOGY

There were three iterations on DeepSeek V4.1 Flash (`opencode-go/deepseek-v4.1-flash`, maximum reasoning) through the `cli-pi` single-executor path. Each passed `verify-iteration.cjs` on its first attempt. The loop manager then checked each load-bearing claim against the repository. It ran `git log` and `git show` on every cited commit, `git merge-base --is-ancestor` against `origin/main`, and compared the doctor tree at the `v4.0.0.2` tag with today's. It also read `gates.tsv`, `ENV-REFERENCE.md` section 5, the hook README and the changelog skill's checklist. Items marked **manager addition** came from that pass, not from an iteration.

## 5. KEY FINDINGS SUMMARY

| # | Finding | Kind | Evidence |
|---|---|---|---|
| 1 | No doctor coverage at all | Missing | Entry has 0 matches for `doctor`; doctor tree at `v4.0.0.2` vs `origin/main` |
| 2 | `/doctor:update` changed meaning from database rebuild to release updater | Missing, breaking | `git show v4.0.0.2:.skilled/commands/doctor/update.md`; `8215a33a7b4`, `b8534575978` |
| 3 | `/doctor:speckit` targets moved to owner commands; embeddings and fable-mode removed | Missing, breaking | `v4.0.0.2` `_routes.yaml` (10 targets); `144e66669c0`, `46ecac338c` |
| 4 | New `/doctor:env`, `/doctor:git`, `/doctor:skill-advisor`, `/doctor:deep-loop`, `/doctor:runtime-mirrors` | Missing | `6cd0da3618d`, `e3626413cd`, `46ecac338c` |
| 5 | `/doctor:mcp` narrowed to Code Mode; `--server` gone | Missing | `6cd0da3618d`; `v4.0.0.2` vs current `mcp.md` argument hint |
| 6 | Saved hook gate settings through `speckit.hooks.<key>` | Missing | `e3626413cd`, `lib/gates.tsv`, `lib/gate-config.sh` |
| 7 | Line 88 overstates the trust rule | Wrong | `.skilled/scripts/git-hooks/README.md` line 32, `pre-commit` line 44, `e5b1ea84c7` |
| 8 | Unreadable staged file now blocks | Missing | `9c99983374` |
| 9 | Every authored commit needs a body | Missing, breaking (**manager addition**) | `f8e2b51aa19` |
| 10 | Message cleanup follows `commit.cleanup`; rebased copies keep their Commit-Id | Missing (**manager addition**) | `7c56a545ac2` |
| 11 | Glance list at 16 of a 12-bullet ceiling | Pre-existing breach | `sk-create-changelog/SKILL.md` checklist step 9 |
| 12 | `/doctor:rebuild` never shipped, so no note should repoint from it | Correction to iteration 3 (**manager addition**) | `b0be233a6b9` (2026-10-02) created it, `46ecac338c` (2026-10-04) deleted it; `v4.0.0.2` has no `rebuild.md` |

## 6. FINDINGS: Q1 DOCTOR COMMAND CHANGES

These are compared against what a `v4.0.0.2` user had: `/doctor:speckit <target>` with ten targets, `/doctor:update` as the database rebuild, and `/doctor:mcp <install|debug> [--server] [--runtime] [--fix]`.

- **Each owner has its own command.** `/doctor:speckit` now checks retrieval only: the trigger index, its lookup and the ripgrep recipes. Given an old target name, it prints a moved-target notice. `/doctor:skill-advisor` takes `tune`, `rebuild`, `skill-graph-freshness`, `router-reach`, `skill-budget` and `parent-skill`. `/doctor:deep-loop` and `/doctor:runtime-mirrors` each run one workflow. The embeddings target is retired and fable-mode is deleted. Source: `46ecac338c`, `144e66669c0`, `.skilled/commands/doctor/speckit.md` line 35.
- **`/doctor:update` is a release updater.** It takes `check`, `align`, `apply`, `rollback` and `record-base`. It compares the checkout with a release, updates units the operator has not customized, and proposes alignment for ones they have. Its old rebuild flags are gone (`--force`, `--no-snapshot`, `--cleanup-legacy`, `--migrate`, `--keep-snapshots`, `--resume-bootstrap`). Safety features shipped in phases 002, 005 and 006:
  - `apply` changes only fully decided units and records `plan.json` and `rollback.json`.
  - `apply` is bound to the plan the operator approved.
  - A stranded lock can be recovered with `unlock`.
  - Copied and vendored trees work, with `--trust-release`.
  - `record-base` writes `.skilled/release/base.json`.
  - `--include-prerelease` compares against pre-releases.

  Source: `8215a33a7b4`, `b8534575978`, `eb315be211`, `eaa4b79d26`, `b4e02411d3`, `f67263c396`, and `.skilled/commands/doctor/scripts/release-update.cjs`, which carries each named flag and file.
- **The advisor graph rebuild moved to the advisor.** `/doctor:skill-advisor rebuild` backs up `skill-graph.sqlite`, rebuilds and validates it, and restores the backup if any step fails. The trigger index is regenerated by `generate-trigger-index.mjs` directly. Source: `008-doctor-ownership-split/implementation-summary.md` lines 57 and 60.
- **`/doctor:env` is new.** It reads the switch list from `ENV-REFERENCE.md` at every run and shows where each switch is set without revealing secret values. It saves an eligible preference only after showing the exact line and getting a yes. Source: `6cd0da3618d`.
- **`/doctor:mcp` sets up and diagnoses only Code Mode**, its `.utcp_config.json` and runtime registration. The `--server` option is gone. Source: `6cd0da3618d`, `.skilled/commands/doctor/mcp.md`.
- **The retrieval doctor judges index staleness by content.** Its first phase runs `generate-trigger-index.mjs --check --json` as the verdict, and a file's age is only supporting evidence. Source: `001-trigger-index-freshness/implementation-summary.md`.
- **Doctor routers that need a target stop and ask.** `/doctor:skill-advisor`, `/doctor:mcp` and `/doctor:git` show their menu and wait when no target is given. They never infer one from the conversation or the repository. Source: `f4485249ed`, `01b89a78c6`.
- **Doctor checks fail on real drift**, which matters to maintainers. Scripts that reported PASS on drift now fail, and CI runs the doctor test suite through `.skilled/commands/doctor/scripts/tests/run-all.sh`, wired at `.github/workflows/spec-kit-check.yml` line 196. Source: `cc2d4ea5f2`.
- **Likely omit.** The speckit command-contract fix (`119c4ffb07`) changes the router generator's contract, not what a user runs.

## 7. FINDINGS: Q2 SAVED HOOK GATES, `/doctor:git` AND `.sk-git/`

- **A gate switch can stay off without a prefix on every command.** Setting `speckit.hooks.<key>` to `off`, `false`, `no` or `0` in local or global git config switches that gate off for each run and prints one line naming the setting. A `git -c` flag or a `GIT_CONFIG_*` variable does not count, and only a trusted toolchain repository reads settings. Source: `e3626413cd`, `lib/gate-config.sh`, `.skilled/scripts/git-hooks/README.md` line 30.
- **Use the right counts.** `gates.tsv` has 12 rows: ten `SPECKIT_SKIP_*` gates that can be saved, and the two `SPECKIT_ALLOW_*` per-push approvals, which cannot. `ENV-REFERENCE.md` section 5 has 14 rows: those 12 plus `SPECKIT_COMMIT_SPEC` and `SPECKIT_MASS_DELETION_THRESHOLD`, which are not gates. Changelog-safe wording: "ten gate switches can be saved; the two per-push approvals stay one-command variables." Source: `lib/gates.tsv`, `ENV-REFERENCE.md` lines 213-234.
- **`/doctor:git hooks`** lists each gate with its local, global and effective value and the hook install state. It changes one gate after showing the exact `git config` command and getting approval.
- **`/doctor:git standards`** works on the sk-git message templates:
  - It copies the shipped templates into `.sk-git/` once and never overwrites them.
  - It changes or removes one rules-block setting, or removes a kind's whole rules section.
  - It rechecks each change with sk-git's own shape check and refuses one the gates would reject.
  - It reports template prose that still states the old rule.

  `--dry-run` writes nothing. Source: `e3626413cd`, `.skilled/commands/doctor/git.md`.
- **`commit-msg` has no off switch.** Its rules change through `standards`, and removing a kind's section turns that kind off. Source: `009-doctor-git/implementation-summary.md`, Key Decisions.

## 8. FINDINGS: Q3 THE `sk-git/032` HOOK HARDENING

| Commit | What shipped | Entry today |
|---|---|---|
| `f7316afc6a` | A linked worktree runs its own validator | Covered, "Worktrees Use Their Own Validator" |
| `e5b1ea84c7` | Another repository runs its own hook scripts only with local `skilled.trustRepoHooks=true`. Pre-push checks only the commits a push adds. A crashed checker blocks and is reported apart from a rule failure. Each cherry-pick gets a fresh Commit-Id. `prepare-commit-msg` removes only attribution trailers and says what it removed | One sentence, stated too absolutely (see Q4). The other fixes are absent |
| `9c99983374` | A staged file git cannot read now blocks, a submodule entry is skipped, and the temp directory is removed on every exit | Absent |
| `d1fe481584` | The environment reference lists every git-hook switch, and the hook READMEs describe the hooks as they run | Absent. This is docs only, so one clause at most |
| `7c56a545ac2` (**manager addition**) | Comment lines are stripped only when git will, following `commit.cleanup`. A rebased copy is no longer a Commit-Id collision with its original. `skgit.contractDir` is read from every scope except the command line | Absent |
| `f8e2b51aa19` (**manager addition**, `sk-git/030`) | Every authored commit needs a prose body. Trailers alone do not count. Merge, Revert, `fixup!`, `squash!` and `amend!` subjects are exempt | Absent from v4.0.0.3, and from v4.0.0.2, whose tag was cut before it |

Already covered, no action: `38b21354722`, `61e0054010a`, `0b2730da909`, `ecf2897455b`, `82701008733` and `502e06659ca`.

## 9. FINDINGS: Q4 WRONG, STALE AND UPGRADE NOTES

- **Correct line 88.** "Any other repository still never runs its own code at commit time" ignores the opt-in. Suggested: "Any other repository runs none of its own hook scripts unless its local git config sets `skilled.trustRepoHooks=true`."
- **No stale doctor names exist.** The entry never names a doctor command, so nothing needs removing. New text must use today's names.
- **Upgrade Notes, corrected draft.**
  - **Repoint doctor targets.** `/doctor:speckit` now checks retrieval only. Run the advisor targets through `/doctor:skill-advisor`, and use `/doctor:deep-loop` and `/doctor:runtime-mirrors` for those checks. The embeddings and fable-mode targets are gone.
  - **Expect `/doctor:update` to update releases.** It no longer rebuilds databases, and its rebuild flags are gone. Rebuild the advisor graph with `/doctor:skill-advisor rebuild`.
  - **Drop `--server` from `/doctor:mcp`.** It now covers Code Mode only.
  - **Save hook switches in git config.** Set `speckit.hooks.<key>` to `off`, or use `/doctor:git hooks`.
  - **Write a body on every commit.** A subject with trailers alone is refused.
  - **Trust another repository's hooks explicitly.** Run `git config --local skilled.trustRepoHooks true` in it.
- **Header.** Add the doctor and hook theme to the title, description and opening paragraph. The description must stay within its 250-character guard. Add `specs/system-speckit/048-doctor-command-audit`, `specs/system-speckit/049-doctor-audit-followups` and `specs/sk-git/030-commit-body-always-required` to the spec line.
- **Glance list.** Merge to at most 12 bullets while adding the doctor bullets. The Jev hub and Pi transport bullets (lines 36-37) and the two plain-language bullets (lines 43-44) merge without losing a fact.

## 10. FINDINGS: PLACEMENT

Iteration 3 proposed a `## Doctor Commands` H2 between Repository Checks and Classifier and Model Routing, with benefit-led H4 items:

1. One command per owner.
2. A release updater.
3. Environment setup.
4. Saved hook gates and `/doctor:git`.
5. Retrieval staleness.
6. Routers that ask instead of guess.

The hook fixes stay in Repository Checks as new H4 items after the worktree paragraph. The `--scoring-only` paragraph (lines 134-136) stays as it is: it shipped in `specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes`, not in the doctor work. Per the changelog skill's omission rule, leave out test counts, index document counts and phase or commit ids.

## 11. RECOMMENDATIONS

1. Add the `## Doctor Commands` section and the doctor glance bullets, keyed to the `v4.0.0.2` baseline.
2. Correct line 88, and add H4 items for the unreadable-file block, the commit-body rule and the message-cleanup fixes.
3. Replace iteration 3's `/doctor:rebuild` upgrade line with the corrected draft in section 9.
4. Merge the glance list to 12 or fewer bullets.
5. Extend the header spec line and the title, description and trigger phrases.

## ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| An upgrade note repointing users from `/doctor:rebuild` | It never shipped in a tag. It lived from 2026-10-02 to 2026-10-04 | `b0be233a6b9`, `46ecac338c`, `git ls-tree v4.0.0.2 .skilled/commands/doctor/` | 3 (corrected in verification) |
| Quoting "14 gates" or "12 hook variables" | The two counts describe different sets | `gates.tsv`, `ENV-REFERENCE.md` section 5 | 2, 3 |
| Crediting `--scoring-only` to the doctor work | It shipped in `cli-jev/003/010` | its `spec.md` REQ-006 | 2, 3 |
| Appending doctor bullets to the 16 existing ones | That breaks the 12-bullet ceiling further | `sk-create-changelog/SKILL.md` checklist step 9 | 3 |
| Per-sentence origin notes inside paragraphs | House style keeps one spec pointer in the header | changelog template section 3 | 3 |
| Listing the speckit command-contract fix as a user change | It changes a generator contract, not a command's behavior | `119c4ffb07` | 1, 3 |

## DIVERGENCE MAP

- Saturated directions: none recorded.
- Pivots taken: none. Convergence mode was `default`.
- Pivot failures and audited overrides: none.
- Remaining frontier: the editorial choices in section 12.
- Breadth note: the iterations stayed on the four key questions. The loop stopped at its iteration cap, not on convergence.

## 12. OPEN QUESTIONS

- Whether the title should name the doctor theme, or the description and opening paragraph should carry it alone. This is the author's call.
- Whether `specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes` belongs on the spec line. It is accurate, but outside this question.
- Whether the doctor drift-check line earns a place, given the omission rule for process detail.

## 13. REFERENCES

Iteration narratives: `research/iterations/iteration-001.md` through `iteration-003.md`. Deltas: `research/deltas/iter-001.jsonl` through `iter-003.jsonl`. Main sources:

- `.skilled/changelog/skilled/v4.0.0.3.md` and `v4.0.0.2.md`
- `.skilled/commands/doctor/*.md` and `_routes.yaml`
- `.skilled/commands/doctor/scripts/release-update.cjs`
- `.skilled/scripts/git-hooks/README.md`, `pre-commit`, `lib/gates.tsv` and `lib/gate-config.sh`
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`
- the implementation summaries of `049` phases 001-010 and `sk-git/032` children 001-003

## 14. SOURCES CONSULTED (aggregate)

Read-only repository reads, `rg` searches and git plumbing (`log`, `show`, `ls-tree`, `merge-base`, `tag`). The registry holds 25 key findings across 3 iterations.

## 15. RESOURCE MAP

`resource-map.md` was absent at init. The workflow emitted `research/resource-map.md` with 41 references and 0 missing on disk.

## 16. CONVERGENCE REPORT

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 4 / 4
- Remaining questions: 0
- Last 3 iteration summaries:
  - run 1: map the doctor phases and hook gates against the entry (0.9)
  - run 2: hook counts and trigger-lookup attribution (0.6)
  - run 3: edit plan and the line 88 correction (0.5)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Inline vote at the cap: weighted stop score 0.5385. Question coverage was 1.0 and the rolling average was 0.667. The graph decision was `STOP_BLOCKED`. Under stop policy `max-iterations` this was telemetry only.
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

## 17. APPENDIX: EXECUTION LOG

| Iteration | Focus | newInfoRatio | Executor model | Verify |
|---|---|---|---|---|
| 1 | Doctor phases and hook gates against the entry | 0.9 | opencode-go/deepseek-v4.1-flash | pass, first attempt, 285 s |
| 2 | Hook counts, trigger-lookup attribution | 0.6 | opencode-go/deepseek-v4.1-flash | pass, first attempt, 272 s |
| 3 | Edit plan, line 88, upgrade notes | 0.5 | opencode-go/deepseek-v4.1-flash | pass, first attempt, 362 s |

<!-- /ANCHOR:deep-research-v4003-changelog-gaps -->
