# Iteration 2 — what the payload can and cannot tell a hook

## Focus

Recover the fork's SessionStart payload shape from repo contracts and from the fork's own recorded hook output, then check whether the sibling SessionStart hooks share the same gate.

## Actions Taken

- Read the hook contracts that document the canonical Claude SessionStart payload: `.skilled/hooks/session-lifecycle/README.md:55` and the session-relaunch row in `.skilled/hooks/README.md:189`.
- Dumped every attachment of the 15:30 fork turn (lines 191-198 of `agent-ae7668a35ed03d742.jsonl`) to read each hook's recorded stderr/stdout.
- Read the compact branch of `session-prime.ts` to compare its gate with compact-pointer's.
- Decoded the `.skilled/skills/.state/spec-gate/` file names to check whether gate state is namespaced per agent.

## Findings

1. The repo's own contract documents the Claude SessionStart payload as source (startup/compact/resume/clear), session_id, transcript_path, stop_hook_active and context_window_tokens — there is no agent id, subagent flag or fork marker any hook could read.
2. The contract states compact-pointer's intent as running on SessionStart "after a compaction", but the implementation trusts `source === 'compact'` as proof that a compaction happened, so the contract's precondition is unenforced in code.
3. A second, independent SessionStart hook in the same fork logged `SessionStart triggered (source: compact, session: 0b9dc60c-478f-4659-8191-2da52f1cd765)` to its stderr (recorded at line 195 of the fork transcript), independently confirming that a fork's payload carries source=compact and the parent's session id.
4. `session-prime`'s compact branch shares the hazard: it keys the cached compact brief by session_id and injects it whenever source=compact, so the same fork received the parent's post-compaction brief (cached at 2026-10-21T15:29:16.367Z) one minute before it read the parent's note.
5. Session-scoped hook state is broadly keyed by session_id rather than by agent: the spec-gate state directory holds one file per hex-encoded session id, and one of them decodes to 0b9dc60c-478f-4659-8191-2da52f1cd765, so a fork writing gate state writes the parent's record.

## Questions Answered

- What does the SessionStart compact payload actually contain for a fork versus its parent session?

## Questions Remaining

- Whether a fork's transcript_path points at its own subagent jsonl or at the parent transcript — unproven locally, and the deciding detail for one candidate fix.
- Which of the nudge, note-keep, claim and Stop-arm paths share the hazard, and how severe each is.
- What the smallest correct fix is, and what test proves it.

## Next Focus

Iteration 3: read `lib/nudge.cjs` in full — `openNotePathFor`, `handoffPending`, `writeState`, `seedText` — to see exactly what a fork's call mutates on the parent's behalf.

## Ruled Out

- "Read the fork marker out of the payload": ruled out by the documented payload contract, which exposes no agent or fork field. Any fix must derive fork-ness from a value the payload does carry.
- "The fork ran the hook in a different state directory": ruled out because the hook's `stateDir()` keys on uid (501), not on agent, so forks and parent share one relaunch state directory.

## SCOPE VIOLATIONS

None. All reads were of hook contracts, hook source and transcripts; writes stayed inside this lineage.
