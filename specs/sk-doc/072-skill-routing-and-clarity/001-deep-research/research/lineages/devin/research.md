# Skill Routing Shape and Doc Clarity — Devin Lineage Research

**Lineage:** `devin` (fan-out sibling of `pi`) · **Session:** `fanout-devin-1793168730352-knacf5` · **Iterations:** 5 of 5 · **Stop reason:** maxIterationsReached · **Scope:** the three CLI/MCP hubs, their mode packets, seven standalone skills, and the command, agent, mirror and generator surfaces that teach routing. Read-only: no file outside this lineage was changed.

---

## 1. Executive Summary

Routing in this repository is not one mechanism repeated too often. It is four genuinely different decisions — which hub, which mode, which first leaf slice, which task-intent leaf — and each is written down in two to five places. The problem is that the copies are not generated from one another, so they drift, and some of the copies are not read by anything at runtime.

The live shape is already the advisor hybrid: `graph-metadata.json` decides the hub, `hub-router.json` decides the mode, the hub-root `ROUTER.md` decides the first leaf slice, and `leaf-manifest.json` plus `leaf-aliases.json` type the result. `router-reach` couples stage one to stage two and is the check that makes `ROUTER.md` load-bearing. Pure JSON-only fails because `router-reach` reads `ROUTER.md` as its stage-two vocabulary. A per-mode `ROUTER.md` is unavailable under the Class H contract and invisible to the same check.

The measurable drift is concentrated in executor vocabulary: 6 of 12 `cli-opencode` registry aliases are absent from `ROUTER.md`, 8 `cli-devin` router phrases are absent from the registry, and `mcp-obsidian` has 26 registry aliases against 13 router keywords — including four families (health, Iconic, Excalidraw, Minimal theme) that stage one routes and stage two cannot serve. Two real router defects were found in `system-skill-advisor`: its discovery roots use underscores where the directories use hyphens, and one intent maps to a leaf that is not in its own manifest.

Readability is a second, independent problem. Routing occupies 11-60% of each assigned file (mean 34%), and the two largest roots put roughly 60% of the file before the first instruction. The longest single lines run 2,195, 1,988, 1,397 and 1,249 characters.

The recommended order is: fix correctness without changing shape; consolidate vocabulary behind `hub-router.json`; restructure the mode packets' prose and move machine blocks to appendices; run the readability pass; regenerate every derived surface and run the full gate. Rollback is per-phase and file-level until Phase 2, then generator-level.

---

## 2. Scope, Method, and Evidence Standard

**Owned by this lineage (lead steer `steer.md`):**

- Hubs: `cli-external-orchestration`, `mcp-tooling`, `cli-classifier`, with every mode packet inside them.
- Standalone skills: `cli-orca`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `sk-vision`, `system-skill-advisor`, `system-spec-kit`.
- Surfaces: `.skilled/commands/` and `.skilled/agents/` docs that teach routing; the runtime mirrors and their generators; `graph-metadata.json` stage-one inputs; `system-spec-kit/references/cli/shared-smart-router.md` and its deferrers.

**Owned by the sibling lineage, cited here only as prior evidence:** `sk-code`, `sk-doc`, `sk-design`, `system-deep-loop`, and the parent-skill, router-sync, router-replay, compiled-route and `package_skill` tooling. Where this report relies on the prior advisor report rather than a file read in this lineage, it says so.

**Evidence standard.** Every finding cites `path:line` read in this lineage. No enforcement script was executed: the checks below are cited from their contracts and `SYNC.md` manifests, not from a run. Counts of aliases and keywords were produced by read-only Node comparisons over the checked-in JSON and `ROUTER.md` files. Anything not read is marked inferred.

**Run integrity note.** Two workflow-level deviations are recorded rather than hidden. First, the append gateway's `deep_research.iteration_completed` ledger schema stores `status`, `rawNewInfoRatio`, `trustedEvidenceYield`, `outputDigest`, `ruledOutApproachRefs` and `nextFocusCausationId`; the projected `deep-research-state.jsonl` therefore does not carry `findingsCount`, `focus`, `answeredQuestions` or the route-proof fields, although each one-record event handed to the gateway did. The per-iteration `deltas/iter-NNN.jsonl` files retain them, and the fan-out merge reads the deltas. Second, the reducer's `--fanout-resource-map-only` emission ignored `--artifact-dir` and wrote the parent packet's `research/resource-map.md`; that out-of-lineage write is documented in `iterations/iteration-005.md` under `## SCOPE VIOLATIONS`, and this lineage carries its own `resource-map.md` generated from its finding sources.

