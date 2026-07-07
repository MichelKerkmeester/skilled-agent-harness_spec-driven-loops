---
title: "Implementation Plan: Design + ADR for code-graph extraction"
description: "Survey consumers, run 10-iteration deep-research, synthesize resource map and ADR-001."
trigger_phrases:
  - "code graph extraction design plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/006-extraction-and-isolation/002-extraction-design-and-decision-record"
    last_updated_at: "2026-05-14T07:00:38Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Author deep-research config and dispatch 10-iter loop"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Design + ADR for code-graph extraction

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Whole-repo read-only survey of the code-graph surface (source + consumers + tool registrations + docs), run a 10-iteration deep-research loop, synthesize `resource-map.md`, write ADR-001 with the 8 decisions, update parent phase spec with the locked sequence, and strict-validate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 005-code-graph-backend-resilience shipped on main.
- [x] 010-broader-excludes-and-granular-skills shipped on main.
- [x] 008-template-levels available for downstream skill-folder scaffold reference.

### Definition of Done
- [ ] Deep-research loop converged or recorded stop reason.
- [ ] `resource-map.md` lists every code-graph touchpoint category.
- [ ] ADR-001 names all 8 decisions + alternatives table.
- [ ] Parent phase 014 spec updated.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research output |
| **Framework** | Spec Kit Level 2 packet |
| **Storage** | `research/research.md` + `resource-map.md` + `decision-record.md` |
| **Testing** | Strict spec validate |

### Approach
1. Inventory `.opencode/skills/system-spec-kit/mcp_server/code_graph/` by directory + file purpose.
2. Grep whole repo for code-graph consumers: `code_graph_*`, `ccc_*`, `detect_changes`, `getGraphFreshness`, `getGraphReadinessSnapshot`, `classifyQueryIntent`, `buildContext`, `runtime-detection`, `code-graph-db`.
3. Inventory tool registrations in `mcp_server/tool-schemas.ts` + `context-server.ts`.
4. Author `research/deep-research-config.json` (10-iter cap, cli-opencode + deepseek-v4-pro executor, `--pure` flag, convergence criteria from deep-research SKILL).
5. Dispatch `/deep:start-research-loop :auto` from inside this packet.
6. Post-convergence: synthesize `resource-map.md` (peer to `research/research.md`) and `decision-record.md` (ADR-001 with 8 decisions + alternatives table).
7. Update parent 014 `spec.md` "What Needs Done" with locked sequence.
8. Strict-validate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory the code-graph source tree.
- Inventory all consumers via grep.
- Inventory tool registrations and category-22 docs.

### Phase 2: Implementation
- Author deep-research config.
- Dispatch and monitor the 10-iteration loop.
- Synthesize `research/research.md`.
- Author `resource-map.md`.
- Author `decision-record.md` ADR-001 with 8 decisions + alternatives table.
- Update parent phase `spec.md`.

### Phase 3: Verification
- Strict spec validate this packet + parent 014.
- Cross-check ADR alternatives table covers all 8 decisions.
- Cross-check resource-map covers all target categories.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Coverage | Resource map lists every code-graph touchpoint category | Manual diff against grep and repo inventory |
| ADR completeness | All 8 decisions present | Manual read |
| Strict | Spec packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 005-code-graph-backend-resilience shipped.
- 010-broader-excludes-and-granular-skills shipped.
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
| Phase 1 | 008 + 011 shipped | Stable code-graph before extraction design |
| Phase 2 | Phase 1 | Author after survey baseline exists |
| Phase 3 | Phase 2 | Verify after authoring |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Survey inventory | ~400 lines markdown |
| Deep-research synthesis | ~800 lines markdown |
| Resource map | ~500 lines markdown |
| ADR-001 | ~300 lines markdown |
| Parent phase spec update | ~30 lines markdown |
| **Total** | **~2000 lines doc, 0 LOC code** |

Deep-research dispatch: ~2-4 hours wall clock.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Research discovers a consumer that breaks one of the candidate shapes.
- ADR-001 reveals the migration is not feasible without a prerequisite packet.

### Recovery
1. Revert this commit.
2. Mark parent phase blocked.
3. Author the prerequisite packet first.

### Data Safety
No production state changes. Revert is byte-for-byte.
<!-- /ANCHOR:enhanced-rollback -->
