# Deep Review Iteration 002 of 20 — system-code-graph: SKILL.md routing + invariants + trigger phrases against sk-doc skill_md_template

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive `--print` mode, dispatched from Claude Code as iteration 002 of a 20-iteration deep-review campaign on the standalone `system-code-graph` skill (v1.0.0.0). Working directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## TASK

Review the focus topic for this iteration and produce findings at severities P0 (release-blocking), P1 (high-priority), P2 (nice-to-have).

**Focus this iteration:** SKILL.md routing + invariants + trigger phrases against sk-doc skill_md_template

## SCOPE (this iteration only)

.opencode/skills/system-code-graph/SKILL.md, .opencode/skills/sk-doc/assets/skill/skill_md_template.md

If the listed files do not exist or are empty, treat absence itself as a finding (P1 — expected surface is missing).

## CONSTRAINTS

- READ-ONLY: do NOT edit any files. Pure review.
- Cite file:line for every finding.
- Use ONLY files in SCOPE — do not expand to other skills or unrelated source.
- Keep iteration runtime under 6 minutes. Stop reading new files past minute 5 and write the output.

## CONTEXT — what has already been reviewed in prior iterations

The state log at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/037-system-code-graph-comprehensive-deep-review/review/deep-review-state.jsonl` lists prior iterations. Avoid duplicating findings — focus on NEW evidence from your scope.

## OUTPUT FORMAT

Output ONLY the structured Markdown below, NOTHING else. No preamble, no trailing commentary, no ```markdown fence.

# Iteration 002 — system-code-graph: SKILL.md routing + invariants + trigger phrases against sk-doc skill_md_template

## Summary

<2-3 sentence summary + headline verdict>

## Files Reviewed

- `<path>` (lines read: <N>)
...

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|

## Convergence Signal

<one-sentence: newInfoRatio between 0.0 and 1.0 vs prior iterations>

(If you have ZERO findings at a severity, write the table header + a single row `| — | — | None | — | — |`.)
