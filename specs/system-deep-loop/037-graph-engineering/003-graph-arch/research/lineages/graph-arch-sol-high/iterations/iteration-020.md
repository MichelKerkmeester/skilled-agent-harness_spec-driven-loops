# Iteration 20: Independent Final Cross-Check and Synthesis Handoff

## Focus

This hard-stop iteration independently audited iterations 1–19 against the GraphARC source inventory, all twelve blog files, the two preceding graph-engineering studies, the 036 transition authority plane, and the shipped shared-runtime owners. It checked the eight governance angles, prior-decision classification, source coverage, authority separation, implementation dependencies, falsification coverage, and non-applicability. The result confirms the architecture while requiring three precise corrections to iteration 19 before synthesis.

## Findings

1. **The lineage covers every prioritized governance angle with a cited, prior-decision-classified decision — CONFIRM Decision 1's compiled-projection boundary and iterations 3–10, 15, and 19.** Admission proof, materialization sealing, organization policy, durable human gates, authority-zero refusal, ledger-first observability, hierarchical budget lifecycle, and governance promotion/mutants each have a dedicated mechanism pass plus combined protocol and falsification passes. The final contract set preserves one 036 authority plane: graph-specific evidence can constrain a request, but only current gateway evaluation plus durable append changes domain truth. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-001.md:9-23] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-015.md:9-21] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:87-98]

2. **All twelve blogs are covered, but they are requirements and falsification sources rather than runtime authority or performance proof — CONFIRM iterations 16–18 and REFINE the evidence hierarchy.** The two six-post passes cite every file in `context/blog-posts`; repeated maker/checker, fan-out, and graph-adoption claims are not counted as independent corroboration. The corpus supplies topology, evaluation, fixture, isolation, and non-applicability hypotheses. Unsupported product, cost, alpha, and universal-replacement claims remain excluded from cutover decisions. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-016.md:23-72] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-017.md:23-84] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-018.md:21-21]

3. **Iteration 19's “eight graph-specific semantic families” sentence is a counting error and its storage wording is over-broad — CONTRADICT iteration 19's family count and REFINE iteration 11's storage dependency.** There are eight prioritized governance angles, not eight wire families. Depending on whether source/compiled policy and refusal variants are counted separately, the matrix names more than eight payload schemas. In addition, the repository has shipped 036, sealed-artifact, budget, effect, fencing, and parity stores, but no generic `GraphApprovalGateV1` or `TransitionRefusalV1` runtime module. Synthesis must say those graph gate events and the non-domain refusal journal are new persistence/adapters that remain authority-neutral; it must not imply a shipped generic durable gate/refusal store. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-019.md:5-7] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-011.md:13-13] [INFERENCE: exact inventory of `.opencode/skills/system-deep-loop/runtime/lib/` contains the named shared owner modules but no graph approval/refusal module]

4. **Canonical encoding is shared in implementation but version ownership is contract-specific — REFINE iteration 19's universal `deep-loop-json@1` rule and CONFIRM iteration 4's sealed-artifact boundary.** Authorized-ledger, hierarchical-budget, shadow-parity, and sealed-artifact code all derive hashes through the shared event-envelope `canonicalBytes`/SHA-256 implementation. Only the sealed-artifact registry explicitly exposes `deep-loop-json@1` as its artifact canonicalization profile. Synthesis should require each new payload to bind the canonicalization/version owned by its storage or envelope contract; `SealedCompiledGraphV1` may use registered `deep-loop-json@1`, while graph event, budget, gate, refusal, and parity records must use their owner contract's explicit version rather than copying an artifact-profile label universally. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-types.ts:13-18] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:125-125] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:1283-1283] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/parity-certificates.ts:51-51]

5. **The final decision set is internally consistent after those corrections — CONFIRM iterations 3–15 and REFINE iteration 19's handoff.** `GraphAdmissionProofV1` binds deterministic admission closure; `SealedCompiledGraphV1` binds executable closure; source and compiled organization policy preserve provenance without becoming authority; pure ASK opens a task-instance gate; compile/admission failure emits authority-zero refusal; `GraphExecutionEventV1` is a registered 036 domain payload; `GraphBudgetQuoteV1` is informational while owner reservations/debits/settlements are authoritative; and `GraphParityPromotionEvidenceV1` wraps a generic fresh parity certificate for a separate cutover transition. `GraphTransitionEvidenceV1` is the reference-closed verification bundle, not an omnibus receipt. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-003.md:9-24] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-008.md:9-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-013.md:21-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-019.md:24-35]

