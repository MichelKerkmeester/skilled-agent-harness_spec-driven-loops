# Iteration 10: Net-new across the remaining eight repositories

## Focus
The cross-repo net-new pass: what `hermes-muse`, `turnstone`, `buzz`, `rakazo`, `OpenGhost`, `OpenMausBot`, `tinychannels` and `openhuman-main` carry that neither the build plan nor the parity synthesis's skip list covers. Each item is ranked by value to a small team and sized. The licences from iteration 3 apply: hermes-muse and OpenGhost are MIT, turnstone, buzz, rakazo and OpenMausBot are Apache-2.0, tinychannels and openhuman are GPL-3.0.

## Actions Taken
1. Surveyed the top-level shape of `hermes-muse`, `OpenGhost` and `turnstone`.
2. Surveyed `buzz`'s crate layout and `rakazo`'s package list.
3. Read `turnstone`'s skill-adherence eval file and located its scoring implementation.
4. Read `hermes-muse`'s `plugin.yaml` and its `health_entry.py`.
5. Checked each candidate against the parity synthesis's skip list and against the fourteen phase folders.

## Findings

1. **turnstone ships a declarative eval harness for skill adherence, and the plan has no mechanism that tests whether a bot obeys a skill.** `eval_skill_adherence.json` is a 56-line suite of cases, each naming a skill, its content, a user prompt, `expected_actions` and a `match_mode` of `ordered_subset`, with `n_runs: 3` as the default repeat count. [SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:1-20] The scoring lives in the package's own eval module and is covered by two test files, including one for scoring itself. [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests/test_scoring.py:1] 009 loads a skill body into the prompt and caps its size, and 012's scenarios assert CLI behaviour; neither asserts that a model given a skill *used* it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161] **Observed.** Size: 56 lines of data plus one scoring module inside a 1,378-file repository. Value: high, and unusually cheap — the case format is the whole design, and a host that already records run tool calls can score an `ordered_subset` assertion over them.

2. **hermes-muse's health check is a scheduled probe whose empty output is silence, and the plan's routines fire bots but nothing probes the host.** The plugin's `health_entry.py` is eleven lines with a docstring that states the contract exactly: "Called only by the native `muse-health` no_agent Cron launcher; stdout is delivered, empty is silent." [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/health_entry.py:1-11] **Observed.** Size: 11 lines of entry point plus a `hermes_muse.health` module, in a 125-file plugin. Value: high for a host that runs unattended — 002's routines schedule a bot's work and 014 reviews a build, but nothing on a schedule asks "is this host healthy, and if it is, say nothing". The "empty is silent" rule is the part worth copying: it composes with the notification-fatigue discipline the reference keeps trying to teach (OpenBot posts once on a first failure, 002 defers that).

3. **A second repository declares per-call hooks in a manifest, which corroborates iteration 7's finding that the hooks engine has no owning phase.** `plugin.yaml` declares `provides_hooks: [pre_llm_call, post_llm_call, pre_tool_call, post_tool_call]` beside `provides_tools: [muse_manage, muse_job]`, under `manifest_version: 2`. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/plugin.yaml:1-12] OpenGhost's `rules.js` implements the same family as fifteen event types. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/rules.js:19-37] **Observed.** Two of ten repositories independently implement per-call hooks, and the build plan's fourteen phases name no owner for them (iteration 7, finding 2). This raises that item's rank: the mechanism is not one project's idiosyncrasy.

4. **The plugin manifest itself is net-new: a portable declaration of what a package provides, where the plan has one BOT.md per bot and no package unit.** `plugin.yaml` carries `manifest_version`, `name`, `version`, `description`, `license`, `homepage`, `kind: standalone`, `requires_hermes`, `tags`, `provides_tools` and `provides_hooks`. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/plugin.yaml:1-12] **Observed.** Size: 12 lines of YAML. Value: medium. It is the only packaging contract in the corpus, and the case for it here is that a skill plus a hook plus a tool set is a distributable unit; the plan distributes bots through a checked-in `bots/` folder instead, which is simpler and is the right call for one repository. Recorded because it is the shape a later distribution step would need.

