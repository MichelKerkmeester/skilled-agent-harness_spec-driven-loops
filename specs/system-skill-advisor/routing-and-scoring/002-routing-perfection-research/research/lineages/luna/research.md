# Research findings

Research topic: Perfect skill routing across the fleet: why a phrase a hub's router advertises fails to reach that hub, and what would fix it.

## Iteration 1 — the scorer's shape — gpt-5.6-luna

### What was read

The scorer text utilities, lexical/explicit/derived lanes, lane registry, fusion calibration and low-information gate, projection loader, and daemon CLI path. The worker prompt and supplied scratch baseline were also read.

### What was measured

The daemon-backed CLI probe returned `status=error`, `exitCode=75`, with `backend unavailable: connect EPERM /tmp/system-skill-advisor/697296aed00e/daemon-ipc.sock`. The checked-in built scorer then reproduced: `font size` and `plot this` had no recommendation; `plot this data` routed to `sk-design` at confidence `0.82`; `what should this look like` routed to `sk-design` at `0.82`; and `review this screen` routed to `sk-code` at `0.9349`.

### Findings

1. `tokenize` removes stop words and short tokens, while `scoreTokenOverlap` divides by `max(3, denominatorBasis)`. Therefore `plot this` has one filtered token and a one-hit overlap ceiling of `0.3333`; `plot this data` has two filtered tokens and reaches `0.6667` before other lane evidence. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/text.ts:29-34,80-100`]
2. `phraseSpecificity` gives a two-token phrase `0.88` and a three-or-more-token phrase `1.0`, and the explicit lane matches projection `intentSignals` and `keywords`. Exact stage-1 author evidence can therefore route a short phrase; specificity is not the primary no-reach defect. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/text.ts:64-74`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:315-334`]
3. The scorer projection exposes graph metadata intent signals and does not read `hub-router.json` in this path. A stage-2-only router declaration can therefore be invisible to stage 1 even when the text is semantically useful. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223`]
4. Confidence floors amplify direct evidence but cannot create a recommendation when no projection lane matches. The `0.8` bar is not the repair seam. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:409-440,791-824`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/scoring-constants.ts:169-201`]
5. Explicit author evidence has the highest live lane weight (`0.42`) and lexical overlap is lower (`0.28`), so increasing lexical weight would risk generic-token capture. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lane-registry.ts:8-29`]

### Recommendations

1. [needs a scorer change] Add an exact multi-word stage-1 phrase-anchor contribution before stop-word filtering, treating an authorized phrase as one unit while retaining the `0.8` threshold and abstaining without stage-1 evidence.
2. [implementable today] Classify stage-2-only short declarations as `no-reach` telemetry until the stage-1/stage-2 invariant exists; do not lower the threshold or add generic keywords.
3. [implementable today] Add boundary fixtures for `plot this`, `plot this data`, and `what should this look like` with explicit expected categories.

### What this iteration could not settle

Cross-hub ownership, the exact stage-1/stage-2 generated invariant, compiled-route differences, and the final build-gate shape remain open. The daemon itself was unavailable through IPC in this sandbox.

## Iteration 2 — cross-hub collision arbitration — gpt-5.6-luna

### What was read

All four contract files for the six required hubs, plus the explicit and fusion scorer lanes and projection loader.

### What was measured

Stage-2 routers claim `review bar`/`pass review`/`review the documentation` in `sk-doc`, `iterative review`/`review convergence`/`audit the diff` in `system-deep-loop`, and `review this screen`/`decision branch` in `sk-design`. The explicit lane assigns `review` to `sk-code`, `audit` to `sk-code`, and `branch` to `sk-git`. The checked-in built scorer returned `sk-code` for `review bar`, `pass review`, `review this screen`, and `audit the diff`, and `sk-git` for `decision branch`; the supplied generation-679 daemon baseline remains authoritative where it differs.

### Findings

1. Stage-2-specific phrases collide with generic explicit token boosts, because `hub-router.json`/`ROUTER.md` ownership is not a cross-hub advisor input. [SOURCE: `.opencode/skills/sk-design/ROUTER.md:63-68`; `.opencode/skills/sk-doc/ROUTER.md:148-150`; `.opencode/skills/system-deep-loop/ROUTER.md:71-75`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:18-21,62-65`]
2. Existing `primaryIntentBonus` handles selected phrases (`deep-review`, `code audit`, colon review commands, and review-plus-classifier vocabulary) but has no general stage-2 ownership rule. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/fusion.ts:542-620`]
3. Hub-local router separation is intentional: the hub selects a workflow mode and its `ROUTER.md` selects leaves, so local tie-breaks cannot fix a cross-hub advisor rank. [SOURCE: `.opencode/skills/sk-doc/ROUTER.md:20-35`; `.opencode/skills/mcp-tooling/ROUTER.md:20-33`; `.opencode/skills/cli-external-orchestration/ROUTER.md:21-34`]
4. `decision branch` proves phrase length alone is not enough; the first-class `branch` token boost can still capture a design-owned phrase. [SOURCE: `.opencode/skills/sk-design/ROUTER.md:63-68`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/explicit.ts:18-21`]
5. The built projection and supplied daemon baseline differ on two collision ranks, so the shared mechanism is safer to generalize than the unavailable live rank. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server/skill-advisor-cli.js:1105-1124`]

### Recommendations

1. [needs a scorer change] Generate a cross-hub phrase-ownership lane from machine-readable router declarations, but let it outrank generic tokens only when exact/normalized phrase matching is backed by stage-1 authorization.
2. [implementable today] Emit a structured collision diagnostic when a stage-2 owner and generic token owner disagree; keep generic boosts as fallback evidence.
3. [implementable today] Add safe negatives for `review this screen` and `decision branch`, while preserving `code audit` and `/deep:review` as existing explicit owners.
4. [needs a scorer change] Apply bounded ownership bonus/penalty after direct lanes, not a universal string override or global router-keyword union.

### What this iteration could not settle

The live daemon's current ranks, the full stage-1/stage-2 reach proof, compiled route membership, and the final CI checker remain open.

## Iteration 3 — the two-vocabulary contract — gpt-5.6-luna

### What was read

All six hub contract quartets, the router reach checker, scorer projection/text utilities, and the nested metadata-routing contract.

### What was measured

Using the checker’s multi-word declaration filter, the read-only stage-2-to-stage-1 join returned: `sk-design` 77 declared / 54 exact / 54 canonical; `sk-doc` 169 / 46 / 46; `sk-code` 41 / 6 / 6; `mcp-tooling` 76 / 53 / 53; `system-deep-loop` 25 / 3 / 4; and `cli-external-orchestration` 51 / 17 / 17. Missing examples included `review this screen`, `review the documentation`, `audit the diff`, `create note`, and `codex diff review`.

### Findings

1. Stage 2 and stage 1 are intentionally different; the checker skips single words and probes multi-word phrases. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:7-18,37-51`]
2. Exact stage-1 coverage is incomplete across all six hubs, and canonical normalization changes only the deep-loop sample count. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:37-51`; `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223`]
3. The scorer imports graph metadata intent signals, not router `INTENT_SIGNALS`; a router phrase can remain invisible until owner-local graph metadata carries it. [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:711-767,1116-1223`; worker prompt]
4. The invariant should require owner-local stage-1 authorization for every multi-word stage-2 phrase, then dynamic above-threshold reach; single-word phrases remain telemetry. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:37-66,74-118`]
5. The existing taxonomy is suitable: wrong-hub is actionable, no-reach is informational; a static generated ownership check is missing. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:80-118`]

