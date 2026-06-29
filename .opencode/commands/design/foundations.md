---
description: Visual systems: color/OKLCH, typography, layout, spacing, tokens, theming. sk-design foundations mode.
argument-hint: "<axis> <target>"
allowed-tools: Read, Glob, Grep
---

# /design:foundations

Thin bridge into the `sk-design` parent skill's `foundations` mode.

## 1. PURPOSE

Pin the `foundations` mode of the `sk-design` parent hub to design the static visual system - color, typography, layout, spacing, tokens. The hub owns routing
across modes; this command loads the `foundations` mode directly. If the request spans more
than `foundations`, defer to the hub's routing instead of forcing this mode.

## 2. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-foundations/SKILL.md` -- the `foundations` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `foundations` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`

## 3. EMIT DELIVERABLE

Emit `Visual System Foundations Plan` as the primary deliverable.

Required fields:
- `axis`
- `target`
- `tokenDecisions`
- `contrastEvidence`

## 4. EXAMPLE

```
/design:foundations color marketing-site
```

Returns: a static visual-system plan with color, type, layout, spacing, responsive, and token guidance as applicable
