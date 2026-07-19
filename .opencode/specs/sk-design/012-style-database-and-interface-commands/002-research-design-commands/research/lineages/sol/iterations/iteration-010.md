# Iteration 10: `/interface:motion` Creation Template

## Focus
Specialize the scaffold for animation, transition, micro-interaction, and motion-system creation.

## Findings
1. **Brief intake:** trigger, user intent, state transition, semantic before/after, affected elements, interruption/reversal needs, platform/runtime, performance budget, motion material, accessibility policy, and proof surface. A named animation without a state purpose is insufficient input. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:36-43]
2. **Exemplar grounding:** prefer behavior-specific evidence (the same transition class or interaction problem), not visual resemblance. Capture trigger, sequencing principle, material/physics cue, transformed use, and what is intentionally not copied.
3. **Scaffolded flow:** `Context Manifest -> intent/state map -> motion mode -> behavior/mechanism/timing/orchestration/quality references as needed -> choreography table -> interruption/reversal model -> reduced-motion equivalent -> performance constraints -> optional prototype/render -> inspect timing/continuity/input paths -> accepted handoff`. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:49-69]
4. **Creative build:** make the main transition legible as a temporal narrative: what persists, exits, enters, leads attention, and confirms completion. Define duration/easing only after behavior and mechanism. Require equivalent state comprehension under reduced motion rather than merely setting duration to zero.
5. **Visible output:** `Motion Read`, `State/Intent Map`, `Grounding Record`, `Choreography Table`, `Interruption and Reduced-Motion Contract`, `Prototype/Implementation Notes`, `Quality Evidence`, and accepted handoff. Evidence must separate authored timings from runtime-measured frame/performance results.

## Prompt Template
```text
Create the motion behavior for {targetTransition}. Resolve {trigger, userIntent, beforeAfterState, elements, interruptionReversal, runtime, performanceBudget, material, reducedMotionPolicy, proofSurface}. Reject decorative motion with no state or attention purpose. Ground in one behavior-fit exemplar when available and record the transformed sequencing/mechanism principle. Load sk-design mode motion and only the references needed for behavior, mechanism, timing, orchestration, and quality. Design the temporal narrative before choosing durations/easings. Define interruption, reversal, repeated input, and a reduced-motion equivalent that preserves comprehension. Prototype or specify as requested, inspect real behavior when available, and distinguish authored from measured proof. Return the eight output blocks and hand off only accepted motion decisions.
```

## Ruled Out
- Choosing duration/easing before behavior and mechanism.
- Treating reduced motion as animation-duration zero without semantic parity.

## Assessment
- New information ratio: 0.55
- Novelty justification: Adds state-intent intake, choreography ordering, interruption model, and semantic reduced-motion parity.

## Recommended Next Focus
Specialize audit as a bounded improve-and-verify command without erasing its evidence-first diagnostic authority.
