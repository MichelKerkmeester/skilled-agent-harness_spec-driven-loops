---
title: "Verification Addendum — Packet 037 Deep Review"
description: "Independent cli-codex cross-check of cli-devin SWE-1.6 P0/P1 findings before packet 038 remediation."
importance_tier: "important"
contextType: "verification"
---

# Verification Addendum — Packet 037 Deep Review

## Verification Metadata

| Field | Value |
|---|---|
| Date | 2026-05-15 |
| Executor | `cli-codex` |
| Model | `gpt-5.5` |
| Reasoning effort | `high` |
| Service tier | `fast` |
| Scope | P0 + P1 findings from `review-report.md`; P2 excluded |
| Target | `.opencode/skills/system-code-graph/` read-only |
| Outputs | Iterations 021-025 plus this addendum |

## Verdict Counts

| Verdict | Count |
|---|---:|
| VERIFIED | 15 |
| HALLUCINATED | 0 |
| PARTIAL | 9 |

## Per-Finding Verdict Table

| Finding ID | Original verdict | Verification verdict | Evidence | Effect on packet 038 scope |
|---|---|---|---|---|
| P0-1 | release-blocker | PARTIAL | Import count verified as 46 lines across 23 files; docs contradict at `changelog/v1.0.0.0.md:24`, `INSTALL_GUIDE.md:199`; CI reverse-only at `.github/workflows/isolation-check.yml:19-40`. Category split is corrected to 11 production `.ts`, 3 `.d.ts`, 5 tests, 4 stress tests. | Keep, but correct counts/categories. |
| P0-2 | release-blocker | PARTIAL | Hardcoded `readiness_not_applicable` verified at `ccc-status.ts:37`, `ccc-reindex.ts:57`, `ccc-feedback.ts:57`; schema does not advertise readiness at `tool-schemas.ts:197-218`. | Revise as N/A readiness contract or define a real contract. |
| P1-A1 | P1 | VERIFIED | `SKILL.md:44-62` static routing vs `skill_md_template.md:659-685` smart-router requirements. | Keep. |
| P1-A2 | P1 | VERIFIED | `SKILL.md:76-83` bullets vs `skill_md_template.md:878-922` ALWAYS/NEVER/ESCALATE IF. | Keep. |
| P1-A3 | P1 | VERIFIED | `SKILL.md:20`, `SKILL.md:26-40` vs trigger structure at `skill_md_template.md:628-647`. | Keep. |
| P1-A4 | P1 | PARTIAL | Structure drift verified at `feature_catalog.md:53-122`; filename critique contradicted by lowercase template layout at `feature_catalog_template.md:29-36`, `:83-86`. | Keep structure work; drop filename rename. |
| P1-A5 | P1 | PARTIAL | Misclassified rows verified at `manual_testing_playbook.md:141-148`, `:161-165`; Devin scenario length claim overstated vs 140-line snippet template. | Fix row categories; treat Devin scenario as style review. |
| P1-B1 | P1 | VERIFIED | `index.ts:23-31`; no global process error handlers found. | Keep. |
| P1-B2 | P1 | PARTIAL | `scan.ts:358-368`, `:613-619` verified; edge counter overclaim at `structural-indexer.ts:1896-1899`. | Keep first two subclaims; re-evaluate edge counter. |
| P1-B3 | P1 | VERIFIED | `query.ts:1333-1371`; transaction comparators at `query.ts:1419`, `:1460`, `:1486`. | Keep. |
| P1-B4 | P1 | VERIFIED | `code-graph-context.ts:372-426` pushes nodes from both incoming and outgoing edge scans without dedupe. | Keep. |
| P1-B5 | P1 | PARTIAL | `status.ts:29`, `:167-169`; shared trust type is seven-state at `shared-payload.ts:34-43`. | Revise canonical-type wording. |
| P1-B6 | P1 | VERIFIED | `apply-orchestrator.ts:313-339`; confirm gates elsewhere at `:293-296`, `:412-424`. | Keep. |
| P1-B7 | P1 | VERIFIED | `apply-orchestrator.ts:15-21`; only occurrence of `recoverPartialScanFailure` is import line `:18`. | Keep. |
| P1-C1 | P1 | PARTIAL | DB path embedded at `mk-code-index-launcher.cjs:79-84`; quoted "standalone-storage guard" wording not found. | Keep only after wording/evidence correction. |
| P1-D1 | P1 | PARTIAL | `auto-rescan-policy` and `tree-sitter-parser` have test imports at `tests/code-graph-cluster-a.vitest.ts:22` and `tests/parser-skip-list.vitest.ts:225-283`; runtime-detection and exclude-rule-classifier lacked direct hits. | Revise to two uncovered modules, not four. |
| P1-D2 | P1 | VERIFIED | Stress tests import coverage-graph code at `deep-loop-crud-stress.vitest.ts:6-14` and `deep-loop-graph-convergence-stress.vitest.ts:7-20`. | Keep. |
| P1-D3 | P1 | VERIFIED | Skipped tests at `doctor-apply-mode-stress.vitest.ts:123-125`, `:183-184`. | Keep. |
| P1-F1 | P1 | VERIFIED | `package.json:1-21` has no `scripts` block. | Keep. |
| P1-F2 | P1 | PARTIAL | `mcp_server/dist/index.js` is 59 bytes and a stub; `node_modules` currently exists. | Keep dist concern; drop node_modules claim. |
| P1-G1 | P1 | VERIFIED | `mcp-doctor.sh:523-530` lacks `mkdir -p`; YAML repair exists at `doctor_mcp_debug.yaml:150-152`. | Keep. |
| P1-H1 | P1 | VERIFIED | Index defaults diverge: true in `opencode.json`, `.claude/mcp.json`, `.gemini/settings.json`; false in `.codex/config.toml`, `.devin/config.json`, `.vscode/mcp.json`. | Keep. |
| P1-H2 | P1 | VERIFIED | `.claude/mcp.json:40-47` and `.gemini/settings.json:60-69` still use `_NOTE_1_TOOLS` for `mk_code_index`; other four configs use `_NOTE_1_DB` / `_NOTE_2_TOOLS`. | Keep. |
| P1-H3 | P1 | VERIFIED | `_NOTE_AUTO_MIGRATION` found in five configs and absent from `.vscode/mcp.json`. | Keep. |

## Adjusted Packet 038 Recommendation

Packet 038 should definitely remediate the VERIFIED findings and the PARTIAL findings whose core defect still stands. The highest-confidence scope is: SKILL.md template alignment, server startup error handling, transaction/dedupe/safety-gate runtime fixes, dead import cleanup, misplaced/skipped stress tests, package scripts, doctor DB-dir repair, and runtime config consistency.

Revise before implementation: P0-1 import category counts, P0-2 CCC readiness semantics, P1-A4 filename wording, P1-A5 Devin scenario severity, P1-B2 edge-counter subclaim, P1-B5 canonical trust-state wording, P1-C1 launcher wording, P1-D1 test-coverage count, and P1-F2 `node_modules` claim.

## Dropped Findings

No P0/P1 finding verified in this pass should be dropped as hallucinated. The previously dismissed P0-3 TypeScript error remains dismissed: running `npx tsc --noEmit -p tsconfig.json` from `.opencode/skills/system-code-graph/` produced no output and exited cleanly.

## New Findings

No new source-code remediation finding was discovered. This pass surfaced report-quality corrections only.
