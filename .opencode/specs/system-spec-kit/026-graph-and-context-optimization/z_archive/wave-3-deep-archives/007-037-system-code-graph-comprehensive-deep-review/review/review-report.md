---
title: "Deep Review Report — system-code-graph (20 iterations, cli-devin SWE-1.6)"
description: "Synthesized findings from the 20-iteration deep-review campaign on system-code-graph v1.0.0.0. Validated P0/P1/P2 list with file:line evidence + verdicts."
importance_tier: "important"
contextType: "implementation"
---

# Deep Review Report — system-code-graph v1.0.0.0

**Run date:** 2026-05-15
**Executor:** `cli-devin` model `swe-1.6` permission-mode `auto`
**Iterations:** 20 (all exit 0, wall-clock 14 min, per-iter avg 45s)
**Validation:** Every P0 + critical P1 claim grep-verified or smoke-tested before promotion to this report (cli-devin SWE-1.6 hallucination risk per memory `feedback_cli_devin_bundle_verification.md`).

---

## Executive verdict

**🟡 CONDITIONAL — ship v1.0.0.0 only after fixing the spec-kit isolation P0**

The skill is functionally solid (10 MCP tools work, dispatch contract is clean, tests run, docs are present). However, **the v1.0.0.0 release narrative is materially wrong about one thing**: both `INSTALL_GUIDE.md` and `changelog/v1.0.0.0.md` claim "zero `from 'system-spec-kit'` imports remain in `system-code-graph` source." Reality: **46 imports across 23 files, 15 of them in production code paths**. The CI isolation check (`.github/workflows/isolation-check.yml`) only audits the reverse direction (spec-kit → code-graph), which is why this went undetected.

Two actionable paths:

1. **Fix the imports** (substantial — refactor 15 production files to remove or relocate cross-skill dependencies).
2. **Update the docs** to honestly state "code-graph still consumes shared types and helpers from system-spec-kit via @spec-kit/shared and a small set of direct imports; full decoupling is a future arc."

Recommend Path 2 for v1.0.0.0 + open a follow-on packet for Path 1 (call it 038 if pursued). Either way, the changelog needs an addendum and the CI workflow needs a reverse-direction audit step.

Other than that one P0, there are 25 P1 findings (real engineering issues — mostly defensive coding gaps, missing tests, doc drift) and 30+ P2 nice-to-haves. None of the other P1s block v1.0.0.0 individually.

---

## P0 findings (release-blocking, validated)

| # | What | Where | Why P0 | Fix |
|---|------|-------|--------|-----|
| **P0-1** | **Spec-kit isolation violation contradicts v1.0.0.0 changelog claim.** The skill imports from `system-spec-kit` in **46 places across 23 files** (15 in production `mcp_server/` + 8 in tests). The v1.0.0.0 changelog and INSTALL_GUIDE.md §1 both assert zero imports. | Production files: `mcp_server/tool-schemas.ts`, `tools/code-graph-tools.ts`, `lib/readiness-marker.ts:16`, `lib/readiness-contract.ts:36-44`, `lib/structural-indexer.ts:23-24`, `lib/gold-query-verifier.ts:9`, `lib/runtime-detection.ts:8`, `lib/startup-brief.ts:9-17`, `lib/compact-merger.ts:12`, `lib/ops-hardening.ts:11-18`, `handlers/query.ts:14` + 4 more. Test files: `tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:8-14`, `tests/crash-recovery.vitest.ts:27-34`, plus 6 stress tests. CI: `.github/workflows/isolation-check.yml:19-40` audits only one direction. | Documentation lies about the architecture. Future maintainers will trust the claim and write code on top of a false premise. | **Recommended (Path 2):** rewrite the isolation section of changelog + INSTALL_GUIDE to describe what's actually shipped (shared-types coupling via @spec-kit/shared + a few direct imports). Add a reverse-direction audit to isolation-check.yml so the gap is visible in CI. Open packet 038 if full Path 1 refactor is desired. |
| **P0-2** | **`ccc_*` CocoIndex bridge handlers all return fake readiness state.** Every call to `ccc_status`, `ccc_reindex`, `ccc_feedback` hardcodes `buildUnavailableReadiness('readiness_not_applicable')` regardless of the actual CocoIndex state. | `mcp_server/handlers/ccc-status.ts:37`, `ccc-reindex.ts:57`, `ccc-feedback.ts:57` | The readiness contract is meaningless — consumers (Claude Code, other AI runtimes) cannot trust whether the CocoIndex bridge is live, stale, or absent. Breaks the framework's readiness invariant. | Either implement real CocoIndex readiness detection (probe the binary, check index freshness) or remove the readiness field from these handlers entirely and document them as readiness-agnostic. |

