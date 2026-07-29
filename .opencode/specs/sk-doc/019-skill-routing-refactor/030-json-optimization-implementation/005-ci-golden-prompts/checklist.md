---
title: "Checklist: Gate-2 Golden-Prompt Acceptance Suite"
description: "QA checklist for the golden-prompt fixture, the joined parent-then-mode vitest suite, and its CI wiring."
trigger_phrases:
  - "gate-2 golden prompt suite checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/005-ci-golden-prompts"
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
- [ ] CHK-001 [P0] F22 live-miss citation re-verified with a fresh `advisor_recommend` probe against the checked-out tree before it is encoded as a fixture row [evidence: probe output, timestamped]
- [ ] CHK-002 [P1] Existing fixtures read before authoring a new one, to avoid a duplicate schema [evidence: `skill-advisor-regression-cases.jsonl`, `labeled-prompts.jsonl`, `007-sk-doc/fixtures/canary-cases.v1.json` read and cited]
- [ ] CHK-003 [P1] `compiledRoute` field path confirmed against real source before writing assertions [evidence: `compiled-route.cjs`, `resolve.cjs`, target hub `router.cjs` cited by file:line]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-004 [P0] Only the two new files plus the one-line CI-step edit are touched; no scorer, compiled-routing engine, or hub `mode-registry.json`/`hub-router.json` is modified [evidence: `git status` / diff scoped to fixture + vitest file + `routing-registry-drift.yml`]
- [ ] CHK-005 [P1] `handleAdvisorRecommend` called unmocked (no `vi.mock` on `lib/scorer/fusion.js` or the compiled-route subprocess) [evidence: `routing-golden-prompts.vitest.ts` has no scorer/compiled-route mock]
- [ ] CHK-006 [P2] Fixture schema documented inline (a header comment or README note describing each field) [evidence: fixture file or adjacent doc]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-007 [P0] Every fixture case passes locally against the current fleet, including the F22 case at its true top-3 (not top-1) rank [evidence: `npx vitest run tests/routing-golden-prompts.vitest.ts` output]
- [ ] CHK-008 [P0] Full four-file `routing-drift` vitest set passes together with no regression to the three pre-existing suites [evidence: combined vitest run output]
- [ ] CHK-009 [P1] CI command dry-run from a clean working directory (no dev-session state) confirms the suite is not passing only because of local cache/state [evidence: fresh-clone or `git clean` dry-run output]
- [ ] CHK-010 [P1] Every compiled-routing-eligible case's joined assertion (`compiledRoute.action`, `compiledRoute.targets[].workflowMode`) is exercised against the real compiled-routing engine, not a stub [evidence: test file shows no mock on the compiled-route path; failing-mode manual check confirms the assertion actually fails when the wrong mode is expected]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-011 [P1] Representative multi-hub coverage present: at least `sk-doc` (create-skill), `sk-git`, and `system-deep-loop` (research) [evidence: fixture case list]
- [ ] CHK-012 [P2] Every P0-priority case id already in `skill-advisor-regression-cases.jsonl` is represented via `sourceCaseId`, not re-authored [evidence: fixture `sourceCaseId` fields cross-checked against the regression corpus]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-013 [P1] No credentials, tokens, or proprietary prompt content introduced by the new fixture [evidence: fixture content review]
- [ ] CHK-014 [P2] The new CI step's output contains no secret-bearing environment dump (native stdout/stderr of vitest only) [evidence: workflow step diff]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-015 [P1] `spec.md`/`plan.md`/`tasks.md` cite the exact F22 evidence (prompt, ranks, `ambiguous: true`) rather than a paraphrase [evidence: this packet's docs vs `research/lineages/grok-high/iterations/iteration-004.md`]
- [ ] CHK-016 [P2] Packet continuity updated after the build (spec.md + implementation-summary.md move to Complete with evidence)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-017 [P1] New fixture lives under `mcp-server/scripts/fixtures/`; new test lives under `mcp-server/tests/` — matching the existing convention for the three sibling suites [evidence: file paths]
- [ ] CHK-018 [P2] No `paths:` trigger edit committed to `routing-registry-drift.yml` beyond what REQ-005 already confirms is unnecessary [evidence: workflow diff limited to the vitest invocation line]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 3 | 0/3 |
| Code quality | 3 | 0/3 |
| Testing | 4 | 0/4 |
| Fix completeness | 2 | 0/2 |
| Security | 2 | 0/2 |
| Documentation | 2 | 0/2 |
| File organization | 2 | 0/2 |

**Verification Date**: Not yet run (Status: Planned)
<!-- /ANCHOR:summary -->
