# NOOA Loop/Harness Theory for `system-deep-loop`

## 1. Scope and Evidence Discipline

This study asks what the NVIDIA Object-Oriented Agents (NOOA) paper and the twelve supplied graph-engineering posts contribute to the **LOOP/HARNESS** layer after studies 1–4 have already established the graph, belief, evidence, replay, admission, and authority design. It does not reopen those earlier decisions. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:59-75]

The evidence labels used below are load-bearing:

- **`OBSERVED-IN-PAPER`** means the local paper text explicitly describes the mechanism.
- **`TEXT-CLAIMED`** means a paper or blog reports a result or states doctrine; it was not independently reproduced in this lineage.
- **`INFERENCE`** means this study derived a repository design implication by comparing the external text, studies 1–4, and the live runtime.
- **`CONFIRM / REFINE / EXTEND / CONTRADICT`** describe the relationship to both the inherited graph design and the live loop/harness contract.

NOOA is an external idea source. It is neither a dependency controlled by this repository nor an authority whose abstractions can bypass local validation, replay, or 036. The paper's reported 97.9% interface-capability result, harder-suite performance, and memory improvement are author-reported measurements; they motivate local tests but establish no local acceptance threshold. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:243-307] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:39-39]

The run completed the requested 20 iterations under `stopPolicy=max-iterations`. Ratios below 0.05 were telemetry only; synthesis did not start early. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl:1-24]

## 2. Executive Verdict

**Verdict: adopt five bounded loop/harness proposals, adopt the mutant corpus first, defer artifact handles pending measurement, and reject wholesale NOOA adoption.** The useful delta is additive: a pre-commit typed iteration return, reducer-owned memory projections, a bounded read-only context facade, a closed local action vocabulary, and distinct return/evidence verdicts. P7's negative corpus is the prerequisite for all of them. P6's handle layer should remain a prototype until paired local traces show a context or privacy benefit without weakening correctness, replay, or refusal. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:9-21]

No evidence requires replacing the live three-signal convergence vote, LEAF-per-iteration dispatch, prompt pack, append-only JSONL, reducer, fanout isolation, or loop lock. Those are the durable harness backbone. The proposals improve how a bounded iteration obtains context, produces a candidate, exposes evidence, and fails locally; they do not create a second scheduler or authority system. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-018.md:9-19]

NOOA's in-process live objects, durable `self` mutation, unrestricted imports, and model-authored subagent spawning contradict this runtime's trust and ownership boundaries if copied directly. The paper itself identifies external sandboxing and permission controls as necessary. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:189-203] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:444-448]

## 3. Inherited Graph and Authority Baseline

Studies 1–4 remain controlling. Study 1 establishes graph projection, typed executable IR, scheduling, gates, replay, typed subgraphs, parity, and the separation of stable organization from ephemeral work. Study 2 hardens belief settlement, contradiction, causal-prefix replay, refusals, and live-context human gates. Study 3 hardens admission, sealing, policy provenance, durable gates, budgets, effects, and promotion while keeping 036 authoritative. Study 4 closes the knowledge/evidence-production methodology. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:11-19] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:14-20] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:3-21]

The resulting boundary is conjunctive, not substitutive:

| Plane | Owner | This study may change it? |
|---|---|---|
| Candidate production | Bounded LEAF iteration | **Yes, locally:** typed return, safe read facade, closed tactics. [INFERENCE: P1, P3, and P4 operate before canonical acceptance] |
| Evidence projection and retrieval | Reducers and evidence-plane producers | **Yes, additively:** non-authoritative memory proposals and optional handles. [INFERENCE: P2 and P6 modify projections, not source truth] |
| Graph readiness, scheduling, joins, fanout | Workflow/graph runtime | **No:** LEAF may only propose escalation. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:24-34] |
| Mode convergence and legal stop | Existing convergence system | **No:** accepted iterations remain its inputs. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md:105-141] |
| Protected transition and durable authoritative event | 036 | **No:** sole authority plane. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20] |

`CONFIRM studies 1–4`: the paper's method-local call/render/act/update/validate loop can refine one node's internal harness. It is not itself a sealed graph, scheduler, belief system, or transition authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:108-130] [INFERENCE: method-local control is subordinate to the inherited outer graph]

## 4. What the Paper and Twelve Blogs Actually Contribute

### Primary NOOA extraction

