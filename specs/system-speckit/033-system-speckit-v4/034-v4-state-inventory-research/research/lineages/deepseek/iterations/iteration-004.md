# Iteration 4: Angle 4 — SYSTEM-SKILL-ADVISOR

## Focus
Inventory the shipped system-skill-advisor: MCP server identity and tool ids, CLI front door under .opencode/bin, scorer thresholds, graph metadata / hub-level identity, hook brief, state containment, daemon and freshness surfaces.

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| MCP server | `system_skill_advisor` v0.1.0 (server name); mcp-server/advisor-server.ts | advisor-server.ts:239 |
| CLI front door | `.opencode/bin/skill-advisor.cjs` (advisor_recommend per AGENTS.md Gate 2 usage), plus `.opencode/bin/system-skill-advisor-launcher.cjs` | .opencode/bin/ ls |
| Scorer thresholds | DEFAULT confidenceThreshold 0.8, uncertaintyThreshold 0.35; env overrides SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD / SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD; --threshold/--uncertainty CLI args | compat/contract.ts:9-12,25-35; subprocess.ts:101-106 |
| Confidence buckets | SPECKIT_CONFIDENCE_BUCKETS = [0, 0.5, 0.7, 0.8, 0.9, 1.0] | lib/metrics.ts:616 |
| Route exclusions | config/route-exclusions.json + route-exclusions.local.json.example (denylist) | mcp-server/config/ ls |
| Hook brief | hooks/skill-advisor-hook.md + hooks/{claude,lib,pi} (claude + pi hook files) | hooks/ ls |
| Daemon | feature-catalog/daemon-and-freshness/: cache-invalidation, generation, lease, lifecycle, rebuild-from-source, trust-state, watcher | feature-catalog/daemon-and-freshness/ ls |
| Graph metadata | schema_version 2, skill_id system-skill-advisor, family system, edges to cli-external-orchestration (0.7), mcp-tooling (0.7), mcp-code-mode ... | graph-metadata.json:1-27 |
| State containment | .advisor-state references in mcp-server/lib (freshness/generation.ts, skill-graph/skill-graph-db.ts) and hooks/lib (directive-lifecycle-file-store.ts, directive-lifecycle-store.py) | rg .advisor-state |
| Scoring subprocess | lib/scorer/fusion.ts (DEFAULT_CONFIDENCE_THRESHOLD / DEFAULT_UNCERTAINTY_THRESHOLD from contract); lib/subprocess.ts bridges CLI+server | scorer/fusion.ts:32,48-49 |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "its workspace anchoring got stricter (though keeping its state fully out of your spec folders is still in progress)" | Containment still partially open | TRUE | .advisor-state handling exists in lib and hooks; containment code present; no evidence the hole is closed | P2 | Claim stands; containment not fully verifiable without runtime test | rg .advisor-state; hooks/lib |
| "the advisor's fusion seams" (dark flags list) | Fusion seams were a held-back feature family | TRUE | lib/scorer/fusion.ts exists (fusion scorer) | P2 | Fusion scorer exists on branch | scorer/fusion.ts:32 |
| "launches cleanly under Codex" / "Codex sessions now launch the advisor under the Node runtime whose ABI (141) matches" | Codex advisor launch | UNVERIFIED | No codex launcher inspected; claim needs runtime verification (out of scope, no execution) | P2 | Marked UNVERIFIED, not contradicted | — |
| "a read-only freshness panel lets you see whether the compiled graph is current" | Freshness panel exists | TRUE | feature-catalog/daemon-and-freshness/trust-state.md + generation.md; lib/freshness/generation.ts | P2 | Freshness machinery confirmed | lib/freshness/generation.ts |
| "renamed database" (Internal Seams: "the advisor became a standalone package ... with a renamed database") | Renamed DB | UNVERIFIED | database/ dirs exist (mcp-server/database, mcp_server/database); rename not verified from surface | P2 | Not contradicted | ls database/ |

## Sources Consulted
- .opencode/bin/ ls; system-skill-advisor/{mcp-server,hooks,feature-catalog,graph-metadata.json,config} 
- compat/contract.ts, scorer/fusion.ts, subprocess.ts, metrics.ts

## Assessment
- **newInfoRatio**: 0.9 — most rows new; one claim (ABI 141/Codex) is a known-from-draft item not contradicted.
- **Confidence**: Confirmed for thresholds, MCP id, route exclusions, hook brief, daemon catalog; UNVERIFIED for Codex-launch and DB-rename claims.

## Reflection
- Worked: config/contract grep pins the threshold defaults quickly.
- Failed: Codex ABI claim cannot be checked without running a Codex session (out of scope).
- Ruled out: reading the daemon code — feature-catalog coverage suffices at this level.

## Recommended Next Focus
Angle 5: SK-DOC — the sk-create-* modes and their /create:* commands, naming guard, templates, DQI/quality gate; verify draft claims about command renames and quality-control alias.
