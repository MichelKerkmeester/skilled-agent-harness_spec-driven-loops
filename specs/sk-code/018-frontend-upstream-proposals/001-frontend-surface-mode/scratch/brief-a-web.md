GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

PERSONA: You are @markdown, a LEAF template-first documentation executor. Load `sk-doc` before
writing markdown. Write only the files named below. Never dispatch another agent or another codex.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Port a frontend reference set into Skilled as stack-agnostic docs.

CONTEXT:
- Sources (read-only): `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/scratch/source/`
- Baseline data (read-only JSON, key `features.<id>`): `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/scratch/baseline-lookup.json`
- Target folder (create it): `.skilled/skills/sk-code/sk-code-frontend/references/`

ACTION: Create exactly these 8 files in the target folder, one per same-named source file:
frontend-practice.md, web-markup-and-css.md, web-elements-and-attributes.md,
web-cascade-and-selectors.md, web-layout-and-sizing.md, web-accessibility-patterns.md,
web-performance-and-loading.md, web-internationalization.md

Rules, applied to every file:
1. Keep every technical rule, section number, heading and anchor. Each file stays at 215 lines or fewer.
2. Remove everything project-specific: the word "Barter", `@barter-bv`, every repository or app name
   (fe-partners-app, fe-backoffice-app, fe-barter-managed, fe-creators-mobile, fe-ui-components,
   bartender, barter-scrooge, barter-expo), ng-bootstrap and Material mappings, `@ngx-translate` notes,
   and any declared browser floor or "Target:" verdict. A framework may be named as an example,
   but no rule may depend on one framework.
3. Rewrite each `**Support.**` line that names browser versions to exactly this shape, using the
   matching web-features id from the Baseline JSON:
   `**Support.** Baseline <widely available since <high_date> | newly available since <low_date> | limited availability> (web-features `<id>`). Chrome <c> / Firefox <f> / Safari <s>.`
   Take the versions from the JSON entry. If no entry matches, keep the source versions, write
   `Baseline: no web-features entry.` and list that line in your report. Keep `Judgment, no version gate.` lines as they are.
   In a support summary table, replace the Target column with a Baseline column filled the same way.
4. In frontend-practice.md:
   - Section 3: values come from the project's installed tokens, a missing token is reported, and a value
     the tokens or the frame leave open goes to `sk-design-fundamentals`
     (link `../../../sk-design/sk-design-fundamentals/SKILL.md`). Drop the profile and the design-tokens file links.
   - Section 5 (overrides): keep the contract word for word except "The mode" becomes "A project or stack mode".
   - Section 6 stack-layer table: replace the Modes column with "Applies to": "Any DOM and CSS app, whatever the framework" for web, "Any React Native app" for native. Drop the component-library row.
   - Keep the links to `react-native-layout-and-a11y.md`, the `native-*.md` files and `figma-to-code.md`; those files are written by later tasks.
5. Frontmatter: keep the keys, set `version: 1.0.0.0`, and make every trigger phrase multi-word with no project name.

FORMAT (report): for each file, its line count; then every Support line you could not match.

VERIFY before the status line, and paste the output:
- `rg -n -i "barter|@barter-bv|ngx-translate|ng-bootstrap|safari 18|firefox esr|fe-partners|fe-backoffice|creators-mobile|ui-components|bartender|scrooge|target:" .skilled/skills/sk-code/sk-code-frontend/references/` prints nothing.
- `wc -l .skilled/skills/sk-code/sk-code-frontend/references/*.md` shows every file at 215 or fewer.
- `rg -c "Baseline" .skilled/skills/sk-code/sk-code-frontend/references/web-*.md` prints 1 or more for each file.
