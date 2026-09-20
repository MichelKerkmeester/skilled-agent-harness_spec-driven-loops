---
title: "Lower-Cost Exact Fan-Out Write Isolation — Research Synthesis"
trigger_phrases: []
---

# Lower-Cost Exact Fan-Out Write Isolation — Research Synthesis

## 1. Executive Summary

The safest first optimization is sparse checkout combined with blobless partial data inside the existing registered per-lineage Git worktree. It attacks materialized tracked bytes while retaining the physical working-tree, private index, explicit status root, and Git-managed relocation semantics that make attribution exact. Its setup and byte savings are not measured in this lineage.

Overlay or copy-on-write (COW) views are the best theoretical absolute disk reducer, but only if each lane owns a private mutable upper/write view, private Git index and worktree administrative state, and one merged root used by the executor, child processes, Git status, containment, and churn detection. That is a new runtime seam, not a configuration switch. A single physical checkout with environment-only write redirection is not exact under the current code.

The packet’s observed baseline is 16.5 seconds for six lanes without worktrees versus 149.7 seconds with worktrees at concurrency 3, and 1.6 GB of checked-out files per tree; the object store is shared [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:98-110]. No alternative was benchmarked here, so every fractional cost claim is derived or inferred. The terminal loop stop is `maxIterationsReached` after three iterations; convergence mode was off.

## 2. Research Question and Scope

The question was whether the same parallel fan-out and exact write attribution can be preserved at a fraction of the registered worktree’s checkout cost. The comparison covered sparse and partial checkouts, shallow history, reference/shared clones, overlay/COW filesystems, one worktree with per-lane write redirection, per-lane sandbox directories with a shared object store, and a one-checkout virtual filesystem view.

“Exact attribution” means four things together: each lane has a distinct mutable write root; Git status and index ownership are private; every child process and symlink resolves through the same lane view; and containment can observe all candidate writes. Shared immutable Git objects or a read-only lower layer do not violate that definition. A shared mutable checkout, upper layer, index, or status root does.

Research did not implement a runtime change or run a new six-lane benchmark. The packet measurements are the only observed cost data. The required iteration executor was satisfied inline in this session; no nested CLI, agent, or subprocess iteration dispatch was used.

## 3. Decision

First measure and, if the closure test passes, implement sparse plus blobless partial data within a registered detached worktree. Keep the existing lane-local `writeSurface` and `containmentRoot`, the main-checkout `publishTarget`, the seven dependency-root rules, uncommitted working-tree seeding, relative workspace self-links, and compiled-entry negative controls [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:97-126; .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:138-158,560-751; specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md:45-75].

Do not adopt shallow history or reference/shared objects as standalone checkout-cost fixes. They can be secondary choices for history or object transfer, but the packet already shares objects and a dense snapshot remains. Do not call environment-only Git or file-write redirection exact. Treat private-upper COW as a separate feature requiring a measured implementation and a new lane-view contract. A literal one-physical-checkout solution is not available without virtualizing all filesystem and Git boundaries; once that is done, it is logically a set of lane views rather than one shared worktree.

## 4. Baseline and Evidence Posture

The packet reports 16.5 seconds without worktrees and 149.7 seconds with worktrees for six lanes at concurrency 3, a 133.2-second wall-time difference in that run. It reports 1.6 GB of checked-out files per tree and roughly 9.6 GB for six trees, while the Git object store is shared [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:98-110; specs/system-deep-loop/045-fanout-write-containment-hardening/handover.md:39-44]. The packet’s decision record describes provisioning as the hot-path cost and worktrees as the structural isolation fix [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:391-425].

The HEAD tree count observed during iteration 1 was 82,393 tracked entries from `git ls-tree -r --name-only HEAD | wc -l` with exit 0. That is a count, not a byte measurement. Sparse percentage, partial-clone fetch latency, COW changed-block amplification, mount setup, and sandbox setup were not measured. The resource map records the distinction between observed, derived, and inferred claims [SOURCE: resource-map.md].

## 5. Current Repository Contract

The current lifecycle creates a detached registered worktree from `HEAD`, then links dependency/build roots, and writes its lease only after setup succeeds [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:560-628]. The seven default shared paths are:

1. `.opencode/skills/system-spec-kit/node_modules`
2. `.opencode/skills/system-spec-kit/runtime/node_modules`
3. `.opencode/skills/system-spec-kit/runtime/dist`
4. `.opencode/skills/system-spec-kit/runtime/cli/dist`
5. `.opencode/skills/system-spec-kit/runtime/cli/node_modules`
6. `.opencode/skills/system-deep-loop/runtime/node_modules`
7. `.opencode/skills/system-spec-kit/shared/dist`

