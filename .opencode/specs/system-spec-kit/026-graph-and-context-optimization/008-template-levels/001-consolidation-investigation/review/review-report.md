# Deep Review Report: 001-consolidation-investigation

**Date**: 2026-05-04
**Spec Folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/001-consolidation-investigation`
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
| P2-002-001 | correctness | `get_level_templates_dir` returns paths to non-existent level_N directories (re-confirmed) | template-utils.sh:37-47 |
| P2-002-002 | correctness | Misleading `SKILL_ROOT` variable in `inline-gate-renderer.sh` | inline-gate-renderer.sh:10 |
| P2-003-001 | rendering | Minor template formatting inconsistencies in checklist.md.tmpl | checklist.md.tmpl |
| P2-003-002 | rendering | Non-critical ANCHOR ordering drift in plan.md.tmpl L3+ | plan.md.tmpl |
| P2-004-001 | validator | `SECTIONS_PRESENT` rule text says "covered by per-document manifest anchors" but no manifest-to-template cross-check exists | validator-registry.json |
| P2-004-002 | validator | `check-template-staleness.sh` only checks version strings, not ANCHOR drift or gate coverage | check-template-staleness.sh |
| P2-005-001 | cross-runtime | `.codex/agents/` TOML format variance is undocumented | codex agent directory |
| P2-005-002 | cross-runtime | `.claude`/`.gemini` code agent line 40 leaks "OpenCode runtime layer" language | code agent mirrors |

---

## Dimension Coverage

| Dimension | Iteration | Severity | Score |
|-----------|-----------|----------|:-----:|
| implementation-spec-alignment | 001 | P1=4, P2=2 | 8/10 |
| code-correctness | 002 | P1=3, P2=2 | 7/10 |
| template-rendering-correctness | 003 | P1=4, P2=2 | 7/10 |
| validator-coverage | 004 | P1=3, P2=2 | 6/10 |
| cross-runtime-mirror-consistency | 005 | P1=2, P2=2 | 7/10 |

---

## Remediation Recommendations

### Immediate (P0)
None — no P0 findings.

### High Priority (P1 — before v2.3 release)
1. **Resolve spec/implementation architecture gap** (P1-001-001 through P1-001-004): Either (a) update spec.md and research.md to reflect the manifest-based architecture, or (b) if the manifest system is the result of prior consolidation work, acknowledge the investigation validated the approach and update the documentation to mark the work as complete.
2. **Fix template rendering bugs** (P1-003-001 through P1-003-004): Add missing ANCHOR wrappers in `spec.md.tmpl` L3/3+ blocks, fix misplaced `/ANCHOR:questions`, add dedicated `level:3` gates to `tasks.md.tmpl` and `implementation-summary.md.tmpl`.
3. **Fix code-correctness defects** (P1-002-001 through P1-002-003): Fix `copy_templates_batch` error handling (capture exit code before `!` flip), escape all JSON special characters in `create_graph_metadata_file`, add fallback path resolution to `getManifestPath`.
4. **Add validator cross-reference** (P1-004-001, P1-004-002): Implement sectionGate-to-template cross-validation so the validator catches ANCHOR omissions and mismatched level gates.
5. **Synchronize runtime mirrors** (P1-005-001): Align `.claude/agents/code.md` and `.gemini/agents/code.md` terminology with `.opencode/agents/code.md` canonical.
6. **Remove stale paths** (P1-005-002): Update `create_agent_auto.yaml` and `create_agent_confirm.yaml` to remove `templates/level_1/` references.

### Advisory (P2)
Fix stale code comments, variable naming, and documentation as listed in P2 findings table.

---

## What Worked

- The manifest-based template architecture with `inline-gate-renderer.ts` produces correct output for most level+template combinations
- ANCHOR tags survive gate processing intact across all templates
- Cross-cutting templates (handover.md, research.md, resource-map.md, context-index.md) are preserved unchanged
- All 4 runtimes maintain agent-set parity (11 agents each)
- `validate.sh --strict` correctly detected 2 issues in this spec folder (missing fix-completeness anchor/header)
- No `compose.sh` or CORE+ADDENDUM stale references found in any agent file, AGENTS.md, or CLAUDE.md

## What Failed / Needs Repair

- Spec and research describe an architecture that does not match the current codebase
- `copy_templates_batch` silently swallows renderer failures
- `create_graph_metadata_file` produces invalid JSON with unescaped user input
- 4 template rendering bugs cause missing or misplaced ANCHOR sections
- Validator cannot detect template/contract drift
- 2 runtime mirrors use outdated terminology
- 2 command YAMLs reference non-existent template paths

---

## Convergence Analysis

| Signal | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Rolling average (iter 3-5) | 0.67 | 0.08 | NOT met — still finding new issues |
| Dimension coverage | 5/5 (100%) | 100% | MET |
| newFindingsRatio trend | 1.0→1.0→0.69→0.77→0.56 | Declining | DECLINING — healthy |
| Coverage age | 1 iteration | ≥1 | MET |

The loop reached max iterations (5) with dimensions fully covered but newFindingsRatio still above convergence threshold — more iterations would likely yield additional findings, particularly around the interplay between gateway rendering and validation.

---

## Release Readiness

**State**: in-progress
**Recommendation**: Do not release until P1-001 through P1-005 findings are resolved. The current codebase has an active but incompletely validated manifest-based template system whose correctness gaps affect spec folder creation and validation for all packet levels.

---

## Artifacts Produced

- `review/deep-review-config.json`
- `review/deep-review-state.jsonl` (6 records: 1 config + 5 iterations)
- `review/deep-review-findings-registry.json`
- `review/deep-review-strategy.md`
- `review/iterations/iteration-001.md` through `iteration-005.md`
- `review/review-report.md` (this file)
