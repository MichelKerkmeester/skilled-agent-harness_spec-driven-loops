---
title: "Implementation Summary: D3-R5 live ROUTED: declaration token + parser"
description: "Post-build record for the additive ROUTED: declaration instruction and parseRoutedDeclaration parser in live-executor.cjs: what was built, how the always-empty observedIntents:[] hard-return is retired so intentRecall is measurable, the route-gold-only fail-closed branch, the scorer-needs-no-edit fact, and the tokenless no-regression proof. Honest framing: this fixes the measured intentRecall=0 by capturing the dispatched session's own routing declaration; fail-closed applies ONLY to route-gold design scenarios, so tokenless non-design live runs stay byte-identical."
trigger_phrases:
  - "live routed declaration implementation summary"
  - "route declaration parser build record"
  - "intentRecall fix observedIntents summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/005-live-routed-declaration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the ROUTED token + parser build that fixes intentRecall=0"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-live-routed-declaration |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | A route-gold-only `ROUTED:` declaration instruction + the `parseRoutedDeclaration` parser in `live-executor.cjs`, wiring the declared route into `observedIntents` / `observedWorkflowMode` / `raw.routeTelemetry` and failing closed when a route-gold scenario emits no token |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Live routing was invisible: every live scenario scored `intentRecall=0` because `parseLiveResult` hard-returned `observedIntents: []` regardless of what the model actually routed to. The executor read the transcript for the stated SURFACE and resources but never for the chosen workflow mode, so there was no observed route to grade against gold. This phase captures the dispatched session's own routing declaration and feeds it into the fields the scorer already reads, turning `intentRecall=0` into a measurable signal. The whole change lands in a single file (`live-executor.cjs`); the scorer was not touched.

### The ROUTED: declaration token

`buildLiveDispatchPrompt(scenario, skillId)` (`live-executor.cjs:60-91`) now asks the model to emit, as the FIRST line of its answer, a machine-readable `ROUTED: {"workflowMode": "<mode>", "intents": ["<mode>", "..."]}` declaration naming the workflow mode it routed to, and only then emit the existing fenced routing-analysis JSON block. The instruction is injected ONLY when `hasRouteGold(scenario.expected)` is true (`:75-83`); non-route-gold scenarios get the original "emit ONLY a fenced json block" wording verbatim (`:82`). The bare ROUTED object carries no `surface` key, so it never collides with `extractRoutingJson`, which keys off `surface`/`resources`.

### The parseRoutedDeclaration parser

`parseRoutedDeclaration(text)` (`:218-252`) is a new pure helper that scans `responseText` for `ROUTED:` declarations, recovers each trailing brace-balanced object by reusing `collectBraceBalancedObjects`, and returns the LAST valid declaration (models restate; last-wins mirrors `extractRoutingJson`). It is malformed-tolerant: a `JSON.parse` failure is caught and treated as absent (`:246-248`), and a declaration with neither `workflowMode` nor `intents` is skipped (`:239`). It normalizes a scalar `workflowMode` to array form and defaults `intents` to `[workflowMode]` when only the scalar is given (`:236-238`), returning `{ present: false }` when no valid token is found. The helper is exported (`:387`) so it is unit-testable.

### observedIntents wired from the declaration (the intentRecall fix)

`parseLiveResult(stdout, { skillId, requireRouteDeclaration = false })` (`:279`) now sets `observedIntents: routed.present ? routed.intents : []` (`:314`), retiring the unconditional `observedIntents: []` that caused `intentRecall=0`. When a token is present it also attaches a top-level `observedWorkflowMode` (`:330`), a `routeDeclaration: { present: true }` marker (`:331`), and `raw.routeTelemetry: { observed: true, source: 'live-declaration', workflowMode: [...] }` (`:332-336`) — the same telemetry lane the router-mode emitter populates.

### Conditional fail-closed for route-gold scenarios

`runLiveScenario` computes `requireRouteDeclaration = hasRouteGold(scenario.expected)` (`:362`) and threads it into `parseLiveResult` (`:378`). When a route-gold scenario returns no token, the executor marks `routeDeclaration: { present: false, reason: 'route-declaration-missing' }` (`:338`) and `raw.routeTelemetry: { observed: false, reason: 'route-declaration-missing' }` (`:339`), keeping `observedIntents: []` so the gated `hubRoute` stage scores it a measured miss rather than a silent pass. The dispatch-error early-out is tagged the same way, but only when `requireRouteDeclaration` is true (`:372-375`). When the token is absent AND the scenario is not route-gold, none of those keys are added and the observed result is byte-identical to the pre-change baseline. The `--parse-file` CLI entry forwards an optional `--require-route` flag (`:392`) so the fail-closed branch is reachable from a fixture without a live dispatch.

### The scorer needed no edit

