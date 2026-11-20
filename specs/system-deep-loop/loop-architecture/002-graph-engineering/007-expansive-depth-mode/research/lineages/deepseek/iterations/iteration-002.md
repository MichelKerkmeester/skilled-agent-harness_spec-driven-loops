# Iteration 2: F-1-004 frontier economics

## Focus

Frontier node F-1-004 (depth 1, scope frontier-admit.cjs, convergence.cjs, deep-research reduce-state.cjs, the newest SPEC/research_archive improvement-backlog.md): Frontier economics: how should the node cap, growth slots, depth-band split and duplicate work change (5 of 7 proposals pruned at iteration 1 last run), and should held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node dashboard) be built, in which order?

The node was read as: name the arithmetic that produced "5 of 7 pruned", the duplicate-work path that survives the drained-frontier stop, and a build order for the four held rows that respects their dependencies.

## Actions Taken

1. Read `readCaps`, `seedBudget`, `expansiveBudget`, `applyBandBudget`, `checkProposal`, `admitProposals` and `block` in `frontier-admit.cjs`.
2. Read `applyFrontierBudget` and `resolveNextFocus`/`pickFrontierFocus` in the research reducer.
3. Read the `frontier_drained` and `frontierOpen` branches in `convergence.cjs`.
4. Read `writeLineageFrontierStore` in `fanout-run.cjs` to see what each lineage is dealt.
5. Re-read the held rows 12, 13, 29 and 30 in the archived `improvement-backlog.md`, then ran the FRONTIER block for this node.

## Findings

1. **A depth band's spend is summed across all its nodes, so one node's revisits can close its siblings.** `applyBandBudget` accumulates `spent[band] += visits[index].spent` and, once that sum reaches `cap * share`, closes every open node in the band as `exhausted/budget`. There is no per-node floor, so a three-node depth-1 band with a 5-visit allotment closes all three as soon as the run has made five visits across them, even if one node got four of those visits and another got one. In the previous run this is how F-1-006 closed after a single pass on it. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:386] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2556]

2. **Growth slots are one run-wide number, filled in delta order, so the first node worked can spend the whole frontier's growth.** `seedBudget` computes `growthSlots = nodeCap - seeded` (2 for a 3-seed, 10-iteration lineage), and `checkProposal` prunes on `countLiveNodes >= maxFrontierNodes` regardless of which parent is asking. `admitProposals` then walks the delta's rows in order. This run shows it live: F-1-002's two proposals filled the cap at iteration 1, and this node's FRONTIER block now prints "This node has no child slots left, so do not propose children" while F-1-004 and F-1-006 have never been worked. A deterministic spread — sort proposals by parent depth, then by fewest live children, before admission — would stop one node from taking the run's whole growth budget. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:515] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:778] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:828]

3. **Cross-lineage duplicate questions are invisible to admission and to the merge guard.** Each lineage receives only its own share of the node store, and `step_frontier_admit` builds `known-texts` from that lineage's registry, rejected patterns and exhausted list. `checkProposal` therefore compares a proposal with its own store and its own known texts, never with a sibling lineage's questions; the merge guard checks node ids, not question text. A re-worded version of another lineage's question passes both, which is the mechanism behind the previous run's unbudgeted duplicate work after a frontier drained. Passing a root-level question-digest file (dedupe keys for every dealt node and every answered question) into each lineage's admission closes it without a new service. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:423] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:755] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:763]

4. **Depth bands are enforced only in the reducer projection, never at admission.** The node cap is band-blind: `maxFrontierNodes` counts live nodes at every depth, and `maxChildrenPerNode` bounds one parent, but nothing stops all growth slots from landing at depth 2. A depth-2 band of 3.5 visits then has to cover every depth-2 node the run admitted, while depth-1 nodes are still open and will later demand their own band. Reserving a band's growth slots at admission (`floor(bandShare / minimumPassesPerNode)`, minus the nodes already at that depth) would make the split an admission rule instead of a post-hoc close. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:438] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:771] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2673]

