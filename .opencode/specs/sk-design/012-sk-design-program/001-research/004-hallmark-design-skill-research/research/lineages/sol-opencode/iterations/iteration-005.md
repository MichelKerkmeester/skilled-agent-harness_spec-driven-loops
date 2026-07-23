# Iteration 5: Motion, Microinteractions, And Interaction States

## Focus

Compare Hallmark `motion.md`, `microinteractions.md`, and `interaction-and-states.md` against shipped `design-motion`, `/interface:motion`, motion references/procedures/assets, and related Foundations/Interface state guidance. The decision target is surgical adoption inside existing owners, not a preset catalog or another command.

## Actions Taken

1. Read the append-only lineage state and strategy before source research, preserving the max-iterations policy and prior negative knowledge.
2. Compared Hallmark's timing, easing, motion-budget, reduced-motion, microinteraction, async-state, interruption, and performance claims against the shipped command and mode contracts.
3. Checked whether Foundations and Interface already expose token and state ownership rather than assuming Motion must duplicate them.
4. Classified each Hallmark asset by exact target, verdict, concrete change, value, effort, and licensing treatment.

## Findings

### 1. Theme-aware motion is worth adopting as a semantic modifier schema, not as Hallmark's theme table

Shipped Motion has stronger posture-level calibration: the Brand/Product register sets a motion ceiling, then the frequency, keyboard, purpose, and register gates decide each animation. Foundations already permits `--motion-*` and `--state-*` tokens, but the shared vocabulary names only generic duration/easing/delay concepts and `motion-strategy.md` asks for named tokens without defining a compact schema. Hallmark's useful contribution is therefore the relationship between a direction and its motion intensity, not its ten named themes or fixed multipliers. [SOURCE: .opencode/skills/sk-design/shared/register.md:49-60] [SOURCE: .opencode/skills/sk-design/design-motion/references/animation-decision-framework.md:35-62] [SOURCE: .opencode/skills/sk-design/design-foundations/references/design-system-artifact-contract.md:21-35] [SOURCE: .opencode/skills/sk-design/shared/design-token-vocabulary.md:81-97] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:223-240]

Verdict: ADAPT a semantic modifier schema into existing Motion/Foundations assets: `motion-level` (`none|restrained|standard|expressive`), duration scale, easing-role mapping, stagger ceiling, and explicit no-motion cases. Direction-specific values must be authored or measured for the target, inherit the register ceiling, and never override reduced motion or the frequency/keyboard gate. Value: high. Effort: medium.

### 2. Hallmark's timing and easing canon is mostly duplicate and occasionally less coherent

Both systems use approximately 100-150ms feedback, 200-300ms state changes, 300-500ms larger transitions, faster exits, and exponential ease-out. Shipped Motion is intentionally broader for an earned 500-800ms brand moment and provides three named arrival curves rather than pretending one curve is universal. Hallmark itself has competing duration tables (`120/220/420`, five timing bands, and recipe-specific values), adds `--ease-standard` after saying three curves cover most motion, and alternates between banning bounce and allowing configured springs. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/motion.md:7-44] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:55-98] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion-strategy.md:46-69]

Verdict: SKIP direct token values and curve copying. Tighten the existing token handoff around role-based bands and project-selected curves; do not import a second canon. Value: medium. Effort: low.

### 3. Interruption and reversal are already stronger at the command boundary, but reusable cards do not carry the proof consistently

`/interface:motion` requires interruption/reversal in intake and its workflow emits an interruption/reversal model before proof. Motion also correctly prefers interruptible CSS transitions for local states, and the state-transition/toast cards mention interruption. The generic shared fields, feedback card, async card, and final handoff snippet do not require interruption, reversal, replacement, or rapid retrigger behavior, so that command-level requirement can be lost when a card travels independently. [SOURCE: .opencode/commands/interface/motion.md:29-53] [SOURCE: .opencode/commands/interface/assets/interface-motion-auto.yaml:22-48] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro-interactions.md:70-76] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion-pattern-cards.md:30-40] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion-pattern-cards.md:200-218]

Verdict: ADAPT the existing cards by adding interruption/reversal and rapid-retrigger fields to shared fields and relevant cards, plus cleanup/rollback ownership for async transitions. Do not create a new procedure or command. Value: high. Effort: low.

### 4. Hallmark adds three useful async feedback rules; shipped state modeling remains the stronger owner

Shipped Motion already has an explicit async state-machine card with events, guards, impossible states, entry/exit actions, recovery, and reduced-motion parity. Interface preflight independently requires every state/event/transition/guard/UI/recovery/a11y mapping. Hallmark contributes concrete operational checks that are not explicit in those assets: silent success when the result is visible, optimistic mutation with rollback only when prediction is safe, and delayed/minimum-visible loading indicators to prevent spinner flash. Its universal claim that errors always need toasts conflicts with Interface's stronger rule that feedback sits near the cause unless page-wide. [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion-pattern-cards.md:200-218] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:171-190] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:7-15] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:171-188] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:213-220] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux-quality-reference.md:97-119]

