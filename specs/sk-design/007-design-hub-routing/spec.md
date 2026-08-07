---
title: "Feature Specification: Reconstruct the sk-design hub routing layer"
description: "The sk-design hub routing layer had no tracked spec-folder packet, although its intact source defines the single advisor identity, six registry modes, and the signals and vocabulary used to route design requests. This reconstruction records only the hub-level routing contract in SKILL.md, mode-registry.json, and hub-router.json."
trigger_phrases:
  - "sk-design hub routing reconstruction"
  - "design mode registry routing"
  - "hub router signals vocabulary"
  - "single advisor identity"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/007-design-hub-routing"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted hub routing reconstruction packet"
    next_safe_action: "Review packet against intact hub sources"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/specs/sk-design/007-design-hub-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-hub-routing-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Reconstruct the sk-design hub routing layer
<!-- SPECKIT_LEVEL: 2 -->

> RECONSTRUCTION DRAFT (best-effort). This spec did not previously exist in git or memory; it is reconstructed from the intact source .opencode/skills/sk-design/SKILL.md, .opencode/skills/sk-design/mode-registry.json, and .opencode/skills/sk-design/hub-router.json. Verify against that source before treating any line as authoritative.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | 0055-skilled-migration-000-scaffold |
| **Spec Folder** | 007-design-hub-routing |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped sk-design hub is the public advisor-routable home for the design family, but its hub-level routing contract was absent from git and memory as a spec packet. The intact source defines one advisor identity, a six-entry mode registry, a discriminator, routing policy, signal classes, vocabulary classes, fallback behavior, and boundaries that need to be documented without reproducing child-mode logic.

### Purpose
Reconstruct a Level-2 packet that makes the source-defined sk-design hub routing contract inspectable while preserving its single identity and mode-owned boundaries.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The public `sk-design` advisor identity and the hub-membership `metadata` routing contract for all six registry entries.
- The `workflowMode`, `packetKind`, and `backendKind` discriminator, including the five workflow modes and the nested transport packet.
- The six mode entries, packet paths, commands, aliases, tool surfaces, mutability flags, procedure paths where present, and packet-name parity.
- The transform-verb routing extension: interface and audit framing, aliases, alias-only behavior, command-projection parity, and excluded aliases.
- `hub-router.json` policy: default mode, ambiguity delta, tie-break order, single/bundle/defer outcomes, default resources, and the UI build bundle.
- Router signals and vocabulary classes used to distinguish interface, foundations, motion, audit, md-generator, transport, and hub identity terms.
- Hub-level intake ordering, smallest-useful-mode routing, unknown fallback, visible planning, proof gates, bundle behavior, and family boundaries.
- Source and reference/asset traceability for the reconstruction.

### Out of Scope
- The detailed design judgment, examples, references, assets, or procedures inside any child mode packet; the hub loads those packets but does not flatten their logic.
- Reconstructing the contents of shared resources such as the anti-slop principles, cognitive laws, design-token vocabulary, register, or proof cards.
- Implementing or changing the advisor, router, mode packets, transport, extraction pipeline, or downstream `sk-code` consumer.
- Creating `graph-metadata.json`, `description.json`, or any generated packet metadata.
- Claiming runtime execution, validator output, generator output, or downstream implementation verification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-design/007-design-hub-routing/spec.md | Create | Level-2 reconstruction specification for the hub routing layer. |
| .opencode/specs/sk-design/007-design-hub-routing/plan.md | Create | Source-faithful reconstruction plan and routing boundaries. |
| .opencode/specs/sk-design/007-design-hub-routing/tasks.md | Create | Task breakdown for authoring and checking the packet. |
| .opencode/specs/sk-design/007-design-hub-routing/checklist.md | Create | Unchecked Level-2 verification checklist for the reconstruction draft. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the one-advisor identity. | The packet states that the advisor routes design queries to `sk-design`, that the hub selects the mode, and that there is no per-mode advisor map entry or merged-identity projection. |
| REQ-002 | Preserve the registry discriminator. | The packet defines `workflowMode`, `packetKind`, and `backendKind` with the source-defined values and roles. |
| REQ-003 | Preserve all six registry entries. | The packet names interface, foundations, motion, audit, md-generator, and design-mcp-open-design with their packet kind, backend, packet path, command, tool surface, mutability, and metadata routing. |
| REQ-004 | Preserve the router policy. | The packet records default mode `interface`, ambiguity delta `1`, the six-item tie-break order, single/orderedBundle/defer outcomes, default resources, and the `ui-build-bundle` rule. |
| REQ-005 | Preserve signal and vocabulary routing. | The packet records the six router signal groups and the vocabulary classes that supply the mode aliases, intent terms, runtime terms, artifact terms, evaluation terms, and transport terms. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve manager intake and route ordering. | The packet states the five intake fields, the focused-question behavior, and the hard constraint that substantive intake precedes a route declaration or recommendation. |
| REQ-007 | Preserve fallback and ambiguity behavior. | The packet records the confidence threshold, missing-registry, unknown-mode, missing-packet, and path-guard fallback conditions and the four-item unknown checklist. |
| REQ-008 | Preserve hub boundaries and proof cadence. | The packet records smallest-useful-mode routing, explicit-axis bundling, the UI build bundle, visible planning, taste/accessibility/responsive/transport proof, and downstream `sk-code` handoff. |
| REQ-009 | Preserve the transform-verb extension. | The packet records `make it` versus `should it be`, interface aliases, `clarify` alias-only routing, command-projection parity, and the foundations/audit excluded aliases. |

