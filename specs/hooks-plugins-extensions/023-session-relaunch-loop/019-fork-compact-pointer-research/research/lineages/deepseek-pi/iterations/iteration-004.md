# Iteration 4 — which adapters actually reach a fork

## Focus

Test the remaining Claude adapters against the three fork transcripts: did `context-nudge` or `stop-arm` fire inside a fork, and does the platform expose any fork-scoped event that a fix could key on?

## Actions Taken

- Aggregated every hook attachment in the three 2026-10-21 fork transcripts by hook name and by the adapter command that produced it.
- Extracted the full command strings of every PostToolUse/UserPromptSubmit and SubagentStart attachment in the 15:30 fork.
- Read `context-nudge.mjs` end to end to compare its session and transcript handling with compact-pointer's.

## Findings

1. The platform fires a dedicated `SubagentStart` event whose matcher is `fork` inside sub-agents — 3, 8 and 6 occurrences in the 14:44, 15:30 and 17:42 forks — so fork-ness is observable at the platform level even though the SessionStart payload itself carries no fork field.
2. The project's SessionStart adapters do run inside forks: session-prime, worktree-guard, check-git-hooks, git-live-follow and compact-pointer all produced hook_success entries in the fork transcripts.
3. The project's PostToolUse `context-nudge` and Stop `stop-arm` adapters produced no attachment at all in any of the three forks; the only PostToolUse entries were the Orca agent-hook bridge, so the fork hazard is confined to SessionStart dispatch plus whatever the injected seed makes the model do.
4. Every hook attachment inside a fork carries `agentId` and `isSidechain: true` on the transcript record itself, so the fork's identity is provable from the transcript while it is absent from the payload the adapter receives.
5. `worktree-guard` announced "This top-level session is running on the shared 'main' checkout" inside a fork, a second adapter that assumes it is addressing a top-level session — evidence the assumption is family-wide rather than one hook's bug.
6. `context-nudge` needs only `session_id` and `transcript_path` and writes state under the payload session id exactly as compact-pointer does, so if PostToolUse dispatch ever reaches forks the same parent-state overwrite appears there too.

## Questions Answered

None new. This iteration narrows the blast radius of the hazard rather than answering a new key question.

## Questions Remaining

- Whether a fork's `transcript_path` points at its own subagent jsonl or at the parent transcript — still unproven, and it decides which fix is smallest.
- The smallest correct fix and the test that proves it.

## Next Focus

Iteration 5: read `stop-arm.mjs` and `context-usage.cjs` for how `transcript_path` is consumed, and look for any recorded evidence of a fork's transcript path so the fix can choose between a path-based and a compaction-evidence-based discriminator.

## Ruled Out

- "Every project hook misfires in a fork": ruled out by the attachment census — PostToolUse and Stop adapters never ran in the forks, so the blast radius is SessionStart plus the seed's instruction, not the whole hook surface.
- "The fork hazard can be detected from transcript-side metadata by the hook": ruled out because `agentId`/`isSidechain` live on transcript records, while the adapter only receives the payload.

## SCOPE VIOLATIONS

None. Reads covered fork transcripts, hook source and settings; writes stayed inside this lineage.
