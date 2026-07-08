Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/006-deep-ai-council-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `deep-ai-council` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/z_archive/109-skill-readme-standardization/006-deep-ai-council-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/deep-ai-council/` to confirm). Do not invent counts or paths. Do NOT cite a version number.
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`. Read it; yours should read like its sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `deep-ai-council`, one-sentence description, trigger_phrases from SKILL.md), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words (no leverage/robust/seamless/utilize/empower/foster/holistic-as-buzzword/journey-as-metaphor), no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: it is PLANNING ONLY (recommends, never implements), it runs a multi-seat council with six strategy lenses and three critique roles (Hunter, Skeptic, Referee), and it converges on a two-of-three rule while persisting an auditable `ai-council/**` artifact trail. QUICK START should show the two surfaces: the `@ai-council` agent for a single planning pass and `/deep:ask-ai-council:auto` (or `:confirm`) for a multi-topic deep session. INTEGRATION & NAVIGATION must state the boundary with the sibling deep loops (deep-research, deep-review, deep-context) and that implementation is handed off, never done here.
- Target length roughly 240 to 340 lines. Every command shows its expected output; every cited path must resolve.

Return the complete README as one ```markdown fenced block. Nothing else.