### Registry entries

| `workflowMode` | `packetKind` | `backendKind` | Packet and command | Tool surface | Workspace mutation | Advisor routing |
|----------------|--------------|---------------|-------------------|--------------|---------------------|-----------------|
| `interface` | `workflow` | `reference-base` | `design-interface`; `/design:interface` | Read, Glob, Grep | false | metadata; `design-interface` |
| `foundations` | `workflow` | `reference-base` | `design-foundations`; `/design:foundations` | Read, Glob, Grep | false | metadata; `design-foundations` |
| `motion` | `workflow` | `reference-base` | `design-motion`; `/design:motion` | Read, Glob, Grep | false | metadata; `design-motion` |
| `audit` | `workflow` | `reference-base` | `design-audit`; `/design:audit` | Read, Glob, Grep | false | metadata; `design-audit` |
| `md-generator` | `workflow` | `playwright-extract` | `design-md-generator`; `/design:md-generator` | Read, Glob, Grep, Write, Edit, Bash | true | metadata; `design-md-generator` |
| `design-mcp-open-design` | `transport` | `od-cli-transport` | `design-mcp-open-design`; no command | Read, Bash | false | metadata; `design-mcp-open-design` |

The registry's `advisorRoutingContract` and `extensions` describe this projection and the transport axis. Every registry entry has an `advisorRouting` block with `routingClass: metadata`, `packetSkillName`, and `grandfatheredFolderMismatch: false`; each packet folder is also its `packetSkillName`. The transport has no dedicated command and is reached by mandatory pairing with a design-judgment mode.

The first five entries also expose `proceduresPath` values under their packet folders: `design-interface/procedures`, `design-foundations/procedures`, `design-motion/procedures`, `design-audit/procedures`, and `design-md-generator/procedures`. The transport has no procedures path. Each registry entry records `toolSurface.allowed`, `toolSurface.forbidden`, `toolSurface.mutatesWorkspace`, and `toolSurface.bashAllowlist`: the read-only workflow entries forbid Write, Edit, and Bash and carry an empty allowlist; md-generator has no forbidden tools and its workspace mutation is true; the transport forbids Write, Edit, and Task and carries an empty allowlist. The mode `aliases` arrays are represented by the corresponding mode vocabulary classes below.

### Router policy and signal groups

`hub-router.json` stores the policy under `routerPolicy`: `defaultMode` is `interface`, `ambiguityDelta` is `1`, and `tieBreak` is `interface`, `foundations`, `motion`, `audit`, `md-generator`, and `design-mcp-open-design`. Its `outcomes` are `single` for one dominant design axis, `orderedBundle` for clearly separate design axes, and `defer` for unclear or contradictory intent. The `defaultResource` list is the shared anti-slop principles, cognitive laws, design-token vocabulary, and design proof token. The `bundleRules` entry `ui-build-bundle` applies when both `interface` and `foundations` are present and produces an ordered bundle.

| Mode | Weight | Signal classes | Routed resource |
|------|--------|----------------|-----------------|
| interface | 4 | interface-aliases, interface-taste, interface-build, hub-identity | design-interface/SKILL.md |
| foundations | 4 | foundations-aliases, foundations-color, foundations-type, foundations-layout, foundations-tokens, hub-identity | design-foundations/SKILL.md |
| motion | 4 | motion-aliases, motion-temporal, motion-runtime, motion-feel, hub-identity | design-motion/SKILL.md |
| audit | 4 | audit-aliases, audit-quality, audit-transform-question, audit-accessibility, audit-hardening, hub-identity | design-audit/SKILL.md |
| md-generator | 4 | md-generator-aliases, md-generator-extraction, md-generator-artifacts, md-generator-validation, hub-identity | design-md-generator/SKILL.md |
| design-mcp-open-design | 4 | design-mcp-open-design-aliases, hub-identity | design-mcp-open-design/SKILL.md |

