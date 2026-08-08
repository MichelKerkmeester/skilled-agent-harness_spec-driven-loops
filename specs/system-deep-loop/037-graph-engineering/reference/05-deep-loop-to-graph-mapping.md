# Deep-loop to graph mapping

## Purpose and decision

This reference maps the live `system-deep-loop` workflow family to graph-engineering primitives without treating graph topology as a replacement for the evidence-ledger authority plane. The recommended target is hybrid:

- a stable, governed control graph for registry-defined modes and allowed transitions;
- a per-run work graph for dispatch, evidence work, fan-out, synthesis, convergence, and recovery;
- the existing JSONL artifacts and reducers during migration;
- the 036 append-only ledger, transition gateway, sealed artifacts, receipts, fingerprints, and adjudication as the authority and audit boundary.

The loop is live. Authority is not cut over. Phase 014 remains blocked by the unresolved preconditions recorded as F001, F002, F005, the 022 parity residual, and the unbuilt 024 append-boundary fencing. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md` §7; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-020.md` Finding 3]

Graph engineering is therefore an orchestration migration, not a big-bang rewrite. Start with a DB-independent research adapter in additive-dark mode, prove exact shadow parity, cut over one mode at a time behind 036 discipline, and only then enrich convergence with graph-derived signals. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-018.md` Finding 1; `specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md` §1]

## Working definitions

| Term | Meaning in this reference | Authority status |
|---|---|---|
| Control graph | Stable topology for mode contracts, registry routing, admission, policy, budgets, and permitted transitions. | Governed by the registry and 036 authorization boundary; not inferred from a run's observed nodes. |
| Work graph | Per-run execution topology for one workflow instance, including iteration nodes, branches, joins, retries, and blocked paths. | Resumable execution state; not the sole ledger or why-audit. |
| Graph state | Typed execution snapshot carried by graph nodes and reducers. | Mutable working state; it may reference authoritative artifacts and receipts. |
| Evidence ledger | Append-only typed event stream with authorization, identity/policy binding, sealed references, receipts, and replay evidence. | Authoritative event/audit plane. |
| Shadow adapter | Additive graph path that observes or reconstructs the legacy run without changing authority. | Non-authoritative until parity and operator gates pass. |
| Parity | Exact agreement between independently derived legacy and graph outputs for artifacts, reducer state, graph reconstruction, convergence, and failure behavior. | Promotion evidence, not optional telemetry. |
| Graph enrichment | Later use of topology such as contradiction, coverage, source diversity, or replay fingerprints as a structural signal. | Advisory or veto input only; it does not replace inline convergence semantics. |

The distinction matters because a checkpoint can restore execution state, while the ledger must explain and authorize durable effects. A graph trace can expose node execution and state deltas, while a sealed receipt must bind the authorized transition and its evidence. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Findings 2–5]

## 1. Concept mapping table

### 1.1 Primary mapping

| Deep-loop concept | Graph-engineering counterpart | What the adapter should preserve | Common failure if collapsed |
|---|---|---|---|
| Seven workflow modes | Stable control-graph subgraphs selected by mode registry | Keep `workflowMode`, `runtimeLoopType`, and `backendKind` distinct. Research, review, and council share a runtime-loop family; improvement lanes and alignment retain their own backend boundaries. | Keying only by packet name can route a custom backend to the wrong graph. |
| Mode registry | Control-graph registry and admission source | Registry-defined kinds and contracts remain routing authority. | An instance name or observed branch becomes accidental authority. |
| Iteration focus | Typed work node | Read the current question/state snapshot; emit typed findings, sources, blockers, and next-focus data; update through the reducer contract. | Free-text edges lose identity, citations, and declared write ownership. |
| Iteration narrative | Node artifact or subgraph output | Preserve the one-iteration artifact contract and source citations. | A checkpoint or trace is mistaken for the durable narrative. |
| `newInfoRatio` | Guard input on an evaluation edge | Carry ratio and threshold as separate fields; compare the same values on legacy and graph paths. | A new universal score changes stop behavior silently. |
| Quality gates | Guard predicates on evaluation edges | Preserve quality signals, blocker lists, minimum observations, and required artifact checks. | “Graph completed” is treated as “quality passed.” |
| `minIterations` / minimum observations | Termination guard | Refuse early stop until the existing minimum requirements are met. | A graph reaches a terminal node before the loop contract permits stop. |
| Inline three-signal vote | Legacy convergence oracle consulted by graph routing | Keep the inline vote authoritative for loop-local termination. Graph signals may corroborate or veto according to the existing contract. | A structural graph score authorizes an earlier stop. |
| JSONL state log | Checkpointed graph state plus event projection | Keep canonical record order, field values, route fields, and byte/hash parity. | A graph snapshot becomes a second, conflicting source of truth. |
| Reducer | Graph-state reducer(s) and projection reducers | Normalize updates and compare reducer bundles independently. | Node-local mutation bypasses canonical aggregation. |
| Loop lock | Serialization/fencing boundary around shared writes | Keep owner/nonce/stale-reclaim semantics and place locking around artifact, checkpoint, and ledger writes. | Parallel graph execution is assumed to provide mutual exclusion. |
| Fan-out lineages | Explicit parallel branches (`Send`/map-style work branches) | Preserve flat-pool semantics, caps, retries, orphan handling, budgets, and filesystem-enforced detached lineages. | Scheduler metadata such as waves or dependencies is approximated when the runtime rejects it. |
| Fan-in | Validated deterministic join/reducer | Merge content first, then apply a deterministic ID tie-break; represent contradictions rather than silently discarding variants. | Arrival order determines the result. |
| Coverage graph | Optional graph projection beside work state | Treat `QUESTION`, `FINDING`, `CLAIM`, and `SOURCE` as typed knowledge nodes and retain typed relations. | Projection availability becomes a correctness prerequisite. |
| Evidence ledger | Authoritative event log beside checkpoints | Bind durable effects to authorization, sealed artifacts, receipts, identity/policy state, and replay fingerprints. | Checkpoint persistence is mistaken for temporal audit authority. |
| Sealed receipts | Ledger-plane evidence references | Keep receipt creation and verification outside ordinary mutable graph state. | A node trace is treated as proof of authorization or masking. |
| Blinded adjudication | Isolated speculative branches with gateway-mediated merge | Keep branches separate and allow only an authorized merge to affect authority. | Shared mutable branch state undermines independence or masking. |

The first five mappings are directly supported by the iteration-005 mapping analysis. The ledger, receipt, and adjudication boundary is the explicit non-mapping conclusion in iteration 011. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` Findings 1–6; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Findings 3, 6, and 7]