### Recommendations

1. [implementable today] Add a static multi-word owner join report with a generated `stage1_authorized` exception; leave one-word declarations out of hard failures.
2. [needs a scorer change] Project the generated authorization as a bounded, provenance-bearing explicit phrase anchor.
3. [implementable today] Run dynamic reach after static ownership and keep `wrong-hub` as failure versus `no-reach` as telemetry.
4. [implementable today] Use canonical normalization only for equivalent formatting, not fuzzy ownership.

### What this iteration could not settle

Compiled-route membership, build integration, and the storage location for generated authorization remain open.

## Iteration 4 — compiled routing — gpt-5.6-luna

### What was read

The compiled front door, runtime resolver and engine, coherent-layout selector, freshness/drift guard, serving closure manifest, and prior lineage findings.

### What was measured

The compiled front door returned a legacy sentinel for `sk-design`; the five registered hubs returned compiled route/defer decisions with generations 2, 4, 4, 5, and 5. Hub-appropriate prompts produced deterministic mode routes for the five compiled hubs. The read-only guard probe reported all five hubs `fresh` and `failures=0`.

### Findings

1. Compiled routing is a within-hub post-selection layer and cannot repair stage-1 hub discovery. [SOURCE: `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:4-15,92-108`; `.opencode/bin/compiled-route.cjs:4-13,34-49`]
2. Serving authority requires flag permission, a compiled manifest, and matching policy identity; failure falls back to legacy. [SOURCE: `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:4-16,62-74,97-120`]
3. The compiled closure lists five hubs and excludes `sk-design`, which explains its legacy sentinel. [SOURCE: `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:21-36`; `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:29-40`; `.opencode/bin/compiled-route-guard.cjs:45-51`]
4. Freshness/drift checks do not measure advisor vocabulary reach or cross-hub ownership. [SOURCE: `.opencode/bin/compiled-route-guard.cjs:61-78,98-118,125-166`]
5. A `sk-design` compiled rollout would require a complete rollout child and several registrations, but would remain orthogonal to the stage-1 vocabulary repair. [SOURCE: `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:21-36`; `.opencode/bin/lib/compiled-routing/serving-closure.manifest.json:1-11`]

