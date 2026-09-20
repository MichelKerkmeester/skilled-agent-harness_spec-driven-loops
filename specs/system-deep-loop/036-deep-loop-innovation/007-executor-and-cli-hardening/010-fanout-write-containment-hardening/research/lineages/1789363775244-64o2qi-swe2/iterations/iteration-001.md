---
title: "Iteration 1: Where the 22 s / 1.6 GB goes, and git-native reductions"
trigger_phrases: []
---
# Iteration 1: Where the 22 s / 1.6 GB goes, and git-native reductions

## Focus

Decompose the measured per-lane provisioning cost into its actual phases, then evaluate the git-native levers — sparse/partial checkouts, `git worktree add --no-checkout` materialization, shallow clones, and reference/shared clones — against the requirements: same parallel fan-out, same exact attribution, lower setup and disk cost.

## Actions Taken

- Read the provisioning path end to end: `prepareLaneWorktree` → `createLineageWorktree` → `git worktree add --detach` → shared-dependency split-linking → `seedWorktree` → `writeWorktreeLease`.
- Read the teardown/publication path: `settleLineageWorktree` → `publishLineageDirectory` → `removeLineageWorktree`.
- Read the measured cost records in the packet (implementation summary, decision record, tasks evidence).
- Took read-only measurements on this very worktree (it is itself a `fanout-...-attempt-1-swe2` lane tree): tree size, `.git` entry, per-subtree sizes, tracked-file counts, filesystem type.

## Findings

1. **The 22 s is working-tree materialization, not git objects.** `createLineageWorktree` runs exactly one git command that does real I/O: `git worktree add --detach <base>/fanout-<runId>-attempt-N-<label> HEAD` [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:592-593]. A linked worktree shares the object store — this lane's own `.git` entry is a 4 KB pointer file, and the packet records "the git object store is shared rather than copied" [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:106]. The measured cost is therefore the checkout writing 82,393 tracked files (1.6 GB) plus the per-worktree index build.

2. **The checkout is dominated by content a lane never needs.** Measured on this worktree: `specs/` alone is 1.3 GB of the 1.6 GB tree and holds 64,280 of the 82,393 tracked files (78%); the packet a lineage actually works in is 872 KB; the two runtime skill trees a lane reads are ~51 MB combined (`system-deep-loop` 20 MB, `system-spec-kit` 31 MB). A cone covering packet + runtime + root docs is ~52 MB — roughly 3% of the tree.

3. **The non-checkout provisioning steps are already cheap.** Shared dependency linking walks the 7 `DEFAULT_SHARED_PATHS` entries, detects repo-internal self-links, and rewrites them as relative links — a bounded readdir/lstat/realpath pass plus symlink creation [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:147-158,407-509]. Seeding copies only the packet's uncommitted paths (KB-scale) [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:707-752; .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2763-2791]. The lease is one file write [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:617-628]. None of these explains 22 s; the `worktree add` materialization does.

4. **Sparse-cone worktrees preserve every semantic the runner depends on, at cone-fraction cost.** A worktree created `--no-checkout` and then materialized through `git sparse-checkout` still gets a private index and worktree gitdir, so `git status --porcelain` inside it diffs that lane's index against that lane's bytes — the exact-attribution mechanism containment already uses [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3591-3609,3827-3845]. Attribution stays exact within the tree, and a lane write outside the cone lands on disk as an *untracked* file, which the physical untracked-file scan still reports — out-of-cone escapes remain visible to the guard. Setup cost scales with cone size (~52 MB cone → well under 5 s); disk cost is cone bytes plus seed plus lane output.

5. **The binding constraint of a cone is the read surface, not attribution.** A lane reading a tracked file outside its cone finds nothing on disk. Research lineages are told they may read anywhere, so the cone must cover the plausible read surface (packet, `.opencode/skills`, root docs) or the prompt gains a `git show HEAD:<path>` fallback, which materializes nothing. Lanes whose reads are enumerable (a review lane scoped to a folder) fit cones cleanly; open-ended research lanes need a wide cone or the fallback.

6. **`--no-checkout` + selective restore is the file-granular variant of the same lever.** `git worktree add --no-checkout` registers the worktree and its gitdir without materializing files; `git restore --source=HEAD -- <paths>` or non-cone sparse patterns then materialize only what the lane reads. Same attribution, same lifecycle, finer control — at the price of maintaining a materialization list instead of a cone.

7. **Shallow and reference clones are strictly worse than the worktree they would replace.** A `git clone --depth N` or `--reference`/`--shared` clone still pays full working-tree materialization plus index — the entire measured cost — while adding a second repository with its own refs and an `objects/info/alternates` coupling that a detached worktree already provides for free. It also abandons the registration the lifecycle is built on: `git worktree remove`, `worktree prune`, `worktree move`, the lease-in-tree convention, and the prefix reclaim sweep all assume a linked worktree [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:823-846; .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-reclaim.ts:56-88]. Ruled out: same cost, weaker semantics, new object-liveness hazard (alternates require the lender never to GC the borrowed objects).

8. **Partial clone (`--filter=blob:none`) is a non-answer locally.** Promisor filters defer blob fetch from a remote; here every object is already local in the shared store, so there is nothing to defer. Ruled out.

## Questions Answered

- Where does the 22 s / 1.6 GB go? Almost entirely `git worktree add` materializing 82K files and the lane index; objects were never the cost.
- Do git-native reductions preserve exact attribution? Sparse cones and `--no-checkout`+restore do — they keep the per-worktree index that makes `git status` lane-local.
- Are clones competitive? No — they pay the same materialization and lose worktree registration semantics.

## Questions Remaining

- Can filesystem-level CoW (APFS clonefile, overlayfs) under a `--no-checkout` registration beat even a small cone on setup time? (Iteration 2)
- Can a single shared checkout carry exact attribution at all? (Iteration 3)

## Ruled Out

- Shallow clone per lane: full working-tree cost retained; loses `worktree` registration (move/prune/reclaim/lease conventions).
- Reference/shared clone per lane: identical materialization cost; object sharing already free via worktree; adds alternates liveness coupling.
- Partial clone / blob:none filter: nothing to defer against a local shared object store.
- Whole-`node_modules` wholesale linking as a cost dodge: established earlier — silently resolves workspace self-links into the main checkout's bytes [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md].

## Assessment

- `newInfoRatio`: `0.9`
- Novelty justification: Decomposed the measured cost to a single dominant phase (working-tree materialization; objects already shared), measured the tree's own composition to show 78% of tracked files are `specs/` a lane never writes, and classified which git-native levers keep the worktree semantics the lifecycle depends on.
- Confidence: high on the cost decomposition (code + direct measurement agree); medium on sparse-cone read-surface sizing until a lane's real read set is profiled.

## Reflection

- Worked: reading the provisioning call chain against the packet's measured numbers; measuring this lane's own tree gave the `specs/` dominance figure that makes sparse cones quantitatively compelling.
- Failed: nothing blocking. The open question is how wide a research lane's cone must be — deferred to the filesystem-level pass, where `git show` fallback cost matters.
