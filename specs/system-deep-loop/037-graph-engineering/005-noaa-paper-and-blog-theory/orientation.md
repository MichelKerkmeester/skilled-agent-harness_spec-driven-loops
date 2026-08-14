---
title: "Orientation Seed — NVIDIA NOOA paper + blog theory → the loop/harness layer of system-deep-loop (Repo Study 5)"
description: "Pre-research orientation for the 20-iteration loop/harness-layer study: the NVIDIA Object-Oriented Agents (NOOA) research paper (agent-as-Python-object, programmable loop engineering, validated LLM loops, model-callable harness APIs, agent-curated memory) plus the 12 blogs' harness/loop/graph first principles, mapped onto system-deep-loop's own loop. Includes 7 prioritized research angles. This is the loop/harness counterpart to the four graph-layer studies."
provenance:
  produced_by: "cli-codex executor, model gpt-5.6-sol, reasoning=high, service_tier=fast"
  dispatch: "read-only orientation dispatch (single), stdin-detached"
  produced_at: "2026-08-14"
  scope: "read-only analysis of context/research-paper (NVIDIA NOOA) + context/blog-posts + 001-004 research (build-on) + the live system-deep-loop runtime (convergence, LEAF dispatch, prompt-pack, state, fanout, loop-lock)"
  role: "seed for the follow-on /deep:research 20-iteration run over this phase child"
  builds_on:
    - "specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md"
    - "specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md"
    - "specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md"
    - "specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md"
  note: "The NOOA paper is external research (arXiv 2607.20709, NVIDIA) — an idea source, not a shipped dependency we control. This study covers the LOOP/HARNESS layer, distinct from the four GRAPH-layer studies."
---

# Orientation Seed — NVIDIA NOOA paper + blog theory → the loop/harness layer (Repo Study 5)

> Authored by a gpt-5.6-sol (high, fast) orientation dispatch. Read-only analysis. This study covers the LOOP + HARNESS layer that `system-deep-loop` itself occupies — the counterpart to the four graph-layer studies (1–4). The NOOA paper is external research, not a dependency we control. Claims marked OBSERVED-IN-PAPER / TEXT-CLAIMED vs INFERENCE; citations use `PAPER/` = `../context/research-paper/NVIDIA-labs-OO-Agents.md`, `BLOG/` = `../context/blog-posts/`, `S1..S4/` = the 001–004 research.

---

## 1. SUBJECT SUMMARY

The NVIDIA Object-Oriented Agents paper presents NOOA, a model-agnostic Python framework whose central abstraction is “an agent is a Python object”: methods are actions, fields are state, docstrings are prompts, and annotations are executable contracts. Ordinary method bodies remain deterministic Python; ellipsis-body methods invoke an LLM strategy. The same class therefore acts as source code, prompt surface, tool interface, state boundary, and typed call contract. `[PAPER/NVIDIA-labs-OO-Agents.md:16-20,74-76]`

Its six model-facing ideas are:

- typed inputs and outputs;
- pass-by-reference over live objects;
- executable code as the action language;
- programmable loop engineering;
- explicit, model-visible object state;
- model-callable APIs for context and event history. `[PAPER/NVIDIA-labs-OO-Agents.md:18-20,82-104]`

The distinctive loop claim is not merely that outputs are structured. An agentic method behaves like a typed call: invalid results produce a validation error that becomes feedback for another turn; only a valid value returns control to the caller. `[PAPER/NVIDIA-labs-OO-Agents.md:112-130,205-207]` Its distinctive memory claim is similarly active: the agent deliberately writes, searches, updates, associates, and forgets memories, while asynchronous reflection merges duplicates, abstracts episodes, archives superseded records, links related material, and prunes decayed items. Records, a typed graph, indexes, access logs, and maintenance data live in one SQLite source of truth. `[PAPER/NVIDIA-labs-OO-Agents.md:209-231,1297-1305]`

