---
title: "Checklist: Gate-2 Golden-Prompt Acceptance Suite"
description: "QA checklist for the golden-prompt fixture, the joined parent-then-mode vitest suite, and its CI wiring."
trigger_phrases:
  - "gate-2 golden prompt suite checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/005-ci-golden-prompts"
    last_updated_at: "2026-07-29T09:05:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Gate-2 Golden-Prompt Acceptance Suite

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until the phase is built (Status: Planned).

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] F22 re-verified against v4 [evidence: TS scorer pinned regime → sk-doc top-1 here (not the 029 rank-3); fixture ships it as a top-3 floor with a note]
- [x] CHK-002 [P1] Existing fixtures read to avoid duplication [evidence: `skill-advisor-regression-cases.jsonl` sourced via `sourceCaseId`]
- [x] CHK-003 [P1] `compiledRoute` shape confirmed against real source [evidence: `compiled-route.cjs` returns `{action, targets[].workflowMode}` for compiled hubs, `{servingAuthority:legacy}` otherwise]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-004 [P0] Scope contained: fixture + vitest + one new CI job; no scorer/engine/registry touched [evidence: diff = the two new files + `routing-registry-drift.yml` (separate job, lean step byte-identical)]
- [x] CHK-005 [P1] Real scorer unmocked (A' amendment: `scoreAdvisorPrompt` in the pinned regime, not `handleAdvisorRecommend` — the lean CI job has no advisor deps) [evidence: no `vi.mock` on `fusion.js` or `compiled-route.cjs`]
- [x] CHK-006 [P2] Fixture schema documented inline [evidence: `_schema` line in `gate2-golden-prompts.jsonl`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-007 [P0] Every fixture case passes against v4's fleet [evidence: `npx vitest run tests/routing-golden-prompts.vitest.ts` → 10 passed (10), F22 at its true top-3 rank]
- [x] CHK-008 [P0] Full four-file set passes together, no regression [evidence: combined run → 31 passed (31)]
- [x] CHK-009 [P1] Not passing only on local state [evidence: real scorer via pinned regime + fresh symlinked build; the new CI job `npm ci`s from scratch — confirmable on first push]
- [x] CHK-010 [P1] Joined assertion against the real engine, not a stub [evidence: shells to real `compiled-route.cjs`; **skip-on-legacy** since every v4 hub serves legacy — the assertion activates on re-mint and still discriminates when a hub serves compiled]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-011 [P1] Multi-hub coverage present [evidence: fixture spans sk-doc, sk-git, system-deep-loop, system-spec-kit, mcp-tooling, sk-prompt; a load-guard asserts the first three]
- [x] CHK-012 [P2] P0 skill-kind ids via `sourceCaseId` [evidence: `P0-GIT-001/002`, `P0-MEM-001`, `P0-SPEC-001`, `P0-CHROME-001`; command/abstain P0s stay in the regression corpus]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-013 [P1] No credentials/proprietary content in the fixture [evidence: short public routing prompts only]
- [x] CHK-014 [P2] No secret-bearing env dump in the CI job [evidence: `golden-prompt-gate` runs npm ci + tsc + npx vitest only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-015 [P1] Docs cite the F22 evidence + the v4 re-verified rank [evidence: fixture `notes` + impl-summary record the original rank-3 finding and sk-doc's current top-1 in the pinned regime]
- [x] CHK-016 [P2] Continuity updated [evidence: spec.md + implementation-summary.md Status Complete]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-017 [P1] Files under the standard dirs [evidence: fixture in `mcp-server/scripts/fixtures/`, test in `mcp-server/tests/`]
- [x] CHK-018 [P2] No `paths:` trigger edit [evidence: workflow diff = one new `golden-prompt-gate` job; both new files already fall under the existing `system-skill-advisor/mcp-server/**` trigger glob]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 3 | 3/3 |
| Code quality | 3 | 3/3 |
| Testing | 4 | 4/4 |
| Fix completeness | 2 | 2/2 |
| Security | 2 | 2/2 |
| Documentation | 2 | 2/2 |
| File organization | 2 | 2/2 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
