# Iteration 001 — Live phase-tree inventory

## Focus

Build an authoritative inventory of the live direct-child tree and nested phase-parent structure, then compare names, numbering, duplicate-number collisions, and status/structure claims against the parent `spec.md` phase map.

## Route Proof

- `mode`: `research`
- `target_agent`: `deep-research`
- `agent_definition_loaded`: `true`
- `resolved_route`: `Resolved route: mode=research target_agent=deep-research`
- `executor`: `{"kind":"cli-codex","model":"gpt-5.6-sol","reasoningEffort":"medium","serviceTier":"fast"}`

## Actions Taken

1. Read the packet-local config, append-only state log, strategy, and findings registry before investigating.
2. Enumerated direct numbered directories under the packet root and compared them one-for-one with the parent phase map.
3. Used `children_ids` rather than incidental directories such as `research/`, `scratch/`, and `reviews/` to identify phase parents.
4. Traversed the live numbered hierarchy through Group E and Group F, including the duplicate `012` siblings and the nested `015` phase parent.
5. Compared every direct-row status against the child `spec.md`, `implementation-summary.md`, and `graph-metadata.json` status surfaces where present.

## Authoritative Inventory

### Direct layer

The root has exactly 21 direct numbered children with unique prefixes `001` through `021`. Their folder names match all 21 rows in the parent phase map:

- Group A: `001-router-audit-and-fix-map` through `004-router-standardization-and-regen`.
- Group B: `005-create-skill-smart-routing-notes` through `009-create-packet-routing-conformance`.
- Group C: `010-sk-doc-routing-research` through `014-benchmark-harness-typed-wiring`.
- Group D: `015-sk-code-router-alignment` through `019-sk-prompt-routing-research`.
- Group E: `020-router-unification-program`.
- Group F: `021-documentation-quality-program`.

The canonical parent map lists those exact names and assignments. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:96] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:116]

### Nested phase-parent layer

- `020-router-unification-program` is a phase parent with seven direct children, `001`–`007`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:6]
- `020/.../005-oob-idea-deep-dives` is a phase parent with eight direct children, `001`–`008`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/005-oob-idea-deep-dives/graph-metadata.json:6]
- `020/.../007-unified-refactor-implementation` is a phase parent with 16 direct child directories. Its numeric prefixes span `000`–`015` but are not unique because two siblings use `012`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/graph-metadata.json:19]
- Within `020/.../007`, phase parents are `005-calibration` (3 children), `006-parent-hub-rollout` (7), `009-non-hub-rollout` (4), and `015-routing-coverage-activation-verification` (14). [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/005-calibration/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:6]
- `021-documentation-quality-program` is a phase parent with 11 direct children, `001`–`011`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/graph-metadata.json:6]

The two potentially ambiguous facts are now resolved. The duplicate `012` collision is below `020/007`, not at the root `001`–`021` layer, and its local phase map explicitly acknowledges it. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/spec.md:50] The direct child `015-sk-code-router-alignment` is not a phase parent (`children_ids` is empty); the phase parent named `015` is the deeper `020/007/015-routing-coverage-activation-verification` packet. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:6] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/graph-metadata.json:6]

## Findings

### Important / P1 — Parent status labels and child machine status are not reconciled

The parent map's direct names, counts, and group membership are accurate, and its human-facing status labels generally follow the freshest narrative evidence. However, five active/research-complete rows disagree with the corresponding child graph status:

- Parent `015` says `In progress`, while the child `spec.md` and graph both say `Planned`; its implementation summary separately says `IN PROGRESS (~70%)`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:110] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/spec.md:60] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-sk-code-router-alignment/implementation-summary.md:52]
- Parent `018` says `In progress`, while the child `spec.md` and graph say `Planned`; its implementation summary says research is in progress at 0%. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:113] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-system-deep-loop-routing-research/spec.md:46] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-system-deep-loop-routing-research/graph-metadata.json:42] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-system-deep-loop-routing-research/implementation-summary.md:54]
- Parent `019` says `Research-complete` and the child spec agrees, but child graph metadata remains `in_progress`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:114] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/spec.md:46] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research/graph-metadata.json:42]
- Parent `020` says `Active (nested program)` and `021` says `In progress (nested program)`, while both child-parent graphs say `planned`. Their descendant docs substantiate that work is active, so the parent labels are more current than the graph values rather than demonstrably wrong. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:115] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-router-unification-program/graph-metadata.json:41] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/graph-metadata.json:45] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/021-documentation-quality-program/spec.md:15]

Impact: a human resuming from the parent map and an automated resume path reading graph metadata receive different lifecycle states. This iteration does not classify the parent labels as stale; it establishes that status truth is split and must be reconciled during the metadata-focused pass.

### Informational / invariant — Direct phase map is a bijection with the live root tree

No direct child is omitted, duplicated, misnamed, or assigned to the wrong A–F range. The parent accurately describes the direct layer as a flat `001`–`021` grouping and correctly identifies Groups E and F as nested programs. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:64] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:69] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:92] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/spec.md:122]

## Questions Answered

- Does the parent phase map match all direct children? Yes for direct names, count, numbering, and A–F membership.
- Where is the duplicate `012` collision? Under `020/007`; it is not a root collision and is acknowledged locally.
- Which `015` is a phase parent? The nested `020/007/015`; direct root child `015-sk-code-router-alignment` is a standard packet.
- Do parent statuses match every child status surface? No. The parent narrative is generally current, but several child specs and graph records conflict with it.

## Ruled-Out Attempts

- A max-depth directory scan was rejected as a phase-parent detector because it over-counted incidental `research`, `scratch`, `design`, and `reviews` directories. `children_ids` plus numbered direct-child basenames is the reliable structural test.
- A root-level duplicate-`012` hypothesis was ruled out: all root numeric prefixes are unique. The collision is confined to the nested `020/007` layer.
- A hypothesis that direct root child `015-sk-code-router-alignment` is a phase parent was ruled out by its empty `children_ids`; the similarly numbered nested `015` is the phase parent.
- Parent rows `020` and `021` were not marked stale merely because their graph metadata says `planned`; live descendant evidence supports the parent's active/in-progress labels.

## Questions Remaining

- Which lifecycle surface is intended to be authoritative when a child spec, implementation summary, graph metadata, and parent map disagree?
- Does `context-index.md` preserve the same direct inventory and correctly explain the nested `012` and `015` distinctions?
- Do parent metadata `children_ids`, derived status, active-child routing, and source fingerprints encode the live hierarchy consistently?

## Next Focus

Audit workstream A–F membership and per-workstream synthesis in `context-index.md`, using this inventory as the structural baseline and checking especially for confusion between direct `015`, nested `020/007/015`, and the duplicate nested `012` siblings.

## Novelty

`newInfoRatio: 0.90` — this first evidence pass established the complete live hierarchy, resolved both numbering ambiguities, proved the direct phase-map bijection, and isolated lifecycle-state drift for later metadata analysis.
