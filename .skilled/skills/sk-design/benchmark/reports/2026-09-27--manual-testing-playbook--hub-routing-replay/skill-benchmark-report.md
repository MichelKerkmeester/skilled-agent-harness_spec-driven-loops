---
title: "sk-design Playbook Run: 2026-09-27 hub-routing replay"
description: "First routing accuracy number for the sk-design hub: 40 of 52 scored playbook scenarios reach their gold mode through the compiled front door, with 1 n/a. Chart scenarios route to the default mode because the chart vocabulary holds phrases only, and SD-007 drifts because its gold asks for a chart its prompt never names."
trigger_phrases:
  - "sk-design hub routing replay"
  - "sk-design routing accuracy"
  - "2026-09-27 sk-design validation"
  - "sk-design playbook run"
  - "SD-007 drift diagnosis"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# sk-design Playbook Run: 2026-09-27 hub-routing replay

_The first hub-level routing number for sk-design. Every playbook scenario in the hub and its four modes went through the compiled front door once. Raw captures sit under `raw/` beside this file._

---

## 1. OVERVIEW AND RUN IDENTITY

| Field | Value |
|---|---|
| Date | 2026-09-27 |
| Commit | `fb04862cee` (the run script landed in this commit at 18:30 +0200). No file under `.skilled/skills/sk-design/` or `.skilled/bin/` changed between it and the report's writing |
| Corpus | 53 scenarios: the 4 hub-playbook scenarios that carry gold, plus all 49 mode-playbook scenarios (chart 9, diagram 10, fundamentals 12, md-generator 18) |
| Gold-scored part | `node .skilled/bin/compiled-route-admission.cjs --hub sk-design --json`, verdict `drift`, exit 1 |
| Replay part | `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "<prompt>"`, one call per mode scenario |
| Serving state | Compiled. All 49 replay answers carry `effectivePolicyHash` `cdc87474…` at generation 1 |
| Executor | The orchestrating Claude Code session captured `raw/`. A separate Claude Opus 5.5 session wrote this report from the captures without re-running them |
| Model or network calls | None. Both tools score keywords locally |

```bash
node .skilled/bin/compiled-route-admission.cjs --hub sk-design --json > raw/admission.json
bash raw/mode-routing-run.sh > raw/mode-routing.txt
```

Run both from the repository root, because the script calls the front door by a relative path.

