# Plan: Research-Driven Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

## Approach

Verify-first, then fix each of the four 028-surfaced code defects in isolation (one sub-agent per subsystem), build the affected dist, and run the targeted test suite before claiming the fix. Research findings are treated as hypotheses, not facts — confirm or refute each against the source.

## Steps

1. Causal link/unlink → add `runPostMutationHooks` on success paths (`mcp_server/handlers/causal-graph.ts`); build + causal suites.
2. MiniMax `--variant` → live-confirm acceptance, then drop the suppression exception (`live-executor.cjs`); node --check + playbook suite.
3. Launcher fixtures → copy the `lib/` tree alongside the launcher in any suite missing it (`launcher-ipc-bridge.vitest.ts`); un-skip proof.
4. Code-graph `depthTruncated` → add the completeness signal to the blast-radius BFS (`system-code-graph/.../query.ts`); build + query suites.

## Verification

Per-fix build + targeted vitest green. Dist activation (daemon recycle / code-graph reconnect) is a separate deploy step.
