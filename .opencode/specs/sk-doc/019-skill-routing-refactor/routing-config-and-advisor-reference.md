---
title: "Skill-Routing Config & Advisor Reference"
description: "The definitive explainer for every JSON artifact (and the one authoritative non-JSON surface config) that drives skill routing in this .opencode framework, plus the system-skill-advisor. States exactly how each feeds routing, which skills carry it, and — per artifact — what is LIVE versus documented-but-aspirational, verified against the live tree and its consumer scripts."
contextType: "reference"
---

# Skill-Routing Config & Advisor Reference

> The authoritative reference for the routing plane in this framework. It maps every routing-related JSON artifact — plus the one authoritative *non*-JSON config, `smart_routing.md` — to **what it is, what it is used for, and exactly how it feeds skill routing (by named consumer)**; then does the same for `system-skill-advisor`. Every "how it integrates" claim below was traced to a real consumer in the code (cited `file:line`), not to prose. **LIVE vs ASPIRATIONAL** is called out per artifact because the two-classifier "router collapse" landed unevenly across the seven parent hubs.
>
> **The seven parent hubs:** `sk-code`, `sk-doc`, `sk-design`, `sk-prompt`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`. Each carries a sibling `hub-router.json` + `mode-registry.json`.

---

## 1. The routing pipeline — how the pieces fit

Skill routing exists to satisfy one North Star: **the right skill + the right files, on demand.** Those are two distinct questions answered by two distinct mechanisms, in sequence:

1. **Which skill?** — answered by the `system-skill-advisor` (Gate 2), which scores the prompt and recommends *which hub/skill* handles it.
2. **Which files, inside that skill?** — answered by the chosen hub's own routers: `hub-router.json` + `mode-registry.json` pick the **mode**, and (on the two hubs that ship one) `smart_routing.md` picks the exact **leaf resources**, which the `leaf-manifest.json` typed-pair contract then converts into stable, comparable identities.

```
 user prompt
     │
     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LAYER 0 — RIGHT SKILL        system-skill-advisor  (CLAUDE.md Gate 2)   │
│  scoreAdvisorPrompt fuses 5 weighted lanes → confidence + uncertainty   │
│  → ranked recommendation of WHICH skill/hub. MUST-invoke when           │
│  confidence ≥ 0.8 AND uncertainty ≤ 0.35.                               │
│  Data: skill-graph.json (12 skills / 7 families) + scorer config.       │
└────────────────────────────────────────────────────────────────────────┘
     │  (routes to ONE hub identity, e.g. sk-code)
     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LAYER 1 — RIGHT MODE         hub-router.json  +  mode-registry.json     │
│  mode-registry.json = declarative source of truth for the hub's modes   │
│  (workflowMode → packet, backendKind, toolSurface envelope).            │
│  hub-router.json = the router POLICY over those modes (weighted keyword  │
│  vocabulary, defaultMode, ambiguityDelta, tieBreak, outcomes).          │
└────────────────────────────────────────────────────────────────────────┘
     │  (selects a workflowMode, e.g. code-webflow)
     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LAYER 2 — RIGHT FILES        smart_routing.md (INTENT_SIGNALS +          │
│                              RESOURCE_MAP + DEFAULT_RESOURCE)            │
│  intent → the exact leaf resource paths for that surface.               │
│  Present at hub level on sk-code + sk-doc ONLY.                          │
└────────────────────────────────────────────────────────────────────────┘
     │  (emits raw leaf paths)
     ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TYPED-PAIR CONTRACT          leaf-manifest.json  (+ leaf-aliases.json)  │
