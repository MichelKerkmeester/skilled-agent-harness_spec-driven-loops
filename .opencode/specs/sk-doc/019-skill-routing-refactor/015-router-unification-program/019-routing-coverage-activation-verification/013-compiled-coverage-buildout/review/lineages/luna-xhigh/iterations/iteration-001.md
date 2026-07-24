# Iteration 1: Correctness - Manifest Refresh and Resolver Gates

## Dispatcher
- Target: compiled coverage buildout spec folder
- Session: `fanout-luna-xhigh-1784691838667-iv78vk`
- Route proof: `target_agent=deep-review`, `resolved_route=Resolved route: mode=review target_agent=deep-review`
- Budget profile: verify

## Files Reviewed
- `.opencode/bin/lib/compiled-route-manifest.cjs:543-595`
- `.opencode/bin/compiled-route-manifest.cjs:21-77`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:24-123`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs:457-605`

## Findings - New
### P0 Findings
None.

### P1 Findings
1. **Concurrent refreshes can lose a generation/policy update** -- `.opencode/bin/lib/compiled-route-manifest.cjs:564-588` -- `refreshCanonicalManifest` reads the existing generation, compiles, and then overwrites the manifest with a plain `fs.writeFileSync` without a lock, compare-and-swap, or post-write generation check. Two refresh callers can both derive the same next generation and one can overwrite the other, leaving the manifest hash/generation inconsistent with one caller's observed source state. The existing concurrency test covers atomic create-if-absent minting, not refresh replacement (`.opencode/bin/tests/compiled-route-manifest.test.cjs:457-472`).
- Finding class: class-of-bug
- Scope proof: The cited refresh implementation and its adjacent tests were inspected; no refresh serialization or concurrent replacement assertion is present in the reviewed scope.
- Affected surface hints: canonical manifest refresh CLI, activation manifest state, compiled serving authority.
- Claim adjudication:
```json
{"findingId":"F001","claim":"Concurrent refresh calls can overwrite one another after reading the same generation because refresh uses an unlocked plain overwrite.","evidenceRefs":[".opencode/bin/lib/compiled-route-manifest.cjs:564-588",".opencode/bin/tests/compiled-route-manifest.test.cjs:457-472"],"counterevidenceSought":"Checked the refresh implementation and adjacent manifest tests for a lock, compare-and-swap, atomic replacement, or concurrent refresh test; only mint has a concurrent create-if-absent test.","alternativeExplanation":"Refresh may be operationally serialized by an external deployment controller, but no such serialization is enforced or evidenced in this implementation scope.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"A refresh lock or compare-and-swap protocol plus a concurrent refresh regression test proves only one coherent generation can commit."}
```

### P2 Findings
None.

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | notApplicable | hard | `.opencode/bin/lib/compiled-route-manifest.cjs:543-595` | Correctness pass; normative comparison deferred to traceability iterations |
| checklist_evidence | notApplicable | hard | `.opencode/bin/tests/compiled-route-manifest.test.cjs:457-605` | Evidence source identified; checklist reconciliation deferred |

## Integration Evidence
- The resolver's default-on cohort and flag parser were inspected at `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:34-75`.
- The resolver fails safe when manifest authority or policy identity does not match at `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:103-122`.

## Edge Cases
- Existing manifests are validated before refresh and missing/unsafe identities fail closed, but replacement-time concurrency is not covered.
- This finding is P1 rather than P0 because a stale manifest fails safe to legacy; the risk is a lost refresh update, not an immediate unsafe compiled route.

## Confirmed-Clean Surfaces
- Mint uses atomic create-if-absent semantics and has a concurrent-writer test.
- Resolver identity mismatch returns legacy fallback rather than throwing or serving an unselected policy.

## Ruled Out
- Unsafe hub identity handling was not a finding in this pass; the refresh path delegates identity validation to `canonicalManifestPath` and explicitly returns `unsafe-path` on failure at `.opencode/bin/lib/compiled-route-manifest.cjs:545-549`.

## Next Focus
- dimension: correctness
- focus area: per-hub compiler/router parity and parity-harness classification invariants
- reason: verify that compiled policy selection cannot add or drop legacy targets across the seven hub implementations
- rotation status: continue correctness before security
- blocked/productive carry-forward: productive direct source/test comparison; do not revisit mint-only concurrency
- required evidence: representative compiler/router implementations, parity harness comparison logic, and adversarial regression tests

Review verdict: CONDITIONAL
