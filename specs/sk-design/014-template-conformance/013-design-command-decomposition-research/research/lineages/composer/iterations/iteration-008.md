# Iteration 8: Keyword Collisions

## Focus
INTENT_SIGNALS scoring collisions.

## Findings (confirmed)
1. **Three collisions:** redesign; existing design system; reduced motion. [SOURCE: SKILL.md:114-132 keyword scan]
2. **Ambiguity-aware router** unions intents within delta — widens load, does not switch commands. [SOURCE: SKILL.md:105-107]
3. Command selection is hub-level (/interface:design vs design-reference), not intent-level.

## Assessment
- newInfoRatio: 0.87
