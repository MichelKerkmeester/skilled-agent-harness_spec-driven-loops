# Iteration 27 — gpt55

**Angle:** Verify whether the drift-guard test (routing-registry-drift-guard.vitest.ts) is actually passing in CI or if it has been disabled/skipped — the prior finding at line 281 suggests misalignment that would cause a test failure

**Findings:** 4

- **[P1] misalignment** `.github/workflows/routing-registry-drift.yml:7` — Drift guard CI is PR-only despite direct-main workflow
  - evidence: CI trigger is only `pull_request` at lines 7-8 (`pull_request:` / `branches: [main]`), while repo policy says `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:22` `do a **direct `git push origin main`**`. Direct main pushes bypass this drift guard entirely.
  - fix: Add a `push` trigger for `main` or another required post-push/scheduled gate for `routing-registry-drift.yml`.
- **[P1] dead** `.github/workflows/routing-registry-drift.yml:9` — Workflow can be changed without self-running
  - evidence: The workflow has a `paths:` filter at line 9, but the only entries are lines 10-12: `.opencode/skills/deep-loop-workflows/mode-registry.json`, `.opencode/skills/system-skill-advisor/mcp_server/**`, and `.opencode/commands/doctor/scripts/parent-skill-check.cjs`; `.github/workflows/routing-registry-drift.yml` is not included.
  - fix: Add `.github/workflows/routing-registry-drift.yml` to the path filter or remove the path filter so changes that disable/skip the guard are themselves checked.
- **[P1] misalignment** `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:47` — Drift guard ignores registry fields implicated by the line-71 issue
  - evidence: The registry projection only reads `mode.advisorRouting` (`const ar = mode.advisorRouting;`) and maps `legacyAdvisorId` to `workflowMode` at lines 47-55; the assertions at lines 80-88 compare only Python/TS projection maps, so registry fields such as `agent` are not guarded.
  - fix: Add a registry-structure assertion for `agent`/`packet`/`command` identity rules, or explicitly document that this test is projection-only and add a separate CI test for non-advisorRouting registry drift.
- **[P2] drift** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/research/drift-audit-2026-06-27/research.md:94` — Stored audit cites a nonexistent drift-guard line
  - evidence: The 028 research log says `routing-registry-drift-guard.vitest.ts line 281 was already flagged`, but the current test file ends at `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:110` with `});`.
  - fix: Replace the stale line-281 reference with the current failing/blind-spot line numbers, or remove the claim if it was based on an older file revision.
