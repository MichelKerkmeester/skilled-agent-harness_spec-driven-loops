# Loop & Harness Engineering for system-deep-loop: NOOA + First Principles (Repo Study 5)

## Grounding (terms and sources)

- **036 / authority plane** is the *designated* transition-authority plane (packet `036-deep-loop-innovation`), still **in progress**: its event-ledger core runs additive/**dark** (the `DarkLedgerAdapter` authorizes *after* the legacy result is already final and returns that legacy result unchanged), and the authority cutover is planned/operator-gated. Its **target-state** role is to evaluate canonical requests, record authorization decisions, fence protected mutations, append authoritative events, account for budgets, govern effects, and select cutover/rollback. Because it runs dark today, the runtime's legacy writers remain operationally authoritative — so "only 036 may admit a protected transition" is a **target-state invariant this design is written against, not a currently-enforced runtime property**, and every subordination guarantee below is a design contract rather than live enforcement. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/README.md]
- **NOOA** is the NVIDIA Object-Oriented Agents research paper, arXiv `2607.20709`. It is external research and an idea source, not a controlled dependency, repository authority, or framework to adopt wholesale. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:15-20]
- **LOOP/HARNESS layer** means the bounded iteration, context, validation, memory, evaluation, state, dispatch, fanout, and recovery mechanisms occupied by `system-deep-loop`. It is distinct from the four preceding GRAPH-layer studies, whose graph, belief, replay, evidence, admission, governance, and authority decisions remain controlling. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-001.md:9-17]
- **Evidence labels:** `OBSERVED-IN-PAPER` identifies mechanisms explicitly described by the NOOA paper. `TEXT-CLAIMED` identifies paper or blog claims not independently reproduced here. `INFERENCE` identifies a repository design consequence derived from comparing those texts with studies 1–4 and the live runtime.
- **Citation traceability:** the 20 iteration narratives are the primary synthesis record. Their `[SOURCE: file:line]` chains reach the local NOOA paper, all twelve supplied blogs, prior studies, and live runtime contracts. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-001.md:1-40] through [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:1-44]
- **Status:** DESIGN-level. The study establishes proposed contracts and rejection boundaries. It does not establish shipped APIs, runtime correctness, performance, production fitness, or cutover authorization.

The run completed 20 iterations and reached a terminal self-reported novelty ratio of `0.03`. Its actual `stopReason` was `maxIterationsReached` because `stopPolicy=max-iterations` reserved stopping authority to the configured cap. The descending novelty telemetry is consistent with documentary corpus exhaustion but does not prove it — and the series is near-perfectly monotonic (regular ~0.04–0.08 steps), which reads as an executor-generated trajectory rather than genuinely measured per-iteration novelty, so it should be treated as trajectory metadata, not independent evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl:1,3-24] [INFERENCE: an executor’s novelty estimate — especially a suspiciously regular one — is weak evidence about its search trajectory, not independent proof of correctness or completeness]

## Executive Decision

The loop/harness layer adds a typed, inspectable contract around each bounded iteration without reopening the graph architecture. Adopt as proposals: a pre-commit typed iteration return, reducer-accepted continuity projections, a bounded read-only context facade, a closed local action vocabulary, and separated return/evidence verdicts. Adopt the harness mutant corpus first. Defer artifact handles pending measured benefit. Retain the live convergence vote, LEAF dispatch, deterministic prompt pack, append-only JSONL, post-dispatch validation, fanout isolation, and loop lock. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-018.md:9-26] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:9-19]

The most important near-term idea is a **validated, locally repairable typed return whose meaning is explicitly limited**. `IterationResultV1` can turn malformed output into field-specific feedback before canonical state is appended. This shortens failure recovery while preserving durable artifacts and replay. Type-valid must remain distinct from artifact-integrity-valid, evidence-accepted, stop-allowed, and transition-authorized. Agent-curated memory is the most consequential longer-term extension, but it is safe only as a reducer-owned retrieval projection with never-forget classes; it is not belief settlement. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-002.md:9-14] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-006.md:9-15]

The hard boundary is architectural — and today it is a design contract, not live enforcement, because 036 runs dark and the runtime's legacy writers remain authoritative (see Grounding). NOOA is principally a single-agent, in-process Python object model. It is not authority-aware. Its mutable object state, in-process code, and model-authored subagent calls cannot cross this repository’s trust boundary unchanged. Every extraction remains a proposal beneath 036. The controlling sequence is `candidate → return admission → evidence/trajectory acceptance → mode stop decision → exact transition request → 036 authorization or refusal → effect and receipt if authorized`. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:189-203] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:444-448] [INFERENCE: no earlier decision in this sequence acquires the authority owned by a later decision]

## What the Loop/Harness Layer Confirms / Refines / Extends / Contradicts

| Existing decision or mechanism | Verdict | Evidence and resulting decision |
|---|---|---|
| Study 1: graph projection over 036; loops are typed, bounded subgraphs | **CONFIRM + REFINE** | NOOA confirms typed method boundaries and refines the inside of one iteration with immediate return validation. It does not supply a sealed graph IR, scheduler, or authority plane. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-9] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-002.md:9-14] |
| Study 2: purpose-bound belief, contradiction preservation, executable negative knowledge | **CONFIRM + EXTEND; CONTRADICT if memory is treated as truth** | Agent-curated memory can improve recall and continuity. Merge, abstraction, reconciliation, decay, and forgetting remain retrieval operations; they cannot rewrite assertions or settle belief. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:13-19] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-006.md:9-15] |
| Study 3: admission is not authorization; 036 revalidates the exact consequence | **CONFIRM** | Return validation, semantic evaluation, convergence, and local execution produce evidence only. None is bearer authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:14-20] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-004.md:9-14] |
| Study 4: non-authoritative knowledge/evidence production and maintenance | **CONFIRM + EXTEND operationally** | NOOA adds loop-facing curation and reflection ideas. Study 4 remains stronger on provenance, temporal truth, ontology, entity resolution, reversible fusion, and producer evaluation. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:15-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-005.md:9-15] |
| Live convergence: rolling novelty, MAD noise floor, and question coverage, followed by legal and graph gates | **CONFIRM; do not replace** | NOOA validates a candidate return. The live vote decides whether accepted iterations nominate STOP, and the gates decide whether STOP is legal. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md:39-49,149-157] [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md:105-141] |
| LEAF dispatch: one bounded iteration, fresh context, no sub-dispatch | **CONFIRM isolation; CONTRADICT model-side spawning** | Preserve local adaptive tactics, but express wider work as a typed escalation to the workflow. A LEAF never creates a lineage or expands its own capabilities. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:33-48] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-009.md:9-14] |
| Prompt pack: deterministic rendering of bounded state and a three-artifact contract | **CONFIRM + EXTEND** | Retain deterministic rendering as bootstrap and fallback. Add bounded, pinned, audited read capabilities for event history and volatile projections. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/prompt-pack.md:19-47] [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:8-31,53-81] |
| JSONL state and reducer ownership | **CONFIRM + EXTEND** | JSONL remains append-only evidence; reducer-owned projections remain disposable. Memory and context events may extend the log but never replace or rewrite it. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:16-34] [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:247-268] |
| Post-dispatch validation | **REFINE** | Keep the shipped validator as the durable backstop. Add pre-commit return admission and bounded local shape repair before canonical append. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/validation/post-dispatch-validate.md:19-48] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-003.md:9-17] |
| Fanout: command-owned isolated lineage directories and executor state | **CONFIRM; CONTRADICT worker-owned topology** | A local tactic may request parallel work, but only the workflow may create lineages and define expected fan-in. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:19-36] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-016.md:9-17] |
| Loop lock: single writer, stale detection, heartbeat, owner-scoped release | **CONFIRM** | No memory, context, or local-action capability may refresh, steal, reinterpret, or release another owner’s lock. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/loop-lock.md:19-47] |

## P1 — Validated Iteration Returns

**Design decision.** Define `IterationResultV1` as a pre-commit envelope containing `iteration`, `mode`, `status`, `focus`, narrative/state-delta/evidence references (a minimal `{artifactId, contentDigest, snapshotHead}` reference — NOT the deferred P6 `ArtifactHandleV1`; P1 ships on content-digest admission and does not depend on P6), answered/open question identifiers, negative-knowledge records, proposed graph events, novelty evidence, `nextFocusProposal`, and an optional advisory `terminalCandidate`. The envelope proposes a commit; durable artifacts and canonical JSONL remain replay authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-002.md:9-14]

Permit at most two field-shape repair turns, charged to the same iteration budget. Emit closed diagnostics containing `code`, `path`, `expected`, `observed`, and `repairAttempt`. An unrepaired candidate closes as `invalid_return` and follows existing workflow redispatch or error routing. Semantic defects do not enter this repair loop. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-003.md:9-17]

**Evidence.** `OBSERVED-IN-PAPER`: NOOA validates the model’s candidate against the declared return annotation and feeds a specific failure back into the method loop. `TEXT-CLAIMED`: the blogs independently support verify-before-complete and hard manager-owned iteration limits. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:116-130,205-207] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:63-99]

**Insertion point.** Insert return admission immediately after LEAF candidate emission and before canonical JSONL append. Implement the schema and artifact/digest checks beside `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts`; wire the bounded repair counter into `.opencode/commands/deep/assets/deep-research-auto.yaml`; retain current post-dispatch validation as the durable backstop. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/validation/post-dispatch-validate.md:35-49]

**Verdict and 036 boundary.** **CONFIRM** typed subgraph exits; **REFINE** the live handoff; **EXTEND** pre-commit diagnostics. Type-valid does not mean evidence-accepted, converged, or authorized. `terminalCandidate` cannot select a protected edge or transition.

## P2 — Agent-Curated Memory Without Truth Corruption

**Design decision.** Define `MemoryProposalV1` with the proposal operations `remember`, `revise_projection`, `associate`, `abstract`, `suppress_from_working_set`, and `restore`. A LEAF proposes; the reducer validates references and owns acceptance. Merge creates a derived record referencing every input. Abstraction is explicitly lossy and records coverage plus source handles. “Forget” means retrieval suppression, activation decay, or derived-index removal—not historical deletion. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-006.md:9-15]

Never-forget classes include source assertions and provenance; contradiction and supersession chains; policy and schema digests; authoritative requests, decisions, refusals, fences, budgets, effects, and receipts; rejected approaches and negative knowledge; memory-access decisions; open questions and unresolved blockers. Sensitive-data erasure belongs to a separate retention authority and must leave the authorized tombstone or audit evidence required by policy. Authoritative-history classes (requests, decisions, refusals, fences, budgets, effects, receipts) must be **read through from their authoritative log**, never cached as authoritative in the reducer memory projection: the projection may hold retrieval copies, but a consumer needing authority must resolve the current authoritative record, so the memory view can never silently serve a stale authoritative event as current. [INFERENCE: removing these classes would corrupt replay, refusal, dead-end avoidance, or accountability; a cached copy in a non-036 reducer projection must never stand in for the authoritative record]

**Evidence.** `OBSERVED-IN-PAPER`: NOOA exposes seven deliberate memory operations (`remember`, `recall`, `search`, `update_memory`, `forget`, `associate`, `deref`); combines embedding, keyword, activation, and graph retrieval; avoids reinforcing a memory merely because the harness injected it; and uses asynchronous reflection to merge, relate, abstract, rescore, archive, and prune. These are loop-learning mechanisms. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:209-231]

**Insertion point.** Add typed proposal and reducer-decision events to the append-only state contract in `.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md`. Extend `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` to maintain the retrieval projection, following the existing leaf-observes/reducer-promotes ownership pattern. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:247-268]

**Verdict and 036 boundary.** **EXTEND** runtime continuity; **CONFIRM** study-2 belief separation; **CONTRADICT** NOOA-style reconciliation if interpreted as truth settlement. Memory may change recall ranking. It may never settle belief, erase contradiction, close a question without evidence, authorize STOP, or authorize a transition.

## P3 — Model-Callable Context and Event APIs

**Design decision.** Retain the deterministic prompt prefix, then expose a minimal read-only facade:

- `state_summary()`
- `recent_events(cursor, limit)`
- `event(id)`
- `open_questions(limit)`
- `coverage_gaps(limit)`
- `ruled_out(limit)`
- `artifact_preview(handle, bounds)`
- `recall_continuity(query, limit)`

Every response returns bounded content plus `sourceHandle`, `sourceDigest`, `snapshotHead`, `nextCursor`, and `truncated`. A stale cursor returns `snapshot_mismatch`; it never silently combines pages from different state heads. Harness-owned `context_read` events record normalized arguments, returned handles, state head, truncation, and cost without copying sensitive payloads into the log. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-008.md:9-15]

**Evidence.** `OBSERVED-IN-PAPER`: NOOA separates cacheable static blocks, append-only typed events, and re-evaluated dynamic blocks, then exposes context and event operations to model-executed code. `TEXT-CLAIMED`: the blogs favor clean worker context and designed, bounded results over inherited transcript growth. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:132-165] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:116-149]

**Insertion point.** Extend `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` and the iteration prompt-pack assembly path with an optional capability provider. Keep `.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` as deterministic bootstrap and degraded mode. Record reads through the existing JSONL append path.

**Verdict and 036 boundary.** **CONFIRM** context isolation and replay; **EXTEND** prompt-pack into a capability-backed facade. The API may reveal pinned state. It may not append canonical events, rewrite reducer views, acknowledge questions, select graph edges, alter convergence, change executor or budget policy, spawn work, widen scope, or authorize effects.

## P4 — Programmable Loop Engineering Inside Fixed LEAF Boundaries

**Design decision.** Formalize a closed local action vocabulary: `read_handle`, `query_events`, `preview_artifact`, `call_declared_tool`, `run_pure_helper`, `transform_local`, `validate_candidate`, `record_observation`, `propose_memory_op`, `propose_next_focus`, and `return_candidate`. Every action produces a typed observation and is charged to predeclared tool, time, token, memory, and bytes-read budgets. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-010.md:9-15]

Wider needs become typed data: `need_parallel_work`, `need_new_source_scope`, `need_human`, `need_protected_effect`, or `budget_exhausted`. Only the enclosing workflow may convert that proposal into an edge, dispatch, gate, or refusal.

**Evidence.** `OBSERVED-IN-PAPER`: NOOA CodeAct permits loops, conditions, async calls, helpers, libraries, and typed values in a persistent method-local REPL. It also permits mutation through `self` and subagent construction, which marks the non-transferable boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:189-203]

**Insertion point.** Express the closed action set in the iteration capability matrix and enforce it through `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/permissions-gate.ts`. Reflect the allowed and forbidden operations in `prompt-pack-iteration.md.tmpl`. Keep dispatch and fanout in the command workflow, executor selection in the runtime configuration, and locking in `loop-lock.ts`.

**Verdict and 036 boundary.** **REFINE** existing LEAF behavior into an explicit programmable policy; **CONTRADICT** model-owned spawning, unrestricted imports, durable `self` mutation, and in-process execution across trust boundaries. A local tactic may compute a candidate. It may never obtain a capability, create a lineage, mutate the loop lock, select an executor, or execute an unreceipted protected effect.

## P5 — Three-Layer Evaluation Architecture

**Design decision.** Make the three evaluation layers explicit — **A** return-admission, **B** evidence/trajectory acceptance, and **C** 036 transition-authorization — while retaining convergence (`StopDecision`) as a separate stop mechanism, shown in the table between B and C for placement, not as a fourth evaluation layer:

| Stage | Typed result | Meaning and failure route |
|---|---|---|
| A. Return admission | `ReturnAdmissionV1` | Schema, route, artifact existence, digest, and append discipline. Failure uses bounded shape repair, then existing redispatch/error handling. |
| B. Evidence and trajectory acceptance | `IterationEvidenceVerdictV1` | Citation resolution, claim/source agreement, honest question coverage, scope and budget compliance, contradiction retention, negative knowledge, and evaluator independence. Failure returns to targeted research or recovery. |
| Mode stop | `StopDecision` | Existing novelty, MAD, coverage, quality, legal-stop, and graph-blocker checks. This is intentionally not one of the three evaluation layers. |
| C. Transition authorization | 036 decision and receipt | The exact protected request is authorized or refused against current authority, policy, budget, fence, and effect facts. |

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-011.md:9-15]

**Evidence.** `OBSERVED-IN-PAPER`: NOOA validates returns locally but evaluates interface capability and end-to-end task behavior separately. `TEXT-CLAIMED`: the evaluation blogs require deterministic checks before model judges, trajectory evaluation alongside final-output evaluation, and routing consequences for verdicts. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:205-207,239-307] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:32-88]

**Insertion point.** Layer A extends the pre-commit side of `post-dispatch-validate.ts`. Layer B runs after return admission and before the accepted iteration reaches convergence. The current convergence implementation and its `StopDecision` semantics remain unchanged. Layer C remains entirely within 036.

**Verdict and 036 boundary.** **CONFIRM** gate and authority separation; **REFINE** runtime terminology; **EXTEND** loop-level evidence evaluation. Prohibit a generic `validated` boolean. Use scoped names such as `shapeValid`, `artifactIntegrityValid`, `evidenceAccepted`, `stopAllowed`, and `transitionAuthorized`. No evaluator or aggregate score may inherit 036 authority.

## P6 — Context Efficiency and Pass-by-Reference Analogues

**Design decision.** Defer promotion and prototype `ArtifactHandleV1` only for large, sensitive, reused, or selectively queried evidence. Minimum fields are `artifactId`, `kind`, `schemaVersion`, `contentDigest`, `snapshotHead`, `byteLength`, `mediaType`, `ownerScope`, `capabilityScope`, `createdBy`, `retentionClass`, and an optional canonical query descriptor. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-013.md:9-15]

`ArtifactPreviewV1` adds a bounded sample, an omitted-region description, `completeness=false`, and the exact handle and digest. A preview supports navigation, not claims about unseen regions. Dereference returns the pinned bytes or projection, or `stale_or_missing`; it never resolves silently to latest content at the same path.

**Evidence.** `OBSERVED-IN-PAPER`: NOOA renders bounded previews with type and true length while preserving access to the live in-process object. The transferable principle is progressive disclosure. The live-object implementation is not a safe persistence or cross-process contract. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:169-193]

**Insertion point.** Build handle resolution above `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs`, then expose bounded preview and dereference through the P3 facade. Bind handles into `IterationResultV1` and JSONL audit events. Keep ordinary paths as human-readable locators, not integrity identities.

**Verdict and 036 boundary.** **CONFIRM** sealed-reference and replay requirements; **EXTEND** context efficiency; **CONTRADICT** live mutable cross-iteration references and path-only identity. A valid handle proves identity, integrity, snapshot, and scope. It does not authorize use in a protected transition.

## P7 — Loop/Harness Evaluation Corpus

**Design decision.** Build a pinned mutant corpus before rolling out P1–P6. Each fixture declares initial state, prompt-pack and policy digests, capabilities, injected fault, expected layer verdict, expected durable events, forbidden events and effects, and replay outcome. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-015.md:9-16] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-016.md:9-17]

Required families include:

- malformed return with otherwise excellent evidence;
- valid return with nonexistent or misrepresented evidence;
- correct output reached through a forbidden trajectory;
- accepted iterations with an unresolved convergence blocker;
- converged evidence refused by 036;
- stale recall, reflection blur, provenance loss, and memory self-reinforcement;
- repeated exhausted approaches and runaway repair;
- worker/verifier context contamination and same-model blind spots;
- incomplete fan-in, cross-lineage writes, shared executor state, and raw-output context collapse;
- live-holder, stale-holder, nonce, refresh, and release lock faults;
- context or local-action attempts to widen capability or perform an effect.

**Evidence.** `TEXT-CLAIMED`: the blogs consistently require hard stops, clean evaluator context, trajectory checks, hidden-dependency tests, and permanent regression cases. The paper’s author-reported stress-suite gap motivates failure localization, but does not validate this corpus or set its thresholds. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-012.md:9-16] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-017.md:9-24]

**Insertion point.** Add fixtures beneath `.opencode/skills/system-deep-loop/runtime/tests/`, adjacent to the existing prompt-pack, post-dispatch validation, fanout, and loop-lock coverage. Add mode-specific reducer and memory cases beside deep-research reducer tests. Convert the recorded same-CLI recursion-guard dispatch failure into a permanent harness fixture. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl:2]

**Verdict and 036 boundary.** **EXTEND** causal-prefix parity and negative-control coverage; **ADOPT test-first**. A passing corpus supports a promotion proposal. It does not authorize deployment or cutover. Any mutant that produces a forbidden protected effect is a hard failure regardless of aggregate score.

## The Six Deltas for system-deep-loop

| Delta | Adoptable change and insertion point | 036 boundary |
|---|---|---|
| 1. Typed `IterationResult` plus local repair | Add `IterationResultV1`, artifact/digest admission, typed diagnostics, and at most two local shape repairs before canonical append. Insert beside `post-dispatch-validate.ts` and wire repair into the deep-research command workflow. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-002.md:9-14] | A valid return is a commit proposal, not convergence or authorization. |
| 2. Three separated validation layers | Add `ReturnAdmissionV1` and `IterationEvidenceVerdictV1`; retain `StopDecision` between evidence acceptance and the 036 decision. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-011.md:9-15] | No verdict inherits transition authority. |
| 3. Prompt pack to capability-backed context facade | Keep deterministic rendering in `prompt-pack.ts` and the template. Add bounded, pinned, audited reads for volatile state and artifact previews. P6 handles are conditional infrastructure within this delta, not a prerequisite for small values. | Read capabilities may expose evidence; they may not mutate control, authority, scope, or canonical state. |
| 4. Agent-curated continuity as a non-authoritative projection | Add `MemoryProposalV1` events and reducer-maintained recall projections in the JSONL/reducer path. Preserve never-forget classes and source chains. | Reconciliation changes retrieval preference only; it cannot settle belief or delete authoritative history. |
| 5. Programmable tactics inside a fixed LEAF | Enforce the closed action set through the capability matrix and permission gate. Convert wider needs into typed escalation proposals. | A LEAF cannot spawn, widen capability, alter budget or lock state, or execute protected effects. |
| 6. Evaluate the harness | Land single-fault and interaction mutants for return admission, evidence, memory, context, convergence, fanout, lock, and authority before functional rollout. | Test success permits evidence-backed promotion review only; 036 retains cutover authority. |

The six deltas are additive. None replaces the graph design, append-only state, reducer ownership, convergence system, fanout ownership, loop lock, or 036.

## Explicit When-Not-to-Use Boundaries

- Do not let a type-valid return imply semantic acceptance, convergence, or authorization.
- Do not add local repair to deterministic outputs or semantic failures that require new evidence.
- Do not permit unbounded repair; it creates a hidden inner loop with uncontrolled budget and unverifiable progress.
- Do not use curated memory when an authoritative source can be queried cheaply and directly.
- Do not let memory reconciliation become belief settlement, erase contradiction, or delete canonical history.
- Do not use the context facade when a small, stable, bounded prompt already supplies the required evidence.
- Do not replace small immutable values with artifact handles; indirection requires measured context, privacy, reuse, query, or replay pressure.
- Do not use programmable model tactics for deterministic transformations, protected effects, capability acquisition, or new-agent scheduling.
- Do not adopt model-side lineage spawning. Fanout identity, containment, budgets, expected fan-in, and recovery remain workflow-owned.
- Do not fan out work without genuine independence and explicit expected/received/failed lineage accounting.
- Do not provide unrestricted in-process Python, imports, or mutable live objects across trust boundaries.
- Do not use one scalar or one model judge to settle shape, evidence, trajectory, convergence, truth, and authority.
- Do not treat a preview as complete evidence or a path as immutable identity.
- Do not infer local production fitness from NOOA’s benchmarks or repeated claims across related blog posts.
- Do not introduce any P1–P6 mechanism before its corresponding P7 mutants can detect both its intended failure and its authority-escalation failure. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-019.md:9-30]

## What NOOA Does NOT Give Us

- NOOA gives an agent-as-Python-object model, not an authority-aware multi-agent graph runtime.
- It does not supply 036-equivalent transition admission, authoritative ledgers, fences, effect receipts, budget authority, durable human gates, or cutover governance.
- Its in-process execution model requires an external sandbox or permission boundary; rejection of selected loop-breaking calls is not a complete trust boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:444-448]
- Type validation proves return shape. It does not prove artifact integrity, citation truth, task correctness, acceptable trajectory, convergence, or authorization.
- Agent-curated memory supports loop learning and retrieval. It does not provide purpose-bound belief settlement, authoritative truth maintenance, retention authority, or transition authority.
- Live object references do not provide durable cross-process identity, immutable snapshots, replay, or capability-scoped dereference.
- Model-authored helper loops and subagents do not provide safe workflow ownership, lineage isolation, complete fan-in, or lock discipline.
- The paper’s benchmark figures are author-reported. This study did not independently reproduce its interface-capability, SWE-bench, Terminal-Bench, or memory-ablation results. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:243-307]
- The twelve blogs provide useful first principles and failure hypotheses. Their agreement is not independent replication, and their promotional performance claims are not local acceptance evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-017.md:29-43]

## Terminal Audit and Remaining Evidence

The documentary questions are closed at design-decision level. No P1–P7 contract is yet a shipped or performance-validated runtime feature. A prototype must establish the following evidence before any promotion proposal:

| Evidence area | Required measurement |
|---|---|
| Validated-return repair budget | Candidate validity on first attempt; repair-attempt distribution; defect localization accuracy; tokens and latency per repair; redispatch and terminal-error rates; semantic defects incorrectly “repaired”; canonical append/replay equivalence. The hard local budget remains two shape repairs. |
| Memory recall and precision | Recall@k and precision@k against a labeled continuity set; stale/superseded recall rate; contradiction and provenance retention; negative-knowledge retention; non-reinforcement under repeated harness injection; false abstraction and false reconciliation rates; reducer replay equivalence. |
| Context-API efficiency | Prompt tokens, bytes fetched, query count, p50/p95 latency, cost per accepted iteration, correctness, citation resolution, stale-cursor detection, replay success, truncation disclosure, and unauthorized dereference refusal versus the current prompt-pack baseline. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-014.md:9-15] |
| Harness mutant kill rate | Killed/total by return, evidence, trajectory, memory, context, convergence, fanout, lock, and authority family; single-fault localization; false-positive rate; causal-prefix replay equality; and zero forbidden protected effects. |
| Concurrency and recovery | Separate lineage directories and executor state; expected/received/failed fan-in accounting; cross-write containment; lock live/stale/nonce behavior; crash reconstruction from JSONL and deltas; deterministic reducer outputs. |
| Promotion safety | Shadow traces, refusal parity, authority suppression, canary behavior, rollback rehearsal, version and policy digests, and an independently evaluated 036 cutover request. |

The next informative step is therefore a mutant-driven shadow prototype, not another documentary pass. P7 should land first; P1 and P5 should shadow the current artifact path next; P2 and P3 should remain feature-gated; P4 follows capability and budget proof; P6 remains deferred until paired measurements justify its indirection. [INFERENCE: the remaining uncertainty is executable and empirical]

## Convergence Report

| Dimension | Result |
|---|---|
| Iterations | 20 of 20 completed, with one narrative and canonical iteration state record per pass. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl:3-22] |
| Stop reason | `maxIterationsReached`. The configured `stopPolicy=max-iterations` made the iteration cap authoritative for this run. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl:1,23-24] |
| Angle coverage | P1–P7 were resolved at design-decision level. The full twelve-blog comparison, live-runtime audit, when-not-to-use audit, and 036 subordination question were also marked answered: 10/10 tracked questions. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-dashboard.md:63-80] |
| Novelty trend | `0.96 → 0.88 → 0.82 → 0.77 → 0.72 → 0.68 → 0.63 → 0.59 → 0.55 → 0.50 → 0.46 → 0.41 → 0.36 → 0.31 → 0.26 → 0.21 → 0.16 → 0.11 → 0.07 → 0.03`. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-dashboard.md:33-54] |
| Terminal passes | Iteration 18 isolated additive live-runtime gaps; iteration 19 falsified overuse; iteration 20 closed P1–P7 and reaffirmed 036 subordination. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-018.md:34-42] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-019.md:35-43] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:36-44] |
| Honest interpretation | The run practically converged on a stable design under a fixed documentary corpus, with terminal novelty near `0.03`. That figure is self-reported executor telemetry, and its near-perfectly-monotonic series (regular ~0.04–0.08 steps) reads as an executor-generated trajectory rather than genuinely measured per-iteration novelty — treat it as trajectory metadata, not independent evidence of corpus exhaustion. Because the legal stop was the iteration cap rather than independently certified convergence, it proves neither architectural completeness nor production fitness. [INFERENCE: documentary saturation and executable validation are distinct claims; a suspiciously regular novelty series is weak evidence] |