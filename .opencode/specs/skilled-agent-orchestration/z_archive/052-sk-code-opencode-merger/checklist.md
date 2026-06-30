---
title: "Verification Checklist: sk-code-opencode-merger"
description: "Completed implementation verification checklist for the sk-code-opencode merger packet."
trigger_phrases:
  - "sk-code-opencode merger checklist"
  - "single sk-code verification"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T17:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Verified runtime implementation"
    next_safe_action: "Review final diff and decide whether to commit"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660663"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 4 open questions resolved in deep-analysis session."
      - "Changelogs: DELETE; Telemetry: REGENERATE; Route: opencode/OPENCODE."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: sk-code-opencode-merger

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available.
- [x] CHK-004 [P0] Plan-only scope honored for this turn.
- [x] CHK-005 [P0] Detailed resource map created.
- [x] CHK-006 [P0] User approves implementation before runtime file edits.
- [x] CHK-006a [P0] Deep-analysis session resolved all 4 open questions (2026-05-03).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `sk-code` two-axis detection routes Webflow + OpenCode correctly. Evidence: `SKILL.md`, `code_surface_detection.md`, advisor recommendation for `.opencode` TypeScript fixture routes to `sk-code`.
- [x] CHK-010a [P0] CODE SURFACE detection: Webflow markers route to webflow surface; .opencode/ CWD routes to opencode surface. Evidence: router docs and focused reference checks.
- [x] CHK-010b [P0] Language sub-detection within OPENCODE correctly selects JS/TS/Python/Shell/Config from file extensions. Evidence: `SKILL.md` language table and opencode resource map.
- [x] CHK-011 [P0] Moved verifier script passes its tests. Evidence: `npx vitest run ../scripts/tests/alignment-drift-fixture-preservation.vitest.ts` passed; `verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/skill_advisor` PASS.
- [x] CHK-012 [P1] TypeScript advisor scorer changes pass targeted vitest suites. Evidence: focused advisor/router suite passed 185 tests.
- [x] CHK-013 [P1] Agent and command docs use one synchronized wording model. Evidence: reference searches for old overlay text are clean except retired-model note.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Exact live search for `sk-code-opencode` has only historical/spec-folder matches after deletion.
- [x] CHK-020a [P0] Historical changelogs deleted with `.opencode/skills/sk-code-opencode/`.
- [x] CHK-020b [P0] Telemetry JSONL regenerated/rewritten. Evidence: `smart-router-measurement-results.jsonl` clean; live compliance rows normalized to `sk-code`.
- [x] CHK-021 [P0] Exact live search for `sk-code-*` overlay language has only approved historical matches. Evidence: retired-model note in `sk-code-review/README.md` only.
- [x] CHK-022 [P0] Exact `sk-code` search shows no live `GO` or `NEXTJS` support claims. Evidence: remaining matches are historical changelog text or unrelated word fragments.
- [x] CHK-023 [P1] Skill advisor hook tests updated from old expected skill label.
- [x] CHK-024 [P1] Runtime agent parity reviewed across OpenCode, Claude, Codex, and Gemini.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable surface has a class in `resource-map.md`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for exact `sk-code-opencode` and overlay references.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for agents, commands, skills, advisor code/tests, docs, metadata, and generated artifacts.
- [x] CHK-FIX-004 [P0] Implementation proves no live deleted-skill references remain. Evidence: exact grep leaves only spec/history identifiers.
- [x] CHK-FIX-005 [P1] Matrix axes are listed in the implementation summary after implementation.
- [x] CHK-FIX-006 [P1] Generated artifacts are refreshed or explicitly classified as historical. Evidence: skill graph regenerated; measurement JSONL regenerated; live compliance normalized.
- [x] CHK-FIX-007 [P1] Evidence is pinned to exact command outputs in the final implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Prompt-injection advisor fixtures remain covered after skill ID rewrite. Evidence: focused hook/advisor tests passed.
- [x] CHK-031 [P0] No moved script broadens filesystem behavior. Evidence: alignment verifier PASS on advisor scope and fixture-preservation test passed.
- [x] CHK-032 [P1] Hook/advisor tests still sanitize injected skill labels. Evidence: shared payload and hook tests passed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized for planning.
- [x] CHK-041 [P1] Resource map documents broad blast radius.
- [x] CHK-042 [P2] Runtime READMEs updated during implementation.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Spec files live in the requested folder.
- [x] CHK-051 [P1] No scratch files created outside `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in `decision-record.md`.
- [x] CHK-101 [P1] ADR has status.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale.
- [x] CHK-103 [P2] Migration path documented in `plan.md`.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Advisor route does not increase routing ambiguity. Evidence: advisor recommend for `.opencode` TypeScript fixture returns `sk-code`, `ambiguous: false`.
- [x] CHK-111 [P1] Exact search and tests complete within normal local workflow time. Evidence: focused vitest suite completed in 2.35s.
- [x] CHK-112 [P2] No load testing required.
- [x] CHK-113 [P2] No performance benchmark required.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented.
- [x] CHK-121 [P0] Implementation kept deletion of `sk-code-opencode` as final cleanup step after live references were repaired.
- [x] CHK-122 [P1] Metadata regeneration path selected and executed (`skill_graph_compiler.py --export-json`, skill graph scan, advisor rebuild).
- [x] CHK-123 [P1] Runbook created in final implementation summary.
- [x] CHK-124 [P2] Deployment runbook not applicable unless packaged release follows.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security coverage completed for advisor prompt-injection tests via focused hook/advisor tests.
- [x] CHK-131 [P1] Dependency licenses unaffected; no dependency files changed.
- [x] CHK-132 [P2] OWASP checklist not applicable; no web input handling changed.
- [x] CHK-133 [P2] Data handling unchanged.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Planning spec documents synchronized.
- [x] CHK-141 [P1] User-facing `sk-code` docs updated.
- [x] CHK-142 [P2] Install guides updated.
- [x] CHK-143 [P2] Knowledge transfer documented through resource map.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Approved continuation | 2026-05-03 |
| OpenCode | Implementation executor | Implemented and verified | 2026-05-03 |
<!-- /ANCHOR:sign-off -->
