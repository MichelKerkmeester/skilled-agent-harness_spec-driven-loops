# Iteration 15: Router/Mode Boundary

## Focus
Make the five commands genuinely useful without forking design doctrine.

## Findings
1. **Command owns public choreography:** user-facing command name/description, progressive intake, context manifest, grounding request, stage order, approval checkpoints, visible output contract, and explicit downstream handoff. This is reusable creation scaffolding, not taste.
2. **Mode owns judgment:** classification, Design Read, axis/mode-specific references, procedure selection, aesthetic/technical decisions, critique standards, proof gates, and domain-specific failure behavior. Stable internal `workflowMode` values remain `interface`, `foundations`, `motion`, `audit`, `md-generator`. [SOURCE: .opencode/skills/sk-design/mode-registry.json]
3. **Transport owns operations:** Open Design, browser, Figma, Refero/Mobbin, and extraction backends retrieve/render/inspect/write only within their contracts. They do not select taste or override mode authority. `sk-code` alone owns application-code implementation and stack verification. [SOURCE: .opencode/skills/sk-design/shared/sk-code-handoff.md:9-18]
4. **Context envelope:** `{command, workflowMode, request, resolvedBrief, assumptionLedger, contextManifest, groundingRecord, constraints, stage, acceptedDecisions, proofPlan, mutationBoundary, outputTarget}`. Each stage appends evidence; no layer reinterprets accepted decisions silently.
5. **Dispatch pattern:** command loads `sk-design` with one registry mode; `interface:design` may order the foundations build bundle after direction; transports are nested only when the selected mode calls for them; accepted implementation work emits the shared handoff. This retains one authority path and makes command templates testable.

## Responsibility Matrix
| Concern | Command | Mode | Transport | sk-code |
|---|---:|---:|---:|---:|
| intake/stage UX | owner | consume | no | no |
| design judgment | no | owner | no | no |
| retrieval/render/extract | request | specify | owner | no |
| app-code mutation | handoff | accept | no | owner |
| design proof definition | present | owner | collect | implementation proof |

## Ruled Out
- Copying mode reference tables or quality doctrine into commands.
- Letting transport availability choose design direction.
- Renaming internal mode IDs to match public commands.

## Assessment
- New information ratio: 0.44
- Novelty justification: Defines an exact four-layer authority model and a stage-persistent context envelope.

## Recommended Next Focus
Adversarially test the templates against vague briefs, conflicting evidence, unavailable tools, and non-runnable targets.
