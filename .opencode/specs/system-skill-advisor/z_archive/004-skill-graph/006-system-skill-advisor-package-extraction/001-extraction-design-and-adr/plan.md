---
title: "Implementation Plan: Design + ADR for skill advisor extraction"
description: "Survey consumers, enumerate shapes, evaluate, pick, write ADR-001."
trigger_phrases:
  - "advisor extraction design plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr"
    last_updated_at: "2026-05-14T02:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Design + ADR for skill advisor extraction

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Whole-repo read-only survey of the advisor surface (source + consumers + tool registrations + docs), enumerate 3-4 architectural shapes, evaluate each on 6 criteria, pick one, write ADR-001, produce research artifact, update parent phase spec with chosen sequence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 015 line shipped on main.
- [x] 008-template-levels available for downstream skill-folder scaffold reference.

### Definition of Done
- [x] Survey markdown lists every advisor consumer.
- [x] ADR-001 names the chosen shape + alternatives table.
- [x] Parent phase spec updated.
- [x] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research output |
| **Framework** | Spec Kit Level 2 packet |
| **Storage** | `research/extraction-survey.md` + `decision-record.md` |
| **Testing** | Strict spec validate |

### Approach
1. Read `mcp_server/skill_advisor/` to inventory every file, organized by purpose (handlers / lib / scorer / schemas / tests / data / scripts / feature_catalog / manual_testing_playbook / references).
2. Grep wide for consumers: `git grep -l "advisor_recommend\|advisor_rebuild\|advisor_status\|advisor_validate\|skill_advisor\|skillAdvisor"` covering mcp_server, plugins, agents, commands, install_guides, hooks, scripts, .opencode/bin, AGENTS.md, CLAUDE.md.
3. Inventory tool registrations: read `mcp_server/tool-schemas.ts` and `mcp_server/context-server.ts` for advisor tool definitions, schemas, handler bindings.
4. Enumerate candidate shapes (codex's call; 3-4 minimum):
   - **A** Own MCP server (separate launcher cjs, separate dist, separate process)
   - **B** Co-resident with system-spec-kit MCP server (folder moves; runtime unchanged)
   - **C** Stub-in-new-folder that re-exports from old paths (transitional)
   - **D** Split lib vs tools (lib stays, tool layer moves)
5. Score each on:
   - **C1** Developer ergonomics
   - **C2** MCP server topology (process count, startup, IPC)
   - **C3** Tool-id stability
   - **C4** Backwards-compat path
   - **C5** Test isolation
   - **C6** Launcher / install complexity
6. Pick winner; document rationale; record rejected alternatives.
7. Write ADR-001 + research markdown.
8. Update parent phase `spec.md` "What Needs Done" to reflect the chosen migration sequence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory the advisor source tree.
- Inventory all consumers via grep.

### Phase 2: Implementation
- Enumerate 3-4 shapes.
- Score on 6 criteria.
- Pick winner.
- Write ADR-001 in `decision-record.md`.
- Write research artifact at `research/extraction-survey.md`.
- Update parent phase `spec.md`.

### Phase 3: Verification
- Strict spec validate this packet + parent 016.
- Cross-check ADR alternatives table has ≥ 3 rows.
- Cross-check survey lists ≥ 1 consumer per discovered call type.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Coverage | Survey lists every consumer | Manual diff against `git grep advisor_` count |
| ADR completeness | All required sections present | Manual read |
| Strict | Spec packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 015 line shipped.
- 008-template-levels for downstream skill-folder scaffold template knowledge.
- Whole-repo read access.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert deletes this packet folder. No production state changes. Parent phase `spec.md` revert restores prior "What Needs Done" content.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | 015 line shipped | Stable advisor before migration |
| Phase 2 | Phase 1 | Author after survey |
| Phase 3 | Phase 2 | Verify after authoring |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Survey inventory | ~150 lines markdown |
| Shape enumeration + score table | ~200 lines markdown |
| ADR-001 | ~250 lines markdown |
| Parent phase spec update | ~30 lines markdown |
| **Total** | **~630 lines doc, 0 LOC code** |

cli-codex gpt-5.5 xhigh dispatch: 15-25 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Survey discovers a consumer that breaks one of the candidate shapes.
- ADR-001 reveals the migration is not feasible without a prerequisite packet.

### Recovery
1. Revert this commit.
2. Mark parent phase blocked.
3. Author the prerequisite packet first.

### Data Safety
No production state changes. Revert is byte-for-byte.
<!-- /ANCHOR:enhanced-rollback -->
