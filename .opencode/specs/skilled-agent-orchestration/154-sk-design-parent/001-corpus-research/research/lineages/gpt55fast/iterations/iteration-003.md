# Iteration 3: Interaction, Motion, Resilience, and Quality Gates

## Focus

Separate behavior design from production-readiness evaluation and refinement.

## Findings

1. `animate` is not decoration-only. It says motion should convey state, give feedback, clarify hierarchy, and respect `prefers-reduced-motion` [SOURCE: external/animate.md:6-12]. It defines distinct layers for hero moments, feedback, transitions, and delight [SOURCE: external/animate.md:43-53]. This supports a dedicated interaction-motion child.
2. `delight` locates memorable touches in success states, empty states, loading, achievements, interactions, errors, and easter eggs [SOURCE: external/delight.md:22-49]. It belongs with interaction-motion because delight is event/state-specific, not just visual style.
3. The `interaction-design` collection explicitly covers micro-animations, state machines, gestures, error handling, loading states, feedback, cognitive laws, forms, onboarding, navigation, and search [SOURCE: external/designer-skills-main/interaction-design/README.md:1-22]. This is a natural child boundary.
4. `harden` covers edge cases, text overflow, i18n, error handling, empty/loading states, large datasets, permissions, accessibility resilience, and performance resilience [SOURCE: external/harden.md:10-39]. This is production readiness after behavior and visuals are known.
5. `audit` is code-level quality measurement across accessibility, performance, theming, responsive design, and anti-patterns [SOURCE: external/audit.md:6-15]. It explicitly says it is not design critique and should document measurable implementation issues [SOURCE: external/audit.md:8-10].
6. `critique` requires two independent assessments and synthesis, including design review plus detector/browser evidence [SOURCE: external/critique.md:12-21]. That is heavier than a simple design-process reference and supports a quality child.
7. `polish` makes design-system discovery mandatory before final polish and says polish without alignment is decoration on drift [SOURCE: external/polish.md:14-23]. This should share sources with system-reference but live operationally under critique-quality/refinement.

## Sources Consulted

- `external/animate.md`
- `external/delight.md`
- `external/designer-skills-main/interaction-design/README.md`
- `external/harden.md`
- `external/audit.md`
- `external/critique.md`
- `external/polish.md`

## Assessment

- newInfoRatio: 0.62
- Novelty: split behavior design from quality and hardening.
- Confidence: high.

## Reflection

What worked: comparing purpose statements separated creation, behavior, and evaluation.

What failed: hiding audit/harden/polish inside interface creation would make the creation child too large.

Ruled out: all QA as a late paragraph inside the interface child.

## Recommended Next Focus

Decide the parent structural model and shared-runtime boundary.
