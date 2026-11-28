# Reference Evidence for the OpenBot Parity Build: Research Synthesis

Synthesis of one `/deep:research` fan-out lineage (`pi-1`, ten iterations, `stopPolicy: max-iterations`). The lineage's business was the second half of the parity question: for each of the fourteen planned phases, which reference files and lines implement the same thing, what a builder should lift or mirror and under which licence, where the plan and the reference disagree and which side the evidence supports, and which failures the plan does not yet guard against; then what the ten repos hold that neither the plan nor the parity synthesis's skip list covers, ranked by value to a small team.

Every claim cites `[SOURCE: path:line]` and is marked **observed** (the line was read) or **inferred** (reasoned from cited lines). The lineage's own working record is `research/lineages/pi-1/iterations/iteration-001.md` to `iteration-010.md`, with the structured findings in `research/lineages/pi-1/deltas/iter-001.jsonl` to `iter-010.jsonl`. Fifty findings were recorded; this document consolidates them and names the phase each belongs to.

---

## 1. Executive Summary

The plan is in better shape than a fresh gap hunt expects. Seven of nine iterations opened by finding that the plan had already made the reference's choice, and three of the twelve phase findings are *confirmation* rather than correction: 004's working-place line, 010's chat contract and 011's send queue are more specific than anything in the corpus, and 012 already lifts the backoff ladder from `tinychannels`. The corrections that do exist cluster in three places: the **origin of a run** (a scheduled run is allowed to park or act where the reference refuses), **untrusted text reaching a model** (a skill body, a channel reply, a refusal message), and the **lifecycle of a parked run** (an answer bound only to an item id, a memory block pinned into a prompt that no phase refreshes).

The single most useful new artifact from this lineage is not a phase finding: it is that the whole reference corpus splits cleanly into a liftable set (OpenBot, OpenGhost and hermes-muse MIT; OpenMausBot, rakazo, turnstone and buzz Apache-2.0) and a design-only set (openhuman, openhuman-full, tinychannels, GPL-3.0-only), and that the design-only set is where most of the approval, policy and skill-scanning depth lives — including 4,379,258 lines of vendored Rust.

Three fixes are worth more than the rest: a `readonly` ceiling on scheduled runs, a per-bot tool tier, and a supply-chain scan of a skill body. Section 13 names the three failure classes they belong to.

---

## 2. Research Question and Scope

Two questions, as bound: (1) evidence per planned phase — the reference files and lines, the lift or mirror with its licence, the plan-versus-reference divergence and which side wins, and the failures, tests and fixes the plan does not guard against; (2) net-new — what the ten repos hold that neither the plan nor the parity synthesis's section 13 skip list covers, ranked by value and sized.

Scope is a small team on one machine or a shared host, a terminal client, and the fourteen 003 phases as they stand. Every input was read-only: the ten repos under `specs/system-skilled-bots/context/`, the fourteen phase folders and `contracts/` of `specs/system-skilled-bots/003-openbot-parity-build`, the three earlier syntheses, and the built runtime under `.skilled/skills/system-skilled-bots/`. The lineage wrote only inside `research/lineages/pi-1/`.

A finding already carried by one of the three earlier syntheses is cited to it and not restated; where this lineage adds to such a finding it says which part is new.

---

## 3. Method and Evidence Base

Ten iterations, each reading a phase cluster against its nearest reference and writing a finding per divergence, confirmation or failure class. Expansive depth was on and the lineage was dealt one frontier node, F-1-003 (openhuman-full, never studied before), which iteration 1 answered; iterations 2 to 10 then applied the persona's lowest-coverage rule, because the reducer's Next Focus returns a terminal sentinel once the only tracked question is answered.

Evidence rules that shaped what is in this document: a doc comment was treated as evidence (the reference repos state the failure a module was written for, and that prose is usually the most valuable line in the file); a test file's *name* was treated as evidence of a failure class someone paid for; and a grep that returns nothing was recorded as "not established", never as "absent". Four such negatives are in Section 15.

Two limits worth stating. First, `openhuman-main/vendor` and `openhuman-full/vendor` are the same twenty-one directory names and the former's are empty — so a claim "openhuman-full has something openhuman-main lacks" is true of the vendored crate *sources* and false of the TUI, whose `src/` is identical in both. Second, no reference repo holds the built runtime's design, so several findings are about *guardrails around* a design the plan chose differently (a terminal instead of a desktop, a file queue instead of a broker); those are recorded as confirmation, not as gaps.

---

## 4. Coverage: the Fourteen Phases at a Glance

Fifty findings over ten iterations. The count per phase, and the one finding that matters most in each:

