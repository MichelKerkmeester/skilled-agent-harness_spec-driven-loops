# Iteration 4: Validator Coverage

## Focus
Systematic coverage audit: does the validation orchestrator cover all checks promised in the manifest, spec, and checklist? Files: orchestrator.ts, validate.sh, spec-kit-docs.json, checklist.md, spec-doc-structure.ts.

## Scorecard
- Dimensions covered: validator-coverage
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=1
- New findings ratio: 1.0 (single P2 finding, but first coverage pass)

## Findings

### P2 — Suggestion

- **F010**: `validateFolder()` always reports SECTIONS_PRESENT as pass without actually checking
  - `mcp_server/lib/validation/orchestrator.ts:364` — `entry('SECTIONS_PRESENT', 'pass', 'Section presence covered by per-document manifest anchors')` is a no-op pass that explicitly defers to anchor validation (ANCHORS_VALID rule at line 360). The comment correctly states that anchor checking subsumes section checking, but the SECTIONS_PRESENT rule name is misleading — it suggests a section-count check that doesn't exist. If a future maintainer adds a section presence rule, the naming collision could cause confusion.
  - Recommendation: Rename to `SECTIONS_DELEGATED` or remove the entry since it always passes.

## Coverage Audit

### Rule inventory vs. orchestrator.validateFolder (lines 347-380)

| Rule | Status | Evidence |
|------|--------|----------|
| FILE_EXISTS | ✓ Covered | Line 355 — `validateFileExists()` calls `docsForLevel()` which calls `resolveLevelContract()` |
| PLACEHOLDER_FILLED | ✓ Covered | Line 356 — `validatePlaceholders()` scans all required docs |
| TEMPLATE_SOURCE | ✓ Covered | Line 357 — `validateTemplateSource()` checks for SPECKIT_TEMPLATE_SOURCE marker |
| TEMPLATE_HEADERS | ✓ Covered | Line 358 — `validateTemplateShape(folder, level, 'headers')` |
| ANCHORS_VALID | ✓ Covered | Line 359 — `validateTemplateShape(folder, level, 'anchors')` — also validates anchor open/close count parity |
| PRIORITY_TAGS | ✓ Covered | Line 360 — `validatePriorityTags()` checks checklist CHK-* [P*] format |
| FRONTMATTER_VALID | ✓ Covered | Line 361 — `validateFrontmatterBasics()` checks 5 _memory.continuity keys |
| FRONTMATTER_MEMORY_BLOCK | ✓ Covered | Line 362 — `validateSpecDocRule()` with session lineage checks |
| SPEC_DOC_SUFFICIENCY | ✓ Covered | Line 363 — `validateSpecDocRule(folder, level, 'SPEC_DOC_SUFFICIENCY')` |
| SECTIONS_PRESENT | ⚠ Always pass | Line 364 — See F010 |
| LEVEL_DECLARED | ✓ Covered | Line 365 — Reports detected level |
| GRAPH_METADATA_PRESENT | ✓ Covered | Line 366 — Checks for graph-metadata.json existence |
| CONTINUITY_FRESHNESS | ✓ Covered | validate.sh:831 (strict mode only) — `run_continuity_freshness_check()` |
| EVIDENCE_MARKER_LINT | ✓ Covered | validate.sh:832 (strict mode only) — `run_evidence_marker_lint_check()` |

### Edge Cases Covered

| Edge Case | Handling | Evidence |
|-----------|----------|----------|
| Missing folder | Error throw → exit 3 | orchestrator.ts:349-351, validate.sh:131 |
| Phase parent folder | isPhaseParent() → level='phase' | orchestrator.ts:352 |
| Phase parent in strict mode | `opts.strict && isPhaseParent(folder)` forces phase level | orchestrator.ts:352 |
| Unsupported level string | `normalizeLevel()` throws | orchestrator.ts:63 |
| Stale canonical save lock | 30s timeout, remove + reacquire | generate-context.ts:400-406 |
| Active canonical save lock | Error thrown | generate-context.ts:408 |
| Empty checklist | `validatePriorityTags()` returns pass | orchestrator.ts:250 |
| Missing spec.md | `detectLevel()` falls back to file existence checks | orchestrator.ts:78-80 |
| Anchor count mismatch | Reported in ANCHORS_VALID | orchestrator.ts:237-239 |
| Fenced-code header exclusion | stripFences() strips fenced content before header extraction | orchestrator.ts:96-106 |
| Legacy v2.1 markers | MIGRATION.md documents indefinite read support | MIGRATION.md:7-10 |

### Coverage Gaps

- **No validation of document content quality** (spelling, grammar, completeness of prose) — out of scope per spec and acceptable.
- **No validation of cross-spec consistency** (e.g., spec.md claims vs plan.md phases vs tasks mapping) — out of scope.
- **No validation of handover.md** (handover is `lazyAddonDocs` with `silent-skip` absence) — correct per manifest.

## Assessment
- New findings ratio: 1.00
- Validator coverage is comprehensive for the declared scope. All 14 rules in the orchestrator are accounted for. Strict-mode adds 2 additional validators (continuity freshness, evidence marker lint). The only gap is F010's misleading rule name — all actual checks are present.
- Dimensions addressed: validator-coverage

## Recommended Next Focus
Iteration 5: cross-runtime-mirror-consistency — compare Bash shell validator vs. Node orchestrator behavior on level detection, exit codes, and document list agreement.
