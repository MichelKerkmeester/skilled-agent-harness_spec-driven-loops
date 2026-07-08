Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/011-deep-review-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `deep-review` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/z_archive/109-skill-readme-standardization/011-deep-review-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/deep-review/` to confirm). Do not invent paths or counts. Do NOT cite a version number, a hard file/feature count, a tool-call budget or a scenario count (these drift in the current README). Do NOT cite `references/guides/capability_matrix.md`, `references/convergence/convergence_graph.md` or `references/convergence/convergence_reference_only.md` — those do NOT exist in deep-review.
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`, and the sibling deep-* example already in this voice is `.opencode/skills/deep-research/README.md`. Read at least one; yours should read like its sibling.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering.
- Frontmatter (title `deep-review`, one-sentence description, trigger_phrases such as "deep review", "code audit", "review loop", "release readiness", "convergence detection", "/deep:start-review-loop"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: it runs an autonomous review loop that audits one dimension per iteration with fresh context, classifies every finding by blocking severity (P0/P1/P2), and ends with a release-readiness verdict (PASS, CONDITIONAL or FAIL) that routes the next command. Show the `/deep:start-review-loop:auto "target"` command in QUICK START, and note it reviews five target types (a spec folder, a skill, an agent, a track or a file set). In HOW IT WORKS cover the iteration lifecycle (one dimension per pass), the severity and verdict model, externalized state, and convergence detection (the three-signal vote behind the legal-stop gates, with the P0 override). INTEGRATION states the boundary with the sibling deep loops and with single-pass `sk-code-review`.
- Target length roughly 230 to 330 lines. Every command shows its expected output; every cited path must resolve.

Return the complete README as one ```markdown fenced block. Nothing else.
