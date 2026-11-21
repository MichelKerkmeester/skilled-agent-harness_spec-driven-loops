# Iteration 3: KQ3 — the mcp-browser-use hub contract

## Focus

Answer KQ3: read `mcp-tooling`'s `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json` and `leaf-manifest.json`, then propose the `mcp-browser-use` contract shapes (advisor `routingClass` and `packetKind` per mode) with each shape checked against `mcp-tooling`'s files. Narrow interpretation selected: `mcp-browser-use` is a greenfield parent hub modeled on `mcp-tooling` (002 spec line 58), so the deliverable is a proposed four-file skeleton plus mode discriminator values, not an implementation. Exact mode name strings are deferred to KQ5 (naming); this iteration preserves the `mcp-` prefix as the conservative default and marks the strings as KQ5-owned. No ambiguous-input, contradiction, missing-dependency or partial-success edge condition affected the iteration.

## Actions Taken

1. Read state: config, state JSONL, strategy, findings registry — confirmed iteration 3, session `2026-11-21T08:29:48.000Z`, focus not in the BLOCKED set (broad Bladebro web search; live `bladebro` probes).
2. Verified write boundary: `iterations/iteration-003.md` and `deltas/iter-003.jsonl` did not exist; `research.md` exists and `progressiveSynthesis: true`, so it is in scope to update. No reducer-owned file scheduled for edit.
3. Read the five named contract files plus `graph-metadata.json`, `description.json`.
4. Read the research charter (KQ3 "answered means" bar, spec.md:70) and the two downstream specs that defer open questions to KQ3 (002 spec.md:144, 005 spec.md:150).
5. Confirmed by glob that no `*bladebro*` file exists anywhere under `.skilled/skills/`, so the Bladebro packet leaves are greenfield.

## Findings

1. **The transferable contract is four root files plus generated metadata.** `mcp-tooling` defines its hub as `SKILL.md` (hub identity + mode table), `mode-registry.json` (per-mode identity and safety), `hub-router.json` (stage-one signals, classes and tie-break) and root `ROUTER.md` (stage-two leaf map), with `leaf-manifest.json` generated and `description.json`/`graph-metadata.json` for advisor discovery; "the hub holds no per-mode logic. Each mode keeps its contract in its packet" [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:15-20] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:105-111]. `mcp-browser-use` needs the same skeleton with the identity swapped; 002 already lists exactly these six files as its deliverables [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/spec.md:88-96].

2. **Advisor `routingClass` = `metadata` for all three modes.** Every `mcp-tooling` mode carries `advisorRouting.routingClass: "metadata"` — resolved by hub membership, so the advisor routes the single hub identity and the hub picks the mode, with no per-mode advisor map entry or merged-identity projection [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:5] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:11-16] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:55,69]. Applying the same class to Chrome, Aside and Bladebro inside `mcp-browser-use` closes 005's Open Question with the smaller scope: no per-mode projection maps are needed [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md:150].

3. **`packetKind` = `workflow` for all three; the new registry has no `transport-axis` extension.** All three browser modes change browser/workspace state, matching `mcp-tooling`'s `workflow` discriminator whose tool surfaces allow `Write`/`Edit` and set `mutatesWorkspace: true` [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:8] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:31-32,98-99]. Because none is a read-only design transport, `mcp-browser-use` must drop `mcp-tooling`'s `extensions.transport-axis` block entirely [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:17-26] — the direct answer to 002's Open Question ("only workflow modes") [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/spec.md:144]. Consequence: no transport `forbidden: [Write, Edit, Task]` surface and no `crossHubPairing` with `sk-design` in the new hub [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:126,134].

4. **`backendKind` = `cli-plus-mcp` for all three.** Chrome and Aside are `cli-plus-mcp` in the existing registry [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:9,32,99]. Bladebro qualifies on the same discriminator because its CLI and MCP reuse the same five handlers, making its fallback transport-driven rather than capability-driven [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:9] [INFERENCE: iteration-002 finding that Bladebro CLI and MCP share handlers, recorded in research.md:46]. The new hub therefore needs none of mcp-tooling's other backend kinds (`code-mode-remote-mcp`, `figma-desktop-transport`) [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:9].

