# Deep Review Report — mcp-browser-use hub (lineage claude2)

## 1. Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: false (the verdict is CONDITIONAL; 10 P2 advisories are also active)
- Active counts the verdict used: P0 = 0, P1 = 1, P2 = 10 (`review-verdict.cjs` over this lineage's registry and state log)
- Self-check outcomes: the one P1 (C2-I1-P1-001) went through the compact skeptic/referee pass in iteration 1. It was re-verified in iteration 5 at the front door SKILL.md names, and it stays P1. No finding was downgraded or ruled a false positive.
- Review scope: 277 pre-bound files covering the hub scaffold, the Chrome DevTools and Aside move, the Bladebro mode, two-stage advisor routing, nested sub-tracks in system-spec-kit, and the end-to-end verification packet. Five iterations: correctness, security, traceability, maintainability, then a correctness cross-reference pass. Stop reason: maxIterationsReached.
- Operator review focus: The 8 commits main..HEAD on this branch that build the browser-use parent hub: the hub scaffold, the move of the Chrome DevTools and Aside modes into the hub, the Bladebro stealth-browser mode, advisor routing at both stages, nested sub-track support in system-spec-kit, and the end-to-end verification. Pure renames of moved spec packets are out of scope; review the edited and added files.

## 2. Planning Trigger

`/speckit:plan` is required: one active P1.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "C2-I1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107"},
    {"id": "C2-I1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/hub-router.json:117", "refinedBy": "C2-I3-P2-003"},
    {"id": "C2-I1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/hub-router.json:5"},
    {"id": "C2-I2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:79"},
    {"id": "C2-I2-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md:44"},
    {"id": "C2-I2-P2-003", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/references/browser-lanes.md:51"},
    {"id": "C2-I3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:51"},
    {"id": "C2-I3-P2-002", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md:14"},
    {"id": "C2-I4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1045"},
    {"id": "C2-I4-P2-002", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:131"},
    {"id": "C2-I5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md:47"}
  ],
  "remediationWorkstreams": ["WS1 compiled-router reject trigger", "WS2 hub vocabulary precision", "WS3 Bladebro supply chain and consent docs", "WS4 packet status and stale prose", "WS5 spec-kit sub-track invariant consolidation"],
  "specSeed": ["Compiled routers reject only on the constraints channel, never on prompt text", "Bladebro update path keeps the pin and digest gate"],
  "planSeed": ["Remove text.includes('forbidden') from the mcp-browser-use router and move the canary case to constraints", "Add a 403 Forbidden canary case that must route to mcp-chrome-devtools"],
  "findingClasses": ["correctness/routing-contract", "correctness/vocabulary-precision", "correctness/routing-design", "security/supply-chain", "security/consent-boundary", "traceability/status-reconciliation", "traceability/stale-prose", "traceability/catalog-to-playbook", "maintainability/duplicated-invariant", "maintainability/diagnostic-consistency"],
  "affectedSurfacesSeed": [".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs", ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json", ".skilled/skills/mcp-browser-use/hub-router.json", ".skilled/skills/mcp-browser-use/mcp-bladebro/references/", ".skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/preflight-and-install/native-binary-digest.md", "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md", ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh", ".skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs", ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Finding | Fix recommendation |
|---|---|---|---|---|---|
| C2-I1-P1-001 | P1 | correctness | `010-mcp-browser-use/lib/router.cjs:107` | `evaluateRoute` rejects any prompt whose text contains "forbidden". The hub is served compiled by default and SKILL.md:62 says `reject` refuses, so "debug the 403 Forbidden network requests in chrome devtools" is refused. Confirmed live through `resolve.cjs` and `compiled-route.cjs`. | Reject only on `constraints.has('forbidden')`. Add a 403 canary that must route to chrome-devtools. |
| C2-I1-P2-001 | P2 | correctness | `hub-router.json:117` | Bare "aside" is a substring match with no word boundary, so "Aside from that, run lighthouse" bundles the Aside mode. Refined by C2-I3-P2-003: the note's premise that prose never reaches stage two is contradicted by 005 Known Limitation 3. | Word-boundary matching for short tokens, as the mcp-tooling sibling does; or replace bare `aside` with verb phrases. |
| C2-I1-P2-002 | P2 | correctness | `hub-router.json:5` | Uniform weight 4 with `ambiguityDelta: 1` turns every one-hit cross-mode overlap into a bundle. Tie-break only orders the bundle. | Revisit weights or the delta; fix the bladebro-workflow note. |
| C2-I2-P2-001 | P2 | security | `mcp-bladebro/references/install-and-verify.md:79` | The update path (`npm update -g`, `bladebro -u`) has no re-pin or digest re-check, and 4.8.3 is already offered. | Require a re-pin plus a sidecar digest check after any update. |
| C2-I2-P2-002 | P2 | security | `native-binary-digest.md:44` | The digest gate covers the native binary, not the npm launcher that PATH and the Code Mode manual run. | Verify the package tarball integrity (`npm view bladebro@4.8.2 dist.integrity`) or prefer the standalone binary. |
| C2-I2-P2-003 | P2 | security | `mcp-bladebro/references/browser-lanes.md:51` | The default `auto` lane attaches to any reachable debug endpoint, bypassing the profile choice in consent item 2. | Make `clone` the documented default, or add an endpoint-identity check to the consent checklist. |
| C2-I3-P2-001 | P2 | traceability | `spec.md:51` | The parent says 005 has two unmet requirements; the 005 summary lists three (REQ-003/008/009) and the 005 spec a different two. | Reconcile the three status rows. |
| C2-I3-P2-002 | P2 | traceability | `install-and-verify.md:14`, `mcp-wiring.md:67` | Pre-run prose ("none of it has run", "no callable observed") survives the live macOS run. | Update both references from the macOS-live benchmark. |
| C2-I4-P2-001 | P2 | maintainability | `create.sh:1045` | The sub-track declaration rule and the 2-level limit are encoded in about 8 places; `create.sh` ignores the exported `MAX_SUB_TRACK_DEPTH`. | Share one predicate and constant (a node helper that `create.sh` calls). |
| C2-I4-P2-002 | P2 | maintainability | `track-roots.mjs:131` | A symlinked declared folder below level 1 is skipped silently while level 1 reports it. | Emit the same diagnostic at depth 2. |
| C2-I5-P2-001 | P2 | traceability (found in the correctness cross-pass) | `lighthouse-and-performance-trace.md:47` | The catalog validation row cites a playbook with no Lighthouse or trace scenario. | Add a capability scenario or correct the row. |

## 4. Remediation Workstreams

1. **WS1 (P1)**: compiled-router reject trigger. Change `router.cjs:107` and the canary fixture, then re-run admission for the hub. The sibling hubs that share the pattern (`003-mcp-tooling`, `001-sk-code`, `002-system-deep-loop`, `009-sk-design`) predate this branch and are a separate follow-up.
2. **Advisories (P2)**: WS2 vocabulary precision (C2-I1-P2-001/002), WS3 Bladebro supply chain and consent docs (C2-I2-*), WS4 packet status and stale prose (C2-I3-*, C2-I5-P2-001), WS5 spec-kit invariant consolidation (C2-I4-*).

## 5. Spec Seed

- REQ: a compiled hub router never rejects on free prompt text; a reject comes only from the constraints channel.
- REQ: every Bladebro version change re-runs the pin and digest gate before first use.
- REQ: the parent packet status and the child status rows name the same unmet requirements.

## 6. Plan Seed

- T1: edit `010-mcp-browser-use/lib/router.cjs` so it rejects on `constraints.has('forbidden')` only; change the fixture `forbidden-reject` case to pass the constraint.
- T2: add a canary "403 Forbidden ... chrome devtools" case that must route to `mcp-chrome-devtools`; rebuild the artifacts and re-run `compiled-route-admission.cjs --hub mcp-browser-use`.
- T3: fix the Bladebro references' run-state prose and the update path.
- T4: reconcile `spec.md:51` with the 005 status rows.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Routing matches SKILL.md except the forbidden reject (iter 1); R-SEC rules mirrored except the update path (iter 2); status and run-state drift (iter 3); the nesting limit is implemented as stated (iter 4); stage-one aliases moved (iter 5) |
| `checklist_evidence` | pass | `003-mode-relocation/acceptance-criteria.md:59-66`, every row Met with observed evidence; open tasks explained in place (iter 3) |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `playbook_capability` | pass | 7 hub-routing scenarios feed admission (`006-verification/implementation-summary.md:123`) |
| `feature_catalog_code` | partial | Lighthouse entry files exist; the validation row has no matching scenario (iter 5) |
| `skill_agent` | notApplicable | No agent references the hub in scope |
| `agent_cross_runtime` | notApplicable | No agent definitions in scope |

AC_COVERAGE: advisory only; 003 is the phase with an acceptance-criteria file, and all its rows are Met.

## 8. Deferred Items

- The same `text.includes('forbidden')` pattern in the sibling hub routers (pre-existing, out of scope).
- Stage-one `aside` aliases sourced from graph metadata were not opened (iteration 5 edge case).
- The advisor CLI and `nested-subtrack.vitest.ts` were not executed, because both would write outside the lineage directory.

## Dimension Expansion Map

- Swept: correctness (iter 1, 5), security (iter 2), traceability (iter 3), maintainability (iter 4). No pivots, overrides or Council artifacts.
- Remaining frontier: stage-one graph-metadata aliases; the `compiled-route-sync.cjs` one-line change.

## 9. Search Ledger

- Bug classes covered: routing_contract, input_matching, supply_chain, consent_boundary, status_drift, stale_prose, duplicated_invariant, diagnostic_consistency, catalog_reference.
- Ruled out: state_identity, guard_coverage, secret_exposure, metadata_drift, gold_tuning, view_parity, stranded_alias.
- Search debt: none (`search_debt: 0`).
- Ledger note: iteration 5 row SL-005-3 (the P1 re-verification) links to `C2-I5-P2-001` by mistake. It concerns C2-I1-P1-001. The ledger is append-only, so the slip is recorded here instead of being rewritten.

## 10. Audit Appendix

- Convergence: newFindingsRatio by iteration 1.0, 0.3, 0.208, 0.133, 0.062. stopPolicy max-iterations, so convergence was telemetry only. Stop reason: maxIterationsReached.
- Coverage: 4 of 4 dimensions.
- Ruled-out claims: manifest identity drift; missing-mode crash; pre-commit/guard pattern drift; benchmark secret leakage; MT-H04 gold tuning (operator-approved); hub metadata drift; reader view parity; stranded stage-one aliases; missing catalog files.
- Sources reviewed: see `filesReviewed` in each iteration record and the `iterations/iteration-00N.md` narratives.
- Method note: two-dot `main..HEAD` diffs on this branch include main's newer commits as reversions, so every scope diff after iteration 1 used the merge base (`main...HEAD`).
