---
title: "Tasks: Phase 1 — Barter Figma Agent"
description: "Task list with T### IDs chained to plan.md sections. cli-codex (gpt-5.5 high) executes T010-T070; Claude/opus runs T080-T100."
trigger_phrases:
  - "barter figma tasks"
  - "phase 1 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/001-barter-figma-agent"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Tasks doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:818cd1b4ba93da7238672128542a8b5fed917762d6ccfc54b460b504cb5f7389"
      session_id: "067-001-tasks-2026-05-05"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — Barter Figma Agent

<!-- ANCHOR:notation -->
## Task Notation

Template compliance scaffold for 001-barter-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

Template compliance scaffold for 001-barter-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

Template compliance scaffold for 001-barter-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

Template compliance scaffold for 001-barter-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

Template compliance scaffold for 001-barter-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

Template compliance scaffold for 001-barter-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:cross-refs -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->

---

### Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete |
| `[!]` | Blocked |

| Priority | Severity |
|----------|----------|
| **[P0]** | Hard blocker — cannot ship without |
| **[P1]** | Required, can defer with user approval |
| **[P2]** | Optional |

---

### Phase 1A — Knowledge Base (cli-codex parallel)

- [ ] **T010** [P0] Author `knowledge base/system/Figma - System - Prompt - v0.100.md` via cli-codex (target ~33K, mirror ClickUp - System - Prompt - v0.100.md structure: routing logic, tool verification, SYNC integration, command registry)
- [ ] **T020** [P0] Author `knowledge base/system/Figma - Thinking - SYNC Framework - v0.100.md` via cli-codex (target ~28K, 4-phase methodology Survey→Yield→Navigate→Create, Sequential Thinking Protocol)
- [ ] **T030** [P0] Author `knowledge base/system/Figma - System - Interactive Intelligence - v0.100.md` via cli-codex (target ~28K, clarification flow, single-comprehensive-question protocol)
- [ ] **T040** [P0] Author `knowledge base/integrations/Figma - Integrations - MCP Knowledge - v0.100.md` via cli-codex (target ~31K, all 18 MCP tools cataloged, Option A HTTP/OAuth + Option B Framelink stdio)
- [ ] **T050** [P0] Author `knowledge base/reference/Figma - Reference - Combined Workflows - v0.100.md` via cli-codex (target ~30K, multi-tool patterns: file→export, file→tokens, design→ClickUp task, design→Webflow CMS)

### Phase 1B — Entry Points (cli-codex parallel, after 1A)

- [ ] **T060** [P0] Author `AGENTS.md` via cli-codex (target ~10K; opens with §1 Critical — Context Override; includes 4 boundary statements + Authority Level + 9-step Processing Hierarchy + Command Registry + Document Loading DAG with explicit paths to T010–T050 outputs)
- [ ] **T070** [P0] Author `README.md` via cli-codex (target ~22K, User Guide v0.100, internal Barter audience; sections: Overview, Key Features, System Architecture, Quick Setup, Examples, Version History, Resources)
- [ ] **T080** [P0] Author `INSTALL_GUIDE.md` via cli-codex (target ~28K, AI-First Install Prompt before TOC; Option A HTTP/OAuth section; Option B Framelink stdio section; Verification + Troubleshooting + Resources)

### Phase 1C — MCP Servers (Claude direct + cli-codex)

- [ ] **T090** [P0] Author `mcp servers/figma-mcp-http/config-snippets.md` (Claude direct, ~3K — opencode.json, .mcp.json, claude-desktop-config.json snippets for HTTP/OAuth)
- [ ] **T100** [P1] Author `mcp servers/figma-mcp-http/verify.sh` (Claude direct, OAuth round-trip test script)
- [ ] **T110** [P0] Author `mcp servers/figma-mcp-stdio/package.json` (Claude direct, dependency on `figma-developer-mcp@latest`)
- [ ] **T120** [P0] Author `mcp servers/figma-mcp-stdio/install.sh` (Claude direct, npm install + node_modules audit)
- [ ] **T130** [P0] Author `mcp servers/figma-mcp-stdio/config-snippets.md` (Claude direct, .utcp_config.json + direct MCP client config)
- [ ] **T140** [P0] Run `npm install` in `mcp servers/figma-mcp-stdio/` to populate `node_modules/` (per D5 mirror-ClickUp full bundling)
- [ ] **T150** [P1] Audit `node_modules/` size; if >50MB, escalate D5 to lighter alternative (package.json + install.sh only, no committed node_modules)

### Phase 1D — Placeholders

- [ ] **T160** [P1] Place `Favicon.jpg` TODO marker (per D3 — text marker, image deferred)
- [ ] **T170** [P2] Place `context/.gitkeep` (placeholder folder)

### Phase 1E — Verification (opus subagent)

- [ ] **T180** [P0] Dispatch opus subagent for verification hook B
  - Input: AGENTS.md path, knowledge base/ tree, mcp servers/ tree
  - Checks: DAG resolution, knowledge base count, file-naming, mcp servers parity, persona reframe (no "developer"/"designer"), boundary statements, SYNC verb consistency, Favicon TODO marker, bundle size
  - Output: pass/fail report with specific failing files
- [ ] **T190** [P0] If T180 fails: re-dispatch failing files with stricter constraints; re-verify
- [ ] **T200** [P1] sk-doc DQI score ≥85 on each knowledge base doc (sample 1-2 if not all)

### Phase 1F — Commit

- [ ] **T210** [P0] Stash unrelated Barter dirty tree (Media Editor webp deletions if present) to keep Commit 1 Figma-only
- [ ] **T220** [P0] `git -C "/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter" add "MCP Agents/Figma/"`
- [ ] **T230** [P0] `git -C "/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter" commit -m "Figma MCP"`
- [ ] **T240** [P0] Confirm commit landed on Barter main; capture SHA in implementation-summary.md
- [ ] **T250** [P1] Restore stashed unrelated changes (`git stash pop`)

---

### Dependency Graph

```
T010 ─┐
T020 ─┤
T030 ─┼─► T060 (AGENTS.md needs DAG paths)
T040 ─┤
T050 ─┘
        T070 (README.md, parallel with T060)
        T080 (INSTALL_GUIDE.md, parallel with T060/T070)

T090, T100, T110, T120, T130 (parallel batch)
                    │
                    └─► T140 (npm install)
                            │
                            └─► T150 (size audit)

T160, T170 (parallel, anytime)

[All above] ─► T180 (opus verify) ─► T190 (rework if needed) ─► T200 (DQI)
                                                                    │
                                                                    └─► T210 → T220 → T230 → T240 → T250
```

---

### Estimated wall-clock

| Batch | Time |
|-------|------|
| Phase 1A (5 docs, parallel 3+2) | 60-90 min |
| Phase 1B (3 docs, parallel) | 30-45 min |
| Phase 1C (5 docs + npm install) | 15-20 min |
| Phase 1D | 2 min |
| Phase 1E (opus verify) | 10-15 min |
| Phase 1F (commit) | 5 min |
| **Total** | **~2-3 hours** |
