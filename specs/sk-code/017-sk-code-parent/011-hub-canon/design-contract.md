# Canonical Parent-Hub Contract (124/011) — the ONE method

> Authoring anchor for Phase 011. GPT template/narrative authoring conforms to
> THIS; the upgraded `parent-skill-check.cjs` enforces THIS; `parent_hub_router_schema.md`
> is the published expansion of THIS. Canonical live example = **sk-code**
> (`.opencode/skills/sk-code/{mode-registry,hub-router,description,graph-metadata}.json`
> + `SKILL.md`). Deep-loop-workflows is the extensions-heavy example; sk-design the
> transform-verbs example.

## 1. Model — two axes, one array

A parent hub is a thin `SKILL.md` + companion metadata. Every packet (child) is ONE
entry in `mode-registry.json > modes[]`. A **required** core field
`packetKind: "workflow" | "surface"` is the axis discriminator. There is **NO**
separate `surfacePackets[]` array — three consumers (vocab-sync alias ownership via
`modes[].workflowMode` prefixes, router-replay `registryPacketRoots()`,
parent-skill-check 3c) all derive from `modes[]`, and a second array would orphan
every surface alias.

- **workflow packet** — a process/lifecycle mode (implement, quality, review, deep-research…).
  Mutating or read-only per its role. Named `<hub-prefix>-<mode>` when the hub uses a prefix
  (deep-loop: `deep-<mode>`); bare for sk-code (`code-implement`).
- **surface packet** — a domain evidence base (webflow, opencode, animation). Read-only,
  advisor-invisible, carries reference material not process. Named as a **bare noun**
  (`webflow/`, `opencode/`, `animation/`).

## 2. mode-registry.json

Top level: `skill`, `version` (4-part for hubs shipping releases), `description`,
`discriminator` (doc of the key fields), `advisorRoutingContract` (doc), `modes[]`,
and OPTIONAL `extensions` (§6).

### 2a. Core fields on EVERY mode (both kinds)
- `workflowMode` (string) — public hub/mode key, stable identity.
- `packetKind` — `"workflow"` | `"surface"`. **REQUIRED (new).**
- `backendKind` — workflow: `surface-router` | `review-cache` | `runtime-loop-type` |
  `improvement-host` | `external-adapter`. surface: **`"evidence-base"`**.
- `toolSurface` `{ allowed[], forbidden[], mutatesWorkspace(bool), bashAllowlist[] }` — **REQUIRED.**
  surface packets MUST be read-only: `mutatesWorkspace:false`, `allowed` ⊆ `["Read","Bash","Grep","Glob"]`,
  `forbidden` ⊇ `["Write","Edit","Task"]`.
- `packet` (string, folder name) and `packetSkillName` (SKILL.md name). folder == packetSkillName
  unless grandfathered.
- `grandfatheredFolderMismatch` (bool) — **REQUIRED**, `false` unless a legacy mismatch is grandfathered.
- `aliases[]` — natural-language phrases. **Never duplicate an alias across modes.**
- `advisorRouting { routingClass, ... }` — see 2b.

### 2b. advisorRouting.routingClass
- `"lexical"` — weighted-regex scored in `skill_advisor.py` AND in both TS/Python projection maps.
  Adds `legacyAdvisorId`, `legacyAliases[]`, `packetSkillName`; `advisorDefaultMode` when a
  multi-mode legacy id folds here.
- `"alias-fold"` — TS projection map only (not lexically scored). `legacyAdvisorId` + `advisorDefaultMode`.
- `"metadata"` — resolved by hub membership; **no advisor map entry** (only `packetSkillName`).
  **Default for new hubs and for ALL surface packets** (surfaces are advisor-invisible; the hub
  keeps ONE advisor identity).
- `"command-bridge"` — routed by its command, not an advisor map entry.

Only `lexical`/`alias-fold` modes require a drift-guard (§6 advisor-projection extension).

## 3. hub-router.json  (REQUIRED for ALL hubs — no deep-loop exemption)