Verdict: ADAPT those three checks into the async/loading cards and Interface preflight, with measured product latency instead of universal milliseconds. Preserve local error placement and recovery ownership. Value: high. Effort: low-medium.

### 5. The universal eight-state mandate should not be imported

Hallmark says every interactive element has all eight states, but several states are inapplicable to many controls, its disabled recipe combines `aria-disabled` with `tabindex=-1` as a universal treatment, and its success guidance conflicts internally with silent success. Shipped Motion correctly uses applicable states, explicit state paths, impossible-state prevention, and stateful-surface N/A handling. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/interaction-and-states.md:3-18] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/interaction-and-states.md:84-97] [SOURCE: .opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md:17-39] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:171-190]

Verdict: SKIP the mandatory count. LEARN only the completeness pressure: enumerate every applicable state and explicitly mark omitted states N/A with a reason. Value: medium-high. Effort: low.

### 6. Reduced-motion treatment in shipped Motion is more semantically reliable

Shipped Motion requires equivalent state feedback and allows instant, opacity, color/focus, or static progress alternatives. Hallmark's broad `150ms !important` override can still delay high-frequency actions, can damage component-specific semantics, and contradicts its own separate `0.01s`, skip, stop, and slower-loader recipes. Its durable principle is per-interaction reduced-motion behavior, which shipped pattern cards already require. [SOURCE: .opencode/skills/sk-design/design-motion/references/performance-reduced-motion.md:78-100] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion-pattern-cards.md:30-40] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/motion.md:83-97] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:37-43] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:242-253]

Verdict: SKIP Hallmark's global override recipe. Keep semantic per-pattern alternatives and add `motion-level=none` as authored direction only; user preference always wins. Value: high. Effort: none beyond the token-schema row.

### 7. Performance verification is already materially stronger in shipped Motion

Hallmark correctly prefers transform/opacity, IntersectionObserver, bounded `will-change`, and no raw scroll polling. Shipped Motion additionally covers rendering-cost tiers, FLIP, read/write batching, mixed animation systems, endless rAF, inherited-variable cost, layer memory, blur bounds, off-screen pausing, lowest-target-device checks, and measurement before claims. Hallmark's absolute statement that any non-transform/opacity animation is a performance bug is too broad; shipped guidance correctly permits bounded paint when justified and verified. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/motion.md:7-14] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/motion.md:99-109] [SOURCE: .opencode/skills/sk-design/design-motion/references/performance-reduced-motion.md:35-76] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion-performance-failure-card.md:40-68]

Verdict: SKIP Hallmark performance prose and preserve the shipped verification card. Value: high through avoided regression. Effort: none.

### 8. No new command is justified

The public command already owns temporal briefs, interruption/reversal, reduced-motion parity, runtime evidence, and handoff; Motion owns strategy, microinteractions, state procedures, pattern cards, and performance. Theme-aware motion is a token/modifier concern spanning existing Motion and Foundations owners, not a separate user job. [SOURCE: .opencode/commands/interface/motion.md:7-16] [SOURCE: .opencode/commands/interface/motion.md:46-80] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:260-296] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:338-380]

Verdict: SKIP a new theme-motion, microinteraction, or interaction-state command. Value: high through reduced surface duplication. Effort: none.

## Candidate Matrix

| Hallmark asset | Exact sk-design target files | Verdict | Surgical concrete change | Value | Effort | Licensing treatment |
|---|---|---|---|---|---|---|
| `motion.md` | `.opencode/skills/sk-design/design-motion/references/motion-strategy.md`; `.opencode/skills/sk-design/shared/design-token-vocabulary.md`; `.opencode/skills/sk-design/design-foundations/references/design-system-artifact-contract.md` | ADAPT / SKIP | Add role-based motion modifier/token fields and direction-authored no-motion cases; retain shipped timing bands, curves, materials, and performance rules | High | Medium | Independently define schema and names; no notice. Direct copying of CSS tokens, tables, or prose requires Hallmark MIT notice. |
| `microinteractions.md` | `.opencode/skills/sk-design/design-motion/assets/motion-pattern-cards.md`; `.opencode/skills/sk-design/design-motion/references/micro-interactions.md`; `.opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md` | ADAPT | Add interruption/reversal/retrigger proof, silent-visible-success, safe optimistic rollback, and anti-spinner-flash checks; keep values target-derived | High | Low-medium | Rewrite principles into native cards; do not copy recipe catalog, theme table, spring presets, or exact timing values. |
| `interaction-and-states.md` | `.opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md`; `.opencode/skills/sk-design/design-motion/assets/motion-pattern-cards.md`; `.opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md` | LEARN / SKIP | Require every applicable state or an explicit N/A reason; preserve event/guard/impossible-state/recovery model instead of mandatory eight-state parity | Medium-high | Low | Idea-level completeness rule only; do not copy exhaustive tables or CSS recipes. |