| Phase | Findings | The finding that matters | Side the evidence supports |
|---|---|---|---|
| 001-activity-and-actor | 1 | An optimistic row must never be the row a reader believes (`oneRowPerAction` drops an "Allowed" row once its terminal row loads) | plan, with the failure named |
| 002-routine-layer | 2 | A firing must be framed as work, not as a sentence about routine management; a multi-part routine needs part closure | reference (OpenBot paid for the failure) |
| 003-terminal-screen | 8 | Terminal restore needs a panic hook, and a command preview must keep its control characters | reference |
| 004-computer-exposure | 1 | No reference implements the plan's working-place line; the nearest artifacts are declined container plumbing | plan (negative evidence) |
| 005-memory | 4 | A positional forget index shifts under the operator; a full file refuses every later append | reference |
| 006-approval-grants | 3 | Order the ladder by origin before kind; bind an answer to the process and generation that asked | reference |
| 007-per-bot-apps | 4 | Gate the tool call with a privilege ladder and a caller maximum, not only the server list | reference |
| 008-vault | 2 | Add a validator layer (card, IBAN, national id) beside the known-value map; scan parsed values, not only raw bytes | reference |
| 009-skills | 2 | Scan an untrusted skill body before it reaches a prompt (invisible code points, credentials, escaping paths) | reference |
| 010-conversations | 2 | A pasted block must not send; the chat contract itself is the plan's | mixed |
| 011-messaging-channels | 4 | Keep an inbound disposition ledger; parse a reply as intent only, bounded | reference |
| 013-manual-testing-scenarios | 5 | Add a pipe scenario, an adversarial-nesting scenario and tombstone rows for deferred features | reference |
| 014-skilled-and-doc-alignment | 1 | A generated one-line-per-document index proves a reader can find a doc; two generators agreeing does not | reference |
| 015-deep-review | 1 | Record the hypothesis a finding ruled out and a correction section | reference |

The four single-finding phases are single for a reason each: 004's is negative evidence, 013's and 014's are artifact shapes with no reference implementation behind them, and 001's is a rule the plan already satisfies. None of them hides an unread implementation.

---

## 5. 003-terminal-screen, and the Frontier Node Behind It

F-1-003 asked what openhuman-full's five vendored crates and its TUI hold that openhuman-main lacks. The answer rewrites the premise: the TUI is the *same* crate in both checkouts (identical `src/` file list, the same 432K), and what full adds is the source of twenty-one vendored TinyHumans crates — 417M of `vendor/` against 0 bytes for the same directory names in `openhuman-main`, path-linked from its root manifest. [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:46-47] **observed**

What that changes for the phase's six children:

- **006-hardening-and-proof: a panic hook.** The TUI's terminal module states that alternate screen and raw mode "**must** be undone on every exit path — normal return, `?` propagation, and panic — or the user's shell is left in a broken state (no echo, no line editing, stuck on the alternate screen)", restores on `Drop`, and chains a restore ahead of the previous panic hook. The plan's hardening child has `fmt`, `clippy -D warnings`, `cargo test` and a release `pty_smoke`, and no requirement naming a panic hook — so a panicking render leaves the operator's terminal in raw mode and the pty smoke test still passes. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/terminal.rs:1-8] [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/terminal.rs:104-118] **observed**
- **004-panes: a bounded preview with a marker, and a char-boundary clip.** `bounded(value, limit)` sanitizes, returns early when the text fits, walks back to a char boundary and appends `[preview truncated]`. The plan clips by display width in `view/panes.rs` and names no marker, so a clipped question reads as a complete one, and a byte clip of a multi-byte question panics — a different code path from the answer overlay in child 005. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity.rs:207-215] **observed**
- **003-shell-and-navigation: a coalesced draw.** The reference polls input at 100 ms, gates redraws on `dirty && elapsed >= 16 ms`, and ticks a 120 ms spinner; the plan redraws per event and polls its verbs on a five-second timer, so a key repeat redraws per key. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/app.rs:115-189] **observed**
- **004-panes: the sanitizer is a filter, the plan's is a replacement.** `safe_text` drops every control character except `\n`; the plan replaces each, line breaks included, with `?`. The plan's choice is right for a single-line row and is already recorded as REQ-021; the reference's keep-`\n` is only safe because its rows are multi-line transcript blocks. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/theme.rs:88-93] **observed**
- **005-answer-flow: two divergences the phase has not met yet.** An approval card in turnstone keeps *every* control character, because "in a command it changes what runs (`cd /tmp` followed by one fails)", and the card is a diff whose lines are coloured by marker (`-` red, `+` green, `---`/`Warning:`/`(` yellow). The plan's overlay shows the question and the grant, never the change, and its single sanitizer would rewrite a command preview into a different command. Both are latent today because no grant carries a command. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:95-136] **observed**