`[TEXT-CLAIMED]` The paper reports 97.9% across 4,400 interface-capability trials, but only 84.7% on the harder stress subset—showing that interface fluency is stronger than disciplined long-horizon use. `[PAPER/NVIDIA-labs-OO-Agents.md:243-283]` It also reports stronger or competitive SWE-bench and Terminal-Bench results, attributes part of the gain to validated termination, and reports a +11.8 RHAE memory ablation on ARC-AGI-3. `[PAPER/NVIDIA-labs-OO-Agents.md:289-307,351-376]` Its fourteen-framework comparison claims NOOA is the first surveyed surface to combine all six ideas strongly. `[PAPER/NVIDIA-labs-OO-Agents.md:380-406]` These are author-reported results from a peer-style external paper, not independently reproduced findings here.

The blogs supply the broader first-principles hierarchy: the harness provides the working environment, the loop turns attempts into evidence through feedback, and the graph makes wider control flow explicit. `[BLOG/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:4-10,30-42,52-68]` A loop is specifically gather context → act → verify, with the verifier defined before the action and preferably deterministic. `[BLOG/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:34-55]` Self-correction requires structured Builder–Judge–Manager handoffs, external ground truth, and hard iteration, quality, time, and cost stops. `[BLOG/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:21-37,63-99]` Eval engineering adds that a verdict must alter execution, deterministic checks precede model judges, and trajectory quality matters alongside final output. `[BLOG/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:32-60,64-88]`

NOOA is external research and an idea source—not a shipped dependency controlled by this repository, nor something the program must adopt wholesale.

## 2. THE LOOP/HARNESS DOCTRINE

**Programmable loop engineering.** `[OBSERVED-IN-PAPER / TEXT-CLAIMED]` NOOA makes strategy a per-method concern. `PredictStrategy` performs a typed single-shot call with local validation retries; `CodeActStrategy` runs a REPL loop in which the model inspects state, calls helpers, computes, and returns a validated value. Developers choose the outer Python control flow, while the model can write inner loops, concurrency, helpers, and subagent calls using the same language. `[PAPER/NVIDIA-labs-OO-Agents.md:112-130,189-203]` This implements the blog doctrine that a loop is a bounded unit of work inside a larger harness, but goes further by making some loop structure programmable by the worker itself. `[BLOG/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:30-50]`

**Validated LLM loops.** `[OBSERVED-IN-PAPER / TEXT-CLAIMED]` A return annotation is executable: invalid output becomes a specific error observation and the loop continues; valid output terminates the method. `[PAPER/NVIDIA-labs-OO-Agents.md:205-207]` This is stronger than “the model stopped calling tools,” which the eval blog correctly distinguishes from verified completion. `[BLOG/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:50-60]` `[INFERENCE]` Type validation proves shape, not semantic truth. A valid `TaskResult` can still contain weak evidence; deterministic tests, evidence checks, independent evaluation, belief settlement, and authority admission remain separate gates.

**Context construction and event history.** `[OBSERVED-IN-PAPER / TEXT-CLAIMED]` Every turn is constructed from cacheable static blocks, append-only typed events, and re-evaluated dynamic blocks. The agent can query or collapse event ranges, while full history remains searchable. Large objects appear as bounded previews but remain live in the execution environment. `[PAPER/NVIDIA-labs-OO-Agents.md:132-181]` The blog equivalent is harness-owned context isolation: give a worker only its slice and return only its designed result, instead of copying an ever-growing parent context. `[BLOG/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:101-140]`

**Model-callable harness APIs.** `[OBSERVED-IN-PAPER / TEXT-CLAIMED]` Context blocks and event operations are first-class APIs exposed to both developer and model, rather than hidden prompt-building callbacks. `[PAPER/NVIDIA-labs-OO-Agents.md:102-104,138-165,440-440]` `[INFERENCE]` This changes context engineering from a one-way prompt compiler into a bounded capability surface: the worker can inspect history, reveal state, or request memory without receiving authority over scheduling or protected mutation.

