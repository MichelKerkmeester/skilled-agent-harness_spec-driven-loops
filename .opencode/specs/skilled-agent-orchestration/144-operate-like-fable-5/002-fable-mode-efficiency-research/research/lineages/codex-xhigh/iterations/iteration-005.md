# Iteration 5: Ranked Surface x Delta Recommendations

## Focus
Convert extracted techniques and surface map into ranked, tiered recommendations that avoid round-1 duplication.

## Actions Taken
- Scored each surface x delta by behavioral leverage, implementation cost, blast radius, read reliability, and dedup status.
- Separated tier A doctrine, tier B mechanism, and tier C measurement.
- Checked recommendations against round-1 shipped surfaces and the source failure modes.

## Findings
1. **Rank 1 - Tier B: a compact Fable governor on the prompt-time hook/advisor bridge.** This has the best leverage because it re-injects the governor per prompt, uses existing cross-runtime transport, and can remain compact. It should be fail-open and diagnostics-only, not a hard prompt blocker. [SOURCE: .opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:81] [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/opus-fable-mode-main/reinject.sh:16]

2. **Rank 2 - Tier C: a leak-test-style metric as `/doctor fable-mode` or a deep benchmark lane.** Measurement should land early because it pins whether the governor changed behavior. Use median words/message, tool:text ratio, caveat percentage, and self-opener percentage as first metrics. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/opus-fable-mode-main/leak_test.py:13] [SOURCE: .opencode/commands/doctor/_routes.yaml:101]

3. **Rank 3 - Tier B: executor provenance fail-loud hardening.** The current packet history already found silent model fallback as a Fable efficiency failure: it makes claims false. This belongs in deep-loop runtime executor audit and post-dispatch validation, not in style text. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/research/research.md:13]

4. **Rank 4 - Tier B/A: mutation-check guidance at sk-code and sk-code-review point of use.** Do not make mutation checks universal for every edit. Add a high-blast/test-bearing path: after a critical test goes green, deliberately break the guarded behavior and verify the test fails. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:113] [SOURCE: .opencode/skills/sk-code/SKILL.md:43]

5. **Rank 5 - Tier B: cold-successor/scar-tissue handoff template upgrade.** Put trap ledger requirements in `/memory:save` handover routing and templates, not root AGENTS. The target is stale handoff prevention. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:200] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:61]

6. **Rank 6 - Tier A: small doctrine delta for recursion-control and outcome-over-visible-process.** This should be minimal and likely live in global voice/AGENTS-style guidance or the governor capsule, not a new long root section. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/opus-fable-mode-main/fable-mode.md:30]

7. **Rank 7 - Tier B: orchestrator/deep-review evidence schema tightening.** The fable-mode profile's claim/verdict/evidence triple maps to agent return envelopes and deep-review report validation. It is lower priority than hook/measurement because round 1 already added finding-as-hypothesis. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:141]

8. **Rank 8 - Tier C: benchmark the governor using the existing skill/model benchmark command family.** If `/doctor fable-mode` feels too narrow, `/deep:skill-benchmark` or `/deep:model-benchmark` can own fixture-based evaluation. [SOURCE: .opencode/commands/deep/skill-benchmark.md:1] [SOURCE: .opencode/commands/deep/model-benchmark.md:1]

9. **Dedup conclusion: mechanism and measurement now outrank more doctrine text.** Round 1 already saturated the main doctrine channels; round 2 should focus on persistence, proof, and targeted ritual insertion. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/001-initial-refinement/before-vs-after.md:145]

## Questions Answered
- Which surface x delta recommendations rank highest?
- Which recommendations are deduped against round 1?
- Which tier owns each delta?

## Questions Remaining
- What protocol caveats must synthesis preserve?

## Assessment
- newInfoRatio: 0.24.
- Novelty justification: source evidence is mostly known now, but the ranking and tier assignment are new.
- Confidence: high for ranks 1-3; medium for exact command choice between `/doctor fable-mode` and deep benchmark until owner picks workflow semantics.

## Reflection
What worked: ranking mechanisms before prose.

What failed or was ruled out: an AGENTS-only governor. It would duplicate the setpoint without the thermostat or measurement.

## Recommended Next Focus
Validate convergence, record caveats, and synthesize.