---

## 3. Fleet Map and Class Contract

The fleet is exactly seven Class H hubs and seven Class S standalone roots, and this lineage's ten skills split 3 H / 7 S.

| Class | Discriminator | Roots |
|---|---|---|
| **H** — packet hub | declares both `mode-registry.json` and `hub-router.json` | `cli-classifier`, `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `system-deep-loop` |
| **S** — standalone routed-resource skill | declares neither | `cli-orca`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `sk-vision`, `system-skill-advisor`, `system-spec-kit` |

For Class S, `description.json`, `mode-registry.json`, `hub-router.json` and `command-metadata.json` are **forbidden**; `leaf-manifest.config.json` is required; `leaf-manifest.json` and `leaf-aliases.json` are generated. `ROUTER.md` is deliberately outside classification — it is a hub-root markdown companion, never a leaf and never a class discriminator. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:40] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:47] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62]

This contract is the single most important fact for the verdicts: it removes two of the four candidate shapes for standalone skills before any prose argument begins.

---

## 4. Routing Mechanisms per Skill (question a)

### 4.1 `cli-external-orchestration` (H)

| Decision | Mechanism | Path |
|---|---|---|
| Which hub | advisor graph | `graph-metadata.json:63` (73 intent signals), `:139` (87 trigger phrases) |
| Which mode | `hub-router.json` signals + 23 vocabulary classes | `hub-router.json:7` tie-break, `:104` classes |
| Mode identity and aliases | `mode-registry.json` `modes[]` | `mode-registry.json:37` … `:230` |
| First leaf slice | `ROUTER.md` `INTENT_SIGNALS` + `RESOURCE_MAP` | `ROUTER.md:93`, `:103` |
| Task intent inside a mode | packet `INTENT_SIGNALS` / `RESOURCE_MAP` / `LOADING_LEVELS` | e.g. `cli-devin/SKILL.md:97`, `:112` |
| Compiled route | `compiled-route.cjs --hub cli-external-orchestration` | `SKILL.md:47` |

### 4.2 `mcp-tooling` (H)

Same six mechanisms, with 23 vocabulary classes and nine packets. `mcp-tooling/SKILL.md:48-64` states the two stages in 17 lines — the cleanest hub routing section in the fleet. [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:48]

### 4.3 `cli-classifier` (H)

Same shape with one transport. Four Jev phrase lists exist: `mode-registry.json:36` (9 aliases), `hub-router.json:24` (9 alias keywords) and `:37` (17 dispatch keywords), `ROUTER.md:58` (four intent lists), and `cli-jev/SKILL.md:117` (`INTENT_MODEL`). [SOURCE: .skilled/skills/cli-classifier/hub-router.json:24]

### 4.4 `mcp-code-mode` (S)

No stage one. A single SKILL.md router (`INTENT_SIGNALS` at `:77`, `RESOURCE_MAP` at `:86`) plus `leaf-manifest.config.json`, generated `leaf-manifest.json` and generated `leaf-aliases.json`, regenerated by `generate-leaf-manifest.cjs`. [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:62]

### 4.5 `cli-orca` (S)

One SKILL.md router with six lanes (`:102`), a `FOREIGN_OWNERS` ownership map (`:113`) and a prefix/placement guard. Lane selection counts matched phrases (`:177`) and ignores the declared `weight`. [SOURCE: .skilled/skills/cli-orca/SKILL.md:113]

### 4.6 `sk-git` (S)

One SKILL.md router with five intents (`:59`), a second `NOISY_SYNONYMS` table (`:67`) and boundary-aware matching (`:115`). [SOURCE: .skilled/skills/sk-git/SKILL.md:67]

### 4.7 `sk-prompt` (S)

`COMMAND_INTENTS` (`:118`) selects a mode before `INTENT_MODEL` (`:128`); `RESOURCE_MAP` at `:143`; a comment at `:56-57` forbids duplicated lookup tables. [SOURCE: .skilled/skills/sk-prompt/SKILL.md:56]

### 4.8 `sk-vision` (S)

One intent (`:84`) mapped to two directory prefixes (`:97`); `route_resources` loads the whole corpus whenever it is non-empty (`:130-142`). [SOURCE: .skilled/skills/sk-vision/SKILL.md:130]

### 4.9 `system-skill-advisor` (S)

One SKILL.md router with 20 intents (`:140`), `RESOURCE_MAP` (`:169`), `PACKAGE_INDEXES` (`:130`) and `DEFAULT_RESOURCES` (`:121`). Stage one is its own domain: it documents that the daemon reads `graph-metadata.json` `intent_signals` and `derived.trigger_phrases`. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:340]

### 4.10 `system-spec-kit` (S)

One SKILL.md router over 46 manifest leaves; `CLI_TRANSPORT` includes the shared CLI helper doc (`:268`). [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:268]

---

## 5. Where One Decision Is Restated, and Where Copies Drifted (question a)

| Decision | Live authority | Restatements | Measured drift |
|---|---|---|---|
| Hub identity | `graph-metadata.json` `intent_signals` / `derived.trigger_phrases` | SKILL.md `<!-- Keywords: -->`, `description.json` keywords, `ROUTER.md` frontmatter `trigger_phrases` | Only `graph-metadata.json` is read by stage one; the other three are documentation. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:340] |
| Mode selection | `hub-router.json` `vocabularyClasses` | `mode-registry.json` aliases, `ROUTER.md` `INTENT_SIGNALS` | CLI: 6 `cli-opencode` registry aliases absent from `ROUTER.md`, 1 cursor, 3 devin, 6 pi, 1 hermes; and 4 opencode, 6 claude, 5 codex, 6 cursor, 8 devin, 6 pi, 3 hermes router phrases absent from the registry. MCP: 1 chrome, 20 obsidian, 1 notion, 1 mobbin absent from `ROUTER.md`; magicpath exact. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:37] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:265] |
| First leaf slice | `ROUTER.md` `RESOURCE_MAP` | packet ALWAYS table, packet `RESOURCE_MAP` | `cli-devin`: `ROUTER.md` says cli-reference + integration-patterns, ALWAYS says cli-reference + prompt-quality-card, GENERATION says cli-reference + prompt-templates. [SOURCE: .skilled/skills/cli-external-orchestration/ROUTER.md:103] [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:86] |
| Task intent inside a mode | packet `RESOURCE_MAP` | none | Single authority, but three different scoring implementations across standalone skills: prefix load, match count, weighted plus synonyms. [SOURCE: .skilled/skills/sk-vision/SKILL.md:130] [SOURCE: .skilled/skills/cli-orca/SKILL.md:177] [SOURCE: .skilled/skills/sk-git/SKILL.md:115] |
| Default/fallback resource | hub `ROUTER.md` `DEFAULT_RESOURCE` | packet `DEFAULT_RESOURCE` + `DEFAULT_RESOURCE_SEMANTICS` | MCP packets agree with the hub ("fallback-only"); `cli-jev` declares two always-loaded files while its hub router declares none. [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:90] [SOURCE: .skilled/skills/cli-classifier/cli-jev/SKILL.md:115] |

Three drift defects are not cosmetic:

1. **Stage one can route to a stage-two dead end.** `mcp-obsidian`'s health/Iconic/Excalidraw/Minimal-theme classes select the mode, but `ROUTER.md` has no matching intent, so the route ends in a defer. [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:56] [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:97]
2. **`system-skill-advisor` cannot load six of its own intents.** `RESOURCE_BASES` uses `feature_catalog` and `manual_testing_playbook` (underscores) and omits `hooks/`, while the intents map to hyphenated paths and `hooks/`. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:107] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:185]
3. **Its `HOOK` leaf is not in its own manifest**, and `typed_leaves` claims to drop non-manifest paths but never reads the manifest. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:163] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:231]

---

## 6. Readability Findings with Quoted Passages (question d)

Measured §2 share of each assigned file:

| Skill | §2 lines | File lines | Share | Longest line |
|---|---:|---:|---:|---:|
| `mcp-tooling` | 17 | 152 | 11% | 726 (`:11`) |
| `cli-external-orchestration` | 41 | 210 | 20% | 779 (`:76`) |
| `cli-classifier` | 36 | 158 | 23% | 840 (`:114`) |
| `sk-vision` | 83 | 330 | 25% | 512 (`:210`) |
| `sk-git` | 167 | 578 | 29% | 2,195 (`:307`) |
| `mcp-code-mode` | 155 | 465 | 33% | 972 (`:62`) |
| `cli-orca` | 129 | 340 | 38% | 673 (`:226`) |
| `sk-prompt` | 215 | 524 | 41% | 436 (`:61`) |
| `system-skill-advisor` | 264 | 444 | 59% | 1,249 (`:84`) |
| `system-spec-kit` | 356 | 589 | 60% | 1,988 (`:95`) |

One quoted passage per skill:

- **`mcp-tooling`** — the good case: "Routing is two-stage: 1. Stage 1 uses `hub-router.json` and `mode-registry.json` to select one workflow mode, an ordered bundle, or a defer outcome. 2. Stage 2 uses the root `ROUTER.md` surface map to select packet-qualified leaf resources within the chosen mode." (`SKILL.md:50-53`)
- **`cli-external-orchestration`** — "It defines the per-mode leaf-intent model (every mode in `mode-registry.json`, plus the deliberate absence: a bare CLI-dispatch phrase that names no executor fires no intent and defers at the hub), the machine-readable `DEFAULT_RESOURCE` / `INTENT_SIGNALS` / `RESOURCE_MAP` block that the deterministic router-replay and benchmarks parse, and the how-to-read rules…" (`SKILL.md:76`, one 779-character sentence)
- **`cli-classifier`** — "One public skill identity for typed classifier judgments. The hub holds the hosted Jev transport as mode `cli-jev` today, with its own packet. A future classifier backend joins as a new mode and packet. The hub holds no packet-local logic; it routes by `workflowMode` through `mode-registry.json` and uses `hub-router.json` for router policy, signals and outcomes." (`SKILL.md:12`)
- **`cli-orca`** — "The Orca browser is scoped to an Orca worktree and is not Chrome, Safari or the Orca desktop UI. Work in a snapshot, interact, re-snapshot loop. Refs are tab-scoped and go stale after navigation, tab switches or state-changing interactions…" (`SKILL.md:226`, 673 characters)
- **`sk-git`** — "**Provision a worktree before you trust anything it reports** - Every dependency tree here is gitignored, so a fresh worktree has none of them and fails in ways that read as broken code: a build can exit 0 having compiled nothing, and a hub-conformance check that copies a skill into a temp directory loses that skill's dependencies and reports a correct hub broken." (`SKILL.md:307`, 2,195 characters)
- **`sk-prompt`** — "Keep one authoritative Smart Router Pseudocode block in this section. Detection context may appear before pseudocode. Do NOT duplicate routing logic in separate lookup tables." (`SKILL.md:56-57`, followed by three duplicated leaf lists)
- **`sk-vision`** — "Standalone **Class S** skill. One workflow mode: `sk-vision`. Single routed leaf root: `feature-catalog/` (the per-feature deep corpus). No `mode-registry.json`, no `hub-router.json`, no `description.json`." (`SKILL.md:66`)
- **`mcp-code-mode`** — "**Typed leaf projection (fleet routing standard).** mcp-code-mode is a normal, standalone single-mode skill whose sole workflow mode is `mcp-code-mode` (there is no `mode-registry.json`). Every routable leaf under `references/`, `assets/`, and the manual-testing playbook is enumerated in `leaf-manifest.json`…" (`SKILL.md:62`, 972 characters)
- **`system-skill-advisor`** — "**Typed leaf projection (fleet routing standard).** system-skill-advisor is a normal, standalone single-mode skill whose sole workflow mode is `system-skill-advisor` (there is no `mode-registry.json`). Every routable leaf under `references/`, `feature-catalog/` and `manual-testing-playbook/` is enumerated in `leaf-manifest.json`, generated from `leaf-manifest.config.json`." (`SKILL.md:84`, 1,249 characters)
- **`system-spec-kit`** — "**Typed leaf projection (fleet routing standard).** system-spec-kit is a normal, registry-less single-mode skill whose sole workflow mode is `system-spec-kit` (there is no `mode-registry.json`)." (`SKILL.md:95`, 1,988 characters)

Three cross-cutting problems:

1. **Jargon before definition.** "Class S", "typed leaf", "fallback-only", "orderedBundle" and "MODE child" appear before any glossary defines them.
2. **History inside instructions.** `shared-smart-router.md` still describes "the six cli-* sibling skills" and omits `cli-hermes`, which defers to it. [SOURCE: .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:17] [SOURCE: .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:101]
3. **Retired enforcement advertised.** `cli-external-orchestration/SKILL.md:76` and `ROUTER.md:48` say "the deterministic router-replay and benchmarks parse" the block; `benchmark/README.md:20` records that the Lane C harness, runner and scoring contract were removed. [SOURCE: .skilled/skills/cli-external-orchestration/benchmark/README.md:20]

---

## 7. Enforcement Surfaces (question b)

| Surface | What it enforces | Evidence |
|---|---|---|
| `graph-metadata.json` | the only stage-one routing input; daemon reads `intent_signals` and `derived.trigger_phrases` | `system-skill-advisor/SKILL.md:340` |
| `hub-router.json` | mode scoring, tie-break, classes, defer | `cli-external-orchestration/hub-router.json:104` |
| `ROUTER.md` | stage-two first leaf slice; `router-reach` stage-two vocabulary | `doctor-router-reach.yaml:64-65` |
| `router-reach` | every multi-word advertised phrase must reach its declaring hub through the live advisor; `WRONG-HUB` and `OUTRANKED` fail | `doctor-router-reach.yaml:23-38` |
| `leaf-manifest.json` + `leaf-aliases.json` | typed `(workflowMode, leafResourceId)` identity; generated, byte-stable | `skill-root-metadata-contract.md:68-70` |
| `compiled-route.cjs` | stage-one mode decision from a compiled manifest; hashes hub `SKILL.md` (prior report) | `cli-external-orchestration/SKILL.md:47` |
| `parent-skill-check.cjs` | hub layout, root `ROUTER.md`, alias subset (prior report) | prior advisor report |
| `verify-router-sync.cjs` | packet router vs hub map, unreferenced docs (prior report) | prior advisor report |
| `package_skill.py` | standalone `SMART ROUTING` H2 with `discover_markdown_resources`, `_guard_in_skill`, `UNKNOWN_FALLBACK` (prior report) | prior advisor report |
| `sync-skills-hermes.cjs --check` | the only text-copy mirror of every `SKILL.md` | `.hermes/SYNC.md:24` |
| `sync-prompts.cjs` / `sync-prompts-hermes.cjs` | generated command prompt stubs | `.codex/SYNC.md:29` |
| `sync-runtime-mirrors.cjs --check` | symlink trees for Claude, Devin, Cursor, Codex, OpenCode | `.claude/SYNC.md:101` |
| `sync-gate1-pointers.cjs` | only the Gate 1 block in `.cursor/rules/skill-routing.md` | `.cursor/SYNC.md:114` |

**Not an enforcement surface:** the Lane C skill benchmark. Its reports are frozen archives and its runner was removed. [SOURCE: .skilled/skills/cli-external-orchestration/benchmark/README.md:20]

---

## 8. Change-Impact Matrix (question b)

| Proposed change | Breaks or requires |
|---|---|
| Delete `hub-router.json` `vocabularyClasses` and read aliases from the registry | compiled-route re-mint, alias-subset check (registry aliases must be a subset of hub-router classes, prior report), `router-reach` stage one, hub `SKILL.md` pseudocode |
| Delete or shrink `ROUTER.md` `INTENT_SIGNALS` | `router-reach` fails for every advertised phrase the graph still carries; stage-two leaf selection loses its only authored map |
| Add a per-mode `ROUTER.md` | invisible to `router-reach` (scans `.skilled/skills/*/ROUTER.md` only) and to the Class H contract; `parseRouter`'s fallback accepts only `references/*.md` (prior report) |
| Move a packet machine block to an appendix inside the same `SKILL.md` | likely free for `parseRouter` (reads whole file) but unverified for `package_skill` section order; `verify-router-sync` legs 1b/2 must be rerun (prior report, inferred) |
| Delete a packet `RESOURCE_MAP` | loses within-mode task routing, which the hub router does not replace; `verify-router-sync` may report unreferenced docs |
| Edit `shared-smart-router.md` | seven CLI packets defer their helper bodies to it, and `system-spec-kit` routes it as one of its 46 manifest leaves — regenerate spec-kit's manifest and aliases |
| Edit any `SKILL.md` | regenerate `.hermes/skills` copies; Claude/Devin/OpenCode follow by symlink; Codex/Cursor have no skills mirror |
| Edit a command doc | `sync-prompts.cjs` and `sync-prompts-hermes.cjs` |
| Edit an agent doc | `.claude/agents` is a real forked copy behind a pre-commit gate; `.devin/agents` symlinks to it; `.hermes/skills/agent-*` and `.codex/agents/*.toml` are generated |
| Add a new skill | `.cursor/rules/skill-routing.md` will not list it (no generator); author `graph-metadata.json`, `leaf-manifest.config.json`, then generate manifest and aliases |
| Edit a pinned line | `check-rule-copies.js` pins review Extension Floors lines (prior report, sibling surface) |

---

## 9. Verdict: Hubs (question c)

**Advisor hybrid, one hub-root `ROUTER.md`, JSON stage one, script resolvers. Keep it; fix the drift.**

- **Per-mode `ROUTER.md`: rejected.** Class H is defined by `mode-registry.json` plus `hub-router.json`; `ROUTER.md` is a hub-root companion. `router-reach` scans only `.skilled/skills/*/ROUTER.md` and requires a hub with both JSON files. No packet in either hub has one today. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:40] [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:81]
- **JSON-only: rejected today.** `router-reach` reads `ROUTER.md` as `stage_two_vocabulary`; removing it deletes the only stage-two map the check can read, and the compiled router emits packets, not leaves (prior report). [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:65]
- **Hybrid: confirmed.** Stage one `graph-metadata.json` → hub; `hub-router.json` → mode; `ROUTER.md` → first leaf slice; `leaf-manifest.json`/`leaf-aliases.json` → typed pairs; `--explain` and the quality runner → checklists. Each layer has a distinct question and a distinct reader.
- **What to change inside the hybrid:** make `hub-router.json` the single authored executor vocabulary and generate the registry aliases and `ROUTER.md` keywords from it; make the graph a required superset of every advertised `ROUTER.md` phrase; delete the packet first-slice restatement that disagrees with `ROUTER.md`.

---

## 10. Verdict: Mode Packets (question c)

**No per-mode `ROUTER.md`. Keep a short §2 (8-12 lines), keep the task-intent map, move the Python block to a final appendix.**

The packet router answers a different question from the hub router: the hub scores executor identity (`OPENCODE`, `DEVIN`, `HERMES`) while the packet scores task intent inside one executor (`GENERATION`, `REVIEW`, `CLOUD_HANDOFF`). That is why deleting the packet maps wholesale — the prior report's "remove the per-packet loading tables" — would remove a live decision rather than a duplicate. What should go is the first-slice restatement that competes with `ROUTER.md`, and the six-step call sequence repeated in all seven CLI packets. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:97] [SOURCE: .skilled/skills/cli-external-orchestration/ROUTER.md:93]

Target shape per packet: §1 when to use; §2 eight to twelve lines naming the hub's mode decision, the packet's task-intent map, and the three marker words; §3 onward the instructions; final appendix `## MACHINE ROUTER` holding the dictionaries and helper reference.

