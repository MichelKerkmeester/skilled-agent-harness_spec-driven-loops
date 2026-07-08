# Context Report: deep-research README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the loop, convergence model and outputs.

---

## 1. PURPOSE

`deep-research` runs an autonomous, command-driven multi-iteration research loop. It externalizes all state to disk, dispatches a fresh `@deep-research` LEAF agent per iteration and detects convergence so the investigation stops when new findings diminish.

## 2. PROBLEM

Long-form investigation inside an AI conversation degrades as the context window fills with stale findings, which forces the researcher to prune and restart and wastes effort on state management instead of discovery. Multi-domain topics compound it, because each follow-up round re-injects prior results. Without an explicit stop condition, you keep digging past diminishing returns or stop too early and miss evidence. This skill externalizes the state, enforces fresh context per pass and computes a stop signal from the ratio of new information.

## 3. MODES & CAPABILITIES

- Iterative investigation: one `@deep-research` LEAF agent per iteration, with a `research/iterations/iteration-NNN.md` write-back contract and a cap of roughly twelve tool calls per iteration.
- Externalized state: all continuity lives in packet files rather than conversation memory.
- Convergence detection: a composite stop signal driven by the new-information ratio per iteration, with a stuck-recovery threshold.
- Progressive synthesis: the running `research.md` is updated as iterations land, on by default.
- Fan-out: optional parallel lineages on the shared runtime for broader coverage.

## 4. INVOCATION (verified)

Command (SKILL.md):

```bash
/deep:start-research-loop:auto "topic"      # autonomous, no gates
/deep:start-research-loop:confirm "topic"   # approval gates per iteration
```

Flags: `--max-iterations` (default 10), `--convergence` (default 0.05), `--spec-folder` (auto-resolved), plus `progressiveSynthesis` (default true) and `stuckThreshold` (default 3). It writes under `{spec_folder}/research/`: `deep-research-config.json`, the append-only `deep-research-state.jsonl`, `deep-research-strategy.md`, the findings registry, `deep-research-dashboard.md`, `iterations/iteration-NNN.md`, the progressive `research.md` and a `resource-map.md`, with a pause file and a lock file for control. Each iteration's executor is a LEAF: no sub-dispatch, no nested loops.

## 5. CONVERGENCE MODEL

Convergence is a composite signal that weighs the new-information ratio against a minimum-iterations floor, defined in `references/convergence/convergence.md` and `references/convergence/convergence_signals.md`. The loop continues while iterations keep surfacing new findings, stops when the new-info ratio falls below the convergence threshold for long enough, and a stuck-recovery path handles iterations that add nothing.

## 6. KEY FILES (real)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions, the smart router and the executor contract |
| `references/guides/quick_reference.md` | Operator cheat sheet for commands and flags |
| `references/convergence/` | The convergence model and signals |
| `references/protocol/` | The iteration lifecycle and write-back contract |
| `references/state/` | State file formats and ownership |
| `assets/` | Config and report templates |

## 7. BOUNDARIES

deep-research investigates outward knowledge and produces a cited report. It does not map inward code (`deep-context`), audit code (`deep-review`) or compare plans (`deep-ai-council`); all four ride the shared `deep-loop-runtime`. The per-iteration executor is the `@deep-research` LEAF agent, and `system-spec-kit` owns the spec folder the research packet lives in.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- Loop stops too early: the convergence threshold is too loose; lower `--convergence` or raise `--max-iterations`.
- Loop never converges: a stuck-recovery path triggers after the stuck threshold; check the dashboard.
- Resuming: state is externalized, so a crashed run resumes from the packet files.
- FAQ: how convergence decides to stop; why fresh context per iteration; where the findings live; how to resume.

## 9. STALE FACTS

The current README and SKILL.md disagree on the version (README newer than the SKILL.md frontmatter), and a script count drifted. The new template carries no version line and avoids a hard script count, so both drop on rewrite.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, modes and invocation; iteration 2 verified flags, the convergence model, the outputs and stale facts, each cited to a file and line. Converged before the 3-iteration ceiling.
