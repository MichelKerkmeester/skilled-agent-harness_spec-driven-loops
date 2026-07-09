Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/007-deep-context-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `deep-context` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/z_archive/109-skill-readme-standardization/007-deep-context-readme/context/context-report.md`. Read it. Every fact, path, flag and command must come from it (or from re-reading `.opencode/skills/deep-context/` to confirm). Do not invent paths or counts. Do NOT cite a version number, and do NOT cite a reference count (the current README's are stale); name the four reference subfolders instead.
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`, and a sibling deep-* example in the same voice is `.opencode/skills/deep-ai-council/README.md`. Read at least one; yours should read like its sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `deep-context`, one-sentence description, trigger_phrases from SKILL.md), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION (the skill ships a feature_catalog and manual_testing_playbook), and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: you run this BEFORE /speckit:plan or /speckit:implement to map existing code; a parallel by-model sweep with agreement merge produces a reuse-first Context Report (pointers not bodies), and five convergence signals decide when enough context is gathered. Show the `/deep:start-context-loop:auto "scope"` command in QUICK START. In HOW IT WORKS cover frontier seeding, the by-model sweep, the agreement merge and the five convergence signals. In INTEGRATION state the boundary with the sibling deep loops and that /speckit:plan consumes the report.
- Target length roughly 240 to 340 lines. Every command shows its expected output; every cited path must resolve.

Return the complete README as one ```markdown fenced block. Nothing else.