---

## 11. Recommendations (question c standalone, question e summary)

**Standalone skills (Class S): leaf manifest and aliases only. No `ROUTER.md`, and the full Python block is optional.**

Class S forbids the hub files and requires `leaf-manifest.config.json`, generated `leaf-manifest.json` and generated `leaf-aliases.json`. JSON-only is already the operative shape for leaf identity. The Python block earns its place only where it chooses among leaves; it does not in `sk-vision` (one intent, whole-corpus load) or `cli-orca` (weights unread). [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62] [SOURCE: .skilled/skills/sk-vision/SKILL.md:130] [SOURCE: .skilled/skills/cli-orca/SKILL.md:177]

Recommendations in order:

1. Fix the six `system-skill-advisor` defects (discovery roots, `hooks/`, manifest membership, `typed_leaves`).
2. Reconcile `cli-jev`'s default semantics with its hub router.
3. Close the `mcp-obsidian` stage-one/stage-two gap.
4. Update `shared-smart-router.md` to seven providers and regenerate `system-spec-kit`'s manifest and aliases.
5. Remove the retired benchmark claim and align the `mcp-tooling` `ROUTER.md` version.
6. Consolidate executor vocabulary behind `hub-router.json`.
7. Restructure mode-packet prose and move machine blocks to appendices.
8. Run the readability pass.
9. Regenerate every derived surface and run the full gate.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Per-mode `ROUTER.md` | Class H defines the router at the hub root; `router-reach` scans only hub-root files; no packet has one | `skill-root-metadata-contract.md:40`, `doctor-router-reach.yaml:81` | 1, 5 |
| Pure JSON-only routing | `router-reach` reads `ROUTER.md` as stage-two vocabulary; compiled router emits packets, not leaves | `doctor-router-reach.yaml:65`, prior report | 4, 5 |
| Deleting all packet task-intent maps | They answer a different question from the hub's executor map | `cli-devin/SKILL.md:97`, `ROUTER.md:93` | 1, 5 |
| Treating the five phrase lists as five live sources | Only `graph-metadata.json` is read by stage one | `system-skill-advisor/SKILL.md:340` | 4 |
| Treating the Lane C benchmark as enforcement | Harness, runner and scoring contract removed | `benchmark/README.md:20` | 1, 4 |
| Counting `.hermes/skills` against raw `find` | Three extra hits are Playwright's bundled skills, correctly not mirrored | read-only comparison | 4 |
| A per-mode router for standalone skills | Class S forbids the hub files outright | `skill-root-metadata-contract.md:62` | 3, 5 |

