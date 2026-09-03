---
trigger_phrases: []
---
ROLE: You are the MARKDOWN agent (template-first documentation executor). Load the `sk-doc` skill and its command-authoring packet at `.opencode/skills/sk-doc/sk-create-command/SKILL.md`. Follow that standard and its templates EXACTLY. Read `.opencode/skills/sk-doc/sk-create-command/assets/command-template.md` before writing. You are a non-interactive leaf executor.

CONTEXT (pre-resolved — do NOT ask, do NOT stop):
- Spec folder: `specs/sk-communication/002-sk-communication-triggers` (pre-approved, skip Gate 3; never emit the A/B/C/D/E documentation-scope question).
- NEW root OpenCode slash command. Author exactly ONE file: `.opencode/commands/rewrite-response-by-external-agent.md` → invocation `/rewrite-response-by-external-agent`. Do NOT create or edit any other file. Do NOT edit any package code — this command changes NO code; it orchestrates existing surfaces.

WHAT THE COMMAND DOES (command 2 of the sk-communication trigger pair):
A one-shot sk-communication projection of a target text through a USER-CHOSEN engine. sk-communication projection is OFF by default and MUST stay off globally; this command flips it ON for the single run, runs the flow, then flips it OFF — guaranteed, even on error.

TARGET (what gets projected): default is the active AI's most recent assistant reply; an optional argument may supply explicit target text. The projection rewrites it into sk-communication plain English (same rubric family as `/rewrite-response`).

ENGINE CHOICE (this is the command's required input — the mandatory gate presents this menu and waits): ask the user which engine to run the rewrite:
  1. External AI via a cli-* skill — support ALL SIX: cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-opencode, cli-pi (then the user names which one, and optionally a model);
  2. Native — the active AI performs the rewrite itself, in-context (no external/local model);
  3. Local LLM — the sk-communication package's local provider path.
If `$ARGUMENTS` already names an engine, use it; otherwise ASK with this menu and WAIT. Forbid inferring the engine from context.

ON→RUN→OFF STATE MECHANISM (document this EXPLICITLY in a dedicated section):
- Representation: the environment variable `COMMUNICATION_PROJECTION_ENABLED` (truthy `1`), the same gate the package's `isProjectionEnabled()` reads.
- Where it lives: the process environment of the single run ONLY. It is set INLINE on the specific command that runs the flow (e.g. `COMMUNICATION_PROJECTION_ENABLED=1 <run-command>`), so it never persists beyond that process.
- Flip-off guarantee: because the variable is scoped to the one subprocess invocation, it is gone the moment that process exits — success or failure. If a shell session sets it instead, wrap the run so an `EXIT`/finally path unsets it. The command MUST NEVER write projection into `enablement.local.json` (that would persist enablement) and MUST NEVER leave the variable exported in the parent shell.
- Invariant preserved: the global default-off state (git-tracked config and `enablement.local.json`) is never modified; only a transient per-run process variable is used.

ENGINE ROUTING (describe each branch as executable steps):
- Native: apply the sk-communication plain-English rubric to the target in-context and display the rewrite. No env flip is required for native (no model runs); state that.
- External cli-* skill: flip projection ON (inline env), then load `cli-external-orchestration` and route to the chosen `cli-<skill>` — READ that skill's `SKILL.md` first (dispatch preload rule) — dispatch a rewrite prompt (the rubric applied to the target), capture the returned rewrite, display it; the inline env scoping flips OFF automatically after the dispatch. Preserve the projection invariant: display only, change no canonical bytes or files.
- Local LLM: flip projection ON (inline env), run the package's runnable flow `cli-output-wrapper` (`.opencode/skills/sk-communication/cli-communication-projection/bin/cli-output-wrapper.mjs`) using the package's configured local provider; if no local provider is configured in `enablement.local.json`, tell the user how to configure a `localProvider` block rather than silently failing. Display the projected result; the inline env scoping flips OFF automatically after the run.

INVARIANTS (HARD — enforce in the body):
- Display-only: the command changes NO canonical bytes, writes NO files, and rewrites only the surfaced rendering.
- Default-OFF preserved: only the transient per-run env var is used; the global off-by-default state is never changed.
- Guaranteed flip-off after the single run, including error paths.
- A future hardening (a first-class `external-cli` provider inside the package) is NOT in scope here; do not add or reference package code changes.

STANDARDS (from sk-create-command):
- This is a WORKFLOW command with a mandatory input gate for the engine choice (required input) and engine routing; it is NOT a router/presentation split.
- Frontmatter: single-line action-oriented `description` (target ≤110 chars); `argument-hint: "[cli-<skill>|native|local] [target-text]"`; `allowed-tools:` — include ONLY what the command actually uses (Bash to set the inline env and run the flow; Read/Grep/Glob to locate the target and load the chosen cli skill). Do NOT add tools it does not use.
- Mandatory input gate immediately after frontmatter: if the engine is not supplied, present the three-option menu and wait; forbid inference.
- Body: `## N. SECTION-NAME` full-integer H2 headings; a dedicated section documenting the ON→RUN→OFF mechanism; actionable steps; two or three example invocations; structured status output (`STATUS=OK`, `STATUS=CANCELLED ACTION=cancelled`, `STATUS=FAIL ERROR="<message>"`).
- Body hygiene (HARD): NO design rationale, NO spec/packet ids or paths, NO development notes in the shipped command body.

VERIFY before finishing (run these; ensure exit 0; include exit codes + output in the final report):
- `python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .opencode/commands/rewrite-response-by-external-agent.md`
- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/commands/rewrite-response-by-external-agent.md --type command`

OUTPUT: write the file, run the two validators, return a final report with the file path, both validator exit codes, their output, and a two-line summary. Return raw status — your final text IS the return value.
