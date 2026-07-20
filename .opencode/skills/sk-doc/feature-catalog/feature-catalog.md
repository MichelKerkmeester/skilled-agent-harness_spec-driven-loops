---
title: "sk-doc: Feature Catalog"
description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across twelve documentation-authoring packets and the opt-in compiled-routing fast path that resolves ahead of it."
trigger_phrases:
  - "sk-doc feature catalog"
  - "sk-doc hub capabilities"
  - "packet-authored registry routing"
  - "sk-doc compiled routing"
last_updated: "2026-07-21"
version: 1.0.0.0
---

# sk-doc: Feature Catalog

This catalog inventories the live `sk-doc` hub surface. The skill advisor routes any documentation- or component-authoring query to the single identity `sk-doc`; the hub resolves one of twelve packets whose routing vocabulary is authored at the packet and projected into `mode-registry.json`/`hub-router.json` at runtime. An opt-in, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `sk-doc` hub. The hub does not author documentation itself — it resolves which of its twelve nested packets a request belongs to and hands off.

---

## 2. PACKET ROUTING

### Packet-Authored, Registry-Projected Routing

#### Description

Each of the hub's twelve packets owns a single `Keyword triggers:` line as the source of truth for its routing vocabulary; `mode-registry.json` and `hub-router.json` are synchronized runtime projections, not an independently-maintained second source.

#### Current Reality

`workflowMode` spans `create-skill`, `create-skill-parent`, `create-readme`, `create-agent`, `create-command`, `create-feature-catalog`, `create-manual-testing-playbook`, `create-benchmark`, `create-flowchart`, `create-changelog`, `create-diff`, and `create-quality-control`. Every packet is `packetKind: "workflow"` — there is no surface axis at this hub.

#### Source Files

See [`packet-authored-registry-routing/packet-authored-registry-routing.md`](packet-authored-registry-routing/packet-authored-registry-routing.md) for the full discriminator and source anchors.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

An opt-in, flag-gated, additive directive in `sk-doc`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the packet routing above.

#### Current Reality

The directive is off by default: `SPECKIT_COMPILED_ROUTING` is unset in normal operation, so `sk-doc` continues to route entirely through its packet-authored, registry-projected mapping. When the flag is force-enabled and `sk-doc`'s promoted activation manifest authorizes compiled serving, `node .opencode/bin/compiled-route.cjs --hub sk-doc --prompt "<task>"` returns the authoritative decision instead; any error or a `{"servingAuthority":"legacy"}` sentinel leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.

Note: this catalog documents `sk-doc`'s own hub-level routing. `create-diff` already owns a per-packet child-mode catalog (`create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
