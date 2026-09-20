---
title: "Iteration 4: Angle 14 — Roster completeness for the seventh executor"
trigger_phrases: []
---
# Iteration 4: Angle 14 — Roster completeness for the seventh executor

## Focus

Angle 14 (wave two). Enumerate every roster statement across the three hubs, their catalogs, playbooks and protocols, and every place a kind is missing. The angle asserts three arms: `ROUTER.md` omits `cli-hermes` from all three of its roster statements, `SKILL.md` says six modes in one line and seven in another, and the catalogs name three of seven executor kinds. This iteration verified all three arms against the tree and then swept the same class — hand-authored executor/mode enumerations — across every hub root, packet, catalog, protocol and playbook it could find.

Dimension: traceability (primary — the question is which artifact is the authority and where statements diverge from it), maintainability (secondary — the drift class is hand-maintained prose with no gate).

Method: read the runtime authority (`executor-config.ts`) and its two consumers (`fanout-run.cjs`, `executor-audit.ts`); read all three hub roots and their machine blocks; read the mode packets' SKILL.md, protocols, catalogs and YAML assets; executed the compiled front door for `cli-hermes` prompts to establish routing capability; parsed the three `mode-registry.json` files to count registered modes; read the two 20-mode-packet control surfaces. No fixes.

## Files Reviewed

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11,91-116,130-142`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:64-111,163-168`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:476-479,2643-2722,3269`
- `.opencode/skills/cli-external-orchestration/{ROUTER.md,SKILL.md,README.md,mode-registry.json,description.json}`
- `.opencode/skills/cli-external-orchestration/cli-{opencode,claude-code,codex,cursor,devin,pi,hermes}/{SKILL.md,README.md}` (+ `cli-devin/references/integration-patterns.md`, `cli-pi/references/pi-tools.md`)
- `.opencode/skills/cli-external-orchestration/manual-testing-playbook/manual-testing-playbook.md:3,11` + `hub-routing/ambiguous-defer.md:20-24`
- `.opencode/skills/system-deep-loop/{SKILL.md,ROUTER.md,mode-registry.json,description.json}`
- `.opencode/skills/system-deep-loop/deep-review/{SKILL.md:49,references/protocol/loop-protocol.md:279-281}`
- `.opencode/skills/system-deep-loop/deep-research/{SKILL.md:267,references/protocol/loop-protocol.md}`
- `.opencode/skills/system-deep-loop/deep-ai-council/{SKILL.md:22-26,357,scripts/orchestrate-session.cjs:193-198,270-280,references/patterns/seat-diversity-patterns.md:67}`
- `.opencode/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:150` + `loop-lifecycle/executor-selection-contract.md:3,29-35`
- `.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:42`
- `.opencode/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md:308` + `model-benchmark-mode/model-dispatcher.md:27` + `scripts/model-benchmark/README.md:75` + `references/model-benchmark/lane-b-mechanics.md:49` + `scripts/model-benchmark/{dispatch-model.cjs:138-145,lib/profile-validator.cjs:31-41}`
- `.opencode/commands/deep/assets/deep-{review,research}-auto.yaml` (branch sets, notes) + `deep-{review,research}-confirm.yaml` (branch sets) + `deep-ai-council-{auto,confirm}.yaml:26`
- `.opencode/commands/deep/assets/compiled/deep-{review,research}.contract.md:186,252-270,305-354`
- `.opencode/skills/sk-code/{SKILL.md,README.md,ROUTER.md}` (roster statements: none found)

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 3 hub roots, 7 cli-* packets, 2 mode packets (review/research) + council packet, 6 deep command YAMLs, 2 compiled contracts, 2 model-benchmark sources, the executor authority and both of its consumers
- New findings: P0=1 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## The Authority Roster (positive control)

| Surface | Kind list | Count | Verdict |
|---|---|---|---|
| `executor-config.ts:11` `EXECUTOR_KINDS` | native, cli-codex, cli-claude-code, cli-opencode, cli-cursor, cli-devin, cli-pi, cli-hermes | **8** (7 CLI + native) | authority |
| `fanout-run.cjs:2717-2722` `LINEAGE_COMMAND_ADAPTERS` | all 8, incl. `buildHermesLineageCommand` | 8 | complete |
| `executor-audit.ts:64-111,163-168` per-kind maps | all 8 (hermes binary/session-env/state-dir/credential-prefix entries) | 8 | complete |
| `deep-review.contract.md:186,270,352-353` (compiled) | A-H incl. `H) cli-hermes` | 8 | complete |
| `deep-research.contract.md:188,252,321` (compiled) | A-H incl. hermes | 8 | complete |
| `cli-external-orchestration/mode-registry.json` | 7 modes incl. cli-hermes (`:212-236`) | 7 | complete |
| `deep-review/SKILL.md:49` | cli-codex … cli-hermes | 7 CLI | complete |
| `deep-ai-council/SKILL.md:26,357` + `seat-diversity-patterns.md:67` | includes cli-hermes | 6+ | complete |
| `cli-hermes/SKILL.md:345` + 4 packet READMEs (`cli-opencode:157`, `cli-claude-code:172`, `cli-codex:182`, `cli-cursor:157`) | six siblings with hermes | 6 | complete |
| `deep-improvement/feature-catalog/feature-catalog.md:308` + `lane-b-mechanics.md:49` | 6 kinds, exclusions documented | 6 | complete (bounded path) |

The runtime is a **positive control for routing capability**: executed this iteration, `compiled-route.cjs --hub cli-external-orchestration` with "delegate to cli-hermes for the long research task" and "hermes cli dispatch" both resolve `workflowMode: cli-hermes` (generation 5, policy hash `06b19646…`). The defect class is therefore statement coverage, exactly as the angle frames it.

## Roster-Statement Census (prose)

### A. Hub front doors

| # | Statement | Kinds/modes named | Missing | Status |
|---|---|---|---|---|
| A1 | `cli-external-orchestration/ROUTER.md:24-25` hub selects… | 6 | cli-hermes | **defect → F028** |
| A2 | `cli-external-orchestration/ROUTER.md:46-64` per-mode leaf bullets | 6 sections | cli-hermes section | **defect → F028** |
| A3 | `cli-external-orchestration/ROUTER.md:145-146` defer fallback "confirm the target executor" | 6 | cli-hermes | **defect → F028** |
| A4 | `cli-external-orchestration/SKILL.md:74` "all six modes" | 6 | 7th mode | **defect → F029** |
| A5 | `cli-external-orchestration/SKILL.md:54` "All seven modes" | 7 | — | correct |
| A6 | `system-deep-loop/SKILL.md:80` "the 3 improvement modes" | 3 | actual 2 | **defect → F029** |
| A7 | `system-deep-loop/SKILL.md:131` "beyond the six registered" | 6 | actual 5 | **defect → F029** |
| A8 | `system-deep-loop/description.json:3` "five modes" | 5 | — | correct |
| A9 | `cli-external-orchestration/{SKILL.md:52-54,README.md:35,66,88,96,134,description.json,ROUTER.md:90-126}` (machine blocks) | 7 incl. HERMES | — | correct |

Same-file contradiction in A4 vs A5 is exact: `SKILL.md:54` says "All seven modes", `:74` says "all six modes"; the registry holds 7.

### B. Protocols and mode-packet prose

| # | Statement | Kinds named | Missing | Status |
|---|---|---|---|---|
| B1 | `deep-review/references/protocol/loop-protocol.md:281` "the seven-kind authority is executor-config.ts"; adapters `cli-cursor, cli-devin, cli-pi` | 6 named, count 7 | cli-hermes (absent from the whole review protocol) | **defect → F030** |
| B2 | `deep-research/SKILL.md:267` "The seven executor kinds"; branches native/claude-code/opencode/codex + adapters cursor/devin/pi | 7 named, count 7 | cli-hermes; count should be 8 | **defect → F030** |
| B3 | `deep-ai-council/SKILL.md:22` "resolver accepts native, cli-opencode, cli-cursor, cli-devin, cli-pi, opencode" | 5 + alias | cli-hermes — though `orchestrate-session.cjs:198` **accepts** it | **defect → F030** |
| B4 | `deep-ai-council-{auto,confirm}.yaml:26` `cli: "[native\|cli-opencode\|cli-cursor\|cli-devin\|cli-pi]"` | 5 | cli-hermes | **defect → F030** |
| B5 | `deep-ai-council/SKILL.md:26,357` round-CLI examples include `cli-hermes` | 5+ | — | correct (contradicts B3 in the same file) |
| B6 | `deep-review/SKILL.md:49` "any CLI executor (…7 kinds…)" | 7 CLI | — | correct |

### C. Catalogs

| # | Statement | Kinds named | Missing | Status |
|---|---|---|---|---|
| C1 | `deep-review/feature-catalog/feature-catalog.md:150` "one of three dispatch branches (native, cli-opencode, cli-claude-code)" | 3 | cli-codex/cursor/devin/pi/hermes | **defect → F031** |
| C2 | `deep-review/feature-catalog/loop-lifecycle/executor-selection-contract.md:3,29-35` "one of two CLIs" / "one of three dispatch branches" + 3-row table | 3 | 5 kinds | **defect → F031** |
| C3 | `runtime/feature-catalog/fanout/fanout-run.md:42` "Supports all 3 CLI kinds: cli-opencode, cli-claude-code, cli-opencode" | 2 unique (3 slots) | 5 kinds; **duplicated name** | **defect → F031** |
| C4 | `deep-improvement/feature-catalog/model-benchmark-mode/model-dispatcher.md:27` "across cli-opencode, cli-claude-code, and cli-opencode" | 2 unique (3 slots) | 4 of the 6 `KNOWN_EXECUTORS`; **duplicated name** | **defect → F031** |
| C5 | `deep-improvement/scripts/model-benchmark/README.md:75` "Routes a prompt file to cli-opencode or cli-claude-code" | 2 | 4 of 6 | **defect → F031** |
| C6 | `deep-improvement/feature-catalog/feature-catalog.md:308` + `lane-b-mechanics.md:49` (6 kinds) | 6 | — | correct |

Plain reading of C3's subject file: `fanout-run.cjs` builds commands for **8** kinds — the catalog that documents the driver understates it by 5 and repeats one name in the slot where a different kind belongs. C4 repeats the same duplicated-name pattern.

### D. cli-* packet sibling lists (cli-external-orchestration)

| # | Statement | Siblings named | Missing | Status |
|---|---|---|---|---|
| D1 | `cli-claude-code/SKILL.md:381` "Related skills: `cli-opencode` …, `cli-opencode` …" | 1 unique (2 slots) | cli-codex (intended), cli-pi, cli-hermes | **defect → F032** |
| D2 | `cli-codex/SKILL.md:383` | 2 | cli-cursor, cli-devin, cli-pi, cli-hermes | **defect → F032** |
| D3 | `cli-cursor/SKILL.md:416` | 3 | cli-devin, cli-pi, cli-hermes | **defect → F032** |
| D4 | `cli-devin/SKILL.md:464` | 4 | cli-pi, cli-hermes | **defect → F032** |
| D5 | `cli-pi/SKILL.md:303` | 5 | cli-hermes | **defect → F032** |
| D6 | `cli-hermes/SKILL.md:345` | 6 | — | correct |
| D7 | `cli-devin/references/integration-patterns.md:30` "Devin is the 5th executor kind … alongside cli-codex, cli-claude-code, cli-opencode, and cli-cursor" | 4 | cli-pi, cli-hermes (it is the 5th of 7) | **defect → F032** |
| D8 | `cli-pi/references/pi-tools.md:17` "no analog in cli-codex, cli-claude-code, cli-opencode, cli-cursor, or cli-devin" | 5 | cli-hermes | **defect → F032** |
| D9 | 4 packet READMEs carry a cli-hermes dispatch row | 6 | — | correct |

The D-list pattern is monotonic: each packet's sibling list froze at its authoring date, so the newest sibling is missing from every earlier list and the newest packet (cli-hermes) is the only complete one.

### E. Playbooks and YAML assets (scoped observations, not findings)

| # | Statement | Note |
|---|---|---|
| E1 | `cli-external-orchestration/manual-testing-playbook/manual-testing-playbook.md:3,11` and `hub-routing/ambiguous-defer.md:20-24` frame hub routing as "cli-opencode vs cli-claude-code" | Scoped operator examples of the two oldest modes; not read as roster claims |
| E2 | `deep-{review,research}/manual-testing-playbook/fanout/fanout-cli-lineages-*.md:28-46` fan-out examples use cli-opencode + cli-claude-code | Examples, not rosters |
| E3 | `deep-{review,research}-confirm.yaml` single-executor branch sets carry only native/claude-code/opencode (review-confirm also `if_cli_copilot`) | Variant drift — **delegated to wave2-glm angle 16** rather than double-counted here |
| E4 | `deep-review-auto.yaml:1072`, `deep-review-confirm.yaml:1075`, `deep-research-confirm.yaml:1013` retain `if_cli_copilot` branches | `cli-copilot` is not in `EXECUTOR_KINDS`; the auto branch's own comment (`:1121-1123`) states "There is no cli-copilot kind in the executor schema" and dispatches it as `kind:'native'`. Read as deliberate legacy retention — recorded, not filed |
| E5 | No `if_cli_hermes` branch key exists in any of the four auto YAMLs, while `deep-review-auto.yaml:1829` / `deep-research-auto.yaml:1455` attach a cli-hermes note to the `if_cli_pi` branch | **Unresolved**: no in-repo consumer of `branch_on`/`if_cli_*` keys exists (grep of `.opencode/bin` and `.opencode/skills` for branch-key readers returns nothing), so whether a `--executor=cli-hermes` single-executor run resolves to that branch or falls through cannot be proven from the tree. Recorded in the ledger as unresolved rather than filed |

## Findings

### P0, Blocker

- **F028**: `cli-external-orchestration/ROUTER.md` omits `cli-hermes` from all three of its prose roster statements while the file's own machine block names it in both the intent vocabulary and the resource map, and the compiled router resolves it. Statement 1 (`:24-25`) introduces the doc as mapping intent to "(`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, or `cli-pi`)". Statement 2 (`:46-64`) lists six per-mode leaf bullets and has no cli-hermes bullet, so the seventh mode's first-slice leaves (its `cli-reference.md` and `integration-patterns.md`) appear nowhere in the prose that exists to map modes to leaves. Statement 3 (`:145-146`) instructs, under "HOW TO READ", to "confirm the target executor (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, or `cli-pi`) before loading anything" — the exact Step-2 instruction an agent follows. In the same file, `INTENT_SIGNALS` carries a `HERMES` class (`:96`) and `RESOURCE_MAP` carries the HERMES leaf pair (`:124-126`); `mode-registry.json:212-236` registers `cli-hermes`; and executed this iteration, `compiled-route.cjs --hub cli-external-orchestration` with "hermes cli dispatch" resolves `workflowMode: cli-hermes`. The hub's front-door document disagrees with itself: machine layer complete, prose layer one mode short, in three places. **Reconciliation with wave one:** this is wave-one `wave1-deepseek` F007, which filed the same three statements at P0 and left one downgrade path — ROUTER.md shown superseded by the compiled router and marked non-authoritative. No such supersession exists or is documented: `SKILL.md:74` still names ROUTER.md as the stage-two routing authority, and the machine block the compiled pipeline reads sits inside the same file. Wave one's downgrade trigger is unmet, so this lane adopts P0; the runtime-capability proof from iteration 3 bounds the *runtime* impact, not the document-contract impact the review grades. [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:24-25] [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:46-64] [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:96] [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:124-126] [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:145-146] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:212]

