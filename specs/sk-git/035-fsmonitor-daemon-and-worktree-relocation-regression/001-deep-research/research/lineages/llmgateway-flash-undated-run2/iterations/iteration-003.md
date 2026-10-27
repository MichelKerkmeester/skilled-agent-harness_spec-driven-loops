# Iteration 3: The repo's unbounded git call sites and the safest default posture

## Focus

Q4 and Q5 of the packet's section 8: which call sites in the repo's hooks and scripts run git without a timeout and which should opt out of fsmonitor, and what the safest default is — fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree. This iteration follows the hook chain into the proven hung call, inventories the index-reading git call sites, finds the repository's existing fsmonitor opt-out convention, and derives the default posture plus a reaping design that respects the reaper's published invariant.

## Actions Taken

1. Read the proven hung site `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:115-140` and its caller chain: `ci-skill-root-metadata.cjs:51` and the pre-push hook block at `~/.config/git/hooks/pre-push:417-451`.
2. Enumerated git spawn sites across `.skilled` (`rg` for `spawnSync/execSync/execFileSync('git'`, excluding node_modules and tests) and inspected the closest `check-ignore` siblings: `verify-router-sync.cjs:168`, `regenerate-skill-derived.cjs:73`, `check-source-tags-helper.mjs:206`.
3. Searched for the repository's existing fsmonitor opt-out convention (`core.fsmonitor=false`, `GIT_NO_FSMONITOR`) and for timeout usage in git wrappers (`message-contract.mjs:262`, `git-message-gate.mjs:290`).
4. Attributed the live daemons by socket: `lsof` for PID 1157 (worktree daemon) and the main-checkout socket holder (PID 5979, started 10:45:09).

## Findings

