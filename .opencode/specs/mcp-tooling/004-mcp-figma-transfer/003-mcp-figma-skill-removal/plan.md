---
title: "Implementation Plan: Phase 3 — Remove mcp-figma skill"
description: "Author-once edit plan for 14 files + 1 folder deletion + skill advisor regen. cli-codex used selectively for bulk JSON edits; Claude direct for surgical line edits."
trigger_phrases:
  - "phase 3 plan"
  - "mcp-figma removal plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/004-mcp-figma-transfer/003-mcp-figma-skill-removal"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Plan doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:a8822c23a34d17e07367515c78cbaba83b2aa8d915e5146136bf6eff5525eb17"
      session_id: "067-003-plan-2026-05-05"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3 — Remove mcp-figma skill

<!-- ANCHOR:summary -->
## 1. SUMMARY

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

Template compliance scaffold for 003-mcp-figma-skill-removal/plan.md; original authored content is retained below.
<!-- /ANCHOR:milestones -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->

---

### 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Operations** | Edit tool (line-level), Write tool (where appropriate), Bash (rm -rf, doctor:skill-advisor invocation, npm test, git ops) |
| **Repos touched** | `Code_Environment/Public` only |
| **Source of truth** | Explore Agent 1 line-level mapping (31 hits across 9 files + 4 strips in mcp-code-mode) |
| **Target** | Folder deletion + 13 patch files + advisor regen output |

### Overview
Apply the line-level edit map produced by Explore Agent 1, then physically remove the `mcp-figma` skill folder, then regenerate the skill advisor graph. Two commits per D6 to keep manual edits separable from auto-regen output for clean review/rollback.

---

### 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 commit `690b498 Figma MCP` on Barter main verified
- [x] Phase 2 commits `c4f6c56` + `e96a3ee` on Public main verified
- [x] D1 + D2 + D6 + D8 captured in decision-record.md
- [x] Spec docs authored

### Definition of Done
- [ ] `.opencode/skills/mcp-figma/` deleted (rm -rf)
- [ ] All 31 cross-ref edits applied
- [ ] All 4 mcp-code-mode strips applied
- [ ] 127 figma-developer-mcp tool refs preserved
- [ ] Skill advisor tests green
- [ ] Two commits on Code_Environment/Public main
- [ ] Branch hygiene complete (on main, no leftover feature branches)
- [ ] Opus hooks E + F + G pass

---

### 3. APPROACH

### Strategy
**Re-grep first, edit second, delete third, regen fourth, commit twice.** The re-grep step (D8) catches any drift since the original Explore Agent 1 mapping was produced. Edits go in a single working-tree state; deletion of the skill folder happens in the same working tree; the entire payload commits atomically. Then doctor:skill-advisor :auto runs and its output commits separately.

### Phase 3A — Re-grep at execution start (D8)
1. Run `grep -rln "mcp-figma\|mcp_figma" Code_Environment/Public/ --include="*.md" --include="*.json" --include="*.toml" --include="*.ts" --include="*.js" --include="*.py" --include="*.sh"`
2. Compare against Explore Agent 1's mapping (31 hits across 9 files + 4 strips in mcp-code-mode)
3. If new hits appear: add to task list as T### entries
4. If old hits gone: skip those task entries

### Phase 3B — File edits (Claude direct via Edit tool)

**Edits per file** (parallel where possible):

1. **graph-metadata.json** (line 18, 62)
   - Line 18: DELETE the `{ "target": "mcp-figma", ... }` edge entry
   - Line 62: PATCH `causal_summary` count from 20 → 19

2. **skill-graph.json** (lines 4, 17, 97, 101-108, 186, 250-255)
   - Line 4: PATCH `"skill_count": 19` → `18`
   - Line 17: DELETE `"mcp-figma"` family entry
   - Line 97: DELETE `"mcp-figma"` from `mcp-code-mode.prerequisite_for`
   - Lines 101-108: DELETE entire `"mcp-figma"` adjacency block
   - Line 186: DELETE `"mcp-figma": 0.7` from skill_advisor enhances
   - Lines 250-255: DELETE `"mcp-figma": [...]` signal block

