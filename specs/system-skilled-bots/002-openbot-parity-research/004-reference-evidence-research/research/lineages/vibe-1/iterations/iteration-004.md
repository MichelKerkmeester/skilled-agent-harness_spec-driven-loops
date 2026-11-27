# Iteration 4: Phases 006-approval-grants and 007-per-bot-apps

## Focus

Phases 006-approval-grants and 007-per-bot-apps, which no frontier node covers. The 001 synthesis's reuse table names `OpenBot-main/shared/tool-name.ts` as the "action-kind classifier" for the approval ladder, so this iteration tested that citation and then read the real classifier, the grant identity, the answer vocabulary and the per-bot app refusal.

Scope read: `context/OpenBot-main/shared/tool-name.ts`, `context/OpenBot-main/app/src/lib/approvals.ts`, `context/OpenBot-main/docs/approvals.md`, `context/OpenBot-main/shared/connect-prompt.ts`, `context/OpenGhost-main/rules.js`, `003-openbot-parity-build/006-approval-grants/spec.md`, `007-per-bot-apps/spec.md`.

## Findings

1. **The 001 synthesis's reuse table mis-cites the action-kind classifier, and a builder following it would lift the wrong file.** `shared/tool-name.ts` humanises a tool name for display: `readToolName` returns a `{ label, detail }` pair, `wholeToolName` resolves a shortened name, and `knowShortenedToolNames` learns what a hash stands for, because "the model is offered `mcp__notes__search_notes` … none of that is the reader's problem" [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts:15-59]. The action-kind classifier is `app/src/lib/approvals.ts`: `ActionKind` at line 62, `ActionKindPolicy` at line 71, `ConversationGrant` at line 76, `RuleBehaviour` at line 60 [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:54-100], with the recognition rules written as a table in `docs/approvals.md` [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:34-45]. The 001 synthesis's row "Action-kind classifier | OpenBot `shared/tool-name.ts` | MIT | Approval ladder" [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:139] should read `app/src/lib/approvals.ts` plus `docs/approvals.md`. (observed)

2. **The reference lets a kind of action be opened only by an allow given on that kind's own card, and phase 006's ladder has no such rule.** "An allow reaches a kind of action only when it was given on that kind's card. 'Always allow here' on an ordinary click on a site does not let the Bot press that site's Send or Place your order button, and a rule you type in Settings, or a team rule, doesn't open a kind either. A rule that asks or hands off always applies." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:29-32]. Phase 006 writes the ladder as a doc and applies rung 1 at the needs-you gate [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:40], and that doc does not exist yet — `.skilled/skills/system-skilled-bots/bots-run/references/` holds `run-queue-and-answer.md` and no `approval-ladder.md` — so the rule has nowhere to land. It is the one rung-1 rule that stops a broad allow from silently opening a payment, and it belongs in the doc verbatim. (observed)

3. **The reference's conversation grant is keyed on four things — the same bot, tool, place and account — and phase 006's grant is keyed on four different ones.** "Allow for this conversation … the same Bot, the same tool, the same place and the same account. It doesn't reach another conversation, another Bot or another tool." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:22], with the type at [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:76]. Phase 006's grant carries "the action kind, the action in the bot's words, the rung that made it ask and the scope the answer granted" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:50]. The plan's grant records *why* it asked and the reference's records *what it covers*; a grant that does not name the place and the account cannot be checked against the next call, so the plan's grant is a record and the reference's is a key. (observed)

4. **The reference has a third answer — hand the action to the person — and phase 006's `once|deny` scope cannot express it.** `RuleBehaviour` is `"allow" | "pre_approved" | "ask" | "hand_off"` and `ActionKindPolicy` is `"open" | "ask" | "hand_off"` [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:60-71], and `HostCommandPolicy` is a separate `"ask" | "allow" | "never"` for host commands [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:87]. Phase 006's scope is `once|deny` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:43]. `hand_off` is not a denial and not an allow: the bot stops and the person does the step, which is exactly the passkey and phone-code case the 001 synthesis describes for the computer. A `hand_off` scope is the cheapest way to represent it without building the executor-side policy. (observed)

