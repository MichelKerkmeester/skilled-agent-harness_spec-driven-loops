# Iteration 1: Six-mode typed-pair classification

## Focus
Classify each `sk-design` mode's router intent signals and packet-local resource leaves as `(workflowMode, leafResourceId)` pairs, with special attention to the nested `design-mcp-open-design` transport boundary. The narrow interpretation is mode/leaf classification; manifest generation and benchmark-scenario eligibility are deferred to later iterations.

## Findings
1. The public routing surface has exactly six registered modes: five `packetKind: "workflow"` modes (`interface`, `foundations`, `motion`, `audit`, `md-generator`) and one `packetKind: "transport"` mode (`design-mcp-open-design`). Each registry entry names a distinct packet, while the hub router resolves the corresponding packet `SKILL.md`; therefore the six `workflowMode` values are the mode component of typed gold, not six aliases of one parent identity. [SOURCE: .opencode/skills/sk-design/mode-registry.json:38-164] [SOURCE: .opencode/skills/sk-design/hub-router.json:27-91]

2. The design-judgment modes expose independently addressable local leaves. Representative exhaustive intent-to-leaf families are: [INFERENCE: based on the five packet-level intent and resource maps cited below]
   - `interface`: `DESIGN_PRINCIPLES`, `TRANSFORM_APPLICATION`, `REGISTER_DIALS`, `VARIATION_DIVERSITY`, `UX_QUALITY`, `REAL_UI_LOOP`, `MECHANICAL_PREFLIGHT`, `COPY_MOCK_DATA`, `REDESIGN_INTAKE`, `REAL_SYSTEM_GROUNDING`, `REAL_WORLD_REFERENCE`, and `AESTHETICS`, each mapping to packet-local `references/...` or `assets/...` IDs (plus sanctioned `../shared/...` inputs). [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:108-136]
   - `foundations`: `COLOR`, `TYPE`, `LAYOUT`, `ADAPTATION`, `DATA_VIZ`, `WORKED_EXAMPLES`, and `TOKENS`, mapping to the color/type/layout references, data-viz and worked-example leaves, token scaffold, and shared vocabulary/handoff leaves. [SOURCE: .opencode/skills/sk-design/design-foundations/references/smart_router_pseudocode.md:24-46]
   - `motion`: `DECISION`, `STRATEGY`, `MICRO_INTERACTIONS`, `PRESENCE`, `PERFORMANCE`, and `ADVANCED_CRAFT`, mapping to six packet-local reference/asset families and a shared handoff leaf. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:126-142]
   - `audit`: `AUDIT_CONTRACT`, `ACCESSIBILITY_PERFORMANCE`, `CRITIQUE_HARDENING`, `ANTI_PATTERNS_PRODUCTION`, `TRANSFORM_REMEDIATION`, and `EVIDENCE_CAPTURE`, mapping to audit references, report/checklist assets, a JSON fingerprint registry, and shared handoff. [SOURCE: .opencode/skills/sk-design/design-audit/references/smart_router_pseudocode.md:23-43]
   - `md-generator`: `EXTRACT_WRITE`, `VALIDATE`, `REPORT`, `RUN_WRAPPER`, and `STUDY`, mapping to extraction/format/validation references, prompt/card assets, and example-study leaves. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:131-166]

3. Canonical typed gold should pair each selected mode with the leaf's packet-root-relative ID, such as `(motion, references/motion_strategy.md)` or `(md-generator, assets/cardinal_rules_card.md)`. It should not prepend packet folders such as `design-motion/`, because the established contract defines `leafResourceId` as packet-root-relative and performs packet conversion only at the boundary. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:68-84] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:135-141] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:149-165]

4. `design-mcp-open-design` is independently typable as `(design-mcp-open-design, leafResourceId)` with three intent families: `WIRE` loads `references/mcp_wiring.md` plus `references/od_cli_reference.md`; `READ` and `RUN` load `references/tool_surface.md` plus `references/od_cli_reference.md`. Its typed identity remains separate even though any `RUN` or design-feeding `READ` has a hard execution precondition requiring a design-judgment mode; pure wiring or inventory can remain transport-only. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:23-47] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:82-96] [SOURCE: .opencode/skills/sk-design/mode-registry.json:145-162]