1. The proven hung site has no ceiling and no opt-out: `generate-leaf-manifest.cjs:129-133` runs `spawnSync('git', ['check-ignore', '-z', '--stdin'], { cwd: top, input, encoding })` with no `timeout` option and no `-c core.fsmonitor=false`, and the fallback at line 136 (`res.error || (res.status !== 0 && res.status !== 1)`) only handles a returned failure — a hang is not a failure, so the fallback is never reached. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129]
2. The chain that reaches it: the pre-push hook runs `node "$SKILL_GATE"` where `SKILL_GATE` is `ci-skill-root-metadata.cjs` (`~/.config/git/hooks/pre-push:425-451`), which imports `buildManifestBytes` from the manifest builder (`ci-skill-root-metadata.cjs:51`); the hook's own comment says the gate "finishes in about a second", which is the assumption that failed. [SOURCE: ~/.config/git/hooks/pre-push:417] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:51]
3. The repository already has the fix convention: `GIT_NO_FSMONITOR = ['-c', 'core.fsmonitor=false']` appears in `cite-drift-scan.mjs:145`, `continuity-freshness.ts:38`, `check-source-tags-helper.mjs:53` and `run-check.cjs:28`, and `git -c core.fsmonitor=false` appears in `hook-flags.sh:20` and the QC playbook. Adopting the convention at the hung site is the low-risk change, not a new pattern. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:145] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:38] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs:28] [SOURCE: .skilled/hooks/shared/hook-flags.sh:20]
4. Other unbounded fsmonitor-touching call sites exist beyond the proven one: `verify-router-sync.cjs:168` (`check-ignore --stdin -z`, no opt-out, no timeout), `regenerate-skill-derived.cjs:73` (`check-ignore -q`, no opt-out, no timeout), `generate-leaf-manifest.cjs:111` (`rev-parse --show-toplevel`, no timeout), and `check-source-tags-helper.mjs:206` (opt-out present, no timeout). [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:206]
5. The repo does use timeouts elsewhere, so the pattern exists too: `message-contract.mjs:262` wraps every git call in `GIT_TIMEOUT_MS`, and `git-message-gate.mjs:290` uses `timeout: 3000` for `rev-parse`. The fix is a choice between two existing conventions, not new machinery. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:262] [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:290]
6. Roughly 59 files under `.skilled` spawn git. The highest-risk class is index-reading commands (`check-ignore`, `status`, `ls-files`) run against the main checkout, because those are the commands that query the fsmonitor daemon; non-index commands (`rev-parse`, `log`, `show`, `cat-file`) never touch the daemon. [INFERENCE: from the enumeration plus iteration 2 finding 7's client path]
7. Live attribution: the main-checkout daemon holds `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/fsmonitor--daemon.ipc` (PID 5979, started 10:45:09), while worktree daemons hold a `fsmonitor--daemon.ipc` under their per-worktree git dirs (PID 1157 is the Oct 11 daemon). The socket path is the attribution key; every daemon's argv is identical, so a cmdline match cannot separate them. [SOURCE: lsof output, this session]
8. A fsmonitor reaper cannot use `git fsmonitor--daemon stop` as its escalation path: iteration 2 showed stop polls forever on exactly the wedged daemon a reaper needs to remove. Reaping therefore means signalling the PID directly, which contradicts the current reaper's published "never signals a process" invariant — so a fsmonitor reap belongs in a separate entry point with its own stated invariant. [INFERENCE: from iteration 1 finding 4 and iteration 2 finding 4]
9. Q5 — the safest default is fsmonitor on with worktrees outside the checkout. It removes the trigger (the main daemon's event volume from ~2M worktree files) rather than masking it, and keeps the measured benefit on the 570k-file main checkout. The per-worktree opt-out (`core.fsmonitor=false` for the main checkout only) requires `extensions.worktreeConfig`, which this checkout does not set, and it loses the largest benefit while leaving worktree daemons free to wedge their own commands. [INFERENCE: from iteration 1 findings 6/8 and iteration 2 findings 6/10]
10. Durability requires two changes together: set `speckit.worktreeBase` explicitly (so the policy is recorded) and stop the write-back from persisting the default as policy — otherwise the next launch without `SPECKIT_WORKTREE_BASE` re-pins `.worktrees` and the relocation silently reverts again. Under every option, the hook ceiling from finding 1 is required because a wedge can still occur in any worktree. [SOURCE: .skilled/bin/worktree-session.sh:293] [INFERENCE: from iteration 1 finding 6]

## Questions Answered

- Q4. Which call sites in the repo's hooks and scripts run git without a timeout, and which of them should opt out of fsmonitor? — Answer: the proven site is `generate-leaf-manifest.cjs:129` (no timeout, no opt-out), reached from the pre-push gate via `ci-skill-root-metadata.cjs:51`. Close siblings needing the same treatment: `verify-router-sync.cjs:168` and `regenerate-skill-derived.cjs:73` (both no opt-out, no timeout), `generate-leaf-manifest.cjs:111` and `check-source-tags-helper.mjs:206` (no timeout). The repo's own convention `-c core.fsmonitor=false` (6+ call sites) and its timeout wrappers (`GIT_TIMEOUT_MS`, `timeout: 3000`) are the fix patterns to adopt; index-reading commands are the priority class.
- Q5. What is the safest default: fsmonitor on with worktrees outside the checkout, or fsmonitor off for the main checkout and on per worktree? — Answer: fsmonitor on with worktrees outside the checkout. It removes the trigger instead of masking it and keeps the benefit on the largest tree. The main-checkout opt-out needs `extensions.worktreeConfig` (absent today), loses the largest benefit, and does not protect worktree daemons from their own wedges. Both options still require the hook ceiling and a fsmonitor reaper as new work.

## Questions Remaining

- None. All five section-8 questions carry cited answers; the remaining UNKNOWNs (the exact unset action for `speckit.worktreeBase`, the reason PID 17228 exited) are recorded with their resolving checks in iterations 1-2.

## Ruled Out

- "Disable fsmonitor everywhere." Rejected as the default rather than ruled out as an option: it discards a measured benefit on a 570k-file checkout, and per-worktree config gives the same safety with a narrower blast radius.
- "Match daemons by command line." Ruled out by finding 7: argv is identical for every daemon.
- "Rely on `git fsmonitor--daemon stop` in a reaper." Ruled out by iteration 2: stop hangs on exactly the daemon a reaper needs to remove.
- "Restore the reaper's daemon handling." Ruled out by iteration 1: that code targeted MCP context-server daemons and the reaper now promises never to signal a process.

## Dead Ends

- Trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design.

## Edge Cases

- Partial success: the call-site inventory is a bounded sample (the closest siblings plus the proven site), not an exhaustive audit of all 59 git-spawning files. The classification rule (index-reading = daemon-touching) is stated so the audit can be completed mechanically.
- Missing dependency: `extensions.worktreeConfig` support was not exercised live; the recommendation treats it as available-but-unset, which the config read confirms.

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:111,115-140`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:51`
- `~/.config/git/hooks/pre-push:417-451`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:53,206`
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:145`
- `.skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:38`
- `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs:28`
- `.skilled/hooks/shared/hook-flags.sh:20`
- `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:262`
- `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:290`
- `rg "spawnSync('git'|execSync('git|execFileSync('git" .skilled` (59 files)
- `lsof` socket attribution for PIDs 1157 and 5979

## Assessment

- New information ratio: 0.90
- Questions addressed: Q4, Q5
- Questions answered: Q4, Q5

## Reflection

- What worked and why: following the hook symlink from `core.hooksPath` into the gate script and then into its imported builder put the exact hung `spawnSync` in one chain of three files. Grepping for an existing `GIT_NO_FSMONITOR` constant then showed the fix pattern already exists in-repo, which lowers the implementation risk to "adopt the convention here".
- What did not work and why: trying to design a cmdline-based daemon reaper failed against the census — every daemon's argv is identical, so the reaper needs the socket path, which is a stronger requirement than sk-git/026's MCP-era design.
- What I would do differently: classify call sites by whether they read the index before auditing them one by one; the daemon-touching class is small and the rest of the inventory is noise for this failure mode.

## Recommended Next Focus

None — the lineage cap is reached and all five questions are answered. Synthesis should compile the root-cause chain: shared `core.fsmonitor` config + in-checkout worktrees (event volume) + immortal macOS daemons + an unbounded cookie wait on both IPC sides + a hook with no ceiling; and the fix design: hook ceiling via the existing `-c core.fsmonitor=false` convention plus a `timeout`, durable relocation with the write-back fixed, and a fsmonitor reaper as a separate entry point attributed by socket path.
