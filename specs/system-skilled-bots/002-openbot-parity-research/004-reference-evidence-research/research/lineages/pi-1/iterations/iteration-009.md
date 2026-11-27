# Iteration 9: 007-per-bot-apps, and the tool-level gate the reference has and the plan does not

## Focus

007-per-bot-apps, the last of the fourteen phases with no cited finding of its own. Its plan narrows the *server* list a run's config names and says plainly that "`apps` is a filter, not a sandbox". The reference's policy crate gates the *tool call* instead, and it does so with three inputs and a privilege ladder. This iteration reads that gate for what 007 could adopt without building a policy engine.

## Actions Taken

1. Read the plan side: `007-per-bot-apps/spec.md` REQ-001 to REQ-008 and its scope boundary, plus the checks `bots` has today for a run's declared servers.
2. Read `tinysecurity-policy/src/host_tool.rs` (admission inputs, `cron_refuses`, the budget comment) and `tinytools/src/permission/types.rs` (the `PermissionLevel` ladder and the caller's declared maximum), then confirmed `DenialReason::ScheduledReadOnly` in `tinysecurity-bus`.
3. Cross-checked the coverage table: this iteration's findings give 007 its first cited evidence, so all fourteen phases now carry at least one.

## Findings

1. **007-per-bot-apps.** The reference gates a tool call on a five-step privilege ladder — `None = 0`, `ReadOnly = 1`, `Write = 2`, `Execute = 3`, `Dangerous = 4` — where "a caller (a chat channel, a scheduled job, a sub-agent) can declare a maximum level; a tool whose required level exceeds it is rejected before any argument is parsed", and the ordering is declared load-bearing because enforcement compares with `<`. The plan has no per-run maximum: `apps:` decides which servers exist for the run, and a server that is allowed keeps every tool it offers. The reference's shape is the cheap half of a policy engine — one integer per tool, one maximum per caller, one comparison — and it needs no rule store. Size **S** for the ladder and the check, **M** if every built-in tool has to be classified. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:19-26] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs:1-30] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:40] (observed)

2. **007-per-bot-apps and 002-routine-layer — a scheduled run may not act at all.** The reference's admission checks open with a rule of its own: `cron_refuses` returns `DenialReason::ScheduledReadOnly` whenever the caller's origin is `Cron` and the tool "acts", and its doc comment states it as a sentence — "A scheduled turn runs read-only tools only, whatever the autonomy tier." The plan has no origin-based tool rule: a routine that declares an `apps:` list of write-capable servers is allowed them, and a scheduled run's only guard is the needs-you gate when a question carries an action kind. That is one rung later than the reference, and it produces the failure the previous iteration's finding named from the other side: a scheduled run parks on a `pay` kind at 03:00 and holds the bot. A read-only ceiling for `cron` refuses before the run instead of after it. Size **S**, and it is the single cheapest hardening in this phase. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:19-26] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-bus/src/policy.rs:307] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:164-176] (observed)

3. **007-per-bot-apps.** The reference's third admission input is a registered command scope carrying "the subject's autonomy tier and hourly budget", and the budget is refused before a human is asked: the code comment says "A spent budget refuses the run that would follow, so a human is not asked first". The plan's bounds are per run — a child timeout and the posture matrix — and no phase carries a per-hour ceiling, so a bot with a buggy loop can spend an operator's whole hourly allowance in one approved run. A count in the runtime's state root and one refusal name is the whole mechanism. Size **S**, value **medium-high** for anyone paying per token. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:1-10] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:95] (observed)

4. **007-per-bot-apps and 008-vault.** Every refusal in the reference is "a typed `DenialReason` the host renders for the model; no reason carries a payload". That is a rule about what a *model* may see, and it is the one place the plan's refusal design differs in kind rather than in degree: the plan's refusals are operator-facing names on stderr (`apps-unknown-server`, `secret-unknown`, `apps-refused`) with the detail naming every unknown name, and nothing states what the *child* is told when its tool is refused. A refusal that quotes the unknown server name, or the secret name, back into the model's context is a small leak of the operator's configuration into a prompt — and 008's whole design is that a value never reaches a prompt. Size **S**: one typed reason enum, and a rule that the model-facing text names the kind and never the name. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:1-10] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:165-175] (observed, plan gap inferred)

