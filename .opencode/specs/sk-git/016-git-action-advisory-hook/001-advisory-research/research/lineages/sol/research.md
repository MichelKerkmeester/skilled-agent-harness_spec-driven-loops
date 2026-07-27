# Git Preflight Advisory Rule Research

## 1. Executive Summary

The advisory should not mirror every sk-git rule. It should ship a small command-only core immediately, place stateful candidates behind shadow measurement, and reject broad family warnings. The five briefing incidents remain represented, but the highest-value additions are destructive local recovery loss, force/delete/tag refspecs, forced worktree/branch deletion, ignored-file staging, and deterministic wrapper/linked-worktree coordination facts.

The research retained 23 exact command/state candidates and rejected 14 broad or non-pre-evaluable classes. The current evaluator receives only command text, so only direct branch creation and `--no-verify` are implementable without adding a bounded state-probe layer. [SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs:68-125] [SOURCE: iterations/iteration-005.md:19-66]

The proposed attention budget is a shadow-mode target, not a measured historical rate: below `0.5` emitted advisories per 100 eligible direct Git invocations per rule, hard ceiling `1/100`; below `2/100` aggregate, hard ceiling `3/100`, measured for at least 500 eligible invocations or 30 days. Emit at most one 180-character line per Bash invocation. [SOURCE: iterations/iteration-005.md:13-17]

## 2. Research Question

Which exact Git operations warrant a nonblocking PreToolUse advisory, what command/repository state is genuinely available before execution, and where does advisory noise become self-defeating?

## 3. Method

Five forced iterations covered operation inventory, destructive history/recovery, staging/commit semantics, worktree/remote/account coordination, and final noise/latency calibration. Evidence came from sk-git prose, evaluator and hook code, official/installed Git semantics, current repository state, a 1,486-entry HEAD reflog, 500 recent commit trees, and five-run latency samples. No mutation, fetch, push, staging, commit, checkout, or ref update was performed.

Existing history does not retain complete argv, failed commands, preflight predicate matches, session ownership, or final hook/remote outcomes. Option-sensitive fire rates are therefore explicitly unmeasured; broad history rates are only false-positive-pressure proxies. [SOURCE: iterations/iteration-001.md:40-56] [SOURCE: iterations/iteration-005.md:83-86]

## 4. Pre-Execution State Boundary

Genuinely available before direct commands:

- Parsed direct `git`, `git -C`, and eligible `gh` command text.
- Cwd, repository identity, HEAD, index/worktree diffs, config, local refs, remote-tracking refs, worktree registry, stash/rescue refs, hook installation, and environment variables.
- Reproducible pathspecs and native read-only dry runs for clean/add/commit/reflog-expire operations.
- Positive local/account/API snapshots, with race caveats.

Not genuinely available or not authoritative before execution:

- Session ownership of paths, unexpanded shell/stdin/interactive selections, post-fetch rewrite sets, hook-time index changes, final commit tree, Git transport credential identity, remote authorization/protection/hooks, force-lease result, conflict result, push success, or state after concurrent writers act.

[SOURCE: iterations/iteration-003.md:31-34] [SOURCE: iterations/iteration-004.md:29-31]

## 5. Ship-First Command-Only Rules

| Operation | Pre-state and availability | Noise | Source | Confidence |
|---|---|---|---|---|
| `git commit ... --no-verify`; `git push ... --no-verify` | Parsed option; fully available without repository reads | Unmeasured | sk-git NEVER #9 | Confirmed |
| `git branch <new>`; `checkout -b|-B`; `switch -c|-C` | Direct command shape; fully available; opaque aliases/scripts unavailable | Unmeasured | sk-git NEVER #2 | Confirmed |

These rules are rare explicit policy bypasses. `--no-verify` must never be suppressed by coalescing because it removes the enforcement owner. [SOURCE: iterations/iteration-005.md:25-26]

## 6. Stateful Local-Loss Rules

