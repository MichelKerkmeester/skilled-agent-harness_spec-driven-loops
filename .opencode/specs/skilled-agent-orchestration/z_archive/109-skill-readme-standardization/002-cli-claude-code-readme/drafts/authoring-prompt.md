Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/002-cli-claude-code-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `cli-claude-code` skill in a specific house voice.

Context you must use:
- The factual map of the skill is in `.opencode/specs/skilled-agent-orchestration/z_archive/109-skill-readme-standardization/002-cli-claude-code-readme/context/context-report.md`. Read it. Every fact, file path, flag, command and boundary in your README must come from it (or from re-reading `.opencode/skills/cli-claude-code/` to confirm). Do not invent paths, flags, agents or counts. Use the 9-agent roster from the context report, not the current README's stale list.
- The required structure and voice are defined by the template at `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow its fillable scaffold exactly.
- The golden example to match in tone and shape is `.opencode/skills/sk-git/README.md`. Read it. Yours should read like a sibling of it.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements for the README you produce:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. (The sk-doc validator only finds required sections among numbered headers.)
- Open with frontmatter (title `cli-claude-code`, a one-sentence description, trigger_phrases drawn from the real SKILL.md), then the H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (a 4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first prose) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas (no comma before "and"/"or" in a list), no banned words (no leverage/robust/seamless/utilize/empower/foster/holistic/journey-as-metaphor), no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts (avoid exactly three).
- Show the default `claude -p` dispatch shape in QUICK START. Explain the self-invocation guard in HOW IT WORKS (it refuses if you ARE Claude Code). State the boundary with sibling cli-* skills in INTEGRATION & NAVIGATION.
- Target length roughly 230 to 340 lines. Every command shows its expected output; every cited path must resolve to a real file.

Return the complete README as one ```markdown fenced block. Nothing else.