# mcp-webflow MCP 2.0 Quality-Gap Research

## Status

Final synthesis after 5 of 5 forced-depth iterations. Stop reason: `maxIterationsReached`.

## Executive Summary

The packet is **not uniformly too concise**: its 498-line action inventory gives broad name-level coverage, and its Bridge/CMS high-level models are mostly correct. It is nevertheless **not reliable enough for execution** because depth is concentrated in action names while version identity, request schemas, effect semantics, failure modes, safety precedence, and capability-level tests are incomplete or wrong. The audit found **38 gaps: 1 P0, 30 P1, and 7 P2**.

The highest-risk issue is the missing trust boundary for site-authored Agent Instructions. Webflow automatically supplies those instructions to agents, but the packet never says that they are untrusted content subordinate to operator intent and the frozen DS/PB/DP gates. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:226-252]

## Research Scope

- Five references: action reference, Designer capabilities, tool surface, MCP wiring, troubleshooting.
- Assets: registered-manual reference, payload examples, and worked examples.
- Feature catalog: root plus nine cards.
- Manual testing: root plus 17 scenarios.
- Official evidence: Webflow MCP overview, Designer/Data/Utility tools, architecture, FAQ, migration guide, skills, documentation server, and Data API rate limits.

## Method

1. Establish local inventory and internal contradictions.
2. Validate Designer/Bridge/element/component/style semantics against official pages.
3. Validate content, publishing, operational, and rate semantics.
4. Validate advanced tools, Agent Instructions, limitations, and version migration.
5. Trace all findings into feature cards and manual scenarios.

Every finding is sourced in `iterations/iteration-001.md` through `iteration-005.md`; `findings-registry.json` is the machine-readable index.

## Verdict By Artifact Family

| Family | Verdict | Main Problem |
|---|---|---|
| `action-reference.md` | Broad but too schema-thin | Wrong/mixed version identity; no optional fields, enums, results, limits, or effects |
| `designer-capabilities.md` | Useful architecture, incomplete execution | Missing modes/errors, replace-all style semantics, component/variant invariants |
| `tool-surface.md` | Stale unless explicitly v1.3-pinned | Legacy names conflict with `@latest` local wiring |
| `mcp-wiring.md` | Good auth/rate baseline | Surface/version and script-gate details are incomplete |
| `troubleshooting.md` | Too narrow | Missing `ModeForbidden`, limitations, dynamic tools, migration/input changes |
| Assets/examples | Too concise and partly invalid | Missing required keys and no negative/schema-derived examples |
| Feature catalog | Materially inaccurate | Invented actions, migrated names, publish conflation, malformed metadata |
| Manual playbook | Broad class coverage, insufficient depth | P0 trust boundary and most capability invariants are untested |

## P0 Finding

### Agent Instructions can cross the safety boundary

Site instructions are automatically supplied and may be followed, yet no local contract says they cannot override confirmation gates, production-publish refusal, scope, secret handling, or unknown-tool prohibition. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/intelligence/agent-instructions.md:12-38]

**Required correction:** add a hard precedence/non-override rule to `SKILL.md`, `mcp-wiring.md`, the Agent Instructions card, and DRAFT-002. Test hostile instructions with zero forbidden calls.

## P1 Themes

1. **Version and surface identity:** the “2.0.0” inventory contains v2.0.1 splits; the local baseline is v1.3-shaped while npm uses `@latest`; count-only discovery is insufficient. [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md]
2. **Payload and effect correctness:** examples omit required keys; `set_style`, script setters, and freeform code have replacement semantics; action classes conflate canvas-session state with persistent drafts. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
3. **Component/Designer invariants:** modes, `ModeForbidden`, prop bindings, unlink/unregister constraints, base variants, full-list reorder, breakpoints, pseudos, and branch no-merge handoff are missing. [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
4. **Content lifecycle:** two-step assets, async compression, hidden-field-only form updates, secondary-locale-only writes, unsupported localized-item creation, and effect-specific script gates are absent. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/mcp/faqs.md]
5. **Advanced surfaces:** instruction cascades, `get_more_tools` reclassification, WHTML security/rollback, and known unsupported capabilities need explicit workflows. [SOURCE: https://developers.webflow.com/mcp/tools/utility-tools.md] [SOURCE: https://developers.webflow.com/mcp]
6. **Feature/test truth:** cards invent actions or use migrated names; tests miss trust precedence, style replacement, mode failures, components, assets, localization/forms, WHTML, webhooks, enterprise, dynamic tools, and limitations. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:99-119]

## P2 Themes

