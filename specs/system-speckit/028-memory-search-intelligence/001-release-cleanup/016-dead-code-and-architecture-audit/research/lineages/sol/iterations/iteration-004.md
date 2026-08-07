# Iteration 004: Compiled routing closure

## Focus

Audit the generated compiled-routing serving closure, hub compilers, and publication boundary.

## Findings

1. The generated serving closure preserves phase-program topology (`009-parent-hub-rollout`, `013-live-activation`, `014-runtime-engine`) in production path resolution. The runtime engine hard-codes all seven numbered hub-child paths. This is CAT-4/CAT-5 placement debt even though the closure is generated and live. [SOURCE: file:.opencode/bin/lib/README.md:59] [SOURCE: file:.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:29] [SOURCE: file:.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:31]
2. Seven hub-specific `registry-compiler.cjs` implementations total 3,155 lines and have seven distinct hashes. They share validation, hashing, vocabulary, and destination concerns but encode hub exceptions in separate programs. This is CAT-6 specialization overhead. [SOURCE: file:.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:37] [SOURCE: file:.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:100]

## Sources Consulted

- `.opencode/bin/lib/README.md:55-74`
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:21-38`
- `wc -l .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/*/lib/registry-compiler.cjs`
- `shasum -a 256 .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/*/lib/registry-compiler.cjs`

## Assessment

- New information ratio: 0.78
- Confidence: high for structure; consolidation feasibility needs compiler parity tests.

## Reflection

The closure cannot be deleted because it is serving output. Simplification belongs in the authored generator, after which publication should emit a runtime-shaped tree.

## Recommended Next Focus

Inspect command routers, legacy fallbacks, and generated contract layering.
