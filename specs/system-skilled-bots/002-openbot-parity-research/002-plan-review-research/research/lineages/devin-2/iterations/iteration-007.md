# Iteration 7: Parity gaps and overbuild — what eleven phases still leave out, and what they build twice (angle 3)

**Iteration**: 7 of 13
**Focus**: Angle 3 — for a small team, what is still missing after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?

## Focus

The parity research ranks ten slices and one optional desktop shell. The packet turns those into eleven phases and adds a messaging phase the research never ranked. This pass compared the ranked order to the packet, then looked for the two failure modes a parallel packet produces: a gap that no phase owns, and a surface larger than the stated audience needs.

## Actions Taken

1. Read the parity research's §15 ranked build order (items 1-11) and its two operator decisions.
2. Mapped each ranked item to the phase that claims it.
3. Read phase 011's scope boundary and module list for the transport count.
4. Read phase 006's ladder requirements and its own statement about the missing rule store.
5. Walked the state-root folder list from iteration 3 against every phase's verbs to look for a missing operational surface.

## Findings

1. **P2 — Phase 011 builds five transports in one phase, where the research ranks no messaging slice and a small team needs one.** The scope boundary names "five transports (terminal, Telegram, Slack, Signal, WhatsApp)" and five transport modules [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:45] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:62]. The research's ranked order has ten slices and a desktop shell, none of them messaging [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:137], and phase 011 says itself that the research ranks no messaging slice and that the phase extends the program [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:43]. For a small team, the adapter contract plus the terminal transport plus Telegram — the one transport that long-polls and needs no public URL — proves the design; Slack, Signal and WhatsApp add three wire protocols, three token shapes and three test suites in the same phase. **Exact edit**: split 011 into 011a (adapter contract, link, lockout, approval index, queue, terminal and Telegram) and 011b (Slack, Signal, WhatsApp), or mark the three transports as follow-ups in the phase's scope boundary with their modules moved to a later packet.
2. **P2 — Phase 006 declares a five-rung ladder that only one rung can reach, and a `--scope always` that only affects the current item.** The phase states that "a rules store, an auto-review switch and an extra-vigilant switch" are out of scope because "the ladder takes all three as inputs and no store supplies them yet" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:103], and that a saved rule outliving its item is out of scope, so `always` is "recorded on the item and read by the resumed prompt, not by a later item" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. Yet REQ-003 requires the walk through all five rungs [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:147] and SC-003 tests a kind beating a rule, a rule beating auto-review and auto-review beating extra-vigilant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:173]. The test supplies the inputs the product cannot, and an operator who types `--scope always` will reasonably expect the next same-kind item to be allowed. **Exact edit**: either land a minimal per-bot `rules.json` that rung 2 reads, or rename the scope to `resume` and state in REQ-005, the `bots answer` help text and the inbox line that the scope applies to the current item only.
3. **P2 — No phase owns backup, restore or export of the state root, which after eleven phases holds the team's memory, conversations, secrets index, channel links and routine state.** The phases add `routines`, `memory` at both levels, `secrets`, `proposals`, `conversations` and `channels` under one state root [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117], and every phase treats the root as durable local state. No phase, and no parent section, states how that root is backed up, restored on a new machine, or exported without its 0600 secret index. For a small team on one laptop this is the failure that loses the most work. **Exact edit**: add a short "State root backup and restore" section to the parent spec naming the paths, the 0600 exception for `secrets`, and one procedure (a `tar` with modes, or a `bots state export` verb) plus a restore check; no phase needs to change.
4. **Verified — the research's ranked order is fully covered.** Items 1-10 map to phases 001, 002, 004, 005, 006, 007, 008, 009, 010 and 003 (the TUI, moved up by the operator decision) [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:141], and item 11 (the desktop shell) is correctly not built. No ranked slice is missing from the packet.

## Ruled Out

- **Treating phase 011 as an unranked phase that should not exist.** The research's small-team model puts a bot in the team's chat, and the phase is explicit that it extends the program rather than continuing the ranked order [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:43]. The finding is the phase's size, not its existence.
- **Treating phase 003's Rust TUI as overbuild.** The research ranked the terminal screen and the operator chose a Rust rebuild explicitly, with the GPL alternative rejected [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:157]. The phase follows a recorded decision, so it is not overbuild.
- **Treating phase 008's four modules as overbuild.** The research names rakazo's vault policy, leak matcher and placeholder guard as the liftable layer [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:73], so the module split mirrors the reference rather than inventing surface.

## Dead Ends

- Searching for a missing verb by comparing the research's smallest-change text to the phase lists found no gap: every "smallest change" sentence in the research maps to a phase requirement. The gaps that remain are operational (backup), not feature slices.

## Edge Cases

- **Ambiguous input**: "still missing after all eleven phases" was read as an operational or feature gap a small team would hit, not as a parity item the research deliberately skipped. The deliberate skips (shared host, SSO, desktop shell, per-action policy) are recorded as non-goals, not gaps.
- **Contradictory evidence**: none.
- **Missing dependencies**: none.
- **Partial success**: the reference repos under `specs/system-skilled-bots/context/` were used through the research synthesis rather than re-read; a direct read could confirm whether any transport has a cheaper path than 011's five-adapter design.

## Sources Consulted

- specs/system-skilled-bots/002-openbot-parity-research/research/research.md:73, :137, :141, :157
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:103, :104, :147, :173
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:43, :45, :62
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 1.0
- Questions addressed: angle 3, parity gaps and overbuild
- Questions answered: every ranked slice is covered and the desktop shell is correctly deferred; the gaps are operational (no state-root backup) and the overbuild is phase 011's five transports plus phase 006's four inert ladder rungs and its misleading `always` scope name.

## Reflection

- **What worked and why**: Mapping the ranked order item by item to the phase list is the only way to distinguish "missing slice" from "deliberate skip". The research's own operator decisions then settle the two phases that look out of order.
- **What did not work and why**: Looking for a missing feature by diffing the research against the phases found nothing, because the packet is faithful to the ranked list. The real gap is operational and lives outside the ranked list entirely.
- **What I would do differently**: Ask "what does the team lose when the laptop dies" earlier; state durability is the one property no parity slice owns.

## Recommended Next Focus

Take angle 4's remaining half — security beyond failure modes: secret leakage paths, token storage, spoofed chat users and who may approve — and test each against the runtime's posture, the vault's 0600/keychain claim and the channel link's identity model.