`OBSERVED-IN-PAPER`: NOOA combines typed inputs and outputs, bounded previews over live values, code as action, programmable method-local loops, explicit object state, a memory manager, and model-callable context/event APIs. The transferable first principle is that an agent method can have a typed, inspectable local runtime rather than an opaque text-in/text-out turn. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:16-20] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:108-231]

`OBSERVED-IN-PAPER`: return validation sends field-specific failure back into the local loop; context is decomposed into static, event, and dynamic regions; memory offers deliberate and reflective operations; and bounded previews disclose type and true size while retaining access to the full in-process object. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:116-181] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:205-231]

`INFERENCE`: the repository-safe analogue replaces live cross-process objects with immutable artifacts and digests, replaces model-owned mutation with proposals and reducer acceptance, replaces model-side spawning with typed escalation, and keeps deterministic prompt rendering as bootstrap and degraded mode. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-001.md:9-14]

### Twelve-post completeness audit

| Supplied post | Stable loop/harness contribution | Boundary |
|---|---|---|
| Eval Engineering | `TEXT-CLAIMED`: schema, task, and trajectory gates; deterministic checks before judges; failures become permanent tests. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:54-71] | Judge output must route execution but never become authority. |
| From Loops to Graphs | `TEXT-CLAIMED`: simple and low-concurrency work remains a loop; graph use requires actual independence and complexity. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:163-191] | Reject graph maximalism. |
| Graph Engineering Roadmap | `TEXT-CLAIMED`: bounded node contracts, deterministic edges, context isolation, and independent verification. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:23-30] | Model-side spawning stays outside LEAF. |
| Graph Engineering explained | `TEXT-CLAIMED`: fresh verifier context, hidden shared-resource edges, partial-node failure, and explicit skip-graph rules. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:131-149] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:166-229] | Topology does not repair weak tools or ground truth. |
| Graph Engineering replaced RAG | `TEXT-CLAIMED`: evidence-preserving extraction and knowledge-plane ideas. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering replaced RAG at Microsoft, Stanford and Anthropic. Here's how it works.md:310-372] | Production and cost claims are not local evidence; mostly study-4 territory. |
| Graph Engineering with Claude | `TEXT-CLAIMED`: bounded contracts, clean verifier context, dedupe against rejected findings, hard stops, and bounded fan-in. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:155-215] | Raw fan-in can recreate context collapse. |
| After Loops | `TEXT-CLAIMED`: stable organization differs from ephemeral work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:108-160] | Dynamic work is proposed to, not owned by, the model. |
| Harness, Loop, or Graph | `TEXT-CLAIMED`: environment, evidence-driven repetition, and wider flow are separate layers. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:4-50] | None substitutes for another. |
| Self-Correcting Loop | `TEXT-CLAIMED`: structured Builder/Judge/Manager handoffs, independent ground truth, hard stops, stress tests. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:21-99] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:112-167] | Same-model judging is insufficient for high-impact truth. |
| Multi-Factor Alpha Model | `TEXT-CLAIMED`: persistent state, validators, parallel roles, budgets, maximum runs, and scheduled loops. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:42-60] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:377-400] | Finance and performance claims are promotional, not acceptance evidence. |
| LOOP → GRAPH → HARNESS | `TEXT-CLAIMED`: gather/act/verify, result-shaped boundaries, clean contexts, filesystem context, deterministic substrate. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:34-55] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:116-149] | Supports P1/P3, not an authority change. |
| What Is Graph Engineering | `TEXT-CLAIMED`: source skepticism, typed-edge evaluation gaps, entity-resolution fragility, and limits on simple lookup/cost. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:1-24] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/What is Graph Engineering.md:220-265] | Repeated claims across posts are not independent replication. |

The common durable doctrine is boundaries, evidence, isolation, and hard stops. The common overreach is treating more topology, more memory, or more model freedom as reliability by itself. [INFERENCE: synthesis of the twelve-post audit]

## 5. P1 — Validated, Locally Repairable `IterationResult`

### Decision

`ADOPT-AS-PROPOSAL`: define `IterationResultV1` as a **pre-commit envelope**, not as the replay authority. Minimum fields:

