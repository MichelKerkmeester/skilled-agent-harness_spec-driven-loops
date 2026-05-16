Framework: BUILD

Apply sequential_thinking with ≥ 5 thoughts BEFORE emitting the output.

# Iter 020 — Synthesis prep: aggregate, impact-rank all findings 1-100, group by sub-phase mapping, flag duplicates

## Pre-planning

**Sequential_thinking mandatory**: call mcp__sequential_thinking__sequentialthinking with ≥ 5 thoughts before producing the output. The recipe's mcp_servers + system_instructions enforce this — do not skip.

Goal: Synthesis prep: aggregate, impact-rank all findings 1-100, group by sub-phase mapping, flag duplicates

Steps:
1. Read these evidence files with file:line citations: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-002.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-003.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-004.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-005.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-006.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-007.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-008.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-009.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-010.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-011.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-012.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-013.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-014.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-015.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-016.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-017.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-018.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-019.md
2. Run targeted greps for these patterns: ls /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/; rg -nE 'P0|P1|P2' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/ | wc -l; rg -nE 'sub-phase|target: ?00[2345]|impact-rank' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/
3. Cross-reference against prior iters at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md through iteration-019.md. Cite each prior iter you reference by number.
4. Identify gaps prior iters missed; tag findings drift|bug|gap|HVR-violation|alignment-miss with severity P0|P1|P2 and impact-rank 1-10.
5. Group findings by sub-phase target: 002-bug-fixes, 003-readme-marketing-rewrite, 004-sk-doc-1to1-alignment, 005-content-additions-and-hvr.

Acceptance criteria per step:
- Step 1: ≥3 file:line citations per claim.
- Step 2: explicit grep command + result count.
- Step 3: each cross-reference cites prior iter number.
- Step 4: each finding gets severity + impact-rank.
- Step 5: each finding tagged with sub-phase target.

Stop condition: emit the required output then exit. Do not request further input.

Verification: count of file:line citations matches claim count; JSONL delta row appended.

## Research Question (scoped)

Read iteration-001.md through iteration-019.md and produce: (a) aggregated unique findings list with impact-rank 1-100 (sum or max-impact across iters), (b) grouping by sub-phase target (002, 003, 004, 005), (c) duplicate-finding flags, (d) summary statistics (total findings, P0 count, P1 count, P2 count, top-10 highest-impact).

## Output contract

Write to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-020.md

Required heading structure:
- # Iter 020 — Synthesis prep: aggregate, impact-rank all findings 1-100, group by sub-phase mapping, flag duplicates
- ## Question
- ## Evidence (file:line citations required)
- ## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)
- ## Gaps for next iter
- ## JSONL delta row

Also append the JSONL delta row to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/deltas/iter-020.jsonl
Also append the same row to canonical state log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/deep-research-state.jsonl

Required JSONL fields:
- type=iteration
- iteration=20
- timestamp_utc (ISO-8601 UTC)
- executor=cli-devin
- model=swe-1.6
- status=complete|failed
- focus="Synthesis prep: aggregate, impact-rank all findings 1-100, group by sub-phase mapping, flag duplicates"
- findings_count (integer)
- gaps_count (integer)
- newInfoRatio (decimal 0..1; estimate based on novelty vs prior iters)
- primary_evidence_files (array of paths)

Every claim in Findings or Evidence MUST be followed by a `<ref_file file="<absolute-path>" lines="N-M" />` tag. Aim for ≥ 3 ref_file tags per finding, ≥ 1 per evidence row.
