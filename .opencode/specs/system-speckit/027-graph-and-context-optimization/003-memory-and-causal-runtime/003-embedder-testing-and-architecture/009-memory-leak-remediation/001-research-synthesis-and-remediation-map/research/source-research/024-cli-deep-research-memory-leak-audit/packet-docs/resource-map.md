---
title: "Resource Map: 024 CLI Deep Research Memory Leak Audit"
description: "Path ledger for the 024 memory-leak research packet and the target skills to be analyzed by deep research."
trigger_phrases:
  - "024 CLI memory leak resource map"
  - "memory leak audit paths"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit"
    last_updated_at: "2026-05-22T07:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Updated resource map after continuation synthesis."
    next_safe_action: "Open follow-up packets."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0240240240240240240240240240240240240240240240240240240240240240"
      session_id: "024-cli-memory-leak-audit-intake"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Resource Map: 024 CLI Deep Research Memory Leak Audit

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 27
- **By category**: Documents=2, Skills=5, Specs=8, Research=12
- **Missing on disk**: 0
- **Scope**: charter docs, completed research artifacts, and target source surfaces
- **Generated**: 2026-05-22T07:20:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed` · `Planned`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/commands/spec_kit/deep-research.md` | Cited | OK | Command contract for executor flags and PRE-BOUND SETUP ANSWERS. |
| `research/research.md` | Created | OK | Final synthesis, matrix, remediation order, downgrade notes, and references. |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/` | Planned | OK | Primary research target for CocoIndex search, daemon, indexing, rerank, and sidecar lifecycle risks. |
| `.opencode/skills/system-code-graph/` | Planned | OK | Primary research target for graph scan/query/apply, cache, SQLite, and process lifecycle risks. |
| `.opencode/skills/deep-research/` | Cited | OK | Workflow constraints and state-machine discipline for the research loop. |
| `.opencode/skills/cli-claude-code/` | Cited | OK | Lane A executor rules and cleanup guardrails. |
| `.opencode/skills/cli-codex/` | Cited | OK | Lane B executor rules and cleanup guardrails. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/spec.md` | Created | OK | Research charter and acceptance criteria. |
| `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/plan.md` | Created | OK | Execution plan, safety gates, and lane sequencing. |
| `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/tasks.md` | Created | OK | Setup, lane execution, synthesis, and validation task list. |
| `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/checklist.md` | Created | OK | Research verification checklist. |
| `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/decision-record.md` | Created | OK | ADRs for sequential lanes and memory-pressure telemetry. |
| `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/implementation-summary.md` | Updated | OK | Current packet state; fifteen iterations complete and remediation remains follow-up work. |
| `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/description.json` | Created | OK | Discovery metadata for the new phase. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:research -->
## 7. Research Artifacts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `research/deep-research-config.json` | Created | OK | Loop configuration and executor schedule. |
| `research/deep-research-state.jsonl` | Updated | OK | Append-only 15-iteration state log. |
| `research/deep-research-strategy.md` | Updated | OK | Reducer-owned strategy and next-focus state. |
| `research/deep-research-dashboard.md` | Updated | OK | Reducer-owned dashboard; final reducer reported 15 iterations and 0 corruption. |
| `research/findings-registry.json` | Updated | OK | Reducer-owned findings registry. |
| `research/iterations/` | Created | OK | Iteration narratives 001-015. |
| `research/deltas/` | Created | OK | Iteration delta JSONL files 001-015. |
| `research/logs/` | Created | OK | CLI dispatch logs plus native runtime measurement log. |
| `research/resource-map.md` | Created | OK | Research-local artifact ledger. |
| `research/research.md` | Created | OK | Final synthesis report. |
<!-- /ANCHOR:research -->
