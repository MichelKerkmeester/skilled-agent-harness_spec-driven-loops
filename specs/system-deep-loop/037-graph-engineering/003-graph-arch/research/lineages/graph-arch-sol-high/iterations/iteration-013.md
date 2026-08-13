# Iteration 13: Exact Graph Shadow-Parity Contract

## Focus

This iteration turns decisions 3–12 into a concrete legacy-versus-dark comparison contract over the shipped shadow-parity runtime. The contract retains the generic harness's closed manifests, verified sealed inputs, isolated roots, replay fingerprints, complete observation boundary, effect sink, deterministic reruns, divergence records, and non-authoritative certificates. It adds a versioned graph observation/comparator layer for admission/refusal, gate, authorization, budget, and causal-prefix ownership without treating GraphARC trace or replay artifacts as truth.

## Findings

1. **The existing parity harness is the mandatory outer protocol, but graph governance needs a versioned typed observation extension — EXTEND iteration 8 and REFINE iteration 10 finding 6.** V1 already closes terminal status, return value, error/halt, ordered transitions, effect receipts, budgets, emitted artifacts, and reader results; it rejects missing and undeclared observations. Graph parity additionally needs explicit admission/refusal, approval-gate, and authorization-decision classes because folding these into a generic transition digest would hide authority-zero and ordering failures. Add them in schema V2 rather than silently changing the V1 union; all paths still pass the same sealed-input, capture, replay, projection, rerun, and certificate gates. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:21-65] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:402-472] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:124-136]

2. **Frozen graph inputs must close every decision dependency before either path starts — CONFIRM iterations 3–6, 9, 11, and 12.** The existing capsule proves equal BASE, initial state, configuration, canonicalization versions, ordered sealed artifacts, timeout, and termination policy. The graph artifact-reference set must include proposal/admission proof, sealed compiled graph, node/body and mode-capability registries, source/compiled organization policy, transition/resource/gate catalogs, scripted approval fixtures, initial graph/domain/authorization/gate/budget ledger cuts, budget reservations, executor/model/tool fixtures, reducers/upcasters, scheduling/randomness contract, and legacy adapter/projection definitions. Mutable paths, credentials, live provider state, current host environment, and unscripted humans are forbidden case inputs. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:71-102] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:266-372] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/checklist.md:90-93]

3. **Normalization is a closed pre-comparison schema, never a tolerance pass — REFINE iteration 8 and CONFIRM iteration 12's canonical-identity boundary.** The generic harness canonical-hashes declared values and provides no fuzzy comparator. A graph adapter may normalize only predeclared transport volatility: independently minted transport IDs through a proven bijection to stable logical coordinates, isolated-root prefixes after containment verification, and timestamps/durations only on semantic surfaces whose contract marks them non-ordering and non-timeout-bearing. It must preserve field presence/type and causal rewrites. It may never sort, deduplicate, drop, coerce, round, redact away, or alias event type/version/order, graph/run/task/node/attempt identity, state delta, terminal/error, refusal, rule/effect/tenant/role, gate state, head/epoch/fence, budget amount/reservation/debit, effect intent/status, artifact digest, reader result, watermark, or legacy bytes. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:98-108] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:506-527] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts:660-745]

4. **Earliest divergence is the first unequal causal prefix at the earliest owning boundary, not the first object key or final digest — EXTEND iteration 10's earliest-owner rule.** The current generic harness compares in a fixed high-level order and maps divergence classes to broad owners. The graph comparator must first verify each path independently, then align events by stable causal coordinate `(graph, run, task, node, attempt, transition kind, parent logical ID)`, preserving ledger order. At the first missing/extra/reordered coordinate or field mismatch, it applies the fixed owner order: schema → admission/refusal → seal → policy → gate → budget → 036 decision audit → fenced domain append → effect → replay/projection → legacy reader. It records the common-prefix digest, ledger sequence/hop, field contract, expected/actual digests, and exact owner. Later matching terminal state cannot launder the earlier divergence. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:64-74] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:111-157] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/plan.md:85-87]

