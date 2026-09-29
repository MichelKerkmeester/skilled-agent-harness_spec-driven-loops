---
title: "sk-doc: Feature Catalog"
description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across fourteen documentation-authoring packets, the default-on compiled-routing fast path that resolves ahead of it, the zero-call clarify census, the shared validator's changelog entry check and the advisory goal-criteria lint."
trigger_phrases:
  - "sk-doc feature catalog"
  - "sk-doc hub capabilities"
  - "packet-authored registry routing"
  - "sk-doc compiled routing"
  - "changelog entry frontmatter check"
  - "goal criteria lint"
  - "clarify default measurement"
last_updated: "2026-09-29"
version: 2.2.0.12
---

# sk-doc: Feature Catalog

This catalog inventories the live `sk-doc` hub surface. The skill advisor routes any documentation- or component-authoring query to the single identity `sk-doc`; the hub resolves one of fifteen workflow modes — spread across fourteen packets, since one packet backs two modes — whose routing vocabulary is authored at the packet and projected into `mode-registry.json`/`hub-router.json` at runtime. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to. A zero-call census in `sk-create-skill` counts how often that fast path answers `clarify`. The hub's shared validator also holds every changelog entry to its search metadata. An advisory lint in `sk-create-goal` flags goal criteria a reader cannot check from the line alone.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for the `sk-doc` hub. The hub does not author documentation itself — it resolves which of its fifteen workflow modes (across fourteen packets) a request belongs to and hands off.

---

## 2. PACKET ROUTING

### Packet-Authored, Registry-Projected Routing

#### Description

Each of the hub's fourteen packets owns a single `Keyword triggers:` line as the source of truth for its routing vocabulary. Modes and packets are separately addressable: the `sk-create-skill` packet backs two modes (`sk-create-skill` and `sk-create-skill-parent`), so the fifteen workflow modes span fourteen packets rather than mapping one-to-one. `mode-registry.json` and `hub-router.json` are synchronized runtime projections, not an independently-maintained second source.

#### Current Reality

`workflowMode` spans `sk-create-skill`, `sk-create-skill-parent`, `sk-create-readme`, `sk-create-agent`, `sk-create-command`, `sk-create-feature-catalog`, `sk-create-manual-testing-playbook`, `sk-create-benchmark`, `sk-create-changelog`, `sk-create-diff`, `sk-create-frontmatter`, `sk-create-repo-rule`, `sk-create-with-human-voice`, `sk-create-goal`, and `sk-create-quality-control`. Every packet is `packetKind: "workflow"` — there is no surface axis at this hub.

#### Source Files

See [`packet-authored-registry-routing/packet-authored-registry-routing.md`](packet-authored-registry-routing/packet-authored-registry-routing.md) for the full discriminator and source anchors.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

A default-on, flag-gated, additive directive in `sk-doc`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the packet routing above.

#### Current Reality

The directive is on by default for `sk-doc`, one of the seven activated hubs: with `SPECKIT_COMPILED_ROUTING` unset, `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<task>"` returns the authoritative decision and the hub follows it directly. Setting `SPECKIT_COMPILED_ROUTING=0` is the explicit kill-switch that forces legacy packet-authored, registry-projected routing; any error or a `{"servingAuthority":"legacy"}` sentinel also leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.

### Clarify Default Measurement

#### Description

Counts how often compiled hubs answer clarify with zero model calls and judges a suggested default only past 30 labeled rows.

#### Current Reality

`score-clarify-default.cjs` in `sk-create-skill` replays the committed canary cases, hub playbook scenarios and routing-corpus prompts through each hub's compiled engine, read only, and prints clarify counts per hub and source. It writes unlabeled clarify rows for the operator. `--score` stops below 30 labeled rows, and past that gate `--jev` and `--deem` each earn a verdict against the router's first alternative that serves nothing.

#### Source Files

See [`compiled-routing-and-legacy-fallback/clarify-default-measurement.md`](compiled-routing-and-legacy-fallback/clarify-default-measurement.md) for the census sources, the label gate, the keep rule and source anchors.

---

## 4. DOCUMENT VALIDATION

### Changelog Entry Frontmatter Check

#### Description

Blocks a changelog entry that lacks the search metadata a spec document carries, so every entry stays findable by component and version.

#### Current Reality

`validate_document.py` types every document under a `changelog/` folder as a changelog and holds each `v{VERSION}.md` and `changelog-*.md` entry to the five-key block that the sk-create-changelog Frontmatter Contract defines.

#### Source Files

See [`document-validation/changelog-entry-frontmatter-check.md`](document-validation/changelog-entry-frontmatter-check.md) for the checks, the type order and source anchors.

### Goal Criteria Lint

#### Description

Flags goal completion criteria that a reader cannot check from the line alone, so an author can fix them before the objective carries them.

#### Current Reality

`lint-goal-criteria.cjs` in `sk-create-goal` gives the mode's rules 4 and 5 their first machine check, with no model call and exit 0 on every input. `score-goal-lint.cjs` measures it against operator labels, and `goal-criteria-labels.jsonl` holds 100 drawn lines that wait for those labels.

#### Source Files

See [`document-validation/goal-criteria-lint.md`](document-validation/goal-criteria-lint.md) for the rules, the line classes and source anchors.

Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the goal-criteria lint of `sk-create-goal` and the clarify census of `sk-create-skill`, which ship no catalog of their own. `create-diff` already owns a per-packet child-mode catalog (`sk-create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
