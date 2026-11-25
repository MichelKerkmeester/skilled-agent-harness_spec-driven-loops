# Iteration 12: Plan versus runtime — skills (009) and conversations (010)

## Focus
Plan versus runtime: phases 009-skills and 010-conversations — verify every file, symbol, CLI verb and verify command those plans name, then rank the cross-phase conflicts for the final consolidation.

## Actions Taken
1. Verified every 009 citation: `BOT_ID_PATTERN` at `definition.ts:88`, `findSecretLiteral` at `dispatch.ts:287`, `buildBotPrompt` at 315, `readRunRecord` at `run-record.ts:377`, `RESERVED_BOT_IDS` at `label.ts:28`, and the three inventory count sets (buildBotPrompt 1/2/5, RESERVED 3/2/2, IdentityStatePaths 4/2); the `skills:` baseline is empty.
2. Verified every 010 citation: `drainQueue`/`DrainInput`/`listInbox` in `request-drain.ts`, `finalAnswerText` at `dispatch.ts:419` and its use at `runner.ts:1092`, the `completed` outcome at `runner.ts:208`, and the empty `conversation` baseline.
3. Read 009's Security NFRs and 010's NFR-S02.

## Findings
1. **P1 — phase 009, `spec.md:212-215` (NFR-S01 to S03) and `plan.md:62`: the skill tree the loader reads is writable by the bot, so the proposal review can be bypassed.** `loadSkills` reads `<skilledTree>/.skilled/skills/<name>/SKILL.md`; a shared-isolation run writes the checkout, and a worktree run's `.skilled` is a link to the shared tree, so either way a bot can edit a skill body that a later run loads. NFR-S03 only keeps a body from being read as a decision marker; it does not stop a body from carrying instructions. **Exact edit:** state that skill bodies are trusted repo content and not a security boundary, record each loaded body's digest on the run record, refuse `skill-changed` when a body differs between the check and the load, or mount the skill tree read-only for runs. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:212] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:1-30]

2. **P2 — phase 010, `spec.md:209` (NFR-S02): the human message is secret-checked but the bot message is not.** The chat appends the runner's `answer` text to the conversation JSONL without a literal check, so a child that prints a stored secret persists it in the transcript under the state root. **Exact edit:** run `findSecretLiteral` on the bot message before the append and record `chat-message-secret` instead of the text; add the case to `cli-chat.vitest.ts`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:209] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:419]

3. **P2 — phase 010, `plan.md:72`: a shared conversation replays one bot's output into another bot's prompt.** The transcript is the request prompt, so in a multi-bot conversation (`@bot` routing) bot A's message becomes untrusted input to bot B. The plan does not state the trust model or delimit each message by role. **Exact edit:** render each transcript line with its role and source bot id, and state in §6 that bot messages are untrusted input to the next run. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:72]

4. **P2 — cross-phase, phases 003, 010 and 011: the `.opencode/bin/bots.cjs` row keeps instructing a copy of a symlinked path.** 010 `plan.md:87` and 011 `plan.md:94` repeat 003's "Byte-identical mirror | update - copy" claim; `readlink .opencode/bin` prints `../.skilled/bin`, so the edit already lands and a copy that replaces the link breaks the mirror. **Exact edit:** replace all three rows with a `readlink` guard, as 004 already does. [SOURCE: .opencode/bin] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:87]

## Ruled Out
- Suspected 009 citation drift: ruled out. Every symbol and count resolves exactly, including the three inventory sets.
- Suspected 010 citation drift: ruled out. `drainQueue`, `DrainInput`, `listInbox`, `finalAnswerText`, the `completed` outcome and the empty `conversation` baseline all reproduce.
- Suspected 010 duplicate-message gap: ruled out — the message id is the queue event id, so a duplicate is refused as `duplicate` (the plan's own test).

## Dead Ends
- No dead ends.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts
- .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts
- .skilled/skills/system-skilled-bots/runtime/lib/label.ts
- .skilled/skills/system-skilled-bots/runtime/lib/isolation.ts
- .skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts
- .skilled/bin/bots.cjs
- .opencode/bin (readlink)

## Assessment
- New information ratio: 1.0
- Questions addressed: plan-vs-runtime for phases 009 and 010
- Questions answered: none fully

## Reflection
- What worked and why: checking the three inventory count sets against `rg -c` in one call confirmed 009 was written against the runtime; the only gap left is the trust boundary, not a citation.
- What did not work and why: nothing failed.
- What I would do differently: read the security NFRs before the architecture, because NFR-S03 looks like it covers prompt injection until you see it only covers decision markers.

## Recommended Next Focus
Iteration 13: consolidate the ranked findings by phase and the cross-phase conflict list into the synthesis.
