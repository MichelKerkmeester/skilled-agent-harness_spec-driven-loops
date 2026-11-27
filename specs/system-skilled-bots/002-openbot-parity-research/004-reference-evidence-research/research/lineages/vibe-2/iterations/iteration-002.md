# Iteration 2: Net-new and operations — what openhuman-full actually adds, and the vendor tree ranked (frontier node F-1-006)

## Focus

Frontier node F-1-006 (depth 1, scope specs/system-skilled-bots/context, specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios, specs/system-skilled-bots/003-openbot-parity-build/014-deep-review, specs/system-skilled-bots/context/buzz-main): Net-new and operations: what do the ten reference repos have that neither the 003 build plan nor the skip list of the parity synthesis covers, ranked by value to a small team, and which test corpora, failure-handling patterns and upgrade paths in those repos should feed phases 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review?

The topic says to read `openhuman-full` first because no earlier run studied it and because it "carries five vendored crates ... and a built openhuman-tui crate that openhuman-main lacks". This iteration tests that premise against the tree before ranking anything, because a wrong premise would mis-rank the whole net-new answer.

## Actions Taken

1. Counted files and Rust lines per crate in `openhuman-full/crates/` and per directory in `openhuman-full/vendor/`.
2. Diffed the top-level directory inventory and the per-directory file counts of `openhuman-main` against `openhuman-full`.
3. Read the first lines of all twenty vendor `README.md` files to fix what each crate is.
4. Read `openhuman-tui/src/activity.rs`, `src/theme.rs` and the module list, and compared them with the plan's 003 scope.
5. Read the plan's 003 scope, 012 scenario inventory and the parity synthesis skip list to separate net-new from already-covered.

## Findings

1. **Net-new — the premise is wrong on the count: `openhuman-full` vendors twenty-one crates, not five.** The vendor tree holds `tiny-artifacts`, `tinyagents`, `tinybox`, `tinybus`, `tinychannels`, `tinycomputer`, `tinyconnectors`, `tinydocs`, `tinyeventqueues`, `tinyflows`, `tinyhosts`, `tinyhumans-sdk`, `tinyjuice`, `tinymcp`, `tinymemory`, `tinysearch`, `tinysecurity`, `tinyskills`, `tinystoragedrivers`, `tinyvoice` and `tinywallet`. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinybus/README.md:1] *(observed, by directory listing)* The five the topic names are a subset. This matters because the net-new answer is not five crates to weigh but twenty-one, and the ranking below is what makes that tractable.

2. **Net-new — `openhuman-full` differs from `openhuman-main` by the vendor tree and nothing else.** `openhuman-full` holds 29,050 files against `openhuman-main`'s 7,718, and the whole difference is `vendor/`: 21,332 files in `openhuman-full`, zero in `openhuman-main`. Every other top-level directory carries the identical count in both trees — `crates/` 4,497, `app/` 2,197, `scripts/` 432, `tests/` 217, `docs/` 209, `packages/` 42, `fastlane/` 16. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/Cargo.toml:1] *(observed)* So the only thing a run gains by reading `openhuman-full` is the vendor tree. Reading it for anything else is reading `openhuman-main` twice.

3. **Net-new — `openhuman-tui` is in both trees, so the topic's second premise is also wrong.** `openhuman-main/crates/openhuman-tui/src/theme.rs` exists, and the plan's own 003 already cites it. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:88] *(observed)* What `openhuman-full` adds is a *built* artifact, not a crate: `openhuman-full.build.log` ends `Finished dev profile [unoptimized + debuginfo] target(s) in 4m 33s` after `openhuman-tui (bin "openhuman-tui") generated 1 warning`. [SOURCE: specs/system-skilled-bots/context/openhuman-full.build.log:1] *(observed)* The build log is the only evidence in either tree that the TUI compiles, and it is worth one line in 014's review checklist rather than a phase of its own.

4. **Net-new — every one of the twenty-one vendor crates is GPL-3.0, so the whole tree is read-only design evidence.** The workspace manifest fixes `license = "GPL-3.0-only"` [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:35] and each crate carries the GPL-3.0 text [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tiny-artifacts/LICENSE:1] *(observed)*. The plan's 003 already reaches the right conclusion for the wrong reason — it says "no third-party code is copied, so there is nothing to notice" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:118] *(observed)*, when the reason is that the reference is GPL-3.0 and copying it would relicense the crate. This is the single most important net-new finding: the answer to "what do the ten repos have that the plan misses" is twenty-one crates that may be read and never lifted.