6. **Four residual questions are implementation dependencies, not research permission to weaken the contracts — REFINE iteration 18's open-risk ledger.** The generic graph gate/refusal persistence and evidence resolver are unimplemented; graph identity verification is an optional generic-gateway seam that the adapter must make mandatory; hard provider-budget ingestion and multi-host fencing require external owner primitives; and opaque effects remain non-retryable after ambiguous application. Confidence is high (0.95) in authority separation and contract ordering, medium-high (0.85) in schema boundaries, and medium (0.70) in deployability until those components and target-specific primitives exist. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-011.md:11-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-018.md:13-19]

7. **Acceptance must prove owner boundaries and earliest-failing mutants, not merely schema validity — EXTEND iteration 10's mutant program and CONFIRM iteration 15's ordered saga.** A valid implementation must show closed canonical decode, immutable proof/seal subject binding, mandatory identity and evidence verification, task-instance gate freshness, no reservation across human wait, reservation/debit/settlement accounting, fresh gateway allow plus fenced append, intent-before-effect, reference-closed replay, one-way OTel, complete shadow observations, and 036-governed cutover/rollback. Every injected fault must fail at its earliest owner with zero unauthorized domain, gate-release, budget, or effect mutation. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-010.md:9-43] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-015.md:9-21] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/authorized-ledger.vitest.ts:904-976]

8. **The final adoption rule is risk-and-value based, with no “unsafe because controls are unavailable” exception — CONFIRM iterations 16–18 and EXTEND Decision 8's non-applicability boundary.** Use a typed function, harness, loop, manual gate, or ordinary retrieval when work is small, sequential, read-only, directly testable, or lacks material coordination benefit. Conversely, high-risk mutation does not become graph-eligible when durable identity, current authorization, atomic budget/fence semantics, idempotency/reconciliation, or operational rollback are unavailable; it stays manual or unavailable. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-016.md:21-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-017.md:21-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-018.md:21-21]

## Confirmed final decisions

| Decision | Final disposition | Authority owner |
|---|---|---|
| Graphs propose typed transitions and derive projections; they do not own canonical state | Confirmed | 036 gateway + typed append-only ledger |
| Admission proof and compiled seal are separate immutable stages; live facts remain external | Confirmed | Graph compiler/admission and materializer/sealed store |
| Organization policy compiles provenance-preservingly and cannot widen platform/mode ceilings | Confirmed | Organization policy publisher/compiler; 036 policy registry/evaluator |
| ASK, refusal, and authorization denial are distinct outcomes | Confirmed | Gate service; compiler/admission refusal journal; 036 audit respectively |
| Approval binds exact consequence plus run/task/branch and permits only fresh reevaluation | Confirmed | New durable graph-gate service, not GraphARC session state |
| Domain events use the existing 036 envelope/ledger; graph traces and OTel are projections | Confirmed | 036 ledger/replay; export adapter only |
| Quotes are informational; reservations, debits, settlements, and receipts stay hierarchical-budget facts | Confirmed | Existing budget authority |
| Fences are valid only in the protected store's declared compare-and-mutate domain | Confirmed and narrowed | Existing lock/fence authority plus target backend |
| External effects require durable intent and idempotency or conclusive reconciliation | Confirmed and bounded | Existing effect-recovery owner plus target adapter |
| Promotion evidence extends a generic parity certificate and cannot itself flip authority | Confirmed | Existing parity issuer; separate 036 cutover transition |
| `forward_args` defaults false; exceptions require registered schema and sealed canonical arguments | Confirmed after falsification | Governed materializer adapter |

## Changes required from iteration 19

