---
title: "Orientation Seed — graph-arch (GraphARC) → graph-based deep-loop (Repo Study 3)"
description: "Pre-research orientation for the 20-iteration graph-arch deep-research run: GraphARC's Python governance-wrapper (admission, policy, approvals, audit, materialization, replay-to-OTel), how it applies graph engineering, a comparison against repo studies 1 (agent-swarms) and 2 (graphene-main), the deltas for our design, and 8 prioritized research angles."
provenance:
  produced_by: "cli-codex executor, model gpt-5.6-sol, reasoning=high, service_tier=fast"
  dispatch: "read-only orientation dispatch (single), stdin-detached"
  produced_at: "2026-08-13"
  scope: "read-only analysis of context/graph-arch + context/blog-posts + 001-agent-swarms + 002-graphene-main research (build-on) + system-deep-loop runtime + 036 authority plane"
  role: "seed for the follow-on /deep:research 20-iteration run over this phase child"
  builds_on:
    - "specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md"
    - "specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md"
---

# Orientation Seed — graph-arch (GraphARC) → graph-based deep-loop (Repo Study 3)

> Authored by a gpt-5.6-sol (high, fast) orientation dispatch. Read-only analysis. This document seeds the 20-iteration deep-research run in this phase child and BUILDS ON repo studies 1 (agent-swarms) and 2 (graphene-main) — every finding is framed as confirm / refine / extend / contradict against a prior decision. Claims are marked OBSERVED-IN-CODE vs INFERRED; citations use `GA/` = `../context/graph-arch/`, `BLOG/` = `../context/blog-posts/`, `AS1/` = `../001-agent-swarms/`, `GR2/` = `../002-graphene-main/`.

---

## 1. GRAPH-ARC SUMMARY

GraphARC is a Python governance wrapper around LangGraph. Its central contract is: a model proposes work; deterministic code checks the proposal; only an admitted, fingerprint-matched proposal can be materialized and executed. Runtime state is typed, node writes are allowlisted, work is budgeted, and execution is recorded in JSONL. `[GA/README.md:17-20,46-67]` `[GA/pyproject.toml:42-47]`

Its architecture has six main surfaces:

- `planner/` defines typed proposals, registry-backed node kinds, admission, materialization, iterative replanning, and file-based approvals. `[GA/grapharc/planner/proposal.py:95-196]` `[GA/grapharc/planner/admission.py:1-80]`
- `policy/` loads immutable TOML policies over tools, nodes, edges, spend, tenants, and approver roles; evaluates deny → ask → allow; and records decisions and approvals. `[GA/grapharc/policy/document.py:14-29,141-205]`
- `runtime/` wraps LangGraph with typed state, declared writes, checked routing, explicit fan-out, convergence reasons, verification, and per-run budgets. `[GA/grapharc/runtime/graph.py:334-469,782-836]`
- `harness/` and `gateway/` constrain tools, execution environments, retries, providers, token use, and provider-reported spend. They are capability/enforcement adapters, not graph-transition authorities.
- `session/` adds durable message queues, checkpoint-backed resume, interrupts, and node-boundary approval holds. `[GA/grapharc/session/runtime.py:1-34]`
- `observe/` derives replay, diffs, cost reports, metrics, and OTel spans from the JSONL trace. `[GA/grapharc/observe/trace.py:1-12]`

This **CONFIRMS AS1’s graph-as-projection direction**, but GraphARC’s “admission authorizes” language must be interpreted within its narrower planner/operator boundary, not as a replacement for 036. Its own materializer states that an `AdmissionResult` is forgeable ordinary data and that the boundary is planner-versus-operator, not operator-versus-authority. `[GA/grapharc/planner/materialize.py:54-60]` `[AS1/research/research.md:3-9]`

## 2. HOW GRAPH-ARC APPLIES GRAPH ENGINEERING

