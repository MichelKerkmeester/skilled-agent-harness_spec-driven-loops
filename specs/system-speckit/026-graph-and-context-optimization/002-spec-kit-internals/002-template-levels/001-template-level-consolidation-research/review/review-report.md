# Deep Review Report: 001-template-level-consolidation-research

**Date**: 2026-05-04
**Spec Folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/001-template-level-consolidation-research`
**Review Mode**: auto (5 iterations, all dimensions covered)
**Stop Reason**: max_iterations_reached (5 of 5)
**Lineage**: new (generation 1)
**Resource Map**: not present at init; coverage gate skipped

---

## Verdict

**CONDITIONAL** — 16 P1 findings across 5 dimensions, 0 P0 findings. The investigation packet's spec and research describe a CORE+ADDENDUM+compose.sh architecture that no longer exists in the codebase. The actual implementation uses a manifest-based system (`templates/manifest/*.tmpl`, `inline-gate-renderer.ts`, `spec-kit-docs.json`) that already implements the spirit of the PARTIAL consolidation recommendation. However, the manifest system has correctness gaps in template rendering (missing ANCHORs, misplaced anchors, level-gate gaps), validator blind spots (sectionGate-to-template cross-validation missing), and code defects (silent error swallowing, JSON injection, path fallback gaps).

| Severity | Count | Blocking |
|----------|-------|----------|
| **P0** | 0 | No |
| **P1** | 16 | Yes — CONDITIONAL verdict |
| **P2** | 10 | No — advisories only |

---

## Iteration Summary

| Iteration | Dimension | P0 | P1 | P2 | newFindingsRatio | Status |
|-----------|-----------|----|----|----|:---:|--------|
| 001 | implementation-spec-alignment | 0 | 4 | 2 | 1.00 | complete |
| 002 | code-correctness | 0 | 3 | 2 | 1.00 | complete |
| 003 | template-rendering-correctness | 0 | 4 | 2 | 0.69 | complete |
| 004 | validator-coverage | 0 | 3 | 2 | 0.77 | complete |
| 005 | cross-runtime-mirror-consistency | 0 | 2 | 2 | 0.56 | complete |

---

## Findings

### P1 — Correctness / Spec-Implementation Mismatches (16)

#### Dimension: implementation-spec-alignment (4 P1)

**P1-001-001**: `compose.sh` — central file in spec and research — does not exist. Spec.md:81 describes it as the template composer; research.md:58 recommends extending it. Actual renderer is `inline-gate-renderer.ts`.
- [SOURCE: spec.md:81, research.md:58, glob compose* = 0 matches]

**P1-001-002**: `templates/core/` and `templates/addendum/` directories do not exist. Spec.md:56 describes CORE + ADDENDUM v2.2 architecture. Actual storage is `templates/manifest/` with `.tmpl` files and `spec-kit-docs.json`.
- [SOURCE: spec.md:56, spec.md:115-116, templates/ directory listing]

**P1-001-003**: `templates/level_1/` through `templates/level_3+/` output directories do not exist. Spec.md:81 describes them as materialized compilation outputs; the manifest renderer produces output on demand without persistent level directories.
- [SOURCE: spec.md:81, glob templates/level_* = 0 matches]

**P1-001-004**: `wrap-all-templates.{ts,sh}` does not exist. Spec scope table lists both as investigation targets. Actual ANCHOR handling lives in `template-structure.js` and `inline-gate-renderer.ts`.
- [SOURCE: spec.md:118-119, glob wrap-all-templates* = 0 matches]

#### Dimension: code-correctness (3 P1)

**P1-002-001**: `copy_templates_batch` silently returns success on renderer failure. Bash `!` operator flips exit code — when the renderer fails, `if ! "$renderer" ...; then return $?` returns 0 instead of the actual failure code. Called at create.sh:1527 where `||` guard never triggers.
- [SOURCE: template-utils.sh:147-149, create.sh:1527]

**P1-002-002**: `create_graph_metadata_file` JSON injection via unescaped user input. Only double-quotes are escaped (`${summary_text//\"/\\\"}`); backslashes and newlines produce invalid JSON in `graph-metadata.json`.
- [SOURCE: create.sh:449, create.sh:312-316, create.sh:430-457]

**P1-002-003**: `getManifestPath` in template-structure.js lacks path fallback. Hardcodes `path.join(templatesRoot, 'manifest', 'spec-kit-docs.json')` while `level-contract-resolver.ts` implements fallback to an alternate path. Different resolution behavior between JS and TS consumers.
- [SOURCE: template-structure.js:128-130, level-contract-resolver.ts:78-86]

#### Dimension: template-rendering-correctness (4 P1)

**P1-003-001**: `spec.md.tmpl` L3/3+ blocks render without `<!-- ANCHOR:risk-matrix -->` and `<!-- ANCHOR:user-stories -->` wrappers that `spec-kit-docs.json` sectionGates declare for levels 3 and 3+. Rendered output at L3 contains 7 ANCHOR pairs instead of the expected 9.
- [SOURCE: spec.md.tmpl:517-535, spec-kit-docs.json:499-506]

**P1-003-002**: `spec.md.tmpl` has misplaced `/ANCHOR:questions` — closes 127 lines late in the L3+ block, wrapping `approval-workflow`, `compliance-checkpoints`, `stakeholder-matrix`, and `change-log` ANCHOR blocks as nested children. `parseAnchoredSections()` uses first-match closing strategy, making interior ANCHORs invisible.
- [SOURCE: spec.md.tmpl:718,845, template-structure.js:363-397]

**P1-003-003**: `tasks.md.tmpl` missing dedicated Level 3 gate. Three gates exist: `<!-- IF level:1 -->`, `<!-- IF level:2 -->`, `<!-- IF level:3+ -->`. Level 3 renders identically to Level 1 (106 lines) because no gate matches `level:3`. `spec-kit-docs.json` declares `architecture-tasks` for `["3","3+"]` but the template can never show it at Level 3.
- [SOURCE: tasks.md.tmpl:1,109,325, spec-kit-docs.json:406]

**P1-003-004**: `implementation-summary.md.tmpl` has same Level 3 gate gap — three gates (`level:1`, `level:2`, `level:3+`) with no `level:3` gate. Rendered L3 output (135 lines) matches L1/L2 with no `architecture-summary` ANCHOR.
- [SOURCE: implementation-summary.md.tmpl:1,138,412, spec-kit-docs.json:415]

#### Dimension: validator-coverage (3 P1)

**P1-004-001**: ANCHORS_VALID derives its contract from template content only — `loadTemplateContract()` extracts ANCHORs by parsing the rendered `.tmpl` file, never cross-referencing `spec-kit-docs.json` sectionGates. Template ANCHOR omissions (P1-003-001 through P1-003-004) are structurally invisible to validation.
- [SOURCE: template-structure.js:420-501, check-anchors.sh:190-192]

**P1-004-002**: Template IF gate conditions are never validated against sectionGates level arrays. A template can restrict content below what the sectionGate contract entitles (e.g., `level:3+` gate excluding Level 3) without triggering any validator warning.
- [SOURCE: spec-kit-docs.json sectionGates, no cross-validation function found]

**P1-004-003**: `parseAnchoredSections()` uses first-match closing-tag strategy, making nested ANCHOR blocks invisible. The misplaced `/ANCHOR:questions` from P1-003-002 causes 4 independent sectionGates to vanish from validation scope.
- [SOURCE: template-structure.js:363-397]

#### Dimension: cross-runtime-mirror-consistency (2 P1)

**P1-005-001**: Code agent terminology drift — `.opencode/agents/code.md` canonical uses "resolved route"/"router-selected guidance set"; `.claude/agents/code.md` and `.gemini/agents/code.md` use "detected stack"/"overlay" at the same line positions. This could cause divergent `@code` agent behavior on CLAUDE/GEMINI runtimes.
- [SOURCE: .opencode/agents/code.md:179,311 vs .claude/agents/code.md:179,311 vs .gemini/agents/code.md:179,311]

**P1-005-002**: Stale `templates/level_1/` paths in `create_agent_auto.yaml` and `create_agent_confirm.yaml`. Both command YAMLs reference `templates/level_1/spec.md` and `templates/level_1/plan.md` which no longer exist in the manifest-based template system.
- [SOURCE: create_agent_auto.yaml, create_agent_confirm.yaml]

### P2 — Advisories (10)

| ID | Dimension | Description | Source |
|----|-----------|-------------|--------|
| P2-001-001 | spec-alignment | `create.sh` header describes outdated CORE+ADDENDUM architecture | create.sh:7-10 |
| P2-001-002 | spec-alignment | `get_level_templates_dir` maps to non-existent directories | template-utils.sh:37-47 |
<!-- /ANCHOR: risk-matrix -->
<!-- /ANCHOR: user-stories -->