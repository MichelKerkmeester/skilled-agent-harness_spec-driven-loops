# Iteration 2: Stale Continuity And Scaffold Artifacts

## Focus

Audit stale continuity frontmatter, scaffold docs, and empty complete-status plan/task shells.

## Findings

1. `001-reference-research` is top-level Complete, but its `plan.md` is still the unfilled template: description placeholder, scaffold pointer, `completion_pct: 0`, empty `key_files`, and `next_safe_action: "Replace template defaults on first save"` remain [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/plan.md:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/plan.md:28`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/plan.md:48`-`.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/plan.md:56`].

2. `001-reference-research/tasks.md` is worse than stale metadata: every actual task is still a generic unchecked template row (`Create project structure`, `Install dependencies`, `Implement core feature`) and completion criteria are unchecked [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/tasks.md:50`-`.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/tasks.md:87`]. Its `implementation-summary.md` still contains template placeholders despite the metadata claiming `Completed 2026-06-28` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/implementation-summary.md:39`-`.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/implementation-summary.md:43`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/implementation-summary.md:48`-`.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/implementation-summary.md:87`]. Recommendation: either replace these with a real Level-1 closeout summarizing the 51-iteration research run or remove the misleading template docs if the research packet is canonical.

3. `004-system-spec-kit/001-speckit-autopilot-lifecycle` is marked Complete in its spec/status surfaces, but its plan and tasks remain untouched scaffolds with `completion_pct: 0`, placeholder technical context, and unchecked generic tasks [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/plan.md:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/plan.md:28`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/plan.md:48`-`.opencode/specs/deep-loops/030-agent-loops-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/plan.md:56`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/tasks.md:50`-`.opencode/specs/deep-loops/030-agent-loops-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/tasks.md:87`].

4. `005-skill-interconnection/001-advisor-routing-projection` repeats the same failure pattern: plan metadata still says scaffold/replace-template/default completion 0, and tasks remain generic unchecked placeholders [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/005-skill-interconnection/001-advisor-routing-projection/plan.md:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/005-skill-interconnection/001-advisor-routing-projection/plan.md:28`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/005-skill-interconnection/001-advisor-routing-projection/tasks.md:50`-`.opencode/specs/deep-loops/030-agent-loops-improved/005-skill-interconnection/001-advisor-routing-projection/tasks.md:87`]. Recommendation: make stale scaffold detection a strict packet-completion blocker, not a review-only cleanup.

5. The grep sample shows this scaffold pattern also affects 007 child phases: both `001-hermetic-test-isolation` and `002-record-replay-cassette-harness` specs are Complete while plan/tasks hold `completion_pct: 0`, `Replace template defaults`, and generic unchecked task rows [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/007-testing/001-hermetic-test-isolation/spec.md:52`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/007-testing/001-hermetic-test-isolation/tasks.md:53`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/007-testing/002-record-replay-cassette-harness/spec.md:52`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/007-testing/002-record-replay-cassette-harness/tasks.md:53`].

## Sources Consulted

- `.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/plan.md`
- `.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/tasks.md`
- `.opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/implementation-summary.md`
- `.opencode/specs/deep-loops/030-agent-loops-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/plan.md`
- `.opencode/specs/deep-loops/030-agent-loops-improved/004-system-spec-kit/001-speckit-autopilot-lifecycle/tasks.md`
- `.opencode/specs/deep-loops/030-agent-loops-improved/005-skill-interconnection/001-advisor-routing-projection/plan.md`
- `.opencode/specs/deep-loops/030-agent-loops-improved/005-skill-interconnection/001-advisor-routing-projection/tasks.md`
- Grep for template placeholders and `completion_pct: 0` under the packet.

## Assessment

- newInfoRatio: 0.82
- Novelty justification: This added a second drift class: not just map status mismatch, but live template scaffolds inside Complete folders.
- Confidence: High for sampled folders; medium for total count because the grep output was truncated.

## Reflection

- What worked: Sampling known leads plus grep exposed repeatable validator-worthy patterns.
- What failed: The packet is large enough that manual enumeration of every stale scaffold would be error-prone.
- Ruled out: Treating `implementation-summary.md` presence as completion evidence; at least one summary is present but still template text.

## Recommended Next Focus

Audit review lineages and stale findings registries after 007 fan-out hardening.
