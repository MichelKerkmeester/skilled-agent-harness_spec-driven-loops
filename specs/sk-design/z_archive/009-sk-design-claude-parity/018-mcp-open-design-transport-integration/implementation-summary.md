---
title: "Implementation Summary"
description: "design-mcp-open-design (formerly mcp-open-design) is now a properly integrated nested transport packet of sk-design: new packetKind:\"transport\" registry axis, dissolved independent identity, every stale reference across 4 skills repointed, D5 connectivity re-verified clean."
trigger_phrases:
  - "implementation"
  - "summary"
  - "phase 018 implementation summary"
  - "design-mcp-open-design integration summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/018-mcp-open-design-transport-integration"
    last_updated_at: "2026-07-07T10:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict for final confirmation, then commit and push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-mcp-open-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-open-design-transport-018"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-mcp-open-design-transport-integration |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The operator physically moved `.opencode/skills/mcp-open-design/` to `.opencode/skills/sk-design/design-mcp-open-design/` via a raw `mv` outside git. This phase turned that relocation into a proper architectural integration. `design-mcp-open-design` is a transport skill — it drives the external Open Design app's `od` CLI and stdio MCP server, and is fundamentally unlike sk-design's five design-judgment modes (which are `Read`/`Glob`/`Grep`-only, or `md-generator`'s repo-mutating extraction). sk-design's `mode-registry.json` and `hub-router.json` now carry a new `packetKind: "transport"` axis (mirroring sk-code's existing `extensions.surface-axis` two-axis pattern), the moved packet's independent advisor identity was dissolved (its own `graph-metadata.json` deleted), and every stale internal link (14, caused by the added nesting depth) and external cross-reference (across `mcp-figma`, `cli-opencode`, `AGENTS.md`, and sk-design's own docs) was repointed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-mcp-open-design/{SKILL.md,README.md,INSTALL_GUIDE.md,references/*.md,feature_catalog/**,manual_testing_playbook/**,scripts/*.sh,mcp-servers/**}` | Edited | Fixed 14 depth-shift broken links + 2 pre-existing missing path segments; renamed identity throughout |
| `.opencode/skills/sk-design/design-mcp-open-design/graph-metadata.json` | Deleted | Dissolves its independent advisor identity |
| `.opencode/skills/sk-design/mode-registry.json` | Edited | New `transport` packetKind axis, `extensions.transport-axis`, new `design-mcp-open-design` mode entry; version 1.3.0.0 -> 1.4.0.0 |
| `.opencode/skills/sk-design/hub-router.json` | Edited | New routerSignals/vocabularyClasses/tieBreak entry; version 1.2.1.0 -> 1.3.0.0 |
| `.opencode/skills/sk-design/{SKILL.md,README.md}` | Edited | Mode-count and transport-listing prose (10 mentions) |
| `.opencode/skills/sk-design/graph-metadata.json` | Edited | Removed now-internal `mcp-open-design` edges (siblings, prerequisite_for, related_to) |
| `.opencode/skills/mcp-figma/{SKILL.md,README.md,manual_testing_playbook/manual_testing_playbook.md}` | Edited | Repointed 5 cross-references |
| `.opencode/skills/mcp-figma/graph-metadata.json` | Edited | Removed dangling edges, updated causal_summary prose |
| `.opencode/skills/cli-opencode/SKILL.md` | Edited | ALWAYS rule #13 (Design Standards Loading); version 1.3.15.0 -> 1.3.15.1 |
| `AGENTS.md` | Edited | 2 routing table rows |
| `.opencode/changelog/mcp-open-design` | Deleted | Stale broken symlink |
| `.opencode/changelog/sk-design/design-mcp-open-design` | Created | New per-packet changelog symlink |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Explore agent inventoried every repo-wide reference to the old name/path in parallel with a direct read of the moved skill's full `SKILL.md`, establishing both the reference scope and the skill's actual nature (transport, not a design-judgment mode) before any edit. Because that raised a genuine architectural fork — keep a separate identity, fold into the existing workflow axis, or add a new axis — the three options were weighed explicitly and confirmed with the operator via `AskUserQuestion` before touching anything. With the shape confirmed, internal links were fixed first using a systematic Python link scanner (not manual grep) that caught both markdown-link syntax and, on a second pass, plain backtick-quoted paths in table cells that the first regex missed — this caught 2 pre-existing broken links (a missing `design-interface/` path segment) that predated the move entirely. Registry wiring came next, modeled directly on sk-code's existing `extensions.surface-axis` shape. Hub-level and external cross-references were fixed last, then a full repo-wide re-scan (excluding `node_modules`/`changelog`/`benchmark` noise) and a router-mode skill-benchmark run confirmed the restructure introduced zero regressions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| New `packetKind: "transport"` axis (operator-selected) over keep-separate-identity or fold-into-workflow | Architecturally honest: doesn't conflate a Bash-capable external-tool bridge with either an independent advisor identity (redundant now that it's physically nested) or a design-judgment workflow mode (would blur sk-design's routing vocabulary, tightened just one phase earlier) |
| `mutatesWorkspace: false` for the new mode despite `Bash` being allowed | Its Bash calls drive an EXTERNAL daemon/app, never writing to this repo's own workspace — distinct from `md-generator`, which genuinely writes repo files and correctly has `mutatesWorkspace: true` |
| Remove (not retarget) graph edges pointing at the old independent `skill_id` | The relationship these edges represented (two independent skill identities) no longer exists; it's now an intra-hub structural relationship fully captured by `mode-registry.json`'s own `modes[]` array. A dangling edge to a non-existent `skill_id` would be worse than no edge |
| Flag `system-skill-advisor`'s compiled `skill-graph.json` as a follow-up rather than regenerating it here | It's a build artifact spanning the WHOLE skill graph, not just this packet, and this session has repeatedly flagged reindex operations as needing single-session coordination to avoid colliding with concurrent-session activity |
| Fix 2 pre-existing broken links (missing `design-interface/` segment) discovered incidentally during the depth-shift fix | Already touching those exact files for the move-fix; leaving a now-doubly-wrong path in place would be a worse outcome than the small extra fix |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Systematic link scan inside `design-mcp-open-design/` (first pass) | PASS, 0 broken after fixing all 14 depth-shift + 2 pre-existing issues |
| Repo-wide link scan across `sk-design` + `mcp-figma` (excluding node_modules/changelog/benchmark) | PASS, 0 broken |
| JSON parse (`mode-registry.json`, `hub-router.json`, `sk-design/graph-metadata.json`, `mcp-figma/graph-metadata.json`) | PASS, 0 errors |
| Router-mode skill-benchmark | PASS, aggregate 100/100, D5 connectivity 100/100, 0 ranked bottlenecks — matches the pre-integration baseline exactly |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`system-skill-advisor/mcp_server/scripts/skill-graph.json` still reflects the old identity.** This is a compiled build artifact (regenerated via `skill_graph_compiler.py --export-json`) spanning the entire skill graph, not scoped to this packet. Deliberately not regenerated in this phase to avoid colliding with active concurrent-session reindex work; running it is a required follow-up.
2. **No new playbook scenarios for `design-mcp-open-design`.** sk-design's existing 24-scenario `manual_testing_playbook` doesn't exercise the new transport mode specifically (it predates this integration). The router-mode benchmark confirms no regression to the EXISTING scenarios, but doesn't add live coverage for the new mode's own routing. A future phase could add an MR-class scenario or a new category.
3. **No live-mode benchmark re-run.** Verification used the fast, deterministic router-mode connectivity gate only, consistent with how phase 017's smaller-scoped change was verified.
<!-- /ANCHOR:limitations -->
