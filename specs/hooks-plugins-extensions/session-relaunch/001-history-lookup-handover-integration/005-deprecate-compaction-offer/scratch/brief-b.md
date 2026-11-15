REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/005-deprecate-compaction-offer

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.

ROLE
You are a TypeScript and Node engineer removing one feature path without touching what sits beside it.

CONTEXT
R = .skilled/skills/system-spec-kit/runtime (TypeScript, compiled to R/dist).
The "history lookup" used to be offered to a model after a context compaction: a compaction hook
minted a "history locator" and a later hook printed a `## History Lookup` section. That offer has
moved to the session handover (`.skilled/hooks/session-handover`, which has its own mint
`mintHandoverLocator` and prints the section at claim). This task removes the COMPACTION offer.
What must stay untouched: the lookup CLI and core under R/hooks/lib/history, the locator schema and
`HISTORY_LOCATOR_KINDS` in R/hooks/claude/hook-state.ts, everything under
.skilled/hooks/session-handover, and every compaction summary, purpose line, spec-folder line and
`/speckit:resume` pointer the same hooks print.
Two other workers are editing OTHER files of this removal at the same time. A type or test error in
a file outside your list is theirs: report it, do not fix it. Read
specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/005-deprecate-compaction-offer/tasks.md
for the task rows named below; where it says `.skilled/hooks/session-relaunch` read
`.skilled/hooks/session-handover`.


TASK B (Pi, DSH, Devin and Vibe adapters; task rows T006 to T009, T018, plus Vibe)
1. R/hooks/pi/session-compact-context.ts: remove the mint, the persist call and the offer.
2. R/hooks/dsh/session-compact-context.mjs: remove the locator support block, mint, persist call and offer.
3. R/hooks/devin/post-compaction.cjs: remove the mint, persist call, one-shot marker and marker helpers.
4. R/hooks/devin/user-prompt-submit.ts: remove the marker read and prompt-time offer; keep the advisor context.
5. .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs and its test
   compaction-context.test.mjs: remove the locator mint and the lookup section in the same way, and
   the test cases that assert them. Everything else that hook re-injects stays.
6. Delete R/tests/history-lookup-devin-prompt-offer.vitest.ts.
7. Any OTHER test file that asserts the removed Pi, DSH or Devin behaviour and is not on another
   worker's list: find it with `rg -l "session-compact-context|post-compaction|user-prompt-submit" .skilled/skills/system-spec-kit/runtime/tests`
   and report it; edit it only if it is not one of history-locator-adapters.vitest.ts,
   history-lookup-adapters-e2e.vitest.ts, history-lookup-cli.vitest.ts, history-locator.vitest.ts,
   history-vocabulary-drift.vitest.ts (those belong to worker C).
Verify: `rg -n "mintHistoryLocator|persistLocator|persistHistoryLocator|buildHistoryLookupSection|placeLookup|historyHandle|loadHistoryCapability|locatorSupport|pendingOfferPath|PENDING_OFFER_SUFFIX|takeHistoryLookupSection|History Lookup" <the six hook files>`
prints nothing, `rg -c "/speckit:resume" <the Pi, DSH and Devin post-compaction files>` prints a
non-zero count for each, and `node --test .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` exits 0.

ALLOWED WRITE PATHS (nothing else)
- .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts
- .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs
- .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs
- .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts
- .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs
- .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs
- .skilled/skills/system-spec-kit/runtime/tests/history-lookup-devin-prompt-offer.vitest.ts (delete)
- other test files under .skilled/skills/system-spec-kit/runtime/tests found in step 7 that are not worker C's

BANNED OPERATIONS
- Any git command that changes state (add, commit, stash, checkout, reset, restore, push, rm).
  Delete a listed file with plain `rm`.
- Editing or deleting any file not in your ALLOWED WRITE PATHS, including spec docs and READMEs.
- Reading or naming any secrets or dotenv file.
- Code comments that mention spec paths, packet numbers, phase numbers or task ids.
- Leaving dead code behind: an import, constant, helper or type used only by the removed path goes too.

OUTPUT
End with a short report: files changed or deleted, each verification command with its last 5 lines,
and anything you could not do or that belongs to another worker.
