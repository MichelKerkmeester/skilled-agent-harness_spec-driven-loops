Spec folder: sk-code/z_archive/013-sk-code-review-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `sk-code-review` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/sk-code/z_archive/013-sk-code-review-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/sk-code-review/` to confirm).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`. Read it; yours should read like it.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements on facts:
- Severity is P0 (Blocker, blocks merge), P1 (Required, fix before merge), P2 (Suggestion, optional), from `references/review_core.md`. P0 and P1 findings require a file:line citation.
- The output contract is, in order: `## Code Review Summary`, then `## Findings` (with P0, P1, P2 subsections), then `## Removal/Iteration Plan`, then `## Next Steps`, and the review MUST end with exactly one final line: `Review status: APPROVED`, `Review status: REQUESTED_CHANGES` or `Review status: COMMENTED`. Do NOT invent a `## Review Context` heading (it does not exist; baseline and surface info live inside `## Code Review Summary`).
- It is dispatched as the `@review` baseline; the dispatcher prepends `CODE-REVIEW` as the first line of the prompt. The review is read-only and never edits the code under review.
- It is the single-pass review baseline; `deep-review` is the multi-iteration loop, and `sk-code` supplies the surface standards. sk-code-review and deep-review share `references/review_core.md`.
- Do NOT cite any version number, do NOT cite a line count, do NOT cite a reference-file count (the docs disagree), and do NOT cite any `assets/` path (no assets directory exists). Every cited path must resolve.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. No table of contents and no stray non-numbered top-level headings.
- Frontmatter (title `sk-code-review`, one-sentence description, trigger_phrases such as "code review", "review", "findings-first", "pull request", "security review"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: a stack-agnostic findings-first review baseline that always enforces security and correctness minimums, classifies every finding by blocking severity (P0/P1/P2) with file:line evidence, and ends with one exact `Review status:` line a gate can parse, pairing with `sk-code` for the detected surface's standards. In QUICK START show the `@review` dispatch and the output contract (Summary, Findings, the Review status final line). In HOW IT WORKS cover the findings-first analysis order, the severity taxonomy, the baseline-plus-surface precedence and the single-pass rule. INTEGRATION states the boundary with `deep-review` (the loop) and `sk-code` (surface standards), and that review_core is shared with deep-review.
- Target length roughly 230 to 330 lines. Every command or contract shows its expected output.

Return the complete README as one ```markdown fenced block. Nothing else.
