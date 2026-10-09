---
title: "Iteration 9: Original proposals Ponytail inspires but does not contain, and the consolidated rejection set"
trigger_phrases: []
---
# Iteration 9: Original proposals Ponytail inspires but does not contain, and the consolidated rejection set

## Focus

Q8 — original ideas Ponytail inspires but does not contain, plus one consolidated rejection set drawn from iterations 1-8, so the synthesis carries proposals that are neither copies of Ponytail nor restatements of the archived refinement. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST`; the proposals are marked `ORIGINAL` and each names the Ponytail artifact that inspired it and why Ponytail cannot contain it.

## What was read

This iteration is a synthesis over iterations 1-8 and the archived refinement. Sources re-used, not re-read wholesale: `context/benchmarks/behavior.yaml`, `context/benchmarks/agentic/README.md`, `context/scripts/check-versions.js`, `context/.opencode/command/ponytail-gain.md`, `context/scripts/check-rule-copies.js`, `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/hooks/git/pre-commit`, `.skilled/skills/sk-code/benchmark/README.md`, `specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:70-86`.

## Findings

1. **[ORIGINAL] Doctrine-effect scenarios for the hub's own load-bearing rules.** Inspired by Ponytail's `behavior.yaml`, which probes whether the ruleset produces its refined behaviors with the no-skill arm as the failing control. The hub's rules are hub-specific — SCOPE-LOCK, comment hygiene's durable-WHY rule, the ladder's reuse rung, the advisory envelope's no-verdict vocabulary — and each can be probed the same way: a scenario declares the behavior the rule should produce, and the run must show the rule present in the response versus absent under a control. Ponytail cannot contain this: it has no scope-lock doctrine, no surface routing, and no envelope, so the behaviors to probe do not exist there. Target: a new playbook category beside `design-restraint/`, reusing the existing scenario and evidence contract. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/behavior.yaml:1-13] [SOURCE: iterations/iteration-006.md finding 1]

2. **[ORIGINAL] Two-layer scenario verdicts: a deterministic routing precondition and a separate behavior verdict.** The retired sk-code benchmark report already observed that a routing-classified scenario can also assert generated behavior on top of a routing precondition, and recommended passing the precondition explicitly as its own line item while skipping the full verdict. Making that a first-class contract is original: every playbook scenario declares both layers, the deterministic layer is CI-checkable offline, and the live layer is recorded separately. That restores a gate over the existing 28-scenario corpus without model dispatch, and keeps the two claims legible instead of merged. Ponytail has no routing layer, so a precondition layer is meaningless there. Target: the playbook scenario schema plus the retired replay design. [SOURCE: .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:302] [SOURCE: .skilled/skills/sk-code/benchmark/README.md:14-30]

3. **[ORIGINAL] A grader self-test precondition for scenario checkers.** Ponytail unit-tests its grader without an API key so that the eval's verdicts can be trusted. The hub's playbook verdicts are human-graded; the original extension is to require that a scenario's expected detection markers be machine-checkable and that each checker carry a negative fixture it must reject, so a PASS is not purely a judgment call. Ponytail has no scenario corpus to grade and no detection markers to check. Target: the playbook execution contract plus a checker self-test suite. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/behavior.test.js:2-6] [SOURCE: iterations/iteration-005.md finding 1]

4. **[ORIGINAL] A restraint-counterweight pairing rule for any published metric.** Ponytail reports LOC, tokens, cost and time beside hidden checks passed in one table; the original part is stating it as a rule: a restraint metric may not be published alone — it ships with a correctness counterweight and, where the risk warrants it, an adversarial tier in the same artifact. This closes the gap the prior refinement left open when it allowed LOC as supporting evidence only: supporting evidence for what, and paired with what, is now specified. Ponytail performs the pairing for its own benchmark but does not state a rule that keeps a future metric from being split. Target: benchmark doctrine, and the pending Lane B `code_loc` metric (iteration 7, finding 4). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:3-13] [SOURCE: iterations/iteration-006.md findings 2 and 4]

5. **[ORIGINAL] A retirement-note contract for guards.** When a guard is retired, its umbrella script must name the successor guard or record the coverage gap with a named owner. The hub's drift-guard umbrella records the retired router-sync check as missing without a successor or an owner, and the acknowledgement appears in two places (iterations 4 and 8), which is exactly the state the contract prevents from persisting silently. Ponytail's copy canary carries an "Upgrade path:" comment for its own canary limitation, which is the same idea in miniature but never as a repo-level requirement. Target: guard documentation and the pre-commit hook family. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:47-52] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:43]

6. **[ORIGINAL] An external-anchor requirement for agreement guards.** Every guard that proves two artifacts agree must name the truth source outside the pair. Ponytail learned this the hard way when seven manifests drifted together and an agreement test still passed; the hub's agent-mirror gate already has such an anchor (agents are authored under `.opencode/agents/` and mirrored outward), so the requirement mostly documents an existing property — and it protects the next agreement guard from being written without one. Target: guard convention, applied at review time for new guards. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js:1-11] [SOURCE: .skilled/hooks/git/pre-commit:78-94]

7. **[ORIGINAL] A reuse-evidence rung on the restraint ladder, shared with removal proposals.** The ladder's first rung asks whether an existing helper covers the need; the original step is to require evidence in one direction or the other — either a citation of the existing export that was reused, or an explicit statement that the search found none — and to have a removal proposal cite the same inventory to show no consumer exists. Ponytail supplies the codebase-map mechanism that makes the search cheap and the removal-plan asset supplies the evidence field, but neither fuses them into a single citable rule, and Ponytail has no removal-plan asset at all. Target: the ladder subsection plus `removal-plan.md`. [SOURCE: iterations/iteration-002.md finding 1] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:44-60]

8. **[ORIGINAL] An anti-fabricated-baseline rule for research and refinement packets.** A packet that claims a change reduces size, cost or time must state that no baseline exists unless a paired measurement was actually run; derived or extrapolated savings are not reportable. Ponytail enforces the equivalent for its own display command, refusing to print a per-repo savings number because the unbuilt version was never written. Applying it to the hub's research and refinement documents is original and self-applying: the phases proposed in this lineage may not cite savings numbers unless a paired run exists. Target: research-packet doctrine, and this packet's own implementation phases. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-gain.md:5] [SOURCE: iterations/iteration-003.md finding 4]

### Consolidated rejection set (iterations 1-8 plus the archived DO-NOT-ADOPT list)

| Rejected | Reason | First recorded |
|---|---|---|
| Command-plus-skill doctrine duplication | Contradicts the one-baseline rule and single-source routing | iteration 3 |
| Byte-equality comparison for skill surfaces | Skill surfaces consume shared doctrine rather than copy it; token-set comparison is the existing pattern | iteration 4 |
| A ~30-row host matrix as a goal | The value is per-row verified state, not row count | iteration 4 |
| Importing Ponytail's 39-task benchmark corpus | Measures model code-writing, not routing or surface quality; needs model dispatch where the hub's gate is offline | iteration 6 |
| promptfoo as the default harness | Engine constraint and API-key requirement are unnecessary for a deterministic replay gate | iteration 6 |
| A size or LOC gate in the quality mode | Contradicts the P0/P1/P2 non-numeric gate contract; the advisory envelope is the non-gating slot | iteration 8 |
| Ponytail's headline restraint percentages as targets | Benchmark-only; no baseline exists for the hub's own work | iterations 5, 6 |
| A second review skill or output contract | One review baseline; merge as rows | archived report (re-confirmed iteration 3) |
| Numeric severity tier or findingClass for over-engineering | `findingClass` is a fix-scope axis; removal direction is already carried by `recommendation` | archived report (re-confirmed iteration 7) |
| Per-turn always-on injection and per-session intensity state | On-demand progressive disclosure is the hub's model; no named consumer for intensity state | archived report (re-confirmed iterations 3, 7) |
| Literal `// ponytail:` brand prefix | Perishable label; the ceiling content is what has value | archived report (re-confirmed iteration 7) |
| Repo-visible active-flag file by default | Dirties the repo; runtime/cache path only with explicit acceptance | archived report |

