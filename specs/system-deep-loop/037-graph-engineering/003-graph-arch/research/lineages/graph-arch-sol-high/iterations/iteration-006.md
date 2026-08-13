# Iteration 6: Durable Human Approval Gate

## Focus

This iteration specifies `GraphApprovalGateV1`, a single durable human-gate protocol for planner proposals, organization-policy ASK outcomes, and session execution holds. The contract binds an authenticated decision to one sealed consequence and one versioned dependency vector, then requires current-state revalidation, 036 authorization, and a fenced append before execution can resume. Approval files, checkpoints, and callbacks are transports or projections only and cannot release a protected consequence.

## Findings

1. **The three GraphARC mechanisms are partial projections of one gate, not separate approval authorities — REFINE Decisions 3 and 4 and EXTEND Graphene P7.** The planner file protocol binds a decision to a proposal fingerprint but deletes its request/decision files; policy ASK routes by approver role but returns a process-local Boolean; session holds persist request/decision state but bind only node/action and explicitly permit direct graph invocation to bypass the runner. `GraphApprovalGateV1` subsumes all three: proposal fingerprint becomes consequence evidence, ASK contributes rule and role requirements, and session holds contribute durable pause/resume projection. None is independently authoritative. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/approval_file.py:69-135] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/policy/approvals.py:88-140] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/runtime.py:16-65]

2. **Gate-open must seal the exact consequence and all semantic dependencies — CONFIRM Decision 1 and EXTEND Decisions 3 and 7.** A topology fingerprint alone does not bind node bodies, arguments, writes, effect intent, policy rule, approver assignment, or live authority. The open record therefore names the sealed compiled artifact and exact proposed edge/event/effect-intent digests, plus versioned organization policy, mode registry, principal/role resolution, authority epoch, budget reservation/head, topology, evidence/belief cuts, and every protected resource head. This is a dependency vector, not a display snapshot; any semantic change requires invalidation and a higher gate version. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/approval_file.py:69-89] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-004.md:9] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/research.md:386-432]

3. **A human decision is authenticated evidence, never a Boolean bearer capability — REFINE Decision 4 and CONFIRM Graphene P7.** `GraphApprovalDecisionV1` binds gate ID/version, request digest, allowed choice, principal, verified roles, authentication receipt, decision time, reason/evidence digest, and idempotency key. The principal must currently satisfy the approver expression captured at open; a callback's `true`, a JSON file containing the fingerprint, or `grapharc go` supplies neither identity nor authority. Approval becomes evidence for a fresh 036 evaluation; it cannot itself append a domain event or invoke an effect. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:721-789] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/approval.py:37-78] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/research.md:434-446]

4. **The lifecycle is an append-only, CAS- and fence-guarded state machine — EXTEND Decision 2 and Graphene P7.** The durable path is `open -> claim? -> decide -> revalidate -> append -> resume`; reject, timeout, cancel, invalidation, and reopen are explicit terminal or successor events. Each transition compares the current gate version and ledger head while holding the gate/resource fence. Parallel holds have distinct task IDs and may be decided independently, while a boundary group resumes only when its declared quorum/all-of rule is satisfied. SQLite's immediate transaction and status CAS are useful projection mechanics, but its runner claim is not a reclaimable lease and is not the canonical gate lock. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/store.py:295-370] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/runtime.py:267-375] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/locks-and-fencing-types.ts:64-109]

5. **Resume is permitted only after atomic freshness revalidation and a fenced 036 append — CONFIRM Decisions 2 and 4 and REFINE the approval seam.** At consequence time the gate service rereads the gate head, verifies the winning decision, recomputes every dependency digest/head/epoch, asks the 036 gateway to authorize the exact proposed event, and appends through the current fence with the expected ledger head. A mismatch appends `gate.invalidated` and optionally opens version `n+1`; it never silently carries approval forward. Only the durable append receipt can select the graph edge or release the exact held task, and any external action still requires a separate `EffectIntent` and recovery-safe adapter. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:212-315] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-625] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts:30-83] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/event-contracts.ts:412-457]

6. **Idempotency, timeout, and cancellation have separate machine semantics — REFINE Decision 2 and CONFIRM Graphene P7.** Repeating an identical open, decision, append, or resume request returns the prior verified receipt; reusing a key with different canonical bytes is a conflict. The first valid terminal decision for a gate version wins, late or contradictory decisions are refused and audited, and an approval is single-use for its exact consequence append. Timeout is a fenced system transition with `wait|expire|escalate`, never a fabricated human rejection; its timer carries gate version, deadline, and fence so it cannot close a reopened gate. Cancellation is an authenticated operator/system transition with a reason and either final closure or an explicit successor gate. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-610] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/approval_file.py:91-135] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/research.md:448-450]