**Determinism.** The orchestrator reported that a second replay run was byte-identical. No second capture is kept in `raw/`, so that claim is reported here, not re-checked. The mechanism supports it: the sk-design router is a lowercase substring count with a fixed tie-break (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs:37-43`, `:202-223`), with nothing random and no model in the path.

---

## 2. VERDICT

**40 of 52 scored, 1 n/a (`SKD-031`), 12 misses.**

| Part | Scored | Match | Miss | n/a |
|---|---|---|---|---|
| Admission (hub playbook, gold in frontmatter) | 4 | 3 | 1 (`SD-007`) | 0 |
| Replay, chart playbook | 9 | 1 | 8 | 0 |
| Replay, diagram playbook | 10 | 10 | 0 | 0 |
| Replay, fundamentals playbook | 11 | 11 | 0 | 1 |
| Replay, md-generator playbook | 18 | 15 | 3 | 0 |
| **Total** | **52** | **40** | **12** | **1** |

Scored plus n/a is 53, the whole corpus.

The load-bearing finding differs from the headline: **the default mode hides vocabulary gaps.** A prompt that hits no keyword in any mode goes to `sk-design-fundamentals` (`hub-router.json:5`, `canary-router.cjs:301-307`). Seven of the eleven fundamentals matches reached their gold that way, with zero keyword hits. Nine of the twelve misses reached `sk-design-fundamentals` the same way. The fundamentals row therefore measures the default setting, not the fundamentals vocabulary. That vocabulary hit only 3 of its own 12 prompts.

**Sensitivity.** Scoring every replay scenario strictly against the mode whose playbook holds it moves two rows. `SKD-030` becomes a miss and `SKD-031` becomes a match. The replay then reads 37 of 49 and the whole run 40 of 53. The match count is 40 under either reading.

---

## 3. SCORING RULES AND BOUNDARY GOLD

**Admission rows** use the harness's own rules (`.skilled/bin/lib/compiled-route-admission.cjs:12-19`). Every gold mode must be among the routed modes (`:309-318`).

**Replay rows** match when the single routed mode equals the gold. All 49 answers were `action: route` with `selectionKind: single`, so no bundle needed a partial-credit rule. The gold is the mode whose playbook holds the scenario, except where the scenario names a different expected route. Four scenarios sit on a boundary and were read by hand.

| Scenario | What the scenario says | Gold scored | Why |
|---|---|---|---|
| `SKD-030` | `stage: negative` (`sk-design-fundamentals/manual-testing-playbook/boundary/extraction-defers-to-md-generator.md:4`). Expects `sk-design-md-generator` ranked first (`:33`, `:35`) | `sk-design-md-generator` | The expected target is a mode of this hub, so the scenario's own answer is scoreable at the hub front door. The harness's negative rule (pass only on no route, `compiled-route-admission.cjs:276`, `:288-292`) was not used: it treats "negative" as "not this hub", and this target is inside the hub |
| `SKD-031` | `stage: negative` (`.../boundary/implementation-defers-to-sk-code.md:4`). Expects a route to `sk-code` (`:33`, `:35`) | n/a | `sk-code` is outside this hub. A no-signal prompt always routes to the default mode (`hub-router.json:17`, `canary-router.cjs:301-307`), so no hub-level answer can express the expected result. The scenario's own command scores the advisor stage (`:51`), which this replay does not run |
| `CMD-002` | Real user request: `When someone says "redraw this drawio", the system should route to the diagram skill.` (`sk-design-diagram/manual-testing-playbook/command-and-hub-integration/hub-registration.md:28`) | `sk-design-diagram` | The owning mode and the stated expectation agree. The replay used the real-user-request bullet, as for every scenario. The `Prompt` field (`:29`) is a registration-check instruction, not a routing prompt |
| `CHT-008` | Chart and diagram boundary: the chart request goes to chart, the neighbour keeps the diagram request (`.../delivery-and-routing/form-choice-and-the-diagram-boundary.md:36`, `:38`) | `sk-design-chart` | The owning mode and the stated expectation agree |

---

## 4. PER-SCENARIO RESULTS

The **Hits** column shows each mode's stage-one score as matched keywords times the mode weight. It was re-derived from `hub-router.json` with the router's substring rule. That re-derivation reproduces the routed mode of all 49 replay answers and all 4 admission answers, so the column is derived evidence, not captured output. `none` means no mode scored and the default mode took the prompt.

### Admission

| Scenario | Stage | Gold | Routed | Hits | Result |
|---|---|---|---|---|---|
| `SD-H05` | holdout | diagram | diagram | diagram 9 (`diagram`, `text diagram`, `decision branch`) | match |
| `SD-H10` | holdout | diagram | diagram | diagram 3 (`text characters`) | match |
| `SD-005` | fitted | diagram | diagram | diagram 3 (`flowchart`) | match |
| `SD-007` | fitted | chart + diagram | diagram | diagram 3 (`flowchart`) | **miss** (`wrong-mode`) |

### Replay

Every row routed with `action: route`, `selectionKind: single` and exit 0.

| Scenario | Playbook | Gold scored | Routed | Hits | Result |
|---|---|---|---|---|---|
| `CHT-001` | chart | chart | fundamentals | none | **miss** |
| `CHT-002` | chart | chart | fundamentals | none | **miss** |
| `CHT-003` | chart | chart | fundamentals | none | **miss** |
| `CHT-004` | chart | chart | fundamentals | none | **miss** |
| `CHT-005` | chart | chart | fundamentals | fundamentals 4 (`colour`) | **miss** |
| `CHT-006` | chart | chart | fundamentals | none | **miss** |
| `CHT-007` | chart | chart | fundamentals | none | **miss** |
| `CHT-008` | chart | chart | chart | chart 3 (`waterfall chart`) | match |
| `CHT-009` | chart | chart | fundamentals | none | **miss** |
| `CAP-001` | diagram | diagram | diagram | diagram 3 (`diagram`) | match |
| `CMD-001` | diagram | diagram | diagram | `/design:diagram` command | match |
| `CMD-002` | diagram | diagram | diagram | diagram 6 (`diagram`, `drawio`) | match |
| `DIA-001` | diagram | diagram | diagram | diagram 6 (`diagram`, `architecture diagram`) | match |
| `DIA-002` | diagram | diagram | diagram | diagram 9 (`diagram`, `swimlane diagram`, `swimlane`) | match |
| `DIA-003` | diagram | diagram | diagram | diagram 3 (`diagram`) | match |
| `DIA-004` | diagram | diagram | diagram | diagram 3 (`diagram`) | match |
| `IMP-001` | diagram | diagram | diagram | diagram 6 (`diagram`, `draw.io`) | match |
| `IMP-002` | diagram | diagram | diagram | diagram 3 (`flowchart`) | match |
| `IMP-003` | diagram | diagram | diagram | diagram 6 (`diagram`, `architecture diagram`) | match |
| `SKD-001` | fundamentals | fundamentals | fundamentals | none | match |
| `SKD-002` | fundamentals | fundamentals | fundamentals | none | match |
| `SKD-003` | fundamentals | fundamentals | fundamentals | none | match |
| `SKD-004` | fundamentals | fundamentals | fundamentals | none | match |
| `SKD-010` | fundamentals | fundamentals | fundamentals | fundamentals 4 (`padding`) | match |
| `SKD-011` | fundamentals | fundamentals | fundamentals | none | match |
| `SKD-012` | fundamentals | fundamentals | fundamentals | none | match |
| `SKD-020` | fundamentals | fundamentals | fundamentals | fundamentals 4 (`spacing`) | match |
| `SKD-021` | fundamentals | fundamentals | fundamentals | fundamentals 4 (`contrast`) | match |
| `SKD-022` | fundamentals | fundamentals | fundamentals | none | match |
| `SKD-030` | fundamentals | md-generator (section 3) | md-generator | md-generator 4 (`extract`) | match |
| `SKD-031` | fundamentals | n/a (section 3) | fundamentals | none | n/a |
| `A11Y-001` | md-generator | md-generator | fundamentals | none | **miss** |
| `BOUNDARY-001` | md-generator | md-generator | md-generator | md-generator 4 (`extract`) | match |
| `CLUSTER-001` | md-generator | md-generator | fundamentals | fundamentals 4 (`color`) | **miss** |
| `DARKMODE-001` | md-generator | md-generator | md-generator | md-generator 4 (`style reference`) | match |
| `DETECT-001` | md-generator | md-generator | md-generator | md-generator 4 (`extract`) | match |
| `ESCALATE-001` | md-generator | md-generator | md-generator | md-generator 4 (`extract`) | match |
| `EXTRACT-001` | md-generator | md-generator | md-generator | md-generator 4 (`extract`) | match |
| `FIDELITY-001` | md-generator | md-generator | md-generator | md-generator 4 (`style reference`) | match |
| `GUIDED-014` | md-generator | md-generator | md-generator | md-generator 4 (`design.md`) | match |
| `INTERACT-001` | md-generator | md-generator | md-generator | md-generator 4 (`extract`) | match |
| `PROCCARD-001` | md-generator | md-generator | md-generator | md-generator 12 (`extract`, `design.md`, `measure`) | match |
| `PROCCARD-002` | md-generator | md-generator | md-generator | md-generator 12 (`extract`, `style reference`, `measure`) | match |
| `PROCCARD-003` | md-generator | md-generator | md-generator | md-generator 4 (`design.md`) | match |
| `PROVENANCE-001` | md-generator | md-generator | fundamentals | none | **miss** |
| `REPORT-001` | md-generator | md-generator | md-generator | md-generator 4 (`extract`) | match |
| `SETUP-001` | md-generator | md-generator | md-generator | md-generator 8 (`extract`, `from a url`) | match |
| `STUDY-015` | md-generator | md-generator | md-generator | md-generator 4 (`style reference`) | match |
| `VALIDATE-001` | md-generator | md-generator | md-generator | md-generator 4 (`style reference`) | match |

Recount against `raw/`: 49 `### ` blocks, 49 `RC: 0` lines, 49 `"action":"route"` and 49 `"selectionKind":"single"`. The table holds 37 matches, 11 misses and 1 n/a, and each routed mode equals the `workflowMode` in its capture.

---

## 5. FINDINGS

**How a route is picked.** Stage one gives each mode a score of matched keywords times its weight (`canary-router.cjs:202-213`). A keyword matches when it appears anywhere in the lowercased prompt (`:37-43`). A mode's keywords are the keywords of its hub-router classes and nothing else (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs:215-225`, `:258`). Modes within `ambiguityDelta` 1 of the top score route together (`canary-router.cjs:219-223`). No score at all routes to `defaultMode` (`:301-307`). Every cause below follows from these rules.

### Cause 1: no keyword in any mode, so the default mode takes the prompt (9 misses)

`CHT-001`, `CHT-002`, `CHT-003`, `CHT-004`, `CHT-006`, `CHT-007`, `CHT-009`, `A11Y-001` and `PROVENANCE-001` score zero in every mode and land on `sk-design-fundamentals`.

- **Chart (7).** Every chart keyword pairs the noun with a verb phrase or a chart type, such as `make a chart` (`hub-router.json:141`) or `bar chart of` (`:155`). Bare `chart` is not a keyword. `Make me this chart, then open it and tell me if anything is cut off.` (`CHT-003`) misses `make a chart` because the substring must appear whole. `Turn these depot pick times into a chart I can put in the board pack.` (`CHT-001`) and `Send me the chart so I can open it on my laptop on the train.` (`CHT-007`) name a chart and hit nothing. **Confirmed** by the re-derivation, which finds zero hits in every mode for all seven prompts.
- **Why bare `chart` is absent.** The router comment names the tension: this vocabulary mixes phrases like `org chart` with the short noun `chart` (`canary-router.cjs:19-23`). The diagram class holds `org chart`, `gantt chart` and `radar chart` (`hub-router.json:112-115`), so a bare `chart` keyword would also score those diagram prompts for chart. **Inferred** as the reason for the omission. The comment does not say it outright.
- **md-generator (2).** `Does the design system capture accessibility data?` (`A11Y-001`) and `Walk through each value in this design system and tell me where it came from before we trust it.` (`PROVENANCE-001`) name the design system but not one extraction keyword. The class holds `design tokens`, `style reference` and `style guide` (`hub-router.json:86-97`), not `design system`. The only accessibility keyword is `accessibility contrast` (`:82`), under fundamentals. **Confirmed** by the re-derivation.

### Cause 2: a design-decision word outscores the owning mode (2 misses)

`Restyle these charts to our brand colours.` (`CHT-005`) hits `colour` (`hub-router.json:67`), giving fundamentals 4. The chart class only knows the whole phrase `chart colour system` (`:151`), so chart scores 0. `Confirm the color tokens are clustered and stability-classified correctly.` (`CLUSTER-001`) hits `color` (`:68`), giving fundamentals 4, while md-generator holds `design tokens` (`:90`) and not `color tokens`. **Confirmed** by the re-derivation.

### Cause 3: the gold asks for a mode the prompt never names (1 miss)

`SD-007`. Section 6 has the diagnosis.

### Observations that are not misses

- **The default mode inflates fundamentals.** `SKD-001`, `SKD-002`, `SKD-003`, `SKD-004`, `SKD-011`, `SKD-012` and `SKD-022` match with zero hits. **Confirmed.** Any vocabulary change that gives these prompts a stray hit elsewhere turns them into misses, and no current check would say why.
- **A negative scenario cannot pass at this hub through a free-text prompt.** The router returns a non-route only for the word `forbidden`, a `dependency-failure` or `clarify` constraint and an explicit mode that names nothing (`canary-router.cjs:282-301`). A plain prompt gets none of those, so the default mode catches it. **Confirmed** from the code. This is why `SKD-031` is n/a and not a miss.
- **`PROCCARD-002` matches through a negated word.** `Study the existing style reference as a calibration example without extracting or writing measured artifacts.` scores 12 from three hits. Two of them, `extract` inside `extracting` and `measure` inside `measured`, come from the clause that tells the agent not to extract or measure. It reaches the right mode, and `style reference` alone would have taken it there. **Confirmed** as the mechanism. Whether it matters for real traffic is **inferred**.

### Fixes named, not proposed

Only SD-007's fix is set out, in section 6. The other gaps are named for their owner: the chart class has no entry for a bare chart request, the extraction class has no `design system` or `color tokens` entry and the default mode hides no-signal prompts from this measurement.

---

## 6. SD-007 DIAGNOSIS AND THE OWNER'S OPTIONS

### Cause

**The gold is stale against its prompt. The router is doing what its vocabulary says.** **Confirmed.**

The prompt is `Improve doc quality and add flowcharts for the new feature docs.` (`manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md:54-55`). It holds one keyword from any class: `flowchart` (`hub-router.json:126`), as a substring of `flowcharts`. That gives diagram 3. No chart keyword in `hub-router.json:140-172` appears in the prompt, so chart scores 0. A gap of 3 is outside `ambiguityDelta` 1 (`:6`), so the router answers diagram alone. The harness then reports `missing sk-design-chart; routed sk-design-diagram` (`raw/admission.json`, scenario `SD-007`).

The gold asks for `sk-design-chart+sk-design-diagram` (`ambiguous-multi-intent.md:6`, `:12-21`). The scenario explains how that happened (`:37-41`). The pair used to be document quality plus flowchart, in the documentation hub. When both canvases moved to the design hub, the gold was re-pointed from document quality to chart and the prompt kept its document-quality wording. The prompt asks for better docs and flowcharts. It names no data and no chart. The body is stale in the same way: it still asks for an intent from `VALUES, REVIEW, CHART, FLOWCHART, EXTRACT` (`:72`) and names "the sk-doc router under test" (`:133`).

### Option (a): vocabulary change plus a re-mint

**Change.** Add one keyword, `"flowcharts"`, to `create-chart-aliases.keywords` (`hub-router.json:139-173`). Then re-mint the activation manifest with the routing owner's tool (`.skilled/bin/compiled-route-manifest.cjs:29-30`):

```bash
node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-design --skill-root .skilled/skills/sk-design
node .skilled/bin/compiled-route-status.cjs --hub sk-design
```

**Effect.** Chart and diagram both score 3, so the router returns the ordered bundle `sk-design-chart`, `sk-design-diagram`. That meets the harness's must-include rule (`compiled-route-admission.cjs:309-318`), so admission should read 4 of 4. **Derived** from the re-derivation, not observed. It needs the post-change admission run to confirm.

**Does it move a matching scenario? No.** No other prompt in the corpus contains `flowcharts`: `grep -c flowcharts raw/mode-routing.txt` prints 0, and the re-derivation with the keyword added moves only `SD-007`. `IMP-002` and `SD-005` say `flowchart` in the singular and keep routing to diagram alone. **Derived.**

**Cost.** One line plus a new policy hash and a re-minted manifest outside `.skilled/skills/sk-design/`. Another hub's precedent also copied the runtime manifest over its authored twin, and sk-design has one under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-design/manifest.json`. UNKNOWN whether the `refresh` verb updates that twin, until the tool runs. The larger cost is what the router learns. The plural `flowcharts` becomes chart evidence while the singular `flowchart` does not, so every future plural flowchart request loads the chart mode. That fits the live router to a stale test.

The broader variant, a bare `chart` keyword, is not the smallest change. It would fix the seven chart misses in cause 1. It would also move `IMP-002` from a diagram match to a chart and diagram bundle, which fails the no-regression check. It would also move `SD-005` to a bundle (still a pass under must-include) and `CHT-005` to a fundamentals and chart bundle. **Derived** from the re-derivation.

### Option (b): frontmatter-only gold correction

**Change.** In `ambiguous-multi-intent.md`, set `expected_workflow_mode` (`:12`) and `expected_intent` (`:6`) to `sk-design-diagram`. Delete the two chart leaf pairs (`:14-17`) and the two chart entries in `expected_resources` (`:8-9`). Rewrite `title` (`:3`) and `description` (`:4`), which name the chart tie and sit in the same frontmatter. The prompt stays.

**Effect.** The router already routes diagram and both remaining leaves belong to diagram, so admission should read 4 of 4. **Derived**, not observed. No router file changes, so the policy hash and the manifest stay as they are. **Inferred** from the compiler reading `hub-router.json` and the registries, not the playbook.

**Cost.** Up to 10 frontmatter lines in one file, with no re-mint. Chart loses its only gold-carrying hub scenario: `raw/admission.json` lists `sk-design-chart` with 1 scenario, which becomes 0. The hub also loses its only multi-mode gold, so admission no longer measures the bundle path. Coverage is not enforced for this hub (`"enforced": false` in `raw/admission.json`), so the verdict does not change. `SD-007` then repeats what `SD-005` already checks. The body (`:33-35`, `:45`, `:53`, `:56`, `:84`, `:103-114`) keeps describing a chart tie until someone rewrites it.

### Recommendation: option (b)

The fault sits in the gold, because the prompt asks for no chart. Option (a) changes the router every user meets, to pass a test whose prompt is wrong. It also leaves a singular and plural split nobody would design on purpose. Option (b) touches no served policy and no manifest. It does cost the hub's only bundle and chart gold. That loss is a missing scenario, not a router defect. Restoring it needs a prompt that asks for both a chart and a diagram, and the prompt is frozen for this fix, so that change is only named here.

---

## 7. RAW EVIDENCE

| File | Holds |
|---|---|
| `raw/admission.json` | The admission harness output: 4 scenario rows, counts, coverage and the `drift` verdict |
| `raw/mode-routing.txt` | Each of the 49 mode scenarios as `### <id> \| <gold mode> \| <source file>`, then its prompt, exit status and route JSON |
| `raw/mode-routing-run.sh` | The script that produced `mode-routing.txt`, one `probe` line per scenario with the prompt copied verbatim from its real-user-request bullet |

No provider credential was needed. The run calls only the routing front door and the admission harness. The stage-one re-derivation behind the **Hits** column ran in the authoring session and is not kept in `raw/`.

---

## 8. DELTA AGAINST BASELINE

Not applicable to this run. Reason: this is the first hub-level routing run archived for sk-design. `benchmark/README.md` section 1 records that no Lane C hub run was archived before that harness was retired. The per-mode baselines under `sk-design-fundamentals/benchmark/` and `sk-design-diagram/benchmark/` measure a mode, not the hub route, so they are not a before-number for this run.

The next run after an SD-007 fix compares against this file. A scenario that matches here and misses there is a regression.
