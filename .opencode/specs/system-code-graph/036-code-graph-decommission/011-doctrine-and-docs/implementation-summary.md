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
    packet_pointer: "system-code-graph/036-code-graph-decommission/011-doctrine-and-docs"
    last_updated_at: "2026-07-28T09:42:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-011-doctrine-and-docs"
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
| **Spec Folder** | 011-doctrine-and-docs |
| **Completed** | 2026-07-27 |
| **Level** | 1 |
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

Project doctrine no longer mandates a removed tool. The Mandatory Tools table, Code Search Decision Tree, MCP roster, and daemon fallback ladder now state the current truth, the dedicated setup guide is gone, and the bin/lib READMEs no longer document the launcher or CLI.

### Doctrine rewritten

AGENTS.md (the same file as `CLAUDE.md` through a symlink, edited once) was rewritten so the Mandatory Tools table lists only surviving tools, the Code Search Decision Tree routes to a Grep-based search tree, the MCP roster states a 4-server count, and the daemon fallback ladder lists only live daemons. The `.claude/CLAUDE.md` search-routing directive was rewritten, the root README's subsystem coverage was removed, and the dedicated `SET-UP - Code Graph.md` guide was deleted along with its install-guides index entry. The bin and lib READMEs were updated to drop launcher, CLI, and bridge documentation. Doctrine stays in the present tense: it states the current state, not the migration narrative.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` (= `CLAUDE.md` via symlink) | Modified | Rewrote Mandatory Tools, decision tree, MCP roster, daemon ladder, Quick Reference |
| `.claude/CLAUDE.md` | Modified | Rewrote the search-routing directive |
| `README.md` | Modified | Removed subsystem coverage |
| `.opencode/install-guides/SET-UP - Code Graph.md` | Deleted | Entire guide was about the removed subsystem |
| `.opencode/install-guides/README.md` | Modified | Removed the index entry |
| `.opencode/bin/README.md` | Modified | Removed launcher/CLI documentation |
| `.opencode/bin/lib/README.md` | Modified | Removed bridge documentation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The doctrine was largely rewritten by a concurrent session (4-server roster, Grep-based search tree); this session swept the remainder and the bin/lib READMEs. The symlinked instruction file was edited once and verified to share one inode, and a `--no-ignore` sweep confirmed no instruction file or README references the removed subsystem.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Edit the symlinked AGENTS.md/CLAUDE.md once | Editing both would apply edits to the same file twice and double-count an audit |
| Keep doctrine in the present tense | Instruction files state the current state; the migration narrative lives in the tombstone (phase 014) |
| Delete the dedicated setup guide outright | A guide for a removed subsystem has no replacement purpose |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `rg --hidden --no-ignore` over instruction files/READMEs/guides | PASS — no reference to the removed subsystem |
| AGENTS.md / CLAUDE.md inode | PASS — same inode, one set of edits |
| install-guides index resolution | PASS — no dangling entry |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **None identified.** Doctrine was kept present-tense; the removal narrative is deliberately deferred to the phase 014 tombstone.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->