### Classification roll-up (iteration 9)

| Classification | Findings |
|---|---|
| NEW / ORIGINAL | 1-8 (all eight proposals are original compositions over evidence read in iterations 1-8) |
| ALREADY-ADOPTED | none new |
| LOST | none new |

## Ruled Out

- Presenting any proposal as a copy of a Ponytail artifact: each names the inspired artifact and the reason Ponytail cannot contain it.
- Proposing a new tool, dependency or framework: every proposal attaches to an existing playbook, guard, ladder or benchmark surface.

## Dead Ends

- Searching for an original proposal that does not trace to a read artifact: none was kept; ungrounded ideas were discarded rather than padded in.

## Edge Cases

- Ambiguous input: originality here means "not present in Ponytail and not present in the archived refinement", which is checkable against both trees; it does not mean novel in the wider industry, and no such claim is made.
- Contradictory evidence: proposal 4 pairs a restraint metric with a counterweight while the archived rejection refuses restraint metrics as targets; the difference is publication pairing versus target-setting, and both hold.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/behavior.yaml:1-13
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:3-13
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:26-69
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/tests/behavior.test.js:2-6
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js:1-11
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-rule-copies.js:43
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/.opencode/command/ponytail-gain.md:5
- .skilled/skills/sk-code/sk-code-quality/SKILL.md:124-260
- .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:44-60
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:11-18
- .skilled/skills/sk-code/benchmark/README.md:1-30
- .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.md:302
- .skilled/hooks/git/pre-commit:78-94
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:70-86

## Assessment

- New information ratio: 0.75 (8 original proposals; the rejection consolidation adds no new facts)
- Questions addressed: Q8
- Questions answered: Q8

## Reflection

- What worked and why: requiring each proposal to name its inspiring artifact and why Ponytail cannot contain it kept the list from drifting into generic advice.
- What did not work and why: an earlier draft proposed a hub-wide "restraint dashboard", which was dropped because it duplicated the frozen benchmark index rather than adding a mechanism.
- What I would do differently: draft the rejection table first, so proposals are checked against it before being written.

## Recommended Next Focus

Q9 — implementation phases: group the surviving findings and proposals into phases with owners, gates and risks, and close the lineage's key-question frontier before synthesis.
