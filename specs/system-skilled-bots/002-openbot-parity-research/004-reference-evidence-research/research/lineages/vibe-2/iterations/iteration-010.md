# Iteration 10: Phases 003, 006, 007 and 008 under a phase lens, and the net-new ranking

## Focus

The four phases no iteration had read under a phase lens. Iterations 1 and 3 read 006, 007 and 008 through the trust lens, which asked what a grant may not override; they never asked what the phase is for. 003-terminal-screen was read only through its own `context-manifest.md`. This iteration reads all four phase Problem Statements and their reference counterparts, then closes the net-new ranking the topic's second question asks for.

## Actions Taken

1. Read the Problem Statements of 003-terminal-screen, 006-approval-grants, 007-per-bot-apps and 008-vault.
2. Read `OpenBot-main/docs/approvals.md` in full for the answer set, the precedence order, the recognition table and the reversal note.
3. Read the plan's 006 answer set, its scope boundary and its handoff criteria.
4. Read `openhuman-main/crates/openhuman-tui/src/crash_reporting.rs` and listed the crate's modules.
5. Read `OpenBot-main/docs/configuration.md:178-196` for the per-bot component grants and the stall timeout.

## Findings

1. **006 — the reference offers four answers and the plan two, and the reference reversed the plan's design for a stated reason.** The reference's card offers "Allow once", "Allow for this conversation", "Always allow here" and "Deny". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:20-27] *(observed)* Its own note records the reversal: "This reverses [#998](https://github.com/CopilotKit/OpenBot/pull/998), which made deleting, sending, sharing and posting ask every time with Allow once and Deny only, and handed payments and account changes to you. OpenBot opens these by default; closing them is the organization's call." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:57-59] *(observed)* The plan's answer set is `--scope once|deny`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:30] *(observed)* So the plan implements the design the reference tried and reversed. The plan's scope boundary defers the rules store, the auto-review and the extra-vigilant switch, which is right — but the conversation scope is not a rules store, and it is the one answer the plan could add without one.

2. **006 — the reference bounds its conversation answer by four facts and the plan's grant has no such bound.** "the same Bot, the same tool, the same place and the same account. It doesn't reach another conversation, another Bot or another tool." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:24] *(observed)* The plan's grant carries "the action kind, the action in the bot's words, the rung that made it ask and the scope the answer granted". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:50] *(observed)* The four facts are the bound that makes a conversation answer safe, and the plan's grant has no place to record them.

3. **006 — the reference makes a check-in-started task ask before every change whatever the rules say, and the plan has no run-origin override.** "A task started from a check-in asks before every change, whatever the above says." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:17] *(observed)* The plan's 006 applies rung 1 at the needs-you gate with no rule keyed on what started the run. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:40] *(observed)* This is the same run-origin distinction iteration 6 found in the prompt builder, and it is the second place the plan loses it.

4. **006 — the reference's human-only credential card has a different shape, which is the second source for the human-only rule.** "The Bot would type it into a form, and only you have it, so no answer of yours can stand in for it. It is handed to you: the card says it is yours to do, and offers **I did it myself** and **Don't do it**." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:52-55] *(observed)* Iteration 1 found the same rule in tinysecurity's `ApprovalGrants2` as a non-override. This is the independent second source, and it adds the card shape: a human-only action offers two answers, not four, and neither of them is an approval.

5. **006 — the reference classifies an action into a kind by words in the tool name, the action and the page, and the plan's classifier has no such table.** The reference's recognition table gives each kind a keyword set: payment words anywhere in the action and its page, "Delete, trash, destroy, erase, purge, wipe or discard in an app's tool name", and a button-label list per kind. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:38-47] *(observed)* The reference needs a keyword table because it cannot see a third-party tool's intent. The plan's `action-kind.ts` classifies a tool it owns, so a declaration is the stronger mechanism — but the plan's 006 has no row for a tool it does not own, and 007's connector servers are exactly that.

6. **003 — the reference's terminal binary reports its own crash through the shared chain with secret scrubbing and PII off, and its call site survives the feature being off.** `crash_reporting.rs` is "Crash-reporting client ownership for the standalone terminal binary", and "The client options come from embed's shared chain ... the same noise filters, secret scrubbing, PII-off defaults and transport as the CLI and the desktop shell. Only the DSN, release and environment are resolved here." Its guard "must live for the whole process. A build without the `crash-reporting` feature retains the same call site and compiles to a no-op." [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/crash_reporting.rs:1-16] *(observed)* The plan's 003 has no crash reporting, so a panic in the screen leaves the operator with a dead terminal and no record. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:104] *(observed)* The reference's two rules are the ones to lift: reuse the host's scrubbing chain rather than a second one, and keep the call site so a build without the feature still compiles.

