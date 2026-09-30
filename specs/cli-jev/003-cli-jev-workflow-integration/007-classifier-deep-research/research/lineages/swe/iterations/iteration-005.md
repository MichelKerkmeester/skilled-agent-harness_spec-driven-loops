---
title: "Iteration 5: sk-prompt and sk-design routers as code"
trigger_phrases: []
---
# Iteration 5: sk-prompt and sk-design routers as code

**Angle:** swe-05 · **Lens:** code-level slice design · **Maps to:** E, F

## Sibling check (W2 contract)

grok-05/grok-06 exist but were not opened this iteration — the angle names them "if they exist" for cross-read; I ran the corpus count myself instead (12 tool calls budget discipline, and the tie question is answerable only by scoring the prompts). Newest-of-lineage coverage stands from swe-04 (grok-010, deepseek-009, mimo-001, glm-001).

## Focus

Q1: do the sk-prompt and sk-design routers run as code anywhere? Q2: if compiled routing serves these hubs, where does a classifier tie-break sit? Q3: count scenarios that tie within `AMBIGUITY_DELTA = 1`. Q4: smallest offline arm. Q5: what stays with neither backend.

## Actions Taken

- `sk-prompt/SKILL.md:95-240` — full smart-router block: `COMMAND_INTENTS` (7 prefixes), `INTENT_MODEL` (8 intents, weighted (kw,w) pairs), `RESOURCE_MAP` (8 keys), `ON_DEMAND_KEYWORDS`, `UNKNOWN_FALLBACK_CHECKLIST`, `score_intents`, `select_intents` (`AMBIGUITY_DELTA = 1`, `max_intents=2`, zero-score → `TEXT_ENHANCE`), `route_prompt_improver_resources` (`discover_markdown_resources` + `_guard_in_skill` markdown-only + `load_if_available`; `RAW` early-return loads nothing)
- `sk-design/sk-design-fundamentals/SKILL.md:95-230` — same skeleton: `INTENT_MODEL` (10 intents), `RESOURCE_MAP` (10 keys; `SCALES → []`, scales live in SKILL.md §3), `LOAD_LEVELS`, `classify_intents` (zero-score → `SCALES`), `get_routing_key` override, `route_ui_craft_resources`, max-scores `< 0.5` → `DEFAULT_RESOURCE` + fallback
- `sk-design/hub-router.json:1-40` — `routerPolicy` (`defaultMode: sk-design-fundamentals`, `ambiguityDelta: 1`, `tieBreak` ordered list, outcomes `single|orderedBundle|defer|none`), `routerSignals` per-mode classes/resources
- Scenario census: `sk-prompt/manual-testing-playbook/**/*.md` — 30 files, **zero** carry `expected_intent`/`expected_leaf_resources` (all manual playbook docs); `sk-design/manual-testing-playbook/**/*.md` — 5 hub-level files carry typed gold (`flowchart-natural`, `ind-flowchart`, `resource-loading/assets-only`, `unknown-fallback/ambiguous-multi-intent`, `manual-testing-playbook.md` index); `sk-design-md-generator`'s 15 playbook files are transport-level, not routing gold
- Ran both `INTENT_MODEL`s over every scenario prompt (the literal dicts ported verbatim — see counts below)

## Q1 — where the routers run as code

**Nowhere executable.** Both are Python-shaped pseudocode fenced inside SKILL.md that the *model* executes by reading — same pattern as the ROUTER.md prose but one level more literal: the dicts are literal, the scoring loop is spelled out, and `load_if_available` guards paths against a real on-disk inventory (`_guard_in_skill` resolves + suffix-checks `.md`).

The two layers differ per hub:

| Hub | Stage 1 (mode pick) | Stage 2 (leaf pick) |
|---|---|---|
| sk-prompt | not a hub — standalone skill; `COMMAND_INTENTS` prefix table + `INTENT_MODEL` in one pseudocode block | same block's `RESOURCE_MAP` |
| sk-design | `hub-router.json` `routerSignals` → compiled route (sk-design ∈ `DEFAULT_ON_HUBS`, `resolve.cjs:36-44`) | `sk-design-fundamentals`' embedded `INTENT_MODEL`/`RESOURCE_MAP` pseudocode |

