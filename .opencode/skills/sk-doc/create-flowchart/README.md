---
title: "create-flowchart"
description: "Turn a real process, decision tree or system interaction into a validator-passing ASCII markdown flowchart, for anyone who needs a diagram that stays readable in raw markdown."
trigger_phrases:
  - "create flowchart"
  - "ascii flowchart"
version: 1.0.0.0
---

# create-flowchart

> Draw a real process as a readable ASCII flowchart using one of six proven patterns, and prove it passes the validator before handoff.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Turning a real process, decision tree, journey or system interaction into a markdown-readable ASCII diagram |
| **Invoke with** | `/create:flowchart`, or "flowchart" / "decision tree" / "swimlane" |
| **Works on** | Linear flows, branching decisions, parallel execution, approval loops, system swimlanes, user journeys |
| **Produces** | A fenced ASCII diagram, standalone or embedded, that passes `scripts/validate-flowchart.sh` |

---

## 2. OVERVIEW

### Why This Skill Exists

A hand-drawn ASCII diagram is easy to get subtly wrong: inconsistent box widths, a decision with no labeled branches, arrows that only make sense once rendered. Nobody notices until the diagram sits in a doc for months looking finished while quietly being unreadable in a raw markdown viewer or terminal. create-flowchart exists so a diagram starts from one of six proven shapes instead of freehand ASCII art, and never ships without running through a validator that actually checks width consistency, connectors and branch labels.

### What It Does

create-flowchart picks the closest of six pattern assets (linear, decision tree, parallel execution, approval loop, system swimlane, user journey) for the real process being documented, drafts the diagram from real source content, then runs `scripts/validate-flowchart.sh` against it before handoff. It only produces ASCII/box-drawing markdown diagrams. Mermaid, Graphviz, SVG and design-canvas artifacts are out of scope, and a document that only needs a short bullet list should stay a bullet list.

---

## 3. QUICK START

**Step 1: pick the closest pattern for the real process.**

```text
Create an ASCII flowchart for the release approval workflow, including
rejection loops and final shipped/blocked outcomes.
```

That request maps to `assets/approval-workflow-loops.md`.

**Step 2: draft the diagram from the pattern, using real nodes only, then validate it.**

```bash
bash scripts/validate-flowchart.sh path/to/your-flowchart.md
```

Exit `0` means it passed, including warning-only runs. Exit `1` blocks delivery until the reported errors are fixed.

**Step 3: if the flowchart is embedded in a larger document you're also editing, validate the surrounding markdown too.**

```bash
python3 ../shared/scripts/validate_document.py path/to/document.md
```

---

## 4. HOW IT WORKS

Every build follows the same order: identify the workflow shape and target path, read the existing document (or confirm the new file path) before writing, select exactly one closest pattern asset from `assets/`, then extract the real nodes from the source: start state, actions, decisions, branch outcomes, retries, parallel lanes, joins and terminal states. Anything the source doesn't support gets left out or flagged as unknown rather than invented. The diagram goes into a fenced code block with consistent widths, connectors and branch labels, gets validated and only ships once errors are fixed. Warnings get addressed when practical, not silently ignored.

### Key Concept: The Validator Is Not Optional Polish

`scripts/validate-flowchart.sh` is not a style nicety: it catches the failure modes that make a diagram lie to its reader, including more than five box-width variations, boxes with no connectors, decision nodes with no `[YES]`/`[NO]` or `✓`/`✗` label, nesting past level six and files past 200 lines that should probably split. A diagram that "looks right" in the editor but never ran through this script has not actually been checked. The packet's own success criteria treat an unvalidated flowchart as an unfinished one, not a finished one with an unrun check.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-flowchart when a real process, decision tree, approval cycle, parallel pipeline or system interaction needs to be readable as plain markdown, not just rendered HTML. Skip it when a two- or three-step bullet list already says the same thing more clearly, or when the actual deliverable is Mermaid, Graphviz, SVG, a screenshot or a design-canvas artifact. None of those are this packet's output.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-quality-control` | Audits or scores an existing document, including one with a flowchart already in it. create-flowchart is for authoring a new or rewritten diagram. |
| `sk-design` | Owns visual, pixel-level or canvas-tool diagrams. create-flowchart only produces plain-text ASCII diagrams. |
| `create-readme` | Owns the surrounding document a flowchart might get embedded into. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Validator errors on box-width variation | More than 5 distinct horizontal-rule widths in one diagram | Standardize box widths and prefer fewer, clearer nodes over exhaustive detail |
| Validator flags an unlabeled decision | A decision-like line has no `[YES]`/`[NO]` or `✓`/`✗` marker | Add the label on every outgoing branch, with a descriptive word alongside if it helps |
| Validator warns on nesting depth | Indentation goes past level 6 | Split into multiple diagrams, or move deep detail into a swimlane |
| Diagram reads fine rendered but breaks in a terminal | Connectors or spacing rely on rendered markdown rather than raw text | Redraw using the packet's plain-text connector conventions and re-run the validator |
| Wrong pattern picked | The workflow shape (linear vs. branching vs. parallel vs. loop vs. swimlane vs. journey) was misjudged before drafting | Re-check the pattern table in `SKILL.md` section 4 against the real source before continuing |

---

## 7. FAQ

**Q: Why ASCII instead of Mermaid?**

A: Mermaid needs a renderer to be readable. ASCII stays readable in raw markdown, a terminal or a diff. If the deliverable specifically needs Mermaid, Graphviz or SVG, that's outside this packet.

**Q: What if my process doesn't fit any of the six patterns?**

A: Pick the closest one and adapt it. The patterns are shape guides, not rigid templates. Use their demonstrated features, not their placeholder content.

**Q: What happens if the validator fails and I can't fix it before handoff?**

A: Report the exact command, the failure and what you manually checked. Never claim a clean validation result that didn't actually run clean.

---

## 8. VERIFICATION

| Check | Result |
|---|---|
| `bash scripts/validate-flowchart.sh <target-flowchart.md>` | Exit `0`, including warning-only runs, required before delivery |
| `python3 ../shared/scripts/validate_document.py <document.md>` | Only when the surrounding document being edited is also in scope |
| Manual check | Diagram reflects real source content instead of generic filler, and stays readable in raw markdown |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Authoritative packet contract, notation rules and validator contract |
| [`references/README.md`](./references/README.md) | Reference route-map |
| [`references/worked-example.md`](./references/worked-example.md) | A validator-passing decision-tree example |
| [`references/notation-and-validator.md`](./references/notation-and-validator.md) | Validator mechanics, box-width notation, common mistakes |
| [`references/pattern-selection.md`](./references/pattern-selection.md) | Pattern-selection detail and split heuristics |
| [`assets/decision-tree-flow.md`](./assets/decision-tree-flow.md) | Pattern for branching, validation paths and retries |
| [`assets/approval-workflow-loops.md`](./assets/approval-workflow-loops.md) | Pattern for review cycles and sign-off loops |
