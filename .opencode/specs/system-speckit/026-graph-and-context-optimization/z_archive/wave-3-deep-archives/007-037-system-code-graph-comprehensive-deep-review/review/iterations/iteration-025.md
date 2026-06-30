# Iteration 025 — Synthesis and Adjusted Packet 038 Scope

## Summary

Cross-verification found **15 VERIFIED**, **9 PARTIAL**, and **0 HALLUCINATED** findings across the P0/P1 findings reviewed from `review-report.md`. No new source-code defects were surfaced beyond the report's list, but several findings need revised wording or reduced severity before packet 038 starts.

## Files Reviewed

- `review-report.md`
- Iteration 021-024 evidence
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/skills/system-code-graph/mcp_server/tests/**`
- `.opencode/skills/system-code-graph/mcp_server/stress_test/**`
- `.opencode/skills/system-code-graph/package.json`
- `.opencode/skills/system-code-graph/mcp_server/dist/index.js`
- `.opencode/commands/doctor/scripts/mcp-doctor.sh`
- `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml`
- Six runtime configs: `opencode.json`, `.claude/mcp.json`, `.gemini/settings.json`, `.codex/config.toml`, `.devin/config.json`, `.vscode/mcp.json`

## Findings

### P0 (release-blocking)

| ID | Original verdict | Verification verdict | Evidence | Effect on packet 038 scope |
|---|---|---|---|---|
| P0-1 | release-blocker | PARTIAL | 46 imports / 23 files verified; docs contradict at `changelog/v1.0.0.0.md:24` and `INSTALL_GUIDE.md:199`; CI reverse-only at `.github/workflows/isolation-check.yml:19-40`. Category split should be 11 production `.ts`, 3 `.d.ts`, 5 tests, 4 stress tests. | Keep, but scope as documentation/CI honesty or deliberate decoupling. Correct category counts. |
| P0-2 | release-blocker | PARTIAL | Hardcoded calls verified at `ccc-status.ts:37`, `ccc-reindex.ts:57`, `ccc-feedback.ts:57`; tool schema descriptions at `tool-schemas.ts:197-218` do not advertise readiness. | Revise. Either document CCC readiness as N/A/remove readiness fields, or define and implement a real readiness contract. |

### P1 (high priority)

| ID | Original verdict | Verification verdict | Evidence | Effect on packet 038 scope |
|---|---|---|---|---|
| P1-A1 | high priority | VERIFIED | `SKILL.md:44-62` vs `skill_md_template.md:659-685` | Keep. |
| P1-A2 | high priority | VERIFIED | `SKILL.md:76-83` vs `skill_md_template.md:878-922` | Keep. |
| P1-A3 | high priority | VERIFIED | `SKILL.md:20`, `SKILL.md:26-40`, `skill_md_template.md:628-647` | Keep. |
| P1-A4 | high priority | PARTIAL | Structure drift verified at `feature_catalog.md:53-122` vs `feature_catalog_template.md:83-163`; filename critique contradicted by `feature_catalog_template.md:29-36`, `:83-86`. | Keep structure work; drop filename rename. |
| P1-A5 | high priority | PARTIAL | Misclassified rows verified at `manual_testing_playbook.md:141-148`, `:161-165`; Devin scenario 164 lines vs snippet template 140 lines. | Keep row fixes; downgrade Devin length claim to style review. |
| P1-B1 | high priority | VERIFIED | `index.ts:23-31`; no `process.on` handlers found under `mcp_server/`. | Keep. |
| P1-B2 | high priority | PARTIAL | `scan.ts:358-368`, `:613-619`; edge counter computed at `structural-indexer.ts:1896-1899` after filtering expression. | Keep hardcoded reindex and redundant filter; re-evaluate edge-counter claim. |
| P1-B3 | high priority | VERIFIED | `query.ts:1333-1371`; transaction comparators at `query.ts:1419`, `:1460`, `:1486`. | Keep. |
| P1-B4 | high priority | VERIFIED | `code-graph-context.ts:372-426` pushes incoming/outgoing nodes without dedupe. | Keep. |
| P1-B5 | high priority | PARTIAL | `status.ts:29`, `:167-169`; canonical shared type is seven-state at `shared-payload.ts:34-43`. | Keep only if `goldVerificationTrust` should mirror readiness trust; revise wording. |
| P1-B6 | high priority | VERIFIED | `apply-orchestrator.ts:313-339`; confirm gates elsewhere at `:293-296`, `:412-424`. | Keep. |
| P1-B7 | high priority | VERIFIED | `apply-orchestrator.ts:15-21`; only occurrence at import line `:18`. | Keep. |
| P1-C1 | high priority | PARTIAL | DB path is embedded at `mk-code-index-launcher.cjs:79-84`; quoted "standalone-storage guard" wording was not found, only "standalone skill" at `:8`. | Keep if storage-location policy matters; revise evidence/wording. |
| P1-D1 | high priority | PARTIAL | Contrary evidence: `tests/code-graph-cluster-a.vitest.ts:22` imports `auto-rescan-policy`; `tests/parser-skip-list.vitest.ts:225-283` imports `tree-sitter-parser`. Runtime-detection and exclude-rule-classifier still lack direct hits. | Revise to "2 modules lack direct tests; 2 have indirect/dedicated-ish coverage." |
| P1-D2 | high priority | VERIFIED | `deep-loop-crud-stress.vitest.ts:6-14` and `deep-loop-graph-convergence-stress.vitest.ts:7-20` import coverage-graph code from system-spec-kit. | Keep. |
| P1-D3 | high priority | VERIFIED | skipped tests at `doctor-apply-mode-stress.vitest.ts:123-125` and `:183-184`. | Keep. |
| P1-F1 | high priority | VERIFIED | `package.json:1-21` has no `scripts` block. | Keep. |
| P1-F2 | high priority | PARTIAL | `mcp_server/dist/index.js` is 59 bytes and imports `../../dist/system-code-graph/mcp_server/index.js`; `node_modules` currently exists under system-code-graph. | Keep dist-artifact concern if intentional; drop current "node_modules missing" claim. |
| P1-G1 | high priority | VERIFIED | `mcp-doctor.sh:523-530` fix mode runs install/build only; YAML repair action has DB mkdir at `doctor_mcp_debug.yaml:150-152`. | Keep. |
| P1-H1 | high priority | VERIFIED | `opencode.json:62-66`, `.claude/mcp.json:48-52`, `.gemini/settings.json:70-74` are true; `.codex/config.toml:51-55`, `.devin/config.json:50-54`, `.vscode/mcp.json:50-54` are false. | Keep. |
| P1-H2 | high priority | VERIFIED | `.claude/mcp.json:40-47` and `.gemini/settings.json:60-69` use `_NOTE_1_TOOLS`; other four configs use `_NOTE_1_DB` / `_NOTE_2_TOOLS`. | Keep. |
| P1-H3 | high priority | VERIFIED | `_NOTE_AUTO_MIGRATION` exists in five configs but not `.vscode/mcp.json`; grep hits `opencode.json:35`, `.devin/config.json:25`, `.gemini/settings.json:42`, `.claude/mcp.json:25`, `.codex/config.toml:30`. | Keep. |

### P2 (nice-to-have)

| ID | Verdict | Finding | Remediation |
|----|---------|---------|-------------|
| — | — | P2 findings were out of scope for this pass. | Leave for later review. |

## Counts

| Verdict | Count |
|---|---:|
| VERIFIED | 15 |
| HALLUCINATED | 0 |
| PARTIAL | 9 |

## Adjusted Packet 038 Scope

Definitely include: P1-A1/A2/A3, P1-B1/B3/B4/B6/B7, P1-D2/D3, P1-F1, P1-G1, P1-H1/H2/H3.

Include with revised wording: P0-1, P0-2, P1-A4, P1-A5, P1-B2, P1-B5, P1-C1, P1-D1, P1-F2.

Drop as hallucinations: none from the P0/P1 set verified in this pass. The previously dismissed P0-3 remains dismissed; the compile check from the skill root is clean (`npx tsc --noEmit -p tsconfig.json` produced no output).

## Convergence Signal

newInfoRatio 0.25: the report is broadly usable for remediation, but packet 038 should start from the adjusted table rather than the original P0/P1 wording.
