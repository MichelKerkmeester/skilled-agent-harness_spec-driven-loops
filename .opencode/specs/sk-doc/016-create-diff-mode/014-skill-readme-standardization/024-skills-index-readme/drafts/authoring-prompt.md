Spec folder: sk-doc/014-skill-readme-standardization/024-skills-index-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the skills-library index `.opencode/skills/README.md` in the repo's narrative house voice. This is the catalog and front door to all 22 skills, rewritten last so it reflects the freshly rewritten child READMEs.

Context you must use:
- The factual catalog is in `.opencode/specs/sk-doc/014-skill-readme-standardization/024-skills-index-readme/context/context-report.md`. Read it. The 22 skills, their five families and their one-line descriptions come from there.
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. The golden example is `.opencode/skills/sk-git/README.md`. The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read all three.

Hard requirements on facts:
- There are 22 skills in five families: cli-* (4), deep-* (6), mcp-* (3), sk-* (6), system-* (3). Do NOT pin a different total and do NOT pin per-skill version numbers (they drift).
- system-code-graph is the STRUCTURAL code-intelligence skill in the system-* family. Do NOT call it semantic search or vector embeddings, and do NOT file it under mcp-*.
- Gate 2 routing: the native `mk_skill_advisor` (`advisor_recommend`) scores a prompt and returns prompt-safe recommendations; confidence at or above 0.8 with uncertainty at or below 0.35 means the skill is invoked; a Python `skill_advisor.py` shim is the fallback. New skills are discovered through `graph-metadata.json` plus a valid SKILL.md (name and description required).
- Every skill link must resolve. Link each skill to its own README at `<skill>/README.md`.

Structure and voice:
- Frontmatter (title "Skills Library", a one-sentence description, trigger_phrases such as "skills library", "available skills", "which skill should I use", "skill catalog", "skill routing"), then H1, then a one-line `>` blockquote pitch.
- Numbered ALL-CAPS H2 sections with `---` dividers, no table of contents.
- Section 1 AT A GLANCE (4-row table: Use it for / Invoke with / Families / Catalog). Section 2 OVERVIEW with "Why This Library Exists" (problem-first: a reader cannot tell which of two dozen skills fits, or how routing picks one) then "What It Is" (on-demand skills loaded through Gate 2 or direct read, each self-contained).
- A CATALOG section is the heart: one subsection per family (cli-*, deep-*, mcp-*, sk-*, system-*), each a table of `[skill](skill/README.md)` plus its one-line description from the context report. This is a genuine lookup so a table is right.
- Then ROUTING (how Gate 2 picks a skill), USING A SKILL (route via advisor, open a SKILL.md, run skill-local scripts), CREATING A SKILL (sk-doc scaffolding, the folder layout), TROUBLESHOOTING (advisor returns nothing, wrong skill, new skill not discovered), FAQ, and RELATED DOCUMENTS. Drop any section that does not earn its place and renumber.
- Voice: no em dashes, no double-hyphen `--` separators, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries explanation; tables for the catalog and genuine lookups.
- Target roughly 200 to 320 lines. Show expected output for any command.

Return the complete README as one ```markdown fenced block. Nothing else.
