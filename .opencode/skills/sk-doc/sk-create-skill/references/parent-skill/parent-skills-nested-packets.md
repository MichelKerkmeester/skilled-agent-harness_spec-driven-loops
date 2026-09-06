---
title: Parent Skills with Nested Mode Packets
description: Canonical parent-hub method for one advisor-routable hub with workflow and surface packets declared in a single modes array.
trigger_phrases:
  - "parent skill nested packets"
  - "parent hub mode registry"
  - "mode packet packetKind"
  - "hub router schema"
  - "surface packet workflow packet"
importance_tier: normal
contextType: implementation
version: 1.2.0.28
---

# Parent Skills with Nested Mode Packets

A parent hub is one advisor-routable skill identity that dispatches to self-contained packets. The canonical method is a thin hub, a single `modes[]` registry containing both workflow and surface packets, required hub-router metadata, and optional named extensions.

---

## 1. OVERVIEW AND CANONICAL METHOD

Use this pattern when a skill family needs multiple independently documented packets under one public advisor identity. The hub stays routing-only; packets own the detailed workflow, evidence, examples, tool boundaries, and validation.

The method has one physical shape:

```text
parent-hub/
  SKILL.md
  mode-registry.json
  hub-router.json
  ROUTER.md
  description.json
  graph-metadata.json
  command-metadata.json             # optional; only when the hub owns slash commands
  leaf-manifest.json
  changelog/
  manual-testing-playbook/
  benchmark/
  <workflow-packet>/
    SKILL.md
    README.md
    changelog/
  <surface-packet>/
    SKILL.md
    README.md
    references/
    assets/
    changelog/
```

Core rules:

- **Two-tier core**: one hub directory plus nested packets. Do not add an intermediate tier for backend families, runtime loops, or surface groups.
- **One mode array**: every packet is one entry in `mode-registry.json > modes[]`; do not add a second array such as `surfacePackets[]`.
- **Mode kind**: every mode entry declares `packetKind: "workflow" | "surface" | "transport"`. Workflow and surface are the two primary axes; `transport` is a narrow third kind for packets that bridge to an external tool's CLI/MCP surface (declared via the `transport-axis` extension) and never perform the hub's own judgment.
- **Workflow packets**: process or lifecycle modes such as implement, quality, review, research, or audit. They may mutate or stay read-only according to their role.
- **Surface packets**: read-only evidence bases such as `code-webflow` or `code-opencode` (hub-prefixed, matching `folder == packetSkillName`). They are advisor-invisible and enrich a workflow rather than becoming advisor identities.
- **One advisor identity**: the hub's `graph-metadata.json` is the advisor identity input. Hub-only `description.json` is doctor metadata; packets never carry either file. No mode packet or `shared/` directory holds them. The full per-class rule for every root-level metadata JSON is canonical in [skill-root-metadata-contract.md](../shared/skill-root-metadata-contract.md).
- **Required router**: every hub has `hub-router.json` with `routerPolicy`, `routerSignals`, `vocabularyClasses`, and resource paths that resolve on disk.
- **Stage-two control document**: every hub also carries one root `ROUTER.md` declaring `router_state: stage1-only` or `active`. A fresh scaffold is `stage1-only` with empty maps, delegating all routing to stage one; `active` requires non-empty equal-key `INTENT_SIGNALS`/`RESOURCE_MAP` whose paths resolve and map to typed `leaf-manifest.json` pairs. Promote only after authoring a concrete leaf map — never synthetic intents. `ROUTER.md` is a control-plane companion, never a leaf, advisor identity, or class discriminator.
- **Named extensions only**: optional behavior is declared in top-level `extensions`; it never changes the physical layout.

Required fields for every `modes[]` entry:

- `workflowMode`: stable public hub/mode key.
- `packetKind`: `workflow`, `surface`, or `transport`.
- `backendKind`: workflow backend kind or `evidence-base` for surface packets.
- `toolSurface`: allowed tools, forbidden tools, mutation flag, and bash allowlist.
- `packet`: packet folder name.
- `packetSkillName`: packet `SKILL.md` name.
- `grandfatheredFolderMismatch`: `false` unless preserving an existing folder/name mismatch.
- `aliases`: natural-language mode phrases, unique across modes.
- `advisorRouting`: routing class and packet identity.

