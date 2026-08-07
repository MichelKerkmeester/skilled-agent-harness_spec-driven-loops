Framework: BUILD

Apply sequential_thinking with ≥ 5 thoughts BEFORE emitting the output.

# Iter 012 — manual_testing_playbook/01..04 (mcp-tools, cli-hooks, compat, operator) coverage

## Pre-planning

**Sequential_thinking mandatory**: call mcp__sequential_thinking__sequentialthinking with ≥ 5 thoughts before producing the output. The recipe's mcp_servers + system_instructions enforce this — do not skip.

Goal: manual_testing_playbook/01..04 (mcp-tools, cli-hooks, compat, operator) coverage

Steps:
1. Read these evidence files with file:line citations: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/native-mcp-tools/, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/compat-and-disable/, /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/operator-h5/
2. Run targeted greps for these patterns: ls /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/native-mcp-tools/ /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/ /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/compat-and-disable/ /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/operator-h5/
3. Cross-reference against prior iters at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-001.md through iteration-011.md. Cite each prior iter you reference by number.
4. Identify gaps prior iters missed; tag findings drift|bug|gap|HVR-violation|alignment-miss with severity P0|P1|P2 and impact-rank 1-10.
5. Group findings by sub-phase target: 002-documentation-bug-fixes, 003-readme-problem-first-rewrite, 004-sk-doc-type-validation-alignment, 005-content-additions-hvr-polish.

Acceptance criteria per step:
- Step 1: ≥3 file:line citations per claim.
- Step 2: explicit grep command + result count.
- Step 3: each cross-reference cites prior iter number.
- Step 4: each finding gets severity + impact-rank.
- Step 5: each finding tagged with sub-phase target.

Stop condition: emit the required output then exit. Do not request further input.

Verification: count of file:line citations matches claim count; JSONL delta row appended.

## Research Question (scoped)

Do playbook categories 01-04 follow sk-doc manual_testing_playbook template 1:1? Are per-scenario files complete (scenario.md + scenario_test.md)?

## Output contract

Write to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-012.md

Required heading structure:
- # Iter 012 — manual_testing_playbook/01..04 (mcp-tools, cli-hooks, compat, operator) coverage
- ## Question
- ## Evidence (file:line citations required)
- ## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)
- ## Gaps for next iter
- ## JSONL delta row

Also append the JSONL delta row to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/deltas/iter-012.jsonl
Also append the same row to canonical state log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/deep-research-state.jsonl

Required JSONL fields:
- type=iteration
- iteration=12
- timestamp_utc (ISO-8601 UTC)
- executor=cli-devin
- model=swe-1.6
- status=complete|failed
- focus="manual_testing_playbook/01..04 (mcp-tools, cli-hooks, compat, operator) coverage"
- findings_count (integer)
- gaps_count (integer)
- newInfoRatio (decimal 0..1; estimate based on novelty vs prior iters)
- primary_evidence_files (array of paths)

Every claim in Findings or Evidence MUST be followed by a `<ref_file file="<absolute-path>" lines="N-M" />` tag. Aim for ≥ 3 ref_file tags per finding, ≥ 1 per evidence row.
