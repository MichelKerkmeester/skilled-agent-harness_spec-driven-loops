# Iteration 001

**Model:** `llmgateway/deepseek-v4.1-flash` at max thinking  
**Angle:** worktree isolation mechanics: what `git worktree add` costs per lineage, whether the shared index/objects directory serialises concurrent adds, and what breaks first at 10, 50, 200 concurrent worktrees

---

## Findings

- **Measurement limit — UNKNOWN.** This was a read-only session (no shell), so no `git worktree add` timing, `git ls-files` count, `du`, or `git worktree list` could be run. All cost statements below are structural (from repo evidence + git's documented layout), not measured.
- **The shared-index premise is false for `git worktree add`.** The index is per-worktree: `.git/index` is the main checkout's, while `.git/worktrees/050-advisor-decommission-replay/` holds its own `index`, `HEAD`, `ORIG_HEAD`, `logs/`, `refs/`, and `commondir` (verified by ls). Concurrent adds write into disjoint `worktrees/<id>/` directories; there is no common index lock to serialise on.
- **Detached adds take no ref lock.** The runtime's own worktree fixture creates worktrees with `git worktree add --detach <path> HEAD` (`worktree-fixture.ts:52-53`), and the 045 spec's decision is "ephemeral detached worktree" (spec.md Key Decisions / REQ-005). No branch ref is written, so no `refs/` lock is contended. Object store is read-only during checkout (blobs/trees already exist), so adds create no loose objects and trigger no auto-gc.
- **Cost per lineage = one full materialization of the tracked working tree + one fresh index; history is not copied.** Gitignored dependencies are not in the checkout — the design symlinks shared `node_modules`/`dist` (spec.md §6 dependency row), so isolation covers tracked files only, and those dirs become shared mutable state across lineages. The stress fixture instead creates *empty per-worktree* `node_modules` dirs (`worktree-fixture.ts:54-55`), i.e. its scaffolding does not model the shared-symlink design. This repo's tracked file count/bytes: UNKNOWN.
- **Each live worktree can own a background daemon here.** `.git/config [core]` sets `fsmonitor = true` and `untrackedcache = true`; every linked-worktree gitdir carries `fsmonitor--daemon/` and `fsmonitor--daemon.ipc` (ls of `.git/worktrees/050-advisor-decommission-replay/`). So per-lineage worktrees multiply OS processes and filesystem watch streams, not just disk.
- **The runtime's own config gate fires before git does.** `concurrency` is `.max(8).default(2)` and `MAX_EXPANDED_LINEAGES = 256` (`executor-config.ts` §6 `fanoutControlShape` and the constant above it). 10, 50, or 200 concurrent lineages in one run are not currently expressible; raising them requires schema changes first.
- **Containment requires the artifact dir inside the worktree.** `detectNewOutOfScopeViolations` throws `artifact scope ... is outside the git worktree — containment cannot be enforced` whenever git resolves a toplevel (`write-containment.ts` §5, grep-matched ~L519-521; module header L17-19). Per-lineage worktrees therefore force each `lineageDir` into its leaf worktree plus copy-back — the design the spec already names (REQ-005).
- **Containment is already worktree-aware at the root-resolution layer.** `resolveContainmentRepoRoot` redirects scope to "the worktree that PHYSICALLY holds the writes" when the artifact tree symlinks outside cwd's worktree (`runtime-bootstrap.cjs:47-63`; tests `runtime-bootstrap.test.cjs:77-125`).
- **Cleanup lag is already visible at today's scale.** `.git/worktrees/` holds 31 registrations (plus `.git/worktree-number.highwater`, `worktrees-number.highwater`) while `.worktrees/` holds 2 directories; `.git/config [speckit]` puts other worktrees at `/Users/michelkerkmeester/worktrees/public`. This matches spec risk R-004 ("worktrees accumulate after an interrupted run") and shows `prune`/teardown frequency matters at N=200.
- **The non-git concurrency frontier is the CLIs' own state.** `SPECKIT_STATE_ENV_BY_KIND` is explicitly "DETECTION-ONLY… it does NOT relocate the native lockfile"; the code states "Real same-kind-replica isolation comes from each lineage's unique artifact dir (lineage.label)" (`fanout-run.cjs`, `stateEnvKey` comment block ~L2875). Whether each CLI's home/session lock actually serialises same-kind replicas is UNKNOWN — not verified.

## What this means for unlimited concurrency

- Git locking is not the ceiling: per-worktree index/refs are disjoint and detached adds write no refs, so the break-first candidates are disk/inodes (N full checkouts), per-worktree fsmonitor daemons + CLI watchers, and I/O queueing during simultaneous checkouts — with the runtime's own `concurrency` max of 8 and `MAX_EXPANDED_LINEAGES=256` gating 10/50/200 before any of those bite.
- The only plausible git-side serialization at N=200 is common-dir maintenance (`gc.pid`/`packed-refs` during auto-gc or `worktree prune`) — and only if lineages commit or teardown prunes concurrently; adds alone do not create objects.
- Break points at 10/50/200 are UNKNOWN without measurement; the structural argument says cost is linear in tracked-file count per lineage plus one daemon per live worktree, so the first measurement to take is this repo's working-set size (files + bytes + inodes) per checkout and daemon memory per worktree.
- Mitigations consistent with the evidence: keep `--detach`, keep the ephemeral namespace out of the sk-git numbered allocator (spec Key Decisions), idempotent per-lane teardown + startup sweep (spec R-004), and treat shared `node_modules`/`dist` symlinks as a concurrency hazard, not just a setup convenience.

## Open question this raises

Once `concurrency` is raised past 8, which resource saturates first on this repo — disk/inodes from N full checkouts, per-worktree fsmonitor daemons (plus each CLI's own file watchers), or a CLI runtime's shared home/lockfile state — and at what actual N?
