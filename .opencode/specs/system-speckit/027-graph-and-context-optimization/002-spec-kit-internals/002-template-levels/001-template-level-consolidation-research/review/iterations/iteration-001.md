# Iteration 001: implementation-spec-alignment

**Dispatcher**: @deep-review LEAF agent, iteration 1 of 5
**Focus Dimension**: implementation-spec-alignment
**Budget Profile**: verify (11-13 tool calls)
**Status**: complete
**Timestamp**: 2026-05-04T11:00:00Z
**Duration**: ~10 tool calls

## Files Reviewed

| File | Lines Reviewed | Purpose |
|------|---------------|---------|
| `spec.md` | 297 | Feature specification — source of documented claims |
| `research/research.md` | 273 | Deep-research synthesis — claims about implementation architecture |
| `scripts/templates/compose.sh` | 0 | **NOT FOUND** — referenced by spec and research but does not exist |
| `scripts/templates/inline-gate-renderer.sh` | 14 | Actual template renderer wrapper (thin shim to TS) |
| `scripts/templates/wrap-all-templates.{ts,sh}` | 0 | **NOT FOUND** — referenced by spec scope but does not exist |
| `scripts/spec/create.sh` | 1708 | Spec folder creator — reads manifest, not level dirs |
| `scripts/lib/template-utils.sh` | 281 | Template utilities — contains stale `get_level_templates_dir` |
| `scripts/utils/template-structure.js` | 877 | Template structure reader — reads manifest-based contracts |
| `templates/` (directory) | — | Only has: changelog/, examples/, manifest/, README.md, scratch/, stress_test/ |
| `templates/manifest/spec-kit-docs.json` | 709 | Actual level contract: manifest-driven, not core+addendum |

---

## Findings - New

### P0 Findings

None. No exploitable security issues, auth bypass, or destructive data loss patterns were identified within the review scope. All specification-implementation discrepancies are classified as P1 (correctness/spec-mismatch) per the review doctrine.

### P1 Findings

**1. compose.sh — central file in spec and research — does not exist**

- **File**: `scripts/templates/compose.sh` (does NOT exist)
- **Evidence**: 
  - [SOURCE: spec.md:81] "compose.sh writes the composition results back to disk"
  - [SOURCE: research.md:58] "Use compose.sh as the generator. It already owns the transformation from core and addendum into the four rendered level outputs."
  - [SOURCE: glob `**/compose*` in skill root returned 0 matches]
  - [SOURCE: grep for `compose\.sh` in scripts/ returned 0 matches]
- **Description**: Both the specification and the deep-research synthesis identify `compose.sh` as the central generator that reads `core/` and `addendum/` directories and produces `level_1/` through `level_3+/` output directories. This file does not exist. The actual template rendering is performed by `scripts/templates/inline-gate-renderer.ts` (wrapped by `inline-gate-renderer.sh`), which processes `.tmpl` files from `templates/manifest/` using `<!-- IF level:... -->` section gates and a JSON level contract (`templates/manifest/spec-kit-docs.json`). The research recommendation to "extend compose.sh" is unimplementable as stated.
- **Finding class**: class-of-bug
- **Scope proof**: Glob `**/compose*` across entire skill root returns 0 matches. Grep for `compose\.sh` across all scripts returns 0 matches. The `inline-gate-renderer.sh` exists at `scripts/templates/inline-gate-renderer.sh:1-14` and is the actual rendering entry point.
- **Affected surface hints**: ["spec.md §2 Problem", "research.md §6 Generator Design", "research.md §7 Four-Phase Refactor Plan", "spec.md §3 Scope Files to Change"]
- **Recommendation**: Update spec.md and research.md to reflect the actual manifest-based architecture, or note that the investigation was conducted against a pre-migration state and the codebase has already been refactored. If the manifest architecture IS the result of prior work, update the spec to acknowledge this as a completed investigation outcome.

