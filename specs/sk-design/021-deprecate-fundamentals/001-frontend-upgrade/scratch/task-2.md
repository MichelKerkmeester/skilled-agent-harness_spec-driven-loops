TASK: write ONE new file, `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md`.

ROLE: you are moving design guidance out of a skill that is being retired and into the sk-code-frontend surface. Nothing useful may be lost.

READ THESE SOURCES FIRST (paths relative to the repo root, your working directory):
1. .skilled/skills/sk-design/sk-design-fundamentals/references/hierarchy.md
2. .skilled/skills/sk-design/sk-design-fundamentals/references/diagnosis-table.md
3. .skilled/skills/sk-design/sk-design-fundamentals/references/build-procedure.md
4. .skilled/skills/sk-design/sk-design-fundamentals/references/ux-laws.md
5. .skilled/skills/sk-design/sk-design-fundamentals/references/review-checklist.md
6. .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md Section 3 "The Procedure" and "Hierarchy, The Technique That Does The Most Work", and Section 6 "SUCCESS CRITERIA"
7. .skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md (read only, to avoid duplicating it)

CONTENT THAT MUST BE IN THE FILE:
- The hierarchy method: three tiers, emphasis by weight and colour, emphasize by de-emphasizing, action styling and the destructive-action treatment, labels as a last resort, weight versus contrast, visual versus document hierarchy.
- The full symptom-to-fix diagnosis tables, and the rule to load them first when improving existing UI.
- The seven-step build procedure with its reasoning, for starting something new.
- Every UX law with its practical rule.
- The review pass: the WCAG-cited accessibility rows (critical, serious, moderate), the visual and component checks, the report format and the reviewer rules. Where a row repeats a rule web-accessibility-patterns.md already owns, keep the row short and link to that item.
- The completion checklist and quality gates from SKILL.md Section 6.
- The focus-ring row must say: keep a visible focus indicator that survives forced-colors mode, and link web-accessibility-patterns.md A5 and A8. Do NOT recommend box-shadow as the focus ring, because a shadow disappears in forced-colors mode.
READ THIS FORMAT EXEMPLAR AND COPY ITS SHAPE: .skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md
- Same frontmatter keys: title, description, trigger_phrases (3 to 5 phrases), importance_tier: important, contextType: implementation, version: 1.0.0.0.
- H1, one-line intro, then "## 1. OVERVIEW" with "### Purpose", "### When to Use", "### Boundaries".
- Then numbered "## N. UPPERCASE TITLE" sections. Inside them, items "### H1. Title", "### H2. Title" and so on, each with the bullets Rule, Why, When not to, Pitfall, Support, See also. Support is always "Judgment, no version gate." See also links only to files inside .skilled/skills/sk-code/sk-code-frontend/.
- Tables from the sources (symptom tables, severity tables) stay tables.
- End with "## N. REFERENCES AND RELATED RESOURCES" linking web-visual-values.md, web-accessibility-patterns.md and web-visual-hierarchy.md or web-motion-and-interaction.md, whichever is not this file.

CONTENT THAT MUST NOT BE IN THE FILE:
- Slides, printed layouts, document layouts or any non-screen surface.
- Any book, author, website, source, research, study, spec path, phase or packet. No "Sources" section.
- The words "fundamentals", "sk-design", "this skill", "migrated", "moved from".

STYLE: plain declarative sentences. No em dash, no semicolon, no serial comma. Keep every number from the sources byte-exact.

ALLOWED WRITE PATHS: .skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md only.
BANNED OPERATIONS: any git command that changes state (add, commit, mv, rm, checkout, reset, stash), deleting any file, editing any file other than the one allowed path.

VERIFY BEFORE YOU FINISH, and paste both outputs at the end of your reply:
1. python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md
2. grep -n -i -E 'fundamentals|sk-design|refactoring|research|specs/|slide|print|—|;' .skilled/skills/sk-code/sk-code-frontend/references/web-visual-hierarchy.md
The validator must say VALID. The grep must print nothing except semicolons inside code blocks. Fix and rerun until both hold.
