# Iteration 1: feature-catalog/governance, lifecycle, context-preservation (F1)

## Focus

Hold focus F1: audit `feature-catalog/governance/feature-flag-governance.md`, `feature-catalog/lifecycle/speckit-autopilot-lifecycle.md`, and `feature-catalog/context-preservation/resource-map-template.md` claim-by-claim against the runtime ground truth — the compiled-routing resolver (`.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`), the advisor parser (`.opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts`), `runtime/ENV-REFERENCE.md`, `.env.example`, the `.opencode/commands/speckit/*.md` routers, `runtime/lib/config/spec-doc-paths.ts`, and `runtime/scripts/spec-doc-paths`. This is the third pass (r2); the pre-supplied already-found/fixed list is excluded.

## Findings

### F1-01 — `runtime/ENV-REFERENCE.md` does NOT document `SPECKIT_COMPILED_ROUTING` (P2 misleading)

**Doc claim (quoted):** `feature-catalog/governance/feature-flag-governance.md:72` lists `runtime/ENV-REFERENCE.md` as the "Canonical env-var reference; documents `SPECKIT_COMPILED_ROUTING` and `SPECKIT_COMPILED_ROUTING_DEBUG` alongside every other governed flag."

**Actual behavior:** `runtime/ENV-REFERENCE.md` (484 lines) contains **zero** occurrences of `SPECKIT_COMPILED_ROUTING` (verified: `grep -c "SPECKIT_COMPILED_ROUTING" runtime/ENV-REFERENCE.md` → 0; a `grep -n "COMPILED"` sweep returns only the unrelated line 186 about hooks). The flag is documented only in `.env.example:133-134` — which is exactly the drift the same doc's own governance contract (`:73`) calls a problem: "*a flag documented in one and missing from the other is drift*." So the cited canonical reference is wrong, and the drift the policy forbids is actually present.

- Doc: [SOURCE: feature-catalog/governance/feature-flag-governance.md:72]
- Actual: [SOURCE: runtime/ENV-REFERENCE.md] (0 matches for the flag); the flag appears at [SOURCE: .env.example:133-134]; tri-state parsing lives at [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:7-9,51-54]
- Severity: P2
- One-line fix: drop `runtime/ENV-REFERENCE.md` from the governance doc's source list, or add `SPECKIT_COMPILED_ROUTING`/`_DEBUG` to ENV-REFERENCE.md so it truly is the canonical reference.

## Sources Consulted

- feature-catalog/governance/feature-flag-governance.md:3,19,43,45,47,60,72-73,78,87
- feature-catalog/lifecycle/speckit-autopilot-lifecycle.md (all sections)
- feature-catalog/context-preservation/resource-map-template.md (all sections)
- .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:5-9,25-34,51-57,67-73
- .opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts:14-19,30-35,59
- .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:186 (only COMPILED-adjacent hit; flag absent)
- .env.example:126,133-134
- .opencode/commands/speckit/complete.md:4,14-16,31-33,44-58
- .opencode/commands/speckit/plan.md:4,14-16,31-33,48-71
- .opencode/commands/speckit/implement.md:2-3,31,35,59,64,73
- .opencode/commands/speckit/assets/speckit-complete-auto.yaml:50,56-59,74,562-565,1152,1157
- .opencode/skills/system-spec-kit/runtime/lib/config/spec-doc-paths.ts:25
- .opencode/skills/system-spec-kit/manual-testing-playbook/lifecycle/speckit-autopilot-lifecycle.md (referenced source, exists)

## Assessment

- newInfoRatio: 1.0
- Novelty justification: F1-01 is new to this packet; the prior passes corrected the finalize-dist, doctor-route, and README issues but did not flag the ENV-REFERENCE.md source-list gap for the compiled-routing flag. No re-report of the already-fixed list.
- Confidence notes: F1-01 confirmed by direct grep (`-c` return 0) plus a manual read of all 484 lines of ENV-REFERENCE.md for COMPILED/compiled. The lifecycle doc and resource-map-template doc were verified accurate against their cited code paths (compiled-routing file set, command routers, `spec-doc-paths.ts:25`, autopilot result contract).

## Reflection

- What worked: filesystem existence checks and targeted greps against each cited runtime source conclusively confirm/refute the source-list claims; the autopilot command-router contract matches its doc exactly.
- What failed: the lifecycle and resource-map-template docs are already well-aligned with the command routers and spec-doc-paths, so F1 yields only one fresh hit (the ENV-REFERENCE source-list gap). The highest-value residual drift in this family is the feature-flag-governance source list, not the lifecycle contract.
- Ruled out: the compiled-routing eligibility set (five hubs: `sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`, `sk-doc`) matches `compiled-routing-flag.ts:14-19` and `resolve.cjs:31-36`; the "unset now resolves to compiled for all" claim matches `resolve.cjs:30-34` and the `DEFAULT_ON_HUBS` cohort (`compiled-routing-flag.ts:30-35`); the launcher allowlist forwarding `SPECKIT_COMPILED_ROUTING` matches `system-skill-advisor-launcher.cjs:124`; the autopilot branch-preserve/reason-code contract matches `complete.md:44-58`, `implement.md:59-73`, and `speckit-complete-auto.yaml:50-74,562-565`.

## Recommended Next Focus

[F2] feature-catalog/retrieval, feature-catalog/memory-quality-and-indexing, feature-catalog/ux-hooks, and the not-yet-cited feature-catalog/tooling-and-scripts entries — hunt retired-capability framing (vector/semantic/embedding/MCP-memory) still described as live, plus path/flag drift in retrieval and tooling entries.
