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


PERSONA: You are @code, a LEAF implementation agent. Load `sk-code` first and follow the surface it selects (SKILLED).
Edit only the files named below. Never dispatch another agent.
Never alter text, characters or tests to make a check pass. If a check flags a value you believe is legitimate, leave it and report it.
End with one status line: `STATUS=OK FILES=<n>` or `STATUS=FAIL ERROR=<reason>`.


ROLE: Make three realistic frontend prompts reach the sk-code-frontend surface, with vocabulary that router reach proves.

Measured: `node .skilled/bin/compiled-route.cjs --hub sk-code "<prompt>"` (find the real CLI with `git ls-files .skilled/bin | grep compiled-route`)
routes these three prompts away from `sk-code-frontend`:
  a. "Debug the React Native FlatList that drops frames while I scroll the feed" -> sk-code-skilled only
  b. "Add keyboard focus handling and accessibility labels to my native dialog component" -> defer (and the advisor sends it to sk-design-fundamentals)
  c. "Implement this Figma frame as component markup and check the spacing against our tokens" -> defer

ACTION:
1. Add a few multi-word aliases to the `code-frontend-aliases` vocabulary class in `.skilled/skills/sk-code/hub-router.json`
   so each prompt bundles `sk-code-frontend` (for example "flatlist", "accessibility labels", "keyboard focus", "figma frame";
   never a bare one-word stack name such as "css" or "react"). Every copy of the hub vocabulary must agree with hub-router.json:
   read `.github/workflows/routing-registry-drift.yml`, run each check it lists for sk-code locally, and update whatever copy
   they name (mode-registry aliases, graph-metadata intent_signals, the generator's `--write`) the way those checks require.
2. Prove reach: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub sk-code`,
   `--hub sk-design` and `--hub mcp-tooling` must each print `outranked=  0` and `wrong-hub=  0`. If a new alias is outranked,
   rename it (a different multi-word phrase); never add an allowlist entry and never change a scorer.
3. Publish: `node .skilled/bin/compiled-route-sync.cjs` once if any authored compiled-routing file changed (it likely will not);
   then run `node .skilled/bin/compiled-route-status.cjs --hub sk-code`. A `stale-manifest` cause is expected and is fixed by
   the commit hook; report it.

ALLOWED WRITE PATHS: `.skilled/skills/sk-code/hub-router.json`, `.skilled/skills/sk-code/mode-registry.json`,
`.skilled/skills/sk-code/graph-metadata.json`, `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` and any other sk-code
vocabulary copy a drift check names.
BANNED OPERATIONS: no `git` command, no `rm`, no allowlist edit, no scorer edit, no edit outside `.skilled/skills/sk-code/`,
no installs, no network calls.

VERIFY before the status line, and paste each command with its output and exit code:
- the three prompts above through the compiled route, each now naming `sk-code-frontend`
- the three reach commands
- every routing-registry-drift.yml check you ran for sk-code
- `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` ends `OK`
