# Iteration 1: Parent routing and mandatory register baseline

## Focus

Investigate whether the `sk-design` hub and interface packet already require context that explains the observed skipped-register miss.

## Findings

1. The parent hub is intentionally a router, not the owner of design behavior. It resolves a `workflowMode` through `mode-registry.json`, then loads the selected packet; per-mode behavior must not be flattened into the hub. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:41] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:58]

2. The current parent routing rule favors the smallest useful mode and defaults generic design prompts to `interface`; it pairs modes only when the prompt has clearly separate axes. That is reasonable for advice, but too weak for UI build work where interface success criteria themselves depend on cross-mode context. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:56]

3. The shared Brand-vs-Product register is explicitly the first design decision. It says skipping that decision is the common cause of generic default drift, and it sets six downstream dials: density, motion budget, color dosage, copy register, anti-slop strictness and audit severity. [SOURCE: file:.opencode/skills/sk-design/shared/register.md:16] [SOURCE: file:.opencode/skills/sk-design/shared/register.md:49]

4. Interface mode already requires the register and dials at the start of any design task. Its default resources include `../shared/register.md` and `brief_to_dials.md`, and the workflow says to set posture before any visual choice. [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:73] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:141]

## Sources Consulted

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/register.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md`

## Assessment

`newInfoRatio`: 1.00

Novelty justification: first pass established the baseline failure mode and showed that register loading is not optional mode trivia.

Confidence: high. Multiple `sk-design` files say the register is first-step context.

## Reflection

What worked: Reading the hub before the child packet prevented over-correcting the parent router. The router is deliberately thin; the miss is in build-task bundling and dispatch proof, not in making the hub own design logic.

What failed or was ruled out: Interface-only loading for UI builds is inadequate because interface success already refers to register, dials, pre-flight, and quality-floor context.

## Recommended Next Focus

Check foundations color and token references to determine whether contrast must be loaded for all UI builds or only explicit color tasks.