5. **Proposed `mode-registry.json` shape** [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:1-61]: top level `skill: "mcp-browser-use"`, `version`, `resourceContractVersion: 1`, `description`, `discriminator` (workflowMode/packetKind/backendKind definitions), `advisorRoutingContract` (routingClass, packetSkillName, grandfatheredFolderMismatch, command), then `modes[]` of length 3. Each mode: `workflowMode`, `packetKind: "workflow"`, `backendKind: "cli-plus-mcp"`, `toolSurface` (allowed including `Write`/`Edit`/`mcp__code_mode__call_tool_chain`, `forbidden: []`, `mutatesWorkspace: true`, `bashAllowlist: []`), `packet` equal to `packetSkillName`, `grandfatheredFolderMismatch: false`, `command: null` (per ADR-006), `aliases[]`, `advisorRouting: {routingClass: "metadata"}`. The exact `workflowMode`/`packetSkillName` strings are KQ5-owned; the folder==name invariant should be preserved whichever naming KQ5 picks [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:13-14].

6. **Proposed `hub-router.json` shape** [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:1-33] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:34-119]: top level `skill: "mcp-browser-use"`, `version`; `routerPolicy` with `defaultMode: null`, `ambiguityDelta: 1`, `outcomes` (single/orderedBundle/defer), fallback-only `defaultResource: ["ROUTER.md","mode-registry.json"]`, and a `discoveryClasses` list holding a hub-identity class plus a browser-generic defer class. `routerSignals` has exactly three keys — one per mode — each `weight: 4` with `classes[]` and `resources: ["<mode>/SKILL.md"]`; `vocabularyClasses` supplies keywords per class [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:120-376]. The `tieBreak` order must encode the two overlaps the capability work found: Chrome↔Bladebro on debugging and Aside↔Bladebro on agentic signed-in work, with generic "browser automation" phrasing deferring rather than fanning out, mirroring mcp-tooling's discovery-only `provider-neutral-design-research` class [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:42-47] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:28-32].

7. **Proposed `leaf-manifest.json` shape and the Bladebro greenfield gap** [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:1-25]: three `modes[]` entries, each `{leaves: [...], packet, workflowMode}`, sorted by packet, with `resourceContractVersion: 1` [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:113-115]. Chrome and Aside leaves can be carried over from mcp-tooling's manifest (cdp-patterns/session-management; aside-cli-reference/mcp-wiring) [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:4-15] [SOURCE: .skilled/skills/mcp-tooling/leaf-manifest.json:17-25]. Bladebro has no packet under `.skilled/skills/` (glob for `**/*bladebro*` returned no files, 2026-11-21), so 004-bladebro-mode must author its leaves before the manifest can be regenerated. The manifest is generated and must never be hand-edited [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:111,127].

8. **New hub needs its own stage-two `ROUTER.md`.** Its machine-readable section holds `INTENT_SIGNALS` (weight 4, keyword sets per mode) and `RESOURCE_MAP` mapping each mode to packet-qualified leaf resources, with `DEFAULT_RESOURCE = []` so no preamble is always loaded [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:79-137]. Every `RESOURCE_MAP` path must resolve on disk and be registered in the generated `leaf-manifest.json`, converting to canonical `(workflowMode, leafResourceId)` pairs at the leaf-resource contract boundary [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:28-36]. Bladebro's resource rows cannot be filled until 004 authors its packet (see finding 7).