## Divergence Map

- Saturated directions: none recorded; no divergent pivots were taken.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Remaining frontier: the sibling lineage's four hubs (`sk-code`, `sk-doc`, `sk-design`, `system-deep-loop`) and the parent-skill/router-sync/replay/compiled-route/`package_skill` tooling, covered there rather than here.
- Council artifact references: none; this was a two-lineage fan-out, not a Council run.

---

## 12. Open Questions

1. Does moving a packet's machine block to an appendix leave `parseRouter` and `package_skill` green? Prior report marks this unverified; the sibling lineage owns those checks.
2. Which of the four hub router signal classes are genuinely reachable today? `router-reach` answers this against the live advisor, but it was not run in this read-only lineage.
3. Should `system-spec-kit` continue to route `shared-smart-router.md` as a leaf, or should that document move out of its routable corpus? Either choice changes its manifest.
4. Which three phrases the `mcp-obsidian` router lacks should be added versus which four stage-one classes should be dropped? That is an ownership decision for the mcp-tooling owner.

---

## 13. Phased Implementation Plan (question e)

### Phase 0 — Baseline (read-only, before any edit)

Capture the current numbers: `parent-skill-check.cjs`, `verify-router-sync.cjs`, `ci-router-vocabulary-reach.cjs`, `compiled-route-guard.cjs`, `package_skill.py --strict`, `leaf-manifest --check`, `sync-skills-hermes.cjs --check`. Record the alias-drift counts in §5 as the fixture. No file changes.