5. **003 — the TUI's activity model is six states, and the plan's seven groups are the better fit.** `Status` is `Running`, `Success`, `Error`, `Waiting`, `Cancelled`, `Unknown`, with labels `running`, `done`, `failed`, `needs input`, `cancelled`, `stale` and one marker glyph each. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity.rs:7-36] *(observed)* The plan's 001 groups rows under OpenBot's seven ids. The two disagree on `stale`: openhuman makes it a run state, the plan makes it a property of the index, and the plan's 003 header already reads a staleness flag separately. The evidence supports the plan. What is worth mirroring is the marker table, because a six-glyph table with a distinct marker per state is what makes a snapshot test assert a state rather than a sentence.

6. **003 — the sanitizer the plan specifies differs from the reference in one decision worth recording.** `safe_text` keeps every character except a control character, and keeps `\n`. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/theme.rs:88-93] *(observed)* The plan's `theme::printable` *replaces* control characters rather than dropping them [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:247] *(observed)*. Replacing is the better choice for a snapshot test, because a dropped character changes the display width silently while a replacement keeps the cell count stable. The plan is right and does not say why; 014 should record the reason so a later reviewer does not "simplify" it back to a drop.

7. **009 — `tinyskills` is the one vendor crate whose subject the plan has and whose implementation it lacks.** It is "a host-independent Rust library for agentskills.io-style skill bundles" that parses them. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:1] *(observed)* 237 Rust files, 78,138 lines. The plan's 009 injects a `skills:` list body at a position and refuses `skills-over-budget`; it has no bundle parser and no name grammar. Value to a small team: **high**, size **M** — the parse rules are the part 009 needs and the injection is the part it already has. Read for the grammar, lift nothing.

8. **011 — `tinychannels` is a full multi-channel runtime, far past what 011 needs.** 731 Rust files, 273,669 lines. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinychannels/README.md:1] *(observed)* The plan's 011 is a link roster, an answer gate and a send queue over a fake transport. Value: **low**, size **XL**. The one idea worth taking is that the channel layer is a module behind a bus rather than a branch in the runner.

9. **Net-new — `tinyeventqueues` is the highest-value crate the plan has no counterpart for.** It is "external event management and queuing ... a TinyBus module that receives noisy inbound events". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md:1] *(observed)* 262 Rust files, 89,431 lines. The plan's only queue is 011's *outbound* send queue; nothing dedupes or orders an *inbound* event, and 002's cron and 011's channel both produce inbound events. Value to a small team: **high**, size **M**. This is the one net-new item worth a phase.

10. **Net-new — `tinydocs` is the only document-output path in any of the ten repos.** It writes `.docx` and `.pptx` and reads them back. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/README.md:1] *(observed)* 226 Rust files, 83,976 lines. No 003 phase produces a document; a bot that must hand a person a file has no verb for it. Value: **medium**, size **M**.

11. **Net-new — `tinybus` is the architectural idea behind the whole vendor tree and the plan has no bus.** It is "a zbus-style message bus that keeps external integrations out of the OpenHuman kernel's dependency". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinybus/README.md:1] *(observed)* 172 Rust files, 79,755 lines. The plan's runtime calls its integrations directly. Value: **medium**, size **L** — worth recording as the reason the twenty-one crates exist, not worth building.

12. **Net-new — six crates are out of scope by the skip list or by the plan's own deferral, and should be recorded as such rather than re-examined.** `tinyconnectors` is "OAuth connector integrations" [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyconnectors/README.md:1], which the skip list already rules out; `tinybox` is "a workspace containerization runtime" [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinybox/README.md:1], also skipped; `tinycomputer` is "a decision model (Jev) based harness for desktop and browser automation" [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/README.md:1], which 004 does not do; `tinyhosts` puts "a Next.js application ... on a real hosting provider" [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyhosts/README.md:1]; `tinyhumans-sdk` is "a Rust client for the public TinyHumans backend API" [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyhumans-sdk/README.md:1]; and `tinymcp` is "a production-ready Rust 2024 TinyBus module template" [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/README.md:1] *(all observed)*. Value: **none** for each, size **S** to record and **XL** to build.

13. **Net-new — `tinywallet` is the one crate that is a liability rather than a candidate.** It is "agent-friendly multi-chain wallet primitives". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinywallet/README.md:1] *(observed)* 420 Rust files, 129,856 lines. The plan's 006 defers "pay" to a later packet, so a wallet is a payment surface with no approval rung above it. Value: **negative**, and 014 should name it as a thing the plan is right to omit.

14. **012 — the test corpus to mirror is one `*_tests.rs` beside every module, not a scenario file per behaviour.** `openhuman-tui/src/` holds `account_tests.rs`, `actions_tests.rs`, `app_tests.rs`, `browser_login_tests.rs`, `cockpit_tests.rs`, `composer_tests.rs`, `controls_tests.rs`, `crash_reporting_tests.rs`, `demo_tests.rs`, `effects_tests.rs`, `event_view_tests.rs` and `input_tests.rs`, each beside the module it tests. [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity_tests.rs:1] *(observed)* The plan's 012 is 33 scenario files keyed by behaviour id. The two are complementary: the plan's scenarios prove a verb end to end, and a per-module test file is what keeps a module's own edge cases from being reachable only through the CLI. 012 should add the second shape for the 003 crate, which is the one place the plan builds a module with internal state.

