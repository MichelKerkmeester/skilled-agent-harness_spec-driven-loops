---
title: "Feature Specification: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability"
description: "The phase-007 deep review returned FAIL (release-blocking) on the mcp-tooling six-mode routing surface: Chrome contaminates every non-Chrome route, the committed Figma positive scenario routes nowhere, and the baseline benchmark certifies broken routing because it scores zero route-gold rows. This packet plans the four-workstream remediation."
trigger_phrases:
  - "routing remediation"
  - "mcp-tooling routing fix"
  - "route-gold enforcement"
  - "defaultResource semantics"
  - "six-mode traceability"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/011-routing-remediation"
    last_updated_at: "2026-07-16T18:55:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 3 planning packet from the phase-007 review Planning Packet"
    next_safe_action: "Operator reviews ADR-001 defaultResource ruling, then /speckit:implement"
    blockers:
      - "ADR-001 (defaultResource semantics) requires operator confirmation before any hub-router.json data change"
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/review-report.md"
      - ".opencode/skills/mcp-tooling/hub-router.json"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-routing-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ADR-001: fallback-only vs remove vs universal-base semantics for routerPolicy.defaultResource (operator ruling gates WS1)"
      - "F012: is semantic holdout recall a requirement, or are non-recalling holdouts removed from gold?"
      - "F013: rejection vs packet-level fallback semantics for the six negative scenarios"
    answered_questions:
      - "Do the original hub ADRs define defaultResource semantics? No. 002-architecture-decision ADR-001/ADR-006 define defaultMode (weak default, defer on ambiguity) and never mention defaultResource; the field shipped without ADR coverage"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The independent deep review of the mcp-tooling six-mode hub (phase 007 of `007-mcp-tooling-parent`) returned **FAIL, release-blocking**: 3 P0, 10 P1, 2 P2 active findings across correctness, security, traceability, and maintainability. This packet plans the remediation as one coherent router/benchmark/metadata change set organized into the review's four workstreams (WS1 deterministic hub routing and packet isolation, WS2 benchmark route-gold enforcement and runtime parity, WS3 design-transport trust and sk-design ownership, WS4 six-mode metadata/phase/playbook traceability). Nothing is implemented in this packet; it is the planning artifact the review's Planning Packet demanded.

**Key Decisions**: ADR-001 `routerPolicy.defaultResource` semantics (fallback-only recommended, operator ruling required before WS1); ADR-002 route-gold hard-gate scope (harness-wide opt-in flag, default on for hub-type skills).

**Critical Dependencies**: The ADR-001 adjudication blocks all `hub-router.json` data changes (review planSeed: "Adjudicate fallback versus universal-default semantics before changing router data").

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The phase-007 deep review (`.opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/review-report.md`) issued a FAIL, release-blocking verdict on the mcp-tooling hub routing surface. Three P0 mechanisms were independently verified by the orchestrator against real files (CONFIRMED, not inferred):

1. **F002 (cross-mode-resource-contamination)** — `hub-router.json` declares `defaultResource: ["mcp-chrome-devtools/SKILL.md"]`, and the deterministic replay consumer unions the default into every selected route's resource set (`router-replay.cjs:514`), so every correct ClickUp, Aside, Figma, Refero, and Mobbin route also loads the Chrome packet and violates single-mode isolation.
2. **F001 (routing-positive-failure)** — the committed Figma positive hub-routing scenario prompt scores 0 contiguous hits against Figma's vocabulary classes; deterministic replay returns no mode and only the Chrome default resource. The hub's central Figma transport scenario does not route to Figma.
3. **F008 (benchmark-route-gate-blindness)** — `benchmark/baseline/skill-benchmark-report.json` reports verdict PASS with `routeGoldRows: 0`: the designated deterministic CI gate scored zero route-gold assertions while its own telemetry shows seven route-contract violations. The gate certifies broken routing.

