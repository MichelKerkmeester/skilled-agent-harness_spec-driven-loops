# Graph Primitives and Snippets

A practical reference for graph-backed work in `system-deep-loop`.

This document treats graph structure as a governed execution aid. It does not replace the append-only evidence ledger, legacy loop semantics, or transition-authorization boundary. The recommended migration is additive-dark shadowing, then parity, then one-mode cutover only after the authority prerequisites pass. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md`; iteration-006; iteration-012]

## 1. Working vocabulary

| Term | Meaning in this reference | Authority boundary |
|---|---|---|
| Control graph | Stable, registry-defined workflow shape and guarded transitions | Registry, policy, and authorization code |
| Work graph | Per-run nodes and edges for dispatch, evidence, synthesis, convergence, and recovery | Typed state plus admission; not the ledger |
| Knowledge graph | Typed questions, findings, claims, and sources connected by evidence relations | Derived coverage/provenance projection |
| Checkpoint | Resumable execution state for a thread or wait period | Persistence aid; not an audit ledger |
| Trace | Runtime observations such as node starts, ends, errors, deltas, and admission results | Observability; not a sealed receipt |
| Admission | Deterministic decision that a proposed graph may execute | Fail-closed gate before materialization |
| Fan-out | A bounded set of detached parallel lineages | Filesystem-enforced branch boundary |
| Fan-in | Deterministic merge of validated lineage outputs | Registry/attribution projection; lineage logs remain evidence |

### 1.1 Non-negotiable separation

1. A graph state snapshot may carry the current reducer input and resume position.
2. A graph edge may describe a possible route.
3. Admission may authorize a proposed topology.
4. None of those facts alone authorizes an append, proves identity binding, seals an artifact, or establishes a replay receipt.
5. The ledger and gateway remain the authority and audit plane until the migration gates are discharged. [SOURCE: iteration-011; iteration-012]

```text
planner proposal
      |
      v
admission: registry -> policy -> budget -> depth -> reachability -> acyclicity
      |
      +-- rejected: return reasons; do not execute
      |
      +-- admitted
             |
             v
materialize from frozen registry factories
             |
             v
run typed work graph -> checkpoint/trace projections
             |
             v
