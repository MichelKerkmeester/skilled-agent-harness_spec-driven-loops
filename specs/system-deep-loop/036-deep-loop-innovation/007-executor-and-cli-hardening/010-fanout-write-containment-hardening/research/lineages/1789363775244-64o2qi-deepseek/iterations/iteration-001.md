# Iteration 1: Git-native alternatives — what a lane really materializes

## Focus

Measure what a full per-lane `git worktree add` actually costs in THIS repository, then evaluate
the git-native levers — sparse cone checkout, `--no-checkout` + manual cone, shallow clone,
reference clone, partial clone — against the runner's five machinery surfaces (registration,
lease, sweep, publish, containment) and the four breakage classes.

## Findings

### F1.1 The 1.6 GB per lane is tree materialization, not objects, and it is 85% `specs/`

Measured directly on this checkout: the tracked tree is 1,421 MB across 82,393 files, of which
`specs/` is 1,205 MB / 64,280 files and `.opencode/` is 17,648 files (≈216 MB tracked). Only 430
tracked files are symlinks. The object store is 2.06 GiB in-pack in the main repo and is already
shared by every worktree, so per-lane disk = the materialized tree, exactly as the packet
measured (1.6 GB per tree; six lanes ≈ 9.6 GB). The payload is not code: it is deep-review and
deep-research artifact directories tracked inside spec packets — a single `review-r2` directory
in one packet of `specs/system-speckit/027-*` is 37 MB / 349 files, and the largest individual
file in the whole repo is ≈58 KB. The 1.6 GB is many mid-size text files (JSONL state logs,
iteration markdown, findings registries), which is why nothing short of subtree selection moves
the number. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:106; measured 2026-09-14 via `git ls-tree -r -l HEAD`, `git count-objects -vH`, `du -sh`]

### F1.2 Sparse cone worktrees keep every machinery surface and cut disk ~60% with the cone this lane actually needs

Sequence: `git worktree add --no-checkout --detach <dir> HEAD` → `git sparse-checkout init --cone`
→ `git sparse-checkout set <cone dirs>` → `git checkout`. The result is still a registered linked
worktree of the same repo, so: the lease file lands inside the tree (reclaim liveness unchanged,
[SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:617-628]),
the startup sweep and `git worktree remove --force` + `prune` apply unchanged ([SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-reclaim.ts:309-314]),
publish copies the lineage dir out of the tree unchanged ([SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-publish.ts:8-29]),
and the churn detector's `git status --porcelain=v1 -z --no-renames --untracked-files=all` works
in a sparse tree (entries outside the cone carry the skip-worktree bit; status skips them; writes
inside the cone or new untracked files remain visible) ([SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:315]).
Attribution stays EXACT: the lane is a worktree of the same repository, so every path outside the
lineage dir is attributed by git, not by guess.

The minimum cone for a research lane is `.opencode/` (every skill, command, bin, hook, plugin the
prompt pack and skill routing read — ≈253 MB on disk) plus the target spec's family directory
(`specs/system-deep-loop` for this packet, ≈356 MB) plus any other spec path named in the
dispatch arguments (review targets land in a sibling family). That cone ≈0.6 GB against the
1,421 MB tracked tree — a ~60% disk cut. Because the ~22 s/lane provisioning delta
(133 s / 6 lanes from the packet's 149.7 s − 16.5 s measurement, [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105])
is dominated by writing and later deleting the 1.4 GB tree (82k files), the setup and teardown
time scale with the cone too; the per-worktree index (16.4 MB for 82k entries, measured) and the
shared-path split-relink remain as fixed costs. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:79-127]

### F1.3 Shallow clones cut history, not tree — strictly worse than sparse here

`git clone --depth 1` truncates commit history; the working tree is still the full 1.4 GB and the
clone still writes a full index. Local clones copy or hardlink the object store (or share it via
`--shared`/`--reference`, which git documents as corruptible if the source repo is pruned or
garbage-collected). Setup is clone (fetch + checkout) ≥ `worktree add`; and the clone is a
different repository, so the main repo's sweep cannot see it (`git worktree remove/prune` are
main-repo operations), the lease file still works as an untracked marker but the sweep would need
a new pass over clone directories, and publish/containment still work because they are path- and
git-status-based. Nothing about a lane needs history: it reads HEAD plus the seeded uncommitted
bytes. Verdict: no cost axis improves; the machinery must be extended; rejected. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:395; git clone documentation]

### F1.4 Partial clones (blob:none / tree:0) make the lane depend on the source mid-run

