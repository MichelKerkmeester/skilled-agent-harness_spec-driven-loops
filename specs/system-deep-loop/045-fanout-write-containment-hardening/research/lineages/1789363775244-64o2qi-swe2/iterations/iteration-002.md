---
title: "Iteration 2: Filesystem-level sharing — APFS clonefile, overlayfs, sandboxed dirs + shared object store"
trigger_phrases: []
---
# Iteration 2: Filesystem-level sharing — APFS clonefile, overlayfs, sandboxed dirs + shared object store

## Focus

Evaluate mechanisms that share working-tree bytes at the filesystem layer instead of paying `git worktree add`'s materialization: APFS copy-on-write `clonefile` under a real worktree registration, overlay/union filesystems, and per-lane sandboxed directories over the shared object store. For each: setup, disk, attribution exactness, and the four breakage surfaces — symlinked dependency roots, workspace self-links, compiled entry-point guards, the churn detector — plus relocation behavior.

## Actions Taken

- Confirmed this host's filesystem is APFS (native `clonefile`, `cp -c`); the lane tree's `.git` entry is a 4 KB pointer into the shared gitdir.
- Traced how containment reads a lane tree: `git status --porcelain` scoped to `laneContainmentRoot` — the lane's worktree when isolated [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3591-3609,3827-3845].
- Traced the split-link machinery's invariants: relative self-links must resolve through real lane-local directories; absolute links point at the main checkout's dependency roots [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:457-509].
- Re-derived the entry-point-guard and self-link failure modes from the packet's worktree-symlinks research [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md].

## Findings

1. **`git worktree add --no-checkout` + APFS `cp -Rc` is the strongest mechanism found.** Registration alone (gitdir under the shared `.git/worktrees/`, `.git` pointer file, no files materialized) costs tens of milliseconds; `cp -Rc` then clones the working tree as copy-on-write extents — a metadata operation per file, not a byte copy — putting realistic setup at roughly 1–4 s against the measured ~22 s [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:592-593; specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105]. Disk cost is ~0 at provisioning and grows only by the lane's own writes (CoW splits at write time). Six lanes cost ~0 + deltas instead of ~9.6 GB.

2. **Clonefile preserves — and slightly strengthens — attribution.** Each lane still has a private worktree index, so `git status` attribution is lane-local and exact, exactly as today. Better: a concurrent editor writing the main checkout splits the *editor's* extents, so the lane's bytes are frozen at clone time — the lane baseline cannot be moved under it by foreign writes. The lane's index-versus-bytes delta (the main checkout's uncommitted paths cloned in) is the same thing `snapshotOutOfScopeDirtyPaths` already captures as the pre-dispatch baseline [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3601-3609].

3. **A full clonefile makes the packet seed redundant.** `seedWorktree` exists because HEAD lacks the packet's uncommitted bytes; `cp -Rc` of the working tree clones exactly those working-tree bytes — uncommitted packet content arrives for free, for every path, removing `listPacketUncommittedPaths` + `seedWorktree` from the hot path [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:693-752; .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2763-2791]. Seeding stays needed only for the sparse-cone variant.

4. **Cloning the dependency roots (instead of symlinking them) dissolves the self-link problem.** The self-link defect exists because a relative link like `node_modules/@spec-kit/shared → ../../shared` re-anchors through its physical location: carried into a lane as part of a wholesale link, it resolves back into the main checkout's source [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md]. A full-tree clone contains the link *and* its target inside the lane, so the same relative text resolves to the lane's own CoW-identical copy — correct provenance with zero rewriting. Compiled entry-point guards (`path.resolve(process.argv[1])` vs `fileURLToPath(import.meta.url)`) likewise pass, because both sides resolve inside the lane's real files — the no-op-through-symlinked-dist failure cannot occur.

5. **Today's symlinked dependency roots are a write-escape channel the guard cannot see.** `linkSharedPath` symlinks each shared root into the lane [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:520-557]. A lane that writes *through* such a link — `bun install`, a cache write, a build touching `node_modules` — mutates the main checkout's real install, while `git status` in the lane sees only unchanged symlink text. The checkout-watch misses it too: those roots are gitignored. Clonefile-ing the dep roots closes this channel (lane writes split CoW pages, never shared bytes); the link scheme keeps it open. This is a containment hole in the shipped design, independent of cost.

