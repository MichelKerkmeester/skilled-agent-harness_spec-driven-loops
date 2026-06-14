# Deep Research Strategy: Claude Design parity for sk-interface-design and mcp-magicpath

## Research Topic

How can `sk-interface-design` and `mcp-magicpath` be improved so their UI-design results get closer to Claude Design, while preserving their CLI-skill boundaries and the anti-default philosophy of `sk-interface-design`?

## Known Context

- Packet objective: `.opencode/specs/skilled-agent-orchestration/148-sk-interface-design/005-claude-design-parity-research/spec.md` defines a research-only parity analysis across design-system inheritance, iteration and visual feedback, context grounding, quality levers, and output/handoff.
- Parent `resource-map.md` was not present at init; skipping parent resource-map coverage gate.
- Claude Design baseline sources were fetched from Anthropic support articles for the user flow, design-system setup, and admin rollout.
- Local skill evidence came from `.opencode/skills/sk-interface-design/` and `.opencode/skills/mcp-magicpath/` references.

## Key Questions

- [x] What Claude Design capabilities matter for two CLI skills rather than a hosted design product?
- [x] Where does `sk-interface-design` already match the target experience?
- [x] Where does `mcp-magicpath` already match the target experience?
- [x] Which improvements should be ADOPT, ADAPT, or SKIP per skill?
- [x] What negative knowledge should constrain a follow-up implementation packet?

## Answered Questions

- Claude Design parity should be scored across design-system inheritance, context grounding, conversational/visual iteration, quality levers, output/handoff, and governance/rollout.
- `sk-interface-design` is strong in design judgment, anti-default calibration, copy, and quality floor, but weak in persistent design-system snapshots, visual feedback loops, and handoff artifacts.
- `mcp-magicpath` is strong in canvas authoring, themes, repo-to-canvas import, and code submit flows, but weak in guided conversational iteration, comment-to-change loops, visual fidelity gates, and handoff manifests.
- The highest-value follow-up is a shared Claude Design parity protocol used by both skills, not a hosted-product clone.

## What Worked

- Grounding Claude Design in the support article feature set prevented overfitting to a vague product impression.
- Reading the two skills separately exposed complementary strengths: `sk-interface-design` owns design intent, while `mcp-magicpath` owns canvas execution.
- Ranking by ADOPT, ADAPT, SKIP made product-boundary decisions explicit.

## What Failed

- Cross-lineage agreement cannot be established inside this single gpt55fast lineage.
- Parent `resource-map.md` was absent, so this lineage had to build its own evidence map from direct reads.

## Exhausted Approaches

- Searching for a local packet-level parent `resource-map.md`; absent.
- Treating Claude Design parity as simple visual generation; insufficient because design-system setup, context, iteration, export, and handoff are core capabilities.
- Turning `sk-interface-design` data files into a generator; contradicted by the skill's critique-against rules.

## Ruled-Out Directions

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Hosted Claude Design clone | Out of scope for two CLI skills; would require product UI, storage, export services, and org administration. | `spec.md` out-of-scope and Claude Design support article |
| Auto-generate design systems from `sk-interface-design` CSVs | The catalog is explicitly critique-against fuel, not a chooser or generator. | `.opencode/skills/sk-interface-design/references/design_inventory.md:67` |
| Use MagicPath `add`/`inspect` for repo-to-canvas import | The repo import flow is the inverse direction and must use `code start` to `code submit`. | `.opencode/skills/mcp-magicpath/references/working_with_repositories.md:14` |
| Claim cross-model consensus inside this lineage | Only the parent merge can compare gpt55fast and opus lineages. | `spec.md` R4 |

## Next Focus

Complete. Parent synthesis should merge this lineage with sibling lineages, cross-check ADOPT/ADAPT/SKIP rankings, and resolve disagreements around how much MagicPath should own visual critique versus delegating to `sk-interface-design`.

## Non-Goals

- No implementation changes to `sk-interface-design` or `mcp-magicpath`.
- No attempt to clone Claude Design's hosted canvas or export product.
- No direct modification of parent spec docs from this lineage.

## Stop Conditions

- Stop after 5 iterations or earlier if all key questions have evidence-backed answers.
- Stop after producing the lineage `research.md`, iteration files, JSONL state, registry, dashboard, and resource map under the requested artifact directory.
