---
title: "Tasks: Live ROUTED: declaration token + parser"
description: "Ordered build tasks for injecting the ROUTED: declaration into the inline live prompt and parsing it in live-executor.cjs to populate observedIntents + raw.routeTelemetry, with explicit additive/no-regression and fail-closed verification."
trigger_phrases:
  - "live routed declaration tasks"
  - "route declaration parser tasks"
  - "d3-r5 tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/005-live-routed-declaration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all build tasks complete with landed live-executor.cjs evidence"
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
# Tasks: Live ROUTED: declaration token + parser

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

_Inject the ROUTED: instruction into the inline live prompt (live-executor.cjs) — 30-45 minutes_

- [x] T001 Append a ROUTED-declaration instruction to the prompt array in `buildLiveDispatchPrompt` — the model emits, as its FIRST answer line, `ROUTED: {"workflowMode": "<mode>", "intents": ["<mode>", ...]}` naming the workflow mode it routed the task to (`live-executor.cjs:59-76`) [20m] — landed `:76-80`, injected only under `hasRouteGold` `:75-83`
- [x] T002 Loosen the "emit ONLY a fenced json block, nothing after it" wording to "first emit the ROUTED line, then emit ONLY the fenced json block" so the ROUTED line and the existing fenced routing-analysis block coexist (`live-executor.cjs:72`) [10m] — `:79` route-gold path; `:82` non-route path keeps the original wording
- [x] T003 Confirm the instruction text is example-driven and evergreen — no spec/packet/phase IDs in the prompt string (`live-executor.cjs:59-76`) [5m] — evergreen scan clean, example-driven shape only

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Parse the token, wire it into the observed result, and fail closed (live-executor.cjs) — 1.75-2.5 hours_

### Parser
- [x] T004 Add `parseRoutedDeclaration(text)` reusing `collectBraceBalancedObjects`; scan `responseText` for `ROUTED:` declarations and return the LAST valid object as `{ present, workflowMode[], intents[] }` (`live-executor.cjs`) [40m] — landed `:218-252`, last-wins via the `last` accumulator
- [x] T005 Normalize inside the parser: scalar `workflowMode` → `[workflowMode]`; `intents` defaults to `[workflowMode]` when only the scalar is given; invalid/garbage/no-token → `{ present: false }` (`live-executor.cjs`) [15m] — `normalizeStringList` `:236`, intents default `:238`, malformed caught `:246-248`
- [x] T006 [P] Export `parseRoutedDeclaration` alongside the existing exports so it is unit-testable (`live-executor.cjs:294`) [5m] — exported `:387`

### Wire into parseLiveResult
- [x] T007 In `parseLiveResult`, after `responseText` is built (`:236`), call `parseRoutedDeclaration`; when present, set `observedIntents` from the declared intents and attach `raw.routeTelemetry: { observed: true, source: 'live-declaration', workflowMode: [...] }` — retires the `observedIntents: []` hard-return at `:246` for token-bearing runs (`live-executor.cjs:212-260`) [30m] — `observedIntents` `:314`, telemetry `:332-336`; declaration parsed at `:309`
- [x] T008 Add a top-level `routeDeclaration: { present: true }` marker on the populated path; confirm `workflowMode` (array) is the field `reduceRouteTelemetry` reads as the conceptual `observedWorkflowMode` (`live-executor.cjs`) [15m] — marker `:331`, top-level `observedWorkflowMode` `:330`, scorer reads `telemetry.workflowMode` (`score-skill-benchmark.cjs:350-358`)