### P1, Required

- None. (F028 escalated to P0 on re-adjudication against wave one's unmet downgrade trigger.)

### P2, Suggestion

- **F029**: Hub `SKILL.md` files carry hand-written mode counts that their own registries contradict. `cli-external-orchestration/SKILL.md:74` says the surface router "defines the per-mode leaf-intent model (all six modes …)" while line 54 of the same file says "All seven modes are primary, independently-routable dispatch workflows" and `mode-registry.json` holds seven. `system-deep-loop/SKILL.md:80` says "the 3 improvement modes all share the system-deep-loop/deep-improvement/ packet" while the registry carries exactly two (`agent-improvement`, `model-benchmark`), a fact `description.json:3` states correctly ("two improvement lanes"). `system-deep-loop/SKILL.md:131` says "A new mode is needed beyond the six registered" while five modes are registered and `description.json:3` says "five modes". Three count errors, two front-door files, one registry authority. No gate reads prose counts, so nothing caught them. **Reconciliation with wave one:** the `:74` site is wave-one F008 (P1, with its own downgrade trigger set to P2 once the `F007` fix corrects the sentence) and the `system-deep-loop` sites overlap wave-one F002 (P1). This lane lands all three count-only sites at P2 because a count error changes no reachability and no consumer; the parent merge keeps strongest restriction regardless. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:54] [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:74] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:80] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:131]

