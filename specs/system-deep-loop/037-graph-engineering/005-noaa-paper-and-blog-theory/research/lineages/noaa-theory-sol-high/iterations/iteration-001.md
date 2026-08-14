# Iteration 1: Primary-Source and Inherited-Architecture Baseline

## Focus
Verify the orientation seed against the primary paper and inherited graph/runtime contracts before proposing loop changes.

## Actions Taken
Read the orientation, the paper's abstract and agent-loop sections, studies 1–4 syntheses, and the live deep-research contract.

## Findings
1. **[OBSERVED-IN-PAPER][CONFIRM studies; EXTEND runtime]** NOOA explicitly combines typed input/output, live-object references, code as action, programmable loops, explicit object state, and model-callable context/event APIs. This confirms the studies' typed-boundary direction but extends the current prompt-only harness surface. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:16-20] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:26-35]
2. **[OBSERVED-IN-PAPER][REFINE studies; REFINE runtime]** The paper's loop is a method-local call/render/act/update/validate cycle; it is not a sealed multi-agent graph or transition authority. It can refine iteration internals without replacing studies 1–4. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:108-130]
3. **[TEXT-CLAIMED][ORTHOGONAL studies; no acceptance effect on runtime]** The paper reports 97.9% over 4,400 interface-capability trials and lower performance on a harder stress subset. These are author-reported measurements, not evidence that this repository's harness meets its own invariants. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:243-283] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:39-39]
4. **[CONFIRM studies; CONFIRM runtime]** Studies 1–4 already settle graph proposal, belief, evidence, admission, replay, and 036 authority boundaries. The remaining legitimate subject is how one bounded iteration obtains context, repairs malformed returns, retains useful continuity, and exposes evidence to outer gates. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20] [INFERENCE: subtracting settled graph/authority decisions from the paper's method-local features]
5. **[CONTRADICT wholesale adoption; CONFIRM runtime containment]** NOOA permits in-process state mutation and model-authored subagent calls, whereas the live runtime uses LEAF dispatch, externalized state, fanout isolation, and a lock. Only bounded tactics and read capabilities are candidates here. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:189-203] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:69-75]

## Questions Answered
- The loop/harness delta is method-local validation, context access, memory projection, and safe programmable tactics—not graph or authority redesign.

## Questions Remaining
- Define the typed iteration return and its repair/acceptance boundary.

## Ruled Out
- Wholesale adoption of NOOA's in-process object and spawning model.
- Treating paper benchmarks as local promotion evidence.

## Edge Cases
- The local Markdown paper is the available primary-subject copy; claims remain external and author-reported.

## Sources Consulted
- Paper, orientation, studies 1–4, and live deep-research contract, cited above.

## Assessment
- New information ratio: 0.96.
- Status: complete.

## Reflection
The useful extraction is narrower and safer than the framework's full programming model.

## Recommended Next Focus
Specify a replay-preserving `IterationResult` envelope.