7. **Gate enforcement belongs below every execution entry point — CONTRADICT GraphARC's direct-approval/bypass behavior and EXTEND Decision 8.** Planner callbacks and session runners can present gate commands, but the compiled consequence edge itself must require a verified append receipt. Direct `graph.invoke`, `grapharc go`, a checkpoint edit, a matching approval file, or calling the node body cannot mint that receipt. The runtime needs a `human-gates` service over the authorized ledger and fencing packages; planner files and session SQLite become restartable UI/query projections. An evaluation is a real gate only when its verdict structurally blocks or selects the next transition. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py:190-209] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py:482-519] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build an Eval Gate That Actually Blocks Bad Releases.md:41-89]

## Unified Schema

```ts
interface GraphApprovalGateV1 {
  schema_version: 'graph-approval-gate@1';
  gate_id: string;
  gate_version: number;
  state:
    | 'open' | 'claimed' | 'approved' | 'rejected'
    | 'revalidating' | 'invalidated' | 'appended' | 'resumed'
    | 'timed_out' | 'cancelled';
  lineage: {
    mode: string;
    run_id: string;
    session_id: string | null;
    boundary_id: string;
    task_id: string;
    predecessor_gate_id: string | null;
  };
  source: {
    kind: 'planner-proposal' | 'policy-ask' | 'execution-hold';
    source_request_id: string;
    source_projection_digest: string;
  };
  consequence: {
    sealed_graph_id: string;
    sealed_graph_digest: string;
    proposal_fingerprint: string | null;
    edge_id: string;
    event_type: string;
    event_digest: string;
    effect_intent_digest: string | null;
    writes_digest: string;
  };
  approval_requirement: {
    policy_id: string;
    policy_version: number;
    policy_digest: string;
    matched_rule_ids: readonly string[];
    approver_expression: unknown;
    allowed_choices: readonly ('approve' | 'reject')[];
    quorum: number;
  };
  dependencies: readonly {
    kind: string;
    resource_id: string;
    version: string;
    digest: string;
    expected_head: string | null;
  }[];
  context: {
    authority_epoch: number;
    principal_assignment_digest: string;
    organization_graph_digest: string;
    mode_registry_digest: string;
    budget_reservation_id: string | null;
    budget_head: string | null;
    topology_digest: string;
    evidence_cut_digest: string;
    belief_cut_digest: string;
  };
  timing: {
    opened_at: string;
    expires_at: string | null;
    timeout_policy: 'wait' | 'expire' | 'escalate';
  };
  concurrency: {
    resource_digest: string;
    fence_token: number;
    expected_gate_head: string;
  };
  idempotency_key_digest: string;
  request_digest: string;
  open_receipt: unknown;
}

interface GraphApprovalDecisionV1 {
  schema_version: 'graph-approval-decision@1';
  decision_id: string;
  gate_id: string;
  gate_version: number;
  gate_request_digest: string;
  choice: 'approve' | 'reject';
  principal_id: string;
  verified_roles: readonly string[];
  authentication_receipt_digest: string;
  evidence_digest: string;
  reason: string | null;
  decided_at: string;
  idempotency_key_digest: string;
  decision_digest: string;
}
```

All objects are closed and canonically encoded. `dependencies` is sorted by `(kind, resource_id)` and rejects duplicates. The request digest covers every field except derived receipts and mutable state; each transition event carries the prior gate head and changes state rather than rewriting the open record. The display payload may redact or summarize context, but the durable request digest and consequence identity remain exact. [INFERENCE: the schema combines GraphARC's three incomplete binding surfaces with the HumanGateContextSnapshotV1 dependency model and 036 request/decision identity]

## State Machine

```text
OPEN --claim--> CLAIMED --decide(approve)--> APPROVED --fresh--> REVALIDATING
  |                 |                          |                    |
  |                 +--decide(reject)--------> REJECTED             +--036 allow + fenced append--> APPENDED --> RESUMED
  |                                                            \
  +--timeout(wait)--> OPEN                                      +--dependency change/036 deny--> INVALIDATED --> OPEN(v+1)?
  +--timeout(expire|escalate)--> TIMED_OUT
  +--cancel--> CANCELLED
```

- `open`: authorize and append one gate-open event before exposing the prompt. An exact retry returns its receipt.
- `claim`: optional, leased coordination for assignment/UI ownership; claim expiry does not decide the gate.
- `decide`: authenticate the principal, resolve current roles, validate the gate version and choice, then CAS-append the first decision. Quorum gates accumulate distinct valid decisions until their declared threshold is met.
- `revalidate`: under the gate/resource fences, reread every dependency and recompute the exact consequence request. Missing evidence, changed digests, expired authority, released budget, or changed heads invalidates.
- `append`: run the 036 transition gateway and use its single-use allow proof with the expected head through `FencedLedgerWriter`. Approval is only evidence in that request.
- `resume`: consume the append receipt once for the exact `boundary_id/task_id/edge_id`; an exact recovery retry returns the recorded result and does not rerun the node.
- `timeout` and `cancel`: append their own current-version system transitions. They cannot race past a winning decision or affect a successor version.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/runtime.py:317-420] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/session/runtime.py:479-598] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts:30-83]

