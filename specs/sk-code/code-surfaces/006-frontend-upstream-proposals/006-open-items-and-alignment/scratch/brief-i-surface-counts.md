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


ROLE: sk-code now has three surface packets (`sk-code-ci`, `sk-code-frontend`, `sk-code-skilled`, as
`.skilled/skills/sk-code/mode-registry.json` lists them). Correct every place that still says two, or omits the frontend one.

ACTION: in each file below, change only the stale sentence, in the file's existing voice, naming the frontend surface as
"stack-agnostic web and React Native frontend practice (markup, CSS, accessibility, i18n, performance, native layout, and
the five-pass Figma check)". Read `.skilled/skills/sk-code/README.md` first; it already describes three surfaces, so copy
its wording.
1. `README.md` (repo root) line ~825 "- Two surfaces. ..." and line ~1558 "`sk-code` ships two surfaces. ...".
2. `.skilled/skills/README.txt` line ~60: the sk-code row's surface list, in the order `sk-code-ci`, `sk-code-frontend`,
   `sk-code-skilled`.
3. `.skilled/skills/sk-code/graph-metadata.json` `derived.causal_summary` (line ~291): "one of two read-only surface evidence
   packets (sk-code-ci, sk-code-skilled)" becomes three. Keep the field under 600 characters and the JSON valid.
4. `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` line ~81: add `sk-code-frontend/` to the packet list.
5. `.skilled/skills/sk-code/sk-code-review/README.md`: add a `sk-code-frontend` row to the Related Skills table after the
   `sk-code-ci` row (line ~164), saying the hub bundles it beside review when a request names frontend web or React Native
   terms, and name it in the FAQ answer at line ~202 next to `sk-code-skilled`.
6. `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` line ~27 ("two surface
   packets") and line ~141 ("all four packets"): read `.skilled/skills/sk-code/hub-router.json` and make both sentences match it.
7. `.skilled/skills/sk-code/ROUTER.md` line ~219, in the DO NOT list: "Load Go/NextJS/React Native resources (those live in
   the Barter fork)" contradicts section 6, which now gives stack-agnostic React Native practice to `sk-code-frontend`.
   Replace it with "Load Go or NextJS resources, or a project fork's own React Native surfaces, from canonical sk-code".

ALLOWED WRITE PATHS: the seven files named above.
BANNED OPERATIONS: no `git` command, no `rm`, no edit to any other file, no installs, no network calls. Never write an em dash.

VERIFY before the status line, and paste each command with its output and exit code:
- `rg -n -i "two surfaces|two surface packets|two read-only surface" README.md .skilled/skills/README.txt .skilled/skills/sk-code .skilled/skills/sk-doc/sk-create-skill/references` prints nothing
- `node -e 'JSON.parse(require("fs").readFileSync(".skilled/skills/sk-code/graph-metadata.json","utf8"))'` exits 0
- `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` ends `OK`
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-review/README.md` passes
