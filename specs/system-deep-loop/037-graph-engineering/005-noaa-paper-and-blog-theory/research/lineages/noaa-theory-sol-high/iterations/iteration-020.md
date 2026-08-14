# Iteration 20: Terminal Design Decisions and 036 Subordination

## Focus
Falsify the proposed delta, close P1-P7, and produce the final decision set.

## Actions Taken
Reviewed all nineteen iteration narratives, the ten reducer questions, the primary paper, twelve blogs, studies 1–4, live runtime contracts, and 036 boundaries.

## Findings
1. **[ADOPT-AS-PROPOSAL][REFINE runtime] P1** Prototype `IterationResultV1` as a pre-commit envelope with at most two shape-repair turns, typed diagnostics, and durable artifact/digest verification. Do not replace narrative/state/delta. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:205-207] [INFERENCE: iterations 2-4 establish the local contract]
2. **[ADOPT-AS-PROPOSAL][EXTEND runtime] P2** Add reducer-accepted memory operations over a non-authoritative projection; `forget` means retrieval suppression, and provenance/contradiction/authority/negative-knowledge classes are immutable. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:209-231] [INFERENCE: iterations 5-6 constrain the transfer]
3. **[ADOPT-AS-PROPOSAL][EXTEND runtime] P3** Add bounded, pinned, audited read APIs while preserving prompt-pack as deterministic bootstrap/fallback. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:132-181] [INFERENCE: iterations 7-8 define the facade]
4. **[ADOPT-AS-PROPOSAL][REFINE runtime] P4** Formalize a closed local action set and typed escalation proposals; retain workflow ownership of dispatch, fanout, lock, budget, and effects. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:35-48] [INFERENCE: iterations 9-10 define the set]
5. **[ADOPT-AS-PROPOSAL][REFINE runtime] P5** Implement named return-admission and evidence/trajectory verdicts before convergence; keep 036 authorization separate. Require single-fault mutants and evaluator versioning. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:54-88] [INFERENCE: iterations 11-12 define the pipeline]
6. **[DEFER pending measurement][EXTEND runtime] P6** Prototype `ArtifactHandleV1` only for large or sensitive evidence, and promote only if paired traces improve tokens/latency without weakening correctness, replay, or refusal. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:169-193] [INFERENCE: iterations 13-14 define contract and measurements]
7. **[ADOPT test-first][EXTEND runtime] P7** Build the pinned mutant corpus before functional rollout; include stale recall, reflection blur, repeated dead ends, context pollution, same-model bias, runaway retries, partial fan-in, cross-writes, lock faults, and capability escalation. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:103-107] [INFERENCE: iterations 12, 15, and 16 enumerate cases]
8. **[CONFIRM studies 1–4]** No evidence requires reopening graph proposal, belief, knowledge-plane provenance, admission, replay, fanout, or authority decisions. NOOA supplies inner-loop ideas, not a competing architecture. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:59-75]
9. **[REJECT]** Reject wholesale framework adoption, in-process live-object semantics across trust boundaries, model-side lineage spawning, memory-based truth settlement, schema/convergence-as-authorization, and deletion of replay evidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:189-219] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:444-448]
10. **[CONFIRM 036]** Every proposal improves candidate production or evidence access only. It cannot admit a graph, settle authoritative truth, widen capability, append a protected event, execute an effect, select cutover, or bypass a refusal; 036 remains the sole authority plane. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:3-20]

## Questions Answered
- P1–P7, full corpus/runtime comparison, boundaries, and 036 subordination are answered at design-decision level.

## Questions Remaining
- Implementation schemas, benchmark thresholds, and prototype performance remain future measured work, not research gaps.

## Ruled Out
- NOOA as dependency/authority; model-side spawning; mutable live objects across trust boundaries; memory erasure; validation/convergence authorization.

## Edge Cases
- The fanout adapter's same-CLI recursion guard prevented a nested Codex leaf launch in this lineage. The failure was preserved; direct bounded passes followed the established detached-lineage pattern without changing executor identity.

## Sources Consulted
- Full scoped corpus and all prior iteration evidence.

## Assessment
- New information ratio: 0.03.
- Status: insight.

## Reflection
Terminal falsification narrows the result to additive proposals with explicit prerequisites; the graph and authority architecture remains intact.

## Recommended Next Focus
Synthesize the final loop/harness design document and promotion sequence.