## Licensing Boundary

Hallmark's MIT grant permits copying and modification only with its copyright and permission notice retained in copies or substantial portions. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/LICENSE:5-13] This iteration recommends independently worded adaptations only. If implementation copies Hallmark's token blocks, theme multiplier table, recipes, state tables, or substantial prose, add the Hallmark MIT notice at repository level and provenance in the copied asset.

## Ruled Out

- A new theme-motion, microinteraction, interaction-state, or reduced-motion command; `/interface:motion` and existing mode assets already own the jobs.
- Hallmark's ten-theme duration multiplier table as presets; values are unvalidated against target identity, frequency, input, runtime, and device evidence.
- A universal eight-state requirement for every element; applicability plus explicit N/A is more accurate.
- Hallmark's global `150ms !important` reduced-motion recipe and absolute transform/opacity-only rule.
- Copying exact duration, easing, spring, stagger, tooltip, toast, or drag recipes into shipped guidance.

## Dead Ends

- Recursive globbing did not locate the three known Hallmark files, repeating the lineage's glob limitation. Exact inventory paths were readable and complete.
- Raw recipe-count comparison was not useful: Hallmark is a broad catalog while shipped Motion uses purpose/state cards and routes advanced implementation mechanics separately.
- Theme-name parity was rejected because shipped sk-design uses Brand/Product posture plus target-specific direction, not a reusable style chooser.

## Questions Answered

- Hallmark's theme-aware motion idea is worth adopting only as a semantic modifier schema inside existing Motion/Foundations assets.
- Shipped Motion is stronger on interruption/reversal routing, async state modeling, reduced-motion semantics, and performance verification; only card-level propagation and three async feedback checks are meaningful gaps.
- All three Hallmark assets have exact targets, verdicts, surgical changes, value, effort, and licensing treatment; none justifies a new command.

## Sources Consulted

- Hallmark motion sources. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/motion.md:1-109] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/microinteractions.md:1-258] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/interaction-and-states.md:1-208]
- Shipped Motion route, mode, strategy, microinteraction, state, reduced-motion, and performance assets. [SOURCE: .opencode/commands/interface/motion.md:1-80] [SOURCE: .opencode/commands/interface/assets/interface-motion-auto.yaml:1-71] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:1-397] [SOURCE: .opencode/skills/sk-design/design-motion/references/motion-strategy.md:1-105] [SOURCE: .opencode/skills/sk-design/design-motion/references/micro-interactions.md:1-160] [SOURCE: .opencode/skills/sk-design/design-motion/references/performance-reduced-motion.md:1-100] [SOURCE: .opencode/skills/sk-design/design-motion/references/animation-decision-framework.md:1-109] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion-pattern-cards.md:1-218] [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion-performance-failure-card.md:1-68] [SOURCE: .opencode/skills/sk-design/design-motion/procedures/interaction-states-pass.md:1-43]
- Related shared, Foundations, and Interface ownership. [SOURCE: .opencode/skills/sk-design/shared/register.md:1-79] [SOURCE: .opencode/skills/sk-design/shared/design-token-vocabulary.md:1-97] [SOURCE: .opencode/skills/sk-design/design-foundations/references/design-system-artifact-contract.md:1-88] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:171-190] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux-quality-reference.md:97-119]

## Assessment

- Status: complete for iteration 5's bounded focus.
- findingsCount: 8 comparative findings and 3 asset decisions.
- newInfoRatio: 0.81.
- Novelty justification: Five findings establish new file-level gaps or ownership decisions and three refine known motion overlap into exact surgical targets; `(5 + 3 x 0.5) / 8 = 0.81` after rounding.
- Confidence: high for current file ownership, duplication, and contract comparison; medium for implementation effort because no implementation or runtime fixture was attempted.
- Convergence: continue. The stop policy requires ten iterations; iteration 5 cannot legally stop even though core motion ownership is now saturated.

## Reflection

Behavioral comparison prevented Hallmark's large recipe catalog from looking like a missing capability. Its strongest portable idea is theme-aware intensity, but the durable sk-design form is a small semantic modifier schema constrained by register, frequency, input, reduced-motion preference, and measured performance.

## Recommended Next Focus

Compare Hallmark's curated theme/genre mechanics and design-DNA schema against the shipped styles corpus, relational-exemplar authority, and design-reference schema without creating a preset chooser.
