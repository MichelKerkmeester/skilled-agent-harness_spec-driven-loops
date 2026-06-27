---
title: AnimatePresence Checklist Scenario
description: Manual scenario verifying the pass-or-fail exit checklist catches wrapper, key, first-render, mode, presence-hook and nested-exit failures.
trigger_phrases:
  - "test animate presence checklist"
  - "exit checklist scenario"
  - "presence pass fail test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PRESENCE
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - references/animate_presence_patterns.md
  - assets/animate_presence_checklist.md
---

**Exact prompt**

```
Here is a list component with conditional motion rows and a modal. Run the exit checklist before we ship.
```

# MOTION-PRESENCE-002 | AnimatePresence Checklist

## Prompt

`Here is a list component with conditional motion rows and a modal. Run the exit checklist before we ship.`

## Expected Process

1. Load `assets/animate_presence_checklist.md` and walk every section in order: exit wiring, keys, first render, mode, presence hooks, nested exits.
2. Mark each box pass or fail and record a `file:line` for any fail.
3. Point each fail to its fix in `references/animate_presence_patterns.md` rather than restating the reasoning inline.

## Pass Criteria

- Flags any conditional `motion.*` element with an `exit` prop that sits outside an `AnimatePresence`.
- Rejects array-index keys and confirms stable, unique data-ID keys per sibling.
- Confirms `mode` matches the case and that `wait` shortens each phase, then checks `initial={false}` for default-state first mounts.
- Records a `file:line` for every fail and reports it in the audit findings format from the patterns reference.