`--filter=blob:none` still materializes the full checkout and fetches every blob on demand — from
a local source that is the same 1.4 GB, so setup cost does not fall, and `--filter=tree:0` leaves
an empty tree whose every path access, including the churn detector's status walk and
`git hash-object` calls ([SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:398-400]),
triggers promisor fetches against the main checkout. The lane then has a live dependency on the
source repo's location: relocation of the main checkout (or the lane) breaks the promisor remote
mid-run. Partial clones also cannot be `--local`; they require a real transport. Verdict: the
worst of both axes for a local-source lane; rejected.

### F1.5 Reference clones re-add a maintenance hazard worktrees already avoid

Worktrees already give shared objects under ONE repository, where `git gc` reachability includes
linked worktrees' HEADs. A `--reference`/`--shared` clone re-creates an object-store boundary
whose documented failure mode is corruption when the source repo is pruned. The 1.6 GB/lane is
tree, not objects, so sharing objects is already solved and is not the cost being attacked.
Verdict: redundant; rejected.

### F1.6 The one genuine sparse trap: config plumbing must be per-worktree, or the main checkout becomes sparse

`git sparse-checkout init` sets `core.sparseCheckout` in the repo's common config unless
`extensions.worktreeConfig` is enabled; the cone list itself lives in the worktree's
`.git/info/sparse-checkout`, but the flag that turns it on is shared by default. In this repo,
with the operator's main checkout at `~/MEGA/.../Public`, a lane init without per-worktree config
would silently make the main checkout sparse — a worse version of the exact misattribution class
this packet exists to end (the guard would then watch a tree whose files are not there). The
runner must enable `extensions.worktreeConfig` and set the flag per worktree. This is the 
concrete "what breaks" finding for the sparse route. [SOURCE: git docs — sparse-checkout config semantics; verified in iteration 3]

### F1.7 Sparse does not fix the residual fixed costs

Per-lane index write (16.4 MB), shared-path split-relink for dependency roots carrying
workspace self-links, the seed walk (`git status --porcelain` over the spec folder, [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2763-2801]),
and the 2 MiB/file, 64 MiB/lane baseline capture all remain. The 22 s/lane is not reachable
below the index + relink + seed floor; the realistic claim is "a fraction" (est. ~40-60% cut from
tree materialization), not an order of magnitude — and the packet's own measurement does not
split create vs teardown, so the split of the 133 s between add and remove is inference from the
mechanism, not a recorded number.

## Sources Consulted

- file:specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106
- file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:276,395,401-403
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:477-510,569-628,707-752
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:79-127
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-reclaim.ts:139-141,285-315
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-publish.ts:8-29
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:315,398-400
- file:.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2763-2801
- Measured 2026-09-14: `git ls-tree -r -l HEAD` (1,421 MB / 82,393 files), `git count-objects -vH` (2.06 GiB in-pack), per-worktree index 16.4 MB

## Assessment

- **newInfoRatio**: 1.0
- **Novelty justification**: First evidence-gathering pass on this topic; the repo anatomy
  measurements (1.4 GB tracked, 85% specs/, 82k files, index cost) and the mechanism-to-surface
  mapping are new to this lineage.
- **Confidence**: High on measurements (directly executed); medium-high on the 22 s decomposition
  (create vs teardown split inferred from the mechanism, not separately measured in the packet);
  the `extensions.worktreeConfig` claim is from documented git behavior and is web-verified in
  iteration 3.

## Reflection

- **What worked**: Measuring the tracked tree directly settled the cost model — the object store
  was already shared, so every alternative that only shares objects better (reference/shared
  clones) attacks nothing; the alternative that selects tree content (sparse) attacks the actual
  1.4 GB.
- **What failed / ruled out**: Shallow clones (tree unchanged, new repo boundary, sweep
  machinery must be extended), reference clones (documented corruption hazard, redundant with
  worktree object sharing), partial clones (promisor dependency on source location mid-run,
  breaks the churn detector's status/hash-object on a relocated source).
- **Open thread for iteration 2**: sparse cone granularity is per-directory; can the cone be
  narrowed further than `.opencode/` + family, and do non-git mechanisms (CoW, sandbox dirs,
  write redirection) beat even the sparse floor while keeping attribution exact?

## Recommended Next Focus

Iteration 2: non-git mechanisms — CoW/overlay filesystems, single worktree with per-lane write
redirection, per-lane sandboxed dirs with a shared object store — tested against the one
non-negotiable: exact attribution through the churn detector, which fails open outside a real
git working tree.
