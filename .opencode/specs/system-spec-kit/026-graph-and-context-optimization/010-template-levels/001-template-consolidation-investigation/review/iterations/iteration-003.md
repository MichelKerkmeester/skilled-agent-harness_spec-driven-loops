# Iteration 003: Template Rendering Correctness

## Dispatcher
- **Run**: 3
- **Status**: complete
- **Dimension**: template-rendering-correctness
- **Budget Profile**: verify (13 calls)
- **Focus**: `templates/manifest/*.tmpl` level-gating correctness, ANCHOR tag survival, renderManifestTemplate vs inline-gate-renderer parity

## Files Reviewed
- `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` — 846 lines, 4 level gates (1/2/3/3+)
- `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` — 572 lines, 3 level gates (2/3/3+)
- `.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl` — 134 lines, 1 level gate (phase)
- `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl` — 431 lines, 3 gates (1/2/3+)
- `.opencode/skills/system-spec-kit/templates/manifest/implementation-summary.md.tmpl` — 547 lines, 3 gates (1/2/3+)
- `.opencode/skills/system-spec-kit/templates/manifest/plan.md.tmpl` — gate structure verified
- `.opencode/skills/system-spec-kit/templates/manifest/decision-record.md.tmpl` — gate structure verified
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json` — 709 lines, level contract
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts` — 297 lines
- `.opencode/skills/system-spec-kit/scripts/utils/template-structure.js` — 877 lines
- `.opencode/skills/system-spec-kit/scripts/tests/inline-gate-renderer.vitest.ts` — 114 lines (test suite)
- `.opencode/skills/system-spec-kit/scripts/rules/check-template-headers.sh` — 208 lines

## Findings - New

### P1 Findings

1. **spec.md.tmpl L3/3+ missing ANCHOR wrappers for risk-matrix and user-stories** — `spec.md.tmpl:517-535` — The Level 3 block renders `## 10. RISK MATRIX` (line 518) and `## 11. USER STORIES` (line 526) content but without `<!-- ANCHOR:risk-matrix -->` and `<!-- ANCHOR:user-stories -->` wrappers. The spec-kit-docs.json sectionGates declare `risk-matrix:["3","3+"]` and `user-stories:["3","3+"]` as expected anchors. Rendered L3 output contains only 7 ANCHOR IDs (metadata, problem, scope, requirements, success-criteria, risks, questions) — missing risk-matrix and user-stories entirely. This breaks validator anchor checks for L3+ spec.md files.
   - **Finding class**: class-of-bug
   - **Scope proof**: Rendered `spec.md.tmpl` at level 3 via inline-gate-renderer.ts produces 238 lines with 14 ANCHOR markers (7 pairs), no risk-matrix or user-stories anchors. Level 3+ produces 22 ANCHOR markers (11 pairs) without risk-matrix or user-stories. Grep for `ANCHOR:risk-matrix` in `spec.md.tmpl` returns 0 matches. spec-kit-docs.json:499-506 declares risk-matrix and user-stories for level 3/3+.
   - **Affected surface hints**: `check-template-headers.sh` anchor comparison, `template-structure.js compareDocumentToTemplate()`, `validate.sh` spec.md anchor validation

```json
{"type":"claim-adjudication","claim":"risk-matrix and user-stories anchors are missing from L3 spec.md.tmpl rendering","evidenceRefs":["spec.md.tmpl:517-535 (no ANCHOR tags)","spec-kit-docs.json:499-506 (sectionGates declare them)","bash render test: Level 3 ANCHOR count = 14 (7 pairs, missing risk-matrix+user-stories)"],"counterevidenceSought":"Checked if anchors might use alternate naming (risk, user-story) — no matches. Checked if sectionGates are only advisory — they drive anchor validation in template-structure.js","alternativeExplanation":"Could the sectionGates be aspirational rather than binding? No — template-structure.js compareDocumentToTemplate uses contract.allowedAnchors to filter extras, and contract.requiredAnchors are derived from template rendering. Missing anchors will cause validate.sh failures on valid L3+ spec files.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":null}
```

