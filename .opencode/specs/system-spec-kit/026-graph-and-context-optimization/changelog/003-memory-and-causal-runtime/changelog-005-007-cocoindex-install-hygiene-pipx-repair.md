---
title: "005/007 CocoIndex Install Hygiene Pipx Repair Scaffold"
description: "Open repair packet for stale CocoIndex pipx executable alignment after operator-side write access is available."
trigger_phrases:
  - "005/007 pipx repair"
  - "CocoIndex install hygiene repair"
  - "stale ccc executable"
  - "pipx editable direct_url"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/007-cocoindex-install-hygiene-pipx-repair` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality`

### Summary

This phase splits the unresolved CocoIndex pipx repair out of the completed install-hygiene diagnosis. The predecessor found that the `ccc` executable was stale and non-editable, while the local MCP venv already pointed at editable source.

No pipx repair was performed in this scaffold. The packet blocks future implementation on operator-side pipx write access, then requires editable `direct_url.json` evidence and module import checks before any install-guide or benchmark claims can be made.

### Added

- Packet scaffold for repairing the stale pipx-installed `ccc` executable after operator-side write access is available.
- Planned verification target for editable pipx metadata and imports of modules missing from the stale executable environment.
- Guardrail that install-guide or benchmark updates must wait for executable stack alignment evidence.

### Changed

- None. No repo source, install guide, benchmark harness or operator-side pipx environment was changed by this scaffold.

### Fixed

- None. The stale pipx executable remains an open repair until the operator-side write blocker is cleared.

### Verification

| Check | Result |
|---|---|
| Implementation status | No repair shipped. Packet artifacts report completion at 0 percent. |
| Blocker status | Operator-side pipx config and write access required before repair. |
| Planned editable check | Pipx `direct_url.json` editable proof recorded as future verification only. |
| Planned executable check | `ccc --version` and module import checks recorded as future verification only. |
| Strict packet validation | No explicit completed validation result recorded in packet artifacts. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Added | Defined the open pipx repair scope, blocker, acceptance criteria and planned targets. |
| `plan.md` | Added | Planned predecessor review, editable pipx repair, executable verification, evidence-gated docs work and closeout. |
| `tasks.md` | Added | Listed pending repair, import-check and validation tasks. |
| `implementation-summary.md` | Added | Captured the pre-implementation scaffold, planned repair targets and known limitations. |
| `description.json` | Added | Added packet metadata for discovery. |
| `graph-metadata.json` | Added | Added graph metadata for packet traversal. |

### Follow-Ups

- Clear operator-side pipx write access before attempting the repair.
- Run the editable pipx repair only after logs, venv writes and entry-point updates are permitted.
- Verify `direct_url.json`, `ccc --version` and the missing module imports before changing docs or benchmarks.
- Record repair evidence in the packet summary, then run strict packet validation.
