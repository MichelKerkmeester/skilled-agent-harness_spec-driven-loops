# Iteration 1 — the hook gate and the fire records

## Focus

Read the emitter first: `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs`, its SessionStart registration, the relaunch log rows, and the parent transcript's own compaction history. Goal: prove where the three 2026-10-21 fires actually executed, and what the hook gated on.

## Actions Taken

- Read the hook source end to end (`compact-pointer.mjs`, 99 lines) and its imported helper surfaces.
- Read the `SessionStart` block of `.claude/settings.json` with a JSON parse to see matchers, not grepped lines.
- Read `os.tmpdir()/skilled-relaunch-501/relaunch.log` (the state dir resolved by `stateDir()` for uid 501).
- Counted `compact_boundary` records and `SessionStart:*` hook attachments in the parent transcript.
- Located the sub-agent transcript store and matched each `compact-pointer` log row to a sidechain transcript line.

## Findings

1. The hook's only source gate is `payload.source !== 'compact'` plus a valid `payload.session_id`; nothing in the gate establishes that the caller is the top-level session, so any SessionStart with source=compact passes.
2. The hook is registered under SessionStart with an empty matcher, so it runs for every SessionStart source and relies entirely on that in-code source gate.
3. The parent session did not compact on 2026-10-21: its transcript holds six compact_boundary records, the last at 2026-10-20T16:19:05.871Z, and its last SessionStart:compact hook attachment is 2026-10-20T16:19:06.293Z.
4. All three 2026-10-21 fires executed inside fork sidechain transcripts, and each fork line matches its relaunch.log row to within ~30 ms: aea1c7f90bbedad3d at 14:44:41.466Z vs log 14:44:41.453Z, ae7668a35ed03d742 at 15:30:23.729Z vs log 15:30:23.714Z, a94347aac9778aa86 at 17:42:12.061Z vs log 17:42:12.039Z.
5. The fork's SessionStart payload carries the parent's session_id, because the hook logged sessionId=0b9dc60c-478f-4659-8191-2da52f1cd765 and resolved the parent's note while running inside the fork process.
6. Fork transcripts live at ~/.claude/projects/<project-slug>/<parent-session-id>/subagents/agent-<agentId>.jsonl with a sibling agent-<agentId>.meta.json, so the fork store is namespaced under the parent session id.
7. The fork marker exists on disk but never reaches the hook: agent-*.meta.json carries agentType=fork, isFork=true and spawnDepth=1, while the hook's gate reads only source and session_id.
8. The hook writes nudge state for the payload's session id before any fork-shaped guard, so a fork firing this path resets the parent's nudge level to 0 under the parent's own state filename.

## Questions Answered

- Where do fork sub-agent transcripts live, and do they carry the parent session_id or a distinct id?

## Questions Remaining

- What else does the fork's SessionStart payload carry (transcript_path, any agent id, cwd) that a gate could read?
- Which other hook paths key off session_id and share this hazard?
- What is the smallest correct discriminator, and what test proves it?

## Next Focus

Iteration 2: recover the full fork SessionStart payload shape — search the repo for any hook that records payload keys (transcript_path especially) and compare the parent payload with the fork payload.

## Ruled Out

- "The parent compacted and the transcript simply lacks the boundary": ruled out because the parent transcript has zero compact_boundary records on 2026-10-21 while three SessionStart:compact hook attachments exist only in fork sidechains.
- "The hook is mis-registered on a start source other than compact": ruled out because the registration has an empty matcher and the hook returns early unless `payload.source === 'compact'`.

## SCOPE VIOLATIONS

None. Every read was outside the write surface by design (hook source, settings, tmp state dir, transcripts); the only writes were this lineage's own iteration artifacts.