### 1.2 Mode-to-subgraph map

The adapter must retain the three-tier discriminator rather than flattening all modes into one graph. The following is the operational map:

| Mode family | Stable control subgraph | Per-run work-graph shape | Migration note |
|---|---|---|---|
| Research | Research control subgraph bound to the shared research runtime and convergence contract | Focus node → evidence work → verify → reduce → evaluate → continue/stop/recover/blocked | First adapter candidate. It has the clearest narrative, state, delta, citation, and graph-event oracle. |
| Review | Review control subgraph | Review dispatch, independent checks, synthesis, parity, and guarded convergence | Do not make first; the 036 evidence records a named deep-review parity residual. |
| AI council | Council control subgraph | Candidate/adjudication branches, synthesis, and council-specific artifact/graph contract | Do not assume research state shape applies. |
| Agent/model/skill improvement | Improvement host plus lane-specific subgraphs | Shared improvement packet and lane-specific scoring/evaluation work | Preserve distinct backend kinds and shared-packet write-set constraints. |
| Alignment | Alignment control subgraph | Alignment-specific convergence backend and review/evaluation work | Keep separate from research/review runtime assumptions. |

This table is a graph design map, not a claim that these subgraphs already exist as production graph implementations. The source material explicitly treats the mapping as a target and recommends research as the first shadow-adapted mode. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` Finding 1; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 1]

### 1.3 Iteration focus as a typed node

An iteration focus is a work node with declared inputs and outputs. It should:

1. read the current namespace and iteration snapshot;
2. read the selected focus and key questions;
3. dispatch bounded evidence work through the existing worker boundary;
4. emit findings with source references;
5. emit blockers and remaining questions;
6. return a typed patch for the reducer;
7. leave authority decisions to the guarded evaluation and ledger boundaries.

A useful node envelope is:

```json
{
  "nodeId": "focus:<iteration>:<stable-focus-id>",
  "inputStateDigest": "<canonical digest>",
  "focus": "<registered focus>",
  "writes": ["findings", "sources", "blockers", "remainingQuestions"],
  "status": "complete|partial|blocked|failed",
  "outputPatchDigest": "<canonical digest>",
  "artifactRefs": ["<iteration artifact>", "<delta artifact>"],
  "route": "verify|recover|blocked"
}
```

The field names and node-boundary discipline above follow the proposed first-mode adapter contract. The concrete envelope is an adapter design, so fields beyond the existing artifact contract are marked as [INFERENCE]. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` Finding 2; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 2]

## 2. State, reducers, and event boundaries

### 2.1 Proposed research graph state

The research adapter needs typed execution state distinct from the knowledge graph it emits. The research synthesis specifies the following shape:

