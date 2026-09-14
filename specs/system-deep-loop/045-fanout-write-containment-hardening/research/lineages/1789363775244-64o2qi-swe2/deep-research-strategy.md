---
title: "Deep Research Strategy: lower-cost fan-out lane isolation than per-lineage worktrees"
trigger_phrases: []
---
# Deep Research Strategy: lower-cost fan-out lane isolation than per-lineage worktrees

## Research Topic

Per-lineage git worktrees give fan-out lanes exact write isolation but cost roughly 1.6 GB of checkout and about 22 s of setup per lane, measured at six lanes. Evaluate alternative mechanisms that preserve the same parallel fan-out and the same attribution guarantee at a fraction of that cost: sparse or partial checkouts, shallow and reference clones, overlay or copy-on-write filesystems, a single worktree with per-lane write redirection, per-lane sandboxed working directories with a shared object store, and one-checkout approaches that make attribution exact without a full tree. For each: setup cost, disk cost, attribution exactness, what breaks (symlinked dependency roots, workspace self-links, compiled entry-point guards, the churn detector), and whether `git worktree move` or relocation survives.

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save, and git staging are out of scope.
- `resource-map.md` was not present at initialization; this lineage emits its own resource map from the completed iterations.
- Measured baseline (packet): 1.6 GB checked-out files per tree, six lanes at concurrency 3 cost 149.7 s with worktrees versus 16.5 s without — roughly 133 s of provisioning across six lanes, about 22 s per lane.
- This checkout: `specs/` alone is 1.3 GB of the 1.6 GB tree and carries 64,280 of 82,393 tracked files; the packet directory itself is 872 KB; the runtime skill trees are ~51 MB combined. The lane's `.git` entry is a 4 KB worktree pointer — the object store is already shared.
- Host filesystem is APFS: copy-on-write `clonefile`/`cp -c` is natively available.

## Key Questions

- [x] Where does the measured 22 s / 1.6 GB per lane actually go — object store, index, working-tree materialization, dependency linking, seeding?
- [x] Do git-native reductions (sparse cones, partial/shallow/reference clones, no-checkout materialization) keep attribution exact, and what do they cost?
- [x] Can filesystem-level sharing (APFS clonefile, overlayfs) under a real worktree registration cut setup to seconds and disk to deltas?
- [x] Do symlinked dependency roots, workspace self-links, and compiled entry-point guards survive each alternative?
- [x] Can a single shared checkout carry exact attribution at all — via write redirection, write denial, or per-process attribution — and what does the churn detector become under each?
- [x] Does `git worktree move` / relocation survive each candidate, and which mechanism is the best replacement or complement?

## Answered Questions

All six questions were answered or explicitly bounded by the three required iterations. The one empirical gate left open is a prototype measurement of clonefile setup plus index normalization on APFS; the ~1–4 s figure is reasoned from op counts, not measured.

## What Worked

- Decomposing the measured cost against the provisioning call chain first: once "objects already shared, cost = materialization + index" was established, every clone-family mechanism fell out as strictly worse without further work.
- Measuring this lane's own checkout: `specs/` at 1.3 GB / 78% of tracked files made the sparse-cone case quantitative and showed a lane is given orders of magnitude more than it reads.
- Reasoning from CoW semantics to the self-link fix: the relative-link re-anchoring that breaks symlinked trees is exactly what makes cloned trees resolve lane-locally — one mechanism answers the self-link, the entry-guard, and the seed cost at once.
- Tracing what `git status` can see through a symlink: surfaced the dep-root write-escape as a containment blind spot in the shipped design, not merely a cost trade-off.
- Diffing the churn sampler against REQ-004: found the missing cumulative arm and the default-3-vs-12 divergence by direct read.

## What Failed

- Overlayfs as the sharing substrate: a live lower leaks foreign writes into the lane diff — the mechanism reintroduces the incident's attribution shape. The correct analogue is file-level CoW (`cp --reflink`), not a union mount.
- Every shared-checkout attribution scheme without kernel mediation: a private index over shared bytes cannot hide foreign writes; the tree cannot name the writer.
- PID-level attribution (EndpointSecurity/fanotify/eBPF): exact but privileged or entitlement-gated — unreachable for a runner spawning unprivileged CLIs.

## Exhausted Approaches

- Shallow, reference, and partial clones: identical working-tree cost, weaker registration semantics, alternates liveness coupling.
- Write redirection on one checkout: no usable primitive on APFS; on Linux it reduces to the overlay answer already exhausted.
- One shared worktree per run and watch-and-remedy in the shared checkout: both previously scored (3/10, 4/10) and re-confirmed against the mechanism analysis.

## Ruled-Out Directions

- Clone-family mechanisms (shallow/reference/partial) as worktree replacements.
- Overlayfs or FUSE over the live main checkout for byte sharing.
- Sandboxed per-lane directories without git registration.
- `GIT_INDEX_FILE`-per-lane over shared bytes.
- Kernel per-process write attribution (deployment-gated).
- Wholesale `node_modules` linking (silent provenance defect, previously established).
- OS write denial as a *replacement* for attribution (viable only as a complement — it prevents rather than attributes).

## Next Focus

Max-iterations policy required all three iterations; all complete. Follow-up is implementation-side, not research: prototype `--no-checkout` + clonefile materialization with index normalization on this APFS host, measure it against the 22 s baseline, and file the two latent defects (dep-root write-escape; missing cumulative churn arm + default divergence).
