# Post-agent facts the turn-end guards read

Phase 014's keyed runs settled the three facts a Vibe `post_agent` guard needs.

## The reply is on disk when the hook starts

Yes, as a `completion_succeeded` core-input record; the projection's assistant
message appears after the hook. `lastAssistantText` reads the completion record
first, so the guard sees the reply.
Evidence: `../014-vibe-journal-fixture-and-reader/scratch/facts.md` Q1 and
`scratch/journal-excerpts/post-agent-capture.json`.

## The turn key survives a deny retry

`turn_id` is identical on every retry of one operator message
(`turn-606243334cd2925977f2b52432f7480c` on all four invocations). The payload
carries no turn id, so the guard keys `markTurn` on the reader's `turnId` and
never on a user-message id, which changes when a deny injects its retry message.
Evidence: facts Q2 and `scratch/journal-excerpts/deny-always-turn-ids.txt`.

## The question tool name

The host registers `ask_user_question`; a tool call reaches the journal as a
qualified `ui.ask_user_question` effect name. The reprompt names the short form,
and the part accepts both.
Evidence: facts Q4.
