# Iteration 1: Packet topology and recurring drift signals

## Focus
Inventory the `.opencode/specs/*` corpus and identify where context optimization, migration, cleanup, and drift work clusters.

## Findings
1. The corpus contains 2,999 `spec.md` files, so “global drift” is a corpus-scale problem rather than a single-packet issue. [SOURCE: command output from `rg --files .opencode/specs | ... | wc -l`]
2. The main work clusters are `system-speckit`, `system-deep-loop`, `system-skill-advisor`, `system-code-graph`, `sk-code`, and `sk-prompt`; these clusters repeatedly reference migration, context, generated metadata, and cleanup. [SOURCE: `.opencode/specs/system-speckit/027-graph-and-context-optimization/spec.md`; `.opencode/specs/system-speckit/029-memory-search-intelligence/spec.md`; `.opencode/specs/system-deep-loop/068-skill-benchmark-codex-executor/spec.md`; `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/spec.md`]
3. Existing packets include both active-looking work and `z_archive` histories, while research artifacts also include parallel lineages. That topology makes path/status interpretation a prerequisite for trustworthy drift claims. [SOURCE: `.opencode/specs/system-speckit/000-migration-from-soa-and-cleanup/spec.md`; `.opencode/specs/sk-git/008-research-and-requirements/research/lineages/parallel-git-luna/research.md`; `.opencode/specs/sk-git/z_archive/002-sk-git-superset-worktrees/spec.md`]

## Ruled Out
Counting files alone cannot establish semantic drift; packet status and cross-document comparisons are required.

## Dead Ends
No reliable global status can be inferred from directory names alone because active and archived trees coexist.

## Edge Cases
- Ambiguous input: selected packet topology as the first narrow focus; deferred semantic contract comparison.
- Contradictory evidence: none resolved in this inventory pass.
- Missing dependencies: code graph is empty (`files=0`), so direct filesystem search is the evidence source. [SOURCE: runtime advisor status supplied in task context]
- Partial success: broad inventory completed; semantic drift remains open.

## Sources Consulted
- `.opencode/specs/**/spec.md` inventory via `rg --files`
- `.opencode/specs/system-speckit/027-graph-and-context-optimization/spec.md`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/spec.md`
- `.opencode/specs/sk-git/008-research-and-requirements/research/lineages/parallel-git-luna/research.md`

## Assessment
- New information ratio: 0.92
- Questions addressed: where drift work clusters; what evidence gaps exist
- Questions answered: none; topology is established, semantics are not

## Reflection
- What worked and why: filesystem inventory exposed scale and cluster boundaries quickly.
- What did not work and why: code graph cannot contribute because its index is empty.
- What I would do differently: compare packet metadata and research conclusions within the highest-signal clusters.

## Recommended Next Focus
Compare context-optimization and migration packets in `system-speckit`, `system-deep-loop`, `system-code-graph`, and `sk-prompt` for repeated recommendations and unresolved drift.
