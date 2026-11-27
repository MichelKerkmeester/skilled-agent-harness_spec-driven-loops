# Iteration 9: Net-new sweep across the five unread repos and the licence table

## Focus

The topic's second question: what the ten repos have that neither the build plan nor the section-13 skip list covers, ranked by value to a small team with its size. Five of the ten had no iteration read them — `rakazo-main`, `OpenMausBot-main`, `OpenGhost-main`, `hermes-muse-main` and `turnstone-main` — and no iteration had built the licence table the topic's first question needs. This iteration reads all five at their entry points and sweeps all ten licences.

## Actions Taken

1. Listed the top level of all five unread repos and read each `LICENSE`'s first lines.
2. Read `turnstone-main/eval_skill_adherence.json` and `HYPOTHESIS.md`'s opening.
3. Read `OpenMausBot-main/evals/README.md` in full and counted the harness.
4. Read `hermes-muse-main/plugin.yaml` in full.
5. Grepped the whole 003 build plan for any eval concept and for a routine deferral.

## Findings

1. **Net-new, rank 1 — a three-tier offline behaviour eval harness.** OpenMausBot's `evals/` states its principle: "evaluate the harness, never the models. A scripted engine replays deterministic turns (tool calls, text, refusals) from a plan file; no external API is called; a run is hermetic and repeatable." [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:5] *(observed)* Tier 1 is a scenario fixture declaring a `world`, the `bots` to create with their scripted `turns`, optional gate names, `steps` that drive the real server and `assertions` checked against frozen evidence; tier 2 replays a redacted real thread against committed trace baselines; tier 3 is an opt-in live-model smoke. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:19-33] *(observed)* The scorers are pure: "pure assertion evaluation against the frozen snapshot; scorers never touch a server". [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:27] *(observed)* The harness is 81 files and 464K with 6 scenarios, and it runs as a vitest gate as well as a CLI. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:11-16] *(observed)* The 003 plan has no eval concept at all: a grep for `behavioural eval`, `eval harness`, `skill adherence` and `tool-choice` across all fourteen phases returns nothing. *(observed)* This is the highest-value net-new in the run, because it is the only way to test that a bot does the right thing without calling a model, and the plan's 381 tests all call modules directly. **Size: M** (81 files, 464K, 6 scenarios).

2. **Net-new, rank 2 — a skill-adherence eval, the cheapest form of the same idea.** turnstone's `eval_skill_adherence.json` gives each case a `skill` with a `name` and `content`, a `user_prompt`, `expected_actions` as a list of `{tool}`, `match_mode: "ordered_subset"`, `max_turns` and a default `n_runs: 3`. [SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:1-20] *(observed)* That is a behavioural test of a skill: does loading it make the agent call the tool it names? The plan's 009 validates a skill's shape and never its effect. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160-173] *(observed)* At 56 lines it is the smallest artifact in this iteration with a real guarantee behind it. **Size: S.**

3. **Net-new, rank 3 — a plugin manifest that declares its tools and its hook subscriptions.** `hermes-muse-main/plugin.yaml` carries `manifest_version: 2`, `kind: standalone`, `requires_hermes: ">=0.22.3"`, `provides_tools: [muse_manage, muse_job]` and `provides_hooks: [pre_llm_call, post_llm_call, pre_tool_call, post_tool_call]`. [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/plugin.yaml:1-14] *(observed)* The plan's 009 has skills as markdown with frontmatter and no plugin manifest, no declared tool list and no hook subscription. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160] *(observed)* A manifest that names its tools and its hooks is how a third party adds a capability without forking, and the four hook points are the extension surface the plan has no analogue for. **Size: S** (14 lines).

4. **002 — the reference stamps a deferred routine and the plan has no deferral concept.** OpenMausBot pins the behaviour: "a routine due behind a busy target is stamped `deferredAt` while staying queued, then dispatches and completes when the target frees." [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:41] *(observed)* The plan's 002 has no `deferredAt` field and no busy-target rule; its only occurrence of the word is the P1 priority label "complete OR user-approved deferral". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:175] *(observed)* This belongs to 002 rather than net-new, because 002 owns routines, and it is the one phase finding this iteration adds.

5. **Net-new, rank 4 — the licence table, which decides what a builder may copy.** Seven of the ten repos are permissive and three are GPL-3.0: OpenBot MIT, OpenGhost MIT, hermes-muse MIT, OpenMausBot Apache-2.0, rakazo Apache-2.0, turnstone Apache-2.0, buzz Apache-2.0, and openhuman-main, openhuman-full and tinychannels-main all GPL-3.0. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/buzz-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2] *(observed)* The GPL surface is three repos and not one, and it includes `tinychannels`, whose approval surface the plan's 011 mirrors most closely. The build spec's §14 reuse rule names MIT and Apache-2.0 only. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:84] *(observed)* **Size: S** (a table), and it is the input 013's missing licence gate needs.

6. **Net-new, rank 5 — a formal harness definition that justifies the plan's refusal split.** turnstone's `HYPOTHESIS.md` argues that "the rejection symbol is really *two*: the parse failure ⊥_Y that M_W can emit ... is distinct from the authorization rejection ⊥_A that γ can return ... collapsing them onto one ⊥ hides a proposal that parsed-and-was-refused behind one that never parsed." [SOURCE: specs/system-skilled-bots/context/turnstone-main/HYPOTHESIS.md:14] *(observed)* The plan already splits them: `proposal-stale` and `proposal-secret` are distinct refusals. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:164,173] *(observed)* Confirmation, and the reference's framing is the reason the split matters rather than a rule to lift. **Size: L** (a long formal document), value low for a builder and high as a justification.

