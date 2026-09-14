# Iteration Prompt — hermes-proof lineage, iteration 001

Lineage: `hermes-proof` (cli-hermes / deepseek-v4.1-flash) · Session: `fanout-hermes-proof-1789413817214-0ezbso`
Spec: specs/cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support
Stop policy: max-iterations (cap 1) · Convergence threshold: 0.05 (telemetry only under the cap)

## Research question (one iteration)

List the eight hard rule ids declared in
`.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` and state which one a
fan-out lineage exercises by construction. Cite the file and line for each id.

## Constraints

- LEAF executor, in-process (no nested CLI dispatch, no sub-agents).
- Write surface: this lineage directory only.
- Every finding cites `[SOURCE: file:line]`.
- One JSON event record + one delta file + one iteration markdown this run.
