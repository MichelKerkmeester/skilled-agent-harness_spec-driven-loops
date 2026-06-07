Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/019-sk-prompt-small-model-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `sk-prompt-small-model` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/135-skill-readme-standardization/019-sk-prompt-small-model-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/sk-prompt-small-model/` to confirm).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`. Read it; yours should read like it.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements on facts:
- The hub owns per-model prompt-craft (framework, scaffold, gotchas) and the model registry; the cli-devin and cli-opencode executors own the mechanics (flags, wrappers, budgets, permissions); `sk-prompt` owns the generic framework definitions; `system-spec-kit` owns the runtime helpers. State this four-way ownership clearly.
- The framework assignments: RCAF is the default (swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1), MiniMax uses TIDD-EC, MiMo uses COSTAR. Describe the pattern; do NOT pin a total model count (the set drifts).
- Dispatch goes through two active executors, cli-devin and cli-opencode, plus an optional third (cli-claude-code for haiku). Do NOT say "five executors".
- The navigation chain: resolve the model id, read `references/models/_index.md`, read `references/models/<id>.md`, then follow `references/pattern-index.md` to the executor mechanics. The hub carries no tools and no runtime code.
- Do NOT cite a version number. Every cited path must resolve.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. No table of contents.
- Frontmatter (title `sk-prompt-small-model`, one-sentence description, trigger_phrases such as "small model prompt", "model profile", "cli-devin", "cli-opencode", "prompt framework"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: before dispatching any small model, you look up its prompt-craft profile here (the right framework, scaffold and gotchas), then apply the executor mechanics from cli-devin or cli-opencode. Craft lives here, mechanics live in the executor, and the advisor surfaces this hub next to whichever executor is in use. In QUICK START show the navigation chain (pick the model in `_index.md`, read its profile, follow `pattern-index.md` to the cli-X). In HOW IT WORKS cover the per-model profiles, the framework map, the registry the profiles mirror, and the craft-versus-mechanics split. INTEGRATION states the boundary with `sk-prompt` (generic frameworks), `cli-devin` and `cli-opencode` (mechanics).
- Target length roughly 220 to 320 lines. Show concrete paths and the navigation steps.

Return the complete README as one ```markdown fenced block. Nothing else.
