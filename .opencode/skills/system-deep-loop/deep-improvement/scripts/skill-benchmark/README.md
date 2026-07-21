---
title: "skill-benchmark: Lane C benchmark scripts"
description: "Lane C scripts that benchmark a skill's real-world routing, discovery, efficiency, and usefulness — parse its playbook into gold, dispatch per scenario, score D1-D5, and render a dual report."
trigger_phrases:
  - "skill benchmark scripts"
  - "run-skill-benchmark"
  - "Lane C D5 connectivity gate"
  - "playbook scenario scoring"
---

# skill-benchmark: Lane C benchmark scripts

---

## 1. OVERVIEW

`skill-benchmark/` owns the Lane C (skill-benchmark) executables: benchmark a target skill's live routing, discovery, efficiency, and usefulness against its own authored `manual_testing_playbook`, then score the result on five dimensions and render a dual machine/human report. Private gold never crosses the dispatch boundary — scenarios are dispatched on a public prompt and joined back to gold only at scoring time.

Current state:

- `run-skill-benchmark.cjs` is the orchestrator (`loop-host --mode=skill-benchmark`). It runs the D5 connectivity hard gate FIRST, loads playbook scenarios into gold, dispatches per scenario, aggregates, and writes `report.json` then renders `report.md` from it.
- Three executors back the scenarios: `router-replay.cjs` (Mode A deterministic), `live-executor.cjs` (Mode B `cli-opencode`), and `browser-executor.cjs` (`bdg`). `executor-dispatch.cjs` is the seam that routes by `classKind` + trace mode and normalizes every executor into one observed-result shape.
- `score-skill-benchmark.cjs` computes the D1-D5 dimensions per scenario and aggregates with point weights; Mode A normalizes over only the dimensions it can measure rather than faking the live-only ones. It also carries the advisory `D4_task_outcome` signal.
- `d4-ablation.cjs` holds the D4 hallucination ablation AND the opt-in `--d4` D4-R task-outcome ablation (advisory `D4_task_outcome`, never collapsed into D4).
- Supporting modules: `contamination-lint.cjs` (pre-dispatch hint-free gate), `advisor-probe.cjs` (D1-inter advisor signal), `playbook-generator.cjs` (opt-in staged scenario generator), and `_args.cjs` (space-form arg parser). `load-playbook-scenarios.cjs` is the corpus loader.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                        skill-benchmark/                           │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────┐
│ loop-host.cjs    │  (../shared) router, --mode=skill-benchmark
│ resolves Lane C  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│ run-skill-benchmark.cjs  (orchestrator)                   │
│   1. d5-connectivity.cjs  — HARD GATE, runs FIRST         │
│   2. load-playbook-scenarios.cjs → gold                   │
│   3. per scenario: contamination-lint → executor-dispatch │
└────────┬─────────────────────────────────┬───────────────┘
         │                                  │
         ▼                                  ▼
┌──────────────────┐            ┌──────────────────────────────────┐
│ executor-        │ ─routing/  │ router-replay.cjs   (Mode A)     │
│ dispatch.cjs     │  advisor ─▶│ live-executor.cjs   (Mode B)     │
│ classKind +      │            │ browser-executor.cjs (bdg)       │
│ traceMode router │ ─browser ─▶└──────────────────────────────────┘
└────────┬─────────┘
         │ observed result
         ▼
┌──────────────────┐      ┌──────────────────────────────────┐
│ score-skill-     │ ───▶ │ advisor-probe.cjs (D1-inter)     │
│ benchmark.cjs    │      │ D1-D5 + advisorySignals          │
└────────┬─────────┘      └──────────────────────────────────┘
         │
         ▼
┌──────────────────┐      ┌──────────────────────────────────┐
│ build-report.cjs │ ───▶ │ report.json  +  report.md        │
│ md FROM json     │      │ (md rendered from json)          │
└──────────────────┘      └──────────────────────────────────┘

Opt-in: run-skill-benchmark.cjs --d4 ──▶ d4-ablation.cjs (D4-R)
        augments report.{json,md} with advisory D4_task_outcome