7. **007 — the reference's per-bot grants govern a component catalogue with a draft, preview and publish lifecycle, and the plan's `apps:` is a list of names.** "The component catalogue has separate per-Bot grants. Its sortable data table (`showTable`), interactive form (`askForm`), and other compiled or playground-authored components remain governed by those grants. In Admin → Playground, edit a draft and its sample arguments, preview it, then publish it for Bots to use. Only published code renders in conversations and the administrator's gallery; invalid JSON blocks saving and publishing." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:182-186] *(observed)* The plan's 007 grants a bot a set of connector servers by name and has no draft, preview or publish step. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:63] *(observed)* The reference's lifecycle is what makes a grant reviewable before it takes effect, and it is the same staged-write shape 009's `revisionRead` already uses.

8. **007 — the reference runs generated UI without the app's session or same-origin access, which is a caution for any later phase that renders bot-authored markup.** "Generated HTML runs without the app's session or same-origin access to its data. It can load libraries from a CDN; deployments that prohibit that browser traffic can disable generated UI." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:188-189] *(observed)* The plan's 007 has no generated-UI surface, so this is a rule to record rather than a gap to close: a bot-authored page must not inherit the host's session, and the CDN allowance is a deployment switch.

9. **Net-new, rank 1 by value per line — a stall watchdog for the one failure an event log cannot record.** `AGENT_STALL_TIMEOUT_MS` "watches for the failure a Bot has that nothing else in the trail can show: a stream that stops producing anything. Every other audit row is something that happened, and this one is the absence of anything happening, which leaves no trace of its own. Ending the turn writes `agent.stream_stalled`. Unset or `0` switches it off and nothing is watched. `.env.example` ships `60000`, so a new clone has it on and an upgraded deployment does not acquire it unasked." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:190-194] *(observed)* The plan's 001 activity log records events and has no row for the absence of one, so a bot that hangs produces nothing and nothing notices. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:63] *(observed)* **Size: S** — one timer, one row type, one default. The default's asymmetry is the part to copy: on for a new clone, off for an upgrade.

## Ruled Out

- **A rules store, an auto-review switch or an extra-vigilant switch for 006.** The plan's scope boundary defers all three and the deferral is right; only the conversation scope is in reach. Recorded as finding 1.
- **A keyword classifier for 006.** The plan owns its tools and a declaration is the stronger mechanism; the gap is only for a tool it does not own. Recorded as finding 5.
- **A generated-UI surface for 007.** The plan has none, so the reference's sandbox rule is recorded and not lifted. Recorded as finding 8.
- **`rakazo-main` and `OpenMausBot-main` for 008.** Iteration 1 read rakazo's secret store and iteration 3 read the plan's fail-closed surfaces; nothing new was found in either this iteration, so 008 is closed on those two.

## Dead Ends

- `OpenBot-main/docs/approvals.md` beyond line 60 — the rest is the admin settings table and the audit-trail description, both of which the plan's 006 defers by scope boundary.
- `openhuman-tui`'s `cockpit.rs`, `browser_login.rs` and `demo.rs` — three surfaces the plan's 003 lists out of scope by name, so reading them again would repeat a decision the plan already made.

## Edge Cases

- Ambiguous input: none. Each of the four phases had one reading.
- Contradictory evidence: none. The reference's reversal note and the plan's two-answer model are a genuine disagreement, and the evidence favours the reference for a reason the reference states.
- Missing dependencies: `OpenBot-main/server/` is absent, so the grant store's record shape cannot be read. Fallback: `docs/approvals.md`, which states the four facts a conversation answer is bounded by. Confidence impact: the store's schema is inferred, not read.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:1-60
- specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:178-196
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/crash_reporting.rs:1-18
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/ (module listing)
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:104,115,229
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:30,40,50,63
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:63
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:63

## Assessment

- New information ratio: 0.94
- Questions addressed: the topic's first question for phases 003, 006, 007 and 008, and the ranking half of its second question.
- Questions answered: 006's four-answer reversal, the four-fact conversation bound, the check-in override, the human-only card shape and the keyword classifier; 003's crash reporting; 007's draft-preview-publish lifecycle and the generated-UI sandbox; and the stall watchdog as the highest-value net-new per line.

## Reflection

- What worked and why: reading the reference's *own reversal note*. `approvals.md` records that it once shipped exactly the plan's two-answer model and reversed it, with the pull request and the reason. That single paragraph is worth more than any amount of code reading, because it is a design decision with its outcome attached.
- What did not work and why: the first pass at 003 looked for a layout difference and found none, because the plan's 003 already follows openhuman-tui's layout and lists the demo, bench and theme surfaces out of scope. The value was in the one module the plan has no analogue for, `crash_reporting.rs`, which is not a layout at all.
- What I would do differently: for a phase the plan has already researched deeply, read the reference for the module the plan's file table does *not* name, rather than for the ones it does.

## Recommended Next Focus

None. This is the tenth and final iteration. The synthesis follows: the fourteen phase sections, the net-new ranking table with sizes, the licence table, and the gap list. The one question this iteration leaves open is whether 006's conversation scope is a 006 change or a 010 change, since 010 owns the conversation record the scope would be keyed on.