**Note: ❌ P0-3 candidate dismissed (HALLUCINATED).** Iter-011 reported a "TypeScript compilation error at `apply-orchestrator.ts:342` (`${operation satisfies never}`)". `npx tsc --noEmit -p tsconfig.json` returns clean. The `satisfies never` pattern is valid TypeScript exhaustiveness narrowing. This is exactly the SWE-1.6 hallucination class memory `feedback_cli_devin_bundle_verification.md` warned about.

---

## P1 findings (high priority, validated)

Grouped by dimension. All file:line citations verified.

### A. Documentation (sk-doc alignment)

| # | What | Where | Fix |
|---|------|-------|-----|
| **P1-A1** | SKILL.md §2 SMART ROUTING uses a static intent-to-surface table, not the Smart Router Pseudocode block sk-doc's `skill_md_template.md:659-754` mandates. | `SKILL.md:44-62` | Replace with template-conforming pseudocode block (5 subsections + scoped guards + recursive discovery + weighted scoring). |
| **P1-A2** | SKILL.md §4 RULES uses unstructured bullets, not the required `ALWAYS / NEVER / ESCALATE IF` triad. | `SKILL.md:76-83` | Restructure into 3 ALL-CAPS subsections. |
| **P1-A3** | SKILL.md §1 WHEN TO USE lacks explicit `Activation Triggers` and `Keyword Triggers` subsections. Keywords are buried in an HTML comment instead of being a discoverable subsection. | `SKILL.md:20, 26-34` | Promote keywords + activation triggers to first-class subsections. |
| **P1-A4** | feature_catalog root uses simple tables, not the hierarchical `### {FEATURE_NAME} / #### Description / #### Current Reality / #### Source Files` shape from sk-doc's `feature_catalog_template.md`. Filename is lowercase (`feature_catalog.md`) but template uses `FEATURE_CATALOG.md`. | `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:1-122` | Restructure entries; consider rename (or leave lowercase if intentional and document the deviation). |
| **P1-A5** | manual_testing_playbook has scenario misclassification: scenario 024 listed under CCC Integration but file lives in `03--detect-changes/`; scenario 016 listed under Post-Rename Infrastructure but file lives in `06--mcp-tool-surface/`. Devin hook scenario (`10--devin-hooks/025-devin-session-start.md`) is 164 lines + non-standard structure vs the ~65-line template the other 21 scenarios use. | `manual_testing_playbook.md:148, 165`; `10--devin-hooks/025-devin-session-start.md:1-164` | Move scenario listings or files to match; refactor Devin scenario or document why it needs an exception. |

### B. Runtime correctness (MCP server + handlers)

| # | What | Where | Fix |
|---|------|-------|-----|
| **P1-B1** | `mcp_server/index.ts` has no error handling around `await server.connect(transport)`, no `uncaughtException` / `unhandledRejection` handlers, and uses `process.cwd()` for the readiness marker without explicit workspace-root resolution. | `mcp_server/index.ts:1-31` | Wrap connect in try/catch with logging + `process.exit(1)`; add global error handlers; accept explicit `rootDir` for the readiness marker. |
| **P1-B2** | `scan.ts` has multiple logic issues: `fullReindexTriggered` hardcoded to `false` despite git-HEAD-change detection; redundant `errors.filter(e => !structuralErrors.includes(e))` (structuralErrors is a subset of errors); `droppedReconciledEdges` counter is incremented before edge filtering. | `mcp_server/handlers/scan.ts:363, 614-618`; `lib/structural-indexer.ts:1907-1909` | Fix the conditional reindex trigger; simplify the filter; move counter increment after filtering. |
| **P1-B3** | `code_graph_query` `blast_radius` operation lacks transaction wrapping for snapshot stability. All other multi-query operations (transitiveTraversal, calls_from/to, imports_from/to) use transactions. | `mcp_server/handlers/query.ts:1334-1371` | Wrap in `graphDb.getDb().transaction(() => computeBlastRadius(...))()`. |
| **P1-B4** | `code_graph_context` neighborhood retrieval can return duplicate nodes when a symbol appears in both outgoing and incoming edge results. | `mcp_server/lib/code-graph-context.ts:372-426` | Deduplicate via Set on `symbolId` / `fqName` before adding to results. |
| **P1-B5** | `code_graph_status` `GoldVerificationTrust` type is 3-state (`'live' \| 'stale' \| 'absent'`) but the canonical `SharedPayloadTrustState` includes `'unavailable'`. When `freshness='error'`, the main `trustState` returns `'unavailable'` but `goldVerificationTrust` returns `'stale'` — semantically inconsistent. | `mcp_server/handlers/status.ts:29, 167-169` | Add `'unavailable'` to `GoldVerificationTrust` or document why it's narrower. |
| **P1-B6** | `code_graph_apply repair-nodes` operation requires `crashRootCauseAddressed=true` but lacks the `confirm=true` gate that `recover-sqlite-corruption` and `rollback-bad-apply` require. Asymmetric safety gating on a state-mutating operation. | `mcp_server/lib/apply-orchestrator.ts:314-320` | Add `confirm=true` requirement when `eligible.length > 0`. |
| **P1-B7** | `recoverPartialScanFailure` is imported in `apply-orchestrator.ts` but never used — dead import suggests missing recovery-mode coverage. | `mcp_server/lib/apply-orchestrator.ts:18` | Either wire it in or remove the import. |