7. **Net-new, rank 6 — a static HTML preview per proposed feature.** OpenMausBot keeps `cancel-plan-preview.html`, `cloud-buy-preview.html`, `computer-ask-preview.html`, `devices-preview.html` and `handoff-preview.html` at the repository root. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/] *(observed)* That is a design-review artifact a non-engineer can open before the feature is built, where the plan's 010 carries `design/mockups.md` with text frames. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md:17] *(observed)* **Size: S** per preview, and the value is that it needs no build step.

8. **Net-new, rank 7 — four READMEs in four languages.** rakazo ships `README.md`, `README.ja.md`, `README.th-TH.md` and `README.zh-CN.md` beside a `lingui.config.ts`. [SOURCE: specs/system-skilled-bots/context/rakazo-main/] *(observed)* The plan has one README and no i18n. **Size: S**, value low for a small team that writes English docs, and it is the only repo of the ten with a translation discipline.

9. **Net-new, caution — a flat 350-file root with no `src/`.** `OpenGhost-main` holds 350 files with roughly forty `.js` modules at the repository root — `add-button.js`, `agent-line.js`, `approval-card.js`, `chat-store.js`, `browser-panel.js` and so on — and no source directory. [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/] *(observed)* That is the failure mode the plan's 013 doc-alignment phase exists to prevent, and it is the one repo of the ten with no directory discipline. Record it as a caution and lift nothing from its layout. **Size: S** to describe, and the cost of the layout is the whole repo.

## Ruled Out

- **`turnstone-main/HYPOTHESIS.md` as a rule source.** It is a formal definition, not a rule set, and the one rule it yields — split parse failure from authorization rejection — the plan already follows. Recorded as finding 6.
- **`rakazo-main`'s i18n as a lift.** The plan writes English docs for one team. Recorded as finding 8.
- **`OpenGhost-main`'s layout as anything but a caution.** Recorded as finding 9.
- **`OpenMausBot-main/enterprise/` and `connector/`.** Both are covered by the section-13 skip list's enterprise-roles and connector-catalogue rows, so they are cited and not repeated. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:88-95]

## Dead Ends

- `rakazo-main` beyond its licence and its README set — 6,365 files of a multi-tenant web app whose tenancy the skip list already excludes. Do not read it again.
- `OpenMausBot-main` beyond `evals/` — 9,637 files of a desktop and cloud product whose desktop and cloud surfaces the plan excludes. `evals/` is the one transferable part.
- `hermes-muse-main` beyond `plugin.yaml` — 125 files of a companion plugin whose goals and notices the plan's 002 and 010 already cover.

## Edge Cases

- Ambiguous input: none. The topic's second question names the ranking and the size, and both are given per finding.
- Contradictory evidence: none. The licence sweep agrees with iteration 1's finding that tinysecurity is GPL-3.0, since it is vendored in a GPL-3.0 tree.
- Missing dependencies: `OpenMausBot-main/evals/scenarios/` holds 6 fixtures and only the README's summary of each was read, so the assertion vocabulary is known from prose rather than from a fixture. Fallback: the README's scenario-anatomy paragraph. Confidence impact: the assertion kinds are observed from the README, not from a fixture file.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:1-45
- specs/system-skilled-bots/context/OpenMausBot-main/ (top level)
- specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:1-20
- specs/system-skilled-bots/context/turnstone-main/HYPOTHESIS.md:1-20
- specs/system-skilled-bots/context/hermes-muse-main/plugin.yaml:1-14
- specs/system-skilled-bots/context/rakazo-main/ (top level)
- specs/system-skilled-bots/context/OpenGhost-main/ (top level)
- specs/system-skilled-bots/context/OpenBot-main/LICENSE:1
- specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1
- specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1
- specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:1
- specs/system-skilled-bots/context/rakazo-main/LICENSE:1
- specs/system-skilled-bots/context/turnstone-main/LICENSE:1
- specs/system-skilled-bots/context/buzz-main/LICENSE:1
- specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2
- specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:175
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160-173
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/001-chat-ux-and-pane-map/design/mockups.md:17
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:84,88-95

## Assessment

- New information ratio: 0.94
- Questions addressed: the topic's second question, and the licence half of its first question.
- Questions answered: the eval harness, the skill-adherence eval, the plugin manifest, the licence table, the harness definition, the HTML previews, the i18n set and the flat-root caution; plus 002's missing deferral stamp.

## Reflection

- What worked and why: reading each unread repo's *entry point* rather than its source. Five repos, five top-level listings and five READMEs, and the two highest-value findings in the run came from a 45-line README and a 56-line JSON file. A repo's entry point states what its authors thought was worth proving.
- What did not work and why: the first pass at `rakazo-main` and `OpenMausBot-main` looked for feature code and found 6,365 and 9,637 files of a product the skip list already excludes. The transferable part was one directory in each, and finding it needed the top-level listing rather than a search.
- What I would do differently: for a net-new sweep, list every repo's top level first and rank the directories by whether the plan has an analogue, before reading any file.

## Recommended Next Focus

The cross-phase synthesis: the net-new ranking table with sizes, the licence table as a section, and the gap closure across all fourteen phases. Iterations 4 to 9 covered 001, 002, 004, 005, 009, 010, 011, 012, 013 and 014; 003-terminal-screen and 006-approval-grants were covered by iterations 1 and 3 through the trust lens rather than the phase lens, and 007-per-bot-apps and 008-vault were covered by iteration 3's depth pass. The open question this iteration leaves is whether the eval harness is a new phase or a child of 014, since 014 is the phase that reviews the built surface and an eval harness is a review instrument.
