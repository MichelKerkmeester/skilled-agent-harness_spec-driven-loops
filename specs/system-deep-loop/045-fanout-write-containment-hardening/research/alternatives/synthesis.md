# Alternatives to full per-lane worktrees: synthesis

**Question.** Per-lane git worktrees give exact write attribution at roughly 1.6 GB of checkout and about 22 s of setup per lane. Can the same parallel fan-out and the same attribution guarantee be had for a fraction of that?

**Lanes.** GPT-5.6 LUNA at max via Codex, SWE-2 max via Devin, DeepSeek V4 Flash max via Devin. Three iterations each, no early convergence, run against this repository. Every load-bearing number below was re-measured by the orchestrator rather than taken from a lane.

---

## The short answer

Yes. The cost is tree materialization, not git objects, and the tree is dominated by content a lane never reads. A **sparse-cone worktree** keeps the same repository identity and every runner semantic while checking out only what the lane needs, cutting the disk cost by 62% at family granularity and 85% at packet granularity, on this repository, measured. All three lanes reached this independently.

A second step, **clonefile materialization inside a registered `--no-checkout` worktree**, can push disk near zero on APFS, which this volume is. It is platform-gated and its setup time is unmeasured.

Nothing else survives. Shallow and reference clones attack the wrong axis; partial and blobless modes have nothing to fetch lazily from a repo that already holds every blob locally; single-checkout write redirection and unregistered copy-on-write directories both lose git identity, which is what attribution, the churn detector and relocation all rest on.

---

## What the cost actually is

| | Measured |
|---|---|
| Tracked tree | 1,425 MB across 82,376 files |
| of which `specs/` | 1,205 MB, 85% |
| of which `.opencode/` | 216 MB |
| Object store, shared, not per lane | 2.06 GiB in pack |
| `.opencode` + the deep-loop spec family | 546 MB, a 62% cut |
| `.opencode` + one packet | 216 MB, an 85% cut |

The object store is already shared by every worktree. What a lane pays for is the checkout, and 85% of the checkout is other packets' documents.

---

## Mechanism by mechanism

| Mechanism | Setup | Disk | Attribution exact | Relocation survives | Verdict |
|---|---|---|---|---|---|
| Full worktree, today | ~22 s | 1.6 GB | yes | yes | baseline |
| **Sparse-cone worktree** | falls with the cone | 216 to 546 MB | yes, same repo identity | yes | **adopt first** |
| Registered `--no-checkout` worktree + clonefile | unmeasured, clonefile is metadata-only | near zero on APFS | yes, the worktree is registered | yes | second step, APFS only |
| Shallow clone | full tree still materializes | 1.6 GB | adds a repo boundary the sweep cannot see | n/a | ruled out, all three lanes |
| Reference or shared clone | objects already shared | no gain | same boundary problem | n/a | ruled out, all three lanes |
| Partial or blobless | needs a transport; a local worktree has every blob already | no gain | n/a | n/a | ruled out; LUNA's variant is a no-op here |
| Single checkout, per-lane write redirection | none | none | no: the runner's own `git -C` calls strip the redirectors | n/a | ruled out, all three lanes; scored 3/10 in an earlier decision |
| Unregistered CoW or overlay directory | fast | near zero | no: not a git working tree, so status, the detector and the sweep cannot see it | no: move and repair act on registered worktrees only | ruled out, all three lanes |

The one place the lanes disagreed was copy-on-write, and it resolves on a single distinction. Deepseek ruled out CoW *as a replacement for* a worktree, which is correct. LUNA and SWE-2 proposed clonefile *inside* a registered worktree created with `--no-checkout`: git registers the tree first, so identity holds, and clonefile fills it instead of checkout. LUNA's own rule-outs, unregistered CoW directories and shared overlay layers, draw exactly the line that makes SWE-2's variant safe.

---

## What breaks, and what does not

Sparse-cone worktrees change nothing the packet built. The lease sits at the tree root, which every cone includes. The six shared dependency roots and the shared package's build all live under `.opencode/`, which every cone includes, so split-link provisioning and the relative self-links work unchanged, and relocation survives because those links are relative. The churn detector and containment compare against the same repo, so they stay exact.

Two things need care:

- **The cone is a new runner concept.** It is the union of `.opencode/`, the target packet or its family, any other spec path the dispatch names, and the seed path list, so seeded bytes never surface as untracked noise. Cone mode is include-only per directory.
- **Sparse mode flips `extensions.worktreeConfig`, and that is repository-wide.** It is unset today. Git 2.50.1 here is fine, but 30 other worktrees would inherit the extension the moment any lane enabled it, and an older git refuses such a repository. Nothing in the hooks, sk-git scripts, or the provisioners reads `core.sparseCheckout` or assumes the old layout, verified, but a minimum git version must be enforced before the first sparse lane runs.

---

## What is still unmeasured

Setup time under a sparse cone. Every lane estimated it falls with the materialization ratio and every lane said the estimate needs the packet's stub-executor protocol to confirm. Taking that measurement means enabling the repository-wide extension on a live checkout with 30 worktrees and other sessions active, so it was deliberately not taken here. It belongs in a throwaway clone, with the operator's say-so.

---

## Findings against the current mechanism, from SWE-2

Two defects independent of this decision, both worth their own packet:

1. **A lane can write through a shared dependency root into the main checkout.** The vendored trees are wholesale-linked by design, so a write into one lands in main and escapes both the tree-rooted guard and the checkout watch.
2. **The churn detector has no cumulative arm.** It fires on a burst above the threshold within one heartbeat window. A neighbour dirtying one or two files per window never trips it, however long that goes on.

---

## Defects in the runner, surfaced by this run

1. **LUNA's lane was rejected with its work complete.** Its state log held each iteration record twice: once with millisecond timestamps from the append gateway, once with round, backdated ones the model wrote directly, against the agent contract's instruction never to write that file. The validator counts records and rejects; it should deduplicate by iteration and prefer the gateway's. This is the recurrence the packet's limitation four predicted and asked to keep evidence for; the lineage directory is kept.
2. **SWE-2's lane was accepted with nothing registered.** Its findings are numbered list items, and the lineage reducer's list extractor takes only bullets, so its registry stayed empty. The merge's reconstruction path reads both forms, which is how its 27 findings reached the merged registry, but a fulfilled lane with three deltas and an empty registry should be flagged, not passed.

Both lanes also fabricated round timestamps in their own state records; the runner detected it for deepseek and the pattern is visible in LUNA's. Lane self-reported timing should not be cited.

---

## Recommendation

1. Implement sparse-cone worktrees behind the existing `--worktrees` opt-in, with cone computation as described and a git-version gate. Measure setup time in a throwaway clone first.
2. Prototype clonefile materialization as an APFS-only refinement once the sparse cone is in and measured.
3. File the two current-mechanism defects and the two runner defects as their own work.
4. Leave the default off until the sparse cone's measured cost is known.
