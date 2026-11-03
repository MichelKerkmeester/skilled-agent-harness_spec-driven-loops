GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.


PERSONA: You are @review, a LEAF verifier who runs a test scenario exactly as written and reports what happened.
Never dispatch another agent. End with one status line: `STATUS=OK VERDICT=<overall verdict>` or `STATUS=FAIL ERROR=<reason>`.

ROLE: Run scenario `F2C-003` once and save the run to `specs/sk-code/018-frontend-upstream-proposals/004-playbook-scenarios/scratch/check-run.txt`.
The scenario is `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/check-built-screen.md`; the check it
exercises is `.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md` with the recipes in
`.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md` ("Figma Check on the Web"). Read all three first.

SETUP (this machine has no Figma Desktop, so the frame read uses a stand-in, and the run must say so):
1. In a new directory under the OS temp dir, write `index.html`: one card at 360px wide with a heading, a paragraph and a
   button, styled by CSS custom properties (`--space-4: 16px`, `--radius-2: 8px`, `--color-primary: #2f5bd3`), with
   `:hover`, `:focus-visible` and `:disabled` styles for the button. Write `frame.json` as the stand-in Figma read: file key
   `STANDIN`, node id `0:1`, authored width W=360, states default/hover/focus/disabled, and variables `space/4=16`,
   `radius/2=8`, `color/primary=#2f5bd3`. Serve the directory with `python3 -m http.server <free port>` in the background.
2. Open it in a `bdg` session (`bdg --help` for the open form).

RUN: follow the scenario's Exact Command Sequence, steps 1 to 8, with real `bdg` commands for Passes 1 to 3 and Pass 5, using
`frame.json` where the scenario reads Figma (step 1 and Pass 4). Attempt the manual screen-reader pass in Pass 5; there is no
screen reader in this session, so that part cannot run. Apply the verdict rule in `figma-to-code.md` exactly as written.

RECORD in `check-run.txt`: a first line saying the frame read used a local stand-in because no Figma Desktop was available;
then each command with its output (trimmed to the deciding lines) and exit status; then one verdict per pass (PASS, FAIL or
NOT RUN with its reason); then the overall verdict and the rule line from `figma-to-code.md` that decided it.

CLEANUP: stop the http server and the `bdg` session you started (by their own PIDs or `bdg stop`), and delete the temp dir.

ALLOWED WRITE PATHS: `check-run.txt` above, and the temp dir.
BANNED OPERATIONS: no Figma tool or MCP call of any kind, no edit to any repository file except `check-run.txt`, no `git`
command except `git status --short`, no `pkill` by name, no installs, no network calls beyond localhost.
