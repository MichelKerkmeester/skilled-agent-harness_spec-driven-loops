# Iteration 8: Phases 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review

## Focus
The three proof and alignment phases: `012-manual-testing-scenarios` (the `BOT-NNN` scenario table and the playbook), `013-skilled-and-doc-alignment` (the two alignment commands and their clean-close criteria), and `014-deep-review` (the five-lineage review, the P0/P1 closure rules and the recorded suite baseline). These are the phases where the deliverable's second question — "what does the reference have that the plan does not" — has the least to work with, so the pass tested that expectation rather than assuming it.

## Actions Taken
1. Read the requirement tables and the scenario rows of 012, the requirement rows of 013 and 014.
2. Read the plan's capability matrix and its five conformance rules, because 012's channel scenarios run on 011's fake transport.
3. Read tinychannels' conformance kit header and `ConformanceFeature` enum.
4. Searched OpenBot-main's package manifest for a documentation check.

## Findings

1. **The plan's conformance suite proves the contract at the seam and never the request a transport builds, and the reference's fixture trait exists to close exactly that gap.** The reference kit's own header states the design rule: a provider test implements `AdapterFixture` "by invoking the concrete adapter operation and reading the request and response from that provider's mocked platform", and the kit "never substitutes a synthetic transport for the provider fixture". [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:1-7] The plan's suite runs on "one object per channel name, built from that name's column of `capabilities.md` section 2", and its fixture "opens no socket and reads no token". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:33-35] Rule R4 asserts that "at least one wire observation matches the operation, the channel, the conversation the intent named" — but the observation is recorded by the fake transport at the seam. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md:28] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md:42] **Observed.** So nothing the plan specifies asserts a Telegram `sendMessage` body, a Slack `chat.postMessage` block, a Signal JSON-RPC envelope or a WhatsApp Graph URL — the wire tables of 005 and 006 are proven by citation only. A wrong header name, a body field spelled differently or a signature computed over the re-serialised body instead of the raw bytes passes every rule the plan names. For 012 this matters twice, because its channel scenarios run on the same fake transport. The fix is one fixture per transport that records the outbound HTTP request and compares it with a golden, which is a smaller job than the hole it closes.

2. **Documentation alignment is net-new: none of the ten references carries an automated docs-versus-code check, and the phase's subject is this repository's own tooling.** 013 requires a `topics.json` topic whose `terms` reach the skill docs, the README, the catalog, the playbook and the CLI help, two alignment commands that write `report.md`, `findings.json` and `fix-plan.md`, and a clean-close criterion on each report's `Open findings:` line. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:154] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:155] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:158] A search of OpenBot-main's package manifest for a documentation-check script (`markdown-link`, `link-check`, `docs:check`, `lint:docs`) returns nothing. **Observed.** The phase therefore has no reference to mirror and cannot have one: the two commands it invokes are Skilled's own, and the artefacts they write are this repository's contract. Its risk is not a missing mechanism but a missing reference point, so its acceptance criteria have to carry the whole weight — and REQ-004 does, by requiring every finding to be fixed, handed off or rebutted with a reason.

3. **The review phase is net-new as well, and its one borrowed guard is the recorded suite baseline rather than a quoted count.** 014 runs `/deep:review:auto` over phases 001 to 013 as a fan-out of five lineages and requires every P0 to be fixed with the command that proved it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:182] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:185] Its own measured-behaviour block states the rule that makes the review meaningful: the suite floor is the count the setup run records in `review/preflight.json` as `suiteBaseline`, because "a floor quoted from this block would pass a build that deleted a phase's tests". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:94] No reference in the corpus has a review loop, so there is nothing to lift; the recorded baseline is the phase's own guard, and it is the one item in the three phases that a reviewer should check is actually enforced. **Observed.**

## Ruled Out
- **Re-deriving the five conformance rules from the reference.** The plan already numbers the reference's five assertions and cites the line ranges of the reference's kit for each.
- **Comparing the plan's eight capability keys with the reference's `ConformanceFeature` enum.** The plan flattens a nested record to eight booleans and says why, and it is GPL-3.0 code either way; the count difference is not a gap.
- **Looking for a manual test script in the references.** None carries one; the closest artefact is the conformance kit, which is a library rather than a playbook.

## Dead Ends
- Searching OpenBot-main for a docs check produced one negative. A second search for a review or audit loop was not worth a call: the earlier iterations found its audit rows described as product behaviour, not as a review process.
- 012's scenario table is 30-plus rows that cite their own phases; verifying each would have repeated phase evidence this run already carries in iterations 1 to 7.

## Edge Cases
- Ambiguous input: none; the three phases name their own artefacts.
- Contradictory evidence: none. Two of three findings are clean negatives, which the deliverable asks for as explicitly as a positive.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs
- specs/system-skilled-bots/context/OpenBot-main/package.json
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/conformance-rules.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md

## Assessment
- New information ratio: 0.67
- Questions addressed: 012's proof surface, 013's and 014's reference basis.
- Questions answered: all three phases' evidence questions. 012 is answered with one real gap; 013 and 014 are answered negatively, which is the answer the deliverable needs for them.

## Reflection
- What worked and why: reading the reference kit's header comment before its checks. One sentence — "never substitutes a synthetic transport for the provider fixture" — is the whole difference between the plan's suite and the reference's, and it is stated as design intent rather than as behaviour.
- What did not work and why: expecting the three proof phases to yield reference evidence. Two of them are about this repository's own process, so the honest result is two negatives; the temptation was to manufacture a third finding from a scenario table that cites other phases.
- What I would do differently: for a proof phase, ask what the phase *fails to test* rather than what it tests. The one finding here came from that question and the other two from its absence.

## Recommended Next Focus
The net-new pass on `openhuman-full` first, as the topic instructs: its five vendored crates (`tinyagents`, `tinyconnectors`, `tinymemory`, `tinyhumans-sdk`, `tinysecurity`) and the built `openhuman-tui` crate that `openhuman-main` lacks, each sized, described and ranked against the parity synthesis's skip list.