| Operation | Positive pre-state and genuine availability | Noise | Source | Confidence |
|---|---|---|---|---|
| `git commit --amend` | `HEAD` positively contained by known remote/integration ref; absence is unknown | Broad amend 0.47%; gated rate unmeasured | NEVER #10 | Local predicate confirmed; publication completeness inferred |
| `git reset --hard [target]` | Nonempty exact overwrite or branch-tip retreat relative to durable refs | Broad reset 13.53%; gated rate unmeasured | New, extending ALWAYS #15 | Impact confirmed; ref value inferred |
| `git clean -f|-ff ...` | Equivalent native dry run reports removals | Unmeasured | New | Confirmed |
| `git worktree remove -f <path>` | Target dirty or positively live; inspect target only | Unmeasured; 20/35 worktrees currently dirty exposure | ALWAYS #17 | Confirmed |
| `git stash drop|clear` | Selected entries lack durable rescue refs | Unmeasured; 20 current entries exposure | ALWAYS #14 extension | Availability confirmed; suppression inferred |
| Immediate `git reflog expire ...=now` | Native dry run reports entries | Unmeasured; 390 reflog-only commits exposure | New | Dry-run confirmed; importance inferred |
| `git gc --prune=now`; `git prune --expire=now` | Exact token/effective config; do not claim exact future object set | Unmeasured | New | Command/config confirmed; consequence set inferred |
| `git restore --worktree ...`; legacy path checkout | Exact selected tracked delta is nonempty | Unmeasured | New | Semantics confirmed; impact parser inferred |
| `git branch -D <branch>` | Unoccupied branch has commits absent from all other durable refs | Unmeasured; 13/46 branch exposure in sample | ALWAYS #17 extension | Local predicate confirmed; external value inferred |

[SOURCE: iterations/iteration-002.md:9-27] [SOURCE: iterations/iteration-005.md:27-33] [SOURCE: iterations/iteration-005.md:40-41]

## 7. Stateful Shared-History and Remote Rules

| Operation | Positive pre-state and genuine availability | Noise | Source | Confidence |
|---|---|---|---|---|
| Force/leading-`+`/broad lease push | Known destination would retreat/rewrite; server comparison remains later | Unmeasured | NEVER #1 / ESCALATE #4 | Semantics confirmed; remote impact inferred |
| Push delete, deletion refspec, destructive prune/mirror | At least one known destination exists; remote set remains raceable | Unmeasured | New | Semantics confirmed; impact inferred |
| Tag force/delete | Positively known existing/version tag; tags are skipped by current hook | Unmeasured; 143 tags exposure | New enforcement gap | Gap confirmed; remote consequence inferred |
| Destructive multi-destination/group push | More than one destination and at least one force/delete/mirror/prune fact | Unmeasured | New | Semantics confirmed; prevalence inferred |
| Explicit mutating rebase | Local rewrite set intersects known shared refs; recovery forms and `pull --rebase` excluded | Broad rebase 2.96%; gated rate unmeasured | NEVER #8 | Local predicate confirmed; completeness inferred |
| Dirty autostash operation | Effective autostash plus nonempty tracked dirt | Unmeasured | ALWAYS #14 | State confirmed; conflict/reapply outcome inferred |

[SOURCE: iterations/iteration-004.md:21-31] [SOURCE: iterations/iteration-005.md:34-39]

## 8. Staging and Commit-Selection Rules

| Operation | Positive pre-state and genuine availability | Noise | Source | Confidence |
|---|---|---|---|---|
| `git commit [--only] <pathspec>` | Native dry run shows requested changed path absent or staged set held back; final post-hook tree unavailable | Exact rate unmeasured; multi-path commits 90.6% | Observed incident + Git semantics | Predicate confirmed; intent inferred |
| Reproducible `git add <pathspec>` | Exactly one side of inferred rename would change index state | Exact rate unmeasured; rename/copy 7.2% | ALWAYS #10 extension + incident | Heuristic confirmed; intent inferred |
| `git add -f <pathspec>` | Nonempty ignored candidate set from dry run/check-ignore | Unmeasured | New | Semantics confirmed; sensitivity risk inferred |