**Code as action and explicit object state.** `[OBSERVED-IN-PAPER / TEXT-CLAIMED]` Model-generated Python operates on typed live values, persists REPL locals within the call, and may mutate state reachable through `self`; dangerous loop-breaking APIs are rejected. `[PAPER/NVIDIA-labs-OO-Agents.md:189-203]` The benefit is compact, compositional computation. The limitation is material: code executes in-process, so the paper itself requires an external sandbox or permission boundary around the agent. `[PAPER/NVIDIA-labs-OO-Agents.md:444-448]`

**Agent-curated long-term memory.** `[OBSERVED-IN-PAPER / TEXT-CLAIMED]` Memory combines deliberate tools, bounded spontaneous injection, activation-based retrieval, graph propagation, decay, and asynchronous merge/abstract/forget reflection. `[PAPER/NVIDIA-labs-OO-Agents.md:209-231]` Its strongest design details are non-self-reinforcing injection, a single inspectable source of truth, live-reference resolution, configurable consolidation, and replayable access explanations. `[PAPER/NVIDIA-labs-OO-Agents.md:1297-1305]` `[INFERENCE]` This is a loop-learning mechanism, not a truth or authority mechanism: curation decides what the agent retains and retrieves, not which proposition is settled or which transition may execute.

## 3. COMPARISON

- **Loops as typed subgraphs — CONFIRMS + REFINES.** Study 1 requires typed ports, isolated local state, bounded rounds, a convergence policy, and typed terminal verdicts. `[S1/research/research.md:61-67]` NOOA confirms typed loop boundaries and refines the inner contract with immediate return-value validation and repair feedback. It remains narrower: its primary abstraction is an object and ordinary Python orchestration, not a sealed multi-agent graph IR. Study 2 remains controlling that belief may block a terminal proposal but may not terminate the loop or authorize the transition directly. `[S2/research/research.md:23-33]`

- **Study 1 convergence — CONFIRMS but does not replace.** NOOA and the blogs confirm that textual completion is insufficient. The current runtime already uses three weighted signals—rolling novelty, MAD noise floor, and evidence-backed question coverage—and then applies legal-stop quality and graph gates. `[.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md:39-49,149-157]` `[.opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md:105-141]` NOOA is stronger at validating each candidate return; the runtime is stronger at mode-level convergence, negative knowledge, coverage, and legal STOP separation.

- **Study 2 belief — EXTENDS, with a potential CONTRADICTION if over-adopted.** NOOA memory could improve evidence recall and continuity, but merge/reconcile/forget cannot become belief settlement. Study 2 requires four-valued, purpose-bound belief, checked quiescence, preserved contradiction, and typed blockers. `[S2/research/research.md:35-43,93-95]` Reconciliation may create a current retrieval record, but conflicting and superseded evidence must remain reconstructable; forgetting may prune an index or working projection, never authoritative history.

- **GEM knowledge/evidence plane — CONFIRMS + EXTENDS operationally.** GEM supplies ontology, source-routed extraction, reversible fusion, quality gates, hybrid retrieval, and incremental maintenance while remaining non-authoritative. `[S4/research/research.md:15-21,23-36]` NOOA adds a missing loop-facing policy: the agent itself can curate useful records and procedures, and reflection can compress them. It is narrower than GEM on provenance, ontology, temporal truth, entity resolution, and producer evaluation. GEM’s warning remains decisive: topology cannot repair a harness, permission, state-store, or evidence-anchor defect. `[S4/research/research.md:103-116]`

- **Current LEAF dispatch — CONFIRMS isolation; CONTRADICTS wholesale model-side spawning.** Each current dispatch is one fresh-context iteration; the LEAF cannot sub-dispatch, and state continuity lives in externalized files. `[.opencode/skills/system-deep-loop/deep-research/SKILL.md:269-275,301-323]` NOOA demonstrates why programmable subcalls can be productive, but adopting unrestricted model-authored spawning would violate the deliberate LEAF/graph ownership boundary. The useful extraction is bounded local strategy, not nested authority.

