REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE
You are a spec author. You write PLANNING documents only. You change no code and build nothing.

TASK
Fill the scaffolded planning docs of ONE phase packet: spec.md, plan.md, tasks.md and goal.md in
  specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation
Follow .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md sections 4 to 9
(the folder already exists: do NOT run create.sh). Leave implementation-summary.md untouched. Keep Status: Draft.

BACKGROUND (the whole packet)
The session history lookup lets a model search and load its own earlier turns. Today it is offered only
after a compaction. Measured on 173 Claude transcripts of this repo: 48 compacted, 25 got the offer, 3 ran it.
The in-session handover (.skilled/hooks/session-relaunch/) hops to a fresh session near the context limit, so
compaction rarely happens and the receiver has only the handoff note. The packet moves the lookup into the
handover: the receiver can look up the SENDER's turns. Six phases: 001 hop-recall-baseline,
002 history-core-relocation, 003 mint-locator-at-prepare, 004 offer-lookup-at-claim,
005 deprecate-compaction-offer, 006 docs-and-live-hop-proof.

KEY PATHS (read the ones your phase names before writing)
- History core: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/ (README.md describes all of it)
- Locator schema and state file: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts
- Handover core and CLI: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs, .skilled/hooks/session-relaunch/README.md
- Handover command doc: .skilled/commands/speckit/handoff.md (section 5, Receiving A Handoff)

THIS PHASE
Goal: move the history lookup core so the handover concern owns it, with behaviour unchanged.
Read: every file in .skilled/skills/system-spec-kit/runtime/hooks/lib/history/ (start with README.md), and run  rg -n "lib/history" .skilled .opencode --glob '!**/dist/**' --glob '!**/node_modules/**' -l  to list every importer.
Facts to verify and use: the core is TypeScript compiled to .skilled/skills/system-spec-kit/runtime/dist/ (dist is gitignored); the handover concern .skilled/hooks/session-relaunch/ is plain .cjs and .mjs with no build step; the printed command path is the constant HISTORY_LOOKUP_COMMAND in lookup-offer.ts; the tests are .skilled/skills/system-spec-kit/runtime/tests/history-*.vitest.ts.
Scope: decide where the source and the built CLI live after the move, update every importer and the command constant, move the tests and README. The plan must compare at least two placements (for example: move the TypeScript and add a build step to the concern, or keep it compiled in the spec-kit runtime and give the concern a thin entry) and name what fails at the cheaper one. If you cannot decide from the files, record the choice as an open question.
Constraint: no behaviour change. The history test suites must pass before and after with the same test count.

WRITING RULES
- Every file path, function name and number you write must come from a file you opened. Cite file:line in plan.md.
- If you cannot answer something, write UNKNOWN and add an "Open question:" line in goal.md section 4. Do not guess.
- spec.md Measured Behavior: run one read-only command your phase names (for example rg -n or wc -l) and paste the command and its exact output.
- plan.md has exactly three phases: Setup, Implementation, Verification. tasks.md lines each end with "Verify: <command and expected output>".
- Plain short sentences. No requirement may depend on a later phase.
- Do not restate BACKGROUND word for word; write what is specific to this phase.

ALLOWED WRITE PATHS
- specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation/spec.md, plan.md, tasks.md, goal.md, description.json, graph-metadata.json (the last two only through validate.sh auto-repair)

BANNED OPERATIONS
- Any git command that changes state. Any edit outside the allowed paths, including code, tests and other packets.
- create.sh, relocate.mjs, generate-context.js, /speckit:save, npm install, any model CLI. Opening any secrets or dotenv file.

VERIFICATION (run last, include the output in your final message)
  rg -o '\[YOUR_VALUE_HERE:' specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation/spec.md specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation/plan.md specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation/tasks.md specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation/goal.md | wc -l      (must print 0)
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation --strict --quiet      (first RESULT line must be PASSED)
If validation fails, run it once without --quiet, fix every failing rule, and retry. Stop after three rounds and report the errors.

HANDBACK
End with both verification outputs and the list of open questions you recorded.
