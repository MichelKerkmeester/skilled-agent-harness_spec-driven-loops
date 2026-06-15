# Context Report: deep-review README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the loop, the severity model, the convergence math and the outputs. Counts below were cross-checked against the real tree by the host; the two models disagreed on a few (testing-scenario and gate counts), and the verified values are recorded.

---

## 1. PURPOSE

`deep-review` runs an autonomous, command-driven iterative code-review loop. It externalizes all state to disk, dispatches a fresh `@deep-review` LEAF agent per iteration that audits one review dimension, classifies findings by severity (P0/P1/P2) and stops on a convergence signal, producing a release-readiness verdict (PASS, CONDITIONAL or FAIL).

## 2. PROBLEM

A single-pass review reads the diff once and calls it done, so whichever dimension the reviewer was not thinking about that day ships unreviewed. One reviewer holding correctness, security, maintainability and spec-traceability in one context window degrades as the window fills, and the later dimensions get a worse read than the first. There is no honest stop condition, so you either keep re-reading past the point of new findings or you stop early and miss a blocker. Spec-versus-code drift goes unnoticed because nobody cross-checks the implementation against the spec on every pass. This skill dispatches a fresh agent per dimension, classifies every finding by blocking severity, gates the stop on dimension coverage plus a composite signal and ends with a verdict you can release against.

## 3. MODES & CAPABILITIES

- Iterative review: one `@deep-review` LEAF agent per iteration audits one dimension, with a per-iteration tool-call budget and an `iterations/iteration-NNN.md` write-back contract.
- Severity-weighted findings: every finding is P0 (blocker), P1 (required) or P2 (suggestion), weighted 10 / 5 / 1 for the convergence vote.
- Four review dimensions: correctness and security are required for coverage, traceability and maintainability are not.
- Five review targets: a spec folder (default), a skill package, a named agent, a spec track or an explicit file set.
- Adversarial self-check: every P0 runs a Hunter, Skeptic, Referee re-read before it enters the active findings registry.
- Convergence detection: a three-signal composite vote gated behind a legal-stop bundle, with a P0 override that forces another pass.
- Externalized state: all continuity lives in packet files under `{spec_folder}/review/`, not conversation memory.
- Fan-out: optional parallel lineages through the command's fan-out flags, merged with strongest-restriction (any lineage active P0 makes the merged verdict FAIL).

## 4. INVOCATION (verified)

Command (`SKILL.md:59`, `references/protocol/quick_reference.md:29-31`):

```bash
/deep:start-review-loop:auto "target"      # autonomous, no gates
/deep:start-review-loop:confirm "target"   # approval gates per iteration
```

Argument hint (`SKILL.md:5`): `[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]`. Additional documented flags: `--spec-folder` (auto-resolved), `--dims` (a comma-separated subset of the four dimensions), `--no-resource-map`, and the fan-out flags `--executor` / `--executors` / `--concurrency` (`SKILL.md:56`). Target examples: `"skill deep-review"`, `"track skilled-agent-orchestration"`, a spec folder path, or a `files` set.

