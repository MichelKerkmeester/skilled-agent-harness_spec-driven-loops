---
title: "Deep Review Report: Compiled Coverage Buildout"
description: "Final conditional review for the detached sol-high lineage."
sessionId: "fanout-sol-high-1784691838667-iv78vk"
verdict: "CONDITIONAL"
releaseReadinessState: "release-blocking"
---

# Deep Review Report

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false (the flag applies only to PASS verdicts with active P2 findings)
- **Active findings:** 0 P0, 5 P1, 2 P2
- **Resolved findings:** 2 synthetic summary artifacts
- **Iterations:** 10/10
- **Stop reason:** `maxIterationsReached`
- **Dimension coverage:** 4/4
- **Convergence score:** 1.00
- **Graph decision:** `STOP_ALLOWED`
- **Search debt:** none
- **Corruption:** none
- **Release readiness:** release-blocking while active P1 findings remain
- **Scope:** manifest refresh, compiled decision semantics, per-hub router parity, authored/promoted closure, packet completion evidence, benchmark telemetry, and kill-switch controls

The promoted runtime is fresh and compiled-serving for all seven hubs, the fleet kill-switch works, the targeted parity suite passes 49/49, both resolver copies are byte-identical, and all frozen scorer hashes match their pins. PASS is not available because five source-backed P1 findings remain: an unguarded refresh publication race, a cutover-gate non-route false-pass, a direct `sk-doc` lexical parity divergence, a failing authored-closure manifest gate, and packet completion claims that violate the packet's own required-evidence protocol.

## 2. Planning Trigger

