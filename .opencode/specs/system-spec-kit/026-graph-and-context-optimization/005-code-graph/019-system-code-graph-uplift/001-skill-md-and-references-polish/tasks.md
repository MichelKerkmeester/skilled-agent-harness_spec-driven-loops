---
title: "Tasks: Child 001 SKILL.md and references polish"
description: "Per-batch task list with file:line citations from verified research findings."
trigger_phrases:
  - "019/001 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift/001-skill-md-and-references-polish"
    last_updated_at: "2026-05-16T10:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task list"
    next_safe_action: "Execute T-101"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000293"
      session_id: "029-001-tasks"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Tasks: Child 001

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Grep-verify INSTALL_GUIDE.md L49/L56/L197/L240 (`.opencode/skills/system-code-graph/INSTALL_GUIDE.md`)
- [x] T002 Grep-verify SKILL.md L8/L12/L92/L133 (`.opencode/skills/system-code-graph/SKILL.md`)
- [x] T003 Grep-verify ARCHITECTURE.md L29/L72/L108 + em-dash/semicolon counts (`.opencode/skills/system-code-graph/ARCHITECTURE.md`)
- [x] T004 [P] Confirm mcp_server/tests/handlers/README.md path exists
- [x] T005 Confirm em dash counts: ARCH 12, INSTALL_GUIDE 1, SKILL.md 2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Batch 1: SKILL.md (dependency root)
- [ ] T101 Refresh continuity frontmatter (packet_pointer, last_updated_at, recent_action) (`SKILL.md`)
- [ ] T102 Add "why structural matters" primer before §1 (`SKILL.md`)
- [ ] T103 Add glossary section with 7 terms (`SKILL.md`)
- [ ] T104 Add situational triggers section with 3 scenarios (`SKILL.md`)
- [ ] T105 Fix weak boundary explanation at L92 (`SKILL.md`)
- [ ] T106 Fix weak reference notation at L56 (`SKILL.md`)
- [ ] T107 Replace 2 em dashes at L133 with commas (`SKILL.md`)
- [ ] T108 Replace 1 semicolon at L133 with period (`SKILL.md`)
- [ ] T109 Remove 1 Oxford comma at L11 (`SKILL.md`)
- [ ] T110 Post-batch: `grep -c '—' SKILL.md` returns 0

### Batch 2: INSTALL_GUIDE.md
- [ ] T201 Add `classify_query_intent` to tool list at L17 (`INSTALL_GUIDE.md`)
- [ ] T202 Fix version drift L49: `1.0.0.0` → `1.0.3.1` (`INSTALL_GUIDE.md`)
- [ ] T203 Fix tool count L56: `10` → `11` (`INSTALL_GUIDE.md`)
- [ ] T204 Fix tool count L197: `10` → `11` (`INSTALL_GUIDE.md`)
- [ ] T205 Replace em dash L240 with comma (`INSTALL_GUIDE.md`)
- [ ] T206 Semicolon cleanup in prose lines (preserve JSON/TOML code) (`INSTALL_GUIDE.md`)
- [ ] T207 Improve migration description at L216 (`INSTALL_GUIDE.md`)
- [ ] T208 Post-batch: grep counts confirm

### Batch 3: ARCHITECTURE.md
- [ ] T301 Update three dates at L29 (or document why all identical) (`ARCHITECTURE.md`)
- [ ] T302 Fix launcher reference L72: `mk-spec-memory-launcher.cjs` → `mk-code-index-launcher.cjs` (`ARCHITECTURE.md`)
- [ ] T303 Remove 12 em dashes from prose (lines 85, 101, 104-108, 148, 160-163) (`ARCHITECTURE.md`)
- [ ] T304 Remove 18 semicolons from prose (preserve JSON/code) (`ARCHITECTURE.md`)
- [ ] T305 Remove 4 Oxford commas (lines 38, 40, 57, 131) (`ARCHITECTURE.md`)
- [ ] T306 Post-batch: `grep -c '—' ARCHITECTURE.md` returns 0

### Batch 4: References + feature_catalog + per-folder READMEs
- [ ] T401 [P] Fix L20 HVR in `references/ownership-boundary.md`
- [ ] T402 [P] Verify content alignment in `references/database-path-policy.md`
- [ ] T403 [P] Remove 6 em dashes + 2 semicolons + 1 Oxford comma in `feature_catalog/feature_catalog.md`
- [ ] T404 [P] Remove 2 Oxford commas in `mcp_server/README.md` (lines 35, 40)
- [ ] T405 [P] Add "why this layer matters" primer in `mcp_server/README.md`
- [ ] T406 [P] Remove 2 Oxford commas in `mcp_server/tests/handlers/README.md` (lines 67, 90)
- [ ] T407 plugin_bridges/README.md: targeted alignment per D2; spot-check import paths
- [ ] T408 [P] README.md HVR fixes (L50, L54, L112, L223) + DB path drift at L54
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T501 Em-dash sweep returns 0 across in-scope files
- [ ] T502 Semicolon prose sweep returns 0 across in-scope files
- [ ] T503 Strict-validate child 001 exits 0
- [ ] T504 Strict-validate parent 019 exits 0
- [ ] T505 Fill implementation-summary.md with grep + validate evidence
- [ ] T506 Commit on main referencing 019/001
- [ ] T507 Push to origin/main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Batch 1-4 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (validate.sh exit 0 + grep sweep clean)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent decisions**: `../spec.md` §5
- **Research evidence**: `../research/research.md` §6.1, §6.2, §10
<!-- /ANCHOR:cross-refs -->