---

## 6. 002-routine-layer and 001-activity-and-actor

**The firing frame (002, reference wins).** OpenBot wraps every scheduled instruction in three sentences that tell the turn it *is* a firing and that the instruction is work to do now. The module doc records the failure that produced it: an instruction sent verbatim was read by the model as a question about routine *management*, the model listed routines, answered that the routine was already configured, and appended nothing — and the run "recorded `succeeded`". The doc calls it "a routine telling somebody it is working while doing nothing at all, which is worse than one that breaks". The plan's routine block has `what`/`starts`/`does`/`until`/`until_check`, the fifteen-minute floor and the fatigue switch, and no requirement about how a firing is put to the model. Licence MIT. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:1-30] **observed**

**The checklist (002, reference wins).** `routine-checklist.ts` reads a list out of the instruction, caps it at `MOST_PARTS = 10` because "a list longer than this is data rather than parts", and requires every part to end `Done`, `Blocked (with the reason)` or `Skipped (with the reason)` before the run may end. A routine written as a numbered list is one unit in the plan, so a run that does two of three steps is indistinguishable from a complete one. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/routine-checklist.ts:1-25] **observed**

**The optimistic row (001, plan wins).** OpenBot's computer writes an action row *before* acting and a terminal row on failure, sharing an `attempt` id, and `oneRowPerAction` drops the first when the second is loaded — because "the first is the one a reader believes". The plan cannot produce this: `working` comes from a lease side file that disappears, and outcomes come from the index. The rule is worth writing down because a later phase that adds a "sent" or "started" row will meet it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity-rows.ts:55-110] **observed**

**What is already covered.** OpenBot's seven activity ids, their order, the "leave out an empty group" rule, and the "stopped is apart from failed" rationale are exactly what 001 REQ-001 specifies; the parity synthesis already carries the mapping. Nothing here is new.

---

## 7. 004-computer-exposure and 005-memory

**004 is negative evidence.** OpenBot derives a per-bot computer token as `HMAC-SHA256(COMPUTER_TOKEN, label)` to authenticate a bot into a loopback-only container, and 004 declines that container. The plan's working-place line — directory, branch and run folder, with a prefix constant so a resumed run finds it and refuses a prompt naming another tree, and five named git answers — has no counterpart in any of the ten repos and is more specific than anything the corpus states. Recorded so a later reader does not go looking for the missing reference. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer-token.ts:1] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:143-155] **observed**

**Five: identity beats a positional index.** turnstone's memory identity is the tuple `(name, scope, scope_id)`, with saving on the same identity an upsert that preserves the id, and a required authored `description` of 1-512 characters supplied on every write ("Content-only updates are rejected"). The plan forgets by 1-based position and shifts every later index down, with a copy-forward rule for a concurrent append. An index an operator wrote down names a different fact after any forget. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/memory.md:38-55] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152] **observed**

**Five: a bound that refuses versus a bound that compacts.** OpenGhost has the same two numbers as the plan (`records: 60`, `chars: 3600`) plus a crowded mark at 28 that triggers a rewrite, with the merge rule stated in the prompt ("where two disagree keep only what the later one says"). The plan refuses every append past the bound, so a full memory can never remember again. The merge rule is the part that makes compaction specifiable. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:8-18] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150] **observed**

**Five: the pinned block nobody refreshes.** turnstone pins a body-free index at the first admitted turn and reads bodies live ("Bodies never enter the index"). The plan injects the block into the prompt, which is right at 3.6 KB, but 004 pins and re-checks the working-place line on resume and nothing pins or refreshes the memory block — so a fact remembered while a run waits never reaches the resumed run. [SOURCE: specs/system-skilled-bots/context/turnstone-main/docs/memory.md:99-109] **observed; consequence inferred**

**Five, background.** tinymemory models memory as a namespace tree (root shared, then agents/teams/users/workspaces/projects) with a `Reach` whose `inherit` defaults on, and a provenance policy that treats unknown namespaces as untrusted; the plan's two files are one level of that with no revocation. Design-only (GPL). [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/crates/tinymemory-api/src/namespace/mod.rs:1-14] **observed**

---

## 8. 006-approval-grants and 007-per-bot-apps

**Six: order by origin before kind.** The reference refuses a Cron external effect outright and bars human-only tools from the automatic path however they are named, before any prompt exists. The plan classifies the action kind first and parks a needs-you item, so a scheduled routine that hits `pay`, `send` or `credentials` waits indefinitely, at whatever hour the cron fired. The reference's answer for that case is a visible refusal. Licence GPL, design-only. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs:486] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs:658-673] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:160-161] **observed**

