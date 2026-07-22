# Iteration 1: Manifest Refresh Correctness

## Dispatcher
- Focus dimension: correctness
- Budget profile: verify
- Scope: manifest refresh library, CLI, and tests

## Files Reviewed
- `.opencode/bin/lib/compiled-route-manifest.cjs`
- `.opencode/bin/compiled-route-manifest.cjs`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs`

## Findings - New

### P0 Findings
None.

### P1 Findings
- **F001**: Refresh can overwrite a concurrent serving-state update — `.opencode/bin/lib/compiled-route-manifest.cjs:550-590` — The function reads and validates the existing manifest, caches `servingAuthority` and `shadowOnly`, performs compilation, then writes unconditionally. A concurrent writer that changes either serving field after line 552 but before line 588 is silently reverted by stale cached values. The mint path has an explicit concurrent-writer test, while refresh has no lock, compare-and-swap, fingerprint recheck, or concurrency test. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:550-590] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:457-472] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:501-605]
  - Finding class: class-of-bug
  - Scope proof: The only refresh implementation and all refresh-specific tests were read; none introduces serialization or validates that the bytes being replaced still match `existingBytes`.
  - Affected surface hints: manifest refresh CLI, activation manifest, serving-authority controller, concurrent operator execution
  - Recommendation: serialize refresh with the serving-state writer or perform an atomic compare-and-swap against the validated manifest fingerprint before replacement; add a concurrent refresh/state-change test.

```json
{"findingId":"F001","claim":"Manifest refresh can overwrite a concurrent servingAuthority or shadowOnly update with stale values read before compilation.","evidenceRefs":[".opencode/bin/lib/compiled-route-manifest.cjs:550-590",".opencode/bin/tests/compiled-route-manifest.test.cjs:457-472",".opencode/bin/tests/compiled-route-manifest.test.cjs:501-605"],"counterevidenceSought":"Read the complete refresh implementation and all refresh-specific tests for a lock, fingerprint recheck, temporary-file compare-and-swap, or concurrent refresh case; none is present.","alternativeExplanation":"The command may currently be run only by a single operator, which lowers likelihood but does not uphold the function's preservation guarantee when another activation writer runs concurrently.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade if every production caller is proven serialized by one shared lock that also covers servingAuthority and shadowOnly mutations.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery after direct implementation and test review"}]}
```

### P2 Findings
None.

## Traceability Checks
- `spec_code`: partial; the fail-closed and field-preservation claims hold for sequential execution, but concurrent preservation is not demonstrated.
- `checklist_evidence`: not executed in this iteration.

## Integration Evidence
- The public CLI calls this function directly at `.opencode/bin/compiled-route-manifest.cjs:70-74`.

## Edge Cases
- Missing, invalid, and symlink manifests fail closed.
- Sequential preservation of non-default `shadowOnly` is covered.
- Concurrent refresh or authority mutation is not covered.

## Confirmed-Clean Surfaces
- Hub identifier and manifest-path validation reject traversal and symlink targets.
- Compilation completes before the write in the ordinary single-writer path.

## Ruled Out
- Partial write caused by compile failure: ruled out because compilation precedes the write. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:565-590]
- CLI exit-code inversion: ruled out by direct branch and test review. [SOURCE: .opencode/bin/compiled-route-manifest.cjs:63-77]

## Next Focus
- Dimension: correctness
- Focus area: compiled router scoring, selection, and parity-classification semantics
- Reason: verify that the six-commit behavioral claims match implementation
- Rotation status: broaden within correctness before security
- Blocked/productive carry-forward: manifest refresh race remains active; path validation is exhausted
- Required evidence: router and parity-harness producer/consumer traces

Review verdict: CONDITIONAL