### C. Launcher

| # | What | Where | Fix |
|---|------|-------|-----|
| **P1-C1** | Launcher header comment advertises a "standalone-storage guard" but the actual DB path is embedded inside the skill directory (`path.join(kitDir, 'mcp_server', 'database')`) — same path the skill source lives in. The "standalone" claim is aspirational, not implemented. | `.opencode/bin/mk-code-index-launcher.cjs:82` | Either move the DB to a workspace-shared standalone location (e.g., `.opencode/.spec-kit/code-graph/database`) with migration, or rewrite the comment to describe what's actually shipped. |

### D. Tests + stress tests

| # | What | Where | Fix |
|---|------|-------|-----|
| **P1-D1** | Four critical `lib/` modules have **zero dedicated unit tests**: `runtime-detection.ts` (167 lines, multi-runtime hook policy), `tree-sitter-parser.ts` (855 lines, WASM grammar caching + quarantine), `auto-rescan-policy.ts` (128 lines, F-018 safety gate), `exclude-rule-classifier.ts` (91 lines, exclude-rule validation). All are referenced only via integration tests. | `mcp_server/lib/{runtime-detection,tree-sitter-parser,auto-rescan-policy,exclude-rule-classifier}.ts` | Add dedicated unit tests for each. Highest priority: `runtime-detection.ts` (security/safety boundary) and `tree-sitter-parser.ts` (parsing correctness). |
| **P1-D2** | Two stress tests under `mcp_server/stress_test/code-graph/` import from `system-spec-kit/mcp_server/handlers/coverage-graph/` and test coverage-graph functionality, not code-graph. Misplaced; create false code-graph coverage signal. | `stress_test/code-graph/deep-loop-crud-stress.vitest.ts`, `deep-loop-graph-convergence-stress.vitest.ts` | Move to system-spec-kit's stress directory or remove if duplicate. |
| **P1-D3** | `doctor-apply-mode-stress.vitest.ts` has two skipped tests citing "026/000/002-vitest-baseline-recovery-followup requires missing fixture, daemon, auth, or offline-unavailable toolchain". These tests cover the read-only vs apply-mode boundary — safety-critical for doctor apply mode that mutates config files. | `stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:125, 184` | Restore the missing fixtures/auth or replace with mocked alternatives. |

### E. Spec-kit isolation (the 15 P0 entries from iter 017, plus 9 P1 test-file entries)

See **P0-1** above for the rolled-up summary. The 15 production-file imports are the headline; the 9 test-file imports compound the issue but don't ship to consumers.

### F. Build state

| # | What | Where | Fix |
|---|------|-------|-----|
| **P1-F1** | `package.json` has no `build` script. INSTALL_GUIDE.md documents manual `tsc --build` but there's no automation. New developers must read the docs to know how to build. | `.opencode/skills/system-code-graph/package.json` | Add `"scripts": { "build": "tsc --build tsconfig.json", "typecheck": "tsc --noEmit -p tsconfig.json" }`. |
| **P1-F2** | The `mcp_server/dist/index.js` artifact is a 59-byte stub (not a real build). `node_modules` is missing. The skill is not in a runnable state out-of-the-box. | `.opencode/skills/system-code-graph/mcp_server/dist/index.js` | Run `npm install` + `tsc --build` to materialize the artifact. Consider a post-install hook or a clearer "before first use" install step. |

### G. /doctor coverage