- **Admission — REFINES AS1 Decisions 1 and 7. OBSERVED-IN-CODE.** Every proposal is checked for registered node kinds and endpoints, node/edge policy, registry-derived worst-case cost against remaining budget, nesting depth, optional reachability, and acyclicity. All checks run and return stable codes, subjects, details, and remedies; refusal never silently trims work. `[GA/grapharc/planner/admission.py:9-41,101-145,551-596]` Tests cover pre-execution budget refusal, depth, nested scopes, cycles, entry edges, unreachable nodes, and complete multi-check rejection. `[GA/tests/test_admission.py:583-628,701-822,848-904,1456-1515]` This concretizes the blog’s rule that graph governance belongs in structure rather than prompt memory. `[BLOG/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:62-70]`

- **Proposal → admit → materialize — EXTENDS AS1’s compiled-topology decision. OBSERVED-IN-CODE.** The proposal separates planner-chosen instance names from governed registry kinds and hashes its exact serialized content. `[GA/grapharc/planner/proposal.py:95-120,248-255]` Materialization requires an admitted result for the same proposal ID and fingerprint, sources executable bodies only from the operator registry, confines dynamic routing to admitted outgoing edges, and retains kernel write/budget/trace checks. `[GA/grapharc/planner/materialize.py:1-43,239-335]` Tests demonstrate that rejected or approval-pending proposals cannot build, edited proposals fail fingerprint comparison, and undeclared dynamic transitions fail. `[GA/tests/test_planner_loop.py:290-340,656-709]`

- **Governed replanning — CONFIRMS dynamic work graphs. OBSERVED-IN-CODE.** Every discovered round re-enters the same checker; structured rejection feedback becomes replanning input, never an automatic policy downgrade. `[GA/grapharc/planner/loop.py:1-31,418-506]` This implements the blog’s ephemeral work graph while keeping the admissible organization fixed. `[BLOG/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:124-170]`

- **Policy, approval, audit — EXTENDS AS1 Decision 7 and REFINES Decision 4. OBSERVED-IN-CODE.** Policy documents are immutable, digest-bound, default-deny rule sets over `tool|node|edge|spend`; deny outranks ask, which outranks allow. `[GA/grapharc/policy/document.py:14-29,141-205]` Decisions bind tenant, rule, reason, approver role, policy version/digest, request, and caller context. `[GA/grapharc/policy/engine.py:55-69,316-427]` Missing handlers, handler failures, malformed ASK decisions, and explicit denials all fail closed and are audited. `[GA/grapharc/policy/approvals.py:1-18,88-140]` The audit is append-only JSONL. `[GA/grapharc/policy/audit.py:41-68]`

- **Runtime graph discipline — PARTLY CONFIRMS AS1 Decisions 2, 3, and 5. OBSERVED-IN-CODE.** Nodes declare state fields they may write; inputs are isolated; conditional routes and fan-out destinations are checked; DAG mode rejects cycles. `[GA/grapharc/runtime/graph.py:364-469,759-836]` Fan-out converts failure and timeout into typed worker data and deduplicates before synthesis. `[GA/grapharc/runtime/fanout.py:1-71]` Cycles have target, no-progress, round-cap, and budget brakes. `[GA/grapharc/runtime/convergence.py:15-45]` Verification uses a different model, fresh context, and a deterministic citation anchor, failing closed on ambiguity. `[GA/grapharc/runtime/verify.py:1-20,80-141]` These implement the blogs’ fan-out/reduce/synthesize and deterministic-gate concepts. `[BLOG/Graph Engineering Roadmap.md:96-151,192-207]` `[BLOG/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:93-111]`

- **Budget enforcement — REFINES AS1’s budget observability but not 036 authority. OBSERVED-IN-CODE.** Admission prices worst-case topology from operator registry data; execution separately meters iterations, tokens, time, and concurrency. `[GA/grapharc/planner/admission.py:37-41,868-905]` `[GA/grapharc/runtime/budget.py:1-11,129-180,281-314]` However, a fresh meter is created per `invoke`, so resume does not preserve a lifetime budget automatically. `[GA/grapharc/runtime/graph.py:1006-1029,1099-1112]`

