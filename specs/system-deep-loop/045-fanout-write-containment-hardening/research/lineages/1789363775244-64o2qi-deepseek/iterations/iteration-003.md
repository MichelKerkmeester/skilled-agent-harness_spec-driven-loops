# Iteration 3: Frontier — cost table, relocation survival, and the sparse adoption path

## Focus

Close the comparison: one cost table across all mechanisms, the relocation/move matrix, the
web-verified git behaviors (per-worktree sparse config, worktree move on sparse trees, partial
clone transport requirements, shared-clone hazards, CoW portability), and the concrete runner
adoption path for the winner.

## Findings

### F3.1 The complete cost table

| Mechanism | Setup cost | Disk cost | Attribution | Churn detector | Symlinked roots | Self-links | Compiled guards | Runner machinery |
|---|---|---|---|---|---|---|---|---|
| Full worktree (baseline) | ~22 s/lane (measured) | 1.6 GB/lane (measured) | EXACT | works | split-relink | relative rewrite | provisioned | all five surfaces |
| **Sparse worktree** | cone-proportional; index+relink+seed floor remains | ~0.6 GB for the minimum cone (60% cut) | EXACT | works | split-relink | relative rewrite | provisioned | all five surfaces |
| Shallow clone | ≥ worktree (fetch+checkout) | full tree + object copy | exact in-clone | works in clone | split-relink needed | rewrite needed | provisioned | sweep/publish/lease break (new repo) |
| Reference clone | ≥ worktree | full tree; objects via alternates | exact in-clone | works in clone | same | same | same | machinery breaks + documented corruption hazard |
| Partial clone | blobless: full checkout anyway; tree:0: lazy | tree:0 near-zero, then promisor | exact in-clone | triggers promisor fetches per status/hash-object | same | same | same | machinery breaks + lane depends on source location |
| CoW/overlay | O(files) metadata copy | near-zero (CoW) | none | hard-fails or fails open | re-anchor if symlinked | benign only in full copy | provisioned in copy | sweep cannot reclaim (not a worktree) |
| Write redirection | ~0 | ~0 | heuristic (3/10, already rejected) | watches shared tree, cannot attribute | n/a | n/a | n/a | only the degrade path |
| Sandbox dir + object store | ~0 | ~0 | none | detector-blind | n/a | n/a | n/a | collapses into clone or worktree |
| Per-lane index + checkout-index | sparse disk | sparse | none | watches the WRONG tree (repo default index) | n/a | n/a | n/a | no registration → orphan lanes |

Every row's setup/disk claims are grounded in iterations 1-2; the sparse row is the only one
that keeps the detector exact, the lease live, the sweep functional, publish unchanged, and the
tree at a fraction of the baseline. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106; file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:569-628; file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:744-773]

### F3.2 Relocation and move survival — web-verified

