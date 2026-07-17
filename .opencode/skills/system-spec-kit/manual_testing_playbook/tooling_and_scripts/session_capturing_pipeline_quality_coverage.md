---
title: "139 -- Session capturing pipeline quality"
description: "This scenario validates Session capturing pipeline quality for `139`. It focuses on Canonical coverage sourced from M-007 session-capturing closure verification."
version: 3.6.0.17
id: tooling-and-scripts-session-capturing-pipeline-quality-coverage
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 139 -- Session capturing pipeline quality

## 1. OVERVIEW

This scenario validates Session capturing pipeline quality for `139`. It focuses on Canonical coverage sourced from M-007 session-capturing closure verification.

---

## 2. SCENARIO CONTRACT


- Objective: Canonical coverage sourced from M-007 session-capturing closure verification.
- Real user request: `` Please validate Session capturing pipeline quality against the documented validation surface and tell me whether the expected signals are present: Coverage is sourced from the M-007 closure suite, including JSON authority, shipped structured-summary fields (`toolCalls`, `exchanges`), file-backed JSON authority, Phase 018 output-quality hardening, insufficiency rejection, and indexing readiness. ``
- Prompt: `Validate Session capturing pipeline quality against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Coverage is sourced from the M-007 closure suite, including JSON authority, shipped structured-summary fields (`toolCalls`, `exchanges`), file-backed JSON authority, Phase 018 output-quality hardening, insufficiency rejection, and indexing readiness
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the M-007 closure matrix passes and covers the session-capturing quality contract; FAIL if the canonical M-007 coverage is incomplete or contradictory.

---

## 3. TEST EXECUTION

### Prompt

```
Validate Session capturing pipeline quality against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. See the canonical M-007 snippet for the full automated, standards, and manual execution matrix.

### Expected

Coverage is sourced from the M-007 closure suite, including JSON authority, shipped structured-summary fields (`toolCalls`, `exchanges`), file-backed JSON authority, Phase 018 output-quality hardening, insufficiency rejection, and indexing readiness.

### Evidence

- Canonical M-007 snippet and linked feature catalog were read. The catalog says the feature covers JSON authority, structured-summary fields, file-backed JSON authority, insufficiency rejection, indexing readiness, and output-quality hardening:
  ```text
  120: ### 3.1 JSON-mode authority
  122: - `--stdin` and `--json` are the preferred save paths for AI-composed input. Positional JSON file input remains supported on the same structured path.
  124: - Structured JSON summaries also preserve shipped fields such as `toolCalls` and `exchanges`.
  125: - File-backed JSON remains on the structured path and does not fall back into hybrid reconstruction.
  134: - After normalization, `generate-context.js` evaluates one shared semantic sufficiency snapshot before writing or indexing.
  135: - The save aborts with `INSUFFICIENT_CONTEXT_ABORT` when the content does not preserve enough durable evidence.
  158: ### 3.9b Output-quality hardening
  160: - Decision rendering now keeps `CONTEXT`, `RATIONALE`, and chosen-option details distinct instead of duplicating the same rationale text.
  161: - Completion-status inference now recovers correctly when normalized `nextSteps` content has already moved into observations.
  162: - Blocker extraction now requires blocker-shaped phrasing rather than broad keywords like `error` or `failed`.
  163: - Generic implementation-pattern and trigger-phrase filler is filtered more aggressively so saved output stays specific.
  164: - `key_files` parsing now accepts em dash, en dash, and colon separators in addition to the basic hyphen form.
  165: - Tree thinning now protects memory-save quality with a `150`-token merge threshold and a maximum of `3` children per merged parent.
  166: - Structured JSON runs can synthesize richer assistant conversation content from `sessionSummary`, key decisions, and next steps when prompt arrays are sparse.
  ```
