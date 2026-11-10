---
title: "Research: Git Workflows That Fail A Run"
description: "Conductor reduction over five DeepSeek iterations: fourteen confirmed behaviors that fail, revert, block or mislead an automated run, ten fixable in the hooks and sk-git, four that belong to the deep-loop runtime."
trigger_phrases:
  - "git run failure analysis"
  - "advisory false positive cwd"
  - "autostash orphan rebase"
  - "allocator stale lock"
  - "containment same packet write"
importance_tier: "important"
contextType: "research"
---
# Research: Git Workflows That Fail A Run

Five iterations ran on one cli-pi lineage (DeepSeek V4.1 Flash, max thinking, stop policy max-iterations, 17 minutes). Every candidate was reproduced in a throwaway repository or ruled out with the attempt shown. The lineage's own synthesis and the full reproductions are in `lineages/deepseek/research.md` and its `iterations/`. This document is the conductor's reduction.

---

## 1. WHAT THE CONDUCTOR VERIFIED

| Claim from the lineage | Conductor measurement | Verdict |
|---|---|---|
| A lock directory with no pid file is never reclaimed and every mint waits the full timeout | `allocate` against a pre-created empty lock: `lock acquisition timed out`, rc 1, 34 seconds | Confirmed |
| The body-line length warning fires on a long `Spec:` trailer | 110-character `Spec:` line: `Body line 5 exceeds 100 characters` | Confirmed |
| The advisory false positive is a context-directory defect, not git behavior | Twenty advisories this session on adds that staged exactly what they named, all from a linked worktree | Consistent with the reproduction |
| The lineage settled clean | `orchestration-summary.json` succeeded 1, failed 0, five iteration files | Confirmed |

Not reproduced by anyone, and said so: the silent death of the first detached pi child, and the memory kills. The lineage showed that plain detachment from the tool shell survives, so those two belong to the executor and the operating system, not to git.

---

## 2. WHAT FAILS A RUN, AND WHERE THE PRODUCER IS

Fixable in this packet, ranked by how often it bites and by blast radius:

1. The preflight advisory builds its git context from the session directory and drops `-C <dir>` and a leading `cd <dir> &&`. False fire on every multi-path add from a worktree, false silence on a `reset --hard` in a dirty worktree. Producer: `git-rule-checks.mjs` and `git-context.mjs`.
2. The reaper prunes a live session's socket directory and marker when the wrapper's base directory is not in its environment, and removes a worktree while a detached child still works inside it. Producer: `worktree-reaper.sh`, `worktree-session.sh`.
3. A conflicting `rebase --autostash` leaves an autostash the orphan guard never sees, because the guard runs only after merge and rewrite. Producer: `lib/autostash-orphan-guard.sh` and the hook ordering.
4. The pre-commit re-mint gates block with a human fix and no bypass, and block a packet whose only dirt is the gate's own derived files. Producer: `pre-commit`.
5. The installer symlinks hooks machine-wide through the global hooks path, so a hook edited in a worktree is shadowed by the main clone's copy, and nothing reports it. Producer: `install-git-hooks.sh`.
6. Diverged autosync rewrites session SHAs without recording the mapping. Producer: `git-sync.sh`.
7. The allocator's two-syscall lock window can leave a lock with no owner that nobody reclaims. Producer: `commit-id-naming.sh`.
8. The commit-msg length warning counts trailer lines. Producer: `commit-msg`.

Belonging to the deep-loop runtime, named for their own packet and not edited here:

1. Write containment fails a lineage for a same-packet tracked write by another writer, after the lineage completed. `write-containment.ts` and `fanout-run.cjs`.
2. The stall watchdog reports a stall for a silent-but-working print-mode child; it should read process liveness and CPU time. `fanout-run.cjs`.
3. Containment detection inherits host-global git configuration such as the excludes file. `write-containment.ts`.
4. A killed print-mode child leaves an empty log and no cause; the settle record should carry the exit signal and peak memory. `fanout-run.cjs`.

Ruled out: stale worktree registrations (the reaper prunes first), detached HEAD misfires (no check reads the branch), `GIT_DIR` leaking into hooks (it moves the gitdir, not the toplevel).

Also confirmed but outside both scopes: the pi dispatch guard denies ordinary compound commands with `-p` and an expansion. That is the dispatch audit under `.opencode/hooks/dispatch/`, named here for its owner.

---

## 3. THE ADJUSTMENT PLAN

Three briefs, one child each, serial, in `scratch/briefs/`:

- `007a-hooks.md`: the autostash anchor, the pre-commit bypass lines and derived-only pass, the trailer length exemption, and an installer `--status`.
- `007b-sk-git-scripts.md`: the advisory's effective directory and fail-open rule, and the allocator's ownerless-lock reclaim.
- `007c-bin-scripts.md`: the reaper's base-independent candidate list and live-process refusal, and the sync log's old-to-new line.

Every adjustment keeps the gate for interactive use and ships a harness case. After the three land, one fresh fan-out lineage is launched and must settle with `succeeded 1`, which is this phase's last criterion.

---

## 4. RUN RECORD

- Lineage: `lineages/deepseek`, five iterations, `maxIterationsReached`, 17 minutes
- The lineage left throwaway repositories under its scratch directory; their nested `.git` directories had to be stripped before the evidence could be committed, which is itself now item 13 on the observed list
- The runner flagged a timestamp anomaly on six of seven state records: the child stamps local time with a Z suffix
