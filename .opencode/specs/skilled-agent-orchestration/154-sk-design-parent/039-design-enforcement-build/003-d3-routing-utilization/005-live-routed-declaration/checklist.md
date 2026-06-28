---
title: "Verification Checklist: Live ROUTED: declaration token + parser"
description: "Acceptance and verification gates for the additive ROUTED: declaration instruction and parser in live-executor.cjs, including the additive/no-regression, fail-closed, fix-completeness, and evergreen gates."
trigger_phrases:
  - "live routed declaration checklist"
  - "route declaration parser checklist"
  - "d3-r5 checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/005-live-routed-declaration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the landed live-executor.cjs change"
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
# Verification Checklist: Live ROUTED: declaration token + parser

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Instruction site and symptom site located in the single target file
  - **Evidence**: live prompt built inline in `buildLiveDispatchPrompt` (`live-executor.cjs:60-91`), route-gold instruction at `:75-83`; the former `observedIntents: []` hard-return is now the conditional set at `:314`
- [x] CHK-002 [P0] Transcript source confirmed for the parser
  - **Evidence**: `parseRoutedDeclaration` scans `responseText` assembled from `type:'text'` events (`:288`, `:303`) — the same string `extractRoutingJson` consumes (`:304`)
- [x] CHK-003 [P1] Scorer contract confirmed (no scorer edit needed)
  - **Evidence**: `routerResultFromObservation` reads `obs.observedIntents` → `routerResult.intents` (`score-skill-benchmark.cjs:131`) and `obs.raw.routeTelemetry` (`:134`); `reduceRouteTelemetry` reads `telemetry.workflowMode` (`:350-358`)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on the edited file
  - **Evidence**: `node --check live-executor.cjs` exits 0
- [x] CHK-011 [P0] Evergreen: no spec/packet/phase IDs or spec paths in code, comments, or the prompt string
  - **Evidence**: evergreen scan clean across the diff (no `D3-R5`/`039`/`005-`/`.opencode/specs/`); the prompt instruction is example-driven only
- [x] CHK-012 [P1] Parser degrades, never throws, on missing/garbage ROUTED text
  - **Evidence**: `parseRoutedDeclaration` returns `{ present: false }` for absent/malformed tokens; `JSON.parse` failure caught (`:246-248`); no throw path
- [x] CHK-013 [P1] `parseRoutedDeclaration` is a pure read over the transcript string; no writes, no process-wide state
  - **Evidence**: the helper only scans the passed `text` via `collectBraceBalancedObjects` (`:229`) and returns an object (`:251`)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] A ROUTED-bearing transcript populates `observedIntents` (no longer `[]`)
  - **Evidence**: `ROUTED: {"workflowMode":"motion","intents":["motion"]}` → `observedIntents:["motion"]` (`:314`), `raw.routeTelemetry:{observed:true, source:'live-declaration', workflowMode:["motion"]}` (`:332-336`), `observedWorkflowMode:"motion"` (`:330`)
- [x] CHK-021 [P0] Fail-closed: a route-gold scenario with NO token marks `route-declaration-missing`
  - **Evidence**: `--parse-file ... --require-route` a tokenless transcript → `observedIntents:[]`, `raw.routeTelemetry:{observed:false, reason:'route-declaration-missing'}`, top-level `routeDeclaration` marker (`:337-340`)
- [x] CHK-022 [P0] The conceptual `observedWorkflowMode` feeds the same field as Mode A
  - **Evidence**: the declared `workflowMode` (array) is written to `raw.routeTelemetry.workflowMode` (`:335`), the field `reduceRouteTelemetry` reads (`score-skill-benchmark.cjs:350-358`); top-level `observedWorkflowMode` also set (`:330`)
- [x] CHK-023 [P1] Parser unit coverage: single-line, pretty-printed, restated (last wins), scalar `workflowMode` normalized, garbage → `{present:false}`
  - **Evidence**: last-wins via the `last` accumulator (`:241-249`); `normalizeStringList` (`:236`); intents default `:238`; malformed → `{present:false}` (`:246-251`)