### Phase 1 — Correctness fixes, no shape change (low risk)

| # | Change | Risk | Rollback |
|---|---|---|---|
| 1 | `system-skill-advisor`: hyphenate discovery roots, add `hooks/`, add the hook leaf to the manifest or drop `HOOK`, make `typed_leaves` read the manifest | Low | Revert `SKILL.md` + regenerate manifest/aliases |
| 2 | `cli-jev`: make `DEFAULT_RESOURCES` agree with hub `DEFAULT_RESOURCE = []`, or state the baseline in both | Low | Revert one file |
| 3 | `mcp-tooling`: add four obsidian intents or drop four stage-one classes | Medium — `router-reach` | Revert `ROUTER.md` or `hub-router.json` |
| 4 | `shared-smart-router.md`: six → seven providers, add `hermes` slug | Low | Revert the doc; regenerate spec-kit manifest |
| 5 | `cli-external-orchestration`: remove or annotate the benchmark claim | Trivial | Revert one line |
| 6 | `mcp-tooling`: align `ROUTER.md` version or document the exemption | Trivial | Revert one line |

### Phase 2 — Vocabulary consolidation (high risk)

Make `hub-router.json` `vocabularyClasses` the only authored executor vocabulary. Generate `mode-registry.json` aliases and `ROUTER.md` `INTENT_SIGNALS` from it. Keep `graph-metadata.json` as the authored stage-one list and require it to be a superset of every advertised `ROUTER.md` phrase. Risk: compiled-route re-mint, alias-subset check, `router-reach`. Rollback: revert the generator commit; re-mint the compiled manifest from the previous `SKILL.md`.