```json
{
  "schemaVersion": "<version>",
  "namespace": {
    "specFolder": "<packet>",
    "sessionId": "<session>",
    "workflowMode": "research",
    "runtimeLoopType": "research",
    "backendKind": "<backend>"
  },
  "iteration": {
    "number": 0,
    "run": 0,
    "focus": "<focus>",
    "keyQuestions": [],
    "remainingQuestions": []
  },
  "artifacts": {
    "iterationPath": "<path>",
    "stateLogPath": "<path>",
    "deltaPath": "<path>",
    "narrativeHash": "<hash>",
    "stateRecordHash": "<hash>",
    "deltaRecordHash": "<hash>"
  },
  "knowledge": {
    "questionIds": [],
    "findingIds": [],
    "claimIds": [],
    "sourceIds": [],
    "edges": []
  },
  "signals": {
    "newInfoRatio": 0,
    "convergenceThreshold": 0,
    "minIterations": 0,
    "observations": 0,
    "qualityGate": "<status>",
    "blockers": []
  },
  "route": {
    "phase": "<phase>",
    "decision": "<decision>",
    "reason": "<reason>"
  },
  "authority": {
    "legacyAuthoritative": true,
    "shadow": true,
    "ledgerReceiptRef": null,
    "lockFenceRef": null
  },
  "parity": {
    "artifact": "<status>",
    "stateSchema": "<status>",
    "graph": "<status>",
    "reducer": "<status>",
    "convergence": "<status>",
    "mismatches": []
  },
  "errors": []
}
```

This is the iteration-006 adapter proposal expressed as a compact JSON shape. It is not an assertion that this object is already implemented. [INFERENCE]

### 2.2 Reducer responsibilities

Use separate, testable reducer responsibilities:

| Reducer boundary | Input | Required behavior |
|---|---|---|
| Node reducer | Typed node patch | Reject undeclared fields; validate node status and write set; produce a canonical state delta. |
| Knowledge reducer | Findings, questions, claims, sources, relations | Preserve typed IDs, citations, relation direction, and no dangling references. |
| Artifact reducer | Narrative/state/delta refs and hashes | Enforce one iteration narrative, one canonical state record, and one delta stream per fixture case. |
| Legacy-compatible reducer | Existing JSONL record stream | Remain the legacy oracle during shadow mode. |
| Graph projection reducer | Graph events or reconstructed topology | Produce an independently normalized projection for comparison; never become authority by itself. |
| Convergence reducer | Signals and guard outcomes | Preserve the existing status, decision, stop reason, blockers, ratio, and minimum-observation semantics. |
| Receipt/effect projection | Authorized transition and effect result | Reference ledger receipts and sealed artifacts without minting authority from graph state. |

GraphARC-style typed state and declared writes are useful boundary patterns, but the research explicitly treats them as execution-state contracts rather than authority ledgers. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Finding 1; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 4]

### 2.3 Knowledge-node and relation vocabulary

The coverage-graph vocabulary is typed and should remain explicit:

| Node kind | Deep-loop meaning |
|---|---|
| `QUESTION` | Remaining key question or question being answered. |
| `FINDING` | Cited iteration finding. |
| `CLAIM` | Answered or derived proposition. |
| `SOURCE` | Cited file or URL. |

| Relation | Direction and meaning |
|---|---|
| `ANSWERS` | Finding or claim → question. |
| `SUPPORTS` | Finding or claim → finding or claim. |
| `CONTRADICTS` | Finding or claim → finding or claim. |
| `SUPERSEDES` | Newer result → older result. |
| `DERIVED_FROM` | Claim → finding. |
| `COVERS` | Finding or claim → question. |
| `CITES` | Finding or claim → source. |

The projection must reject dangling references and preserve contradiction variants. Omitted edges may reduce coverage, but they must not silently alter the inline ratio or grant an early stop. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md` §6 and §10; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 2]

## 3. Convergence as guarded routing

### 3.1 Route model

The graph equivalent of the loop's convergence step is a guarded evaluation node with explicit conditional routes:

```text
focus/evidence
      |
    verify
      |
    reduce
      |
  evaluate
   /  |   \
stop continue recover
  |
blocked/stuck (when authorization, evidence, or productive fallback fails)
```

The route is not a second convergence algorithm. It is a graph representation of the existing decision contract:

- `continue` only when the legacy runtime says continue and required quality/parity gates pass;
- `stop` only when the legacy stop decision is allowed, minimum-iteration/observation requirements pass, and required quality gates pass;
- `blocked` when `STOP_BLOCKED`, authority/fencing fails, or a required gate fails without a safe route;
- `recover` when evidence is missing but a productive fallback exists;
- `stuck` when no productive fallback remains.

These route meanings are grounded in the first-mode adapter design. The graph layer may add a structural veto, but must not create an earlier stop than the legacy loop allows. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` Finding 3; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 3]

