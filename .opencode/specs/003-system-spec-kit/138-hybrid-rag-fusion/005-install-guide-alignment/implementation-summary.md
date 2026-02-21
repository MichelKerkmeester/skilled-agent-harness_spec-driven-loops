# Implementation Summary: Install Guide Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

---

<!-- ANCHOR:overview -->
## Overview

All 4 INSTALL_GUIDE.md files across the OpenCode skill system were rewritten to align with the latest `install_guide_template.md` structure, comply with HVR (Human Voice Rules), and document new features from specs 136, 138 and 139. The work was executed by 5 parallel sonnet agents with a final consistency review pass.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:files-modified -->
## Files Modified

| File | Change Type | Description |
|------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Major rewrite | v3.0.0: New feature flags, skill graph system, graph enrichment, behavior changes, HVR compliance, template alignment |
| `.opencode/skill/mcp-chrome-devtools/INSTALL_GUIDE.md` | Moderate rewrite | v2.1.0 update: Fixed broken Code Mode cross-reference, HVR compliance, template alignment, added formal validation checkpoints |
| `.opencode/skill/mcp-code-mode/INSTALL_GUIDE.md` | Moderate rewrite | v2.0.0: HVR compliance, template alignment, added version number, standardized checkpoints |
| `.opencode/skill/mcp-figma/INSTALL_GUIDE.md` | Moderate rewrite | v2.0.0 update: Fixed outdated cross-references (removed broken Narsil link), HVR compliance, template alignment |

## Files Created

| File | Description |
|------|-------------|
| `005-install-guide-alignment/spec.md` | Feature specification |
| `005-install-guide-alignment/plan.md` | Implementation plan |
| `005-install-guide-alignment/tasks.md` | Task breakdown (13 tasks, all complete) |
| `005-install-guide-alignment/checklist.md` | Verification checklist with evidence |
| `005-install-guide-alignment/scratch/consistency-criteria.md` | Cross-guide consistency criteria and HVR grep patterns |
<!-- /ANCHOR:files-modified -->

---

<!-- ANCHOR:verification -->
## Verification Steps Taken

1. **HVR Hard-Blocker Scan**: grep for 21 banned words across all 4 INSTALL_GUIDE.md files. Result: 0 matches (1 "Robust" found and fixed in Code Mode guide).
2. **Em Dash Scan**: grep for em dash patterns. Result: 0 matches.
3. **Semicolon Audit**: 260 semicolons found, all inside code blocks (JSON, TypeScript, bash). Zero prose semicolons.
4. **Template Structure**: grep for `^## [0-9]+\.` confirmed sections 0-10 present in correct order in all 4 guides.
5. **Checkpoint Naming**: All checkpoints standardized to `### Validation: \`phase_N_complete\`` format. Fixed 5 inconsistent "Checkpoint:" labels in Chrome DevTools and 1 "Success Criteria:" label in Figma.
6. **STOP Blocks**: 16 total across 4 guides.
7. **Version History**: All 4 guides now have Version History tables.
8. **Quick Reference**: All 4 guides have Quick Reference sections.
9. **Cross-References**: Fixed 3 broken links (Chrome DevTools self-reference, Figma Narsil reference removed, Figma Code Mode reference fixed).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Deviation | Reason |
|-----------|--------|
| Phase 004 predecessor not validated | Phase 004 (command-alignment) is empty. User explicitly specified phase 005 for this task. |
| Semicolons counted but not removed from code blocks | HVR rules apply to prose only. Code block semicolons are syntactically required. |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:new-features -->
## New Content Added to Spec Kit Memory Guide (v3.0.0)

### Feature Flags (from specs 136/138)
- `SPECKIT_GRAPH_UNIFIED` (default ON) - Controls entire graph channel
- `SPECKIT_GRAPH_MMR` (default ON) - Controls Graph-Guided MMR reranking
- `SPECKIT_GRAPH_AUTHORITY` (default ON) - Controls Structural Authority Propagation
- `SPECKIT_ADAPTIVE_FUSION` (default OFF) - Adaptive intent-based fusion weights
- `SPECKIT_EXTENDED_TELEMETRY` (default ON) - 4-dimension per-retrieval telemetry

### Skill Graph System (from spec 138)
- 72 graph nodes across 9 skills documented
- SGQS in-process query engine described
- 5-minute TTL cache performance noted
- `check-links.sh` validation script referenced
- Graph enrichment pipeline (Step 7.6 in workflow.ts)

### Behavior Changes (from specs 136/138)
- Causal graph channel now active on every query
- Cross-encoder reranking enabled by default
- Co-activation spreading now applies boosts (bug fix)
- Query expansion on `mode="deep"` searches
- Evidence gap warnings on low-confidence retrieval
- MMR reranking with intent-mapped lambda values

### Phase System Support (from spec 139)
- `--recursive` flag in validate.sh
- Phase detection scoring in recommend-level.sh
<!-- /ANCHOR:new-features -->

---

<!-- ANCHOR:next-steps -->
## Recommended Next Steps

1. **Phase 4 items**: When PageRank and structure-aware chunker are wired (requiring `remark`/`remark-gfm`), update Spec Kit Memory guide again
2. **Browser testing**: Verify install procedures work end-to-end for each guide
3. **Skill graph node**: Consider adding an `install-guides.md` node to the workflows-documentation skill graph
<!-- /ANCHOR:next-steps -->

---
