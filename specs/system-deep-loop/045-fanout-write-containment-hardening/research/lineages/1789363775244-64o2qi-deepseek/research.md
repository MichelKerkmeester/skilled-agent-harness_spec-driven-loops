# Research: cheaper per-lane isolation than full git worktrees

Lineage `fanout-deepseek-1789363775244-64o2qi` (cli-devin, deepseek-v4-flash-max), three
iterations, stop policy max-iterations. All claims grounded in the runtime code under
`.opencode/skills/system-deep-loop/runtime` and in the packet's measurements.

## The short answer

The 1.6 GB / ~22 s per-lane cost is tree materialization, not objects — the object store is
already shared (2.06 GiB in-pack, one repo), and the tracked tree is 1,421 MB across 82,393
files of which `specs/` alone is 1,205 MB / 64,280 files. The alternative that attacks the real
cost while keeping every guarantee is a **sparse cone worktree**: `git worktree add
--no-checkout --detach` + `git sparse-checkout set` per lane. It keeps the same repo identity,
so attribution stays exact, the churn detector stays exact, the lease/sweep/publish machinery
is byte-for-byte unchanged, and `git worktree move`/relocation survives (the self-links are
relative precisely for that reason). The minimum cone for a research lane — `.opencode/` plus
the target spec's family — is ~0.6 GB against 1.6 GB, a ~60% disk cut with setup/teardown
scaling with the materialization ratio. Every other mechanism either costs the same or loses
the guarantee the packet exists to provide.

## 1. What the cost actually is (measured)

- Six lanes at concurrency 3: 149.7 s with worktrees vs 16.5 s without → ~133 s provisioning →
  ~22.2 s/lane; 1.6 GB checked out per tree; object store shared. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106]
- Tracked tree measured this session: 1,421 MB / 82,393 files; `specs/` = 1,205 MB / 64,280
  files; `.opencode/` = 17,648 files (≈216 MB). Only 430 tracked symlinks. The payload is
  tracked deep-review/deep-research artifact directories (a single `review-r2` = 37 MB / 349
  files); the largest file in the repo is ≈58 KB. Per-worktree gitdir ≈16 MB (index 16.4 MB).
- Consequence: object-sharing alternatives (reference/shared clones) attack nothing, because
  sharing is already free. Tree-selection alternatives (sparse) attack the actual 1.4 GB.

## 2. Mechanism-by-mechanism verdict

| Mechanism | Setup | Disk | Attribution | Verdict |
|---|---|---|---|---|
| Sparse cone worktree | cone-proportional; index+relink+seed floor remains | ~0.6 GB (60% cut) | EXACT — same repo, per-lane index | **Recommended** |
| Shallow clone | ≥ worktree add | full tree + object copy | exact in-clone, but new repo boundary breaks sweep/lease/publish | Rejected |
| Reference clone | ≥ worktree add | full tree, objects via alternates | same as shallow + documented corruption hazard when source prunes | Rejected |
| Partial clone | blobless = full checkout anyway; needs a real transport (`--local` ignores filters) | near-zero then promisor | promisor fetches couple lane liveness to source location; churn detector's status/hash-object trigger them | Rejected |
| CoW/overlay (APFS clonefile / overlayfs) | O(files) metadata copy | near-zero | NONE — lane is not a git working tree; detector hard-fails or fails open; sweep cannot reclaim; git index coherence breaks | Rejected |
| Single worktree + write redirection | ~0 | ~0 | heuristic — already scored 3/10 in ADR-003; ADR-005 watch is report-only | Rejected (stays the degrade path) |
| Sandbox dirs + shared object store | ~0 | ~0 | NONE — without a git identity the store is unreachable and the detector is blind; with one it is a clone or a worktree | Rejected |
| Per-lane index + `checkout-index --prefix` | sparse disk | sparse | NONE — runner's status calls use the repo default index, so the detector watches the shared checkout while the lane writes its own tree | Rejected (recreates the wrong-tree bug) |

## 3. The invariant that decides everything

Exact attribution comes from exactly one property: the lane's tree is a git working tree of the
same repo with its own per-worktree index, so `git status --porcelain=v1 -z --no-renames
--untracked-files=all` keys every dirty path to the lane's tree and the shared checkout is not
a party to the run. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:315,744-773]
The guard preserves rather than restores precisely because "the tree cannot say which writer
made a change" on a shared checkout — the 2026-09-08 incident cost 1,858 tracked paths of a
live session. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:56]
"One checkout with exact attribution but no full tree" is satisfiable only as a sparse worktree:
one repo, per-lane tree that is a strict subset of the tracked tree, per-lane index. Literally
one shared tree cannot be exact — git has no per-writer identity for writes into a tree it
shares.

## 4. The four breakage classes, mapped

1. **Symlinked dependency roots**: wholesale linking re-anchors workspace self-links into the
   source checkout. Sparse keeps the baseline's split-relink (`findRepoInternalSelfLinks` +
   `linkSharedPathSplit`), which is the only mechanism that repairs it; CoW full copies make
   them benign only if nothing is symlinked; sandboxes/redirection have no tree to fix.
   [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:396-455,477-510]
