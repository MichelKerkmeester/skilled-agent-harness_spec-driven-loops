---
description: Distinctive, intentional UI design: direction, palette, type, layout, motion. sk-design interface mode.
argument-hint: "<design request>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:interface

Thin bridge into the `sk-design` parent skill's `interface` mode.

## 1. PURPOSE

Pin the `interface` mode of the `sk-design` parent hub to build or reshape a distinctive, intentional interface. The hub owns routing
across modes; this command loads the `interface` mode directly. If the request spans more
than `interface`, defer to the hub's routing instead of forcing this mode.

## 2. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-interface/SKILL.md` -- the `interface` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `interface` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`