### Phase 3 — Mode-packet prose (medium risk)

For each packet, in order `cli-devin` → `cli-hermes` → `cli-pi` → `cli-opencode` → `cli-claude-code` → `cli-codex` → `cli-cursor`, then the nine mcp packets: shorten §2 to 8-12 lines, move the machine block to `## MACHINE ROUTER`, delete the duplicated first-slice table, keep the task-intent map. Risk: `verify-router-sync` legs 1b/2 and `package_skill` markers. Rollback: per-file revert; re-mint compiled route if the hub `SKILL.md` changed.

### Phase 4 — Readability pass (low risk)

Split lines over roughly 30 words; define "Class S", "typed leaf", "fallback-only", "orderedBundle" once per hub; remove project history from instructions; keep pinned lines untouched. Regenerate the Hermes copies after each file.

### Phase 5 — Regenerate and gate (medium risk)

Regenerate: `leaf-manifest.json` + `leaf-aliases.json` for every changed Class S root, `.hermes/skills` via `sync-skills-hermes.cjs`, command prompts via `sync-prompts.cjs`/`sync-prompts-hermes.cjs`, compiled routes, then run `parent-skill-check`, `verify-router-sync`, `router-reach`, `package_skill --strict` and the drift guards. Bump versions and changelogs; check 13d compares them.

