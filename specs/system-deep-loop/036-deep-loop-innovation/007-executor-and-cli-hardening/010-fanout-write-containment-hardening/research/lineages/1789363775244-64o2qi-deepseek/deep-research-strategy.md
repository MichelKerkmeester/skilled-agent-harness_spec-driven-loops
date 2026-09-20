# Deep Research Strategy — cheaper per-lane isolation than full worktrees

## Research Topic

Per-lineage git worktrees give fan-out lanes exact write isolation but cost roughly 1.6 GB of
checkout and about 22 seconds of setup per lane, measured at six lanes. Research alternative
mechanisms that preserve the same parallel fan-out and the same attribution guarantee at a
fraction of that cost. Evaluate concretely against this repository: sparse or partial checkouts,
shallow and reference clones, overlay or copy-on-write filesystems, a single worktree with
per-lane write redirection, per-lane sandboxed working directories with a shared object store,
and any approach that keeps one checkout but makes attribution exact without a full tree. For
each, state setup cost, disk cost, whether attribution stays exact, what breaks (symlinked
dependency roots, workspace self-links, compiled entry-point guards, the churn detector), and
whether git worktree move or relocation survives. Ground every claim in the code under
`.opencode/skills/system-deep-loop/runtime` and the measurements recorded in the packet.

## Known Context

### Measured baseline (packet, authoritative)

- Six lineages at concurrency 3: 16.5 s without worktrees, 149.7 s with → ~133 s of provisioning
  for six lanes → ~22.2 s per lane. All six lanes succeeded with zero retries. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:105]
- Disk: 1.6 GB of checked-out files per tree, measured directly; six lanes ≈ 9.6 GB; the git
  object store is shared rather than copied. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:106]
- Worktrees default ON (ADR-004) with per-attempt isolation tally; degrade path = shared checkout
  under forced preserve. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:401-403]

### Repository anatomy (measured this session, 2026-09-14)

- Tracked tree = 1,421 MB across 82,393 files (`git ls-tree -r -l HEAD`). `specs/` = 1,205 MB /
  64,280 files; `.opencode/` = 17,648 files ≈ 216 MB tracked. Only 430 tracked symlinks.
- The tracked payload is dominated by deep-review/deep-research artifact dirs inside spec
  packets (e.g. one `review-r2` dir = 37 MB / 349 files). Largest single files ≈ 58 KB. The 1.6 GB
  is many mid-size text files, not a few giants, and not node_modules (only 7 shared dependency
  roots exist, all under `.opencode/skills/`).
- Object store (main repo `.git`): 2.06 GiB in-pack, shared by all worktrees. Per-worktree gitdir
  ≈ 16 MB (index + refs + logs).

### Mechanism the alternatives must replace (runtime code)

1. Create: `git worktree add --detach {base}/fanout-{runId}-{attempt}-{label} HEAD`, then 7
   shared-path symlink roots with workspace self-link detection + split relink (relative text),
   then lease file written LAST so an unmarked tree is reclaimable. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:569-628,477-510]
2. Seed: uncommitted working-tree paths under the target spec folder (minus the artifact dir),
   copied into the worktree; `.git` never seeded. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2763-2801]
3. Path levers per executor kind: `--dir` flag (native, cli-opencode), spawn cwd (cli-claude-code,
   cli-codex, cli-devin, cli-pi), read root (cli-cursor). Write surface vs publish target vs
   containment root are resolved separately. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-paths.ts:79-127]
4. Churn detector (write-containment): `git status --porcelain=v1 -z --no-renames
   --untracked-files=all`; pre-dispatch baseline of out-of-scope dirty paths (hash + optional byte
   capture, 2 MiB/file, 64 MiB/lane); preserve-by-default; FAILS OPEN when git cannot be reasoned
   about (no repo, no binary, artifact dir outside the worktree). [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:315,702-718,1208]
5. Reclaim: startup sweep holds a prefix lease (`{base}/fanout.reclaim.lock`), liveness = the
   lease file INSIDE the tree (unmarked beyond grace → reclaimable), removal via
   `git worktree remove --force` + `prune`. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-reclaim.ts:139-141,285-315]
6. Publish: stage on the TARGET filesystem, atomic rename, prior published dir renamed into an
   attic. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-publish.ts:8-29]
7. Caps: `MAX_EXPANDED_LINEAGES` = 256; concurrency ≤ 8 (default 2). [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:635,685]
8. Prior rejection: "One shared worktree for the whole run" scored 3/10 — sibling lanes write
   concurrently into one tree, misattribution moved one level down. [SOURCE: file:specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:276]

### Four breakage classes the topic names

