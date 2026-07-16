---
title: "Tasks: Phase 3 — Remove mcp-figma skill"
description: "T### task list for Phase 3: re-grep + 14 file edits + skill folder rm -rf + advisor regen + 2 commits + verification."
trigger_phrases:
  - "phase 3 tasks"
  - "mcp-figma removal tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/003-mcp-figma-transfer/003-mcp-figma-skill-removal"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Tasks doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:4e262114def17c639760527954e18124c73de26bd0478d83cbef708ffd089b10"
      session_id: "067-003-tasks-2026-05-05"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3 — Remove mcp-figma skill

<!-- ANCHOR:notation -->
## Task Notation

Template compliance scaffold for 003-mcp-figma-skill-removal/tasks.md; original authored content is retained below.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

Template compliance scaffold for 003-mcp-figma-skill-removal/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

Template compliance scaffold for 003-mcp-figma-skill-removal/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

Template compliance scaffold for 003-mcp-figma-skill-removal/tasks.md; original authored content is retained below.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

Template compliance scaffold for 003-mcp-figma-skill-removal/tasks.md; original authored content is retained below.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

Template compliance scaffold for 003-mcp-figma-skill-removal/tasks.md; original authored content is retained below.
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

### Phase 3A — Re-grep at execution start (D8)

- [ ] **T010** [P0] Re-grep `mcp-figma` across Code_Environment/Public; confirm 31 hits across 9 files match Explore Agent 1 mapping
- [ ] **T020** [P1] Re-grep mcp-code-mode `mcp-figma` skill-name refs; confirm 4 hits at known lines
- [ ] **T030** [P1] Re-grep `figma-developer-mcp\|figma\.figma_` in mcp-code-mode; baseline ≥120 hits before edits

### Phase 3B — File edits (Claude direct via Edit tool)

### Advisor scoring tables
- [ ] **T040** [P0] Edit `graph-metadata.json`: DELETE edge entry (line 18), PATCH count 20→19 (line 62)
- [ ] **T050** [P0] Edit `skill-graph.json`: 6 edits (PATCH skill_count, DELETE 5 nodes)
- [ ] **T060** [P0] Edit `scorer/lanes/explicit.ts`: 4 DELETE_LINE
- [ ] **T070** [P0] Edit `scorer/lanes/lexical.ts`: 1 DELETE_LINE

### Test fixtures
- [ ] **T080** [P0] Edit `routing-fixtures.affordance.test.ts`: 5 DELETE_NODE (fixture + test block)

### skill_advisor.py
- [ ] **T090** [P0] Edit `skill_advisor.py`: 5 edits (line 1396 DELETE_LINE, lines 1444/1613/1937/1938 PATCH)

### Observability + Documentation
- [ ] **T100** [P0] Edit `smart-router-measurement-report.md`: line 26 DELETE_LINE
- [ ] **T110** [P0] Edit root `README.md`: 4 edits (DELETE subsection, DELETE line, PATCH 2 examples)
- [ ] **T120** [P0] Edit `.opencode/skills/README.md`: 6 edits (PATCH 2 counts, DELETE 4 rows)

### mcp-code-mode (D1 strip pattern, KEEP 127 tool refs)
- [ ] **T130** [P0] Edit `mcp-code-mode/SKILL.md` line 476: DELETE_LINE (Related skills: mcp-figma)
- [ ] **T140** [P0] Edit `mcp-code-mode/README.md` line 451: DELETE_LINE (table row link to mcp-figma)
- [ ] **T150** [P0] Edit `mcp-code-mode/references/architecture.md` line 514: DELETE_LINE (mcp-figma cross-reference)
- [ ] **T160** [P0] Edit `mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/001-figma-file-metadata.md` line 88: DELETE_LINE (path reference)

### Phase 3C — Skill folder deletion

- [ ] **T170** [P0] `rm -rf .opencode/skills/mcp-figma/` (memory rule: DELETE not archive)
- [ ] **T180** [P0] Verify deletion: `test ! -d .opencode/skills/mcp-figma/`

### Phase 3D — Commit 4 (deletion + cross-ref patches)

- [ ] **T190** [P0] `git status -s` — review staged set
- [ ] **T200** [P0] Stage selectively (NEVER `-A`): each of 14 modified files + skill folder deletion
- [ ] **T210** [P0] Verify pre-existing 7 modified + 6 untracked files NOT staged
- [ ] **T220** [P0] Commit: `chore: remove mcp-figma skill and patch cross-references` with Co-Authored-By trailer
- [ ] **T230** [P0] Capture commit SHA

### Phase 3E — Skill advisor regen

- [ ] **T240** [P0] Invoke `Skill: doctor:skill-advisor :auto`
- [ ] **T250** [P1] Verify regen output: zero `mcp-figma` refs in skill-graph.json

### Phase 3F — Verify advisor tests

- [ ] **T260** [P0] Find advisor test runner (likely `vitest` in `system-spec-kit/mcp_server/skill_advisor/tests/` or `npm test`)
- [ ] **T270** [P0] Run advisor tests; expect green
- [ ] **T280** [P0] If failures: investigate; re-edit fixtures or scoring; re-run

### Phase 3G — Commit 5 (advisor regen)

- [ ] **T290** [P0] `git diff` — review only advisor regen output
- [ ] **T300** [P0] Commit: `chore: regenerate skill advisor graph` with Co-Authored-By trailer
- [ ] **T310** [P0] Capture commit SHA

### Phase 3H — Branch hygiene

- [ ] **T320** [P0] `git branch --show-current` — confirm `main`
- [ ] **T330** [P1] If any feature branch auto-created earlier: switch back to main + carry uncommitted + delete branch

### Phase 3I — Verification (opus subagent)

- [ ] **T340** [P0] Dispatch opus for Hook E (re-grep cleanliness)
  - Confirms zero `mcp-figma` skill-name hits outside specs / z_archive / z_future
  - Confirms ≥120 figma-developer-mcp tool refs preserved in mcp-code-mode (D1 KEEP)
- [ ] **T350** [P0] Dispatch opus for Hook F (advisor test suite)
  - Confirms test runner exits 0
  - Confirms skill-graph.json clean
- [ ] **T360** [P0] Dispatch opus for Hook G (branch hygiene)
  - Confirms `main` branch
  - Confirms unrelated dirty tree files surviving

### Phase 3J — Phase summary

- [ ] **T370** [P0] Author `implementation-summary.md` with both commit SHAs + opus results

---

### Estimated wall-clock

| Phase | Time |
|-------|------|
| 3A Re-grep | 5 min |
| 3B File edits | 15-20 min |
| 3C rm -rf | 1 min |
| 3D Commit 4 | 5 min |
| 3E doctor:skill-advisor | 5-10 min |
| 3F Verify tests | 5 min |
| 3G Commit 5 | 5 min |
| 3H Branch hygiene | 5 min |
| 3I Opus verification | 15 min |
| 3J Summary | 10 min |
| **Total** | **~75-90 min** |