5. **The four held rows have a dependency order: 30 + 12 as one change, then 13 with the adapter capability test, then 29 last.** Row 12 (one `projectFrontier`) is the shared parser and projection; row 30 (per-node research dashboard) is the renderer that consumes it, and the backlog already pairs them. Row 13 (one executor path) is independent of the frontier work but needs row 2's permission fix (delivered) and the capability manifest from F-1-002 to keep the merged path honest; doing it before 29 also removes the hand-built branches that make some aliases look live. Row 29 deletes config-key aliases, legacy migration and binary probes; it is safest after 12 and 13, because those two changes decide which keys and probes have no caller. Building 29 first would delete aliases whose only remaining reader is a branch that 13 has not yet collapsed. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:43] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:44] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:60] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:61]

## Questions Answered

- How should the node cap and growth slots change? Answered by Findings 2 and 4: spread growth deterministically across parents and bands instead of filling a run-wide cap in delta order.
- How should the depth-band split change? Answered by Findings 1 and 4: add a per-node floor to a band close, and enforce band growth at admission.
- How should duplicate work change? Answered by Finding 3: carry a cross-lineage question digest into admission.
- Should rows 12, 13, 29 and 30 be built, and in what order? Answered by Finding 5: 30+12, then 13, then 29.

## Questions Remaining

- Whether a per-node floor would starve a genuinely small band, or whether the floor should be expressed as "at least one pass per live node before any band close".
- Whether the root digest should be computed by `frontier-admit.cjs` or by `fanout-run.cjs` at deal time.

## Recommended Next Focus

Frontier node F-1-006: bookkeeping that fires on a healthy run. This iteration already produced two live specimens for it — the gateway's "Trusted evidence yield was absent" warning and `iteration-graph-upsert` skipping every finding row until a question is marked answered — so the node has fresh evidence to read.

## Ruled Out

- **A larger run-wide node cap as the fix for "5 of 7 pruned".** Raising the cap spends more iterations on the same first-worked branch; the pruned questions were good, but the run had no budget to work them. The defect is allocation, not the number.
- **Ranking proposals by model-written value or confidence.** The runner cannot audit a self-asserted score, which is the honesty problem this packet is about. Sorting by parent depth and live-child count is deterministic and checkable.
- **Building row 12 alone and leaving the dashboard for later.** The dashboard is the surface that would have shown the band closes and the partition drift; splitting it from the shared projection leaves the operator with the same blind spot.

## Dead Ends

- Looking for a per-band cap in `readCaps`: only `maxDepth`, `maxChildrenPerNode`, `maxRootChildren` and `maxFrontierNodes` exist. Band shares are consumed by the reducer, never by admission.
- Looking for a cross-lineage question comparison in `fanout-merge.cjs`: the partition guard compares node ids only, so question overlap has no check anywhere.

## Edge Cases

- Ambiguous input: none. The node named four surfaces; all four were read.
- Contradictory evidence: the topic says growth slots were "5 of 7 proposals pruned at iteration 1"; the mechanism is the node cap, but the previous run's slots were 2 per lineage, not 7. The difference is the seed share, not a contradiction. Recorded for the reducer.
- Missing dependencies: none.
- Partial success: none. The FRONTIER block itself confirmed the no-slots condition, which is direct evidence for Finding 2.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:386`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:438`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:515`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:755`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:763`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:771`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:778`
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:828`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2556`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2673`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1200`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:423`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:43`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/improvement-backlog.md:60`

## Assessment

- New information ratio: 0.70
- Questions addressed: node cap, growth slots, depth-band split, duplicate work, held-row order.
- Questions answered: all four parts of the node question.
- Finding mix: 2 fully new mechanisms (band-summed closes, cross-lineage dedupe gap), 3 partially new refinements of delivered rows 14/16b and the held-row analysis.

## Reflection

- What worked and why: reading `seedBudget` and `checkProposal` together made the arithmetic exact; the FRONTIER block then confirmed the prediction in the same iteration, which is stronger than a code-only inference.
- What did not work and why: I first expected a per-band cap in `readCaps`; there is none, and the time spent there showed the band split is a reducer-only concept.
- What I would do differently: compute the previous run's actual growth slots from its config before describing "5 of 7", so the comparison is arithmetic rather than prose.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was written.
