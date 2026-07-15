---
title: "Feature Specification: sk-doc Legacy Self-Identity Cleanup [skilled-agent-orchestration/144-sk-doc-legacy-self-identity-cleanup/spec]"
description: "Backlog packet to normalize 258 pre-existing non-resolving self-identity references (ancient numbers, dead categories, unqualified cells) in the sk-doc track's nested docs, surfaced by the 143 consolidation's LUNA audit."
trigger_phrases:
  - "sk-doc legacy self-identity cleanup"
  - "sk-doc stale self-identity refs"
  - "normalize sk-doc ancient path references"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-sk-doc-legacy-self-identity-cleanup"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Backlog scaffold authored from the 143 consolidation follow-up"
    next_safe_action: "Schedule the cleanup pass when a worktree is available"
    blockers: []
    completion_pct: 0
    status: "Planned"
---
# Feature Specification: sk-doc Legacy Self-Identity Cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | TBD |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 143 sk-doc consolidation's independent LUNA audit surfaced **258 non-resolving self-identity references** in the sk-doc track's nested docs (grandchildren of the moved packets). They point to ancient packet numbers (`125-sk-doc-parent`, `117-skill-anchor-toc-removal`, `133-catalog-playbook-snippet-denumbering`, `025-cmd-create-feature-catalog`), the dead `03--commands-and-skills/` category, and unqualified bare cells. These are **pre-existing** — carried by the packets through prior reorgs long before the 143 consolidation — proven by identical origin-vs-worktree occurrence counts. They were left untouched by 143 under SCOPE LOCK.

### Purpose
Normalize the 258 pre-existing self-identity fields (title brackets, `packet_pointer`, `packet_id`, `spec_folder`, `specFolder`, `**Spec Folder**` cells) so each names the doc's current on-disk `sk-doc/NNN-…` path, without altering historical narrative or cross-tree references.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite self-identity fields in sk-doc canonical docs to the current on-disk path.
- Verify each rewritten path resolves on disk; verify no unrelated token count changes vs a pre-cleanup baseline.

### Out of Scope
- Cross-tree references from OTHER tracks/skills into sk-doc (a separate reindex concern).
- Frozen `*.out` / `*.codexlog` session transcripts (historical, never rewritten).
- Template/anchor/scaffold doc-quality debt (separate concern).

### Files to Change
- `.opencode/specs/sk-doc/**/{spec,plan,tasks,checklist,implementation-summary,decision-record}.md` and `{description,graph-metadata}.json` — self-identity fields only.


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full resolution | Comprehensive any-prefix self-identity resolver reports 0 non-resolving refs in sk-doc canonical docs (excluding `context-index.md` + frozen transcripts) |
| REQ-002 | No collateral change | Occurrence counts of unrelated tokens unchanged vs pre-cleanup baseline |
| REQ-003 | Regression-neutral | `validate.sh --strict --recursive` on sk-doc regression-neutral-or-better vs baseline |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every self-identity field in sk-doc canonical docs resolves to a real on-disk folder.
- **SC-002**: Regression-neutral validation; no new error types introduced.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A rewrite touches historical narrative, not just identity | Rewrites history | Restrict edits to self-identity fields; diff-review |
| Risk | Bare-cell rewrite ambiguity | Wrong target path | Derive the correct path from the file's own location (deterministic) |
| Dependency | Isolated worktree + operator landing approval | — | Same playbook as the consolidations |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should this be absorbed into a broader repo-wide naming/identity normalization program rather than run standalone? **Deferred to scheduling time.**


<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Origin of this backlog**: `skilled-agent-orchestration/143-sk-doc-spec-consolidation` (see its implementation-summary "Known Limitations").
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

---
