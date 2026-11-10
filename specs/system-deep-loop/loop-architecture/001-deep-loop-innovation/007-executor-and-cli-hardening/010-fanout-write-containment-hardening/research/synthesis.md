# Synthesis: can fan-out support effectively unlimited concurrent lineages?

Ten iterations, one angle each, five on DeepSeek V4.1 Flash and five on GLM 5.3 Flash, both at
max thinking through DevPass. Sequential, read-only, driven outside the fan-out runner so the
research could not become another instance of the bug it was studying.

## The short answer

Worktree isolation is the right structural move and it does not deliver unlimited concurrency
on its own. It fixes **who may write what**. Three other ceilings sit above it, and one of them
is a constant.

## 1. The binding ceiling today is a config constant

`executor-config.ts` caps `concurrency` at 8 with a default of 2, and `MAX_EXPANDED_LINEAGES`
at 256. The recursion layer adds no breadth guard. So "effectively unlimited" currently means
256 lineages, 8 at a time, and the first lever is amending the schema, not the worktree layer.

Depth is separately capped near six levels by one-kind-per-chain membership in the dispatch
stack. Breadth is uncapped in the guard layer; depth is not.

## 2. Isolation reintroduces the same class of bug one layer up

This is the finding that should gate the worktree phase.

- **Containment would watch the wrong tree.** One repo root is resolved per run, with sibling
  directories and ledgers keyed to the main tree. Under N worktrees the guard inspects a tree
  nobody writes to and reports clean. That is the exact failure this packet exists to end,
  recreated by the fix.
- **The startup sweep has no liveness gate.** With overlapping runs sharing one worktree
  prefix, every new run's startup becomes a probabilistic deletion pass over live peers'
  working trees. This is strictly worse than a wrong `git checkout`, because deleted untracked
  output has no HEAD copy to detect the loss by.
- **The acceptance gate would certify the hazard.** A criterion reading "no worktree remains"
  passes for a destructive sweep. The plan needs a negative control instead: run B starts while
  run A is live, and every one of A's worktrees survives.

The repository already knows the correct rule, from its git reaper: absence of proof of
inactivity is never proof of inactivity. The sweep needs a PID-stamped, heartbeat-refreshed
marker written at worktree creation, or the existing lease projected into the worktree
namespace.

## 3. Copy-back has no specified semantics

No lock, no ownership claim, no ordering, against four possible concurrent writers to the main
checkout: the parent's salvage pass, a second fan-out using the same lineage label, the
operator, and a stale previous copy. The lease machinery to govern it already exists with TTL,
heartbeat, nonce and fenced reclaim, but its scope covers the run's artifact directory and
neither of the two genuinely shared surfaces.

## 4. Path rewriting is a project, not a flag

Two executor kinds need an explicit directory flag rewritten, five have only their spawn
working directory as a lever, and one read-only kind needs its read root rewritten. The single
prompt string has to split into "write here now", meaning the worktree, versus "artifacts land
here", which containment, liveness polling and copy-back all key to the main tree today. The
command builder has two external importers and the executor config has no directory field, so
per-lineage roots are a new runner-level concept threaded through three call sites.

A residue survives rewriting: executor-derived paths such as config discovery, editor state
loading and git toplevel are conceded out of reach, and only spawn-time isolation or per-kind
environment pinning closes them.

## 5. Quota is an orthogonal ceiling with no admission control

Isolation says nothing about N lineages sharing one provider account, so solving the git
problem makes the provider limit arrive sooner. There is no token bucket, no shared backoff, no
account-level cap and no typed quota signal in the hot path.

Worse, the three providers collapse quota failure into three differently misclassified
artifacts: one hangs and is recorded as a timeout, one returns non-zero that is deliberately
ignored and may be retried, and the rest surface a bare exit code. At high concurrency,
misdiagnosing an exhausted account as a broken model id is the default state. The pieces for a
fix exist and are unwired: the fallback router already carries typed failure kinds.

## 6. Resource failure is unmeasured and unclassified

All lineages share one runner process, one V8 heap and one event loop, with up to 20 MiB of
stdout buffer each and no heap tuning anywhere. There is no disk-exhaustion path, so the first
`ENOSPC` surfaces as an unclassified crash inside worktree creation, baseline capture or
copy-back. File-handle exhaustion is classified as a retryable lineage failure and retried into
the same exhausted condition. Additive CLI resident memory across runtimes has no measurement
and no limit.

Git locking is not the ceiling: per-worktree index and refs are disjoint, and detached adds
write no refs. The break-first candidates are disk and inodes, per-worktree filesystem monitor
daemons, and I/O queueing during simultaneous checkouts.

## 7. Fixing fan-out does not fix the repository

The single-executor heredocs, the council route and the benchmark route all keep the
shared-checkout post-hoc diff by design. The failure surface that destroyed work twice today
shrinks to the fallback path plus the non-fan-out routes. It stops being a fan-out concern; it
does not stop being a repository concern.

## What this changes about the plan

1. The worktree phase should not start until the sweep's liveness proof and copy-back's write
   semantics are specified. Both are currently absent, and both reproduce today's defect.
2. The verification plan needs a concurrent negative control, or it cannot distinguish the fix
   from the hazard.
3. Raising the concurrency cap is cheap and immediate, but unsafe before resource failures are
   classified, because the current behaviour on exhaustion is to retry into it.
4. Quota admission control is a separate piece of work that fan-out width makes urgent.
