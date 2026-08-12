---
title: "IMP-002 -- Mermaid import"
description: "This scenario validates Mermaid import for `IMP-002`. It focuses on extracting .mmd, .mermaid, or fenced-Mermaid sources via mermaid_extract.py, redrawing without copying the renderer layout or theme, and shipping a fidelity ledger."
version: 1.0.0.0
---

# IMP-002 -- Mermaid import

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `IMP-002`.

---

## 1. OVERVIEW

This scenario validates Mermaid import for `IMP-002`. It focuses on extracting `.mmd`, `.mermaid`, or fenced-Mermaid sources via `mermaid_extract.py`, redrawing without copying the renderer layout or theme, and shipping a fidelity ledger.

### Why This Matters

Mermaid supplies content and a declared direction but no coordinates, so the tempting shortcuts are to render it or to carry over its theme classes and automatic layout. Both are the failure modes the packet exists to replace: an import is an editorial redraw, not a reskin of Mermaid's renderer. The extractor also draws a strict trust boundary — it never evaluates, renders, or fetches Mermaid content, and click targets are discarded. This scenario locks the pipeline and the trust boundary: content survives, styling does not, and anything unsupported is reported verbatim instead of approximated.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `IMP-002` and confirm the expected signals without contradictory evidence.

- Objective: verify a Mermaid source is extracted into a digest, redrawn with flowchart conventions without the renderer layout or theme, and delivered with a fidelity ledger
- Real user request: `Simplify this Mermaid flowchart into something clean for our docs.`
- Prompt: `Import the first Mermaid block from docs/onboarding.md and redraw it as a clean flowchart for our docs (format html, size doc-inline, detail simplified, audience mixed). Run the extraction script, read the digest, redraw with flowchart conventions — don't copy the renderer layout — and report the fidelity ledger. Save it to docs/onboarding-flow.html.`
- Expected execution process: the agent runs `mermaid_extract.py` on the Markdown source, reads the digest (which reports `source layout: none (Mermaid is layout-free)`), sets the four dials, ignores init themes and `classDef`/`class`/`linkStyle`, redraws the flowchart on the 4px grid with orthogonal connectors, and reports the fidelity ledger.
- Expected signals: the digest header lists every fenced block with grammar and node/edge counts; theme and click-handler content are absent from the output; a decision rhombus stays a decision only in the flowchart; the output HTML is self-contained; the ledger reports the source count, drawn count, and every merge/collapse/drop.
- Desired user-visible outcome: an editorial flowchart that keeps the source meaning without inheriting Mermaid's automatic layout or styling.
- Pass/fail: PASS if the digest is produced, no renderer layout or theme classes are carried over, unsupported kinds are reported verbatim (never approximated), the ledger accounts for every change, and the output is self-contained; FAIL if the agent renders the source to SVG first, reproduces the renderer layout, carries over theme styling, or approximates an unsupported kind.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Import the first Mermaid block from docs/onboarding.md and redraw it as a clean flowchart for our docs (format html, size doc-inline, detail simplified, audience mixed). Run the extraction script, read the digest, redraw with flowchart conventions — don't copy the renderer layout — and report the fidelity ledger. Save it to docs/onboarding-flow.html.`

### Commands

1. `bash: python3 .opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py docs/onboarding.md --diagram 0`
2. `agent: Read references/import-mermaid.md, references/output-spec.md, and references/type-flowchart.md`
3. `agent: Set the four dials; discard init themes, classDef/class/linkStyle, and click targets; preserve sequence order, guards, ER cardinality, and container membership`
4. `agent: Redraw from a blank viewBox with orthogonal connectors; do not reproduce Mermaid spacing`
5. `agent: Write docs/onboarding-flow.html; run the taste gate; report the fidelity ledger`

### Expected

Step 1 prints a digest with the fenced-block list and a `source layout: none` line, and exits `0`. Step 3 keeps the flowchart meaning (decision branches, edge labels) while discarding all source styling. Step 4 produces a fresh layout. Step 5 yields a self-contained `docs/onboarding-flow.html` and a ledger naming the source count, drawn count, and every merge, collapse, or drop.

### Evidence

Capture the digest output (block list, node/edge counts, and the layout-free note), the four dials chosen, a snippet of the output HTML showing no `classDef` or theme-derived colors, the fidelity ledger, the output path `docs/onboarding-flow.html`, and the taste-gate result.

### Pass / Fail

- **Pass**: the digest was produced and read, no renderer layout or theme styling was copied, the ledger accounts for every change, and the output is self-contained.
- **Fail**: the agent rendered Mermaid to SVG, reproduced the renderer's automatic layout, carried over `classDef`/theme classes, or approximated an unsupported kind such as `pie` or `gitGraph` instead of reporting it verbatim.

### Failure Triage

1. If the output echoes Mermaid's spacing, the agent reproduced the renderer layout — start from a blank `viewBox` and lay out fresh on the 4px grid.
2. If the digest reports an unsupported kind (`pie`, `mindmap`, `gitGraph`, `quadrantChart`, `timeline`, `C4Context`, `sankey`), report the supported-kinds message verbatim and stop; never approximate it with a different type.
3. If `no fenced mermaid block found` appears, the source isn't a Mermaid file — ask for a `.mmd`/`.mermaid` file or a fenced block rather than guessing.

### Optional Supplemental Checks

Run the multi-block variant: invoke `mermaid_extract.py docs/multi.md --diagram all` and confirm one independently type-selected output per block named `<base>-<index>.html`, with adjacent blocks of different grammars never merged onto one canvas.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/import-export/mermaid-import.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `references/import-mermaid.md` | Redraw procedure, trust boundary, and edge cases |
| `references/output-spec.md` | Four dials, size presets, degrade ladder, fidelity ledger |
| `scripts/mermaid_extract.py` | IR extraction script |

---

## 5. SOURCE METADATA

- Group: IMPORT AND EXPORT
- Playbook ID: IMP-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `import-export/mermaid-import.md`
