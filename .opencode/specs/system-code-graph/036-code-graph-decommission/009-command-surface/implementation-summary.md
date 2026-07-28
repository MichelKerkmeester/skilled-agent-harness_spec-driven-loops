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
    packet_pointer: "system-code-graph/036-code-graph-decommission/009-command-surface"
    last_updated_at: "2026-07-28T09:42:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-009-command-surface"
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
| **Spec Folder** | 009-command-surface |
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

The command surface no longer routes to, grants, or documents the removed code-graph tools. The doctor route dedicated to the subsystem is gone, the deep commands' allowed-tools are clean, and every compiled contract was re-rendered from a fixed source so the route guard reports no drift.

### Doctor route and contracts

The code-graph doctor route asset was deleted and its `_routes.yaml` entry removed, so the router lists only routes that resolve. Graph tool ids were stripped from the deep commands' allowed-tools and prose, and boilerplate was cleared from the create assets. The decisive move was treating the compiled contracts as generated output: their allowlists are compiler-owned, so the sources were fixed first and the contracts re-rendered, avoiding a hand-edit that the next sync would overwrite and the route guard would flag.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/doctor/assets/doctor-code-graph.yaml` | Deleted | Route existed only for the removed subsystem |
| `.opencode/commands/doctor/_routes.yaml` | Modified | Removed the route entry |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modified | Removed skill-dir and server checks |
| `.opencode/commands/doctor/assets/doctor-mcp-*.yaml` | Modified | Removed the server from install/debug flows |
| `.opencode/commands/deep/*.md` | Modified | Removed graph tool grants and prose |
| `.opencode/commands/deep/assets/compiled/*.contract.md` | Regenerated | Re-rendered from updated sources |
| `.opencode/commands/create/assets/*.yaml` | Modified | Cleared boilerplate references |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The compiler-owned allowlists were fixed at the source and the contracts re-rendered, then the compiled-route guard confirmed no drift between source and output. The doctor router was checked to resolve only existing assets.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Fix allowlists at the source, then re-render contracts | Hand-editing a generated contract is lost on the next sync and fails the route guard |
| Delete the doctor route outright | A route that diagnoses a removed subsystem has no replacement purpose |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Compiled-route guard (drift) | PASS — no drift after regeneration |
| Doctor router resolution | PASS — every listed route resolves |
| Command allowed-tools | PASS — no graph tool id remains |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **None identified.** The doctor surface did not gain a replacement route for the remaining two daemons; the facts do not record one as needed.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->