### 3.2 Preserve the inline three-signal contract

Keep these values as independent state fields:

- `newInfoRatio`;
- convergence threshold;
- quality signals;
- minimum iterations and observations;
- blocker list;
- inline vote/status;
- graph corroboration or veto;
- final decision and stop reason.

The research synthesis records the current convergence as graph-assisted veto over the inline vote: the inline vote must allow stop, and graph status must be `STOP_ALLOWED` or absent; `STOP_BLOCKED` produces `blockedStop`. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md` §6]

A compact routing contract is:

```text
if authority_gate != ALLOW:
    route = blocked
elif legacy_decision == STOP_BLOCKED:
    route = blocked
elif legacy_decision == STOP_ALLOWED and min_requirements and quality_ok:
    route = stop
elif productive_fallback:
    route = recover
else:
    route = continue_or_stuck
```

This is a readable restatement of the documented guard ordering, not production code. [INFERENCE]

### 3.3 Quality and convergence parity assertions

For every shadowed iteration, compare:

| Assertion | Pass condition |
|---|---|
| Ratio | Graph and legacy `newInfoRatio` match within the specified tolerance; the adapter contract calls for no wider than `1e-9`. |
| Status | Same status on both paths. |
| Decision | Same continue/stop/blocked/recover result. |
| Stop reason | Same machine-readable reason or equivalent canonical value. |
| Minimum requirements | Neither path stops before the same minimum conditions. |
| Quality | Same quality-gate outcome and blocker set. |
| Graph influence | No graph-only early stop. |
| Failure behavior | Malformed events, missing citations, incomplete artifacts, and graph-off cases do not become completion. |

A mismatch is a blocked promotion result. It is not a warning to be waived because the graph output “looks reasonable.” [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 5; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` Finding 4]

## 4. What does not map: the authority boundary

### 4.1 Fail-closed transition authorization stays in the ledger plane

A conditional graph edge answers “which topology path is next?” It does not answer “is this caller authorized to create this durable transition?” The 036 gateway remains responsible for fail-closed authorization, identity binding, policy-state binding, append authorization, and fencing. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Finding 4; `specs/system-deep-loop/036-deep-loop-innovation/handover.md` Status and blocker sections]

The graph adapter must therefore:

1. propose or request a transition;
2. pass the request through the authorized gateway;
3. receive an allow/deny result and receipt reference;
4. only then commit a durable effect through the approved boundary;
5. record the result in graph state as evidence, not as self-issued authority.

A model-generated route, a node-local command, or a conditional edge must not bypass this gateway. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Finding 4]

### 4.2 Sealed receipts and replay fingerprints stay outside mutable graph state

A graph checkpoint can carry an artifact hash or receipt reference. It must not mint, rewrite, or replace the sealed receipt. The ledger-plane evidence needs the normalized input, identity/policy binding, admitted transition, sealed references, and effect outcome. The graph trace may be cited by that receipt, but it is not equivalent to the receipt. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Findings 2 and 5]

Practical rule:

```text
checkpoint -> references receipt
receipt    -> binds authorized transition and sealed evidence
ledger     -> remains append-only authority
trace      -> explains execution, but does not authorize it
```

The arrows express dependency and reference direction, not a new runtime API. [INFERENCE]

### 4.3 Blinded adjudication stays isolated

Graph branches can represent independent adjudication views, but ordinary fan-out does not prove blinding, independence, masking, or certification. Each speculative branch must receive isolated input and write branch-local output. Only a gateway-mediated merge backed by a receipt and ledger event can affect the authoritative work graph. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Finding 6]

### 4.4 Why the authority boundary is non-negotiable

The graph and ledger solve different problems:

| Problem | Graph primitive | Ledger-plane requirement |
|---|---|---|
| Resume | Checkpointed typed state | Durable artifact and receipt references remain verifiable. |
| Routing | Conditional edge or command | Transition must be identity/policy/fence authorized. |
| Parallelism | Send/map branches | Shared writes still require serialization and fencing. |
| Observability | Trace and node deltas | Receipt and replay fingerprint remain authoritative evidence. |
| Adjudication | Isolated branch topology | Masking and independence need gateway-mediated evidence. |
| Termination | Guarded route | Inline vote and quality/minimum guards retain authority. |

Replacing the ledger with graph state would conflate resumability with temporal audit, topology with authorization, and branch shape with adjudication proof. The source synthesis explicitly rules out that replacement. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md` §§5, 8, 10; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Finding 3]

## 5. Fan-out, fan-in, and serialization

### 5.1 Fan-out: parallel branches, not shared authority

The graph representation of a flat-pool fan-out is a frontier of detached work branches:

```text
work frontier
  ├── branch A (lineage A)
  ├── branch B (lineage B)
  └── branch C (lineage C)
          |
       verify
          |
       join/reduce