```

---

## 3. DIRECTORY TREE

```text
skill-benchmark/
+-- run-skill-benchmark.cjs       # Orchestrator: D5 gate, load gold, dispatch, score, report
+-- d5-connectivity.cjs           # Static structural scan — the D5 hard gate (runs first)
+-- load-playbook-scenarios.cjs   # Parses manual_testing_playbook into normalized gold scenarios
+-- executor-dispatch.cjs         # Seam: routes by classKind+traceMode, normalizes observed result
+-- router-replay.cjs             # Mode A deterministic in-skill smart-router replay
+-- live-executor.cjs             # Mode B live executor (cli-opencode)
+-- browser-executor.cjs          # Mode B executor for browser-gated scenarios (bdg)
+-- score-skill-benchmark.cjs     # Per-scenario D1-D5 + aggregate + advisorySignals
+-- build-report.cjs              # Renders report.md FROM report.json (anti-drift)
+-- d4-ablation.cjs               # D4 hallucination ablation + opt-in --d4 D4-R task-outcome
+-- contamination-lint.cjs        # Pre-dispatch hint-free gate (leak = fixture failure)
+-- advisor-probe.cjs             # D1-inter signal: does the advisor route to this skill?
+-- playbook-generator.cjs        # Opt-in staged scenario generator (_generated_staging/)
+-- _args.cjs                     # Shared space-form arg parser for Lane C
`-- tests/                        # Lane C vitest suites
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `run-skill-benchmark.cjs` | Lane C orchestrator. Resolves the target skill root, runs the D5 connectivity gate FIRST, loads scenarios, contamination-lints each public prompt, dispatches, aggregates, writes `report.json` and renders `report.md`. Exports `run`, `augmentWithD4R`, `resolveSkillRoot`, `loadFixtures`. |
| `d5-connectivity.cjs` | Static structural scan and D5 hard gate. Runs before any dispatch and caps the verdict regardless of weighted score: catches dead RESOURCE_MAP routes, dead intent keys, paths escaping the skill root, and orphan references (reported, not gated). An unparseable router is the strongest gate failure. Exports `scanConnectivity`, `listMarkdownRefs`. |
| `load-playbook-scenarios.cjs` | Corpus loader. Parses a skill's `manual_testing_playbook` (sk-code root-index shape and sk-doc per-scenario frontmatter shape) into one normalized scenario shape with gold AS AUTHORED — a stale path is a finding, not a silent drop. Exports `loadPlaybookScenarios`, `classifyKind`, `extractPaths`, `parseRootIndex`. |
| `executor-dispatch.cjs` | The seam between orchestrator and executors. Routes `classKind` routing/advisor + trace-mode router→`router-replay`, +live→`live-executor`, browser→`browser-executor`, and normalizes each into one observed-result the scorer consumes. Lazy-requires live/browser siblings. Exports `dispatchScenario`. |
| `router-replay.cjs` | Mode A deterministic in-skill smart-router replay. Extracts INTENT_SIGNALS + RESOURCE_MAP from the target SKILL.md and reproduces its substring-scoring semantics. Exit 0 on replay, 2 on unparseable router. Exports `routeSkillResources`, `parseRouter`, `scoreIntents`, `selectIntents`. |
| `live-executor.cjs` | Mode B live executor via `opencode run`. Runs routing/advisor scenarios as routing-ANALYSIS prompts, reads back stated routing + tool_use corroboration, normalizes to the observed-result shape. Self-contained dispatch (no `--agent`, uses `--format json`). Exports `runLiveScenario`, `parseLiveResult`, `buildLiveDispatchPrompt`, `runDispatch`, and parsing helpers. |
| `browser-executor.cjs` | Mode B executor for browser-gated scenarios (MR-*, CB-*) via `bdg`. Honesty rule: only capturable signals get PASS/FAIL; the rest report PARTIAL-NEEDS-ARTIFACT or SKIP-NO-BROWSER, never a fabricated PASS. Runs serially. Exports `executeBrowserScenario`, `verdictToDims`, `motionSandboxHtml`. |
| `score-skill-benchmark.cjs` | Computes Lane C dimensions per scenario and aggregates. Mode A scores D1-intra, D2, D3, D5; D1-inter and D4 are reported unscored in Mode A (not faked) and the aggregate normalizes over measured dims. For an advisor-invisible skill (no `graph-metadata.json` at its root), D1-inter is instead `excluded-by-design` under `excludedDimensions`, carrying the owning advisor identity in `delegatedMeasure.targetSkill`. Point weights: D1-inter 12, D1-intra 13, D2 20, D3 15, D4 25, D5 15 (gate). Exports `scoreScenario`, `aggregate`, `computeDivergence`, `WEIGHTS`. |
| `build-report.cjs` | The ONLY writer of `report.md`. Renders the human markdown FROM the `report.json` object (anti-drift); accepts no score arguments. Exports `renderReport`. |
| `d4-ablation.cjs` | D4 usefulness ablation. Holds the D4 hallucination delta (skill-ON vs skill-OFF, graded by the Lane B grader) AND the opt-in `--d4` D4-R task-outcome ablation that grades a real change with the task-outcome rubric and reports it as the advisory `D4_task_outcome` (never collapsed into D4). Skill-OFF is approximate; scores stamp `attribution: "approximate"`. Exports `runD4Ablation`, `gradeAblation`, `runD4RAblation`, `gradeTaskOutcome`, and prompt builders. |
| `contamination-lint.cjs` | Pre-dispatch hint-free gate. Reuses the routers' own lowercased-substring match logic so "hint-free" is judged by the same mechanism that could be gamed. Banned vocabulary is built from the skill's identity (name/id, triggers, router keywords, intent keys, resource segments) and the private gold labels. A hard leak is a FIXTURE failure. Exports `buildBannedVocab`, `lintFixture`, `frontmatterTriggers`. |
| `advisor-probe.cjs` | D1-inter signal: does the skill-advisor route a domain prompt to the target skill? Runs the in-repo Python advisor CLI over the PUBLIC prompt (deterministic — reads the compiled SQLite skill graph), opt-in via `--advisor-mode=python`. Exports `probeAdvisor`, `scoreD1Inter`, `DEFAULT_ADVISOR_PY`. |
| `playbook-generator.cjs` | Opt-in staged scenario generator for skills with thin coverage. NEVER writes the live playbook — writes only to `manual-testing-playbook/_generated_staging/` and emits a promoteHint. Generated scenarios are tier `T1-auto` and must pass contamination, parser round-trip, structural, and self-consistency gates. Exports `generatePlaybook`, `analyzeCoverage`, `validateGenerated`, `renderScenarioMarkdown`. |
| `_args.cjs` | Shared space-form arg parser for Lane C (`--skill <v> --outputs-dir <v> ...`); bare flags become boolean true. Exports `parse`. |
| `tests/` | Lane C vitest suites: `skill-benchmark.vitest.ts`, `playbook-mode.vitest.ts`, `sk-code-router-sync.vitest.ts`. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `run-skill-benchmark.cjs` requires the in-lane modules directly; `executor-dispatch.cjs` lazy-requires `live-executor.cjs` and `browser-executor.cjs` so router mode stays dependency-free and CI-safe. `d4-ablation.cjs` requires `live-executor.cjs` and the Lane B grader at `../model-benchmark/scorer/grader/harness.cjs`. `advisor-probe.cjs` shells out to the Python advisor CLI under `system-skill-advisor/`. |
| Exports | Each module exports named functions (see KEY FILES). `router-replay.cjs` exports the deterministic router (`routeSkillResources`, `parseRouter`); `score-skill-benchmark.cjs` exports `scoreScenario`/`aggregate`/`WEIGHTS`; `build-report.cjs` exports only `renderReport`. The orchestrator's `main()` runs as a CLI. |
| Ownership | Lane C dispatch, scoring, and reporting live here. The 5-dimension grader and grader prompts are reused from `../model-benchmark/scorer/`. Mode routing and lane-path resolution live in `../shared/loop-host.cjs`. |
| Write policy | Diagnostic-by-default. The only writers are `build-report.cjs` (`report.md`, from JSON) and the orchestrator (`report.json`, plus `--d4` augmentation). `playbook-generator.cjs` writes only to a skill's `manual-testing-playbook/_generated_staging/`, opt-in via `createMissing`. Live dispatch requires `--trace-mode live`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ target skill root + outputs dir          │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ d5-connectivity.cjs — HARD GATE first    │
│ caps verdict on structural failure       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ load-playbook-scenarios.cjs → gold       │
│ contamination-lint each public prompt    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ executor-dispatch.cjs per scenario       │
│ router-replay | live | browser           │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ score-skill-benchmark.cjs                │
│ D1-D5 + advisorySignals → aggregate      │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ report.json → build-report.cjs → report.md│
│ (--d4 augments both with D4_task_outcome) │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `node run-skill-benchmark.cjs --skill <root-or-id> --outputs-dir <path> [--trace-mode router\|live] [--scenarios <ids>] [--output <report.json>] [--route-gold on\|off\|auto] [--compiled-routing-parity on\|off\|auto]` | CLI | Runs the Lane C benchmark and writes `report.json` + `report.md`. |
| `... --d4 [--d4-scenarios <ids>] [--grader-mode real\|mock]` | CLI (opt-in) | Adds the D4-R task-outcome ablation; requires `--trace-mode live`. Augments the report with advisory `D4_task_outcome`. |

### Route-gold hard gate (`--route-gold on|off|auto`)

Mode A consumes every authored `expected_intent`/`expected_resources` assertion as hard route gold: intent gold is an exact-set assertion (the rejection labels `none`/`defer`/`UNKNOWN` assert the empty intent set), resource gold is an exact-assembly assertion for frontmatter (sk-doc-shape) corpora and a must-include + no-forbidden-prefix assertion for sk-code-shape corpora. A present-but-unparseable gold block is a LOUD counted parse failure, never a silent skip. The report always records the flag state, row count, matches, and per-scenario violation detail under `routeGold`; when the gate is enforced, any violation (including a parse failure) flips the verdict to `BLOCKED-BY-ROUTE-GOLD` and the process exits 3.

- `auto` (default): enforced when the target skill is hub-type (ships a `hub-router.json`), off otherwise — existing non-hub baselines keep their meaning.
- `on` / `off`: explicit per-run override (e.g. `off` while triaging a hub corpus's newly-surfaced violations).

### Compiled-routing parity gate (`--compiled-routing-parity on|off|auto`)

This gate defaults to `off`, preserving the baseline Mode A report and exit behavior. `on` enables it for the selected target, while explicit `auto` enables it for hub-type skills and leaves flat skills off. For an eligible hub, each route-gold scenario invokes the public `.opencode/bin/compiled-route.cjs` front door in a child process whose cloned environment sets `SPECKIT_COMPILED_ROUTING=1`; the parent environment is never changed. The legacy replay and compiled projection must both pass the same frozen route-gold evaluator and compare equal on action, selection kind, and ordered workflow/surface targets.

The shared status probe distinguishes a missing manifest (`legacy-by-construction`), stale manifest (`re-mint-required` drift), and fresh-manifest front-door breakage. The benchmark reports these states but never mints, repairs, or edits activation data. Status authority remains the compiled-routing decision contract; Lane C only consumes it.

`report.json` is authoritative. Its `compiledRouting` block records `flagForcedOn`, eligible rows, parity counts, drift rows, breakages, frozen scorer hashes before and after the run, full routing projections, and the first differing field. `report.md` is rendered from that JSON. Drift or breakage raises `BLOCKED-BY-COMPILED-DRIFT` and exit 3 unless a higher-precedence structural, registry, or route-gold block already owns the verdict.

Default-resource semantics are declared by the router itself: `DEFAULT_RESOURCE_SEMANTICS = "fallback-only"` (SKILL.md/router doc) or `routerPolicy.defaultResourceSemantics` (hub-router.json) makes the default a defer-time suggestion the replay never assembles; a router with no declaration keeps the legacy always-union replay behavior.
| `run({ ... })` | Function | Programmatic orchestrator entry; returns the report object. |
| `routeSkillResources({ task, skillRoot })` | Function | Deterministic Mode A router replay used directly by tests and the generator. |

---

## 7. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-deep-loop/deep-improvement/scripts
npx vitest run skill-benchmark/tests --config vitest.config.mjs
```

Expected result: all 18 Lane C suites and 247 tests pass. The compiled-routing suite covers default-off baseline isolation, child-only flag forcing, dual route-gold checks, ordered projection equality, status classification, report rendering, and frozen-scorer integrity.

---

## 8. RELATED

- [`scripts README`](../README.md)
- [`model-benchmark README`](../model-benchmark/README.md)
- [`scripts tests README`](../shared/tests/README.md)
- [`deep-improvement SKILL.md`](../../SKILL.md)
