---
id: OB-013
category: unknown_fallback
title: 'Scope-collision disambiguation required'
description: "This scenario validates the DEBUGGING+IMPLEMENTATION scope-collision case for `OB-013`. It focuses on confirming a prompt that smashes a regression fix and a new feature into one request triggers an explicit split-or-prioritize prompt instead of silently merging two unrelated scopes."
expected_surface: OBSIDIAN
expected_intent: DEBUGGING+IMPLEMENTATION
expected_resources:
  - references/mobile-and-touch.md
  - references/view-renderer-architecture.md
  - references/data-layer.md
version: 1.0.0.0
---

# OB-013: Scope-collision disambiguation required

This document captures the routing-recall contract, execution process, source anchors, and metadata for `OB-013`.

---

## 1. OVERVIEW

This scenario validates the `DEBUGGING`+`IMPLEMENTATION` scope-collision case for `OB-013`. It
focuses on confirming that a single prompt asking to fix a regression AND add new functionality in
the same change triggers an explicit disambiguation step — the bundled workflow should surface both
candidate intents and ask which takes priority or whether the two belong in separate changes — rather
than silently merging both into one unscoped edit. This differs from `OB-011`'s ambiguous-multi-intent
case: `OB-011`'s two intents describe ONE coherent task (rename-then-verify); `OB-013`'s two intents
describe TWO unrelated tasks a real operator should not bundle.

### Why This Matters

The framework's own scope-lock discipline treats scope as frozen per change; a prompt that fixes a
live regression and ships new scope in the same breath is exactly the shape of request that erodes
that discipline if a workflow accepts it uncritically. `DEBUGGING`'s `INTENT_SIGNALS` keyword
`"wrong render"` and `IMPLEMENTATION`'s keyword `"new column type"` both appear literally in this
scenario's prompt, so the collision is not manufactured — a real operator plausibly writes exactly
this sentence.

---

## 2. SCENARIO CONTRACT

Operators confirm the exact prompt for `OB-013` matches keywords from both `DEBUGGING` and
`IMPLEMENTATION`, and that the desired outcome is an explicit split-or-prioritize request rather than
a silently merged edit.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN`, matches `INTENT_SIGNALS`
  keywords from both `DEBUGGING` and `IMPLEMENTATION`, and every path in `expected_resources`
  resolves — spanning both intents' curated evidence so the disambiguation step has something
  concrete to weigh.
- Real user request: `The calendar renderer has a wrong render on mobile since the last edit, and I also want to add a new column type to the table renderer in the same change.`
- Prompt: `The calendar renderer has a wrong render on mobile since the last edit, and I also want to add a new column type to the table renderer in the same change.`

**Exact prompt**:
```text
The calendar renderer has a wrong render on mobile since the last edit, and I also want to add a new column type to the table renderer in the same change.
```

- Expected execution process: the hub detects `OBSIDIAN`; `"wrong render"` matches `DEBUGGING` and
  `"new column type"` matches `IMPLEMENTATION`; the bundled workflow surfaces both candidates and
  states that a regression fix and new-feature work are two separate scopes rather than proceeding
  on both under one change; every path this scenario lists under `expected_resources` resolves under
  the skill root.
- Expected signals: every path in `expected_resources` exists under `sk-code-obsidian/`, and the set
  spans both `DEBUGGING`-anchored evidence (mobile/touch repro) and `IMPLEMENTATION`-anchored
  evidence (renderer/data-layer).
- Desired user-visible outcome: the bundled workflow states plainly that it read two separate asks —
  a mobile-overflow regression on the calendar renderer, and a new column type on the table renderer
  — and asks the operator which to scope first, or confirms the operator wants both tracked as two
  distinct changes, rather than silently editing both renderers under one unscoped diff.
- Pass/fail: PASS if every listed path exists, the set spans both intents' curated evidence, and the
  frontmatter surface/intent are `OBSIDIAN`/`DEBUGGING+IMPLEMENTATION`; FAIL if any listed path is
  missing, the response proceeds on both scopes without flagging the split, or the frontmatter
  disagrees.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The calendar renderer has a wrong render on mobile since the last edit, and I also want to add a new column type to the table renderer in the same change.`

### Commands

1. `sed -n '1,15p' .opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/unknown-fallback/disambiguation-required.md`
2. `sed -n '/^## 2b\. SMART ROUTING/,/^## 3\. SURFACE STANDARDS/p' .opencode/skills/sk-code/sk-code-obsidian/SKILL.md | sed -n '/"DEBUGGING":/,/\],/p;/"IMPLEMENTATION":/,/\],/p'`
3. `for p in references/mobile-and-touch.md references/view-renderer-architecture.md references/data-layer.md; do test -e ".opencode/skills/sk-code/sk-code-obsidian/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: DEBUGGING+IMPLEMENTATION`. Step 2
shows both intents' `RESOURCE_MAP` entries. Step 3 prints `OK` for all three paths.

### Evidence

Command transcript from steps 1-3; the resolved frontmatter block; both `RESOURCE_MAP` excerpts
from step 2; the disambiguation language in the workflow's response.

### Pass / Fail

- **Pass**: every `expected_resources` path exists under the skill root, the frontmatter's
  `expected_surface`/`expected_intent` match `OBSIDIAN`/`DEBUGGING+IMPLEMENTATION`, and the response
  explicitly names the two-scope collision instead of silently editing both renderers.
- **Fail**: any listed path is missing, the frontmatter surface/intent disagree, or the response
  proceeds on both scopes without flagging the split.

### Failure Triage

1. Re-run step 3 for the specific path that failed and confirm whether it was renamed or removed.
2. If the response silently merges both scopes without a split-or-prioritize question, treat it as a
   scope-lock regression per the Four Laws, not a resource-loading gap — the fix belongs in the
   bundled workflow mode's own scope-handling, not in this evidence packet.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2b | `INTENT_SIGNALS` and `RESOURCE_MAP` this scenario exercises for both intents |
| [SKILL.md](../../SKILL.md) §5 (ESCALATE IF) | The escalation posture this scenario's split-scope prompt tests |

---

## 5. SOURCE METADATA

- Group: Unknown Fallback
- Playbook ID: OB-013
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `unknown-fallback/disambiguation-required.md`