---

## 14. Risks and Rollback

- **Highest-risk change is Phase 2**, because three checks read the same vocabulary from different files. Rollback is a generator revert plus a compiled-route re-mint, not a hand edit.
- **Phase 3's risk is unverified**, not low: the prior report did not test whether moving the machine block inside `SKILL.md` leaves `parseRouter` and `package_skill` green. Run `verify-router-sync` on one packet before doing seven.
- **Pinned lines** in `sk-code-review` fail `check-rule-copies.js` on any wording change; that surface belongs to the sibling lineage.
- **Mirror rollback is cheap** because only Hermes copies text; Claude, Devin and OpenCode follow symlinks and need no regeneration.
- **Version bumps** are enforced by check 13d; a content change without a version bump is a gate failure, not a style issue.

---

## 15. Verification Gate

Before claiming any phase complete, run and read the output and exit status of:

1. `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/<root>` for each changed Class S root.
2. `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check`.
3. `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`.
4. `node .skilled/bin/compiled-route.cjs` re-mint + guard for any hub `SKILL.md` change.
5. `parent-skill-check.cjs`, `verify-router-sync.cjs`, `ci-router-vocabulary-reach.cjs`, `package_skill.py --strict`, and the drift-guard suite.
6. The quality-checklist-map test and `verify-doc-claims.cjs` for prose claims.