- **Replay → OTel — REFINES observability, CONTRADICTS any authority reading. OBSERVED-IN-CODE.** Replay reconstructs rather than re-executes; it folds recorded deltas, paths, failures, timing, and cost. It lacks recorded reducer identities, truncates long values, and defaults unknown reducers to last-write-wins. `[GA/grapharc/observe/replay.py:1-35,199-223]` OTel spans are derived afterward; parentage for sub-events is inferred because the trace has no parent pointer, and the real SDK integration is explicitly unverified. `[GA/grapharc/observe/otel.py:15-33,148-233,280-318]`

- **Staged capability — CONFIRMS incremental promotion. OBSERVED-IN-CODE.** Stages progress from deterministic checkpointed DAG, to bounded loop, verified claims, bounded fan-out, convergence, independent verification, and provenance-bearing memory. `[GA/grapharc/examples/stage0_dag.py:1-8,70-83]` `[GA/grapharc/examples/stage4_investigation.py:1-9,81-119]` `[GA/grapharc/examples/stage5_verifier.py:1-8,36-92]` `[GA/grapharc/examples/stage6_memory.py:1-7,37-105]`

## 3. COMPARISON TO PRIOR STUDIES

| Prior decision | GraphARC verdict and delta |
|---|---|
| Graph projection over 036 | **CONFIRMS topology as proposal; CONTRADICTS admission-as-final-authorization.** Fingerprint-bound admission is an excellent precondition, but it neither binds current 036 head/epoch nor supplies a durable single-use allow. A hand-built `AdmissionResult` can run. `[GA/grapharc/planner/materialize.py:54-60]` 036 requires exact request, state, actor, capability, epoch, evidence, and policy binding before append. `[specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:52-70,87-96]` |
| Seven planes | **REFINES organization/work/compiled/observability planes; leaves authority, evidence, and knowledge less cleanly separated.** Runtime trace, policy audit, session events, checkpoints, and memory are multiple records rather than projections over one authority ledger. This preserves AS1’s need for separate planes. `[AS1/research/research.md:11-21]` |
| Typed executable IR | **CONFIRMS, but is narrower.** `Subgraph` provides closed nodes, kinds, arguments, edges, nesting, origin, and fingerprint; it lacks versioned ports, reducers, readiness modes, write sets in the IR, adapter versions, and topology digest. `[GA/grapharc/planner/proposal.py:95-255]` `[AS1/research/research.md:23-31]` |
| Scheduler, reducers, waves | **PARTLY CONFIRMS; weaker than AS1/GR2.** Explicit fan-out, joins, input isolation, and concurrency caps are present, but LangGraph supersteps provide barrier semantics and there is no all/any/quorum/stream IR, conflict graph, claimant-addressed commit, or fence. `[GA/grapharc/runtime/graph.py:438-464]` `[GR2/research/research.md:226-273]` |
| Eval verdicts as edges | **REFINES verification, but CONTRADICTS structural-edge authority.** Stage 5 has strong independent verification, yet its graph always routes `draft → verify → report`; acceptance is report state, not the selector of a declared consequence edge. `[GA/grapharc/examples/stage5_verifier.py:65-92]` `[AS1/research/research.md:43-51]` |
| Replay, effects, human gates | **EXTENDS operator observability; weaker than both studies’ authority contract.** Session holds stop before nodes and bind decisions to request IDs, but direct graph invocation bypasses the gate; requests omit principal capability, topology/evidence/policy digests, epoch, fence, expiry, and dependency revalidation. `[GA/grapharc/session/approval.py:37-62]` `[GA/grapharc/session/runtime.py:16-29,36-65]` This falls short of GR2’s live-context human-gate contract. `[GR2/research/research.md:386-405]` |
| Loops as typed subgraphs | **CONFIRMS bounded cycles; CONTRADICTS current composability.** The materializer explicitly rejects nested subgraphs, while budgets and convergence stay local. `[GA/grapharc/planner/materialize.py:338-354]` |
| Behavioral parity | **PARTLY CONFIRMS.** Trace diffs compare path, deltas, cost, and timing, but do not implement reference-closed causal-prefix parity, independent checkpoints, semantic normalization, or pinned mutants. `[GA/grapharc/observe/replay.py:31-35,428-509]` `[GR2/research/research.md:31,204-222]` |
| Organization graph + governance | **STRONGLY EXTENDS.** Tenant-scoped, digest-bound node/edge/tool/spend policy and role-routed approval are GraphARC’s primary new contribution. The weakness is that compiled enforcement objects lose rule ID, approver role, and audit recording. `[GA/grapharc/policy/engine.py:193-203,251-266]` |
| Hybrid retrieval | **CONFIRMS AS1 Decision 8.** GraphARC combines lexical, optional vector, graph traversal, provenance, contradiction flags, and superseded dead ends. `[GA/grapharc/memory/retrieval.py:1-20,113-204,383-465]` |
| Graphene belief/fold/truth admission | **WEAKER; partly CONTRADICTS.** GraphARC preserves supersession and detects contradictions, but `add_and_detect` writes first and detects afterward; it has no four-valued belief state, checked settlement, nogoods, or serializable truth-admission head. `[GA/grapharc/memory/contradiction.py:92-124]` `[GR2/research/research.md:275-328]` |
| Graphene fences/refusals | **EXTENDS refusals; does not confirm fences.** Admission returns stable multi-cause codes and remedies with no mutation, matching GR2’s authority-zero refusal direction. It lacks claimant identity and mutation-side fences; even session ownership is documented as a claim rather than a lease. `[GA/grapharc/planner/admission.py:31-41,133-149]` `[GA/grapharc/session/runtime.py:52-54]` `[GR2/research/research.md:330-382]` |