**Six: bind the answer.** The reference refuses a review unless it carries the row's `decision_ticket_sha256`, a non-empty actor of at most 1024 bytes, and a `host_instance` equal to the current one (Deny excepted), and it refuses a registration against a generation that is no longer current. The plan binds an answer to the item id and records `grantedBy`/`grantedAt`, so an item written by an earlier run of a bot is answerable by a newer one. One field, not a store. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs:1636-1648] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/engine.rs:1282-1288] **observed**

**Six: the ladder's deferred rungs are visible elsewhere.** The plan refuses standing grants (`grant-scope-unsupported`) and defers the rules store, which its own risk row defends. The reference implements the four choices (`Once`, `Tool`, `Flow`, `Deny`) and an approval TTL capped per origin at 180 s for `Copilot`/`SubAgent` and 600 s otherwise. The refusal is the right size; the TTL is the part the plan does not name. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-bus/src/approval.rs:60-69] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:19-26] **observed**

**Seven: gate the call, not only the config.** The plan's `apps:` narrows the server list and says plainly that it "confines no child that reads a config from another path". The reference gates each tool call on a five-step ladder (`None`, `ReadOnly`, `Write`, `Execute`, `Dangerous`) against a caller-declared maximum, "rejected before any argument is parsed", and its admission checks open with a rule of their own: "A scheduled turn runs read-only tools only, whatever the autonomy tier." It also refuses a spent hourly budget *before* asking a human ("so a human is not asked first"), and every refusal is a typed reason the host renders for the model with "no payload". Four cheap guards, none of which needs a rule store. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:1-26] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:95] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs:1-30] **observed**

---

## 9. 008-vault and 009-skills

**Eight: a validator layer beside the value map.** The plan matches known values in plain, standard-base64 and `encodeURIComponent` forms and names transformed values in its non-goal table. The reference adds a value-free layer: `Always`, `Card`, `Iban`, `NationalId`, `Ip`, `Phone` validators plus PEM blocks, assignments, gated assignments, cookies, home paths and endpoints, all "fixed linear-time patterns". A card number the vault never stored is caught only by the validator layer. Card and IBAN are the two worth lifting as behaviour; phone and IP cost false positives, which is why the reference separates the validators by name. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:1-25] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/design/leak-checks.md:108] **observed**

**Eight: parse, then redact.** The reference redacts a *parsed* JSON value in place, decodes four base64 alphabets, and refuses oversized input rather than truncating it. The plan's post-run scan reads raw stdout and files, so a value that appears only JSON-escaped (`\u002f`) is missed, and no requirement states a ceiling on the bytes scanned. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:143-155] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/lib.rs:302-308] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:168] **observed**

**Nine: the skill body is untrusted input, and nothing scans it.** `tinyskills` scans skill text and returns `pass`/`warn`/`block`: block on invisible, bidi and zero-width code points, hard-coded credentials and escaping resource paths; warn on agent-addressed text, fetch-and-exec pipelines and undeclared MCP references; and it ships `sanitize_catalogue_text` "for rendering untrusted text into a prompt as data". The plan loads each `SKILL.md` body into the prompt under a byte cap, refuses an unresolved name, and relies on 008's secret-literal check for values — so a body carrying zero-width characters, invisible to the operator reviewing the file and parsed by the model, reaches the prompt intact. This is the highest-value single finding against a planned phase. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:26-49] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161-163] **observed**

**Nine: the procedural guards.** The same crate rejects symlinked directories and manifests, checks archive entry-count and expanded-size caps before reading any content, resolves scope collisions with a stated tie-break, and validates slugs. With one skill root, the two that matter today are symlink rejection and the pre-read size caps. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:28-40] **observed**

---

## 10. 010-conversations and 011-messaging-channels

**Ten: the plan's chat contract is the strongest thing in the corpus.** Append-only file with a torn last line skipped and counted, nine-key message, a leading line feed before an append so a fragment cannot swallow the next message, reserved `needs you:`/`failed:` prefixes escaped so a bot reply cannot impersonate them, a 40-message/8,000-character block bound, and a `prompt-over-budget` refusal before the append. Neither reference has any of it: turnstone's loop is the shape the plan lifts (readline history at 1,000 lines, slash-command completion) and the plan adds `@bot` completion. Only two things are missing.

**Ten: a pasted block must not send.** openhuman-tui's controls table states "Pasting text never sends it automatically", with `Shift+Enter`/`Ctrl+J` for a newline. The plan's loop sends on Enter, treats an empty line as nothing, and reads `--message -` "as one line", so a pasted multi-line block arrives as several Enters and each dispatches a run. Bracketed-paste detection, or a rule that a message containing a line feed is never sent by Enter alone, closes it. Size S. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/README.md:40-58] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:152-156] **observed**

