---
title: "IMP-001 -- draw.io import"
description: "This scenario validates draw.io import for `IMP-001`. It focuses on extracting a .drawio source into a digest, setting the four dials, redrawing rather than converting, and shipping a fidelity ledger."
version: 1.0.0.0
---

# IMP-001 -- draw.io import

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `IMP-001`.

---

## 1. OVERVIEW

This scenario validates draw.io import for `IMP-001`. It focuses on extracting a `.drawio` source into a digest, setting the four dials, redrawing rather than converting, and shipping a fidelity ledger.

### Why This Matters

Most `.drawio` files are deflate+base64 payloads that are unreadable by eye, and even readable ones are ten times more XML than signal. The correct path is to extract an intermediate representation with `drawio_extract.py`, treat every source label and link as untrusted data, set the four dials before drawing, and redraw — never convert — into the design system. The fidelity ledger is the contract that keeps an import honest: the user knows the source and will notice anything silently dropped. This scenario locks that full pipeline so an import never degrades into a reskinned wiring dump.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `IMP-001` and confirm the expected signals without contradictory evidence.

- Objective: verify a `.drawio` source is extracted, read as a digest, redrawn at the four dials, and delivered with a fidelity ledger and an unchanged source
- Real user request: `Here's our system diagram from draw.io — make it presentable for a blog post.`
- Prompt: `Import docs/system.drawio and redraw it as an editorial architecture diagram for a blog post (format html, size doc-inline, detail balanced, audience mixed). Run the extraction script, read the digest, set the four dials, redraw with the type conventions, and report the fidelity ledger. Save it to docs/system-redrawn.html.`
- Expected execution process: the agent runs `drawio_extract.py` on the source, reads the Markdown digest (never the raw file), sets format/size/detail/audience from `references/foundations/output-spec.md`, picks the target type from the digest signals, discards source coordinates/colors/shape quirks, redraws on the 4px grid with orthogonal connectors, and reports the fidelity ledger.
- Expected signals: the digest prints node/edge tables with geometry, hubs, container structure, and a `budget:` line; source fills map to semantic treatments (blue → white/ink, red → dashed optional); the output HTML is self-contained; the fidelity ledger lists every merge, collapse, and drop; the source file checksum is identical before and after.
- Desired user-visible outcome: a fresh editorial layout of the source content plus an honest account of what changed.
- Pass/fail: PASS if the digest is produced, the four dials are set before drawing, the ledger accounts for every source component, the output HTML is self-contained, and the source is byte-unchanged; FAIL if the agent reads the raw file instead of the digest, renders or converts the source layout, drops content without a ledger entry, or mutates the source.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Import docs/system.drawio and redraw it as an editorial architecture diagram for a blog post (format html, size doc-inline, detail balanced, audience mixed). Run the extraction script, read the digest, set the four dials, redraw with the type conventions, and report the fidelity ledger. Save it to docs/system-redrawn.html.`

### Commands

1. `bash: shasum docs/system.drawio` (capture the before-checksum)
2. `bash: python3 .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py docs/system.drawio --page 0`
3. `agent: Read references/import-export/import-drawio.md, references/foundations/output-spec.md, and the matching references/types/type-*.md`
4. `agent: Set the four dials (format html, size doc-inline, detail balanced, audience mixed); build the semantic model; redraw on the 4px grid; reroute every connector orthogonally`
5. `agent: Write docs/system-redrawn.html; run the taste gate; report the fidelity ledger`
6. `bash: shasum docs/system.drawio` (capture the after-checksum; must match the before value)

### Expected

Step 2 prints a Markdown digest with node/edge tables, hub degrees, container structure, and a `budget:` line, and exits `0`. Step 4 discards source coordinates and colors in favor of fresh layout and semantic treatments. Step 5 produces a self-contained `docs/system-redrawn.html` and a ledger stating the source count, drawn count, and every merge/collapse/drop. Step 6 shows identical checksums, proving the source was never mutated.

### Evidence

Capture the before/after checksums, the digest output (header and a node/edge excerpt), the four dials chosen, the fidelity ledger (source count → drawn count, with each drop named), the output path `docs/system-redrawn.html`, and the taste-gate result.

### Pass / Fail

- **Pass**: the digest was produced and read, the four dials were set before drawing, the ledger accounts for every dropped or merged component, the output is self-contained, and the source checksum is unchanged.
- **Fail**: the agent read or rendered the raw source instead of the digest, content was dropped without a ledger entry, the source checksum changed, or the extractor exit code 2 message was ignored instead of reported verbatim.

### Failure Triage

1. Confirm Python 3.9+ is on `PATH` and the source file is a real `.drawio` (raw XML, deflate+base64, or PNG/SVG-embedded `mxfile`); an image-only or encrypted export prints `0 nodes`.
2. If the extractor exits `2`, report its message verbatim — it names the actual problem; do not fall back to reading the raw file.
3. If the ledger is missing entries, re-run step 2 and diff the digest node list against the drawn HTML node list, then add the missing ledger rows.

### Optional Supplemental Checks

Run the multi-page variant: invoke `drawio_extract.py docs/multi.drawio --page all` and confirm one independently type-selected HTML file per page named `<base>-<page-name>.html`, with pages never merged into one canvas.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/import-export/drawio-import.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `references/import-export/import-drawio.md` | Redraw procedure, dials, and edge cases |
| `references/foundations/output-spec.md` | Four dials, size presets, degrade ladder, fidelity ledger |
| `scripts/drawio_extract.py` | IR extraction script |

---

## 5. SOURCE METADATA

- Group: IMPORT AND EXPORT
- Playbook ID: IMP-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `import-export/drawio-import.md`