```

Preserve the current operational rules around caps, budgets, retries, orphans, salvage, wait checkpoints, and status ledgers. The research specifically says flat-pool semantics are supported and rejected scheduler metadata such as waves/dependencies must not be approximated. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-014.md` as summarized in `research.md` §10; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` Finding 4]

Lineages are filesystem-enforced detached subgraphs. Preserve them rather than collapsing all branches into one mutable graph-state object. This is stronger isolation for the current runtime than assuming a graph engine's branch merge is sufficient. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md` §10]

### 5.2 Fan-in: deterministic and contradiction-preserving

The join must be deterministic. The documented merge direction is content-first, then ID tie-break, with `CONTRADICTS` variants retained and registry-only writes at the merge boundary. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md` §10]

A practical join checklist:

- sort or otherwise canonicalize branch inputs before reduction;
- verify every branch output belongs to the expected run and namespace;
- reject dangling IDs and invalid relation kinds;
- merge equivalent content once;
- retain contradictory content as explicit variants;
- use a deterministic ID tie-break for remaining collisions;
- write only through the reducer/authorized boundary;
- record branch-to-join ordering in the replay fixture.

The last item is essential because iteration-012 requires permutation-based and deterministic replay evidence. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` Finding 3]

### 5.3 Loop-lock is serialization, not topology

Graph parallelism does not close the loop-lock race. The current lock has an `openSync(..., 'wx')` create-then-write partial-record window, and this remains an F005 precondition for 014. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Finding 3; `specs/system-deep-loop/036-deep-loop-innovation/handover.md` blocker list]

The adapter must place serialization around:

- shared artifact publication;
- checkpoint publication;
- ledger append requests;
- reducer-owned projections;
- fan-in commits;
- lock refresh/release and stale-reclaim decisions.

Do not claim that a graph engine's scheduler, branch join, or checkpointer replaces owner/nonce semantics, stale reclaim, or append fencing. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` Finding 4]

## 6. Evidence ledger beside checkpoints

Use a side-by-side model:

```text
stable control graph
        |
per-run work graph ---- checkpointed graph state
        |
        +---- graph events / traces
        |
        +---- authorized transition request
                       |
                 036 gateway
                       |
             append-only evidence ledger
               /       |        \
       sealed artifact receipt  replay fingerprint
```

The graph checkpoint is useful for resume. The event ledger is authoritative for durable transition history. Receipts and sealed references make the “why” independently checkable. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` Finding 5; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Findings 3 and 5]

A graph event bridge should emit enough information to reconstruct parity without assuming that graph persistence is the ledger. For the first research adapter, retain:

- stable node ID;
- input-state digest;
- output patch or artifact digest;
- route decision;
- status;
- event ordinal;
- artifact references;
- reducer and convergence snapshots;
- receipt/fence references when supplied by the authority boundary.

The first seven fields and the deterministic corpus requirement are specified in iteration-012; receipt/fence references are the authority-boundary linkage described in iterations 006 and 011. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` Finding 3; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 4]

## 7. Hybrid target architecture

### 7.1 Two graph layers

#### Stable governed control graph

The control graph changes slowly and is governed by:

- mode registry;
- workflow mode and runtime-loop discriminator;
- backend kind;
- identity and policy binding;
- admission rules;
- budgets and depth limits;
- allowed transition kinds;
- gateway and fencing requirements;
- operator cutover state.

It should not be inferred from arbitrary per-run topology. The graph-engineering evidence describes admission as a deterministic check over registry/policy/budget/depth/acyclicity/reachability concerns, while the 036 gateway remains the authorization boundary. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Finding 4; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` Findings 1 and 5]

#### Per-run work graphs

A work graph is instantiated for one session/run and contains:

- dispatch envelope;
- current focus node;
- evidence branches;
- verification subgraph;
- reduce/fan-in subgraph;
- convergence evaluation;
- continuation, stop, recovery, blocked, and stuck routes;
- checkpoint references;
- graph-event and trace references;
- ledger receipt references.

The work graph is allowed to be ephemeral and run-specific. Its checkpoints support resume, but authority stays beside it in the ledger. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` Finding 7]

### 7.2 Research-mode subgraphs

The first adapter can decompose research into narrow subgraphs:

| Subgraph | Reads | Writes | Authority rule |
|---|---|---|---|
| Dispatch | Namespace, strategy, current state, focus | Work envelope and node trace | No reducer-owned direct edit. |
| Evidence | Work envelope and bounded source inputs | Findings, sources, partial status, artifacts | Existing worker/dispatch boundary remains in force. |
| Verify | Narrative, citations, state/delta identity, graph events | Verification result and mismatch list | Failure is explicit; no completion laundering. |
| Reduce | Canonical iteration/delta records and typed patches | Normalized state and projections | Existing reducer remains comparison oracle in shadow mode. |
| Evaluate | Signals, quality, blockers, parity, authority result | Route decision and stop reason | Legacy convergence plus gates determine stop. |
| Recover/blocked | Failure and evidence state | Retry/recovery or blocked artifact | No silent fallback that changes status. |

This decomposition is an adapter target based on the dispatch/verify/reduce design in iteration-006. It does not assert that these graph subgraphs are already implemented. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 4; [INFERENCE]]

## 8. Four-phase migration path

### Phase A — additive-dark research adapter

**Goal:** Materialize typed graph state and events beside the existing research loop without changing authority.

**Scope:**

- research mode only;
- DB-independent adapter;
- typed `ResearchGraphState`;
- `graphEvents` bridge;
- existing JSONL narrative/state/delta artifacts remain canonical;
- legacy loop and evidence ledger remain authoritative;
- no direct graph-owned ledger mutation;
- no graph-triggered authority or early stop.

**Operator gate:** approve the state/schema, namespace binding, packet-local write scope, shadow flag, deterministic corpus, and explicit legacy-authoritative flag.

**Rollback:** disable shadow emission or revert the additive adapter change. The legacy path remains runnable and authoritative, so rollback does not require a data migration.

**Pass evidence:** one controlled research run emits a typed state snapshot and graph events; existing artifacts remain valid; no out-of-scope or reducer-owned direct writes occur; graph-database availability is not required. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-018.md` Findings 1 and 4; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Findings 2 and 4]

**Do not advance if:** the adapter changes legacy route decisions, writes outside scope, skips required citations, or requires the coverage graph database to produce a state/parity result.

### Phase B — exact shadow parity

**Goal:** Prove that the graph path and legacy path produce the same observable result and failure behavior.

**Parity-gate checklist:**

- **G0 scope:** zero writes outside the research packet; zero reducer-owned direct edits.
- **G1 artifacts:** exactly one new iteration narrative, one canonical state iteration record, and one delta stream; required headings and citations are present.
- **G2 canonical state:** state schema, field values, record order, route fields, and graph-event vocabulary match.
- **G3 graph reconstruction:** no dangling references; finding, answered-question, source, and edge counts match.
- **G4 reducer parity:** normalized registry, dashboard, strategy, research projection, and other required reducer outputs have zero semantic differences.
- **G5 convergence parity:** identical status, decision, stop reason, blockers, and `newInfoRatio`; no graph-triggered early stop.
- **G6 replay/failure parity:** deterministic replay matches; malformed events, missing citations, incomplete artifacts, partial-success, contradiction, idempotent replay, shuffled branch order, and graph-off cases fail or recover identically.
- **G7 authority safety:** no direct append bypass, no fence capability minting or persistence by the adapter, and no cutover flag change.

**Operator gate:** approve a frozen-baseline report with every required row passing. Any mismatch is `FAIL` or `BLOCKED`, not “not applicable.”

**Rollback:** disable shadow emission and retain the legacy path. Preserve the failed parity report as evidence; do not loosen the oracle to make the report green.

**Pass evidence:** a versioned corpus produces byte/hash-stable narrative, state, delta, reducer bundle, and convergence outputs on repeat execution, including graph-disabled execution. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` Findings 3 and 4; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 5; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-018.md` Finding 2]

### Phase C — per-mode cutover behind 036 discipline

**Goal:** Move authority one mode at a time only after the 036 transition and write boundaries are actually cleared.

**Prerequisites:**

- 024 append-boundary fencing is built and independently verified;
- F001 identity resolution is mandatory at production gateway construction;
- F002 policy-state binding is closed, not harness-only;
- F005 fresh-lock partial-record window is closed;
- required 022 parity and full-surface fixture evidence are accepted;
- whole-system clearance is run on a frozen SHA;
- per-mode shadow parity is green;
- rollback window and operator certificate are explicit.

**Operator gate:** an explicit per-mode GO. The graph path may become authoritative only for the approved mode and only through the 036 gateway/ledger boundary.

**Rollback:** one-commit revert inside the documented rollback window; keep the ledger additive-dark for modes not yet approved. Legacy writers retire only after zero-use telemetry and the later retirement gate.

**Pass evidence:** code-verified gateway-only writes, current identity/policy/fence state, lock/concurrency evidence, parity certificate, frozen-SHA whole-system gate, and operator approval. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-018.md` Findings 3 and 4; `specs/system-deep-loop/036-deep-loop-innovation/handover.md` blocker and completion-path sections; `specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md` §§1–5]

