# Iteration 1: Hub surface — system-deep-loop root registries + /deep:agent-improvement command assets

## Focus

Inventory the hub and command surface for the agent-improvement mode: `.skilled/skills/system-deep-loop/` root registry/router files (mode-registry, hub-router, ROUTER.md, SKILL.md, command-metadata, leaf-manifest, leaf-scopes, graph-metadata, description.json, README, ARCHITECTURE) and `.skilled/commands/deep/` (command file, workflow assets, presentation file, compiled/legacy inventory notes).

## Actions Taken

1. `rg -n "agent-improvement|deep-improvement|deep:agent"` across the eight hub root registry files.
2. Read `mode-registry.json` in full; read `hub-router.json` and `leaf-scopes.json` in full.
3. Read `.skilled/commands/deep/agent-improvement.md` in full; listed `.skilled/commands/deep/assets/` (including `compiled/` and `legacy/`).
4. Read `command-metadata.json` lines 130-225 (agent-improvement and model-benchmark command entries).
5. `rg` across README.md, ARCHITECTURE.md, description.json plus inventory of mentions in benchmark/, changelog/, feature-catalog/, manual-testing-playbook/, shared/ (counted for later iterations).

## Findings

1. **mode-registry.json carries the agent-improvement mode entry** at lines 104-127: `workflowMode: agent-improvement`, `runtimeLoopType: null`, `backendKind: improvement-host`, `packet: deep-improvement` (shared with model-benchmark), `loopHostMode: agent-improvement`, `command: /deep:agent-improvement`, `agent: deep-improvement`, `artifactRoot: improvement/`, aliases list, and the only `advisorRouting` block with `routingClass: alias-fold` and `advisorDefaultMode: true`. Disposition: EDIT (shared registry; remove this mode entry). [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:104]
2. **hub-router.json routes agent-improvement through its own signal and vocabulary class** — `routerSignals.agent-improvement` (`classes: ["agent-improvement-aliases"]`, resource `deep-improvement/SKILL.md`) at lines 36-39 and the `agent-improvement-aliases` keyword class (including `deep-improvement`) at lines 57-59; the tieBreak array names `agent-improvement` at line 7. Disposition: EDIT (remove signal + class; adjust tieBreak). [SOURCE: .skilled/skills/system-deep-loop/hub-router.json:36]
3. **ROUTER.md declares the agent-improvement leaf set** — `AGENT_IMPROVEMENT` intent signal at line 75 and the `RESOURCE_MAP` entries pointing at `deep-improvement/references/agent-improvement/*.md` and `deep-improvement/references/shared/promotion-gate-contract.md` at lines 96-98; the lane-shared-packet note at lines 44-47 and 114. Disposition: EDIT. [SOURCE: .skilled/skills/system-deep-loop/ROUTER.md:96]
4. **SKILL.md names agent-improvement across its keyword header, mode table, discriminator, layout and invariants** — keywords line 8; improvement-lane table row line 29 (`/deep:agent-improvement`, packet `deep-improvement`); backendKind line 62 names `deep-improvement/scripts/shared/loop-host.cjs --mode`; routing checklist line 67; layout line 104; leaf-sync invariant line 122; related-surfaces line 166. Disposition: EDIT. [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:29]
5. **command-metadata.json owns the `/deep:agent-improvement` command entry** at lines 139-181: description, argumentHint, userIntent signals, three-step choreography loading `deep-improvement/SKILL.md` and `.skilled/commands/deep/assets/deep-agent-improvement-presentation.txt`, and the sibling discriminator against `/deep:model-benchmark`. Disposition: EDIT (remove the entry block). [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:139]
6. **The command file and its three owned assets exist only for this mode** — `.skilled/commands/deep/agent-improvement.md` (router, 123 lines) with OWNED ASSETS table lines 71-78 naming `deep-agent-improvement-presentation.txt`, `deep-agent-improvement-auto.yaml`, `deep-agent-improvement-confirm.yaml`. All four files: DELETE. [SOURCE: .skilled/commands/deep/agent-improvement.md:75]
7. **leaf-manifest.json lists the agent-improvement leaf files and the mode row** — assets/agent-improvement/* (8 entries lines 5-12), references/agent-improvement/* (7 entries lines 13-19), and the entry with `packet: deep-improvement`, `workflowMode: agent-improvement` lines 29-30. Disposition: EDIT manifest; DELETE the listed agent-improvement leaf files (packet-local). [SOURCE: .skilled/skills/system-deep-loop/leaf-manifest.json:5]
8. **leaf-scopes.json entry** assigns agent-improvement the scopes `assets/agent-improvement`, `references/agent-improvement`, `references/shared` (lines 2-9); `references/shared` is also model-benchmark's (line 16). Disposition: EDIT (drop the entry; keep shared scope for model-benchmark). [SOURCE: .skilled/skills/system-deep-loop/leaf-scopes.json:2]
9. **graph-metadata.json carries agent-improvement nodes and edges** — node lists lines 43 and 54, `deep-improvement`/`agent-improvement` pairing lines 110-111 and 124, packet SKILL.md path line 134 and 166, causal summary line 158 (four-mode persona list). Disposition: EDIT. [SOURCE: .skilled/skills/system-deep-loop/graph-metadata.json:110]
10. **compiled/README.md and legacy/README.md state agent-improvement is fallback-only and not compiler-managed** — "The rollout entries for `deep/agent-improvement` and `deep/model-benchmark` are fallback-only and are not compiler-managed asset pairs" (compiled/README.md:23; same in legacy/README.md:23). Disposition: EDIT (both READMEs mention the mode; shared file edit only). [SOURCE: .skilled/commands/deep/assets/compiled/README.md:23]
11. **No compiled contract or legacy body exists for agent-improvement** — `compiled/` holds only deep-ai-council/deep-research/deep-review contracts + manifest; `legacy/` holds only three bodies. Confirms the command assets are not part of the compiled-routing pipeline. Disposition: context for DELETE scope (no compiled surface to remove). [SOURCE: .skilled/commands/deep/assets/compiled/manifest.jsonl:1]
12. **Hub identity docs enumerate agent-improvement** — description.json:3,13,24 (five-mode description and trigger lists), README.md:61,82,87,114 (workflowMode example, packet table, agent list, add-a-mode checklist), ARCHITECTURE.md:25,71,115 (packet layout, per-mode ledger families `agent-improvement-*`). Disposition: EDIT. [SOURCE: .skilled/skills/system-deep-loop/ARCHITECTURE.md:115]

## Ruled Out

- Searching for a compiled `deep-agent-improvement` contract under `.skilled/commands/deep/assets/compiled/`: the directory README and file listing show compile coverage is limited to the three compiler-registered commands, so no compiled artifact exists to classify.

## Dead Ends

- None; the hub surface yielded a complete reference set on the first pass.

## Edge Cases

- Ambiguous input: none; "hub surface" was taken as the system-deep-loop root files plus `.skilled/commands/deep/`.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none; all planned reads completed.

## Sources Consulted

- .skilled/skills/system-deep-loop/mode-registry.json:104-127
- .skilled/skills/system-deep-loop/hub-router.json:7,36-39,57-59
- .skilled/skills/system-deep-loop/ROUTER.md:44-47,75,96-98,114
- .skilled/skills/system-deep-loop/SKILL.md:8,29,49,60,62,67,82,104,122,141,166
- .skilled/skills/system-deep-loop/command-metadata.json:139-181
- .skilled/skills/system-deep-loop/leaf-manifest.json:5-30
- .skilled/skills/system-deep-loop/leaf-scopes.json:2-9
- .skilled/skills/system-deep-loop/graph-metadata.json:43,54,110-111,124,134,158,166
- .skilled/skills/system-deep-loop/description.json:3,13,24
- .skilled/skills/system-deep-loop/README.md:61,82,87,114
- .skilled/skills/system-deep-loop/ARCHITECTURE.md:25,71,115
- .skilled/commands/deep/agent-improvement.md:1-123
- .skilled/commands/deep/assets/compiled/README.md:23
- .skilled/commands/deep/assets/legacy/README.md:23

## Assessment

- New information ratio: 0.9
- Questions addressed: KQ1 (reference inventory — hub/command surface), partial KQ2 (indirect wiring: advisor routing class recorded here, folds deferred to advisor iteration)
- Questions answered: none in full (KQ1 spans the whole repository)

## Reflection

- What worked and why: keyword grep with line numbers over the eight named hub files produced the complete mention set in one call; reading mode-registry.json first anchored the mode's identity fields that other files repeat.
- What did not work and why: nothing failed; the rg pattern matched `deep-improvement` liberally, which surfaced the model-benchmark-shared packet surfaces early and is exactly the shared-file boundary the inventory needs.
- What I would do differently: nothing for this surface; subsequent iterations should carry the "shared with model-benchmark" divider into each further surface.

## SCOPE VIOLATIONS

- None. No write was attempted outside the lineage directory; the spec-anchoring pre-init write path is disabled for this read-only lineage run (spec.md untouched).

## Recommended Next Focus

Iteration 2: the mode packet itself — `.skilled/skills/system-deep-loop/deep-improvement/` (SKILL.md, agent-improvement assets and references vs model-benchmark and shared subtrees, scripts, governance/description metadata) — separating agent-improvement-exclusive files (DELETE) from packet-shared ones (SHARED-WITH-MODEL-BENCHMARK).
