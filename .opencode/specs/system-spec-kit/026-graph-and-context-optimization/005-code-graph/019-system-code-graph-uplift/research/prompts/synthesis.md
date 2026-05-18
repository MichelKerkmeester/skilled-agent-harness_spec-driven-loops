DEEP-RESEARCH SYNTHESIS

# Deep-Research Synthesis — 029 system-code-graph uplift

## STATE

Session: 029-uplift-9002D7A6 | 20 of 20 iterations completed | 939 findings collected | 0 questions formally resolved (agents did not emit `question_resolved` deltas; substantive answers are inside iter narratives).

## TASK

Read every `iteration-NNN.md` and the per-iter delta files, then write the canonical 17-section `research.md` for this packet.

## SOURCE INPUTS

Read in this order:
1. Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift/research/deep-research-strategy.md` (topic, 10 key questions, non-goals, stop conditions, known context)
2. Dashboard: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift/research/deep-research-dashboard.md` (per-iter ratios + status trail)
3. Findings registry: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift/research/findings-registry.json` (939 key findings + 10 open questions)
4. Resource map: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift/research/resource-map.md` (workflow-emitted resource ledger)
5. All 20 iter narratives: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift/research/iterations/iteration-{001..020}.md`
6. All 20 per-iter deltas: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift/research/deltas/iter-{001..020}.jsonl`

## OUTPUT TARGET

Write to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift/research/research.md`

## OUTPUT SHAPE (17 canonical sections)

```markdown
---
title: "Deep Research: 029 system-code-graph uplift"
description: "Consolidated 20-iter cli-devin SWE 1.6 deep-research output covering skill usefulness, marketing README rewrite arc, and sk-doc 1:1 alignment across system-code-graph authored docs."
---

# Deep Research: 029 system-code-graph uplift

## 1. EXECUTIVE SUMMARY
[3-5 sentence headline: what was researched, what was found, what the 3 children should do]

## 2. TOPIC & SCOPE
[From strategy §2 + non-goals from §4]

## 3. METHODOLOGY
[20-iter loop, cli-devin SWE 1.6, autonomous mode, convergence 0.05; bundle verification gate; per-iter prompt + agent-config recipe; reducer-driven state]

## 4. KEY QUESTIONS
[List Q1-Q10 from strategy §3 with one-sentence summary of what each iter learned about it]

## 5. ANSWERED QUESTIONS
[For each question that was substantively answered across iters: question text, source iter citations, consolidated answer]

## 6. KEY FINDINGS BY THEME

### 6.1 Bugs and Drift
[INSTALL_GUIDE.md lines 49/56/195 + any new bugs discovered across iters; cite iter:line]

### 6.2 HVR Violations
[Consolidated count + per-file breakdown of em dashes, semicolons, Oxford commas, banned words, banned phrases]

### 6.3 sk-doc 1:1 Alignment Gaps
[Per-doc --type mapping + missing anchors / sections / TOC issues per the per-type contract]

### 6.4 Marketing README Voice Targets
[Structural patterns from root README + system-spec-kit README that the system-code-graph README should mimic; HVR-clean substitutes for any banned root-README idioms]

### 6.5 Useful Content Gaps
[What operators reading the skill cold would benefit from: situational triggers, "why structural matters" primer, glossary, per-folder mcp_server README usefulness]

## 7. PER-FILE FINDINGS MATRIX
[Compact table: File | HVR score | em-dash count | semicolon count | Oxford comma count | sk-doc --type | mandatory anchors missing | bug/drift count | iter sources]

## 8. RULED OUT DIRECTIONS
[Any approaches the loop explicitly rejected]

## 9. EVIDENCE MAP
[Top 30-50 findings with full file:line citations + iter sources]

## 10. RECOMMENDATIONS FOR CHILD 001 (skill-md-and-references-polish)
[Ordered task list with priority + estimated impact + per-task source iter citations]

## 11. RECOMMENDATIONS FOR CHILD 002 (readme-marketing-rewrite)
[Section-by-section rewrite plan: opening hook structure, problem-solution-mechanism arc, key-stats table content, comparison table reframing, HVR-clean prose patterns]

## 12. RECOMMENDATIONS FOR CHILD 003 (sk-doc-1to1-alignment)
[Per-doc validation plan: (file, --type, anchors-to-add/fix, H2-cases-to-fix, TOC-issues)]

## 13. CROSS-CUTTING RISKS
[E.g. workflow-invariance allowlist hits, parallel-session destruction risk, fixture tarball member-rename edge cases that may surface during implementation]

## 14. NON-GOALS REAFFIRMED
[From strategy §4 — what the children must NOT do]

## 15. OPEN QUESTIONS AT CONVERGENCE
[Questions that remained genuinely unanswered after 20 iters; flag for follow-on packets]

## 16. SUCCESS CRITERIA FOR THE PACKET
[Aggregate completion conditions across the 3 children]

## 17. APPENDIX: ITERATION INDEX
[Table: iter N | focus | status | ratio | findings count | key takeaway one-liner]
```

## CONSTRAINTS

- Every consolidated claim MUST cite at least one `iteration-NNN.md` source (e.g. "Per iter-007:46").
- Every file:line citation in findings MUST be carried forward verbatim from the iter narratives.
- HVR rules apply to YOUR OWN prose: no em dashes, no banned words, no banned phrases, no Oxford commas, no semicolons. Score >= 85.
- Do NOT propose fixes — recommendations describe WHAT to change, not implementation steps.
- Do NOT mutate any file other than `research/research.md`.
- The 17 sections are MANDATORY. If a section has no content, write `None.` rather than omitting the heading.

## SEQUENTIAL THINKING

Per the agent-config recipe, you MUST call `mcp__sequential_thinking__sequentialthinking` with ≥5 thoughts covering: (1) enumerate iter files + deltas to read, (2) group findings by theme + severity, (3) resolve contradictions between iter findings with explicit precedence, (4) compose the consolidated output structure, (5) verify provenance so every consolidated claim cites an iter number and file:line.
