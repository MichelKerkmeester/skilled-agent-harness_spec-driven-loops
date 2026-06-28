---
title: "D3-R5 — Live ROUTED: declaration token + parser"
description: "Add a route-gold-only ROUTED: declaration line+JSON to the live prompt and a parseRoutedDeclaration parser in live-executor.cjs that populates observedIntents / observedWorkflowMode / raw.routeTelemetry, failing closed (route-declaration-missing) when a route-gold scenario emits no token. Honest framing: this fixes the measured intentRecall=0 (observedIntents was hard-coded []) by capturing the dispatched session's own routing declaration; fail-closed is route-gold-only so tokenless non-design live runs stay byte-identical, and the scorer needed no edit."
trigger_phrases:
  - "d3-r5 routed declaration token"
  - "live route declaration design build"
  - "intentRecall observedIntents fix"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/005-live-routed-declaration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the phase complete"
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
# D3-R5 — Live ROUTED: declaration token + parser

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Live routing was invisible. `parseLiveResult` hard-returned `observedIntents: []` for every scenario, so the measured `intentRecall` was `0` across the live corpus — the executor read the transcript for the stated SURFACE and resources but never captured which workflow mode the model actually routed to. With no observed route, a live miss could not be told apart from silence, and live utilization could not be graded against gold.

### Purpose
Capture the dispatched session's own routing declaration and feed it into the fields the scorer already reads, in a single strictly additive file (`live-executor.cjs`). `buildLiveDispatchPrompt` instructs the model to emit a machine-readable `ROUTED: {"workflowMode": "<mode>", "intents": ["<mode>", ...]}` declaration as the FIRST answer line — injected ONLY for route-gold scenarios. A new `parseRoutedDeclaration(text)` recovers the last valid declaration (malformed-tolerant) and `parseLiveResult` wires its `intents` into `observedIntents`, sets `observedWorkflowMode`, and attaches `raw.routeTelemetry: { observed: true, source: 'live-declaration', workflowMode }` — the same telemetry lane the router-mode emitter feeds. The honest framing: this retires the always-empty `observedIntents: []` so `intentRecall` becomes measurable. Fail-closed (`route-declaration-missing`) is emitted ONLY when a route-gold scenario returns no token, so tokenless non-design live runs stay byte-identical to the prior baseline. The scorer needed no edit — it already consumed `observedIntents` and `raw.routeTelemetry`.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A route-gold-only ROUTED-declaration instruction in `buildLiveDispatchPrompt`, gated on `hasRouteGold(scenario.expected)`
- `parseRoutedDeclaration(text)` reusing `collectBraceBalancedObjects`; last-wins, scalar-`workflowMode` normalized, `intents` defaulted to `[workflowMode]`, malformed/absent → `{ present: false }`
- Wiring `observedIntents` / `observedWorkflowMode` / `raw.routeTelemetry` from the declaration in `parseLiveResult`
- The conditional `route-declaration-missing` fail-closed branch when `requireRouteDeclaration` (route-gold) and no token
- Forwarding an optional `--require-route` flag through the `--parse-file` CLI entry