6. **Two clone-time exclusions are load-bearing.** (a) The lane's own `.git` pointer must be created by registration, never cloned — cloning the main checkout's `.git` file/dir would point the lane at the main index and destroy attribution. (b) The worktree base (default `.worktrees/` *inside* the checkout [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:518,2741]) must be excluded or the clone recurses into sibling lanes' trees. Both are one-line filters on the copy.

7. **Index normalization is the one real engineering detail.** After `--no-checkout`, the lane index must be reconciled to the cloned bytes — either a sparse-checkout/`update-index --no-skip-worktree` pass that clears skip bits (a stat pass, not a byte copy) or seeding the lane's private index from the main checkout's index (the worktree index lives at `<commondir>/worktrees/<name>/index`, a stable-but-private layout). Even a degenerate full `git status` content-hash pass over the tree is seconds, not 22 s — and only stat-cache validation is needed after an index copy.

8. **Overlayfs-over-live-lower fails attribution under concurrent writers.** A union mount's lower stays *live*: a foreign write in the main checkout shows through the lane's overlay and lands in the lane's `git status` — re-creating the 1,858-path misattribution this packet exists to kill [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:22,51]. Overlay over a *frozen* lower restores isolation but forfeits working-tree bytes (re-introducing the seed) and `.git` handling needs a per-lane index regardless (`GIT_INDEX_FILE` or copy-up). Verdict: overlayfs is the wrong primitive against a live lower; the correct Linux analogue of clonefile is `cp --reflink` (btrfs/xfs), which freezes extents per file like APFS. macOS has no overlayfs regardless — this host is APFS.

9. **A "sandboxed working directory" without git registration loses the attribution mechanism.** The entire guard is `git status` over a lane-local index [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1-29]. A plain directory of copies/links has no index; attribution would need a byte-manifest diff the runtime does not have. So the phrase "per-lane sandboxed working directories with a shared object store" reduces to *a worktree whose bytes arrive by clone instead of checkout* — option 1 — and the "shared object store" half is already free.

10. **Relocation survives.** `git worktree move` rewrites registration only; same-volume moves preserve CoW sharing (extents follow inodes), and the absolute dependency links point at the *main* checkout, which did not move. The documented danger — absolute links pointing *into* a moved lane — is already engineered away by relative self-links [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:466-471]. Cross-volume moves materialize bytes (same as any tree), and moving the enclosing main checkout breaks all worktree registrations equally.

## Questions Answered

- Can FS-level sharing under a worktree registration beat a sparse cone? Yes — clonefile keeps the full read surface *and* cuts setup/disk below any cone.
- Does it survive self-links and entry guards? Full clone dissolves both; the partial (link the dep roots) variant keeps today's hazards.
- Does overlayfs work here? Not over a live lower — attribution breaks; `cp --reflink` is the right Linux analogue.

## Questions Remaining

- Can a single shared checkout carry exact attribution at all — write redirection, write denial, per-process observation? (Iteration 3)
- The relocation matrix across all candidates and the final ranking. (Iteration 3)

## Ruled Out

- Overlayfs/union mount over the live main checkout as the sharing substrate: lower stays live, foreign writes leak into the lane's diff — attribution broken.
- Sandboxed directory without worktree registration: no per-lane index means no `git status` attribution.
- macOS FUSE/union mounts: no overlayfs on APFS hosts; macFUSE requires a kernel extension.
- Keeping the split-link provisioning for dependency roots under a full clone: unnecessary — relative self-links resolve lane-locally when the target is inside the lane; links remain the right choice only for the sparse-cone variant.

## Assessment

- `newInfoRatio`: `0.85`
- Novelty justification: Identified `--no-checkout` + APFS clonefile as a mechanism that undercuts the measured cost by an order of magnitude while *strengthening* isolation (frozen lane baseline, dep-root write-escape closed, self-link/guard hazards dissolved), and found that overlayfs over a live lower silently reintroduces the original misattribution incident.
- Confidence: high on mechanism semantics and the write-escape finding (code-grounded); medium on the ~1–4 s estimate (clonefile op-count reasoning, not yet measured).

## Reflection

- Worked: reasoning from the clone's CoW semantics to the self-link resolution — the relative-link re-anchoring that breaks symlinked trees is exactly what makes cloned trees correct.
- Worked: tracing what `git status` can and cannot see through a symlink exposed a containment blind spot in the shipped design, not just a cost trade-off.
- Failed: nothing blocking. The index-normalization step needs a prototype measurement on APFS to firm up the setup estimate.