Generic `git add -A`, `git add .`, directory adds, and `git commit -a` are not retained on count/breadth alone. Git has no path-owner field, 90.6% of sampled commits touched multiple paths, 77.8% touched at least four, 57.4% touched at least ten, and 9.2% crossed top-level roots. [SOURCE: iterations/iteration-003.md:13-29] [SOURCE: iterations/iteration-005.md:42-44]

## 9. Worktree and Account Coordination Rules

| Operation | Positive pre-state and genuine availability | Noise | Source | Confidence |
|---|---|---|---|---|
| Push to branch checked out elsewhere from detached/linked source | Destination, worktree registry, and local-ref non-movement are known; push success/follower movement unknown | Unmeasured; 1 detached worktree and 6 tips outside primary HEAD exposure | ALWAYS #15 + incident | Local consequence confirmed; surprise inferred |
| Manual wrapper push to live branch | Linked `work/*`, `SPECKIT_AUTOSYNC=1`, exact live destination, direct command outside `git-sync.sh` | Unmeasured; current predicate false | ALWAYS #16 | Confirmed |
| `gh pr create`; `gh release create` | Positive active-account/repository-owner mismatch; authorization remains unknown | Unmeasured; current predicate false | Observed 403 incident refined | Identity confirmed; authorization inference rejected |

[SOURCE: iterations/iteration-004.md:13-19] [SOURCE: iterations/iteration-005.md:45-47]

## 10. Enforcement Boundary

Do not duplicate the tracked pre-push hook's branch naming, wrapper-branch, or non-allowlisted-origin permission messages. The hook owns those as blockers and already prints remediation. `--no-verify` remains advisory-worthy because it bypasses that owner. The current checkout has no installed `.git/hooks/pre-push`; that is a separate hook-health defect, not justification for noisy per-push duplication. [SOURCE: iterations/iteration-004.md:29-37]

## 11. Recommendations

1. Ship the two command-only rules first.
2. Implement the state-probe interface separately from pure command predicates.
3. Add retained stateful rules in privacy-preserving shadow mode, not visible mode.
4. Promote only after 500 eligible invocations or 30 days below per-rule and aggregate ceilings.
5. Emit one line per Bash invocation, with at most two positive facts plus `+N`.
6. Prioritize `irrecoverable local loss > shared/remote rewrite > selection mismatch > coordination`.
7. On probe error or timeout, remain silent rather than infer safety or danger.
8. Repair hook installation through hook-health workflow; do not duplicate blockers.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Warn on every commit/reset/rebase/pull/push | Commit 73.55%, reset 13.53%, rebase 2.96%; exact hazards absent | Reflog/history proxies | 1,5 |
| Warn on broad staging/path count/top-level spread | Ownership is unavailable and multi-path work is normal | 500-commit sample | 3,5 |
| Warn on `commit -a` from dirty count alone | Cross-session contamination cannot be inferred | Git state boundary | 3,5 |
| Predict interactive/stdin path selection | Selection does not yet exist | Git semantics | 3,5 |
| Predict `pull --rebase` rewrite set | Fetch changes upstream after preflight | Git semantics | 2,5 |
| Generic filter-rewrite name warning | Exact mutating predicate not validated | Candidate review | 1,5 |
| Warn on ordinary branch/worktree cleanup | Git/reaper already enforce safe forms | sk-git and Git behavior | 2,5 |
| Warn on recovery/dry-run/routine maintenance forms | No positive loss predicate or recovery object retained | Git behavior | 2,5 |
| Duplicate pre-push naming/permission | Existing blocker owns it | pre-push hook | 1,4,5 |
| Predict push 403/success from `gh` identity | Git transport and server outcome unavailable | Account/remote boundary | 4,5 |
| Warn on ordinary first-time tags or nondestructive multi-ref pushes | No destructive fact | Push semantics | 4,5 |
| Treat snapshots as guarantees | Remote/hooks/concurrency act later | Boundary analysis | 1-5 |
| Network probes in hot path | Add latency without eliminating race | Latency/race analysis | 4,5 |
| Full object/all-worktree scans | 20.15 s worktree sweep; excessive synchronous cost | Probe benchmark | 5 |

