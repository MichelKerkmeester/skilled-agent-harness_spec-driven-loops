# Iteration 2: Parity gaps and overbuild — the per-phase overbuild test against the built runtime

## Focus

Frontier node F-1-004 (depth 1), second pass. Iteration 1 built the inventory (which 002 item each phase answers, and the two net-new surfaces). This pass tests the other half of the node's question: which planned surfaces duplicate the built runtime or another phase, and can be cut for a small team. It also corrects one overclaim from iteration 1.

## Actions Taken

1. Read the built runtime's queue, delivery, status-index, run-record, definition and label modules for the primitives each plan claims to add.
2. Read the AFFECTED SURFACES tables of all eleven plans and grouped them by the runtime module each phase modifies.
3. Read the checker's hard-invariant list and compared it with the invariants phases 002, 007 and 009 add.
4. Read phase 011's queue, approval-index and transport requirements against `request-queue.ts` and `delivery.ts`.
5. Read phase 008's and 009's lift and invariant claims against the reference repos and the checker.

## Findings

1. **Phase 011's `channel-queue.ts` re-implements the file-queue primitive the runtime already ships, as a second queue with its own backoff table.** `request-queue.ts` is already "a file queue under the user-level state root … every state change of a request is one rename between sibling folders, so a request is in exactly one folder at a time and two consumers can never both claim it", with a seen-key marker that makes a re-sent event a duplicate and a `quarantine/` folder for a refused request (`request-queue.ts:1-25`). Phase 011 adds `channel-queue.ts` as "the durable send queue with enqueue-before-I/O, unknown-after-send and the 0/5/25/120/600 s backoff" (`011-messaging-channels/spec.md:61`, `:113`, `:135`). The two queues solve the same problem in opposite directions, and the second one duplicates the rename-and-seen-key discipline without reusing it. **Severity P1.** Fix: in `011-messaging-channels/spec.md` §3, replace "Add `channel-queue.ts`" with "Extract the rename-and-seen-key primitive from `request-queue.ts` into `file-queue.ts` and build the outbound queue on it", and add one acceptance row that the inbound queue's existing tests still pass unchanged.

2. **Correction to iteration 1 finding 5: 011's `channel-approval.ts` is a message-id-to-item-id index, not a second answer store, so the duplication is narrower than iteration 1 claimed — but it still duplicates a field the run record already carries.** Phase 011 states "The answer path, which records the answer and queues the resume, so a channel answer reuses it rather than writing an item" (`011-messaging-channels/spec.md:49`), which is correct reuse. The index exists to map an inbound reply to an item after a restart (`:112`, `:209`). But `DeliveryEntry` already carries `itemId` for a parked question — `resolveDeliveryEntries` sets `entry.itemId = exit.needsYouItemId` when the run parked (`delivery.ts:143-146`) — so the only genuinely new datum is the outbound message id. **Severity P2** (downgraded from P1). Fix: in `011-messaging-channels/spec.md` §3, replace the separate `approval-v1` index with "the delivery entry gains `sentMessageId`, and an inbound reply resolves through the run record's delivery entry"; keep the index only if a requirement needs a lookup the run record cannot serve.

3. **Phase 003 adds a second toolchain and a new CI job to a Node repository, and no plan sequences that prerequisite.** The phase creates `crates/bots-tui/`, a Rust crate, and "a `bots-tui` CI job that runs `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings` and `cargo test`" (`003-terminal-screen/spec.md:41-45`). The repository has no `crates/` directory today, and the runtime's Definition of Done for every other phase is `npx vitest run` plus `npx tsc --noEmit`. **Severity P2.** Fix: add `cargo` and a Rust toolchain to `003-terminal-screen/plan.md` §2 Definition of Ready, and gate the `bots-tui` CI job behind a `paths: crates/**` filter so a Node-only change does not pay for a Rust build.

4. **Phase 008 lifts three rakazo files for policy the phase could state in a paragraph, adding a per-file third-party provenance obligation.** The phase says "Lift rakazo's `secret-matcher.ts`, `secrets-guard.ts` and `vault.ts` policy with Apache-2.0 notices and one `THIRD_PARTY_NOTICES.md` entry per lifted file" (`008-vault/spec.md:99`). All three files exist in the reference repo (`specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts`, `.../node/secrets-guard.ts`, `.../integrations/vault.ts`), so the lift is possible. But the store the phase actually builds is `security` plus a 0600 file (`008-vault/spec.md:97`), and the only behaviour it needs from the lift is the literal matcher. **Severity P2.** Fix: in `008-vault/spec.md` §3, keep `secret-matcher.ts` and drop `vault.ts` and `secrets-guard.ts` unless a requirement names a policy only they provide; if dropped, remove their `THIRD_PARTY_NOTICES.md` rows from the same section.

5. **Phase 009 adds three hard checker invariants for one optional field, in a checker that has eighteen hard and zero advisory invariants.** The checker's `HARD_INVARIANTS` list holds eighteen ids and `ADVISORY_INVARIANTS` is empty (`bot-check.cjs:39-65`). Phase 009 adds `skills-unknown`, `skills-too-large` and a third (`009-skills/spec.md:167`, `:130`). A byte cap is a size policy, not a correctness invariant, and the checker already has an advisory tier built for exactly this. **Severity P2.** Fix: in `009-skills/spec.md` §4, move `skills-too-large` to `ADVISORY_INVARIANTS` (WARN by default, FAIL under `--strict`) and keep `skills-unknown` hard; update REQ-007 and the acceptance rows to match.

