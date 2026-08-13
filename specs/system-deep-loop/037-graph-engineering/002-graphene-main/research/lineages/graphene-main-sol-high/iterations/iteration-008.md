# Iteration 8: P5 Temporal Supersession and Nogood Admission Audit

## Focus

Resolve P5 into a temporal supersession contract for the repo-#1 `KnowledgeAssertionV1` design: distinguish observation time from authoritative append order, define equal-time ties and older arrivals, close validity intervals without deleting history, and reject cycles or competing successors. Separately audit Graphene's stated add-time nogood refusal against its fold, gates, tests, and golden fixtures.

## Findings

### 1. REFINE — Semantic replacement order and authority order are separate, conjunctive axes

Repo #1 is correct to require `observed_at` plus bitemporal validity, but `KnowledgeAssertionV1` needs an explicit total semantic key `ObservationOrderKey = (observed_at, authorized_append_seq)`. `observed_at` answers which same-subject assertion describes the later world-state; the 036 sequence answers which authorized event was learned/applied first, supplies deterministic replay, and breaks only equal-`observed_at` ties. A proposed supersession is admissible only when the successor key is greater than the predecessor/current terminal key; after append, the allocated sequence completes the key. This preserves 036 as sole authority without letting arrival order redefine world time. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:89] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/time.rs:84-109] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events/spec.md:114-128] [INFERENCE: `ObservationOrderKey` is the proposed integration contract]

**When not to use:** Do not use wall-clock `recordedAt` or arrival sequence as the primary semantic ordering when a real observation time exists; do not use caller-provided time as ledger authority; and do not compare unrelated subjects or replacement scopes with this key.

### 2. CONTRADICT — Graphene's production supersession does not implement its declared observed-time rule

Graphene's helper correctly says that a later-arriving older observation does not supersede and that equal observation times break by sequence. The production `Supersede` fold never calls that helper: it unconditionally links `new -> old`, retires the old belief, and closes validity at the supersession record's `r.at`. Its event carries only old/new/reason/proof, so admission cannot prove that the new belief was observed later. The advertised out-of-order golden fixture also contains monotonically increasing `observed_at` values equal to arrival chronology and no `SUPERSEDE` event, so it proves neither refusal nor resolution. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/time.rs:84-109] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/event.rs:174-183] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:561-579] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/out-of-order.jsonl:2-4]

**When not to use:** Do not treat Graphene's `Supersede` event or `out-of-order` fixture as evidence that production enforces observed-time supersession; the standalone time-unit tests prove only the unused comparator.

### 3. EXTEND — Validity intervals must use the same composite order as supersession

Supersession closes the predecessor at the successor's `ObservationOrderKey`, producing a half-open interval `[valid_from_key, valid_until_key)`, while the successor opens at its own key. This represents equal-time revisions deterministically; a timestamp-only `valid_until` cannot distinguish two assertions observed at the same millisecond. A wall-time query resolves all claims before the requested time normally and, at an exact tied timestamp, selects the greatest authorized sequence while retaining the other same-time versions for audit. An older late arrival is appended as historical evidence with its own recorded sequence but cannot close or replace the current terminal assertion; if historical insertion is supported, intervals are recomputed as a projection over the total keys rather than mutated in place. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/time.rs:84-129] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/02-belief-layer.md:230-249] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:89] [INFERENCE: composite half-open intervals and exact-timestamp resolution are required to make the declared tie-breaker queryable]

**When not to use:** Do not close a world-validity interval at event receipt time, mutate prior assertions, or silently impute observation time. When observation time is unavailable, mark it imputed and explicitly accept arrival-order semantics only for that source/record.

### 4. EXTEND — Supersession admission validates the prospective effective graph, not just endpoints

Before allocating a sequence, preview the candidate against the verified active relation set and reject self-relations, missing claims/evidence, non-increasing observation keys, cycles, and a second active successor for the same predecessor. Replacement remains a chain: to replace an already selected successor, assert from the active terminal or explicitly withdraw the old relationship before asserting the competing edge. The 036 projection already rejects competing successors and detects cycles by adding the candidate to the active successor map; Graphene's fold instead overwrites `old.superseded_by`, accepts reciprocal/cyclic links, and provides no competing-successor guard. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events/spec.md:79-86] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events/spec.md:101-110] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/projection.ts:209-257] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:561-579]

**When not to use:** Do not repair a competing successor by last-write-wins, infer withdrawal from a newer timestamp, permit a cycle because replay terminates, or allocate an authoritative sequence for a relation that fails the prospective graph.

### 5. REFINE — The 036 relationship projection is structurally safe but temporally under-specified

The current 036 payload records predecessor, successor, scope, and a prose `strength_rationale`; its reducer folds verified ledger order, rejects structural invalidity, and derives the terminal successor. Neither payload nor projection contains `observed_at`, imputation state, valid-from/until keys, or a machine-checkable newer-evidence order. The spec even states that timestamps are audit metadata only. Preserve ledger sequence as ordering authority for assert/withdraw replay, but extend the supersession assertion with the predecessor and successor observation keys (or immutable references to claims that contain them) and validate semantic monotonicity during the same pre-append preview. Detection may propose; only the gateway-authorized append activates the relation. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events/spec.md:68-71] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events/spec.md:114-128] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts:120-139] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/projection.ts:580-607] [INFERENCE: semantic observation fields/references are the minimal addition that closes P5 without replacing ledger order]