- `iteration`, `mode`, `status`, and `focus`;
- narrative, state-delta, and evidence artifact handles with content digests;
- answered and open question identifiers;
- negative-knowledge records and proposed graph events;
- `nextFocusProposal` and novelty evidence;
- optional `terminalCandidate`, always advisory.

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-002.md:9-16] [INFERENCE: the envelope covers the current three-artifact handoff without replacing it]

The admission sequence is:

1. Parse and schema-check the candidate.
2. Resolve the declared route and iteration identity.
3. Verify referenced artifacts exist and their digests match.
4. Permit at most **two** local shape-repair turns, charged to the same iteration budget.
5. If still invalid, close the local call as `invalid_return`, retain typed diagnostics, and use the existing one-time workflow redispatch.
6. Only after all pre-commit checks pass may the workflow append canonical state.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:116-130] [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:1294-1312] [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:247-254]

Diagnostics should be closed data: `code`, `path`, `expected`, `observed`, and `repairAttempt`. Invalid candidates emit `return_validation_failed` audit events with candidate digest and diagnostics but never rewrite an accepted JSONL row. [INFERENCE: typed local diagnostics make defects repairable while append-only state preserves replay]

### Separation of meanings

- `shapeValid` means the envelope conforms.
- `artifactIntegrityValid` means referenced bytes and digests resolve.
- `evidenceAccepted` means claims and trajectory passed semantic evaluation.
- `stopAllowed` means the mode's convergence/legal-stop rules permit termination.
- `transitionAuthorized` means 036 authorized the exact protected consequence.

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-004.md:9-15] [INFERENCE: scoped names prevent one boolean from leaking authority]

### When not to use

Do not add the repair loop to deterministic calls whose output is already programmatically constructed. Do not use it for missing evidence, false claims, stale citations, or policy refusals; those require evidence gathering or workflow recovery, not field repair. [INFERENCE: repair is safe only for local shape defects]

## 6. P2 — Agent-Curated Memory Without Truth Corruption

### Decision

`ADOPT-AS-PROPOSAL`: add `MemoryProposalV1` over a **non-authoritative retrieval projection**. A LEAF may propose `remember`, `revise_projection`, `associate`, `abstract`, `suppress_from_working_set`, and `restore`. The reducer validates all references and owns acceptance. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:247-268] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:209-219]

`OBSERVED-IN-PAPER`: NOOA provides deliberate memory operations, combines embedding/keyword/activation/graph retrieval, does not reinforce a memory merely because the harness injected it, and uses reflection to merge, relate, abstract, rescore, and prune records while preserving selected exceptions. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:209-231]

`REFINE paper extraction`: repository merge creates a new derived record referencing every input. Abstract creates a lossy summary with explicit coverage and retained source handles. Reconciliation may select a preferred retrieval projection, but it never rewrites source assertions or settles belief. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35-43] [INFERENCE: retrieval preference and truth admission answer different questions]

`forget` means one or more of:

- suppress from a working set;
- lower activation/utility;
- remove from a derived index;
- replace a projection with a newer derived projection while preserving the source chain.

It does **not** mean physical deletion of canonical JSONL, iteration artifacts, citations, or evidence records. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34]

### Never-forget classes

The following remain reconstructable: source assertions and provenance; contradictions and supersession chains; authoritative requests, decisions, refusals, receipts, fences, effects, and budgets; policy/schema/version digests; rejected approaches and negative knowledge; memory access and reflection decisions; open tasks and unresolved blockers. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:5-21] [INFERENCE: removing any of these corrupts replay, refusal, or accountability]

Sensitive data retention is a separate authority problem. A retention policy may cryptographically erase payload bytes while retaining an authorized tombstone and digest metadata, but memory reflection cannot initiate that policy. [INFERENCE: legal erasure and retrieval curation have different owners]

### When not to use

Do not use curated memory as an authoritative database, credential store, retention-policy bypass, source-retrieval substitute, belief-settlement engine, STOP decision, or transition permission. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:90-104] [INFERENCE: memory changes recall ranking only]

## 7. P3 — Read-Only Context and Event Capability Facade

### Decision

`ADOPT-AS-PROPOSAL`: retain deterministic prompt-pack rendering as boot and degraded-mode behavior, then add this bounded v1 read surface:

- `state_summary()`
- `recent_events(cursor, limit)`
- `event(id)`
- `open_questions(limit)`
- `coverage_gaps(limit)`
- `ruled_out(limit)`
- `artifact_preview(handle, bounds)`
- `recall_continuity(query, limit)`

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:83-85] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-008.md:9-17]