3. **scorer/lanes/explicit.ts** (lines 17, 23, 27, 137)
   - Each: DELETE_LINE for the `[['mcp-figma', X]]` entries

4. **scorer/lanes/lexical.ts** (line 32)
   - DELETE_LINE for `'mcp-figma': [...]` entry

5. **routing-fixtures.affordance.test.ts** (lines 33, 49, 54-56)
   - Line 33: DELETE `skill({ id: 'mcp-figma' })` fixture entry
   - Lines 49, 54-56: DELETE the test that exercises mcp-figma routing (entire test block)

6. **skill_advisor.py** (lines 1396, 1444, 1613, 1937, 1938)
   - Line 1396: DELETE `"figma": ("mcp-figma", 2.2)` entry
   - Line 1444: PATCH — remove `("mcp-figma", 0.3)` tuple from "export" array; keep `("mcp-chrome-devtools", 0.2)`
   - Line 1613: PATCH — remove `("mcp-figma", 0.8)` tuple from "figma css" array; keep `("sk-code", 0.4)` (or DELETE entire entry if mcp-figma was the primary)
   - Line 1937: PATCH — remove "use figma" string from list
   - Line 1938: PATCH — remove "figma" token from set

7. **smart-router-measurement-report.md** (line 26)
   - DELETE_LINE for the `| mcp-figma | ... |` performance row

8. **root README.md** (lines 642, 825-829, 1173, 1187)
   - Line 642: PATCH — replace `"use figma to export designs"` example with another tool example (e.g., "use chrome-devtools to inspect a page")
   - Lines 825-829: DELETE the entire mcp-figma subsection (header + description)
   - Line 1173: DELETE the `figma` MCP/stdio bullet
   - Line 1187: PATCH — replace the `figma.figma_get_file({fileKey: ...})` example with another tool

9. **.opencode/skills/README.md** (lines 54, 58, 161, 204, 258)
   - Line 54: PATCH `Total skill folders: 17` → `16`
   - Line 58: PATCH `MCP integration skills: 4` → `3`; remove `mcp-figma` from list
   - Line 161: DELETE the `mcp-figma | 1.0.7.0 | Figma design file access...` row
   - Line 204: DELETE the `├── mcp-figma/ | # Figma design file access via MCP` line
   - Line 258: DELETE the `mcp-figma | Yes | Yes | No |` row

10-13. **mcp-code-mode (4 strips per D1)**:
   - `SKILL.md:476` — DELETE_LINE: "Related skills: `mcp-figma` for Figma access through Code Mode..."
   - `README.md:451` — DELETE_LINE: `| [mcp-figma](../mcp-figma/SKILL.md) | Figma design file access via Code Mode |`
   - `references/architecture.md:514` — DELETE_LINE: `- `mcp-figma` - Figma design file access (via Code Mode)`
   - `manual_testing_playbook/06--third-party-via-cm/001-figma-file-metadata.md:88` — DELETE_LINE: `| `.opencode/skills/mcp-figma/SKILL.md` | Figma MCP tool catalog |`

### Phase 3C — Skill folder deletion
1. `rm -rf "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-figma/"`
2. Verify deletion: `test ! -d ...mcp-figma/` returns 0

### Phase 3D — Commit 4 (deletion + cross-ref patches)
1. `git status -s` — verify only the 14 expected files (+ deletion marker for mcp-figma folder)
2. Stage selectively (NEVER `-A`): `git add` on each modified file + `git add -A .opencode/skills/mcp-figma/` (for deletion)
3. Verify pre-existing dirty tree (7 modified + 6 untracked) NOT staged
4. Commit: `chore: remove mcp-figma skill and patch cross-references`

### Phase 3E — Skill advisor regen
1. Invoke `Skill: doctor:skill-advisor :auto`
2. Skill regenerates `skill-graph.json`, `TOKEN_BOOSTS`, `PHRASE_BOOSTS`, etc.
3. Verify regen output: zero `mcp-figma` refs in JSON