### Recommendations

1. [implementable today] Keep compiled status and vocabulary reach as separate gates; do not treat a fresh manifest as cross-hub ownership proof.
2. [implementable today] If `sk-design` needs compiled serving, add it through a complete canary/parity/activation/manifest/guard/closure rollout and expose legacy status until then.
3. [needs a scorer change] Repair phrase ownership in the advisor projection/scorer rather than in compiled-route membership.
4. [implementable today] Make uncompiled hubs visible in compiled status without changing fail-closed fallback.

### What this iteration could not settle

The sequencing of the final CI gate, safe negatives, and generated authorization storage remain open.

## Iteration 5 — measurement as gate — gpt-5.6-luna

### What was read

The full router-vocabulary checker and supplied fleet/sample reports.

### What was measured

The supplied daemon-generation-679 baseline is 439 declared multi-word phrases, 19 wrong-hub observations, and 136 no-reach observations. The supplied `sk-design` sample is `declared=77`, `wrong-hub=1`, `no-reach=10`, `RESULT: FAILED`.

### Findings

1. The checker’s multi-word filtering is the correct hard-failure boundary; bare one-word vocabulary is skipped. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:7-18,37-51`]
2. `wrong-hub` should fail, while `no-reach` should remain visible telemetry. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:80-118`; `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/reach-check-after.txt:1-15`]
3. Probe and JSON errors are silently dropped, creating a false-green path when the advisor is unavailable. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:54-65,74-93`; `.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server/skill-advisor-cli.js:1105-1124`]
4. `--limit` can truncate the inventory, so CI must require an untruncated declaration set and identity/generation record. [SOURCE: `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:68-78`]
5. Stable gate assertions are probe health, complete inventory, zero wrong-hub, and visible no-reach telemetry—not frozen confidence values or hard failure on every no-reach row. [SOURCE: `specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/fleet-reach-scan.md:57-65`; `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:110-118`]

### Recommendations

1. [implementable today] Make probe errors first-class and fail closed; never treat unavailable advisor output as no-reach.
2. [implementable today] Require the full untruncated multi-word inventory and record hub/phrase/owner/confidence/generation for every probe.
3. [implementable today] Fail on wrong-hub, report no-reach, and pair the dynamic probe with the static stage-1 authorization report; keep one-word declarations out of hard failures.
4. [implementable today] Add safe positive, wrong-hub, and no-reach categories as described in the iteration narrative.
5. [needs a scorer change] Require bounded scorer phrase-anchor evidence after stage-1 authorization; do not lower `0.8` or union router strings.

### What this iteration could not settle

Checker hardening, scorer changes, and exact CI sequencing remain implementation work outside this detached research lineage. A fresh live daemon result was unavailable through IPC.

## Phase synthesis — max-iterations research — gpt-5.6-luna

### What was read

All five iteration narratives, all five JSONL deltas, the final state log and strategy, the findings registry, the worker prompt, and the source families cited by the iterations: scorer lanes/projection, six hub contract quartets, compiled-route runtime/guard/manifest, and the router-vocabulary checker.

### Causal model

1. Hub discovery is stage 1: the advisor projection loads graph metadata intent signals and scores hubs. Hub-local routing is stage 2: `hub-router.json` and the machine-readable `ROUTER.md` `INTENT_SIGNALS` choose a mode/leaf after a hub has already been selected. The current scorer does not import the stage-2 router declarations.
2. A meaningful router phrase absent from owner-local graph metadata has no direct stage-1 author evidence. Short prompts add a second failure mode because stop-word filtering and `max(3, denominatorBasis)` reduce lexical overlap; an exact authorized author phrase can still route through the explicit lane, proving that phrase specificity and the `0.8` bar are not the primary cause.
3. Generic explicit boosts (`review -> sk-code`, `audit -> sk-code`, `branch -> sk-git`) compete with semantically specific stage-2 ownership. Existing primary-intent rules cover selected special cases but do not provide a general cross-hub ownership signal. This produces wrong-hub results even when the local router declaration is unambiguous.
4. Compiled routing is downstream and within-hub. Its resolver requires flag permission, compiled manifest authority, and matching snapshot identity; otherwise it falls back to legacy. Five hubs are in the compiled closure and `sk-design` is not. Fresh compiled manifests prove serving-artifact integrity, not stage-1 vocabulary reach.
5. The measurement layer must be exhaustive over meaningful multi-word declarations. `wrong-hub` is actionable; `no-reach` is useful telemetry for short/underspecified phrases. Probe failure is a separate hard error because the current checker silently drops execution/JSON errors and can otherwise report a false green. `--limit` is a coverage trap.

### Evidence ledger

| Question | Confirmed evidence | Result |
| --- | --- | --- |
| Scorer shape | `text.ts`, explicit/lexical lanes, fusion; built probes | Missing stage-1 evidence plus short-query normalization; no threshold reduction |
| Collision arbitration | Six hub routers plus explicit/fusion lanes | Generic token ownership lacks a bounded cross-hub phrase owner |
| Two vocabularies | Checker contract and six-hub join | Multi-word owner-local stage-1 authorization is the required invariant |
| Compiled routing | Resolver, engine, guard, closure manifest; six front-door probes | Within-hub/fail-closed layer; `sk-design` remains legacy |
| Measurement gate | Checker and generation-679 reports | Fail probe errors and wrong-hub; report no-reach; require full inventory |

### Ranked recommendations

1. [needs a scorer change] Generate an owner-local, provenance-bearing stage-1 phrase-authorization field from existing router declarations and consume it as a bounded exact/canonical phrase anchor. Keep the `0.8` confidence bar, preserve abstention without authorization, and arbitrate against generic tokens only when the owner proof is present.
2. [implementable today] Add a static multi-word contract report: `router phrase -> declared owner -> graph metadata intent signal` (or explicit generated authorization). Skip bare one-word vocabulary; use canonical normalization only for equivalent formatting.
3. [implementable today] Harden the dynamic checker so advisor execution/JSON errors become `probe-error` records and a non-passing result. Require the complete extracted inventory, forbid/trap `--limit` in CI, and record hub/phrase/owner/confidence/generation for every probe.
4. [implementable today] Keep `wrong-hub` as a hard failure and `no-reach` as visible telemetry. Add safe positives (`visual audit`, `code review`, `/deep:review`), safe wrong-hub fixtures (`decision branch`, `audit the diff`, `review this screen`, `review the documentation`), and short no-reach fixtures (`font size`, `critique this`, `stack trace`).
5. [implementable today] Keep compiled-route freshness and vocabulary reach as separate gates; expose `sk-design`'s legacy authority. If compiled design serving is later desired, treat it as a complete rollout with canary/parity/activation/manifest/guard/closure proof.
6. [needs a scorer change] Add a query-shape phrase-anchor path that recognizes an authorized multi-word phrase before stop-word filtering without increasing lexical weight globally. This is the principled scorer remedy for the `plot this` versus `plot this data` boundary.

### Ruled-out directions

- Lowering the confidence threshold: no-evidence prompts fail before confidence calibration and the bar is a deliberate abstention contract.
- Increasing lexical lane weight: it would strengthen generic-token collisions.
- A universal longest-phrase winner: `decision branch` shows that length is not semantic ownership.
- A global union of router vocabulary: it would make stage-2 prose untrusted cross-hub advisor input.
- Fuzzy phrase ownership: it would blur hub boundaries.
- Using compiled routing to repair hub discovery: the compiled engine consumes a chosen hub and only selects within it.
- Failing every no-reach row: the supplied baseline shows the gate would become unrunnable on short fragments.

### What this synthesis could not settle

The exact storage location for generated stage-1 authorization, the final checker hardening/CI sequencing, the post-fix live daemon ranks, and whether `sk-design` should receive a compiled rollout remain implementation decisions. The daemon-backed probes in this sandbox returned `EPERM`; the checked-in scorer and supplied generation-679 evidence were kept distinct.

### Convergence report

The five novelty ratios were `0.32`, `0.27`, `0.24`, `0.18`, and `0.21`; rolling average `0.244` against threshold `0.05`. Convergence was recorded as telemetry only and did not stop the loop early. All five required angles ran.

### Terminal record

Phase main loop reached the configured cap and phase synthesis completed with `stopReason: maxIterationsReached`. No parent packet, spec document, continuity metadata, generated context, validation command, or git write was run from this detached lineage.
