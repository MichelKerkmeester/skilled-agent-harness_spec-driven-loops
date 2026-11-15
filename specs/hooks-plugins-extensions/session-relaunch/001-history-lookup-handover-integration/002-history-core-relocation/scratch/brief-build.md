REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/002-history-core-relocation

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.

ROLE
You are a TypeScript and Node engineer making one small, behaviour-preserving change.

CONTEXT
The history lookup CLI is compiled to R/dist/hooks/lib/history/cli.js, where
R = .skilled/skills/system-spec-kit/runtime. Its source R/hooks/lib/history/cli.ts exports
`runHistoryLookupCli(argv: string[]): Promise<number>` and writes its JSON reply to stdout.
The session handover concern is H = .skilled/hooks/session-handover. The concern must own the
runnable entry and the printed command. The TypeScript source and its build stay in R.
The packet docs say `.skilled/hooks/session-relaunch`; that folder was renamed. Use H everywhere.

TASK (do all seven, in order)
1. Create H/bin/history-lookup.mjs. It resolves the compiled core relative to its own file
   (../../../skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js), imports
   `runHistoryLookupCli`, calls it with process.argv.slice(2) and sets process.exitCode to the
   result. If the import or the call throws, print `{"ok":false,"code":"operation_invalid"}`
   plus a newline to stdout and set exit code 2. Node builtins only. Follow the header comment
   style of H/bin/session-handover.cjs.
2. In R/hooks/lib/history/lookup-offer.ts set
   HISTORY_LOOKUP_COMMAND = 'node .skilled/hooks/session-handover/bin/history-lookup.mjs'.
   Add `const HISTORY_LOOKUP_CORE_PATH = '.skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js';`
   and make `lookupRunsFrom` return true only when `.git`, the entry AND the compiled core all
   exist under the workspace. Update the doc comment to say both files are needed.
3. In R/tests/_support/history-fixtures.ts make the fixture create placeholder files for BOTH
   the entry and the compiled core, wherever it creates the CLI placeholder today.
4. Update the printed-command assertions in R/tests/history-locator-adapters.vitest.ts
   (lines near 111 and 338), R/tests/hook-session-start.vitest.ts (near 418) and
   R/tests/history-projection.vitest.ts (near 229, 256, 265) to the new command or entry path.
   First read R/hooks/lib/history/projection.ts to see how a transcript command is recognised
   as a lookup; if it must recognise the new entry path, change it so BOTH the new entry path
   and the old compiled path are recognised (old transcripts still hold the old path), and keep
   one test line for the old path.
5. Create H/tests/history-lookup-entry.test.cjs (node:test, CommonJS, same header and style as
   H/tests/withdraw.test.cjs). Three tests: (a) running the entry with no arguments prints
   exactly `{"ok":false,"code":"invalid_usage"}` and exits 2; (b) `lookupRunsFrom`, loaded by
   dynamic import() from the compiled R/dist/hooks/lib/history/lookup-offer.js, returns false
   for a temp checkout that has `.git` and the entry but no compiled core; (c) it returns true
   when both exist.
6. Update R/hooks/lib/history/README.md (the CLI usage near line 119) to show the entry command
   and say in one sentence that the handover concern owns the entry while the source and build
   stay here. Add one row for history-lookup.mjs to the file table in H/bin/README.md and one
   sentence naming it in H/README.md. Plain sentences, no em dashes, no semicolons.
7. Build and verify:
   npm --prefix .skilled/skills/system-spec-kit run build
   (cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts tests/hook-session-start.vitest.ts)
     must print `Test Files  14 passed (14)` and `Tests  221 passed (221)`. Do not add or remove vitest tests.
   node --test .skilled/hooks/session-handover/tests/history-lookup-entry.test.cjs   must exit 0
   (cd .skilled/skills/system-spec-kit/runtime && npx tsc --noEmit -p tsconfig.json)   must exit 0

ALLOWED WRITE PATHS (nothing else)
- .skilled/hooks/session-handover/bin/history-lookup.mjs
- .skilled/hooks/session-handover/bin/README.md
- .skilled/hooks/session-handover/README.md
- .skilled/hooks/session-handover/tests/history-lookup-entry.test.cjs
- .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts
- .skilled/skills/system-spec-kit/runtime/hooks/lib/history/projection.ts (only if step 4 needs it)
- .skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md
- .skilled/skills/system-spec-kit/runtime/tests/_support/history-fixtures.ts
- .skilled/skills/system-spec-kit/runtime/tests/history-projection.vitest.ts
- .skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts
- .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts
- build output under .skilled/skills/system-spec-kit/**/dist (written by the build only)

BANNED OPERATIONS
- Any git command that changes state (add, commit, stash, checkout, reset, restore, push).
- Editing spec docs, cli.ts, hook-state.ts or any file not listed above.
- Reading or naming any secrets or dotenv file.
- Code comments that mention spec paths, packet numbers, phase numbers or task ids.
- Changing what the CLI replies, its exit codes or the 600-character bound on the offer.

OUTPUT
End with a short report: files changed, the three verification outputs verbatim (last 5 lines
each), and anything you could not do.
