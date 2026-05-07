---
title: "Verification Checklist: Phase 001 - dist rebuild"
description: "Rebuild stale system-spec-kit MCP dist output after the 096 plural-directory rename and document generated-output drift evidence."
trigger_phrases:
  - "dist rebuild"
  - "098 phase 001"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/098-097-remediation/001-dist-rebuild"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:16"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:19"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 001 - dist rebuild

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:required -->
## Required Verification Items

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-010 [P0] Phase-specific checks pass
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-011 [P0] Drift condition resolved
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-012 [P1] Failure mode documented
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-013 [P1] Change follows scoped project patterns
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-021 [P0] Manual or scripted verification complete
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-022 [P1] Edge cases tested or classified
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-023 [P1] Error scenarios validated
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-030 [P0] No hardcoded secrets or unsafe path behavior introduced
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-031 [P0] Lookup or path behavior remains fail-closed where applicable
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-032 [P1] Runtime dispatch or documentation lookup works correctly
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-041 [P1] Narrative notes are adequate
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**

<!-- /ANCHOR:required -->
---

<!-- ANCHOR:optional -->
## Optional Verification Items

- [x] CHK-042 [P2] README or install guide updated if applicable
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-050 [P2] Temp files contained to scratch if used
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**
- [x] CHK-051 [P2] scratch/ cleaned before completion if used
  - **Evidence: Supplied Phase 001 evidence confirms build success, plural dist globs at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-19`, and residual hits limited to `shadow-deltas.jsonl*`.**

<!-- /ANCHOR:optional -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 9/9 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-05-07
**Verified By**: cli-codex documentation authoring from supplied evidence

<!-- /ANCHOR:summary -->
