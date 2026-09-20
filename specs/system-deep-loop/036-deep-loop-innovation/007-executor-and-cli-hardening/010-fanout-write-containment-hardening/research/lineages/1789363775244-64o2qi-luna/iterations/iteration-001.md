# Iteration 001

## Focus

Git-native reductions: sparse checkout, partial clone, shallow history, and reference or shared object stores. The objective was to distinguish mechanisms that reduce the materialized 1.6 GB lane tree from mechanisms that only reduce Git history or object transfer.

## Actions Taken

1. Read the packet measurements and worktree decision records. The packet records 16.5 seconds without worktrees versus 149.7 seconds with worktrees for six lanes at concurrency 3, and 1.6 GB of checked-out files per tree with a shared object store [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:98-106].
2. Read the worktree lifecycle and path-resolution code. The current lifecycle runs git worktree add --detach at worktree-lifecycle.ts:569-628, links seven dependency/build roots from lines 138-158, and maps write and containment roots into the lane while retaining a main-checkout publish target at worktree-paths.ts:97-126.
3. Read the containment implementation. It parses git status porcelain at write-containment.ts:314-336, snapshots out-of-scope dirty paths and optional bytes at lines 689-738, and computes new violations as current dirty paths minus the pre-dispatch baseline at lines 740-773.
4. Checked the current HEAD tree size as a local observation: git ls-tree -r --name-only HEAD | wc -l returned 82393 with exit 0. This is a count of tracked entries, not a replacement for the packet’s 1.6 GB measurement.
5. Consulted the Git sparse-checkout, git-config, git-clone, and git-worktree documentation, plus the Linux OverlayFS documentation for terminology used in later iterations [SOURCE: https://git-scm.com/docs/sparse-checkout; https://git-scm.com/docs/git-config; https://git-scm.com/docs/git-clone; https://git-scm.com/docs/git-worktree; https://docs.kernel.org/filesystems/overlayfs.html].

## Findings

- Sparse checkout is the only Git-native choice in this pass that can reduce materialized tracked bytes. Git records skipped paths in the index and omits them from the working tree; the official documentation also says worktree-specific configuration is enabled so each worktree can carry its own sparsity. This can cut the checkout component of the lane cost, but the percentage is UNKNOWN because the packet measures the full tree and does not provide a mandatory-path sparse profile [SOURCE: https://git-scm.com/docs/sparse-checkout; https://git-scm.com/docs/git-config; command observation recorded above].
- Sparse checkout preserves exact attribution only when it remains a real linked worktree. The runtime’s containment root is derived from the lane tree, and the detector asks Git for status relative to that root [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:97-126; .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:329-336,740-773]. Sparse paths change what is present and how status treats skipped entries, but they do not make two lanes share a physical working directory. A file outside the sparse set that is never materialized cannot be used by the executor; that is a completeness failure, not a proof of wrong-lane attribution.
- The current lifecycle cannot become sparse merely by changing a cost flag. It invokes git worktree add --detach with the default checkout at worktree-lifecycle.ts:592-595, then links dependencies and writes a lease at lines 603-628. A sparse implementation would need a no-checkout or post-add sparsify step before the lane is trusted, and it would need to seed the packet’s uncommitted bytes using the existing working-tree seed semantics [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:560-628,693-751; https://git-scm.com/docs/git-worktree].
- Sparse selection must include the runtime closure. Seven paths are deliberately outside HEAD’s normal checkout and are linked by the lifecycle [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:138-158]. The wrapper has the same shared-path list [SOURCE: .opencode/bin/worktree-session.sh:78-88]. Sparse checkout does not repair a wholesale node_modules or dist symlink: the packet’s link-resolution investigation records that workspace self-links can still resolve to the main checkout and a symlinked dist can make compiled entry guards silently no-op with exit 0 [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md:45-75]. The lane therefore needs real ancestor directories, relative self-links, and a lane-local dist or an independently verified guard.
- Partial clone with filter=blob:none reduces objects transferred or retained until a blob is needed; it does not by itself reduce the number of working-tree files that a dense checkout materializes. Git documents blob filtering as lazy object acquisition, while the packet already has a shared object store for worktree lanes [SOURCE: https://git-scm.com/docs/git-clone; specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106]. Partial clone is useful when combined with sparse checkout or when creating a fresh repository, but it is not a standalone answer to the 1.6 GB checkout cost. A lazy fetch may add setup latency and shared-object-store churn, neither measured here.
- Shallow history is a history-size optimization, not a working-tree optimization. Git documents --depth as truncating commit history [SOURCE: https://git-scm.com/docs/git-clone]. It leaves the checked-out snapshot essentially dense, so it does not address the measured checkout footprint. The cited fan-out lifecycle uses HEAD, status-independent path seeding, and worktree registration; no deep-history requirement was found in this pass, but a complete command inventory is still needed before adopting a shallow repository as the source.
- Reference or shared clones save object storage, not checkout storage, and therefore add little to this repository’s current design. Git’s --reference and --shared modes use alternates, while --dissociate copies borrowed objects back into the clone; the packet already reports the object store as shared rather than copied [SOURCE: https://git-scm.com/docs/git-clone; specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:106]. Attribution remains exact only if every lane still has its own working-tree and Git metadata. Shared alternates also create a lifetime and maintenance dependency: Git warns that source-side object pruning can corrupt a shared clone [SOURCE: https://git-scm.com/docs/git-clone].
- The best Git-native candidate is sparse plus blobless partial data, still wrapped in a real per-lane worktree. It can plausibly reduce both selected working-tree bytes and object transfer, but the result is a smaller exact lane rather than one checkout. Its setup cost, byte delta, and lazy-fetch behavior are unmeasured; the acceptance experiment must exercise all seven linked roots, uncommitted packet seeding, status scanning, and a file write in and outside the sparse set.

## Questions Answered

- Sparse checkout is the only option in this pass that directly attacks materialized tracked bytes; partial clone and shallow or reference modes primarily attack history or objects.
- Exact attribution remains available for sparse or shallow/reference variants only when the lane still has a distinct physical working tree and per-worktree Git metadata.
- Sparse and partial modes do not remove the repository-specific dependency-link, workspace-self-link, compiled-entry-point, or baseline/status obligations.
- A sparse-plus-partial lane can survive Git-managed relocation in principle when worktree-specific config and relative administrative paths are preserved, but external dependency links and alternates remain separate relocation risks.

## Questions Remaining

- What is the actual byte and setup delta for a sparse profile containing the runtime, command YAMLs, packet seed, and all dependency closure?
- Does this repository’s current Git version keep sparse patterns and fsmonitor state correctly isolated for all lanes when extensions.worktreeConfig is enabled?
- Which source paths are read dynamically by each executor, so a sparse profile does not turn a silent no-op into an apparently successful iteration?

## Ruled-Out Directions

- Shallow clone alone is ruled out as a solution to the measured checkout footprint: it truncates history but does not make the working tree sparse [SOURCE: https://git-scm.com/docs/git-clone].
- Reference or shared clone alone is ruled out as a solution to per-lane checkout cost: the object store is already shared in the measured worktree design [SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105-106].
- A sparse profile that omits runtime or dependency-closure paths is ruled out for production use until the lane fails loudly on missing inputs; otherwise it risks an incomplete execution being mistaken for a clean result [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:138-158,693-751; specs/system-deep-loop/045-fanout-write-containment-hardening/research/worktree-symlinks/synthesis.md:61-75].

## SCOPE VIOLATIONS

None. Packet reducer writeback, spec mutation, validation, build, checkout, and commit operations were not invoked because the detached lineage’s write surface is the specified lineage directory.

## Next Focus

Iteration 2: Overlay and copy-on-write layers, per-lane sandbox directories with a shared object store, and one-worktree write redirection. Test whether filesystem-level copy-on-write can preserve the exact status boundary without inheriting a shared Git index or bypassing the runtime’s path resolution.