5. **Net-new candidate, ranked high: a per-bot tool ceiling.** Taken together, findings 1 to 3 describe one small feature the plan does not have: `maxToolTier: readonly|write|execute` on a bot definition, enforced at dispatch by refusing a tool whose declared level exceeds it, with `cron` runs capped at `readonly` regardless. It is the tool-level complement to `apps:`'s server-level filter, it needs no rule store, and it answers "what can this bot do" in one word where the current answer is a list of server names. Value **high**, size **M**. It belongs to 007 as an addition and to a later packet as a build, and it is the strongest single item this lineage can hand the next planner. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:19-26] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs:18-30] (inferred from the two citations)

## Ruled Out

- **Proposing a full policy engine for 007.** The reference's `tinysecurity-policy` is a 288k-line workspace whose engine folds three inputs into one verdict and whose bus carries a versioned contract; the plan's own scope boundary declines a rule store, and findings 1 to 3 are the three checks that fit without one.
- **Reading `rakazo-main` for per-agent tool filtering.** A grep for `allowedTools`, `toolAllowlist` and `enabledTools` over its `packages/core/src` returned no file, so rakazo does not carry the pattern; the search is recorded rather than repeated.
- **Treating the permission ladder as a 009-skills item.** A skill declares `allowed-tools` in its frontmatter (the reference parses it as "scalar or sequence"), but the skill's declaration is a *claim about the skill*, not a ceiling on the caller, and 009's own caps already bound what a skill can inject. The ceiling belongs to the bot.

## Dead Ends

- The first grep for `PermissionLevel` over `vendor/tinyagents/crates` returned nothing, and the type turned out to live one level deeper, in `vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs` — a *vendored crate inside a vendored crate*. Recorded because it explains why iteration 1's search came up empty and why a vendor tree needs a recursive search rather than a `crates/*/src/*.rs` glob.
- A first draft of finding 1 carried the cite path through a `vendor/../crates` segment, which is both wrong and unreadable; it was replaced with the plain path before the iteration was recorded. Recorded because a SOURCE tag that resolves through `..` can still resolve, so a broken path is easy to leave in place.

## Edge Cases

- **Contradictory evidence:** none. The plan's `apps` filter and the reference's tool gate are complements, not rivals, and the narrative says which one answers which question.
- **Ambiguous input:** none. 007 was the only phase without a finding and the topic names it explicitly.
- **Missing dependency:** none.
- **Partial success:** finding 5 is a synthesis of findings 1 to 3 rather than new external evidence, and it is marked `inferred`; the three observed facts stand on their own.

## Sources Consulted

- specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:1-26,95
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/tinysecurity-bus/src/policy.rs:307
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs:1-40
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:40,164-176

## Assessment

- New information ratio: 0.85
- Questions addressed: 007-per-bot-apps, completing per-phase coverage
- Questions answered: none tracked; all fourteen phases now carry at least one finding

## Reflection

- **What worked and why:** reading the reference's admission function's *doc comment* before its body. Three lines there name the three inputs and the sentence "whatever the autonomy tier", which is the whole of findings 2 and 3; the body only confirmed them. This is the third iteration in a row where a doc comment carried the finding, which is now a reliable method rather than a lucky habit.
- **What did not work and why:** expecting `PermissionLevel` in `tinyagents/crates` when it lives in `tinyagents/vendor/tinytools`. A vendor tree can be two levels deep, and the `crates/*/src/*.rs` glob silently misses it.
- **What I would do differently:** for every 007-style question, ask "what gates the call" rather than "what filters the config". The plan's answer was a config filter and the reference's was a call gate, and the difference was invisible until the admission function was read.

## Recommended Next Focus

The consolidation iteration: one ranked net-new table across every candidate this lineage has produced, a per-phase coverage table with the finding ids behind it, and the three questions the reference corpus cannot answer (who the actor is for a scheduled run, whether `starts` migrates to a list, and how large a memory file may grow before compaction).
