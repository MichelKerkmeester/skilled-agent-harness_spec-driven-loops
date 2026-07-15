---
title: "Tasks: Phase 2 — Dual-publish Figma to AI_Systems/Public"
description: "T### task list for Phase 2: cp + sanitize + cli-codex README + npm install + Public/README §8 patch + 2 commits + opus verification."
trigger_phrases:
  - "phase 2 tasks"
  - "public figma tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/004-mcp-figma-transfer/002-public-figma-agent"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Tasks doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:d89c6bd8381af5179587af87e62bc631a4c4ceb0710996261507e6b958f41397"
      session_id: "067-002-tasks-2026-05-05"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 — Dual-publish Figma to AI_Systems/Public

<!-- ANCHOR:notation -->
## Task Notation

Template compliance scaffold for 002-public-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

Template compliance scaffold for 002-public-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

Template compliance scaffold for 002-public-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

Template compliance scaffold for 002-public-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

Template compliance scaffold for 002-public-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

Template compliance scaffold for 002-public-figma-agent/tasks.md; original authored content is retained below.
<!-- /ANCHOR:cross-refs -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->

---

### Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete |

| Priority | Severity |
|----------|----------|
| **[P0]** | Hard blocker |
| **[P1]** | Required, can defer with user approval |
| **[P2]** | Optional |

---

### Phase 2A — Copy + Sanitize (Claude direct)

- [ ] **T010** [P0] Verify `Public/Figma/` doesn't already exist
- [ ] **T020** [P0] `cp -r "Barter/MCP Agents/Figma" "Public/Figma"`
- [ ] **T030** [P0] `rm -rf "Public/Figma/context/"` (per D9)
- [ ] **T040** [P0] `rm -rf "Public/Figma/mcp servers/figma-mcp-stdio/node_modules/"` (rebuild fresh)
- [ ] **T050** [P0] Verify `diff -rq` shows only expected differences

### Phase 2B — README rewrite (cli-codex)

- [ ] **T060** [P0] Dispatch cli-codex (gpt-5.5 high) to re-author `Public/Figma/README.md` for open-source audience

### Phase 2C — npm install (Claude direct)

- [ ] **T070** [P0] `cd Public/Figma/mcp servers/figma-mcp-stdio/ && npm install --no-fund --no-audit`
- [ ] **T080** [P1] Audit bundle size; should be ~48MB

### Phase 2D — Commit 2 (Public Figma folder)

- [ ] **T090** [P0] `git -C Public status` — verify clean staged set
- [ ] **T100** [P0] `git -C Public add Figma/`
- [ ] **T110** [P0] Verify `node_modules/` excluded by gitignore
- [ ] **T120** [P0] Commit message `Figma MCP` with Co-Authored-By trailer
- [ ] **T130** [P0] Capture commit SHA

### Phase 2E — Public/README.md §8 patch (Claude direct)

- [ ] **T140** [P0] Investigate D10 baseline (`ls -d Public/*/`, current TOC count, current badge value)
- [ ] **T150** [P0] Edit Public/README.md TOC: add `8. [Figma Agent](#8-figma-agent)`
- [ ] **T160** [P0] Edit Public/README.md body: add §8 anchor section after §7 ClickUp Agent (mirror §7 structure)
- [ ] **T170** [P1] Update badge if needed (likely stays at 8)

### Phase 2F — Commit 3 (Public README §8)

- [ ] **T180** [P0] `git -C Public add README.md`
- [ ] **T190** [P0] Commit message `Add Figma to README` with Co-Authored-By
- [ ] **T200** [P0] Capture commit SHA

### Phase 2G — Verification (opus subagent)

- [ ] **T210** [P0] Dispatch opus subagent for Hook C (Barter↔Public diff)
- [ ] **T220** [P0] Dispatch opus subagent for Hook D (Public README integrity)
- [ ] **T230** [P0] If FAIL: re-execute affected phase; re-verify

### Phase 2H — Phase summary

- [ ] **T240** [P0] Author `implementation-summary.md` with both commit SHAs + opus results

---

### Estimated wall-clock

| Phase | Time |
|-------|------|
| 2A | 2-3 min |
| 2B | 5-10 min |
| 2C | 2 min |
| 2D | 2 min |
| 2E | 10 min |
| 2F | 2 min |
| 2G | 10 min |
| 2H | 5 min |
| **Total** | **~40-50 min** |
