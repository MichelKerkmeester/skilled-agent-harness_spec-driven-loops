# Dimension

Independent git-history re-verification for the seeded-PPR recovery claims.

# Files Reviewed

- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/spec.md:84` cites `657a0f6a3e` as the introducing commit and `277c35344c` as the deleting commit.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/spec.md:98` names `277c35344c^` as the recovery source for `code-graph-context.ts`.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/spec.md:113` requires recovered functions to match `277c35344c^` content.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/plan.md:57` marks both commit hashes verified real.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/plan.md:77` cites `computeBoundedPersonalizedPageRank` recovered via `git show 277c35344c^:<path>`.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/decision-record.md:135` says the seeded-PPR module was built, benchmarked, deleted at `277c35344c`, and is recoverable byte-for-byte from the parent blob.
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/implementation-summary.md:63` says the module was deleted at `277c35344c` and recovered from git history.
- `.opencode/skills/sk-code-review/references/review_core.md:28` through `.opencode/skills/sk-code-review/references/review_core.md:49` loaded for severity and evidence doctrine before final severity calls.
- Git output from `git log --oneline -1 657a0f6a3e`, `git log --oneline -1 277c35344c`, `git show 277c35344c --stat`, and `git show 277c35344c^:.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts | rg -n "computeBoundedPersonalizedPageRank"`.

# Findings By Severity

## P0

None.

## P1

None.

## P2

None.

# Traceability Checks

- `git log --oneline -1 657a0f6a3e` returned `657a0f6a3e feat(028): build 3 phases (summary-fusion, seeded-PPR, conflict-rerank) -- all default-off`; this supports the packet claim that the hash exists and introduced a seeded-PPR phase.
- `git log --oneline -1 277c35344c` returned `277c35344c refactor(028): delete code_graph_seeded_ppr (measured negative, reintroduces single-hop precision loss)`; this supports the packet claim that the hash exists and is the deletion commit.
- `git show 277c35344c --stat` showed the full deletion message: the subject says `measured negative, reintroduces single-hop precision loss`, and the body says the reinvestigation measured seeded-PPR impact ranking negative on a real forward-CALLS graph, created a precision regression over 10 anchors x3, and reintroduced the aionforge single-hop precision-loss failure mode. The stat includes 397 deletions from `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` plus removal of the seeded-PPR eval and tests.
- `git show 277c35344c^:.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts | rg -n "computeBoundedPersonalizedPageRank"` returned line `527:export function computeBoundedPersonalizedPageRank<TNode extends PprNodeId>(` and line `789:  const ppr = computeBoundedPersonalizedPageRank({`; this confirms the parent blob contains the claimed recovery function.
- Counterevidence sought: missing commits, a deletion commit message that did not describe measured/negative results, or a parent blob without `computeBoundedPersonalizedPageRank`. None was found.

# Verdict

The git-history traceability claims checked out. No new P0/P1/P2 findings are warranted from this assigned dimension, and prior findings are intentionally not re-emitted.

# Next Dimension

Continue with any remaining batch-assigned dimensions from the externalized review plan; this iteration adds no remediation workstream.

Review verdict: PASS
