# Deep Research Strategy: mcp-webflow Quality Gaps

## 1. Research Topic

Audit `.opencode/skills/mcp-tooling/mcp-webflow` for overly concise or missing Webflow MCP 2.0 logic across references, assets, feature-catalog cards, and the 17-scenario manual-testing playbook.

<!-- ANCHOR:key-questions -->
## 2. Key Questions

- [x] Q1: Does the local packet accurately and sufficiently describe its own tool inventory, safety boundaries, payloads, and local-versus-remote reconciliation? Answer: broad but not reliable enough; see iterations 1 and 4.
- [x] Q2: Does it cover the official Designer canvas, Bridge App, element-tree, component, style, variable-mode, and breakpoint semantics deeply enough for reliable execution? Answer: architecture yes, execution semantics no; see iteration 2.
- [x] Q3: Does it cover CMS drafts, sites/pages, publish/branches, scripts, forms, localization, assets/compression, webhooks, and enterprise behavior deeply enough? Answer: breadth yes, lifecycle constraints no; see iteration 3.
- [x] Q4: Does it cover AI tools, agent instructions, WHTML, utility tools, rate limits, and remote-only/local-OSS differences without overclaiming support? Answer: no; see iteration 4.
- [x] Q5: Do the nine feature cards plus root and all 17 manual scenarios trace to the important official behavior, edge cases, and failure modes? Answer: broad class coverage, but major factual and test gaps; see iteration 5.
<!-- /ANCHOR:key-questions -->

## 3. Non-Goals

- Do not implement fixes or modify the audited skill packet.
- Do not authenticate to or mutate a live Webflow workspace.
- Do not infer remote tools solely from the local OSS repository when official remote documentation differs.

## 4. Stop Conditions

- Complete exactly five iterations because `stopPolicy=max-iterations`.
- Every reported gap must cite a local file/line or official URL.
- Final synthesis must classify concrete gaps as P0, P1, or P2 and recommend bounded corrections.

<!-- ANCHOR:answered-questions -->
## 5. Answered Questions

- Q2: The Bridge boundary is correct, but mode errors, replacement semantics, component/variant constraints, effect classification, and breakpoint/pseudo behavior are materially under-documented. (iteration 2)
- Q3: Remote CMS draft behavior is correct, but asset, script, locale, form, branch, endpoint-limit, and rate-budget semantics are incomplete. (iteration 3)
- Q1: The broad inventories are undermined by incomplete payloads, effect classes, stale version labels, and no action-level surface crosswalk. (iterations 1 and 4)
- Q4: Agent Instructions create an undocumented trust boundary; WHTML, dynamic tools, limitations, and migration logic are incomplete. (iteration 4)
- Q5: Several cards contain nonexistent or migrated actions, and the scenario suite omits most capability-specific invariants and advanced failure modes. (iteration 5)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 6. What Worked

- Cross-reading the action table, semantic reference, and examples exposed contradictions hidden by any single artifact. (iteration 1)
- Grouped official Designer/Data pages exposed behavior omitted from the local required-parameter inventory. (iteration 2)
- Comparing action descriptions rather than names exposed irreversible, replace-all, async, and cardinality behavior. (iteration 3)
- Official migration tables established exact version/tool relocation facts and exposed mislabeled local inventories. (iteration 4)
- Mapping each prior finding to cards and scenarios exposed false coverage claims and unsafe test design. (iteration 5)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 7. What Failed

- Local packet evidence cannot validate deployed remote semantics without official documentation or live discovery. (iteration 1)
- Guessed per-tool official URLs are not canonical; grouped tool-family pages must be used. (iteration 2)
- Guessed individual REST branch/publish URLs were stale; grouped MCP docs supplied the needed boundary evidence. (iteration 3)
- Static counts cannot reconcile auto-updated remote and `@latest` local surfaces. (iteration 4)
- Scenario/card counts are not a useful coverage measure without invariant-level traceability. (iteration 5)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 8. Exhausted Approaches

None.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 9. Ruled-Out Directions

- Treating the entire packet as uniformly too concise: the 498-line action inventory is broad; the gap is uneven executable depth. (iteration 1, evidence: `references/action-reference.md:12-24`)
- Assuming every Designer operation requires the Bridge App: official architecture limits the requirement to live canvas/session state and snapshots. (iteration 2, evidence: official how-it-works)
- Assuming remote CMS create/update is live: official remote actions create/update drafts and publish separately. (iteration 3, evidence: official Data tools)
- Treating local OSS and remote as transport-only variants: official migration records name, location, input, Bridge, and behavior changes. (iteration 4, evidence: official migration guide)
- Treating 17 scenarios as comprehensive coverage: the suite omits most capability invariants and advanced failures. (iteration 5, evidence: manual scenario index)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10. Divergence Frontier

- Completed pivots: 0
- Saturated directions: none
- Remaining frontier: remediation and authenticated live-schema verification; no research key questions remain
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11. Carried-Forward Open Questions

- None. Live authenticated schema discovery remains an external verification dependency.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 12. Next Focus

Remediate the Agent Instruction trust boundary first, then version/payload/effect correctness, then feature/test coverage and metadata hygiene.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 13. Known Context

- Source pointers: `.opencode/skills/mcp-tooling/mcp-webflow/references/`, `assets/`, `feature-catalog/`, and `manual-testing-playbook/`.
- The packet contains five named references, two root assets plus five worked examples, nine feature cards plus a root catalog, and 17 scenario snippets plus a root playbook.
- `resource-map.md` is not present in the target spec; skipping the existing-map coverage gate.
- Spec write-back and continuity save are outside this detached lineage's authorized write root and will be recorded as skipped.

## 14. Research Boundaries

- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only before iteration 5)
- Stop policy: max-iterations
- Allowed write root: `.opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/sol-high-fast`
- Audited files are read-only.
