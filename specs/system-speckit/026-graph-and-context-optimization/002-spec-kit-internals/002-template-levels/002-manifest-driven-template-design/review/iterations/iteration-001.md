# Iteration 001: implementation-spec-alignment

**Dimension**: implementation-spec-alignment  
**Status**: complete  
**Date**: 2026-05-04T00:00:00Z  

## Scope
Cross-referenced ADR-001, ADR-005, spec.md REQ-004/005, and plan.md Phases 1-4 against actual implementation files in `.opencode/skills/system-spec-kit/`.

## Findings

### P1-001: Validators NOT migrated to manifest — contradicts ADR-001 single-source-of-truth claim
- **Severity**: P1
- **Dimension**: implementation-spec-alignment
- **Evidence**: 
  - `scripts/rules/check-files.sh:93`: `node "$helper_script" docs "$level"` where helper_script=`scripts/utils/template-structure.js`
  - `scripts/rules/check-sections.sh:34,49,57`: Same pattern — `node "$helper_script" docs "$contract_level"` and `node "$helper_script" compare ...`
  - `scripts/spec/validate.sh`: 0 manifest references, 1 template-structure reference
- **Spec claim**: ADR-001 §Decision: "Single manifest (`templates/manifest/spec-kit-docs.json`, ~80-150 lines) drives scaffolder (`create.sh` + `template-utils.sh::scaffold_from_manifest`) AND validator (`check-files.sh`, `check-sections.sh`...). Drift becomes structurally impossible."
- **Reality**: Scaffolder DID migrate (create.sh: 14 manifest references, 0 legacy). Validators DID NOT (check-files.sh, check-sections.sh still call template-structure.js, not level-contract-resolver.ts).
- **Impact**: Validator/scaffolder drift possible. Adding a new capability in manifest updates create.sh output but validator may reject it.
- **Fix**: Migrate check-files.sh line 93 and check-sections.sh lines 34,49,57 to use `resolve_level_contract` from template-utils.sh.

### P1-002: Phase ordering violation — Phase 4 (delete) executed before Phase 3 (migrate validators)
- **Severity**: P1
- **Dimension**: implementation-spec-alignment
- **Evidence**: `find .opencode/skills/system-spec-kit/templates/ -type d -name 'level_*'` returns 0 results. Legacy dirs, addendum/, phase_parent/, compose.sh all deleted.
- **Spec claim**: plan.md Phase ordering: Phase 1 (ADD manifest+loader+renderer) → Phase 2 (MODIFY scaffolder) → Phase 3 (MODIFY validators) → Phase 4 (DELETE legacy template trees)
- **Reality**: Phases 1, 2, and 4 completed. Phase 3 not completed.
- **Impact**: Validators using template-structure.js may still function (no hardcoded dir refs found in template-structure.js), but architectural debt exists. Phase-order dependency risk: deleting dirs before validators migrated creates a window where validator breakage would block rollback.
- **Fix**: Complete Phase 3 migration before claiming Phase 4 done.

### P2-001: validate.sh lacks manifest integration — not consuming single source of truth
- **Severity**: P2
- **Dimension**: implementation-spec-alignment
- **Evidence**: Grep shows 0 matches for `resolve_level_contract|level_contract|manifest|level-contract-resolver|spec-kit-docs` in validate.sh; 1 match for `template-structure`.
- **Spec claim**: ADR-001 §Implementation: "MODIFY: `scripts/rules/check-files.sh`, `check-sections.sh`, `check-template-headers.sh`, `check-section-counts.sh` — read addsSectionProfiles from manifest, render gates before assertions"
- **Reality**: validate.sh orchestrates the validator rules but isn't wired to manifest either.
- **Impact**: Lower priority than P1-001 (validate.sh is an orchestrator; actual rules in check-*.sh).

### PASS-001: Key Phase 1 infrastructure exists and is well-implemented
- **Severity**: PASS (no finding)
- **Evidence**: 
  - `mcp_server/lib/templates/level-contract-resolver.ts` exists with `resolveLevelContract(level)`, proper typed interfaces, error translation for level vocabulary
  - `scripts/lib/template-utils.sh` has `resolve_level_contract()` (line 232) and `level_contract_docs_from_json()` (line 260)
  - `scripts/templates/inline-gate-renderer.ts` exists (297 lines) with full recursive-descent EBNF parser
  - `templates/manifest/spec-kit-docs.json` exists (709 lines) with complete level definitions, presets, section gates, document ownership

