---
title: "EXPORT-001 -- Read-Only Export To An Explicit Path"
description: "This scenario validates read-only export for `EXPORT-001`. It focuses on writing to an explicit operator-chosen output path and never silently overwriting an existing file."
---

# EXPORT-001 -- Read-Only Export To An Explicit Path

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `EXPORT-001`.

---

## 1. OVERVIEW

This scenario validates read-only export for `EXPORT-001`. It focuses on confirming a read-only export (for example `figma-ds-cli extract` / `export` / `export-jsx`) writes to an explicit output path the operator chose and never silently overwrites an existing file.

### Why This Matters

Exports are read-only against the Figma document but they write local files, so they carry the local-export rule: an explicit output path and no silent overwrite. The failure mode this guards against is an export with no explicit path, or one that silently clobbers an existing file. An existing-path collision must be surfaced, not papered over.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `EXPORT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm export requires an explicit output path and does not overwrite an existing file silently
- Real user request: `Export the current selection as SVG to a file I name.`
- Prompt: `Export the current selection as SVG to a file I name.`
- Expected execution process: pick an explicit, non-existing output path; run the export to that path; if the path exists, the agent refuses or asks before overwriting
- Expected signals: the file is written to the explicit path; no Figma document mutation occurs; an existing-path collision is surfaced rather than silently clobbered
- Desired user-visible outcome: the agent reports the export was written to the named path and that nothing was overwritten
- Pass/fail: PASS if export wrote to the explicit path AND no Figma write occurred AND an existing-path collision was surfaced; FAIL if export wrote with no explicit path OR silently overwrote an existing file OR mutated the Figma document

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Export stays local.
3. Execute the deterministic steps exactly as written, including the overwrite-collision re-run.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Choose an explicit output path in a throwaway location that does not already contain a file of that name. Verify the exact output flag via `figma-ds-cli export --help`.

1. choose explicit non-existing path `<out>`  # -> explicit path chosen
2. `figma-ds-cli export ... --out <out>` (verify flag via `--help`)  # -> file written to `<out>`, no Figma mutation
3. re-run to `<out>` and confirm overwrite is refused/prompted  # -> collision surfaced, not silently clobbered

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EXPORT-001 | Read-only export | Verify export targets an explicit path and never silently overwrites | `Export the current selection as SVG to a file I name.` | 1. choose explicit non-existing path `<out>` -> 2. `figma-ds-cli export ... --out <out>` (verify flag via `--help`) -> 3. re-run to `<out>` and confirm overwrite is refused/prompted | Step 1: explicit path chosen. Step 2: file written to `<out>`, no Figma mutation. Step 3: collision surfaced, not silently clobbered | Transcript of the export, the written artifact path, and the overwrite-collision result | PASS if export wrote to the explicit path AND no Figma write occurred AND an existing-path collision was surfaced. FAIL if export wrote with no explicit path OR silently overwrote an existing file OR mutated the Figma document | 1. Confirm an explicit `--out`/path was passed (verify exact flag via `--help`). 2. Confirm the path did not pre-exist for the first write. 3. Confirm the re-run did not silently overwrite. |

### Optional Supplemental Checks

The same explicit-output, no-overwrite rule governs `figma-ds-cli extract` (which writes a `DESIGN.md` and may auto-split into a `DESIGN-structure/` folder). Confirm extract also requires an explicit output path and handles the multi-file output without clobbering.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/07--export/export.md` | Feature-catalog source describing the explicit-output, no-overwrite rule |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/figma_cli_reference.md` | Export verb surface and output flags |
| `../../references/tool_surface.md` | READ-ONLY (explicit output) classification |

---

## 5. SOURCE METADATA

- Group: Read-Only Access
- Playbook ID: EXPORT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--read-only/read-only-export.md`
