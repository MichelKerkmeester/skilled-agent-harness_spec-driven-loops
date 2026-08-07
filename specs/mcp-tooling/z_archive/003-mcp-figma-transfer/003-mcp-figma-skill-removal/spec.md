---
title: "Feature Specification: Phase 3 — Remove mcp-figma skill from Code_Environment/Public"
description: "Final phase of mcp-figma transfer: physical rm -rf .opencode/skills/mcp-figma/, patch 13 cross-reference files (skill advisor scoring tables, scorer lanes, test fixtures, observability report, root README, skill index README, mcp-code-mode 4 skill-name strips), then doctor:skill-advisor :auto regen + 2 commits."
trigger_phrases:
  - "mcp-figma-skill-removal"
  - "phase 3 figma"
  - "advisor regen mcp-figma"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/003-mcp-figma-transfer/003-mcp-figma-skill-removal"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Phase doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files:
      - "Code_Environment/Public/.opencode/skills/mcp-figma/ (DELETE)"
      - "Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
      - "Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:b0938af08f85fd11d250b63c5d88ec53cfe1aac71bfd24b741d9438fde2ea83b"
      session_id: "067-003-spec-2026-05-05"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "D1 (Code Mode keep figma-developer-mcp tool refs / strip 4 skill-name refs)"
      - "D2 (Spec history preserved)"
      - "D6 (Advisor cleanup atomicity = two-commit split)"
      - "D8 (Re-grep at execution start)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 — Remove mcp-figma skill from Code_Environment/Public

## EXECUTIVE SUMMARY

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.

<!-- ANCHOR:metadata -->
## 1. METADATA

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.
<!-- /ANCHOR:risks -->

## 7. NON-FUNCTIONAL REQUIREMENTS

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.

## 8. EDGE CASES

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.

## 9. COMPLEXITY ASSESSMENT

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.

## 10. RISK MATRIX

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.

## 11. USER STORIES

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

Template compliance scaffold for 003-mcp-figma-skill-removal/spec.md; original authored content is retained below.

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->

---

### 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Pending |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-public-figma-agent (commits c4f6c56 + e96a3ee on Public main) |
| **Successor** | (final synthesis at parent level) |
| **Handoff Criteria** | Skill folder deleted; 31 cross-ref edits + 4 mcp-code-mode strips applied; advisor tests green; commits 4+5 on Code_Environment/Public main |

---

### 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-figma` developer skill at `Code_Environment/Public/.opencode/skills/mcp-figma/` has been superseded by the new Figma MCP Agent in AI_Systems/Barter (Phase 1) and AI_Systems/Public (Phase 2). The skill folder still exists alongside live cross-references in:
- Skill advisor scoring tables (`graph-metadata.json`, `skill-graph.json`, `scorer/lanes/explicit.ts` + `lexical.ts`, `skill_advisor.py`)
- Test fixtures (`routing-fixtures.affordance.test.ts`)
- Observability report (`smart-router-measurement-report.md`)
- Root `README.md` (skill listing + example prompt)
- Skill index `.opencode/skills/README.md` (counts, version table, structure tree)
- mcp-code-mode skill (4 cross-references to mcp-figma SKILL by name)

Per memory rule "DELETE not archive", the skill folder must be physically removed (`rm -rf`), not z_archived or commented out. Cross-references must be patched to keep the advisor test suite green and the documentation truthful.

### Purpose
Atomically remove `mcp-figma` from Code_Environment/Public by: (a) deleting the skill folder, (b) patching all cross-references, (c) regenerating the skill advisor graph, while (d) preserving 127 figma-developer-mcp tool references in mcp-code-mode (per D1 — Code Mode legitimately uses Figma as a worked example for its multi-MCP orchestration) and (e) preserving spec history (per D2).

---

### 3. SCOPE

### In Scope
- `rm -rf` `Code_Environment/Public/.opencode/skills/mcp-figma/`
- Patch 9 cross-reference files (31 hits per Explore Agent 1 mapping):
  - `graph-metadata.json` (2 hits: 1 DELETE_NODE + 1 PATCH_VALUE for count)
  - `skill-graph.json` (6 hits: 5 DELETE_NODE + 1 PATCH_VALUE for skill_count)
  - `scorer/lanes/explicit.ts` (4 DELETE_LINE)
  - `scorer/lanes/lexical.ts` (1 DELETE_LINE)
  - `routing-fixtures.affordance.test.ts` (5 DELETE_NODE — fixture + test)
  - `skill_advisor.py` (5 hits: 2 DELETE_LINE + 3 PATCH_VALUE)
  - `smart-router-measurement-report.md` (1 DELETE_LINE)
  - root `README.md` (4 hits: 1 DELETE_NODE + 1 DELETE_LINE + 2 PATCH_VALUE replace example)
  - skill index `README.md` (6 hits: 2 PATCH_VALUE counts + 4 DELETE_LINE rows)