| # | What | Where | Fix |
|---|------|-------|-----|
| **P1-G1** | `mcp-doctor.sh`'s `mk_code_index` fix-mode does not create the missing database directory, even though `doctor_mcp_debug.yaml` defines a `db_dir_missing` repair action. | `.opencode/commands/doctor/scripts/mcp-doctor.sh:524-530` (fix-mode body for mk_code_index); `doctor_mcp_debug.yaml:151-152` | Add `mkdir -p "$db_dir"` to fix-mode when the directory check failed, matching the YAML repair_action contract. |

### H. Cross-runtime config consistency

| # | What | Where | Fix |
|---|------|-------|-----|
| **P1-H1** | `SPECKIT_CODE_GRAPH_INDEX_*` flag defaults diverge: `opencode.json`, `.claude/mcp.json`, `.gemini/settings.json` set them to `"true"` (maintainer mode); `.codex/config.toml`, `.devin/config.json`, `.vscode/mcp.json` set them to `"false"` (end-user safe). Same skill, opposite default behavior per runtime. | All 6 runtime configs | Align to one default (per the changelog's end-user-safe intent, `"false"` is correct). Maintainer-mode opt-in is via `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` in `.env.local`. |
| **P1-H2** | `_NOTE_1_DB` / `_NOTE_2_TOOLS` convention rename (per user directive in the prior session) was applied to 4 of 6 configs. `.claude/mcp.json` and `.gemini/settings.json` still use the older `_NOTE_1_TOOLS` key for the `mk_code_index` block. This is a real miss in the prior `_NOTE_*` cleanup pass. | `.claude/mcp.json` (mk_code_index env block); `.gemini/settings.json` (mk_code_index env block) | Rename `_NOTE_1_TOOLS` → `_NOTE_2_TOOLS` and prepend a new `_NOTE_1_DB` describing the DB path, matching the other 4 configs. |
| **P1-H3** | `.vscode/mcp.json` has no `_NOTE_AUTO_MIGRATION` comment for `mk-spec-memory` — the other 5 runtime configs include it. Documents the `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA=false` opt-out. (Iter 020-003 misidentified the gap as being in `.codex/config.toml`; the actual gap is `.vscode/mcp.json`.) | `.vscode/mcp.json` mk-spec-memory env block | Add the missing `_NOTE_AUTO_MIGRATION` line. |

---

## P2 findings (deferred, validated subset)

About 30 P2 findings across iterations — mostly code-quality + readability improvements + minor doc cleanups. Highlights:

- Descriptions in `README.md` / `SKILL.md` / `INSTALL_GUIDE.md` exceed the 130-char sk-doc soft target (236 / 158 / 243 chars).
- ANCHOR comments in feature_catalog entries (sk-doc template doesn't include them — but their presence is harmless).
- SQL `LIKE` patterns in `resolveSubjectFilePath` don't escape `%` / `_` wildcards in user input (low-impact since subjects are paths, not user-controlled strings).
- `code_graph_context` deadline uses `performance.now()` instead of monotonic `process.hrtime()`.
- Code duplication: `buildUnavailableReadiness` is verbatim in 3 ccc handlers; `sanitizeEdgeMetadataString` exists in both `query.ts` and `code-graph-db.ts`.
- `ccc-reindex.ts` truncates output to 2000 chars with no documented rationale.
- `ccc-feedback.ts` rating enum lacks runtime validation.
- Various missing console.error logging for debugging paths.

Full P2 list lives in the per-iteration markdown files at `review/iterations/iteration-{NNN}.md` (P2 sections). Worth a remediation pass but none individually block release.

---

## Hallucinated findings (dismissed after validation)

| Iter | Claim | Why dismissed |
|------|-------|---------------|
| 011 | "P0 — TypeScript compilation error at `apply-orchestrator.ts:342` (`${operation satisfies never}`)" | `npx tsc --noEmit` returns clean. `satisfies never` is valid TS exhaustiveness narrowing. |
| 020-002 | "P1 — Master install README has no §10.4 for mk_code_index, contradicting changelog claim" | §10.4 exists at line 709 of `.opencode/install_guides/README.md`. Devin missed it. |
| 020-003 | "P1 — `_NOTE_AUTO_MIGRATION` missing from Codex config" | Codex has it. The actual gap is in `.vscode/mcp.json`. (Real finding, wrong file — recorded above as P1-H3.) |

---

## Per-dimension verdict

| Dimension | Iterations | Verdict | Headline |
|-----------|------------|---------|----------|
| Documentation / sk-doc alignment | 1, 2, 3, 4 | 🟡 NEEDS WORK | SKILL.md doesn't match `skill_md_template.md`; feature_catalog uses simple tables not template hierarchy; playbook has misclassification + non-standard Devin scenario. |
| Server entry / MCP setup | 5 | 🟡 NEEDS WORK | Missing error handling on `server.connect`, no global exception handlers, name mismatch with skill identity. |
| scan + structural-indexer | 6 | 🟡 NEEDS WORK | Multiple logic bugs (fullReindexTriggered hardcoded false, redundant filter, off-by-one counter). |
| query + code-graph-db | 7 | 🟢 SHIPPABLE | One transaction-wrapping P1 + minor input-validation P2s. |
| context | 8 | 🟢 SHIPPABLE | One dedup P1 + minor P2s. |
| status + readiness-contract | 9 | 🟢 SHIPPABLE | GoldVerificationTrust type semantically narrow vs canonical; scope-path drift in prompt. |
| verify | 10 | 🟢 SHIPPABLE | Scope-path drift only (prompt referenced `lib/` not `mcp_server/lib/`). |
| apply + apply-orchestrator | 11 | 🟡 NEEDS WORK | Real safety asymmetry on repair-nodes (P1); unused recovery import (P1). (The P0 TS error was hallucinated.) |
| detect_changes + diff-parser | 12 | 🟢 SHIPPABLE | Scope-path drift only. |
| ccc_* CocoIndex bridge | 13 | 🔴 P0 | All three handlers return fake readiness. Either implement real detection or drop the field. |
| Launcher | 14 | 🟡 NEEDS WORK | "Standalone-storage guard" is aspirational, not implemented. |
| Vitest test coverage | 15 | 🟡 NEEDS WORK | 4 critical lib modules have zero dedicated tests (runtime-detection, tree-sitter-parser, auto-rescan-policy, exclude-rule-classifier). |
| Stress test design | 16 | 🟡 NEEDS WORK | 2 misplaced stress tests (test coverage-graph not code-graph); 2 skipped doctor apply-mode tests. |
| **Spec-kit isolation** | **17** | **🔴 P0** | **46 imports from system-spec-kit across 23 files contradicts v1.0.0.0 changelog claim.** |
| Build state | 18 | 🟡 NEEDS WORK | No `build` script in `package.json`; dist artifact is a 59-byte stub; node_modules absent. |
| /doctor coverage | 19 | 🟢 SHIPPABLE | One small repair-action coverage gap in mcp-doctor.sh. |
| Cross-runtime config consistency | 20 | 🟡 NEEDS WORK | Flag defaults diverge across runtimes; `_NOTE_1_DB` convention missed in 2 configs (real miss in MY prior session's `_NOTE_*` rename pass). |

**Summary:** 2 dimensions red (🔴), 9 yellow (🟡), 6 green (🟢) out of the 17 effective dimensions reviewed (iter 1 covers docs at large; the rest are per-component).

---

## Release-readiness recommendation

**Ship v1.0.0.0 → CONDITIONAL:**

Required before tagging the release as final:
1. **Resolve P0-1** (isolation honesty). Path 2 (update docs to reflect reality + add reverse CI check) is the recommended minimum.
2. **Resolve P0-2** (ccc_* fake readiness). Either implement detection or drop the readiness field.

Strongly recommended (P1 batch):
3. Add error handling around server startup (P1-B1).
4. Fix the apply-orchestrator safety asymmetry (P1-B6).
5. Wire `package.json build` + verify `dist/` is materializable (P1-F1/F2).
6. Align the SPECKIT_CODE_GRAPH_INDEX_* defaults across all 6 configs (P1-H1).
7. Apply `_NOTE_1_DB` convention to `.claude/mcp.json` + `.gemini/settings.json` (P1-H2).

The rest of the P1 list and all P2 findings can flow into a normal remediation packet (call it 038 if pursued) post-v1.0.0.0.

---

## Methodology

- 20 iterations × 1 distinct dimension each, dispatched sequentially via `devin --print --prompt-file <path> --model swe-1.6 --permission-mode auto`.
- Per-iteration target: 5-min review, structured P0/P1/P2 markdown output, JSONL delta.
- Total wall-clock: 14 minutes. Per-iter avg 45s.
- Validation: every P0 + critical P1 was grep-verified or smoke-tested before promotion to this report (cli-devin SWE-1.6 hallucinates plausible-sounding findings — memory `feedback_cli_devin_bundle_verification.md`).
- 3 findings dismissed as hallucinations during validation.

Raw per-iteration outputs: `review/iterations/iteration-{001..020}.md`.
State log: `review/deep-review-state.jsonl`.