- `routerPolicy`:
  - `defaultMode`, `ambiguityDelta` (int, e.g. 1), `defaultResource[]`.
  - `tieBreak[]` — **workflow modes first, then surface packets**; MUST list every mode.
  - `outcomes` — `single`, `orderedBundle`, `defer`, and **`surfaceBundle`** = "one workflow
    mode primary + zero-or-more surface packets as evidence, workflow ordered first".
  - OPTIONAL `bundleRules[]` — declarative bundles, each referencing REAL modes (also encodes
    sk-design's prose Bundle Rule).
- `routerSignals` — `{ <mode>: { weight(int), classes[](vocab class names), resources[] } }`.
  Surfaces get normal entries. Keys ↔ registry `workflowMode` set must match **bidirectionally**.
- `vocabularyClasses` — `{ <class>: { keywords[] } }`. Every class referenced in `routerSignals`
  MUST exist here; every class here SHOULD be referenced. Class-ownership naming:
  `<surface>-aliases` / `<surface>-runtime` / `<mode>-aliases` (owned classes; retire ad-hoc
  `surface-<x>` names into owned classes).
- `resources[]` paths MUST resolve on disk (hub-root-relative, packet-qualified).

## 4. description.json  (REQUIRED for ALL hubs)

`{ name, description, version(4-part), importance_tier, keywords[], trigger_examples[], lastUpdated }`
plus any hub-specific arrays (sk-code adds `supported_surfaces[]`, `opencode_languages[]`).
Model new ones on sk-code's `description.json`.

## 5. graph-metadata.json  (advisor identity node — one per hub)

The single advisor identity: `edges`, `domains`, `intent_signals`, `derived.{trigger_phrases,
source_docs,key_files}`. Folding a child in = merge its keywords/edges into this node, delete the
child's own graph-metadata (one-identity invariant). Preserve existing content verbatim when
generalizing; `advisorRouting.*` fields the drift-guard hashes must NOT move.

## 6. extensions{}  (top-level, OPTIONAL, declaration-only)

Deep-loop's 3-tier machinery is not physical structure — it is **named extensions** that ACTIVATE
in-place fields (never relocate them; the drift-guard hashes `advisorRouting.*` at current
locations). Declared as `extensions: { <name>: {...} }`:
- `runtime-loop` — activates `runtimeLoopType` per mode + convergence backend. `runtimeLoopType`
  is REQUIRED per mode ONLY when this extension is declared; else omit (never infer from workflowMode).
- `advisor-projection` — declares the `driftGuard` vitest path; required when any mode is
  `lexical`/`alias-fold`.
- `transform-verbs` — sk-design's verb-transform layer.
- `deprecated-modes` — retired modes kept as shims.
- `surface-axis` — declares the hub carries `packetKind:"surface"` packets.

A hub with none of these is pure 2-tier (sk-design/sk-code baseline).

## 7. Required companion files + policies

Per hub (dir): `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`,
`graph-metadata.json`, `changelog/`, `manual_testing_playbook/`, `benchmark/`.
Per packet (dir): `README.md`, `SKILL.md`, `changelog/`; surfaces also `references/` + `assets/`.

- **Changelog policy: REAL FILES ONLY, both hub + packet level, ZERO symlinks** (kills the dangling
  deep-context symlink class).
- **Naming**: workflow modes `<hub-prefix>-<mode>`; surface packets bare nouns.
- All two-axis additions are **additive** — Lane-C's `projectHubRouter` ignores unknown keys, so
  replay keeps working through the transition.

## 8. Enforcement map (validator ↔ contract)

parent-skill-check.cjs, FULL checks for ALL hubs (drop basename gating):
3d core fields (incl. packetKind + toolSurface; runtimeLoopType only under runtime-loop ext;
surfaces read-only+evidence-base) · 3f extensions-consistency · 4a drift-guard presence
conditional on lexical/alias-fold · **5** hub-router validity (signals↔registry bidirectional,
classes exist, resources on disk, tieBreak covers all modes, bundleRules ref real modes) ·
**6** registry↔directory reverse (allowlist shared/changelog/benchmark/manual_testing_playbook/
references/assets/node_modules) · **7** changelog real-files-no-symlinks · **8** description.json ·
**9 (WARN)** playbook + benchmark baseline. **Checks 5–9 ship WARN in 011, promote to FAIL in 015.**
