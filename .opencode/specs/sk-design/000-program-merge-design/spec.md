---
title: "Spec: Merge sk-design 012–018 into one multi-phased 012 program parent"
description: "Design spec for consolidating the eight sibling sk-design packets (012–018, two 016s, ~40 nested packets) into ONE multi-phased sk-design/012 parent organized into five themed phases, with history-preserving git-mv moves, regenerated metadata, updated cross-refs, a rewritten historic-context root, and a program retrospective. This is the temporary planning packet a GPT-5.6-SOL agent run executes."
trigger_phrases:
  - "sk-design 012 program merge design"
  - "merge sk-design 012 through 018 multi-phased parent"
  - "sk-design program consolidation retrospective"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/000-program-merge-design"
    last_updated_at: "2026-07-22T15:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Aligned spec to Level 3 template"
    next_safe_action: "Operator reviews open decisions"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/000-program-merge-design/decision-record.md"
      - ".opencode/specs/sk-design/000-program-merge-design/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-000-merge-design-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Merge sk-design 012–018 into one multi-phased 012 program parent

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Eight sibling `sk-design` packets — `012` (already a 10-child phase parent), `013`, `014`, `015`, two `016`s, `017`, `018`, totaling ~40 nested packets — record one continuous body of work but sit as flat siblings with a duplicate `016` number and no unifying narrative. This packet designs their consolidation into **one multi-phased `sk-design/012` "design program" parent** organized into **five themed phases**, executed by GPT-5.6-SOL-medium-fast agents with history-preserving `git mv`, regenerated metadata, rewritten cross-references, a historic-context root, and a program retrospective. It is a large but mostly-mechanical, worktree-isolated, reversible reorganization.

**Key Decisions**: D1 full thematic regroup, D2 delete 000 after merge, D3 five thematic phase names (see `decision-record.md`).

**Critical Dependencies**: A clean v4 tree (recovered this session) and the corrupting memory daemon staying stopped for the whole merge (see `system-speckit/031`).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | GPT-5.6-SOL medium, fast (cli-codex / cli-opencode) for the doing; orchestrator verifies |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design program's history is scattered across 8 top-level packets with a **duplicate `016`** (`016-hallmark-adoption` + `016-session-shipped-work-review`), inconsistent grouping (research, build, review, and hallmark work interleaved across `012`–`018`), and no single entry point that reads as the program's story. A reader cannot see what the program set out to do, what shipped, or what remains.

### Purpose
Consolidate everything under one multi-phased `012` parent grouped into coherent themed phases, so the tree reads as the historic record of the sk-design program, and produce a retrospective surfacing missed/planned work and opportunities. Preserve every packet's content and git history; only paths, metadata, cross-refs, and the narrative roots change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-home all ~40 packets from `sk-design/012–018` into `sk-design/012/<theme>/…` via `git mv`.
- Resolve the duplicate `016`; regenerate all `description.json` + `graph-metadata.json`.
- Update every moved packet's `packet_pointer` and inter-packet cross-references.
- Author 5 themed phase-parent lean-trios + rewrite the `012` root as the program's historic-context narrative.
- Produce a program `retrospective.md` (shipped / planned-but-missed / opportunities).