1. Symlinked dependency roots: wholesale link of a node_modules root re-anchors workspace
   self-links into the SOURCE checkout; the lane reads code it never wrote. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:396-405]
2. Workspace self-links: relative links inside dependency roots resolving back into the checkout;
   rewrite must stay relative because a worktree can be relocated. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:463-475]
3. Compiled entry-point guards: the spec-kit shared package resolves exports onto compiled output
   (`shared/dist`); unprovisioned → module-not-found. Generators invoked through a link compare
   invocation path against their own derived location and silently no-op. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/worktree-lifecycle.ts:154-157; file:specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md (Dependency row)]
4. Churn detector: git-status-based; exact only inside a real git working tree of the repo.

## Key Questions

1. Which git-native materialization lever (sparse cone, `--no-checkout` + manual cone, shallow,
   reference, partial clone) cuts the 1.6 GB / ~22 s per-lane cost while keeping worktree
   registration, lease, sweep, publish and containment intact?
2. What is the minimum read cone a lane actually needs (prompt paths, skill routing, seed paths,
   shared-path destinations, review targets), and does the dispatch contract allow a per-lane cone?
3. Can any non-git mechanism (CoW/overlay filesystems, per-lane sandbox dirs, per-lane index
   files, write redirection) deliver EXACT attribution, or does each collapse into the
   shared-checkout heuristic the packet exists to end?
4. Which of the four breakage classes does each mechanism violate, and where exactly?
5. What survives relocation (`git worktree move`, directory rename, checkout move) under each
   mechanism, and what must change in the runner to adopt the winner?

## Answered Questions

- q1: Sparse cone worktrees cut the cost while keeping every machinery surface — the lane
  remains a linked worktree of the same repo.
- q2: The minimum cone is `.opencode/` + the target spec family + any dispatch-named spec path
  + the seed path list; cone mode is include-only per directory (family granularity).
- q3: No non-git mechanism delivers exact attribution; exactness requires a per-lane index +
  tree of the same repo.
- q4: Sparse inherits the baseline handling of all four breakage classes; every other
  mechanism violates at least one (clones: machinery boundary; partial clones: detector via
  promisor; CoW/sandbox/redirection: detector + self-links + reclaim).
- q5: Only the sparse worktree survives `git worktree move`; runner adoption = cone-aware
  create, per-run cone computation, minimum git >= 2.37, stub-executor measurement.

## What Worked

- Measuring the tracked tree directly (1,421 MB / 82,393 files; specs/ = 1,205 MB) located the
  cost: tree materialization, not objects — so object-sharing alternatives were dismissed on
  the spot and tree-selection (sparse) became the candidate.
- Reading the churn detector's scope resolution settled the sandbox question: the fail-open
  carve-out is narrow (no git toplevel), and the common case (repo resolvable, artifact dir
  outside worktree) is a hard throw.
- Web verification upgraded two iteration-1 risks to handled-by-git (per-worktree sparse
  config since 2.37) and one concern to a hard blocker (partial clone requires a real
  transport; `--local` ignores filters).

## What Failed

- The 22 s/lane decomposition (create vs teardown) is inferred from the mechanism, not
  separately measured; the packet's stub-executor protocol is the follow-up instrument.

## Exhausted Approaches

- Full worktree per lane (the baseline being replaced).
- Every clone variant (shallow, reference, partial) and every non-git variant (CoW/overlay,
  redirection, sandbox, per-lane index).

## Ruled-Out Directions

- Shallow clone: history ≠ tree; new repo boundary breaks sweep/lease/publish.
- Reference/shared clone: documented corruption hazard; object sharing already free.
- Partial clone: needs a real transport; promisor fetches break the churn detector and couple
  lane liveness to the source path.
- CoW/overlay: attribution loss, detector hard-fail/fail-open, no reclaim, platform lock.
- Write redirection: scored 3/10 in ADR-003; ADR-005 watch report-only; stays the degrade path.
- Sandbox + shared object store: detector-blind; collapses into clone or worktree.
- Per-lane index + `checkout-index --prefix`: wrong-tree detection (repo default index); no
  registration → orphan lanes.

## Next Focus

Synthesis (complete). Follow-up outside this lineage: measure a sparse-cone run with the
packet's stub-executor protocol (six lanes, concurrency 3) to convert the estimated per-lane
time saving into a recorded number.

## Non-Goals

- No implementation or code changes; findings only.
- No evaluation of removing the worktree option entirely (ADR-004 froze the default on).
- No benchmark harness design beyond what the packet already measures.
- No changes to the four command YAMLs' contracts.

## Stop Conditions

- All five key questions answered with code-grounded evidence.
- Three iterations completed (max-iterations cap; convergence is off by configuration).
