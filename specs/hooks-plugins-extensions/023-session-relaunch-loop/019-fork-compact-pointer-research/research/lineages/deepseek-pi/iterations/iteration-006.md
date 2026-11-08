# Iteration 6 — the smallest fix, against the existing harness

## Focus

Design the candidate fix against the harness that already tests compact-pointer, and pin the exact record a compaction-evidence check would look for.

## Actions Taken

- Read the compact-pointer tests (`claude-adapters.test.cjs:861-922`), the sandbox factory and `writeTranscript` (20-69).
- Re-read the parent transcript's boundary record shape rather than trusting the count alone.
- Compared the guard order in `compact-pointer.mjs` against what a "cannot verify" branch would need.
- Re-read `session-prime`'s cache validation to see whether the same gate applies there.

## Findings

1. The adapter harness already supports a transcript per payload through `writeTranscript`, so a compaction-evidence guard can be tested without new fixtures; the payload factory also omits `transcript_path`, which makes the missing-path branch explicitly testable.
2. The evidence to require is a record with `type: system`, `subtype: compact_boundary` and a `timestamp`; the parent transcript carries six such records and none on 2026-10-21, while a fork's SessionStart implies a compaction that never wrote one.
3. The fix is a guard ahead of the emit: emit only when the transcript named by the payload holds a compact_boundary at or after the note's `created_at`, which suppresses every fork fire observed and every future one whose transcript lacks a boundary.
4. `writeState(sessionId, 0)` currently runs before the guards, so a suppressed fire would still reset the parent's nudge ladder; moving the reset below the guards makes suppression side-effect free, and the existing emitting-path test still passes.
5. Treating a missing `transcript_path` as "cannot verify" is the honest branch, and it should fail closed with its own log row so a real parent regression becomes visible in `relaunch.log` rather than silent.
6. `session-prime` needs the same gate or the fork still receives the parent's cached compact brief; its cache is keyed by session id and validated only for a 30-minute TTL and payload semantics, both of which a fork satisfies.

## Questions Answered

- What is the smallest correct fix that separates a fork from its parent without regressing the parent path?

## Questions Remaining

- Whether any existing test or caller depends on the pointer firing without a transcript, which would make the fail-closed branch a breaking change.
- The exact test set that proves the fix and the suppression side-effect property.

## Next Focus

Iteration 7: check every caller and test that reaches compact-pointer without a transcript_path, and decide fail-closed versus fail-open with evidence rather than preference.

## Ruled Out

- "Patch only the seed text so it stops claiming a compaction": ruled out as insufficient, because the fork would still be pushed to claim the parent's note; the text is a symptom of the missing gate.
- "Infer compaction from the nudge state file": ruled out because the state file is exactly what the hook overwrites, so it cannot serve as evidence.

## SCOPE VIOLATIONS

None. Reads covered the test harness, hook source and transcripts; writes stayed inside this lineage.