5. **GraphARC records are legacy observations, not independent truth — CONFIRM iteration 8 and CONTRADICT GraphARC trace's local “audit trail” claim at system scope.** Trace file order is useful as an observed legacy sequence, and malformed owned traces fail closed; however trace values may be truncated, phases are open, replay reconstructs rather than re-executes, and state semantics depend on caller-supplied reducers. Policy JSONL may show the local rule answer, session files may show the legacy hold/resume outcome, and local meters/usage callbacks may show observed consumption. None proves admission, authorization, canonical budget settlement, durable approval, effect execution, or ledger order. Authoritative legacy output bytes and unchanged legacy reader results remain the compatibility oracle until cutover, but parity with them proves behavioral compatibility—not correctness or authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/trace.py:1-12] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/trace.py:46-82] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:1-35]

6. **Every pass and failure must prove `authorityMutation=false` and effect suppression from the harness-owned sink — CONFIRM iteration 10 finding 4 and iteration 11 authority-zero invariants.** The harness creates separate path sinks, checks that declared effect receipts exactly equal sink receipts, returns legacy authority with no authority mutation for both pass and failure, and rejects certificates claiming mutation. Graph adapters must expose no live network/process/filesystem/provider capability and no authority-control writer; effect observations contain only canonical intent and `suppressed` receipts. A bypassed sink, unexpected authoritative file/ledger/head change, authority epoch/selector change, legacy reader redirection, or live effect is `harness-invalid`, aborts the entire mode promotion run, and cannot be normalized as an expected legacy difference. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:242-260] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:439-452] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/parity-certificates.ts:177-204]

7. **Promotion requires the generic fresh certificate plus graph-specific closure and mutant evidence — EXTEND iteration 10's promotion bundle and iteration 12's drift contract.** The shipped issuer already requires a non-zero complete mode set, zero divergence, repeated runs, legacy authority, immutable evidence, and fresh build/harness/comparator/replay/reducer/projection/adapter/policy bindings. `GraphParityPromotionEvidenceV1` must additionally bind graph observation/comparator schema, admission/seal/policy/mode-projection/gate/budget/authorization/effect contract digests, causal-normalization allowlist, known-defect dispositions, and the complete graph mutant manifest/results. It is evidence consumed by a later 036 authority transition; it cannot select a writer, redirect a reader, enable effects, or waive a divergence. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-types.ts:259-290] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/parity-certificates.ts:107-246] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/parity-certificates.ts:253-388]

## Comparison Schema

```ts
interface GraphShadowParityCaseV2 {
  schema_version: 'graph-shadow-parity-case@2';
  case_id: string;
  scenario_id: string;
  workflow_mode: string;
  contract_digest: string;
  frozen_capsule_digest: string;
  required_observations: readonly (
    | 'terminal-status' | 'return-value' | 'error-halt'
    | 'ordered-transitions' | 'admission-refusals'
    | 'authorization-decisions' | 'approval-gates'
    | 'budgets' | 'effect-receipts' | 'emitted-artifacts' | 'reader-results'
  )[];
  projection_ids: readonly string[];
  normalization_contract_digest: string;
  causal_comparator_digest: string;
  expected_owner_map_digest: string;
  timeout_ms: number;
  termination_policy: string;
}

interface GraphCausalObservationV1 {
  logical_id: string;
  parent_logical_id: string | null;
  graph_id: string;
  graph_version: number;
  run_id: string;
  task_id: string | null;
  node_id: string | null;
  attempt_id: string | null;
  kind: string;
  ledger_id: string | null;
  sequence: number | null;
  event_type: string;
  event_version: number;
  payload_digest: string;
  admission_or_refusal_ref: string | null;
  policy_ref: string | null;
  gate_ref: string | null;
  budget_ref: string | null;
  authorization_ref: string | null;
  effect_ref: string | null;
}

interface GraphParityDivergenceV2 {
  case_id: string;
  run_index: number;
  class: string;
  exact_owner: string;
  common_prefix_digest: string;
  causal_coordinate: string | null;
  ledger_sequence: number | null;
  field_contract: string;
  expected_digest: string | null;
  actual_digest: string | null;
  status: 'open';
}
```

The V2 adapter lowers its complete typed observation set into the generic harness only after closed schema validation. Generic replay fingerprints and legacy-byte projections remain independently verified; graph-specific observations do not replace them.

## Observation and Frozen-Input Matrix

