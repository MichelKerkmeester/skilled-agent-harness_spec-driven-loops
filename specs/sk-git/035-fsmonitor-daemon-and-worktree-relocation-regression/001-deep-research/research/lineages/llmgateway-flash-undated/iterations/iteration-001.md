# Iteration 1: Repo-side regression forensics — what unset the worktree base, what removed the reaper's daemon handling, and which git call sites can hang

## Focus

Section 8 questions 1 and 4 of `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md`: (1) what unset `speckit.worktreeBase` and removed the reaper's daemon handling, and whether anything still creates worktrees under `.worktrees/` by default; (4) which call sites in the repo's hooks and scripts run git without a timeout, and which should opt out of fsmonitor. This iteration is read-only forensics over git history, the reaper/launcher scripts, the pre-push hook and the git call-site inventory.

## Actions Taken

1. Read `.skilled/bin/worktree-reaper.sh` (current, 261 lines) and its history (`git log --follow`).
2. Read the sk-git v1.5.2.0 changelog and the sk-git/026 implementation summary.
3. Ran `git log -S` forensics for `speckit.worktreeBase`, `fsmonitor`, `daemon` and `REAP_DAEMONS` across `.skilled/bin/` and `.opencode/bin/` history.
4. Read `worktree-session.sh` base resolution and config-persist block; read `worktree-naming.sh` `_wn_base_dir`.
5. Read the pre-push hook's skill-metadata gate block and `generate-leaf-manifest.cjs` `dropGitIgnoredLeaves`.
6. Grepped every non-test `spawnSync/execSync/execFileSync('git', ...)` call site under `.skilled/` and checked timeout/fsmonitor handling.
7. Ran read-only config/registry checks: `git config --list --show-origin | grep speckit`, `git worktree list`, `git --version`.

## Findings

1. The reaper never handled git fsmonitor daemons. sk-git/026's recorded "generalized daemon-orphan detection" was memory-launcher (MCP) daemon handling: the reaper at `72bd1309978` carried `REAP_DAEMONS`, `_daemon_worktree_path_from_cmdline` and `_daemon_cmdline_is_orphan`, which reported (and with `--reap-daemons` killed) node daemons whose lease pointed at a deleted `.worktrees/` DB dir. Commit `3c7c3f83874` (2026-09-03, "remove the memory launcher, plugin, hooks and the tool-ownership commit gate") removed 117 lines from the reaper together with the memory launcher itself. `git log -S "fsmonitor"` over `.skilled/bin/` and `.opencode/bin/` returns no commit at all, so no reaper revision ever touched fsmonitor. [SOURCE: .skilled/bin/worktree-reaper.sh:1-261] [SOURCE: git show 72bd1309978:.opencode/bin/worktree-reaper.sh] [SOURCE: git log -S REAP_DAEMONS → 3c7c3f83874]

2. `speckit.worktreeBase` is a local-only git-config key that was never committed (it lives in `.git/config`). The only writer in the repo is the launch wrapper, which persists the resolved base when the key is unset; the v1.5.2.0 changelog documents "Unset the config to return to the in-checkout `.worktrees` layout" as a supported operation, and no script in the tree unsets it (the doctor setup check only reports and repairs). The current config carries no `speckit.*` keys at all, so the recorded relocation to `~/worktrees/public` was lost by an unset/reset outside version control, and nothing in the repo re-establishes it. [SOURCE: .skilled/bin/worktree-session.sh:293-294] [SOURCE: .skilled/skills/sk-git/changelog/v1.5.2.0.md] [SOURCE: git config --list --show-origin | grep speckit → empty]

3. Yes — worktree creation still defaults to `.worktrees/` inside the checkout. `worktree-naming.sh` `_wn_base_dir` resolves env `SPECKIT_WORKTREE_BASE` > config `speckit.worktreeBase` > `.worktrees`, and the numbered allocator creates `.worktrees/{NNN}-{slug}` under that base; the launch wrapper and the reaper resolve the same precedence. All 12 registered task worktrees are back under `Public/.worktrees/` with `worktrees/NNN-slug` branches, so with the key unset every new worktree lands back inside the main checkout. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:61-69] [SOURCE: .skilled/bin/worktree-session.sh:219-227] [SOURCE: git worktree list]

4. The 30-minute stall chain is fully traced: pre-push hook → `ci-skill-root-metadata.cjs` → `generate-leaf-manifest.cjs` `dropGitIgnoredLeaves` → `spawnSync('git', ['check-ignore', '-z', '--stdin'])` with no `timeout` option. `git check-ignore` consults the index (tracked-file check), which triggers `refresh_fsmonitor` IPC; the existing fallback at line 136 only fires on `res.error` or an exit status other than 0/1, and a hang is neither, so the push has no time ceiling. [SOURCE: ~/.config/git/hooks/pre-push:425-437] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129-137]

