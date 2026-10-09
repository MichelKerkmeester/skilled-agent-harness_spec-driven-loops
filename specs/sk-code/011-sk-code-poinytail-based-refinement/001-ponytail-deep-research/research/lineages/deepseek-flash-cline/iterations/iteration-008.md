---
title: "Iteration 8: sk-code-quality's author-side enforcement vs Ponytail's measurement arms"
trigger_phrases: []
---
# Iteration 8: sk-code-quality's author-side enforcement vs Ponytail's measurement arms

## Focus

Q5's second half — the quality mode's enforcement surface (`sk-code-quality`) and the hub's restraint enforcement, compared against Ponytail's three measurement arms (LOC, correctness, behavior) and its quality rules. Every item is classified `NEW`, `ALREADY-ADOPTED`, or `LOST`.

## What was read

- `.skilled/skills/sk-code/sk-code-quality/SKILL.md:19-330` — routing, comment-hygiene gates, machine-readable router, gate workflow, P0/P1/P2 author checks, author-side boundary, advisory envelope, rules.
- `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` — the author-side checklist tree.
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-70` — ladder rungs and severity gate rule.
- `.skilled/skills/sk-code/mode-registry.json:42-58` — tool surfaces.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/{loc.js,correctness.js,README.md}` — the three measurement arms.

## Findings

1. **[NEW] The hub's restraint enforcement is qualitative end to end; Ponytail measures the same concern three ways.** A grep across `sk-code-quality/` and `shared/` for LOC, line budget, complexity, cyclomatic or function-length finds only severity-gate boilerplate and the ladder's YAGNI rung ("Does this need to exist at all?"). [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:46,63-67] [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:190-200] Ponytail carries a size metric, a correctness gate and behavior probes over the same concern. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/loc.js:1-15] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/correctness.js:1-13] The gap is measurement, not gating: the prior LOC-as-gate rejection still stands and this finding adds no gate.

2. **[NEW] Ponytail's test reflex is quantified while the hub's is stated as a rule.** Ponytail reports "98% of risky logic ships with a test (no skill: 68%)", a rate that can be tracked across runs; the hub's equivalent is a rule plus a playbook scenario, which cannot report a trend. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:13] This is the measurable form of the test-reflex gap iteration 1 identified, and it pairs with finding 1 as the two things a quality metric would report.

3. **[NEW, small] The quality mode already has a recording slot a measurement-only signal could occupy without touching the gate contract.** The P0/P1/P2 dispositions (P0 blocks completion, P1 needs an accepted deferral, P2 documented with a reason) are emitted in the advisory envelope's `p0_p1_p2_decisions` and `accepted_deferrals` fields. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:190-200,206-228] A size or test-rate signal can be reported beside those dispositions as advisory evidence, which is exactly the role the prior refinement allowed LOC to play. [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:78]

4. **[ALREADY-ADOPTED, stronger] Comment hygiene is enforced by three independent gates with a disagreement-escalation rule; Ponytail's convention is a rule with a probe.** The mode documents a write-time warning, a pre-commit block, and a CI block, and escalates when the layers disagree on a blocking result. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:124-137,252-260] Ponytail's ceiling-comment convention is carried by rule text plus a behavior probe (iterations 1 and 6). The hub's layered enforcement is the stronger pattern.

5. **[ALREADY-ADOPTED, stronger] The advisory evidence-handoff envelope forbids self-verdict vocabulary; Ponytail's reports emit verdict lines.** The envelope's `status` is fixed to `advisory` and "MUST NOT be `pass`, `success`, or `done`", and it may never stand in for the verification handoff. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:206-228] Ponytail's review ends with a `Verdict:` line and its gain command with a scoreboard. The hub is stricter here; Ponytail's contribution in the same area is the complementary coverage disclosure (iteration 3, finding 2), not its verdict line.

6. **[ALREADY-ADOPTED, structural] Author-side versus review-side separation is explicit and backed by tool authority in the hub, where Ponytail relies on prose.** Quality mode may edit inside scope but has no `Write` or `Task` authority and may never make a passing claim; review mode forbids `Edit`. [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:198-204,241-250] [SOURCE: .skilled/skills/sk-code/mode-registry.json:42-58] Ponytail separates the same roles by instruction text only ("Change no code." / "Report only."), which iteration 3 already recorded as the weaker form.

7. **[NEW, small] The retirement of the deterministic benchmark replay is acknowledged in a second location, raising confidence in iteration 5's LOST finding.** The quality mode's machine-readable router carries the note that "the deterministic skill-benchmark router-replay, since retired, could score code-quality's one routable checklist in Mode-A". [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:138-160] The benchmark README records the same retirement from the harness side [SOURCE: .skilled/skills/sk-code/benchmark/README.md:1-20]; two independent sites describing the same removed capability confirm it is a known, documented gap rather than an unnoticed one, and both leave the corpus and the replay design in place.

### Classification roll-up (iteration 8)

| Classification | Findings |
|---|---|
| NEW | 1 (no size/over-engineering measurement), 2 (test reflex unquantified), 3 (advisory slot for measurement-only signals), 7 (second retirement acknowledgement, small) |
| ALREADY-ADOPTED | 4 (three-layer comment-hygiene enforcement, stronger), 5 (advisory envelope forbids verdict vocabulary, stronger), 6 (author-side/review-side separation by tool authority, stronger) |
| LOST | none new (finding 7 corroborates iteration 5's LOST finding) |

## Ruled Out

- Adding a size gate to the quality mode's P0/P1/P2 model: the prior LOC-as-gate rejection stands and finding 3 shows the advisory envelope already provides the non-gating slot.
- Copying Ponytail's correctness arm into sk-code-quality: the mode's P0 checks already cover correctness author-side, and the correctness arm belongs to a measurement lane, not an authoring gate.

## Dead Ends

- Searching for an existing size or complexity budget in the hub: none exists in the quality mode, the shared universal standards, or the checklist tree.
- Searching for a Ponytail author-side gate family: none; Ponytail has no author-side mode separation to compare against.

## Edge Cases

- Ambiguous input: finding 1 rests on a keyword search of the mode and shared trees; a size rule could exist under wording not covered, so the finding states what was searched.
- Contradictory evidence: none — the quality mode's own NEVER rules and the advisory envelope agree on the no-verdict discipline.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/sk-code/sk-code-quality/SKILL.md:19-330
- .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/
- .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-70
- .skilled/skills/sk-code/mode-registry.json:42-58
- .skilled/skills/sk-code/benchmark/README.md:1-20
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/loc.js:1-15
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/correctness.js:1-13
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/README.md:3-13
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:78

## Assessment

- New information ratio: 0.5 (3 new plus 1 small new, 3 already-adopted among 7 findings)
- Questions addressed: Q5 (quality-mode half)
- Questions answered: Q5

## Reflection

- What worked and why: reading the mode's rules and envelope rather than its checklist content, because the enforcement contract is where the comparison with Ponytail's measurement arms actually lives.
- What did not work and why: I expected a LOC or complexity budget in the quality mode and found none, which turned the iteration from a comparison of two budgets into a measurement-gap finding.
- What I would do differently: grep the target for the mechanism's vocabulary before assuming the comparison will be symmetrical.

## Recommended Next Focus

Q8 — original ideas Ponytail inspires but does not contain, plus a consolidated rejection set, so the synthesis carries proposals that are neither copies of Ponytail nor restatements of the archived refinement.