Twelve further P1/P2 findings (F003-F007, F009-F015) cover defer-contract bypass, holdout recall gaps, provider vocabulary collisions, Figma mutation-metadata and sk-design pairing gaps, graph-projection and phase-acceptance drift, packet negative/fallback divergence, replay/runtime parity, playbook-index drift, and base-gold drift.

### Purpose

Plan a verifiable remediation such that a re-run of the same review scope reaches PASS and the benchmark, re-run under route-gold enforcement, can no longer certify route-contract violations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Planning (this packet): requirements, ADRs, phased plan, tasks, and verification checklist covering all 15 active findings (F001-F015) in the review's four workstreams.
- Implementation surfaces named for later execution: `mcp-tooling` hub router/registry/metadata/playbooks, the six packets' `intra_routing_recall` corpora, the shared skill-benchmark harness (route-gold gate and replay/runtime parity), phase-007 acceptance docs, and the hub playbook index.
- A terminal bounded re-review of the SAME review scope and dimensions, expected PASS.

### Out of Scope

- OAuth or live-call captures for any transport - the review lineage was deterministic and source-bound; live Mode B measurement follows, not replaces, the Mode A route corrections (review Deferred Items).
- New hub modes or new transports - remediation only; the six-mode inventory is fixed.
- Live advisor ranking / Mode B usefulness benchmarks - explicitly deferred by the review.
- Relocating or restructuring `mcp-code-mode` - excluded by hub ADR-005.

### Files to Change

