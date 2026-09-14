---
title: Deep Research Strategy
description: Lineage-local strategy for evaluating lower-cost exact fan-out isolation.
version: 1.14.0.19
---

# Deep Research Strategy

## 1. OVERVIEW

This detached lineage evaluates mechanisms that can preserve parallel fan-out and exact write attribution at less than the measured per-lineage checkout cost. The executor-dispatch steps in the workflow are satisfied by this inline process. Convergence is telemetry only; all three iterations are required.

## 2. TOPIC

Per-lineage git worktrees provide exact write isolation but cost roughly 1.6 GB of checkout and about 22 seconds of setup per lane in the six-lane measurement. Compare sparse and partial checkouts, shallow and reference clones, overlay or copy-on-write filesystems, one worktree with write redirection, per-lane sandbox directories with a shared object store, and other one-checkout designs against this repository.

## 3. KEY QUESTIONS

- [x] Can sparse or partial checkouts reduce materialized bytes while retaining a real per-lane status boundary and exact attribution? Sparse can reduce selected tracked bytes; exact attribution still requires a real lane tree.
- [x] What do shallow history, reference or shared object stores, and clone-on-write change in setup and disk cost without changing write ownership? Shallow and alternates do not reduce dense checkout bytes; the packet already shares objects.
- [x] Can an overlay, copy-on-write directory, or sandboxed lane make one checkout exact without changing the runtime’s path and git assumptions? No: exactness requires a new lane-root and private-Git metadata seam; an environment-only one-worktree design is not exact.
- [x] Which mechanisms break the seven shared dependency roots, workspace self-links, compiled entry-point guards, or the churn detector? COW preserves the link and realpath failures unless dependency roots are reanchored; the churn detector works only when it scans the same merged lane root.
- [x] Does a mechanism preserve relocation and the semantics of git worktree move, or does it require a new mount or path-rewrite protocol? Registered sparse/partial/shallow/reference worktrees preserve Git move/repair; COW, arbitrary sandboxes, and virtual views require external relocation metadata.

## 4. NON-GOALS

- No runtime implementation or packet writeback outside this lineage.
- No new six-lane benchmark; only the packet’s recorded measurements are treated as observed cost data.
- No claim that an unmeasured filesystem’s byte or setup delta is a measured result.
- No replacement of the existing append gateway, state log, or containment contract.

## 5. STOP CONDITIONS

- Stop after iteration 3 because stopPolicy is max-iterations.
- Do not synthesize early if the three focus areas appear converged; record that convergence is telemetry only.
- Treat missing repository evidence as unknown and state the confirming experiment.

## 6. KNOWN CONTEXT

### Packet measurements

- implementation-summary.md:105-106 records 16.5 seconds without worktrees, 149.7 seconds with worktrees for six lanes at concurrency 3, and 1.6 GB of checked-out files per tree with a shared object store.
- handover.md:39-44 repeats the six-lane timing and 1.6 GB checkout measurement.
- decision-record.md:391-425 says worktrees are structural isolation, the degrade path remains, and provisioning is the hot-path cost.

### Runtime seams

- worktree-lifecycle.ts:569-628 creates a detached worktree from HEAD, links dependency roots, and writes a lease after setup.
- worktree-lifecycle.ts:138-158 lists seven shared dependency/build roots; lines 384-475 explain why workspace-internal self-links need lane-local relative rewrites.
- worktree-paths.ts:97-126 keeps writeSurface and containmentRoot in the lane tree while publishTarget stays in the main checkout; executor kinds may keep spawnCwd in the main checkout.
- write-containment.ts:329-336 uses git status porcelain; lines 689-773 snapshot and subtract out-of-scope dirty paths; lines 637-646 cap baseline capture at 2 MiB per file and 64 MiB per lane.
- fanout-run.cjs:3601-3651 snapshots and samples the lane root, and lines 3827-3845 enforce containment with preserve forced for degraded shared-checkout lanes.
- executor-config.ts:683-710 caps concurrency at 8 and defaults worktrees on; lines 785-797 cap expanded manifests at 256 lineages.
- worktree-session.sh:78-87 contains the shared-path list; the packet’s worktree-symlinks synthesis documents the 14 compiled entry-point guards and their silent no-op behavior through linked dist.

### External mechanism references

- Git sparse checkout and worktree-specific configuration: https://git-scm.com/docs/sparse-checkout and https://git-scm.com/docs/git-config
- Git filters, shallow history, alternates, and dissociation: https://git-scm.com/docs/git-clone
- Git worktree move, repair, and per-worktree administrative state: https://git-scm.com/docs/git-worktree
- Overlay lower/upper/work layers and shared lower directories: https://docs.kernel.org/filesystems/overlayfs.html

## 7. RESEARCH BOUNDARIES

- Maximum iterations: 3.
- Convergence threshold: 0.05, but convergenceMode is off.
- Per-iteration budget: 12 tool calls and 10 minutes.
- Required evidence: repository source line, packet measurement line, or authoritative mechanism documentation URL.
- Every iteration must include findings, ruled-out directions, remaining questions, and a novelty justification.

