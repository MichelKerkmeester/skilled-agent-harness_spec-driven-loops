# Iteration 1: cli-external-orchestration and cli-classifier hubs with their mode packets

## Focus

Stage one of the lead steer's split: the two CLI-facing hubs and every mode packet inside them. The iteration inventories each routing mechanism, counts where one decision is restated, measures where the copies disagree, and records which enforcement surfaces read them. Readability passages are quoted for the later synthesis.

## Actions Taken

- Read `cli-external-orchestration/SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json`, `graph-metadata.json`, `leaf-manifest.json`, `benchmark/README.md`.
- Read all seven mode packet routing sections and the two that were quoted in full (`cli-devin`, `cli-hermes`).
- Read `cli-classifier/SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json`, `graph-metadata.json`, and `cli-jev/SKILL.md`.
- Read `system-spec-kit/references/cli/shared-smart-router.md`, the helper reference every CLI mode defers to.
- Ran a read-only Node comparison of registry aliases, `hub-router` vocabulary classes and `ROUTER.md` `INTENT_SIGNALS` to measure drift rather than assert it.

## Findings

1. `cli-external-orchestration` restates executor vocabulary in four separate machine-readable places: `mode-registry.json` aliases (12/5/6/5/6/9/8 phrases per mode at lines 37, 74, 104, 135, 165, 196, 230), `hub-router.json` `vocabularyClasses` (13/7/7/5/9/10/9 alias keywords plus a dispatch class, from line 104), `ROUTER.md` `INTENT_SIGNALS` (10/11/11/10/11/9/10 keywords, line 93), and each packet's `<!-- Keywords: -->` comment (for example `cli-devin/SKILL.md:8`). A read-only set comparison found 6 registry aliases missing from `ROUTER.md` for `cli-opencode` (for example "parallel opencode session", "in-opencode parallel session") and 8 `ROUTER.md` keywords missing from the registry for `cli-devin` (for example "swe-2 dispatch", "devin cloud session"). [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:104] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:37] [SOURCE: .skilled/skills/cli-external-orchestration/ROUTER.md:93]

2. Stage-two leaf routing has three disagreeing definitions per mode. `ROUTER.md` says every mode's first slice is `references/cli-reference.md` plus `references/integration-patterns.md` (lines 103-132). `cli-devin/SKILL.md` says the ALWAYS slice is `references/cli-reference.md` plus `assets/prompt-quality-card.md` (line 86) while its `RESOURCE_MAP` sends GENERATION to `references/cli-reference.md` plus `assets/prompt-templates.md` (line 112). `cli-hermes/SKILL.md` repeats the same split (ALWAYS at line 93, `RESOURCE_MAP` at line 117). Three documents, three answers to "what loads first". [SOURCE: .skilled/skills/cli-external-orchestration/ROUTER.md:103] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:86] [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:93]

3. All seven mode packets carry a complete Python router (`INTENT_SIGNALS`, `RESOURCE_MAP`, `LOADING_LEVELS`, `UNKNOWN_FALLBACK_CHECKLIST`) and restate the same six-step call sequence; only the helper bodies are shared. `cli-devin/SKILL.md:92-148` is representative: the dictionaries are inline and the call sequence is six numbered steps. The shared reference those packets point at still describes "the six cli-* sibling skills" and lists six providers, omitting `cli-hermes`, which defers to it at `cli-hermes/SKILL.md:101`. [SOURCE: .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:17] [SOURCE: .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:139] [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:101]

4. `cli-classifier` restates the Jev vocabulary four times and its hub router contradicts the packet's own baseline. `mode-registry.json` has 9 aliases (line 36); `hub-router.json` has a 9-keyword `cli-jev-aliases` class and a 17-keyword `jev-dispatch` class (lines 24, 37); `ROUTER.md` has four intent lists of 10/8/7/4 keywords (line 58); `cli-jev/SKILL.md` repeats them again in `INTENT_MODEL` (line 117). The hub router declares `DEFAULT_RESOURCE = []` and "no hub-wide preamble" (`ROUTER.md:51-54`), while the packet declares `DEFAULT_RESOURCES` with two always-loaded files (`cli-jev/SKILL.md:115`) — the same routing decision, two incompatible statements. [SOURCE: .skilled/skills/cli-classifier/hub-router.json:24] [SOURCE: .skilled/skills/cli-classifier/ROUTER.md:54] [SOURCE: .skilled/skills/cli-classifier/cli-jev/SKILL.md:115]