Optional per-mode fields (declare, don't infer — never derive an extension-only field from `workflowMode`):

| Field | Meaning | Hubs that use it |
| --- | --- | --- |
| `command` | The bound `/slash` command for the mode; `null` when the mode has no dedicated command. | sk-doc, sk-design, deep-loop |
| `agent` | The leaf agent a runtime-loop mode dispatches. | deep-loop |
| `artifactRoot` | Where a mode's generated artifacts are rooted. | deep-loop |
| `loopHostMode` | The host mode for an improvement lane (paired with `backendKind: improvement-host`). | deep-loop |
| `externalLoopOwner` | The external owner of an improvement lane that runs outside the host loop runtime. | deep-loop |
| `proceduresPath` | Path to a mode's procedure cards. | sk-design |

Surface packet constraints:

- `packetKind` is `surface`.
- `backendKind` is `evidence-base`.
- `toolSurface.mutatesWorkspace` is `false`.
- `toolSurface.allowed` is limited to read/search commands.
- `toolSurface.forbidden` includes write, edit, and task dispatch tools.
- `advisorRouting.routingClass` is `metadata`; the hub remains the single advisor identity.

---

## 2. REGISTRY AND ROUTER CONTRACT

`mode-registry.json` is the packet source of truth. Routers and validators read it instead of rediscovering packets from directories.

Top-level registry fields:

- `skill`: hub id.
- `version`: four-part version for hubs that ship releases.
- `description`: concise registry purpose.
- `discriminator`: documentation for `workflowMode`, `packetKind`, `backendKind`, and any extension-activated field.
- `advisorRoutingContract`: how modes project through the single hub identity.
- `modes[]`: all workflow and surface packets.
- `extensions`: optional declaration-only extension map.

`advisorRouting.routingClass` values:

| routingClass | Use | Advisor map entry |
| --- | --- | --- |
| `lexical` | Weighted advisor scoring plus projection maps. | Yes |
| `alias-fold` | Alias projection into an existing advisor id. | Yes |
| `metadata` | Resolved by hub membership. Default for new hubs and all surfaces. | No |
| `command-bridge` | Routed by command surface rather than advisor scoring. | No |

`hub-router.json` is required for every hub. It declares:

- `routerPolicy.defaultMode`, `ambiguityDelta`, `defaultResource`, and `tieBreak`.
- `routerPolicy.outcomes.single`, `orderedBundle`, and `defer` (base three); plus `surfaceBundle` only when the hub declares `surface-axis`.
- Optional `routerPolicy.bundleRules[]` for declarative multi-mode bundles.
- `routerSignals` keyed by every `workflowMode` in the registry, including surfaces.
- `vocabularyClasses` referenced by router signals.
- Hub-root-relative `resources[]` paths that resolve on disk.

Tie-break order lists workflow modes first and surface packets after them. `surfaceBundle` means one primary workflow mode plus zero or more surface packets, with the workflow ordered first.

### Two-stage authoring: `hub-router.json` then root `ROUTER.md`

Stage one and stage two are separate authoring acts. `hub-router.json` selects a workflow mode. The root `ROUTER.md` then owns stage-two leaf selection when `active` — mapping request intent to the exact packet-local leaf resources that mode loads — or declares `stage1-only` and leaves the whole routing story to stage one. A fresh hub scaffolds `stage1-only` with empty maps, a root `SKILL.md` pointer, and a four-part `version`. Promotion to `active` is the deliberate act of authoring non-empty equal-key maps with resolvable, typed leaf paths; the authoring tooling never fabricates those maps. See [`parent-skill-root-router-template.md`](../../assets/parent-skill/parent-skill-root-router-template.md) for both states.

---

## 3. COMPILED-ROUTING READINESS

Every new parent hub receives the additive compiled-routing directive, while its generated activation state is selected explicitly:

- `legacy` is the backward-compatible default. It emits no activation manifest and reports `legacy (no manifest)`.
- `ready` writes the final `SKILL.md`, `mode-registry.json`, and `hub-router.json`, invokes `.opencode/bin/compiled-route-manifest.cjs mint --hub <hub-id> --skill-root <final-hub-path>`, and then invokes the same CLI's `freshness` action.

Only a valid, fresh canonical result may be reported as `compiled-ready (fresh manifest verified)`. Missing tooling, a failed mint, malformed manifest bytes, or stale policy identity fails the command and retains the legacy fallback. Do not synthesize an effective-policy digest or hand-author the activation manifest.

The minted manifest proves readiness without enabling service: it starts at generation 1 with legacy serving authority and shadow-only enabled. Eligibility, fallback, and later activation remain owned by the shared compiled-routing contract; this authoring workflow does not duplicate those rules or change the default.

---

## 4. NAMED EXTENSIONS

Extensions declare extra semantics in place. They do not create extra directory tiers or move fields away from their current registry locations.

| Extension | Activates | Use when |
| --- | --- | --- |
| `surface-axis` | `packetKind: "surface"` entries and `surfaceBundle` routing. | The hub has read-only evidence packets attached to workflow modes. |
| `runtime-loop` | Per-mode `runtimeLoopType` plus convergence backend. | Modes run through a loop runtime with explicit loop types. |
| `advisor-projection` | Drift guard path for lexical or alias-fold projection maps. | Any mode has `routingClass: "lexical"` or `routingClass: "alias-fold"`. |
| `transform-verbs` | Verb routing that changes target mode by wording frame. | The hub routes phrases such as applying a transformation versus auditing whether it should happen. |
| `deprecated-modes` | Retired modes kept as redirects or shims. | A public mode remains as replacement guidance without active packet routing. |
| `transport-axis` | `packetKind: "transport"` entries that bridge to an external tool's CLI/MCP surface. | A mode drives an external tool (its CLI/MCP), stays `mutatesWorkspace:false` + `routingClass:"metadata"`, forbids Write/Edit/Task, and pairs with a workflow mode before any effecting operation. Every listed transport must be a registered `packetKind:"transport"` mode. |

A hub with no extensions is the pure two-tier core. Add only the extension needed for real routing semantics.

---

## 5. FOUR HUBS EXTENSION MATRIX

| Hub | Packet axis | Runtime loop | Advisor projection | Transform verbs | Deprecated modes | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `sk-code` | Declares the surface axis: workflow modes resolve code lifecycle steps and surface packets provide read-only evidence (`code-webflow`, `code-opencode`). | No runtime-loop extension; workflows are direct code modes, not convergence loops. | None; each mode uses `metadata` and the advisor routes the single `sk-code` identity. | None. | None. | Canonical live example for `mode-registry.json` plus `hub-router.json`; router vocabulary includes surface signal classes inside workflow modes. |
| `sk-design` | Four workflow modes (`sk-design-fundamentals`, `sk-design-md-generator`, `sk-create-chart`, `sk-create-diagram`); no surface packets. This row is an illustrative snapshot; consult the live registry for current mode names. The hub was decommissioned into two standalone skills in August 2026 and reinstated with four modes in September; `sk-prompt`, which briefly held this row, is a standalone root. | No runtime-loop extension; fundamentals uses the shared reference base, the md-generator mode runs its extraction backend, and the chart and diagram modes generate self-contained artefacts. | None; all modes use `metadata` under the single `sk-design` identity, so their vocabulary reaches the advisor only through the hub's `graph-metadata.json` `intent_signals`. | Declares transform-verb semantics: phrasing decides whether a mode applies a visual move or audits whether it should happen. | None; what `016` retired stays retired. | Transform-verbs example. |
| `system-deep-loop` | Workflow-only active modes; no surface packets. | Declares runtime-loop semantics for research, review, and council modes; improvement lanes use host or external adapters. | Required for lexical and alias-fold modes; hardcoded advisor projection maps stay drift-guarded against the registry. | None. | None declared (`deprecatedModes: []`); the retired standalone context loop survives only as an advisor comment, not a registry deprecation. | Extension-heavy example: runtime-loop and advisor-projection semantics. |
| `sk-doc` | Workflow-only; no surface axis, zero named extensions. Several workflowModes may multiplex onto one packet (N modes → 1 packet) when that packet's `SKILL.md` declares each mode. | No runtime-loop extension. | None; all modes use `metadata` under the single `sk-doc` identity. | None. | None. | Workflow-only, zero-extension example — the pure two-tier core scaffolded by this doctrine. |

Use the matrix to describe current hub behavior without copying one hub's special machinery into another. `runtimeLoopType` belongs only to hubs declaring `runtime-loop`; transform-verb routing belongs only to hubs declaring `transform-verbs`; surface evidence packets belong only to hubs declaring `surface-axis`; and transport packets belong only to hubs declaring `transport-axis`.

---

## 6. WORKFLOW PACKET VS SURFACE PACKET

Choose a **workflow packet** when the new capability changes the process the assistant follows.

Add a workflow packet when:

- It has a distinct lifecycle, state model, verification gate, or output contract.
- It may need different tool permissions or mutation rules.
- The user intent should route to it as a primary mode.
- It changes the order of work, not just the evidence used during work.

Choose a **surface packet** when the new material is an evidence base for an existing workflow.

Add a surface packet when:

- It is read-only reference material for a domain, stack, platform, or runtime.
- A workflow mode remains primary and the surface is loaded as supporting context.
- The packet should be advisor-invisible under the hub's single identity.
- It needs its own references or assets but not a new lifecycle.

Examples:

- A new code review process is a workflow packet.
- A new frontend platform evidence base is a surface packet used by implement, quality, debug, verify, or review.
- A new iterative convergence loop is a workflow packet plus `runtime-loop` extension, not a surface.
- A new design phrase family such as applying versus auditing a visual move is a `transform-verbs` extension, not a surface packet by itself.

If the request needs both, register the workflow first and attach surfaces through `surfaceBundle` or bundle rules. Do not create a surface packet merely to organize text that could live under an existing workflow packet.

---

## 7. ADDING A MODE TO AN EXISTING HUB

Sections 1 and 2 describe authoring a hub. Adding a mode to one that already ships is a
different act with its own failure: the mode looks registered, every validator is green,
and it is still unreachable. Registering a packet is the first surface, not the only one.

**A mode is integrated when every surface that applies to its class carries it. Not before.**

Check `advisorRouting.routingClass` first. Most modes are `metadata` and skip row 10; a `lexical` or `alias-fold` mode is advisor-visible by name and needs it.

| # | Surface | File | What breaks when it is missed |
|---|---------|------|-------------------------------|
| 1 | Packet registration | `mode-registry.json` | Nothing routes at all |
| 2 | Stage-one signals | `hub-router.json` `routerSignals` | The hub never selects the mode |
| 3 | Stage-one tie-break | `hub-router.json` `routerPolicy.tieBreak` | `parent-skill-check` 5e fails: tieBreak must be an exact permutation of the registry |
| 4 | Stage-two intent | root `ROUTER.md` `INTENT_SIGNALS` + `RESOURCE_MAP` | The mode is selected but loads no leaves. Keys must stay equal |
| 5 | Stage-two inventory | root `ROUTER.md` `FULL_INVENTORY`, **where the hub defines one** | The full-toolkit intent silently omits the mode. Only `sk-doc` carries this block today; skip it on a hub without one |
| 6 | Advisor vocabulary | hub `graph-metadata.json` | **The advisor never surfaces the hub for this mode's requests.** The only path in, since the mode gets no advisor entry of its own |
| 7 | Human-facing contract | hub `SKILL.md` mode table and packet count | An agent that loads the hub cannot see the mode. This is the runtime's fallback discovery surface when the advisor is unreachable |
| 8 | Doctor metadata | hub `description.json` keywords and description | The mode is missing from the hub's advertised surface |
| 9 | Leaf manifest | `leaf-manifest.json` | Regenerate rather than hand-edit; a stale manifest fails `10b-byte-drift` |
| 10 | Projection maps and scorer, **for a non-`metadata` mode only** | `skill_advisor.py`, the scorer alias groups, the hub's `legacyAliases` | A `lexical` or `alias-fold` mode is advisor-visible by name, so it needs its own entries. A `metadata` mode needs none of this. A drift guard covers the maps |
| 11 | Command mirrors | `.codex/prompts/`, `.pi/prompts/`, `.cursor/commands/`, `.claude/commands/` | The command is unreachable from those runtimes. Run each sync script; do not hand-create |

**A green gate is not integration.** `parent-skill-check` covers rows 1-3, 9 and 11. Row 7 is covered by
check 6b, which asserts the mode is *named in the table* and nothing more. Rows 4, 5, 6, 8 and 10 have no gate:
a hub can pass every check with a mode that no request can reach. Two shipped examples today are
`sk-code-obsidian` and `sk-code-mobile-cli`, both named in their hub's table with no vocabulary in
`graph-metadata.json`, `ROUTER.md` or `description.json` — a request for either routes to a different hub.

### Verify against the hub you changed

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/<hub>
```

**Always pass the hub path.** The check is per-hub, and a bare invocation reports on
whichever hub it defaults to — a green result that describes a hub you did not touch reads
exactly like success.

Then replay both stages, because each can pass while the other is broken:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \
  --skill .opencode/skills/<hub> --task "<a real request for the new mode>"
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "<same request>" --threshold 0.5
```

A stage-one hit with `surfaceIntents: []`, or a stage-two hit with `intents: [NONE]`, means
the two stages disagree about the same phrasing. Fix the vocabulary on both sides rather
than the side that happens to be failing.

### Keep the alias narrow

An alias earns its place by catching a request for **this** mode. A term that also matches
unrelated work (`rule file`, `config`, `template`) captures traffic the hub cannot serve, and
the misroute only shows up once someone types it. Replay each new alias against a plausible
out-of-domain phrase before shipping it.

---

## 8. CHANGELOG AND NAMING POLICIES

Changelog policy:

- Keep real changelog files at both hub and packet level.
- Do not use symlinks for changelogs.
- Do not point packet changelogs at hub changelogs or vice versa.
- Each hub and each packet owns the release notes readers need at that location.

Naming policy:

- Workflow packet folders use the hub's naming convention. Prefix workflow packets when the hub family uses a prefix; otherwise use the established packet name.
- Surface packet folders use the hub-prefixed convention (`folder == packetSkillName == [hub-prefix]-<surface>`), such as `code-webflow` or `code-opencode`.
- `folder == packetSkillName` is the default for every new packet.
- **Mode multiplexing (N→1)**: several `workflowMode` entries may point at one packet folder when that packet's `SKILL.md` declares each mode it serves (sk-doc and deep-loop do this). `folder == packetSkillName` still holds for the packet; the multiplexed modes share it.
- `grandfatheredFolderMismatch: true` is only for an existing mismatch that must be preserved.
- Never create a new mismatch for convenience.
- Keep natural-language `aliases[]` unique across all modes, and lowercase — the router vocabulary is matched case-folded, so a non-lowercase alias silently fails to mirror its vocabulary class.
- **Two vocabulary strategies** — pick one per hub and hold it: *mirrored* copies every registry alias verbatim into a hub-router `vocabularyClasses` entry (sk-design; keeps vocab-sync clean), or *compositional* builds match phrases from parts so some registry aliases have no literal router-vocab home. Both are valid; mixing them makes vocab-sync drift meaningless.
- Name vocabulary classes by owner, such as `<surface>-aliases`, `<surface>-runtime`, or `<mode>-aliases`.

Companion file policy:

- Every hub has `SKILL.md`, `mode-registry.json`, `hub-router.json`, root `ROUTER.md`, `description.json`, `graph-metadata.json`, generated `leaf-manifest.json`, `changelog/`, `manual-testing-playbook/`, and `benchmark/`. Add authored `command-metadata.json` only when the hub owns slash commands.
- Every packet has `README.md`, `SKILL.md`, and `changelog/`.
- Surface packets also carry `references/` and `assets/` when they need evidence material.
- A class-H hub may carry authored `command-metadata.json` when it owns slash commands. The file has one entry per owned command and is validated when present; omit it for a command-less hub. See [skill-root-metadata-contract.md](../shared/skill-root-metadata-contract.md) for the complete matrix.
- Shared directories may hold cross-packet vocabulary or synthesis, but never per-mode workflow logic and never their own `graph-metadata.json` or `description.json`.
- A single shared workflow doctrine may live once under `shared/` and be **symlinked** into each packet that consumes it (sk-code symlinks its implement → debug → verify doctrine into both surfaces), so packets bundle the doctrine as read-only evidence without forking per-packet copies. The acting agent executes the process; the packet never carries it.

---

## 9. RELATED RESOURCES

- [parent-hub-router-schema.md](../parent-skill/parent-hub-router-schema.md) - published router and registry schema details for parent hubs.
- [parent-skill-root-router-template.md](../../assets/parent-skill/parent-skill-root-router-template.md) - root `ROUTER.md` stage-two authoring template.
- [skill-creation.md](../README.md) - skill-creation index and route map.
- [overview.md](../shared/overview.md) - skill anatomy and layered structure.
- [creation-workflow.md](../skill/creation-workflow.md) - ordered creation workflow.
- [validation-and-packaging.md](../shared/validation-and-packaging.md) - validation and packaging gates.
- [parent-skill-hub-template.md](../../assets/parent-skill/parent-skill-hub-template.md) - routing-only hub template.
- [parent-skill-registry-template.json](../../assets/parent-skill/parent-skill-registry-template.json) - registry scaffold.
- [parent-skill-command-metadata-template.json](../../assets/parent-skill/parent-skill-command-metadata-template.json) - optional command-surface scaffold for hubs that own slash commands.
- [parent-skill-leaf-aliases-template.json](../../assets/parent-skill/parent-skill-leaf-aliases-template.json) - authored alias scaffold for the rare hub that relocates a mode resource into `shared/`.
- [skill-root-metadata-contract.md](../shared/skill-root-metadata-contract.md) - the full file matrix with the per-class template map.
