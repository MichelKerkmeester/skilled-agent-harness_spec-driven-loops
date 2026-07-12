---
title: "AI-001: Positive Design Controls"
description: "Verify sk-design wins positive design-control prompts at confidence >= 0.80 and the hub resolves the matching mode."
version: 1.1.0.0
---

# AI-001: Positive Design Controls

## 1. OVERVIEW

This scenario verifies end-to-end advisor integration for the single public advisor identity `sk-design`. The advisor should choose `sk-design`; the hub should then resolve the mode from the registry and router.

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer wants confidence that design prompts enter the parent hub rather than separate child identities.

**Probe set**:

| Probe | Prompt | Expected Mode | Why |
|---|---|---|---|
| P1 | `Make this onboarding page look less generic and give it a distinctive interface direction.` | `interface` | `interface-taste` includes `less generic` and `visual direction`. |
| P2 | `Create an OKLCH palette, typography scale, and spacing system for this analytics dashboard.` | `foundations` | `foundations-color`, `foundations-type`, and `foundations-layout` all match. |
| P3 | `Design the transition choreography and reduced-motion fallback for this modal.` | `motion` | `motion-aliases` includes `transitions` and `reduced motion`. |
| P4 | `Audit this settings screen for WCAG contrast, keyboard focus, and design slop.` | `audit` | `audit-accessibility` includes `wcag contrast`; `audit-quality` includes design QA terms. |
| P5 | `Extract design tokens from https://example.com and generate DESIGN.md.` | `md-generator` | `md-generator-aliases` includes `extract design tokens` and `generate design.md`. |
| P6 | `Wire Open Design's MCP server into opencode so I can drive od cli from the terminal.` | `design-mcp-open-design` | `design-mcp-open-design-aliases` includes `wire open design` and `od cli`; distinguishes from the external sibling `mcp-figma`. |

**Expected packet loaded**:
- P1: `design-interface/SKILL.md`
- P2: `design-foundations/SKILL.md`
- P3: `design-motion/SKILL.md`
- P4: `design-audit/SKILL.md`
- P5: `design-md-generator/SKILL.md`
- P6: `design-mcp-open-design/SKILL.md`

**Expected shared resources loaded or cited**:
- P1: `shared/register.md`, `shared/context_loading_contract.md`
- P2: `shared/register.md`, `shared/context_loading_contract.md`, `shared/design_token_vocabulary.md` when token handoff is discussed
- P3: `shared/register.md`
- P4: `shared/register.md`, `shared/context_loading_contract.md`
- P5: UNKNOWN; the md-generator router is scoped to its own folder
- P6: none required; `design-mcp-open-design` is a transport packet, not a doc-guidance mode, so it does not consume the shared design reference base

**Expected advisor behavior**: win. `sk-design` should be top-1 for every positive prompt at confidence `>= 0.80`.

## 3. TEST EXECUTION

### Preconditions

1. The advisor sees a single public `sk-design` identity.
2. `mode-registry.json` contains all six modes (five `packetKind: workflow` plus one `packetKind: transport`) with `advisorRouting.routingClass: metadata`.

### Exact Command Sequence

1. Run the advisor probe for each prompt and append output to `/tmp/skd-AI001-advisor-results.jsonl`.
2. Invoke the orchestrator with each prompt and save responses under `/tmp/skd-AI001/P<index>.txt`.
3. Tabulate top-1 skill, confidence, resolved mode, packet path, and resource list.

### Pass/Fail Criteria

- **PASS** iff all six probes return `sk-design` top-1 at confidence `>= 0.80`, and the hub resolves the expected mode and packet for each probe.
- **FAIL** iff any positive probe routes to a non-design skill, any child mode appears as a separate advisor identity, any hub mode resolves to the wrong packet, or P6 is misrouted to the external `mcp-figma` sibling.

### Failure Triage

1. If `sk-design` loses a positive, inspect the `sk-design` graph signals and the competing skill's top evidence.
2. If a child packet appears as an advisor identity, inspect the one-graph-metadata invariant and packet folders for accidental discoverable markers.
3. If advisor wins but hub mode is wrong, inspect `hub-router.json` vocabulary classes for the lost prompt.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`

## 5. SOURCE METADATA

- **Critical path**: Yes
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending manual run
