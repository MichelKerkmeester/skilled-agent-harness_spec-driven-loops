---
title: "DIA-001 -- Type selection and routing"
description: "This scenario validates type selection and routing for `DIA-001`. It focuses on selecting the correct diagram type from the 27-type selection guide and loading the matching type reference before drawing."
version: 1.0.0.0
---

# DIA-001 -- Type selection and routing

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DIA-001`.

---

## 1. OVERVIEW

This scenario validates type selection and routing for `DIA-001`. It focuses on selecting the correct diagram type from the 27-type selection guide and loading the matching type reference before drawing.

### Why This Matters

The packet's value depends on picking the right grammar for the reader: an architecture diagram, a flowchart, a sequence, and a swimlane communicate entirely different things. If the agent loads the wrong `references/type-*.md` or skips it entirely, every downstream rule — layout conventions, per-type ceilings, anti-patterns — silently drifts. This scenario locks the routing contract: the request shape is classified, the selection guide is consulted, and the matching type reference plus the always-loaded style guide are the resources that must appear in the agent's loaded set.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DIA-001` and confirm the expected signals without contradictory evidence.

- Objective: select the correct diagram type for a components-and-connections request and load the matching type reference before drawing
- Real user request: `Draw an architecture diagram of our checkout service and its dependencies.`
- Prompt: `Create an architecture diagram as a self-contained HTML file showing our checkout service, the auth service it calls, and the Postgres store behind it. Load the right type conventions, apply the style guide, and save it to docs/checkout-architecture.html.`
- Expected execution process: the router classifies the request as GENERATE, the selection guide maps "components + connections in a system" to Architecture, and the agent reads `references/style-guide.md` (always) plus `references/type-architecture.md` before copying a template and drawing within the complexity budget.
- Expected signals: `references/type-architecture.md` appears in the loaded references (not a flowchart or other mismatched type); the output HTML contains a self-contained `<svg>` with `role="img"` and prefixed `aria-labelledby`; the diagram stays within 9 nodes and 12 arrows.
- Desired user-visible outcome: a correct-typed, self-contained HTML diagram at `docs/checkout-architecture.html`.
- Pass/fail: PASS if the correct type reference is loaded, the HTML is self-contained with the accessible-SVG contract satisfied, and the diagram is within the complexity budget; FAIL if a mismatched type reference is loaded, the HTML is missing or not self-contained, or the accessibility contract is violated.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create an architecture diagram as a self-contained HTML file showing our checkout service, the auth service it calls, and the Postgres store behind it. Load the right type conventions, apply the style guide, and save it to docs/checkout-architecture.html.`

### Commands

1. `agent: Read references/style-guide.md (always) and references/type-architecture.md (matching type)`
2. `agent: Copy assets/template.html to docs/checkout-architecture.html`
3. `agent: Replace the eyebrow, H1, and SVG body; fill the prefixed <title>/<desc>; enforce the 4px grid and the complexity budget`
4. `agent: Run the taste gate from SKILL.md SUCCESS CRITERIA and verify the accessible-SVG contract`

### Expected

Step 1 loads `references/type-architecture.md` (the selection guide maps components + connections to Architecture). Step 2 produces `docs/checkout-architecture.html`. Step 3 yields a diagram with 3 nodes and 2 arrows — inside the 9-node / 12-arrow budget — with a single accent on the focal element. Step 4 reports the taste gate clean: `<svg>` has `role="img"`, `aria-labelledby` resolves to prefixed `<title>` / `<desc>`, and `<title>` is the first child of `<svg>`.

### Evidence

Capture the prompt used, the list of references the agent reported loading (must include `references/type-architecture.md`), the output path `docs/checkout-architecture.html`, and a grep of the HTML showing `role="img"`, `aria-labelledby="checkout-architecture-title checkout-architecture-desc"`, and the first-child `<title>`. Record the node/arrow counts and the accent count (must be at most 2).

### Pass / Fail

- **Pass**: `references/type-architecture.md` was loaded, `docs/checkout-architecture.html` exists as a single self-contained file, the accessible-SVG contract holds, and the diagram is within the complexity budget.
- **Fail**: a mismatched type reference was loaded (e.g. `type-flowchart.md`), the HTML is missing or references external resources, or the accessibility contract is broken.

### Failure Triage

1. Confirm the working directory is the repository root so `.opencode/skills/sk-doc/sk-create-diagram/` paths resolve, and confirm the packet assets exist.
2. Re-run step 1 and inspect the loaded-reference list; if the wrong type reference loads, the request classification (GENERATE vs IMPORT vs EXPORT) or the selection-guide mapping is the drift point.
3. Grep the output HTML for `role="img"` and the prefixed `aria-labelledby`; a missing or bare `title`/`desc` ID means the template slug replacement was skipped.

### Optional Supplemental Checks

Run a second variant with a decision-logic request (`Draw a flowchart of our refund approval rules.`) and confirm the agent instead loads `references/type-flowchart.md`, proving the router is not hardwired to one type.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/diagram-generation/type-selection-and-routing.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `SKILL.md` (Smart Routing + Selection Guide) | Primary implementation anchor |
| `references/type-architecture.md` | Type convention anchor |

---

## 5. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Playbook ID: DIA-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `diagram-generation/type-selection-and-routing.md`