It writes under `{spec_folder}/review/` (`state_format.md:16-26`): `deep-review-config.json`, the append-only `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `iterations/iteration-NNN.md`, the final `review-report.md`, a `resource-map.md`, and a `.deep-review-pause` sentinel for control. The command's YAML workflow owns dispatch and state. Each iteration's executor is a LEAF: no sub-dispatch, no nested loops.

## 5. CONVERGENCE MODEL

A three-signal weighted vote (`references/convergence/convergence.md`): Rolling Average 0.30, MAD Noise Floor 0.25, Dimension Coverage 0.45. The loop stops only when the weighted score clears the composite stop score (default 0.60) and then the legal-stop gate bundle (nine gates) all pass. Key defaults: `maxIterations` 7, `convergenceThreshold` 0.10, `stuckThreshold` 2. The convergence threshold is tuned per sibling and is not interchangeable: deep-review 0.10, deep-research 0.05, deep-ai-council (proposed) 0.20. A P0 override raises the new-findings ratio so any fresh P0 forces at least one more iteration regardless of the other signals.

## 6. SEVERITY & VERDICTS (verified)

Severity (`review_mode_contract.yaml:67-79`, `SKILL.md:334-339`): P0 (weight 10) is a correctness failure, security vulnerability or spec contradiction and blocks PASS; P1 (weight 5) is degraded behavior, incomplete implementation or missing validation and triggers CONDITIONAL; P2 (weight 1) is style, naming or docs and rides as a PASS advisory. Verdicts (`review_mode_contract.yaml:82-95`): FAIL when any active P0 or a required gate fails, CONDITIONAL when P0 is zero and P1 is present, PASS when both are zero. PASS routes to `/create:changelog`; FAIL and CONDITIONAL route to `/speckit:plan`.

## 7. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions, the smart router and the executor contract |
| `references/protocol/quick_reference.md` | One-page operator cheat sheet for commands and flags |
| `references/protocol/loop_protocol.md` | Four-phase lifecycle, dispatch contract and executor invariants |
| `references/protocol/loop_state_and_gates.md` | State transitions, error handling and binary quality gates |
| `references/convergence/` | The convergence math, signals and stuck recovery (three files) |
| `references/state/` | State file schemas and reducer ownership (four files) |
| `assets/review_mode_contract.yaml` | Single source of truth for dimensions, severities, verdicts, gates and lifecycle modes |
| `assets/` | Config, dashboard, strategy, prompt-pack and runtime-capability templates |
| `scripts/reduce-state.cjs` | The single state reducer (registry, dashboard, strategy) |
| `scripts/runtime-capabilities.cjs` | Machine-readable runtime capability lookup |
| `feature_catalog/` | Feature inventory across four categories |
| `manual_testing_playbook/` | Deterministic scenarios across nine categories |

Note: deep-review's `quick_reference.md` lives under `references/protocol/` (not a `guides/` folder), and there is no `capability_matrix.md` and no `convergence_graph.md` or `convergence_reference_only.md` (those exist in deep-research, not here). Do not cite them.

## 8. BOUNDARIES

deep-review audits code and produces a severity-ranked, verdict-bearing report. It is code-only with no web access, unlike `deep-research`. It does not investigate outward knowledge (`deep-research`), map inward code before planning (`deep-context`) or compare competing plans (`deep-ai-council`). A single-pass review is `sk-code-review`; deep-review is the multi-iteration, convergence-gated loop. All four loops ride the shared `deep-loop-runtime`. The per-iteration executor is the `@deep-review` LEAF agent (no Task tool), and `system-spec-kit` owns the spec folder the review packet lives in.

## 9. TROUBLESHOOTING & FAQ MATERIAL

- Loop runs to max iterations without converging: the threshold is too tight or the target has real structural issues. Raise `--convergence` and re-run with auto-resume.
- P0 keeps blocking convergence: a real P0 survived the adversarial check, or a P1 was misclassified up. Read the Hunter/Skeptic/Referee output in the iteration file.
- Loop stuck on one dimension: the strategy next-focus is not advancing. Inspect `deep-review-strategy.md`.
- `review-report.md` missing sections: synthesis was interrupted. Re-run synthesis; JSONL state is intact.
- Reducer refuses to write derived state: `reduce-state.cjs` detected JSONL corruption. Repair the line or pass `--lenient`.
- Resuming: state is externalized, so a crashed or paused run resumes from the packet files.
- FAQ: how deep-review differs from sk-code-review, what FAIL means and what to do next, how to review a single file set or a skill, how to pause, why each iteration gets a fresh agent.

## 10. STALE FACTS

The current README disagrees with SKILL.md and the real files on several counts. The narrative template carries no version line and avoids brittle counts, so most drop on rewrite:

- Version 1.11.0.0 (README) vs 1.10.2.0 (SKILL.md frontmatter) — drop the version line.
- Stuck threshold: Key Statistics says 3, but the real default is 2 (the README's own Configuration table already says 2 — an internal contradiction).
- State files: README says 7, the real packet has 8 (plus the resource map).
- Tool budget: README says 9 to 12 (max 13), SKILL.md says 8 to 11 (max 12).
- Feature catalog: README says 21 files / 20 features, the real tree has 28 files / 27 features across four categories.
- Quality gates: README describes 4, the legal-stop bundle has 9.
- Manual testing: README says 45 scenarios across 8 categories, the real tree has 9 categories (scenario count is drift-prone, so do not pin it).

## 11. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, modes and invocation; iteration 2 verified the flags, the convergence math, the severity model, the outputs and the stale facts, each cited to a file and line. The host cross-checked every count against the real tree and recorded the verified value where the two models disagreed. Converged before the three-iteration ceiling.
