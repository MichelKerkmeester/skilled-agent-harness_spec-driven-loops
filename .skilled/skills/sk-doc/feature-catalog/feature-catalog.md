---
title: "sk-doc: Feature Catalog"
description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across fourteen documentation-authoring packets, the default-on compiled-routing fast path that resolves ahead of it, the stage-two leaf route replay with its keep rule, the shared validator's changelog entry check and the advisory goal-criteria lint."
trigger_phrases:
  - "sk-doc feature catalog"
  - "sk-doc hub capabilities"
  - "packet-authored registry routing"
  - "sk-doc compiled routing"
  - "changelog entry frontmatter check"
  - "goal criteria lint"
  - "citation drift census across doc families"
  - "shared frontmatter value warning"
last_updated: "2026-10-04"
version: 2.2.0.12
---

# sk-doc: Feature Catalog

This catalog inventories the live `sk-doc` hub surface. The skill advisor routes any documentation- or component-authoring query to the single identity `sk-doc`; the hub resolves one of fifteen workflow modes — spread across fourteen packets, since one packet backs two modes — whose routing vocabulary is authored at the packet and projected into `mode-registry.json`/`hub-router.json` at runtime. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to. The hub's shared validator also holds every changelog entry to its search metadata. An advisory lint in `sk-create-goal` flags goal criteria a reader cannot check from the line alone.

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

### Leaf Route Replay

#### Description

Replays each parent hub's stage-two keyword block against the committed gold with zero model calls and judges keep, drop or stop against the prose arm.

#### Current Reality

`leaf-route-replay.cjs` in `sk-create-skill` runs each parent hub's `INTENT_SIGNALS` and `RESOURCE_MAP` blocks over the 59-row committed gold, one row per committed scenario that carries a prompt and leaf pairs, and prints per-hub precision, recall, F1 and exact match with zero model calls. sk-code's gold row prints `surface slice not replayed` and stays unscored. `--transcripts <dir>` recounts each hub's router-file reads behind the block as counts and bytes per hub and week, and `--prose <file>` compares the keyword arm with the pairs a prose transcript records under the coverage rule `10*P >= 9*N` and prints `replay verdict: keep`, `drop` or `stop (prose arm covers <P> of <N> rows)`.

#### Source Files

See [`packet-authored-registry-routing/leaf-route-replay.md`](packet-authored-registry-routing/leaf-route-replay.md) for the keyword arm, the gold, the replay rule and source anchors.

---

## 3. COMPILED ROUTING

### Compiled Routing And Legacy Fallback

#### Description

A default-on, flag-gated, additive directive in `sk-doc`'s `SKILL.md` asks the compiled per-hub router contract to resolve the mode before falling through to the packet routing above.

#### Current Reality

The directive is on by default for `sk-doc`, one of the seven activated hubs: with `SPECKIT_COMPILED_ROUTING` unset, `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<task>"` returns the authoritative decision and the hub follows it directly. Setting `SPECKIT_COMPILED_ROUTING=0` is the explicit kill-switch that forces legacy packet-authored, registry-projected routing; any error or a `{"servingAuthority":"legacy"}` sentinel also leaves routing unchanged.

#### Source Files

See [`compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`](compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) for resolution order, the tri-state flag, and serving-status anchors.

---

## 4. DOCUMENT VALIDATION

### Changelog Entry Frontmatter Check

#### Description

Blocks a changelog entry that lacks the search metadata a spec document carries, so every entry stays findable by component and version.

#### Current Reality

`validate_document.py` types every document under a `changelog/` folder as a changelog and holds each `v{VERSION}.md` and `changelog-*.md` entry to the five-key block that the sk-create-changelog Frontmatter Contract defines.

#### Source Files

See [`document-validation/changelog-entry-frontmatter-check.md`](document-validation/changelog-entry-frontmatter-check.md) for the checks, the type order and source anchors.

### Citation Drift Scan

#### Description

Reports the dead file-and-line citations in the tracked skill docs, where the target is gone or the cited line sits past its end, so an author can repair the citation before a reader follows it.

#### Current Reality

`cite-drift-scan.mjs` in `sk-doc`'s shared scripts counts the file-and-line citations in the prose of every tracked skill doc at `HEAD`, resolves each against the tracked files and prints one `cite dead: <doc>:<line> -> <target>:<line>` line per dead citation, where the target is missing on disk or the cited line sits past its end. The default run makes zero model calls and writes no file. `--jev` runs one backend and needs `--out <dir>` so every call is recorded. Doc validation also runs it as a non-blocking advisory: `validate_document.py` ends its human report with `cite-drift advisory:` lines for the validated document's citations when a Jev credential is stored, never changes its exit code, and skips the check when `SKDOC_CITE_DRIFT_CHECK=0`.

#### Source Files

See [`document-validation/citation-drift-scan.md`](document-validation/citation-drift-scan.md) for the resolution order, the label sample and source anchors.

### Citation Drift Census Across Doc Families

#### Description

Extends the citation drift scan to the spec docs as well as the skill docs, with per-family counts, moved citations resolved through a git-derived redirect table and file-name-only matches kept out of the in-range count.

#### Current Reality

`cite-drift-scan.mjs --corpus skills|specs|all` defaults to `skills`, skips any `z_archive` path and groups the spec docs by track, prints one `family` line per family and a totals line ending `corpus=<corpus> commit=<sha12>`, and adds the `moved_in_range`, `moved_past_end` and `basename_only` classes. The redirect table `cite-drift-redirects.json` keeps a directory-prefix rule only when at least 50 git rename records stand behind it with 95% agreement. `--moved` adds one `cite moved:` line per moved citation with its new path; without it the output is unchanged. The default run makes zero model calls, reads no credential and writes no file.

#### Source Files

See [`document-validation/citation-drift-census-across-doc-families.md`](document-validation/citation-drift-census-across-doc-families.md) for the corpus choice, the moved classes, the redirect table and source anchors.

### Shared Frontmatter Value Warning

#### Description

Warns, never blocks, when a document's contextType or importance_tier is outside the shared value list that system-spec-kit owns, so skill docs and spec docs are judged by the same list.

#### Current Reality

`validate_document.py` reads sk-create-frontmatter's `assets/frontmatter-values.json` and adds a `frontmatter_value_outside_list` warning, never an error, for a `contextType` or `importance_tier` outside the list, for every document type. Aliases are legal, and a checkout without the list stays silent.

#### Source Files

See [`document-validation/shared-frontmatter-value-warning.md`](document-validation/shared-frontmatter-value-warning.md) for the two keys, the silent cases and source anchors.

Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the leaf route replay of `sk-create-skill`, which ships no catalog of its own. `create-diff` already owns a per-packet child-mode catalog (`sk-create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
