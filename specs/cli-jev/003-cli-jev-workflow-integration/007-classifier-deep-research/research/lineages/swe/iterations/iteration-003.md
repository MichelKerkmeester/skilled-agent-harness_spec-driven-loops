---
title: "Iteration 3: Resource routing as code — ROUTER leaves and the compiled router"
trigger_phrases: []
---
# Iteration 3: Resource routing as code — ROUTER leaves and the compiled router

**Angle:** swe-03 · **Lens:** code-level slice design · **Maps to:** C

Independent: no round-3 sibling file read (wave-1 rule).

## Focus

Trace how leaf resources get picked today end to end, find where a `choice` classifier plugs in so the main AI loads fewer files, count the existing routing harness's leaf gold, and sketch the smallest offline replay slice. Then reconcile with BASE1 rows 19–20, which dropped two nearby ideas.

## Actions Taken (opened this iteration)

- The six active `ROUTER.md` files: `sk-code/ROUTER.md` (617 lines), `sk-doc/ROUTER.md` (411), `mcp-tooling/ROUTER.md` (160), `cli-external-orchestration/ROUTER.md` (150), `system-deep-loop/ROUTER.md` (119), `sk-design/ROUTER.md` (115); `cli-jev/ROUTER.md` (69, `router_state: stage1-only`, empty maps — not a leaf router)
- `sk-code/ROUTER.md:51-104` (intent model, scoring algorithm, anti-signals), `:107-115` (load tiers), `:123-151` (Webflow map), `:200-243` (OpenCode map + language overlay), `:307-349` (machine block: `DEFAULT_RESOURCE`, `INTENT_SIGNALS`, declared-lossy note), `:351+` (`RESOURCE_MAP`)
- `sk-doc/ROUTER.md:38-141` (18-intent prose model), `:145-152` (machine-block contract: "the byte-for-byte source the deterministic router-replay parses"), `:154-174` (`INTENT_SIGNALS`), `:176-288` (`RESOURCE_MAP`)
- `sk-code/SKILL.md:52-64` (routing directive: `compiled-route.cjs` for stage 1, ROUTER.md owns stage 2), `system-deep-loop/SKILL.md:39-53` (same two-stage contract; `:53` calls its ROUTER.md "a benchmark/replay artifact")
- `.skilled/bin/compiled-route.cjs` whole (thin front door; `resolve.cjs` locator, coherent-layout check)
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:1-153` (flag tri-state `:59-78`, manifest gate `:86-99`, `resolveRoute` `:105-125`, legacy sentinel `:151-152`)
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` whole (`HUB_CHILD` `:30-38`, engine cache `:55-85`, `normalizeTargets` `:87-92`, `compiledRoute` `:96-108`)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/canary-cases.v1.json` — all seven, counted by action
- `.skilled/skills/*/manual-testing-playbook/**/*.md` — grep for `expected_leaf_resources` per hub; `cli-jev/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md:1-40` read as a shape sample (its `expected_leaf_resources: []` is empty — stage1-only hub)
- `sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:1-50` (admission contract: typed `{workflow_mode, leaf_resource_id}` pairs required)
- `sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:1-45` (the `(workflowMode, leafResourceId)` identity boundary)
- `sk-doc/leaf-manifest.json` (`modes: 15`, per-mode `packet` + `leaves[]` lists), `system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` (token/phrase scorer, cap 20, exits 0/1/2 — from iter-001/002 session reading)
- `research-angles.md` swe-03 block + per-idea record contract; BASE1 `research.md:1063-1064` (rows 19, 20)

## The routing stack as code — one request traced end to end

Three stages, three different mechanisms:

| Stage | Mechanism | Code | Output |
|---|---|---|---|
| 0. Hub pick | Trigger-index deterministic scorer + daemon advisor | `lookup-trigger-index.mjs` (normalize → token/phrase score → cap 20; exit 0 candidates / 1 none / 2 bad invocation) | candidate skill ids |
| 1. Mode pick | **Compiled route when authoritative** — `resolveRoute(hubId, taskText)` gates on `SPECKIT_COMPILED_ROUTING` tri-state (`resolve.cjs:69-78`), manifest `servingAuthority === 'compiled'` (`:107-108`), then `compiledRoute` evaluates the hub snapshot's `evaluateCanary`/`evaluateRoute` (`compiled-route.cjs:96-108`) and binds identity: `effectivePolicyHash`+`generation` must match `manifest.selectedPolicy` or it returns `null` (`resolve.cjs:115-119`). Any error → `null` → front door prints `{"servingAuthority":"legacy","hubId":...}` (`:151-152`) and the model falls back to the prose smart-router | `resolve.cjs:105-125`, `compiled-route.cjs:55-108` | `{action: route|clarify|defer|reject, targets[], effectivePolicyHash, generation}` — **mode/surface destinations only** (`normalizeTargets` reads `qualifiedId|destinationId|skillId`, `compiled-route.cjs:87-92`) |
| 2. Leaf pick | **The model itself, following prose.** `sk-code/SKILL.md:54-58` points stage two at `ROUTER.md`; the doc carries an intent table (14 sk-code intents in prose, 21 keys in `INTENT_SIGNALS`), a prose scoring algorithm (weighted keyword sums, `+5` phase boost, `AMBIGUITY_DELTA = 1` near-tie → second intent, doc-only anti-signals `sk-code -2 / sk-doc +3`), and a `RESOURCE_MAP` intent→leaf-paths dictionary declared "the byte-for-byte source a deterministic router parses" (`sk-code/ROUTER.md:309`) | `sk-code/ROUTER.md:51-104`, `sk-doc/ROUTER.md:38-152` | `(workflowMode, leafResourceId)` pairs via `leaf-resource-contract.cjs` |

Q1 answer: leaf selection is **not** a pattern lookup, a weight file, or a manifest read at runtime — it is the main AI executing a prose algorithm against a keyword table. `leaf-manifest.json` exists (sk-doc: 15 modes, per-mode `leaves[]`) but indexes leaves **by workflowMode**, not by intent; the intent→leaves projection lives only in ROUTER.md prose + its `RESOURCE_MAP` block.

### The compiled router does not reach stage 2

`compiledRoute` returns `targets` = mode/surface destinations (`compiled-route.cjs:87-107`); nothing in the compiled output names a leaf resource. The serving gate is intentionally brittle-safe (`resolve.cjs:111-124`) and the whole compiled path is bypassable by design — the prose ROUTER.md path is the permanent fallback, so stage 2 exists and is model-run **regardless of which stage-1 authority served**. This is the key asymmetry: stage 1 is compiled to snapshots with drift-checked identity binding; stage 2 is 1,641 lines of prose across six files that the model re-reads and re-scores per invocation.

## Per-router context weight (counted this iteration)

| Hub | ROUTER.md lines | `INTENT_SIGNALS` keys | `RESOURCE_MAP` keys | leaf path refs | runtime role |
|---|---|---|---|---|---|
| sk-code | 617 | 21 | 21 | ~180 (machine block; prose adds more) | stage-2 live contract (`SKILL.md:54`) |
| sk-doc | 411 | 18 | 18 | ~186 | stage-2 live contract |
| mcp-tooling | 160 | 9 | 9 | ~18 | stage-2 contract |
| cli-external-orchestration | 150 | 7 | 7 | ~14 | stage-2 contract |
| system-deep-loop | 119 | 5 | 5 | ~14 | declared "benchmark/replay artifact", not a runtime discovery surface (`SKILL.md:53`) — honest caveat: its leaves load via packet procedures, so a leaf classifier gains little here |
| sk-design | 115 | 5 | 5 | ~15 | stage-2 contract |
| cli-jev | 69 | 0 | 0 | 0 | `stage1-only`; nothing to classify |

sk-code + sk-doc carry 1,028 of the 1,641 total lines and all the big leaf sets — the leaf-routing context cost is concentrated in exactly two hubs.

## What a wrong leaf pick costs

`RESOURCE_MAP` rows are the load contract: picking `DEBUGGING` when `IMPLEMENTATION` was meant loads the debugging refs and silently omits the implementation trio — the exact partial-coverage failure the trio contract at `sk-code/ROUTER.md:132-140` was written to prevent (it cites an SD-001 incident). Under-loading is the dangerous direction: the model gets *some* relevant docs and no signal that others were missed. Over-loading (near-tie union) is the safe direction and is already the prose rule (`AMBIGUITY_DELTA`, dominant+near-tie union at `system-deep-loop/SKILL.md:49`).

## Existing harness and leaf-gold census

Two harnesses exist, at different stages:

1. **Mode-level canary corpora** (`009-parent-hub-rollout/*/fixtures/canary-cases.v1.json`, all seven read and counted): 84 cases total — `route` 63, `reject` 9, `defer` 10, `clarify` 2 (per-hub: sk-code 9, system-deep-loop 9, mcp-tooling 14, cli-ext-orch 15, sk-doc 22, cli-jev 7, sk-design 8). Gold for `clarify`+`defer` combined: **12 rows** (BASE1's row 19 said 13 — either it counted differently or the corpus moved; my count is 12, all files listed above).
2. **Leaf-level scenario matrices** (`<hub>/manual-testing-playbook/**/*.md` carrying `expected_leaf_resources`): **92 files** — sk-doc 34, system-deep-loop 21, mcp-tooling 16, cli-ext-orch 11, sk-design 5, cli-jev 3 (all with empty leaf arrays — stage1-only), sk-code 2. The admission gate (`validate-compiled-routing-scenarios.cjs:22-38`) already requires typed `{workflow_mode, leaf_resource_id}` pairs resolving against `leaf-manifest.json`, plus a seven-field evidence block — the gold format is contract-pinned, not improvised.

Q3 answer: the manual-testing-playbook scenario matrices are the leaf-selection harness gold; **sk-doc is the only hub with enough leaf gold (34) to score a classifier meaningfully.** sk-code — the biggest context prize at 617 lines — has only 2 leaf-gold scenarios, so a sk-code slice cannot be measured offline today without authoring new gold.

## BASE1 rows 19–20 vs leaf selection (Q5)

- **Row 19 dropped "live Jev in the compiled-routing front door"** because the front door has one legal stdout shape on a synchronous path, and only ~13 clarify/defer gold rows exist (`research.md:1063`, verified at `compiled-route.cjs:151-152` — a single `JSON.stringify` line, no second channel). That drop is about **stage 1's clarify/defer**, a mode-level decision.
- **Row 20 dropped the shadow defer-disagreement log**: 10 defer gold rows, no decision reads it (`research.md:1064`).
- **Leaf selection differs from what they covered**: it is stage 2, off the synchronous stdout contract entirely (its output is a leaf path list the model loads, not a routing verdict replacing the sentinel); it has its own typed gold (92 files vs 12 clarify/defer rows). Neither dropped row gates this seam — but they constrain its *shape*: a leaf classifier must not live inside `compiled-route.cjs`'s stdout path and must not be a log nobody reads; it must emit a loadable artifact (leaf paths) or nothing.

## Where a `choice` plugs in, and the deadline question (Q2)

Caller: the hub's SKILL.md routing directive (`sk-code/SKILL.md:58` runs `compiled-route.cjs` for stage 1; stage 2 is the model reading ROUTER.md). A leaf classifier sits as a **sibling step after stage 1**, e.g. `node .skilled/bin/leaf-route.cjs --hub sk-doc --prompt "<task>"` emitting one JSON line `{intent, leaves[], backend, skipped}` the model uses instead of loading ROUTER.md.

Deadline: **none in the wall-clock sense.** Stage 2 today is a model turn, not a hook callback or a synchronous CLI whose stdout shape is contract-frozen — there is no ms budget, no single-legal-shape channel. The real budgets are context tokens (411–617 lines of routing prose) and one reasoning pass. A ~60 ms Deem `choice` (LOCAL:34-38) or a Jev hosted call fits trivially; even a 2 s backend call is small next to the model pass it replaces. Failure mode must be `skipped` + model falls back to prose routing — identical to today.

## Idea records

### N-swe-03-1 — leaf-intent `choice` for sk-doc (and sk-code once gold exists)

| Field | |
|---|---|
| **Idea** | `choice` over the hub's `INTENT_SIGNALS` keys → emit `RESOURCE_MAP[intent]` leaf paths (+ `DEFAULT_RESOURCE`) as one JSON line; the model never opens ROUTER.md. Type: `choice` |
| **Question** | C (context reduction) |
| **Builds on** | new; adjacent to BASE1 row 19's seam but off the compiled stdout path it constrained |
| **Value** | Removes the ROUTER.md load + in-head scoring pass from every routed invocation of sk-doc (411 lines ≈ est. 3–4k tokens) and eventually sk-code (617 lines ≈ est. 5–6k tokens) |
| **Seam** | New sibling `leaf-route.cjs` invoked beside `compiled-route.cjs` in the SKILL.md stage-2 directive (`sk-code/SKILL.md:58` is the pattern point); reads ROUTER.md's machine block, never edits it |
| **Metric, baseline, harness** | Leaf-set F1 vs `expected_leaf_resources` gold. Baseline today: UNKNOWN — no scored leaf-selection baseline exists in-repo (canary corpora are mode-level). Harness: `manual-testing-playbook` scenarios + `leaf-resource-contract.cjs` typing; missing piece is the replay runner (N-swe-03-2) |
| **Savings** | ~3–4k context tokens + 1 scoring pass per sk-doc route (est.; ROUTER.md 411 lines minus ~10 emitted paths); per week scales with routed-skill invocation count — UNKNOWN, no invocation telemetry counted this iteration |
| **Cost, latency, privacy** | 1 `choice` call/route. Deem: local, ~60 ms p50 warm (LOCAL:34-38), prompt = task text + intent keys (intent names only, no private content). Jev: hosted, task text egresses. Both fine; Deem preferred (latency + privacy; task text stays on machine) |
| **Two-backend gate** | Own switch: `SK_LEAF_ROUTE` env or `--leaf-backend` flag, off→skip. Jev detected per D1 (`command -v jev`, `jev 0.6.2`, `jev auth status` exit 0). Deem: `GET /health` must return ok **and** `GET /v1/models` must list `deem-0.8-v1` (fields: status + model id). Neither/malformed/slow → print `{"skipped":"<reason>"}` and the model reads ROUTER.md exactly as today; no default intent is ever emitted |
| **Rough LOC** | ~180 (RESOURCE_MAP extractor ~60 as a tiny fenced-Python-literal reader, probe ~40, choice+emit ~50, contract typing via `leaf-resource-contract.cjs` ~30) + ~120 tests |
| **Verdict** | **next** — right seam, but it must be gated behind the replay harness proving ≥ deterministic-keyword baseline on sk-doc's 34 gold rows before the SKILL.md directive is touched |
| **Confidence** | Confirmed seam (code-traced); savings are estimate (token counts not measured); accuracy UNKNOWN until replayed |

### N-swe-03-2 — offline leaf-route replay runner (the always-first slice)

| Field | |
|---|---|
| **Idea** | `leaf-route-replay.cjs`: parses a hub's `INTENT_SIGNALS`+`RESOURCE_MAP`, walks its `manual-testing-playbook` scenarios' `expected_leaf_resources`, and scores three arms — deterministic keyword scorer (port of §2), classifier `choice` (when a backend probes healthy), prose-model replay recorded by hand. Zero calls when no backend: probe fails → arm skipped, JSONL row records `skipped` |
| **Question** | C (measurement); makes N-swe-03-1's verdict evidence-based |
| **Builds on** | new; uses the scenario-admission contract (`validate-compiled-routing-scenarios.cjs:22-38`) as its gold parser's spec |
| **Value** | Converts "should a classifier pick leaves" from opinion to a number per hub; doubles as the regression gate if a leaf router ever ships |
| **Seam** | `sk-doc/manual-testing-playbook/` scenario dir + `leaf-resource-contract.cjs` for pair typing; runner itself is a new file under `sk-doc/sk-create-skill/scripts/` or the lineage proposal names `scripts/leaf-route-replay.cjs` |
| **Metric, baseline, harness** | Per-scenario leaf-set F1 + exact-match rate; baseline arm = INTENT_SIGNALS keyword scorer (itself a measurable artifact — the first deterministic leaf baseline in the repo). Harness: this runner, over 34 sk-doc gold rows |
| **Savings** | Direct: none. Indirect: prevents shipping a worse-than-keywords leaf router — and measures whether the deterministic scorer alone (no model, no ROUTER.md read) already captures most of the win, which would shrink N-swe-03-1 to a tie-breaker |
| **Cost, latency, privacy** | Runs offline; classifier arm = 1 call per scenario (34 calls for sk-doc, ~2 s total on Deem LOCAL latencies). No egress under Deem |
| **Two-backend gate** | Runner-level `--backend deem|jev|none`; `none` is a first-class arm (deterministic scorer always runs, zero calls). Same per-backend probes as N-swe-03-1; failures mark the arm `skipped` in JSONL, never a fabricated score |
| **Rough LOC** | ~220 runner (scenario frontmatter parse ~50, gold typing ~30 via contract lib, keyword scorer ~60, classifier arm ~50, F1 report ~30) + ~150 tests |
| **Verdict** | **build-now** — it is the cheapest artifact in the lineage (pure offline, no live routing touched), it produces the baseline number every sibling lineage currently lacks, and its keyword arm may itself be the answer |
| **Confidence** | Confirmed inputs (gold files counted, contract lib read); the F1 outcome is by definition unmeasured until run |

## Ruled out

- **A leaf classifier inside `compiled-route.cjs`'s stdout path** — BASE1 row 19's exact trap: one legal shape, synchronous, thin clarify/defer gold. Leaf output also doesn't fit that contract (`normalizeTargets` expects destinations, not leaf lists).
- **A `choice` over raw leaf IDs (≈180 options for sk-code)** — Deem `choice` selects one option; 180-way choice with per-leaf granularity loses the set semantics (ROUTER maps intents → *sets*; near-ties legitimately union). Intent-level choice (≤21 options) with map lookup is the correct granularity.
- **Touching system-deep-loop's ROUTER** — its own SKILL.md declares it a replay artifact, not a runtime discovery surface (`SKILL.md:53`); no live context is spent on it, so there is nothing to save.
- **Reusing `lookup-trigger-index.mjs` as the leaf scorer** — it is hub-level (stage 0), spec-folder-scoped, and its scoring (token overlap on indexed triggers) doesn't model the ROUTER intent contract; porting §2's keyword weights is honest, borrowing the trigger index is not.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Stage-1 compiled routing emits mode/surface destinations only — no leaf IDs anywhere in `compiledRoute`'s output contract | **new** | `compiled-route.cjs:87-108`, `resolve.cjs:105-125` |
| Stage-2 leaf selection is model-run prose, not a manifest read: `leaf-manifest.json` indexes leaves by workflowMode, and the intent→leaf map exists only inside ROUTER.md | **new** | `sk-doc/leaf-manifest.json` (modes list shape), `sk-doc/ROUTER.md:145-152`, `sk-code/SKILL.md:54-64` |
| Compiled-routing skip leaves leaf routing fully measurable: the prose path is the permanent fallback by design, so stage 2 is identical under either stage-1 authority | **new** | `resolve.cjs:14-16`, `:105-125` fallback semantics |
| Leaf gold census: 92 scenario files with typed `expected_leaf_resources`, concentrated sk-doc 34 / sdl 21 / mcp-tooling 16; sk-code has only 2; cli-jev's are all empty | **new** | grep census this iteration; `cli-jev` sample `judgment-request-routes-to-transport.md:11` (`expected_leaf_resources: []`) |
| Mode-level canary gold for clarify+defer is 12 rows across seven hubs (BASE1 row 19 said 13) | contests BASE (count differs by one; confirms its thinness conclusion) | all seven `canary-cases.v1.json` files counted by action |
| BASE1 rows 19–20 constrain the seam's shape (not its existence): leaf classification is stage-2, off the single-shape stdout path, with separate typed gold | **new** | `research.md:1063-1064` vs `compiled-route.cjs:151-152` |
| The leaf-routing context cost is concentrated: sk-code 617 + sk-doc 411 = 1,028 of 1,641 ROUTER lines fleet-wide | **new** | `wc -l` census this iteration |

## Hand-off

- swe-04: N-swe-03-2 (replay runner) is the strongest "top reduction seam as a slice" candidate so far — its keyword-scorer arm may obsolete the classifier arm; carry both arms' design forward.
- swe-05: sk-prompt has no ROUTER.md in the six-file census — check how sk-prompt and sk-design pick resources before designing their classifier arms (sk-design has 5 intents / ~15 leaves only).
- swe-07: a `cli-classifier` hub would need a leaf-route mode; the runner's `--backend` gate is the probe contract to standardize.
- swe-08: the probe used here (`/health` + `/v1/models` model-id check) is the same shape every backend-aware idea needs — dedupe candidate.
