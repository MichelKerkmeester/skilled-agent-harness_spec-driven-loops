# Iteration 7: Overbuild ranking — what to cut, in the order that saves the most build time

## Focus

Frontier node F-2-008 (depth 2): "Which planned surfaces duplicate the built runtime or another phase and can be cut for a small team, ranked by the build time they save?"

The iteration ranks cuts by the work each one removes, measured in files created, test files created and licence obligations added, not in lines of prose. Two cuts are new this iteration, three were found earlier and are ranked here for the first time.

## Findings

1. **The ranked cut list, largest saving first.** Six surfaces can be cut or shrunk without losing a capability the eleven phases promise. Ranked by the work removed:

   | Rank | Cut | Phase | Work removed | Severity if kept |
   |---|---|---|---|---|
   | 1 | Four of the five transports (`channel-slack.ts`, `channel-signal.ts`, `channel-whatsapp.ts`, and their wire tests) | 011 | 4 modules, 1 test file's worth of wire cases, 4 sets of credentials to document | P1 |
   | 2 | `activity.rs`'s exit-code status table, replaced by the group id 001 already emits | 003 | 1 module, 1 test table, and the two-vocabulary mismatch | P1 |
   | 3 | `channel.ts`'s message model, shrunk to a transport envelope plus one adapter to 010's record | 011 | 1 record shape, its validator and its tests | P1 |
   | 4 | `secret-matcher.ts` and REQ-013, keeping the existing `findSecretLiteral` | 008 | 1 module, 1 lifted test file, 1 `THIRD_PARTY_NOTICES.md` entry | P2 |
   | 5 | The `bots-tui` CI job, keeping the two path entries | 003 | 1 workflow job, its toolchain cache and its failure surface | P2 |
   | 6 | `channel-queue.ts`, folded into `request-queue.ts`'s seen-key marker | 011 | 1 module and its backoff table | P2 |

   The ranking is by removed work, not by risk: ranks 2 and 3 are also correctness defects, so they should be fixed even if the team keeps the surface. [INFERENCE: from the module inventories in each `plan.md` and the runtime's existing exports]

2. **Phase 003's `activity.rs` re-derives a status vocabulary from exit codes, and 001 already puts the group id on every row.** `activity.rs` owns "the six statuses, their markers and the mapping from the runtime's exit vocabulary" (`003-terminal-screen/plan.md:65`), and REQ-005 draws "`·` running, `✓` done, `✗` failed, `!` needs input, `–` cancelled, `?` stale" (`003-terminal-screen/spec.md:165`). Phase 001's `bots activity --json` prints rows under the seven ids `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed` and `recurring` (`001-activity-and-actor/spec.md:143-144`). The two vocabularies do not intersect: a `scheduled` or `recurring` row has no marker in 003's table and would draw `?` under REQ-014, and `cancelled` and `stale` are values 001 never emits. **Severity P1.** Fix: in `003-terminal-screen/spec.md` REQ-005, replace the six statuses with 001's seven group ids and one marker each, and in `plan.md:65` make `activity.rs` a marker table keyed by group id with no exit-code mapping; delete the exit-vocabulary row from the test table at `plan.md:116`.

3. **Phase 011's `channel.ts` owns a second message record and deliberately imports nothing from 010's.** `channel.ts` is "the contract, the message model and the capability table. It imports `state-root.ts` and nothing else" (`011-messaging-channels/plan.md:66`), and its inbound message carries `channel`, `messageId`, `replyToId`, `timestampUnixMs`, `conversation`, `sender`, `text` and `raw` (`011-messaging-channels/spec.md:174`). Phase 010's record carries `schemaVersion`, `id`, `conversationId`, `botId`, `role`, `text`, `at`, `runId` and `by` (`010-conversations/spec.md:150`). The two shapes share only `text`, so every chat message has to be translated by code no phase owns. **Severity P1.** Fix: in `011-messaging-channels/spec.md` §4, state that the inbound shape is a transport envelope and that the sink converts it to 010's record through one exported `toConversationMessage` in `conversation.ts`; add the adapter to 010's Files to Change table and one acceptance row asserting a Telegram message lands as a 010 record with `by` set to the linked actor.

4. **Phase 008's `secret-matcher.ts` buys one saved text scan per stored value, at the cost of a lifted module, a lifted test file and a licence entry.** The plan justifies it as "the one-pass matcher behind `findSecretLiteral`, lifted from rakazo's `secret-matcher.ts`, so many stored values cost one pass" (`008-vault/plan.md:68`), and REQ-013 makes that the requirement (`008-vault/spec.md:164`). The existing `findSecretLiteral` already walks the known-secret map once and returns on the first hit (`dispatch.ts:287-295`); what the lift saves is one `text.includes` scan per value, over a map that holds the environment's secrets and the checkout's, a handful for a small team. The cost is a new module, a lifted test file (`008-vault/spec.md:128`) and a `THIRD_PARTY_NOTICES.md` entry (`008-vault/spec.md:99`). **Severity P2.** Fix: delete `secret-matcher.ts` from `008-vault/spec.md:115` and `plan.md:68`, drop REQ-013, and keep the `dispatch.ts` change that adds store values to the known-secret map.

5. **Phase 003's `bots-tui` CI job is the one part of the crate a small team does not need.** The plan adds "two path entries and one `bots-tui` job" to `.github/workflows/bots-runtime.yml` (`003-terminal-screen/plan.md:89`). The crate is authorised scope, but a Rust job in CI adds a toolchain cache, a second language's failure surface and a build that runs on every push, for a binary one operator runs locally. **Severity P2.** Fix: in `003-terminal-screen/plan.md:89`, keep the two path entries and drop the job; add one line to `spec.md` §3 Out of Scope stating that the crate is built locally with `cargo build --release` and is not a CI target.

6. **Phase 011's five transports are four more than the parity goal needs.** The plan names "five transports in the order Telegram, Slack, Signal, WhatsApp and terminal" (`011-messaging-channels/plan.md:3`) and gives each its own module, chunk limit and approval surface (`011-messaging-channels/plan.md:70`). The 002 synthesis ranks chat as one capability, not five, and the terminal transport is the one that needs no credentials. **Severity P1.** Fix: in `011-messaging-channels/spec.md` §3, cut the transport list to Telegram and terminal, move Slack, Signal and WhatsApp to Out of Scope with one line each naming the adapter contract they would implement, and reduce the matrix at `plan.md:102` from five transports to two.

## Ruled Out

- **Cutting phase 006's `action-kind.ts` word lists.** Considered as overbuild: a keyword classifier over the bot's own words is a guess. But it is six word lists and one function, and the alternative — a declared `[KIND: …]` marker in the question — changes the prompt contract every phase shares. The saving does not justify the change.
- **Cutting phase 004's `isolation.ts` `checkoutBranch`.** `isolation.ts` already exists and already reads branches in `reopenBotWorktree` and `finishBotWorktree` (`isolation.ts:589`, `isolation.ts:675`), but neither reads the main checkout's current branch, which is what the working-place line needs. It is an update, not a duplicate.
- **Cutting phase 001's `activity.ts`.** Already ruled out in iteration 2: one module must own the grouping rule so the text and JSON forms cannot disagree.
- **Cutting phase 011's `channel-link.ts`.** Already ruled out in iteration 2: a chat identity has to resolve to an actor before any approval check.
- **Cutting phase 003 entirely.** Already ruled out in iteration 3: the operator decision of 2026-11-25 chose the Rust screen.

## Dead Ends

- **Looking for a runtime module that already renders status markers.** `status.ts` owns `BOT_ROW_STATES` — ten bot-row states such as `retired`, `held` and `launchd-failed` (`status.ts:42-53`) — which is a different axis from a run's outcome, so 003 cannot reuse it and must read 001's group id instead.
- **Looking for an existing single-pass multi-value matcher.** `findSecretLiteral` is the only matcher, and it is already one pass over the map (`dispatch.ts:287`).

## Edge Cases

- **Ambiguous input:** "ranked by the build time they save" could mean wall-clock or work removed. Work removed is the measurable one, so the ranking counts modules, test files and licence entries, and says so.
- **Contradictory evidence:** none. The two status vocabularies are not contradictory claims about one fact; they are two independent vocabularies that fail to meet.
- **Missing dependencies:** none.
- **Partial success:** three of the six ranked cuts were found in earlier iterations and are ranked here for the first time; the iteration file marks which are new in the Assessment section rather than presenting all six as new.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:143-144`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md:65,89,102,116`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:165`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:68`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:99,115,128,164`
- `specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:3,66,70,102`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:174`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:95`
- `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts:287-295`
- `.skilled/skills/system-skilled-bots/runtime/lib/status.ts:42-53`
- `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:589,675`
- `.skilled/skills/system-skilled-bots/runtime/lib/approval.ts:27-128`

## Assessment

- New information ratio: 0.67 (two findings fully new — the 003/001 status vocabulary split and the 008 matcher; four partially new — the ranking itself and three cuts carried from iterations 1, 3 and 5)
- Questions addressed: F-2-008
- Questions answered: F-2-008

## Reflection

- **What worked and why:** comparing the *vocabularies* two phases use for the same axis found the 003/001 split. Both phases are internally consistent; the defect only appears when the two lists are put side by side, which no single-phase review would do.
- **What did not work and why:** the first pass tried to rank by reading each plan's prose about effort, which is not comparable across phases. Counting created files, test files and licence entries gave a comparable unit.
- **What I would do differently:** for every new module a plan adds, check whether the runtime already exports the function the module is named after. That is what turned `secret-matcher.ts` from a lift into a duplicate.

## Recommended Next Focus

F-2-009, the shared-module landing order: which runtime modules more than one phase modifies, and in what order the phases must land so the parser, record and index shapes do not collide.