| Concern | Frozen input | Required observation | Comparison authority |
|---|---|---|---|
| Proposal/admission | proposal bytes, checker/registry/catalog versions | admitted proof or complete refusal set | Admission verifier output; legacy `AdmissionResult` is observation only |
| Executable graph | sealed manifest, bodies, args, writes, reducers | graph/artifact digest at each transition | Seal verifier |
| Mode/policy | mode-capability projection, source/compiled policy | decisive/matched rules, effect, verified tenant/roles | Compiled policy + 036 audit; local policy log is observation |
| Approval | gate-kind catalog, scripted request/decision fixtures | ordered open/claim/decide/timeout/cancel/resume refs | Gate ledger; callback/session Boolean is observation |
| Budget | initial budget cut, reservation/lease, price/usage fixture | reserve/debit/settle/release, balances, exhaustion | Hierarchical budget ledger; local meter is observation |
| Authorization | initial domain/audit heads and authority epoch | allow/deny audit ref before domain event | 036 audit/domain linkage |
| Execution | deterministic schedule/randomness/model/tool fixtures | causal ordered transitions, terminal/return/error | Verified domain events; trace is legacy observation |
| Effects | effect-intent fixtures and suppressing adapter | intent plus harness-owned `suppressed` receipt | Shadow sink only; no live execution |
| Artifacts/readers | serializer, projection, watermark/integrity contracts | exact bytes, publication boundary, unchanged reader result | Legacy bytes before cutover plus verified dark projection |
| Replay | envelope/upcaster/reducer/projection/replay contracts | stored/effective/projection fingerprints and attestations | Independent verifier, never GraphARC reconstruction alone |

## Normalization Rules

1. The case manifest lists every normalized field, type, transform ID/version, scope, and proof that the field is transport-only.
2. Transport IDs may map only through a one-to-one logical identity table derived from sealed inputs; duplicate, missing, many-to-one, or content-dependent pairing blocks the case.
3. Root paths may replace only the verified isolated-root prefix. Traversal, symlink escape, suffix change, or reader-visible path changes remain divergences.
4. Timestamp/duration normalization is allowed only on semantic observations explicitly marked non-ordering. Timeout, expiry, gate freshness, budget lease, causal order, and exact legacy-byte surfaces retain their original values.
5. Normalization preserves field presence, scalar type, list cardinality, and causal references. Unknown fields/transforms fail closed.
6. No normalization may sort or deduplicate events, change aliases to canonical policy identities after capture, collapse denial/ASK/ALLOW, omit refusal/gate/budget/audit/effect records, round spend, or replace an error with a terminal success.
7. Exact legacy projection bytes are never normalized; compatibility includes order, whitespace, newline, suppression, integrity, timing, watermark, and reader result. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/checklist.md:64-75]

## Earliest-Owner Algorithm

1. Compile a non-zero closed case manifest; a missing baseline row owns the failure before execution.
2. Verify the same sealed reference set and capsule on both paths; unequal input owns the result and behavioral comparison does not begin.
3. Create disjoint physical roots, path guards, and effect sinks; isolation failure owns the result.
4. Execute both distinct implementations under the same timeout/termination/schedule contract.
5. Validate the complete declared observation set and graph V2 schemas; missing/extra observations stop before value comparison.
6. Independently verify ledger/replay fingerprints, projection integrity, and sealed-input binding for each path.
7. Build causal sequences in ledger/file observation order. Never sort by timestamp, step, filename, or node name.
8. Walk the common prefix. Missing/extra/reordered coordinates diverge at the first affected producer. At an aligned coordinate, compare fields by owner order: schema, admission/refusal, seal, policy, gate, budget, authorization, append/fence, effect, replay/projection, reader.
9. Compare terminal/value/error, artifacts, and exact legacy-reader bytes only after the complete causal prefix passes.
10. Repeat the sealed case at least twice; first per-path rerun difference is nondeterminism, not peer divergence.
11. Emit one open immutable divergence and block certification. Repair requires a fresh affected-case rerun; no waiver, tolerance, or rebaseline disposition exists.

[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/shadow-parity/shadow-parity-harness.ts:794-944] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md:142-154]

## Graph Promotion Bundle

```ts
interface GraphParityPromotionEvidenceV1 {
  schema_version: 'graph-parity-promotion-evidence@1';
  workflow_mode: string;
  generic_parity_certificate_digest: string;
  graph_case_manifest_digest: string;
  graph_observation_schema_digest: string;
  causal_comparator_digest: string;
  normalization_contract_digest: string;
  mutant_manifest_digest: string;
  mutant_result_digests: readonly string[];
  admission_contract_digest: string;
  sealed_graph_contract_digest: string;
  compiled_policy_digest: string;
  mode_capability_projection_digest: string;
  gate_contract_digest: string;
  budget_contract_digest: string;
  authorization_contract_digest: string;
  effect_contract_digest: string;
  legacy_adapter_digest: string;
  known_defect_disposition_digest: string;
  required_case_ids: readonly string[];
  case_evidence_digests: readonly string[];
  open_divergence_count: 0;
  authority_state: 'legacy_authoritative';
  authority_mutation: false;
  live_effect_count: 0;
  evidence_digest: string;
}
```

