# Iteration 9: Net-new from `openhuman-full` — the vendored crates

## Focus
The net-new pass on `openhuman-full`, as the topic instructs. The premise in the topic is that this tree carries five vendored crates (`tinyagents`, `tinyconnectors`, `tinymemory`, `tinyhumans-sdk`, `tinysecurity`) and a built `openhuman-tui` crate that `openhuman-main` lacks. This iteration measured that premise before ranking anything, and both halves of it turned out to be wrong in ways that change what the ranking should cover.

## Actions Taken
1. Listed `openhuman-full`'s workspace members and `vendor/`.
2. Sized every vendored crate by Rust file count and line count, and read each `Cargo.toml` description.
3. Compared the `crates/` list of `openhuman-full` against `openhuman-main`, including `crates/openhuman-tui` in both.
4. Read the module header of the seven crates whose purpose could change a phase: `tinyjuice`, `tinyskills`, `tinymcp`, `tinyeventqueues`, `tinydocs`, `tinysearch`, `tiny-artifacts`.

## Findings

1. **The tree carries twenty-one vendored crates totalling about 4.38 million lines of Rust, not five, and both trees already have the TUI crate.** `openhuman-full/Cargo.toml` lists `"vendor"` among the workspace members alongside `crates/openhuman-tinyhumans`. [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:21-25] `vendor/` holds `tiny-artifacts`, `tinyagents`, `tinybox`, `tinybus`, `tinychannels`, `tinycomputer`, `tinyconnectors`, `tinydocs`, `tinyeventqueues`, `tinyflows`, `tinyhosts`, `tinyhumans-sdk`, `tinyjuice`, `tinymcp`, `tinymemory`, `tinysearch`, `tinysecurity`, `tinyskills`, `tinystoragedrivers`, `tinyvoice` and `tinywallet`, a directory listing of `vendor/` read on 2026-11-27. [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:25] The five the topic names are the small end of the tree: `tinyhumans-sdk` is 13,407 lines and `tinyartifacts` 6,720, while `tinycomputer` is 630,174 and `tinyjuice` 636,193. And `crates/openhuman-tui` exists in both trees — `openhuman-main/crates/openhuman-tui` and `openhuman-full/crates/openhuman-tui` — so "a built `openhuman-tui` crate that `openhuman-main` lacks" is false as stated: both have the crate, and what `openhuman-full` has is a workspace whose path dependencies resolve, which is why it was the one that built. **Observed.** The correction matters for the ranking below: ranking only the five named crates would have missed every large one.

2. **`tinyeventqueues` is the highest-value net-new mechanism for this build: a durable inbound event queue that filters noise before an agent runs.** Its header is explicit: it will "durably queue noisy inbound events and filter them the way a person filters noise, before they reach an agent", with events arriving from "chat channels (web chat, Telegram, Discord, Slack), connector triggers (X replies through Composio), webhooks". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/src/lib.rs:1-4] The build plan has an outbound queue (011's `channel-queue.ts`) and an inbound dedupe record, but no inbound queue: a channel message becomes an `enqueueRequest` immediately. So every message a bot's chat receives costs a run. **Observed.** Size: 89,431 lines, 262 files, GPL-3.0 — mirror only. Value to a small team: high, because run cost is dominated by inbound volume and the plan's only lever is the roster.

3. **`tinyskills` carries deterministic discovery and a collision-precedence rule for skill bundles, neither of which 009 has.** The crate "owns the host-independent parts of skill handling: document parsing (YAML for discovery, `parse_flat` for documents a host stores and re-serves), metadata, deterministic discovery, collision precedence, safe" — the header continues past that line. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/src/lib.rs:1-6] 009's model is a declared `skills:` list read from one tree, with a name grammar to be added (iteration 7, finding 1) and no precedence rule between two skills that resolve to the same name. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160] **Observed.** Size: 78,138 lines, 237 files, GPL-3.0 — mirror only. Value: medium. Collision precedence is the part worth copying, because a `.skilled/skills/<name>` in a checkout and a same-named one in a user tree is exactly the failure a discovery model creates.

