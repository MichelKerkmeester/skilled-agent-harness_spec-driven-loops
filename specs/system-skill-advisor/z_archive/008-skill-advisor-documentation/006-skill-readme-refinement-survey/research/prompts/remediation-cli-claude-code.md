REMEDIATE: cli-claude-code/README.md per packet-005-style refinement rules.

# Goal

Modify exactly one file: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-claude-code/README.md`

Apply the refinements catalogued in the audit report for skill `cli-claude-code`. Output the modified README directly in-place (the agent-config allows writes only to this one path).

# Sequential thinking

Call `mcp__sequential_thinking__sequentialthinking` with at least 5 thoughts: (1) read the current README and confirm each finding's line numbers against actual content via grep, (2) plan the prose/bullet replacements for each \xa71 table, (3) plan em-dash replacements (period, comma, parenthesis, or sentence-restructure as appropriate), (4) verify cross-skill refs stay if legitimate, (5) compose the rewrite.

# Refinement findings (from audit-report.json)

Section 1 tables to remove or move:
  - lines 50-60 (3 cols, 6 rows): Key Statistics (Models, Agents, Permission Modes, Output Formats, References, Version) -> to-paragraph
  - lines 62-71 (5 cols, 5 rows): Comparison table with Claude Code, Codex, Copilot, Gemini for Deep reasoning, Code editing, Structured output, Agent system, Session continuity, Cost control -> move-to-§3
  - lines 73-85 (2 cols, 9 rows): Key Features at a Glance (Extended Thinking, Edit Tool, Structured Output, Agent Delegation, Permission Modes, Session Continuity, Cost Control, Skills System, Spec Kit handoff) -> to-bullets
  - lines 88-93 (3 cols, 4 rows): Requirements (CLI, Auth, Node.js) -> to-paragraph

# Rules

1. **Zero tables in `## 1. OVERVIEW`.** Convert each \xa71 table to prose paragraphs or bulleted lists. If the table is genuinely reference data (Key Statistics with numbers), keep it but move it to a later section (\xa73 FEATURES or \xa75 CONFIGURATION). Update the TOC if you move a table.
2. **Em dashes.** Replace `\xe2\x80\x94` with `.`, `,`, or parentheses. When the em dash separates a parenthetical, use parentheses. When it begins a sentence fragment, start a new sentence. Do NOT introduce new banned punctuation.
3. **Banned words.** If the audit flagged any (e.g. "leverage"), rewrite the sentence to avoid the banned word. EXCEPTION: if the word appears inside an explanation OF the banned-word list (e.g. sk-doc's HVR rules section), keep it as-is.
4. **Cross-skill refs.** Legitimate refs (sibling CLI comparisons in Related sections, consumer dependencies, semantic+structural pairs) STAY. Only remove refs the audit explicitly flagged as inappropriate (the audit found 0 such refs across all 17 skills, so this rule is mostly a no-op).
5. **Preserve all factual content.** Statistics, version numbers, file paths, command examples, configuration values must all carry through. Only the presentation changes.
6. **Anchor pairs.** If you move a table out of \xa71, update both the table's location AND any TOC entry pointing at it.

# Output contract

Write the entire revised README to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-claude-code/README.md`. Do not produce any other files. Do not edit any other file.

After writing, emit a short summary to stdout:
- Tables converted: N
- Tables moved to \xa7M: N
- Em dashes replaced: N
- Lines before / after: X / Y

# Constraints

- Read-only access to all files EXCEPT the target README.
- Per-iter budget ~12 tool calls.
- Output valid markdown; preserve YAML frontmatter shape.
- Do NOT add new tables in \xa71. Do NOT introduce new em dashes. Do NOT touch SKILL.md, INSTALL_GUIDE.md, or any other file.
