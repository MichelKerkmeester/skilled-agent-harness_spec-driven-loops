---
title: "Feature Specification: memory db decommission"
description: "Phase parent for removing the system-spec-memory MCP database subsystem and replacing it with grep-first retrieval"
trigger_phrases:
  - "049-memory-decommission"
  - "memory db decommission"
  - "spec memory removal"
  - "grep-first retrieval"
  - "trigger index replacement"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "planner"
    recent_action: "Authored phase-parent spec and four child scope boundaries"
    next_safe_action: "Plan child 001-trigger-index-replacement"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/"
      - ".claude/mcp.json"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Delete rather than shrink the memory DB"
      - "Scope is system-spec-memory only; skill advisor untouched"
      - "Replacement is a generated trigger index plus ripgrep"
      - "Doc convention is retrofitted across active specs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: memory db decommission

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `claude/speckit-memory-db-review-3gheky` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | system-speckit/049-memory-decommission |
| **Predecessor** | 028-memory-search-intelligence |
| **Successor** | None |
| **Handoff Criteria** | Each child validates independently under `validate.sh --strict` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `system-spec-memory` MCP subsystem is a derived search index over `specs/**/*.md` that
costs 453,813 tracked lines across 1,480 files, 41 MCP tools loaded into every session, and
373 environment flags — and its own committed benchmark does not show it improving retrieval.

Three measurements drive this decommission:

1. **The channel ablation is neutral-to-negative.** `specs/system-speckit/028-memory-search-intelligence/benchmark-status.md`
   reports vector delta `+0.2556` (p=0.000002) and graph delta `+0.0944` (p=0.0117) against a
   `0.4583` baseline, with bm25 and fts5 at exactly `0.0000`. Per the harness contract at
   `mcp-server/lib/eval/ablation-framework.ts:229-230` — *"Negative means channel contributes
   positively"* — every measured channel is redundant or actively harmful on the 60-query
   golden set.
2. **The lane that carries the work is a substring match.** `exactTriggerSearch`, the one
   channel the ablation could not disable because it runs unconditionally, is a
   `LOWER(m.trigger_phrases) LIKE ?` query at `mcp-server/lib/search/hybrid-search.ts:806-817`.
   No embeddings are involved in it.
3. **Speed is not a problem the index solves.** A recursive grep across the full corpus
   (32,711 files, 38M words) returns in 0.5s.