## Divergence Map

No divergent pivots ran. Forced max-iteration policy broadened the investigation across five angles. Saturated directions are the eliminated alternatives above. The remaining frontier is implementation and shadow telemetry, not more retrospective Git-history search.

## 12. Open Questions

- Whether the 23-rule set should be reduced before shadowing based on implementation complexity.
- Whether explicit bypass/immediate-destruction rules may bypass the 30-day promotion wait while still recording telemetry.
- Whether account-owner checks can use a sufficiently fresh local cache without network access.

These are rollout questions; all research questions from the charter are answered.

## 13. Probe Budget

- Stage 0: command parsing only; no subprocess for nonmatches.
- Normal tier: at most 3 reused Git subprocesses, target p95 `<=100 ms`, hard timeout `250 ms`.
- Rare mutation tier: at most 5 subprocesses and `750 ms` total.
- Exceptional `clean -fx|-fdx`: native dry run only, hard cap `3.5 s`; disable or retune if p95 stays above `2 s`.
- No network, full `fsck`, or all-worktree status sweep in the synchronous path.

Measured medians ranged from about 8 ms for `rev-parse` to 602 ms for commit dry-run; `clean -ndx` was 1.63 s median and 3.25 s max; all-worktree status was 20.15 s. [SOURCE: iterations/iteration-005.md:15-15] [SOURCE: iterations/iteration-005.md:68-74]

## 14. Noise and Convergence Report

- Stop reason: `maxIterationsReached`.
- Total iterations: 5/5.
- Questions answered: 5/5.
- Ratios: `0.92 -> 0.60 -> 0.72 -> 0.75 -> 0.80`.
- Convergence before iteration 5 was telemetry only.
- Exact option-sensitive rates remain unmeasured by design.
- Shadow target: `<0.5/100` per rule and `<2/100` aggregate.
- Hard ceiling: `1/100` per rule and `3/100` aggregate.

## 15. Telemetry Contract

Record only normalized rule id, eligible operation class, predicate match, emitted/coalesced flag, latency bucket, and timeout. Never record raw commands, paths, refs, URLs, credentials, or file contents. Rates use direct eligible Git invocations as denominator. [SOURCE: iterations/iteration-005.md:70-74]

## 16. Limitations

- History proxies are prevalence ceilings, not candidate fire rates.
- Current repository state is one high-activity snapshot and not representative usage frequency.
- Remote/account snapshots were read-only and raceable; no mutation verified actual authorization outcomes.
- The tracked pre-push hook was absent from the configured installed hook path during measurement.
- The 23 retained rows are research recommendations, not implemented or benchmarked classifier behavior.

## 17. References

- `BRIEFING.md`
- `.opencode/skills/sk-git/SKILL.md`
- `.opencode/skills/sk-git/references/commit-workflows.md`
- `.opencode/skills/sk-git/references/finish-workflows.md`
- `.opencode/skills/sk-git/references/worktree-workflows.md`
- `.opencode/skills/sk-git/references/continuous-integration.md`
- `.opencode/skills/sk-git/references/remote-branch-policy.md`
- `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs`
- `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md`
- `.opencode/scripts/git-hooks/pre-commit`
- `.opencode/scripts/git-hooks/commit-msg`
- `.opencode/scripts/git-hooks/pre-push`
- `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh`
- `.opencode/bin/git-sync.sh`
- `.opencode/bin/worktree-reaper.sh`
- `iterations/iteration-001.md` through `iterations/iteration-005.md`