## 4. DELTAS FOR OUR DESIGN

**INFERRED DESIGN DECISIONS:**

1. Introduce `GraphAdmissionProofV1` as a mandatory precondition to—not substitute for—036 authorization. It should bind proposal/topology digest, compiler and schema versions, organization-policy digest, registry/capability digest, budget-reservation request, measured root depth, checks executed, complete structured refusals, and materializer identity. The 036 gateway must then bind that proof to current head, epoch, actor, capability, evidence, transition, and single-use append authorization.

2. Compile the organization graph into one immutable governance artifact with GraphARC’s deny → ask → allow semantics, tenant/role scope, node/edge/tool/spend resource kinds, and parsed-document digest. Do not use GraphARC’s audit-losing compiled-policy seam: every enforcement decision must resolve to a rule identity and 036 audit reference.

3. Seal materialization: executable bodies remain registry-owned; proposal arguments require typed per-kind schemas; declared writes, adapters, gates, effects, and dynamic destinations must be part of the admitted digest. A plain, forgeable result object is insufficient.

4. Unify GraphARC’s three approval styles—policy router, planner file handshake, and session node hold—into the existing durable human-gate contract. Approval must be principal-bound, versioned, expiring, fenced, topology/evidence/policy-bound, and atomically revalidated before consequence append. A checkpoint or direct runtime call must never bypass it.

5. Treat JSONL replay and OTel strictly as projections. Add explicit causal/parent IDs, 036 domain/audit cuts, reducer identities, topology version, authorization references, effect receipts, and refusal boundaries. Inferred span parentage is acceptable for visualization, never parity or authority.

6. Split budget semantics into admission estimate, authorized reservation/allocation, actual debit, and receipt. GraphARC’s worst-case check is valuable compiler evidence; its fresh per-invoke meter must not reset a run/subgraph/node/attempt budget across resume.

## 5. RESEARCH ANGLES (PRIORITIZED)

