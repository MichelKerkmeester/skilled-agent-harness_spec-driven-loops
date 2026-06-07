Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/008-deep-improvement-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `deep-improvement` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/135-skill-readme-standardization/008-deep-improvement-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/deep-improvement/` to confirm). Do not invent counts or paths. Do NOT cite a version number, and do NOT cite brittle feature-catalog or playbook counts. Use only the current name `deep-improvement`, never the old `deep-agent-improvement`.
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`, and a sibling deep-* example is `.opencode/skills/deep-context/README.md`. Read at least one; yours should read like its sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `deep-improvement`, one-sentence description, trigger_phrases from SKILL.md), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: it is PROPOSAL-FIRST (writes packet-local candidates and never mutates the canonical file before the score and approval gates pass), it has THREE LANES (A agent-improvement, B model-benchmark, C skill-benchmark), and Lane A scores candidates on five weighted dimensions before a guarded promotion with rollback. Show the Lane A `/deep:start-agent-improvement-loop` command in QUICK START. In HOW IT WORKS cover the integration scan, the five scoring dimensions and the guarded promotion. INTEGRATION states the sibling deep loops and that it is the one deep loop that can mutate, but only behind the promotion gate.
- Target length roughly 240 to 340 lines. Every command shows its expected output; every cited path must resolve.

Return the complete README as one ```markdown fenced block. Nothing else.