**Ten: sanitize a display copy, never the value.** turnstone builds a shallow copy for printing because "the session reads back what the UI writes into the original (a denial), and policy checks use its labels, so only printing reads the copy", and it deliberately does not walk nested dicts. The plan's draw-time sanitizer has the same property; the reference's second half is the rule to keep: a sanitizer that sanitized in place would change the operator's answer. [SOURCE: specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py:119-146] **observed**

**Eleven: the outbound queue is already better than the reference's.** Forward-only states, an exclusive-flag entry created before the I/O, `unknown` never retried, the backoff ladder lifted from `policy.rs:11`, the run record's delivery entry moved with the state. The reference's outbound queue is the same shape; what it adds is *durability negotiation* (`Required`/`BestEffort`/`Disabled`, downgrading when a capability is missing) and the warning that "A capability declaration is the provider's statement, not proof of behavior". The plan's capability is a static per-channel column and has no downgrade path. Size S. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:17-40] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:130] **observed**

**Eleven: the inbound direction has no ledger.** `tinyeventqueues` runs seven stages from ingress to dispatch under one invariant — "Every ingested event ends in exactly one terminal disposition — delivered, context, digest, dead, or dropped with a reason — so nothing is lost silently" — with completion tombstones, dead letters, `ListDead`/`Redrive`, and durable state. The plan has an approval index that dedupes a repeated press and refuses an unlinked chat, a non-approver or a group conversation with a catalog reply, and no record that the event arrived, so "did my message get through" is unanswerable. Size M. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md:1-24] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md:140-142] **observed**

**Eleven: a reply is intent, not a decision.** The reference's reply parser opens "Reply parsing produces intent only, never human or execution authority", rejects a reply over 4096 bytes, maps a fixed vocabulary to `AllowOnce`/`Deny`/`Unrecognized`, and persists no text. The plan's overlay already captures the item id rather than the row index and maps `n` to deny; it has no size bound on a channel reply and no statement that the parsed value is intent. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-approval/src/reply.rs:1-18] **observed**

---

## 11. 012, 013 and 014: the rules phases

**Twelve: three scenario families the 33-row table lacks.** `cli_sigpipe.rs` is a test for a `bots` verb's first day (`bots activity | head -1` must exit 0); `composio_list_tools_stack_overflow_regression.rs` is a test named after a stack overflow on a deeply nested payload, and the plan's verbs read third-party JSON in 007, 011 and every run's tool arguments; `cost_cap_removed.rs` asserts that a *removed* feature stays removed, which the plan needs for its four deferrals (standing grants, `--demo`, browser computer, `skill accept`) so a later packet cannot reintroduce one silently. Each size S. [SOURCE: specs/system-skilled-bots/context/openhuman-full/tests/cli_sigpipe.rs:1] [SOURCE: specs/system-skilled-bots/context/openhuman-full/tests/composio_list_tools_stack_overflow_regression.rs:1] [SOURCE: specs/system-skilled-bots/context/openhuman-full/tests/cost_cap_removed.rs:1] **observed**

**Twelve: a parity fixture beats an example.** turnstone's `tests/data/memory_description_parity.json` opens with `whitespace_code_points` and thirty-three code points, so a normalisation rule cannot pass by covering the common ones; six test files (597 lines in the memory one) carry the memory contract. [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests/data/memory_description_parity.json:1-8] **observed**

**Twelve: two aggregate properties.** The reference's event pipeline ships "a property test checks that every ingested event ends exactly once, and a 10,000-event flood test checks order, thread separation and interactive latency". The plan's single uncertain send is covered; the aggregate is not. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md:22-24] **observed**

**Thirteen: a doc index an agent can read.** openhuman keeps `llms.txt` — 53 lines of `- [Title](path): one sentence of purpose` — beside its human docs, plus a 3,231-line concatenation, and its `AGENTS.md` opens with a repository map. 013 proves alignment by driving two generators' `Open findings:` lines to zero, which proves two tools agree and not that a reader can find a document. A generated one-line-per-document index, checked so every path resolves and every doc has a line, is the cheaper second proof. [SOURCE: specs/system-skilled-bots/context/openhuman-full/llms.txt:1-14] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/spec.md:154-158] **observed**

**Fourteen: a finding records what it ruled out.** openhuman's `FINDINGS-*.md` notes carry a symptom title, a "Verdict (final, backend-confirmed)" line, evidence to the byte (`exactly 182 bytes with keys details,error,errorCode,success`), the hypothesis the verdict *rejects*, and — in one of the three notes — a "Correction (second commit)" section that overturns the first reading. 014 requires a proving command per fix and neither of the other two halves, so a later reader cannot tell which guesses were wrong. [SOURCE: specs/system-skilled-bots/context/openhuman-full/FINDINGS-gemini-live.md:1-12] [SOURCE: specs/system-skilled-bots/context/openhuman-full/FINDINGS-voiceerr.md:1-14] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md:182-185] **observed**

