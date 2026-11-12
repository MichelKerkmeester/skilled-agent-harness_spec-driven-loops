---
title: "advisor_recommend Command"
description: "Native command that returns prompt-safe skill recommendations with lane attribution, lifecycle metadata, fail-open freshness semantics and an optional compiled-routing enrichment."
trigger_phrases:
  - "advisor_recommend"
  - "mcp recommend tool"
  - "native recommend"
  - "skill recommendation tool"
  - "compiledRoute enrichment"
version: 0.9.2.0
---

# advisor_recommend Command

## 1. OVERVIEW

Expose the native scoring pipeline as a command that any runtime can call through the CLI front door, with prompt-safe attribution and lifecycle-aware redirects.

---

## 2. HOW IT WORKS

`handlers/advisor-recommend.ts` implements the command. Input is validated by `schemas/advisor-tool-schemas.ts` (Zod strict). The public response always includes the resolved `workspaceRoot` plus `effectiveThresholds`, where `effectiveThresholds` publishes the active `confidenceThreshold`, `uncertaintyThreshold` and `confidenceOnly` mode after request overrides are merged with defaults. Output also carries prompt-safe `recommendations[]`, optional `laneBreakdown[]` when `includeAttribution: true`, lifecycle redirect metadata (`redirectFrom`, `redirectTo`, `status`), `freshness`, `trustState`, `generatedAt`, `cache`, optional `warnings` and optional `abstainReasons`. Fail-open states such as disabled or absent freshness still preserve `workspaceRoot` and `effectiveThresholds` in the envelope so callers can inspect the resolved repository scope and active routing thresholds even when no recommendations are returned. The handler enforces sanitization at the envelope boundary (see `lib/derived/sanitizer.ts`) and never echoes prompt text into response metadata. Cache behavior is tied to generation (see [`daemon-and-freshness/cache-invalidation.md`](../../feature-catalog/daemon-and-freshness/cache-invalidation.md)).

Shadow comparison is response-visible but durable recording is default-off. The handler calls the shadow-delta sink only when `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` is set or `SPECKIT_ADVISOR_SHADOW_DELTA_ENABLED=1` / `true`; otherwise `advisor_recommend` writes no shadow delta file.

The caller-supplied `workspaceRoot` is bounded by `schemas/advisor-tool-schemas.ts`, which canonicalizes the path and accepts it only when it resolves under the repo root, `os.tmpdir()` or the `/tmp` symlink form, or sits in a project whose `.skilled` (or `.opencode`) links to this source tree, the way `/doctor:symlink` links one, meaning its realpath equals this source tree's own entry. The `SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST` env var extends that set with extra colon-separated prefixes for CI or test runners, each canonicalized before it is trusted. The flag is unset by default, so the bounding logic stays repo-and-tmpdir-only unless an operator opts in.

### Compiled-Routing Enrichment (`compiledRoute`)

Each recommendation carries an optional `compiledRoute` field (`schemas/advisor-tool-schemas.ts:308`, `z.record(z.string(), z.unknown()).optional()`). `handlers/advisor-recommend.ts`'s `enrichCompiledRoutes()` attaches it only when at least one recommended `skillId` is both in the fixed 7-hub `COMPILED_ROUTING_HUBS` set and currently permitted by the tri-state `SPECKIT_COMPILED_ROUTING` flag (`compiledRoutingEnabledForHub()`, from `../lib/compiled-routing-flag.ts`). Otherwise the schema re-parse is skipped entirely and the output returns unchanged. When enrichment runs, `compiledRouteForRecommendation()` shells out to `.skilled/bin/compiled-route.cjs --hub <skillId> --prompt-stdin`, writes the prompt to its stdin and attaches the parsed result. The one exception is a result whose `servingAuthority` is `"legacy"`: the field then stays absent, because a legacy sentinel is never surfaced as if it were a compiled decision. A subprocess failure is handled the same way: silently no `compiledRoute` field, with an optional debug-gated stderr breadcrumb via `SPECKIT_COMPILED_ROUTING_DEBUG`, so a probe failure degrades to exactly what an ineligible or flag-off recommendation already looks like. In short, `compiledRoute` is attached only for an eligible, flag-permitted hub that is genuinely serving compiled. It is intentionally absent for every other combination: flag off, hub not in `COMPILED_ROUTING_HUBS`, legacy sentinel or probe failure. See [`feature-flag-governance.md`](../../../system-spec-kit/feature-catalog/governance/feature-flag-governance.md) for the flag's phased-default and serving-status contract, and each eligible hub's own `compiled-routing-and-legacy-fallback.md` catalog leaf for the hub-side directive this enrichment mirrors. The front door runs from the request's `workspaceRoot`, and a caller may name another checkout there, such as a worktree under the repository root. So the handler first checks that the front door it would run reads `--prompt-stdin`. An older front door gets no call and the recommendation carries no `compiledRoute`, because it would route an empty prompt.