5. The advisor's stage-one input duplicates the same phrases a fifth time. `cli-external-orchestration/graph-metadata.json` holds 73 `intent_signals` (line 63) and 87 `derived.trigger_phrases` (line 139); `description.json` adds its own keyword list (line 6); `cli-classifier/graph-metadata.json` holds 33 `intent_signals` (line 32) drawn from the same Jev phrases as the router. A phrase added to one list does not propagate to the others, and the comparison in finding 1 shows the drift already exists. [SOURCE: .skilled/skills/cli-external-orchestration/graph-metadata.json:63] [SOURCE: .skilled/skills/cli-external-orchestration/graph-metadata.json:139] [SOURCE: .skilled/skills/cli-classifier/graph-metadata.json:32]

6. The enforcement surface that reads `ROUTER.md` is the leaf manifest, not the benchmark. `leaf-manifest.json` enumerates `modes[].leaves` from the packets, so a `RESOURCE_MAP` path must resolve and be registered; `ROUTER.md` itself says the block is what "the deterministic router-replay parses" (line 48). The benchmark claim in `SKILL.md:76` ("the deterministic router-replay and benchmarks parse") is stale: `benchmark/README.md` states the Lane C harness, runner and scoring contract were removed and no new run can start. The prose advertises an enforcement that no longer runs. [SOURCE: .skilled/skills/cli-external-orchestration/leaf-manifest.json:1] [SOURCE: .skilled/skills/cli-external-orchestration/ROUTER.md:48] [SOURCE: .skilled/skills/cli-external-orchestration/benchmark/README.md:20]

7. Readability: routing prose comes before the instructions in both hubs and is written in long compound sentences. `cli-external-orchestration/SKILL.md` has 27 lines over 200 characters, the longest 779 characters at line 76: "Stage 2 of routing lives in `ROUTER.md` at the hub root, next to `SKILL.md` and `README.md`. It defines the per-mode leaf-intent model (every mode in `mode-registry.json`, plus the deliberate absence: a bare CLI-dispatch phrase that names no executor fires no intent and defers at the hub), the machine-readable `DEFAULT_RESOURCE` / `INTENT_SIGNALS` / `RESOURCE_MAP` block that the deterministic router-replay and benchmarks parse, and the how-to-read rules (dominant intent → one leaf set; near-tied intents → deduped union, the `orderedBundle` outcome; no keyword match → hub `defer`, never a silent default to `cli-opencode`)." `cli-devin/SKILL.md` has 47 lines over 200 characters, the longest 1,397 at line 333, a single numbered rule carrying a persona-injection contract, a roster path, a fallback mechanism and an exceptions clause. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:76] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:333]

## Questions Answered

None fully answered. Findings 1-4 and 7 advance question 1, findings 3 and 6 advance question 2, and finding 7 supplies question 4 evidence for these two hubs.

## Questions Remaining

All five strategy questions remain open; the verdict and plan questions need every assigned skill before they can be answered.

## Ruled Out

- Treating `benchmark/reports/**` as live enforcement. The reports are frozen archives from an older worktree and the harness is retired (`benchmark/README.md:20`), so they are evidence of past behaviour only.
- Treating the mode packets' `INTENT_SIGNALS` as a duplicate of the hub's. They encode a different decision (task intent inside one executor), so the duplicate is the leaf mapping, not the intent names.

## Dead Ends

- Counting "keyword triggers" lines as a routing decision: the CLI packets have none; their triggers live in the `<!-- Keywords: -->` comment, which no parser in this iteration was found to read.

## Edge Cases

- Ambiguous input: the steer assigns "every mode packet" inside the hubs; the iteration read all seven routing sections but only two packets in full. Depth is marked by citation.
- Contradictory evidence: `ROUTER.md` says no always-loaded preamble; `cli-jev` declares one. Both are recorded rather than reconciled.
- Missing dependencies: none.
- Partial success: none; all reads completed.

## Sources Consulted

- `.skilled/skills/cli-external-orchestration/SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`, `benchmark/README.md`
- `.skilled/skills/cli-external-orchestration/cli-{opencode,claude-code,codex,cursor,devin,pi,hermes}/SKILL.md`
- `.skilled/skills/cli-classifier/SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `description.json`
- `.skilled/skills/cli-classifier/cli-jev/SKILL.md`
- `.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md`

## Assessment

- New information ratio: 0.9
- Questions addressed: 1, 2, 4 (partially)
- Questions answered: none fully

## Reflection

- What worked and why: a scripted set comparison turned "the lists look duplicated" into exact missing-phrase counts, which is the difference between a hunch and a finding.
- What did not work and why: the benchmark report files are enormous and embed historical skill text; reading them whole wastes budget. The README states the retirement in 20 lines.
- What I would do differently: read the `benchmark/README.md` before any report file.

## Recommended Next Focus

Iteration 2: `mcp-tooling` and `mcp-code-mode`, with the same four surfaces — hub router JSON, hub `ROUTER.md`, per-mode packet blocks, and advisor graph metadata.