**When not to use:** Do not parse `strength_rationale` to derive time, let detector confidence or timestamps alone authorize supersession, or reorder authorized relationship events by observation time during replay.

### 6. CONTRADICT — Nogood add-time refusal exists in the specification, not in the fold

The belief spec requires a derivation completing a nogood to be rejected on `ADD`, minimality reduction on record, and explicit `NogoodUnenforceable` handling. The fold's `BELIEF_ADD` path has no nogood admission check, while `NOGOOD` merely sorts/deduplicates and inserts members without enforcing cardinality, membership, minimality, or current truth state. G8 later reports a set whose members are all `IN`; the gate test deliberately folds the invalid set and asserts post-hoc failure. The golden nogood log likewise adds two already-`IN` beliefs and then successfully records their nogood. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/02-belief-layer.md:251-265] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:614-628] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs:416-438] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/tests/gates.rs:353-371] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/nogood.jsonl:2-4]

**When not to use:** Do not claim prospective nogood safety from G8, the golden fold, or deterministic replay. They detect or preserve an invalid state after admission; they do not refuse the completing event.

### 7. EXTEND — Nogoods need prospective refusal plus an invariant backstop

The authority boundary should preview and settle every candidate belief/edge/truth-changing event against the current active nogoods. If the prospective fixed point newly makes every member of a nogood `IN`, refuse before sequence allocation with a typed `NogoodCompleted` result naming the nogood and members; append no domain event and change no projection. Separately retain G8 as a full-replay invariant/backstop that quarantines corrupted, legacy, or externally imported streams rather than as normal control flow. `NOGOOD` declaration itself needs distinct existing members, deterministic minimality normalization, and an explicit policy for a set already complete; the spec's all-user-instruction case must surface `NogoodUnenforceable` rather than silently evicting authority-bearing instructions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/02-belief-layer.md:251-265] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/10-verification.md:43-56] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/10-verification.md:85-100] [INFERENCE: two-layer admission-plus-backstop separates expected refusal from corruption detection]

**When not to use:** Do not append then compensate for an event whose prospective settled state is already known to violate an active nogood; do not auto-retract user instructions; and do not drop an unenforceable nogood merely because admission cannot repair it.

## Closed P5 Temporal Supersession Contract

For one subject and replacement scope, a supersession assertion is legal only if:

1. Both immutable claims and evidence exist, and the successor is distinct from the predecessor.
2. Each claim exposes explicit `observed_at` plus imputation state; the authority supplies the successor's append sequence.
3. `(successor.observed_at, successor.append_seq) > (predecessor/current-terminal.observed_at, predecessor/current-terminal.append_seq)`.
4. The prospective effective relation graph is acyclic and leaves at most one active successor per predecessor; competition requires explicit withdrawal or a chain from the current terminal.
5. The predecessor's projected interval closes at the successor's composite key, never at receipt wall time; history remains append-only.
6. Older late arrivals remain auditable observations but do not displace the terminal assertion.
7. Assert/withdraw replay remains in verified ledger sequence; semantic-time ordering affects relation admission and temporal queries, not authority order.

This refines repo #1 rather than replacing it: the knowledge/evidence graph remains non-authoritative, while 036 performs the only admission and durable append. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-7] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events/spec.md:101-118]

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/time.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/event.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/fold.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/out-of-order.jsonl`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/nogood.jsonl`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/tests/gates.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/02-belief-layer.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/10-verification.md`
- `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/projection.ts`
- `specs/system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events/spec.md`

## Assessment

- `newInfoRatio`: 0.64
- Novelty: This pass closes P5 with a two-axis ordering rule, a composite validity interval and tie contract, explicit late-arrival behavior, prospective cycle/competition admission, and a verified gap between both Graphene and 036's current runtime surfaces. It separately proves that nogood refusal is absent from Graphene admission and isolates the necessary refusal/backstop split for the next pass.
- Confidence: High for the observed Graphene and 036 behavior and for the ordering/graph-safety constraints; medium-high for the exact composite interval query representation because implementation schema placement remains intentionally undecided.

## Reflection

- What worked: tracing the same claim through Graphene's standalone comparator, event shape, production fold, fixtures, then 036's payload and reducer made the semantic-time/authority-order boundary explicit.
- What failed: treating fixture names or G8 validation as evidence of admission behavior; both advertised mechanisms stop short of prospective refusal.
- Ruled out: arrival-order-first supersession, receipt-time validity closure, timestamp-only tie handling, last-write-wins competing successors, cycle repair during replay, G8 as normal admission control, and append-then-compensate for a prospectively known nogood violation.

## Recommended Next Focus

P5 prospective nogood refusal and invariant-backstop contract.