- Missing endpoint/cardinality limits and rate-budget detail.
- AI/guide outputs are not labeled advisory.
- Stale counts, wrong links, WHTML typos, malformed frontmatter, and repetitive test boilerplate.

## Confirmed Strengths

- The Bridge boundary is correct: page-building Data tools are headless; live canvas state and snapshots need the Bridge App. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]
- Remote CMS create/update actions produce drafts and publish separately. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- General 60/120/custom rpm, `Retry-After`, SDK backoff, and one Site Publish/minute are correctly recognized. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]
- Discovery-first, unknown-tool fail-closed, least privilege, production-smoke prohibition, and `sk-design` pairing are sound foundations. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:179-252]

## Coverage Matrix

| Official Area | Reference Depth | Card Accuracy | Scenario Coverage |
|---|---|---|---|
| Canvas/Bridge/modes | Partial | Mixed legacy/current | Partial; no `ModeForbidden` |
| Elements/styles/breakpoints | Partial | Missing replace/cascade | Unsafe `set_style` test |
| Components/props/variants/slots | Partial | Variant card inaccurate | Missing |
| CMS drafts/publish | Mostly correct | Publish conflated | Partial |
| Pages/branches | Partial | Merge boundary missing | Missing branch lifecycle |
| Scripts/custom code | Partial/inconsistent gates | Replace effects missing | Only bulk clear/deploy |
| Forms/localization/fonts | Name-level | Inaccurate/unsupported actions | Missing |
| Assets/compression | Name-level | Lifecycle missing | Missing |
| Webhooks/enterprise | Name-level | Limits/plans thin | Missing |
| Agent Instructions | CRUD/cascade partial | Trust boundary absent | P0 case missing |
| WHTML | One row | Security/limits absent | Missing |
| Utility/AI/dynamic tools | Name-level | Advisory/reclassification absent | Missing |
| Rate limits | General baseline | Endpoint details absent | Unsafe live-hammer test |
| Local vs remote | Two static tables | Versions inconsistent | Count-only reconciliation |

## Prioritized Recommendations

1. **P0:** establish immutable instruction precedence and hostile-instruction tests.
2. **P1:** pin/record local and remote versions; regenerate action ownership from 2.0.1+ schemas; add migration fingerprints.
3. **P1:** replace payload examples with complete live-schema-derived envelopes and validation negatives.
4. **P1:** add an effect axis (`read`, `session-navigation`, `draft-add`, `replace-all`, `destructive`, `publish`, `deploy`) alongside risk classes.
5. **P1:** repair Designer/component/content semantics and unsupported-capability routing.
6. **P1:** rewrite inaccurate cards and add invariant-level scenarios for every high-risk family.
7. **P2:** generate limits, counts, links, and metadata; replace real-429 hammering with deterministic fixtures.

## Suggested Remediation Sequence

- Wave 1: P0 precedence, version pins, action/tool crosswalk, invalid payloads.
- Wave 2: replacement/destructive effects, modes, components, assets, localization/forms, branch boundary.
- Wave 3: WHTML/dynamic tools/limitations and missing P1 scenarios.
- Wave 4: P2 limits, rate test design, links/frontmatter/typos/count generation.
- Wave 5: authenticated non-production discovery fixture and full manual replay.

## Residual Risks

- No authenticated `list_tools`/`tool_info` session was available; current deployed schemas must still be captured on a dedicated non-production site.
- Remote deployment can update independently; dated docs are not a substitute for per-session discovery.
- The local npm manual remains unsafe to treat as version-stable while it uses `@latest`.

## Evidence Index

- Local detailed evidence: `iterations/iteration-001.md` through `iteration-005.md`.
- Structured findings: `deltas/iter-001.jsonl` through `iter-005.jsonl`.
- Machine index: `findings-registry.json`.
- Source inventory: `resource-map.md`.

## Initial Findings

- P1: payload examples omit required variable keys and use sitemap keys inconsistent with the packet's own action inventory. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/payload-examples.md:60-79] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:347-358] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:397-416]
- P1: the remote action reference is broad but too schema-thin to serve as a safe invocation contract. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-33]
- P1: Canvas navigation/action classification conflicts between references. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:34-48] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-469]
- P1: the packet lacks an actionable local-to-remote crosswalk. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-56] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:187-193]
- P2: the governing skill says 16 manual scenarios while the playbook declares 17. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:303-305] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:1-3]

## Designer Findings

