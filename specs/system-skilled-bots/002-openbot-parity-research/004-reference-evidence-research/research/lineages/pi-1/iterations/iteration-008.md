# Iteration 8: the rest of the vendor tree, and two guards that change 009 and 011

## Focus

Second net-new sweep: the twenty-one vendored crates under `openhuman-full/vendor/` that iterations 1 and 5 listed but did not read. Two of them turn out to hold a guard a planned phase needs rather than a candidate for a later packet — `tinyskills` for 009-skills and `tinyeventqueues` for 011-messaging-channels — and the rest are ranked or dismissed with a size.

## Actions Taken

1. Counted the tree: 21 crate directories, 15,057 `.rs` files, **4,379,258 `.rs` lines**, and a GPL-3.0-only `LICENSE` in every crate that has one. `tiny-artifacts` is the correct directory name; `tinyartifacts` does not exist.
2. Read the README of each of the thirteen crates not covered in iteration 1 or 5 (`tinyflows`, `tinyeventqueues`, `tinyskills`, `tinysearch`, `tinybus`, `tinydocs`, `tinyartifacts`, `tinyjuice`, `tinycomputer`, `tinymcp`, `tinywallet`, `tinystoragedrivers`, `tinybox`, `tinyvoice`) and sized each by its own `.rs` line count.
3. Read `tinyskills`' Capabilities list in full and `tinyeventqueues`' README pipeline section, because those two name guards no planned phase has.

## Findings

1. **009-skills — a supply-chain scan for an untrusted skill body, and the plan has none.** `tinyskills` scans skill text as untrusted input and returns `pass`/`warn`/`block`: **block** on invisible, bidi and zero-width code points, hard-coded credentials and resource paths that escape the bundle; **warn** on agent-addressed text, fetch-and-exec pipelines and undeclared MCP references; and it pairs the scan with `sanitize_catalogue_text`, "for rendering untrusted text into a prompt as data". The 003 plan's 009 loads each named `SKILL.md` body into the prompt under a byte cap, refuses a name that does not resolve, and leaves the body's bytes alone; 008's secret-literal check catches a stored value in it and nothing else. So a skill body carrying zero-width characters — invisible to the operator reviewing the file, parsed as instructions by the model — or a `curl … | sh` line reaches the prompt intact, and the phase that would catch it does not exist. This is the highest-value finding in the vendor tree for a planned phase. Licence GPL-3.0-only, so the *rule set* is the reference and no code is liftable; the block list is four checks. Size **M** (a scanner plus one refusal name each, and a test per code-point class), value **high**. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:26-49] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161-163] (observed)

2. **009-skills — the procedural guards around a skill set, not the skill's content.** The same README lists the guards a host needs once skills come from more than one place: explicit scope precedence across builtin, legacy, user, project and profile roots; opt-in `CollisionPolicy` with `TieBreak::LastWins` and excluded scopes "so root order can decide equal-scope ties"; recursive scans that reject symlinked directories and manifests; traversal-, symlink-, size- and UTF-8-safe resource reads; and an archive reader that refuses traversal, absolute or backslash paths, symlinks, hard links and nested archives while checking entry-count and expanded-size caps **before reading any content**. The plan has one source of skills — `<skilledTree>/.skilled/skills/<name>/SKILL.md` — so collisions and root precedence cannot occur yet, and the two guards that matter today are the symlink rejection and the size caps: a `SKILL.md` that is a symlink to a file outside the tree, or a body that expands past 16,384 bytes, is the same class the plan already bounds by size. Size **S** for symlink rejection and the pre-read caps, value **medium**. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:28-40] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162] (observed)

3. **011-messaging-channels — an inbound pipeline with one terminal disposition per event, and the plan has no inbound ledger.** `tinyeventqueues` runs seven stages — "ingress → normalize → gate → coalesce → salience → attention lanes → cadence / ingestion budget → dispatch" — and its contract is stated as an invariant: "Every ingested event ends in exactly one terminal disposition — delivered, context, digest, dead, or dropped with a reason — so nothing is lost silently." It keeps completion tombstones at ingress, dead letters with `ListDead`/`Redrive`, retries and backoff, and all state in storage so it survives a restart. The plan's 011 has an *outbound* queue with a forward-only state machine that is at least as rigorous, and an approval index that dedupes a repeated press; what it has no ledger for is the *inbound* direction. An event that arrives from an unlinked chat, a non-approver, a group conversation or an unknown bot is refused with a catalog reply and leaves no record that it arrived, so "did my message get through" is unanswerable, and a redelivered webhook has nothing to compare against beyond the approval index. Size **M** (an inbound row per event with its disposition, a `bots channel inbound --json` read, and a tombstone keyed by provider message id), value **high**. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md:1-24] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:130] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md:140-142] (observed)

4. **012-manual-testing-scenarios — two test properties the plan's channel chapter should borrow.** The reference's pipeline ships "a property test checks that every ingested event ends exactly once, and a 10,000-event flood test checks order, thread separation and interactive latency". Both are properties rather than examples, and both are cheap to state for the plan's queue: every queued entry reaches exactly one terminal state and never leaves `unknown` or `sending` behind, and a 10,000-entry drain preserves `at` order per conversation and answers within a bounded time. The plan's 011 acceptance criteria already cover the single uncertain send; neither covers the aggregate. Size **S** each, value **medium**. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md:22-24] (observed)

