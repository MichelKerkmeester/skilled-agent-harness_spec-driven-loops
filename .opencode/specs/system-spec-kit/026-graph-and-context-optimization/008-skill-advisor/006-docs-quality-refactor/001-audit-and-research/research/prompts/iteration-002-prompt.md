Framework: BUILD

Apply sequential_thinking with ≥ 5 thoughts BEFORE emitting the output.

# Iter 002 — README.md marketing-voice gap audit vs peer system-code-graph/README.md

## Pre-planning

**Sequential_thinking mandatory**: call mcp__sequential_thinking__sequentialthinking with ≥ 5 thoughts before producing the output. The recipe's mcp_servers + system_instructions enforce this — do not skip.

Goal: README.md marketing-voice gap audit vs peer system-code-graph/README.md

Steps:
1. Read these evidence files with file:line citations: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md
2. Run targeted greps for these patterns: rg -niE 'leverage|robust|seamless|holistic|synergy|utilize|delve|empower|disrupt|journey|ecosystem|landscape' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md; rg -nE '—|\b\w+; \w+|, and ' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md; rg -E '^## ' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md
3. Cross-reference against prior iters at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/006-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md through iteration-001.md. Cite each prior iter you reference by number.
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

Where does .opencode/skills/system-skill-advisor/README.md fall short of the peer system-code-graph/README.md marketing voice ceiling, and which sections need rewrite for the 003 marketing-style README pass?

## Output contract

Write to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/006-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-002.md

Required heading structure:
- # Iter 002 — README.md marketing-voice gap audit vs peer system-code-graph/README.md
- ## Question
- ## Evidence (file:line citations required)
- ## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)
- ## Gaps for next iter
- ## JSONL delta row

Also append the JSONL delta row to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/006-docs-quality-refactor/001-audit-and-research/research/deltas/iter-002.jsonl
Also append the same row to canonical state log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/006-docs-quality-refactor/001-audit-and-research/research/deep-research-state.jsonl

Required JSONL fields:
- type=iteration
- iteration=2
- timestamp_utc (ISO-8601 UTC)
- executor=cli-devin
- model=swe-1.6
- status=complete|failed
- focus="README.md marketing-voice gap audit vs peer system-code-graph/README.md"
- findings_count (integer)
- gaps_count (integer)
- newInfoRatio (decimal 0..1; estimate based on novelty vs prior iters)
- primary_evidence_files (array of paths)

Every claim in Findings or Evidence MUST be followed by a `<ref_file file="<absolute-path>" lines="N-M" />` tag. Aim for ≥ 3 ref_file tags per finding, ≥ 1 per evidence row.