### Phase 3F — Verify advisor tests
1. Find the test runner (`run-tests.js` or vitest in `system-spec-kit/mcp_server/skill_advisor/tests/`)
2. Run tests; expect green
3. If failures: investigate (likely fixture-related; re-edit + re-run)

### Phase 3G — Commit 5 (advisor regen)
1. `git diff` — show only advisor regen output
2. Commit: `chore: regenerate skill advisor graph`

### Phase 3H — Branch hygiene (P8 from master plan)
1. `git branch --show-current` — confirm `main`
2. If any feature branch was auto-created: switch back; carry uncommitted; delete branch

### Phase 3I — Verification (opus subagent)
- **Hook E** (re-grep cleanliness): zero `mcp-figma` skill-name hits outside specs/z_archive/z_future + the genericized mcp-code-mode KEEP set; 127 figma-developer-mcp tool refs preserved
- **Hook F** (advisor test suite): test runner exits 0; skill-graph.json clean; routing-fixtures.affordance.test.ts passes
- **Hook G** (branch hygiene): on main; unrelated dirty tree files survive

---

### 4. ARCHITECTURE

### File edit ownership

| File | Edit Tool | Reason |
|---|---|---|
| graph-metadata.json | Claude Edit | JSON, surgical |
| skill-graph.json | Claude Edit | JSON, multiple surgical edits |
| explicit.ts | Claude Edit | TS lines |
| lexical.ts | Claude Edit | TS line |
| routing-fixtures.affordance.test.ts | Claude Edit | TS test |
| skill_advisor.py | Claude Edit | Python lines + value patches |
| smart-router-measurement-report.md | Claude Edit | MD row |
| root README.md | Claude Edit | MD multi-edit |
| skill index README.md | Claude Edit | MD counts + rows |
| 4 mcp-code-mode strips | Claude Edit | MD single-line strips |

cli-codex NOT used in Phase 3 — all edits are surgical and small. Claude Edit is faster + more precise.

### Pre-edit verification (D8 re-grep)

Before any edit, capture current `grep -rn "mcp-figma" Code_Environment/Public/` output. After all edits, verify count drops appropriately.

---

### 5. EXPLORE AGENT 1 MAP (full)

(See spec.md §3 Files to Change for the count summary; this section preserves the full per-line mapping for executor reference.)