5. **Net-new: the licence closes the whole vendor tree, and the ranking that survives it.** Every crate in `vendor/` is GPL-3.0-only, the same licence as openhuman itself, across 4.38 million `.rs` lines — so the entire tree is *design reference only* and no line is liftable into this MIT build. Read that way, the ten remaining crates rank as: `tinydocs` (83,976 lines, writes `.docx`/`.pptx`, reads `.pdf`) **medium**, because "produce me a report" is a thing a small team asks a bot to do and the plan has no document output at all, size **M** as a design to copy and **0** as a dependency; `tinysearch` (87,179 lines) **medium**, because a bot that searches needs credentials and a provider the plan has no verb for, size **M**; `tinyvoice` (567,904 lines) **low**, because the plan has no voice surface and a small team types, size **XL**; `tinywallet` (129,856 lines, multi-chain address validation) **low**, size **L**; `tinybus` (79,755 lines) and `tinystoragedrivers` (72,569 lines) **low**, because the runtime's file store and JSONL queue are the simpler design the plan already defends; `tinyflows` (242,273 lines) **low**, size **XL**; `tinycomputer` (630,174 lines, "a decision-model harness for desktop and browser automation") **zero**, because 004 declines the computer and this is its largest possible form; `tinybox` (159,147 lines, a container runtime) **zero** for the same reason; `tinymcp` (150,644 lines) **zero**, and the reason is instructive — despite the name, its README opens "A production-ready Rust 2024 TinyBus module template", so it is a template for building modules, not an MCP client. `tinyjuice` (636,193 lines) is **unranked**, because its README carries a logo and no description and the crate was not opened. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/README.md:1-6] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysearch/README.md:1-6] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyvoice/README.md:1-6] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/README.md:1-6] [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/README.md:1-6] (observed)

## Ruled Out

- **Lifting any code from the vendor tree.** GPL-3.0-only across all 21 crates. Every item above is a rule set or a design, and the finding says so per item rather than once.
- **Ranking `tinycomputer` and `tinybox` as net-new candidates.** They are the two largest crates in the tree (630,174 and 159,147 lines) and both exist to give a bot a machine. 004-computer-exposure declined that, with evidence, and the parity synthesis's eliminated-alternatives row records it. Their size is the argument *against* them for a small team, not for them.
- **Treating `tinymcp` as an MCP client.** Its name promises one; its README opens "A production-ready Rust 2024 TinyBus module template used by TinyHumans AI". Recorded because a name-based search would have cited it as evidence that the reference has first-class MCP support, which it does not.
- **Closing the `tinyjuice` question by inspection.** Its README is a logo and a broken image link, and `tinyflows`' README points at tinyjuice's image, so the two are related but neither describes itself. No claim is made; a later iteration can open its crate list.

## Dead Ends

- `find … -print0 | xargs -0 wc -l | tail -1` printed `17,485 total`, which is one `xargs` batch's total rather than the tree's; the correct figure came from `… | xargs -0 cat | wc -l` (4,379,258). Recorded because the wrong number was believable and would have understated the tree by two orders of magnitude.
- `ls tinyartifacts` failed; the directory is `tiny-artifacts`. A hyphenated name is easy to lose in a list, and a later iteration should copy the name from `ls`.

## Edge Cases

- **Contradictory evidence:** none.
- **Ambiguous input:** the sweep's instruction was to rank net-new items, but findings 1 to 4 are guards for *planned* phases, not net-new. The narrow reading is taken: a guard that a phase needs is worth more than a candidate for a later packet, so it is recorded against its phase, and the net-new ranking (finding 5) covers only the crates that fit no phase.
- **Missing dependency:** `tinyjuice` is unranked for want of a description, not by judgement.
- **Partial success:** the sizes in finding 5 are estimates from line counts and READMEs, not measurements of build cost. The narrative says "size M as a design to copy and 0 as a dependency" for `tinydocs` precisely because the two numbers differ.

## Sources Consulted

- specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:1-60
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md:1-30
- specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysearch/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyvoice/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinywallet/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinybus/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinystoragedrivers/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyflows/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinybox/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/README.md:1-6
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyartifacts/README.md (absent; directory is tiny-artifacts)
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161-163
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md:140-142
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:130

## Assessment

- New information ratio: 0.92
- Questions addressed: the rest of the vendor tree, and two phase guards found inside it
- Questions answered: none tracked; carried by findings

## Reflection

- **What worked and why:** reading README capability lists rather than source. `tinyskills` and `tinyeventqueues` both publish their contracts as bullet lists with the invariant in bold or in a "Capabilities" section, so the two most valuable findings in the tree came from two files. Counting the tree first also paid: 4.38 million lines is an argument in itself, and it turned "maybe lift something" into "nothing here is liftable, rank the designs".
- **What did not work and why:** the `xargs wc -l` batch total, and `tinyartifacts`. Both are shell habits that produce plausible-looking wrong answers. The correct line count came from concatenating and counting, and the correct directory name from `ls`.
- **What I would do differently:** sweep a vendor tree by README first in *every* iteration that touches it, then descend only where a capability list names an invariant. The two phase guards would have been found in iteration 1 had that been the method, instead of at iteration 8.

## Recommended Next Focus

A consolidated ranking across all ten repos and a coverage check: enumerate the fourteen phases against the findings this lineage has produced, name the phases that still carry no cited finding (001's actor question, 013's topic index, 002's `starts` migration), and publish one ranked net-new table rather than eight separate ones.