When a recommendation gets a `compiledRoute`, `enrichCompiledRoutes()` also asks `attachCommand()` in `lib/command-attach.ts` for a slash command and sets the optional `command` field when one comes back (`schemas/advisor-tool-schemas.ts:310`, `z.string().min(1).optional()`). `attachCommand()` names a command only for a `route` decision with `selectionKind: 'single'` and exactly one target, and only when the generated `MODE_COMMANDS` table maps that hub and `workflowMode` to a command. A bundle, a multi-target route or a mode with no command leaves `command` off. For `system-deep-loop` the prompt must also contain `/deep:` or a phrase from `DEPTH_WORDING`, so a prompt that only names a topic such as research or review gets no deep-loop command.

The request option `options.includeCompiledRoute` is an optional boolean that defaults to true. When a caller passes `false` the handler skips `enrichCompiledRoutes()` on both the fresh and the cached return (`handlers/advisor-recommend.ts:563-565`, `632-634`), so no `compiled-route.cjs` subprocess starts and no recommendation carries `compiledRoute` or `command`. The prompt hooks pass `true` (`hooks/lib/skill-advisor-cli-fallback.ts:238`), because the `command` field is derived from the compiled route. The OpenCode plugin does not pass the option and keeps receiving `compiledRoute`. The option is declared in the zod schema (`schemas/advisor-tool-schemas.ts:287`), the tool descriptor (`tools/advisor-recommend.ts:23`) and the CLI manifest (`skill-advisor-cli-manifest.ts:57`).

The request option `options.compiledRouteTopOnly` is an optional boolean that defaults to false. When a caller passes `true`, `enrichCompiledRoutes()` runs the route lookup for the first recommendation only and returns every later one unchanged, so only the top pick can carry `compiledRoute` or `command`. Each lookup is a `compiled-route.cjs` subprocess, so this saves one subprocess for each further eligible hub. The prompt hooks pass `true` with `includeCompiledRoute: true`, because the brief leads with the top pick. The option is declared in the zod schema (`schemas/advisor-tool-schemas.ts:290`), the tool descriptor (`tools/advisor-recommend.ts:24`) and the CLI manifest (`skill-advisor-cli-manifest.ts:58`).

A hub also leaves `command` off when the same command already ranks in the result through its own command row. `enrichCompiledRoutes()` reads each row's slash string from `BRIDGE_COMMAND_BY_ID`, so one command never takes two slots.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Handler | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Schema | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/tools/` | Command surface | Source reference |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Shared | `attachCommand()`, the generated `MODE_COMMANDS` table and the `DEPTH_WORDING` gate that name the slash command for a single routed mode. |
| `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | Shared | `COMPILED_ROUTING_HUBS` eligibility set, `DEFAULT_ON_HUBS` cohort, and the tri-state flag parser the enrichment gate reads. |
| `.skilled/bin/compiled-route.cjs` | Script | Promoted CLI front door `compiledRouteForRecommendation()` shells out to. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts` | Automated test | Validation reference |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Automated test | `includeCompiledRoute: false` skips enrichment on fresh and cached returns. `compiledRouteTopOnly: true` looks up the first recommendation alone. A command that ranks through its own row is not offered again by its hub. |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-privacy.vitest.ts` | Automated test | Validation reference |
| `.skilled/skills/system-skill-advisor/runtime/tests/compiled-routing-consumption.vitest.ts` | Automated test | Bridge child-env allowlist forwarding, `buildNativeBrief` decision threading, and `=0` cache-invalidation coverage for the `compiledRoute` enrichment. |
| `.skilled/bin/compiled-routing-flag-propagation.vitest.ts` | Automated test | Tri-state flag propagation coverage. |
| `Playbook scenarios [NC-001](../../manual-testing-playbook/native-cli-tools/native-recommend-happy-path.md), [NC-004](../../manual-testing-playbook/native-cli-tools/ambiguous-brief-rendering.md), [NC-005](../../manual-testing-playbook/native-cli-tools/lifecycle-redirect-metadata.md).` | Manual playbook | Source reference |

---

## 4. SOURCE METADATA

- Group: Command surface
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-surface/advisor-recommend.md`

Related references:

- [02-advisor-status.md](../../feature-catalog/cli-surface/advisor-status.md).
- [03-advisor-validate.md](../../feature-catalog/cli-surface/advisor-validate.md).
- [04-compat-entrypoint.md](../../feature-catalog/cli-surface/compat-entrypoint.md).
- [feature-flag-governance.md](../../../system-spec-kit/feature-catalog/governance/feature-flag-governance.md) — the `SPECKIT_COMPILED_ROUTING` flag-governance entry this enrichment's gate reads.