5. The repo already has three fsmonitor opt-out precedents, but they are not applied at the call sites that matter: `alignment-lib.cjs` runs git with `-c core.fsmonitor=false`, `continuity-freshness` (ts+js) defines `GIT_NO_FSMONITOR = ['-c','core.fsmonitor=false']`, and `git-context-extractor` uses a 5s `GIT_TIMEOUT_MS`. The unguarded index-reading call sites are: `generate-leaf-manifest.cjs:129` (check-ignore, no timeout), `regenerate-skill-derived.cjs:73` (check-ignore -q, no timeout), `verify-router-sync.cjs:168` (check-ignore, no timeout), `folder-detector.js:250` (status, no timeout), `collect-session-data.ts:1164` (status, 5s timeout but no fsmonitor opt-out), `git-standards.cjs:88` and `git-hook-gates.cjs:86,95` (rev-parse/config, no timeout), `write-containment.ts:431`, `score-fanout-pairs.cjs:743`, `heal-spec-docs.cjs:1264`, `behavior-bench-run.cjs:885`, `resolve-authority-root.ts:36`, and `resolve-cutover-binding.ts:99` — the last one runs on every append-gateway call. [SOURCE: .skilled/commands/assets/local-skilled-alignment/alignment-lib.cjs:70] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:38] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/extractors/git-context-extractor.ts:20,105] [SOURCE: grep sweep over .skilled for spawnSync/execSync/execFileSync('git')]

6. Lead to verify in iteration 2: `git check-ignore` accepts `--no-index` to skip the index read entirely, which would remove the fsmonitor dependency at the three check-ignore call sites without changing their semantics for untracked-path checks. Not yet confirmed against git 2.50.1 docs or tested. [INFERENCE: from git check-ignore documentation knowledge; confirmation planned via git docs in iteration 2]

## Ruled Out

- Reverting `3c7c3f83874` to "restore" the reaper's daemon handling: the removed code targeted memory-launcher daemons that no longer exist; a revert would restore dead code, not fsmonitor coverage.
- Blaming the `.opencode` → `.skilled` source-root move (`330427cf308`) for the lost daemon handling: the removal predates it by two weeks and is a distinct commit.
- Searching for a committed `speckit.worktreeBase`: the key is local-only by design; `git log -S` hits are only the scripts that read/write it.

## Dead Ends

- `git log -S "fsmonitor"` across `.skilled/bin/` and `.opencode/bin/` history returns nothing — no reaper revision ever handled fsmonitor; further history search on this path is exhausted.

## Edge Cases

- Ambiguous input: none. The two section-8 questions were taken as written.
- Contradictory evidence: findings.md §5 says sk-git/026 gave the reaper "generalized daemon-orphan detection"; the code and history show it was memory-launcher daemon detection, removed with its subject. Resolution: the 026 summary is accurate for its time; the regression framing in findings.md §5 conflates daemon species. Recorded as finding 1.
- Missing dependencies: none; all sources were local.
- Partial success: none; every planned action succeeded.

## SCOPE VIOLATIONS

- Pre-init spec mutation (workflow `step_preinit_spec_branch`, folder_state `spec-present`): would append research context to `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/001-deep-research/spec.md`, which is outside this lineage's write surface. Skipped; recorded here per the scope-violation protocol.
- `step_validate_preinit_spec_doc` / `step_validate_post_synthesis_spec_doc` (`validate.sh --strict`): explicitly barred by the dispatch contract. Skipped.
- `step_graph_convergence` (`convergence.cjs --persist-snapshot`): writes graph snapshots outside the lineage; with `stopPolicy=max-iterations` the convergence vote is telemetry-only, so the tool was not run. Skipped; convergence telemetry is recorded in the iteration records instead.

## Sources Consulted

- .skilled/bin/worktree-reaper.sh
- .skilled/bin/worktree-session.sh
- .skilled/skills/sk-git/scripts/worktree-naming.sh
- .skilled/skills/sk-git/changelog/v1.5.2.0.md
- specs/sk-git/026-worktree-hygiene-and-relocation/implementation-summary.md
- .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs
- ~/.config/git/hooks/pre-push
- .skilled/scripts/git-hooks/pre-push
- git history: 72bd1309978, 3c7c3f83874, f83952c3a94, 330427cf308
- git config --list --show-origin; git worktree list; git --version

## Assessment

- New information ratio: 0.92
- Questions addressed: section 8 questions 1 and 4
- Questions answered: "What unset speckit.worktreeBase and removed the reaper's daemon handling, and does anything still create worktrees under .worktrees/ by default?"; "Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor?"

## Reflection

- What worked and why: `git log -S` on the exact symbols (`REAP_DAEMONS`, `fsmonitor`, `speckit.worktreeBase`) separated what was removed from what never existed, which corrected the regression framing before any fix design work started.
- What did not work and why: the initial assumption that the reaper once contained fsmonitor handling came from the 026 summary's wording; only reading the reaper at `72bd1309978` resolved it. Summary prose is not code evidence.
- What I would do differently: read the historical file content first and the summary second when a "regression" claim is in play.

## Recommended Next Focus

Iteration 2: git-side daemon lifecycle (section 8 questions 2 and 3) — git 2.50.1's documented daemon lifecycle on macOS, self-exit behavior, `fsmonitor.socketDir`, idle shutdown, `git fsmonitor--daemon stop` under a wedged daemon, and whether the hang is event overload or a known deadlock around `--ipc-threads`/the cookie handshake. Also verify the `check-ignore --no-index` lead from finding 6.