Implementation-phase targets (no file below changes during planning):

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | WS1: defaultResource semantics per ADR-001 ruling, hub-identity/scoring separation, Figma vocabulary recall, Refero/Mobbin collision, holdout coverage |
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | WS3: Figma `toolSurface.mutatesWorkspace` mutation-class semantics (F006) |
| `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md` | Modify | WS3: mandatory sk-design pairing on every design-affecting authoring path (F007) |
| `.opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/*.md` | Modify | WS1: executable expected intent/defer/resources for all 13 scenarios (F001, F003, F004, F005) |
| `.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md` | Modify | WS4: regenerate six-mode/13-scenario index (F011) |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Modify | WS4: regenerate derived intent projection for six modes (F009) |
| Six packets' `intra_routing_recall` / `intra-routing-recall` corpora | Modify | WS2: holdout intents, negative semantics, base gold (F012, F013, F015) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | WS2: route-gold hard gate wiring per ADR-002 (F008) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | WS2: fallback-only resource assembly per ADR-001; runtime no-match parity (F002, F014) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | Modify | WS2: consume expected_intent/expected_resources as gold rows for hard gating (F008) |
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md`, `plan.md`, `tasks.md` | Modify | WS4: amend phase acceptance from three-mode to six-mode inventory (F010) |
| `.opencode/skills/mcp-tooling/benchmark/<new-run-label>/` | Create | WS2: re-run report under route-gold enforcement; `baseline/` stays frozen |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

One requirement per remediation workstream. Every acceptance criterion is per-finding; the finding-to-requirement mapping below is exhaustive (each of F001-F015 maps to exactly one REQ).

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **WS1 - Deterministic hub routing and packet isolation.** The hub router routes each of the 13 committed hub scenarios to its intended single mode, defers on genuine ambiguity, and loads only the selected mode's resources (defaultResource semantics per the ADR-001 ruling). | F001: Figma positive scenario replays to `mcp-figma` with Figma resources only. F002: no non-Chrome route's assembled resource set contains `mcp-chrome-devtools/SKILL.md`; zero-signal behavior matches the ADR-001 ruling. F003: hub-identity evidence is separated from per-mode scoring and MT-004 produces a real defer, not a six-mode bundle. F004: each retained blind holdout (MT-H02 to MT-H06) replays to its intended mode, or is re-adjudicated out of gold with rationale. F005: an unqualified screen-examples prompt no longer selects both Refero and Mobbin; provider-neutral vocabulary defers or routes to sk-design per the spec seed. |
| REQ-002 | **WS2 - Benchmark route-gold enforcement and runtime parity.** Every authored `expected_intent`/`expected_resources`/negative assertion is consumed by a hard benchmark gate, and deterministic replay is parity-tested against every documented runtime fallback branch, across all 13 hub and 49 packet scenarios. | F008: the re-run benchmark report shows route-gold rows greater than 0 and any route mismatch fails the run; a previously-passing route-violating scenario now FAILS. F012: CU-H01, CU-H02, MB-H01, MB-H02 either recall their declared intent or are removed from gold with a recorded adjudication. F013: one semantics (rejection vs packet-level fallback) is chosen and all six negative fixtures pass against runtime behavior. F014: parity assertions cover every documented zero-score fallback branch, including ClickUp's hardcoded fallback resource. F015: the 11 positive packet rows either declare their adjudicated universal base resources in `expected_resources` or the eager load is removed; exact-resource scoring passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | **WS3 - Design-transport trust and sk-design ownership.** Figma transport metadata tells the truth about mutation, and every design-affecting Figma authoring path requires a selected sk-design judgment mode first. | F006: `mode-registry.json` distinguishes external-document mutation, local export writes, and direct editing; `mutatesWorkspace` (or a successor field set) no longer contradicts allowed Bash local exports. F007: `mcp-figma/SKILL.md` states the mandatory sk-design pairing precondition on author/modify and token paths, consistent with hub ADR-002's cross-hub pairing license. |
| REQ-004 | **WS4 - Six-mode metadata, phase, and playbook traceability.** Registry, router, description, graph metadata, phase acceptance docs, and the operator playbook index expose one consistent six-mode inventory. | F009: `graph-metadata.json` derived intent signals and narrative edges are regenerated to cover Aside, Refero, and Mobbin; consumer parity verified. F010: phase-007 `spec.md`/`plan.md`/`tasks.md` are amended from the three-mode draft to the six-mode corpus and actual evidence paths (`benchmark/baseline/`, not `router-final/`). F011: the hub playbook index lists all six modes and all 13 scenario files, regenerated from the committed corpus. |

### Finding-to-requirement mapping (exhaustive)

| Finding | Severity | findingClass | REQ |
|---------|----------|--------------|-----|
| F001 | P0 | routing-positive-failure | REQ-001 |
| F002 | P0 | cross-mode-resource-contamination | REQ-001 |
| F003 | P1 | defer-contract-bypass | REQ-001 |
| F004 | P1 | blind-holdout-recall-gap | REQ-001 |
| F005 | P1 | cross-transport-vocabulary-collision | REQ-001 |
| F006 | P1 | workspace-mutation-metadata | REQ-003 |
| F007 | P1 | design-judgment-pairing-gap | REQ-003 |
| F008 | P0 | benchmark-route-gate-blindness | REQ-002 |
| F009 | P1 | graph-projection-drift | REQ-004 |
| F010 | P1 | phase-acceptance-drift | REQ-004 |
| F011 | P2 | playbook-index-drift | REQ-004 |
| F012 | P1 | packet-holdout-recall-gap | REQ-002 |
| F013 | P1 | packet-negative-suppression-bypass | REQ-002 |
| F014 | P1 | packet-replay-runtime-parity | REQ-002 |
| F015 | P2 | packet-base-gold-drift | REQ-002 |

Mapping note: the review's "advisory maintenance" bucket groups F011 with F015. This spec maps F015 to REQ-002 because base-gold correctness is a precondition of the WS2 hard gate (enforcement would misclassify the 11 rows), while F011 is pure operator-index traceability (REQ-004). Deviation recorded here per the brief's intent.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A bounded re-review of the SAME scope and dimensions (correctness, security, traceability, maintainability over the six-mode registry/router, hub docs and graph metadata, 13 hub scenarios, 49 packet scenarios) reaches verdict PASS with zero active P0/P1 findings.
- **SC-002**: The Lane-C benchmark, re-run under route-gold enforcement into a NEW run-label folder (frozen `baseline/` untouched), passes with route-gold rows greater than 0, and a deliberately route-violating control scenario demonstrably fails the gate.
- **SC-003**: All existing gates stay green after remediation: the six packet package checks and hub parent-skill checks, the advisor ratchet, and advisor routing probes show no regression against their pre-change baselines.
- **SC-004**: The two failed core traceability protocols from the review (`spec_code`, `checklist_evidence`) and the failed `playbook_capability` overlay re-run clean against the amended six-mode docs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ADR-001 adjudication (defaultResource semantics) | Blocks every `hub-router.json` data change; wrong semantics chosen unilaterally would re-litigate the review | Phase 0 hard gate: operator ruling (or documented acceptance of the recommended fallback-only option) before WS1 starts |
| Risk | Shared-harness blast radius: WS2 modifies `system-deep-loop/deep-improvement/scripts/skill-benchmark/` used by OTHER skills' benchmarks (sk-code, sk-design, sk-git, cli-external-orchestration, system-deep-loop itself all hold frozen baseline reports produced by this harness) | High | ADR-002: route-gold as an opt-in flag defaulting on for hub-type skills; run the harness vitest suite; spot re-run one non-mcp-tooling skill's Mode A benchmark and confirm its verdict is unchanged |
| Risk | Vocabulary edits regress the clean boundaries the review certified (MT-H01 Chrome-vs-Aside, registry alias alignment) | Medium | Freeze current replays as regression fixtures in Phase 0; assert ruled-out claims stay ruled out in the terminal re-review |
| Risk | Phase-007 acceptance amendment (F010) touches a completed phase's docs and could conflict with its completion claims | Medium | Amend as an explicit post-review reconciliation with validate.sh re-run on that phase folder; no evidence rewriting, only inventory/paths correction |
| Risk | Six-packet corpus edits (F012, F013, F015) span 49 scenarios in six trees with two naming dialects (`intra_routing_recall` and `intra-routing-recall`) | Medium | Loader-driven verification: enumerate scenarios via `load-playbook-scenarios.cjs` output, not by hand |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Deterministic replay and benchmark runtime stay in the same order of magnitude; the route-gold gate adds scoring, not new I/O passes (single loader pass over the existing corpus).

### Security

- **NFR-S01**: No OAuth tokens, live external calls, or captured credentials enter the corpus or reports (out-of-scope boundary); Figma mutation metadata must fail closed - when mutation class is ambiguous, classify as mutating.

### Reliability

- **NFR-R01**: The benchmark under route-gold enforcement is deterministic: two consecutive runs on the same tree produce identical verdicts and route-gold row counts.

---

## 8. EDGE CASES

### Data Boundaries

- Empty input: a zero-signal prompt must produce the ADR-001-ruled behavior (defer or fallback) identically in runtime and replay, and the benchmark must score it against negative gold.
- Maximum length: multi-tool prompts naming several modes explicitly must produce `orderedBundle` in tie-break order, never an implicit six-mode union via hub-identity ties.

### Error Scenarios

- External service failure: not applicable in Mode A (deterministic, source-bound); the plan must not introduce any network dependency into the gate.
- Scenario parse failure: a hub or packet scenario whose `expected_intent`/`expected_resources` block fails to parse must fail the benchmark loudly (a silently skipped gold row is exactly the F008 mechanism).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: ~25 named surfaces across hub, six packets, shared harness, phase docs |
| Risk | 14/25 | Shared harness consumed by other skills' baselines; routing policy semantics; no auth/data migration |
| Research | 8/20 | Discovery already done by the 4-iteration review; residual research is adjudication evidence only |
| Multi-Agent | 8/15 | Four workstreams, sequential P0-first with WS3/WS4 parallelizable |
| Coordination | 9/15 | ADR ruling gate, frozen-baseline discipline, cross-consumer parity checks |
| **Total** | **55/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Route-gold hard gate breaks other skills' benchmark baselines | H | M | ADR-002 opt-in flag scoping; harness vitest suite; one non-mcp-tooling control re-run |
| R-002 | defaultResource semantics decided wrongly or silently | H | L | ADR-001 Proposed with operator ruling gate before WS1; hub ADR-006 lineage cited |
| R-003 | Vocabulary fixes overfit the 13 committed scenarios and regress natural-language recall | M | M | Keep blind holdouts blind: adjudicate intent first (F004/F012), then bind gold; terminal re-review re-replays everything |
| R-004 | Certified-clean boundaries (MT-H01, registry aliases) regress during edits | M | L | Phase 0 regression fixtures; ruled-out claims re-asserted at re-review |
| R-005 | Phase-007 doc amendment misread as evidence tampering | L | L | Amendment commits labeled as F010 reconciliation; validate.sh re-run on the amended phase |

---

## 11. USER STORIES

### US-001: Deterministic single-mode routing (Priority: P0)

**As a** hub operator dispatching an MCP tooling request, **I want** each clear single-tool prompt to route to exactly one mode with only that mode's resources, **so that** unrelated packets never contaminate the loaded context.

**Acceptance Criteria**:
1. Given the committed Figma positive scenario prompt, When deterministic replay runs, Then the selected mode is `mcp-figma` and the resource set contains no Chrome packet entry.
2. Given a zero-signal prompt, When the router scores no mode, Then the outcome matches the ADR-001 ruling (defer or explicit fallback) in both runtime and replay.

---

### US-002: Trustworthy benchmark gate (Priority: P0)

**As a** release gatekeeper, **I want** the Lane-C benchmark to fail on any route-contract violation, **so that** a PASS verdict is a real release signal.

**Acceptance Criteria**:
1. Given the remediated corpus and harness, When the benchmark re-runs into a new run-label, Then route-gold rows are greater than 0 and the verdict reflects every intent/defer/resource assertion.
2. Given a control scenario that deliberately violates its route gold, When the benchmark runs, Then the run FAILS.

---

### US-003: Honest transport trust metadata (Priority: P1)

**As a** permission or audit consumer, **I want** the Figma transport's mutation metadata and pairing preconditions to match its real behavior, **so that** locally mutating paths are never treated as non-mutating and design authoring never bypasses sk-design.

**Acceptance Criteria**:
1. Given the amended `mode-registry.json`, When an audit consumer reads the Figma entry, Then local export writes are represented by an explicit mutation class rather than contradicted by `mutatesWorkspace:false`.
2. Given any design-affecting Figma authoring path in `mcp-figma/SKILL.md`, When its preconditions are read, Then a selected sk-design judgment mode is required first.

---

### US-004: One six-mode inventory everywhere (Priority: P1)

**As a** graph/docs consumer, **I want** registry, router, graph metadata, phase acceptance, and the playbook index to agree on six modes, **so that** discovery and operator testing cover the real hub.

**Acceptance Criteria**:
1. Given regenerated `graph-metadata.json`, When derived intent signals are compared to the registry mode set, Then all six modes are projected.
2. Given the regenerated playbook index, When compared to `hub_routing/`, Then all 13 scenario files and six modes are listed.

---

## 12. OPEN QUESTIONS

- ADR-001 final ruling: fallback-only vs remove vs universal-base semantics for `routerPolicy.defaultResource` (recommended: fallback-only; operator confirmation required at implementation start).
- F012: is semantic (non-lexical) holdout recall a requirement for packet routers, or are the four non-recalling holdouts re-adjudicated out of gold?
- F013: rejection vs packet-level fallback for negative prompts - one semantics for all six packets.
- F015: which base resources are legitimately universal per packet (adjudicate before blessing eager loads as gold)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Phase-0 Research Note**: See `research/research.md`
- **Source review**: `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/review-report.md`