6. **Five phases modify `definition.ts`, and no plan sequences them, so the parser branches collide at merge time.** Phase 002 adds `routine` (`002-routine-layer/plan.md:85`), 005 adds `memory` (`005-memory/spec.md:97`), 007 adds `apps` (`007-per-bot-apps/spec.md:100`), 008 resolves `secrets` (`008-vault/spec.md:97`) and 009 adds `skills` (`009-skills/spec.md:167`). Each adds a key to the same `ITEM_KEYS`-style allowlist and a validation branch in the same function. The parent's phase map orders them 002, 005, 007, 008, 009, which is serial, but no plan says the parser change is the merge point or names the allowlist it extends. **Severity P1.** Fix: add one row to `specs/system-skilled-bots/003-openbot-parity-build/spec.md` §3 under Phase Transition Rules — "`definition.ts`'s frontmatter allowlist is the shared merge point for phases 002, 005, 007, 008 and 009; each phase adds its key and its validation branch in the same commit as its parser test" — and name the allowlist in each of the five plans' AFFECTED SURFACES rows.

## Verified Correct

Two claims that looked like overbuild survived checking, and are recorded so a later iteration does not re-open them:

- **Phase 002's `starts[0]`-only design is correct reuse, not a shortcut.** The plan leaves `slot-accounting.ts` unchanged because "`starts[0]` is the only cron start, so the index stays 0" (`002-routine-layer/plan.md:87`), and the runtime refuses any other index: "A definition holds one trigger, so a schedule index past 0 names a schedule that no longer exists" (`slot-accounting.ts:210`). The plan's refusal of a second cron start is therefore forced by the runtime, not a scope cut.
- **Phase 004's "no schema-version bump" claim is correct.** `RunRow.summary` is a JSON string (`status-index.ts:96`), so adding `branch` and `worktreePath` to the serialized `RunSummary` changes no SQLite column. Only phase 001's `actor` column needs the `SCHEMA_VERSION` bump, which its plan already states.

## Questions Answered

- The overbuild half of F-1-004: the cuttable surfaces are 011's second queue and approval index, 003's ungated Rust CI job, 008's two unnecessary lifts and 009's third hard invariant. The non-cuttable coordination cost is `definition.ts`, which five phases edit.

## Questions Remaining

- Do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here? (angle 1)
- Do the phases agree on the shared records, and is the build order sound? (angle 2 — only the `definition.ts` hotspot and the `operators.json` conflict are established)
- Security and failure modes. (angle 4)

## Ruled Out

- **Calling phase 001's `activity.ts` overbuild.** The plan's argument that one module must own the grouping rule so the text and JSON forms cannot disagree (`001-activity-and-actor/plan.md:52`) is sound, and `status.ts` already renders rows but owns no grouping vocabulary. A new module is the smaller change.
- **Calling phase 011's `channel-link.ts` overbuild.** A chat identity has to resolve to an actor before any approval check, and no runtime module does that today; the lockout is the only part that could be trimmed, and it is five lines of state.
- **Treating the five transports as five equal cuts.** Telegram is the only transport with no operator prerequisite; WhatsApp needs a public URL and a Meta business account (`011-messaging-channels/spec.md:114`), so it is the first cut, not an equal one.

## Dead Ends

- **Looking for an existing outbound-send retry in `delivery.ts`.** It records `attempted`, `delivered`, `failed` and `uncertain` outcomes (`delivery.ts:75`, `:233-235`) but has no retry or backoff, so 011's backoff table is genuinely new behaviour — the duplication is the queue primitive, not the retry policy.
- **Looking for a `crates/` directory or a Rust toolchain pin in the repository.** Neither exists, so phase 003's toolchain is a new prerequisite rather than an existing one.

## Edge Cases

- **Ambiguous input:** "not needed" could mean "not needed by a small team" or "not needed by any team". This iteration used the small-team reading, because that is the 002 scope (`research.md:19`), and deferred the general reading.
- **Contradictory evidence:** iteration 1's finding 5 called 011's approval index a duplicate approval surface; phase 011's own text at `:49` shows the answer path is reused. Both are cited and finding 2 corrects the earlier claim rather than deleting it.
- **Missing dependencies:** none.
- **Partial success:** none.

## Sources Consulted

- `.skilled/skills/system-skilled-bots/runtime/lib/request-queue.ts:1-30`
- `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts:75,100-146,233-235`
- `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:68-96`
- `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:123-128`
- `.skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:200-216`
- `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts:67,278`
- `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs:39-65`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:85-100`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:41-45`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:97`
- `specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:100`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:97-99`
- `specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:130,167`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:49,61,112-114,135,209`
- `specs/system-skilled-bots/context/rakazo-main/packages/core/src/messages/secret-matcher.ts`
- `specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts`
- `specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts`

## Assessment

- New information ratio: 0.92 (5 fully new findings, 1 partially new because it corrects an iteration-1 claim)
- Questions addressed: the overbuild half of F-1-004
- Questions answered: the overbuild half of F-1-004

## Reflection

- **What worked and why:** grouping the eleven AFFECTED SURFACES tables by runtime module turned a per-phase reading into a single coordination view, which is what exposed `definition.ts` as a five-phase merge point. Reading the queue and delivery modules before 011's requirements showed the duplication was in the primitive, not the policy.
- **What did not work and why:** iteration 1's finding 5 was written from 011's file table without reading 011's scope boundary at `:49`, so it overclaimed a duplicate approval surface. The correction is recorded rather than silently dropped.
- **What I would do differently:** read each phase's Scope Boundary line before its file table. The boundary line states what the phase reuses, and the file table only states what it creates.

## Recommended Next Focus

Answer F-1-004 with the combined inventory and overbuild verdict, then move to the admitted children: plan-versus-runtime verification of the named files and functions (F-2-005), cross-phase shared-record consistency and build order (F-2-006), and security and failure modes (F-2-007). The `definition.ts` hotspot and the `operators.json` conflict belong to F-2-006.
