# Iteration 005 — AI Agent Consumer Analysis and Minimal Script Approach

## Files / DBs read

- `.opencode/skills/deep-research/SKILL.md:1-100`
  - Deep-research skill for autonomous iterative investigation
  - Focus: convergence detection, externalized state, fresh context per iteration
  - No mention of semantic search or text-based queries over coverage graph

- `.opencode/skills/deep-review/SKILL.md:1-100`
  - Deep-review skill for autonomous iterative code review
  - Focus: P0/P1/P2 findings, dimension-based review, convergence detection
  - No mention of semantic search or text-based queries over coverage graph

- `.opencode/skills/deep-research/feature_catalog/03--convergence/04-graph-convergence.md:1-50`
  - Coverage graph used for "graph convergence" in deep-research
  - Purpose: "structural evidence from coverage-graph nodes and edges"
  - Signals: "component count, isolated nodes, edge density, and answer coverage"
  - Use case: Determine when deep-research loop should stop (convergence detection)
  - No semantic search or text-based analysis mentioned

## Findings

1. **Coverage graph is used for convergence detection, not content search**: The coverage graph serves a specific structural purpose - providing signals (component count, isolated nodes, edge density, answer coverage) to determine when deep-research loops should stop. This is purely structural analysis, not semantic content exploration.

2. **Deep-research and deep-review don't query for semantic content**: The skill files and convergence documentation make no mention of text-based search, semantic similarity, or content analysis over the coverage graph. The focus is entirely on structural metrics and convergence detection.

3. **AI agents are not the consumer for semantic search**: Even though the graphs are described as "derived from ai-council artifacts" and used for "deep-research/deep-review cycles," the actual consumer pattern is structural analysis (convergence detection), not semantic content search. AI agents don't appear to need semantic similarity for their current workflows.

4. **Minimal script approach also unjustified**: Even a one-shot script for retrospective analysis requires a concrete use case. Without documented operator or AI agent needs, even a minimal tool is premature. The question remains: who would run this and why?

5. **"Fix code, don't bandaid with model swaps" applies to AI agents too**: If AI agents aren't struggling with the current structural convergence signals, then adding semantic search would be a bandaid, not a fix. The current structural approach (component count, edge density, answer coverage) appears to work for convergence detection.

6. **Graph convergence is working as designed**: The documentation shows that graph convergence is a well-integrated feature with specific signals and stop logic. There's no evidence of limitations or requests for semantic enhancement to this system.

7. **I'M UNCERTAIN ABOUT THIS**: Whether there are future AI agent workflows that would benefit from semantic search (e.g., cross-session reasoning, duplicate detection). But these would be new workflows, not enhancements to existing ones, and would require concrete justification.

## Updates to research.md

- Updated "Capabilities Unlocked" section with finding that AI agents don't currently need semantic search
- Updated "Comparison to mk-spec-memory" section with observation that coverage graph serves different purpose (convergence vs search)
- Added finding that coverage graph is used for structural convergence detection, not content search

## Open questions for next iter

1. Are there planned future AI agent workflows that would require semantic search over council/coverage graphs?
2. Should we wait for explicit operator or AI agent requests before investing in this capability?
3. Is there a retrospective analysis use case (e.g., post-hoc analysis of council decisions) that would benefit from semantic search?
4. What's the threshold of evidence needed to justify moving from DEFER to SHIP?

## Convergence signal

- new findings vs prior iter: 7 new findings
- Not converged yet - new information about AI agent consumer patterns
- Evidence strongly suggests DON'T-BUILD, but uncertainty remains about future workflows