2. **spec.md.tmpl L3+/L3 has misplaced `/ANCHOR:questions` creating nested ANCHOR structure** — `spec.md.tmpl:718,845` — In the L3+ block, `<!-- ANCHOR:questions -->` opens at line 718 but `<!-- /ANCHOR:questions -->` does not close until line 845, wrapping 127 lines including the `approval-workflow`, `compliance-checkpoints`, `stakeholder-matrix`, and `change-log` ANCHOR blocks as children. In the L3 block, the same pattern occurs (line 478 opens, line 550 closes after risk-matrix and user-stories sections). `parseAnchoredSections()` in `template-structure.js:363-397` treats the first open match as the section boundary, so the interior ANCHOR blocks become invisible as independent sections.
   - **Finding class**: class-of-bug
   - **Scope proof**: `spec.md.tmpl:718` `<!-- ANCHOR:questions -->`, then sections for NFR, Edge Cases, Complexity, Risk Matrix, User Stories, Approval Workflow, Compliance Checkpoints, Stakeholder Matrix, Change Log follow, then `<!-- /ANCHOR:questions -->` at line 845. L3+ rendered output shows `approval-workflow`, `compliance-checkpoints`, `stakeholder-matrix`, `change-log` as top-level anchors (they appear in sort -u output) but `parseAnchoredSections` would only find the outermost `questions` section.
   - **Affected surface hints**: `template-structure.js parseAnchoredSections()`, `check-template-headers.sh compare_headers()`, `validate.sh` anchored section extraction

```json
{"type":"claim-adjudication","claim":"/ANCHOR:questions is placed after interior ANCHOR blocks creating nested structure","evidenceRefs":["spec.md.tmpl:718 (ANCHOR:questions open)","spec.md.tmpl:845 (/ANCHOR:questions close)","spec.md.tmpl:776-785 (approval-workflow ANCHOR inside questions)","template-structure.js:363-397 (parseAnchoredSections uses first open match)"],"counterevidenceSought":"Checked if parseAnchoredSections handles nesting — it does not. Checked if this is intentional for a 'catch-all questions' section — no, interior ANCHORs like approval-workflow are explicitly declared in sectionGates.","alternativeExplanation":"Could be intentional that questions wraps all append-only sections — but this defeats the purpose of declaring approval-workflow as a separate sectionGate. The presence of explicit ANCHOR tags inside the questions block proves this is a layout error.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":null}
```

3. **tasks.md.tmpl missing dedicated Level 3 gate; uses `level:3+` which excludes Level 3** — `tasks.md.tmpl:1,109,325` — The template has three level gates: `<!-- IF level:1 -->` (line 1), `<!-- IF level:2 -->` (line 109), and `<!-- IF level:3+ -->` (line 325). There is no `<!-- IF level:3 -->` gate. spec-kit-docs.json sectionGates declare `architecture-tasks:["3","3+"]` for tasks.md, but at Level 3 the template produces identical output to L1/L2 (106 lines) because no gate matches `level:3`. Rendered L3 ANCHOR IDs are: completion, cross-refs, notation, phase-1, phase-2, phase-3 — missing architecture-tasks.
   - **Finding class**: class-of-bug
   - **Scope proof**: `tasks.md.tmpl:325` reads `<!-- IF level:3+ -->`. No line contains `<!-- IF level:3 -->`. Running inline-gate-renderer at level 3 produces identical line count (106) as level 1 and 2. SectionGates declare `"architecture-tasks": ["3", "3+"]` at spec-kit-docs.json:406 but the template has no way to show this section at Level 3.
   - **Affected surface hints**: `spec-kit-docs.json tasks.md sectionGates`, `validate.sh` tasks.md L3 validation, `create.sh` L3 scaffold

```json
{"type":"claim-adjudication","claim":"tasks.md.tmpl has no level:3 gate, making L3 render identically to L1","evidenceRefs":["tasks.md.tmpl:1,109,325 (IF gates)","bash render test: L1=106, L2=106, L3=106, L3+=105 lines","spec-kit-docs.json:399-407 (architecture-tasks declared for L3/L3+)"],"counterevidenceSought":"Checked if tasks.md has different sections per level — sectionGates declare architecture-tasks for L3 and governance-tasks for L3+, but template only has level:3+ gate. No level:3-specific gate exists.","alternativeExplanation":"Could level:3+ be intended to include L3? The renderer treats level:3+ as a literal token '3+', not a range. evaluateGateExpression tokenizes '3+' as a single level value distinct from '3'.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":null}
```