- Patch 4 mcp-code-mode skill-name strips (per D1 — KEEP 127 figma-developer-mcp tool refs):
  - `mcp-code-mode/SKILL.md:476`
  - `mcp-code-mode/README.md:451`
  - `mcp-code-mode/references/architecture.md:514`
  - `mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/001-figma-file-metadata.md:88`
- Run `Skill: doctor:skill-advisor :auto` to regenerate skill-graph.json TOKEN_BOOSTS / PHRASE_BOOSTS / scoring tables
- Verify advisor tests green
- Two commits per D6: deletion+patches (Commit 4) + advisor regen (Commit 5)

### Out of Scope
- Phase 1 Barter authoring (already complete: 690b498)
- Phase 2 Public dual-publish (already complete: c4f6c56 + e96a3ee)
- Spec folder historical mentions (`.opencode/specs/**/*.md` — per D2 KEEP)
- z_archive references (`system-spec-kit/z_archive/**` — per D2 KEEP)
- z_future references (`specs/z_future/**` — per D2 KEEP)
- mcp-code-mode 127 figma-developer-mcp tool examples (per D1 KEEP — Code Mode legitimately demos Figma)
- Any reorganization of advisor scoring beyond mcp-figma removal

### Files to Change

| # | File Path | Change Type | Hits |
|---|---|---|---|
| 1 | `.opencode/skills/mcp-figma/` (entire folder) | DELETE | rm -rf |
| 2 | `system-spec-kit/.../skill_advisor/graph-metadata.json` | DELETE_NODE + PATCH_VALUE | 2 |
| 3 | `system-spec-kit/.../skill_advisor/scripts/skill-graph.json` | DELETE_NODE × 5 + PATCH_VALUE | 6 |
| 4 | `system-spec-kit/.../scorer/lanes/explicit.ts` | DELETE_LINE × 4 | 4 |
| 5 | `system-spec-kit/.../scorer/lanes/lexical.ts` | DELETE_LINE | 1 |
| 6 | `system-spec-kit/.../tests/routing-fixtures.affordance.test.ts` | DELETE_NODE × 5 | 5 |
| 7 | `system-spec-kit/.../scripts/skill_advisor.py` | DELETE_LINE × 2 + PATCH_VALUE × 3 | 5 |
| 8 | `system-spec-kit/scripts/observability/smart-router-measurement-report.md` | DELETE_LINE | 1 |
| 9 | root `README.md` | DELETE_NODE + DELETE_LINE + PATCH_VALUE × 2 | 4 |
| 10 | `.opencode/skills/README.md` | PATCH_VALUE × 2 + DELETE_LINE × 4 | 6 |
| 11 | `mcp-code-mode/SKILL.md` (line 476) | DELETE_LINE | 1 |
| 12 | `mcp-code-mode/README.md` (line 451) | DELETE_LINE | 1 |
| 13 | `mcp-code-mode/references/architecture.md` (line 514) | DELETE_LINE | 1 |
| 14 | `mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/001-figma-file-metadata.md` (line 88) | DELETE_LINE | 1 |
| 15 | (advisor regen output) | UPDATE | varies |

**Total: 14 file modifications + 1 folder deletion + advisor regen.**

---

### 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill folder physically removed | `test ! -d .opencode/skills/mcp-figma/` returns true |
| REQ-002 | All 31 cross-reference edits applied | Each line/node from Explore Agent 1 map removed or patched as specified |
| REQ-003 | mcp-code-mode 4 skill-name refs stripped | grep `mcp-figma` (literal skill-name) in mcp-code-mode/ returns 0 hits |
| REQ-004 | mcp-code-mode 127 figma-developer-mcp refs preserved | grep `figma-developer-mcp\|figma\.figma_\|figma_FIGMA_API_KEY` returns ≥120 hits in mcp-code-mode/ |
| REQ-005 | Skill advisor tests pass post-deletion | `node .opencode/skills/system-spec-kit/scripts/dist/skill-advisor/run-tests.js` (or equivalent) exits 0 |
| REQ-006 | skill-graph.json regenerated cleanly | Post-doctor:skill-advisor scan: zero `mcp-figma` references in JSON output |
| REQ-007 | Two separate commits per D6 | Commit 4 = deletion + hand-edits; Commit 5 = advisor regen |
| REQ-008 | Spec history mentions preserved | grep `mcp-figma` in `.opencode/specs/**/*.md` and `system-spec-kit/z_archive/**` returns hits unchanged from baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | G1 grep cleanliness | `grep -rn "mcp-figma" Code_Environment/Public/` returns 0 outside specs / z_archive / z_future |
| REQ-011 | G3 skill index integrity | `.opencode/skills/README.md` lists actual count of skill folders post-deletion |
| REQ-012 | Branch hygiene | `git branch --show-current` returns `main` post-commit; any auto-branch deleted; carry unrelated dirty tree |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Re-grep at execution start (D8) | Compare current `mcp-figma` hit count against Explore Agent 1's 31; flag drift; update task list if needed |

