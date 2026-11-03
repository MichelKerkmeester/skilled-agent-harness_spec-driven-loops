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

PERSONA: You are @markdown, a LEAF documentation executor. Load `sk-doc` before writing markdown.
Edit only the one file named below. Never dispatch another agent or another codex.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=1` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Restore live-verified browser recipes to one section of a reference file.

ACTION: In `.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md`, replace the whole
body of the `### Figma Check on the Web` subsection (from the line after that heading up to, not including,
the `**Deeper:**` line) with exactly the text between the two marker lines below. Change nothing else.
If the file then exceeds 215 lines, shorten only the `### Angular` and `### React` example bullets, keeping
every rule, until it fits.

----- BEGIN TEXT -----
Every recipe below ran against a live page with `bdg` 0.6.10. For methods with parameters, use `bdg cdp <Domain.method> --params '<json>'`; `bdg cdp --help` confirms the form.

Open the rendered build in a `bdg` session.

- Set the viewport to the frame's authored width W in CSS pixels with `bdg cdp Emulation.setDeviceMetricsOverride --params '{"width":<w>,"height":<h>,"deviceScaleFactor":1,"mobile":<bool>}'`.
- Set the colour scheme the frame shows before capturing, because a headless browser follows the system setting: `bdg cdp Emulation.setEmulatedMedia --params '{"features":[{"name":"prefers-color-scheme","value":"light"}]}'`.
- Capture with `bdg dom screenshot <path>`.
- Read resolved styles for Pass 3a with `bdg cdp Runtime.evaluate --params '{"expression":"getComputedStyle(document.querySelector(\"<css>\")).<property>","returnByValue":true}'`. `bdg dom eval` failed with "Session target not found" in the same session, so use `Runtime.evaluate`.
- **Pass 2, state by state:**
  1. Enable the domains once per session: `bdg cdp DOM.enable`, then `bdg cdp CSS.enable`. `CSS.forcePseudoState` needs the CSS domain enabled.
  2. Resolve the document with `bdg cdp DOM.getDocument` and use its `root.nodeId` as `<rootId>`. Resolve the element with `bdg cdp DOM.querySelector --params '{"nodeId":<rootId>,"selector":"<css>"}'` and use the result's `nodeId` as `<id>`.
  3. Emulate reduced motion first, `bdg cdp Emulation.setEmulatedMedia --params '{"features":[{"name":"prefers-reduced-motion","value":"reduce"}]}'`. A style read straight after forcing a state otherwise returns a mid-transition value.
  4. Force each state with its own call, `bdg cdp CSS.forcePseudoState --params '{"nodeId":<id>,"forcedPseudoClasses":["hover"]}'`, then `["active"]` and `["focus"]`. Force `focus-visible` only when `bdg cdp --describe CSS.forcePseudoState` confirms support. Clear with an empty `forcedPseudoClasses` list before the next state.
  5. The disabled state comes from the element's `disabled` attribute, not a forced class.
  6. Capture each state with `bdg dom screenshot <path>`, and confirm the capture shows the state.
  7. Check dark mode with the same `setEmulatedMedia` method and `{"name":"prefers-color-scheme","value":"dark"}`, only where the project supports dark mode. Reset with `--params '{"features":[]}'`.
  8. If CDP cannot run, use real hover, click and keyboard focus. If neither path runs, record `NOT RUN` with the reason.
- **Pass 5, range and access:**
  1. Test narrow, medium and wide widths below and above W with `Emulation.setDeviceMetricsOverride`. Reset with `bdg cdp Emulation.clearDeviceMetricsOverride`.
  2. Check 200 percent zoom with `bdg cdp Emulation.setPageScaleFactor --params '{"pageScaleFactor":2}'`, and reset with `1`.
  3. Traverse the page with real Tab presses, and record the focus order and any trap.
  4. Check names, roles and states with `bdg cdp Accessibility.getFullAXTree`, or with a manual screen-reader pass.
  5. Read computed text and background colours with `Runtime.evaluate` as above, then check contrast against the target `sk-design-fundamentals` sets.
  6. Record any check that cannot run as `NOT RUN` with the reason.
- Use [mcp-aside-devtools](../../../mcp-tooling/mcp-aside-devtools/SKILL.md) as the fallback renderer. Its `aside repl` is Playwright-compatible and can capture screenshots, but it has no CDP-domain parity, so it cannot force states or emulate media. Keep `bdg` for those checks.

See [mcp-chrome-devtools](../../../mcp-tooling/mcp-chrome-devtools/SKILL.md) for documented `bdg` commands.

----- END TEXT -----

VERIFY before the status line, and paste the output:
- `rg -c "bdg cdp" .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` prints 10 or more.
- `rg -n "bdg dom eval" .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` prints only the one line that warns against it.
- `wc -l .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` prints 215 or fewer.
