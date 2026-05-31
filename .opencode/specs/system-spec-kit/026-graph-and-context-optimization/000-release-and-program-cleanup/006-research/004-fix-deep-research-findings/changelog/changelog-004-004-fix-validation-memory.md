---
title: "Phase 004: Validation and Memory Remediation"
description: "Thirteen surgical fixes close advisor schema bounding, memory-parser causal-link extraction, causal-links insert accounting, checkpoint snapshot restore, search-results formatting plus three spec-validation shell rules identified by packet 046 deep research. Adds typed zod schemas where generic JSON parses bypassed validation. Reuses the existing markdown anchor parser in shell rules. Gates insert counters on real storage-layer return values."
trigger_phrases:
  - "validation and memory remediation"
  - "advisor schema bounding causal links"
  - "F-005-A5 F-008-B3 F-009-B4 fixes"
  - "checkpoint snapshot zod quarantine"
  - "check-evidence strict semantic marker"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/004-fix-validation-memory` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

Packet 046 deep research surfaced thirteen loose-typing, generic-parse plus false-positive bugs across the advisor, memory plus spec-validation subsystems. Advisor input paths flowed through `resolve()` without realpath canonicalization or allowlist bounding. Corpus and regression JSONL rows were parsed with bare `JSON.parse` and no per-row schema. The memory parser hand-rolled `description.json` parsing instead of reusing the existing schema. The causal-link extractor only matched the camelCase token even though the rest of the ecosystem accepted both casings. Four shell rules used by `validate.sh` mishandled markdown-aware constructs.

Thirteen surgical fixes close all findings. Each fix is the smallest change that resolves the specific bug: adds zod schemas where they were missing, reuses the markdown anchor parser inside shell rules where one already existed. Insert-counter increments are gated on the actual return shape of the storage layer. The full stress suite grew from 163 to 195 tests, all passing. No regressions against existing fixtures.

### Added

- Seven vitest files covering every new TS schema and parser change, pinning the validation behaviors
- Four test fixtures under `scripts/test-fixtures/` (064 through 067) covering angle-bracket links, strict semantic markers, mid-doc header drift plus uppercase-X checkboxes
- `scripts/lib/check-priority-helper.sh` (NEW) as a shared sourced helper for priority parsing reused by both `check-evidence.sh` and the priority-tag rule
- `mcp_server/skill_advisor/schemas/__tests__/advisor-tool-schemas.vitest.ts` (NEW) with zod validation cases for the bounded workspace root
- `mcp_server/skill_advisor/handlers/__tests__/advisor-validate-shapes.vitest.ts` (NEW) for corpus row and Python stdout shape validation
- `mcp_server/formatters/__tests__/search-results-trigger-phrases.vitest.ts` (NEW) for typed triggerPhrases validation

### Changed

- `AdvisorRecommendInputSchema` and `AdvisorValidateInputSchema` now bound `workspaceRoot` via `realpathSync.native` against a repo-root and `os.tmpdir()` allowlist
- `loadCorpus()` and `loadRegressionCases()` in `advisor-validate.ts` now run each JSONL line through `CorpusRowSchema` and `RegressionCaseSchema` with line-numbered errors on first violation
- `runPythonTopSkills()` validates stdout shape with `PythonTopSkillsSchema` and asserts returned length equals `rows.length`
- `extract_markdown_link_targets` in `check-spec-doc-integrity.sh` now captures angle-bracket relative links, reference-style link definitions plus shortcut reference links
- `check-template-headers.sh` preserves `extra_header` results from the helper. Headers before the last matched required header surface as `mid_document_extra_header` warnings. Both `[x]` and `[X]` now match in bare-priority and CHK regexes

### Fixed

- `triggerPhrases` formatter in `search-results.ts` used a generic `safeJsonParse<string[]>` without element-level validation. Replaced with a typed `parseTriggerPhrases` that asserts every element is a string.
- `parseDescriptionMetadataContent()` in `memory-parser.ts` hand-rolled per-field defensive coercions instead of using the existing `perFolderDescriptionSchema`. Now delegates to `safeParse` with path-aware error messages.
- `extractCausalLinks()` only matched the camelCase `causalLinks:` token. Regex widened to accept `causal_links:` (case-insensitive), aligning with the snake_case token already used elsewhere in the parser ecosystem.
- `restoreCheckpoint()` deserialized the gzipped snapshot with a bare cast. Now validates through `CheckpointSnapshotSchema` and quarantines malformed rows into `result.errors` instead of propagating untyped data into restore loops.
- `processCausalLinks()` incremented `result.inserted` even when `insertEdge` returned null. Now gates the counter on a real non-null row id and records skipped reasons in `result.errors`.
- `check-evidence.sh` treated any second checkbox on the same line as evidence. Now requires strict semantic markers (`[EVIDENCE: ...]`, `(verified)`, `(tested)`, `(confirmed)`, `[DEFERRED: ...]`, unicode marks, `| Evidence:`).

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` (this packet) | Errors: 0, Warnings: 4 (parity with the 010 pilot at Warnings: 5) |
| `npm run stress` | 58 files, 195 tests, exit 0 (baseline was 56 files, 163 tests) |
| Targeted vitest (7 new files) | 55 of 55 passed |
| Existing advisor handler tests | 41 of 41 passed |
| Existing memory-parser tests | 47 of 47 passed |
| Existing causal-edges and checkpoints tests | 190 of 190 passed |
| Existing checkpoint and search-results consumers | 73 of 73 passed |
| All 62 pre-existing fixtures | Zero regressions. Only the 4 new fixtures 064 through 067 appear in the POST diff. |
| Inline finding markers | 13 markers present, one per finding |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Modified | Bounded workspaceRoot allowlist refinement (F-005-A5-01) |
| `mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Modified | Realpath + allowlist re-validation at handler entry (F-005-A5-01) |
| `mcp_server/skill_advisor/handlers/advisor-validate.ts` | Modified | CorpusRowSchema, RegressionCaseSchema, PythonTopSkillsSchema added (F-005-A5-01 through 03) |
| `mcp_server/formatters/search-results.ts` | Modified | Typed string element validator for triggerPhrases (F-005-A5-04) |
| `mcp_server/lib/parsing/memory-parser.ts` | Modified | perFolderDescriptionSchema reuse for description.json. causal-links regex widened to snake_case (F-005-A5-05, F-008-B3-01) |
| `mcp_server/lib/storage/checkpoints.ts` | Modified | CheckpointSnapshotSchema added. Malformed rows quarantined into result.errors (F-005-A5-06) |
| `mcp_server/handlers/causal-links-processor.ts` | Modified | Insert counter gated on real non-null row id. Skipped reasons recorded in result.errors (F-008-B3-02) |
| `scripts/rules/check-spec-doc-integrity.sh` | Modified | Three-format link extraction added (F-009-B4-01) |
| `scripts/rules/check-evidence.sh` | Modified | Strict semantic-marker evidence. Priority parsing extracted to shared helper (F-009-B4-02, F-009-B4-03) |
| `scripts/rules/check-template-headers.sh` | Modified | extra_header preservation. Mid-doc drift warning. Uppercase X checkbox match (F-009-B4-04, F-009-B4-05) |
| `scripts/lib/check-priority-helper.sh` (NEW) | Created | Shared sourced priority helper eliminating duplicate regex maintenance (F-009-B4-03) |
| `mcp_server/skill_advisor/schemas/__tests__/advisor-tool-schemas.vitest.ts` (NEW) | Created | Zod validation test for bounded workspaceRoot |
| `mcp_server/skill_advisor/handlers/__tests__/advisor-validate-shapes.vitest.ts` (NEW) | Created | Corpus row and Python stdout shape tests |
| `mcp_server/formatters/__tests__/search-results-trigger-phrases.vitest.ts` (NEW) | Created | Typed triggerPhrases validation tests |
| `mcp_server/tests/memory-parser-description-schema.vitest.ts` (NEW) | Created | perFolderDescriptionSchema delegation tests |
| `mcp_server/tests/memory-parser-causal-links-snake-case.vitest.ts` (NEW) | Created | Snake-case causal-links extraction tests |
| `mcp_server/tests/causal-links-processor-null-insert.vitest.ts` (NEW) | Created | Null insert return gating tests |
| `mcp_server/tests/checkpoints-restore-snapshot-schema.vitest.ts` (NEW) | Created | Snapshot schema quarantine tests |
| `scripts/test-fixtures/064-link-formats/` (NEW) | Created | Angle-bracket and reference-style markdown link fixture |
| `scripts/test-fixtures/065-evidence-strict-marker/` (NEW) | Created | Strict-marker evidence rule fixture |
| `scripts/test-fixtures/066-template-header-drift-mid/` (NEW) | Created | Mid-document header drift fixture |
| `scripts/test-fixtures/067-checklist-uppercase-x/` (NEW) | Created | Uppercase-X checkbox fixture |

### Follow-Ups

- Migrate `extractCausalLinks` in `memory-parser.ts` from a regex block matcher to a proper YAML library when the full parser rewrite is scoped (deferred per F-008-B3-01 research note).
- Extend the workspace-root allowlist beyond repo root and `os.tmpdir()` if caller environments outside both prefixes are identified in a future audit.
- Tighten `CheckpointSnapshotSchema` to validate referential consistency between edge rows and memory ids at restore time, not only row shape.