5. **OpenGhost's rules engine carries a per-moment capability matrix and an explicit list of the moments it cannot honour, and the deferred per-action packet has neither.** `CAN` maps each of the 17 moments to the actions a rule may take there — `PreToolUse` allows `deny, ask, allow, context, check, notify, log, stop` while `PermissionRequest` allows only `allow, deny, notify, log` [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:44-50], and `FOREIGN_EVENTS` names the 16 Claude Code moments the app has no counterpart for, with the rule that such a hook "is brought over only by adapting it" [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:39-40]. The 001 synthesis already names `rules.js` as the liftable layer for a later packet [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:93]; what is new is that the matrix and the foreign list are the two parts that make the engine safe, and neither is in the plan. (observed for the reference; the lift is carried by the 001 synthesis)

6. **The reference's per-bot app refusal carries four reasons and a marker, and it treats a recorded posture as a hint rather than the state.** `CONNECT_APP_MARKER = "[connect-app]"` prefixes a machine-readable refusal so the transcript can draw the app card in place, and the file exists because "a wording that lives in two files is a contract that drifts" [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/connect-prompt.ts:1-19]. `ConnectReason` is `"connect" | "reconnect" | "shared" | "access"` — no account, a withdrawn grant, a shared team account nobody connected, and a plain not-granted [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/connect-prompt.ts:21-35] — and the card "asks the server for the app's state for this person and this Bot when it is drawn, and draws that", with the hint winning only where the live state is stale [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/connect-prompt.ts:30-33]. Phase 007 has one refusal, `apps-unknown-server`, and records `HonoredPosture.apps` as the truth of what was honored [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:30]. The four reasons are the taxonomy a per-bot app layer needs, and the hint-not-state rule is the one that keeps a recorded posture from being read as a live grant. (observed)

## Ruled Out

- **Lifting `tool-name.ts` for the approval ladder.** It is a display humaniser; the classifier is `approvals.ts` plus the `docs/approvals.md` table. Recorded as finding 1 so the correction reaches the synthesis.
- **Reading `docs/approvals.md:3-13` as new.** Phase 006 already cites the four-rung order at that line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:63], so the order itself is carried; only the kind-opening rule and the grant identity are new.
- **Treating `HostCommandPolicy` as a phase-006 gap.** It governs host shell commands, which the runtime's posture matrix already refuses by pair, so it belongs to the deferred per-action packet and not to 006.

## Dead Ends

- A written `approval-ladder.md` in the runtime: the file does not exist, so the precedence rule has no current home and finding 2 is a gap in a deliverable rather than a contradiction in a document.
- A per-bot app filter in rakazo: its vault and secret layer is phase 008's, and its app surface is a connector catalogue rather than a per-bot allowlist, so nothing there answers 007.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the 001 synthesis's reuse table names a file that does not classify action kinds. Recorded as finding 1 with both citations rather than silently corrected.
- Missing dependencies: `approval-ladder.md` is absent from the runtime, which limits finding 2 to a statement about where the rule should land.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/shared/tool-name.ts:15-59
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/approvals.ts:54-100
- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-45
- specs/system-skilled-bots/context/OpenBot-main/shared/connect-prompt.ts:1-35
- specs/system-skilled-bots/context/OpenGhost-main/rules.js:20-50
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:40-63
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:30-50
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:93, 139
- .skilled/skills/system-skilled-bots/bots-run/references/ (listing: run-queue-and-answer.md only)
- specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md (absent at read time)

## Assessment

- New information ratio: 0.92
- Questions addressed: phases 006-approval-grants and 007-per-bot-apps
- Questions answered: none of the tracked questions; this is a broadening iteration

## Reflection

- What worked and why: testing the earlier synthesis's citation instead of trusting it. One `head` of `tool-name.ts` showed it is a display humaniser, which turned a reuse-table row into a correction and led straight to the real classifier in `approvals.ts`.
- What did not work and why: looking for `approval-ladder.md` in the runtime. It is a phase-006 deliverable that has not been written, so the search could only confirm an absence.
- What I would do differently: check every file the earlier syntheses name in a reuse table before reading anything else in a phase, because a wrong citation costs a builder a whole slice.

## Recommended Next Focus

Phase 008-vault: rakazo's `vault.ts`, `secret-matcher.ts` and `secrets-guard.ts` are the three files the phase lifts, and the 003 synthesis calls 008 the largest addendum, so the reference lines matter more here than anywhere else.
