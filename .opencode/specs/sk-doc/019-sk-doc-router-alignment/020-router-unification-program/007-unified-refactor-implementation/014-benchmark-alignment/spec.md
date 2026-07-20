---
title: "Feature Specification: Lane C Compiled-Routing Benchmark Alignment"
description: "Plan the Lane C harness changes that exercise the compiled router with SPECKIT_COMPILED_ROUTING=1, compare its normalized routing decisions with legacy router replay and the same authored route gold, and classify manifest drift separately from compiled-path breakage without editing the three frozen scorer files."
trigger_phrases:
  - "skill benchmark compiled routing alignment"
  - "Lane C compiled legacy parity"
  - "compiled routing drift benchmark"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Lane C Compiled-Routing Benchmark Alignment

## EXECUTIVE SUMMARY

Lane C currently benchmarks deterministic routing through `router-replay.cjs`, joins the observed result to authored route gold, and scores it through `score-skill-benchmark.cjs`. The orchestrator never turns on `SPECKIT_COMPILED_ROUTING`, never invokes the compiled front door, and never compares the compiled decision with the legacy replay. A hub can therefore pass the benchmark while the path intended to serve under the compiled flag is stale, falling back, or broken.

This phase plans a harness around the frozen scorer. For each eligible hub and authored route-gold scenario, Lane C will preserve the existing legacy observation, invoke the public compiled front door in a child process with the flag set to `1`, normalize both outputs to the same routing projection, assert each against the same route gold, and require compiled-versus-legacy routing equality. Drift and no-manifest states use the classifications owned by `../012-default-on-decision/`; this packet references those contracts and does not restate them.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Lane** | Lane C (`skill-benchmark`) |
| **Blast radius** | Deterministic benchmark harness, reporting, fixtures, and tests; no routing policy or scorer semantics change |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Confirmed Current State

`run-skill-benchmark.cjs` resolves a skill root, runs structural gates, loads scenarios, dispatches router-mode cases, calls `scoreScenario()`/`evaluateRouteGold()`, aggregates, and writes the JSON/Markdown reports. In deterministic Mode A, `executor-dispatch.cjs` selects `router-replay.cjs`. Hub route-gold is enforced by default, but the observed route is still the legacy replay only.

The existing seam is suitable for an additive parity lane: `router-replay.cjs` returns legacy intents/resources and hub telemetry; `.opencode/bin/compiled-route.cjs` returns the flag-gated compiled decision or a legacy sentinel; `score-skill-benchmark.cjs` already exports the route-gold evaluator. The missing piece is normalization and comparison around those unchanged modules.

### Problem Statement

Lane C validates authored routing but not the path that will serve when compiled routing is enabled. It cannot prove that the flag-on front door actually returns a compiled decision, that the decision matches the legacy route, or that stale-manifest fallback is distinguishable from a broken compiled path. Adding compiled logic inside the scorer would corrupt the pinned baseline and mix routing observation with scoring policy.

### Purpose

Add a deterministic compiled-routing parity harness, integrate its structured result into Lane C reporting and process gates, and cover fresh, drifted, missing, and broken fixture states. The three frozen scorer files remain byte-identical and are consumed read-only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new harness module beside the Lane C orchestrator that owns compiled invocation, result normalization, parity comparison, status classification, and scorer-digest pinning.
- Child-process invocation of `.opencode/bin/compiled-route.cjs` with `SPECKIT_COMPILED_ROUTING=1` for eligible hubs so the real public flag-gated path is exercised.
- Legacy observation through the existing frozen `router-replay.cjs`.
- Route-gold checks for both normalized observations through the existing frozen `evaluateRouteGold()` export.
- A routing-only equality projection: action, selection kind, ordered workflow/surface targets, and defer/reject outcome. Policy hashes, generations, timing, and additive metadata do not participate in routing equality.
- A default-on parity gate for hubs whose shared eligibility predicate reports a valid fresh manifest; no-manifest hubs are recorded as legacy by construction rather than treated as a compiled failure.
- Drift classification, re-mint-required reporting, and hard-failure classification through the status contract owned by the decision packet.
- JSON and Markdown report additions, deterministic fixtures, Vitest coverage, and README/CLI documentation.

