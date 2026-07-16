---
title: "Resource Map: Phase A 3-folder README PoC"
description: "Enumerates the 3 target folders, their pre-existing state, file inventory, and the bundle/output paths."
trigger_phrases:
  - "035 resource map"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/007-docs-and-readmes/003-code-folder-readmes-poc"
    last_updated_at: "2026-05-15T08:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Mapped 3 target folders with file inventory snapshot"
    next_safe_action: "Pass 1 dispatch"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/"
      - ".opencode/skills/system-code-graph/mcp_server/core/"
      - ".opencode/skills/system-code-graph/mcp_server/plugin_bridges/"
    session_dedup:
      fingerprint: "sha256:4c343bc54d411aa3e710e3b52170e7d0e85abb473bc7168276402a7cf664ab64"
      session_id: "035-resource-map"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: Phase A 3-Folder README PoC

> Authoritative scope for Phase A. Three target folders under `.opencode/skills/system-code-graph/mcp_server/`. Each maps to one context bundle + one new README.

---

## In-Scope Folders

| # | Folder (relative to repo root) | Existing README? | File inventory snapshot | Context bundle output | README output |
|---|-------------------------------|------------------|--------------------------|------------------------|----------------|
| 1 | `.opencode/skills/system-code-graph/mcp_server/` | NO | 4 `.ts` + 2 `.js` (index, tool-schemas, etc.) — the root package barrel | `research/context-bundles/mcp_server-root.json` | `mcp_server/README.md` |
| 2 | `.opencode/skills/system-code-graph/mcp_server/core/` | NO | 1 `.ts` (verified at scaffold time) | `research/context-bundles/core.json` | `mcp_server/core/README.md` |
| 3 | `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/` | NO | TBD via Pass 1 inventory | `research/context-bundles/plugin_bridges.json` | `mcp_server/plugin_bridges/README.md` |

---

## Out-of-Scope (Folders Under system-code-graph)

| Folder | Reason |
|--------|--------|
| `mcp_server/dist/` | Gitignored build output |
| `mcp_server/handlers/` | Already ships sk-doc README (7.4 KB) |
| `mcp_server/lib/` | Already ships sk-doc README (10.8 KB) |
| `mcp_server/lib/utils/` | Already ships sk-doc README (3.9 KB) |
| `mcp_server/tests/` | Already ships sk-doc README (6 KB) |
| `mcp_server/stress_test/code-graph/` | Already ships sk-doc README (5.5 KB) |
| `mcp_server/tools/` | Already ships sk-doc README (4 KB) |

---

## Reference Files (Read-Only Inputs for Pass 2)

| Resource | Path | Role |
|----------|------|------|
| sk-doc CODE template | `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | Section structure + anchor IDs + frontmatter shape |
| HVR rules | `.opencode/skills/sk-doc/references/global/hvr_rules.md` | Voice gate: no em dashes, banned-phrase list, hedging deductions |
| Exemplar README (full scaffold) | `.opencode/skills/system-spec-kit/mcp_server/README.md` | 9-section pattern with all anchored sections |
| Exemplar README (compact variant) | `.opencode/skills/system-spec-kit/mcp_server/utils/README.md` | Tight 9-section pattern; better fit for `core/` (single-file folder) |

---

## Pipeline Outputs

| Stage | Artifact | Validation |
|-------|----------|------------|
| Pass 1 (cli-devin) | 3 JSON bundles in `research/context-bundles/` | Each ≥ 1500 bytes; required keys present |
| Pass 2 (cli-opencode) | 3 `README.md` files in target folders | Each ≥ 1000 bytes; 4 mandatory anchors; valid frontmatter |
| Pass 3 (validation) | `validate_document.py` exit 0 × 3 + packet strict-validate exit 0 | Test commands documented in checklist.md |
