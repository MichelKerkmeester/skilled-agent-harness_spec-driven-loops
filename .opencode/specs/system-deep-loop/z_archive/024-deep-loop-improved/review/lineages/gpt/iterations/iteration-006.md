# Iteration 006: Registry Bridge Test Adequacy

## Focus

Maintainability and regression coverage for the validation registry bridge.

## Findings

### GPT-F006 (P2) Registry bridge has no direct TypeScript unit coverage

- Evidence: `.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/006-validate-sh-registry-bridge/implementation-summary.md:104`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:598`, `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:620`.
- Impact: Integration tests cover the bridge, but branch-level regressions in status mapping/filtering can survive until bash fixtures run.
- Recommendation: Add direct unit tests around `validateFolder()` and `runRegistryShellRules()`.

Review verdict: PASS