### Fail-closed
- [x] T009 Thread `requireRouteDeclaration = hasRouteGold(scenario.expected)` (inline: `expected.workflowMode != null || expected.routeOutcome != null`) from `runLiveScenario` (`:271`) into `parseLiveResult` (`:285`) as an additive option (default `false`) (`live-executor.cjs`) [20m] — computed `:362`, passed `:378`; `parseLiveResult` default `false` `:279`; `hasRouteGold` `:345-347`
- [x] T010 When the token is absent AND `requireRouteDeclaration` is true → set `raw.routeTelemetry: { observed: false, reason: 'route-declaration-missing' }` + top-level `routeDeclaration: { present: false, reason: 'route-declaration-missing' }`; keep `observedIntents: []` so the gated `hubRoute` stage scores `silent-default` (`live-executor.cjs`) [20m] — `:337-340`, `observedIntents:[]` via `:314`
- [x] T011 When the token is absent AND `requireRouteDeclaration` is false → leave the observed result byte-identical to today (no new key, `observedIntents: []`) — the no-regression branch for tokenless non-design runs (`live-executor.cjs`) [10m] — both `:329` and `:337` branches skipped → no `routeDeclaration`/`routeTelemetry` key
- [x] T012 Forward an optional `--require-route` boolean through the `--parse-file` CLI entry so the fail-closed branch is reachable from a fixture without a live dispatch; confirm `_args.cjs` passes the flag (read-only, no edit) (`live-executor.cjs:296-305`) [15m] — forwarded `:392` (`args['require-route'] === true`); `_args.cjs` unedited

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Parser + wiring checks, fail-closed + no-regression, evergreen, documentation — 1-1.5 hours_

### Parser + wiring checks
- [x] T013 Unit `parseRoutedDeclaration`: single-line token, pretty-printed token, restated token (takes last), scalar `workflowMode` normalized, garbage/no-token → `{present:false}` [20m] — verified independently: malformed line → `{present:false}`, restated → last wins
- [x] T014 Integration (with-token): `--parse-file` a synthesized NDJSON whose `type:'text'` event carries `ROUTED: {"workflowMode":"motion","intents":["motion"]}` → output shows `observedIntents:["motion"]` and `raw.routeTelemetry:{observed:true, workflowMode:["motion"]}` [20m] — orchestrator-verified: `observedIntents:["motion"]`, `observedWorkflowMode:"motion"`, `routeTelemetry.observed:true`
- [x] T015 Parser-coexistence: a transcript with BOTH a ROUTED line and a fenced routing-analysis block → `extractRoutingJson` still recovers the correct `observedResources`/`observedSurface` unchanged [15m] — bare ROUTED object has no `surface` key; `extractRoutingJson` keys off `surface`/`resources` `:189`, no cross-pick

### Fail-closed + no-regression
- [x] T016 Fail-closed: `--parse-file ... --require-route` a transcript with NO ROUTED line → `observedIntents:[]`, `raw.routeTelemetry:{observed:false, reason:'route-declaration-missing'}`, top-level marker present [15m] — orchestrator-verified: `routeDeclaration:{present:false, reason:'route-declaration-missing'}` (`:337-340`)
- [x] T017 No-regression: `--parse-file` (no `--require-route`) a tokenless transcript → observed result byte-identical to the captured pre-change baseline (existing fields + `observedIntents:[]`, no `routeTelemetry` key) [15m] — orchestrator-verified: `routeDeclaration` + `routeTelemetry` both absent, no new flag

### Evergreen + documentation
- [x] T018 `node --check live-executor.cjs` exits 0; evergreen scan confirms no spec/packet/phase IDs or spec paths in code/comments [10m] — `node --check` exits 0; evergreen scan clean across the diff
- [x] T019 Update implementation-summary.md with the instruction/parser/fail-closed evidence (line refs, the with-token and fail-closed fixture outputs) [15m] — implementation-summary.md cites `:60-91`/`:218-252`/`:279-343` plus the `observedIntents:["motion"]` and `route-declaration-missing` results
- [x] T020 Mark all checklist items with evidence [10m] — checklist.md P0/P1/P2 all `[x]` with landed line-ref evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Parser unit + with-token integration passing (`observedIntents` no longer `[]`)
- [x] Fail-closed fixture passing (`route-declaration-missing` for a route-gold scenario with no token)
- [x] No-regression: tokenless non-route observed result byte-identical; `extractRoutingJson` recovery unchanged on ROUTED+fenced transcripts; scorer untouched
- [x] `node --check` clean on `live-executor.cjs`; evergreen scan clean
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks (incl. additive-only + fail-closed + no-regression)
- COMPLETE: single-file ROUTED: declaration token + parser landed in live-executor.cjs; populates observedIntents + observedWorkflowMode + raw.routeTelemetry, fail-closed (route-declaration-missing) only for route-gold scenarios, byte-identical for tokenless non-design runs; scorer untouched
-->