- **Prompt-pack and harness surface — EXTENDS.** Today’s prompt pack renders checked placeholders and supplies summaries, state paths, constraints, and a strict three-artifact schema. `[.opencode/skills/system-deep-loop/runtime/feature-catalog/prompt-rendering/prompt-pack.md:19-47]` `[.opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:8-31,53-81]` NOOA is stronger because the worker can query typed events and dynamic context rather than merely receiving pre-rendered state.

- **State, validation, fan-out, and lock — mostly CONFIRMS.** The runtime already has append-only JSONL, reducer ownership, post-dispatch artifact/schema validation, isolated fan-out lineages, normalized executor configuration, and a single-writer heartbeat lock. `[.opencode/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:58-99,124-163]` `[.opencode/skills/system-deep-loop/runtime/feature-catalog/validation/post-dispatch-validate.md:19-48]` `[.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:19-36]` `[.opencode/skills/system-deep-loop/runtime/feature-catalog/state-safety/loop-lock.md:19-47]` NOOA refines validation by placing repair inside the model call instead of relying primarily on post-dispatch rejection or redispatch. Replacing durable JSONL with mutable object fields would contradict replay and reducer ownership.

- **Authority — ORTHOGONAL and subordinate.** NOOA is not authority-aware. In-process validation, state, memory, or code execution cannot become bearer authority. Studies 1–3 remain controlling: graph and loop mechanisms propose; 036 alone admits, records, fences, and authorizes protected effects. `[S1/research/research.md:3-21]` `[S3/research/research.md:14-20]`

## 4. DELTAS FOR SYSTEM-DEEP-LOOP

1. **Introduce a typed per-iteration return envelope.** Define a mode-specific `IterationResult` containing artifact references, evidence references, answered/open questions, negative knowledge, proposed graph events, next focus, and terminal candidate. Validate it before accepting an iteration, returning field-level errors to a bounded local repair turn. Post-dispatch file validation remains the durable backstop.

2. **Separate three validation layers.** Use type/schema validation for return admissibility, deterministic or evaluator-based checks for semantic evidence fitness, and existing convergence/belief/036 gates for control consequences. A typed result must never imply “converged” or “authorized.”

3. **Turn prompt-pack into a capability-backed context facade.** Preserve deterministic rendering, but expose read-only operations such as `state_summary()`, `recent_events()`, `open_questions()`, `coverage_gaps()`, `ruled_out()`, and `recall_continuity()`. Returned values should be typed, bounded, pointer-first, and recorded as events. Context APIs may reveal state; they may not append authoritative events or choose graph edges.

4. **Add agent-curated continuity as a non-authoritative projection.** Permit iteration results to propose `remember`, `update`, `associate`, `abstract`, and `forget-from-working-set` operations over records + graph + derived index. Reducers own acceptance and projection maintenance. Source assertions, rejected directions, contradictions, and prior records remain append-only; “forget” means retrieval suppression or decay, not historical deletion.

5. **Allow programmable tactics inside a fixed LEAF contract.** A LEAF may choose bounded local computation, tool sequencing, or helper construction, but may not spawn independent lineages, widen permissions, change executor policy, or mutate loop control. The enclosing typed subgraph and command workflow retain scheduling ownership.

6. **Evaluate the harness, not only the research result.** Add negative controls for malformed typed returns, plausible-but-unsupported evidence, repeated dead ends, stale context, memory-induced false confidence, excessive recall, reflection that blurs exact facts, and attempted harness-capability escalation.

Every delta remains a proposal beneath 036. Memory, return validation, context selection, and loop programming can improve candidate quality; none may authorize a transition, erase ledger evidence, widen capability, or bypass a graph/belief/legal-stop gate.

