Spec folder: sk-code/z_archive/014-sk-code-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `sk-code` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/sk-code/z_archive/014-sk-code-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/sk-code/` to confirm).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`. Read it; yours should read like it.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements on facts:
- There are TWO surfaces, WEBFLOW and OPENCODE, plus an UNKNOWN fallback. MOTION_DEV is NOT a surface. It is a cross-stack resource intent that supplements WEBFLOW or OPENCODE when the task touches the Motion.dev API. Do NOT call MOTION_DEV a third surface and do NOT list it as a valid surface-override value.
- OPENCODE wins detection precedence over WEBFLOW (because `.opencode/` tools sometimes ship frontend animation libraries internally).
- The routing model is: surface detection, then intent classification, then surface resources, then verification evidence.
- The phase lifecycle is five gated phases: Phase 0 Research, Phase 1 Implementation, Phase 1.5 Code Quality Gate, Phase 2 Debugging, Phase 3 Verification. Do NOT conflate the four-step routing model with the five-phase lifecycle.
- The Iron Law, quoted: no completion claim without fresh verification evidence from the detected surface.
- sk-code is the only skill end users edit when adopting the template repo for their stack (replace the per-surface references and assets). Every other skill stays codebase-agnostic.
- Do NOT cite a version number, a line count or a hard intent count (the docs disagree or these drift). Every cited path must resolve.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. No table of contents.
- Frontmatter (title `sk-code`, one-sentence description, trigger_phrases such as "code", "implement", "code quality", "verification", "webflow", "opencode"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: sk-code is the single code-work skill that detects which surface it is in (WEBFLOW or OPENCODE, with an UNKNOWN fallback), loads that surface's standards, and enforces the Iron Law so no work is called done without fresh surface verification evidence. It is also the one skill you customize for your own stack. In QUICK START show how a surface is detected and a verification command runs. In HOW IT WORKS cover surface detection and precedence, the intent routing, the five gated phases, and the Iron Law. INTEGRATION states the boundary with `sk-code-review` (review output), `sk-doc` (docs) and `sk-git` (git), and that MOTION_DEV is a cross-stack resource intent rather than a surface.
- Target length roughly 240 to 340 lines. Every command shows its expected output.

Return the complete README as one ```markdown fenced block. Nothing else.
