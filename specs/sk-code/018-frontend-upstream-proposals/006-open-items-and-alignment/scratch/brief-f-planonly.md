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


ROLE: Make a save that is not `--full-auto` say that it did not write the continuity fields.

ACTION:
1. In W = `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts`, the Step 10 summary (the block after
   `log('Legacy memory artifact write skipped.\n');` that prints `Summary:` and its `  - ...` lines) says nothing about the
   planner mode. Right after the `diagrams preserved` line, add one line printed only when
   `options.plannerMode !== 'full-auto'`:
   `  - Continuity fields not written: plan-only save; pass --full-auto to write them`
   Change nothing else: same exit codes, same files written.
2. In `.skilled/skills/system-spec-kit/runtime/cli/tests/workflow-canonical-save-metadata.vitest.ts`, add one `it` next to the
   existing `it.each(['plan-only', 'full-auto'] ...)`, reusing `createCanonicalSaveWorkflowFixture` and `runCanonicalSave`.
   Capture what the workflow logs (read how the file or `runWorkflow` logs, for example a `console.log` spy with `vi.spyOn`)
   and assert the line is printed for `plan-only` and not for `full-auto`.
3. Rebuild the CLI's dist the way its `package.json` says (read `.skilled/skills/system-spec-kit/runtime/cli/package.json`
   scripts), and run the type check it names.

ALLOWED WRITE PATHS: W, that vitest file, the CLI's `dist/` build output.
BANNED OPERATIONS: no `git` command, no `rm`, no edit to any other file, no installs, no network calls. No code comment names
a spec folder, phase, task or finding id.

VERIFY before the status line, and paste each command with its output and exit code:
- the vitest file above (run it the way `package.json` says; from `.skilled/skills/system-spec-kit/runtime/cli`,
  `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/workflow-canonical-save-metadata.vitest.ts` works)
- the type check