- Part I spot-check command output:
  ```text
  $ grep -n 'crypto.randomBytes' .opencode/skills/system-spec-kit/scripts/extractors/session-extractor.ts
  89:  const randomPart = crypto.randomBytes(6).toString('hex'); // 6 bytes = 12 hex chars = 48 bits

  $ grep -n 'qualityAbortThreshold' .opencode/skills/system-spec-kit/scripts/core/workflow.ts .opencode/skills/system-spec-kit/scripts/core/config.ts
  .opencode/skills/system-spec-kit/scripts/core/config.ts:37:  qualityAbortThreshold: number;
  .opencode/skills/system-spec-kit/scripts/core/config.ts:107:    log('warn', 'qualityAbortThreshold invalid or out of range 0.0-1.0 (or legacy 1-100), using default', {
  .opencode/skills/system-spec-kit/scripts/core/config.ts:115:    log('warn', 'qualityAbortThreshold uses legacy 1-100 scale and was auto-converted to canonical 0.0-1.0', {
  .opencode/skills/system-spec-kit/scripts/core/config.ts:154:  validated.qualityAbortThreshold = normalizeQualityAbortThreshold(
  .opencode/skills/system-spec-kit/scripts/core/config.ts:155:    validated.qualityAbortThreshold,
  .opencode/skills/system-spec-kit/scripts/core/config.ts:156:    defaults.qualityAbortThreshold,
  .opencode/skills/system-spec-kit/scripts/core/config.ts:242:    qualityAbortThreshold: 0.15,
  .opencode/skills/system-spec-kit/scripts/core/config.ts:306:  QUALITY_ABORT_THRESHOLD: userConfig.qualityAbortThreshold,

  $ grep -n 'claude-code-capture\|opencode-cli-capture\|copilot-cli-capture' .opencode/skills/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skills/system-spec-kit/scripts/utils/input-normalizer.ts
  .opencode/skills/system-spec-kit/scripts/utils/input-normalizer.ts:28:  | 'claude-code-capture'
  .opencode/skills/system-spec-kit/scripts/utils/input-normalizer.ts:29:  | 'opencode-cli-capture'
  .opencode/skills/system-spec-kit/scripts/utils/input-normalizer.ts:30:  | 'copilot-cli-capture'

  $ grep -n 'INSUFFICIENT_CONTEXT_ABORT\|evaluateMemorySufficiency' .opencode/skills/system-spec-kit/scripts/core/workflow.ts .opencode/skills/system-spec-kit/shared/parsing/memory-sufficiency.ts
  .opencode/skills/system-spec-kit/scripts/core/workflow.ts:56:  evaluateMemorySufficiency,
  .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1590:  const sufficiencyResult = evaluateMemorySufficiency({
  .opencode/skills/system-spec-kit/shared/parsing/memory-sufficiency.ts:59:export const MEMORY_SUFFICIENCY_REJECTION_CODE = 'INSUFFICIENT_CONTEXT_ABORT' as const;
  .opencode/skills/system-spec-kit/shared/parsing/memory-sufficiency.ts:311:export function evaluateMemorySufficiency(snapshot: MemoryEvidenceSnapshot): MemorySufficiencyResult {

  $ grep -n 'WORKFLOW_HTML_COMMENT_RE\|stripWorkflowHtmlOutsideCodeFences' .opencode/skills/system-spec-kit/scripts/core/workflow.ts
  73:import { stripWorkflowHtmlOutsideCodeFences, escapeLiteralAnchorExamples } from './content-cleaner.js';
  1913:export { stripWorkflowHtmlOutsideCodeFences } from './content-cleaner.js';

  $ grep -n 'SYSTEM_SPEC_KIT_CAPTURE_SOURCE\|trigger_phrases' .opencode/skills/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts
  (no output)
  ```
- `cd .opencode/skills/system-spec-kit/scripts && npm run check` failed:
  ```text
  > @spec-kit/scripts@1.7.2 check
  > npm run lint && npx tsx evals/check-no-mcp-lib-imports.ts && bash check-api-boundary.sh && npx tsx evals/check-architecture-boundaries.ts && npx tsx evals/check-allowlist-expiry.ts && npx tsx evals/check-source-dist-alignment.ts && npx tsx evals/check-no-mcp-lib-imports-ast.ts && npx tsx evals/check-handler-cycles-ast.ts


  > @spec-kit/scripts@1.7.2 lint
  > tsc --noEmit

  Import policy check FAILED: 17 violation(s) found:

    tests/architecture-boundary-enforcement.vitest.ts:242 → ../../shared/utils
    tests/architecture-boundary-enforcement.vitest.ts:247 → ../shared/utils
    tests/graph-metadata-backfill.vitest.ts:7 → ../../mcp_server/lib/graph/graph-metadata-parser.js
    tests/graph-metadata-refresh.vitest.ts:8 → ../../mcp_server/lib/graph/graph-metadata-parser.js
    tests/level-contract-resolver.vitest.ts:6 → ../../mcp_server/lib/templates/level-contract-resolver
    tests/memory-pipeline-regressions.vitest.ts:67 → ../../shared/embeddings
    tests/memory-pipeline-regressions.vitest.ts:109 → ../../shared/embeddings
    tests/memory-template-contract.vitest.ts:5 → ../../shared/parsing/memory-template-contract
    tests/scaffold-golden-snapshots.vitest.ts:8 → ../../mcp_server/lib/templates/level-contract-resolver
    tests/scoped-backfill-boundary.vitest.ts:11 → ../../mcp_server/lib/utils/index-scope.js
    tests/session-cached-consumer.vitest.ts.test.ts:341 → ../../mcp_server/handlers/session-resume.js
    tests/session-cached-consumer.vitest.ts.test.ts:342 → ../../mcp_server/handlers/session-bootstrap.js
    tests/session-isolation.vitest.ts:19 → ../../mcp_server/handlers/coverage-graph/query.js
    tests/session-isolation.vitest.ts:20 → ../../mcp_server/handlers/coverage-graph/status.js
    tests/session-isolation.vitest.ts:21 → ../../mcp_server/handlers/coverage-graph/convergence.js
    tests/workflow-canonical-save-metadata.vitest.ts:39 → ../../mcp_server/lib/graph/graph-metadata-parser
    validation/generated-metadata-drift.ts:15 → ../../mcp_server/lib/config/capability-flags.js

  To fix: either use @spec-kit/mcp-server/api/* or add to import-policy-allowlist.json
  npm error Lifecycle script `check` failed with error:
  npm error code 1
  npm error path /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts
  npm error workspace @spec-kit/scripts@1.7.2
  npm error location /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts
  npm error command failed
  npm error command sh -c npm run lint && npx tsx evals/check-no-mcp-lib-imports.ts && bash check-api-boundary.sh && npx tsx evals/check-architecture-boundaries.ts && npx tsx evals/check-allowlist-expiry.ts && npx tsx evals/check-source-dist-alignment.ts && npx tsx evals/check-no-mcp-lib-imports-ast.ts && npx tsx evals/check-handler-cycles-ast.ts
  ```