- `git worktree move` is supported for linked worktrees (the main worktree and worktrees
  containing submodules are excluded; manual moves are re-registered by `git worktree repair`).
  Sparse state lives in the per-worktree gitdir (`info/sparse-checkout` + `config.worktree`), so
  the cone moves with the tree; a sparse-index expansion hint on move is a documented cosmetic
  quirk, not data loss. The runtime's self-link rewrite is RELATIVE for exactly this reason: "A
  worktree can be relocated, and that rewrites git's registration without touching link text."
  So the baseline's relocation story survives untouched in the sparse variant — the same
  relative links, the same registration. [SOURCE: https://git-scm.com/docs/git-worktree; file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:463-475]
- Clones: no worktree registration, so `git worktree move` does not apply; a plain directory
  rename works, but remotes/promisor configuration holds absolute source paths — moving the
  SOURCE checkout breaks a partial clone mid-run and leaves a normal clone's remote stale.
  CoW copies and sandboxes have no registration to move, which is the same statement as "nothing
  to relocate" — their problem is not relocation, it is that nothing recognizes them.
- Answer to the topic's question: git worktree move/relocation survives under exactly one
  alternative — the sparse worktree — because it is still a linked worktree of the same repo.
  Every clone-based mechanism trades registration for a path-dependent remote; every
  non-git mechanism has no registration at all.

### F3.3 The sparse config trap is real, and modern git already closes it — with one repo-wide residue

`git worktree add --no-checkout` exists explicitly "to make customizations, such as configuring
sparse-checkout". `git sparse-checkout set` enables `extensions.worktreeConfig` automatically
and writes the cone to the worktree-specific file, so adjusting one worktree no longer alters
another's sparsity (the fix series landed in git 2.37, 2022). The git documentation codifies the
trap in the negative: `core.sparseCheckout` "should not be shared, unless you are sure you
always use sparse checkout for all worktrees" — which is precisely the failure mode this packet
exists to prevent, applied to the operator's main checkout. Two adoption residues remain: (a)
enabling `extensions.worktreeConfig` is repo-wide, and "Older Git versions will refuse to access
repositories with this extension", so the runner must enforce a minimum git version once the
first sparse lane runs; (b) `git worktree add` copies the current worktree's config and sparse
patterns into new worktrees, so the runner must create lanes from the MAIN checkout (as it does
today) and set the cone per lane after add. [SOURCE: https://git-scm.com/docs/git-worktree; https://git-scm.com/docs/git-sparse-checkout; https://github.com/git/git/commit/7316dc5f6f2c8297d32e47d5859933ffacb6c00e]

### F3.4 Partial clone needs a transport, so local-source lanes cannot use it at all

`--filter` works through the pack protocol's negotiation (fetch-pack/upload-pack); a `--local`
path clone bypasses the transport entirely (hardlink copy of objects and refs), so the filter
does not apply — the lane must clone over `file://` (`--no-local`) to get a promisor remote.
And even then, a blobless clone "downloads all reachable commits and trees" and fetches every
blob at the first checkout — the checkout this lane needs — so setup cost does not fall while a
live dependency on the source path is created. Verified against the clone and partial-clone
documentation and the GitHub engineering summary. [SOURCE: https://git-scm.com/docs/git-clone; https://git-scm.com/docs/partial-clone; https://github.blog/open-source/git/get-up-to-speed-with-partial-clone-and-shallow-clone/]

### F3.5 The shared/reference clone hazard is official, and CoW is platform-locked

`git clone --shared`/`--reference` setup alternates and the documentation calls the operation
"possibly dangerous": objects the clone references can become unreferenced in the source repo
and be removed by ordinary maintenance (`git maintenance run --auto`), corrupting the clone.
Worktrees do not have this problem because they are one repo: gc reachability includes linked
worktrees' HEADs. CoW: `clonefile(2)` is APFS-only, same-filesystem-only, and `cp -c`
(fclonefileat) has been the GNU coreutils default on macOS since 9.1 — the disk win is real and
cheap, and the attribution loss is total (iteration 2 F2.2). overlayfs requires Linux ≥ 3.18 and
mount privileges (unprivileged mounting exists only via userxattr in narrow setups). [SOURCE: https://git-scm.com/docs/git-clone; https://keith.github.io/xcode-man-pages/clonefile.2.html; https://docs.kernel.org/6.18/filesystems/overlayfs.html]

### F3.6 Runner adoption path for the sparse worktree

1. `createLineageWorktree` (worktree-lifecycle.ts:569) gains a cone: `git worktree add
   --no-checkout --detach <dir> HEAD` → `git -C <dir> sparse-checkout set <cone...>` →
   `git -C <dir> checkout`. The lease (`.fanout-worktree.lock`, worktree-lease.ts:114) sits at
   the tree root, which cone mode includes (root-level files are siblings of the cone dirs'
   ancestors), so reclaim's liveness read is untouched.
2. Cone computation is a new runner-level concept (like per-lineage roots already are): the
   union of (a) `.opencode/` — the skills, commands, bin, hooks, plugins the prompt pack and
   skill routing read, which also covers every shared-path destination — (b) the target spec
   folder's family directory, (c) any other spec path named in the dispatch arguments (review
   targets, resource-map), and (d) the seed path list, so seeded bytes land inside the cone and
   never surface as post-seed untracked noise. Cone mode is include-only per directory, so the
   granularity is family, not packet; non-cone exclude lists are deprecated by git.
3. Everything else — seed, split-relink, lease, sweep, publish, containment, degrade, tally —
   is byte-for-byte the baseline path; the 22 s/lane falls with the materialization ratio while
   the index (16.4 MB), relink, and seed floor remains.
4. Adoption gate: minimum git ≥ 2.37 once `extensions.worktreeConfig` is enabled, and a
   measurement run to confirm the cone ratio on real lanes (the packet's own measurement
   discipline: the 16.5/149.7 s stub-executor run repeated with a sparse cone).

## Sources Consulted

- https://git-scm.com/docs/git-worktree (--no-checkout, move/repair, extensions.worktreeConfig)
- https://git-scm.com/docs/git-sparse-checkout (cone mode, per-worktree config upgrade)
- https://github.com/git/git/commit/7316dc5f6f2c8297d32e47d5859933ffacb6c00e (sparse-checkout set worktree-config correctly)
- https://git-scm.com/docs/git-clone (--local, --shared, --reference, --filter semantics)
- https://git-scm.com/docs/partial-clone (promisor packs, on-demand fetch)
- https://github.blog/open-source/git/get-up-to-speed-with-partial-clone-and-shallow-clone/
- https://keith.github.io/xcode-man-pages/clonefile.2.html (APFS CoW, same-filesystem, atomic)
- https://docs.kernel.org/6.18/filesystems/overlayfs.html (privilege requirements, userxattr)
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:463-475,569-628
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lease.ts:114-126
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:744-773

## Assessment

- **newInfoRatio**: 0.85
- **Novelty justification**: The cost table (F3.1), relocation matrix (F3.2), and adoption path
  (F3.6) are new; F3.3-F3.5 convert iteration 1-2 hypotheses into verified citations.
- **Confidence**: High — every web claim is cited to git/Apple/kernel documentation; the cone
  math is measured; the one estimate is the per-lane time reduction (needs the measurement run
  the packet's own discipline demands).

## Reflection

- **What worked**: Verification flipped two iteration-1 claims from "risk" to "handled by git"
  (per-worktree sparse config) and one from "concern" to "hard blocker" (partial clone needs a
  transport, so local-source lanes cannot use it at all).
- **What failed / ruled out**: every clone variant (transport, boundary, or corruption hazard),
  CoW/overlay (platform lock + attribution loss), redirection (scored 3/10), sandbox
  (detector-blind), per-lane index (wrong-tree detection). The sparse worktree is the unique
  mechanism that keeps all five machinery surfaces at a fraction of the cost.
- **Boundary of this research**: the per-lane time saving is estimated from the mechanism
  decomposition, not measured; the packet's stub-executor measurement protocol is the right
  instrument for the follow-up.

## Recommended Next Focus

Synthesis: consolidate into research.md with the comparative table, the invariant statement
(attribution requires a per-lane index + tree of the same repo; the only cheaper form is
sparse), the four breakage classes mapped per mechanism, and the adoption gate (git ≥ 2.37,
cone superset rule, measurement run).
