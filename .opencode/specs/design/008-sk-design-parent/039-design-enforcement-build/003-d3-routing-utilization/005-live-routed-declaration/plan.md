---
title: "Plan: Live ROUTED: declaration token + parser"
description: "Inject a machine-readable ROUTED: declaration into the live prompt built inline in live-executor.cjs and parse it to populate observedIntents + raw.routeTelemetry.workflowMode, failing closed (route-declaration-missing) when a route-gold scenario emits no token; strictly additive, no-regression for tokenless non-design runs."
trigger_phrases:
  - "live routed declaration plan"
  - "route declaration parser design build"
  - "d3-r5 plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/005-live-routed-declaration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark the plan complete against the landed live-executor.cjs change"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Live ROUTED: declaration token + parser

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), pure functions, no external deps |
| **Primary target** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs` |
| **Prompt-instruction site** | `buildLiveDispatchPrompt(scenario, skillId)` — the live prompt is assembled **inline** in `live-executor.cjs` (no external prompt-pack/template file exists), so the ROUTED instruction is injected there |
| **Symptom site** | `parseLiveResult` returns `observedIntents: []` unconditionally (`live-executor.cjs:246`); the dispatch-error path repeats it (`:278`) |
| **Consumes (read-only)** | the model's live transcript (NDJSON `type:'text'` events, already joined into `responseText` at `:236`); the route-requirement signal `scenario.expected.workflowMode`/`routeOutcome` threaded from `runLiveScenario` |
| **Scorer fields fed (read-only, NOT edited here)** | `observedIntents` → `routerResult.intents` (`score-skill-benchmark.cjs:112`) drives both `intentRecall` (`:417`) and the gated `hubRoute` `actual` set (`:302`); `raw.routeTelemetry.workflowMode` → `reduceRouteTelemetry` (`:270`, gated on `.observed` `:263`) |
| **Testing** | `node live-executor.cjs --parse-file <ndjson>` over a synthesized transcript with and without a ROUTED line, plus `node --check`; **no** live `opencode run` dispatch in CI |

### Overview

Live routing is invisible today: `intentRecall=0` across the 55 prompt scenarios because `parseLiveResult` hard-returns `observedIntents: []` (`live-executor.cjs:246`) — the executor never captures what the model actually routed to, so there is no observed route to grade against gold. The live transcript is read for stated SURFACE/resources (`extractRoutingJson`), but never for the chosen workflow mode.

This plan does one strictly additive thing across a **single file** (`live-executor.cjs`). (1) `buildLiveDispatchPrompt` is extended to instruct the model to emit a machine-readable `ROUTED:` declaration line carrying its chosen `workflowMode` + `intents` **in addition to** the existing fenced routing-analysis JSON block. (2) A new `parseRoutedDeclaration(text)` helper extracts that token, and `parseLiveResult` wires it into `observedIntents` (the array the scorer reads as `routerResult.intents`) and into an additive `raw.routeTelemetry` record whose `workflowMode` feeds the **same** `reduceRouteTelemetry` lane that D3-R4's Mode A emitter populates — so live and router modes report routing through one field. (3) Fail-closed: when a route-gold (design-routing) scenario returns **no** ROUTED token, the executor marks `route-declaration-missing` (an inert `raw.routeTelemetry: { observed: false, reason: 'route-declaration-missing' }` plus a top-level marker) so the row grades as a measured miss, never a silent pass.

The conceptual `observedWorkflowMode` named in the research backlog maps concretely to `raw.routeTelemetry.workflowMode`; there is no standalone `observedWorkflowMode` key in the observed-result shape, and this plan does not invent one — it feeds the existing telemetry field the scorer already consumes.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Instruction site located: the live prompt is built inline in `buildLiveDispatchPrompt` (`live-executor.cjs:59-76`); the fenced-block contract at `:72-74` is where the ROUTED line is added — confirmed no external prompt-pack/template file is read
- [x] Symptom site located: `parseLiveResult` returns `observedIntents: []` at `:246`; the dispatch-error early-out repeats it at `:278`
- [x] Transcript source confirmed: the model's answer text is collected from `type:'text'` events into `responseText` (`:221`, `:236`) — the ROUTED parser scans the same string `extractRoutingJson` already uses (`:237`)
- [x] Scorer contract confirmed: `routerResultFromObservation` reads `obs.observedIntents` → `routerResult.intents` (`score-skill-benchmark.cjs:112`) and `obs.raw.routeTelemetry` (`:115`); `intentRecall = setRecall(expected.intentKeys, routerResult.intents)` (`:417`); `scoreHubRoute` uses `routerResult.intents` as `actual` (`:302`); `reduceRouteTelemetry` reads `telemetry.workflowMode` (`:270`) gated on `telemetry.observed` (`:263`)
- [x] Route-requirement signal confirmed: a scenario is route-gold when `scenario.expected.workflowMode != null || scenario.expected.routeOutcome != null` (the scorer's own `hasRouteGold` predicate, `score-skill-benchmark.cjs:60-62`) — this is the signal threaded into `parseLiveResult` to make fail-closed conditional
- [x] No-collision confirmed: a `ROUTED:` bare object `{"workflowMode":...,"intents":...}` carries no `surface` key, so `extractRoutingJson`'s fenced-block path (keys off `surface`/`resources`, `:174`) and its bare-object fallback (requires `/surface/i`, `:182`) cannot mis-pick the ROUTED token, and vice-versa

### Definition of Done
- [x] A transcript whose text contains a `ROUTED:` line → `parseLiveResult` returns non-empty `observedIntents` (the declared intents) and `raw.routeTelemetry: { observed: true, source: 'live-declaration', workflowMode: [...] }` — `observedIntents` is no longer `[]`
- [x] A route-gold (design-routing) scenario whose transcript has **no** ROUTED line → `raw.routeTelemetry: { observed: false, reason: 'route-declaration-missing' }` plus a top-level `routeDeclaration: { present: false, reason: 'route-declaration-missing' }` marker; `observedIntents` stays `[]` so the gated `hubRoute` stage scores it `silent-default` (a measured miss, not a pass)
- [x] NO-REGRESSION for tokenless non-route runs: when no ROUTED line is present AND the scenario is not route-gold, the observed result is byte-identical to today — `observedIntents: []`, no new `raw.routeTelemetry` key, all existing fields (`observedResources`/`observedAssets`/`observedSurface`/`statedRoutingCorrect`/`activation`/`raw.stated`/`raw.responseText`) unchanged
- [x] NO-REGRESSION on existing parsing: `extractRoutingJson`/`proseRoutingFallback`/`collectBraceBalancedObjects`/`parseEvents` are unchanged and still recover SURFACE/resources from the same transcripts; the ROUTED parser is additive and runs alongside them
- [x] `node --check live-executor.cjs` exits 0
- [x] Code and comments carry no spec/packet/phase IDs or spec paths — evergreen scan clean across the diff
- [x] Verified via the existing `--parse-file <ndjson>` CLI entry (`:298`) over two synthesized fixtures (with-token, without-token) — no live `opencode run` dispatch required

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One additive instruction in the prompt builder plus one additive parser threaded into the existing observed-result assembly. Nothing in the current parse path (`extractRoutingJson`, `proseRoutingFallback`, the tool-call / observed-reads loop) is modified; the ROUTED token is recovered on a parallel lane and the two recovered objects never collide because they key off disjoint markers (`ROUTED:` prefix + `workflowMode`/`intents` vs. fenced/`surface`).

### Key Components

- **`buildLiveDispatchPrompt(scenario, skillId)`** (`live-executor.cjs:59-76`): append a ROUTED-declaration instruction. The model is told to emit, as the FIRST line of its answer, a single line `ROUTED: {"workflowMode": "<mode>", "intents": ["<mode>", ...]}` declaring the workflow mode it routed the task to, and only then emit the existing fenced routing-analysis JSON block. The existing "emit ONLY a fenced json block, nothing after it" wording (`:72`) is loosened to "first emit the ROUTED line, then emit ONLY the fenced json block" so the two contracts coexist.
- **`parseRoutedDeclaration(text)`** (new helper, `live-executor.cjs`): scans `responseText` for `ROUTED:` declarations, recovers the trailing brace-balanced object (reusing `collectBraceBalancedObjects` for robustness against pretty-printed JSON), and returns the LAST valid declaration (models restate — mirrors `extractRoutingJson`'s last-match convention). Returns `{ present: true, workflowMode: string[], intents: string[] }` when a valid object with `workflowMode` and/or `intents` is found, else `{ present: false }`. Tolerant normalization: `intents` defaults to `[workflowMode]` when only the scalar is given; `workflowMode` is normalized to array form for the telemetry record.
- **`parseLiveResult(stdout, { skillId, requireRouteDeclaration })`** (`live-executor.cjs:212`): after building `responseText` (`:236`), call `parseRoutedDeclaration(responseText)`. Branch additively (see Data Flow). The signature gains an additive `requireRouteDeclaration` option (default `false`) so non-route callers are unaffected.
- **`runLiveScenario({ scenario, skillRoot, model })`** (`live-executor.cjs:271`): compute `requireRouteDeclaration = hasRouteGold(scenario.expected)` (inline predicate: `expected.workflowMode != null || expected.routeOutcome != null`) and pass it into `parseLiveResult` (`:285`). The dispatch-error early-out (`:277-283`) is left as-is (already a non-pass) but tagged `raw.routeTelemetry: { observed: false, reason: 'dispatch-failed' }` only when `requireRouteDeclaration` is true, for symmetry — optional, additive.
- **CLI entry** (`live-executor.cjs:296-305`): the existing `--parse-file` path gains an optional `--require-route` boolean forwarded as `requireRouteDeclaration` so the fail-closed branch is reachable from the fixture harness without a live dispatch. (`_args.cjs` is a generic flag parser; confirm it passes the flag through — no edit to `_args.cjs` expected.)

### ROUTED declaration token (instructed in the live prompt, parsed by `parseRoutedDeclaration`)

```
ROUTED: {"workflowMode": "<mode>", "intents": ["<mode>", ...]}
```

- `workflowMode` — the single primary workflow mode the model routed the task to (string; e.g. `"motion"`). Tolerated as an array for ordered-bundle routes.
- `intents` — the array of routed workflow modes; this becomes `observedIntents`, which the scorer reads as `routerResult.intents` (the `hubRoute` `actual` set and the `intentRecall` input). For a single route it is `["motion"]`; for an `orderedBundle` it lists the bundle in routed order.

### Observed-result wiring (what `parseLiveResult` sets)

| Condition | `observedIntents` | `raw.routeTelemetry` | Top-level marker |
|-----------|-------------------|----------------------|------------------|
| ROUTED token present | declared `intents` | `{ observed: true, source: 'live-declaration', workflowMode: [...] }` | `routeDeclaration: { present: true }` |
| No token, scenario IS route-gold (`requireRouteDeclaration`) | `[]` | `{ observed: false, reason: 'route-declaration-missing' }` | `routeDeclaration: { present: false, reason: 'route-declaration-missing' }` |
| No token, scenario NOT route-gold | `[]` (unchanged) | **absent** (no new key) | absent — byte-identical to today |

Derivation rules (no re-scoring; the scorer is not edited):
- `observedIntents` = the declared `intents` (or `[workflowMode]`); empty when no token. This single change retires the `observedIntents: []` hard-return at `:246` for token-bearing runs and fixes `intentRecall=0`.
- `raw.routeTelemetry.workflowMode` = the declared `workflowMode` (array form) = the conceptual `observedWorkflowMode`; consumed by `reduceRouteTelemetry` exactly as the Mode A record is.
- Fail-closed `route-declaration-missing` is emitted ONLY when `requireRouteDeclaration` is true (route-gold scenario) so tokenless non-design runs keep today's output verbatim.

### Threading decision (why a single file)

The route-requirement signal lives on the scenario the executor already receives (`runLiveScenario({ scenario })`), and the transcript text is already assembled inside `parseLiveResult`. Both inputs are in `live-executor.cjs`, so the parser, the prompt instruction, and the fail-closed branch all land in one file. The scorer side already reads `obs.observedIntents` (`:112`) and `obs.raw.routeTelemetry` (`:115`) from D3-R4 — **no scorer edit is needed**; this packet only makes the live executor populate those fields.

### Known advisory caveat (out of scope, flag-only)

`reduceRouteTelemetry` computes an advisory `aliasMissRate` by counting observed rows whose `matchedAliases` is empty (`score-skill-benchmark.cjs:274-275`). The live declaration carries no alias evidence, so a correctly-routed live row will register as an alias-miss. This is **advisory/diagnostic only** — it never touches the gate (`hubRoute` keys off `intents`, not aliases) or the weighted score. Fixing it would require a scorer edit (a `source:'live-declaration'` skip in the alias lane) that is **out of scope** for this single-file packet; it is flagged here, not silently absorbed, and routed to a follow-up if the live `aliasMissRate` is ever read literally.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inject the ROUTED instruction (buildLiveDispatchPrompt)
- [x] Append a ROUTED-declaration instruction to the prompt array in `buildLiveDispatchPrompt` (`live-executor.cjs:59-76`): the model emits, as its FIRST answer line, `ROUTED: {"workflowMode": "<mode>", "intents": ["<mode>", ...]}` declaring the mode it routed to
- [x] Loosen the "emit ONLY a fenced json block, nothing after it" wording (`:72`) to "first emit the ROUTED line, then emit ONLY the fenced json block" so the ROUTED line and the existing fenced routing-analysis block coexist
- [x] Confirm the instruction is example-driven and evergreen (no spec/packet IDs in the prompt text)

### Phase 2: Parse + populate observedIntents / routeTelemetry (parseLiveResult)
- [x] Add `parseRoutedDeclaration(text)` reusing `collectBraceBalancedObjects`; return `{ present, workflowMode[], intents[] }`, taking the LAST valid `ROUTED:` object and normalizing scalar `workflowMode` → `[workflowMode]`, defaulting `intents` to `[workflowMode]`
- [x] In `parseLiveResult` (`:212`), after `responseText` is built (`:236`), call `parseRoutedDeclaration`; when present, set `observedIntents` from the declared intents and attach `raw.routeTelemetry: { observed: true, source: 'live-declaration', workflowMode: [...] }` (retires the `observedIntents: []` hard-return at `:246` for token-bearing runs)
- [x] Export `parseRoutedDeclaration` alongside the existing exports (`:294`) so it is unit-testable

### Phase 3: Fail-closed for route-gold scenarios (runLiveScenario + CLI)
- [x] Thread `requireRouteDeclaration = hasRouteGold(scenario.expected)` from `runLiveScenario` (`:271`) into `parseLiveResult` (`:285`)
- [x] When the token is absent AND `requireRouteDeclaration` is true → set `raw.routeTelemetry: { observed: false, reason: 'route-declaration-missing' }` and a top-level `routeDeclaration: { present: false, reason: 'route-declaration-missing' }`; keep `observedIntents: []` so the gated `hubRoute` stage scores `silent-default`
- [x] When the token is absent AND `requireRouteDeclaration` is false → leave the observed result byte-identical to today (no new key)
- [x] Forward an optional `--require-route` flag through the `--parse-file` CLI entry (`:298`) so the fail-closed branch is reachable from a fixture without a live dispatch

### Phase 4: Verification
- [x] `--parse-file` a synthesized NDJSON transcript whose `type:'text'` event carries a `ROUTED: {"workflowMode":"motion","intents":["motion"]}` line → output shows non-empty `observedIntents:["motion"]` and `raw.routeTelemetry.observed:true` with `workflowMode:["motion"]`
- [x] `--parse-file ... --require-route` a transcript with NO ROUTED line → output shows `observedIntents:[]`, `raw.routeTelemetry:{observed:false,reason:'route-declaration-missing'}`, and the top-level marker
- [x] NO-REGRESSION: `--parse-file` (no `--require-route`) a tokenless transcript → observed result byte-identical to the pre-change output (existing fields + `observedIntents:[]`, no `routeTelemetry` key)
- [x] NO-REGRESSION: a transcript with both a ROUTED line and a fenced routing-analysis block still yields the correct `observedResources`/`observedSurface` from `extractRoutingJson`, proving the two parsers do not interfere
- [x] `node --check live-executor.cjs` exits 0; evergreen scan clean (no spec/packet/phase IDs or spec paths)

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (parser) | `parseRoutedDeclaration`: single-line token, pretty-printed token, restated token (takes last), scalar `workflowMode` normalized to `[workflowMode]`, missing/garbage → `{present:false}` | Node assertions / inline harness |
| Unit (wiring) | `parseLiveResult` branches: token present → populated `observedIntents` + `routeTelemetry.observed:true`; tokenless + required → `route-declaration-missing`; tokenless + not required → byte-identical to today | `--parse-file` fixtures |
| Integration (fixtures) | Two synthesized NDJSON transcripts (with-token, without-token) through the `--parse-file` CLI; assert the observed-result JSON shape | `node live-executor.cjs --parse-file` |
| Regression (no-op) | Tokenless non-route transcript: serialized observed result identical pre vs post (no new key) | Diff of serialized result |
| Regression (parser coexistence) | Transcript with ROUTED + fenced block: `extractRoutingJson` still recovers SURFACE/resources unchanged | `--parse-file` + diff |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `collectBraceBalancedObjects` (`live-executor.cjs:121`) | Internal (landed) | Green | Reused by `parseRoutedDeclaration`; without it the parser would need its own brace scanner |
| `responseText` assembly from `type:'text'` events (`:221`, `:236`) | Internal (landed) | Green | The ROUTED parser scans this string; if text events are absent the token cannot be recovered |
| D3-R4 scorer fields `observedIntents` (`:112`) + `obs.raw.routeTelemetry` (`:115`) | Internal (landed) | Green | The scorer already reads both; if they were not threaded, the populated fields would be ignored |
| `scenario.expected.workflowMode`/`routeOutcome` (route-gold corpus, D3-R3) | Internal (landed) | Green | The fail-closed `requireRouteDeclaration` signal; without route gold no scenario demands a token (parser still populates when present) |
| `_args.cjs` generic flag parsing (`:297`) | Internal (landed) | Green | Forwards `--require-route`; if it does not pass arbitrary flags the fixture harness needs an alternate toggle (read-only confirm, no edit expected) |

### Risk: prompt-contract conflict

The existing prompt says "emit ONLY a fenced json block, nothing after it" (`:72`). Adding a ROUTED line naively could make the model drop the fenced block or vice-versa. **Mitigation:** instruct the ROUTED line as the FIRST line (before the fenced block) and rewrite the closing constraint to name both artifacts explicitly; the parsers are independent and last-match tolerant, so even a restated or reordered token is recovered. If a live run shows the model consistently emitting only one artifact, that is a prompt-tuning follow-up, not a parser defect — flag it, do not widen scope.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the no-op control diff shows any change to a tokenless non-route transcript's observed result, or `extractRoutingJson` recovery regresses on a ROUTED+fenced transcript.
- **Procedure**: revert the single-file change (`live-executor.cjs`). No data migration, no fixture edits, no scorer change to unwind. The live executor returns to the `observedIntents: []` / `intentRecall=0` baseline.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Instruction) ──> Phase 2 (Parse + populate) ──> Phase 3 (Fail-closed) ──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inject instruction | None | Parse + populate |
| Parse + populate | Inject instruction | Fail-closed |
| Fail-closed | Parse + populate | Verify |
| Verify | Fail-closed | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inject ROUTED instruction (`buildLiveDispatchPrompt`) | Low | 30-45 minutes |
| `parseRoutedDeclaration` + `parseLiveResult` wiring | Medium | 1-1.5 hours |
| Fail-closed branch + `--require-route` CLI forward | Medium | 45-60 minutes |
| Verification (with/without-token fixtures + no-op + node --check) | Medium | 1-1.5 hours |
| **Total** | | **3.25-4.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured before edit — the pre-change `--parse-file` output for a tokenless non-route transcript is saved as the byte-identical no-op reference
- [x] Additive-only reference confirmed — for tokenless non-route runs, `observedIntents` stays `[]` and no `routeTelemetry` key is added
- [x] Feature flag — N/A confirmed: additive prompt instruction + additive parser; inert for tokenless non-route runs and never folded into the weighted score (the scorer is untouched)
- [x] Monitoring — N/A confirmed: CI-time deterministic parse path; the live `opencode run` dispatch is exercised by the benchmark, not by this packet's verification

### Rollback Procedure
1. **Immediate**: `git checkout -- live-executor.cjs` (single-file revert)
2. **Verify**: re-run the no-op control + the parser-coexistence diff; confirm both match the pre-change baselines
3. **Notify**: record in the implementation summary why the declaration parser was reverted

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: none required; the change touches one script and reads (never writes) the transcript and the scenario's expected route gold

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
- COMPLETE: single-file ROUTED: declaration token + parser landed in live-executor.cjs; additive, fail-closed (route-declaration-missing) only for route-gold scenarios, byte-identical for tokenless non-design runs; scorer untouched (already reads observedIntents + raw.routeTelemetry)
-->