- [x] CHK-024 [P1] Parser coexistence: a transcript with ROUTED + a fenced routing-analysis block keeps `extractRoutingJson` recovery unchanged
  - **Evidence**: the bare ROUTED object has no `surface` key; `extractRoutingJson` keys off `surface`/`resources` (`:189`), so the two parsers key off disjoint markers and never cross-pick

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only — the symptom is one always-empty field (`observedIntents: []`); the fix is the single parser that populates it plus its conditional fail-closed branch
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; `observedIntents` is set only inside `live-executor.cjs` (`parseLiveResult` `:314` and the error path `:366`); the new producer is `parseRoutedDeclaration` (`:218-252`)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, schema fields, response fields, docs, and tests.
  - **Evidence**: `observedIntents` is consumed by `routerResultFromObservation` (`score-skill-benchmark.cjs:131`) → `intentRecall` (`:631`); `raw.routeTelemetry` by `reduceRouteTelemetry` (`:350-358`) — all read-only, no scorer edit
- [x] CHK-FIX-004 [P0] Security/path/parser fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: parser fallbacks exercised — no token (`{present:false}`), malformed object (caught `:246-248`), ROUTED line co-located with a fenced block (no cross-pick), and the tokenless no-op (byte-identical output)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: matrix axes are {token present, token absent} × {route-gold, non-route} — the four `parseLiveResult` branches (populated `:329-336`, fail-closed `:337-340`, tokenless non-route no-op)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable — `parseRoutedDeclaration` is a pure projection over the transcript string; it reads no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to `live-executor.cjs` `buildLiveDispatchPrompt` (`:60-91`), `parseRoutedDeclaration` (`:218-252`), and `parseLiveResult` (`:279-343`)

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] NO-REGRESSION: tokenless non-route observed result byte-identical pre vs post
  - **Evidence**: token absent + not route-gold → both `:329` and `:337` branches skipped, so no `routeDeclaration`/`raw.routeTelemetry` key; `observedIntents:[]` via `:314`; `observedResources`/`observedAssets`/`observedSurface`/`statedRoutingCorrect`/`activation`/`raw.stated`/`raw.responseText` unchanged
- [x] CHK-031 [P0] NO-REGRESSION: existing parsers unchanged and still recover SURFACE/resources
  - **Evidence**: `extractRoutingJson`/`proseRoutingFallback`/`collectBraceBalancedObjects`/`parseEvents` untouched; recovery identical on the same transcripts (`:304`)
- [x] CHK-032 [P0] Fail-closed is conditional — `route-declaration-missing` is emitted ONLY for route-gold scenarios
  - **Evidence**: `requireRouteDeclaration = hasRouteGold(scenario.expected)` (`:362`, `:345-347`); tokenless non-route runs never gain the `routeTelemetry` key
- [x] CHK-033 [P1] Scope held to one file; the scorer and `executor-dispatch.cjs` are untouched
  - **Evidence**: `git status` shows only `live-executor.cjs` modified; `score-skill-benchmark.cjs` unchanged; no external prompt-pack/template file exists, so none is edited
- [x] CHK-034 [P2] The live `aliasMissRate` inflation is flagged as an advisory-only caveat, not silently fixed
  - **Evidence**: plan §3 "Known advisory caveat" and implementation-summary record that the live declaration carries no alias evidence; the advisory `aliasMissRate` is unaffected by the gate and any fix is a scoped follow-up

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the final instruction + parser + fail-closed shape
  - **Evidence**: spec.md (Level 2, complete), plan.md, and tasks.md all reflect the ROUTED token format, the wiring, and the `route-declaration-missing` fail-closed marker
- [x] CHK-041 [P1] Implementation-summary records line refs + the with-token and fail-closed fixture outputs
  - **Evidence**: implementation-summary.md cites `live-executor.cjs:60-91`/`:218-252`/`:279-343`, plus the `observedIntents:["motion"]` and `route-declaration-missing` results
- [x] CHK-042 [P2] Record the single-file decision (scorer already reads the fields) and the prompt-coexistence design
  - **Evidence**: the "no scorer edit" decision and the ROUTED-line-first / fenced-block-second prompt design are noted in implementation-summary Key Decisions and plan §3

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: synthetic NDJSON fixtures used for the orchestrator's independent `parseLiveResult` verification were not committed under the skill tree
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: no temp artifacts remain in the spec or skill tree

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the route-gold-only ROUTED: declaration instruction, the `parseRoutedDeclaration` parser, the conditional `route-declaration-missing` fail-closed branch, and the tokenless no-regression control)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
COMPLETE: additive route-gold-only ROUTED: declaration instruction + parseRoutedDeclaration parser in live-executor.cjs; populates observedIntents + observedWorkflowMode + raw.routeTelemetry, fail-closed (route-declaration-missing) only for route-gold scenarios, byte-identical for tokenless non-design runs; scorer untouched
-->
