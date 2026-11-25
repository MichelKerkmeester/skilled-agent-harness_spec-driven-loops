# Iteration 1: Parity gaps and overbuild — inventory of the eleven phases against the 002 ranked order and the built runtime

## Focus

Frontier node F-1-004 (depth 1): "Parity gaps and overbuild: against OpenBot's eight parts and the 002 synthesis, what does a small team still lack after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?"

This iteration builds the inventory the rest of the run needs: what each of the eleven phases claims to add, which row of the 002 ranked build order it answers, and which of those surfaces the built runtime already provides. It does not yet test each plan's named files and functions against the runtime (angle 1) or the shared records across phases (angle 2); those are deferred to later iterations and recorded in Recommended Next Focus.

## Actions Taken

1. Read the 002 synthesis's frame, ranked build order, skip list, small-team model and open questions (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:21-205`).
2. Read the parent packet's phase map, out-of-scope list and Files to Change table (`specs/system-skilled-bots/003-openbot-parity-build/spec.md:84-143`).
3. Read the In Scope / Out of Scope block of all eleven phase `spec.md` files.
4. Read the AFFECTED SURFACES tables of all eleven `plan.md` files.
5. Listed the built runtime's modules and tests, and probed the CLI for every verb the plans assume is missing.

## Findings

1. **Phase 011-messaging-channels has no row in the 002 ranked build order, so it is net-new scope that the parity research never sized or ranked.** The 002 order has eleven items: activity/actor, routine layer, computer exposure, memory, grants, per-bot apps, vault, skills, conversations, TUI, desktop shell (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:139-158`). Items 1-9 map one-to-one onto phases 001, 002, 004, 005, 006, 007, 008, 009, 010; item 10 (TUI) is phase 003; item 11 (desktop) is explicitly out of scope (`specs/system-skilled-bots/003-openbot-parity-build/spec.md:85`). Phase 011 answers none of them. **Severity P1.** Fix: add a twelfth row to the 002 ranked order (or a "post-parity" note in `specs/system-skilled-bots/003-openbot-parity-build/spec.md` §3) that names messaging channels, its size and its risk, and state in `011-messaging-channels/spec.md` §1 that the phase is post-parity scope rather than a research slice. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:139-158] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:114-143]

2. **Phase 011 builds five transports where the small-team model needs one plus the terminal, which is the largest overbuild in the packet.** The phase adds `channel.ts`, `channel-link.ts`, `channel-approval.ts`, `channel-queue.ts` and five transports — Telegram, Slack, Signal, WhatsApp and terminal — plus six verbs (`bots channel list|link|unlink|send|listen|drain`) (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:111-116`). The 002 small-team model says "the terminal is the client" and the skip list rules out mobile (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:103-116`). WhatsApp additionally needs a public HTTPS URL or tunnel and a Meta business account, which the phase itself lists as an operator prerequisite (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:116`). **Severity P1.** Fix: cut `011-messaging-channels/spec.md` §3 In Scope to Telegram long polling plus the terminal fallback, move Slack, Signal and WhatsApp into a new `012-messaging-transports` phase, and move `channel-approval.ts` and `channel-queue.ts` into the retained slice only if the Telegram path needs them.

3. **`operators.json` is a direct parent/child contradiction: the parent forbids any child from building it and phase 011 builds it.** The parent says "The rest of the small-team model (§12): two roles in one `operators.json` and a shared host at mode 0770. No child builds them; 001 lands the actor field alone" (`specs/system-skilled-bots/003-openbot-parity-build/spec.md:94`). Phase 001 repeats the deferral (`001-activity-and-actor/spec.md:100`) and phase 006 repeats it again (`006-approval-grants/spec.md:107`). Phase 011 then decides "yes, the minimal roster" and makes REQ-005 depend on it: "Only an actor named `owner` or listed in `members` in `operators.json`…" (`011-messaging-channels/spec.md:177`, `011-messaging-channels/spec.md:281`). **Severity P0** — 011 cannot meet its own REQ-005 without a file the parent forbids, and no phase owns that file's schema, its write path or its mode. Fix: move `operators.json` ownership into phase 001 (it already owns `actor.ts` and the actor precedence), change `spec.md:94` to "001 lands the actor field and the `operators.json` roster; no other child builds it", and change `011-messaging-channels/spec.md:281` to read the roster from 001 instead of landing it.