### Transform-verb routing

The registry's `transformVerbRouting` keeps transform verbs split by framing: the interface frame `make it` applies the move, while the audit frame `should it be` evaluates whether the move should happen. `bolder`, `quieter`, `distill`, `clarify`, and `delight` are interface aliases; `clarify` is alias-only. `bolder`, `quieter`, `distill`, and `delight` have command-projection parity. `typeset` and `colorize` are excluded aliases for foundations, while `harden` and `polish` are excluded aliases for audit. The registry states that command metadata projections are a separate layer from free-text transform-verb framing.

### Vocabulary classes

The router exposes these under `routerSignals` and `vocabularyClasses`. The following vocabulary classes and keyword sets are routing evidence, not independent public identities:

- `hub-identity`: `sk-design`, `design-family`, `mode-registry`, `workflowmode`, `backendkind`, `reference-base`, `anti-slop`, `cognitive-laws`.
- `interface-aliases`: `interface design`, `frontend design`, `visual design`, `visual identity`, `make it look good`, `looks templated`, `redesign the ui`, `hero section`, `landing page direction`, `hero redesign`, `ui build`, `design variations`, `less generic`, `custom not templated`, `visual direction`, `bolder`, `quieter`, `distill`, `clarify`, `delight`.
- `interface-taste`: `interface-design`, `frontend-design`, `visual-design`, `visual-identity`, `make-it-look-good`, `looks-templated`, `distinctive-interface`, `intentional-design`, `polished-ui`, `refined-ui`, `custom-not-templated`, `premium-ui`, `aesthetic`, `design-taste`, `visual-direction`, `craft`, `make-it-beautiful`, `less-generic`, plus the spaced forms `custom not templated`, `premium ui`, `make it beautiful`, `less generic`, `visual direction`.
- `interface-build`: `redesign-the-ui`, `hero-section`, `ui-build`, `ux-quality-checklist`, `design-variations`, `redesign the hero`.
- `foundations-aliases`: `foundations`, `design foundations`, `color system`, `oklch palette`, `color token system`, `dark mode palette`, `typography scale`, `font pairing`, `spacing system`, `layout rhythm`, `information hierarchy`, `responsive layout`, `design tokens`, `theme tokens`, `grid`, `container queries`, `context adaptation`, `data visualization`, `chart type`, `data tables`, `token starter`.
- `foundations-color`: `palette`, `color-palette`, `color-system`, `oklch`, `dark-mode`, `themes`, `theming`.
- `foundations-type`: `typography`, `font-pairing`, `typography-scale`, `typography extraction`.
- `foundations-layout`: `spacing-system`, `responsive-layout`, `layout`, `hierarchy`, `information hierarchy`, `density`.
- `foundations-tokens`: `design-tokens`, `color-token-system`, `css-tokens`, `semantic tokens`, `theme-tokens`.
- `motion-aliases`: `motion design`, `animate this`, `micro-interactions`, `transitions`, `interaction states`, `hover state`, `focus state`, `loading state`, `choreography`, `motion budget`, `animatepresence`, `exit animation`, `reduced motion`, `morphing icons`, `motion performance`.
- `motion-temporal`: `motion-design`, `animation`, `animate-this`, `exit-animation`, `reduced-motion`, `morphing-icons`, `motion-performance`, `smooth-animation`, `hover-effect`, `scroll-animation`, `choreography`, `animate-the-menu`, `transition-design`, plus the spaced forms `smooth animation`, `hover effect`, `scroll animation`, `animate the menu`, `transition design`.
- `motion-runtime`: `framer-motion`, `framer motion`.
- `motion-feel`: `interaction-feel`, `interaction feel`.
- `audit-aliases`: `design audit`, `ui critique`, `design review`, `review the ui`, `audit the design`, `accessibility audit`, `wcag contrast`, `performance audit`, `anti-slop detection`, `ai tell`, `production hardening`, `design quality score`, `ui quality review`, `p0 p1 design findings`.
- `audit-quality`: `design-audit`, `ui-critique`, `anti-slop-detection`, `design-quality-score`, `p0-p1-design-findings`, `anti-hallucination`, `design-fidelity`, `design-quality-audit`, `design-review`, `design-qa`, `audit-the-design`, `review-the-ui`, `ui-quality-review`, plus the spaced forms `audit the design`, `review the ui`, `ui quality review`.
- `audit-transform-question`: `should it be`, `should it be bolder`, `should it be quieter`, `should it be distill`, `should it be clarify`, `should it be delight`.
- `audit-accessibility`: `accessibility-audit`, `wcag-contrast`, `wcag contrast`.
- `audit-hardening`: `performance-audit`, `production-hardening`.
- `md-generator-aliases`: `extract design system`, `generate design.md`, `capture website css`, `design tokens from url`, `create design reference`, `style reference`, `tokens.json`, `design-to-markdown`, `extract design tokens`, `validate design.md`, `design.md validation`, `design fidelity check`, `design.md report`, `render design preview`, `source of truth`, `study design.md format`.
- `md-generator-extraction`: `css-extraction`, `website-design-extraction`, `color-extraction`, `typography-extraction`, `hex-extraction`, `shadow-extraction`, `spacing-extraction`, `extract-design-system`, `capture-website-css`.
- `md-generator-artifacts`: `design.md`, `design-md`, `design-reference`, `tokens.json`, `style-reference`, `playwright`, `design-system-generator`, `generate-design-md`, `design-tokens-from-url`, `generate design md`.
- `md-generator-validation`: `design fidelity`.
- `design-mcp-open-design-aliases`: `open design`, `open-design`, `od mcp`, `od cli`, `wire open design`, `connect open design`, `drive open design from the terminal`, `design system from open design`, `od run start`, `start_run`.