| File | Line | Edit type | Note |
|---|---|---|---|
| graph-metadata.json | 18 | DELETE_NODE | edges.enhances entry `{"target":"mcp-figma","weight":0.7,"context":"routes figma integration..."}` |
| graph-metadata.json | 62 | PATCH_VALUE | `causal_summary` 20 → 19 |
| skill-graph.json | 4 | PATCH_VALUE | `"skill_count": 19` → `18` |
| skill-graph.json | 17 | DELETE_NODE | `"mcp-figma"` from mcp family array |
| skill-graph.json | 97 | DELETE_NODE | `"mcp-figma": 0.9` from `mcp-code-mode.prerequisite_for` |
| skill-graph.json | 101-108 | DELETE_NODE | entire `"mcp-figma": { "depends_on": ..., "enhances": ... }` block |
| skill-graph.json | 186 | DELETE_NODE | `"mcp-figma": 0.7` from skill_advisor enhances |
| skill-graph.json | 250-255 | DELETE_NODE | `"mcp-figma": ["figma", "design file", ...]` signal block |
| explicit.ts | 17 | DELETE_LINE | `component: [['mcp-figma', 0.55]]` |
| explicit.ts | 23 | DELETE_LINE | `design: [['mcp-figma', 0.65]]` |
| explicit.ts | 27 | DELETE_LINE | `figma: [['mcp-figma', 1]]` |
| explicit.ts | 137 | DELETE_LINE | `'open the figma': [['mcp-figma', 1]]` |
| lexical.ts | 32 | DELETE_LINE | `'mcp-figma': ['figma design', 'component screenshots', ...]` |
| routing-fixtures.affordance.test.ts | 33 | DELETE_NODE | `skill({ id: 'mcp-figma' })` fixture |
| routing-fixtures.affordance.test.ts | 49, 54-56 | DELETE_NODE | mcp-figma routing test (entire `it()` block) |
| skill_advisor.py | 1396 | DELETE_LINE | `"figma": ("mcp-figma", 2.2)` |
| skill_advisor.py | 1444 | PATCH_VALUE | remove `("mcp-figma", 0.3)` tuple from "export" |
| skill_advisor.py | 1613 | PATCH_VALUE | remove `("mcp-figma", 0.8)` tuple from "figma css" |
| skill_advisor.py | 1937 | PATCH_VALUE | remove "use figma" from phrases list |
| skill_advisor.py | 1938 | PATCH_VALUE | remove "figma" from tokens set |
| smart-router-measurement-report.md | 26 | DELETE_LINE | `\| mcp-figma \| 4 \| 4 \| 100.00% \|` |
| root README.md | 642 | PATCH_VALUE | replace `"use figma to export designs"` example |
| root README.md | 825-829 | DELETE_NODE | mcp-figma subsection (header + description, ~5 lines) |
| root README.md | 1173 | DELETE_LINE | `- **`figma`** (MCP/stdio) - Design files...` |
| root README.md | 1187 | PATCH_VALUE | rewrite `figma.figma_get_file({fileKey:` example |
| .opencode/skills/README.md | 54 | PATCH_VALUE | `Total skill folders 17 → 16` |
| .opencode/skills/README.md | 58 | PATCH_VALUE | `MCP integration skills 4 → 3`; remove `mcp-figma` from list |
| .opencode/skills/README.md | 161 | DELETE_LINE | `| `mcp-figma` | 1.0.7.0 | Figma design file access...` |
| .opencode/skills/README.md | 204 | DELETE_LINE | `├── mcp-figma/ | # Figma design file access via MCP` |
| .opencode/skills/README.md | 258 | DELETE_LINE | `| `mcp-figma` | Yes | Yes | No |` |
| mcp-code-mode/SKILL.md | 476 | DELETE_LINE | "Related skills: `mcp-figma` for Figma access through Code Mode..." |
| mcp-code-mode/README.md | 451 | DELETE_LINE | `| [mcp-figma](../mcp-figma/SKILL.md) | Figma design file access via Code Mode |` |
| mcp-code-mode/references/architecture.md | 514 | DELETE_LINE | `- `mcp-figma` - Figma design file access (via Code Mode)` |
| mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/001-figma-file-metadata.md | 88 | DELETE_LINE | `| `.opencode/skills/mcp-figma/SKILL.md` | Figma MCP tool catalog |` |

---

### 6. VERIFICATION GATES

### Hook E (re-grep cleanliness)
- `grep -rn "mcp-figma" Code_Environment/Public/ --include="*.md" --include="*.json" --include="*.ts" --include="*.js" --include="*.py" --include="*.sh"` — zero hits outside `.opencode/specs/**` + `.opencode/skills/system-spec-kit/z_archive/**` + `.opencode/specs/z_future/**`
- `grep -rn "figma-developer-mcp\|figma\.figma_\|figma_FIGMA_API_KEY" Code_Environment/Public/.opencode/skills/mcp-code-mode/` — ≥120 hits (preserves D1 KEEP set; original was 127)

### Hook F (advisor test suite)
- Find test runner; execute; exit 0
- `grep -c "mcp-figma" skill-graph.json` — 0
- routing-fixtures.affordance.test.ts test runs green

### Hook G (branch hygiene)
- `git -C Public branch --show-current` — `main`
- Pre-existing 7 modified + 6 untracked files surviving
- 2 commits on top: deletion+patches, advisor regen

---

### 7. ROLLBACK

| Trigger | Action |
|---------|--------|
| Edit fails on a file | Manual fix; re-stage |
| rm -rf fails (permission?) | Resolve permissions; retry |
| Commit 4 has unrelated files staged | Reset; restage selectively |
| Advisor regen produces unexpected scores | Review diff; if intentional shift accept; if bug rollback Commit 5 |
| Advisor tests fail | Investigate; likely fixture-related; re-edit; re-run |
| Hook E reveals leftover mcp-figma hit | Identify file; apply edit; re-verify |
