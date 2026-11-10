---
title: "Iteration 5: Ponytail verification and measurement mechanisms vs sk-code verification doctrine and test surfaces"
trigger_phrases: []
---
# Iteration 5: Ponytail verification and measurement mechanisms vs sk-code verification doctrine and test surfaces

## Focus

Q5 — verification and test-suite mechanisms: how Ponytail validates its own graders, gates its restraint metrics, and keeps its published numbers honest, compared with sk-code's verification doctrine, manual playbook, and frozen benchmark index. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST`.

## What was read

- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:1-111` — headline numbers, method, reproduce steps, the honesty correction.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/correctness.js:1-40` — correctness gate and its declared limits.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/behavior.test.js:1-45` — grader self-test.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/` — full test inventory (18 suites).
- `.skilled/skills/sk-code/benchmark/README.md:1-50` — retired Lane C harness and frozen verdicts.
- `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:1-40` — live verification path and its policy.
- `.skilled` test inventory — 177 test files outside sandboxes.

## Findings

1. **[NEW] Ponytail tests its own grader before trusting its verdicts.** `tests/behavior.test.js` feeds known behavior-present and behavior-absent outputs through each probe checker and asserts the verdict, stating the purpose outright: "Runs without promptfoo or an API key — it proves the grader can tell the refined behavior from its absence, which is what makes the behavior.yaml eval trustworthy." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/behavior.test.js:2-6,18-39] sk-code's routing verdicts are produced by human-graded playbook scenarios and a retired harness; no located artifact tests whether the verdict mechanism itself distinguishes a pass from a failure. This is the cheapest high-value import: a grader self-test is a meta-test on the instrument.

2. **[NEW] Ponytail separates measurement metrics from gating metrics inside the harness and declares each instrument's limits.** `correctness.js` states "Unlike loc.js (measurement-only), this one is a gate — a wrong answer is a wrong answer regardless of how few lines produced it", and then names where its own checks are weak: email, debounce and CSV checks execute real code, while countdown (React) and rate-limit (FastAPI) "are structural-only: they verify plausible code shape rather than runtime behaviour, because a React bundler or a live FastAPI server is needed to execute those properly". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/correctness.js:1-13] sk-code's frozen index reports a router score and a live score with no correctness arm and no per-check strength statement. [SOURCE: .skilled/skills/sk-code/benchmark/README.md:20-34]

3. **[NEW] Ponytail publishes a correction of its own headline number, names the external critic, and re-measures.** The benchmark README keeps the older 80-94% claim but annotates it: "Read this number honestly (updated 2026-06-18). The gap above is single-shot, against a bare model that answers with several options plus commentary, so it counts prose, not just code, and overstates the win. #126 was right about that." It then points at the agentic re-run. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:65-70] Together with the gain command's ban on per-repo savings numbers (iteration 3, finding 4), this is a complete published-number hygiene practice: disclose the instrument bias, credit the critic, re-measure with a better method, forbid extrapolation. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-gain.md:5]

4. **[NEW] Ponytail's restraint claim carries a correctness counterweight in the same table.** The agentic benchmark reports LOC, output tokens, cost, time *and* hidden checks passed in one row set (−53% LOC, −45% tokens, −26% cost, −41% time, 97% checks passed vs 96% with no skill), and states the risky-logic test rate separately (98% vs 68%). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:3-13] The prior refinement already ruled Ponytail's published restraint deltas benchmark-only rather than severity gates; the new, separable idea is the *counterweight column* — a quality measure reported beside every restraint measure so a restraint win cannot be read alone. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md]

5. **[LOST] sk-code's routing-quality measurement path is retired and frozen, leaving only the hand-run playbook.** The benchmark README states the Lane C harness, its runner, its scoring contract and the `/deep:skill-benchmark` command were removed, and "no new run can be started from it"; the tree is "a frozen index of the reports that lane produced". [SOURCE: .skilled/skills/sk-code/benchmark/README.md:1-20] The same document records what the retired lane achieved and how: a deterministic, offline **router** mode that replayed `hub-router.json` + `mode-registry.json` (and the machine-readable router in `ROUTER.md` for flat skills) as the CI gate, plus a **live** dispatch mode, over the 28-scenario playbook corpus, with verdicts PASS 84/100 and CONDITIONAL 71/100. [SOURCE: .skilled/skills/sk-code/benchmark/README.md:14-30] That corpus and that deterministic replay design still exist; only the runner is gone. Reinstating a deterministic router gate over the existing playbook corpus is the concrete restoration, and the retired lane is the proof it was feasible.

