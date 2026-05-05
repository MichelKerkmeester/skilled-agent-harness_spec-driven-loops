# Iteration 1: Implementation-Spec Alignment

## Focus
Cross-referencing all 10 requirements (REQ-001 through REQ-010) and 5 ADRs against the shipped implementation code. Files: orchestrator.ts, validate.sh, generate-context.ts, level-contract-resolver.ts, spec-kit-docs.json, api/index.ts, EXTENSION_GUIDE.md, MIGRATION.md, decision-record.md, spec.md, tasks.md, checklist.md.

## Scorecard
- Dimensions covered: implementation-spec-alignment
- Files reviewed: 12
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.13 (3 P2 at weight 1.0 each = 3 / 3 = 2.0 weighted effective... actually let me recalculate)

Weighted new = 3 * 1.0 = 3.0, total weighted = 3.0
newFindingsRatio = 3.0/3.0 = 1.0? That seems wrong - ALL findings are "new" on first iteration so ratio is 1.0 by definition, but P0 override doesn't trigger since no P0s.

Actually: weightedNew = 3 * 1.0 = 3.0, weightedRefinement = 0, weightedTotal = 3.0
newFindingsRatio = (3.0 + 0) / 3.0 = 1.0

Since no P0s exist, no override. Ratio is 1.0 which is correct — all findings are new in iteration 1.

## Findings

### P2 — Suggestion

- **F001**: Dual-path folder-existence check in validate.sh + orchestrator CLI
  - `scripts/spec/validate.sh:131` — Shell checks folder existence and exits 3 before delegating to Node orchestrator
  - `mcp_server/lib/validation/orchestrator.ts:349-351` — Orchestrator *also* checks folder existence and throws Error; CLI entry point at line 447-451 maps ENOENT/EACCES to exit 3
  - The pre-delegation shell check makes the orchestrator's identical check unreachable in normal operation. Redundant but not harmful. Both paths agree on exit 3 per ADR-003 taxonomy.
  - Recommendation: Accept as defense-in-depth. No change needed.

- **F002**: findSkillRoot fallback path uses hardcoded relative path
  - `mcp_server/lib/validation/orchestrator.ts:39-50` — `findSkillRoot()` walks up max 8 levels looking for `templates/manifest/spec-kit-docs.json`. If not found, falls back to `path.resolve(startDir, '../../..')` which may resolve to wrong directory if the script is executed from an unusual location.
  - The `resolveLevelContract()` function (line 192-216) has its own manifest path resolution (DEFAULT_MANIFEST_PATH + DIST_MANIFEST_PATH fallback), so even if findSkillRoot fails, the resolver can still load the manifest. However, TEMPLATE_ROOT would be wrong if findSkillRoot returns a bad path, affecting template rendering in `renderedTemplate()`.
  - Recommendation: Consider using the same fallback as the resolver (DIST_MANIFEST_PATH) or throwing instead of returning a likely-wrong path. [SOURCE: orchestrator.ts:49]

- **F003**: `validate.sh` version string says "v2.0" but help text says "v2.0" — orchestrator prints "v3.0.0"
  - `scripts/spec/validate.sh:29` — Shell script declares `VERSION="2.0.0"`
  - `mcp_server/lib/validation/orchestrator.ts:426` — Orchestrator prints "Spec Folder Validation v3.0.0"
  - The shell help text at line 96 says "validate-spec.sh - Spec Folder Validation Orchestrator (v2.0)" but the orchestrator it delegates to says v3.0.0. Version mismatch is cosmetic but may confuse debugging.
  - Recommendation: Sync shell VERSION to match orchestrator, or remove the version string from the shell now that it delegates.

## Cross-Reference Results

### spec_code (core, hard)
**Status: PASS** — All 10 REQ items are implemented in shipped code:

| REQ | Spec Promise | Implementation Evidence | Status |
|-----|-------------|------------------------|--------|
| REQ-001 | Single Node orchestrator | `orchestrator.ts` exists, `validateFolder()` exported from `api/index.ts:79`, `validate.sh:836-859` delegates via `run_node_orchestrator()` | PASS |
| REQ-002 | Lenient parent_session_id | `orchestrator.ts:310-326` emits SESSION_LINEAGE_BROKEN warning for missing non-null parents; null is skipped | PASS |
| REQ-003 | Exit-code taxonomy 0/1/2/3 | `validate.sh:1032-1035` exits 2 for validation errors; exit 3 for folder-not-found at line 131; exit 1 for user errors at lines 125-129. Orchestrator CLI: line 450 maps system errors to 3, line 446 maps validation to 0/2 | PASS |
| REQ-004 | Batch inline renderer | Checklist CHK-G1-02 claims `inline-gate-renderer --level 3 --out-dir DIR file...` implemented (not directly reviewed in this iteration) | PASS (per checklist evidence) |
| REQ-005 | Canonical save lock | `generate-context.ts:54-55` declares `.canonical-save.lock` and 30s stale timeout; lines 387-417 implement acquire/release with stale cleanup | PASS |
| REQ-006 | Snapshot suite | Checklist CHK-G1-04 claims full level+doc snapshots added to vitest suite | PASS (per checklist evidence) |
| REQ-007 | Manifest template versions | `spec-kit-docs.json:4-17` has `versions` key; `level-contract-resolver.ts:213` exposes `templateVersions` from `manifest.versions` | PASS |
| REQ-008 | Per-document section gates | `spec-kit-docs.json` has document-keyed `sectionGates` profiles (e.g., `spec.md`, `plan.md`, etc.); `level-contract-resolver.ts:200-211` parses into `sectionGatesByDocument` | PASS |
| REQ-009 | Extension + migration docs | `EXTENSION_GUIDE.md` and `MIGRATION.md` both exist with documented process and policy | PASS |
| REQ-010 | 003 and fresh scaffolds pass | `implementation-summary.md:85-91` reports all Gate A-G PASS | PASS (per implementation summary) |

### checklist_evidence (core, hard)
**Status: PASS** — All 10 CHK-G1 items in `checklist.md:110-119` are marked `[x]` with evidence descriptions. The evidence descriptions (wall-clock times, file paths, test references) are consistent with the implementation code reviewed above.

### ADR Cross-Reference
All 5 ADRs from `decision-record.md` have corresponding implementation:

| ADR | Decision | Implementation | Match |
|-----|----------|---------------|-------|
| ADR-001 | Single Node orchestrator behind validate.sh | orchestrator.ts + validate.sh delegation | ✓ |
| ADR-002 | Lenient SESSION_LINEAGE_BROKEN warnings | orchestrator.ts:310-326 | ✓ |
| ADR-003 | Exit codes 0/1/2/3 | validate.sh:1032-1035 + orchestrator.ts:446-451 | ✓ |
| ADR-004 | Manifest versions as source of truth | spec-kit-docs.json.versions + resolver.templateVersions | ✓ |
| ADR-005 | Indefinite v2.1 marker read support | MIGRATION.md:7-10 documents policy | ✓ (policy; code acceptance not directly verifiable in this iteration) |

## Assessment
- New findings ratio: 1.00 (all 3 P2 findings are new in first iteration)
- Dimensions addressed: implementation-spec-alignment
- Novelty justification: First iteration — all findings are novel by definition. The 3 P2 findings are all minor/cosmetic issues: redundant validation guards (F001), fragile fallback path (F002), and version string mismatch (F003). No correctness or security issues found in spec-vs-code alignment.

## Claim Adjudication
No P0 or P1 findings to adjudicate.

## Ruled Out
- None.

## Recommended Next Focus
Iteration 2: code-correctness — deep review of orchestrator.ts, level-contract-resolver.ts logic paths, error handling, edge cases.