4. **The small-team authority check is a parity gap: after all eleven phases, `bots answer` still never checks who may answer.** The 002 model specifies "Two roles. An `owner` (who installed the jobs) and `member`, in one `operators.json` under the state root, checked by `bots answer` before it writes" (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:103`). Phase 001 defers the roster (`001-activity-and-actor/spec.md:100`), phase 006 defers it (`006-approval-grants/spec.md:107`), and phase 011 builds a roster only to gate channel senders (`011-messaging-channels/spec.md:177`). No phase adds the check to `answer.ts`. **Severity P1.** Fix: add one requirement to `006-approval-grants/spec.md` §4 — "`bots answer` refuses with `actor-not-permitted` when the resolved actor is neither `owner` nor in `members` of `operators.json`" — and one acceptance row for it.

5. **Phase 011 duplicates phase 006's approval surface with a second, parallel approval index.** 011 adds `channel-approval.ts`, "a file-backed `approval-v1:<item-id>:<index>` index and the numbered or YES/NO reply grammar, so a restart loses no prompt" (`specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:112`), while 006 already owns `grants` on the needs-you item and the precedence ladder at that gate (`006-approval-grants/spec.md:105-110`). Two indexes mean two answers can be recorded for one item, and the grant scope 006 writes is not what 011 reads. **Severity P1.** Fix: in `011-messaging-channels/spec.md` §3, replace the parallel index with "the channel reads the needs-you item id from the delivery entry and writes the answer through `bots answer --scope`, reusing 006's grant"; keep only a restart-safe `sent-prompt` marker, not an approval index.

6. **The parent packet's own audit trail is stale: it says "ten phases" and its `bots.cjs` row omits phases 003 and 011.** `spec.md:100` reads "This table is the audit trail of the surfaces the ten phases touch", and `spec.md:104` lists `.skilled/bin/bots.cjs` as modified by "001, 002, 004, 005, 006, 008, 009, 010" — but phase 003 adds the `ui` verb (`003-terminal-screen/spec.md:41`) and phase 011 adds six `channel` verbs (`011-messaging-channels/spec.md:116`). **Severity P2.** Fix: change "ten phases" to "eleven phases" at `spec.md:100` and change the phase column at `spec.md:104` to "001, 002, 003, 004, 005, 006, 008, 009, 010, 011".

7. **Phase 001's Definition of Ready contains a verify command that cannot pass as written.** It requires "`rg -n 'SCHEMA_VERSION' .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line reading `'2'`" (`001-activity-and-actor/plan.md:39`), but the file holds three `SCHEMA_VERSION` occurrences — the declaration at line 55, the guard at line 253 and the insert at line 677 — so the command prints three lines and the check fails before any work starts. **Severity P2.** Fix: change the check to `rg -n "const SCHEMA_VERSION = " .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints `55:const SCHEMA_VERSION = '2';`.

8. **The shared-host mode is deferred by every phase, so a two-person team cannot read the queue after all eleven phases.** The 002 model says "State folders are created mode 0700, so a shared root is unreadable by a second person. A group and mode 0770 is the whole change" (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:104`), and the runtime pins `STATE_DIR_MODE = 0o700` (`state-root.ts:46`). The parent defers it (`spec.md:94`), 001 defers it (`001-activity-and-actor/spec.md:100`) and 006 defers it (`006-approval-grants/spec.md:107`). **Severity P1** if the team shares a host, P2 if every operator has their own account. Fix: add one requirement to `001-activity-and-actor/spec.md` §4 — "when `operators.json` lists more than one member, the state root is created 0770 with the operator group" — or state in `spec.md` §3 that a shared host is unsupported and why.

## Questions Answered

- "Parity gaps and overbuild: against OpenBot's eight parts and the 002 synthesis, what does a small team still lack after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?" — partially. The inventory is complete (every 002 item maps to a phase, and the two net-new surfaces are named), but the per-phase runtime verification and the cross-phase record check are still open.

## Questions Remaining

- Do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here? (angle 1, not started)
- Do the phases agree on the shared records — `by:` actor, grants, `operators.json`, conversation JSONL, memory files, state-root layout, `HonoredPosture` fields, `bots --json` output — and is the build order sound? (angle 2, only the `operators.json` conflict is established)
- Security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages, concurrent approvals, prompt injection, routine `until` and fatigue edges. (angle 4, not started)

## Ruled Out

- **Treating the 002 ranked order as the packet's scope contract.** It is not: the parent's phase map adds phase 011 and moves the TUI to position 3, so the order is evidence of intent, not a checklist. Reading it as a checklist would have produced a false "all eleven phases are parity work" conclusion.
- **Counting the desktop shell as a gap.** It is deliberately out of scope at `spec.md:85`, so its absence is not a parity gap.
- **Reading the 001 `SCHEMA_VERSION` mismatch as a pre/post-state contradiction.** The Definition of Ready expects `'2'` and the FIX ADDENDUM expects `'3'`; those are the before and after states and are consistent. The real defect is the command's line count, recorded as finding 7.

## Dead Ends

- **Searching the phase docs for a phase that owns `operators.json`.** None does; the only owner-shaped text is 011's open question, which is why finding 3 is a parent/child contradiction rather than a missing requirement.
- **Looking for a 002 row that covers messaging channels.** There is none, including in the skip list and the eliminated-alternatives table, so 011's provenance cannot be recovered from the research.

## Edge Cases

- **Ambiguous input:** the frontier question asks what is "still missing after all eleven phases" and what "is not needed". Both readings are in scope, so this iteration answered the inventory half of each and deferred the per-phase verification. Deferred alternative: a strict "missing capability" list without the overbuild half.
- **Contradictory evidence:** the parent (`spec.md:94`) and phase 011 (`011-messaging-channels/spec.md:281`) make incompatible claims about whether any child builds `operators.json`. Both are cited; the parent is the higher authority, so finding 3 is recorded as a P0 against 011 rather than resolved in 011's favour.
- **Missing dependencies:** none. Every file read exists.
- **Partial success:** none. All five actions succeeded.

## Sources Consulted

- `specs/system-skilled-bots/002-openbot-parity-research/research/research.md:21-205`
- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:84-143`
- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:98-102`
- `specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:36-42`
- `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:41`
- `specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:105-110`
- `specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:97-102`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:111-116,177,191,281`
- `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts:55,253,677`
- `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46`
- `.skilled/bin/bots.cjs` (verb probe: `activity`, `inbox --json`, `channel`, `routines`, `remember`, `secret`, `chat`, `ui` all exit 2)

## Assessment

- New information ratio: 0.94 (7 fully new findings, 1 partially new because phase 011's own open question already names the `operators.json` conflict)
- Questions addressed: the F-1-004 parity-gap and overbuild inventory
- Questions answered: none fully; the inventory half is answered

## Reflection

- **What worked and why:** reading the 002 ranked order before the phase docs gave a fixed reference to map each phase against, which is what exposed phase 011 as net-new. Probing the CLI for every assumed-missing verb in one batch confirmed all eight Definition-of-Ready "unknown verb" checks pass, so the plans' starting assumptions are sound even where their later claims are not.
- **What did not work and why:** a first attempt to slice the AFFECTED SURFACES tables with `sed` anchor ranges returned empty rows, because each anchor name appears twice (open and close) and the range collapsed. Switching to a `grep -E '^\| \`'` over the whole file recovered the tables.
- **What I would do differently:** read the parent `spec.md` phase map first. It already records the dependency column and the out-of-scope list, and would have shortened the mapping step.

## Recommended Next Focus

Continue F-1-004 with the per-phase overbuild test: for each of the eleven plans, name the surfaces it adds that the built runtime already provides or that another phase also adds, and rank the cuts a small team can take. Then answer F-1-004 and move to the three unstarted angles: plan-versus-runtime verification of the named files and functions, cross-phase shared-record consistency, and security and failure modes.