### Mode guardrails

- `hub-identity` terms are family context, not child-mode evidence by themselves.
- `interface` owns end-to-end visual direction, application verbs, generic "make it look good", visual identity, hero or landing-page direction, and `make-it` transforms such as bolder, quieter, clearer, or custom-not-templated work.
- `foundations` owns static-system nouns and decisions: color, type, spacing, grid, layout rhythm, hierarchy, responsive adaptation, and design-token systems. Measured `tokens.json` or `DESIGN.md` artifacts route to md-generator unless the request is to design or adapt a token system. The `clarify` alias-only entry and the foundations exclusions `typeset` and `colorize` take the source-defined transform precedence.
- `motion` owns temporal behavior: animation, interaction states, hover/focus/active feedback, transitions, choreography, motion budget, reduced motion, and motion performance.
- `audit` owns evaluation frames: audit, review, critique, WCAG, quality score, AI-template risk, production hardening, and release-readiness questions. A single-axis static review can route to foundations when its axis has a matching proof-gated procedure; multi-axis or audit-specific review routes to audit. The audit exclusions `harden` and `polish` take transform precedence when no findings-first audit report is requested.
- `md-generator` owns measured extraction and fidelity artifacts: live-URL CSS capture, `tokens.json`, `DESIGN.md`, style reference, validation, reports, and provenance.
- Pair modes only when the prompt contains clearly separate design axes. A generic "make it look good" request defaults to interface unless another explicit axis dominates.

### Routing sequence, bundle, and proof

The source-defined routing sequence is: classify the dominant design intent, let an explicit mode hint such as `motion: ...` override classification, read `mode-registry.json`, resolve `workflowMode`, and load the registered packet `SKILL.md`. The selected mode then cites the shared reference base or uses its registered backend.

For UI build, page generation, and redesign implementation, the ordered build bundle includes `interface`, `foundations`, `design-interface/assets/interface_preflight_card.md`, `shared/register.md`, `design-interface/references/design_process/brief_to_dials.md`, and the matching foundations axis references. The source also requires a context manifest from `shared/context_loading_contract.md`, `shared/assets/context_loaded_card.md` before recommendations, and `shared/assets/proof_of_application_card.md` before a ready claim. Interface, foundations, motion, and audit remain read-and-guide modes; md-generator is the only registry-marked mutating mode.