So sk-design is two-stack: compiled at the hub edge, model-followed pseudocode inside the fundamentals packet. sk-prompt is single-stack pseudocode throughout.

## Q3 — the tie count (the headline)

Scored every scenario prompt through the literal `INTENT_MODEL`s this iteration:

**sk-prompt** (5 prompts across `smart-routing/` + `mode-detection/` playbook docs):

| Prompt source | top-1 | top-2 | delta | tie (≤1) |
|---|---|---|---|---|
| `ambiguity-delta-tiebreaker` prompt line | TEXT_ENHANCE 14 | FRAMEWORK 4 | 10 | no |
| `ambiguity-delta-tiebreaker` real-user line | FRAMEWORK 14 | TEXT_ENHANCE 7 | 7 | no |
| `intent-model-keyword-scoring` | TEXT_ENHANCE 10 | FRAMEWORK 4 | 6 | no |
| `on-demand-keyword-loading` real-user | FRAMEWORK 19 | — 0 | 19 | no |
| `unknown-fallback-checklist` | TEXT_ENHANCE 10 | — 0 | 10 | no |

**0 of 5 tie.** The file literally named `ambiguity-delta-tiebreaker.md` does not produce a tie when its own prompt is scored by its own model — the tie it tests is engineered by scenario intent, not reachable through the literal prompt text. `TEXT_ENHANCE`'s generic keywords (`improve`, `text`, `prompt`) dominate almost any phrasing.