- **F030**: Deep-loop mode-packet prose under-describes the executor set, and in the council packet the prose contradicts the packet's own resolver. `deep-review/references/protocol/loop-protocol.md:281` closes the executor-resolution section with "the seven-kind authority is `runtime/lib/deep-loop/executor-config.ts`" after naming `cli-codex` (inline) and `cli-cursor`, `cli-devin`, `cli-pi` (adapters) — omitting `cli-hermes`, which the named authority contains at `:11` and which the fan-out adapter map implements at `fanout-run.cjs:2721`; `cli-hermes` appears nowhere in the review protocol. `deep-research/SKILL.md:267` repeats the same "seven executor kinds" framing and the same omission. In the council packet, `deep-ai-council/SKILL.md:22` states the resolver "accepts `native`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi`, and the `opencode` alias" — but `orchestrate-session.cjs:198` accepts `cli-hermes` in the same list, and the same SKILL.md lists cli-hermes rounds at `:26` and `:357`; both council YAMLs repeat the short list at `:26`. A reader of any of these sentences under-provisions a supported capability, and in the council case reads the opposite of what the code does. [SOURCE: .opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:281] [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:267] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:22] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:198] [SOURCE: .opencode/commands/deep/assets/deep-ai-council-auto.yaml:26]

- **F031**: Deep-loop catalogs describe the executor dispatcher as three kinds (twice with a duplicated kind name) against a driver that implements eight. `deep-review/feature-catalog/feature-catalog.md:150` says `parseExecutorConfig` "resolves `config.executor.kind` into one of three dispatch branches (`native`, `cli-opencode`, `cli-claude-code`)"; its detailed sibling `loop-lifecycle/executor-selection-contract.md:3,29-35` repeats the claim as "one of two CLIs" and a three-row table. `runtime/feature-catalog/fanout/fanout-run.md:42` says "Supports all 3 CLI kinds: `cli-opencode`, `cli-claude-code`, `cli-opencode`" — the driver it documents, `fanout-run.cjs:2717-2722`, has eight adapters. `deep-improvement/feature-catalog/model-benchmark-mode/model-dispatcher.md:27` says the dispatcher routes "across `cli-opencode`, `cli-claude-code`, and `cli-opencode`" against `dispatch-model.cjs:138-145`'s six, and `scripts/model-benchmark/README.md:75` says it routes "to `cli-opencode` or `cli-claude-code`". The duplicated `cli-opencode` in two of the four sites marks a botched name substitution rather than plain staleness. **Reconciliation with wave one:** this re-verifies wave-one F017 ("Catalogs name three of the runtime seven cli executor kinds", P2) at the same severity; the added arms are the sibling executor-selection catalog and the two duplicated-name sites. [SOURCE: .opencode/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:150] [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:42] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/feature-catalog/model-benchmark-mode/model-dispatcher.md:27] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2717-2722]

