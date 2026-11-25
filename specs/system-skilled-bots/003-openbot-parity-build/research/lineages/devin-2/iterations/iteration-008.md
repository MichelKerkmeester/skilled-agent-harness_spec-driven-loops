# Iteration 8: Security — secret paths, token storage, spoofed chat users, who may approve (angle 4)

**Iteration**: 8 of 13
**Focus**: Angle 4's security half — secret leakage paths, token storage, spoofed chat users and who may approve, tested against the runtime's record shape, the vault's storage claim and the channel link's identity model.

## Focus

Iteration 2 covered failure modes. This pass took the four security questions the topic names and followed each secret path end to end: where the value enters, where it is stored, what the run record can capture, what the conversation file persists, and who is allowed to act on an approval. The standard applied is the one the packet sets for itself: a value never reaches the prompt, the run folder, the run record or a delivery message [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:153].

## Actions Taken

1. Read `DispatchSnapshot` and `EvidenceLocations` to see whether a run record can capture the child environment or argv.
2. Read phase 008's keychain decision, risk row and plan for how the value reaches `security`.
3. Read phase 010's secret-literal requirement and its append order.
4. Read phase 011's link model and its approver requirement for the non-approver case.
5. Checked `delivery.ts` for the literal check on outbound messages.

## Findings

1. **P1 — Phase 008's default keychain path puts the secret in the `security` command's argv, and the phase accepts the exposure instead of closing it.** The risk row states that "the value is visible in `ps` while `security add-generic-password -w <value>` runs", rates it Med, and mitigates it only by documenting the exposure and offering `--store file` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:189]. On macOS `security` is present, so the keychain is the default path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:148], which means every `bots secret set` on the target platform exposes the value to any local process that samples argv, however briefly. The phase's own decision record accepts this because "the argv exposure lasts one short-lived process" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:243]. **Exact edit**: change REQ-002 to pass the value on the child's stdin — `security add-generic-password` prompts when `-w` carries no argument — and add an acceptance row that samples the process table during a set and finds no value; keep `--store file` as the fallback.
2. **P1 — Phase 010's conversation JSONL is outside the literal-check list, and the human message is checked only before dispatch, not before append.** NFR-S02 says the message text "passes the runner's existing secret-literal check before dispatch, so a pasted token refuses the run as `body-secret`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:209], but REQ-001 appends the human message and then dispatches [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148], so the append can happen before the refusal; and nothing checks the bot's reply before it is appended. Phase 008's literal check covers "a body, a question, an answer, a request prompt and a delivery message" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:160] — a conversation message is none of those. A bot that echoes a value from its environment therefore writes it in plaintext under the state root, which is exactly the file a backup would copy. **Exact edit**: in `010-conversations/spec.md` require the literal check before the append for both roles — a human message that matches is not appended and the run is refused, and a bot message that matches is appended with its text replaced by `[redacted: <key>]` and the match recorded on the run record — and add one acceptance row per role.
3. **P2 — A linked non-approver can dispatch a run but cannot answer the item it parks, and phase 011 never states the rule.** REQ-003 turns any linked chat's message into a `bots enqueue` request [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:175], while REQ-005 refuses an answer from anyone who is not `owner` or in `members` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177]. A team member who is linked but not on the roster can therefore start work that parks a question they are not allowed to answer, and the item sits until someone on the roster notices. **Exact edit**: add one sentence to 011 REQ-003 or REQ-005 — either "a message from a linked non-approver is refused `channel-not-approver` before dispatch" or "it dispatches, and an item it parks is announced to every roster member" — and one acceptance row for the chosen branch.

## Ruled Out

- **Treating the run record as a secret-capture path.** `DispatchSnapshot` holds source, timestamps, lateness, skipped slots and a held slot; it has no environment or argv field [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82], so 008's "never the run record" holds by construction.
- **Treating channel token storage as a new leak.** Phase 011 resolves a token through the vault at send time and refuses `secret-unknown` before the I/O [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:223], so the token value lives in the same store as every other secret and never in the link file.
- **Treating `bots secret list` as a leak.** REQ-003 prints names and metadata only and states that no verb prints a value [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:149]. Verified as consistent with the store's index shape.
- **Treating a forwarded pairing code as a spoofing hole the phase misses.** The code is one-time and the lockout is file-backed [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:176]; whoever redeems it first becomes the linked actor, which is the same trust model as any device-pairing flow. It is a residual risk, not a plan defect.

## Dead Ends

- The outbound path is already covered: `delivery.ts` calls `findSecretLiteral` before a delivery, and 008 adds every stored value to the known-secret map [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:160]. The inbound persistence path in 010 is the uncovered one.

## Edge Cases

- **Ambiguous input**: "who may approve" was read as the authority model across the terminal and the channel, not only the channel's roster check. The terminal has no approver check by design because the local OS user is the operator; the shared-host case is a declared non-goal in 001.
- **Contradictory evidence**: none; 008 acknowledges the argv exposure and chooses to accept it, which makes the finding a disagreement about the choice, not a contradiction.
- **Missing dependencies**: none.
- **Partial success**: the `security` CLI's exact stdin behavior was not exercised on this host; the fix is stated as a behavior the phase must verify, not as a verified command.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:148, :149, :153, :160, :189, :243
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:148, :209
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:175, :176, :177, :223
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: angle 4, security half
- Questions answered: token storage and the run record are clean; two secret paths are open (the keychain argv default and the conversation JSONL), and the channel authority model leaves a linked non-approver able to dispatch work they cannot approve.

## Reflection

- **What worked and why**: Following the value rather than the feature found both leaks. The vault's own requirement lists the five places a value must not reach; comparing that list to the phases that write files found the conversation file missing from it.
- **What did not work and why**: Reading only the vault phase would have closed the review with "secrets are handled"; the leak is in a phase that never mentions secrets at all.
- **What I would do differently**: For every file a phase writes under the state root, ask whether a secret could reach it; the writer list is short and the check is cheap.

## Recommended Next Focus

Return to angle 1's remaining layer: the `--json` contracts the terminal and the channels consume. Phase 003 reads `activity --json`, `inbox --json` and `routines --json`; phase 010 reads `chat --transcript --json`; phase 011 reads the inbox. Check each producer's requirement against each consumer's assumed keys, including nullability and the `--json` envelope shape.
