TASK: write ONE new file, `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md`.

ROLE: you are moving design-value guidance out of a skill that is being retired and into the sk-code-frontend surface. Nothing useful may be lost. Every number must survive byte-exact.

READ THESE SOURCES FIRST (all paths are relative to the repo root, your working directory):
1. .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md, Section 3 "The Systems" and Section 4 "RULES" (ALWAYS, NEVER, ESCALATE IF).
2. .skilled/skills/sk-design/sk-design-fundamentals/references/color-system.md
3. .skilled/skills/sk-design/sk-design-fundamentals/references/depth-and-detail.md
4. .skilled/skills/sk-design/sk-design-fundamentals/assets/token-starter-set.md
5. .skilled/skills/sk-code/sk-code-frontend/assets/tokens.css (the token file now lives here)

READ THIS FORMAT EXEMPLAR AND COPY ITS SHAPE: .skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md
- Same frontmatter keys: title, description, trigger_phrases (3 to 5 phrases), importance_tier: important, contextType: implementation, version: 1.0.0.0.
- H1, one-line intro, then "## 1. OVERVIEW" with "### Purpose", "### When to Use", "### Boundaries".
- Then numbered "## N. UPPERCASE TITLE" sections. Inside them, items "### V1. Title", "### V2. Title" and so on, each with the bullets Rule, Why, When not to, Pitfall, Support, See also. Support is always "Judgment, no version gate." See also links only to files inside .skilled/skills/sk-code/sk-code-frontend/.
- Put the literal scale lists (spacing, opacity, type, shadows, motion durations) in fenced `text` or `css` blocks exactly as the source has them.
- End with a "## N. REFERENCES AND RELATED RESOURCES" section linking ../assets/tokens.css, web-visual-hierarchy.md, web-motion-and-interaction.md and web-accessibility-patterns.md.

CONTENT THAT MUST BE IN THE FILE:
- Every scale from SKILL.md Section 3: spacing and sizing, opacity set, type scale, the px/rem-only rule, font weight, colour ramp counts and 100-900 naming, HSL, no runtime shades, the five shadow elevations, line-height and line length (including why em is correct for max-width), border radius and concentric radius, motion duration bands.
- The full colour construction method from color-system.md: base 500 first, edges, gap fills, saturation at the ends, hue rotation, warm and cool greys, both contrast escape hatches, dark mode.
- From depth-and-detail.md: light source, the two-part and layered shadow systems and "pick one per project", shadow colour, button anatomy, depth without shadows, typography detail, personality decisions, grids, semi-transparent borders, component shape, images.
- From token-starter-set.md: the role layer, which grey for which text, retuning for a project.
- Every ALWAYS, NEVER and ESCALATE IF rule from SKILL.md Section 4, except NEVER rule 6 about focus outlines (web-accessibility-patterns.md A5 owns focus styling; link to it instead).
- Contrast numbers with their WCAG criteria: 4.5:1 normal text, 3:1 for 24px regular or 18.66px bold, 3:1 for functional non-text (1.4.11).

CONTENT THAT MUST NOT BE IN THE FILE:
- Slides, printed layouts, document layouts or any non-screen surface.
- Any book, author, website, source, research, study, spec path, phase or packet. No "Sources" section.
- The words "fundamentals", "sk-design", "this skill", "migrated", "moved from".
- Hierarchy, diagnosis, build procedure, UX laws, review checklist and motion principles. Those go to other files.

STYLE: plain declarative sentences. No em dash, no semicolon, no serial comma.

ALLOWED WRITE PATHS: .skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md only.
BANNED OPERATIONS: any git command that changes state (add, commit, mv, rm, checkout, reset, stash), deleting any file, editing any file other than the one allowed path.

VERIFY BEFORE YOU FINISH, and paste both outputs at the end of your reply:
1. python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md
2. grep -n -i -E 'fundamentals|sk-design|refactoring|wathan|schoger|research|specs/|slide|print|—|;' .skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md
The validator must say VALID. The grep must print nothing except semicolons inside css code blocks. Fix and rerun until both hold.