4. **`tinyjuice` is the alternative to the plan's refuse-at-budget policy, and it is the largest single mechanism in the tree.** "Pluggable token compression for OpenHuman and other Rust hosts. TinyJuice owns the reusable TokenJuice compression engine. Hosts provide configuration mapping, optional ML callbacks, savings attribution, and their own RPC/tool surfaces." [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/src/lib.rs:1-5] The plan's answer to an over-budget prompt is a refusal with a name, and its overflow rule drops the oldest conversation message. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162] **Observed.** Size: 636,193 lines, 2,158 files, GPL-3.0 — mirror only, and far too large to reimplement. Value: high in principle, low in practice: a small team cannot build a compression engine, and the cheap approximation is the plan's own caps. Recorded so the ranking is honest about the difference between valuable and reachable.

5. **`tinymcp` is a different MCP model from 007's static filter: it dials servers and browses registries rather than narrowing one config file.** It is "a Model Context Protocol client, packaged as an installable `TinyBus` module… This crate knows how to *talk to* MCP servers. It dials them over Streamable HTTP or as a subprocess, browses the upstream registries, keeps track of what…" [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/src/lib.rs:1-6] 007 writes a per-run `.utcp_config.json` holding only the servers a bot declared and explicitly calls itself "a filter, not a sandbox". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:105] **Observed.** Size: 150,644 lines, 436 files, GPL-3.0 — mirror only. Value: medium — registry browsing and a health check per server are the parts a small team would want, and both are cheaper than the crate.

6. **`tinydocs` turns a validated document spec into office-format bytes, which no phase covers.** Its header: "Agent-friendly document synthesis and text extraction in Rust… turns a typed, validated document spec into real office-format bytes… the spec types are the JSON tool schema, validation rejects a malformed spec with a structured `Error::InvalidInput` naming the exact field". [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/src/lib.rs:1-6] **Observed.** Size: 83,976 lines, 226 files, GPL-3.0 — mirror only. Value: medium for a team whose bots produce reports; the pattern worth mirroring is validating a spec before writing bytes, which is the same discipline the plan applies to records.

## The ranking

Sizes are Rust line counts from the vendored trees; every crate is GPL-3.0 under `openhuman-full/LICENSE`, so "lift" means mirror the mechanism, never copy a line.

| Rank | Crate | Lines | Value to a small team | Why |
|------|-------|-------|----------------------|-----|
| 1 | `tinyeventqueues` | 89,431 | High | The only inbound-noise filter in the corpus; the plan wakes a run per message |
| 2 | `tinyjuice` | 636,193 | High in principle, unreachable | Refusing at the budget is the cheap stand-in for compression |
| 3 | `tinymcp` | 150,644 | Medium-high | Server health checks and registry browsing beyond a static config filter |
| 4 | `tinydocs` | 83,976 | Medium | Document output and extraction, a capability no phase has |
| 5 | `tinyskills` | 78,138 | Medium | Deterministic discovery and collision precedence for skill bundles |
| 6 | `tinymemory` | 99,763 | Medium | A memory crate against 005's one-line-entry file; its eviction policy is the comparison |
| 7 | `tinysecurity` | 288,030 | Low-medium | 008's vault is already stricter than the reference's (iteration 6) |
| 8 | `tinyflows` | 242,273 | Low | Workflow orchestration duplicates the routing the runtime already owns |
| 9 | `tinysearch` | 87,179 | Low | A transport-free wire contract with no host inside it |
| 10 | `tinywallet` | 129,856 | Low | Multi-chain payments; 006 has a `pay` kind and no wallet need |
| 11 | `tinyartifacts` | 6,720 | Low | Smallest crate; artifact bookkeeping the run folder already does |
| 12 | `tinyagents` | 510,260 | None | A whole harness; this repository already has one |
| 13 | `tinybox` | 159,147 | None | Sandboxing a CLI host already delegates to the executor |
| 14 | `tinycomputer` | 630,174 | None | The computer surface the parity synthesis excludes |
| 15 | `tinyvoice` | 567,904 | None | Voice, out of scope |
| 16 | `tinybus` | 79,755 | None | Module bus for a Rust host; no analogue here |
| 17 | `tinyconnectors` | 113,104 | None | The connector host `tinymcp` and `tinyeventqueues` sit on |
| 18 | `tinyhosts` | 67,066 | None | Deployment of Next.js apps and databases, outside the skip list's scope and outside this build's |
| 19 | `tinystoragedrivers` | 72,569 | None | Storage drivers for a Rust service |
| 20 | `tinychannels` | 273,669 | None (already counted) | The same crate family as `tinychannels-main`, which 011 already mirrors |
| 21 | `tinyhumans-sdk` | 13,407 | None | SDK for a hosted backend this build does not use |