- **F032**: Every `cli-*` packet's "Related skills" roster froze at its authoring date, so each older packet omits the newer siblings and one list carries a duplicated name. `cli-claude-code/SKILL.md:381` lists `cli-opencode` twice ("for sandboxed OpenAI perspective" — no OpenCode packet has that property; the nulled slot is `cli-codex`); `cli-codex/SKILL.md:383` names two siblings; `cli-cursor/SKILL.md:416` three; `cli-devin/SKILL.md:464` four; `cli-pi/SKILL.md:303` five; only `cli-hermes/SKILL.md:345` names all six. Two reference files repeat the stale sets: `cli-devin/references/integration-patterns.md:30` still says "Devin is the 5th executor kind in the cli-* family" (it is 5th of seven) and `cli-pi/references/pi-tools.md:17` enumerates five sibling packets without cli-hermes. The four older packet READMEs carry a cli-hermes row, so the READMEs were updated and the SKILL.md lists were not. [SOURCE: .opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:381] [SOURCE: .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:383] [SOURCE: .opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md:416] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:464] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:303] [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/references/integration-patterns.md:30]

## Claim Adjudication

```json
{"findingId":"F028","claim":"cli-external-orchestration/ROUTER.md omits cli-hermes from all three of its prose roster statements (:24-25 overview, :46-64 per-mode leaf bullets, :145-146 defer instruction) while the same file's machine block names HERMES in INTENT_SIGNALS (:96) and RESOURCE_MAP (:124-126), mode-registry.json registers the mode, and the compiled router resolves it live; ROUTER.md is not superseded or marked non-authoritative, so the omission stands as a P0 routing-contract break.","evidenceRefs":[".opencode/skills/cli-external-orchestration/ROUTER.md:24-25",".opencode/skills/cli-external-orchestration/ROUTER.md:46-64",".opencode/skills/cli-external-orchestration/ROUTER.md:145-146",".opencode/skills/cli-external-orchestration/ROUTER.md:96",".opencode/skills/cli-external-orchestration/ROUTER.md:124-126",".opencode/skills/cli-external-orchestration/mode-registry.json:212",".opencode/skills/cli-external-orchestration/SKILL.md:74"],"counterevidenceSought":"Read ROUTER.md end to end for a seventh leaf bullet, a later roster sentence, or a mode-count note that would make the six-kind reading deliberate; grepped the file for cli-hermes (only the machine block at :96 and :124-126); re-ran the compiled front door with hermes phrasing to rule out 'the mode is not routable anyway'; checked whether any artifact marks ROUTER.md superseded or non-authoritative (SKILL.md:74 instead names it the stage-two authority); and tested wave one's alternative explanations (registered-but-not-routable, frozen legacy artifact) — the registry, leaf manifest and the same file's RESOURCE_MAP all reject both.","alternativeExplanation":"Two alternatives were weighed. (a) The prose rosters could be a deliberate operator convention that surfaces six established modes while keeping the seventh machine-only — rejected: no artifact states that, and the README/description/SKILL.md all describe seven primary modes. (b) The runtime-capability proof (compiled routing resolves cli-hermes) could bound the severity to P1 — rejected as a category error for this review: it bounds runtime impact, not the document-contract break, and ROUTER.md remains the designated stage-two routing authority, so a reader or agent following the documented path is told the newest registered mode does not exist.","finalSeverity":"P0","confidence":0.9,"downgradeTrigger":"Downgrade to P1 only if ROUTER.md is shown to be superseded by the compiled router for this hub and explicitly marked non-authoritative, per wave one's stated test; correcting the three statements closes the finding outright.","transitions":[{"iteration":4,"from":null,"to":"P1","reason":"Initial wave-two re-verification adjudicated on prose-only impact"},{"iteration":4,"from":"P1","to":"P0","reason":"Re-adjudicated against wave-one F007's (P0) unmet downgrade trigger: no supersession or non-authoritative marking exists, so the routing-authority omission stands as release-blocking in this review's severity contract"}]}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md:101` | Angle 14's three hypothesis arms are each verified: ROUTER.md's three statements (F028, P0 after re-adjudication against wave one's unmet downgrade trigger), the six/seven SKILL.md split (F029, plus two more count errors in `system-deep-loop`), and the catalogs' three-of-seven (F031). The census additionally covers protocols (F030) and the cli-* sibling lists (F032). Partial because the artifacts cannot satisfy their own stated rosters as written. |
| checklist_evidence | notApplicable | hard | — | No per-iteration checklist rows in the phase spec. |
| feature_catalog_code | partial | overlay | `deep-review/feature-catalog/feature-catalog.md:150`; `runtime/feature-catalog/fanout/fanout-run.md:42` | The catalog claims were checked against their subject source files this iteration (F031); the remaining catalog claim sweep stays with angle 15. |
| playbook_capability | pending | overlay | `cli-external-orchestration/manual-testing-playbook/manual-testing-playbook.md:3,11` | Playbooks were read only for roster statements; two-CLI framing found and classified as scoped examples. Angle 15 owns the playbook-claim sweep. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Severity note: F028 was first drafted at P1 on runtime-impact grounds and escalated to P0 on re-adjudication. Wave-one `wave1-deepseek` F007 is the same defect at the same three statements; its one downgrade path (ROUTER.md superseded and marked non-authoritative) is unmet, and iteration 3 already proved the compiled pipeline reads the machine block inside this file rather than treating the document as retired. With an active P0 the lane's release-readiness state moves to release-blocking, matching wave one's terminal FAIL; the remaining nine findings are unchanged.
- Novelty justification: wave one found the `cli-hermes` roster omission (its F007) and the cli-ext count line (F008) in its angle-2 sweep, and the three-kind catalog claim as its F017; this iteration re-verifies those and expands the same class to protocols (F030), the sibling-list freeze (F032), and two additional count sites in `system-deep-loop/SKILL.md`. The value added is the census itself: the machine layer (schema, adapter maps, audit maps, compiled contracts, registries, live routing) is complete and correct at every point checked, so the defect surface is exactly four prose artifact classes, each with a named repair.

## Ruled Out

- **Routing capability is defective for `cli-hermes`**: ruled out by execution. Two hermes prompts route to `workflowMode: cli-hermes` through the compiled front door, and the fan-out adapter map plus audit maps implement the kind fully (`fanout-run.cjs:2721`, `executor-audit.ts:66,82,111,168`).
- **The `if_cli_copilot` branches are an active schema violation**: ruled out as a finding. `cli-copilot` is not in `EXECUTOR_KINDS`, so the kind cannot be parsed; the auto branch's own comment (`deep-review-auto.yaml:1121-1123`) acknowledges the absent kind and dispatches it as `kind:'native'`. It is dead legacy retained deliberately; recorded as an observation for the angle-16 variant census.
- **`deep-ai-council` rejecting `cli-codex` is a roster omission**: ruled out. The rejection is deliberate and carries an explicit message (`orchestrate-session.cjs:193-196`), and `cli-claude-code` is likewise outside the accept list by design.
- **`model-benchmark`'s six-kind `KNOWN_EXECUTORS` is an omission**: ruled out. The exclusions (`native`, `cli-codex`) are documented at the calling site (`feature-catalog.md:308`, `lane-b-mechanics.md:49`), and `profile-validator.cjs:31-41` mirrors the list with a hand-sync note.
- **Playbook two-CLI framing is a roster defect**: ruled out. The manual-testing-playbook paragraphs describe scoped routing examples (`cli-opencode` vs `cli-claude-code` disambiguation), not the mode set.
- **`plan`-time mode-count statements in `sk-code`**: not found. None of `sk-code/{SKILL.md,README.md,ROUTER.md}` states a numeric mode count, so the drift class is confined to the two hubs measured.

## Dead Ends

- **Settling the missing `if_cli_hermes` branch key from the tree**: no consumer of `branch_on` / `if_cli_*` exists in `.opencode/bin` or `.opencode/skills` (grep for readers returned nothing), so the branch-key matching semantics live outside the repository. The question — does a single-executor `--executor=cli-hermes` run reach the shared-builder branch the pi notes describe, or fall through with no branch — remains unresolved and is carried in the ledger as `unresolved`, not as a finding.
- **Census by grepping a kind name**: the first grep for `cli-hermes` surfaced the machine-block references but missed the per-mode bullet list (A2), because the omission is an absent string, not a present one; and grepping `cli-opencode` missed the duplicated-name sites in `cli-claude-code:381` and the two catalogs until the lists were read as lists. Enumeration defects require reading each statement, not searching for names.

## Recommended Next Focus

Iteration 5, angle 15 — stale references in catalogs and READMEs (wave one's F014-F020 class). Hand-offs from this iteration: (1) the duplicated `cli-opencode` names in `fanout-run.md:42`, `model-dispatcher.md:27` and `cli-claude-code/SKILL.md:381` are substitution artifacts — angle 15 should treat "A, B, and A" patterns as a corruption class and check the counts in those same files; (2) this iteration verified the executor-kind claims in the four catalogs, so angle 15's catalog sweep should skip those lines and focus on cited paths, layout generations and numeric counts; (3) the two council YAML `cli:` parameter lines and the confirm/auto branch sets are handed to wave2-glm angle 16 for the variant census rather than re-filed here.

Review verdict: FAIL
