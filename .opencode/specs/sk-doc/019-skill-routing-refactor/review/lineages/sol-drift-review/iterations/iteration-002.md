# Iteration 2: Compiled-Routing Security

## Dispatcher

- Focus: security
- Scope: compiled-route front door, manifest containment, runtime engine, and flag tests

## Findings

### P0

None.

### P1

None.

### P2

None.

## Confirmed Clean

- The public front door catches runtime failures and emits a legacy sentinel instead of throwing into routing. [SOURCE: .opencode/bin/compiled-route.cjs:10-45]
- Manifest reads verify real paths remain within the activation root. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:145-170]
- Kill-switch and invalid values resolve to legacy in the executable foundation tests. [SOURCE: .opencode/bin/compiled-routing-foundation.vitest.ts:128-137]

## Ruled Out

- Traversal or symlink escape from the activation root.
- Invalid flag values accidentally enabling compiled serving.
- Runtime-engine failure bypassing the legacy fallback.

## Next Focus

Trace advisor source paths and router-unification parent status into maintained sources and child evidence.

Review verdict: PASS
