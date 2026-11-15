REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/003-mint-locator-at-prepare

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.

ROLE
You are a Node and TypeScript engineer adding one fail-open step to an existing CLI.

CONTEXT
R = .skilled/skills/system-spec-kit/runtime (TypeScript, ESM, compiled to R/dist).
H = .skilled/hooks/session-handover (CommonJS, no build). The packet docs say
`.skilled/hooks/session-relaunch` and `session-relaunch.cjs`; that concern was renamed. Use H and
H/bin/session-handover.cjs everywhere.
A history locator lets a later session look up this session's earlier turns. Today it is minted
only before a compaction, by `mintHistoryLocator` in R/hooks/claude/compact-inject.ts, and saved
into the session's hook state through `persistHistoryLocator` (R/hooks/lib/history/locator-digest.ts).
Read those two functions and how compact-inject.ts calls the state writer before you write anything.
This task makes the handover `prepare` command mint and save the same kind of locator for the
SENDING session, with provenance source `handover`.

TASK (in order)
1. R/hooks/claude/hook-state.ts: add 'handover' to the provenance `source` enum of
   HistoryLocatorSchema (currently ['precompact', 'post_compaction']). Change nothing else there.
2. R/tests/history-locator.vitest.ts: add one test that the schema accepts source 'handover' and
   keep or add one that it rejects source 'model_authored'.
3. H/lib/relaunch-core.cjs: add and export `mintHandoverLocator({ runtime, sessionId, cwd, now })`.
   It resolves the sender's transcript with the resolvers already in this file
   (`claudeSessionLogPath`, `codexRolloutPath`; read them for their arguments), places the workspace
   with `placeLookup`, builds the locator exactly as `mintHistoryLocator` does (same fields, same
   `historyHandle` identity, version constant from hook-state) but with provenance source
   'handover', and saves it with `persistHistoryLocator` and the same state writer compact-inject.ts
   uses. Load the compiled helpers lazily INSIDE the function with require() of the files under
   R/dist (resolved relative to __dirname), so a checkout without a build still loads the core.
   Return the stored locator, or null when: the runtime has no entry in HISTORY_LOCATOR_KINDS, the
   transcript cannot be found, no placement exists, the save did not keep the handle, or anything
   throws. It must never throw.
4. H/bin/session-handover.cjs: in `prepare`, call `core.mintHandoverLocator` once, right after the
   `core.preparePending` call returns, inside its own try/catch. A failed or null mint changes
   nothing: same output, same exit code, same relaunch record.
5. H/tests/session-handover-cli.test.cjs: add four cases in the file's existing style:
   (a) after a prepare whose Claude session log exists, the sender's hook state holds a
       `historyLocator` with provenance.source 'handover' and a handle matching /^hl1_[a-f0-9]{32}$/;
   (b) recomputing `historyHandle` from the stored locator and the transcript path returns the
       stored handle, `workspace` is the checkout root, and `sessionDirectory` is absent when the
       sender ran at the root;
   (c) with the hook-state directory unwritable, prepare still exits 0 and writes the relaunch record;
   (d) a runtime with no locator kind (cursor) leaves no historyLocator and prepare exits 0.
   Tests must use temp folders and must not read or write the real home directory or real state.
6. Build and verify, and paste the last 5 lines of each:
   npm --prefix .skilled/skills/system-spec-kit run build
   node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs      (fail 0)
   node --test .skilled/hooks/session-handover/tests/*.test.cjs                          (fail 0)
   (cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts tests/hook-session-start.vitest.ts)   (0 failed)
   (cd .skilled/skills/system-spec-kit/runtime && npx tsc --noEmit -p tsconfig.json)     (exit 0)

ALLOWED WRITE PATHS (nothing else)
- .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts
- .skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts
- .skilled/hooks/session-handover/lib/relaunch-core.cjs
- .skilled/hooks/session-handover/bin/session-handover.cjs
- .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs
- build output under .skilled/skills/system-spec-kit/**/dist (written by the build only)

BANNED OPERATIONS
- Any git command that changes state (add, commit, stash, checkout, reset, restore, push).
- Editing spec docs, READMEs, compact-inject.ts, the history CLI or any file not listed above.
- Reading or naming any secrets or dotenv file.
- Code comments that mention spec paths, packet numbers, phase numbers or task ids.
- Changing what `prepare` prints or its exit codes.

OUTPUT
End with a short report: files changed, the verification outputs verbatim, and anything you could
not do or had to decide (for example how the state file path is derived for the sender).