### PASS-002: Legacy template trees successfully deleted (86→15 reduction)
- **Severity**: PASS (no finding)
- **Evidence**: `templates/{level_1,level_2,level_3,level_3+,addendum,phase_parent}/` and `scripts/templates/compose.sh` all deleted. Per ADR-001's 5.7× reduction target.

### PASS-003: Scaffolder fully migrated to manifest
- **Severity**: PASS (no finding)
- **Evidence**: `create.sh` has 14 references to `resolve_level_contract|level_contract|manifest|level-contract-resolver|spec-kit-docs` and 0 to `get_level_templates_dir|template-structure.js`. Uses `copy_template()` and `copy_templates_batch()` from template-utils.sh which resolve templates via `_manifest_template_path()`.

### PASS-004: ADR-005 workflow-invariance test exists
- **Severity**: PASS (no finding)
- **Evidence**: `scripts/tests/workflow-invariance.vitest.ts` exists at line 136 with proper test infrastructure.

## Dimension Coverage After This Iteration
- implementation-spec-alignment: CONVERGING — key gaps identified (validators not migrated)
- All other dimensions: PENDING

## Adjudication Claim Packets

### Claim: P1-001 is correctly classified
- **claim**: check-files.sh and check-sections.sh use legacy template-structure.js instead of manifest/level-contract-resolver
- **evidenceRefs**: ["check-files.sh:93", "check-sections.sh:34,49,57", "ADR-001:75"]
- **counterevidenceSought**: Whether check-files.sh has been partially refactored to use manifest but grep missed it
- **alternativeExplanation**: The validators may have been intentionally left on legacy while manifest stabilizes. But plan.md Phase ordering says migrate validators BEFORE deleting legacy dirs.
- **finalSeverity**: P1
- **confidence**: 0.95
- **downgradeTrigger**: None — this is a clean architectural gap

### Claim: P1-002 is correctly classified
- **claim**: Phase 4 (DELETE legacy) executed before Phase 3 (MODIFY validators)
- **evidenceRefs**: ["plan.md:131-137", "find results showing deleted dirs"]
- **counterevidenceSought**: Whether template-structure.js still functions without legacy dirs (it does — no hardcoded dir refs found)
- **alternativeExplanation**: Phase 3 and 4 may have been done in parallel as independent workstreams, with Phase 3 still in progress
- **finalSeverity**: P1
- **confidence**: 0.85
- **downgradeTrigger**: If all validators are confirmed to function correctly via test suite despite using legacy path

## Graph Events
```json
[
  {"type": "DIMENSION", "id": "dim-001", "name": "implementation-spec-alignment", "iteration": 1},
  {"type": "FILE", "id": "file-check-files-sh", "name": "scripts/rules/check-files.sh", "iteration": 1},
  {"type": "FILE", "id": "file-check-sections-sh", "name": "scripts/rules/check-sections.sh", "iteration": 1},
  {"type": "FILE", "id": "file-validate-sh", "name": "scripts/spec/validate.sh", "iteration": 1},
  {"type": "FILE", "id": "file-create-sh", "name": "scripts/spec/create.sh", "iteration": 1},
  {"type": "FILE", "id": "file-level-contract-resolver", "name": "mcp_server/lib/templates/level-contract-resolver.ts", "iteration": 1},
  {"type": "FILE", "id": "file-spec-kit-docs-json", "name": "templates/manifest/spec-kit-docs.json", "iteration": 1},
  {"type": "FINDING", "id": "find-p1-001", "name": "Validators not migrated to manifest", "iteration": 1, "severity": "P1"},
  {"type": "FINDING", "id": "find-p1-002", "name": "Phase ordering violation", "iteration": 1, "severity": "P1"},
  {"type": "FINDING", "id": "find-p2-001", "name": "validate.sh lacks manifest integration", "iteration": 1, "severity": "P2"},
  {"relation": "COVERS", "sourceId": "find-p1-001", "targetId": "file-check-files-sh"},
  {"relation": "COVERS", "sourceId": "find-p1-001", "targetId": "file-check-sections-sh"},
  {"relation": "COVERS", "sourceId": "find-p1-002", "targetId": "file-create-sh"},
  {"relation": "EVIDENCE_FOR", "sourceId": "find-p2-001", "targetId": "file-validate-sh"}
]
```