Those roots are outside the `HEAD` snapshot because they are ignored. Internal workspace links are detected; the scope containing a self-link becomes a real directory and the link is rewritten to a relative target inside the lane. The implementation explains that a wholesale symlink re-anchors through its physical location and can send a lane back to the source checkout [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:138-158,384-507].

The path resolver maps a worktree lane’s write and containment roots into the lane but leaves publish output in the main checkout. Some executor kinds retain the main checkout as `spawnCwd` [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:97-126]. The lifecycle strips Git environment redirectors including `GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`, object-directory, alternate-object, and config variables before running Git with `-C` [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:163-183,280-307].

## 6. Mechanism Comparison

Cost labels are intentional: **measured** is packet evidence; **derived** follows from documented behavior and the current code; **UNKNOWN** means this lineage did not benchmark the variant.

| Mechanism | Setup cost | Disk cost | Exact attribution | What breaks here | Move/relocation |
|---|---|---|---|---|---|
| Sparse checkout in a registered worktree | `git worktree add` plus sparse configuration; delta UNKNOWN | Selected tracked paths can be below the measured 1.6 GB/tree; delta UNKNOWN (derived) | Yes, with private worktree/index/status root | Sparse does not include ignored dependency roots; closure, self-links, compiled guards, and lane-root churn checks remain mandatory | Git move/repair survives; sparse state must be worktree-specific and links relative |
| Sparse + blobless partial | Sparse setup plus lazy blob fetch; delta UNKNOWN and network latency possible | Best Git-native candidate for fewer materialized paths and fewer initially retained blobs; delta UNKNOWN | Yes, still only as a registered lane tree | Same closure and guard risks; lazy fetch must fail loudly rather than become a silent no-op | Registered move survives; promisor/alternate paths must remain reachable |
| Shallow history | Depth setup/fetch; delta UNKNOWN | History/object bytes may fall, but dense working tree remains (derived) | Yes only when paired with private lane tree; no checkout attribution benefit | Same dependency/self-link/guard/churn behavior; history consumers may break | Registered move survives; shallow assumptions travel with repository |
| Reference/shared clone or alternates | Reference setup; delta UNKNOWN | Object copying is already avoided by the packet’s shared store; dense checkout remains | Yes only with private worktree and metadata | Does not fix links, guards, or status root; source lifetime/pruning coupling | Registered move survives; alternate path must stay valid or be dissociated |
| Overlay/COW with private upper/work and private Git admin | Mount and private metadata setup UNKNOWN | Potentially fractional initial bytes; changed-block amplification UNKNOWN | Conditional yes after a new merged-root and private-Git seam | Lower symlinks still point at main; self-links/guards need reanchor; hidden upper writes evade the wrong detector root | Git move does not manage mount/upper/work; external remount/relocation protocol required |
| Per-lane sandbox directory + shared object store | Depends on clone/COW and private metadata; UNKNOWN | COW/changed bytes potentially low; object sharing is already baseline | Yes only with private index/admin/status root; no if it writes back to one checkout | Same seven-root, self-link, guard, and detector conditions | Works with Git move only when registered; arbitrary sandbox needs repair metadata |
| One worktree + environment-only write redirection | Lowest theoretical setup; no extra checkout (derived) | Near-zero extra bytes in theory; not measured | No under current explicit Git/path seams | Combined status/churn, shared symlink targets, missed child/cwd writes, and no lane ownership | No independent lane registration or move target |
| One checkout + complete virtual filesystem/path router | High engineering/setup cost UNKNOWN | Potentially low materialization; UNKNOWN | Conditional only if every read/write, Git call, child cwd, realpath, and detector view is virtualized | Existing dependency and guard code must become view-aware; any un-routed write breaks exactness | Custom view relocation protocol; Git move alone is insufficient |

All private-lane candidates can preserve the same concurrency shape in principle, subject to the runtime’s configured cap of eight and expanded-lineage cap of 256 [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:683-710,785-797]. No candidate’s resource profile at that concurrency was measured here.

## 7. Git-Native Reductions

