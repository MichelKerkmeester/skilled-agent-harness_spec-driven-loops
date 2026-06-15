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
| `score-skill-benchmark.cjs` | Computes Lane C dimensions per scenario and aggregates. Mode A scores D1-intra, D2, D3, D5; D1-inter and D4 are reported unscored in Mode A (not faked) and the aggregate normalizes over measured dims. Point weights: D1-inter 12, D1-intra 13, D2 20, D3 15, D4 25, D5 15 (gate). Exports `scoreScenario`, `aggregate`, `computeDivergence`, `WEIGHTS`. |
| `build-report.cjs` | The ONLY writer of `report.md`. Renders the human markdown FROM the `report.json` object (anti-drift); accepts no score arguments. Exports `renderReport`. |
| `d4-ablation.cjs` | D4 usefulness ablation. Holds the D4 hallucination delta (skill-ON vs skill-OFF, graded by the Lane B grader) AND the opt-in `--d4` D4-R task-outcome ablation that grades a real change with the task-outcome rubric and reports it as the advisory `D4_task_outcome` (never collapsed into D4). Skill-OFF is approximate; scores stamp `attribution: "approximate"`. Exports `runD4Ablation`, `gradeAblation`, `runD4RAblation`, `gradeTaskOutcome`, and prompt builders. |
| `contamination-lint.cjs` | Pre-dispatch hint-free gate. Reuses the routers' own lowercased-substring match logic so "hint-free" is judged by the same mechanism that could be gamed. Banned vocabulary is built from the skill's identity (name/id, triggers, router keywords, intent keys, resource segments) and the private gold labels. A hard leak is a FIXTURE failure. Exports `buildBannedVocab`, `lintFixture`, `frontmatterTriggers`. |
| `advisor-probe.cjs` | D1-inter signal: does the skill-advisor route a domain prompt to the target skill? Runs the in-repo Python advisor CLI over the PUBLIC prompt (deterministic — reads the compiled SQLite skill graph), opt-in via `--advisor-mode=python`. Exports `probeAdvisor`, `scoreD1Inter`, `DEFAULT_ADVISOR_PY`. |
| `playbook-generator.cjs` | Opt-in staged scenario generator for skills with thin coverage. NEVER writes the live playbook — writes only to `manual_testing_playbook/_generated_staging/` and emits a promoteHint. Generated scenarios are tier `T1-auto` and must pass contamination, parser round-trip, structural, and self-consistency gates. Exports `generatePlaybook`, `analyzeCoverage`, `validateGenerated`, `renderScenarioMarkdown`. |
| `_args.cjs` | Shared space-form arg parser for Lane C (`--skill <v> --outputs-dir <v> ...`); bare flags become boolean true. Exports `parse`. |
| `tests/` | Lane C vitest suites: `skill-benchmark.vitest.ts`, `playbook-mode.vitest.ts`, `sk-code-router-sync.vitest.ts`. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `run-skill-benchmark.cjs` requires the in-lane modules directly; `executor-dispatch.cjs` lazy-requires `live-executor.cjs` and `browser-executor.cjs` so router mode stays dependency-free and CI-safe. `d4-ablation.cjs` requires `live-executor.cjs` and the Lane B grader at `../model-benchmark/scorer/grader/harness.cjs`. `advisor-probe.cjs` shells out to the Python advisor CLI under `system-skill-advisor/`. |
| Exports | Each module exports named functions (see KEY FILES). `router-replay.cjs` exports the deterministic router (`routeSkillResources`, `parseRouter`); `score-skill-benchmark.cjs` exports `scoreScenario`/`aggregate`/`WEIGHTS`; `build-report.cjs` exports only `renderReport`. The orchestrator's `main()` runs as a CLI. |
| Ownership | Lane C dispatch, scoring, and reporting live here. The 5-dimension grader and grader prompts are reused from `../model-benchmark/scorer/`. Mode routing and lane-path resolution live in `../shared/loop-host.cjs`. |
| Write policy | Diagnostic-by-default. The only writers are `build-report.cjs` (`report.md`, from JSON) and the orchestrator (`report.json`, plus `--d4` augmentation). `playbook-generator.cjs` writes only to a skill's `manual_testing_playbook/_generated_staging/`, opt-in via `createMissing`. Live dispatch requires `--trace-mode live`. |

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
| `node run-skill-benchmark.cjs --skill <root-or-id> --outputs-dir <path> [--trace-mode router\|live] [--scenarios <ids>] [--output <report.json>]` | CLI | Runs the Lane C benchmark and writes `report.json` + `report.md`. |
| `... --d4 [--d4-scenarios <ids>] [--grader-mode real\|mock]` | CLI (opt-in) | Adds the D4-R task-outcome ablation; requires `--trace-mode live`. Augments the report with advisory `D4_task_outcome`. |
| `run({ ... })` | Function | Programmatic orchestrator entry; returns the report object. |
| `routeSkillResources({ task, skillRoot })` | Function | Deterministic Mode A router replay used directly by tests and the generator. |

---

## 7. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skills/deep-loop-workflows/improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts
npx vitest run .opencode/skills/deep-loop-workflows/improvement/scripts/skill-benchmark/tests/playbook-mode.vitest.ts
npx vitest run .opencode/skills/deep-loop-workflows/improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
```

Expected result: all three Lane C suites pass.

---

## 8. RELATED

- [`scripts README`](../README.md)
- [`model-benchmark README`](../model-benchmark/README.md)
- [`scripts tests README`](../shared/tests/README.md)
- [`deep-improvement SKILL.md`](../../SKILL.md)
