---
title: "Compiled Routing And Legacy Fallback"
description: "How mcp-tooling conditionally resolves the compiled per-hub router contract and falls back to registry-driven routing when serving is withheld or stale."
trigger_phrases:
  - "compiled routing and legacy fallback"
  - "SPECKIT_COMPILED_ROUTING"
  - "compiled route front door"
  - "mcp-tooling compiled routing"
version: 1.1.0.0
---

# Compiled Routing And Legacy Fallback (compiled-route.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`mcp-tooling` exposes a compiled-route front door, but compiled serving is conditional. The resolver may serve only when the tri-state runtime flag permits it and the promoted activation manifest is fresh and authorizes compiled serving. Otherwise the legacy registry-driven `hub-router.json` and `mode-registry.json` contract remains authoritative.

Adding a packet or changing hub routing does not promote a compiled shadow child automatically. A stale activation manifest is expected drift after source changes, not proof that the legacy router is broken.

---

## 2. HOW IT WORKS

### Resolution Order

Run the status probe before treating a compiled result as evidence:

```bash
node .skilled/bin/compiled-route-status.cjs --hub mcp-tooling
```

Then use the front door:

```bash
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "<task>"
```

A `route` result may be followed directly. A `clarify` or `defer` result requires disambiguation. A legacy sentinel, stale-manifest cause, or resolver error means that the caller must use the registry-driven route and record compiled serving as unavailable for that run.

### Tri-State Flag

`SPECKIT_COMPILED_ROUTING=1` requests compiled resolution but cannot override an invalid or stale activation manifest. `SPECKIT_COMPILED_ROUTING=0`, `false`, or `off` forces legacy routing. Unset behavior is determined by the runtime's activation cohort and manifest; it is not a promise that this hub is currently compiled-serving.

### Current Orca Integration Boundary

The Orca packet is registered in the source hub artifacts and in the generated leaf manifest. This ordinary packet integration does not modify the compiled shadow-child compiler, admission manifest, or runtime activation cohort. Until an independently authorized promotion refreshes those artifacts, a status result such as `legacy` with `stale-manifest` is the honest outcome.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-tooling/SKILL.md` | Shared | Tells callers to use the compiled front door when it is serving. |
| `.skilled/bin/compiled-route.cjs` | Script | Conditional compiled-route CLI front door. |
| `.skilled/bin/compiled-route-status.cjs` | Script | Reports serving authority and cause code. |
| `.skilled/skills/mcp-tooling/mode-registry.json` | Source | Declares the ten source modes, including `mcp-orca-cli`. |
| `.skilled/skills/mcp-tooling/hub-router.json` | Source | Supplies the source routing policy and vocabulary. |

### Validation and tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-tooling/manual-testing-playbook/` | Manual gold | Records source-router outcomes and compiled availability. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Automated gate | Checks the generated leaf manifest and root metadata class. |

---

## 4. SOURCE METADATA

- Group: Compiled Routing And Legacy Fallback
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`
