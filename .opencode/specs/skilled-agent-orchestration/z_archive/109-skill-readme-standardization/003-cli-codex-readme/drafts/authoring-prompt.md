Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/003-cli-codex-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `cli-codex` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/z_archive/109-skill-readme-standardization/003-cli-codex-readme/context/context-report.md`. Read it. Every fact, path, flag and command must come from it (or from re-reading `.opencode/skills/cli-codex/` to confirm). Do not invent flags, profiles or counts.
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example to match in tone and shape is `.opencode/skills/sk-git/README.md`. Read it. A second strong example in the same voice is `.opencode/skills/cli-claude-code/README.md` (a sibling cli-* skill). Read it too; yours should read like its sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `cli-codex`, one-sentence description, trigger_phrases from SKILL.md), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION if the skill ships a playbook, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas (no comma before "and"/"or" in a list), no banned words (no leverage/robust/seamless/utilize/empower/foster/holistic/journey-as-metaphor), no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts (avoid exactly three).
- Show the default `codex exec --model gpt-5.5` dispatch shape in QUICK START. In HOW IT WORKS, state the two traps the context report flags: the read-only default sandbox (edit tasks need `--sandbox workspace-write` or `--full-auto`) and the explicit `-c service_tier="fast"` requirement. Explain the self-invocation guard. State sibling-skill boundaries in INTEGRATION & NAVIGATION.
- Target length roughly 230 to 340 lines. Every command shows its expected output; every cited path must resolve.

Return the complete README as one ```markdown fenced block. Nothing else.