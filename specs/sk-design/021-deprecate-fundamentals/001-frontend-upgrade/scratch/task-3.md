TASK: write ONE new file, `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md`.

ROLE: you are moving design guidance out of a skill that is being retired and into the sk-code-frontend surface. Nothing useful may be lost.

READ THESE SOURCES FIRST (paths relative to the repo root, your working directory):
1. .skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md
2. .skilled/skills/sk-design/sk-design-fundamentals/references/interaction-craft.md
3. .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md Section 3 "Motion durations" and Section 4 NEVER rule 7
4. .skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md and .skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md Section 3 (read only, to avoid duplicating them)

CONTENT THAT MUST BE IN THE FILE:
- The twelve animation principles adapted to interfaces.
- The enforceable motion ruleset: when not to animate, reduced motion, timing bands, easing and springs, physics, staging, and the duration reconciliation from motion-principles.md Section 5 (rewrite that section so it states the rule without referring to any other skill or file outside .skilled/skills/sk-code/sk-code-frontend/).
- Interaction craft: inputs and forms, pointers, touch and hit areas (44px thumb targets, 32px dense floor), typography implementation including the clamp() tension, focus, keyboard and screen readers, motion at the implementation level, performance, feedback and state.
- Where an item repeats a rule web-accessibility-patterns.md already owns, keep it to one sentence and link that item.
- Focus rings: do NOT recommend box-shadow over outline. State that the focus indicator must stay visible in forced-colors mode and link web-accessibility-patterns.md A5 and A8.
READ THIS FORMAT EXEMPLAR AND COPY ITS SHAPE: .skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md
- Same frontmatter keys: title, description, trigger_phrases (3 to 5 phrases), importance_tier: important, contextType: implementation, version: 1.0.0.0.
- H1, one-line intro, then "## 1. OVERVIEW" with "### Purpose", "### When to Use", "### Boundaries".
- Then numbered "## N. UPPERCASE TITLE" sections. Inside them, items "### M1. Title", "### M2. Title" and so on, each with the bullets Rule, Why, When not to, Pitfall, Support, See also. Support is always "Judgment, no version gate." See also links only to files inside .skilled/skills/sk-code/sk-code-frontend/.
- Tables from the sources (symptom tables, severity tables) stay tables.
- End with "## N. REFERENCES AND RELATED RESOURCES" linking web-visual-values.md, web-accessibility-patterns.md and web-visual-hierarchy.md or web-motion-and-interaction.md, whichever is not this file.

CONTENT THAT MUST NOT BE IN THE FILE:
- Slides, printed layouts, document layouts or any non-screen surface.
- Any book, author, website, source, research, study, spec path, phase or packet. No "Sources" section.
- The words "fundamentals", "sk-design", "this skill", "migrated", "moved from".

STYLE: plain declarative sentences. No em dash, no semicolon, no serial comma. Keep every number from the sources byte-exact.

ALLOWED WRITE PATHS: .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md only.
BANNED OPERATIONS: any git command that changes state (add, commit, mv, rm, checkout, reset, stash), deleting any file, editing any file other than the one allowed path.

VERIFY BEFORE YOU FINISH, and paste both outputs at the end of your reply:
1. python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md
2. grep -n -i -E 'fundamentals|sk-design|refactoring|research|specs/|slide|print|—|;' .skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md
The validator must say VALID. The grep must print nothing except semicolons inside code blocks. Fix and rerun until both hold.