Verifier cadence is intake before routing, visible plan before substantial design or build output, proof review before ready claims, and `sk-code` review or verification after implementation handoff. Taste proof, accessibility proof, responsive proof, and transport proof must come from the relevant mode or actual transport evidence; transport mechanics cannot substitute for design acceptance.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet describes `sk-design` as one advisor-routable identity and identifies hub membership as the route to all six modes.
- **SC-002**: The packet captures the registry discriminator, six entries, transform-verb extension, commands, packet paths, tool surfaces, mutability, and metadata routing.
- **SC-003**: The packet captures the router policy, signal classes, vocabulary classes, default resources, and ordered UI build bundle.
- **SC-004**: The packet records intake ordering, fallback behavior, smallest-useful-mode selection, visible planning, proof gates, transport pairing, and `sk-code` handoff without moving child logic into the hub.
- **SC-005**: Every source claim in the reconstruction can be traced to the three intact hub source files or to a real path named by those files, and the packet remains explicitly a reconstruction draft.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/skills/sk-design/SKILL.md`, `mode-registry.json`, and `hub-router.json` | Any source drift changes the routing contract. | Treat the three intact files as the authority and keep the reconstruction banner visible. |
| Dependency | Child mode packets and shared resources named by the hub | The hub routes and loads them but does not define their detailed behavior. | Cite their real paths as routed resources without reconstructing their contents here. |
| Risk | Per-mode logic could be flattened into the hub packet. | The single-hub architecture and packet ownership would be misrepresented. | Preserve the source-defined routing-only boundary and list child logic as out of scope. |
| Risk | Hub identity vocabulary could be mistaken for child-mode evidence. | A request could route to a child mode on family context alone. | Record `hub-identity` as context and preserve the source vocabulary guardrails. |
| Risk | A transport could be treated as design authority. | Tool output could be mistaken for taste, critique, or acceptance. | Preserve mandatory pairing, transport proof, and `sk-design` ownership of design judgment. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No routing-performance target or benchmark is specified by the three hub sources.
- **NFR-P02**: The packet must not claim runtime execution or measure a router that was not run.

### Security
- **NFR-S01**: The source-defined hub path guard must constrain routed mode paths to a child `SKILL.md` under `SKILL_ROOT`.
- **NFR-S02**: Tool-surface and workspace-mutation claims must remain tied to each registry entry; the packet does not add permissions.

### Reliability
- **NFR-R01**: Missing or low-confidence routing conditions use the source-defined `UNKNOWN_FALLBACK` outcome and disambiguation checklist.
- **NFR-R02**: The mode registry remains the single source of truth for mode mapping; the hub does not hardcode an inventory of child resources.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Low intent confidence below `0.5`: return `UNKNOWN_FALLBACK`, require disambiguation, and return no resources.
- Missing `mode-registry.json`: return the fallback with the source-defined notice to confirm the route before loading a packet.
- Unknown `workflowMode`: return the fallback with a notice that no sk-design mode is registered for the requested mode.
- Missing or unguardable child packet: return the fallback with a notice naming the missing registered packet.

### Error Scenarios
- Unknown intent: confirm the design goal and artifact surface, whether the request creates/guides/animates/audits/extracts, one concrete input, and the proof expected before a ready claim.
- Several uncertain candidate modes with no disambiguating signal: ask one focused question or state a narrowing assumption; do not bundle every candidate.
- Clearly separate design axes: use an ordered bundle; for UI build work the source-defined `interface` plus `foundations` bundle applies.
- Transport-only request: load design judgment through the hub first; the transport never becomes the taste authority.

### State Transitions
- Intake complete: expose goal, surface, inputs, constraints, and proof expectations before declaring a route or recommendation.
- Route resolved: show the selected mode or ordered bundle, loaded context, design moves or audit dimensions, proof, and handoff target.
- Ready claim considered: verify taste, accessibility, responsive, and transport proof; return missing or contradictory proof to the selected mode or audit.
- Implementation handoff: `sk-code` consumes design output after the plan and proof expectations are clear.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One hub contract spanning identity, registry, policy, signals, vocabulary, fallback, proof, and boundaries. |
| Risk | 10/25 | The main risk is routing drift or assigning child behavior to the hub; no runtime source is changed. |
| Research | 12/20 | The reconstruction requires the intact hub source, registry, router, and every real path cited for traceability. |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

## 10. OPEN QUESTIONS

- None are required to reconstruct the stated hub contract; child packet behavior remains owned by each routed packet and the shared resources remain outside this packet.
<!-- /ANCHOR:questions -->

## 11. SOURCES / TRACEABILITY

The following intact paths were read or verified as reconstruction evidence. They are source references, not additional behavior:

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/shared/anti_slop_principles.md`
- `.opencode/skills/sk-design/shared/cognitive_laws.md`
- `.opencode/skills/sk-design/shared/design_token_vocabulary.md`
- `.opencode/skills/sk-design/shared/design_proof_token.md`
- `.opencode/skills/sk-design/shared/register.md`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/shared/assets/context_loaded_card.md`
- `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`
- `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`
- `.opencode/skills/sk-design/design-interface/references/design_process/brief_to_dials.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`

The hub source names these shared paths as default context, build-bundle resources, routed mode packets, or handoff/proof references. This packet cites the paths without reconstructing their contents or claiming that any child packet was executed.

## RELATED DOCUMENTS

- Implementation Plan: See `plan.md`
- Task Breakdown: See `tasks.md`
- Verification Checklist: See `checklist.md`