- **Rank 1 — Admission proof before 036 authorization.** Extract the exact invariant set GraphARC checks and identify which facts must be re-bound by 036. Examine `GA/grapharc/planner/{admission.py,proposal.py}`, `GA/tests/test_admission.py`, `BLOG/Graph Engineering: After Loops…md:124-170`, the 036 gateway spec, and `runtime/lib/authorized-ledger/`. **Decision:** final `GraphAdmissionProofV1` schema and gateway verification order.

- **Rank 2 — Materialization sealing and TOCTOU closure.** Investigate proposal fingerprinting, registry-owned bodies, argument forwarding, declared writes, edge confinement, registry mutation, and forged admission results. Examine `GA/grapharc/planner/materialize.py`, `proposal.py`, `loop.py`, `GA/tests/test_planner_loop.py`, `BLOG/Harness, Loop, or Graph?…md:62-70`, and `runtime/lib/locks-and-fencing/`. **Decision:** sealed compiled-graph artifact and exact revalidation rules at execution.

- **Rank 3 — Organization-policy compiler.** Extract GraphARC’s resource model, tier precedence, tenants, approver roles, document digest, and node/edge compilation while resolving the compiled-policy audit loss. Examine `GA/grapharc/policy/{document.py,engine.py,example.toml,audit.py}`, `GA/tests/test_policy_engine.py`, `BLOG/Graph Engineering: After Loops…md:124-170`, and `.opencode/skills/system-deep-loop/mode-registry.json`. **Decision:** `OrganizationGraphPolicyV1` and rule-to-036-decision mapping.

- **Rank 4 — One durable human-gate contract.** Compare planner fingerprint handshakes, role-routed approvals, and session holds against GR2’s dependency-vector gate. Examine `GA/grapharc/planner/approval_file.py`, `planner/loop.py`, `policy/approvals.py`, `session/{approval.py,runtime.py,store.py}`, the eval blog, and the 036 effect/fencing packages. **Decision:** one open/decide/revalidate/append/timeout protocol with no checkpoint or direct-call bypass.

- **Rank 5 — Authority-zero refusal integration.** Extract GraphARC’s complete multi-check rejection, stable codes, remedies, audit events, and replan behavior; test whether remedies can remain advisory-only. Examine `GA/grapharc/planner/{admission.py,loop.py}`, `GA/tests/test_admission.py`, GR2 P6, and `runtime/lib/authorized-ledger/`. **Decision:** compile/admission refusal variants added to `TransitionRefusalV1`.

- **Rank 6 — Ledger-first observability and replay-to-OTel.** Map which GraphARC records are canonical, duplicated, inferred, or disconnected across trace, policy audit, session DB, checkpoint, replay, cost, and OTel. Examine `GA/grapharc/observe/{trace.py,replay.py,otel.py,cost.py}`, `policy/audit.py`, `session/events.py`, the graph-observability blog passages, and `runtime/lib/shadow-parity/`. **Decision:** authoritative trace projection schema and OTel export contract.

- **Rank 7 — Budget admission, reservation, and debit.** Compare registry-derived worst-case admission with per-call/per-node metering, approval wait credit, gateway spend, resume resets, and 036 hierarchical budgets. Examine `GA/grapharc/planner/admission.py`, `runtime/{budget.py,usage.py}`, `gateway/spend.py`, `GA/tests/test_budget_enforcement.py`, `BLOG/How to Use Graph Engineering…md:325-361`, and `runtime/lib/hierarchical-budgets/`. **Decision:** reservation/debit/refund lifecycle and budget-exhaustion edge semantics.

- **Rank 8 — Governance mutant corpus and staged promotion.** Turn GraphARC’s stage gates and negative tests into mutants that specifically prove no admission bypass, policy rename laundering, argument escalation, stale approval, trace/audit disagreement, or resume budget reset. Examine `GA/examples/stage0_dag.py`–`stage6_memory.py`, `GA/tests/test_stage*_gate.py`, admission/policy/replay tests, `BLOG/Graph Engineering Roadmap.md:96-151,192-212`, and `runtime/lib/shadow-parity/`. **Decision:** promotion-blocking governance mutant matrix beyond studies 1–2’s existing parity corpus.
