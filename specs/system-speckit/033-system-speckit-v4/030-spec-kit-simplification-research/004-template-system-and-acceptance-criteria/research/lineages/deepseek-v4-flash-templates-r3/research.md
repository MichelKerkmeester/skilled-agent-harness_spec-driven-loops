# Deep Research Synthesis — deepseek-v4-flash-templates-r3

- Session: `fanout-deepseek-v4-flash-templates-r3-1788784306229-pqwref`
- Lineage: `deepseek-v4-flash-templates-r3` | Executor: cli-pi model=deepseek-v4-flash-vision-exp (inline, detached fan-out)
- Loop: research | Iterations: 5 of 5 | Stop reason: **maxIterationsReached** (convergenceThreshold 3 recorded as telemetry only; no early convergence per mandate)
- Scope note: round three of this lane. Census (`research/confirmed-findings.md`) read once in iteration 1; earlier round syntheses consulted only as the angles required. No row in this ledger re-reports a census-fixed/kept/recorded row; where an earlier round's claim is contradicted (f-iter001-005), new evidence is cited.

## Ledger by angle

### Angle 1 — Scaffold versus validate for the three packet types (iteration 1)

| ID | Path (claim side) | Path (actual side) | Severity | Claimed vs actual | Recommendation |
|----|-------------------|--------------------|----------|-------------------|----------------|
| f-iter001-001 | spec-kit-docs.json levels.review/levels.research | create.sh:92-94 | P1 | Manifest declares review and research creatable levels; `--level` accepts only 1/2/3/3+/phase-parent, so the scaffolder cannot create them | fix: accept the two levels or delete the rows + VALID_LEVELS entries |
| f-iter001-002 | spec-kit-docs.json levels.review.requiredCoreDocs | templates/ (no review-report.md.tmpl); template-utils.sh:191-213 | P1 | review/review-report.md is required core but no template or versions entry exists; copy_templates_batch would hard-fail and TEMPLATE_SOURCE cannot cover it | document: add the template or relabel the row as loop-generated |
| f-iter001-003 | template-structure.js:403-404 | template-utils.sh:195-197 | P1 | Rule-side resolver maps review+spec.md to review.spec.md.tmpl; scaffolder resolver special-cases only phase and would use core/spec.md.tmpl | fix: mirror the phase case or delete review.spec.md.tmpl |
| f-iter001-004 | spec-kit-docs.json path-typed doc names | inline-gate-renderer.ts:290-292 | P1 | Contract docs like research/research.md are path-typed; the renderer writes by basename at out-dir root, so a scaffold cannot land them at contract paths (phase-parent mv at template-utils.sh:144-146 is the symptom) | fix: pass destination names or add manifest-path lookup |
| f-iter001-005 | template-structure.js:67 | template-structure.js:390-395,407 | P2 | Map keyed 'research/research.md' but indexed by basename; the JS helper still cannot resolve research.md after round two's bash-only fix | fix: index by basename or pass full path |

### Angle 2 — Upgrade paths versus fresh scaffold (iteration 2)

| ID | Path (claim side) | Path (actual side) | Severity | Claimed vs actual | Recommendation |
|----|-------------------|--------------------|----------|-------------------|----------------|
| f-iter002-001 | create.sh:444-452; spec-kit-docs.json rows :130-135/:511-516/:1006-1011 | upgrade-level.sh create_new_files :1483-1486, :766-806 (no implementation-summary.md anywhere) | P1 | Every fresh scaffold writes implementation-summary.md (lifecycle); the upgrade never creates it, so an old packet upgraded to L2/L3 can fail FILE_EXISTS once implementation starts | fix: create it (gated like FILE_EXISTS) |
| f-iter002-002 | upgrade-level.sh:10,789-806; check-files.sh:13 | spec-kit-docs.json:997-1030 (decision-record lazy) | P1 | 2→3 creates decision-record.md and a rule header still says "Level 3 = Level 2 + decision-record.md"; the manifest flat model keeps it lazy, giving upgraded vs fresh L3 packets different file sets | fix: drop the create-at-upgrade and the ladder comment, or move it to optionalAddonDocs |
| f-iter002-003 | create.sh:647-661,663-679 | upgrade-level.sh:93-112 | P2 | Scaffold appends SCAFFOLD_VALIDATION_COUNTS and SCAFFOLD_AI_PROTOCOL_MARKERS; the diff-driven upgrade never injects them | document: scaffold-coaching only, or have upgrade append |
| f-iter002-004 | upgrade-level.sh:51-54 | upgrade-level.sh:57-65 | P2 | "Cannot drift from the scaffolder's templates" holds only for the five mapped docs; implementation-summary.md.tmpl is outside template_for_doc | fix: fold into f-iter002-001 |

### Angle 3 — Placeholders that survive a scaffold (iteration 3)