4. **implementation-summary.md.tmpl has same L2/L3+ gate gap as tasks.md.tmpl** — `implementation-summary.md.tmpl:1,138,412` — Three level gates: `level:1` (line 1), `level:2` (line 138), `level:3+` (line 412). No `level:3` gate. sectionGates declare `architecture-summary:["3","3+"]` for implementation-summary.md. Rendered line counts: L1=135, L2=135, L3=135, L3+=134, showing no L3 differentiation. ANCHORs missing at L3.
   - **Finding class**: class-of-bug
   - **Scope proof**: `implementation-summary.md.tmpl:412` `<!-- IF level:3+ -->`. No level:3 gate. SectionGates at spec-kit-docs.json:415 declare architecture-summary for ["3","3+"]. Rendered output at L3 shows no architecture-summary ANCHOR.
   - **Affected surface hints**: `spec-kit-docs.json impl-summary sectionGates`, `validate.sh L3 validation`, `create.sh L3 scaffold`

```json
{"type":"claim-adjudication","claim":"implementation-summary.md.tmpl missing level:3 gate","evidenceRefs":["implementation-summary.md.tmpl:1,138,412 (IF gates)","bash render test: L1=135, L2=135, L3=135, L3+=134","spec-kit-docs.json:408-416 (architecture-summary for L3)"],"counterevidenceSought":"Checked all lines of impl-summary.md.tmpl for level:3 gate — none found. Verified sectionGates declare architecture-summary for L3.","alternativeExplanation":"Same as tasks.md — level:3+ is not a range that includes level:3. The gate evaluator treats '3+' as a literal token.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":null}
```

### P2 Findings

5. **spec-kit-docs.json sectionGates has redundant flat top-level duplicates of spec.md's nested gates** — `spec-kit-docs.json:178-219` — The Level 1 sectionGates object contains document-nested entries (e.g., `"spec.md": { "metadata": [...] }`) AND flat top-level entries (`"metadata": ["1","2","3","3+"]`) with identical values. `assertSectionGates()` in `template-structure.js:174-199` processes both: the flat keys overwrite the previously set nested-flattened keys with identical arrays. Functionally harmless but doubles the data and creates confusion.
   - **Finding class**: instance-only
   - **Scope proof**: Lines 143-177 define document-nested metadata, problem, scope, etc. under "spec.md". Lines 178-219 define the same keys at the top-level with identical level arrays. The Level 2/3/3+ sectionGates objects also have these flat duplicates.
   - **Affected surface hints**: `template-structure.js assertSectionGates()`

6. **ANCHOR:questions closure wraps 4 independent ANCHOR blocks in L3+ spec.md.tmpl** — `spec.md.tmpl:718-845` — The `/ANCHOR:questions` at line 845 does not close until AFTER `approval-workflow` (line 785), `compliance-checkpoints` (line 800), `stakeholder-matrix` (line 811), and `change-log` (line 820). These appear as nested children of `questions` rather than independent sections in template-structure.js's `parseAnchoredSections()`. This is a specific mechanistic consequence of the misplaced anchor reported in P1-003-002.
   - **Finding class**: class-of-bug
   - **Scope proof**: Same as P1-003-002. This P2 documents the concrete consequence rather than the root cause.
   - **Affected surface hints**: Same as P1-003-002.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| spec-kit-docs.json sectionGates match ANCHOR IDs per level | **PARTIAL** | P1-003-001: risk-matrix/user-stories declared but not in template. P1-003-005: governance declared but no matching anchor. checklist.md.tmpl and phase-parent.spec.md.tmpl matched perfectly. |
