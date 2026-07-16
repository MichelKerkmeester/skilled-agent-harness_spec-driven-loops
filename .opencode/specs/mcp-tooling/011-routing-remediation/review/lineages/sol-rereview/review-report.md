# Terminal Re-Review Report — mcp-tooling Routing Remediation

## 1. Executive Summary

**Verdict: PASS**  
**hasAdvisories: true**  
**Active findings: P0=0, P1=0, P2=1**

The remediation closes all 15 findings from the prior FAIL review. Deterministic replay passes all 13 hub scenarios and all 49 packet scenarios for both intent and exact resource assembly. Two independent benchmark runs return PASS 98 with the route-gold hard lane auto-enabled at 13/13 matches, zero violations, and zero parse failures; an injected mismatch is blocked. Fallback-only semantics, genuine defer, provider separation, Figma transport trust metadata, `sk-design` ownership, phase amendments, graph projection, and operator index coverage all hold.

One new P2 documentation advisory remains: the registry's primary discriminator help text names only the original Figma transport/backend even though its executable rows and transport-axis extension correctly cover Refero, Mobbin, and `code-mode-remote-mcp`. This does not affect routing or release readiness.

The loop stopped because `maxIterations=4` was reached as required. All four review dimensions are covered, convergence is 1.0 after the final iteration, and there is no search debt.

## 2. Planning Trigger

`/speckit:plan` is **not required** for this PASS verdict. The advisory can be handled as a bounded documentation follow-up; the normal next workflow is `/create:changelog` after the operator accepts the result.