1. Replace “eight graph-specific semantic families” with “eight governance angles represented by multiple versioned graph payload schemas.” Do not assign a misleading aggregate family count.
2. Replace the universal `deep-loop-json@1` statement with owner-specific canonicalization/version binding. Reuse the shared canonical byte implementation, and use the artifact profile name only where registered by the sealed-artifact owner.
3. Replace “existing durable event storage” for `GraphApprovalGateV1` with an explicit unshipped graph-gate persistence dependency; likewise retain iteration 11's new non-domain refusal journal. Both remain non-domain and authority-neutral.
4. Normalize the two short iteration-19 citations (`iteration-015.md`, `iteration-003.md`) to full lineage-relative paths during synthesis so evidence links resolve from the repository root.
5. Preserve `CompiledOrganizationGraphPolicyV1` as the synthesis name only if the implementation spec records it as the deliberate successor/alias of iteration 5's `CompiledOrganizationPolicyV1`; unknown wire names still fail closed.

## Evidence coverage table

| Evidence surface | Coverage | Result / limitation |
|---|---:|---|
| Prior graph study 1 (`001-agent-swarms`) | Iterations 1, 15–18 | Organization/work separation, scheduling, gates, budgets, replay, and evidence boundaries confirmed. |
| Prior graph study 2 (`002-graphene-main`) | Iterations 1, 3, 7–8, 15–18 | P1–P7 authority, refusal, replay, truth, and promotion constraints retained. |
| GraphARC planner/admission/materializer | Iterations 2–4, 7, 10, 15–18 | Useful typed candidate pipeline; proof/seal/argument trust gaps documented. |
| GraphARC policy/approval/session | Iterations 2, 5–7, 12, 15, 18 | Provenance and gate inputs useful; direct invocation and task-identity gaps remain. |
| GraphARC runtime/budget/observe/memory | Iterations 2, 8–10, 13, 16–18 | Diagnostic/local primitives retained; no canonical authority claim. |
| Twelve blog files | Iterations 16–17 plus mechanism passes | 12/12 directly cited; duplicates and unsupported marketing registered. |
| 036 authorized ledger and replay | Iterations 3, 8, 11, 15, 18–20 | Shipped authority spine and verification order confirmed. |
| Mode registry | Iterations 5, 12, 15 | Canonical mode identity/ceiling source only; no tenant policy or verdict ownership. |
| Shadow parity | Iterations 10, 13, 18–20 | Generic certificate and closed observations reused; graph wrapper remains new. |
| Hierarchical budgets | Iterations 9, 14–15, 18–20 | Reservation/debit/settlement ownership confirmed; provider truth remains external. |
| Locks and fencing | Iterations 4, 14–15, 18–20 | Same-commit fence semantics confirmed; no general multi-host guarantee. |
| Receipts/effect recovery | Iterations 6, 14–15, 18–20 | Receipt-linked saga confirmed; opaque-effect ambiguity remains intrinsic. |
| Sealed reference artifacts | Iterations 4, 10–11, 19–20 | Storage composition and canonicalization profile confirmed; graph artifact kind/schema remains new. |

## Contradictions that must remain visible

- GraphARC calls admitted/materialized objects authorized in local prose, but they are forgeable process objects without live 036 binding. The governed adapter must preserve this contradiction as a gap, not normalize the terminology.
- GraphARC session approval can be bypassed by direct invocation and conflates repeated-node task instances. The session remains a compatibility projection, not the durable gate.
- GraphARC policy precedence is deterministic, yet compiled adapters may lose audit provenance and the generic gateway may allow with unverified identity/evidence unless the graph profile denies it.
- GraphARC replay is intentionally observational and can truncate/infer; 036 replay is canonical. Agreement between them is parity evidence, not elevation of the trace.
- Blog claims sometimes treat graph edges, manager PASS, model votes, worktrees, local meters, or retrieval paths as stronger guarantees than the runtime supplies. They remain hypotheses or fixtures.
- Hard budgets, multi-host fencing, and exactly-once opaque effects cannot be derived from graph structure. Missing external primitives narrow or prohibit deployment.

## Residual open questions and confidence

| Open question | Confidence in current boundary | What would close it |
|---|---:|---|
| Exact durable storage/envelope for graph gate and refusal records | 0.85 | Implementation spec choosing owner, event types, replay rules, and retention without entering the domain ledger. |
| Exact graph evidence-resolver interface and mandatory gateway profile | 0.85 | Typed API plus negative tests proving `actor/capability/evidence_verified=true` is mandatory for every graph transition. |
| Provider usage normalization and hard-cost settlement | 0.70 | Authenticated provider receipt adapter with currency/model/pricing version and unknown-usage blocking semantics. |
| Multi-host protected mutation | 0.70 | A backend-specific atomic compare-fence-and-write primitive or one durable fenced broker. |
| Opaque external effects | 0.95 that automatic retry is unsafe | Target idempotency or trustworthy read-after-write reconciliation; otherwise operator resolution is permanent. |
| Final wire names and canonicalization labels | 0.85 | One implementation spec/ADR plus compatibility fixtures for iteration-5 and iteration-19 aliases. |

