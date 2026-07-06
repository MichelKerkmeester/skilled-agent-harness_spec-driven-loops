# Interaction States Pass

| Field | Value |
|---|---|
| Purpose | Let `design-motion` specify complete interaction states, feedback, transitions, and reduced-motion expectations. |
| Owning mode | `design-motion` |
| Source reference | `interaction-states-pass.md` |
| Trigger | Use when the request involves hover, active, focus, disabled, loading, selected, navigation, forms, custom widgets, or missing feedback. |
| Output contract | An interaction-state matrix covering elements, default/hover/active/disabled/focus/loading states, transitions, action feedback, and reduced-motion behavior. |
| Proof gate | Every interactive element has a visible rest state, keyboard-visible focus, disabled semantics where needed, feedback for actions, and transition timing that fits the motion budget. |
| Privacy rule | This is private motion guidance and does not create a public interaction-states skill. |

## Read-Only Compatibility

`design-motion` can return a state matrix or handoff. It must not require CSS edits, browser automation, or Bash to apply this card.

## Procedure

1. Inventory buttons, links, inputs, toggles, clickable rows or cards, nav items, and custom widgets.
2. For each element, specify default, hover, active, disabled, focus, and loading behavior when applicable.
3. Tie transitions to the register motion budget and keep micro-feedback responsive.
4. Add action feedback for submission, failure, validation, selection, filters, and async work.
5. Include reduced-motion alternatives for nonessential movement.

## Conflict Rule

If the request is primarily an accessibility release claim, `design-audit/procedures/accessibility_audit.md` owns the verdict while this card supplies the interaction-state standard.