ledger/gateway remains authoritative for durable transitions
```

The diagram is a conceptual summary of the implementation boundary, not a claim that the live deep-loop runtime has already become graph-native. [INFERENCE]

## 2. Typed state

### 2.1 The GraphARC Pydantic base pattern

GraphARC makes state a Pydantic model and rejects undeclared fields. Assignment validation is enabled so later writes are checked too.

```python
"""Typed shared state."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class GraphARCState(BaseModel):
    """Base class for graph state schemas."""

    model_config = ConfigDict(extra="forbid", validate_assignment=True)
```

[Source: `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18`]

The durable point is the configuration:

| Setting | Effect | Failure prevented |
|---|---|---|
| `extra="forbid"` | Unknown keys fail model validation | A misspelled update becoming plausible downstream state |
| `validate_assignment=True` | Assignment is validated after model creation | A later mutation violating the declared state contract |

GraphARC also validates node updates against declared field types and rejects undeclared writes. A node may return a dictionary or a `Command`, but both routes pass through the same write checks. [SOURCE: `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:1-33,364-465,623-712`; iteration-008]

### 2.2 State schema versus graph knowledge

Keep execution state and knowledge nodes separate.

| State concern | Knowledge concern |
|---|---|
| Current iteration, route, budget, blockers, and artifact locations | Questions, findings, claims, sources, and evidence relations |
| Reducer inputs and control signals | Traversable evidence/provenance projection |
| Mutable working snapshot | Append-oriented events and derived graph records |
| Resume position | Why a finding supports or contradicts another finding |

A `ResearchGraphState` can reference knowledge IDs without embedding the entire graph as mutable nested state. This keeps a typed execution contract while allowing the graph projection to be rebuilt from events. [INFERENCE: based on iteration-006's proposed adapter state and iteration-011's separation of graph state from ledger authority]

### 2.3 Proposed `ResearchGraphState` JSON shape

The following is the proposed first-mode adapter shape. It is a design contract, not an existing runtime serialization. Fields are deliberately explicit so parity checks can compare legacy and shadow paths.

```json
{
  "schemaVersion": 1,
  "namespace": {
    "specFolder": "specs/system-deep-loop/037-graph-engineering",
    "sessionId": "session-id",
    "workflowMode": "research",
    "runtimeLoopType": "research",
    "backendKind": "deep-research"
  },
  "iteration": {
    "number": 4,
    "run": 4,
    "focus": "graph primitives",
    "keyQuestions": ["q-1", "q-2"],
    "remainingQuestions": ["q-2"]
  },
  "artifacts": {
    "iterationPath": "iterations/iteration-004.md",
    "stateLogPath": "deep-research-state.jsonl",
    "deltaPath": "deltas/iter-004.jsonl",
    "narrativeHash": "sha256:...",
    "stateRecordHash": "sha256:...",
    "deltaRecordHash": "sha256:..."
  },
  "knowledge": {
    "questionIds": ["q-1", "q-2"],
    "findingIds": ["finding-1"],
    "claimIds": ["claim-1"],
    "sourceIds": ["source-1"],
    "edges": ["edge-1", "edge-2"]
  },
  "signals": {
    "newInfoRatio": 0.42,
    "convergenceThreshold": 0.05,
    "minIterations": 3,
    "observations": [],
    "qualityGate": "pass",
    "blockers": []
  },
  "route": {
    "phase": "evaluate",
    "decision": "continue",
    "reason": "remaining question lacks coverage"
  }
}
```

[INFERENCE: the shape above translates the iteration-006 adapter contract into JSON. The field groups, graph ID references, and artifact hash requirements are proposed adapter design, not an assertion that this exact object currently exists.]

#### State invariants

| Invariant | Check |
|---|---|
| `schemaVersion` is present | Reject missing or unsupported versions |
| Namespace is complete | Require spec folder, session, and mode identity before dispatch |
| Artifact identity is explicit | Require path plus content hash for each parity-relevant artifact |
| IDs are references, not content dumps | Reconstruct graph records from the event/registry boundary |
| Route is bounded | `phase`, `decision`, and `reason` must use the adapter's declared vocabulary |
| Signals do not silently authorize stop | Legacy convergence and quality gates remain independent guards |

The state is a typed normalized snapshot. It is not a replacement for the state JSONL stream, reducer output, or evidence ledger. [SOURCE: iteration-006; iteration-012; iteration-013]

### 2.4 State update boundary

GraphARC's runtime documents why the returned update, rather than in-place mutation, is the write channel:

```python
# Nodes get a deep copy: the returned dict is the *only* write channel.
# Without this, in-place mutation of nested models would bypass write
# permissions invisibly.
if isinstance(state, BaseModel):
    state = state.model_copy(deep=True)
else:
    state = copy.deepcopy(state)
```

[Source: `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py:around _enter`]

A graph adapter should follow the same discipline: node input is isolated, declared output is validated, and durable artifact writes happen through the existing owner boundary rather than by mutating shared state.

## 3. Node and edge vocabulary

### 3.1 Knowledge node kinds

The coverage graph uses four knowledge node kinds.

| Kind | Use |
|---|---|
| `QUESTION` | A tracked research question or unresolved key question |
| `FINDING` | A cited observation produced by research |
| `CLAIM` | An asserted or derived proposition |
| `SOURCE` | A file, document, URL, or other cited evidence source |

These kinds are the graph-events vocabulary used by the research coverage graph. Invalid kinds must be rejected rather than stored as an untyped node. [SOURCE: `specs/system-deep-loop/037-graph-engineering/research/research.md`, §6 and §10; iteration-006; iteration-013]

### 3.2 Edge relations

| Relation | Typical direction | Meaning |
|---|---|---|
| `ANSWERS` | `FINDING`/`CLAIM` → `QUESTION` | The source content answers a question |
| `SUPPORTS` | `FINDING`/`CLAIM` → `CLAIM`/`FINDING` | Evidence supports another proposition |
| `CONTRADICTS` | `FINDING`/`CLAIM` ↔ `FINDING`/`CLAIM` | Evidence or claims are in conflict |
| `SUPERSEDES` | newer result → older result | A later result replaces an earlier one |
| `DERIVED_FROM` | `CLAIM` → `FINDING` | Claim derivation provenance |
| `COVERS` | `FINDING`/`CLAIM` → `QUESTION` | The result covers part of a question |
| `CITES` | `FINDING`/`CLAIM` → `SOURCE` | The result cites its evidence source |

The relation vocabulary adds structure that a scalar novelty score cannot express, especially contradiction, per-question coverage, and source diversity. [SOURCE: iteration-013]

### 3.3 Event snippets and validation

The upsert entrypoint normalizes kind and relation before validation:

```javascript
const kind = String(n.kind || n.nodeKind || n.type || '').toUpperCase();
if (!n.id || typeof n.id !== 'string') {
  validationErrors.push('Node missing required id');
  continue;
}
const validKinds = isCouncil ? db.VALID_KINDS : db.VALID_KINDS[loopType];
if (!validKinds.includes(kind)) {
  validationErrors.push(`Invalid node kind "${kind}" for loop type "${loopType}". Valid: ${validKinds.join(', ')}`);
  continue;
}
```

```javascript
const relation = String(e.relation || '').toUpperCase();
if (!e.id || typeof e.id !== 'string') {
  validationErrors.push('Edge missing required id');
  continue;
}
if (!sourceId || !targetId) {
  validationErrors.push(`Edge "${e.id}" missing sourceId or targetId`);
  continue;
}
if (sourceId === targetId) {
  rejectedSelfLoops.push(e.id);
  continue;
}
const validRelations = isCouncil ? db.VALID_RELATIONS : db.VALID_RELATIONS[loopType];
if (!validRelations.includes(relation)) {
  validationErrors.push(`Invalid relation "${relation}" for loop type "${loopType}". Valid: ${validRelations.join(', ')}`);
  continue;
}
```

[Source: `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:166-226`]

### 3.4 Validation rules

1. Every node has a non-empty string ID.
2. Every node kind is in the loop's registered valid-kind set.
3. Every edge has a non-empty string ID.
4. Every edge names both source and target IDs.
5. Self-loops are rejected by `sourceId === targetId`.
6. Every relation is in the loop's registered valid-relation set.
7. Namespace fields are attached to persisted records.
8. Rejected edges are not reinterpreted as harmless transitions.

An invalid or missing edge lowers graph coverage; it must not alter the independent inline convergence ratio. [SOURCE: iteration-013; `upsert.cjs`]

### 3.5 Knowledge graph is a projection

The graph is useful for contradiction, coverage, diversity, and hotspot analysis. It is not the authoritative event ledger. The research runtime records graph convergence as an optional structural guard around the inline three-signal vote; `STOP_ALLOWED` can permit the inline candidate, but graph availability cannot authorize an earlier stop. [SOURCE: iteration-013; research.md §6 and §10]

## 4. Admission and fail-closed routing

### 4.1 Admission flow

GraphARC's checker evaluates every proposal as data and does not execute node factories during checking. The implementation's check order is:

```python
rejections: list[Rejection] = []
rejections.extend(self._check_registry(proposal))
rejections.extend(self._check_node_policy(proposal))
rejections.extend(self._check_policy(proposal))
worst_case, complete = self._worst_case(proposal)
rejections.extend(self._check_budget(worst_case, complete, remaining))
depth = parent_depth + proposal.nesting_depth()
rejections.extend(self._check_depth(depth, parent_depth, proposal))
checks_run = [Check.REGISTRY, Check.POLICY, Check.BUDGET, Check.DEPTH]
if self.limits.require_entry:
    rejections.extend(self._check_reachability(proposal))
    checks_run.append(Check.REACHABILITY)
if self.limits.require_acyclic:
    rejections.extend(self._check_acyclicity(proposal))
    checks_run.append(Check.ACYCLICITY)
```

[Source: `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py:457-507`]

The checks mean:

| Check | Question | Fail-closed result |
|---|---|---|
| Registry | Are node kinds registered and endpoints present? | Reject unknown kinds or endpoints |
| Policy | Are node kinds and edges permitted? | Reject deny; approval is not an implicit allow |
| Budget | Does the worst case fit remaining headroom? | Reject before first node runs |
| Depth | Is nesting within the operator limit? | Reject too-deep proposals |
| Reachability | Does a standalone graph have an entry and reachable nodes? | Reject unrunnable topology when enabled |
| Acyclicity | Does the proposal avoid cycles when DAG mode is required? | Reject cycles |

GraphARC's `AdmissionResult` carries status, fingerprint, rejections, checks run, cost estimate, remaining budget, depth, and node count. This makes the decision usable for replanning and later inspection. [SOURCE: iteration-008]

### 4.2 Registry identity is the routing authority

Policies match registry **kinds**, not planner-chosen instance names.

```python
class EdgeRule(BaseModel):
    model_config = ConfigDict(frozen=True)

    action: Decision
    source: str = "*"
    target: str = "*"
    reason: str = ""
```

```python
def decide(self, source_kind: str, target_kind: str) -> Decision:
    """Decide one transition. Both arguments are kinds (or a sentinel)."""
    rule = self.rule_for(source_kind, target_kind)
    return self.default if rule is None else rule.action
```

[Source: `admission.py:302-361`]

A proposed node has both `name` and `kind`; the name identifies the instance, while `kind` is the operator-controlled identity. Renaming `deploy` to `helper` cannot evade a deny rule, and naming an instance `deploy` cannot borrow a permitted kind. If a live endpoint has no resolvable kind, the checker returns `unresolved_endpoint_kind` rather than assuming it is safe. [SOURCE: iteration-008; `admission.py:672-835`]

### 4.3 Approval is a stop

The checker distinguishes:

```python
class AdmissionStatus(StrEnum):
    ADMITTED = "admitted"
    REJECTED = "rejected"
    NEEDS_APPROVAL = "needs_approval"
```

`NEEDS_APPROVAL` is not a slow `ADMITTED`. The graph must stop and obtain approval or replan. A graph adapter should preserve this distinction in `route.decision` and never downgrade it to `continue`. [Source: `admission.py`; iteration-008]

### 4.4 Materialization boundary

Admission authorizes a shape; materialization turns only that admitted shape into executable work. GraphARC's materializer resolves node bodies from operator-owned registry factories and confines dynamic destinations to declared edges. Raw compiled entrypoints fail closed when the GraphARC run context is absent because budgets and traces are part of the execution contract. [SOURCE: iteration-004; iteration-008; `graph.py:51-140,364-465`]

## 5. Budgets: estimate first, enforce at runtime

### 5.1 Worst-case admission estimate

Admission reads costs from the registry, not from planner-supplied claims.

```python
class NodeSpec(BaseModel):
    model_config = ConfigDict(frozen=True, arbitrary_types_allowed=True)

    name: str
    description: str = ""
    worst_case: CostEstimate = CostEstimate(iterations=1)
    factory: Callable[..., Any] | None = None
```

```python
def _check_budget(
    self, worst_case: CostEstimate, complete: bool, remaining: RemainingBudget
) -> list[Rejection]:
    suffix = "" if complete else " (a lower bound: some proposed kinds are unregistered)"
    dimensions = (
        ("tokens", "over_token_budget", worst_case.tokens, remaining.tokens),
        ("iterations", "over_iteration_budget", worst_case.iterations, remaining.iterations),
        ("seconds", "over_time_budget", worst_case.seconds, remaining.seconds),
    )
```

[Source: `admission.py:184-210,836-893`]

The estimate answers “could this proposal fit the remaining budget?” It is conservative only to the extent that registry worst-case figures are complete. An unregistered kind produces an incomplete/lower-bound estimate and is rejected by the registry check anyway.

### 5.2 Runtime enforcement

The runtime meter remains mandatory because estimates cannot observe actual model spend, retries, concurrency, or wall-clock behavior.

```python
try:
    ctx.meter.check()
except BudgetExceeded as exc:
    emit("error", error=f"budget: {exc.reason}")
    raise
ctx.meter.charge_iteration()
```

```python
try:
    ctx.meter.check_tokens()
except BudgetExceeded as exc:
    emit(
        "error",
        duration_ms=duration_ms,
        error=f"budget: {exc.reason}",
        tokens=ctx.meter.tokens - tokens_before,
    )
    raise
```

[Source: `graph.py:1009-1160`; iteration-008]

Use both layers:

| Layer | Input | Timing | Purpose |
|---|---|---|---|
| Admission estimate | Registry `worst_case` plus proposal topology | Before materialization | Refuse obviously over-budget work |
| Runtime meter | Actual iterations, tokens, and elapsed time | Before/inside node execution | Stop work that exceeds the live ceiling |
| Fan-out cap | Iteration estimate × attempts × lineages | Before pool execution | Refuse an excessive branch submission |
| Aggregate cap | Sum of per-lineage estimates | Before pool execution | Bound total run exposure |

### 5.3 Fan-out budget estimates

The fan-out runner computes a per-lineage upper bound from iterations, estimated cost per iteration, and retry attempts:

```javascript
function computeLineageBudgetUpperBound(lineage, guardsInput = {}, maxRetries = 0) {
  const guards = normalizeLineageBudgetGuards(guardsInput);
  const rawIterations = Number(lineage && lineage.iterations);
  const iterations = Number.isFinite(rawIterations) && rawIterations > 0 ? Math.floor(rawIterations) : 12;
  const normalizedRetries = Number.isFinite(Number(maxRetries)) && Number(maxRetries) >= 0
    ? Math.floor(Number(maxRetries))
    : 0;
  const totalAttempts = normalizedRetries + 1;
  return {
    ...guards,
    iterations,
    total_attempts: totalAttempts,
    estimated_cost_units: iterations * guards.cost_units_per_iteration * totalAttempts,
  };
}
```

[Source: `fanout-run.cjs:650-678`]

This is a worst-case admission guard. It is not proof of actual spend. Runtime status ledgers, process timeouts, stall watchdogs, and per-node meters remain necessary.

## 6. Fan-out, lineage, and fan-in

### 6.1 Flat-pool fan-out is the current contract

The runner explicitly rejects wave assignment and dependency/touch metadata when the conflict-safety substrate is unavailable, then forces the accepted configuration to `flat_pool`:

```javascript
function applyFlatPoolAssignmentGuard(fanoutConfig) {
  const rejections = collectFlatPoolGuardRejections(fanoutConfig);
  return {
    config: {
      ...fanoutConfig,
      assignment_model: FLAT_POOL_ASSIGNMENT_MODEL,
      executors: fanoutConfig.executors.map((lineage) => ({
        ...lineage,
        assignment_model: FLAT_POOL_ASSIGNMENT_MODEL,
      })),
    },
    rejections,
  };
}
```

[Source: `fanout-run.cjs:332-432`]

Do not infer a graph scheduler from rejected `wave`, `depends_on`, or `touches` metadata. The live behavior is a flat pool. A future graph adapter may represent the pool as a bounded map frontier, but it must not invent dependency edges that the runtime rejected. [SOURCE: iteration-014]

### 6.2 Detached lineage boundary

Each branch receives a lineage label, session ID, executor identity, and lineage artifact directory. The prompt and subprocess contract require outputs to stay inside that directory. The runner validates expected reports, state logs, iteration files, and salvage artifacts before treating a lineage as complete. [SOURCE: iteration-014; `fanout-run.cjs:1085-1203,2331-2640`]

Practical branch rule:

```text
base artifact directory
└── lineages
    ├── analytical
    │   ├── deep-research-state.jsonl
    │   ├── iterations/
    │   └── research.md
    └── pragmatic
        ├── deep-research-state.jsonl
        ├── iterations/
        └── research.md
```

A logical state key is weaker than this filesystem boundary. Branches must not write one another's packet, and the parent must not treat a branch's self-report as sufficient without validating its artifacts. [SOURCE: iteration-014]

### 6.3 Parallel process boundary

The runner uses asynchronous child processes so a concurrency cap can actually overlap lineages rather than serializing them. A graph adapter should wrap this process boundary as a branch executor; it should not replace it with unbounded model-generated nodes. [SOURCE: iteration-014]

### 6.4 Deterministic fan-in ordering

The merge implementation sorts lineage labels, then sorts records by normalized durable content and ID keys. Arrival order is not canonical.

```javascript
function compareByContentThenId(left, right, idKeys) {
  const leftContent = contentSortKey(left);
  const rightContent = contentSortKey(right);
  if (leftContent < rightContent) return -1;
  if (leftContent > rightContent) return 1;

  const leftId = normalizeSortText(idKeys.map((key) => left[key]).find(Boolean));
  const rightId = normalizeSortText(idKeys.map((key) => right[key]).find(Boolean));
  if (leftId < rightId) return -1;
  if (leftId > rightId) return 1;

  const leftFull = stableStringify(left);
  const rightFull = stableStringify(right);
  if (leftFull < rightFull) return -1;
  if (leftFull > rightFull) return 1;
  return 0;
}
```

[Source: `fanout-merge.cjs:332-362`]

The practical result is content-first, then ID tie-break, then stable full-record comparison. The same comparator is applied to final flattened finding arrays and lineage attribution arrays. [SOURCE: iteration-015]

### 6.5 Duplicate and conflict variants

Default merge behavior:

1. Bucket records by finding ID.
2. Collapse same-ID records with equivalent durable content.
3. Union and sort lineage labels for the surviving record.
4. Preserve same-ID/different-content records as variants.
5. Give each variant a deterministic synthetic ID containing a short content digest.
6. Add `_conflictOf` and `_conflict_id`.
7. Add reciprocal conflict metadata with `relation: "CONTRADICTS"`.

```javascript
function conflictSafeRecord(record, baseId, idKey) {
  const conflictId = `${baseId}--${contentDigest(record)}`;
  return {
    ...record,
    [idKey]: conflictId,
    _conflictOf: baseId,
    _conflict_id: conflictId,
  };
}
```

```javascript
function attachConflictMarkers(records, baseId, idKey) {
  if (records.length < 2) return records;
  return records.map((record) => ({
    ...record,
    _conflicts: records
      .filter((other) => other !== record)
      .map((other) => ({
        relation: 'CONTRADICTS',
        originalId: baseId,
        peerId: other[idKey],
        peerLineages: other._lineages || [],
        basis: 'same-id-different-content',
      })),
  }));
}
```

[Source: `fanout-merge.cjs:382-476`]

Do not use “first branch wins” for conflicts. Preserving both variants is required for contradiction-aware review and later evidence adjudication. Optional near-duplicate handling is a separate mode and must not silently collapse substantively different titles. [SOURCE: iteration-015]

### 6.6 Fan-in write boundary

The merge reads lineage registries, compatibility registries, state logs, and iteration markdown. It writes the base merged registry, the research compatibility registry where applicable, and `fanout-attribution.md`. It does not rewrite lineage state logs or iteration files. [SOURCE: iteration-015; `fanout-merge.cjs:1057-1169`]

A graph join may represent:

```text
branch
  -> lineage-local state/delta
  -> normalized lineage registry
  -> deterministic merged registry
  -> attribution projection
```

It must not infer missing execution events from a merged finding or replace append-only lineage evidence. [INFERENCE: based on the read-only lineage inputs and registry-only merge outputs]

## 7. Checkpointing and resume

### 7.1 GraphARC checkpoint access

GraphARC's compiled wrapper exposes current state and history through a checkpointer:

```python
def get_state(
    self, thread_id: str, *, checkpoint_id: str | None = None, subgraphs: bool = False
) -> StateSnapshot:
    """The thread's current checkpoint: values, what runs next, pending interrupts."""
    return self.inner.get_state(
        self._thread_config(thread_id, checkpoint_id), subgraphs=subgraphs
    )


