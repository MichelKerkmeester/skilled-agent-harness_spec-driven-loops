# Iteration 6: Refresh Correctness Adjudication

## Files Reviewed
- `.opencode/bin/lib/compiled-route-manifest.cjs:535-595`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs:457-472,501-600`
- `.opencode/bin/compiled-route-manifest.cjs:63-77`

## Findings
- F001 remains confirmed P1. `refreshCanonicalManifest` reads the existing generation, compiles outside any lock, and performs a plain overwrite at `.opencode/bin/lib/compiled-route-manifest.cjs:550-588`. Two refresh processes can therefore compile from the same generation and both write, with the later write replacing the earlier policy while returning its own generation.
- The concurrent test at `compiled-route-manifest.test.cjs:457-472` covers only mint's atomic create-if-absent path, not refresh's read/compile/overwrite race.
- No new P0, P1, or P2 finding was identified. F002, F003, and F004 remain active from prior passes.

## Edge Cases
- Compile errors return before the write, preserving fail-closed behavior.
- Invalid or missing manifests are rejected before compilation.
- These safeguards do not serialize two valid refreshes against the same prior generation.

## Next Focus
- dimension: integration
- focus area: parity harness, resolver, sync tooling, and cross-surface behavior
- reason: refresh race remains the only implementation P1; check whether integration tests catch or conceal it

Review verdict: CONDITIONAL