`/speckit:plan` is required before another release-complete claim. The P1 workstreams are ordered by runtime correctness, release-gate restoration, and packet-state reconciliation; P2 items remain advisory follow-ups.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"F001","severity":"P1","title":"Refresh can overwrite a concurrent serving-state update","file":".opencode/bin/lib/compiled-route-manifest.cjs","line":550},
    {"id":"F002","severity":"P1","title":"Cutover gate false-passes compiled clarify and reject decisions","file":".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs","line":207},
    {"id":"F003","severity":"P1","title":"Packet claims completion while required completion gates remain open","file":".opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/checklist.md","line":52},
    {"id":"F005","severity":"P1","title":"sk-doc compiled matcher over-routes preview as review","file":".opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs","line":23},
    {"id":"F007","severity":"P1","title":"Current manifest suite fails its authored-closure sync assertion","file":".opencode/bin/tests/compiled-route-manifest.test.cjs","line":378},
    {"id":"F004","severity":"P2","title":"SD-015 test limitation is stale","file":".opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/implementation-summary.md","line":204},
    {"id":"F006","severity":"P2","title":"Benchmark flag telemetry still encodes the pre-cutover cohort","file":".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs","line":783}
  ],
  "remediationWorkstreams": [
    "Correct compiled decision semantics and lexical matching, then add negative parity cases.",
    "Protect manifest refresh publication against concurrent serving-state updates.",
    "Restore a coherent authored-to-promoted closure and rerun the complete manifest gate.",
    "Reconcile packet lifecycle metadata, required P1 evidence, and operator sign-off.",
    "Correct stale SD-015 documentation and default-on flag telemetry."
  ],
  "specSeed": [
    "Require refresh publication to preserve serving fields under concurrent mutation.",
    "Define parity for route, defer, clarify, and reject actions plus boundary-sensitive keyword matching.",
    "Name the authoritative authored-to-promoted closure and require its sync gate to pass.",
    "Separate shipped implementation state from packet completion until required P1 evidence is complete or approved for deferral."
  ],
  "planSeed": [
    "Add focused regressions for concurrent refresh, clarify/reject cutover parity, and preview/review boundaries.",
    "Implement the smallest fixes that make those regressions pass.",
    "Repair authored closure resolution for sk-code, system-deep-loop, mcp-tooling, and sk-doc.",
    "Rerun manifest, parity, status, and kill-switch gates.",
    "Reconcile canonical packet documents and obtain or record operator disposition for open P1 items."
  ],
  "findingClasses": ["class-of-bug","matrix/evidence","cross-consumer","instance-only"],
  "affectedSurfacesSeed": ["manifest refresh CLI","activation manifest state","cutover playbook executor","sk-doc compiled router","authored/promoted sync closure","manifest test suite","packet completion metadata","benchmark reports"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### F001 - P1 - Correctness

- **Title:** Refresh can overwrite a concurrent serving-state update
- **Evidence:** `.opencode/bin/lib/compiled-route-manifest.cjs:550-590`; `.opencode/bin/tests/compiled-route-manifest.test.cjs:457-472`; `.opencode/bin/tests/compiled-route-manifest.test.cjs:501-605`
- **Impact:** A serving-authority or shadow-only update that lands while policy compilation is running can be silently reverted by stale values from the original read.
- **Recommendation:** Serialize refresh with serving-state writers or use an atomic compare-and-swap against the validated manifest fingerprint; add a concurrent mutation regression.
- **Disposition:** Active; first seen in iteration 1 and confirmed by the iteration-10 adversarial replay.
- **Finding class:** `class-of-bug`
- **Scope proof:** The only refresh implementation and every refresh-specific test were reviewed; no lock, fingerprint recheck, or compare-and-swap exists.
- **Affected surfaces:** manifest refresh CLI, activation manifest, serving-state controller, concurrent operator execution

### F002 - P1 - Correctness

- **Title:** Cutover gate false-passes compiled `clarify` and `reject` decisions
- **Evidence:** `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs:207-217`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-cutover-luna.test.cjs:62-70`; `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:40-66`; `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:140-153`
- **Impact:** A terminal compiled decision can disagree with legacy and still receive PASS because every non-route action is mislabeled as defer.
- **Recommendation:** Treat only `action === 'defer'` as fallback; normalize and compare `clarify` and `reject`, with focused tests for both.
- **Disposition:** Active; first seen in iteration 2 and confirmed in iteration 10.
- **Finding class:** `class-of-bug`
- **Scope proof:** Current routers produce clarify/reject, while the cutover test suite covers explicit defer only.
- **Affected surfaces:** cutover playbook executor, clarify/reject-capable hubs, cutover acceptance evidence

### F003 - P1 - Traceability

- **Title:** Packet claims completion while its own required completion gates remain open
- **Evidence:** `checklist.md:52-58,92,123-124,142-148,197-208`; `plan.md:11`; `tasks.md:10-19`; `decision-record.md:10-18`
- **Impact:** The packet's `COMPLETE` state is not supported by its own P1 completion protocol, synchronized planning metadata, or formal sign-off.
- **Recommendation:** Reconcile every canonical status/task/checklist surface and obtain explicit operator disposition for remaining P1 rows before claiming complete.
- **Disposition:** Active; first seen in iteration 4 and confirmed in iteration 10.
- **Finding class:** `matrix/evidence`
- **Scope proof:** All canonical Level-3 packet documents were compared; no explicit P1 deferral approval resolves the contradiction.
- **Affected surfaces:** spec status, checklist protocol, task ledger, decision metadata, implementation summary, operator sign-off

### F005 - P1 - Maintainability/Correctness

- **Title:** `sk-doc` compiled matcher over-routes `preview` as `review`
- **Evidence:** `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:23-29`; `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/007-sk-doc/lib/router.cjs:174-184`; `.opencode/skills/sk-doc/hub-router.json:37`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:440-453`
- **Impact:** The default-on compiled router routes a prompt that legacy defers, disproving universal byte-identical behavior outside the finite route-gold corpus.
- **Recommendation:** Reuse the legacy boundary-aware matcher or reproduce its complete rule, then add lexical-containment negatives such as `preview`.
- **Disposition:** Active; first seen in iteration 5, class-bounded in iteration 6, and confirmed in iteration 10.
- **Finding class:** `class-of-bug`
- **Scope proof:** Direct compiled and legacy executions diverged on the same prompt; a same-class hub sweep bounded the confirmed instance to `sk-doc`.
- **Affected surfaces:** sk-doc compiled router, shared keyword matching, negative parity corpus, per-hub router copies

### F007 - P1 - Traceability

- **Title:** Current manifest suite fails its authored-closure sync assertion
- **Evidence:** `.opencode/bin/tests/compiled-route-manifest.test.cjs:378-411`; `.opencode/bin/compiled-route-sync.cjs:276-296`; `.opencode/bin/compiled-route-sync.cjs:351-357`
- **Impact:** The committed manifest gate is 15/16 because authored closure cannot resolve `sk-code`, `system-deep-loop`, `mcp-tooling`, and `sk-doc`; the declared authored-to-promoted rebuild path cannot run successfully.
- **Recommendation:** Restore authored closure resolution or coherently amend the source-of-truth contract and all consumers, then rerun the complete manifest and foundation suites.
- **Disposition:** Active; first seen in iteration 7, root-caused in iteration 8, and confirmed in iteration 10.
- **Finding class:** `cross-consumer`
- **Scope proof:** The whole manifest suite, sync checker, promoted status, resolver identity, and targeted parity suite were independently checked.
- **Affected surfaces:** authored closure, promoted mirror generation, sync checker, manifest test suite, completion evidence

### F004 - P2 - Traceability

- **Title:** SD-015 test limitation is stale
- **Evidence:** `implementation-summary.md:204-220`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:468-534`
- **Impact:** The packet understates current regression coverage and leaves an already-satisfied follow-up open.
- **Recommendation:** Mark the limitation and follow-up resolved, citing the dedicated positive and negative tests.
- **Disposition:** Active advisory; first seen in iteration 4.
- **Finding class:** `instance-only`
- **Scope proof:** Exact SD-015 search found both dedicated cases in the cited suite.
- **Affected surfaces:** implementation summary, checklist evidence, follow-up ledger

### F006 - P2 - Maintainability

- **Title:** Benchmark flag telemetry still encodes the pre-cutover cohort
- **Evidence:** `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs:783-806`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:187-205`; `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:29-42`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:380-400`
- **Impact:** Reports say unset cannot permit compiled routing even though the runtime's seven-hub default cohort does; live routing remains correct.
- **Recommendation:** Derive the report field from hub-aware runtime permission or remove the hub-dependent boolean from the hub-agnostic classifier.
- **Disposition:** Active advisory; first seen in iteration 5 and confirmed telemetry-only in iteration 9.
- **Finding class:** `cross-consumer`
- **Scope proof:** Exact search found report/test consumers only; direct runtime flag matrices are correct.
- **Affected surfaces:** parity report, flag-state tests, benchmark consumers

## 4. Remediation Workstreams

### Workstream A - Routing Semantics

- Fix F002 so defer is the only non-route fallback action.
- Fix F005 with boundary-aware keyword matching.
- Add clarify, reject, `preview`, and related negative parity cases before changing runtime code.

### Workstream B - Manifest Publication

- Add a deterministic F001 concurrency reproduction.
- Implement serialized or compare-and-swap refresh publication.
- Preserve the current missing/invalid/symlink and compile-error fail-closed behavior.

### Workstream C - Authored Closure And Gates

- Repair F007 for the four unresolved authored hubs.
- Prove the authored sync build can regenerate the promoted mirror.
- Rerun the complete manifest suite, targeted parity suite, resolver identity check, status probe, and fleet kill-switch drill.

### Workstream D - Packet Evidence

- Reconcile all canonical packet lifecycle metadata and task/checklist states for F003.
- Record explicit disposition for remaining P1 acceptance work and operator sign-off.
- Correct the stale SD-015 limitation and follow-up in F004.

### Workstream E - Benchmark Telemetry

- Correct F006 without changing the already-correct runtime flag semantics.
- Update the stale telemetry assertion and rerun benchmark reporting tests.

## 5. Spec Seed

- Require refresh publication to preserve `servingAuthority` and `shadowOnly` under concurrent state mutation, with deterministic regression evidence.
- Require cutover parity to compare all terminal actions (`route`, `clarify`, `reject`) while treating only explicit `defer` as legacy fallback.
- Require boundary-sensitive keyword parity for prompts outside the positive route-gold corpus.
- Define one authoritative authored-to-promoted closure and a green regeneration gate.
- Separate implementation shipment from packet completion until required P1 evidence is complete or explicitly approved for deferral.

## 6. Plan Seed

- **T1:** Add failing focused tests for F001, F002, F005, and F007.
- **T2:** Implement minimal fixes in manifest publication, cutover action handling, lexical matching, and authored closure wiring.
- **T3:** Rerun the complete manifest suite and the 49-case targeted parity suite.
- **T4:** Reconfirm all seven hubs are fresh and compiled-serving, then drill the fleet kill-switch.
- **T5:** Correct F006 telemetry and its assertion without changing runtime behavior.
- **T6:** Correct F004 and reconcile F003 across canonical packet documents.
- **T7:** Obtain or record operator disposition for open required acceptance evidence and sign-off.

## 7. Traceability Status

| Protocol | Gate | Status | Evidence and unresolved drift |
|---|---|---|---|
| `spec_code` | hard | fail | F001, F002, F005, and F007 remain source-backed correctness or closure defects. |
| `checklist_evidence` | hard | fail | F003 conflicts with required completion protocol; F007 contradicts the packet's green-suite claim. |
| `feature_catalog_code` | advisory | pass | Default-on wording and seven-hub cohort naming were verified in iteration 5. |
| `playbook_capability` | advisory | partial | Targeted parity passes 49/49, but the cutover action false-pass and manifest gate remain. |
| `AC_COVERAGE` | advisory | advisory-shortfall | The Level-3 packet has open required evidence and blank sign-off; exact covered/total acceptance counts are UNKNOWN. |

The source resource map was absent when the lineage initialized, so the conditional Resource Map Coverage Gate does not apply. Synthesis emitted `resource-map.md` as required; it contains zero extracted references because these legacy-v1 delta records do not carry resource-map entry evidence.

## 8. Deferred Items

- F004 and F006 are non-blocking P2 advisories after the P1 workstreams are resolved.
- The full seven-hub LUNA-HIGH acceptance sweep remains a separately tracked packet follow-up.
- The operator-gated merge to v4 remains out of scope.
- No graph/database or canonical packet continuity write was attempted because this detached lineage is restricted to lineage-local artifacts.

## Dimension Expansion Map

- Correctness: iterations 1, 2, 6, 8, and 10 covered publication, action semantics, lexical parity, closure root cause, and final replay.
- Security: iterations 3 and 9 covered path containment, trust boundaries, invalid flags, freshness gating, and fleet kill-switch behavior.
- Traceability: iterations 4, 7, 8, and 10 covered packet completion, live gate replay, source/promoted closure, and synthesis readiness.
- Maintainability: iterations 5 and 10 covered matcher duplication, telemetry drift, severity stability, and remediation grouping.
- Pivots: none; `max-iterations` policy broadened review through the hard ceiling.
- Remaining frontier: implementation and packet remediation for F001, F002, F003, F005, and F007.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

- `hasSearchDebt`: false
- Candidate coverage: no reducer-owned obligations remain.
- Ruled-out directions include global manifest corruption, frozen-scorer drift, resolver-copy drift, partial-cohort kill-switch coverage, invalid-flag enablement, missing SD-015 tests, and fleet-wide expansion of F005.
- Clean-search proof: all four dimensions covered, four stabilization passes after initial coverage, no new finding after iteration 7, and no severity transition after adversarial replay.

## 10. Audit Appendix

### Run Summary

- **Lineage:** `fanout-sol-high-1784691838667-iv78vk`
- **Executor:** `cli-opencode`, `openai/gpt-5.6-sol-fast`
- **Stop policy:** `max-iterations`
- **Stop reason:** `maxIterationsReached`
- **Iterations:** 10 mechanically complete
- **Registry:** 7 active, 2 resolved, 0 corruption warnings
- **Verdict replay:** 0 P0 + 5 P1 + 2 P2 = `CONDITIONAL`
- **Release readiness:** `release-blocking`

### Verification Evidence

- Iteration 10 passed `verify-iteration.cjs`: narrative, route proof, state record, and delta all present.
- Reducer replay after iteration 10 reported `openFindingsCount=7`, `resolvedFindingsCount=2`, `convergenceScore=1`, `graphConvergenceScore=2.5`, and `corruptionCount=0`.
- Targeted compiled-routing parity suite: 49/49 pass.
- Manifest suite: 15/16 pass; authored closure assertion fails for four hubs (F007).
- Promoted status: all seven hubs compiled-serving and fresh.
- Fleet kill-switch: all seven hubs return legacy authority with `causeCode: flag-off` under `SPECKIT_COMPILED_ROUTING=0`.
- Resolver copies: byte-identical.
- Frozen scorer files: all three hashes match their pins.
- Strict packet validation: zero errors and one warning, but `--strict` exited nonzero because `CONTINUITY_FRESHNESS` reports that continuity lags `graph-metadata.derived.last_save_at` by more than the 10-minute policy budget. Resolving it requires a canonical packet write outside this lineage's authority.

### Convergence Replay

- Last three new-finding ratios: 0.50, 0.00, 0.00.
- All configured dimensions and both required core protocols executed.
- Graph convergence: `STOP_ALLOWED`, no graph blockers.
- Claim adjudication: passed, five active P0/P1 findings evaluated.
- Hard ceiling overrides continued dispatch while preserving failed `spec_code` and `checklist_evidence` gates as terminal evidence.

### Resolved Artifacts

- `SUMMARY-P1-001` and `SUMMARY-P1-002` were synthetic reducer artifacts caused by cumulative iteration-3 summary counts; iteration 4 explicitly resolved both while retaining all evidence-backed findings.

### Cross-Reference Appendix

#### Core Protocols

- `spec_code`: failed at synthesis because four implementation/closure defects remain.
- `checklist_evidence`: failed at synthesis because packet completion evidence is contradictory and the manifest gate is red.

#### Overlay Protocols

- `feature_catalog_code`: passed for reviewed default-on wording.
- `playbook_capability`: partial; targeted parity is green, but cutover and manifest validation are incomplete.

### Boundary Evidence

- Every write made by this detached review remained inside `review/lineages/sol-high`.
- Target implementation and canonical packet files were read-only.
- Graph upsert and continuity save were intentionally skipped because they would write outside the lineage boundary.