## Recommended implementation dependency order

This is a research handoff, not authorization to implement.

1. Freeze terminology, wire names, owner-specific canonicalization labels, and negative guarantees in an ADR/schema registry.
2. Register graph sealed-artifact kind and implement `GraphAdmissionProofV1`, `SealedCompiledGraphV1`, and their independent verifiers.
3. Implement source/compiled organization policy with mode-registry projection and provenance-preserving 036 policy registration.
4. Implement the non-domain refusal journal and durable task-instance graph gate; prove neither can append domain state or invoke effects.
5. Implement `GraphTransitionEvidenceV1` resolver and the mandatory graph gateway policy profile.
6. Register `GraphExecutionEventV1` variants and deterministic reducer/projection in the existing 036 ledger.
7. Integrate budget quote with existing reservation/debit/settlement authority, then add lock/fence and effect-intent adapters in the receipt-linked order.
8. Build verified replay-to-OTel as a one-way projection with gap/corruption behavior.
9. Implement independent shadow adapters, closed observation schemas, mutants, and `GraphParityPromotionEvidenceV1`.
10. Run dark read, shadow, gated canary, separate 036 cutover, rollback drills, and only then retire compatibility aliases/surfaces.

## Authoritative acceptance checks

1. Every new payload rejects unknown fields/versions, noncanonical bytes, invalid digests, unbounded collections, and subject mismatch under its owner's registered encoding.
2. Changing proposal, compiler/check set, registry, mode, policy, arguments, factory/body, reducer, writes, destination, or dependency head invalidates the appropriate proof/seal before execution.
3. Pure ASK creates exactly one durable task-instance gate; decision reuse across task/branch/consequence/expiry/dependency change fails and causes no reservation, lease, append, or effect.
4. Compile/admission refusal preserves all diagnostics, carries zero authority, and cannot decode as a 036 domain event, approval, budget receipt, or effect intent.
5. Every graph transition has mandatory verified actor, capability, evidence bundle, current domain head, authority epoch, policy, and event registry; unverified fields deny.
6. A 036 allow audit durably precedes one exact fenced domain append; replay, telemetry, approval, quote, or refusal cannot substitute for its proof/receipt.
7. Budget reservation occurs after gate revalidation and before spawn; every attempt debits and settles, including failure; unknown or excess usage blocks and never maps to convergence.
8. Fence freshness is compared in the protected write's atomicity domain; unsupported multi-host/backend targets fail closed.
9. Effect intent is durable before invocation; stable idempotency/reconciliation owns retry; ambiguous opaque application becomes `in_doubt` with no automatic resend.
10. Replay verifies reference closure, hashes, authorization linkage, causal order, upcaster/reducer/projection identity, and final fingerprint before OTel export.
11. Shadow parity observes the full expected case/branch set, performs no live effect/authority mutation, rejects every governance mutant at the earliest owner, and issues no certificate with divergence or stale binding.
12. Promotion evidence cannot select a writer; a separate 036 transition performs cutover, and rollback drills prove no per-request fallback to legacy after selection.
13. Compatibility fixtures decode the recorded old policy name/aliases explicitly; unknown names and missing upcasts fail closed.
14. A final non-applicability review demonstrates measured coordination/risk value and verifies every required external authority primitive exists for the target deployment.

## Final non-applicability rules

- Do not adopt a graph when a typed function, harness, loop, or manual process meets the workload with lower total operational risk.
- Do not add durable governance to read-only presentation, deterministic local computation, or immutable content-addressed writes unless another protected consequence exists.
- Do not use graph topology, worktrees, fresh context, model diversity, or majority vote as identity, evidence independence, resource ownership, fencing, or authorization.
- Do not use graph retrieval for exact lookup or treat retrieved relations as canonical facts without the separate truth-admission protocol.
- Do not deploy autonomous state-changing graphs without durable identity, current 036 authorization, canonical append, recovery, and rollback.
- Do not promise hard provider spend without authenticated usage/pricing receipts, multi-host fencing without an atomic target/broker, or exactly-once effects without target idempotency/reconciliation.
- Do not use a human gate for acknowledgement or preference with no protected consequence, and do not use `TransitionRefusalV1` for parser/UI/infrastructure errors before a governed candidate exists.
- Do not treat budget/time/iteration exhaustion as success or convergence; record explicit incomplete/escalated state.
- High-risk work with unavailable controls remains manual or unavailable; operational immaturity is never a waiver.