- P1: mode-aware execution and `ModeForbidden` recovery are absent. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]
- P1: `set_style` is replace-all, but the packet does not require current-style readback or warn that existing styles are removed. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:66-82]
- P1: component prop/binding types, unlink/unregister blast radius, and variant invariants are under-documented. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- P1: canvas navigation is conflated with persistent draft mutation. [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-469]
- P2: breakpoint cascade and breakpoint/pseudo-aware style operations need an explicit execution model. [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- Confirmed: the local Bridge boundary is accurate; only live canvas state and snapshots require the open Bridge App. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]

## Content And Operations Findings

- P1: asset uploads, async compression, replacement behavior, deletion recovery, and folder constraints are under-documented. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- P1: scripts need a register/apply/replace/clear/delete effect model; local gating is internally inconsistent. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:156-163] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:174-179]
- P1: localization writes are secondary-locale-only and new localized CMS items are unsupported, but local doctrine does not say so. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/mcp]
- P1: form submission updates affect user-hidden fields only. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- P1: MCP can create/list/get/delete branches but exposes no merge action; local prose implies a complete merge lifecycle. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- P2: endpoint cardinalities and rate-budget behavior need explicit limits and tests. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]
- Confirmed: remote CMS create/update actions are draft writes with separate publish/unpublish actions. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]

## Advanced And Reconciliation Findings

- P0: site-authored Agent Instructions are supplied automatically, but the packet has no explicit rule preventing them from overriding operator gates and safety contracts. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:226-252]
- P1: the “2.0.0” action reference uses settings/props/variants tools introduced only by the official v2.0.1 split. [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-33]
- P1: the local OSS baseline is v1.3-shaped while the registered npm command uses unpinned `@latest`. [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-56]
- P1: instruction reference/cascade semantics, dynamic `get_more_tools` reconciliation, WHTML constraints, and official unsupported capabilities need explicit workflows. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/mcp/tools/utility-tools.md] [SOURCE: https://developers.webflow.com/mcp]
- P2: webhook/WHTML limits and advisory-evidence rules for AI/guide outputs are absent. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/mcp/installing/documentation-server.md]

## Feature Catalog And Test Findings

- P1: the variants and localization/fonts/forms cards include nonexistent actions or unsupported operations. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:18-44] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md:11-55]
- P1: the Designer card mixes v1.3 names with current headless behavior, and CMS cards conflate item publishing with site-domain publishing. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:19-93] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md:20-45]
- P1: Agent Instructions and Designer scenarios do not test precedence or replace-all style safety. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/draft-write/instructions.md:20-59] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/designer-edit/designer-edit.md:20-59]
- P1: count-based surface reconciliation can falsely pass, the rate scenario intentionally hammers a real API, and major capability families remain untested. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/remote-surface.md:20-59] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/safety-gate/rate-limit.md:20-59] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:99-119]
- P2: catalog metadata has a wrong CMS link, WHTML typos, malformed Designer frontmatter, and repetitive weak assertions. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:61-77] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:1-19]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat every artifact as uniformly too concise | The action inventory is broad; the defects cluster around schema semantics, cross-surface reconciliation, and executable examples. | [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-24] | 1 |
| Assume all Designer operations require the Bridge App | Official architecture restricts the Bridge requirement to live session state and snapshots; Data tools are headless. | [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] | 2 |
| Assume remote CMS create/update writes are immediately live | Official remote actions create/update drafts and publish separately. | [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] | 3 |
| Treat local OSS and remote as transport variants of one contract | Migration changes tool names, action locations, inputs, Bridge requirements, and behavior. | [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md] | 4 |
| Treat 17 scenarios as comprehensive MCP 2.0 coverage | Operation-class coverage omits most capability-specific invariants and advanced failures. | [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:99-119] | 5 |

## Open Questions

- No research key questions remain.
- External verification dependency: capture a versioned authenticated `list_tools`/`tool_info` fixture from a dedicated non-production site.

## Divergence Map

- Saturated directions: local inventory, official Designer, content operations, advanced/version reconciliation, catalog/test traceability.
- Pivots taken: none; stop policy forced five sequential breadth passes.
- Remaining frontier: implementation and live-schema verification, not additional desk research.

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 5 / 5
- newInfoRatio trend: `[1.00, 0.88, 0.82, 0.91, 0.86]`
- Average newInfoRatio: 0.894
- Last-three average: 0.863
- Convergence threshold: 0.05
- Composite novelty vote: CONTINUE (not converged); hard max-iteration cap terminated the run
- Quality guards: source diversity PASS; focus alignment PASS; no single weak-source dominance PASS
- Graph gate: not persisted because the detached write boundary excluded external graph/database mutation; iteration graph events remain in JSONL/deltas