5. **The remaining repositories add nothing the skip list does not already answer, and their sizes settle it.** `buzz` is a Rust platform whose workspace members include `buzz-relay`, `buzz-core` and `buzz-conformance` beside an `admin-web` folder and a desktop shell — the relay, admin and desktop surfaces the skip list covers, with two exceptions taken as findings 6 and 7. [SOURCE: specs/system-skilled-bots/context/buzz-main/Cargo.toml:1-7] `rakazo`'s package list is `adapter-kit`, `adapters`, `auth`, `chat-ui`, `contracts`, `core`, `db`, `i18n`, `logging`, `memory`, `page-kit`, `testkit`, `ui-tokens` and `ui-web` — a multi-tenant app whose memory and vault the plan already mirrors, and whose auth and DB are skipped. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/contracts/package.json:1] `OpenMausBot`'s distinctive folders are `relay`, `companion`, `devices`, `apps`, `skills` and `announcements`; mobile and the shared-host relay are skipped, and its connector-scope hint was already taken in iteration 6. `tinychannels` is 011's source and `openhuman-main` is iteration 9's. **Observed (lists) / inferred (the verdict).**

6. **`buzz` carries an information-flow-control crate that blocks a leak before it happens, where the plan's only defence is a post-run scan.** `ifc-core` is "generic information-flow control over reader-set confidentiality labels", with a `ConfidentialityLabel` that is `restricted(universe, readers)`, `restricted_to(universe, reader)` or `public(universe)`, a `FlowState` that accumulates what a session has observed, and an `EgressError` for a send that would widen the reader set. [SOURCE: specs/system-skilled-bots/context/buzz-main/crates/ifc-core/src/lib.rs:1-18] [SOURCE: specs/system-skilled-bots/context/buzz-main/Cargo.toml:2-7] The plan's equivalent is retrospective: after the child exits, the runner scans its stdout and the run folder for known secret values and withholds the delivery. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:168] **Observed.** Size: one crate in a 7,184-file repository. Value: high, and it is the only mechanism in the corpus that addresses the *multi-channel* version of the problem — a bot that read a private chat and replies into a public one leaks by audience, not by secret literal, and no scan can find that.

7. **A second `buzz` crate verifies a runtime trace against a formal spec instead of asserting that a model passed.** `buzz-conformance` is a "runtime trace schema + independent replay checker" for the repository's TLA+ relay spec, with the north star stated in its own header: "don't ask 'did the model pass'; ask 'did the running code emit a trace the model accepts'". [SOURCE: specs/system-skilled-bots/context/buzz-main/crates/buzz-conformance/src/lib.rs:1-8] **Observed.** Size: one crate. Value: medium — the plan's proof phases (012, 014) assert CLI behaviour and acceptance criteria, and a trace-plus-replay checker is a heavier discipline than a small team will adopt; the transferable idea is the trace *schema*, which is cheap and makes a replay test possible later.

## The net-new ranking

| Rank | Item | Source | Licence | Size | Value |
|------|------|--------|---------|------|-------|
| 1 | Reader-set information-flow control | buzz `crates/ifc-core` | Apache-2.0 | one crate in a 7,184-file repo | High: blocks an audience leak that no output scan can find |
| 2 | Per-call hooks (`pre_llm_call`, `pre_tool_call`, `post_tool_call`) | OpenGhost `rules.js`, hermes-muse `plugin.yaml` | MIT | 703 lines of engine; a declared list in a 12-line manifest | High: two independent implementations, no owning phase |
| 3 | Skill-adherence eval suite | turnstone `eval_skill_adherence.json` and its eval module | Apache-2.0 | 56 lines of data plus one scoring module in a 1,378-file repo | High: tests obedience, not size |
| 4 | Silent-when-healthy scheduled probe | hermes-muse `health_entry.py` | MIT | 11-line entry point plus a health module in a 125-file plugin | High: an unattended host has no other health signal |
| 5 | Inbound event queue with noise filtering | openhuman-full `tinyeventqueues` (iteration 9) | GPL-3.0 | 89,431 lines | High: the only inbound lever the plan lacks |
| 6 | Deduplicated proactive notices | hermes-muse manifest description, OpenBot `docs/routines.md` | MIT | Behaviour, tens of lines | Medium-high: 002 defers the first-failure notice |
| 7 | Connector scope hint | OpenMausBot `server/connector-scope-hint.ts` (iteration 6) | Apache-2.0 | ~130 lines plus tests | Medium-high: names the scope and forbids the retry |
| 8 | Portable plugin manifest | hermes-muse `plugin.yaml` | MIT | 12 lines | Medium: the shape a distribution step needs |
| 9 | Deterministic skill discovery and collision precedence | openhuman-full `tinyskills` (iteration 9) | GPL-3.0 | 78,138 lines | Medium: 009 has no collision rule |
| 10 | Document output and extraction | openhuman-full `tinydocs` (iteration 9) | GPL-3.0 | 83,976 lines | Medium: no phase covers it |
| 11 | MCP server health and registry browsing | openhuman-full `tinymcp` (iteration 9) | GPL-3.0 | 150,644 lines | Medium: 007's filter is static |
| 12 | Runtime trace schema with replay checking | buzz `crates/buzz-conformance` | Apache-2.0 | one crate | Medium: heavier than the proof phases need, but the schema is cheap |
| 13 | Token compression | openhuman-full `tinyjuice` (iteration 9) | GPL-3.0 | 636,193 lines | Valuable, unreachable |
| 14 | Adapter kit and test kit as packages | rakazo `adapter-kit`, `testkit` | Apache-2.0 | two of fourteen packages | Low: 011's fake transport and fixtures already do this |