The bundle is complete only when the generic certificate verifies fresh against the same BASE/manifest/build and every graph binding and mutant result is current. A later 036 cutover request may cite it as evidence; the bundle has no writer, reader-selector, fence, capability, or effect seam.

## Comparison-Specific Mutants

| ID | Single injected defect | Earliest owner / result |
|---|---|---|
| CP01 | Same case label with different sealed proposal/policy/budget bytes | sealed-input owner / `input-inequivalent` |
| CP02 | Legacy and dark executors are the same derivation/implementation | harness owner / invalid independence |
| CP03 | Drop one admission refusal while terminal result still rejects | admission/refusal owner / causal-prefix divergence |
| CP04 | Normalize DENY/ASK/ALLOW, rule, tenant, role, or gate state | normalization schema / forbidden transform |
| CP05 | Reorder two domain events but preserve final projection | transition owner / first reordered coordinate |
| CP06 | Place authorization allow after its domain event | 036 audit-link owner / ordering divergence |
| CP07 | Hide stale approval behind matching resume output | gate owner / gate-ref divergence |
| CP08 | Compare local meter total while budget ledger debit differs | budget owner / budget divergence |
| CP09 | Bypass the suppressing sink for one network/process/filesystem call | harness/effect owner / abort and zero certificate |
| CP10 | Mutate authority flag, epoch selector, writer, or legacy reader | harness/authority owner / abort |
| CP11 | Sort trace by step/timestamp so final sequence matches | normalization/comparator owner / forbidden reorder |
| CP12 | Remove required reader or artifact observation | observation boundary / `missing-observation` |
| CP13 | Change dark reducer result while sharing raw observations | projection owner / `projection-semantic` |
| CP14 | Change one path across identical reruns | first differing path / `nondeterministic` |
| CP15 | Omit a known-defect baseline row or mark it protected | manifest owner / closure conflict |
| CP16 | Reuse certificate after policy, mode projection, comparator, or mutant drift | certificate verifier / `STALE_EVIDENCE` |

Mode-specific runtime tests already demonstrate the needed independence controls: distinct legacy/dark implementations, closed volatility allowlists, unexplained-difference refusal, reducer-internal divergence detection, exact fixture closure, and non-authoritative certificates. [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts:1342-1578] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-shadow-parity.vitest.ts:660-872]

## Legacy Compatibility

- Capture GraphARC trace JSONL in file order as a legacy observation and exact legacy byte surface when a protected reader consumes it. Do not promote it to domain-event truth.
- Use GraphARC replay/diff output only as an independently derived diagnostic observation; verify dark history through 036 replay fingerprints.
- Capture local policy decision/approval audit as legacy-shaped output, but compare canonical policy/gate/authorization truth through their owning references.
- Capture session event/state/checkpoint outcomes and reader behavior; do not accept checkpoint state as a durable gate receipt or resume authorization.
- Capture `BudgetMeter`/usage totals, exhaustion, and attribution as legacy observations; compare canonical reserve/debit/settle/head semantics from hierarchical budget evidence.
- Preserve known defects exactly according to frozen baseline disposition. Matching a known defect can satisfy compatibility but cannot satisfy a separate correctness or promotion requirement that declares the behavior forbidden.
- Until mode-scoped 036 cutover, legacy reader results and bytes are the compatibility oracle and legacy remains selected. A green shadow run does not change that selection.

## Non-Applicability

- Do not run dual-path shadow parity for a pure deterministic function better covered by direct golden/property tests unless it crosses a migration boundary.
- Do not use shadow parity against live mutable state, unscripted humans, real provider credentials, uncontrolled network/process/filesystem effects, or a destructive operation that cannot be isolated and suppressed.
- Do not use parity to decide whether legacy behavior is correct, secure, ethical, or desirable; it answers whether declared behavior is equivalent under frozen inputs.
- Do not use trace/replay/OTel, policy JSONL, session checkpoints, local budget meters, terminal-state equality, or certificate presence as authority.
- Do not compare two adapters derived from the same dark implementation and call it independent legacy parity.
- Do not normalize an unknown difference, waive a mutant, auto-accept a new baseline, or shrink the observation set to obtain green.
- Do not let a parity certificate authorize a state transition, select a writer/reader, acquire a fence, reserve budget, approve ASK, or enable an effect.