### Out of Scope
- Any change to the *content* of shipped work (styles library code, interface commands, runtime) — this is a spec-folder reorganization only.
- Re-running the merged work or altering verdicts/results inside the moved packets.
- The memory-daemon corruption/perf fixes (own packet: `system-speckit/031`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/sk-design/012–018/**` | Move | ~40 packets re-homed under one multi-phased `012` via `git mv` |
| `.opencode/specs/sk-design/012/**/description.json` + `graph-metadata.json` | Regenerate | Metadata refreshed for every moved folder + new theme parents |
| `.opencode/specs/sk-design/012/**/*.md` frontmatter | Modify | `packet_pointer` + cross-ref paths rewritten to new locations |
| `.opencode/specs/sk-design/012/retrospective.md` | Create | Program retrospective (shipped / planned-but-missed / opportunities) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Tree clean at v4 before start; daemon stopped throughout | `git status` clean of daemon drift; 0 context-server writers during the run |
| REQ-002 | Every move via `git mv` (history preserved) | `git log --follow` returns full history on sampled moved files |
| REQ-003 | No content loss | content-diff of every moved doc vs its pre-merge v4 blob = identical prose (only path/pointer/cross-ref edits differ) |
| REQ-004 | All metadata regenerated, parents last | every folder has valid `description.json` + `graph-metadata.json`; `children_ids` correct |
| REQ-005 | `validate.sh --recursive --strict` Errors:0 across the merged `012` | exit shows Errors:0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Every moved packet's `packet_pointer` updated to its new path | grep finds 0 stale pointers |
| REQ-007 | Inter-packet cross-references rewritten (e.g. 018→017, 009→008) | 0 broken relative links |
| REQ-008 | 5 themed phase-parents + rewritten `012` root narrative + `retrospective.md` present | files exist, validate clean, narrative covers all phases |

### P2 - Nice-to-have (optional)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Duplicate-016 resolution leaves no ambiguity | one `016` name survives per its theme; the other re-homed distinctly; bare `016` gone |
| REQ-010 | Retrospective cites per-packet status (shipped/planned/gated) | each claim traces to a packet's `spec.md`/`impl-summary` status |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One `012` multi-phased parent; the other 7 top-level folders gone; ~40 packets re-homed under 5 themes.
- **SC-002**: `validate.sh --recursive --strict` Errors:0; content-diff shows zero lost prose; `git log --follow` intact.
- **SC-003**: The `012` root reads as the program narrative; `retrospective.md` covers shipped / planned-but-missed / opportunities with per-packet citations.
- **SC-004**: Operator has signed off D1–D3 before execution.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | ~40 `packet_pointer` + many cross-ref edits (mechanical, error-prone) | broken refs / stale pointers | Deterministic source→target map (tasks.md); grep-verify 0 stale after; validate --recursive |
| Risk | Deep nesting / phase-qualification violations | validate errors | 3-level cap; themes = natural groupings; dissolve-vs-nest rule per CLAUDE.md §3 |
| Risk | Content loss during moves | lost prose | `git mv` only; content-diff vs pre-merge v4 as a hard gate |
| Risk | Memory daemon re-corrupts the tree mid-merge | drift returns | Daemon stays stopped; work on a v4-cut worktree |
| Dependency | Clean v4 tree | can't start dirty | Done this session (stash + dupe removal); re-verify at start |
| Dependency | Canon rules (phase-parent, level markers, validation gotchas) | invalid packets | Encoded in tasks.md from this session's learnings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The merge is bounded I/O work; no runtime perf constraint. Validation completes within the local `validate.sh` timeout.

### Security
- **NFR-S01**: No credentials or secrets involved; the only external action is a push to the allowlisted `skilled/v*` branch, operator-approved.

### Reliability
- **NFR-R01**: The whole change is byte-preserving on content — only frontmatter pointers, cross-ref paths, and the new roots change. `git mv` keeps history so a revert is clean.

---

## 8. EDGE CASES

### Data Boundaries
- **Duplicate 016**: `016-hallmark-adoption` → the Hallmark phase; `016-session-shipped-work-review` → a leaf under the Reviews phase. Neither keeps the bare `016` number.
- **Nested sub-parents**: `012/007-gap-remediation-research` (4 children) and `015/009-manual-testing-playbook-and-db-readme` (2 children) stay nested (their children are one tight sub-workstream). `014` (single child), `015` (9 diverse children), and `016-hallmark-adoption` (4 children) **dissolve** — their children re-home as L3 packets.

### Error Scenarios
- **Cross-references between soon-to-move packets**: rewrite links only after ALL moves are staged (compute new paths first), so no link points at a transient path.
- **Metadata drift**: regenerate `description.json`/`graph-metadata.json` children-before-parents so `children_ids` never references a not-yet-created folder.
<!-- /ANCHOR:questions -->

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | ~40 packets, ~29 moves, 5 new theme parents, 1 program root |
| Risk | 8/25 | Auth: N, API: N, Breaking: N (content byte-preserved); reversible on a worktree |
| Research | 4/20 | Structure already known from `git ls-tree`; no unknowns |
| Multi-Agent | 6/15 | GPT-5.6-SOL agent fan-out for the moves + retrospective |
| Coordination | 4/15 | Sequential phases; orchestrator verifies each |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Broken cross-refs / stale pointers after ~40 moves | M | M | Deterministic map + grep sweep + validate --recursive |
| R-002 | Prose truncation (daemon-style corruption) | H | L | Daemon stopped; content-diff hard gate vs pre-merge v4 |
| R-003 | Phase-qualification / nesting violations | L | L | 3-level cap + dissolve-vs-nest rule |

---

## 11. USER STORIES

### US-001: Read the program history (Priority: P0)

**As a** future maintainer, **I want** one multi-phased `012` that reads as the sk-design program's story, **so that** I can see what was set out, what shipped, and what remains without stitching 8 folders together.

**Acceptance Criteria**:
1. Given the merged tree, When I open `012`, Then the root narrative + 5 themed phases present the program in order.

### US-002: Find missed / opportunity work (Priority: P1)

**As a** program owner, **I want** a retrospective of shipped vs planned-but-missed vs opportunities, **so that** I can decide follow-up work.

**Acceptance Criteria**:
1. Given `retrospective.md`, When I read it, Then each shipped/missed/opportunity claim cites the source packet's status.

---

## 12. OPEN QUESTIONS

- D1 (depth), D2 (000 fate), D3 (theme names/map) — resolved in `decision-record.md`, operator-signed 2026-07-22.
- Should `013-styles-database-rust-opportunities` note it is superseded by `system-speckit/030-rust-backend-rewrite-research`? Proposed: keep under research + add a see-also note.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown + rename map**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Daemon dependency**: See `system-speckit/031-memory-reindex-embed-performance/handover.md`
