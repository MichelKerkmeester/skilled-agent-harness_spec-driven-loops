---
description: Extract a live site's real CSS into a Style Reference DESIGN.md. sk-design md-generator mode.
argument-hint: "<live-url> --output <dir>"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:md-generator

Thin bridge into the `sk-design` parent skill's `md-generator` mode.

## 1. PURPOSE

Pin the `md-generator` mode of the `sk-design` parent hub to extract a live site's real CSS into a Style Reference DESIGN.md. The hub owns routing
across modes; this command loads the `md-generator` mode directly. If the request spans more
than `md-generator`, defer to the hub's routing instead of forcing this mode.

## 2. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-md-generator/SKILL.md` -- the `md-generator` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `md-generator` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`

## 3. EMIT DELIVERABLE

Emit `Style Reference DESIGN.md` as the primary deliverable.

Required fields:
- `sourceUrl`
- `extractedTokensDigest`
- `fidelityScore`

File outputs:
- `<output>/DESIGN.md`
