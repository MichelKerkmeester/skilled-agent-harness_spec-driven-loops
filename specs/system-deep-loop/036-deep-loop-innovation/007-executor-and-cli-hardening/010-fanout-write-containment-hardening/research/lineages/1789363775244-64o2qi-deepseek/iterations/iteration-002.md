# Iteration 2: Non-git mechanisms — where attribution dies

## Focus

Evaluate the non-git family — overlay/copy-on-write filesystems, a single worktree with
per-lane write redirection, per-lane sandboxed working directories with a shared object store,
and one-checkout exact-attribution variants (per-lane index files, `checkout-index --prefix`) —
against the single non-negotiable: exact attribution through the churn detector.

## Findings

### F2.1 The attribution invariant: exactness comes from the per-lane index + tree, and nothing else

The churn detector is exact only because the lane's tree is a git working tree of the same repo
with its own per-worktree index: `git status --porcelain=v1 -z --no-renames --untracked-files=all`
keys every dirty path to the lane's tree, and the shared checkout is not a party to the run
([SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:315,744-773]).
The guard's own header says the remedy is preservation precisely because "the tree cannot say
which writer made a change" on a shared checkout ([SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:14-19]),
and the 2026-09-08 incident (1,858 tracked paths belonging to a live interactive session)
is what a guess-based attribution cost ([SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:56]).
Any mechanism that keeps ONE shared tree and redirects writes therefore keeps the guessing; the
minimum exact unit is a per-lane index plus a per-lane tree — which is what a worktree is.

### F2.2 Copy-on-write / overlay filesystems win disk and lose everything that matters

APFS clonefile (`cp -c`) or an overlay mount gives near-zero marginal disk per lane and
O(files) setup — the best possible disk answer. But the lane directory is not a git working
tree, so: the post-dispatch detector HARD-FAILS when the repo is resolvable and the artifact
dir is outside the worktree (`throw new Error("artifact scope ... outside the git worktree —
containment cannot be enforced")`), and fails OPEN only when no git toplevel exists at all
([SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:744-752]).
The baseline snapshot fails open and the detector then either throws or reports nothing — either
way the lane is unwatched. A CoW copy placed INSIDE the repo is worse: git status reports 82k
untracked duplicate files, and the lane's edits are invisible to the shared index. Git coherence
also breaks: the lane's tree bytes are not what its (nonexistent) index expects, so any later git
operation sees the whole tree as modified. The sweep cannot reclaim the dir (`removeLineageWorktree`
runs `git worktree remove` + `prune`, which only work on registered worktrees,
[SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-reclaim.ts:309-314]),
and the self-link story returns: a wholesale CoW copy carries the workspace self-links pointing
into the copy (benign), but any symlinked dependency root instead re-anchors them into the source
checkout (breakage class 1/2). Portability: clonefile is macOS-only; overlayfs needs Linux +
privilege; the runner is a cross-platform node process. Verdict: disk-only win; attribution,
detector, sweep, and git coherence all break; rejected as a replacement.

### F2.3 Single worktree with per-lane write redirection is the scored-and-rejected 3/10, now with a detector that proves it

"One shared worktree for the whole run" was already weighed and scored 3/10: sibling lineages
write concurrently into one tree, "misattribution moved one level down rather than solved"
([SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:276]).
The redirection variant (lanes told to write only their dir) adds prompt-level discipline on top,
which is exactly the weakness the packet replaced: five of seven executor kinds reach their tree
only through spawn cwd or a read root, two through a `--dir` flag
([SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:79-127]),
and prior research established that rewriting every path in the prompt pack and dispatch flags is
"a project, not a flag" (packet synthesis §4). When the executor ignores the redirection, its
cwd-relative write lands in the shared checkout, which is the gap ADR-005's watch covers —
report-only, never restoring ([SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:480-486]).
Setup ~0, disk ~0, attribution heuristic — the exact trade the packet's ADR-003/004 rejected.
The one legitimate place for this mechanism is the degrade path, which is where it already lives:
worktree creation failure → shared checkout under forced preserve, counted in the isolation tally
([SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:401-403]).

### F2.4 Per-lane sandboxed directories with a shared object store collapse into either F1.3 or F2.2

