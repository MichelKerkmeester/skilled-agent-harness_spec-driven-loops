---
title: "Tasks: Phase 010 — Apply the deferred plugin-doc research recommendations"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 plugin doc recs followup tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/010-plugin-doc-recs-followup"
    last_updated_at: "2026-08-22T20:12:00Z"
    last_updated_by: "claude"
    recent_action: "Resolved deferred plugin-doc items and the 007 header fix"
    next_safe_action: "None — parent phase-map refresh is the orchestrator's step"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-010-plugin-doc-recs-followup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 010 — Apply the deferred plugin-doc research recommendations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the primary-source-confirmed facts sheet in full [15m]
  - **Evidence**: each deferred item's confirmed derivation, official-docs quote, or installed-`main.js` observation read before authoring; no fact re-decided.
- [x] T002 Read 009's spec/summary and the sibling file set to mirror structure and separate resolved-here from do-not-re-apply [15m]
  - **Evidence**: 009 deferred the 2 dataview VERIFY rows, the advanced-canvas endpoint caveat, the claudian positive path, and the optional notion-bases split/version bumps; the claudian `.claude/`→`.claudian/` and write-instruction-reversal fixes are already landed and left untouched.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### dataview
- [x] T010 Correct the `file.day` "folder" wording and cite the official docs (`references/plugins/dataview/data-model.md`) [10m]
  - **Evidence**: §5 note reworded to the two confirmed triggers — a filename date (`yyyy-mm-dd`/`yyyymmdd`) or a `Date` field/inline field — citing the official Dataview "Metadata on Pages" documentation; the unreal folder trigger dropped; the field row and the guardrail bullet tightened to match. `validate_document.py` = 0 issues.
- [x] T011 Upgrade the single-line inline-field evidence with the official-docs citation (`references/plugins/dataview/data-model.md`) [5m]
  - **Evidence**: §4 rule now cites the official Dataview "Adding Metadata" documentation ("All content after the `::` is the value of the field until the next line break."); the claim is unchanged (single-line; multiline via YAML `|`). `validate_document.py` = 0 issues.

### advanced-canvas
- [x] T020 Tighten the interdimensional-edge endpoint caveat across all four reference docs and the feature-catalog card [30m]
  - **Evidence**: `advanced-canvas.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`, and `feature-catalog/plugins/advanced-canvas.md` reworded from "inferred" to "confirmed from the plugin's own serialization code, only not yet byte-verified against a captured `.canvas` file (none exists — the vault is read-only)"; the documented `portalId-nodeId` encoding is unchanged; a residual-grep shows no stale "inferred"/"confirm against a real portal file" wording. `validate_document.py` = 0 issues on all five.

### claudian
- [x] T030 Resolve the positive Claude-provider MCP-path `VERIFY` to a definitive negative + explicit UNKNOWN [25m]
  - **Evidence**: `data-model.md` §5 now states Claudian authors no on-disk MCP file for Claude Code — it removes the legacy `.claude/mcp.json` at init and passes an in-memory `mcpServers` array (empty by default), confirmed from installed `realclaudian` v2.2.4 — with the positive add-a-server surface stated as UNKNOWN (no path invented); the §1 storage-table row and the guardrail bullet updated; `workflows.md` §5 and `feature-catalog/plugins/claudian.md` mirror it. The per-CLI schema `VERIFY` tags (Codex/OpenCode/Grok/Pi) are preserved. `validate_document.py` = 0 issues.

### notion-bases
- [x] T040 Record the P2-7 advanced-config split as an explicit not-split decision [5m]
  - **Evidence**: documented in `spec.md` §9 and `implementation-summary.md` — `data-model.md` stays cohesive; splitting would fragment the `ViewConfig` surface from its schema context and add a hub leaf for marginal gain.
- [x] T041 Bump the `version:` frontmatter on the phase-008 calendar-recipe file (`references/plugins/notion-bases/workflows.md`) [5m]
  - **Evidence**: `version: "0.1.0.0"` → `"0.1.1.0"`; scoped to the one notion-bases doc changed without a bump; `validate_document.py` = 0 issues.

### 007 header fix
- [x] T050 Rename `007/tasks.md` phase headers to canonical `Setup`/`Implementation`, refresh 007 metadata, reconcile continuity [15m]
  - **Evidence**: `## Phase 1: Map`→`## Phase 1: Setup`, `## Phase 2: Remove`→`## Phase 2: Implementation` (content preserved); `generate-description.js` + `backfill-graph-metadata.js` re-run; `007/implementation-summary.md` continuity `last_updated_at` reconciled so `CONTINUITY_FRESHNESS` passes after the metadata refresh advanced `last_save_at`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T060 `validate_document.py` on every changed shipped doc — 0 issues [10m]
  - **Evidence**: all 8 changed reference docs (`--type reference`) and 2 catalog cards (`--type feature_catalog`) report `Total issues: 0`.
- [x] T061 `validate.sh 007-excalidraw-deprecation --strict` = Errors:0 RESULT: PASSED [5m]
  - **Evidence**: `TEMPLATE_HEADERS` passes (5 files match); `CONTINUITY_FRESHNESS` passes; Summary Errors:0 Warnings:0; exit 0.
- [x] T062 Author this phase package; run `generate-description.js` + `backfill-graph-metadata.js` [15m]
  - **Evidence**: this folder authored; both generation scripts run on the folder.
- [x] T063 `validate.sh <this-folder> --strict` = Errors:0 [5m]
  - **Evidence**: recorded in `implementation-summary.md` Verification.
- [x] T064 Confirm `git status` scoped to the allowed surfaces only [5m]
  - **Evidence**: writes limited to the named `mcp-obsidian/` docs, this phase folder, and `007`'s tasks/metadata/continuity; no deep-loop/runtime/research/vault path touched; no `.canvas` created.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every deferred plugin-doc item resolved with confirmed evidence
- [x] The 007 `TEMPLATE_HEADERS` error cleared; `validate.sh 007 --strict` = Errors:0
- [x] Every changed shipped doc passes `validate_document.py` (0 issues)
- [x] The notion-bases P2-7 split resolved as an explicit not-split decision
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../009-apply-plugin-doc-recs/`
- **Next phase**: None — closes the deferred plugin-doc items
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
