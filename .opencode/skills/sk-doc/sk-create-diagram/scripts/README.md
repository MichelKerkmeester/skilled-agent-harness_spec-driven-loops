---
title: "sk-create-diagram scripts: Code README"
description: "Code-facing README for the draw.io and Mermaid IR extractors plus the ASCII flowchart validator."
trigger_phrases:
  - "sk-create-diagram scripts"
  - "drawio extractor"
  - "mermaid extractor"
  - "flowchart validator"
---

# sk-create-diagram scripts

The two intermediate-representation (IR) extractors behind the import redraw flow and the validator behind the `ascii-markdown` flowchart format.

---

## 1. OVERVIEW

This folder owns the deterministic half of `sk-create-diagram`'s import flow: two stdlib-only Python CLIs that decode a `.drawio` or Mermaid source into a normalized IR — nodes, edges, containers, hubs, cycles, budget flags — as a compact Markdown digest (or full JSON). It also owns the shell validator required before delivering an `ascii-markdown` flowchart. Neither extractor makes a design decision; the agent reads the digest, picks a diagram type and detail level, and redraws from scratch in the packet's design system. All scripts run locally with no network access and never mutate the source file they read.

Behavior details (per-type routing rules, the four output dials) live in [`../references/import-export/`](../references/import-export/) and [`../references/foundations/output-spec.md`](../references/foundations/output-spec.md); this README stays navigational.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 3 |
| CLI entrypoints | 3 |
| Test suites | 0 (no committed regression suite yet) |

---

## 2. QUICK START

Run from the packet root:

```bash
python3 scripts/drawio_extract.py diagram.drawio --page 1
python3 scripts/mermaid_extract.py diagram.mmd --diagram 1
bash scripts/validate-flowchart.sh path/to/flowchart.md
```

Both print a Markdown digest to stdout by default. Add `--json` for the full IR, or `--out <path>` to write the digest to a file instead of stdout.

---

## 3. STRUCTURE

| Path | Purpose |
|---|---|
| `drawio_extract.py` | Decodes raw XML, deflate+base64, and PNG/SVG-embedded `mxfile` draw.io sources into the IR. |
| `mermaid_extract.py` | Parses `flowchart`/`graph`, `sequenceDiagram`, `stateDiagram-v2`, and `erDiagram` Mermaid text into the IR. |
| `validate-flowchart.sh` | Checks box-width consistency, connectors, decision labels, nesting depth, and markdown flowchart size. Exit `0` passes, including warning-only runs; exit `1` blocks delivery. |

---

## 4. CLI ENTRYPOINTS

- **`drawio_extract.py`** — Flattens a draw.io `mxGraphModel` into absolute-positioned nodes and edges, and reports hub degrees, container structure, cycle detection, and budget flags. Accepts `.drawio`, raw XML, `.drawio.png`, or `.drawio.svg`.
- **`mermaid_extract.py`** — Parses bounded Mermaid text under a strict trust boundary: it never evaluates, renders, fetches, or executes Mermaid, JavaScript, URLs, directives, or label content. Click targets and styling are counted and discarded; labels are emitted only as inert text.

Common flags on both: `--page`/`--diagram` (select which page/diagram when the source has more than one), `--json` (emit the full IR instead of the digest), `--max-rows N` (digest table length, default 40), `--out PATH` (write to a file instead of stdout).

---

## 5. EXIT CODES

The two extractors share the following two-code contract:

| Code | Meaning |
|---:|---|
| 0 | OK — digest or JSON written |
| 2 | Unreadable file, unsupported/malformed input, a selector matching nothing, or a node/edge limit exceeded |

The flowchart validator uses its own two-code delivery contract:

| Code | Meaning |
|---:|---|
| 0 | Validation passed, including warning-only runs |
| 1 | Validation failed and blocks delivery |

---

## 6. TRUST AND SAFETY CONTRACT

- **Never mutates the source.** Both scripts open the input read-only and only ever write to `--out` or stdout.
- **No network access.** Every path is local; nothing is fetched.
- **Untrusted content stays inert.** Labels, links, tooltips, and metadata from the source are treated as content only — the extractors never follow them as instructions, and `mermaid_extract.py` never evaluates the Mermaid text as code.
- **Node/edge ceilings fail closed.** `MAX_NODES`/`MAX_EDGES` limits exit 2 rather than silently truncating output.

---

## 7. VALIDATION / TESTS

No committed regression suite exists for this folder yet. Verify a change compiles and both entrypoints still resolve their exit-code contract:

```bash
python3 -m py_compile scripts/drawio_extract.py scripts/mermaid_extract.py
python3 scripts/drawio_extract.py --help
python3 scripts/mermaid_extract.py --help
bash scripts/validate-flowchart.sh assets/ascii-patterns/simple-workflow.md
```

---

## 8. RELATED

| Document | Purpose |
|---|---|
| [`../SKILL.md`](../SKILL.md) | Owning packet: runtime routing and workflow boundaries. |
| [`../references/import-export/import-drawio.md`](../references/import-export/import-drawio.md) | The draw.io redraw procedure this extractor feeds. |
| [`../references/import-export/import-mermaid.md`](../references/import-export/import-mermaid.md) | The Mermaid redraw procedure this extractor feeds. |
| [`../../../sk-code/sk-code-opencode/SKILL.md`](../../../sk-code/sk-code-opencode/SKILL.md) | OpenCode coding standard these scripts conform to. |