│  each leaf path → canonical (workflowMode, leafResourceId) pair, cross-  │
│  checked against the committed manifest → stable identity for scoring.  │
│  Populated on sk-code + sk-doc ONLY.                                    │
└────────────────────────────────────────────────────────────────────────┘

 ADJACENT PLANE (not skill routing): description.json + graph-metadata.json
 live on spec FOLDERS under .opencode/specs/**, feed Spec-Kit Memory search /
 resume, and help "the right files" only indirectly (rank the right PACKET).
```

**The collapse in one sentence.** For the two hubs that ship a hub-level surface router (`sk-code`, `sk-doc`), Layer 2 became authoritative for *resource* selection and Layer 1's `hub-router.json` mode selection was **demoted to telemetry** — still computed, but consumed only as an observational object, never as the resource result. For the other five hubs (no surface router), `hub-router.json` is still the operative resource-emitting router, but only at **packet granularity** (it emits mode-packet `SKILL.md` pointers, not per-leaf gold).

**Two orthogonal planes.** The advisor (Layer 0), the hub/surface routers (Layers 1–2), and the typed-pair contract are the **skill-routing** plane (lives under `.opencode/skills/**`). `description.json` + `graph-metadata.json` are a **separate spec-folder / memory-retrieval** plane (lives under `.opencode/specs/**`); they touch "the right files" only indirectly, by ranking the right *packet* in `memory_search`. Neither generator references any routing symbol.

**Where the "how it integrates" claims are grounded.** The deterministic replay of Layers 1–2 lives in the skill-benchmark under `system-deep-loop/deep-improvement/scripts/skill-benchmark/`; the typed-pair contract library and its generator/gate live under `sk-doc/create-skill/scripts/`. The consumer-script index is in §7.

---

## 2. Per-artifact reference

### 2.1 `hub-router.json` — hub-layer mode router (Layer 1)

- **What it is.** A per-parent-hub JSON that declares the **hub-layer router policy**: which `workflowMode` a request selects, the weighted keyword vocabulary that scores each mode, and the tie-break / default / outcome policy. It is a machine-readable projection of the hub's mode-selection logic, decoupled from the prose `SKILL.md`.
- **Key fields.**
  - `skill` / `version` — hub identity + content version (e.g. `sk-code` `4.1.0.0`).
  - `routerPolicy.defaultMode` — mode when nothing scores. `null` on `sk-code` and `sk-doc` (= defer/disambiguate); a named mode on the other five (`sk-design`→`interface`, `sk-prompt`→`prompt-improve`, `mcp-tooling`→`mcp-chrome-devtools`, `system-deep-loop`→`research`, `cli-external-orchestration`→`cli-opencode`). *(Verified per file.)*
  - `routerPolicy.ambiguityDelta` — always `1`; mirrors `AMBIGUITY_DELTA` in `router-replay.cjs:33`, the window that keeps near-tied modes.
  - `routerPolicy.tieBreak` — ordered mode enumeration breaking exact ties.
  - `routerPolicy.outcomes` — named route shapes. All seven carry `single` / `orderedBundle` / `defer`; **only `sk-code` adds `surfaceBundle`** (one workflow mode + zero-or-more read-only surface packets). *(Verified: `hasSurfaceBundle` true only for sk-code.)*
  - `routerPolicy.defaultResource` — always-loaded preamble path(s) seeded into every route.
  - `routerPolicy.bundleRules` — optional `whenAll → outcome` rules. **Populated on `sk-doc` (`create-then-quality`) and `sk-design` (`ui-build-bundle`); present-but-empty `[]` on `sk-prompt`; absent on the other four.** Declared but **consumed by no router**, including `router-replay.cjs`. *(Verified per file.)*
  - `routerSignals[mode]` — per-mode `{weight, classes[], resources[]}`; `classes` name shared keyword bags.
  - `vocabularyClasses[name].keywords` — the shared keyword bags the signals reference (aliases + hub-identity + runtime terms) — the substrings actually scored against the lowercased task.
- **Exactly how it feeds routing.** `router-replay.cjs::projectHubRouter()` (`router-replay.cjs:112-146`) flattens each `routerSignals[mode]` into `intentSignals[mode]={weight,keywords}` (unioning every referenced `vocabularyClasses[class].keywords`) and `resourceMap[mode]=resources`. In `parseRouter()` (`router-replay.cjs:373-409`) this projection is the **last fallback** — inline `SKILL.md` `INTENT_SIGNALS`/`RESOURCE_MAP` win first, then a referenced router doc, then `hub-router.json` (`routerSource='hub-router.json'`). Then in `routeSkillResources()` (`router-replay.cjs:611-671`): the hub-router's scored modes are handed to `buildHubRouteTelemetry()` (`router-replay.cjs:297-339`), and **if a surface router also exists** (`loadSurfaceRouter()` → `shared/references/smart_routing.md`), the resource result is *replaced* by a second replay against that surface router — so the hub's own selection survives only as `routeTelemetry` (observed modes, `matchedAliases`, `backendKind`, `packet`, `deferReason`; never fed back into scoring). When no surface router exists, `assembleResources()` uses the hub-router's own `resourceMap` (packet pointers) as the real result. The raw file is also read by `d5-connectivity.cjs` and `parent-hub-vocab-sync.cjs` as conformance-gate input.
- **Which skills carry it.** All **7** parent hubs.
- **Generated / kept in sync.** Hand-authored from the `create-skill` template (`assets/parent_skill/parent_skill_hub_router_template.json`); not machine-regenerated. Drift against `mode-registry.json` + `SKILL.md` is caught by the `parent-hub-vocab-sync` and `d5-connectivity` checks (a missing `hub-router.json` while `mode-registry.json` is present is a **P0**), not by a generator.
- **LIVE vs ASPIRATIONAL.** LIVE for all 7 as the projected mode-router fallback and as vocab/connectivity-gate input. Demotion-to-telemetry is real but **partial — only `sk-code` + `sk-doc`** (the surface-router hubs). `surfaceBundle` exists only in `sk-code`'s policy; `bundleRules` are declared but unconsumed everywhere.

### 2.2 `mode-registry.json` — declarative mode/packet registry (Layer 1)

- **What it is.** The per-hub **single source of truth** for a hub's child modes/packets. Each hub `SKILL.md` is a thin router holding no per-packet logic; this registry enumerates the `modes[]` the hub can resolve to, each with its discriminator, tool-permission envelope, packet folder, and advisor-routing projection.
- **Key fields.**
  - `skill` / `version` / `description` — hub identity + registry semver + prose axis contract.
  - `resourceContractVersion` (top-level) — numeric opt-in that activates the leaf-manifest byte-drift + typed-pair guards for that hub. **Declared only on `sk-doc` (`= 1`); absent on the other six.** *(Verified across all 7 files.)*
  - `discriminator` — prose definitions of the three per-mode keys: `workflowMode` (stable public key), `packetKind` (`workflow` | `surface` | `transport`), `backendKind` (which backend runs the mode).
  - `modes[].workflowMode` — public/stable mode key used by the router, the registry index, and leaf-manifest keying.
  - `modes[].packetKind` — axis discriminator; `surface` (read-only evidence bundled alongside a workflow mode) is `sk-code`-only; `transport` is `sk-design`/`mcp-tooling`.
  - `modes[].backendKind` — backend tag (e.g. `surface-router`, `review-cache`, `evidence-base` on sk-code; `template-scaffold`, `create-quality-control` on sk-doc; `cli-dispatch` on cli-external).
  - `modes[].toolSurface` — permission envelope: `allowed[]`, `forbidden[]`, `mutatesWorkspace`, `bashAllowlist[]`. Surface/evidence packets are read-only.
  - `modes[].packet` + `packetSkillName` — child folder + that packet's `SKILL.md` name. **N-to-1 fan-out is real**: two modes can share one packet folder (`sk-doc`'s `create-skill` + `create-skill-parent` both → `create-skill`; `system-deep-loop`'s `model-benchmark`/`skill-benchmark`/`agent-improvement` all → `deep-improvement`).
  - `modes[].aliases` — keyword/phrase vocabulary per mode. Post-collapse this feeds hub-route **telemetry + vocab-sync guards**, not authoritative routing.
  - `modes[].advisorRouting` — `{routingClass, packetSkillName}`. `routingClass` is `metadata` (hub-membership) for every mode on six hubs; the `lexical`/`alias-fold`/`command-bridge` variants exist **only in `system-deep-loop`**.
  - `modes[].command` — bound slash command or `null` (`cli-external-orchestration` modes are all `null`).
- **Exactly how it feeds routing.** The advisor routes ONE hub identity; the hub then reads this registry to resolve `workflowMode` → backend + tool envelope + packet path. Named consumers: `router-replay.cjs::buildRegistryIndex()` (`router-replay.cjs:158-167`) indexes modes for telemetry (`buildHubRouteTelemetry` reads `backendKind`/`packet`); `generate-leaf-manifest.cjs` walks `modes[].packet/{references,assets}` to build the manifest; `parent-skill-check.cjs` (doctor) validates the registry and, for opt-in hubs, runs the leaf-manifest byte-drift + mode↔manifest reachability guards; the `command-binding-existence.vitest.ts` gate resolves every `command` field to a real command file.
- **Mode counts (verified).** `sk-code` 4, `sk-design` 6, `mcp-tooling` 6, `sk-prompt` 2, `cli-external-orchestration` 3, `system-deep-loop` 7, `sk-doc` 12.
- **Which skills carry it.** All **7** parent hubs.
- **Generated / kept in sync.** Hand-authored (it *is* the source of truth). Downstream artifacts are generated *from* it. Sync is enforced, not auto-regenerated: `parent-skill-check.cjs` byte-drift + reachability guards, `routing-registry-drift-guard.vitest.ts`, and `parent-hub-vocab-sync.cjs`.
- **LIVE vs ASPIRATIONAL.** Fully LIVE on all 7. The gotcha: `modes[].aliases` *look* like routing input but are no longer authoritative post-collapse (they feed telemetry + guards only) — editing them expecting routing changes is a trap. The typed-pair guards `resourceContractVersion` activates are LIVE but **single-hub** (`sk-doc`).

### 2.3 `leaf-manifest.json` + `leaf-aliases.json` — typed-pair leaf-resource contract

- **What it is.** `leaf-manifest.json` is a per-hub, **generated, byte-canonical** inventory of every SURFACE-layer leaf resource a hub owns, keyed by the typed pair `(workflowMode, leafResourceId)` — turning flat resource strings into stable, comparable typed identities. `leaf-aliases.json` is an optional companion that binds a hub's `shared/`-tier files (which live outside any packet root) onto a declared `(workflowMode, leafResourceId)` + `diskPath`, so they too carry a typed identity.
- **Key structure.** `{ resourceContractVersion, modes: [ { workflowMode, packet, leaves: [packet-relative paths under references/ or assets/] } ] }`. **Uniqueness is enforced on the composite PAIR, not on `leafResourceId` alone** — `references/README.md` legitimately repeats across packets. One entry **per declared mode, not per packet dir**, so fan-out twins each keep a full independent leaf set (`sk-doc`'s `create-skill` and `create-skill-parent` both enumerate the `create-skill` packet).
- **Exactly how it feeds routing.** It is the **conversion boundary and oracle backbone** for Layer-2 scoring. Three consumers, all under the surface layer:
  1. `router-replay.cjs::buildResourceContract()` (`router-replay.cjs:217-244`) dual-reads each raw router-selected string (`contract.dualReadLegacyResource`: already-canonical → packet-qualified → declared shared alias), cross-checks it against the committed manifest, and dedupes on `compositeKey`. It **returns `null` (pure no-op) for any hub lacking a manifest** — the byte-for-byte no-regression guarantee for the other five hubs. `FULL_INVENTORY` routes instead call `buildFullInventoryContract()` (`router-replay.cjs:259-276`), enumerating the whole manifest by mode.
  2. `load-playbook-scenarios.cjs::deriveTypedGoldFromBodyGold()` (`load-playbook-scenarios.cjs:453`) + `loadManifestModeLeaves()` (`:437`) derive typed gold by splitting the leading packet segment of body-gold "Expected references loaded", filtered to the manifest's registered leaves. No manifest → returns `null`, scenarios stay untyped.
  3. `validate-playbook-topology.cjs` is the pre-dispatch typed-gold gate: `loadManifestLeaves()` reads the manifest and `validateManifestResolution()` (`:187-201`) **blocks any typed pair not present in the manifest** (missing alias/target). A blocked fixture is **excluded from denominators**, never scored as zero recall.
  Also enforced by `/doctor parent-skill-check.cjs` guards `10a`–`10d` (opt-in per hub; only a committed manifest activates them: `10a` source well-formed, `10b` byte-drift vs fresh regen, `10d` registry↔manifest reachability).
- **Which skills carry it.** **Only 2 hubs.** `sk-doc/leaf-manifest.json` (12 mode entries; `resourceContractVersion` 1) + `sk-doc/leaf-aliases.json` (6 shared/ entries: 1 for `create-changelog`, 5 for `create-quality-control`). `sk-code/leaf-manifest.json` (4 mode entries: `code-opencode`, `code-review`, `code-webflow`, `quality`; `resourceContractVersion` 1 via the generator's fallback — `sk-code`'s registry does NOT declare one). `sk-code` ships **no** `leaf-aliases.json`. *(All verified on disk.)*
- **Generated / kept in sync.** `sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --write <hub>` reads `mode-registry.json` (+ `leaf-aliases.json` when present), walks each declared mode's `references/`+`assets/` via `walkLeafFiles()`, checks `findDuplicateComposites`, then `buildManifest()` + `canonicalManifestBytes()` (recursively sorted keys, 2-space indent, single trailing newline) emit byte-stable output. `--check` recomputes and fails on any byte drift (`generate-leaf-manifest.cjs:143-162`). The pure logic lives in `create-skill/scripts/lib/leaf-resource-contract.cjs`. An absent `leaf-aliases.json` = zero aliases (still clean); a present-but-malformed one is a hard `ContractError`.
- **LIVE vs ASPIRATIONAL.** The library, generator, topology gate, and `10a`–`10d` guard chain are all LIVE and shared. But the contract is **populated for only 2 of 7 hubs**, so typed-pair routing accuracy can be *measured* only for those two — dormant fleet-wide until a hub generates a manifest. **Stale-comment watch:** `router-replay.cjs:169-172` and `load-playbook-scenarios.cjs` (~line 428) still say "Only sk-doc ships a leaf-manifest.json today" — behavior is correct and data-driven via `hasLeafManifest()`; only the prose lags now that `sk-code` also ships one.

### 2.4 `smart_routing.md` — `INTENT_SIGNALS` / `RESOURCE_MAP` / `DEFAULT_RESOURCE` (the surface router, Layer 2)

- **What it is.** The authoritative **second-layer** routing config: a fenced ```python block inside a hub's `shared/references/smart_routing.md` holding three literals — `DEFAULT_RESOURCE` (always-loaded preamble), `INTENT_SIGNALS` (intent → `{weight, keywords}`), and `RESOURCE_MAP` (intent → `[leaf paths]`). Embedded in Markdown, but it is the **byte-for-byte source** the deterministic router parses. It is included here — the one non-JSON artifact in the set — because it is *the* authoritative surface-routing config the program optimizes.
- **Key fields.**
  - `DEFAULT_RESOURCE` / `DEFAULT_RESOURCES` — single quoted path or a list; seeded into every route. `parseDefaultResource()` (`router-replay.cjs:103-110`) reads either form; returns `[]` when absent.
  - `INTENT_SIGNALS` — dict of `UPPERCASE_SNAKE` intent → `{"weight": N, "keywords": [...]}`. Intent keys are hub-specific (`IMPLEMENTATION`/`DEBUGGING`/`MOTION_DEV` on sk-code; `DOC_QUALITY`/`SKILL_CREATION`/`FULL_INVENTORY` + ~11 more on sk-doc). Keywords substring-match the lowercased task, except a `WORD_BOUNDARY_KEYWORDS` set (`review`, `lcp`, `inp`, `cls`; `router-replay.cjs:419`) that matches on `\b` boundaries so `preview`/`input` don't false-fire.
  - `weight` — per-intent score increment per matching keyword. `sk-code` uses uniform weight `1`; `sk-doc` uses `4` across all intents. *(Verified in the fenced blocks.)*
  - `RESOURCE_MAP` — dict of intent → `[leaf path strings]`. `sk-code` paths are surface-prefixed (`code-webflow/…`, `code-opencode/…`, `references/universal/…`); `sk-doc` paths are packet-qualified (`<packet>/references|assets/…`) or shared-alias disk paths (`shared/…`).
  - `FULL_INVENTORY` (`sk-doc` only) — the single explicit full-toolkit intent; when selected, the typed contract is built from the whole manifest rather than the routed subset.
- **Exactly how it feeds routing.** Consumed by `router-replay.cjs`. For a hub whose router resolved to `hub-router.json`, `routeSkillResources()` calls `loadSurfaceRouter()` (`router-replay.cjs:524-540`) which probes `shared/references/smart_routing.md` then `references/smart_routing.md` and parses the same three dicts — **the hub picks the mode (telemetry), the surface router supplies the resource gold.** `parseIntentSignals()`/`parseResourceMap()` (`:71-97`) extract the dicts by regex over quoted strings; `scoreIntents()` (`:435`) sums weight per `keywordHits()`, `selectIntents()` (`:455`) keeps intents within `AMBIGUITY_DELTA=1` of the top, and `assembleResources()` (`:563-600`) unions `DEFAULT_RESOURCE` + `RESOURCE_MAP[intent]`, then for `sk-code` applies surface slicing (`detectSurface` + `detectOpencodeLanguages`; drops the non-detected surface + all `/assets/`). A leaf path becomes a typed pair only when the hub ships a manifest (§2.3).
- **Which skills carry it (hub level).** **Only `sk-code` + `sk-doc`.** Many other `SKILL.md` files carry an **inline** per-mode `INTENT_SIGNALS`/`DEFAULT_RESOURCE` dict (mcp-tooling's mode children, sk-design mode children, system-deep-loop children) — those are per-mode routers without the surface `RESOURCE_MAP`→leaf contract. Two authored shapes exist: **index-table** (`sk-code` — human prose tables §2/§4-6 above a single §11 "MACHINE-READABLE ROUTER" fenced projection, explicitly documented as lossy) vs **leaner per-intent-leaf-set** (`sk-doc` — short header then the fenced dict with the `FULL_INVENTORY` intent).
- **Generated / kept in sync.** Hand-authored. `sk-code` has a drift-guard vitest (`skill-benchmark/tests/sk-code-router-sync.vitest.ts`) that fails if a mapped path is missing on disk or a routable doc is uncovered; the manifest side is guarded by `generate-leaf-manifest --check`.
- **LIVE vs ASPIRATIONAL.** Both surface routers are LIVE — real, parseable, replayed today. **Authoring caveat (verified in sk-code's map):** several `RESOURCE_MAP` arrays are missing comma separators between consecutive quoted paths; the `quotedStrings()` regex tolerance means the replay still extracts them, but the source is fragile.

### 2.5 `command-metadata.json` (+ the `*registry*.json` family)

- **What it is.** A hand-authored, **advisor-facing per-command projection array** — one record per slash command a hub owns, carrying the command's owner mode, keyword projection, argument grammar, task-verb ownership, and choreography. On disk it exists in **exactly one place**: `sk-design/command-metadata.json` (5 records, one per `/design:*` command). *(Verified: 5 records, all `descriptionRole: "hub-keyword-projection"` + `autoTriggerEligible: false`.)*
- **Key fields (26 per record, verified).** `command` / `ownerMode` (binds the command to a mode-registry entry); `descriptionRole: "hub-keyword-projection"` + `autoTriggerEligible: false` (encodes the collapse — commands *project* keywords into the demoted hub keyword pass, they do not themselves fire routing); `hubKeywordProjection`; `taskProjections` (per-verb ownership: which mode owns the same transform verb under an explicit slash command — a separate path from mode-registry's free-text framing); `argumentGrammar`/`argumentHint` (drift-checked against the command file frontmatter); `choreography` (ordered load sequence); `discriminator`/`deferToHubWhen`; plus `userIntent`/`accepts`/`returns`/`examples`/`preconditions`/`registerPolicy`/`toolPolicy`/`outputContract`/`pipeline`/`handoff`/`next`/`proofFields`/`copyGuard`/`aliases`.
- **Exactly how it feeds routing.** Three consumers: (1) `command-binding-existence.vitest.ts` (`system-skill-advisor/mcp_server/tests`) walks every hub's mode-registry `command` fields **and any hub-level `command-metadata.json`** and asserts each command id resolves to a real file under `.opencode/commands/**` (making bindings real, not honor-system); it explicitly **excludes the advisor scorer's own dead command ids** (`/deep:start-*-loop`, in an operator-gated re-baseline track) and allowlists `create-quality-control`'s `/doc:quality` while `.opencode/commands/doc/` is unbuilt. (2) `sk-design/shared/scripts/design-command-surface-check.mjs` enforces a `REQUIRED_FIELDS` schema (**26 fields**) per record and detects frontmatter/field drift between the metadata and the command files. (3) `skill-benchmark` loads it to score the command surface. **`router-replay.cjs` D1–D5 does NOT read it** — the leaf router inputs are `smart_routing.md` + `leaf-manifest.json`; command-metadata is an adjacent command-surface projection.
- **Which skills carry it.** **`sk-design` ONLY** (1 file, 5 records) — a single-hub pilot.
- **Generated / kept in sync.** Hand-authored; kept honest by `design-command-surface-check.mjs` + the two vitest suites (not a generator).
- **LIVE vs ASPIRATIONAL.** LIVE + enforced for `sk-design`. **ASPIRATIONAL as a fleet pattern** — the binding gate is written to scan *every* hub's `command-metadata.json`, but only `sk-design` supplies one, so for all other hubs the check degrades to mode-registry `command` fields alone. **Do not conflate** the many `findings-registry.json` (deep-review artifacts) or `scripts-registry.json` (a scripts index) with routing — neither participates. **No `parent_skill_registry.json` exists** as a live file; the phrase appears only in research docs.

### 2.6 `description.json` + `graph-metadata.json` — spec-folder / memory metadata (ADJACENT plane)

- **What it is.** A two-file pair every tracked spec folder under `.opencode/specs/**` carries. `description.json` is a lightweight identity/keyword card; `graph-metadata.json` is a richer node record with parent/child edges, a derived lifecycle status, resume pointers, and source-document fingerprints. Together they make a spec folder visible and traversable to **Spec-Kit Memory** — memory/continuity metadata for spec *packets*, **not** skill-routing config.
- **Key fields.**
  - `description.json`: `specFolder` (repo-relative path) / `specId` (numeric prefix) / `folderSlug` / `parentChain` (identity); `description` (≤150-char synopsis) / `keywords` (from `extractKeywords()`) / `level` (the primary lexical surface `memory_search` matches); `memorySequence` / `memoryNameHistory` / `lastUpdated` (continuity bookkeeping).
  - `graph-metadata.json`: `packet_id` / `spec_folder` / `parent_id` / `children_ids` (graph edges + phase-parent structure); `manual{depends_on,supersedes,related_to}` (hand-authored, preserved across refreshes); `derived.status` (`planned`/`in_progress`/`complete`/`blocked`, inferred from docs — drives resume + the completion gate); `derived.last_active_child_id`/`last_active_at` (phase-parent resume pointer); `derived.trigger_phrases`/`key_topics`/`key_files`/`causal_summary`/`importance_tier` (the searchable/semantic payload memory ranking consumes); `derived.source_fingerprint`/`source_doc_hashes` (sha256 of canonical docs — power drift detection + the completion-freshness gate); `derived.save_lineage`/`schema_version`.
- **Exactly how it feeds routing — INDIRECT, and easily overstated.** These feed the **Spec-Kit Memory** retrieval layer (`memory_search` over spec docs, graph traversal, resume) — **not** the skill advisor's hub/surface routing. Keywords/description + `derived.trigger_phrases`/`key_topics`/`causal_summary` are the lexical+semantic surface `memory_search` ranks, so the right *packet* surfaces during research/resume; `children_ids`/`last_active_child_id` land resume on the right phase child. Consumers are the MCP memory/graph/resume libs and the `generate-context.js` save path — **never** `skill_advisor.py`, `smart_routing.md`, or `router-replay.cjs`. Skill routing runs on an entirely separate metadata plane.
- **Which skills carry it.** **Not a skill artifact** — it lives on spec *folders* (`.opencode/specs/**`), not skills. Every Level-1+ folder and phase parent carries both. Skill directories (`.opencode/skills/**`) carry routing metadata instead.
- **Generated / kept in sync.** `description.json` by `system-spec-kit/scripts/spec-folder/generate-description.ts` (also written by the `generate-context.js` save path); `graph-metadata.json` by `system-spec-kit/scripts/graph/backfill-graph-metadata.ts` (default = one scoped packet; `--all` = repo-wide; gated `--prune`). `manual.*` blocks are hand-authored and preserved; the deriver only writes `derived.*`. `checkGeneratedMetadataDrift` reports (read-only) when synopsis fields drift; the completion-freshness gate blocks `--strict` completion on stale fingerprints.
- **LIVE vs ASPIRATIONAL.** LIVE and **unaffected by the router collapse** — neither generator references `smart_routing`, `INTENT_SIGNALS`, `RESOURCE_MAP`, `leaf-manifest.json`, or `router-replay`. *(Practical note: editing a doc's frontmatter changes its fingerprints, so these must be regenerated or strict validation flags `GENERATED_METADATA_INTEGRITY`. Real on-disk drift exists — e.g. a renumbered folder whose identity fields were not re-derived — a known staleness class, not a routing concern.)*

---

## 3. `system-skill-advisor` — the "right skill" engine (Layer 0)

- **What it is.** The **Gate-2 skill-routing engine** — a standalone MCP package (`mk_skill_advisor`, ADR-001 "Standalone Advisor MCP With Legacy Tool Bridge") that scores a user prompt across five weighted lanes, emits a **confidence + uncertainty** pair, and recommends **which skill** should handle the request. It is the *right-skill* half of routing; the `sk-code`/`sk-doc` `smart_routing` surface routers are the separate *right-files* half. It recommends the target skill but never absorbs that skill's implementation rules.
- **How it works — two stages.**
  1. **Right skill.** `advisor_recommend` runs `scoreAdvisorPrompt`, fuses the 5 lanes, and produces confidence + uncertainty + ranked recommendations with prompt-safe `laneContributions` (structured labels `token:`/`hint:`/`phrase:`/`edge:` + numeric contributions — never raw prompt substrings).
  2. **Gate-2 consumption.** Primary = the **Skill Advisor Hook** brief auto-injected at prompt time (`system-skill-advisor/hooks/claude/user-prompt-submit.ts`, with `hooks/lib/skill-advisor-cli-fallback.ts` and the OpenCode plugin bridge `mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`); Fallback = `python3 mcp_server/scripts/skill_advisor.py` or the daemon CLI `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{...}' --warm-only`. Hooks render `Advisor:` **only when a route passes 0.8/0.35**, and fail open with `{}` on error. Gate rule: **confidence ≥ 0.8 AND uncertainty ≤ 0.35 → must-invoke.**
- **The 5 scorer lanes + live weights** (`mcp_server/lib/scorer/lane-registry.ts:8-13`, all `live:true`, sum 1.0): `explicit_author` 0.42, `lexical` 0.28, `graph_causal` 0.13, `derived_generated` 0.12, `semantic_shadow` 0.05. A BM25 lexical shadow lane is registered `live:false`, env-gated behind `SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW` (shadow weight 0.10) — not in live ranking.
- **Confidence + uncertainty constants** (`mcp_server/lib/scorer/scoring-constants.ts`, verified): `baseConstant` 0.52, `liveNormalizedRampCoefficient` 0.43, `taskIntentFloor`/`directScoreFloor`/`readOnlyRouteAllowedFloor` 0.82, `derivedDominantConfidence` pin 0.72, `hardCeiling` 0.95; uncertainty is evidence-count driven (`noEvidenceDefault` 0.42; evidence counts high 5 / medium 3 / some 1; `directEvidenceDiscount` 0.06 at directScore ≥ 0.75; low-confidence penalty when confidence < 0.8).
- **The 9 MCP tools (stable ids, frozen by ADR-001).** 4 advisor — `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`; 5 skill_graph — `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, `skill_graph_propagate_enhances`. *(All 9 verified in `tools/index.ts` + `tools/skill-graph-tools.ts`.)*
- **Data artifact — `skill-graph.json`** (`mcp_server/scripts/skill-graph.json`): `schema_version` 1, `skill_count` **12** across **7 families** (`generated_at` 2026-07-16). It feeds the `graph_causal` lane (edge multipliers: `enhances` 0.55, `siblings`/`depends_on` 0.35, `prerequisite_for` 0.30, `conflicts_with` −0.35; BFS maxDepth 2). The 12 routable skills are **not** just the 7 hubs — they include `mcp-code-mode`, `sk-git`, `system-code-graph`, `system-spec-kit`, and `system-skill-advisor` itself. The SQLite copy (`database/skill-graph.sqlite`) is the live runtime, gitignored.
- **Exactly how it integrates with the rest.** The advisor recommends **into a hub** (`sk-code`, `sk-doc`, …); that hub's Layer-1/2 routers then pick the mode + files. Advisor = which skill; surface router = which files — the advisor never touches `smart_routing.md` or the leaf-manifest. (Note: the advisor's *own* `SKILL.md` §2 is an intent-domain surface router too, but only to load its self-maintenance docs — not the runtime scorer.)
- **Generated / kept in sync.** Hand-authored TS scorer (`mcp_server/lib/scorer/**`) compiled to `dist/`. `skill-graph.json` is regenerated by `skill_graph_scan`/`advisor_rebuild` from `SKILL.md` frontmatter. The `.cjs` CLI shim runs `checkPackageFreshness` and refuses stale dist (**exit 69**, or **75 under `--warm-only`** = retryable). Trust fails closed: the CLI sends `callerAuthority:untrusted` unless `--trusted`/`MK_SKILL_ADVISOR_CLI_TRUSTED=1`; mutations are trust-gated and must never run from prompt-time hooks.
- **LIVE vs ASPIRATIONAL.** LIVE: 9 stable MCP tools; 5-lane scorer (all lanes live, weights sum 1.0); the 0.8/0.35 dual-threshold; hooks + Python shim + daemon CLI wired; `skill-graph.json` current (12 skills). `semantic_shadow` is now LIVE at 0.05 (previously shadow-only). ASPIRATIONAL/inert: `SPECKIT_ADVISOR_SHADOW_MODE` has no runtime reader; the BM25 shadow lane is `live:false`; making the daemon CLI the sole transport is a floated direction, not committed (MCP is primary in-session today). **Fail-open behavior is load-bearing:** an absent/stale graph makes `advisor_recommend` return empty recommendations rather than erroring — so a broken index silently disables routing. **Worktree caveat:** in this worktree the launcher lease showed a failed `npm run build`, so the CLI/daemon freshness gate would currently fail (exit 69) until `mcp_server` is rebuilt — treat live scoring here as not-yet-runnable without that rebuild.

---

## 4. Coverage matrix — who carries what, today

| Artifact | Plane / layer | Carriers | Live? |
|---|---|---|---|
| `hub-router.json` | Layer 1 (mode policy) | all 7 hubs | LIVE; demoted→telemetry only on sk-code, sk-doc |
| `mode-registry.json` | Layer 1 (mode registry) | all 7 hubs | LIVE fleet-wide |
| `smart_routing.md` surface router | Layer 2 (files) | **sk-code, sk-doc** only | LIVE (others inline per-mode or none) |
| `leaf-manifest.json` | typed-pair contract | **sk-code, sk-doc** only | LIVE machinery; populated 2/7 |
| `leaf-aliases.json` | typed-pair (shared tier) | **sk-doc** only (6 entries) | LIVE; single-hub |
| `resourceContractVersion` (in registry) | opt-in guard switch | **sk-doc** only (`=1`) | LIVE; single-hub |
| `command-metadata.json` | command surface | **sk-design** only (5 records) | LIVE for sk-design; not generalized |
| `description.json` + `graph-metadata.json` | memory/spec metadata (adjacent) | every spec folder (not skills) | LIVE; separate plane |
| `system-skill-advisor` (`skill-graph.json` + scorer) | Layer 0 (skill) | subsystem-wide (12 skills) | LIVE |
| `bundleRules` (in hub-router) | declared route-shape rules | sk-doc, sk-design (populated); sk-prompt (empty) | **declared, consumed by nothing** |
| `surfaceBundle` (outcome) | declared route shape | sk-code only | declared; not consumed by replay |

---

## 5. LIVE vs ASPIRATIONAL — the short version (the most important part)

- **Fully live, fleet-wide (all 7 hubs):** `hub-router.json` + `mode-registry.json`; plus the `system-skill-advisor` Gate-2 engine (subsystem-wide) and `description.json`/`graph-metadata.json` (all spec folders, adjacent plane).
- **Live but only 2 of 7 hubs:** the `smart_routing.md` surface router and the `leaf-manifest.json` typed-pair contract — **`sk-code` + `sk-doc`.** This is the exact gap the per-skill routing research targets.
- **Live but single-hub:** `leaf-aliases.json` and `resourceContractVersion` (both `sk-doc`); `command-metadata.json` (`sk-design`).
- **Declared but consumed by nothing in the replay:** `bundleRules` (populated on `sk-doc` + `sk-design`, empty `[]` on `sk-prompt`); the `surfaceBundle` outcome (`sk-code` only).
- **The collapse is uneven — this is the headline reality.** Hub-router demotion-to-telemetry is real **only** for the two surface-router hubs (`sk-code`, `sk-doc`): there, the hub's mode selection is computed but consumed only as `routeTelemetry`, and `smart_routing.md` + the leaf-manifest own resource selection. The other five hubs still route resources through their projected `hub-router.json`, at **packet granularity only** — they cannot score sub-packet leaf recall until they gain a surface router **and** a manifest. Anyone reading the broad framing ("the whole fleet routes via surface routers and typed pairs") should read it as **2-of-7 today, aspirational for the rest.**
- **Stale prose to ignore (behavior is correct):** in-code comments in `router-replay.cjs` (`:169-172`) and `load-playbook-scenarios.cjs` still say "Only sk-doc ships a leaf-manifest.json today" — `sk-code` now ships one; the code is data-driven via `hasLeafManifest()`, only the comments lag. The symbol `classifyTypedGoldFixture` named in older summaries **does not exist**; the live equivalents are `validate-playbook-topology.cjs::classifyFixture` and `load-playbook-scenarios.cjs::deriveTypedGoldFromBodyGold`.

---

## 6. How the benchmark scores it (why "how it integrates" is checkable)

The skill-benchmark (`/deep:skill-benchmark`, Lane C) is where the routing artifacts are exercised deterministically. `run-skill-benchmark.cjs` runs **D5 static connectivity as a hard gate first**, then **Mode A router-replay**, then joins with private gold to score dimensions. `score-skill-benchmark.cjs` scores the dimensions that need no live model — **D1-intra** (in-skill routing), **D2** (discovery proxy), **D3** (efficiency proxy), **D5** (connectivity gate) — and reports **D1-inter** (advisor selection) and **D4** (usefulness ablation) as unscored in Mode A rather than faking them. Converged point weights: D1 = 25 (inter 12 + intra 13), D2 = 20, D3 = 15, D4 = 25, D5 = 15. This is the harness that makes every §2 "how it feeds routing" claim observable: change a `RESOURCE_MAP` row or a manifest leaf and the replayed recall moves.

---

## 7. Consumer-script index (traceability)

| Consumer | Path | Reads | Role |
|---|---|---|---|
| `router-replay.cjs` | `system-deep-loop/deep-improvement/scripts/skill-benchmark/` | hub-router.json, smart_routing.md, mode-registry.json, leaf-manifest.json | Mode-A deterministic router replay (mode → telemetry; surface → resources → typed pairs) |
| `executor-dispatch.cjs` | same dir | (via router-replay) | `dispatchScenario()` calls `routeSkillResources`; caps workflow modes; builds typed contract |
| `load-playbook-scenarios.cjs` | same dir | leaf-manifest.json, playbook fixtures | derives typed gold (`deriveTypedGoldFromBodyGold`, `loadManifestModeLeaves`) from both playbook shapes |
| `score-skill-benchmark.cjs` / `run-skill-benchmark.cjs` | same dir | all of the above + private gold | scores D1–D5; D5 hard gate first |
| `d5-connectivity.cjs` / `parent-hub-vocab-sync.cjs` | same dir | hub-router.json, mode-registry.json | structural + vocab conformance gates (P0 on missing hub-router) |
| `generate-leaf-manifest.cjs` | `sk-doc/create-skill/scripts/` | mode-registry.json, leaf-aliases.json | `--write`/`--check` the byte-canonical manifest |
| `validate-playbook-topology.cjs` | `sk-doc/create-skill/scripts/` | leaf-manifest.json, fixtures | pre-dispatch typed-gold gate (`classifyFixture`; blocked = excluded from denominators) |
| `leaf-resource-contract.cjs` | `sk-doc/create-skill/scripts/lib/` | — | pure typed-pair library (`dualReadLegacyResource`, `buildManifest`, `canonicalManifestBytes`) |
| `parent-skill-check.cjs` | `.opencode/commands/doctor/scripts/` | registry + manifest | `/doctor` guards `10a`–`10d` (opt-in per hub) |
| `command-binding-existence.vitest.ts` | `system-skill-advisor/mcp_server/tests/` | mode-registry `command`, command-metadata.json | asserts command ids resolve to real files |
| `design-command-surface-check.mjs` | `sk-design/shared/scripts/` | command-metadata.json, command files | 26-field schema + drift gate (sk-design) |
| advisor scorer + hooks | `system-skill-advisor/mcp_server/lib/scorer/**`, `hooks/claude/**`, `.opencode/bin/skill-advisor.cjs` | skill-graph.json, SKILL.md frontmatter | Layer-0 right-skill scoring + Gate-2 brief |

---

## RELATED

- Surface-router / typed-pair machinery: `system-deep-loop/deep-improvement/scripts/skill-benchmark/` (`router-replay.cjs`, `executor-dispatch.cjs`, `load-playbook-scenarios.cjs`, `score-skill-benchmark.cjs`, `run-skill-benchmark.cjs`).
- Typed-pair contract library + generator + gate: `sk-doc/create-skill/scripts/{generate-leaf-manifest.cjs, validate-playbook-topology.cjs, lib/leaf-resource-contract.cjs}`.
- Advisor: `system-skill-advisor/` (`mcp_server/lib/scorer/{lane-registry.ts, scoring-constants.ts}`, `mcp_server/scripts/skill-graph.json`, `hooks/claude/user-prompt-submit.ts`) and `.opencode/bin/skill-advisor.cjs`.
- This program's per-skill routing research: child packets under this parent.
