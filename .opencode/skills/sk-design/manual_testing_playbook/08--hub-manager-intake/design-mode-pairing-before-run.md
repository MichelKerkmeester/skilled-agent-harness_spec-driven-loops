---
title: "HM-004: Design-Mode Pairing Before Run"
description: "Verify the sk-design hub pairs a design-judgment mode with design-mcp-open-design and names it as a hard precondition before a RUN-direction Open Design generation request, instead of resolving the transport packet alone."
version: 1.0.0.0
---

# HM-004: Design-Mode Pairing Before Run

## 1. OVERVIEW

This scenario verifies the hub's `Visible Plan Before Design or Build Work` and `Transports and Consumers` contracts for a RUN-direction (generation) Open Design request specifically — the case the existing WIRE-only scenarios (`MR-007`, `AI-001` P6) do not cover, and a different layer from the packet-internal mandatory-pairing mechanism already proven by `GATE-001` in `design-mcp-open-design`'s own nested manual_testing_playbook.

## 2. SCENARIO CONTRACT

**Realistic user request**: A user wants to commission an Open Design generation run for a new page, grounded in one of Open Design's local design systems, and wants the run started now.

**Exact prompt**:
```text
Commission an Open Design generation run for a new settings page, grounding it in one of Open Design's local design systems, and start the run now.
```

**Expected hub behavior**: Treat the RUN-direction request as design-affecting and resolve an ordered bundle pairing a design-judgment mode with `design-mcp-open-design`, not the transport packet alone.

**Expected bundle**: `interface` (default per the smallest-useful-mode rule, since no other design axis dominates) plus `design-mcp-open-design`, in that order.

**Expected advisor behavior**: win. `sk-design` should be top-1 at confidence `>= 0.80`.

**Expected visible plan**: The paired design-judgment mode named as a hard precondition, citing hub `SKILL.md`'s `Transports and Consumers` rule ("Use them after the design mode is chosen") and `design-mcp-open-design/SKILL.md`'s own MANDATORY PAIRING banner, before any `start_run` / `od run start` call is described as already executed.

**Why this scenario differs from existing coverage**:
- `MR-007` and `AI-001` P6 both use the WIRE-direction prompt ("Wire Open Design's MCP server into opencode..."), the one case `openDesignExemption` explicitly exempts from pairing.
- `hub-router.json`'s only declared `bundleRules` entry (`ui-build-bundle`) pairs `interface` + `foundations` and does not reference `design-mcp-open-design` at all — there is no machine-readable pairing rule for the transport today.
- The packet-internal mandatory-pairing mechanism (negative/positive/exemption controls for RUN and READ) is already exhaustively proven by `GATE-001` in `design-mcp-open-design`'s own nested manual_testing_playbook (`05--design-gate/mandatory-design-gate.md`). This scenario tests whether the hub's own dispatch visibly surfaces the pairing plan at intake, before any transport call fires.

## 3. TEST EXECUTION

### Preconditions

1. Hub `SKILL.md` contains `Visible Plan Before Design or Build Work` and `Transports and Consumers`.
2. `design-mcp-open-design/SKILL.md` contains the MANDATORY PAIRING banner and the `openDesignExemption` positive-purpose gate.
3. The prompt is RUN-direction (generation, `start_run` / `od run start`), not WIRE-direction, so `openDesignExemption` cannot apply.

### Exact Command Sequence

1. Run the advisor probe and save output to `/tmp/skd-HM004-advisor.txt`.
2. Invoke the orchestrator with the exact prompt.
3. Capture advisor confidence, resolved mode/bundle, visible plan, precondition language, and any reported tool calls in `/tmp/skd-HM004-response.txt`.

### Pass/Fail Criteria

- **PASS** iff advisor top-1 is `sk-design` at confidence `>= 0.80`, the hub resolves an ordered bundle pairing a design-judgment mode (default `interface`) with `design-mcp-open-design`, the visible plan names the paired mode as a hard precondition citing both the hub's `Transports and Consumers` rule and the packet's MANDATORY PAIRING banner, and no mutating Open Design tool call (`start_run` / `od run start`) is reported as already executed before that mode's context/critique appears.
- **FAIL** iff the response resolves `design-mcp-open-design` alone, omits the paired design-judgment mode, describes a `start_run` / `od run start` call as already fired before the paired mode's context/critique appears, or treats the RUN-direction request as exempt from pairing.

### Failure Triage

1. Re-read hub `SKILL.md` `Transports and Consumers` and confirm the RUN-direction request is being treated as design-affecting, not as bare transport.
2. Check `hub-router.json` `routerPolicy.bundleRules` for a missing or malformed pairing rule tying `design-mcp-open-design` to a design-judgment mode.
3. Confirm the response is not conflating this hub-level dispatch check with the packet-internal `GATE-001` mechanism (guarded-proxy token gating) — this scenario is about visible plan ordering, not the proxy's runtime enforcement.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No
- **Concurrent-safe**: Yes