## Ruled Out
- **Ranking only the five crates the topic names.** The measurement in finding 1 makes that set the smallest end of the tree; the ranking above covers all twenty-one.
- **Reading `tinyartifacts`.** The directory is `tiny-artifacts` and the crate is 6,720 lines; its value is below the resolution of this ranking.
- **Reading `tinycomputer` and `tinyvoice`.** Both are excluded surfaces in the parity synthesis, and their sizes settle the ranking without reading them.

## Dead Ends
- `tinyagents`'s internal `vendor/tinytools` is patched into the workspace through three `[patch]` entries; [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:50-64] the redirection is a build detail with no product value.
- No crate in the tree is permissively licensed; the licence check is one file for all twenty-one.

## Edge Cases
- Ambiguous input: the topic's "five vendored crates" and "a built `openhuman-tui` crate that `openhuman-main` lacks". Both resolved by measurement and corrected in finding 1.
- Contradictory evidence: the topic's premise against the tree. The tree wins; recorded rather than smoothed over.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none — but the ranking's value column is judgement, and the size column is measurement. The next iteration carries the cross-repo net-new pass that this one deliberately left out.

## Sources Consulted
- specs/system-skilled-bots/context/openhuman-full/Cargo.toml
- specs/system-skilled-bots/context/openhuman-full/vendor (all twenty-one crate directories, sized by file and line count)
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyjuice/src/lib.rs
- specs/system-skilled-bots/context/openhuman-full/vendor/tinydocs/src/lib.rs
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/src/lib.rs
- specs/system-skilled-bots/context/openhuman-full/vendor/tinymcp/src/lib.rs
- specs/system-skilled-bots/context/openhuman-full/vendor/tinyeventqueues/src/lib.rs
- specs/system-skilled-bots/context/openhuman-full/vendor/tinysearch/src/lib.rs
- specs/system-skilled-bots/context/openhuman-main/crates
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md

## Assessment
- New information ratio: 1.00
- Questions addressed: the net-new question for `openhuman-full`, and the topic's own premise about that tree.
- Questions answered: the ranking, with sizes; and the premise correction, which is the more useful of the two.

## Reflection
- What worked and why: measuring before ranking. One `find | wc -l` loop over `vendor/` turned "five crates" into twenty-one and 4.38 million lines, which changed the whole answer. A ranking built on the topic's list would have been confidently wrong.
- What did not work and why: reading crate headers one at a time. Seven crates have `src/lib.rs` and fourteen use `crates/<name>/src/lib.rs`, so the first pass returned two headers and three empties; a `find -name lib.rs` per crate fixed it.
- What I would do differently: for a vendored tree, always print the size table first. It is one call and it decides what is worth reading.

## Recommended Next Focus
The cross-repo net-new pass: the remaining eight repositories against the parity synthesis's skip list — `hermes-muse`, `turnstone`, `buzz`, `rakazo`, `OpenGhost`, `OpenMausBot`, `tinychannels` and `openhuman-main` — each capability sized, ranked and checked against the skip list, with the licences from iteration 3 attached.
