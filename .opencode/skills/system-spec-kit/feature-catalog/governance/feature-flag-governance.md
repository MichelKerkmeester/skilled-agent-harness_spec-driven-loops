---
title: "Feature flag governance"
description: "Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits."
trigger_phrases:
  - "feature flag governance"
  - "isFeatureEnabled"
  - "manage feature flags"
  - "flag sunset and audit"
  - "rollout policy"
  - "SPECKIT_COMPILED_ROUTING"
version: 3.7.0.0
---

# Feature flag governance

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits.

Feature flags let you turn new features on or off without changing the code itself, like light switches for functionality. This governance process tracks which switches exist, who controls them and when old ones should be retired so the collection does not grow out of control.

---

## 2. HOW IT WORKS

### The Accumulation Problem

The program introduces many scoring signals, rollout switches and roadmap flags. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework still defines process targets such as keeping the active flag surface small, setting sunset windows and running periodic audits. Those targets are not hard caps enforced in runtime code.

### Core Behavior

Live runtime governance does exist. `isFeatureEnabled()` implements default-on, explicit-opt-out semantics: a flag stays enabled unless it is explicitly set to `false` or `0`. Global rollout percentage is read from `SPECKIT_ROLLOUT_PERCENT`, and partial rollout is fail-closed when no identity is provided, so a missing identity does not silently bypass gating.

### Roadmap Flag Defaults

Memory roadmap defaults are also governed in code. Missing or invalid roadmap phase values resolve to `scope-governance`, while dormant roadmap flags remain intentionally default-off where required. In particular, adaptive ranking stays off unless explicitly enabled, even though most graduated roadmap flags inherit the default-on rollout helper.

### Compiled-Routing Flag (`SPECKIT_COMPILED_ROUTING`)

`SPECKIT_COMPILED_ROUTING` is the tri-state gate for serving the compiled per-hub router contract instead of a hub's prose smart-router, and it is an explicit exception to the default-on/explicit-opt-out shape above: the flag itself ships **unset**, never forced on by default. Parsing is single-sourced (`.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` and `.opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts` share the same tri-state semantics): unset resolves through each file's own per-hub default-on cohort, which now lists the same 7 promoted hubs in both (the staged cutover completed for the runtime resolver and, separately, for the advisor's `compiledRoute` enrichment), so unset currently resolves to compiled for those hubs and legacy for every other hub; `1` force-enables compiled resolution wherever a hub also carries a compiled activation manifest; `0`, `false`, or `off` is an explicit fleet-wide kill-switch that forces legacy regardless of manifest or cohort state; any other value fails closed to legacy.

**Eligibility** is the fixed 7-hub set `sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`, `sk-prompt`, `sk-design`, `sk-doc` (`COMPILED_ROUTING_HUBS`). Serving additionally requires the hub's promoted activation manifest (`.opencode/bin/lib/compiled-routing/010-live-activation/activation/<hub>/manifest.json`) to report `servingAuthority: "compiled"`, so the flag alone lights no hub.

**Serving status** for any hub is readable via `node .opencode/bin/compiled-route-status.cjs --hub <hub> | --all`, which emits one stable JSON record per hub with a `causeCode` that separates expected **drift** (`flag-off`, `legacy-authority`, `missing-manifest` — the flag or manifest intentionally withholds compiled serving) from a genuine **break** (`engine-throw` — flag and manifest both authorize compiled serving but the engine itself fails). `compiled-serving` is the fourth code, meaning the hub is actually being served compiled right now.

Default-on for a hub is a staged, per-hub cutover — never the flag's own shipped default — gated on that hub passing parity, serving-status, fallback, and rollback checks first; it is now complete for all 7 eligible hubs in both the runtime resolver's cohort and the advisor enrichment's cohort, so an unset flag currently resolves to compiled for every eligible hub in both paths. The **explicit `=0` override** is the fleet-wide kill-switch: it forces every eligible hub back to legacy routing regardless of any hub's individual manifest or cohort state, independent of `SPECKIT_COMPILED_ROUTING_DEBUG` (unset/OFF by default), which only emits debug-gated stderr breadcrumbs on a fallback and never changes what is served.

### Edge Cases & Caveats

The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.

**Cross-reference**: See `tooling-and-scripts/template-compliance-contract-enforcement.md` for the 3-layer template compliance architecture (agent contracts + post-write validation + runtime schema enforcement).

---

## 3. SOURCE FILES

- `.opencode/skills/system-spec-kit/mcp-server/lib/cognitive/rollout-policy.ts` - Canonical runtime flag helper and rollout-percentage enforcement, including default-on/explicit-opt-out semantics and fail-closed identity handling for partial rollout.
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/capability-flags.ts` - Memory roadmap phase and flag governance, including `scope-governance` fallback and intentionally default-off dormant flags such as adaptive ranking.
- `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md` - Canonical env-var reference; documents `SPECKIT_COMPILED_ROUTING` and `SPECKIT_COMPILED_ROUTING_DEBUG` alongside every other flag.
- `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` - Runtime tri-state flag parser and the manifest serving-authority gate.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts` - Advisor-side single-sourced tri-state parser, `COMPILED_ROUTING_HUBS` eligibility set, and `DEFAULT_ON_HUBS` cohort.
- `.opencode/bin/compiled-route-status.cjs` - Per-hub serving-status probe emitting the drift-vs-break `causeCode` contract.
- `.opencode/bin/mk-skill-advisor-launcher.cjs` - Child-process env allowlist that forwards `SPECKIT_COMPILED_ROUTING` to the spawned advisor daemon.

---

## 4. SOURCE METADATA
- Group: Governance
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `governance/feature-flag-governance.md`
Related references:
- [hierarchical-scope-governance-governed-ingest-retention-and-audit.md](../../feature-catalog/governance/hierarchical-scope-governance-governed-ingest-retention-and-audit.md) — Hierarchical scope governance, governed ingest, retention, and audit
- [advisor-recommend.md](../../../system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md) — the `advisor_recommend` consumption path that reads this same `SPECKIT_COMPILED_ROUTING` flag to attach or omit `compiledRoute`
