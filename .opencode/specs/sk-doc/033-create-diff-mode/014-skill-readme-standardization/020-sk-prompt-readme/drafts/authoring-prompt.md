Spec folder: sk-doc/014-skill-readme-standardization/020-sk-prompt-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `sk-prompt` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/sk-doc/014-skill-readme-standardization/020-sk-prompt-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/sk-prompt/` to confirm).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`. Read it; yours should read like it.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements on facts:
- The seven frameworks are RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE and CRAFT, defined in `references/patterns_evaluation.md`. The skill auto-selects by scoring the task.
- DEPTH is a five-phase thinking pass: Discover, Engineer, Prototype, Test, Harmonize. The round count is mode-driven (zero for raw, three for short, ten for the standard modes). Do NOT say "5 to 10 rounds".
- CLEAR scores out of fifty: Correctness 10, Logic 10, Expression 15, Arrangement 10, Reusability 5. The pass threshold is forty, with per-dimension floors that block a pass even at forty-plus.
- Dispatch is the `/prompt` command and the `@prompt-improver` agent (the fresh-context escalation surface). Modes include the interactive default, `$text`, `$short`, `$improve`, `$refine`, `$json`, `$yaml` and `$raw`. Describe the modes; do NOT pin a mode count (the docs disagree on 8 versus 9).
- `assets/framework-registry.json` holds only a code-oriented subset (five of the seven frameworks). Do NOT present it as the source of all seven definitions; the definitions live in `references/patterns_evaluation.md`.
- Do NOT cite a version number. Every cited path must resolve.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. No table of contents.
- Frontmatter (title `sk-prompt`, one-sentence description, trigger_phrases such as "improve prompt", "prompt engineering", "framework", "CLEAR scoring", "/prompt"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: sk-prompt turns a vague ask into a structured prompt by auto-selecting from seven frameworks, running a five-phase DEPTH thinking pass and scoring the result with CLEAR so a prompt ships only when it clears the threshold. In QUICK START show a `/prompt` invocation and a mode flag with the transparency-report output. In HOW IT WORKS cover framework selection, the DEPTH phases, the CLEAR rubric and the modes. INTEGRATION states the boundary with `sk-prompt-models` (which chooses which framework a small model wants) and the cli-X executors (mechanics).
- Target length roughly 230 to 330 lines. Every command shows its expected output.

Return the complete README as one ```markdown fenced block. Nothing else.
