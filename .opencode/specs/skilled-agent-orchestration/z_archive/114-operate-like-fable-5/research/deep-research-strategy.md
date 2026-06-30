# Deep Research Strategy

## 1. Topic

Operate like Fable 5 — how the skilled-agent orchestration stack should adopt the Fable 5 operating doctrine, and where implementation should land. (Single-executor cli-codex protocol re-run; the prior fan-out run is archived under `research/_archive-fanout-run/`.)

## 2. Known Context

A prior run converged on a findings set but did NOT honor fresh-context-per-iteration: a fan-out lineage spawned one codex that ran the whole loop in shared context (self-invocation guard collapse). This run re-derives with protocol-clean, fresh-context-per-iteration cli-codex dispatches to validate (or correct) those findings.

## 3. Key Questions

- [x] What does Fable 5 require in operational terms?
- [ ] Which current surfaces already implement parts of it?
- [ ] Where are the gaps?
- [ ] What implementation path has the best leverage?
- [ ] What verification gates prove the behavior?

## 4. Non-Goals

- Do not implement code changes; report findings only.
- Do not edit files outside this packet's `research/` folder.

## 5. Stop Conditions

- Stop when all key questions have evidence-backed answers and the latest new-information ratio is low.
- Stop at `config.maxIterations` if convergence is not reached earlier.

## Next Focus

Iteration 2: inventory the current surfaces that already implement pieces of Fable 5 — root `AGENTS.md`, `system-spec-kit`, `sk-code`, `sk-git`, `deep-research`, workflow prompts, reducers, validators, command contracts — and classify each obligation as already-enforced / partial / absent (cite file:line).