9. **Cross-file consistency and single advisor identity are part of the contract.** `mcp-tooling` requires registry modes and router signal keys to stay bidirectionally aligned and says to ESCALATE when "registry modes, stage-one signals, stage-two resource keys, or generated manifest entries disagree" [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:125] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:140-141]. Version authority: the SKILL.md frontmatter version matches the newest changelog entry and metadata files carry the same value [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:20]. Advisor discovery needs its own `description.json` and one `graph-metadata.json` with a single hub identity (`family: mcp`, `category: mcp-tool`) and three member entities [SOURCE: .skilled/skills/mcp-tooling/description.json:1-23] [SOURCE: .skilled/skills/mcp-tooling/graph-metadata.json:2-5]. Because there are no transports, the transferable cross-skill edges are the external `mcp-code-mode` substrate, not the design siblings [SOURCE: .skilled/skills/mcp-tooling/graph-metadata.json:7-12].

## Questions Answered

- **KQ3** — to its "answered means" bar: proposed `mode-registry.json`, `hub-router.json` and `leaf-manifest.json` shapes (findings 1, 5, 6, 7), the advisor `routingClass` per mode (finding 2: `metadata` for all three), and the `packetKind` per mode (finding 3: `workflow` for all three), each checked against `mcp-tooling`'s files. Full answer is in `research.md` KQ3 section. [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:70]

## Questions Remaining

KQ1 (capability matrix marked answered but still carries the Lighthouse contradiction), KQ4 (blast radius), KQ5 (naming — owns the exact mode strings deferred above), KQ6 (macOS verification), KQ7 (security), KQ8 (Aside overlap).

## Ruled Out

- Importing `mcp-tooling`'s `extensions.transport-axis` block: rejected because all three new modes are workflow-state-changing, directly answering 002's open question.
- Giving any mode a non-`metadata` routingClass: rejected because it would add per-mode projection maps to 005's scope for no benefit under hub-membership routing.
- Hand-writing `leaf-manifest.json`: rejected by mcp-tooling's "never hand-edit" rule; it must be regenerated (blocked until 004 authors the Bladebro packet).

## Dead Ends

None. Both candidate reductions (drop transport axis; keep metadata class) produced productive findings rather than eliminated paths.

## Edge Cases

- Ambiguous input: none material — the KQ5-owned naming strings were explicitly deferred rather than guessed.
- Contradictory evidence: none; the Lighthouse contradiction from KQ1 is out of this iteration's scope.
- Missing dependencies: the Bladebro packet does not exist (glob confirmed); handled by scoping its leaves to 004 rather than fabricating them.
- Partial success: none; all planned research actions completed.

## SCOPE VIOLATIONS

None. All writes are inside the `001-research/research/` lineage directory; no researched file was modified.

## Sources Consulted

- .skilled/skills/mcp-tooling/SKILL.md
- .skilled/skills/mcp-tooling/ROUTER.md
- .skilled/skills/mcp-tooling/mode-registry.json
- .skilled/skills/mcp-tooling/hub-router.json
- .skilled/skills/mcp-tooling/leaf-manifest.json
- .skilled/skills/mcp-tooling/graph-metadata.json
- .skilled/skills/mcp-tooling/description.json
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/spec.md
- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md
- glob `.skilled/skills/**/*bladebro*` (no files)

## Assessment

- New information ratio: 0.94 — 8 of 9 findings are new contract-shape conclusions from the mcp-tooling contract files (not deeply read in iterations 1-2); finding 4 partially reuses iteration 2's Bladebro CLI/MCP-handler result to assign `backendKind`.
- Questions addressed: KQ3.
- Questions answered: KQ3.

## Reflection

- What worked and why: reading all five named contract files in one batch plus the two downstream specs let each proposed shape be checked against a concrete file and let two downstream open questions be closed explicitly.
- What did not work and why: nothing failed; the only gap was the absent Bladebro packet, which is a scheduled later phase, not a research failure.
- What I would do differently: nothing for this focus; KQ4 should grep every referencing file to validate the manifest carry-over assumption made in finding 7.

## Recommended Next Focus

KQ4: enumerate the full blast radius — grep the repository for `mcp-chrome-devtools` and `mcp-aside-devtools` and split every hit into hand-edit, regenerate and leave-as-history, validating the leaf carry-over assumed in finding 7. Do not open with `Close F-<n>-<n>`.