---

## 12. Net-New: One Ranked Table

Merged across the lineage's five net-new sweeps; duplicates collapsed, one item re-sorted upward once its size was known. Sizes are T-shirt estimates from each source's own scale, and the licence column says whether the *design* is liftable.

| # | Candidate | Value | Size | Licence | Where |
|---|---|---|---|---|---|
| 1 | Per-bot `maxToolTier` (`readonly`/`write`/`execute`) enforced at dispatch, with `cron` capped at `readonly` | high | M | GPL design | f-iter009-005 |
| 2 | `bots what-if`: run a proposed action through the real deciders, one row per rung, unimplemented rungs shown as such | high | M | MIT | f-iter005-002 |
| 3 | Work handed into a thread that returns to the conversation, with the run's report written back | high | L | MIT | f-iter005-003 |
| 4 | An inbound disposition ledger for channels: one terminal disposition per event, tombstones, dead letters, redrive | high | M | GPL design | f-iter008-003 |
| 5 | An actionable "connect this app" refusal for 007's and 008's three refusals | medium-high | S | MIT | f-iter005-005 |
| 6 | A document-output path (a bot that produces a report) | medium | M | GPL design | f-iter008-005 |
| 7 | Attachment limits declared once for both ends, with a run-folder path | medium | M | MIT | f-iter005-004 |
| 8 | One wording rule for tool names across activity, items, approvals and conversations | medium | S | MIT | f-iter005-006 |
| 9 | Channel durability negotiation (`Required`/`BestEffort`/`Disabled`) | medium | S | GPL design | f-iter003-003 |
| 10 | A generated `llms.txt` doc index with a resolvable-path and one-line-per-doc check | medium | S | GPL design | f-iter007-004 |
| 11 | A per-hour command budget refused before the approval prompt | medium-high | S | GPL design | f-iter009-003 |
| 12 | Channel providers beyond the plan's five (Email, Discord, IRC only) | low | S each | GPL design | f-iter003-005 |
| 13 | Client-side-only redaction (1,540 lines + a 1,669-line test suite for a concept the plan already does server-side) | zero, cautionary | — | MIT | f-iter005-007 |

Items 1, 4 and 11 are what a small team feels in a week. Items 2 and 5 cost least and explain most. Items 6 to 10 are polish a later packet can carry. Item 13 is the one not to build: keep the redaction defence on the side that owns the data.

**Dismissed with a size, so nobody re-opens them:** `tinycomputer` (630,174 lines) and `tinybox` (159,147) because 004 declines the machine; `tinyvoice` (567,904) because the plan has no voice surface; `tinyflows` (242,273); `tinywallet` (129,856); `tinybus` (79,755) and `tinystoragedrivers` (72,569) because file stores are the simpler design the plan defends; `tinymcp` (150,644) because, despite the name, its README opens "A production-ready Rust 2024 TinyBus module template" — it is a template, not an MCP client; `tinyjuice` (636,193) left unranked because its README is a logo and a broken image link.

---

## 13. The Three Failure Classes, and Where the Plan Stands

Every unguarded failure this lineage recorded falls into one of three classes. Naming the classes is more useful than listing fifty rows, because a phase fix that closes one instance tends not to close the others.

**1. A silent no-op success.** A run reports success while doing nothing. OpenBot paid for this once and wrote the failure into its code (`routine-firing.ts`), and it is worse than a failure because nothing is reported. The plan's `until_check` catches a routine's *non-result* and not a bad turn: a firing that produces prose and no work still records `untilMetAt` if its check command exits 0.

**2. A scheduled run that acts, or waits, where it should refuse.** Cron parking on a `pay` kind (f-iter002-001) and cron being allowed write tools at all (f-iter009-002) are the same class. One origin rung before the kind rung, and one `readonly` ceiling, close both.

**3. Untrusted text reaching the model as instructions.** A skill body with invisible code points (f-iter008-001), a channel reply that could be read as a decision (f-iter001-007), and a refusal that quotes a server or secret name back into the prompt (f-iter009-004). The plan is strong against the *fourth* class that is usual in this field — secret values leaking into a prompt, where it has encoded forms, a redaction token, a withheld delivery and a failing-closed store — and thin against these three. That inversion is the most useful single conclusion this lineage reaches.

---

## 14. Licences: What Is Liftable