Every response returns `sourceHandle`, `sourceDigest`, `snapshotHead`, `nextCursor`, `truncated`, and bounded content. A stale cursor returns `snapshot_mismatch`; it never silently combines pages from different heads. Every call appends a compact `context_read` audit event containing operation, normalized arguments, returned handles, state head, truncation, and cost—without copying sensitive payloads into the log. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34] [INFERENCE: pinning makes dynamic context replayable]

`OBSERVED-IN-PAPER`: NOOA's context manager separates static cacheable blocks, typed event history, and re-evaluated dynamic blocks, and permits event queries from code. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:132-165]

`REFINE runtime`: static policy, tool contracts, and invariants stay in the deterministic prefix. Event history and volatile projections become bounded calls. Collapsed ranges remain summaries pointing to immutable source offsets; they never replace the full event record. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/prompt-pack.md:21-47] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:138-140]

Forbidden operations include canonical append, strategy or registry mutation, question acknowledgment, graph-edge selection, convergence mutation, executor/budget mutation, spawn, capability widening, out-of-scope dereference, and protected effects. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:35-48] [INFERENCE: a read facade must not become a second control plane]

### When not to use

Do not add the facade when the bounded prompt already contains small, stable evidence. Calls add latency, cursor state, audit volume, and attack surface; require measured context pressure, selective retrieval, privacy, or replay benefit. [INFERENCE: indirection must answer an observed harness constraint]

## 8. P4 — Programmable Loop Engineering Inside Fixed LEAF Boundaries

### Decision

`ADOPT-AS-PROPOSAL`: formalize this closed local action vocabulary:

`read_handle`, `query_events`, `preview_artifact`, `call_declared_tool`, `run_pure_helper`, `transform_local`, `validate_candidate`, `record_observation`, `propose_memory_op`, `propose_next_focus`, and `return_candidate`.

[SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:185-203] [INFERENCE: these operations cover local computation without scheduler or authority mutation]

Every action is charged to declared tool, time, token, memory, and bytes-read budgets and yields a typed observation. Capabilities are fixed before the iteration; local code cannot import a new capability, expand scope, refresh or steal the loop lock, create a lineage, join a lineage, select an executor, or perform an unreceipted durable effect. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:21-35] [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/loop-lock.md:21-47]

`OBSERVED-IN-PAPER`: CodeAct supports loops, conditionals, async operations, helper functions, libraries, and typed values in a persistent method-local REPL. The same surface can mutate state reachable through `self` and create subagents, which is precisely where direct adoption stops. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:189-203]

Escalation is data: `need_parallel_work`, `need_new_source_scope`, `need_human`, `need_protected_effect`, and `budget_exhausted`. The outer workflow decides whether an escalation becomes an edge, dispatch, gate, or refusal. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:56-66] [INFERENCE: the LEAF may describe a need but cannot instantiate wider work]

### When not to use

Use deterministic code for deterministic transformations. Use graph scheduling when the work needs new agents or genuine parallel branches. Use 036/effect machinery for protected actions. Do not provide unrestricted Python, general imports, or mutable live objects across trust boundaries. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:444-448] [INFERENCE: programmability is justified only for bounded adaptive tactics]

## 9. P5 — Three-Layer Evaluation Architecture

### Decision

`ADOPT-AS-PROPOSAL`: make three evaluation claims explicit, while retaining convergence as a separate stop mechanism:

| Stage | Typed output | Checks | Failure route |
|---|---|---|---|
| A. Return admission | `ReturnAdmissionV1` | Schema, route, artifact existence, digest, append discipline. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/validation/post-dispatch-validate.md:19-48] | Bounded shape repair, then existing redispatch/error. |
| B. Evidence/trajectory acceptance | `IterationEvidenceVerdictV1` | Citation resolution, claim/source agreement, honest question coverage, scope/budget compliance, contradiction and negative-knowledge retention, evaluator independence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:32-88] | Targeted evidence research or workflow recovery. |
| Mode stop | `StopDecision` | Rolling novelty, MAD, question coverage, quality, legal conditions, graph blockers. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md:105-141] | Continue, broaden, or legally stop the mode. |
| C. Transition authorization | 036 decision and receipt | Exact request, current authority facts, fences, policy, budgets, effects. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20] | Authorize or refuse the protected consequence. |

