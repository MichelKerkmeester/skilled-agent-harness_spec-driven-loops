Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/009-deep-loop-runtime-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `deep-loop-runtime` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/135-skill-readme-standardization/009-deep-loop-runtime-readme/context/context-report.md`. Read it. Every fact and path must come from it (or from re-reading `.opencode/skills/deep-loop-runtime/` to confirm). Do not invent paths or counts. Do NOT cite a version number, a test-file count or an entry-point count (the current README's are stale).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`, and a sibling deep-* example is `.opencode/skills/deep-context/README.md`. Read at least one; yours should read like its sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `deep-loop-runtime`, one-sentence description, trigger_phrases from SKILL.md), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- This is a SHARED LIBRARY / RUNTIME, not a user-facing loop. Lead that: it is the foundation the five deep loops (deep-research, deep-review, deep-context, deep-ai-council, deep-improvement) ride, consumed via TypeScript imports and direct .cjs script calls, consolidated out of the MCP server so every loop shares one hardened implementation. QUICK START should show how a CONSUMER calls it (an example .cjs entry point invocation), not a user slash command. HOW IT WORKS covers the three lib component families (deep-loop, coverage-graph, council). INTEGRATION names the consumers and states this is the foundation, not a loop you invoke directly.
- Target length roughly 230 to 330 lines. Every command shows its expected output; every cited path must resolve.

Return the complete README as one ```markdown fenced block. Nothing else.