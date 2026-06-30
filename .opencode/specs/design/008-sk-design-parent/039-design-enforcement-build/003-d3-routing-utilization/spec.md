---
title: "D3 — Routing & Utilization Guarantee"
description: "Build the four-layer deterministic routing/utilization spine for sk-design as one phase per research recommendation, D3-R1..R12."
trigger_phrases:
  - "d3 routing utilization build"
  - "design routing guarantee phases"
  - "hub router utilization backlog"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented D3 routing utilization phase parent"
    next_safe_action: "Execute child phases under this parent"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-parent-154-039-d3-routing-utilization"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
# D3 — Routing & Utilization Guarantee

## 1. PURPOSE
Bolt a four-layer deterministic spine onto the existing Lane C skill-benchmark machinery so that sk-design's routing and utilization stop being self-attested and become gated. The four layers are: a parseable hub-router projection (a sibling `hub-router.json` carrying `routerPolicy` + `routerSignals` + typed vocabulary classes), a parent-hub `routeTelemetry` adapter extending `router-replay.cjs`, a standing private gold corpus scored by a hard `hubRoute` first-failing stage inserted before the advisory `routed-intra` stage, and content-bound utilization proof (SOURCE PROOF sha256/anchor + loaded-determinative witnesses) replacing checkbox self-attestation. Enforcement reuses the existing `d5-connectivity.cjs` P0 `router_unparseable` hard-gate pattern in CI. This is the highest-priority dimension: it is the load-bearing selection+loading spine that D2, D4, and D5 all depend on.

## 2. RECOMMENDATIONS (one phase each)

| Phase folder | ID | Title | Sev | Class |
|--------------|----|-------|-----|-------|
| `001-parseable-hub-router` | D3-R1 | Parseable hub-router projection | P0 | enforceable |
| `002-gated-hubroute-scorer` | D3-R2 | Gated `hubRoute` scorer lane | P0 | enforceable |
| `003-route-gold-corpus` | D3-R3 | Standing route-gold corpus + minimal pairs | P0 | hybrid |
| `004-route-telemetry-adapter` | D3-R4 | routeTelemetry adapter + miss-rate metrics | P1 | enforceable |
| `005-live-routed-declaration` | D3-R5 | Live `ROUTED:` declaration token + parser | P1 | enforceable |
| `006-content-bound-source-proof` | D3-R6 | Content-bound SOURCE PROOF | P1 | enforceable |
| `007-registry-static-audit` | D3-R7 | Registry static-audit gate | P1 | enforceable |
| `008-vocabulary-drift-gate` | D3-R8 | Four-copy vocabulary-drift gate | P1 | enforceable |
| `009-backendkind-toolsurface-lock` | D3-R9 | backendKind→toolSurface lock | P1 | enforceable |
| `010-application-witness` | D3-R10 | Application-witness (loaded-determinative) | P1 | hybrid |
| `011-relative-advisor-ranking` | D3-R11 | Relative advisor ranking (transport suppression) | P2 | enforceable |
| `012-dispatch-boundary-proof` | D3-R12 | Dispatch-boundary child proof | P2 | hybrid |

## 3. ENFORCEMENT CEILING — the honest "1000%"
Structural router parseability (`router-replay.cjs` `parseable:true` once `hub-router.json` exists), fixture routing correctness (`expected.workflowMode` + minimal-pair pass), registry/router/packet/vocabulary drift, content-bound proof presence (sha256 recompute / anchor echo), backend/tool-surface lock, and relative advisor ranking are all enforceable on the checkout + private gold. What stays advisory: open-ended live intent outside the fixture corpus (the false-default proxy swings 0.087→0.63 purely on prose interpretation), and whether the loaded judgment was applied *well* (the witness proves a cited rule had an observable effect, never that the design is tasteful). Measured facts driving the build: router-replay returns `parseable:false` on the parent hub today; `intentRecall=0`; `telemetryMissingRate=1.000` across 55 prompt scenarios; the registry is structurally clean (5 modes, 56 aliases, **0 alias collisions**, 5/5 packet+name parity) but **46.5% of raw hub keywords are uncovered/untyped**.

## 4. SEQUENCING
Build the P0 spine first — these are the load-bearing mechanism the rest hangs on:
1. **D3-R1** (`001-parseable-hub-router`) — make the hub router a parseable projection so replay can run at all.
2. **D3-R2** (`002-gated-hubroute-scorer`) — insert the hard `hubRoute` stage that turns routing into a blocking gate.
3. **D3-R3** (`003-route-gold-corpus`) — author the standing gold corpus the gate scores against.

P1 items (D3-R4..R10) layer telemetry, live declaration, content-bound proof, and drift/lock gates on top. P2 items (D3-R11, D3-R12) close advisor-ranking and dispatch-boundary edges last.

## 5. RELATED
- Source: [[044-design-routing-and-integration-research]] research.md §6