### Out of Scope
- Any edit to `score-skill-benchmark.cjs` (it already reads `observedIntents` and `raw.routeTelemetry`)
- Any edit to `executor-dispatch.cjs` or any external prompt-pack/template file (none exists; the prompt is built inline)
- Changing the tokenless non-route observed-result shape (it must stay byte-identical)
- Fixing the advisory `aliasMissRate` inflation for live-declaration rows (a scorer edit, deferred follow-up)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs` | Modify | Add the route-gold-only ROUTED instruction, the `parseRoutedDeclaration` parser, the `parseLiveResult` wiring, the conditional fail-closed branch, and the `--require-route` CLI forward |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Unchanged | Already consumes `observedIntents` (`:131`) and `raw.routeTelemetry` (`:134`); confirmed untouched |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A ROUTED-bearing transcript populates `observedIntents` | `ROUTED:{"workflowMode":"motion","intents":["motion"]}` → `observedIntents:["motion"]`, `observedWorkflowMode:"motion"`, `raw.routeTelemetry:{observed:true, source:'live-declaration', workflowMode:["motion"]}` (`live-executor.cjs:314,330,332-336`) |
| REQ-002 | Fail-closed for a route-gold scenario with no token | `requireRouteDeclaration` + no ROUTED → `routeDeclaration:{present:false, reason:'route-declaration-missing'}` + `raw.routeTelemetry:{observed:false, reason:'route-declaration-missing'}`; `observedIntents:[]` (`:337-340`) |
| REQ-003 | NO-REGRESSION for tokenless non-route runs | No token + not route-gold → `observedIntents:[]`, no `routeDeclaration`/`routeTelemetry` key; observed result byte-identical to the pre-change baseline (`:314,329-340`) |
| REQ-004 | The scorer is untouched and still consumes the fields | `observedIntents`→`routerResult.intents` (`score-skill-benchmark.cjs:131`), `obs.raw.routeTelemetry` (`:134`), `intentRecall` (`:631`); `git status` shows only `live-executor.cjs` modified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The ROUTED instruction is route-gold-only | Injected under `hasRouteGold(scenario.expected)` (`:75-83`); non-route-gold prompt unchanged (`:82`) |
| REQ-006 | `parseRoutedDeclaration` degrades, never throws | Malformed/absent token → `{present:false}`; `JSON.parse` failure caught (`:246-248`); last-wins on restated tokens |
| REQ-007 | `node --check` clean; evergreen body | `node --check live-executor.cjs` exits 0; no spec/packet/phase IDs or `specs/` paths in the diff |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A transcript carrying `ROUTED:{"workflowMode":"motion","intents":["motion"]}` yields `observedIntents:["motion"]`, `observedWorkflowMode:"motion"`, and `raw.routeTelemetry.observed:true` — the field that was always `[]` is now populated.
- **SC-002**: A route-gold transcript with no ROUTED line and `requireRouteDeclaration` marks `route-declaration-missing` on both `routeDeclaration` and `raw.routeTelemetry`, keeping `observedIntents:[]` so the gated `hubRoute` stage scores it a measured miss.
- **SC-003**: A non-route-gold transcript with no token returns a result with `routeDeclaration` and `routeTelemetry` both absent — byte-identical to the prior output, no new flag.
- **SC-004**: A malformed ROUTED line returns `{present:false}` and is tolerated without throwing.
- **SC-005**: The change is scoped to `live-executor.cjs` only; `score-skill-benchmark.cjs` is unchanged, `node --check` exits 0, and the diff is evergreen.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fail-closed applied to every tokenless run | Non-design live runs would change shape and regress | `route-declaration-missing` is conditional on `requireRouteDeclaration = hasRouteGold(scenario.expected)`; tokenless non-route runs gain no `routeTelemetry` key and stay byte-identical |
| Risk | The ROUTED instruction drops the fenced routing-analysis block | `extractRoutingJson` recovery of SURFACE/resources would regress | The ROUTED line is instructed FIRST, then the fenced block; the bare ROUTED object has no `surface` key so the two parsers key off disjoint markers and never cross-pick |
| Risk | Live runs only show routing when the model emits the token | A model that omits ROUTED for route-gold scenarios scores `route-declaration-missing` | That is a correct measured miss; a persistent omission is a prompt-tuning follow-up, not a parser defect — flagged, not silently widened |
| Risk | The live declaration carries no alias evidence | The advisory `aliasMissRate` inflates for correctly-routed live rows | Advisory/diagnostic only; never touches the gate (`hubRoute` keys off `intents`) or the weighted score. A `source:'live-declaration'` alias-lane skip is a deferred scorer edit, out of scope here |
| Dependency | `scenario.expected.workflowMode`/`routeOutcome` (route-gold corpus) | The `requireRouteDeclaration` signal for fail-closed | Landed; without route gold no scenario demands a token (the parser still populates when present) |
| Dependency | Scorer fields `observedIntents` (`:131`) + `obs.raw.routeTelemetry` (`:134`) | The fields this phase populates | Landed; the scorer already reads both, so no scorer edit was needed |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Additivity
- **NFR-A01**: The ROUTED instruction and parser are additive. For tokenless non-route runs no new key is added; the populated path only adds `observedWorkflowMode`, `routeDeclaration`, and `raw.routeTelemetry` on top of the existing observed shape.

### Determinism
- **NFR-D01**: `parseRoutedDeclaration` is a pure projection over the transcript string. The same transcript yields the same declaration; no re-scoring and no process-wide state are involved.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Declaration Boundaries
- **No token, route-gold scenario**: `routeDeclaration:{present:false, reason:'route-declaration-missing'}` + matching `raw.routeTelemetry`; `observedIntents:[]`.
- **No token, non-route scenario**: byte-identical to today — no `routeDeclaration`, no `routeTelemetry`, `observedIntents:[]`.
- **Malformed ROUTED line**: caught and treated as absent → `{present:false}`.
- **Restated ROUTED lines**: last valid declaration wins (mirrors `extractRoutingJson`).

### Normalization Boundaries
- **Scalar `workflowMode`**: normalized to `[workflowMode]` for the telemetry record.
- **`intents` omitted**: defaults to `[workflowMode]`.
- **Neither field present**: declaration skipped (`{present:false}`).

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One additive prompt instruction (route-gold-gated) plus one additive parser threaded into the existing observed-result assembly, all in `live-executor.cjs`; no new file, no scorer edit.
- **Risk concentration**: The load-bearing constraint is that fail-closed stays conditional on `requireRouteDeclaration` so tokenless non-design runs remain byte-identical; correctness is proven by the populated `observedIntents:["motion"]`, the conditional `route-declaration-missing`, and the byte-identical tokenless control.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the fail-closed `route-declaration-missing` apply to every tokenless live run? **RESOLVED: No — it is route-gold-only. Applying it to tokenless non-design runs would change their observed shape and regress the no-regression guarantee. It fires only when `requireRouteDeclaration = hasRouteGold(scenario.expected)` is true.**
- Does the verification exercise the live `opencode run` dispatch? **RESOLVED: No — this is a live-only mechanism verified deterministically through `parseLiveResult` over synthetic NDJSON via the `--parse-file` (and `--require-route`) CLI entry; the real dispatch is exercised by the benchmark, not this phase.**
- Should the scorer be edited to consume the new fields? **RESOLVED: No — the scorer already reads `observedIntents` (`:131`) and `raw.routeTelemetry` (`:134`) and drives `intentRecall` (`:631`); the only gap was the live executor never populating them. `git status` confirms the scorer is untouched.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: route-gold-only ROUTED instruction (live-executor.cjs:60-91, gate :75-83) + parseRoutedDeclaration parser (:218-252) + parseLiveResult wiring (:279-343, observedIntents :314, fail-closed :337-340); retires the observedIntents:[] hard-return so intentRecall is measurable; scorer untouched (reads observedIntents :131 + raw.routeTelemetry :134); fail-closed route-gold-only; tokenless non-design runs byte-identical
-->