A plain sandbox directory plus a shared object store is not a git object store user: without a
repo identity the store is unreachable, and the detector is blind to the sandbox (F2.2's
hard-fail/fail-open). Make the sandbox a git repository and it is a clone (iteration 1 F1.3:
new repo boundary, sweep machinery breaks, full tree). Make it a linked worktree and it IS the
current mechanism. The "shared object store" phrase therefore adds nothing on its own; the
only way to give a sandbox exact attribution is to give it a git identity, and every git
identity cheaper than a full worktree is the sparse worktree of iteration 1.

### F2.5 The per-lane-index variant (hand-rolled sparse) recreates the "watch the wrong tree" bug

A lane built from `GIT_INDEX_FILE=<lane-index>` + `git read-tree HEAD` +
`git checkout-index --prefix=<lane>/` materializes a partial tree with a lane-local index and
no worktree registration. It has sparse's disk profile, but: the runner's status calls do NOT
use a custom index (only `git hash-object` runs against a scratch index,
[SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:398-400];
`readStatusEntries` reads the repo default index), so the detector would diff the SHARED
checkout while the lane writes its own tree — the "containment would watch the wrong tree"
failure the packet's prior research identified as the exact bug recreated by the fix
([SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/research/synthesis.md:26-27]).
Sweep, lease, `git worktree remove` all require registration; without it, interrupted lanes are
orphan directories nobody reclaims. Verdict: sparse worktree minus registration — strictly
dominated by iteration 1's sparse worktree.

### F2.6 The one-checkout-exact-attribution question has a definite answer

"Keep one checkout but make attribution exact without a full tree" is satisfiable ONLY as a
sparse worktree: one repository (so one object store, one ref namespace, one sweep prefix), a
per-lane tree that is a strict subset of the tracked tree (so no full materialization), and a
per-lane index that makes every status walk exact. Literally one shared tree cannot be exact:
git has no per-writer identity for writes into a tree it shares, which is the invariant F2.1
names. The choice is not "worktree vs something cheaper" but "sparse worktree vs something
that loses the guarantee the packet exists to provide."

## Sources Consulted

- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:14-19,315,398-400,702-752,744-773
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:79-127
- file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-reclaim.ts:309-314
- file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:56,276,401-403,480-486
- file:specs/system-deep-loop/045-fanout-write-containment-hardening/research/synthesis.md:26-27
- macOS APFS clonefile semantics (`cp -c`); Linux overlayfs requirements (verified in iteration 3)

## Assessment

- **newInfoRatio**: 0.9
- **Novelty justification**: The attribution invariant (F2.1), the detector's hard-fail vs
  fail-open split under non-worktree lanes (F2.2), and the wrong-tree recreation in F2.5 are new;
  F2.3 restates a scored decision from the packet (partially known).
- **Confidence**: High on code-grounded claims (detector behavior, levers, reclaim); medium on
  CoW portability details (platform-specific; web-verified in iteration 3).

## Reflection

- **What worked**: Reading the detector's scope resolution directly settled the sandbox question —
  the fail-open carve-out is narrow (no git toplevel at all), and the common case (repo exists,
  artifact dir outside worktree) is a hard throw, not a soft miss.
- **What failed / ruled out**: CoW/overlay (attribution and machinery break), single-worktree
  redirection (scored 3/10 already; report-only watch proves the residual gap), plain sandbox
  dirs (detector-blind), per-lane index without registration (wrong-tree detection).
- **Open thread for iteration 3**: the sparse worktree wins the git-native family; what remains
  is (a) the cone granularity trap (per-family vs per-packet), (b) the per-worktree config
  plumbing (`extensions.worktreeConfig`) so the main checkout does not become sparse, (c) what
  the runner must change to adopt it, and (d) relocation survival for each mechanism.

## Recommended Next Focus

Iteration 3: frontier — compare sparse vs the non-git family on a single cost table, verify the
git behaviors (sparse-checkout per-worktree config, `git worktree move` on sparse trees,
partial-clone local semantics) against git documentation, and specify the runner adoption path
(cone computation, seed superset, worktreeConfig, containment/publish unchanged).