**Do not advance if:** 024 is only described in stale prose, the gateway remains optional/fail-open for identity, the lock can expose a partial record, or the whole-system gate accepts self-reported findings without code verification. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Findings 1–3; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-020.md` Finding 3]

### Phase D — convergence-graph enrichment

**Goal:** Add structural graph signals after the adapter and authority path are healthy.

**Candidate signals:**

- `CONTRADICTS` structure;
- question/finding coverage;
- source diversity;
- hotspots and unresolved topology;
- replay/topology fingerprints.

**Rules:**

- graph signals corroborate or veto within the established convergence contract;
- the inline three-signal vote remains the loop-local decision oracle;
- graph enrichment cannot authorize early stop;
- graph-database projection is optional telemetry until its runtime dependency is healthy;
- graph-off parity remains a required fallback.

**Operator gate:** separately approve projection health, signal-correlation evidence, and the enrichment flag. Do not couple Phase D to the correctness of Phase A or B.

**Rollback:** disable enrichment and fall back to the established loop-local convergence path. Do not roll back the authoritative ledger or delete checkpoint/evidence history.

**Pass evidence:** compatible coverage-graph runtime, successful typed upsert/convergence projection, no change in graph-off decisions, and controlled evidence that each signal is advisory/veto-only. The recorded environment has a `better-sqlite3` ABI mismatch, so this phase is not currently ready to run on that path. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-018.md` Finding 5; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Finding 4; `specs/system-deep-loop/037-graph-engineering/research/research.md` §§13, 16]

## 9. Parity fixture and operator runbook

### 9.1 Deterministic fixture corpus

Use a fixed, versioned corpus with at least:

1. empty input;
2. ordinary cited findings with graph events;
3. one failed or timed-out node plus one successful node;
4. contradiction and idempotent replay;
5. malformed event or missing citation;
6. shuffled branch-to-join order;
7. graph-database-disabled execution.

Freeze canonical JSON key ordering, array ordering, source digests, run/iteration IDs, clock values, and path-independent artifact names. Record node ID, input-state digest, output/artifact digest, route, status, and event ordinal. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` Finding 3; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` Finding 5]

### 9.2 Gate dashboard row shape

Each row should expose:

```text
case_id | gate_id | expected_hash | actual_hash | diff_ref | severity | status
```

Required gates cover artifact bytes/hashes, JSONL schema and order, graph vocabulary and references, reducer projections, convergence outputs, and authority safety. A row is `PASS` only when both independently derived paths match. Unsupported graph DB, missing evidence, or adapter exception is `FAIL`/`BLOCKED`, not `N/A`. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` Finding 4]

### 9.3 Operator decision sequence

| Decision | Required evidence | Action |
|---|---|---|
| Enable Phase A | Schema, scope, corpus, legacy authority | Enable shadow adapter. |
| Continue Phase A | Artifact validity and no scope violations | Keep shadow; repair failures. |
| Promote to Phase B | Repeatable typed state and event bridge | Run exact parity matrix. |
| Promote to Phase C | All parity rows pass plus 036 preconditions | Request per-mode GO. |
| Promote to Phase D | Healthy projection and no graph-off regression | Enable enrichment only. |
| Roll back any phase | Failure report and retained legacy path | Disable flag/revert within the phase's window. |

## 10. Current blockers and ownership

### 10.1 014 cutover blockers

The safe current status is “authority cutover not ready.” The blocker set is:

| Blocker | Current evidence | Impact on graph migration |
|---|---|---|
| F001 identity resolution | Production gateway identity resolver remains optional/conditional. | No graph transition may become authoritative until identity is mandatory and bound. |
| F002 policy-state binding | Policy-state binding is described as harness-only in the current blocker accounting. | Graph route cannot substitute for policy authorization. |
| F005 lock publication | Fresh acquisition uses create-then-write, leaving a partial-record window. | Graph branches cannot be treated as serialization/fencing. |
| 022 parity | Six-mode divergence-detection parity is described as discharged, but full-surface fixture coverage remains a residual. | Research shadow can proceed; cutover evidence must include the residual fixture bar. |
| 024 append fencing | Core fence is recorded as genuinely unbuilt; the append primitive remains public in the cited current evidence. | No graph adapter may bypass or become the durable append authority. |

The dated 036 handover calls out 014 as blocked and identifies the 024 build scope as security-critical and atomic. Iterations 012, 019, and 020 reconcile stale positive prose against code-verified/current evidence; current status must follow that safer evidence. [SOURCE: `specs/system-deep-loop/036-deep-loop-innovation/handover.md` blocker sections; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` Finding 1; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Findings 1–3; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-020.md` Finding 3]

### 10.2 Coverage-graph database ABI mismatch

The research records repeated `better-sqlite3` native-module loading failures with `NODE_MODULE_VERSION 127 vs 141`; graph convergence/upsert was skipped under the documented fallback. Treat this as a projection/tooling blocker for Phase D, not as a Phase A/B correctness blocker. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md` §§13 and 16; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Finding 4]