Sparse checkout is the only Git-native mechanism examined that directly removes selected tracked files from the materialized working tree. Git documents sparse patterns and worktree-specific configuration [SOURCE: https://git-scm.com/docs/sparse-checkout; https://git-scm.com/docs/git-config]. It preserves exact attribution because the registered worktree and its index remain distinct; sparse omission is instead a completeness risk. The implementation would need a no-checkout or post-add sparse step before trusting the lane, then reuse current working-tree seed behavior for uncommitted packet bytes [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:592-628,693-751].

Blobless partial data is complementary: Git’s clone documentation describes filtered/lazy object acquisition, not a reduced dense working tree [SOURCE: https://git-scm.com/docs/git-clone]. Shallow depth changes history reachability, not the checked-out snapshot. Reference/shared clones use alternates and the packet already observes a shared object store; the additional benefit is therefore limited to a different object-store setup, while source pruning creates a lifetime risk [SOURCE: https://git-scm.com/docs/git-clone; specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106].

The practical Git-native candidate is sparse plus blobless partial inside a real worktree. It can plausibly reduce both selected working-tree bytes and initial blob transfer, but no percentage, byte count, setup time, or fetch latency should be stated until the mandatory closure is measured. A sparse lane that omits `.opencode`, command configuration, packet seed, or dynamic dependency reads is not a successful cheap lane; it is an incomplete execution.

## 8. Overlay, COW, and Sandboxed Views

OverlayFS documents a shared lower layer and mutable upper/work layers, with upper/work state belonging to a mount. The safe shape is one read-only lower plus one upper/work pair per lane [SOURCE: https://docs.kernel.org/filesystems/overlayfs.html]. A shared lower or immutable Git object store is compatible with exact attribution. A shared upper/work directory, shared `.git` index, or shared worktree metadata is not.

The current session is on macOS, while the cited OverlayFS contract is Linux-specific. It is therefore a portability reference for the required lower/upper/work ownership model, not a claim that this checkout can mount OverlayFS locally. APFS clones or another host-native COW primitive would need the same private mutable boundaries and their own benchmark; no such measurement was made.

The current runtime’s explicit Git root matters. Lifecycle calls remove the Git variables that could redirect an index or worktree, then invoke `git -C` against the selected root [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:163-183,294-307]. A COW view can therefore be exact only with a private Git administrative/index arrangement recognized by the runtime or by an intentionally new seam. Copy-on-write file bytes alone do not create a Git worktree registration.

A sandbox with a private index and status root has the same semantics as a lightweight independent lane and may share immutable objects. A sandbox that merely redirects writes into one checkout is the rejected one-worktree design. The packet’s object sharing means “shared object store” is not a new savings claim; the worktree checkout remains the dominant measured component [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106].

No COW or sandbox benchmark was run. “Fractional disk” and “faster setup” are hypotheses that must report initial apparent bytes, unique blocks after a representative write, setup wall time, mount/teardown time, and concurrent six-lane behavior separately from the existing 1.6 GB/149.7-second baseline.

## 9. Single-Checkout Redirection and Virtual Views

Environment-only redirection is not a transparent lane boundary in this repository. The lifecycle strips `GIT_DIR`, `GIT_WORK_TREE`, `GIT_COMMON_DIR`, `GIT_INDEX_FILE`, object, alternate, and config redirectors and supplies an explicit `-C` root [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:163-183,280-307]. The containment scanner likewise executes status against an explicit `repoRoot` and compares current entries with the pre-dispatch baseline [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:282-336,689-773].

Even if those variables were accepted, they would not cover ordinary Node filesystem writes, cwd-relative child processes, symlink realpaths, compiled module identity, or the resolver’s `spawnCwd` behavior. A complete path router or virtual filesystem could cover them, but it would need to make every path operation, Git operation, child cwd, realpath, publish path, and detector view lane-specific. That can be exact, but it is a new virtual-lane implementation, not one shared worktree with a small redirect.

## 10. Dependency, Realpath, and Churn Failure Modes

The storage layer does not solve physical link topology. A COW lower containing a symlink from a dependency root into the main checkout keeps that target; it does not reanchor it to the lane. The current lifecycle detects repository-internal self-links, makes the scope’s ancestor directories real, and writes relative links to the lane target precisely because a wholesale symlink or a symlinked ancestor can re-anchor back to the source checkout [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:394-475].

The compiled guard is a concrete negative control. The packet records 14 guards with the shape `path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)` and reproduces a linked-`dist` execution that exits 0 without producing output when the two physical spellings differ [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md:51-75]. Every sparse, COW, and sandbox proposal must preserve the same realpath identity or provide a tested guard change.

Containment parses `git status --porcelain=v1 -z --no-renames --untracked-files=all`, snapshots out-of-scope dirty paths, and computes new violations as current status minus the pre-dispatch baseline [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:314-336,689-773]. The fan-out runner samples the selected lane root and, when a process can start in the main checkout, separately watches that checkout. A burst latches preserve mode, while `checkout_write_detected` is report-only because another writer may own the path [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3591-3651,3827-3905].

For COW, the detector must scan the merged lane root and use the lane’s private Git metadata. If the upper directory lives outside that view and the detector keeps scanning the main checkout, lane writes disappear from the evidence. If a one-checkout design relies on the report-only watch, it has detection but not exact ownership. The bootstrap realpath logic can choose the physical Git top-level that contains an artifact, but it does not virtualize arbitrary filesystem calls [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs:43-73].

## 11. Recommendations

1. Measure sparse plus blobless partial inside the registered worktree lifecycle first. Build the sparse set from actual runtime, command, packet, and executor reads; retain the seven ignored roots and the self-link rewrite; seed modified, staged, and untracked working-tree bytes; and fail loudly on missing blobs or modules.
2. Keep exact attribution as the gating invariant. Require a private physical or merged lane root, private Git status/index metadata, lane-consistent child cwd and realpaths, and detector visibility. Shared immutable objects or lower layers are an optimization, not an attribution boundary.
3. Preserve Git-managed relocation by keeping the first implementation a registered worktree. Test `git worktree move` and repair after sparse configuration, dependency relinking, compiled guard execution, containment, and status.
4. Treat private-upper COW as a separately scoped runtime feature. It must own mount creation, private Git metadata, path resolution, child-process routing, dependency reanchoring, churn sampling, teardown, and external relocation state before it can replace worktrees.
5. Reject literal one-checkout environment redirection. If its cost target is mandatory, design and measure a virtual filesystem/lane-view subsystem openly; do not call a shared-checkout warning or a write-back directory exact attribution.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Shallow clone alone | Truncates history but leaves the dense working tree that contributes to the 1.6 GB checkout | [SOURCE: https://git-scm.com/docs/git-clone] | 1, 3 |
| Reference/shared clone alone | Saves object duplication already avoided by the packet’s shared store, not checkout bytes; adds source-lifetime coupling | [SOURCE: https://git-scm.com/docs/git-clone; specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106] | 1, 3 |
| Sparse profile without runtime/dependency closure | Missing inputs can produce incomplete execution or a silent compiled-entry no-op | [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:138-158,693-751; specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md:61-75] | 1, 3 |
| One physical worktree with environment-only write redirection | Explicit `git -C`, redirector stripping, shared cwd cases, and report-only checkout watch cannot assign every write exactly | [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:163-183,294-307; .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3611-3651,3880-3905] | 2, 3 |
| Shared overlay upper/work or shared Git index | Collapses mutable ownership; OverlayFS upper/work and Git status/index state must be lane-private | [SOURCE: https://docs.kernel.org/filesystems/overlayfs.html; .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:329-336,740-773] | 2 |
| Wholesale COW/sandbox view of shared dependency roots | Does not reanchor workspace self-links or compiled-entry realpath guards | [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:394-475; specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md:51-75] | 2, 3 |
| Unregistered COW or sandbox as a drop-in worktree | Git move/repair does not manage arbitrary mount, upper/work, or sandbox metadata | [SOURCE: https://git-scm.com/docs/git-worktree] | 2, 3 |

## Divergence Map

- Divergent convergence mode was off; no parallel pivot or Council artifact was used.
- Productive directions were separated by ownership: sparse/partial for materialization, shared objects for immutable storage, and COW only when paired with private upper/index/path state.
- Saturated directions were shallow/reference alone, environment-only redirection, shared mutable Git/filesystem state, unmanaged COW for relocation, and incomplete sparse closure.
- No failed research pivot remained hidden; all rejected directions and their evidence are listed above.
- Remaining frontier is empirical: mandatory sparse closure, COW changed-block/setup costs, child-process path routing, compiled guard behavior, churn attribution, and relocation tests.

## 12. Open Questions

All five research questions are answered. The remaining items are implementation acceptance measurements rather than unresolved mechanism conclusions:

- What is the six-lane setup, materialized-byte, and lazy-fetch delta for a mandatory-path sparse-plus-partial profile?
- What is the initial and changed-block cost of a private-upper COW lane, and can its private Git admin/index seam be made robust?
- Which dynamic reads must be added to the sparse closure so no missing input becomes a silent no-op?
- Does the chosen implementation preserve relative self-links, compiled guard identity, containment, churn reporting, and relocation after `git worktree move`?

## 13. Relocation and Move Semantics

Git’s registered linked-worktree state is the only candidate with native move/repair semantics. Sparse, partial, shallow, and reference variants can remain registered worktrees, so Git can update their administrative location; worktree-specific sparse configuration and reachable alternates still need validation [SOURCE: https://git-scm.com/docs/git-worktree; https://git-scm.com/docs/git-config]. The runtime’s self-link implementation deliberately writes relative link text because relocation must not leave absolute links pointing to the old checkout [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:466-475].

An overlay mount, upper/work directory, sandbox root, or virtual view is external state. Moving its directory does not update mount registration, private Git paths, child process configuration, or dependency links. Such a design can be relocated safely only with an explicit protocol that moves or recreates every component and then reruns status, guard, and containment checks. `git worktree move` alone is insufficient. A single shared worktree has no independent lane to move.

## 14. Acceptance Plan

1. Provision six registered sparse-plus-partial lanes at concurrency 3. Record setup wall time, materialized bytes, unique object bytes, lazy fetch count/latency, and comparison with the packet’s 16.5/149.7-second and 1.6 GB baseline.
2. Derive and assert the complete closure: runtime source and dist, command YAML, packet seed, all seven dependency/build roots, dynamic imports, and every path required by the executor. Missing closure must fail before research execution.
3. Seed modified-tracked, staged, untracked, ignored, deleted, and renamed sentinels. Check `git status` and containment from each lane, then write inside and outside the lineage artifact. Require exact lane attribution and preserve-safe handling of pre-existing dirty bytes.
4. Exercise all 14 compiled entry guards through the lane’s physical spelling and the linked dependency roots. Keep the reproduced exit-0/no-output path as a negative control.
5. Run a concurrent shared-writer/churn test. Confirm lane-root sampling sees lane writes, the checkout watch reports shared-cwd writes without claiming ownership, and preserve mode latches after the configured burst.
6. Move and repair a sparse/partial registered worktree. Re-run relative self-links, module realpaths, entry guards, status, containment, and publish mapping after relocation.
7. If COW is implemented, repeat steps 1–6 with separate upper/work and Git admin/index directories per lane, measuring apparent and changed-block disk plus mount lifecycle. A COW result fails if any detector or child process still sees the lower/main checkout.

## 15. Risks and Trade-offs

- Sparse/partial lowers cost only if closure is complete; it can otherwise make a successful-looking but incomplete execution.
- Lazy blobs can move cost from setup to execution and may introduce shared fetch contention; this is unmeasured.
- Reference alternates have source-lifetime and pruning coupling; they do not improve exactness.
- COW may reduce initial bytes while amplifying writes in upper layers; its setup, cleanup, and relocation state increase implementation complexity.
- A virtual path router could meet a one-checkout disk target, but every unhandled path is an attribution escape, and Git worktree move no longer owns the full lifecycle.
- Keeping registered worktrees costs disk, but it gives the current code a simple physical boundary, explicit status root, and native relocation model. The recommended optimization narrows that cost without weakening those contracts.

## 16. Iteration Trail

| Iteration | Focus | New-info ratio | Result |
|---|---|---:|---|
| 1 | Sparse, partial, shallow, and reference approaches | 0.91 | Sparse plus partial is the only promising Git-native cost lever; exactness remains a real worktree property |
| 2 | Overlay, COW, sandbox, and one-worktree redirection | 0.84 | Private mutable upper/index/path state is required; shared-checkout redirection is not exact |
| 3 | Complete attribution and relocation matrix | 0.78 | Sparse plus partial is the lowest-risk first experiment; COW is a separate future seam |

Convergence telemetry was not used to stop the loop. The configured threshold was 0.05, but `convergenceMode` was off and the loop ran to the required cap.

## 17. Terminal Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining research questions: 0
- New-info ratios: 0.91 → 0.84 → 0.78
- Average new-info ratio: 0.8433 (derived)
- Convergence threshold: 0.05
- Convergence mode: `off`
- Terminal decision: measure sparse plus blobless partial in registered worktrees first; do not treat one-checkout redirection as exact; scope COW as a separate runtime feature.

The packet-root reducer and graph database were not invoked because the user bound the entire write surface to this lineage. The local registry, dashboard, strategy, and resource map were maintained inside the lineage. Iteration state writes used the append gateway, followed by workflow-owned route-proof projection records required by the lineage verifier. No packet files outside the lineage were modified.
