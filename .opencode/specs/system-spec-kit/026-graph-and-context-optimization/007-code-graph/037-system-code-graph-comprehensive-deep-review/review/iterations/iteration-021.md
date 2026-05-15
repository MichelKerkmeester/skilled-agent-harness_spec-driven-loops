# Iteration 021 — P0-1 Spec-Kit Isolation Claim Verification

## Summary

P0-1 is **PARTIAL**. The central isolation-honesty finding stands: the current tree has **46 matching import lines across 23 files**, and both release docs claim zero `from 'system-spec-kit'` imports while CI only audits the reverse direction. The report's category split is inaccurate: the matches break down as 11 production `.ts` files, 3 generated declaration `.d.ts` files, 5 test files, and 4 stress-test files.

## Files Reviewed

- `.opencode/skills/system-code-graph/` import scan (46 matching lines, 23 files)
- `.opencode/skills/system-code-graph/changelog/v1.0.0.0.md`
- `.opencode/skills/system-code-graph/INSTALL_GUIDE.md`
- `.github/workflows/isolation-check.yml`

## Findings

### P0 (release-blocking)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| P0-1 | PARTIAL | `.opencode/skills/system-code-graph/changelog/v1.0.0.0.md:24`; `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:199`; `.github/workflows/isolation-check.yml:19-40` | The zero-import documentation claim is false and CI audits only spec-kit importing code-graph. The raw import count is exactly 46 lines across 23 files. The report's "15 production + 8 tests" split is misstated: current evidence is 11 production `.ts`, 3 generated `.d.ts`, 5 tests, and 4 stress tests. | Keep P0-1 in packet 038, but correct the category split before remediation planning. |

### P1 (high priority)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| — | — | — | None | — |

### P2 (nice-to-have)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| — | — | — | None | — |

## Evidence Notes

Import category counts:

| Category | Files | Import lines | Evidence |
|---|---:|---:|---|
| Production `.ts` | 11 | 20 | `mcp_server/handlers/query.ts:14`, `mcp_server/lib/structural-indexer.ts:23-24`, `mcp_server/lib/readiness-contract.ts:36-44`, `mcp_server/lib/startup-brief.ts:9-17`, plus 7 runtime files |
| Generated declarations `.d.ts` | 3 | 4 | `mcp_server/tool-schemas.d.ts:1`, `mcp_server/tools/code-graph-tools.d.ts:5`, `mcp_server/lib/readiness-contract.d.ts:3-6` |
| Tests | 5 | 13 | `mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:8-18`, `tests/crash-recovery.vitest.ts:27-34`, `tests/graph-payload-validator.vitest.ts:2-6`, plus 2 test files |
| Stress tests | 4 | 9 | `stress_test/code-graph/deep-loop-crud-stress.vitest.ts:11-14`, `deep-loop-graph-convergence-stress.vitest.ts:16-20`, `w10-degraded-readiness-integration.vitest.ts:13-15`, `walker-dos-caps.vitest.ts:12` |

## Convergence Signal

newInfoRatio 0.45: the core P0 survives, but the remediation packet should not inherit the report's production/test split verbatim.
