# Iteration 5: Manual Testing, Benchmark Coverage, And Verification Gaps

## Focus

Determine how follow-up changes should be verified and where the current manual/benchmark surface is insufficient.

## Findings

1. The manual playbook is broad and useful, with 14 deterministic scenarios across 12 categories [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:34] [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:36]. It covers routing, real-UI loop, design-reference routing, preflight, mechanical layout, content gate, and brief-to-dials intake [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:38].
2. Release readiness is strict enough to catch many defects: no feature FAIL, critical paths pass or environment-only skip, 100% scenario coverage, no unresolved blockers, and no generator/persistence/pinned-brief violation [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:128] [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:130].
3. The validator gap is explicit. The root playbook says there is no dedicated automated module for interface manual testing and the sk-doc validator checks only the root playbook; per-feature completeness needs a structural sweep until recursive validation exists [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:501] [SOURCE: file:.opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md:516].
4. Convert the cheapest benchmark failures to regression tests first. ID-005 should verify a pure logic prompt returns `routeAway: sk-code`; ID-011 should verify preflight prompt routes to the card plus required context. These are static/router tests and do not need a real browser fixture.
5. Do not claim usefulness improvement from Mode A alone. The current benchmark leaves D1-inter and D4 unscored and says live mode is required [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:23] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:64]. Follow-up should rerun the benchmark and add at least one live/advisor usefulness probe before claiming completed improvement.

## Sources Consulted

- `manual_testing_playbook/manual_testing_playbook.md`
- `014-routing-benchmark/design-interface/skill-benchmark-report.md`
- `014-routing-benchmark/design-interface/skill-benchmark-report.json`

## Assessment

- newInfoRatio: 0.18
- Novelty justification: Confirmed most existing hypotheses and added concrete verification gates.
- Confidence: High because the playbook and benchmark explicitly state their limits.

## Reflection

What worked: validation docs gave direct next gates.

What failed or was ruled out: declaring improvement from doc changes without benchmark/playbook evidence.

## Recommended Next Focus

Synthesize priorities and do-not list.
