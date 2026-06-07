Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/004-cli-devin-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `cli-devin` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/135-skill-readme-standardization/004-cli-devin-readme/context/context-report.md`. Read it. Every fact, path, flag and command must come from it (or from re-reading `.opencode/skills/cli-devin/` to confirm). Do not invent flags, models or counts. Do NOT cite a version number or a reference count (the current README's are stale).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`, and a sibling cli-* example in the same voice is `.opencode/skills/cli-codex/README.md`. Read both; yours should read like their sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `cli-devin`, one-sentence description, trigger_phrases from SKILL.md), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION if the skill ships a playbook, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: the family-unique local-to-cloud handoff (operator-gated) and the four-model preset (swe-1.6 default Free-tier, deepseek-v4 primary-complex, glm-5.1 and kimi-k2.6 fallbacks). Show the default `devin --prompt-file ... --model swe-1.6 --permission-mode auto` dispatch in QUICK START. Explain the self-invocation guard and its cloud-handoff exception in HOW IT WORKS. State sibling-skill boundaries in INTEGRATION & NAVIGATION.
- Target length roughly 240 to 340 lines. Every command shows its expected output; every cited path must resolve.

Return the complete README as one ```markdown fenced block. Nothing else.