6. **[NEW] Ponytail's benchmark artifact carries its own reproducibility contract.** Reproduce steps, the Node engine constraint ("Node.js ≥ 22.22.0 — promptfoo's engine constraint, check with `node --version` and upgrade if needed"), and a documented invocation gotcha ("`--env-file ../.env` is required because promptfoo reads `.env` from the current directory, not the repo root") sit in the same README as the numbers, with run counts and aggregation stated ("10 runs per cell, median reported"). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:21-39] sk-code's frozen index can state verdicts but cannot state a reproduce path, because the runner is removed. [SOURCE: .skilled/skills/sk-code/benchmark/README.md:1-20]

7. **[ALREADY-ADOPTED, stronger] sk-code's live verification path imposes a persisted-evidence and no-mocks contract that Ponytail's reporting does not.** The playbook requires that "a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through the operator's evidence trail", and its execution policy forbids substitutes: "Every scenario MUST be executed against the live sk-code skill — no mocks, no stubs, no 'unautomatable' verdicts", with PASS, PARTIAL, FAIL, or SKIP (sandbox blocker documented) as the only verdicts. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:8-18] Ponytail's benchmark reports aggregate numbers without a per-run persisted evidence requirement. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:21-39]

8. **[ALREADY-ADOPTED, with one unverified sub-question] Both systems test host-specific quirks, at different layers.** Ponytail ships 18 suites including per-host plugin tests (`cursor-hooks`, `hooks-windows`, `gemini-extension`, `grok-plugin`, `hermes-plugin`, `kimi-plugin`, `qoder-plugin`, `copilot-plugin`, `openclaw-skills`) plus `behavior`, `correctness`, `loc`, `commands`, `package`, `uninstall`. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/] sk-code's `.skilled` tree holds 177 test files outside sandboxes, including per-runtime hook suites (devin post-edit-quality, claude/pi/devin classifier-injection-screen, codex/pi dispatch) and compiled-route suites. [SOURCE: .skilled/hooks/] The specific question of whether sk-code covers Windows stdin/BOM behavior the way Ponytail's `hooks-windows.test.js` does was not located in this iteration and remains unverified rather than a claimed gap.

### Classification roll-up (iteration 5)

| Classification | Findings |
|---|---|
| NEW | 1 (grader self-test), 2 (measurement-vs-gate separation with declared instrument limits), 3 (published-number hygiene), 4 (correctness counterweight), 6 (reproducibility contract) |
| LOST | 5 (deterministic routing measurement retired; corpus and design still present) |
| ALREADY-ADOPTED | 7 (persisted-evidence, no-mocks playbook contract, stronger), 8 (host-quirk coverage, one sub-question unverified) |

## Ruled Out

- Importing Ponytail's headline restraint percentages as sk-code targets or gates: the prior refinement's benchmark-only ruling stands, and this iteration adds no counter-evidence.
- Treating the frozen benchmark index as current capability: it cannot start a run, so any claim resting on it is historical.

## Dead Ends

- Looking for a Ponytail equivalent of sk-code's persisted-evidence playbook contract: none; Ponytail's reporting is aggregate-only.
- Looking for an sk-code grader self-test: none located.

## Edge Cases

- Ambiguous input: the "98% of risky logic ships with a test" claim depends on Ponytail's own probe definitions and cannot be independently re-derived here; recorded as the project's claim with its stated method, not as a confirmed measurement. [SOURCE: verification standard, confirmed-vs-inferred]
- Contradictory evidence: the benchmark README presents both the retired, overstating single-shot numbers and the corrected agentic numbers in one document; the correction is cited as the operative reading.
- Missing dependencies: none.
- Partial success: the Windows-quirk sub-question in finding 8 is explicitly left unverified.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:1-111
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/correctness.js:1-40
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/loc.js:1-15
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/behavior.test.js:1-45
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/ (inventory)
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-gain.md:5
- .skilled/skills/sk-code/benchmark/README.md:1-50
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:1-40
- .skilled/ test inventory (177 files outside sandboxes)
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md

## Assessment

- New information ratio: 0.69 (5 fully new, 1 lost-capability finding, 2 already-adopted among 8 findings)
- Questions addressed: Q5
- Questions answered: Q5

## Reflection

- What worked and why: reading the harness comments rather than the results tables — `correctness.js` and `behavior.test.js` state their own purpose, limits and trust argument, which is where the transferable mechanisms live.
- What did not work and why: I expected to find sk-code's benchmark live and comparable; it is a frozen index, which turned the comparison into a LOST finding rather than a feature gap.
- What I would do differently: check the target's measurement status before comparing metric designs, so the classification is not retrofitted.

## Recommended Next Focus

Q6 — benchmark and metric design: what a live sk-code measurement would look like, which Ponytail harness pieces (probe arms, interleaved control, hidden checks, promptfoo configuration) transfer, and which restraint metrics must stay benchmark-only.