`score-skill-benchmark.cjs` was not changed: it already reads `obs.observedIntents` into `routerResult.intents` (`:131`) and `obs.raw.routeTelemetry` (`:134`), drives `intentRecall = setRecall(expected.intentKeys, routerResult.intents)` (`:631`), and reduces `telemetry.workflowMode` in `reduceRouteTelemetry` (`:350-358`). This phase only makes the live executor populate the fields the scorer was already consuming.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs` | Modified | Added the route-gold-only ROUTED instruction in `buildLiveDispatchPrompt`, the `parseRoutedDeclaration` parser, and the `parseLiveResult` wiring (`observedIntents` / `observedWorkflowMode` / `raw.routeTelemetry`) plus the conditional `route-declaration-missing` fail-closed; forwarded `--require-route` through the CLI |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Unchanged | Already reads `observedIntents` (`:131`) and `raw.routeTelemetry` (`:134`); confirmed untouched by `git status` |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) edited only `live-executor.cjs`, then the orchestrator verified acceptance INDEPENDENTLY by running `parseLiveResult` over synthetic NDJSON rather than trusting the claim. A transcript carrying `ROUTED: {"workflowMode":"motion","intents":["motion"]}` produced `observedIntents:["motion"]`, `observedWorkflowMode:"motion"`, and `raw.routeTelemetry.observed:true` — the field that was always `[]` is now populated. A route-gold transcript with no ROUTED line plus `requireRouteDeclaration` produced `routeDeclaration:{present:false, reason:'route-declaration-missing'}`. A non-route-gold transcript with no token produced a result with `routeDeclaration` and `routeTelemetry` both absent — byte-identical to today, no new flag. A malformed ROUTED line returned `{present:false}`, tolerated without throwing. `node --check live-executor.cjs` exits 0, the evergreen scan over the diff is clean, and `git status` confirms `score-skill-benchmark.cjs` is unmodified — scope held to `live-executor.cjs` only.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Inject the ROUTED instruction only when `hasRouteGold(scenario.expected)` | Non-design live runs carry no route gold, so adding the token there would change their prompt and risk drift for no measurable gain; gating it keeps tokenless non-design dispatches verbatim |
| Make `route-declaration-missing` conditional on `requireRouteDeclaration` | Failing closed for every tokenless run would regress non-route scenarios; tying it to the route-gold predicate keeps the no-regression guarantee while still grading a design route-gold miss as a miss |
| Wire the declared `intents` into `observedIntents` rather than re-deriving from the fenced block | `observedIntents` is the exact array the scorer reads as `routerResult.intents`; populating it directly fixes `intentRecall=0` with no scorer edit |
| Add a top-level `observedWorkflowMode` alongside `raw.routeTelemetry.workflowMode` | The spec and research backlog named `observedWorkflowMode` literally; setting it next to the telemetry lane keeps the observed shape self-describing while still feeding the field `reduceRouteTelemetry` reads — additive, present only on the token-bearing path |
| Reuse `collectBraceBalancedObjects` and last-wins in `parseRoutedDeclaration` | The brace scanner already survives pretty-printed JSON, and last-wins matches `extractRoutingJson`, so restated declarations are recovered without a second parser convention |
| Leave the scorer untouched | `observedIntents` → `routerResult.intents` and `raw.routeTelemetry.workflowMode` were already consumed; the only gap was the live executor never populating them |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ROUTED-bearing transcript populates `observedIntents` (no longer `[]`) | PASS, `ROUTED:{"workflowMode":"motion","intents":["motion"]}` → `observedIntents:["motion"]`, `observedWorkflowMode:"motion"`, `raw.routeTelemetry.observed:true` (`live-executor.cjs:314,330,332-336`) |
| Fail-closed: route-gold scenario with no token | PASS, `requireRouteDeclaration` + no ROUTED → `routeDeclaration:{present:false, reason:'route-declaration-missing'}` and `raw.routeTelemetry:{observed:false, reason:'route-declaration-missing'}` (`:337-340`) |
| NO-REGRESSION: tokenless non-route transcript byte-identical | PASS, no token + not route-gold → `routeDeclaration`/`routeTelemetry` absent, `observedIntents:[]`; no new key added (`:314,329-340`) |
| Parser tolerates malformed/absent tokens | PASS, malformed ROUTED line → `{present:false}`; `JSON.parse` failure caught (`:246-248`), no throw |
| ROUTED instruction is route-gold-only | PASS, injected under `hasRouteGold(scenario.expected)` (`:75-83`); non-route-gold prompt unchanged (`:82`) |
| Scorer reads the populated fields with no edit | PASS, `observedIntents`→`routerResult.intents` (`score-skill-benchmark.cjs:131`), `obs.raw.routeTelemetry` (`:134`), `intentRecall` (`:631`), `reduceRouteTelemetry` `telemetry.workflowMode` (`:350-358`) |
| `node --check` on the edited file | PASS, `node --check live-executor.cjs` exits 0 |
| Evergreen scan (no spec/packet/phase IDs) | PASS, no identifiers or `specs/` paths in the diff |
| Scope held to one file | PASS, `git status` shows only `live-executor.cjs` modified; `score-skill-benchmark.cjs` unchanged |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fix depends on the model emitting the token.** `parseRoutedDeclaration` can only populate `observedIntents` when the dispatched session actually prints a `ROUTED:` line. If a live model consistently omits it for route-gold scenarios, those rows fail closed as `route-declaration-missing` (a measured miss), which is correct, but the prompt may then need tuning — that is a prompt follow-up, not a parser defect.
2. **Fail-closed is route-gold-only by design.** Tokenless non-design live runs gain no `routeTelemetry` key and stay byte-identical to the pre-change baseline. A non-design scenario that should declare a route but is not marked route-gold will not be caught here; widening the route-gold corpus is a separate phase.
3. **The live declaration carries no alias evidence.** A correctly-routed live row registers as an alias-miss in the advisory `aliasMissRate` because the declaration lists modes, not matched aliases. This is advisory/diagnostic only — it never touches the gate (`hubRoute` keys off `intents`, not aliases) or the weighted score. A `source:'live-declaration'` skip in the alias lane would be a scorer edit, out of scope for this single-file phase.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for the additive route-gold-only ROUTED: declaration instruction + parseRoutedDeclaration parser in live-executor.cjs; retires the observedIntents:[] hard-return so intentRecall is measurable, fail-closed (route-declaration-missing) only for route-gold scenarios, byte-identical for tokenless non-design runs; scorer untouched (already reads observedIntents + raw.routeTelemetry)
-->