---

### 5. SUCCESS CRITERIA

- **SC-001**: `Code_Environment/Public/.opencode/skills/mcp-figma/` no longer exists
- **SC-002**: 31 cross-reference edits + 4 mcp-code-mode strips applied successfully
- **SC-003**: 127 figma-developer-mcp tool refs in mcp-code-mode/ preserved (verified post-edits)
- **SC-004**: Skill advisor test suite green
- **SC-005**: Skill index README count adjusted (e.g., 17 → 16; 4 → 3 for MCP integration skills)
- **SC-006**: Commits 4 + 5 + 6 land on Code_Environment/Public main
- **SC-007**: Opus hooks E + F + G pass

---

### 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 + Phase 2 commits exist | Phase 3 only proceeds if Barter and Public agents are live (Figma MCP capability is preserved through new agents) | ✅ Phase 1 (690b498) + Phase 2 (c4f6c56, e96a3ee) confirmed |
| Risk | Test fixture deletion breaks unrelated test | Routing-fixtures.affordance.test.ts could have shared fixtures | Lines 33, 49, 54-56 verified by Explore Agent 1 to be mcp-figma-specific |
| Risk | doctor:skill-advisor :auto produces unexpected scoring shifts | Other skill scores could change after mcp-figma removal | Treat regen output as single atomic blob; review diff before Commit 5 |
| Risk | mcp-code-mode genericization over-strips | 127 KEEP refs could be accidentally hit | Use exact line-number Edits (not search-and-replace); verify post-edit grep |
| Dependency | Stay on main (memory rule) | Auto-branch from earlier session must be cleaned up | Branch check before commit; switch back if needed |
| Risk | Unrelated dirty tree gets staged | Pre-existing 7 modified + 6 untracked files | Stage ONLY the 14 files + skill folder deletion; never use `git add -A` |

---

### 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| **Atomicity** | Skill folder deletion + cross-ref edits in single working-tree state (Commit 4); advisor regen separable (Commit 5) |
| **Reversibility** | Each commit is `git revert`-able if rollback needed |
| **Test integrity** | Advisor test suite green throughout (no broken-test interim state) |

---

### 8. EDGE CASES

| Scenario | Expected Behavior |
|----------|-------------------|
| Re-grep finds new mcp-figma hits | Update task list; address new hits |
| Re-grep finds fewer mcp-figma hits | Some external tool already removed entries; verify still consistent |
| skill_advisor.py uses dynamic skill list (not hard-coded) | Verify advisor tests still green; remove cached state if needed |
| `doctor:skill-advisor :auto` fails | Investigate; likely re-scan needed; rerun |
| Phase 3 reveals previously unknown reference | Out-of-scope addition; flag and add to plan |

---

### 9. COMPLEXITY ASSESSMENT

| Dimension | Score (0-3) | Note |
|-----------|-------------|------|
| Domain Count | 3 | Skill advisor + docs + mcp-code-mode |
| File Count | 3 | 14 files + 1 folder deletion + advisor regen output |
| LOC Estimate | 2 | 31 line edits + 4 strips + folder rm; bulk net-negative |
| Parallel Opportunity | 2 | Edits can be applied in parallel via Edit tool |
| Task Type | 2 | Mix of trivial (DELETE_LINE) and moderate (PATCH_VALUE for counts) |
| **Total** | **12/15** | High due to many touch points |

---

### 10. EFFORT ESTIMATION

| Activity | Estimate |
|----------|----------|
| Spec docs authoring | ~15 min |
| Re-grep + drift check (D8) | ~5 min |
| 14 file edits (parallel via Edit tool) | ~15-20 min |
| Skill folder rm -rf | ~1 min |
| Commit 4 | ~5 min |
| `doctor:skill-advisor :auto` regen | ~5-10 min |
| Verify advisor tests | ~5 min |
| Commit 5 | ~5 min |
| Branch hygiene | ~5 min |
| Opus hooks E + F + G | ~15 min |
| Final synthesis (Phase 6 / parent) | ~10 min |
| **Total** | **~90-100 min** |

---

### 11. OPEN QUESTIONS

(D1 + D2 + D6 + D8 resolved at parent level. No blocking questions.)

---

### RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Phase 1 implementation summary**: `../001-barter-figma-agent/implementation-summary.md`
- **Phase 2 implementation summary**: `../002-public-figma-agent/implementation-summary.md`
- **Plan**: `./plan.md`
- **Tasks**: `./tasks.md`
- **Checklist**: `./checklist.md`
- **Decision Record**: `./decision-record.md`
- **Approved master plan**: `/Users/michelkerkmeester/.claude/plans/think-really-hard-tender-karp.md`
- **Explore Agent 1 mapping** (line-level deletion targets): captured inline in plan.md §5