| ID | Path (claim side) | Path (actual side) | Severity | Claimed vs actual | Recommendation |
|----|-------------------|--------------------|----------|-------------------|----------------|
| f-iter003-001 | check-placeholders.sh:65-84 | acceptance-criteria.md.tmpl:44,45,58,83; goal.md.tmpl:44,52; decision-record.md.tmpl:37,43,78 | P1 | Guard detects only [YOUR_VALUE_HERE:/[NEEDS_CLARIFICATION:; the templates' dominant left-to-fill class survives a scaffold unsubstituted and undetected | fix: widen the pattern and pin a rendered-template scan |
| f-iter003-002 | check-placeholders.sh:71 (detected class) | create.sh:646-647; handover.md.tmpl:42,62 | P1 | The one detected token class is blanket-replaced with FEATURE_NAME, turning handover's timestamp/blocker slots into the feature description before the guard can see them | fix: per-slot mapping or leave for the guard |
| f-iter003-003 | create.sh:639-648 | implementation-summary.md.tmpl:101 | P2 | [Feature Name] is neither substituted (only [NAME] is) nor detected; scaffolded H2 stays bracketed | fix: add to the perl list or normalize to [NAME] |
| f-iter003-004 | create.sh:643-645 | spec/tasks/implementation-summary.md.tmpl:4-13 | P2 | [template:level-N/doc.md] provenance tokens survive into scaffolded frontmatter titles, invisible to substitution (different string) and to the pattern block | document: move to the TEMPLATE_SOURCE comment or strip |

### Angle 4 — The human-voice reference and the templates that cite it (iteration 4)

| ID | Path (claim side) | Path (actual side) | Severity | Claimed vs actual | Recommendation |
|----|-------------------|--------------------|----------|-------------------|----------------|
| f-iter004-001 | hvr-rules.md Section 3 (em dash NEVER) | goal.md.tmpl:35 | P1 | goal.md's blockquote two lines under its HVR_REFERENCE contains an em dash | fix: comma/colon; add punctuation lint |
| f-iter004-002 | hvr-rules.md Section 3 (Oxford comma NEVER) | decision-record.md.tmpl:3; goal.md.tmpl:4 | P1 | Decision-record's description carries an Oxford comma in a four-item enumeration; goal's description a comma before "and" | fix: drop the commas |
| f-iter004-003 | hvr-rules.md Section 3 (semicolon NEVER) | goal.md.tmpl:77 | P1 | Goal's Precedence guidance uses a semicolon in visible boilerplate | fix: split the sentence |
| f-iter004-004 | hvr-rules.md:496-504 | system-spec-kit/templates (core/ addons/ packet-types/ only) | P1 | The HVR reference's "Templates That Apply HVR" table names templates/*/implementation-summary.md and templates/level-3*/decision-record.md, which do not exist | fix: correct to the .tmpl paths or drop the table |
| f-iter004-005 | hvr-rules.md:57-58 | templates' ANCHOR: markers; goal.md.tmpl:94; acceptance-criteria.md.tmpl:37-38 | P2 | HVR bans <!-- ANCHOR --> comments and exactly-3 enumerations; spec-kit sectionGates require the anchors and the templates use natural enums | document: scope the HVR rules |

### Angle 5 — Overlap with sk-doc's templates (iteration 5)

| ID | Path (claim side) | Path (actual side) | Severity | Claimed vs actual | Recommendation |
|----|-------------------|--------------------|----------|-------------------|----------------|
| f-iter005-001 | sk-doc/scripts/tests/valid-spec.md; auto-detect-spec.md | templates/core/spec.md.tmpl | P2 | Only spec-named files under sk-doc are 9-11 line validator fixtures with no anchors or required sections; same-named document class, divergent shape | document: mark fixtures as harness samples |

## What each angle verified as correct

- **Angle 1**: phase scaffold path is internally coherent (graph-metadata writer + phase branch in both rules); lifecycle gating anchors to tasks.md list items, not the retired checklist.md; template-source marker placement (post-frontmatter) matches check-template-source's first-60-lines scan.
- **Angle 2**: the diff-driven addendum injects sections by rendering the same templates the scaffolder uses (drift-proof for the five mapped docs); acceptance-criteria.md on 1→2 matches the manifest (the single optionalAddonDocs member at L2); upward-only path validation and backup/restore are sound.
- **Angle 3**: checkbox tokens [x]/[ ] are correctly excluded and cannot masquerade as implementation evidence; backtick exclusions and scratch/memory/templates path skips are correct; [NAME]/[YYYY-MM-DD]/[###-feature-name]/piped Level-row substitutions work as designed for spec/plan/tasks.
- **Angle 4**: the HVR_REFERENCE path resolves (hvr-rules.md read in full); no hard-blocker words in the scanned template boilerplate regions; straight quotes only; trigger_phrases sampled at four items.
- **Angle 5**: zero acceptance-criteria content under sk-doc; no sk-doc template ships a spec-kit document; the readme/install templates are a different document class.

## Convergence report

- Stop reason: `maxIterationsReached` (mandated: exactly 5 iterations, one angle each, order fixed, no early convergence).
- Iterations completed: 5/5.
- newInfoRatio per iteration: 1.00, 0.90, 1.00, 0.85, 0.50 (mean 0.85). Telemetry only per mandate.
- Findings: 19 (0 P0, 12 P1, 7 P2). No re-report of census-fixed/kept/recorded rows; one earlier claim contradicted with new evidence (f-iter001-005, re-broken seam in template-structure.js after the round-two bash-only fix).
- Questions answered: the five mandated angles are closed; open questions from each pass carried in the iteration files (12 carried total, each answered or marked for follow-up).

## Open questions carried to the packet

1. Who calls the two rules with `--level review|research` today (decides f-iter001-001's live impact).
2. Whether any rule consumes SCAFFOLD_VALIDATION_COUNTS / SCAFFOLD_AI_PROTOCOL_MARKERS (f-iter002-003).
3. Whether check-ac-coverage's has_file_line treats the scaffolded `[command, file:line, or artifact that proves it]` cell as evidence (expected: not, per the round-two path-like fix).
4. Whether sk-doc's validate_document.py --type spec is ever invoked on spec-kit packets (f-iter005-001).
5. Whether any machine consumes HVR scoring against spec-kit templates (f-iter004-001..005).

## Notes

- Not read within budget (recorded per angle): exact line numbers of the levels.review/.research rows in spec-kit-docs.json (rows verified by key name and dump); full-body scans beyond the sampled template regions; hvr-rules Section 10's consumers.
- Non-goals honored: no edits, no validate.sh, no node tooling, no git writes, no scripts/harnesses/census programs; all writes confined to this lineage directory.