def get_state_history(
    self,
    thread_id: str,
    *,
    before_checkpoint_id: str | None = None,
    limit: int | None = None,
    filter: dict[str, Any] | None = None,
) -> Iterator[StateSnapshot]:
    """Checkpoints for a thread, newest first — the replay points of a run."""
    return self.inner.get_state_history(
        self._thread_config(thread_id),
        before=(
            self._thread_config(thread_id, before_checkpoint_id)
            if before_checkpoint_id is not None
            else None
        ),
        limit=limit,
        filter=filter,
    )
```

[Source: `graph.py:1190-1250`]

The wrapper's resume entrypoint uses `input=None` with a prior thread ID and requires a checkpointer at compile time. [Source: `graph.py:1110-1160`; iteration-004]

### 7.2 Fan-out wait checkpoint

The fan-out runner persists a small JSON checkpoint for a pre-dispatch wait. Its shape includes schema version, status, next run time, remaining delay, update time, run ID, loop type, and spec folder.

```javascript
function buildWaitCheckpoint({ waitMs, runId, loopType, specFolder, nowMs = Date.now() }) {
  const durationMs = normalizeWaitDurationMs(waitMs);
  const updatedAt = new Date(nowMs).toISOString();
  if (durationMs <= 0) {
    return {
      schemaVersion: WAIT_CHECKPOINT_SCHEMA_VERSION,
      status: 'idle',
      nextRunAt: null,
      remainingDelayMs: null,
      updatedAt,
      runId,
      loopType,
      specFolder,
    };
  }

  return {
    schemaVersion: WAIT_CHECKPOINT_SCHEMA_VERSION,
    status: 'waiting',
    nextRunAt: new Date(nowMs + durationMs).toISOString(),
    remainingDelayMs: durationMs,
    updatedAt,
    runId,
    loopType,
    specFolder,
  };
}
```

[Source: `fanout-run.cjs:786-823`]

On resume, the runner reads and normalizes the checkpoint, emits `resume_waiting`, waits until the stored time, clears the checkpoint, and emits `resume_waiting_complete`. [Source: `fanout-run.cjs:824-930`]

### 7.3 Checkpoints are not an audit ledger

A checkpoint answers “what state can I resume from?” It does not by itself answer:

- Which identity and policy authorized a transition?
- Which exact artifact bytes were admitted?
- Which gateway decision receipt was issued?
- Which writer fence was current?
- Which effects were committed or recovered?
- Why did the reducer choose this route?

GraphARC separately records trace events for node start/end/error, state deltas, topology, admission decisions, and stop reasons. The deep-loop design separately retains append-only typed events, sealed artifacts, receipts, fingerprints, and fencing. Therefore checkpoint history is resumable execution state, not a replayable why-audit or authority ledger. [SOURCE: iteration-004; iteration-011; iteration-012]

Use this rule:

```text
checkpoint -> resume continuity
trace      -> execution observability
ledger     -> durable authority and audit
receipt    -> authorized transition/effect evidence
```

Collapsing these planes creates a false sense of replayability and can let mutable state masquerade as proof. [SOURCE: research.md §9 and §10]

## 8. Route and convergence guardrails

### 8.1 Route vocabulary

The proposed adapter route should preserve the legacy convergence decision rather than introduce a second stop score.

| Route | Meaning |
|---|---|
| `continue` | Legacy loop requires more work and quality/parity gates allow dispatch |
| `stop` | Legacy stop candidate is legal and minimum/quality gates pass |
| `blocked` | Stop or transition is blocked by missing evidence, parity, schema, identity, or fencing |
| `recover` | A productive fallback can repair missing or malformed evidence |
| `stuck` | No productive fallback remains |

[INFERENCE: route labels summarize iteration-006's adapter contract; they are not asserted as existing graph node names.]

Graph convergence is a structural guard. It may block an inline stop, but it must not authorize an earlier stop. The inline rolling average, MAD/noise floor, question coverage or entropy, minimum-iteration guard, quality guard, and max-iteration cap remain independent constraints. [SOURCE: iteration-006; iteration-013]

### 8.2 Admission-aware route pseudocode

```text
proposal = planner.propose(state)
result = admission.check(proposal, remaining=budget_headroom)