- `cd .opencode/skills/system-spec-kit/mcp_server && npm run lint` failed:
  ```text
  ✖ 35 problems (30 errors, 5 warnings)
    0 errors and 5 warnings potentially fixable with the `--fix` option.

  npm error Lifecycle script `lint` failed with error:
  npm error code 1
  npm error path /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server
  npm error workspace @spec-kit/mcp-server@1.8.0
  npm error location /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server
  npm error command failed
  npm error command sh -c eslint . --ext .ts
  ```
- Alignment drift verifier path points to the existing script location:
  ```text
  $ python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/scripts
  [alignment-drift] PASS
  Scanned files: 473
  Findings: 0
  Errors: 0
  Warnings: 0
  Violations: 0
  ```
- Spec validation command failed for the pre-approved spec folder:
  ```text
  $ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/031-manual-playbook-execution-sweep
  Auto-enabled recursive validation: phase child folders detected.

  Spec Folder Validation v3.0.0

    Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep
    Level:  phase

  x SPEC_DOC_SUFFICIENCY: 1 spec_doc_sufficiency issue(s) found
  x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
  ! EVIDENCE_CITED: Found 15 completed item(s) without evidence
  ! PHASE_LINKS: 1 phase link issue(s) found
  ! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
  ! AI_PROTOCOL: AI protocol incomplete (1/4 components)

  Summary: Errors: 2  Warnings: 4

  RESULT: FAILED

  Spec Folder Validation v3.0.0

    Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/001-findings-remediation
    Level:  2

  x FILE_EXISTS: Missing 1 required file(s) for Level 2
  x TEMPLATE_SOURCE: Template source header missing
  x TEMPLATE_HEADERS: 11 template headers issue(s) found
  x ANCHORS_VALID: 13 template anchors issue(s) found
  x FRONTMATTER_MEMORY_BLOCK: 4 frontmatter_memory_block issue(s) found
  x SPEC_DOC_SUFFICIENCY: 3 spec_doc_sufficiency issue(s) found
  x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
  x LEVEL_MATCH: Level consistency errors

  Summary: Errors: 8  Warnings: 4

  RESULT: FAILED
  ```
- The remaining M-007 matrix commands were not run because this task allowed writes only to `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling_and_scripts/session_capturing_pipeline_quality_coverage.md`, while the documented matrix includes write-producing commands such as `npm run build`, `npm run test:legacy` (`npm run build && ...`), MCP `npm run build` (`tsc --build && node scripts/finalize-dist.mjs`), and manual `generate-context.js` save/index scenarios that create or update files outside the allowed path.

### Pass / Fail

- **FAIL**: the M-007 closure matrix did not pass in this repo state. `npm run check`, MCP `npm run lint`, and `spec/validate.sh` all failed; the remaining build/test/manual save lanes could not be run under the single-file allowed-write constraint.

### Failure Triage

Inspect the M-007 snippet, the session-capturing catalog entry, and the related closure evidence before introducing any alternative scenario wording.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/session_capturing_pipeline_quality.md](../../feature_catalog/tooling_and_scripts/session_capturing_pipeline_quality.md)
- Canonical memory/spec scenario: [M-007](session_capturing_pipeline_quality.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 139
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/session_capturing_pipeline_quality_coverage.md`
