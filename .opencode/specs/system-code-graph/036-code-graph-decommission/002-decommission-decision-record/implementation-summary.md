---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/002-decommission-decision-record"
    last_updated_at: "2026-07-28T09:42:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-002-decommission-decision-record"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-decommission-decision-record |
| **Completed** | 2026-07-27 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Five architecture decision records ratified the code-graph decommission and gave every later phase a citable authority instead of an assumption. The record accepts the permanent loss of structural code search, fixes what replaces it, and writes the rollback path from git history.

### Five ratified ADRs

ADR-001 accepts the permanent loss of the eight `code_graph_*` tool ids. ADR-002 fixes the replacement routing: Grep and Glob for code discovery, `memory_search` for spec docs and saved memory. ADR-003 carries the per-consumer disposition table (remove the feature outright versus retain the call site behind a fallback). ADR-004 sets the archival boundary: `.opencode/specs/**`, changelogs, and benchmark reports are not edited. ADR-005 writes the rollback procedure with the exact steps to restore a working subsystem from git history, including the launcher rebuild path.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `decision-record.md` | Created | The five ratified ADRs and their rationale |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The record was drafted only after the phase 001 synthesis landed, so every disposition was grounded in the cited touchpoint inventory rather than guessed. All five ADRs were ratified as Accepted, and no later phase contradicted a recorded disposition.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Accept the capability loss permanently rather than building a replacement engine | The decommission retires the existing engine; designing a new one is explicitly out of scope |
| Route to Grep/Glob and `memory_search` rather than naming a future engine | Keeps the replacement concrete and copyable into instruction files without over-promising |
| Set the archival boundary as a ratified ADR | Prevents later phases from rewriting spec history under `.opencode/specs/**` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| All five ADRs ratified as Accepted | PASS |
| Rollback procedure specific enough to execute without further research | PASS |
| No requirement in phases 003-014 contradicts a recorded disposition | PASS |
| Every later phase can cite this record instead of re-deciding | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Pre-deletion backup of ignored SQLite/WAL/lease state was not possible.** The open operator item at decision time called for archiving the daemon's ignored database state before deletion. This was overtaken by events: the skill tree was already deleted by a concurrent session before phase 013 ran, so no archive could be taken. This is recorded as a limitation, not a done item. The rollback procedure relies on git history for tracked files; ignored state (SQLite, WAL, lease files) was never tracked and is unrecoverable.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