## Dependency and Freshness Revalidation

The minimum dependency vector is:

1. sealed graph/compiler artifact and exact consequence event/write/effect-intent digests;
2. organization-policy source/compiled digests, decisive ASK rule, approver expression, and evaluator version;
3. mode-registry/capability surface digest;
4. principal assignment, verified role set, and authority epoch;
5. budget reservation identity, amount/currency, expiry, and current budget ledger head;
6. every domain/audit/projection/resource expected head and required fence generation;
7. topology, evidence, belief, missing-data, and redaction digests that affected the human choice; and
8. gate ledger head, gate version, deadline, and terminal-decision status.

Revalidation is equality against the current authoritative providers, not a timestamp-only freshness window. A changed descriptive rendering is harmless only when its canonical semantic digest is unchanged. A changed policy, role assignment, budget, authority epoch, graph body, consequence, evidence cut, or protected-resource head invalidates even if the planner proposal fingerprint still matches. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/research.md:392-432] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:234-315]

## Idempotency, Timeout, and Cancellation

| Operation | Idempotency identity | Retry outcome | Conflict/late outcome |
|---|---|---|---|
| Open | boundary + task + consequence + dependency epoch | Return existing gate/open receipt | Same key with different request bytes is refused. |
| Decide | gate ID/version + authenticated principal + decision request | Return exact decision receipt | Different bytes conflict; non-current/terminal gate is late and audited. |
| Append | gate decision digest + exact consequence + expected heads | Return verified append receipt | Head/dependency change invalidates; proof cannot be reused. |
| Resume | append receipt + boundary/task/edge | Return recorded resume result | Wrong task/edge or already-consumed different request is refused. |

`wait` records or renews a deadline without inventing a choice. `expire` closes the current version. `escalate` closes it and opens a successor with a new approver expression/version. Cancellation requires authenticated transition authority and records whether the consequence is abandoned or a successor may be opened. A late approval after any terminal event never revives the old gate. [INFERENCE: these rules apply the gateway's request-digest idempotency and Graphene's versioned timeout semantics to the human gate]

## Bypass Mutants

Each mutant must fail without a domain append, budget mutation, protected projection, node execution, or external effect:

1. Write `{fingerprint, approved}` directly to the planner decision file.
2. Return `true` from a direct approval callback with no authenticated principal or role receipt.
3. Run `grapharc go` and treat command invocation as approval.
4. Call `graph.invoke` or the gated node body without the session runner.
5. Edit checkpoint/session approval state or replay an old decision after restart.
6. Keep topology/fingerprint stable while changing node body, arguments, policy, role assignment, authority epoch, budget reservation, or resource head.
7. Reuse one approval for a second append, task, parallel fan-out instance, or effect intent.
8. Let a stale timeout or cancellation for version `n` close reopened version `n+1`.
9. Crash after append and recover by running the node/effect again rather than returning the receipt.
10. Remove or no-op the gate while preserving a green evaluation report.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_planner_approval.py:1-210] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py:190-209] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py:582-719] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build an Eval Gate That Actually Blocks Bad Releases.md:41-62]

## Runtime Mapping

| Concern | Runtime owner | GraphARC compatibility surface |
|---|---|---|
| Canonical gate events and reducer | New `runtime/lib/human-gates/` package over the event registry and authorized ledger | Planner/session request objects are projections. |
| Principal, role, policy, request authorization | `authorized-ledger/transition-authorization-gateway` plus trusted identity resolver | Policy ASK supplies rule and required role, not a Boolean handler verdict. |
| Gate/resource concurrency | `locks-and-fencing` protected gate and ledger resources | SQLite transaction/claim is local coordination only. |
| Durable append and edge release | `FencedLedgerWriter` plus verified append receipt | Session runner consumes the receipt for exact task; checkpoint cannot release it. |
| External consequence | `receipts-and-effect-recovery` `EffectIntent` and adapter | Human choice never calls the adapter directly. |
| UI/file transport | Rebuildable request/decision views | `approval_file.py` may watch/export, but all commands enter the service and deletion loses no authority. |

