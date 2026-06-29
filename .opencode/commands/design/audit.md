---
description: Design QA: accessibility, performance, responsive, anti-slop, scoring, hardening. sk-design audit mode.
argument-hint: "<target> [--scope] [--score]"
allowed-tools: Read, Glob, Grep
---

# /design:audit

Thin bridge into the `sk-design` parent skill's `audit` mode.

## 1. PURPOSE

Pin the `audit` mode of the `sk-design` parent hub to audit and harden design quality. The hub owns routing
across modes; this command loads the `audit` mode directly. If the request spans more
than `audit`, defer to the hub's routing instead of forcing this mode.

## 2. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-audit/SKILL.md` -- the `audit` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `audit` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`

## 3. EMIT DELIVERABLE

Emit `Design Quality Audit Report` as the primary deliverable.

Required fields:
- `target`
- `evidenceInventory`
- `severityFindings`
- `qualityScore`