This lineage ran none of them; the list is the implementation gate, not evidence gathered here.

---

## 16. References

- Resource map: [`resource-map.md`](./resource-map.md).
- Lead steer: [`steer.md`](./steer.md).
- Iterations: [`iterations/iteration-001.md`](./iterations/iteration-001.md) … [`iteration-005.md`](./iterations/iteration-005.md).
- Prior evidence (sibling lineage's surface): `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md`.
- Class contract: `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`.
- Reach check: `.skilled/commands/doctor/assets/doctor-router-reach.yaml`.
- Stage-one authority: `.skilled/skills/system-skill-advisor/SKILL.md:340`.
- Shared CLI helper: `.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md`.
- Mirror manifests: `.hermes/SYNC.md`, `.claude/SYNC.md`, `.devin/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.opencode/README.md`.

---

## 17. Iteration Index

| Iteration | Focus | Findings | newInfoRatio |
|---|---|---:|---:|
| 1 | `cli-external-orchestration` + `cli-classifier` and mode packets | 7 | 0.90 |
| 2 | `mcp-tooling` + `mcp-code-mode` | 7 | 0.85 |
| 3 | Standalone `cli-orca`, `sk-git`, `sk-prompt`, `sk-vision` | 7 | 0.80 |
| 4 | `system-skill-advisor`, `system-spec-kit`, commands, agents, mirrors, generators | 8 | 0.90 |
| 5 | Verdicts, readability synthesis, phased plan | 7 | 0.55 |

**Convergence Report**

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: standalone skills (0.80); run 4: advisor, spec-kit, mirrors (0.90); run 5: verdicts and plan (0.55)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded; saturated directions: none
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.
