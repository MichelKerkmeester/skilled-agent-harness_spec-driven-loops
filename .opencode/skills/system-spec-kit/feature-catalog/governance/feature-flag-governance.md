---
title: "Feature flag governance"
description: "Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits, and owns the SPECKIT_COMPILED_ROUTING tri-state gate."
trigger_phrases:
  - "feature flag governance"
  - "manage feature flags"
  - "flag sunset and audit"
  - "compiled routing kill switch"
  - "SPECKIT_COMPILED_ROUTING"
version: 4.0.0.0
---

# Feature flag governance

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits, and it owns the `SPECKIT_COMPILED_ROUTING` tri-state gate that decides whether a hub is served by its compiled router or its prose smart-router.

Feature flags let you turn new features on or off without changing the code itself, like light switches for functionality. This governance process tracks which switches exist, who controls them and when old ones should be retired so the collection does not grow out of control.

This entry is cross-cutting rather than spec-kit-local: six other catalogs link here for the compiled-routing contract, and the advisor's `advisor_recommend` entry reads the same flag.

---

## 2. HOW IT WORKS

### The Accumulation Problem

Scoring signals, rollout switches and roadmap flags accumulate until nobody knows what is enabled. The governance framework answers that with process targets rather than runtime caps: keep the active flag surface small, give each flag an explicit sunset window, and run periodic audits that diff code-declared flags against the documented table.

A flag is governed when its row records four things: its default state, the env var that controls it, the automation it gates, and the version it was added in. A flag present in code but absent from the table is drift, and drift is a tracked remediation item rather than a note in a transcript.

### Sunset And Audit Policy

Retirement is part of the contract, not a cleanup someone gets to later. A flag that has reached its sunset window is either removed with the code path it gated or re-argued with a new window; leaving it declared and inert is the failure this policy exists to prevent. The audit is the enforcement mechanism, and it runs against the documented table rather than against memory.

The memory engine's own flag family — retention sweeps, embedding cache and retry, launcher idle timeout, index scans and the roadmap phase flags — was retired wholesale with that engine. Those rows are gone from the table rather than deprecated in place, which is what this policy asks for.

### Default Semantics After The Memory Decommission

The default-on/explicit-opt-out helper and its `SPECKIT_ROLLOUT_PERCENT` partial-rollout gate lived inside the memory engine and went with it. There is no longer one shared runtime helper that decides a flag's default: each surviving flag declares its own default at its own read site, and the table records that default. `SPECKIT_COMPILED_ROUTING` documents its own shape below, and it is deliberately not default-on.

### Compiled-Routing Flag (`SPECKIT_COMPILED_ROUTING`)

`SPECKIT_COMPILED_ROUTING` is the tri-state gate for serving the compiled per-hub router contract instead of a hub's prose smart-router. The flag itself ships **unset**, never forced on. Parsing is single-sourced — `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` and `.opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts` share the same tri-state semantics:

| Value | Resolution |
|---|---|
| unset | Resolves through each file's own per-hub default-on cohort |
| `1` | Force-enables compiled resolution wherever a hub also carries a compiled activation manifest |
| `0`, `false`, `off` | Explicit fleet-wide kill-switch: forces legacy regardless of manifest or cohort state |
| anything else | Fails closed to legacy |

**Eligibility** is the fixed hub set in `COMPILED_ROUTING_HUBS`: `sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`, `sk-doc`. The retired `sk-design` hub left the set when it was decommissioned; the standalone skill that now holds that name is not a hub and is not eligible. Serving additionally requires the hub's promoted activation manifest (`.opencode/bin/lib/compiled-routing/013-live-activation/activation/<hub>/manifest.json`) to report `servingAuthority: "compiled"`, so the flag alone lights no hub.

**Serving status** for any hub is readable via `node .opencode/bin/compiled-route-status.cjs --hub <hub> | --all`, which emits one stable JSON record per hub with a `causeCode` that separates expected **drift** (`flag-off`, `legacy-authority`, `missing-manifest` — the flag or manifest intentionally withholds compiled serving) from a genuine **break** (`engine-throw` — flag and manifest both authorize compiled serving but the engine itself fails). `compiled-serving` is the fourth code, meaning the hub is actually being served compiled right now.

Default-on for a hub is a staged, per-hub cutover — never the flag's own shipped default — gated on that hub passing parity, serving-status, fallback and rollback checks first. The cutover is complete for every eligible hub in both the runtime resolver's cohort and the advisor enrichment's `DEFAULT_ON_HUBS`, so an unset flag currently resolves to compiled for all of them. The **explicit `=0` override** is the fleet-wide kill-switch: it forces every eligible hub back to legacy routing regardless of any hub's individual manifest or cohort state, independent of `SPECKIT_COMPILED_ROUTING_DEBUG` (unset/OFF by default), which only emits debug-gated stderr breadcrumbs on a fallback and never changes what is served.

### Edge Cases & Caveats

A governance target is not a runtime guardrail. Nothing in the runtime enforces a ceiling on how many flags exist; the audit is what catches an over-grown surface, and it only catches what someone runs it against.

**Cross-reference**: See `tooling-and-scripts/template-compliance-contract-enforcement.md` for the 3-layer template compliance architecture (agent contracts + post-write validation + runtime schema enforcement).

---

## 3. SOURCE FILES

- `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md` - Canonical env-var reference; documents `SPECKIT_COMPILED_ROUTING` and `SPECKIT_COMPILED_ROUTING_DEBUG` alongside every other governed flag.
- `.env.example` - The operator-facing copy of the same surface; a flag documented in one and missing from the other is drift.
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` - Runtime tri-state flag parser and the manifest serving-authority gate.
- `.opencode/skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts` - Advisor-side single-sourced tri-state parser, `COMPILED_ROUTING_HUBS` eligibility set, and `DEFAULT_ON_HUBS` cohort.
- `.opencode/bin/compiled-route-status.cjs` - Per-hub serving-status probe emitting the drift-vs-break `causeCode` contract.
- `.opencode/bin/compiled-route.cjs` - The public front door callers use to resolve a hub's route; delegates to the runtime resolver.
- `.opencode/bin/system-skill-advisor-launcher.cjs` - Child-process env allowlist that forwards `SPECKIT_COMPILED_ROUTING` to the spawned advisor daemon.

---

## 4. SOURCE METADATA
- Group: Governance
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `governance/feature-flag-governance.md`
Related references:
- [advisor-recommend.md](../../../system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md) — the `advisor_recommend` consumption path that reads this same `SPECKIT_COMPILED_ROUTING` flag to attach or omit `compiledRoute`
