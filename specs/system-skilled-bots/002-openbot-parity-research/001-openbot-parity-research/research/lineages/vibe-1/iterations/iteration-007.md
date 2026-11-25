# Iteration 7: The smallest on-disk memory store

## Focus
Frontier node F-2-005 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/): What is the smallest on-disk memory store for a few people on one machine: one JSONL per person plus a per-bot overlay?

## Actions Taken
1. Read `runtime/lib/state-root.ts` end to end: the state root resolver, the per-identity folders, the shared entries, and the file-naming helpers.
2. Grepped `runtime/lib/*.ts` for `memory` to establish what exists today.
3. Grepped for a per-person identity (`operator`, `personId`, `userId`, `actor`) to see whether the runtime has one.
4. Read the status index's schema to see which store format the runtime already chose and why.
5. Read OpenBot's memory collection path and `MemorySource`, OpenGhost's `LIMITS`, and openhuman's `user_root` for the three reference shapes.

## Findings
1. The runtime already resolves a user-level state root: the pinned `SKILLED_BOTS_STATE_ROOT` environment variable outranks the checkout's `bots/config.json` `stateRoot`, which outranks `${XDG_STATE_HOME:-$HOME/.local/state}/system-skilled-bots`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:102]
2. The layout is already two-level: per-identity folders (`requests/{inbox,tmp,claimed,done,quarantine,seen}`, `leases`, `switches`, `needs-you`, `records`, `installs`, `receipts`) under `{stateRoot}/{identityKey}/`, and shared entries (`index`, `registered-roots`, `authority`) directly under the root. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:135]
3. Every state folder is created owner-only with mode `0o700`, the same rule the env-secret guard applies to its own state. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:161]
4. One JSON file per thing is the existing convention: `recordFile` is `{records}/{runId}.json` and `needsYouFile` is `{needsYou}/{itemId}.json`, both guarded by `isSafeSegment` so an id cannot escape its folder or hide as a dot file. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:176] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:181]
5. The status index is the one exception to one-file-per-thing: it is a SQLite database (better-sqlite3) with tables `meta`, `generations`, `runs`, `deliveries`, `items` and `retired`, because it answers cross-identity queries that a folder of files cannot. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:165]
6. The runtime has no memory store at all: `grep -rn "memory" runtime/lib/*.ts` returns zero hits. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/ (grep, 0 hits)]
7. The runtime has no per-person identity: `operator` appears only as a role word (an approval's origin, a failure class, a kill switch), and every state path is keyed by repository identity `owner/name`. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:26] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:118]
8. OpenBot scopes memory by organization *and* person: the collection path is `/api/v2/organizations/{organizationId}/people/{personId}/memories`, and a memory named from another organization is answered as not found. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:17]
9. OpenBot keeps no memory at all for a single-person deployment: "A single-person OpenBot keeps no memory: every operation here answers not found there." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:10]
10. OpenBot's per-bot dimension is the source, not the store: `MemorySource.botId` is "The Bot that reads it, and the only one that recalls what it read in." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:659]
11. OpenGhost keeps one bounded memory for the user across all chats: `LIMITS = { text: 400, records: 60, crowded: 28, chars: 3600 }`, and once the memory is crowded a model rewrites it shorter as one whole. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11]
12. openhuman has no user root before sign-in: `user_root` returns `None` when the config path is not under `users/` or the id is the pre-login id, so memory has no scope to attach to until someone signs in. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/scope.rs:41]
13. The smallest store that fits the existing layout is one JSON file per person at the shared level plus one per-bot overlay inside the identity folder: `{stateRoot}/memory/{personId}.json` and `{stateRoot}/{identityKey}/memory/{botId}.json`. It adds no new concept, because the shared-versus-per-identity split already exists. [INFERENCE: based on findings 2, 4 and 7]
14. JSONL is the wrong format for this store: `writeStateAtomic` already does a whole-file temp write, fsync and rename, and `writeStateIfChangedAtomic` skips an unchanged write, so a JSON array per person gets atomicity for free, while JSONL would need a new append-and-fsync path and a line-level parser. [INFERENCE: based on .skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts:413]
15. The per-bot overlay is what makes recall cheap: recall reads the person file plus the bot's overlay and dedupes by fact id, which is the same two-file read `delivery.ts` already performs for a run record plus its needs-you item. [INFERENCE: based on findings 2 and 10]
16. A single-person install should keep no memory file at all, matching OpenBot: the person file is created on the first fact a bot forms, so an install with one person and no review never grows a memory folder. [INFERENCE: based on findings 9 and 13]

## Ruled Out
- One JSONL per person. The runtime's atomic write helper is whole-file, so JSONL buys nothing and costs a new append path plus a line-level parser.
- One JSON file per fact, matching `records/` and `needs-you/`. A memory of a few hundred facts would become a few hundred files, and recall would read the whole folder on every run.
- A second SQLite database for memory. The index is SQLite because it answers cross-identity queries; memory is read whole by one bot at a time, so a database would add a schema and a migration for no query benefit.
- Keying memory by repository identity only. That is what the runtime does today, and it makes a person's facts vanish when they move to another checkout.

## Dead Ends
- Looking for an existing per-person key to hang memory on. There is none: `identityKey` is derived from `owner/name`, and no other identity dimension exists in the runtime.

## Edge Cases
- Ambiguous input: the node's question presumes JSONL. I treated "one JSONL per person" as a hypothesis to test rather than a requirement, and answered with the format the existing helpers support, recording the JSONL rejection as a ruled-out direction.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:1-210
- .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:150-200
- .skilled/skills/system-skilled-bots/runtime/lib/approval.ts:26
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts:413-443
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:1-20
- specs/system-skilled-bots/context/OpenBot-main/api/openapi/memory.yaml:636-670
- specs/system-skilled-bots/context/OpenGhost-main/memory.js:1-30
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-core/src/memory/scope.rs:1-70

## Assessment
- New information ratio: 0.94
- Questions addressed: What is the smallest on-disk memory store for a few people on one machine: one JSONL per person plus a per-bot overlay?
- Questions answered: What is the smallest on-disk memory store for a few people on one machine: one JSONL per person plus a per-bot overlay?

## Reflection
- What worked and why: reading `state-root.ts` before designing anything. It already answers the layout question — shared entries beside per-identity folders — so the memory store becomes a third entry in an existing shape rather than a new subsystem. The file also states the rule that decides the format: everything a run must not write lives outside every checkout.
- What did not work and why: assuming the node's JSONL framing was a constraint. Checking `writeStateAtomic` showed the runtime has no append path at all, so JSONL would be the only append-only store in the tree.
- What I would do differently: grep for the store format before the store design. One grep for `writeFileSync` in `state-root.ts` would have settled JSONL versus JSON in a single call.

## Recommended Next Focus
The memory-source sync clock: OpenBot's `MemorySource` carries `syncStatus`, `lastSyncAt` and `nextSyncAt`, so the next question is which of our cron, queue and git-hook triggers can drive a source read-in and where the next-sync time should be stored.
