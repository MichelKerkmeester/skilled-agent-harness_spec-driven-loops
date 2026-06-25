---
title: AnimatePresence Patterns
description: Motion/Framer Motion and AnimatePresence rules for exits, keys, modes, presence hooks, nested exits, and list transitions.
trigger_phrases:
  - "AnimatePresence patterns"
  - "exit animation"
  - "motion react"
  - "presence hooks"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# AnimatePresence Patterns

Use `AnimatePresence` when conditional React elements need exit animations after they leave render state. Missing wrappers, unstable keys, and mismatched modes are the common failure modes.

---

## 1. OVERVIEW

### Purpose

Apply Motion/Framer Motion `AnimatePresence` correctly so conditional elements animate out instead of disappearing. This reference covers exit rules, presence modes, presence hooks, nested exits, list transitions, and the format for reporting audit findings.

### When to Use

- Adding exit animations to conditionally rendered React elements.
- Choosing a presence mode (`sync`, `wait`, `popLayout`) for overlays, route changes, or lists.
- Coordinating presence hooks, async cleanup, or nested exit propagation.
- Auditing existing motion code for missing wrappers, unstable keys, or mismatched modes.

---

## 2. Exit Rules

| Rule | Pass condition |
| --- | --- |
| Conditional wrapper | Conditional `motion.*` elements with `exit` are inside `AnimatePresence`. |
| Exit prop | Every element expected to animate out has an `exit` prop. |
| Stable key | Dynamic items use data IDs, not array indexes. |
| Symmetry | Exit mirrors initial direction unless a different departure is intentional. |
| No first-render enter | Elements already present on mount use `initial={false}` on `AnimatePresence` so the enter animation does not play on page load. |

Set `initial={false}` on `AnimatePresence` when its child is rendered in its default state on first mount; this suppresses the first-render enter animation. Verify it does not cancel an entrance you actually want on load.

Example:

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      key="settings-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      // Enter: ease-out, arrive fast and settle gently.
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      // Exit: own faster ease-in transition (~75% of enter). Do not reuse
      // the ease-out enter curve for exits (violates the ease-in-for-exits rule).
      exit={{ opacity: 0, y: 16, transition: { duration: 0.16, ease: [0.55, 0, 1, 0.45] } }}
    />
  )}
</AnimatePresence>
```

The `exit` transition is defined on the `exit` prop itself so it does not inherit the ease-out enter curve. Enter uses ease-out (`[0.16, 1, 0.3, 1]`); exit uses ease-in (`[0.55, 0, 1, 0.45]`) at `0.16s`, about 75 percent of the enter duration, satisfying both the ease-in-for-exits rule and the exits-faster rule.

## 3. Modes

| Mode | Use for | Risk and remedy |
| --- | --- | --- |
| default/sync | simple overlays where enter and exit can overlap | Exiting and entering elements compete for layout. Remedy: position exiting elements `absolute` so they leave the flow, or prefer `popLayout` for lists. |
| `wait` | route/page replacement where old must leave before new enters | Total time doubles; shorten each phase. |
| `popLayout` | list reordering or removal | Requires layout-aware children and stable keys. |

If `mode="wait"` uses `0.3s` enter and `0.3s` exit, the user perceives about `0.6s`. Reduce each phase when the total must feel fast.

## 4. Presence Hooks

- `useIsPresent` belongs in a child of `AnimatePresence`, not the parent.
- Exiting elements should disable interactions when no longer present.
- If `usePresence` performs async cleanup, call `safeToRemove` after cleanup completes.

## 5. Nested Exits

Nested `AnimatePresence` needs `propagate` when child exits should run as the parent exits. Coordinate parent and child durations; a parent that vanishes before children complete makes exits look broken.

## 6. Lists

- Use item IDs for keys.
- Keep stagger under `50ms` per item and cap total stagger.
- Use `popLayout` when removal changes list geometry.
- Avoid animating every list item on routine resort/filter operations if it slows power users.

## 7. Audit Findings Format

When reviewing implementation, report findings like:

```text
components/modal.tsx:42 - [exit-requires-wrapper] Conditional motion.div has exit but is not wrapped in AnimatePresence.
components/list.tsx:88 - [exit-key-required] Animated list uses index key; use item.id to preserve identity.
```