15. **013 and 014 — the upgrade path the plan lacks is a feature-forwarding check.** `openhuman-tui/Cargo.toml` states that "every gate forwards to `openhuman-rpc` alone (chain: core -> embed -> tinyhumans -> rpc -> app/cli/tui); `scripts/ci/check-feature-forwarding.mjs` checks the link", and that the default set "used to arrive implicitly through a bare workspace `openhuman-core` dependency, which turned on the core's whole `default`". [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/Cargo.toml:9-18] *(observed)* That is a real upgrade failure — a feature set that silently widened because a dependency was declared bare — with a script that catches it. The plan's 003 pins a toolchain and runs `cargo clippy` and `cargo test` and has no equivalent check. 013 should own the doc line and 014 the check.

## Ruled Out

- **Reading `openhuman-full` for anything but `vendor/`.** The per-directory counts are identical to `openhuman-main`, so a second read of `crates/`, `app/` or `docs/` in the full tree returns the same bytes. Recorded as finding 2.
- **Treating the vendor tree as a lift source.** All twenty-one crates are GPL-3.0. Recorded as finding 4.
- **Ranking `tinyvoice`, `tinyjuice`, `tinysearch` and `tinystoragedrivers` as candidates.** Voice (1,937 files), juice (2,158 files), web search (232 files) and storage drivers (330 files) each solve a problem the plan does not have: a terminal client, a model gateway, a UTCP-named search server and a SQLite index. Named here so a later iteration does not re-open them.

## Dead Ends

- `openhuman-main/vendor/` — does not exist. Do not look for the vendor tree in the `-main` tree again.
- The topic's "five vendored crates" — a subset of twenty-one. Do not carry the number forward into the synthesis.

## Edge Cases

- Ambiguous input: the topic's premise about `openhuman-full` is factually wrong on both counts. Selected interpretation: test the premise, record the correction as findings 1 to 3, and rank the real tree. Deferred: nothing — the correction is complete.
- Contradictory evidence: the topic says `openhuman-main` lacks `openhuman-tui`; the tree has it at `crates/openhuman-tui/src/theme.rs` and the plan already cites it. Resolved in favour of the tree, with the build log as the only thing `openhuman-full` adds.
- Missing dependencies: `vendor/tiny-artifacts` has no `README.md`, so its purpose is unstated in the tree. Fallback: its `LICENSE` and file count. Confidence impact: its ranking rests on size alone.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/openhuman-full/Cargo.toml:1-40
- specs/system-skilled-bots/context/openhuman-full.build.log:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinybus/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/Cargo.toml:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tiny-artifacts/LICENSE:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinychannels/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyconnectors/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinybox/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinycomputer/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyhosts/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyhumans-sdk/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/README.md:1
- specs/system-skilled-bots/context/openhuman-full/vendor/tinywallet/README.md:1
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/Cargo.toml:1-25
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity.rs:1-45
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/theme.rs:88-93
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity_tests.rs:1
- specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/theme.rs:88
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:101-135,237-247
- specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:134-180
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:163-170

## Assessment

- New information ratio: 0.93
- Questions addressed: the F-1-006 question in part — the net-new inventory and its ranking, and the 012/013/014 operational patterns. The `buzz-main` half of the node's scope is not yet read.
- Questions answered: what `openhuman-full` adds over `openhuman-main` (the vendor tree, twenty-one crates, all GPL-3.0); the ranked net-new list; the test-corpus and upgrade-path patterns for 012, 013 and 014.

## Reflection

- What worked and why: testing the topic's premise before ranking anything. A per-directory file count is one command and it turned a plausible premise into three citable corrections, which is worth more than any single crate's README.
- What did not work and why: reading the vendor `README.md` files one at a time gave a purpose per crate but no ranking signal, because a README states what a crate is and never what it costs. The Rust file and line counts are what made the ranking possible.
- What I would do differently: count first, read second. The file counts would have told me `tinyvoice` and `tinyjuice` were out of scope before I read their READMEs.

## Recommended Next Focus

Finish F-1-006 on `buzz-main`, which the node's scope names and this iteration did not reach, and on the 014 review checklist. The specific next reads are `buzz-main/ARCHITECTURE.md` and `buzz-main/CONTEXT.md` for the failure-handling and upgrade patterns, and `buzz-main/crates/` for a test corpus. The open question this iteration leaves is whether `tinyeventqueues` deserves a phase of its own or a section in 011; the evidence for a phase is that the plan has no inbound queue at all, and the evidence against is that 011's send queue is the only queue the plan's surfaces need.
