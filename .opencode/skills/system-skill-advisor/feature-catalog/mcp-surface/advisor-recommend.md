---
title: "advisor_recommend MCP Tool"
description: "Native MCP tool that returns prompt-safe skill recommendations with lane attribution, lifecycle metadata, fail-open freshness semantics, and an optional compiled-routing enrichment."
trigger_phrases:
  - "advisor_recommend"
  - "mcp recommend tool"
  - "native recommend"
  - "skill recommendation tool"
  - "compiledRoute enrichment"
version: 0.9.0.0
---

# advisor_recommend MCP Tool

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Expose the native scoring pipeline as an MCP tool that any runtime can call, with prompt-safe attribution and lifecycle-aware redirects.

## 2. HOW IT WORKS

`handlers/advisor-recommend.ts` implements the tool. Input is validated by `schemas/advisor-tool-schemas.ts` (Zod strict). The public response always includes the resolved `workspaceRoot` plus `effectiveThresholds`, where `effectiveThresholds` publishes the active `confidenceThreshold`, `uncertaintyThreshold` and `confidenceOnly` mode after request overrides are merged with defaults. Output also carries prompt-safe `recommendations[]`, optional `laneBreakdown[]` when `includeAttribution: true`, lifecycle redirect metadata (`redirectFrom`, `redirectTo`, `status`), `freshness`, `trustState`, `generatedAt`, `cache`, optional `warnings` and optional `abstainReasons`. Fail-open states such as disabled or absent freshness still preserve `workspaceRoot` and `effectiveThresholds` in the envelope so callers can inspect the resolved repository scope and active routing thresholds even when no recommendations are returned. The handler enforces sanitization at the envelope boundary (see `lib/derived/sanitizer.ts`) and never echoes prompt text into response metadata. Cache behavior is tied to generation (see [`daemon-and-freshness/cache-invalidation.md`](../../feature-catalog/daemon-and-freshness/cache-invalidation.md)).

Shadow comparison is response-visible but durable recording is default-off. The handler calls the shadow-delta sink only when `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` is set or `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED=1` / `true`; otherwise `advisor_recommend` writes no shadow delta file.

The caller-supplied `workspaceRoot` is bounded by `schemas/advisor-tool-schemas.ts`, which canonicalizes the path and accepts it only when it resolves under the repo root, `os.tmpdir()` or the `/tmp` symlink form. The `SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST` env var extends that set with extra colon-separated prefixes for CI or test runners, each canonicalized before it is trusted. The flag is unset by default, so the bounding logic stays repo-and-tmpdir-only unless an operator opts in.

### Compiled-Routing Enrichment (`compiledRoute`)

Each recommendation carries an optional `compiledRoute` field (`schemas/advisor-tool-schemas.ts:221`, `z.record(z.string(), z.unknown()).optional()`). `handlers/advisor-recommend.ts`'s `enrichCompiledRoutes()` attaches it only when at least one recommended `skillId` is both in the fixed 7-hub `COMPILED_ROUTING_HUBS` set and currently permitted by the tri-state `SPECKIT_COMPILED_ROUTING` flag (`compiledRoutingEnabledForHub()`, from `../lib/compiled-routing-flag.ts`); otherwise the schema re-parse is skipped entirely and the output returns unchanged. When enrichment runs, `compiledRouteForRecommendation()` shells out to `.opencode/bin/compiled-route.cjs --hub <skillId> --prompt <prompt>` and attaches the parsed result — UNLESS that result's `servingAuthority` is `"legacy"`, in which case the field stays absent (a legacy sentinel is never surfaced as if it were a compiled decision). A subprocess failure is handled the same way: silently no `compiledRoute` field, with an optional debug-gated stderr breadcrumb via `SPECKIT_COMPILED_ROUTING_DEBUG`, so a probe failure degrades to exactly what an ineligible or flag-off recommendation already looks like. In short: `compiledRoute` is attached only for an eligible, flag-permitted hub that is genuinely serving compiled; it is intentionally absent for every other combination (flag off, hub not in `COMPILED_ROUTING_HUBS`, legacy sentinel, or probe failure). See [`feature-flag-governance.md`](../../../system-spec-kit/feature-catalog/governance/feature-flag-governance.md) for the flag's phased-default and serving-status contract, and each eligible hub's own `compiled-routing-and-legacy-fallback.md` catalog leaf for the hub-side directive this enrichment mirrors.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts` | Handler | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/tools/` | Tool surface | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts` | Shared | `COMPILED_ROUTING_HUBS` eligibility set, `DEFAULT_ON_HUBS` cohort, and the tri-state flag parser the enrichment gate reads. |
| `.opencode/bin/compiled-route.cjs` | Script | Promoted CLI front door `compiledRouteForRecommendation()` shells out to. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/advisor-recommend.vitest.ts` | Automated test | Validation reference |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/legacy/advisor-privacy.vitest.ts` | Automated test | Validation reference |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/compiled-routing-consumption.vitest.ts` | Automated test | Bridge child-env allowlist forwarding, `buildNativeBrief` decision threading, and `=0` cache-invalidation coverage for the `compiledRoute` enrichment. |
| `.opencode/bin/compiled-routing-flag-propagation.vitest.ts` | Automated test | Tri-state flag propagation coverage. |
| `Playbook scenarios [NC-001](../../manual-testing-playbook/native-mcp-tools/native-recommend-happy-path.md), [NC-004](../../manual-testing-playbook/native-mcp-tools/ambiguous-brief-rendering.md), [NC-005](../../manual-testing-playbook/native-mcp-tools/lifecycle-redirect-metadata.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `mcp-surface/advisor-recommend.md`

Related references:

- [02-advisor-status.md](../../feature-catalog/mcp-surface/advisor-status.md).
- [03-advisor-validate.md](../../feature-catalog/mcp-surface/advisor-validate.md).
- [04-compat-entrypoint.md](../../feature-catalog/mcp-surface/compat-entrypoint.md).
- [feature-flag-governance.md](../../../system-spec-kit/feature-catalog/governance/feature-flag-governance.md) — the `SPECKIT_COMPILED_ROUTING` flag-governance entry this enrichment's gate reads.