```json
{
  "type": "claim-adjudication",
  "claim": "compose.sh exists and is the central template generator",
  "evidenceRefs": ["spec.md:81", "research.md:58", "glob compose* = 0 matches", "grep compose in scripts = 0 matches"],
  "counterevidenceSought": true,
  "counterevidence": "Searched for compose.sh via glob and grep across entire skill root; confirmed template rendering is actually done by inline-gate-renderer.ts/.sh. No compose.sh anywhere.",
  "alternativeExplanation": "The codebase may have been refactored from CORE+ADDENDUM+compose.sh to manifest+inline-gate-renderer AFTER the investigation was completed. The investigation may have been conducted on an older version of the codebase, or against a hypothetical architecture.",
  "finalSeverity": "P1",
  "confidence": 1.0,
  "downgradeTrigger": null
}
```

---

**2. CORE + ADDENDUM directories do not exist — spec describes a non-existent architecture**

- **File**: `templates/core/` and `templates/addendum/` (do NOT exist)
- **Evidence**: 
  - [SOURCE: spec.md:56] "CORE + ADDENDUM v2.2 architecture"
  - [SOURCE: spec.md:115-116] Lists `templates/core/` and `templates/addendum/` as source-of-truth candidates
  - [SOURCE: templates/ directory read] Shows only: `changelog/`, `examples/`, `manifest/`, `README.md`, `scratch/`, `stress_test/`, `.hashes/` — no `core/`, no `addendum/`
  - [SOURCE: grep `templates/core` in scripts/*.sh returns 0 matches]
- **Description**: The specification describes a "CORE + ADDENDUM v2.2 architecture" where templates are stored in `templates/core/` and `templates/addendum/` directories and composed by `compose.sh`. Neither directory exists. The actual template storage is a single `templates/manifest/` directory containing `.tmpl` files with inline `<!-- IF level:... -->` section gates, plus a JSON contract at `templates/manifest/spec-kit-docs.json` that defines level-specific document requirements.
- **Finding class**: class-of-bug
- **Scope proof**: Read of `templates/` directory confirms only changelog, examples, manifest, README.md, scratch, stress_test, .hashes exist. No core/ or addendum/ directories anywhere in the skill root.
- **Affected surface hints**: ["spec.md §2 Problem Statement", "spec.md §3 Scope", "research.md §3 Background", "research.md §6 Generator Design"]
- **Recommendation**: Update specification to document the actual manifest-based template architecture with `templates/manifest/` as the source of truth, `inline-gate-renderer.ts` as the renderer, and `spec-kit-docs.json` as the level contract. If the manifest architecture is the result of the consolidation, acknowledge that the investigation validated the approach retroactively.

```json
{
  "type": "claim-adjudication",
  "claim": "Template architecture uses CORE + ADDENDUM directories with compose.sh composition",
  "evidenceRefs": ["spec.md:56", "spec.md:115-116", "templates/ directory listing"],
  "counterevidenceSought": true,
  "counterevidence": "Directory listing of templates/ shows no core/ or addendum/ subdirectories. All templates live in templates/manifest/. Grep for references to core/ and addendum/ in scripts returns 0 matches, confirming these paths are not used in any implementation code.",
  "alternativeExplanation": "The CORE + ADDENDUM architecture was the v2.2 target that was superseded by the manifest-based architecture. The investigation may have been conducted while v2.2 was current, and the code has since moved forward. Alternatively, the investigation framed the problem in terms of a planned target rather than the actual state.",
  "finalSeverity": "P1",
  "confidence": 1.0,
  "downgradeTrigger": null
}
```

---

**3. level_1/ through level_3+/ output directories do not exist**

- **File**: `templates/level_1/`, `templates/level_2/`, `templates/level_3/`, `templates/level_3+/` (do NOT exist)
- **Evidence**: 
  - [SOURCE: spec.md:93] "Investigation of templates/{level_1,level_2,level_3,level_3+}/ output directories — can they be removed?"
  - [SOURCE: research.md:23] "The four rendered output directories alone contain 25 markdown files and 4,087 LOC."
  - [SOURCE: templates/ directory read] Shows no `level_1/`, `level_2/`, `level_3/`, or `level_3+/` directories
  - [SOURCE: grep `templates/level_` in scripts/*.sh returns 0 matches]
  - [SOURCE: spec-kit-docs.json] Defines levels via `privatePreset` and `capabilities` arrays, not per-directory outputs
- **Description**: The specification and research both assume that rendered level output directories (`level_1/` through `level_3+/`) exist as checked-in artifacts containing 25 markdown files and ~4,087 LOC. These directories do not exist. The actual architecture renders templates on-demand from `templates/manifest/*.tmpl` files using `inline-gate-renderer.ts` with level-gating (`<!-- IF level:2,3 -->` etc.), eliminating the need for materialized level output directories entirely. The research's Phase 4 deletion plan (removing 25 files and 4,087 LOC) may already have been executed, or the architecture may have been manifest-driven from the start.
- **Finding class**: class-of-bug
- **Scope proof**: Directory listing of `templates/` confirms absence of all level directories. The manifest-based system in `spec-kit-docs.json` defines levels as JSON presets, not disk directories. No code path references `templates/level_N/` directories — all template resolution uses `templates/manifest/`.
- **Affected surface hints**: ["spec.md §2 Problem Statement", "spec.md §3 Scope", "research.md §3 Background", "research.md §14 File/LOC Deltas"]
- **Recommendation**: Update the specification to accurately describe the current manifest-based architecture where levels are JSON-driven presets rather than disk directories. If the level directories were deleted as part of prior work, document this as a completed action. The research's Phase 4 deletion plan may be already implemented or unnecessary.

```json
{
  "type": "claim-adjudication",
  "claim": "Rendered level_1/ through level_3+/ output directories exist containing 25 markdown files",
  "evidenceRefs": ["spec.md:93", "research.md:23", "templates/ directory listing", "spec-kit-docs.json"],
  "counterevidenceSought": true,
  "counterevidence": "Directory listing confirms no level_N/ directories. The manifest JSON defines all level contracts declaratively. No code references templates/level_N/ paths. The manifest-based architecture renders templates on-demand, making pre-rendered level directories unnecessary.",
  "alternativeExplanation": "The level directories may have been deleted as part of a prior consolidation effort (perhaps the PARTIAL recommendation was partially implemented). The research may have been conducted pre-deletion and the code post-deletion. Alternatively, the investigation was based on an idealized architecture that was never implemented in this form.",
  "finalSeverity": "P1",
  "confidence": 1.0,
  "downgradeTrigger": null
}
```

---

**4. wrap-all-templates.{ts,sh} does not exist**

- **File**: `scripts/templates/wrap-all-templates.ts` and `.sh` (do NOT exist)
- **Evidence**: 
  - [SOURCE: spec.md:118] Lists `wrap-all-templates.{ts,sh}` as investigation target for "ANCHOR injection logic to preserve"
  - [SOURCE: research.md:150] Consumer migration map references `scripts/wrap-all-templates.ts` and `.sh`
  - [SOURCE: glob `**/wrap-all-templates*` in skill root returned 0 matches]
- **Description**: The specification and research reference `wrap-all-templates.ts` and `wrap-all-templates.sh` as components that handle ANCHOR injection into composed templates. Neither file exists. ANCHOR handling is currently managed by `template-structure.js` (which parses ANCHOR sections from rendered templates) and the `inline-gate-renderer.ts` (which processes template content with inline gates, preserving ANCHOR tags within section-gated content).
- **Finding class**: instance-only
- **Scope proof**: Glob search across entire skill root for `wrap-all-templates*` returns 0 matches. No grep references found in any script.
- **Affected surface hints**: ["spec.md §3 Files to Change", "research.md §12 Consumer Migration Map", "review/deep-review-strategy.md"]
- **Recommendation**: Remove references to `wrap-all-templates.{ts,sh}` from the specification scope and research documentation since these files never existed or were removed. Document the actual ANCHOR handling path through `template-structure.js` and `inline-gate-renderer.ts`.

```json
{
  "type": "claim-adjudication",
  "claim": "wrap-all-templates.ts and .sh exist as ANCHOR injection utilities",
  "evidenceRefs": ["spec.md:118", "research.md:150", "glob wrap-all-templates* = 0 matches"],
  "counterevidenceSought": true,
  "counterevidence": "Glob and grep searches across entire skill root return no matches. The ANCHOR handling is performed by template-structure.js (parseAnchoredSections, buildDecisionRecordContract) and inline-gate-renderer.ts (preserving ANCHOR tags within gated template content).",
  "alternativeExplanation": "These files may have been planned but never implemented, or may have been removed during the architecture transition to the manifest system.",
  "finalSeverity": "P1",
  "confidence": 1.0,
  "downgradeTrigger": null
}
```

---

### P2 Findings

**5. create.sh header comment describes outdated CORE + ADDENDUM architecture**

- **File**: `create.sh:7-10`
- **Evidence**: [SOURCE: create.sh:7-10] Header block describes "CORE + ADDENDUM" with `level_1/` (~270 LOC), `level_2/` (~390 LOC), `level_3/` (~540 LOC), `level_3+/` (~640 LOC). The actual code at lines 1502-1534 uses `copy_templates_batch` with manifest-based templates, and the `--help` output at line 258-275 also references CORE + ADDENDUM.
- **Description**: The header comment in `create.sh` documents an architecture (CORE + ADDENDUM with per-level directories) that no longer matches the actual implementation (manifest-based with `inline-gate-renderer`). This is a documentation discrepancy only — the actual code path is correct.
- **Finding class**: instance-only
- **Scope proof**: Lines 1502-1534 of create.sh confirm the actual implementation uses `copy_templates_batch` with manifest-based resolution. The header comment at lines 7-10 and help text at lines 258-275 are the only stale references — the functional code is correct.
- **Affected surface hints**: ["create.sh header comments (line 7-10)", "create.sh --help output (line 258-275)"]
- **Recommendation**: Update the header comment block and `--help` output in `create.sh` to reflect the manifest-based template architecture. This is cosmetic but reduces confusion for maintainers reading the file.

---

**6. get_level_templates_dir maps levels to directories that no longer exist**

- **File**: `template-utils.sh:37-47`
- **Evidence**: [SOURCE: template-utils.sh:37-47] The `get_level_templates_dir` function maps levels 1/2/3/3+ to `level_1/`, `level_2/`, `level_3/`, `level_3+/` directories that do not exist. The `_normalize_template_level` function at lines 185-197 similarly maps old directory paths to level numbers.
- **Description**: The `get_level_templates_dir` function is a legacy code path that maps documentation levels to directory names that no longer exist in the templates tree. The function is not called in any active code path found during this review (create.sh uses the manifest system directly through `resolve_level_contract` and `copy_templates_batch`). However, its presence could mislead future maintainers.
- **Finding class**: instance-only
- **Scope proof**: Grep for `get_level_templates_dir` usage in scripts shows no active callers. The actual template resolution uses `_manifest_template_path` (lines 199-214) and `resolve_level_contract` (lines 232-258). The `_normalize_template_level` function handles old directory paths as input but these paths no longer map to real directories.
- **Affected surface hints**: ["template-utils.sh get_level_templates_dir (line 37-47)", "template-utils.sh _normalize_template_level (line 185-197)"]
- **Recommendation**: Either (a) deprecate and remove `get_level_templates_dir` since it has no callers and maps to non-existent directories, or (b) add a deprecation warning comment. The `_normalize_template_level` function should be simplified if the old directory-path input format is no longer used.

---

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| spec.md §2 Problem describes compose.sh writing to disk | **MISMATCH** | compose.sh does not exist; inline-gate-renderer.ts is actual renderer |
| spec.md §3 Scope lists core/, addendum/, level_N/ as investigation targets | **MISMATCH** | None of these directories exist; actual templates in manifest/ |
| research.md §6 recommends extending compose.sh | **IMPOSSIBLE** | compose.sh does not exist; recommendation cannot be actioned |
| research.md §14 File/LOC deltas count 25 files/4,087 LOC in level dirs | **MISMATCH** | Level directories do not exist; counts apply to phantom architecture |
| research.md §4 Methodology cites compose.sh latency measurements | **UNAUDITABLE** | compose.sh does not exist; measurements cannot be reproduced |
| research.md §12 Consumer Migration Map references wrap-all-templates | **MISMATCH** | wrap-all-templates.{ts,sh} does not exist |
| template-structure.js reads from manifest path (line 317-330) | **CORRECT** | Uses `templates/manifest/` path, consistent with actual architecture |
| create.sh uses copy_templates_batch with manifest (line 1527) | **CORRECT** | Actual code path uses manifest-based resolution, not level dirs |
| template-utils.sh _manifest_template_path routes to manifest/ (line 199-214) | **CORRECT** | Correctly resolves templates from `templates/manifest/` directory |

## Integration Evidence

- **inline-gate-renderer.ts**: The actual template renderer (wrapped by `inline-gate-renderer.sh:14`). Processes `.tmpl` files with `<!-- IF level:... -->` section gates. Resolves from `templates/manifest/` directory.
- **spec-kit-docs.json**: The single source of truth for level contracts. Defines `requiredCoreDocs`, `requiredAddonDocs`, `lazyAddonDocs`, and `sectionGates` per level. Consumed by `template-structure.js::loadLevelContract` (line 132-154) and `template-utils.sh::resolve_level_contract` (line 232-258).
- **level-contract-resolver.ts**: Referenced at `template-utils.sh:239`. TypeScript module that provides `resolveLevelContract` and `serializeLevelContract` for shell callers.

## Edge Cases

1. **Manifest architecture may be the result of the consolidation**: The current manifest-based architecture (single `templates/manifest/` directory with `.tmpl` files + JSON contract) looks remarkably like the recommended end state. The investigation may have been conducted pre-consolidation, and the code is now post-consolidation. This would explain why all the files/directories the spec describes are absent — they were successfully removed.

2. **Deep-research may have targeted a stale code snapshot**: The research iteration records (10 iterations, research.md §4) reference compose.sh path, core/addendum, and level directories. If the investigation ran against a different branch/revision, the divergence would be explained by interleaved development.

3. **Ambiguity: Was the PARTIAL recommendation implemented, or was it the status quo?**: The manifest architecture is essentially what PARTIAL recommends but is already in place. This could mean either (a) the recommendation was successfully implemented, (b) the system was always manifest-based and the investigation targeted a different architecture, or (c) the investigation's problem statement described a planned architecture (core+addendum v2.2) that was in transition.

4. **template-utils.sh `get_level_templates_dir` may have external callers**: While this review found no internal callers, external scripts or downstream tooling might call this function. Direct deletion risks breaking undiscovered consumers.

## Confirmed-Clean Surfaces

- **template-structure.js**: Correctly reads templates from `templates/manifest/` path and resolves level contracts from `spec-kit-docs.json`. The `loadLevelContract` (line 132-154), `resolveTemplatePath` (line 317-330), and `loadTemplateContract` (line 420-501) functions are internally consistent with the manifest architecture.
- **template-utils.sh `_manifest_template_path`**: Correctly routes all template resolution through `templates/manifest/` directory (line 199-214).
- **template-utils.sh `resolve_level_contract`**: Correctly delegates to TypeScript resolver that reads `spec-kit-docs.json` (line 232-258).
- **template-structure.js ANCHOR parsing**: ANCHOR tag extraction (`parseAnchoredSections`, line 363-398), header extraction (`extractH2Headers`, line 332-347), and contract merging (`mergeTemplateContracts`, line 503-582) do not depend on level directories and work correctly with manifest templates.

## Ruled Out

- **P0 security findings**: No exploitable security issues, authentication bypass, or destructive data loss patterns found in reviewed implementation files.
- **Performance regression in create.sh**: The manifest-based `copy_templates_batch` path (create.sh:1527) appears equivalent or faster than hypothetical compose.sh since it renders directly without intermediate disk writes.
- **Validator breakage from missing level dirs**: `template-structure.js` reads from manifest paths, not level directories. Validator functionality is not dependent on materialized level output directories.

## Next Focus

- **Dimension**: code-correctness
- **Focus Area**: Deterministic rendering — verify that `inline-gate-renderer.ts` produces deterministic output for identical inputs, since the research identified this as a Phase 1 prerequisite (byte-equivalence repair). Also audit error handling in create.sh and template-utils.sh.
- **Reason**: The implementation uses a different rendering path than documented (inline-gate-renderer instead of compose.sh). After establishing the architecture discrepancy in this iteration, the next iteration should verify the actual rendering path is correct.
- **Rotation Status**: Rotating to next dimension (code-correctness)
- **Blocked/Productive Carry-Forward**: Carry forward the finding that the manifest architecture handles rendering. Next iteration should test whether inline-gate-renderer output is deterministic.
- **Required Evidence**: Run `inline-gate-renderer.sh` twice with same inputs and compare outputs. Verify error handling for missing templates and invalid levels.
- **Recovery Note**: N/A (this iteration completed successfully)