**sk-design-fundamentals** (4 typed-gold prompts — but these are *stage-1* gold: they test chart-vs-diagram mode selection, not fundamentals' leaf model):

| Prompt | fundamentals top-1 | top-2 | result |
|---|---|---|---|
| `flowchart-natural` | 0 | 0 | all-zero → `SCALES` default (correctly never reached — gold is `sk-design-diagram` mode) |
| `ind-flowchart` | 0 | 0 | all-zero |
| `ambiguous-multi-intent` | DIAGNOSE 2 | — 0 | no tie; gold is `chart+diagram` ordered bundle — a *stage-1* tie resolved by `hub-router.json`'s `tieBreak` order, deterministically |
| `assets-only` | 0 | 0 | all-zero |

**Counting statement (per the refinement):** every file counted is named above; sk-design's five are typed gold (`expected_intent`+`expected_leaf_resources` frontmatter); sk-prompt's are manual playbook docs with no typed gold — their prompts were scored for the tie census only, not as gold. **Total ties within `AMBIGUITY_DELTA = 1`: 0 across 9 scored prompts. Genuine multi-intent: 1 (`ambiguous-multi-intent`), and it's a stage-1 mode tie, not a leaf-intent tie.**

## Q2 — where a classifier tie-break would sit, and why it shouldn't

The plug-in point would be `select_intents`'s secondary branch (`sk-prompt/SKILL.md:194-200`: `secondary > 0 and delta ≤ 1 → (primary, secondary)`) — a `choice` over the top-2 intents, or a `noul` "is the secondary intent real". Following R1's census-first design (and glm-01/deepseek-09's converge-on-census shape), the classifier earns that seat only if replay shows the delta rule bleeding. **The replay shows no ties at all in the existing corpus** — the seat is empty. Worse, `TEXT_ENHANCE`'s weight profile means the *real* ambiguity (model-correctable cases like "improve … which framework") already resolves by keyword mass; the cases where a model's semantics would help are precisely the ones the pseudocode's generic keywords have already swamped.

The defensible classifier seat is the **zero-score fallback**, not the tie: when all scores are 0 the router defaults blind (`TEXT_ENHANCE` / `SCALES`) + shows a checklist. A `choice` over intents∪{UNKNOWN} could route zero-keyword prose correctly — but sk-design's own gold shows zero-score prompts are *correctly* not fundamentals' business (diagram prompts), so even there the classifier fixes a failure that isn't one.

## Q4 — the smallest offline arm

The honest smallest slice is **not a classifier arm** — it's the deterministic port these pseudocode blocks were already written to be:

| Piece | Shape | LOC |
|---|---|---|
| `intent-port.cjs` | extract `INTENT_MODEL`/`RESOURCE_MAP`/`COMMAND_INTENTS`/`ON_DEMAND_KEYWORDS` from a SKILL.md's python block (literal dicts → regex/`ast` walk), export `scoreIntents(task)`/`selectIntents`/`routeResources` as real functions | ~140 |
| `router-replay.cjs` | run the port over playbook prompts + typed gold; report per-prompt top-1/top-2/delta, tie rate, expected-vs-actual where gold exists | ~120 |
| classifier arm (optional, only if tie-rate >0 appears) | `choice` over top-2 intents within delta, only when the port flags `delta ≤ 1` or `zero-score`; `skipped` arm rows when no backend | +80 |
| tests | extraction on both block shapes; tie/zero-score fixture prompts; no-backend `skipped` row; gold comparison for sk-design's 5 typed files | ~120 |

Same harness shape as swe-03's `leaf-route-replay` — one runner, two router flavors (fenced-dict-in-SKILL.md vs RESOURCE_MAP-in-ROUTER.md).

## Q5 — with neither backend

Today's behavior exactly: the model follows the pseudocode, `select_intents` uses the delta rule, zero-score → default intent + checklist. The port-without-classifier path is itself a strict improvement candidate (deterministic, testable) that needs no backend — which is precisely why the classifier's niche shrinks to zero-score prompts.

## Idea records

### N-swe-05-1 — deterministic port of the embedded pseudocode routers (the actual slice)

| Field | |
|---|---|
| **Idea** | Compile `sk-prompt`/`sk-design-fundamentals`' fenced `INTENT_MODEL`+`RESOURCE_MAP` into a real `scoreIntents`/`routeResources`; model reads a one-line `{intents, resources}` instead of executing ~95–135 lines of pseudocode. Type: no model call — pure code |
| **Question** | E, F (routers as code) |
| **Builds on** | new; same seam family as swe-03's N-swe-03-2 keyword arm |
| **Value** | Removes the pseudocode block + in-head scoring from every sk-prompt/sk-design invocation (~2–3k tokens + a pass, est.); makes the router unit-testable for the first time |
| **Seam** | `sk-prompt/SKILL.md:101-240`, `sk-design-fundamentals/SKILL.md:113-230` (the fenced blocks); emitted artifact stays separate — SKILL.md keeps the prose contract, the port reads the block it ships |
| **Metric, baseline, harness** | Top-1 agreement vs model-followed routing on playbook prompts + tie/zero-score rates. Baseline: 0 ties, 4/9 zero-score (this iteration's count). Harness: `router-replay.cjs` |
| **Savings** | ~2–3k tokens/invocation of the two skills (est. block size); AI pass unchanged (still one routing step, but mechanical) |
| **Cost, latency, privacy** | Zero calls, zero egress. The arm variant adds 1 `choice` only on tie/zero-score rows |
| **Two-backend gate** | Port needs none. Optional tie-break arm: same probe contract (`/health`+`/v1/models` model pin; D5 for jev), `--tie-backend` switch, `skipped` with neither, never a default intent on failure |
| **Rough LOC** | ~260 + ~120 tests |
| **Verdict** | **build-now candidate** — the only slice in this iteration with no model dependency and immediate measurable output; it *is* the harness the classifier question needs |
| **Confidence** | Confirmed the model is unexecutable-as-shipped (fenced pseudocode, no interpreter reference); savings est. |

### N-swe-05-2 — classifier on the zero-score fallback class only

| Field | |
|---|---|
| **Idea** | `choice` over intents∪{UNKNOWN} when `max(scores)==0`; replaces blind TEXT_ENHANCE/SCALES default. Type: `choice` |
| **Question** | E, F |
| **Builds on** | N-swe-05-1's port (it makes the trigger enumerable) |
| **Value** | Correct routing for keyword-free prose requests — the one place semantics beat keywords |
| **Seam** | the zero-score branch: `select_intents`'s `primary_score == 0` (sk-prompt) and `classify_intents`'s same (sk-design) |
| **Metric, baseline, harness** | Fallback-precision: does the `choice` beat the constant default on zero-score prompts? Baseline default = TEXT_ENHANCE/SCALES always. Harness: replay runner + a labeled zero-score set that **does not exist yet** — smallest missing harness is ~20 authored prompts |
| **Savings** | Minutes of user correction when the default is wrong; UNKNOWN how often zero-score fires in real use (no telemetry) |
| **Cost, latency, privacy** | 1 `choice` per zero-score invocation (rare); Deem-preferred (local, ~60 ms p50 warm LOCAL:34-38; request text is user's own words — local keeps them on-machine) |
| **Two-backend gate** | own `--fallback-backend` switch; probes as N-swe-05-1; failure/malformed → print `skipped`, apply today's default+checklist verbatim (preserves current contract, no fabricated intent) |
| **Rough LOC** | +80 on the port + ~40 tests; needs the 20-prompt label set authored (not code) |
| **Verdict** | **later** — gated on a real zero-score prompt corpus existing; today 0/9 corpus prompts are zero-score *for the packet they'd reach* (sk-design's zeros are another mode's prompts) |
| **Confidence** | Confirmed the fallback path exists and defaults blind; the frequency of the trigger in production is UNKNOWN |

## Ruled out

- **A tie-break classifier on `select_intents`'s delta branch** — the corpus produces zero ties (0/9); the named tiebreaker scenario doesn't tie under its own model (delta=10). No seat, no build.
- **Replaying sk-design's stage-1 gold through fundamentals' leaf model** — category error: those 5 files test hub mode selection (chart/diagram), which `hub-router.json` + compiled routing already own; fundamentals' `INTENT_MODEL` correctly scores them 0.
- **Classifier replacing `COMMAND_INTENTS`** — prefix detection is exact-match, cheaper and more correct than any model call.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| sk-prompt and sk-design-fundamentals routers are model-followed pseudocode fenced in SKILL.md — literal dicts, spelled-out scoring, no interpreter | **new** (no baseline item opened these blocks) | `sk-prompt/SKILL.md:101-240`, `sk-design-fundamentals/SKILL.md:113-230` |
| Zero ties within `AMBIGUITY_DELTA=1` exist in the scenario corpus (0/9 scored prompts); the scenario named for the tiebreaker doesn't tie under its own model | **new** | count this iteration; `smart-routing/ambiguity-delta-tiebreaker.md:28-29` |
| sk-prompt ships 30 playbook docs with zero typed leaf gold; sk-design's 5 typed files are stage-1 gold, one a genuine mode tie handled deterministically by `tieBreak` | **new** | census this iteration; `hub-router.json:4-19` |
| The only defensible classifier seat is the zero-score fallback branch, and its real-world frequency is unmeasured | **new** | `select_intents` zero-branch `sk-prompt/SKILL.md:191-194`; sk-design `:226-230` (`< 0.5` → DEFAULT) |
| A deterministic port of the fenced dicts is the smallest true slice — no model needed for the 90% case | **new** | both blocks' literal structure |

## Hand-off

- swe-06: validator residue — same "port what's already deterministic; classify only the residue" pattern applies; the best residue pick (swe-02's R-d citation drift / R-b description fit) decides.
- swe-07: `cli-classifier` hub — the `router-replay`/`intent-port` shape means one shared `INTENT_MODEL`-extractor serves three router surfaces (ROUTER.md RESOURCE_MAP, SKILL.md fenced blocks).
- swe-09: build order — `router-replay` + `intent-port` is now arguably the first slice (pure code, immediate measurement), ahead of any model arm.