The three requested layers are A, B, and C; convergence is deliberately shown between B and C because it is neither evidence quality nor authority. Each decision consumes earlier evidence but has a unique owner, name, and consequence. [INFERENCE: inserting convergence without collapsing it prevents STOP from becoming bearer authorization]

### Required independence mutants

- **Shape-only:** omit a required return field while supplying excellent evidence. A fails; B would pass.
- **Evidence-only:** provide a perfectly typed record with a nonexistent or misrepresented citation. A passes; B fails.
- **Trajectory-only:** reach a correct result after forbidden reads, budget overrun, or contradiction deletion. Output grading passes; trajectory grading fails.
- **Convergence-only:** all iterations are accepted but a key question or graph blocker remains. B passes; STOP fails.
- **Authority-only:** accepted, converged evidence proposes a protected write against a stale authority epoch. Research gates pass; 036 refuses.
- **Evaluator-independence:** give a judge the worker's context or the same framing that caused the defect. The corpus must detect the non-independent verdict.

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-012.md:9-18]

### When not to use

Do not collapse the verdicts into one score. Do not use same-model judging as high-impact ground truth. Do not add probabilistic judging where deterministic invariants fully decide the claim. A verdict that does not change routing is decorative and should not exist. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:50-60] [INFERENCE: evaluation must be scoped to a falsifiable consequence]

## 10. P6 — Context Efficiency and Pass-by-Reference Analogues

### Decision

`DEFER pending measurement`: prototype `ArtifactHandleV1` only for large, sensitive, reused, or selectively queried artifacts. The handle contains `artifactId`, `kind`, `schemaVersion`, `contentDigest`, `snapshotHead`, `byteLength`, `mediaType`, `ownerScope`, `capabilityScope`, `createdBy`, `retentionClass`, and an optional canonical query descriptor. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:105-105] [INFERENCE: these fields bind identity, representation, snapshot, access, and lifecycle]

`ArtifactPreviewV1` additionally carries a bounded sample, omitted-region description, `completeness=false`, and the exact handle/digest. A preview supports navigation only; it cannot support claims about unseen regions. Dereference returns pinned bytes/projection or `stale_or_missing`. It never silently resolves to latest content at the same path. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:169-193] [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34]

Promotion requires paired current-prompt versus handle traces measuring prompt tokens, bytes fetched, query count, p50/p95 latency, task correctness, citation resolution, stale detection, replay success, unauthorized dereference refusal, and cost per accepted iteration. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/prompt-pack.md:41-47] [INFERENCE: efficiency is acceptable only if correctness and refusal do not regress]

Required failures include stable-path byte replacement, decisive evidence hidden in an omitted preview region, snapshot changes between cursor pages, valid handles used outside owner/capability scope, and query-descriptor mismatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-014.md:9-17]

### When not to use

Keep small immutable values inline. Do not introduce handles merely to reduce a token count, and never treat a path, preview, or implicit latest version as the value itself. [INFERENCE: indirection has integrity and operational costs]

## 11. P7 — Mutant Corpus and Recommendations

`ADOPT test-first`: build a pinned corpus before rolling out P1–P6. Each case declares initial state, prompt-pack/version digest, capabilities, injected fault, expected layer verdict, expected durable events, forbidden events/effects, and replay outcome. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:103-107] [INFERENCE: a mutant is useful only when its expected owner and consequence are explicit]

### Memory and context families

- stale recall chooses a superseded record despite current evidence;
- reflection blur removes a qualifier or disagreement;
- negative-knowledge loss repeats an exhausted path;
- harness popularity reinforces a memory merely because it was injected;
- provenance loss produces a fluent summary without reconstructable sources;
- bookkeeping loses an open task, changes a question identity, or counts thought as evidence;
- context pollution gives the verifier the worker's history;
- static-policy cache reuse crosses a policy digest.

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-015.md:9-18] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-016.md:9-19]

### Loop, fanout, and lock families

- retries repeat without new evidence handles;
- iteration/time/cost budgets are exceeded;
- a failed lineage disappears from fan-in;
- two independent workers write one shared resource;
- lineages share an artifact directory or executor state;
- fan-in dumps raw branch outputs and exceeds synthesis context;
- lock cases cover live-holder double acquire, dead-holder reclaim, TTL expiry, wrong owner/nonce refresh, and wrong-owner release;
- a context/local-action API attempts capability widening or a protected effect.

[SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:21-35] [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/loop-lock.md:21-47] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-016.md:9-19]

### Recommendation order

1. Land corpus fixtures and single-fault independence cases.
2. Specify `IterationResultV1`, `ReturnAdmissionV1`, and `IterationEvidenceVerdictV1`.
3. Shadow-emit typed returns beside current artifacts; do not change canonical acceptance.
4. Add memory proposals and read facade behind explicit feature gates.
5. Formalize local actions only after budget and capability mutants pass.
6. Prototype artifact handles last and promote only after paired measurement.
7. Run causal-prefix replay, refusal, containment, concurrency, and recovery drills before any cutover proposal.

[INFERENCE: tests-first ordering prevents a convenience feature from defining its own success criteria]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Wholesale NOOA adoption | In-process live objects, mutable `self`, unrestricted code, and model-side spawning conflict with LEAF, replay, fanout, lock, and 036 boundaries. | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:189-203] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:444-448] | 1, 9, 19, 20 |
| Replacing narrative/state/delta with an object return | An in-process object is not durable replay evidence; typed return must remain a commit proposal. | [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-002.md:9-16] | 2 |
| Unbounded local repair | It creates a hidden inner agent, consumes unbounded budget, and can manufacture apparent progress without evidence. | [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:1294-1312] | 3 |
| Schema validity, semantic acceptance, or convergence as authority | Each answers a different question; none proves authorization for a protected transition. | [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20] | 4, 11, 12 |
| Memory curation as truth admission | Retrieval preference, contradiction settlement, and authority have distinct owners. | [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35-43] | 5, 6 |
| Physical forgetting of provenance, contradiction, authority, or negative knowledge | It breaks replay, refusal, accountability, and dead-end avoidance. | [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:18-34] | 6, 15 |
| Flat ever-growing transcripts or summaries replacing events | Flat context collapses; replacement summaries destroy event-level replay. | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:132-165] | 7 |
| Model mutation of state, graph, executor, budget, or lock | It creates a second control plane outside deterministic reducers and workflow ownership. | [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:35-48] | 8, 10, 18 |
| Model-side lineage spawning | Fanout identity, scope, write containment, and join completeness are workflow-owned. | [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:21-35] | 9, 10, 16 |
| One aggregate evaluator | A green average conceals layer-specific failure and authority leakage. | [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-012.md:9-18] | 11, 12 |
| Path-only or implicit-latest references | Content may change at the same path, defeating replay and citation integrity. | [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:43-53] | 13, 14 |
| Preview as complete evidence | A decisive contradiction can live in an omitted region. | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:169-181] | 13, 14 |
| Happy-path-only and output-only evaluation | It misses forbidden trajectories, stale recall, lock failures, partial fan-in, and capability escalation. | [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-015.md:9-18] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-016.md:9-19] | 12, 15, 16 |
| Graph-first design for narrow sequential work | Graph structure adds cost without independence and cannot fix unreliable tools or evidence. | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:196-229] | 17, 19 |
| Promotional metrics as local acceptance evidence | Paper/blog figures were not reproduced against this runtime and its mutants. | [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:243-307] | 1, 5, 12, 17 |

## Divergence Map

The configured run used the ordinary max-iterations policy, not divergent convergence mode. The reducer recorded no pivot events, pivot failures, overrides, or Council artifacts. Breadth was instead introduced by the fixed iteration plan: baseline; P1–P7 construction; single-fault falsification; all-twelve-blog audit; live-runtime gap audit; when-not-to-use audit; and terminal 036 containment. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/findings-registry.json:1-20] [INFERENCE: absence of pivot events is not evidence of universal convergence]

Saturated directions were wholesale NOOA adoption, memory-as-truth, unbounded local repair, model-owned control, path-only references, aggregate evaluation, and graph maximalism. The remaining frontier is implementation and measurement: schemas, thresholds, prototype overhead, concurrent behavior, and the exact 036 capability surface. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-019.md:9-20] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:21-43]

## 12. Open Questions

All ten research questions are answered at **design-decision** level. The following are implementation or measurement questions, not reasons to reopen the documentary loop:

- What exact serialized schemas and version-migration rules should P1, P2, P5, and P6 use?
- What current prompt-token, latency, cost, replay, and citation-resolution baselines will P6 be compared against?
- Which objective thresholds promote a shadowed feature without masking tail failures?
- Does 036 expose every primitive assumed by the transition-authorization interface, or does an adapter need additional mechanisms?
- How do concurrent context reads, memory proposals, reducers, and artifact-handle resolution behave under real contention?
- What arbitration path resolves owner disagreement or a persistent evaluator split?

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:21-43] [INFERENCE: these questions require executable evidence rather than another reading pass]

## 13. Adoption and Promotion Sequence

The smallest safe program is:

| Stage | Deliverable | Exit evidence |
|---|---|---|
| H0 — Baseline | Current prompt-pack, validator, convergence, fanout, lock, replay, and containment measurements. | Reproducible baseline traces and known-failure corpus. [INFERENCE: no-regression claims require a starting measurement] |
| H1 — Mutants | P5/P7 single-fault cases plus stale reference, lock, fan-in, and authority negatives. | Each mutant fails at its intended layer without a protected effect. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-012.md:9-18] |
| H2 — Typed shadow return | `IterationResultV1` emitted beside current artifacts. | Same canonical state and replay; malformed returns repair or fail within budget. [INFERENCE: shadowing tests representation without changing ownership] |
| H3 — Scoped verdicts | `ReturnAdmissionV1` and `IterationEvidenceVerdictV1`. | Mutant localization and routing consequences pass; convergence and 036 remain separate. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-011.md:9-17] |
| H4 — Read/memory facade | Bounded context reads and reducer-owned memory proposals behind flags. | Pinning, audit, non-reinforcement, never-forget, denial, and replay tests pass. [INFERENCE: P2/P3 should share projection and audit foundations] |
| H5 — Closed local actions | Declared action vocabulary with resource budgets and typed escalation. | No runtime capability acquisition, lineage creation, lock mutation, or unreceipted effect. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-010.md:9-17] |
| H6 — Handle experiment | `ArtifactHandleV1` for selected large/sensitive cases. | Paired traces improve a declared context/privacy goal without correctness, replay, or refusal regression. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-014.md:9-17] |
| H7 — Promotion proposal | Causal-prefix parity, concurrency, recovery, canary, and rollback package. | 036 independently authorizes any protected cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:234-253] |

No stage inherits authorization from the previous stage. Passing H6 permits a promotion proposal; it does not select cutover. [INFERENCE: evidence accumulation and authority remain separate]

## 14. Explicit When-Not-to-Use Boundaries

- Do not use deep research for a simple one-shot question, known solution, implementation task, or source set too small to benefit from iterative synthesis. [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:43-49]
- Do not add P1 repair around deterministic outputs or semantic failures. [INFERENCE: local repair is for model-produced shape defects]
- Do not use P2 memory where the authoritative source can be queried cheaply and directly, or where retention policy forbids a derived copy. [INFERENCE: memory is a convenience projection]
- Do not add P3 when a small stable prompt is sufficient. [INFERENCE: facade overhead needs measured justification]
- Do not use P4 for deterministic transforms, new-agent scheduling, protected effects, or capability acquisition. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:56-66]
- Do not use one model judge or one scalar to settle high-impact truth, trajectory, convergence, and authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:14-32]
- Do not replace small immutable values with P6 handles. [INFERENCE: indirection is valuable only for size, privacy, reuse, query, or replay pressure]
- Do not fan out work without genuine independence and explicit expected fan-in. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:166-229]
- Do not infer local production fitness from NOOA benchmarks or repeated claims in the supplied blogs. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:243-307]

## 15. Subordination to the 036 Authority Plane

Every proposal in this document is classified as **candidate-production**, **evidence-access**, **retrieval-projection**, **evaluation**, or **test** machinery. None may:

- admit a graph or select an executable topology;
- settle authoritative truth or erase contradiction;
- widen a capability, budget, source scope, owner scope, or executor scope;
- append a protected authoritative event;
- create a lineage or take ownership of fanout/fan-in;
- refresh, steal, or reinterpret the loop lock;
- execute an external effect without the existing intent, authorization, and receipt chain;
- select cutover, suppress a refusal, or treat convergence as permission.

[SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:3-20] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:5-9]

The correct flow is `candidate → return admission → evidence/trajectory acceptance → mode stop decision → exact transition request → 036 authorization/refusal → effect/receipt if authorized`. A memory, handle, context call, or evaluator verdict can enrich the evidence supplied to that flow; it cannot skip a step or acquire the next step's authority. [INFERENCE: this ordering is the central safety invariant of the extraction]

