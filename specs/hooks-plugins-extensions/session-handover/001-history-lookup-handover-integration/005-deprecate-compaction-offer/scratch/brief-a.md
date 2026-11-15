REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/399-hook-feature-subtracks
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer

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
specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer/tasks.md
for the task rows named below; where it says `.skilled/hooks/session-relaunch` read
`.skilled/hooks/session-handover`.


TASK A (Claude hooks; task rows T004, T005, T016, T017)
1. R/hooks/claude/compact-inject.ts: remove the PreCompact locator mint (`mintHistoryLocator`,
   `stampHistoryLocator`, `mirrorToCheckoutRoot`, `transcriptBelongsToSession` if unused after) and the
   locator argument and field in `persistCompactResult`. The compact brief itself stays.
2. R/hooks/claude/session-prime.ts: remove the SessionStart `## History Lookup` section, its
   freshness and provenance gate, its capability read and its budget reservation.
3. R/tests/hook-precompact.vitest.ts: drop the locator cases and call `persistCompactResult` with
   the arguments it now takes.
4. R/tests/hook-session-start.vitest.ts: drop only the cases and assertions about the lookup
   section; keep every other case.
5. Delete R/tests/history-lookup-after-session-start.vitest.ts.
Verify: (cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/hook-precompact.vitest.ts tests/hook-session-start.vitest.ts)
exits 0, and `rg -n "mintHistoryLocator|stampHistoryLocator|mirrorToCheckoutRoot|historyLocator|HISTORY_LOOKUP_TITLE|buildHistoryLookupSection|loadHistoryCapability|lookupRunsFrom|placeLookup" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`
prints nothing.

ALLOWED WRITE PATHS (nothing else)
- .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts
- .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts
- .skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts
- .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts
- .skilled/skills/system-spec-kit/runtime/tests/history-lookup-after-session-start.vitest.ts (delete)

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