if result.status == NEEDS_APPROVAL:
    return blocked(reason="approval required")
if result.status != ADMITTED:
    return recover_or_stuck(result.rejections)

work = materialize(result, frozen_registry)
run(work, runtime_budget)
return legacy_convergence_and_graph_veto(state)
```

This pseudocode captures the ordering. It is not a replacement implementation. [INFERENCE: based on `admission.py` and iterations 008, 011, 013]

## 9. Deterministic replay and parity checklist

A first research-mode adapter should be proven in shadow mode with a fixed corpus rather than a live-directory replay. [SOURCE: iteration-012]

### 9.1 Minimum fixture cases

| Case | Expected coverage |
|---|---|
| Empty input | Schema and no-evidence failure |
| Ordinary finding | Node/edge vocabulary, hashes, reducer output |
| Partial success | One failed or timed-out node plus one successful node |
| Contradiction replay | Same-ID/different-content conflict variants and idempotence |
| Permuted fan-in | Same output bytes under lineage/input order changes |
| Graph unavailable | Legacy parity remains testable without graph storage |

### 9.2 Required comparisons

1. Exactly one iteration narrative, state record, and delta per fixture run.
2. Byte-equivalent or canonically equivalent artifact payloads, according to the declared serialization contract.
3. Valid node kinds, relation names, IDs, namespace, and no self-loops.
4. Identical normalized reducer outputs.
5. Identical convergence status, decision, stop reason, blockers, and `newInfoRatio`.
6. No graph-triggered early stop.
7. Deterministic hashes across a second run.
8. No adapter write bypasses the authorized production boundary.

Missing evidence, malformed events, unsupported graph storage, or adapter exceptions are failures or blocked cases, not completion. [SOURCE: iteration-006; iteration-012; iteration-015]

### 9.3 Operational gotchas

- Do not treat a green checkpoint read as proof that the prior transition was authorized.
- Do not route by instance name; resolve policy identity through registered kinds.
- Do not silently approximate rejected `wave` or dependency metadata with graph edges.
- Do not merge by arrival order.
- Do not collapse same-ID/different-content findings.
- Do not let graph storage availability become a parity prerequisite.
- Do not let graph convergence replace the inline vote.
- Do not let a branch write outside its lineage directory.
- Do not let a `NEEDS_APPROVAL` result fall through as an allow.
- Do not claim production cutover while the 036 fencing and gateway prerequisites remain blocked. [SOURCE: research.md §7, §10; iterations 012, 014, 015, 018]

## 10. Implementation sequence

1. Define and validate the typed research state in additive-dark shadow mode.
2. Emit graph events beside existing iteration/state/delta artifacts.
3. Run DB-independent schema, hash, reducer, convergence, and fan-in parity checks.
4. Add deterministic branch-to-join fixtures with shuffled lineage order and conflict variants.
5. Compare shadow outputs against legacy authority without changing route authority.
6. Cut over one mode only after gateway, identity, policy, fencing, rollback, and parity gates pass.
7. Retire legacy writers only after zero-use evidence and a rollback window.
8. Enrich convergence with graph structure only after the projection path is healthy.

This sequence follows the research synthesis: hybrid loop-plus-graph, evidence ledger authoritative, additive-dark adapter first, shadow parity second, per-mode cutover third, and convergence-graph enrichment last. [SOURCE: research.md §1, §10; iteration-018]

## Sources

- `specs/system-deep-loop/037-graph-engineering/research/research.md` — synthesis, status, vocabulary, migration, and authority conclusions.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-004.md` — GraphARC/LangGraph boundary, checkpoints versus trace, and implementation model.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md` — research adapter state shape, route contract, parity gates, and shadow migration.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-008.md` — admission, registry-kind routing, budget estimates, and materialization.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-011.md` — typed state, authority-plane separation, and hybrid control/work graph.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md` — deterministic fixture, parity dashboard, and shadow-only boundary.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-013.md` — graph convergence veto, node/edge validation, and topology replay.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-014.md` — flat-pool fan-out, detached lineages, and branch isolation.
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-015.md` — deterministic fan-in ordering, conflict variants, and read-only lineage evidence.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py` — `GraphARCState` Pydantic pattern.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/planner/admission.py` — admission checks, policies, registry, budgets, depth, reachability, and acyclicity.
- `specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/graph.py` — typed graph runtime, checked routing, runtime budgets, trace context, and checkpoint access.
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` — flat-pool guard, lineage process boundary, budget estimates, and wait checkpoint/resume.
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` — stable ordering, duplicate/conflict handling, reconstruction, and registry-only fan-in outputs.
- `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` — graph-event normalization, valid kinds/relations, namespace fields, and self-loop rejection.
