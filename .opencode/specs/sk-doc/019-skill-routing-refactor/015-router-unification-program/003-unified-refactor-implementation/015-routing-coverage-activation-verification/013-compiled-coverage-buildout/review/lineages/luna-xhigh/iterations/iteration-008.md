# Iteration 8: Resilience and Negative Paths

## Files Reviewed
- `.opencode/bin/lib/compiled-route-manifest.cjs:216-270,543-595`
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:52-122`
- `.opencode/bin/compiled-route-sync.cjs:143-190`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs:414-455,547-600`
- `.opencode/bin/compiled-routing-foundation.vitest.ts:50-162`

## Findings
- Negative-path handling is fail-closed for traversal, symlink escapes, malformed manifests, invalid flags, missing manifests, legacy authority, stale identity, and engine failures.
- No new finding was confirmed. The refresh race F001 remains because valid concurrent inputs are accepted without serialization; negative-path guards do not address it.
- F002, F003, and F004 remain active.

## Confirmed-Clean Surfaces
- Unsafe activation roots and manifest links are rejected.
- Invalid flag values do not enable compiled serving.
- Missing or malformed state returns legacy behavior rather than throwing into the routing path.

## Next Focus
- dimension: regression
- focus area: test adequacy, frozen scorer boundaries, and claimed fleet verification
- reason: resilience controls are covered; assess whether regression evidence is complete and current

Review verdict: CONDITIONAL