| All level gates render correct content per level | **FAIL** | P1-003-003/004: tasks.md and impl-summary.md have level gate gaps. spec.md.tmpl and plan.md.tmpl differentiate correctly by level. |
| ANCHOR tags survive gate processing intact | **PASS** | Verified across spec.md.tmpl (7-11 pairs survive at each level), checklist.md.tmpl (9-15 pairs survive), phase-parent.spec.md.tmpl (5 pairs survive). No ANCHOR tag corruption observed. |
| ANCHOR open/close pairing is balanced | **PASS** | grep shows matching open/close counts for all anchors that exist. No orphaned close tags. |
| Level 1 renders no checklist/decision-record content | **PASS** | checklist L1 = 0 ANCHORs; decision-record L1 = 0 ANCHORs. |
| Phase-parent renders correct anchor set | **PASS** | phase-parent.spec.md.tmpl anchors: metadata, problem, scope, phase-map, questions — matches sectionGates exactly. |

## Integration Evidence

- **CLI renderer: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts`** — Used to verify all level renderings. Parses `<!-- IF level:X -->` gates with proper tokenizer. All tests exercised via CLI `--level` flag.
- **Shell wrapper: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh`** — Exists as wrapper but not needed for this review; used tsx directly.
- **Validator integration: `check-template-headers.sh`** — Reads contract from `template-structure.js compare` using `compareDocumentToTemplate()`. Any ANCHOR mismatch (P1-003-001) would cause validate.sh failures on valid L3+ spec.md files.

## Edge Cases

- **Ambiguity: flat-vs-nested sectionGates**: The duplicate top-level flat keys in sectionGates (P2-003-001) are functionally identical but structurally ambiguous. `assertSectionGates()` handles both forms gracefully.
- **Nested ANCHOR interaction**: The questions anchor wrapping interior anchors (P1-003-002, P2-003-002) creates a silent correctness gap — sections exist and pass ANCHOR grep checks, but `parseAnchoredSections()` can only discover the outermost wrapper.
- **level:3+ as range vs literal**: The template uses `level:3+` as a literal token, not a range that includes `level:3`. This is the correct gate evaluation behavior, but template authors appear to have used `level:3+` when they meant "Level 3 and above."
- **Vitest config failure**: Test suite exists (`inline-gate-renderer.vitest.ts`) but could not be executed due to `vitest/config` module resolution failure in the root `vitest.config.ts`. Not a review target issue.

## Confirmed-Clean Surfaces

- **checklist.md.tmpl**: All 3 level gates (2/3/3+) produce correct ANCHOR sets matching sectionGates. L1 correctly produces empty output.
- **phase-parent.spec.md.tmpl**: Single level:phase gate produces correct 5-anchor set.
- **decision-record.md.tmpl**: L1 produces empty output; L3+ produces correct 7-adr anchor set.
- **plan.md.tmpl**: All 4 level gates produce progressively richer output (163/219/296/365 lines).
- **ANCHOR tag integrity**: No ANCHOR tag corruption observed across any template rendering at any level.
- **Gate expression evaluation**: Basic single-level gates (`level:1`, `level:2`, `level:3`, `level:3+`, `level:phase`) all evaluate correctly.

## Ruled Out
- ANCHOR tag corruption during gate processing — verified intact across all levels
- All templates producing empty output — verified every .tmpl produces content at expected levels
- Comma-separated multi-level gates — evaluated `level:2,3,3+` at 3+ correctly (present in test)
- Empty same-line gates (`<!-- IF level:1 --><!-- /IF -->`) — correctly handled in renderer, not used in templates
- Fenced code block contamination — gates inside fenced blocks correctly ignored

## Next Focus
- **Dimension**: validator-coverage
- **Focus Area**: Does the validation suite (`validate.sh`, `check-files.sh`, `check-template-headers.sh`, `check-template-staleness.sh`) provide adequate coverage of manifest-based level requirements? Are there gaps between sectionGates declarations and actual validation assertions?
- **Reason**: P1-003-001 (missing ANCHORs) and P1-003-003/004 (level gate gaps) suggest the validator may not catch these discrepancies, or if it does, the validator logic and template contract may be out of sync.
- **Rotation Status**: New dimension
- **Required Evidence**: Run validate.sh against test spec folders at each level, trace which rules fire for ANCHOR/sectionGate validation, and identify gaps between contract declarations and validator coverage.
