# Deep Review Iteration 1 of 20 — system-code-graph Documentation Alignment with sk-doc

## SITUATION

You are running as cli-devin SWE-1.6 in non-interactive `--print` mode, dispatched from Claude Code as iteration 1 of a 20-iteration deep-review campaign on the standalone `system-code-graph` skill. The skill ships an MCP server (`mk-code-index`, 10 tools) plus runtime, docs, tests, feature catalog, and manual testing playbook. It just reached v1.0.0.0 (commit `1fc38a177` — INSTALL_GUIDE.md + /doctor:mcp coverage). Working directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## TASK

Review the documentation surface of `.opencode/skills/system-code-graph/` for alignment with the `sk-doc` skill's templates and quality conventions. Produce findings at severities P0 (release-blocking), P1 (high-priority but ship-able), P2 (nice-to-have).

## SCOPE (this iteration only)

Five files, all under `.opencode/skills/system-code-graph/`:
1. `README.md` — should follow sk-doc's `readme_template.md` shape (frontmatter, ANCHOR tags, OVERVIEW, QUICK START, FEATURES, STRUCTURE, CONFIGURATION, USAGE EXAMPLES, TROUBLESHOOTING, FAQ, RELATED DOCUMENTS).
2. `SKILL.md` — should follow sk-doc's skill template conventions (frontmatter with name/description/allowed-tools/version, keywords HTML comment, WHEN TO USE / SMART ROUTING sections).
3. `ARCHITECTURE.md` — should follow sk-doc's architecture-doc conventions.
4. `INSTALL_GUIDE.md` — should follow `sk-doc-template: skill_reference_install_guide` (frontmatter + template-marker comment + 9 sections per the canonical pattern at `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md`).
5. The frontmatter contracts shared across the four files (consistency of `title`, `description`, `trigger_phrases`, `version`).

## REFERENCE — sk-doc canonical templates

- `.opencode/skills/sk-doc/assets/readme/readme_template.md` (canonical README structure)
- `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` (skill-specific README)
- `.opencode/skills/sk-doc/references/readme_creation.md` (workflow)
- `.opencode/skills/sk-doc/references/frontmatter_templates.md` (frontmatter contracts)
- `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` (sibling example of skill_reference_install_guide)

## CONSTRAINTS

- READ-ONLY: do NOT edit any files in this iteration. Pure review.
- Cite file:line for every finding (use the line numbers you see when reading).
- Use only the files listed in SCOPE — do not expand to source code, tests, or other skills.
- If a sk-doc reference file is missing or empty, note it as a P1 finding (template unavailable) and proceed with judgment.
- Keep iteration runtime under 8 minutes. Stop reading new files past minute 6 and start writing the output.

## OUTPUT FORMAT

Output ONLY the structured Markdown below, NOTHING else. Do not print a preamble or trailing commentary.

```markdown
# Iteration 001 — system-code-graph Documentation Alignment with sk-doc

## Summary

<2-3 sentence summary of what you reviewed and the headline verdict>

## Files Reviewed

- `<path>` (lines read: <N>)
- `<path>` (lines read: <N>)
...

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| P0-001 | `path:line` | <one-line> | <one-line> | <one-line> |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|

## Convergence Signal

<one-sentence: how much NEW info did this iteration surface vs the existing reviews you can see in the packet at .opencode/specs/.../026-.../005-code-graph/017-isolation-arc-deep-review/review/review-report.md? newInfoRatio between 0.0 and 1.0>
```

If you have ZERO findings at a severity, write the table header + a single row `| — | — | None | — | — |`.