## 16. Design Decision Register

| ID | Decision | Relation to studies 1–4 | Relation to live runtime | Status |
|---|---|---|---|---|
| P1 | Pre-commit `IterationResultV1`, two local shape repairs, typed diagnostics, durable artifact verification. | **CONFIRM** typed exits; **REFINE** node-local handoff. | **EXTEND** before current post-dispatch validation. | Adopt as proposal. |
| P2 | Reducer-accepted memory proposals; retrieval suppression rather than historical deletion. | **CONFIRM** belief/provenance separation; **EXTEND** retrieval projection. | **EXTEND** JSONL-backed continuity without replacing JSONL. | Adopt as proposal. |
| P3 | Bounded, pinned, audited read-only context/event API with prompt fallback. | **CONFIRM** replay and sealed references; **EXTEND** evidence access. | **EXTEND** prompt-pack, never replace it. | Adopt as proposal. |
| P4 | Closed local action set; typed escalations; outer ownership of dispatch, fanout, lock, budget, effects. | **CONFIRM** graph ownership and typed edges; **CONTRADICT** model-owned spawning. | **REFINE** existing LEAF behavior into an explicit policy. | Adopt as proposal. |
| P5 | Scoped return, evidence/trajectory, stop, and authority decision types with independent mutants. | **CONFIRM** gate and authority separation; **EXTEND** loop-level eval. | **REFINE** terminology and routing before convergence. | Adopt as proposal. |
| P6 | Digest-bound artifact handles and incomplete bounded previews. | **CONFIRM** sealed dependencies and replay; **CONTRADICT** live mutable references. | **EXTEND** only for measured large/sensitive cases. | Defer pending measurement. |
| P7 | Permanent memory/context/loop/fanout/lock/authority mutant corpus. | **EXTEND** parity and negative-control evidence. | **EXTEND** validation coverage before feature rollout. | Adopt test-first. |
| R1 | Wholesale NOOA runtime adoption. | **CONTRADICT** graph/authority containment. | **CONTRADICT** LEAF, JSONL, fanout, and lock ownership. | Reject. |

[SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:9-21]

## 17. References

- Primary subject: [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:1-448]
- Orientation and frozen comparison frame: [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:1-108]
- Studies 1–4: [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:1-133] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:1-327] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:1-265] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:1-231]
- Full twelve-post audit: [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-017.md:1-45]
- Runtime gap audit: [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-018.md:1-41]
- Resource-map artifact generated from this lineage's deltas: [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/resource-map.md:1-20]
- Iteration evidence: [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-001.md:1-41] through [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:1-45]

## Convergence Report

| Dimension | Result |
|---|---|
| Stop reason | `maxIterationsReached`; convergence telemetry had no early-stop authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl:1-24] |
| Iterations | 20 of 20 iteration narratives, state rows, prompts, and deltas. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl:5-24] |
| Questions | 10 of 10 resolved at design-decision level; implementation/measurement residuals are listed in Section 12. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-strategy.md:13-61] |
| Novelty telemetry | `0.96` initially, `0.50` at the closed-action boundary, `0.21` after loop/concurrency mutants, then `0.16 → 0.11 → 0.07 → 0.03`. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/deep-research-state.jsonl:5-24] |
| Last three passes | Run 18: live-runtime gap audit (`0.11`); run 19: when-not-to-use/contradiction audit (`0.07`); run 20: terminal decisions and 036 subordination (`0.03`). [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-018.md:34-41] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-019.md:35-42] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/iterations/iteration-020.md:36-43] |
| Divergence | No formal divergent pivots or Council artifacts; breadth came from fixed P1–P7, corpus, runtime, boundary, and falsification passes. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/lineages/noaa-theory-sol-high/findings-registry.json:1-20] |
| Interpretation | **Documentary corpus exhaustion, self-reported.** The falling novelty ratio is telemetry, not independent proof of architectural convergence or production fitness. [INFERENCE: a fixed-source reading loop can exhaust its corpus without validating executable behavior] |

The next informative step is not another paper pass. It is a measured, mutant-driven shadow prototype that keeps studies 1–4 and 036 intact. [INFERENCE: remaining uncertainty is executable and empirical]