### Out of Scope

- Editing the frozen files `router-replay.cjs`, `score-skill-benchmark.cjs`, or `load-playbook-scenarios.cjs`.
- Changing D1-D5 weights, route-gold semantics, scenario loading, authored gold, routing decisions, or manifest contents.
- Using real models or network calls; this alignment is deterministic Mode A coverage.
- Defining fallback, eligibility, or observability semantics; those remain authoritative in the decision packet.
- Generating or re-minting production manifests during a benchmark run. Drift is reported, never repaired automatically.

### Frozen Scorer Pin

The implementation may import these files and hash them, but must never write them:

1. `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
2. `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
3. `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`

### Planned Harness Contract

For each route-gold scenario on a valid fresh eligible hub:

1. Obtain the legacy observation from `routeSkillResources()`.
2. Spawn the public compiled front door with a process-local environment containing `SPECKIT_COMPILED_ROUTING=1`.
3. Reject a legacy sentinel as either `drifted` or `broken` using the shared status probe; do not guess from the sentinel alone.
4. Normalize legacy intents and compiled targets through the target hub's registry into one ordered routing projection.
5. Call the frozen route-gold evaluator for both projected observations.
6. Require both route-gold results to pass and require the two routing projections to be equal.
7. Record the result under a new `compiledRouting` report block without altering D1-D5 scoring.

### Files to Change During Implementation

| File Path | Change Type | Planned Change |
|-----------|-------------|----------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs` | Create | Own compiled invocation, normalization, status classification, parity, and frozen-file hashes |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | Run the parity lane for eligible hub scenarios, gate the verdict, and preserve current scoring |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | Modify | Render the `compiledRouting` block from report JSON |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md` | Modify | Document the parity gate, status meanings by reference, and CLI behavior |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts` | Create | Cover fresh parity, divergence, drift, no-manifest, breakage, and env isolation |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/fixtures/compiled-routing/` | Create | Deterministic copied/minimal fixture states around the harness |

> The three frozen files are deliberately absent from the change table.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the three frozen files byte-for-byte. | The harness records their pre/post SHA-256 values; tests fail on any mismatch; the implementation diff contains no edit to those files. |
| REQ-002 | Exercise the real compiled-serving path with the flag on. | Eligible hub scenarios invoke `.opencode/bin/compiled-route.cjs` in a child process with `SPECKIT_COMPILED_ROUTING=1`; the report records `flagForcedOn: true` and the front-door outcome. |
| REQ-003 | Require route-gold success and routing equality for compiled and legacy observations. | Both projected observations pass the same authored route gold and their normalized routing projections compare equal; a mismatch names scenario, legacy projection, compiled projection, and first differing field. |
| REQ-004 | Distinguish manifest drift, legacy-by-construction, and compiled breakage. | Status comes from the shared decision-contract probe: no manifest records legacy-only; stale manifest records drift and re-mint-required; fresh manifest plus resolver/front-door failure records breakage. |
| REQ-005 | Integrate parity as a Lane C gate without changing D1-D5. | `report.compiledRouting` contains mode, eligible rows, parity counts, drift rows, breakages, and frozen hashes; routing divergence or breakage produces a distinct blocked verdict and non-zero exit, while drift remains visibly classified according to the authoritative contract. |
| REQ-006 | Prevent environment and filesystem mutation. | Each compiled call receives a child-only env; parent `process.env` is unchanged; benchmark runs never mint, modify, or delete a manifest or routing input. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Cover the full state matrix with deterministic fixtures. | Vitest covers fresh parity, forced divergence, stale manifest, missing manifest, malformed/fresh breakage, explicit flag isolation, and frozen-file hash drift detection. |
| REQ-008 | Keep JSON, Markdown, CLI, and README semantics synchronized. | Report JSON is authoritative; Markdown renders from it; CLI usage describes the new gate; documentation references rather than duplicates the decision contracts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every eligible route-gold row exercises the public flag-on compiled front door.
- **SC-002**: Compiled and legacy observations each satisfy the same authored route gold and compare equal on routing fields.
- **SC-003**: Hash/generation metadata differences cannot hide or create a routing mismatch.
- **SC-004**: Drift, missing-manifest legacy, and fresh-manifest breakage are reported as different states using the authoritative shared classifier.
- **SC-005**: D1-D5 scores for an unchanged legacy run remain identical before and after the alignment.
- **SC-006**: The three frozen file hashes are identical before and after implementation and every benchmark run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | P0 stable compiled front door and status probe | Current front door depends on a spec-tree resolver path and sentinel alone lacks cause | Consume the stable P0 interface; keep the CLI path public and cause classification shared |
| Dependency | P3 eligibility predicate and manifest discovery | Harness cannot know whether to expect compiled serving without it | Gate parity only through the shared predicate; no local hub list |
| Risk | Legacy intents and compiled targets use different identifiers | Raw array comparison creates false divergence | Normalize through `mode-registry.json` and preserve ordered bundle semantics |
| Risk | Harness accidentally changes scorer meaning | Existing aggregate scores drift | Add before/after legacy report fixture; keep new verdict logic in the orchestrator |
| Risk | Test mutates production manifest to simulate drift | Benchmark fixture leaks into live state | Copy inputs into temp fixtures or inject path adapters; never edit live manifests |
| Risk | Child env leaks into the parent test process | Later tests observe flag-on behavior | Pass a cloned env to spawn and assert parent env before/after |
| Risk | Drift is mislabeled as breakage | Routine re-mint state appears as runtime failure | Use the shared status probe, not sentinel inference |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism

- **NFR-D01**: Router-mode parity runs offline and returns identical results for identical skill, manifest, and scenario bytes.
- **NFR-D02**: Normalization is order-stable and registry-driven; it does not sort away ordered-bundle semantics.

### Isolation

- **NFR-I01**: The flag is scoped to the compiled child process only.
- **NFR-I02**: All drift/breakage fixtures use temp or injected paths and leave production artifacts unchanged.

### Compatibility

- **NFR-C01**: Non-hub and no-manifest runs keep their existing D1-D5 results and gain only an explicit legacy/not-applicable parity status.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Routing Shapes

- `defer`, `clarify`, or `reject` with no targets: normalize action explicitly; never coerce to an empty successful route.
- Ordered workflow bundle: preserve order in both projections.
- Surface bundle: map qualified compiled targets to the same registry modes used by legacy telemetry.
- Legacy router unparseable: retain the current structural failure; do not run parity against an undefined baseline.

### Eligibility and Serving

- No manifest: record legacy-by-construction and skip the compiled parity expectation.
- Stale manifest: record drift/re-mint-required; do not report generic compiled breakage.
- Valid fresh manifest but front door returns sentinel or invalid JSON: report broken compiled path.
- Flag already set in parent process: child still receives an explicit `1`, and the parent value is unchanged after the call.

### Gold and Reporting

- Scenario without route gold: omit from the hard parity denominator or record diagnostic-only status; never fabricate gold.
- Compiled and legacy both wrong in the same way: both route-gold checks fail even if mutual equality passes.
- Compiled differs only in hash or generation: routing parity passes because metadata is outside the projection.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One new harness, orchestrator/report integration, fixtures, tests, and docs |
| Risk | 14/25 | CI gate around a live front door, bounded by deterministic child processes and frozen scorer |
| Research | 7/20 | Normalization must cover current hub archetypes and ordered bundles |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a drifted live hub make Lane C exit non-zero directly, or should Lane C report the degraded state while the separate P1 drift-CI job owns the failing process signal? The report must distinguish drift from breakage either way.
- What stable machine-readable P0 status-probe interface will return the cause behind a legacy sentinel?
- Should the parity gate default to `auto` for valid-fresh hubs and `off/not-applicable` elsewhere, or use an explicit `--compiled-routing-parity on|off|auto` flag mirroring route-gold? The recommendation is `auto` with a recorded resolved mode.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Fallback, eligibility, drift, and observability authority**: `../012-default-on-decision/decision-record.md`
- **Default-on program**: `../012-default-on-decision/spec.md`
- **Build approach**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Current Lane C architecture**: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md`

