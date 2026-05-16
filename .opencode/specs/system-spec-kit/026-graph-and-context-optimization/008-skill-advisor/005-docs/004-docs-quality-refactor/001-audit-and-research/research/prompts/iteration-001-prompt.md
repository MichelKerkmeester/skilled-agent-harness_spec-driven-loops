Framework: BUILD

Apply sequential_thinking with ≥ 5 thoughts BEFORE emitting the output.

# Iter 001 — SKILL.md anchor coverage and smart-router conformance

## Pre-planning

**Sequential_thinking mandatory**: call mcp__sequential_thinking__sequentialthinking with ≥ 5 thoughts before producing the output. The recipe's mcp_servers + system_instructions enforce this — do not skip.

Goal: audit `.opencode/skills/system-skill-advisor/SKILL.md` for sk-doc `skill_md` template conformance and smart-router INPUTS↔ACTIONS↔OUTPUTS structural integrity.

Steps:
1. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md` end-to-end with file:line citations for every anchor and section.
2. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/SKILL.md` and any sk-doc reference that defines the `skill_md` template (look under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/`) to extract the canonical required anchor set and section structure for `skill_md`.
3. Run targeted greps: `rg -n '<!-- ANCHOR:' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md` to enumerate present anchors. Compare to canonical set.
4. Identify drift: missing required anchors, out-of-order anchors, anchors that mismatch the canonical naming convention.
5. Cross-reference against the smart-router contract (look for "INPUTS", "ACTIONS", "OUTPUTS" patterns in sk-doc reference, and check SKILL.md's §2 SMART ROUTING for matching structure).

Acceptance criteria per step:
- Step 1: ≥3 file:line citations per claim about SKILL.md content.
- Step 2: cite the canonical anchor list with file:line from sk-doc source.
- Step 3: explicit grep command + result count.
- Step 4: each drift item flagged with severity P0|P1|P2 and impact-rank 1-10.
- Step 5: explicit pass/fail per smart-router pattern.

Stop condition: emit the required output then exit. Do not request further input.

Verification: count of file:line citations matches claim count; JSONL delta row appended.

## Research Question (scoped)

Does `.opencode/skills/system-skill-advisor/SKILL.md` conform 1:1 to the sk-doc `skill_md` template's required anchor set and smart-router INPUTS↔ACTIONS↔OUTPUTS structure?

## Output contract

Write to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md`

Required heading structure:
- `# Iter 001 — SKILL.md anchor coverage + smart-router conformance`
- `## Question`
- `## Evidence (file:line citations required)`
- `## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10)`
- `## Gaps for next iter`
- `## JSONL delta row` (paste the appended row at the end for verification)

Also append the JSONL delta row to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/deltas/iter-001.jsonl`

Required JSONL fields:
- `type=iteration`
- `iteration=1`
- `timestamp_utc` (ISO-8601 UTC)
- `executor=cli-devin`
- `model=swe-1.6`
- `status=complete|failed`
- `focus="SKILL.md anchor coverage + smart-router conformance"`
- `findings_count` (integer)
- `gaps_count` (integer)
- `newInfoRatio` (decimal 0..1; estimate based on novelty of findings vs known context)
- `primary_evidence_files` (array of paths)

Every claim in the Findings or Evidence sections MUST be followed by a `<ref_file file="<absolute-path>" lines="N-M" />` tag. Inline prose-only claims are non-compliant. Aim for ≥ 3 ref_file tags per finding, ≥ 1 per evidence row.

After write, also append the JSONL row to the canonical state log: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/deep-research-state.jsonl`
