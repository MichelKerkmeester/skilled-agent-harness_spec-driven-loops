# Iteration 004 — 036 Capability and Ownership Gap Audit

## Focus

Resolve P4 by comparing the integration design's assumed primitives with the actual 036 dark implementation.

## Findings

1. **The authority substrate is real but dark.** The typed ledger, transition gateway, current-head/epoch checks, append fencing, mode states, cutover evidence bindings, rollback windows, budgets, and effect receipts are present. The per-mode selector explicitly calls itself “dark, unwired,” defaults unknown modes to legacy, and only advances from `cutover_ready` to `new_authoritative_reversible`. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:5] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:74] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:5] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:18] [INFERENCE: implementation existence satisfies primitive reuse, not target-state enforcement.]

2. **Capability matrix.** `present`: transition gateway/ledger, replay fingerprinting, single-host locks/fences, hierarchical budgets, receipts/effect recovery, cutover certificates, rollback windows. `shadow-only`: dark ledger adapter, shadow parity, per-mode authority flip, rollback drills with no sibling consumer. `missing`: graph admission/materialization, belief projection, organization-policy compiler, durable human-gate/refusal journal. `adapter-owned`: graph event schemas, graph identity/evidence resolver, knowledge/memory projections, budget normalization, effect policies, and graph-to-036 bridge. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/rollback-drills/README.md:30] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/types.ts:46] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:452] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:222] [INFERENCE: “adapter-owned” means the 036 hook exists but graph semantics do not.]

3. **The largest safety gap is decision provenance, not storage.** 036 can bind cutover evidence and deny malformed transitions, but S2/S3 require durable ASK/approval/refusal state and an organization-policy decision. Those graph-governance producers are absent, so authorizing graph execution today would require unverifiable caller assertions. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/types.ts:81] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:386] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:67] [INFERENCE: fail-closed integration must refuse until these producers exist and are digest-bound.]

4. **Minimum cutover-critical build is an adapter slice, not a second authority plane.** Build six components in dependency order: `(a)` typed graph IR compiler/materializer, `(b)` graph admission plus identity/evidence resolver, `(c)` memory/knowledge/belief reducers, `(d)` organization policy plus durable gate/refusal ledger, `(e)` graph-specific budget/effect adapters, `(f)` a shadow bridge that assembles the six-family promotion certificate for the existing 036 cutover gateway. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:23] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:505] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:192] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:126] [INFERENCE: reuse of 036 ledger/cutover/recovery primitives minimizes new authority code.]

5. **Cutover remains blocked after the adapter slice until evidence is measured.** The existing certificate already requires parity, rollback-drill, mixed-version, migration, and policy evidence, but graph-specific governance and harness mutants plus baseline deltas must be added as independently failing bindings. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/cutover-certificate/types.ts:46] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:193] [INFERENCE: the prototype can reuse the certificate builder only after extending its evidence schema or nesting a graph promotion certificate under an existing digest.]

## Sources Consulted

- Actual 036 runtime: authority-flip types, cutover certificate types, rollback-drill consumer status, plus previously inspected ledger, gateway, locks, budgets, and receipts modules.
- S1 graph IR assumptions: lines 23–31.
- S2 durable gates and rollout dependencies: lines 386–523.
- S3 assumed primitives and explicit audit gap: lines 178–253.
- S5 mutant and measurement obligations: lines 126–206.

## Assessment

- New information ratio: 0.91.
- Novelty justification: replaced study assumptions with a four-state implementation inventory and a six-component minimum build.
- Confidence: high on repository presence/absence; medium on production deployment state beyond the explicit dark/unwired contract.

## Reflection

- What worked: classifying primitive availability separately from authority wiring.
- What failed: treating a compiled module as a live enforcement point.
- Ruled out: duplicating ledger/cutover/recovery; enabling graph authority before durable policy/gate/refusal evidence.

## Recommended Next Focus

P5 — close the graph/subgraph/LEAF action and escalation vocabulary.
