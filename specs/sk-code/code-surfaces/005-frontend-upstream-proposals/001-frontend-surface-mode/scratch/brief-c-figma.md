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
writing markdown. Write only the file named below. Never dispatch another agent or another codex.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=1` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Port one Figma-to-code reference into Skilled as a stack-agnostic doc.

CONTEXT:
- Source (read-only): `specs/sk-code/018-frontend-upstream-proposals/001-frontend-surface-mode/scratch/source/figma-to-code.md`
- Target: `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md`

ACTION: Create the target from the source. Change only these things:
1. Remove every Barter reference: "Barter's designers" becomes "Design teams"; drop the
   `barter-design-tokens.md` link and say "the tokens the app installs"; drop the
   "Barter Managed uses bun run validate:design-system-vars" sentence.
2. Workflow step 4 becomes: "When the frame leaves a value open, or a value is off every token and
   scale, load [`sk-design-fundamentals`](../../../sk-design/sk-design-fundamentals/SKILL.md) and decide
   the value there, not here. A frame that maps cleanly to tokens needs no design step."
3. Pass 5 fail condition: contrast is below the target set by sk-design-fundamentals, and when no
   project target exists use WCAG 2.2 AA (keep the 4.5:1, 3:1 and 1.4.11 text and both links). Drop
   the profile clause.
4. Keep everything else word for word: the five passes table, the `NOT RUN` and `INCOMPLETE` verdict
   rule, the Figma-side tool ladder, and the per-transport table with every `UNKNOWN` cell.
5. Frontmatter: keep the keys, set `version: 1.0.0.0`, and a description with no project name.

VERIFY before the status line, and paste the output:
- `rg -n -i "barter|validate:design-system-vars|app ui profile" .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` prints nothing.
- `rg -c "UNKNOWN" .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` prints the same count as on the source file.
- `rg -n "INCOMPLETE" .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` prints the verdict rule.
