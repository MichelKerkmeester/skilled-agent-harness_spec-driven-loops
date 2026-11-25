# Iteration 8: Who may answer a needs-you item — 001, 006 and 011

## Focus
Frontier node F-2-006 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor): Who is allowed to answer a needs-you item, and can a chat sender be linked to the operator before any approval is honored across the 006, 011 and 001 plans?

## Actions Taken
1. Traced the answer path across the three phases: 001's actor resolver and `--as`, 006's answer verb and grants, 011's link record and approver check.
2. Checked what the executor sandbox actually confines: `posture.ts` accepts `danger-full-access` from a BOT.md, and the runtime has no config-level cap.
3. Re-read 006's "no auth" statements and 011's roster requirement against the runtime.

## Findings
1. **P0 — phases 001, 006 and 011: every approval identity is self-declared, and a bot can answer its own item.** 001 resolves the actor from `--as`, the OS user or a pinned operator name and validates only the name pattern; 006 adds `by` and `grants` but no caller check ("there is no sign-in to govern"); 011's roster gate applies only to channel presses. A bot that declares `sandbox: danger-full-access` (accepted by `posture.ts` with no repo-config cap) — or an executor whose Bash is unconfined, as the deep-loop notes for OpenCode — can run `bots answer <its-own-item> yes --as owner`, and the item records the claimed name as fact. The only gate in the packet is the channel roster, and the CLI path bypasses it. **Exact edit:** state the trust boundary (the interactive terminal and its OS user) and enforce it: refuse `--as` outside a tty plus a per-install operator token, and cap a bot's posture at `workspace-write` unless the operator explicitly installs it with full access; record both in 001/006 and cite them from 011. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/posture.ts:39-103] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:108] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:118]

2. **P1 — phase 011, `spec.md:175` (REQ-003): the link record names an actor, and the actor is not authenticated.** A chat is linked "to the actor who ran the command", but that actor is the same self-declared string from 001; the roster then compares a name to a name. Binding the roster to the provider-asserted chat id (Telegram user id, Slack user id, WhatsApp phone) would make the check about the sender rather than a claim. **Exact edit:** store both the actor and the provider-asserted sender id in the link record, and have `isApprover` match the sender id against the roster; add the mismatched-actor case to the conformance fixture. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:175] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177]

3. **P2 — phase 011, REQ-003 and REQ-005: a linked group chat exposes every approval prompt to its members.** The link is per chat, not per sender; the prompt reaches every member, and only the roster stops a non-approver from pressing. Reading is still allowed. **Exact edit:** state that a linked conversation's membership can read approval prompts, and require a direct chat for approval-bearing links (or mark group links read-only). [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:175]

4. **P2 — phase 006, `spec.md:108` versus phase 011, REQ-005: the two phases state different trust models.** 006 says "there is no sign-in to govern" and its risk table records "no auth"; 011 requires an owner/member roster and treats it as a gate. Both can be true only if the roster is an authorization list over an unauthenticated identity, which is what the code would do. **Exact edit:** add one shared "trust model" paragraph to 006 (or the track spec) that both phases cite: who is authenticated, what a name means, and which surfaces are trusted. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:108] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177]

## Ruled Out
- Suspected runtime auth helper the plans could reuse: ruled out. `actor.ts` does not exist and the plan's `CHK-032` explicitly checks that the runtime has no sign-in.
- Suspected sandbox cap in repo config: ruled out. `repo-config.ts` has no sandbox key; the definition's `sandbox` is the only input, and `posture.ts` accepts all three modes.

## Dead Ends
- Looking for an existing operator identity store: none exists; `operators.json` is named but never built (iteration 6's P0).

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: 006's "no auth" and 011's roster gate are the two incompatible statements; preserved both and recorded the conflict as finding 4.
- Missing dependencies: the roster file (P0) and any authenticated identity (P0).
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md
- .skilled/skills/system-skilled-bots/runtime/lib/posture.ts
- .skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts

## Assessment
- New information ratio: 1.0
- Questions addressed: F-2-006
- Questions answered: the question is answered as a finding — the plans do not define an authenticated approver; the channel path has a roster gate over an unauthenticated name, and the CLI path has none.

## Reflection
- What worked and why: reading `posture.ts` for the sandbox values turned a theoretical self-approval into a reachable path, because a BOT.md can request `danger-full-access` and no config caps it.
- What did not work and why: nothing failed; the three plans are individually explicit about having no auth, which made the cross-phase conclusion clean.
- What I would do differently: for any "who may" question, check both the permission list and the identity source; a permission list over a spoofable name is not a gate.

## Recommended Next Focus
F-2-007: how a standing grant is listed, revoked or expired once a rule store exists, and what stops `always` from becoming permanent silent authority.