5. One root manifest is structurally capable of representing all six mode namespaces, including the nested transport, because manifest uniqueness is composite on `(workflowMode, leafResourceId)` and the registry already supplies six stable mode-to-packet joins. The parent hub should not become a seventh mode: its `defaultResource` entries and packet `SKILL.md` routes are hub preamble/entrypoints, whereas leaf pairs come from each selected packet's local map. This remains a feasibility inference until the manifest generator is checked against the mixed workflow/transport registry and shared-resource aliases. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:163-174] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4-14] [SOURCE: .opencode/skills/sk-design/hub-router.json:5-18] [INFERENCE: based on the composite typed-pair contract, six registry joins, and the hub/leaf separation]

## Ruled Out
- Treating the hub's six packet `SKILL.md` entrypoints or four shared default resources as an independent seventh `workflowMode`; the registry defines only six modes and the hub explicitly routes to packet entrypoints. [SOURCE: .opencode/skills/sk-design/mode-registry.json:38-164] [SOURCE: .opencode/skills/sk-design/hub-router.json:13-18]
- Flattening `design-mcp-open-design` into `interface`; the registry assigns it its own transport mode and backend, while its design gate composes rather than erases the judgment mode. [SOURCE: .opencode/skills/sk-design/mode-registry.json:145-162] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:40-47]
- Using packet-qualified paths such as `design-motion/references/...` as `leafResourceId`; the canonical identity requires packet-root-relative resource IDs. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:68-84]

## Dead Ends
No source-search direction was exhausted. The three rejected identity shapes above are contractually eliminated and should not be reconsidered unless the typed-pair contract changes.

## Edge Cases
- Ambiguous input: The phrase “parent hub and nested transport” could imply a seventh hub pair. The narrower evidence-backed interpretation keeps the hub as the manifest owner and the transport as one of six registered modes; generator behavior is deferred for direct verification.
- Contradictory evidence: none.
- Missing dependencies: startup memory and code-graph context were unavailable per the rendered prompt/strategy, so direct registry, router, mode-packet, and prior typed-contract files were used instead. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/prompts/iteration-001.md:12-14] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-strategy.md:72-81]
- Partial success: none; the first key question is answered, while byte-stable manifest feasibility remains intentionally unverified.

## Sources Consulted
- `.opencode/skills/sk-design/mode-registry.json:1-165`
- `.opencode/skills/sk-design/hub-router.json:1-120`
- `.opencode/skills/sk-design/design-interface/SKILL.md:108-136`
- `.opencode/skills/sk-design/design-foundations/references/smart_router_pseudocode.md:24-46`
- `.opencode/skills/sk-design/design-motion/SKILL.md:126-142`
- `.opencode/skills/sk-design/design-audit/references/smart_router_pseudocode.md:23-43`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:131-166`
- `.opencode/skills/sk-design/design-mcp-open-design/references/smart_router_pseudocode.md:23-47`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:82-96`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/012-sk-doc-routing-fixes/decision-record.md:68-84,163-174`

## Assessment
- New information ratio: 1.00
- Novelty justification: All 5 findings are new in this first iteration and establish the six-mode typed-pair classification plus the transport boundary.
- Questions addressed: How do the six sk-design modes map to independent `(workflowMode, leafResourceId)` gold pairs? Can one byte-stable leaf manifest represent the parent hub and nested design-mcp-open-design transport?
- Questions answered: How do the six sk-design modes map to independent `(workflowMode, leafResourceId)` gold pairs?

## Reflection
- What worked and why: Reading the registry and hub router alongside all six packet-level maps exposed both routing axes: the hub chooses a mode, then the packet map chooses local leaves.
- What did not work and why: The initial broad grep truncated results and did not surface the foundations, audit, or transport maps because those implementations live in packet reference files rather than inline in every `SKILL.md`; narrow reads recovered them.
- What I would do differently: Start from `mode-registry.json`, then follow each packet's declared smart-router authority directly before running broad searches.

## Recommended Next Focus
Verify whether the existing leaf-manifest generator can consume the mixed five-workflow-plus-one-transport registry and emit byte-stable mode/leaf rows, including how shared default resources and `../shared/...` leaves are represented without inventing a hub mode.
