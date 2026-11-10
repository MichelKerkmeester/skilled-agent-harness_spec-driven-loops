GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/006-open-items-and-alignment

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @markdown, a LEAF documentation executor. Load `sk-doc` before writing markdown.
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Bring the sk-code-frontend references and two pointers up to the repository document standard.

ACTION:
1. Each of these 13 files fails `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>`:
   figma-to-code.md, native-accessibility.md, native-inputs-and-keyboard.md, native-layout-and-text.md,
   native-lists-and-motion.md, native-platform-differences.md, web-accessibility-patterns.md, web-cascade-and-selectors.md,
   web-elements-and-attributes.md, web-internationalization.md, web-layout-and-sizing.md, web-markup-and-css.md,
   web-performance-and-loading.md, all in `.skilled/skills/sk-code/sk-code-frontend/references/`.
   Two error classes: `missing_required_section: overview` (section 1 must be an Overview: follow the two files that pass,
   `frontend-practice.md` "## 1. OVERVIEW AND LAYERS" and `react-native-layout-and-a11y.md` "## 1. OVERVIEW AND BOUNDARY";
   rename the first H2 to `## 1. OVERVIEW AND <its current topic>` when its body already opens the topic, or add a short
   overview of two or three sentences and renumber), and `general_h2_separator` (put a `---` line before each numbered H2 that
   lacks one). Keep every rule and fact; change only headings, dividers and numbering, and fix any in-file anchor link the
   renumbering breaks.
2. `figma-to-code.md` line ~100 says Pass 3a reads styles "from bdg dom eval and getComputedStyle"; `web-markup-and-css.md`
   records `bdg dom eval` failing and uses `bdg cdp Runtime.evaluate`. Make figma-to-code.md name `bdg cdp Runtime.evaluate`.
3. `sk-code-frontend/SKILL.md` line ~29 and `README.md` line ~52 say "six `web-*.md`" topic files, but that glob matches seven
   (it includes the stack layer `web-markup-and-css.md`). Say "six web topic files" without the glob, as the ROUTER does.
4. `sk-code-frontend/README.md` line ~66: the rg recipe alternates on `## MACHINE ROUTER`, but the heading is
   `## 3. MACHINE ROUTER`, so it never prints. Make the pattern match the real heading.
5. In `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` line ~233 and `.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md`
   line ~21, the path `sk-code/sk-code-frontend/references/figma-to-code.md` resolves from nowhere; write the repo path
   `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`.

ALLOWED WRITE PATHS: the files named above.
BANNED OPERATIONS: no `git` command, no `rm`, no edit to any other file, no installs, no network calls. Never write an em dash.

VERIFY before the status line, and paste each command with its output and exit code:
- `for f in .skilled/skills/sk-code/sk-code-frontend/references/*.md; do python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$f" >/dev/null || echo "FAIL $f"; done; echo done` prints only `done`
- `rg -n "bdg dom eval" .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` prints nothing
- `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` ends `OK`
