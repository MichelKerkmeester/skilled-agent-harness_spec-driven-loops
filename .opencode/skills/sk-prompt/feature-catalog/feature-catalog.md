---
title: "sk-prompt: Feature Catalog"
description: "Current-state inventory for the sk-prompt hub, covering its registry-driven prompt-packet routing and the opt-in compiled-routing fast path that resolves ahead of it."
trigger_phrases:
  - "sk-prompt feature catalog"
  - "sk-prompt hub capabilities"
  - "prompt packet routing"
  - "sk-prompt compiled routing"
last_updated: "2026-07-21"
version: 1.0.0.0
---

# sk-prompt: Feature Catalog

This catalog inventories the live `sk-prompt` hub surface. The skill advisor routes any prompt-engineering query to the single identity `sk-prompt`; the hub resolves one of two workflow packets (`prompt-improve`, `prompt-models`) declaratively from `mode-registry.json`. An opt-in, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `sk-prompt` hub. The hub does not itself run the DEPTH/CLEAR prompt pipeline or the per-model reference lookup — it resolves which of its two packets a request belongs to.

---

## 2. PROMPT PACKET ROUTING

### Registry-Driven Prompt Packet Routing

#### Description

`mode-registry.json` is the single source of truth for dispatching a request to `prompt-improve` or `prompt-models`, distinguished by `backendKind` rather than a surface/workflow split.

#### Current Reality

Both packets are `packetKind: "workflow"`. `prompt-models` is `workflow` rather than `surface` because its real consuming workflow — `cli-opencode`'s pre-dispatch step — lives outside this hub, so it cannot satisfy the same-hub-consumer requirement of the surface-packet contract.

#### Source Files

See [`prompt-packet-routing/prompt-packet-routing.md`](prompt-packet-routing/prompt-packet-routing.md) for the discriminator and routing rule.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

An opt-in, flag-gated, additive directive in `sk-prompt`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the prompt packet routing above.

#### Current Reality

The directive is off by default: `SPECKIT_COMPILED_ROUTING` is unset in normal operation, so `sk-prompt` continues to route entirely through `mode-registry.json`. When the flag is force-enabled and `sk-prompt`'s promoted activation manifest authorizes compiled serving, `node .opencode/bin/compiled-route.cjs --hub sk-prompt --prompt "<task>"` returns the authoritative decision instead; any error or a `{"servingAuthority":"legacy"}` sentinel leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.
