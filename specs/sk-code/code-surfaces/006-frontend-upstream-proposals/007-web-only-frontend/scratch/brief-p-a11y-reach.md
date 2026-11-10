GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/007-web-only-frontend

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it selects (SKILLED).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Let a web form accessibility request reach the sk-code frontend surface. Today "check this form markup for missing labels and broken tab order" routes nowhere, although `web-accessibility-patterns.md` owns accessible name and focus order.

ACTION:
1. Add the two phrases `broken tab order` and `accessible name` to `WEB_A11Y`'s keywords in `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`
   (the `INTENT_SIGNALS` dict and the prose bullet for `WEB_A11Y` that lists its phrases), and to the `sk-code-frontend` alias list in
   `.skilled/skills/sk-code/hub-router.json` and `.skilled/skills/sk-code/mode-registry.json`, placed right after `keyboard focus`.
   If `.skilled/skills/sk-code/ROUTER.md` mirrors `WEB_A11Y`'s keywords in its own `INTENT_SIGNALS`, add them there too.
2. `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` ~line 242: in the comment, `web, native and Figma phrases` becomes `web and Figma phrases`. Comment only.

ALLOWED WRITE PATHS: `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`, `.skilled/skills/sk-code/ROUTER.md`, `.skilled/skills/sk-code/hub-router.json`, `.skilled/skills/sk-code/mode-registry.json`, `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`.

BANNED OPERATIONS: no `git`, no `rm`, no generator `--write`, no `compiled-route-sync.cjs`, no manifest refresh, no edit outside the allowed paths, no installs, no network. No text names a spec folder, phase, task or finding id, and none names Barter, except the changelog spec-folder blockquotes item 8 asks for. Never write an em dash.

VERIFY, paste each command with output and exit code:
- `for f in hub-router.json mode-registry.json; do node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-code/'+process.argv[1],'utf8'))" $f && echo "$f ok"; done`
- `rg -n "broken tab order" .skilled/skills/sk-code`
- `node --check .skilled/bin/tests/compiled-route-surface-hint.test.cjs`
