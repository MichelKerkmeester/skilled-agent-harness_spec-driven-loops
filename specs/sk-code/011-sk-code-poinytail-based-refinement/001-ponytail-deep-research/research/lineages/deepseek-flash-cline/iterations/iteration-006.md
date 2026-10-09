---
title: "Iteration 6: Ponytail benchmark and metric design vs what a live sk-code measurement would need"
trigger_phrases: []
---
# Iteration 6: Ponytail benchmark and metric design vs what a live sk-code measurement would need

## Focus

Q6 — benchmark and metric design: which Ponytail harness pieces transfer to a live sk-code measurement, which restraint metrics must stay benchmark-only, and which designs are rejected for sk-code. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST`.

## What was read

- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:1-70` — agentic method, arms, tiers, safety table.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/` — `run.py`, `tasks.py`, `judge.py`, `compare.py`, `answer.py`, `complete.py`.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/behavior.yaml:1-40` — behavior-effect eval with a control arm.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/loc.js:1-15` — the LOC metric and its recorded fix.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/arms/` — baseline, caveman, ponytail arm loaders.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/results/` — the dated results archive.
- `.skilled/skills/sk-code/benchmark/README.md:1-50` — retired router/live modes and frozen verdicts.

## Findings

1. **[NEW] Ponytail runs a behavior-effect eval — it measures whether the doctrine changes what the model writes, not whether the text is present.** `behavior.yaml` states its purpose: "does the ruleset actually produce its refined behaviors (not just carry the text)? Probes the three rules a full-project field review (rcstack, phases 0-8) showed mattered", and it includes baseline as the control: "the no-skill arm should mostly FAIL these gates, the ponytail arm should pass them. That delta is the point." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/behavior.yaml:1-13,20-40] sk-code verifies that rule wording exists (rule-copy canary) and that routing resolves (alignment-drift, stack-folders), but no located artifact tests whether carrying the doctrine changes model behavior. This is the highest-value transfer in this iteration, and it is a different axis from both the copy canary and the routing replay.

2. **[NEW] The agentic benchmark's safety tier leaves the requirement implicit and scores against adversarial input, with a "lazy-but-plausible" bad reference per task.** Seven surgical tasks seed a starter file and read like real tickets: "the safety requirement is left **implicit** (the way a real ticket reads), so an arm that forgets to be safe is caught, and the produced function is then executed against adversarial input. Every safety check is deterministic and stdlib-only." The bad reference is defined as "the lazy-but-plausible version: correct on the happy path, unsafe on the adversarial input. That is exactly the code a binary correctness gate passes." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:39-69] The design lesson is stated by Ponytail itself and applies directly to sk-code's verification doctrine: a correctness-only gate cannot detect the failure mode that restraint most plausibly causes.

3. **[NEW] Ponytail includes strawman control arms on purpose so a one-line instruction can beat it in public.** The arms are `baseline`, `ponytail`, `caveman`, `yagni` ("Follow YAGNI principles.") and `yagni-oneliner`, and the reason is explicit: "The last two are the seven-word prompts from the #126 writeup, included on purpose: if a one-line instruction matches ponytail, the benchmark should show it." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:26-33] This is self-falsification built into the harness: the strongest cheap alternative must be able to win.

4. **[NEW] The LOC measurement rule set avoids the metric punishing the safeguards.** The agentic comparison counts "**source** LOC + **source** file count (tests excluded)" and tracks tests as "a *positive* signal, never counted as bloat"; the single-shot LOC metric counts non-blank, non-comment lines from fenced blocks, or the whole response when the model emitted bare unfenced code. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:20-21] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/loc.js:1-15] `loc.js` also records a metric bug it fixed: "the line filter below only caught `*`-aligned JSDoc, so plain block comments were miscounted as code." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/loc.js:4-6] Together these are the safe form of LOC measurement the prior refinement's LOC-as-gate rejection leaves room for: measurement-only, tests excluded, corrections recorded in the metric itself.

5. **[NEW] The fair baseline is the real agent with no skill, not a chatty bare model.** The agentic README names the difference as the whole point: the baseline is "the **real agent** with no skill (the fair baseline)", the task is "edit this existing file" rather than "write me X", and "The point of going agentic is honesty, not flattery. The baseline here is Claude Code doing the job properly, so any difference is the skill's effect, not the model being chatty." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:11-24] Any future sk-code measurement inherits this: compare against the same agent without the skill.

6. **[NEW] The harness can compare a candidate against the released version in one interleaved run.** `ponytail2` "loads a candidate plugin from `PONYTAIL2_PLUGIN_DIR`, next to the released `ponytail`. That is how Ponytail 5 was measured against the previous Ponytail (v4.13) and no skill in one run." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:34-35] This is the validation mechanism a refinement packet needs: an env-var-selected candidate arm scored in the same run as the current release and the no-skill control, rather than a before/after comparison across time.

7. **[ALREADY-ADOPTED, with a lost runner] Deterministic offline scoring is the shared design; sk-code lost the runner, Ponytail kept it.** Ponytail's safety checks are deterministic and stdlib-only [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:44-45]; sk-code's retired router mode was deterministic and offline and served as the CI gate over the playbook corpus, and only its runner and scoring contract were removed. [SOURCE: .skilled/skills/sk-code/benchmark/README.md:14-30]

8. **[REJECT] Ponytail's 39-task corpus should not become sk-code's benchmark corpus.** The tasks measure model code-writing restraint against seeded Python/React stubs (date picker, rate limiter, SQL user lookup, and similar); sk-code's measurable object is routing, surface detection, resource loading and review verdicts, whose corpus already exists as the 28-scenario manual playbook. Importing the task corpus would measure a different system than the one under change, and would also require model dispatch where sk-code's existing gate is offline and deterministic. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:37-54] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:11-18]

### Classification roll-up (iteration 6)

| Classification | Findings |
|---|---|
| NEW | 1 (behavior-effect eval with failing control arm), 2 (implicit-requirement adversarial safety tier with lazy-but-plausible bad reference), 3 (strawman control arms), 4 (LOC rule set that does not punish safeguards), 5 (fair baseline), 6 (candidate-vs-release arm in one run) |
| ALREADY-ADOPTED | 7 (deterministic offline scoring; sk-code's runner is the lost part) |
| REJECT (reasoned) | 8 (importing Ponytail's task corpus) |
| LOST | none new in this iteration (the retired runner was established in iteration 5) |

## Ruled Out

- Publishing Ponytail-style restraint deltas as sk-code targets: still benchmark-only, and now additionally bounded by finding 4's rule set if any LOC figure is ever published.
- Adopting promptfoo as the sk-code harness by default: its engine constraint (Node ≥ 22.22.0) and API-key requirement are unnecessary for a deterministic replay gate.

## Dead Ends

- Searching for a Ponytail equivalent of sk-code's routing replay: none; Ponytail has no router to replay.
- Treating the 39-task count as a maturity metric: the corpus size follows from the measured object, not from quality.

## Edge Cases

- Ambiguous input: `ponytail2`'s candidate arm is described in the README but its wiring was not read; recorded as documented behavior, not verified code. [SOURCE: verification standard, confirmed-vs-inferred]
- Contradictory evidence: the archived results directory holds both adversarial audits and headline runs, so any single results file is not the benchmark's verdict; the method document is the operative source.
- Missing dependencies: the agentic harness requires a headless Claude Code session; no equivalent runtime was verified as available for sk-code here.
- Partial success: none.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:1-70
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/{run.py,tasks.py,judge.py,compare.py,answer.py,complete.py}
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/behavior.yaml:1-40
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/loc.js:1-15
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/arms/{baseline.js,caveman.js,ponytail.js}
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/results/ (10 dated reports)
- .skilled/skills/sk-code/benchmark/README.md:1-50
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:11-18
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md

## Assessment

- New information ratio: 0.75 (6 fully new, 1 already-adopted, 1 rejected among 8 findings)
- Questions addressed: Q6
- Questions answered: Q6

## Reflection

- What worked and why: reading the harness's own justification comments and README rationale rather than its results, which surfaced the design intent behind each arm and tier.
- What did not work and why: an early plan to compare headline numbers was abandoned once the target turned out to have no live numbers to compare; the comparison had to move to mechanism.
- What I would do differently: read `tasks.py` before the README so the corpus claim would rest on the task definitions rather than on prose describing them.

## Recommended Next Focus

Q7 — prior-refinement reconciliation: take the archived report's adopted recommendations one by one and classify each as still present, relocated, or lost in the current two-axis hub, since iterations 1-6 produced several LOST candidates that need a single consolidated verdict.