## 8. NEXT FOCUS

Terminal synthesis complete after iteration 3. No further research iteration is scheduled under `stopPolicy: max-iterations`.

## 9. ITERATION 001 RESULT

Sparse plus blobless partial data is the only promising Git-native combination, but it remains a real per-lane worktree. Sparse setup and byte savings are not measured. Shallow and reference/shared modes are ruled out as standalone answers to the checkout cost. The mandatory dependency roots and the symlinked-dist entry guard remain independent failure surfaces.

## 10. WHAT WORKED

- Separating working-tree materialization from object and history storage made the cost claim testable.
- Mapping sparse selection to worktree-paths.ts and write-containment.ts preserved the exact-attribution condition.
- Git’s worktree-specific configuration and move documentation provide a concrete relocation path for sparse settings.

## 11. WHAT FAILED

- A history-only optimization cannot remove the dense checkout that the packet measured.
- An alternate object store cannot repair a lane whose dependency symlinks point back to the main checkout.
- No sparse percentage can be claimed without measuring the runtime and dependency closure.

## 12. RULED OUT DIRECTIONS

- Shallow clone alone: history is truncated, but the working tree remains dense [SOURCE: https://git-scm.com/docs/git-clone].
- Reference/shared clone alone: object storage is already shared by the measured worktree design and alternates add source-lifetime coupling [SOURCE: https://git-scm.com/docs/git-clone; specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106].
- Sparse profiles omitting runtime, packet seed, or dependency closure: they can turn missing inputs into incomplete or silent execution [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:138-158,693-751; specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md:61-75].

## 13. CARRIED-FORWARD OPEN QUESTIONS

- What is the measured byte and setup delta for a mandatory-path sparse profile?
- Which dynamic reads must be included so the profile cannot silently no-op?
- Can a non-worktree filesystem view preserve the same Git index and status semantics?

## 14. ITERATION 002 RESULT

Overlay and sandbox designs can reduce materialized bytes only when every lane has a private upper/write view and private Git index and administrative state. A shared lower or object store is compatible with isolation; a shared upper, index, or status root is not. The current runtime strips Git redirectors, uses explicit `git -C` roots, can leave a child in the main checkout, and treats shared-checkout churn as report-only, so one-worktree environment redirection is not exact. COW also leaves the seven dependency links and compiled entry-point realpath guards unchanged; arbitrary mounts are not covered by Git worktree move.

## 15. WHAT WORKED IN ITERATION 002

- Separating a read-only lower/object store from mutable upper/index ownership exposed the actual attribution boundary.
- Tracing both the lane containment root and the report-only checkout watch explained why a shared checkout can be detected without being attributed.
- Applying the packet’s self-link and compiled-guard reproduction to COW made the dependency risk concrete rather than theoretical.

## 16. WHAT FAILED IN ITERATION 002

- No COW setup or changed-block benchmark was available, so a fractional cost claim remains an inference.
- Environment-only Git redirection cannot override the lifecycle’s redirector stripping and explicit repository roots.
- An unmanaged sandbox cannot inherit Git’s move/repair semantics without a registration or external relocation protocol.

## 17. RULED OUT DIRECTIONS FROM ITERATION 002

- One-worktree environment-only write redirection as exact attribution.
- Shared overlay upper/work state or a shared Git index.
- An unregistered COW directory as a drop-in replacement where Git worktree move is required.

## 18. CARRIED-FORWARD OPEN QUESTIONS

The following were carried into the final matrix and are resolved as research questions; they remain implementation acceptance checks rather than open research questions.

- Which candidate has the smallest measured cost while retaining the full runtime/dependency closure? Sparse plus partial is the first measured candidate; COW remains unmeasured.
- What exact path-routing and registration changes would be needed for a private-upper COW lane to pass the existing containment and relocation tests? A private merged root, Git admin/index state, child cwd, detector, and external mount protocol are required.
- Can the final recommendation preserve both exact attribution and safe relocation without adding a second mutable copy of the entire tree? Yes for registered sparse/partial lanes; no for an unmanaged COW view without a new relocation protocol.

## 19. ITERATION 003 RESULT

The complete matrix selects sparse plus blobless partial data inside registered worktrees as the lowest-risk exact optimization. Shallow and reference/shared modes do not remove dense checkout cost. Private-upper COW may reduce disk further but requires a new merged-root and private-Git seam; one-worktree environment redirection is not exact. Git move/repair is retained only by registered worktrees; arbitrary filesystem views need external relocation state.

## 20. FINAL STATE

- All five key questions are resolved at iteration 3.
- Required iterations completed: 3/3.
- New-info ratios: 0.91, 0.84, 0.78; average 0.8433.
- Convergence mode: off; convergence telemetry did not stop the loop early.
- Terminal stop reason: `maxIterationsReached`.
- Remaining work is implementation validation only: measure the sparse closure and COW variants, then exercise dependencies, guards, churn, containment, and relocation.