Ranking rule, stated so a reader can disagree with it: value is what a small team with one host and no operator on call would feel in the first month; size is what it would cost to mirror the mechanism, not to build it.

## Ruled Out
- **`buzz`'s admin surface, `rakazo`'s auth and DB, `OpenMausBot`'s relay and devices.** Every one is named in the parity synthesis's skip list, and their sizes are platform-sized.
- **Re-reading `hermes-muse`'s skills folder.** It is a companion's prompt skills, which the plan already handles as skill bodies.
- **Treating `OpenMausBot`'s `announcements` folder as a new capability.** It is a notification surface, and iteration 6 already took the discipline worth having from the reference.

## Dead Ends
- `buzz`'s benchmarks and `HYPOTHESIS.md`/`lint_hypothesis.py` in turnstone are interesting process artefacts and no capability; not ranked.
- A full read of `turnstone`'s eval module was not needed: the case format and the two scoring tests establish both the mechanism and that it is tested.

## Edge Cases
- Ambiguous input: "net-new" could mean "new to the plan" or "new to the corpus". Read as new to both, which is what the topic's section 2 asks.
- Contradictory evidence: none. Iteration 9's finding 1 corrected the topic's premise, and this iteration builds on the corrected set.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json
- specs/system-skilled-bots/context/turnstone-main/tests/test_scoring.py
- specs/system-skilled-bots/context/hermes-muse-main/plugin.yaml
- specs/system-skilled-bots/context/hermes-muse-main/health_entry.py
- specs/system-skilled-bots/context/OpenGhost-main/rules.js
- specs/system-skilled-bots/context/buzz-main/Cargo.toml
- specs/system-skilled-bots/context/buzz-main/crates/ifc-core/src/lib.rs
- specs/system-skilled-bots/context/buzz-main/crates/buzz-conformance/src/lib.rs
- specs/system-skilled-bots/context/rakazo-main/packages/contracts/package.json
- specs/system-skilled-bots/context/OpenMausBot-main/server/connector-scope-hint.ts
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md

## Assessment
- New information ratio: 0.92
- Questions addressed: the net-new question for the remaining eight repositories, and the ranking the topic's section 2 asks for.
- Questions answered: the ranking, with sizes and licences. Six items are new here (information-flow control, the eval suite, the health probe, the plugin manifest, deduplicated notices and the trace schema), one corroborates iteration 7's hook finding, and the rest are carried from iterations 6 and 9 with their ranks.

## Reflection
- What worked and why: reading manifests and data files rather than source. `plugin.yaml` and `eval_skill_adherence.json` are 12 and 56 lines and each names a mechanism the plan lacks; the same information from source would have cost two orders of magnitude more reading.
- What did not work and why: the first survey pass over `OpenGhost` returned 20 flat JavaScript files, which read as a desktop app rather than a framework. It took iteration 7's `rules.js` read to know that the folder's flatness hid a 703-line engine; a directory listing is not a capability inventory.
- What I would do differently: for the last net-new pass, start from the earlier iterations' ruled-out lists rather than from a fresh survey. Half the candidates here had already been seen and settled.

## Recommended Next Focus
Synthesis. Every one of the fourteen phases now has an evidence pass, the net-new question is answered from all ten repositories, and the remaining work in this lineage is the synthesis document and its terminal record.