2. **Workspace self-links**: must be rewritten RELATIVE to the lane, because relocation must
   survive. Sparse inherits the baseline behavior unchanged. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:463-475]
3. **Compiled entry-point guards**: the spec-kit shared package resolves exports onto compiled
   output (`shared/dist`) — any lane that reads the package needs it provisioned; generators
   reached through links misfire their invocation-path guard. Sparse's cone covers `.opencode/`,
   so provisioning and canonical-path invocation are unchanged. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:154-157; file:specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md]
4. **Churn detector**: exact only inside a real git working tree of the repo. Sparse: exact
   (skip-worktree entries are skipped by status; new writes stay visible). Clones: works in the
   clone but the sweep can't see the clone. Everything non-git: hard-fails (repo resolvable,
   artifact dir outside worktree → throw) or fails open (no git toplevel), and per-lane-index
   hacks watch the wrong tree. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:744-752]

## 5. Relocation survival

`git worktree move` works on linked worktrees (main and submodule-bearing trees excluded;
manual moves re-register via `git worktree repair`); sparse state lives in the per-worktree
gitdir, so the cone moves with the tree. The sparse worktree is the ONLY alternative under
which worktree move/relocation survives, because it is still a linked worktree of the same
repo. Clones trade registration for path-dependent remotes/promisor config; CoW/sandbox have no
registration to move. [SOURCE: https://git-scm.com/docs/git-worktree]

## 6. What the runner must change to adopt sparse (findings only)

1. `createLineageWorktree` gains a cone: `git worktree add --no-checkout --detach <dir> HEAD` →
   `git -C <dir> sparse-checkout set <cone...>` → `git -C <dir> checkout`. The lease
   (`.fanout-worktree.lock`) sits at the tree root, which cone mode includes, so reclaim's
   liveness read is untouched. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lease.ts:114-126]
2. Cone computation is a new runner-level concept: union of `.opencode/`, the target spec
   family, any other spec path in the dispatch args, and the seed path list (so seeded bytes
   never surface as post-seed untracked noise). Cone mode is include-only per directory —
   granularity is family, not packet; non-cone excludes are deprecated by git.
3. Modern git handles the per-worktree config automatically (`sparse-checkout set` enables
   `extensions.worktreeConfig` and writes the cone to the worktree-specific file; the docs
   codify the trap: `core.sparseCheckout` "should not be shared"). Adoption residue: the
   extension is repo-wide and older git refuses such repos — enforce a minimum git version.
   [SOURCE: https://git-scm.com/docs/git-sparse-checkout; https://github.com/git/git/commit/7316dc5f6f2c8297d32e47d5859933ffacb6c00e]
4. Everything else — seed, split-relink, lease, sweep, publish, containment, degrade, tally —
   is unchanged; the ~22 s/lane falls with the materialization ratio, with the index (16.4 MB),
   relink, and seed floor remaining. The per-lane time saving is an estimate from the mechanism
   decomposition and needs the packet's stub-executor measurement protocol to confirm.

## 7. Ruled-out directions (negative knowledge)

- Shallow clone: truncates history, not tree; new repo boundary breaks the sweep; lanes never
  need history.
- Reference/shared clone: documented "possibly dangerous" — source-repo maintenance can remove
  objects the clone references; worktrees already share objects safely under one repo.
- Partial clone: needs a real transport (`--local` ignores filters); blobless still fetches all
  blobs at first checkout; tree:0 makes the churn detector's status/hash-object trigger promisor
  fetches and couples lane liveness to the source path.
- CoW/overlay: APFS clonefile is macOS/same-filesystem-only; overlayfs is Linux + privilege;
  both break attribution, the detector, and git index coherence.
- Write redirection: scored 3/10 in ADR-003; five of seven executor kinds reach their tree only
  via spawn cwd or read root; the ADR-005 watch is report-only. Legitimate only as the degrade
  path, where it already lives.
- Sandbox + shared object store: collapses into clone or worktree; plain dirs are detector-blind.
- Per-lane index + `checkout-index --prefix`: hand-rolled sparse without registration; the
  runner's status calls read the repo default index → the detector would watch the shared
  checkout while the lane writes its own tree.

## References

- Packet measurements: file:specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106; decision-record.md:56,276,401-403,480-486
- Runtime: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts; worktree-paths.ts; worktree-reclaim.ts; worktree-lease.ts; worktree-publish.ts; write-containment.ts; executor-config.ts; file:.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- Git documentation: https://git-scm.com/docs/git-worktree; https://git-scm.com/docs/git-sparse-checkout; https://git-scm.com/docs/git-clone; https://git-scm.com/docs/partial-clone; https://github.blog/open-source/git/get-up-to-speed-with-partial-clone-and-shallow-clone/
- Platform: https://keith.github.io/xcode-man-pages/clonefile.2.html; https://docs.kernel.org/6.18/filesystems/overlayfs.html
- Git commit: https://github.com/git/git/commit/7316dc5f6f2c8297d32e47d5859933ffacb6c00e