| Repo | Licence | What it contributes |
|---|---|---|
| OpenBot | MIT | Activity rows and groups, routine firing frame and checklist, `what-if`, orchestration, attachments, connect-prompt, tool wording |
| OpenGhost | MIT | `/name` skill parser, bounded memory with a tidy, rules engine |
| hermes-muse | MIT | Staged-write pinning for proposal review |
| OpenMausBot | Apache-2.0 (except `enterprise/`) | cron-to-sentence labels |
| rakazo | Apache-2.0 | Vault policy, leak matcher, placeholder guard |
| turnstone | Apache-2.0 | Terminal loop, typed memory model, approval card as a diff |
| buzz | Apache-2.0 | Workflow engine (declined: needs a relay and Postgres) |
| openhuman / openhuman-full | GPL-3.0-only | TUI shape, approval engine, policy, redaction, skill scan, event pipeline — design only |
| tinychannels | GPL-3.0-only | Channel contract, delivery durability, conformance kit — design only |

The design-only set is where the approval, policy, redaction and skill-scanning depth lives, and inside `openhuman-full` the wall is total: 4,379,258 `.rs` lines across 21 vendored crates, every one GPL-3.0-only. So every finding recorded from openhuman or tinychannels is a *rule set to reimplement*, never a lift, and the synthesis says so per finding. Apache-2.0 reuse keeps the licence, any NOTICE and a statement of changes; MIT keeps the copyright and permission notice. One `THIRD_PARTY_NOTICES.md` entry per lifted file with its source path covers both.

---

## 15. What the Corpus Cannot Answer

Three questions the previous research carried open and this lineage could not close, because no reference repo holds the answer:

1. **Who is the actor for a scheduled run on a shared host?** OpenBot's activity queries module names response shapes and not the SQL, and its scheduled turns are attributed to the deployment rather than to an installing person. The proposal (the installing operator pinned at install) remains untested.
2. **Does a routine migrate to a `starts` list at once?** No reference has more than one start per routine in its data model; this is a product decision, not an evidence question.
3. **How large may a memory file grow before it is compacted?** OpenGhost's crowded-at-28-of-60 is the only number in the corpus and it was chosen for a chat app's memory, not measured for a bot's.

Four searches returned nothing and are recorded as "not established" rather than as absences: a `PermissionLevel` in `tinyagents/crates` (it lives one vendor level deeper, in `tinytools`), per-agent tool filtering in rakazo (`allowedTools`/`toolAllowlist`), an actor field in OpenBot's activity queries, and an exported audit-journal bound in `tinysecurity-audit`.

---

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence |
|---|---|---|
| Treat openhuman-full as a second TUI design source | `crates/openhuman-tui` is identical in both checkouts; the 658 MB of difference is the vendored crate sources | `openhuman-full/Cargo.toml:46-47` |
| Lift any vendored crate | Every one is GPL-3.0-only; 4,379,258 lines, design only | `openhuman-full/LICENSE:1-2` |
| A per-phase readiness score | The three earlier syntheses already carry verdict tables and 014 owns scoring | `002-plan-review-research/research/research.md:45` |
| Merge the net-new ranking into the parity build order | They rank different things: planned phases versus unplanned candidates | `001-openbot-parity-research/research/research.md:137` |
| A full policy engine for 007 | Its reference is a 288k-line workspace and the plan's scope declines a rule store; the three checks fit without one | `009-skills` comparison, `iteration-009.md` |
| `--demo` as a 003 requirement | 006-hardening already rules it out and REQ-022 proves the path with a pty smoke test | `006-hardening-and-proof/spec.md:116` |
| Copy `llms-full.txt` | A concatenated corpus is a distribution format; these docs are read in place | `openhuman-full/llms.txt:1-14` |
| Findings file per review finding | Duplicates the review report; only the rejected-hypothesis and correction sections are kept | `iteration-007.md` |

---

## Divergence Map

- **Saturated directions:** none. No direction was retried to exhaustion; the frontier share was one node and it was answered in iteration 1.
- **Pivots taken:** none under the divergent mode. One voluntary pivot *within* the lineage: after the only tracked question closed, the reducer's Next Focus became a terminal sentinel, and iterations 2 to 10 applied the persona's lowest-coverage rule to choose each phase cluster. That is recorded here because it is the mechanism by which ten iterations covered fourteen phases without a tracked question.
- **Pivot failures and audited overrides:** none.
- **Remaining frontier:** F-1-003 answered (depth 1 of 3); the run-wide frontier held one node and it closed answered, with no proposals emitted — the four allowed slots were declined because the questions this node opened were breadth questions about other phases, and admitting them would have spent the remaining iterations inside openhuman-full while thirteen phases had no evidence.
- **Disagreements carried into this synthesis:** the two sanitizer semantics (filter versus replace), the two approval-card shapes (question and grant versus a diff), and whether a scheduled run should refuse or park — each is stated with the side the evidence supports rather than averaged.

