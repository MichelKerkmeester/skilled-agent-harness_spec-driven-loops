---
title: "Skill Advisor Graph: Align canonical skill id to folder name"
description: "Renamed the advisor graph skill id from skill_advisor to system-skill-advisor across source metadata, compiler injection, runtime health allowlist, generated JSON and SQLite caches, and all inbound adjacency references. Pinned the single accepted parity drift row and kept all public MCP tool ids stable."
trigger_phrases:
  - "skill id field rename"
  - "system-skill-advisor graph id"
  - "align skill_advisor graph id"
  - "advisor graph health fix"
  - "parity drift rr-iter3-146"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/010-skill-id-field-rename` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The advisor skill had been extracted to `.opencode/skills/system-skill-advisor/` but its graph metadata and compiled graph still carried `skill_advisor` as the skill id. The graph compiler enforces that `skill_id` must match the containing folder name, so the graph-health Vitest failed and the inventory parity check reported a stale node until the rename was applied end-to-end.

The rename was threaded through the source metadata file, the compiler injection path, the runtime health graph-only allowlist, the generated JSON graph cache, the tracked SQLite graph cache, and the inbound adjacency edges in the `sk-code`, `mcp-coco-index`, `system-code-graph`, and `system-spec-kit` skill metadata files. Parity tests were not skipped: they now pin the single accepted drift row `rr-iter3-146` while keeping all graph-health assertions active. All public MCP tool ids and the Python module filename `skill_advisor.py` were left unchanged.

### Added

None.

### Changed

- `system-skill-advisor/graph-metadata.json` now carries `system-skill-advisor` as the canonical skill id, matching the extracted folder name.
- `skill_graph_compiler.py` injection path reads from the extracted metadata location and uses the new id.
- `skill_advisor.py` graph-only allowlist updated to tolerate `system-skill-advisor` instead of `skill_advisor`.
- Generated `skill-graph.json` and the tracked `skill-graph.sqlite` rebuilt to reflect the renamed node and dropped stale `skill_advisor` entries.
- Adjacent `graph-metadata.json` files in `sk-code`, `mcp-coco-index`, `system-code-graph`, and `system-spec-kit` retargeted their inbound prerequisite or reciprocal edges to `system-skill-advisor`.
- Parity test baselines in `advisor-corpus-parity.vitest.ts`, `python-ts-parity.vitest.ts`, and `advisor-graph-health.vitest.ts` updated to pin current numeric baselines and the accepted regression id `rr-iter3-146`.

### Fixed

- Graph-health Vitest failure caused by a mismatch between the skill folder name and the stored graph skill id.
- Runtime health reporting a stale `skill_advisor` node after package extraction.
- Inventory parity check showing out-of-sync state due to the leftover node reference.

### Verification

| Check | Result |
|-------|--------|
| Compiler export | PASS: `VALIDATION PASSED`, 19 skills compiled. |
| Python health | PASS: `status: ok`, inventory parity `in_sync`, no `skill_advisor` node. |
| Graph-health Vitest | PASS: 2 tests passed. |
| Parity Vitest | PASS: 3 tests passed. Accepted regression id `rr-iter3-146`. |
| Full advisor Vitest | PASS: 40 files passed, 291 tests passed. |
| Strict validation | PASS: packet `010`, parent `009`, and lane parent `006` all passed with 0 errors and 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Modified | Skill id renamed from `skill_advisor` to `system-skill-advisor`. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py` | Modified | Compiler injection reads the extracted metadata path and uses the new skill id. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modified | Runtime graph-only allowlist follows the new id. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` | Regenerated | JSON graph cache rebuilt with the renamed node. |
| `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` | Regenerated | SQLite cache rebuilt. Stale `skill_advisor` node removed. |
| `.opencode/skills/sk-code/graph-metadata.json` | Modified | Inbound prerequisite edge retargeted to `system-skill-advisor`. |
| `.opencode/skills/system-code-graph/graph-metadata.json` | Modified | Sibling edge weight normalized for validator symmetry. |
| `.opencode/skills/system-spec-kit/graph-metadata.json` | Modified | Reciprocal topology edges added for validator symmetry. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-graph-health.vitest.ts` | Modified | Graph-health expectations pinned to renamed id. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-corpus-parity.vitest.ts` | Modified | Parity baseline updated to accepted drift row `rr-iter3-146`. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/python-ts-parity.vitest.ts` | Modified | Python-TS parity baseline updated to current numeric values. |

### Follow-Ups

- The parity baseline accepts one TS-vs-Python drift row: `rr-iter3-146`. Monitor this drift in subsequent parity runs to confirm it does not widen.
- The `mcp-coco-index` skill was subsequently removed from the repository. Verify no dangling references to its former adjacency edge remain in the skill graph after the removal.