The subsystem also fails open by design and is documented as unreliable in its own consumers
(`.opencode/agents/context.md:80`: *"the system-spec-memory daemon can flap… Treat MCP
intelligence as an optional accelerator, never a hard dependency"*), so the framework already
operates without it whenever the daemon is down.

### Purpose

Remove the subsystem outright and replace it with the two mechanisms that carry its actual
load: a generated trigger index over `trigger_phrases` frontmatter, and ripgrep over a
spec-doc corpus shaped to be grepped. No database, no daemon, no embedding provider.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Removal of `system-spec-memory`: MCP server package, 41 tools, launcher, OpenCode plugin
  and bridge, `spec-memory` hook concern, `/memory:*` commands, memory-specific `/doctor`
  routes, 373 `SPECKIT_*` flags, feature catalog, and manual-testing playbook.
- A replacement retrieval path: generated trigger index plus documented ripgrep conventions.
- Rewiring every external consumer, including `AGENTS.md` Gate 1.
- A grep-optimized spec-doc convention, enforced in templates and `validate.sh`, retrofitted
  across active spec docs.

### Out of Scope

- `system_skill_advisor` — a separate MCP server that powers Gate 2 skill routing. It shares
  only the `hf-embed` socket and is explicitly untouched.
- `system-deep-loop`'s `council-graph.sqlite` — tracked in git, serves the deep-loop state
  machine, unrelated concern.
- Archived spec docs under `z_archive/` — excluded from the retrofit.
- Rewriting the content of historical packets 026 / 027 / 028; they remain as history.

### Files to Change

Aggregate scope. Per-phase detail lives in each child plan.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-spec-kit/scripts/memory/` | Create | 001 | Trigger index generator |
| `AGENTS.md` | Modify | 002 | Gate 1 mechanism swap |
| `.opencode/commands/`, `.opencode/agents/`, `.claude/agents/` | Modify | 002 | ~167 external consumers |
| `.opencode/skills/system-spec-kit/mcp-server/` | Delete | 003 | 1,480 files / 453,813 LOC |
| `.claude/mcp.json`, `.opencode/plugins/`, `.opencode/hooks/spec-memory/` | Modify/Delete | 003 | Transport, plugin, hook |
| `.opencode/skills/system-spec-kit/templates/`, `scripts/spec/validate.sh` | Modify | 004 | Convention enforcement |
| `specs/**/*.md` (22,127 active) | Modify | 004 | Convention retrofit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-trigger-index-replacement/ | Build the generated trigger index and ripgrep retrieval conventions; prove parity against the current `LIKE`-based trigger lane before anything is removed | Complete |
| 2 | 002-memory-consumer-rewire/ | Repoint `AGENTS.md` Gate 1 and ~167 external consumer files at the new retrieval path while the old surface still exists | Complete |
| 3 | 003-spec-memory-server-removal/ | Delete the server package, MCP transport entries, plugin, bridge, hook, commands and flags | Complete |
| 4 | 004-grep-convention-doc-retrofit/ | Define and enforce the grep-optimized doc convention; retrofit 22,127 active spec docs | Complete |
| 5 | 005-ripgrep-retrieval-research/ | Research phase, complete: five-iteration deep research on ripgrep-first retrieval and trigger-index design; its ranked amendments are folded into phases 001 and 004 | Complete |
| 6 | 006-legacy-memory-surface-inventory/ | Research phase, complete: five-iteration exhaustive inventory of every surface that references or integrates the memory subsystem; its worklists are folded into phases 002 and 003 | Complete |
| 7 | 007-deep-review-remediation/ | Ten-iteration deep review of the finished packet on gpt-5.6-luna (effort max, fast tier) and the remediation of its six findings: a fail-closed trigger-index reader, closed completion rows in phases 001, 002 and 005, the retired-prefix criterion restated to its proven form, owner and checkpoint on every open decision, and the release-environment caveat | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **Ordering is load-bearing:** nothing is deleted in phase 3 until phase 1 has a proven
  replacement and phase 2 has repointed every consumer at it. Deleting earlier would leave
  Gate 1 without a mechanism.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-trigger-index-replacement | 002-memory-consumer-rewire | Generated index returns a superset of `exactTriggerSearch` results on a frozen prompt set; generator is idempotent and re-runs clean | Parity harness output; `git diff --exit-code` on a second generator run |
| 002-memory-consumer-rewire | 003-spec-memory-server-removal | Zero remaining references to `mcp__system_spec_memory__*` or the 41 tool names outside the subsystem tree | `rg` sweep returns empty outside `mcp-server/` |
| 003-spec-memory-server-removal | 004-grep-convention-doc-retrofit | Repo has no MCP memory transport, no daemon, no orphan launcher; full session boots clean | `.claude/mcp.json` inspection; clean session start; `rg` residue sweep |
| 004-grep-convention-doc-retrofit | (packet complete) | Convention enforced by `validate.sh`; retrofit applied to all 22,127 active docs with no unresolved variants | `validate.sh --recursive --strict` on the parent; retrofit residue rescan |
| 005-ripgrep-retrieval-research | 001-trigger-index-replacement, 004-grep-convention-doc-retrofit | Research phase, ran before build: the ranked amendments in `research/lineages/luna-max/research.md` are folded into the 001 and 004 specs, plans, tasks and acceptance criteria | Five iteration files on disk; amended 001 and 004 docs validate `--strict` |
| 006-legacy-memory-surface-inventory | 002-memory-consumer-rewire, 003-spec-memory-server-removal | Research phase, ran before build: the classified inventory and worklists in `research/lineages/luna-max/research.md` become the 002 rewire list and the 003 deletion list, with the preserve set honored | Five iteration files on disk; every worklist item assigned to 002 or 003 |
| 007-deep-review-remediation | (packet complete) | Review verdict CONDITIONAL with P0 0, P1 4, P2 2; every finding verified against the files, fixed or answered, and the packet validates recursively with 0 errors afterwards |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Does the retrofit change doc bodies or only frontmatter and section markers?** Phase 004
  must settle this before touching 22,127 files; a body-level rewrite is a materially larger
  and riskier job than a frontmatter/anchor normalization.
- **What replaces `memory_save`'s metadata refresh?** The canonical continuity chain is
  markdown, but `_memory.continuity` blocks are currently written through the save path.
  Phase 002 must name the replacement writer.
- **Is the `hf-embed` socket still needed after removal?** `system_skill_advisor` pins the
  same socket. Phase 003 must confirm the advisor still resolves its embedder once
  spec-memory stops spawning the shared model server.
- **Does the MCP package survive as the spec-kit engine?** Validation, the metadata refresh and the continuity writer run from modules inside `mcp-server/`, so phase 003 cannot delete the tree as one unit. The recommended amendment is to delete the engine (transport, tools, daemon, launcher, plugin, hooks, memory runtime) and keep the package; the alternative is extracting a 96-file closure that reaches into search and storage. Decided 2026-09-03: delete the engine and keep the package. Phase 003 deletes every module unreachable from the surviving entry points, the transport, the tools, the daemon, launcher, plugin, hooks, registrations and memory-only rows, and leaves validation, metadata and the continuity writer in place.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Evidence base**: `specs/system-speckit/028-memory-search-intelligence/benchmark-status.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