Gate event types should include `gate.opened`, `gate.claimed`, `gate.decision-recorded`, `gate.invalidated`, `gate.reopened`, `gate.timed-out`, `gate.cancelled`, `gate.consequence-appended`, and `gate.resumed`. The reducer must derive current state solely from verified events. The compiled graph marks protected consequence edges with the required gate contract so every executor path enforces the same receipt boundary. [INFERENCE: this mapping reuses the existing authorized-ledger, fencing, and effect-recovery packages while replacing GraphARC's process-local authority seams]

## When Not to Use

- Do not open a human gate for read-only inspection, an informational acknowledgement, or a display-only choice with no protected state/effect consequence.
- Do not use human approval where a deterministic policy or evidence threshold can safely decide a reversible, low-blast transition; evaluation gates should be selected by consequence and rollback cost, not applied universally. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build an Eval Gate That Actually Blocks Bad Releases.md:147-180]
- Do not translate a policy DENY into a human override unless the source policy explicitly defines an ASK/escalation rule; denial is not a gate request.
- Do not use the gate as authorization, capability issuance, ledger fencing, budget reservation, effect execution, or recovery. It supplies bound human evidence to those owners.
- Do not use checkpoint files, approval files, callbacks, or database rows as the durable authority even in a single-process deployment; they may remain convenient projections.
- Do not reuse one gate across consequences merely because the artifact or question text appears unchanged.

## Ruled Out

- Planner checkpoint/decision files as canonical approval storage.
- Direct callback approval or `grapharc go` as a trusted human decision.
- A decision containing only request ID and Boolean outcome.
- Reusing approval because the proposal fingerprint or artifact digest is unchanged.
- Releasing a gated node from session/checkpoint state without a current append receipt.
- Treating timeout as a synthetic reject by an absent person.
- Letting the approval invoke an effect without a separate authorized `EffectIntent`.

## Dead Ends

None promoted. All three GraphARC approval paths contain reusable transport or projection behavior, but none alone satisfies the durable authority boundary.

## Edge Cases

- Ambiguous input: multiple parallel holds can share the same node/action. Resolved by binding every gate to a unique boundary and task instance; omission of request ID remains invalid when more than one live gate exists. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/tests/test_session.py:582-719]
- Contradictory evidence: planner documentation calls request/decision traces durable while the file handshake deletes both files, and the loop treats the act of running `go` as approval. Resolved by separating durable ledger events from ephemeral file transport and requiring authenticated decision plus fenced append. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/approval_file.py:1-15] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-arch/grapharc/planner/loop.py:721-727]
- Race: halt/cancel, approval, timeout, and fence takeover converge through current-version CAS; only the first valid terminal/append transition wins.
- Partial success: none; the gate contract, lifecycle, revalidation, idempotency, timeout/cancel, bypass tests, runtime mapping, and non-applicability boundary are decided at design level.

## Sources Consulted

- `context/graph-arch/grapharc/planner/{approval_file.py,loop.py}` and planner approval tests
- `context/graph-arch/grapharc/policy/approvals.py`
- `context/graph-arch/grapharc/session/{approval.py,runtime.py,store.py}` and session tests
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/`
- `.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/`
- `context/graphene-main/research.md` P7
- `context/blog-posts/How to Build an Eval Gate That Actually Blocks Bad Releases.md`
- Lineage iterations 1–5 and reducer-owned state.

## Assessment

- New information ratio: 0.86 (5 fully new schema/lifecycle/revalidation/idempotency/runtime decisions and 2 partially new authority/bypass refinements: `(5 + 0.5 × 2) / 7 = 0.857`, rounded).
- Questions addressed: How can planner, policy ASK, and execution holds become one durable human-gate contract without creating a second authorization path?
- Questions answered: Unified schemas, lifecycle, dependency freshness, decision identity, exactly-once semantics, timeout/cancel behavior, bypass mutants, runtime ownership, and when-not-to-use boundaries are decided at design level.
- Questions remaining: Budget reservation/debit/refund and graph evolution/migration remain open strategy slices.

## Reflection

- What worked and why: Tracing the same approval through proposal, policy, session, authorization, fencing, and effect boundaries exposed exactly where each existing mechanism stopped carrying identity or freshness.
- What did not work and why: Treating the proposal fingerprint as the common key was insufficient because it omits current authority, budget, policy, role, and resource heads.
- What I would do differently: Start the next slice from a concrete spend reservation and carry its head, fence, and receipts through authorize, append, effect, refund, and recovery.

## Recommended Next Focus

Specify the durable graph budget lifecycle: reservation, cumulative authorization basis, debit, release/refund, nested graph allocation, retry/recovery idempotency, authority and policy dependency binding, and exact interaction with gate revalidation and `EffectIntent`.
