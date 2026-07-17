# Iteration 8: Minimal Authored Alignment Routing Scenario Contract

## Focus

Define one new loader-eligible alignment routing fixture that closes the seventh-mode typed-gold gap without promoting an existing `DAL-*` document. The selected interpretation is a minimal, authority-neutral alignment **scope** request: it exercises the public `alignment` workflow mode and only the two child-local leaves that the alignment router deterministically selects for scope.

## Actions Taken

1. Re-read the rendered iteration prompt, canonical agent definition, config, append-only state, reducer strategy, and findings registry before selecting the focus.
2. Inspected the alignment router's intent signals, default resource, scope-phase map, adapter behavior, deduplication, and returned resource bundle.
3. Inspected the benchmark loader's YAML-frontmatter eligibility, exact typed-pair parser, prompt extraction, and conditional `expected_workflow_mode` parsing.
4. Compared loader-eligible sibling fixture naming and frontmatter anchors to derive a distinct alignment routing ID without treating existing alignment documents as gold.

## Findings

1. **Use `DA-R01` as the new stable scenario ID in a new YAML-frontmatter fixture, not an existing `DAL-*` file.** It follows the loader-eligible sibling convention (`DR-Rxx`, `DV-Rxx`, `DI-Rxx`), remains distinct from the existing loader-ineligible alignment corpus, and satisfies the loader's permissive hyphenated-ID grammar. [SOURCE: .opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/loop_setup.md:2,6-7] [SOURCE: .opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/review_setup.md:2,6-7] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:343-365]
2. **The exact prompt should be:** `Run /deep:alignment:auto and ask only the three-axis scoping question for a new alignment lane before discovery.` This supplies the high-weight `alignment lane`, `scoping question`, and `:auto` signals, contains no discover/check/report override, and therefore selects `ALIGNMENT_SCOPE` with routing state `scope`; the fixture should declare `expected_intent: ALIGNMENT_SCOPE` and `expected_workflow_mode: alignment`. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:92-105] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:157-170] [INFERENCE: the prompt matches only the scope signal family and falls through `get_routing_key` to `scope`]
3. **The minimal typed gold is exactly two child-local pairs:** `{workflow_mode: alignment, leaf_resource_id: references/scoping_protocol.md}` and `{workflow_mode: alignment, leaf_resource_id: references/lane_config_schema.md}`. The router always loads the first as its default, then the scope intent and scope phase select the same two resources; its `seen` set deduplicates those repeated selections. These IDs are packet-local and inventory-guarded, so they are the manifest-valid form once the hub manifest is generated. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:88-115] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:128-155] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:183-235]
4. **The fixture must retain both legacy flat gold and typed gold.** Its frontmatter should declare `stage: routing`, `expected_resources` with the same two local paths, `expected_workflow_mode: alignment`, and an `expected_leaf_resources` YAML list whose entries put `workflow_mode` immediately before `leaf_resource_id`. The loader only engages typed scoring when that exact list parses, and only reads `expected_workflow_mode` when typed gold exists. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-165] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:343-417]
5. **Acceptance requires four independent checks:** the exact prompt must parse from an `**Exact prompt**` fenced block; the loader must emit one positive `routing` scenario with no `missing-exact-prompt` warning; both typed pairs must exist under manifest mode `alignment`; and router output must contain exactly those two canonical pairs with no unresolved resources. No adapter leaves belong in this minimal fixture because adapter resources are selected only from explicit dispatch-context adapter/authority keys, which the prompt intentionally omits. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:220-234] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:375-417] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:172-181,183-235]

The resulting authored frontmatter contract is:

```yaml
---
id: DA-R01
stage: routing
expected_intent: ALIGNMENT_SCOPE
expected_resources:
  - references/scoping_protocol.md
  - references/lane_config_schema.md
expected_workflow_mode: alignment
expected_leaf_resources:
  - workflow_mode: alignment
    leaf_resource_id: references/scoping_protocol.md
  - workflow_mode: alignment
    leaf_resource_id: references/lane_config_schema.md
---
```

## Ruled Out

- Adapter-specific leaves were excluded from the minimal gold because the proposed prompt supplies neither an authority nor adapter dispatch-context field; expecting adapter resources would make the oracle depend on context it did not author. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:117-126,172-181,227-228]
- `full_inventory_intent` was excluded because this is a selected scope route, not a request to enumerate the complete alignment packet. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:375-403]
- Packet-qualified values such as `deep-alignment/references/scoping_protocol.md` were excluded from `leaf_resource_id`; the typed parser and alignment router both operate on child-local paths. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-139] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/SKILL.md:143-155]

## Dead Ends

- Existing `DAL-*` documents remain unapproved for promotion. This iteration closed the coverage gap by specifying a new authored fixture and did not retry filename-based inference.

## Edge Cases

- Ambiguous input: The phrase “alignment scenario” could mean scope, discovery, checking, convergence, or reporting. The narrowest deterministic contract is scope because it requires no authority/adapter context and has a two-leaf selected map.
- Contradictory evidence: None.
- Missing dependencies: The generated hub manifest does not yet exist in the researched baseline; manifest membership is therefore an implementation-time acceptance gate, not a claim that typed scoring can run today.
- Partial success: None; the authored contract and static acceptance criteria are fully specified without implementing the fixture.

## Sources Consulted

- `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md:82-236`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:100-234,343-417,427-524`
- `.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/intra_routing_recall/*.md:2,6-7`
- `.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/intra_routing_recall/*.md:2,6-7`
- `.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/*.md:2,6-7`

## Assessment

- New information ratio: 0.80
- Novelty basis: 2 of 5 findings are fully new and 3 are partially new (0.70), plus a 0.10 simplicity bonus for reducing the alignment gap to one exact fixture contract.
- Questions addressed: What exact authored scenario contract closes the alignment coverage gap while remaining loader- and manifest-valid?
- Questions answered: `DA-R01`, its exact prompt, `ALIGNMENT_SCOPE`, workflow mode `alignment`, two canonical leaf pairs, and its authoring/validation gates are now specified.

## Questions Answered

- What exact authored scenario contract closes the alignment coverage gap while remaining loader- and manifest-valid? — Answered by the `DA-R01` contract above.

## Questions Remaining

- Should any existing loader-ineligible file be deliberately promoted through corpus governance? No promotion is inferred or required by this new-fixture contract.

## Reflection

- What worked and why: Joining the alignment router's deterministic scope path to the loader's exact YAML parser produced an oracle whose prompt, mode, and leaves are independently checkable.
- What did not work and why: Existing alignment documents cannot answer the authoring question because they are outside the loader contract and are explicitly saturated as inferred gold.
- What I would do differently: In implementation, generate the manifest first and validate these two memberships before creating the fixture, so an oracle fault cannot be mistaken for a router miss.

## Next Focus

Build a static seven-row oracle matrix for the six previously identified seed scenarios plus `DA-R01`, including expected loader row, manifest membership, selected-map cap, and failure taxonomy for each row; do not implement or rerun the benchmark inside research.

## Recommended Next Focus

Verify that the proposed seven-row seed is mode-complete and oracle-valid as a set, with explicit preconditions and failure diagnostics for the implementation packet.
