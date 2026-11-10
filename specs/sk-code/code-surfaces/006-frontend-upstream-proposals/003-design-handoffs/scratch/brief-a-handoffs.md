GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/003-design-handoffs

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @markdown, a LEAF template-first documentation executor. Load `sk-doc` before writing markdown.
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Give open visual values a route to `sk-design-fundamentals`, teach its motion reference reduced motion, and give it an
optional project-profile slot. F = `.skilled/skills/sk-design/sk-design-fundamentals`.

ACTION:
1. Hand-off line. Use this exact sentence, once per file, placed next to the existing `sk-design-md-generator` mention:
   "When a request or a frame leaves a visual value open (spacing, type, color, radius, shadow or motion), or a value sits off every token and scale, load `sk-design-fundamentals` and decide it there."
   - `.skilled/skills/sk-code/SKILL.md`: a new bullet right after line 66 (the `sk-design-md-generator` bullet).
   - `.skilled/skills/sk-code/README.md`: a new table row right after line 103, `| \`sk-design-fundamentals\` | <the sentence> |`.
   - `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md`: one sentence appended to the "Related skills:" paragraph at line 233.
2. `F/references/motion-principles.md`: add a `### Reduced motion` subsection at the end of section 4, after `### When not to animate`.
   It says: honour the user's reduced-motion setting on every animation that moves content. On the web that is the
   `prefers-reduced-motion: reduce` media query. On native it is the platform setting (iOS Reduce Motion, Android Remove
   animations), read through the platform accessibility API. Under reduced motion replace movement with an instant change or
   a short opacity fade, keep essential feedback (progress, state change), and never auto-play motion. Name no animation library.
   The file must stay at 250 lines or fewer.
3. `F/SKILL.md`: add `### Project Profile Slot` after the `### Beyond The Visual System` subsection (before `## 4. RULES`). It says:
   - a project may add an optional `references/<project>-profile.md` with its own values;
   - a profile loads only when the request names that project's UI; an unknown or unnamed project loads no profile;
   - when sources disagree the order is: (1) the repository's mode, (2) the tokens the app installs, (3) the design scales in this file, (4) the profile;
   - the slot adds no routing phrase; a profile is reached by the project naming it.
   Keep it to one short paragraph plus the numbered order.

ALLOWED WRITE PATHS:
- .skilled/skills/sk-code/SKILL.md
- .skilled/skills/sk-code/README.md
- .skilled/skills/mcp-tooling/mcp-figma/SKILL.md
- .skilled/skills/sk-design/sk-design-fundamentals/SKILL.md
- .skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md

BANNED OPERATIONS: no `rm`, no `git` command of any kind, no `mv`, no edit to any `ROUTER.md`, `hub-router.json`,
`graph-metadata.json`, `mode-registry.json` or `description.json`, no new routing phrase anywhere, no installs, no network calls.
No text names a spec folder, phase, task or ADR id, or any company or private project.

VERIFY before the status line, and paste each command with its output and exit code:
- `rg -n "sk-design-fundamentals" .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/README.md .skilled/skills/mcp-tooling/mcp-figma/SKILL.md`
- `rg -n "prefers-reduced-motion" .skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md` and `rg -n -i "reanimated|framer|gsap" <same file>` (must print nothing)
- `wc -l .skilled/skills/sk-design/sk-design-fundamentals/references/motion-principles.md`
- `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on each of the five files