Required handling:

- choose a declared runtime/toolchain alignment;
- verify the module loads under that runtime;
- run projection/upsert checks;
- retain graph-off parity as the correctness proof;
- do not make DB availability a reason to skip or waive a parity gate.

The implementation choice between rebuilding for the newer ABI and pinning the projection runtime to the older ABI remains an operator/tooling decision. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Finding 4]

### 10.3 034 and 036–046 ownership gap

The research records missing canonical owner-approved accounting for phase 034 and phases 036–046. This is a governance and status gap, not permission to infer completion from stale metadata. Obtain an owner-approved manifest, merge record, or explicit deprecation record for each ID before claiming complete 036 closeout. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Finding 5; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-020.md` Findings 3 and Residual Risks]

For each phase ID, record:

- owner;
- status;
- source packet or superseding phase;
- validation evidence;
- merge/deprecation decision when no child exists.

### 10.4 Responsibility split

| Work | Owner boundary | Why |
|---|---|---|
| 024 append-boundary fencing | 036 authority substrate | Security-critical mutation boundary and broad caller migration. |
| F001/F002/F005 closure | 036 pre-014 gate | Identity, policy, and concurrency preconditions. |
| Research adapter and fixture | Follow-up 037 implementation packet | Graph mapping and DB-independent parity proof. |
| Coverage-graph ABI | Tooling/runtime follow-up | Optional projection dependency. |
| 034/036–046 accounting | 036 governance/owner surface | Canonical status and closeout integrity. |

This split prevents a graph implementation from hiding unresolved authority work and keeps adapter design parallelizable without allowing premature cutover. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Finding 8; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-018.md` Finding 3]

## 11. Gotchas and review checklist

### Gotchas

- Do not call graph state the ledger.
- Do not call a conditional edge authorization.
- Do not let graph convergence stop before the inline vote and minimum/quality guards agree.
- Do not flatten seven modes into one packet-name graph.
- Do not use graph-database availability as a parity prerequisite.
- Do not approximate rejected `wave`/`depends_on` scheduler metadata.
- Do not merge branch results by arrival order.
- Do not share mutable authoritative state across blinded branches.
- Do not trust stale phase labels or self-reported “landed” claims without code-verified evidence.
- Do not retire legacy writers before zero-use telemetry.
- Do not call a research-only design or parity plan a production cutover.

These gotchas summarize the eliminated alternatives and residuals in the research synthesis. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md` §§10–12; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` Findings 1, 4, and 5; `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-020.md` Residual Risks]

### Review checklist

Before approving a graph change, ask:

- [ ] Is the change in the correct mode subgraph and backend kind?
- [ ] Is every new node field declared and schema-validated?
- [ ] Is the write set explicit and reducer-owned?
- [ ] Does the legacy path remain runnable and authoritative?
- [ ] Does every durable transition pass the 036 gateway?
- [ ] Are identity, policy, and fence references supplied by the authority boundary?
- [ ] Is the fresh-lock publication path safe under concurrent readers?
- [ ] Are branch lineages detached and bounded?
- [ ] Is fan-in deterministic and contradiction-preserving?
- [ ] Does graph-off execution remain valid?
- [ ] Are artifact, reducer, convergence, and failure parity rows present?
- [ ] Does any graph signal create an early stop? If yes, reject the change.
- [ ] Is there an operator gate and a named rollback action?
- [ ] Are 014, 024, 034, and 036–046 status claims backed by current evidence?

## Sources

- `specs/system-deep-loop/037-graph-engineering/research/research.md` — authoritative 20-iteration synthesis; especially §§5–10, 13, and 16.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md` — concept mapping and hybrid authority boundary.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` — research adapter state, guarded routing, and G0–G7-style parity gates.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` — ledger/graph authority separation, receipts, gateway, and adjudication boundary.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` — deterministic fixture, independent parity dashboard, and 024 fencing status.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-018.md` — four-phase migration, operator gates, rollback, and sequencing.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-019.md` — current blocker ranking, ownership split, ABI mismatch, and closure evidence.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-020.md` — final verification sweep, residual risks, and current authority status.
- `specs/system-deep-loop/036-deep-loop-innovation/handover.md` — 014 blocker state, 024/F001/F002/F005 preconditions, and rollback discipline.
- `specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md` — additive-dark rule, dependency order, and per-phase gates.

[INFERENCE] Snippets and compact route diagrams in this document restate the cited adapter and migration contracts for operator use. They are not claims that a production graph implementation already exists.