---

## Open Questions

1. Does the plan want a `readonly` ceiling on scheduled runs as a *refusal*, or a downgrade that drops write tools and runs anyway? The reference refuses; a small team may prefer the downgrade.
2. Should the per-bot tool tier live on the bot definition (`maxToolTier`) or the install record (`HonoredPosture`), given that 009 already records each loaded skill body's digest in the install record?
3. How large an inbound disposition ledger may grow before it needs retention, and does its tombstone belong to the approval index or to a second file?
4. Does a skill body's supply-chain scan belong to 009 (the loader) or to 013 (the doc/author alignment), given that the scan reads text the operator authors?
5. Should the memory block be rebuilt on resume, or recorded byte-for-byte so a resumed run can prove what it read?
6. Do the three failure classes belong in 014's review dimensions, so a later review asks about them by name?

---

## Convergence Report

- Stop reason: **maxIterationsReached** (bound `stopPolicy: max-iterations`, so convergence was telemetry only; the final convergence pass returned `STOP` with `reasonDetail: maxIterationsReached`).
- Total iterations: 10.
- Questions answered: 1 of 1 tracked (the frontier node F-1-003).
- Remaining questions: 0 tracked; the six questions above are this synthesis's own.
- Findings recorded: 50 (`f-iter001-001` to `f-iter010-005`), across fourteen phases plus net-new.
- Convergence threshold: 0.05; the lineage's last ratio was 0.55, so the run ended at its budget rather than at saturation, as a `max-iterations` run should.
- Divergence summary: no divergent pivots; one within-lineage pivot of focus source, recorded in the Divergence Map.
- Phase coverage: all fourteen phases carry at least one cited finding; four carry exactly one, each for a stated reason.
- Licences: seven repos liftable, three design-only, all 21 vendored crates design-only.

---

## References

- Lineage iterations: `research/lineages/pi-1/iterations/iteration-001.md` to `iteration-010.md`
- Lineage structured findings: `research/lineages/pi-1/deltas/iter-001.jsonl` to `iter-010.jsonl`
- Lineage registry and dashboard: `research/lineages/pi-1/findings-registry.json`, `research/lineages/pi-1/deep-research-dashboard.md`
- Resource map: `research/lineages/pi-1/resource-map.md`
- Primary reference: `specs/system-skilled-bots/context/OpenBot-main/` (`shared/`, `app/src/lib/bot-lifecycle/`, `docs/routines.md`)
- Terminal reference: `specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/`, `specs/system-skilled-bots/context/turnstone-main/turnstone/cli.py`
- Trust references: `specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/`, `specs/system-skilled-bots/context/rakazo-main/packages/core/src/integrations/vault.ts`
- Skill and memory references: `specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/`, `.../tinymemory/`, `specs/system-skilled-bots/context/OpenGhost-main/skills.js`, `specs/system-skilled-bots/context/turnstone-main/docs/memory.md`
- Channel references: `specs/system-skilled-bots/context/tinychannels-main/docs/`, `specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/`
- Build plan: `specs/system-skilled-bots/003-openbot-parity-build/` (fourteen phase folders and `contracts/`)
- Earlier syntheses: `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md`, `.../002-plan-review-research/research/research.md`, `.../003-plan-depth-research/research/research.md`
- Built runtime compared: `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`

---

## Workflow Scope Record

This lineage ran as a detached fan-out worker whose entire write surface is `research/lineages/pi-1/`. Four workflow steps are therefore recorded here rather than executed, each for a stated reason:

- **`step_preinit_spec_branch` and `step_writeback_spec_findings`** would write `{spec_folder}/spec.md`, which is outside this lineage's write surface. `spec_check_result` was recorded through the gateway with `folder_state: spec-present`; no `spec.md` mutation was attempted.
- **`step_validate_post_synthesis_spec_doc`** runs `validate.sh`, which the dispatch rules forbid for this worker. It was not run; the packet's own validators are the root run's step.
- **`phase_save`** would run `generate-context.js`, likewise forbidden here. Continuity for this lineage is its own `research.md`, `iterations/`, `deltas/` and `deep-research-state.jsonl`; the root run's synthesis and save consume them.
- **`step_fanout_merge`** did not run because this lineage's config carries no `fanout` block; the root run's merge step reads the lineage artifacts in place.

Everything else in `phase_init`, `phase_main_loop` and `phase_synthesis` ran as written: ten convergence passes, ten iteration narratives, ten deltas, ten gateway-backed iteration records, ten `verify-iteration` passes (all `OK`), the reducer after every iteration, both graph upserts, the resource map, the closeout (`synthesis_complete`, `stopReason: maxIterationsReached`) and the terminal status flip.
