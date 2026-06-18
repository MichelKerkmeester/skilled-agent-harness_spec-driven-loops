Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/005-cli-opencode-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `cli-opencode` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/135-skill-readme-standardization/005-cli-opencode-readme/context/context-report.md`. Read it. Every fact, path, flag and command must come from it (or from re-reading `.opencode/skills/cli-opencode/` to confirm). Do not invent flags or counts. Do NOT cite a version number, and list the seven providers accurately rather than a wrong count (the current README's version and provider count are stale).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`, and sibling cli-* examples in the same voice are `.opencode/skills/cli-codex/README.md` and `.opencode/skills/cli-devin/README.md`. Read at least one; yours should read like their sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `cli-opencode`, one-sentence description, trigger_phrases from SKILL.md), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION if the skill ships a playbook, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: the full-runtime one-shot dispatch (the project's whole plugin, skill, MCP and Spec Kit Memory runtime) and the three documented use cases (external dispatch, parallel detached session, cross-AI handback). Show the default `opencode run --model opencode-go/deepseek-v4-pro --variant high --format json --dir <repo-root>` dispatch in QUICK START, and state the two non-obvious rules clearly: the mandatory `</dev/null` on non-interactive runs, and never pass a top-level `--agent`. Explain the self-invocation guard and its parallel-detached exception in HOW IT WORKS. State sibling-skill boundaries in INTEGRATION & NAVIGATION.
- Target length roughly 250 to 360 lines. Every command shows its expected output; every cited path must resolve.

Return the complete README as one ```markdown fenced block. Nothing else.