## 5. RESEARCH ANGLES (PRIORITIZED)

**P1 — Validated Iteration Returns.** Determine whether a typed, locally repairable `IterationResult` can replace today’s prose-plus-three-file handoff without weakening replay. Examine NOOA return validation, the blog’s verify-before-act rule, the runtime prompt-pack/post-dispatch validator, and typed-subgraph exits. `[PAPER/NVIDIA-labs-OO-Agents.md:112-130,205-207]` `[BLOG/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:34-55]` `[S1/research/research.md:61-67]` **Decision:** exact schema, repair budget, failure events, and the boundary between type-valid and semantically accepted.

**P2 — Agent-Curated Memory Without Truth Corruption.** Extract merge/abstract/forget mechanics that improve continuity while preserving contradiction, provenance, and replay. Compare NOOA’s store and reflection with GEM maintenance, Study 2 belief settlement, and current JSONL/coverage state. `[PAPER/NVIDIA-labs-OO-Agents.md:209-231,1297-1305]` `[BLOG/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:14-26]` `[S2/research/research.md:35-43]` `[S4/research/research.md:93-101]` **Decision:** memory record types, proposal/acceptance ownership, decay semantics, and what may never be forgotten.

**P3 — Model-Callable Context and Event APIs.** Test whether typed read-only harness calls outperform pre-rendering all relevant state into the iteration prompt. Use NOOA’s context/event managers, blog context-isolation doctrine, current prompt-pack, and the prior typed-port design. `[PAPER/NVIDIA-labs-OO-Agents.md:132-181]` `[BLOG/LOOP ⭢ GRAPH ⭢ HARNESS: build the whole pipeline in one sitting.md:116-149]` **Decision:** minimal API vocabulary, bounds, audit events, and forbidden control/mutation operations.

**P4 — Programmable Loop Engineering Inside LEAF Boundaries.** Identify which model-chosen tactics—helper code, batching, targeted retries, dynamic context queries—are safe without model-side lineage spawning. Compare NOOA CodeAct with the LEAF prohibition, executor configuration, and typed-subgraph ownership. `[PAPER/NVIDIA-labs-OO-Agents.md:185-203,432-438]` `[.opencode/skills/system-deep-loop/deep-research/SKILL.md:267-275,349-376]` `[S3/research/research.md:24-34]` **Decision:** a closed local action set and explicit escalation points to graph scheduling.

**P5 — Three-Layer Eval Architecture.** Separate return-shape validation, evidence/trajectory evaluation, and transition authorization, then build mutants proving that none substitutes for another. `[PAPER/NVIDIA-labs-OO-Agents.md:293-307]` `[BLOG/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:41-88,109-139]` `[S1/research/research.md:43-51]` **Decision:** ordered gate pipeline, evaluator independence rules, and failure routing.

**P6 — Context Efficiency and Pass-by-Reference Analogues.** Investigate safe repository-native substitutes for live in-process objects: typed artifact handles, bounded previews, query cursors, and digest-bound references. Compare NOOA’s efficiency claim with externalized files, lineage isolation, and 036 sealing requirements. `[PAPER/NVIDIA-labs-OO-Agents.md:169-193,301-307]` **Decision:** reference-handle contract and measurements for tokens, latency, stale-reference risk, and replayability.

**P7 — Memory/Context Harness Evaluation Corpus.** Convert NOOA’s stress failures and blog failure modes into permanent runtime tests: bookkeeping loss, stale recall, repeated rejected findings, reflection blur, same-model judge bias, runaway loops, and context pollution. `[PAPER/NVIDIA-labs-OO-Agents.md:267-283,1291-1301]` `[BLOG/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:112-136]` `[S4/research/research.md:103-116]` **Decision:** a pinned mutant corpus and promotion thresholds for loop/harness changes, separate from the already-settled graph-authority parity suite.