Planning Packet

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "SRR-P2-001",
      "severity": "P2",
      "title": "Registry discriminator descriptions omit two transports and the Code Mode backend",
      "file": ".opencode/skills/mcp-tooling/mode-registry.json",
      "line": 7,
      "disposition": "active"
    }
  ],
  "remediationWorkstreams": [
    {
      "order": 1,
      "priority": "advisory",
      "findingIds": ["SRR-P2-001"],
      "summary": "Refresh the registry discriminator help to match the six-mode transport/backend inventory."
    }
  ],
  "specSeed": [
    "Clarify that packetKind=transport covers mcp-figma, mcp-refero, and mcp-mobbin.",
    "Document cli-plus-mcp, figma-desktop-transport, and code-mode-remote-mcp as the backendKind values."
  ],
  "planSeed": [
    "Edit the two discriminator description strings in mode-registry.json.",
    "Re-run JSON validation and the parent hub registry alignment check."
  ],
  "findingClasses": ["matrix/evidence"],
  "affectedSurfacesSeed": ["registry help consumers", "six-mode documentation projection"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

<!-- MACHINE-OWNED: START -->
### SRR-P2-001 — Registry discriminator descriptions omit two transports and the Code Mode backend

- Severity: P2
- Dimension: correctness (reducer-owned fallback; discovered in the traceability rotation)
- Location: `.opencode/skills/mcp-tooling/mode-registry.json:7`
- First/last seen: iteration 3 / iteration 3
- Status/disposition: active / advisory
- Evidence: `discriminator.packetKind` describes transport only as Figma, and `discriminator.backendKind` omits `code-mode-remote-mcp`; concrete Refero/Mobbin rows and the transport-axis extension contradict that abbreviated help.
- Impact: help consumers can present an incomplete transport/backend model; executable routing is unaffected.
- Recommendation: enumerate all three transports and all three backend kinds, or explicitly delegate these descriptions to the transport-axis extension.
- findingClass: `matrix/evidence`
- scopeProof: the mismatch is local to `mode-registry.json`, an explicitly bound review surface.
- affectedSurfaceHints: registry help consumers; six-mode documentation projection.
<!-- MACHINE-OWNED: END -->

## 4. Remediation Workstreams

There are no P0 or P1 workstreams.

1. **Advisory registry-help cleanup** (`SRR-P2-001`): align the primary discriminator descriptions with the already-correct six-row inventory and transport-axis extension, then run the existing JSON/package alignment checks.

## 5. Spec Seed

- Preserve the current behavioral acceptance criteria; F001-F015 are closed.
- Add a documentation invariant that discriminator descriptions enumerate every value present in `modes[]` or reference the authoritative extension.
- Treat this as an advisory documentation delta, not a routing-policy change.

## 6. Plan Seed

1. Update `discriminator.packetKind` to name all three transport packets.
2. Update `discriminator.backendKind` to include `code-mode-remote-mcp` and its Refero/Mobbin consumers.
3. Validate JSON and re-run hub registry alignment; no replay corpus change should be needed.
4. Close `SRR-P2-001` when the help text and concrete mode values agree.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass | REQ-001..REQ-004 and CHK-210..CHK-242; current router/harness/transport/metadata evidence | None; all F001-F015 classes close. |
| `checklist_evidence` | pass | Checked WS1-WS4 claims sampled against source, replays, benchmark, amendments, and links | None; terminal/final-gate items remain honestly unchecked in the source packet. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `playbook_capability` | pass | 13/13 hub plus 49/49 packet intent/resource replay; 13 index links resolve | None. |
| `feature_catalog_code` | partial | Registry rows, description, and graph contain all six modes | SRR-P2-001 help-text advisory. |

- `AC_COVERAGE`: disabled — no dedicated AC-coverage telemetry was bound for this detached lineage; the explicit 15-finding closure matrix was reviewed instead.
- Resource Map Coverage Gate: omitted because `resource_map_present=false` at initialization. The emitted synthesis `resource-map.md` is informational output, not the input gate.

## 8. Deferred Items

- `SRR-P2-001` is deferred as a non-blocking P2 documentation cleanup.
- The source remediation checklist's final whole-gate/advisor-probe items remain outside this detached review's write scope. They are not needed to establish the bounded routing verdict, but should retain their honest unchecked state until the owning workflow executes them.
- Full Vitest execution was not repeated because its temporary-file writes fall outside the user-bound lineage root. The committed adversarial suite was inspected, current positive paths were executed twice, and the hard-gate negative control was executed in memory.

## Dimension Expansion Map

- Saturated directions: none recorded.
- Completed pivots: none; each iteration used the planned correctness, security, traceability, and maintainability rotation.
- Failed pivots: none.
- Audited overrides: none.
- Council artifacts: none; sub-agents were prohibited by the review skill.
- Selected review directions: deterministic routing/gate enforcement; trust boundaries; fifteen-finding traceability; shared-harness durability.
- Remaining frontier: none required for the bounded terminal verdict.

## 9. Search Ledger

- `hasSearchDebt: false`
- Search coverage mode: `graphless_fallback` because graph-producing commands would write outside the lineage root; existing graph metadata was directly reviewed.
- Candidate coverage: 1 confirmed advisory class, 23 ruled-out classes, 0 deferred, 0 blocked.
- Confirmed: registry-help drift (`SRR-P2-001`).
- Ruled out with executable or source evidence: positive-route failure, cross-mode resource contamination, defer bypass, holdout gaps, provider collision, benchmark gate blindness, six fallback loads, runtime/replay drift, parser execution/silent skip, transport-write misrepresentation, missing design pairing, graph/phase/index drift, report-only gate behavior, hardcoded consumer semantics, legacy regression, repeat-run nondeterminism, silent parse failure, and topology-drift exposure.
- Clean-search proof: hub 13/13, packets 49/49, two PASS 98 reports with 13/13 route gold, injected violation blocked, 13/13 playbook links, all six metadata entities, four script syntax checks, and generic compatibility controls.

## 10. Audit Appendix

### Iteration and Convergence Replay

| Iteration | Dimension | New P0/P1/P2 | Key evidence | Verdict |
|-----------|-----------|---------------|--------------|---------|
| 1 | Correctness | 0/0/0 | Hub 13/13; packets 49/49; PASS 98; injected mismatch blocked | PASS |
| 2 | Security | 0/0/0 | Six fallback branches; inert/loud parser; Figma trust and pairing | PASS |
| 3 | Traceability | 0/0/1 | F001-F015 closure; six-mode projections; 13 links; phase amendments | PASS |
| 4 | Maintainability | 0/0/0 | Four syntax checks; generic consumer/gate; repeat PASS 98 | PASS |

- Stop policy/reason: `max-iterations` / `maxIterationsReached`.
- Iterations: 4 of 4.
- Convergence threshold: 0.1; final convergence score: 1.0. Pre-ceiling convergence was telemetry only.
- Dimension coverage: 4/4 (1.0).
- Active findings: P0=0, P1=0, P2=1; resolved=0.
- Search debt: 0; corruption warnings: 0.
- Release readiness: converged, PASS with advisories.

### Scope and Evidence Coverage

- Hub surfaces: registry, router, hub skill, description, graph metadata.
- Corpus: 13 hub scenarios including six bound holdouts; 49 packet scenarios across six mode packets.
- Harness: runner, loader, replay consumer, scorer, report gate, and route-gold regression suite.
- Remediation traceability: spec, plan, tasks, checklist, decisions, implementation summary, prior review, and phase-007 amendments.
- Runtime evidence lives under `logs/iteration-001-*` and `logs/iteration-004-benchmark/` in this lineage.

### Terminal Verdict

All prior P0/P1/P2 remediation classes are closed. The sole new item is P2 documentation drift. The bounded terminal verdict is **PASS** with `hasAdvisories=true`.