## Ruled Out

- Whole-trace sorting, terminal-state-only comparison, or generic object diff as causal parity.
- Treating GraphARC trace, replay, policy audit, session state, or local meters as canonical truth.
- Adding undocumented volatility tolerances after observing a failure.
- Comparing incomplete observation subsets or silently accepting extra observations.
- Reusing the same implementation on both sides or deriving both projections from one reducer.
- Issuing promotion evidence after any authority mutation, live effect, missing case, open divergence, mutant survivor, nondeterministic rerun, or stale binding.

## Dead Ends

The initial guessed test file `runtime/tests/unit/shadow-parity.vitest.ts` does not exist. Repository discovery found the generic suite at `shadow-parity-harness.vitest.ts` plus mode-specific `*-shadow-parity.vitest.ts` suites; the stale filename should not be retried.

## Edge Cases

- Ambiguous input: “legacy observations” can mean compatibility oracle or truth. The contract distinguishes them: authoritative legacy bytes/readers are the pre-cutover compatibility oracle, while canonical governance truth remains in the owning ledger/proof. Parity proves equivalence, not correctness.
- Contradictory evidence: GraphARC describes trace as replay points and an audit trail, but its recorder truncates values and replay explicitly reconstructs only recorded deltas with caller-supplied reducer semantics. The system contract therefore preserves trace as an observation and rejects it as canonical truth. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/trace.py:1-12] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/replay.py:19-35]
- Missing dependencies: the guessed generic test filename was absent; exact generic and mode-specific suites were located and provided the required evidence.
- Partial success: none; the test-path failure was recovered without narrowing coverage.

## Sources Consulted

- `.opencode/skills/system-deep-loop/runtime/lib/shadow-parity/{shadow-parity-types,shadow-parity-harness,parity-case-manifest,parity-certificates}.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/shadow-parity-harness.vitest.ts`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/{deep-ai-council,deep-review,deep-research,deep-alignment}-shadow-parity.vitest.ts`
- `specs/system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/{spec,plan,checklist}.md`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/observe/{trace,replay}.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/audit.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/{events,store}.py`
- `specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/runtime/{budget,usage}.py`
- Graph-arch lineage iterations 3–12

## Assessment

- New information ratio: 0.79
- Calculation: 4 fully new findings (typed graph observation extension, closed normalization, causal-prefix owner algorithm, legacy observation/truth classification) and 3 partially new mappings (frozen inputs, authority/effect invariants, promotion bundle/mutants): `(4 + 0.5 × 3) / 7 = 0.786`, rounded to `0.79`.
- Questions addressed: What exact frozen inputs, observations, comparisons, normalization rules, owners, invariants, mutants, and promotion evidence establish graph shadow parity?
- Questions answered: The V2 schema, observation/input matrix, normalization exclusions, earliest-owner algorithm, legacy compatibility/truth boundary, promotion bundle, mutants, and non-applicability are decided at design level.

## Reflection

- What worked and why: Tracing the generic harness's actual comparison order and certificate checks before reading GraphARC records separated reusable enforcement from graph-specific schema gaps.
- What did not work and why: The initial generic test name omitted the `-harness` suffix; exact file discovery exposed both the generic and mode-specific suites.
- What I would do differently: Begin the next cross-cutting pass with an ownership table spanning hierarchical budgets and locks, then trace one fan-out attempt across reserve, lock, authorize, append, settle, and recovery.

## Route Proof

- Resolved route: `mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Agent definition loaded: `.opencode/agents/deep-research.md`
- Iteration/run: `13/13`
- Executor: `cli-codex/gpt-5.6-sol/high/fast`
- Research actions: 5; no subagents.
- Stop policy: continue to maximum iteration count; convergence telemetry does not stop the lineage.

## Recommended Next Focus

Cross-cutting runtime mapping — hierarchical budgets plus locks and fencing. Map graph run/task/node/fan-out ownership, canonical resource order, reservations, debits, settlements, leases, epochs, fence capabilities, stale-worker exclusion, crash recovery, and approval/effect coordination without allowing a budget grant or lease to become transition authority.
