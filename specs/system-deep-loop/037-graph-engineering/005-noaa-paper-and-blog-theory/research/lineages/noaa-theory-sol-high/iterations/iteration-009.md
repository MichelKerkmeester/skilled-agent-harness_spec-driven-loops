# Iteration 9: P4 CodeAct Extraction and LEAF Boundary

## Focus
Separate useful programmable tactics from unsafe orchestration powers.

## Actions Taken
Read CodeAct execution/state sections, sandbox limitations, LEAF rules, and study-3 graph ownership.

## Findings
1. **[OBSERVED-IN-PAPER][EXTEND studies; EXTEND runtime]** CodeAct lets the model use loops, conditionals, async operations, helpers, libraries, and typed values in a persistent method-local REPL. These tactics compress multi-step computation. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:189-203]
2. **[OBSERVED-IN-PAPER][CONTRADICT runtime if copied]** The same surface permits subagent spawning and mutation reachable through `self`; the paper also acknowledges that in-process execution needs an external sandbox/permission boundary. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:191-203] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:444-448]
3. **[INFERENCE][CONFIRM studies; REFINE runtime]** Transfer only local calculation, query sequencing, bounded retry, parsing, ranking, batching, and construction of proposed return data. Each action stays within the declared tool/capability set and write boundary. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:35-48]
4. **[INFERENCE][CONFIRM graph ownership; CONTRADICT model spawning]** Any need for new parallel work, another model, a wider source scope, or a protected effect becomes a typed escalation proposal to the workflow/graph; the LEAF cannot instantiate it. [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:267-275] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:24-34]
5. **[INFERENCE][CONFIRM 036]** Programmability changes how a candidate is computed, never who authorizes its consequence. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20]

## Questions Answered
- P4 safe/unsafe extraction boundary.

## Questions Remaining
- Exact closed action vocabulary and budgets.

## Ruled Out
- Model-side lineage spawning.
- Durable `self` mutation.
- Unrestricted Python as the repository harness.

## Edge Cases
- Pure helper code can still exhaust CPU/memory; resource controls must be external.

## Sources Consulted
- Paper CodeAct and limitations, LEAF contract, study 3.

## Assessment
- New information ratio: 0.55.
- Status: insight.

## Reflection
Programmable tactics are valuable precisely when scheduling and authority remain fixed outside them.

## Recommended Next Focus
Specify the closed action set and escalation events.