## Ruled Out

- Repeating broad repository scans: prior iterations and the final bounded inventory show they mix legacy and unrelated contracts; owner-specific reads are sufficient.
- Recounting repeated blog claims as independent evidence: passes A/B already expose shared claim families and unsupported marketing.
- Introducing a graph-local omnibus ledger or cross-ledger ACID transaction: no consulted primitive supports it, and it would split authority.
- Treating the iteration limit or new-information ratio as convergence proof: iteration 20 is a hard workflow stop, and synthesis remains a separate reducer/workflow responsibility.

## Dead Ends

- Self-attested GraphARC proof fields, direct compiled invocation, session/checkpoint approval authority, local cost as reservation, trace/OTel authority, and blind opaque-effect retry are definitively exhausted.
- Further research into generic protocol shape is unlikely to reduce implementation risk; the remaining questions require implementation specifications, target-owner primitives, and executable mutants.

## Edge Cases

- Ambiguous input: “all eight prioritized angles” refers to research angles, not an exact wire-family count; resolved by retaining the eight-angle taxonomy and listing schemas individually.
- Contradictory evidence: GraphARC/blog convenience claims conflict with 036/runtime authority semantics; both remain cited, with the shipped authority owner controlling state-changing interpretation.
- Missing dependencies: generic graph gate/refusal persistence, graph evidence resolver, provider receipt normalization, and multi-host target fencing are not shipped; this limits deployability but not the research boundary.
- Partial success: none. The audit completed; implementation remains intentionally out of scope.

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-001.md` through `iteration-019.md`
- `specs/system-deep-loop/037-graph-engineering/context/blog-posts/` (all twelve Markdown files)
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/` planner, policy, session, runtime, observe, memory, harness, gateway, and example inventories
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/`
- `.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/`
- `.opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/`
- `.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/`
- `.opencode/skills/system-deep-loop/runtime/lib/shadow-parity/`
- `.opencode/skills/system-deep-loop/mode-registry.json`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/`
- `specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/`

## Assessment

- New information ratio: `0.60`
- Calculation: 2 fully new correction findings, 4 partially new finalization findings, and 2 confirming/redundant findings; `(2 + 0.5 * 4) / 8 = 0.50`, plus `0.10` simplicity bonus for resolving the family-count, storage-owner, and canonicalization ambiguities.
- Questions addressed: complete-lineage coverage, decision consistency, source coverage, runtime/036 mapping, authority separation, unsupported/duplicated/conflicting claims, implementation order, acceptance checks, and non-applicability.
- Questions answered: the research design boundary and synthesis corrections are complete at max iteration.
- Questions remaining: six implementation/target-specific questions recorded above; none justifies another research iteration in this lineage.

## Reflection

- What worked and why: bounded inventories and direct owner-source checks tested the synthesis claims without retrying exhausted broad scans; source-count and term matrices exposed the iteration-19 family-count and persistence/canonicalization overstatements.
- What did not work and why: the initial all-state display exceeded output limits because the registry and 19 records are large; bounded JSON extraction recovered iteration integrity and strategy constraints without loss of the required control facts.
- What I would do differently: synthesis should normalize all prior-iteration citations to repository-root paths and separate “shipped primitive,” “new adapter/schema,” and “external target dependency” in every contract table.

## Route Proof

- Resolved route: `mode=research`, `target_agent=deep-research`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `20/20`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- LEAF compliance: no subagents dispatched
- Progressive synthesis: disabled; `research.md` intentionally not created

## Recommended Next Focus

Run the workflow-owned synthesis over iterations 1–20, applying the five explicit iteration-19 corrections above. Do not launch iteration 21: iteration 20 is the configured hard stop. The synthesis should produce the canonical research narrative and then hand the implementation dependency order and acceptance checks to a separately scoped implementation specification.
