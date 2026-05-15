---
title: "Isolation Arc Remediation — close 4 P0 + 5 P1 from 017 deep-review"
description: "6-phase remediation packet closing all P0 + P1 findings from the Devin/SWE-1.6 deep-review (017). Path validation, atomic writes, CI isolation rule, MCP env allowlist, compact-merger move to shared, structural-contract coverage diff."
trigger_phrases:
  - "018 isolation arc remediation"
  - "017 deep-review remediation"
  - "marker path validation atomic write"
  - "isolation arc P0 P1 fixes"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-isolation-arc-remediation"
    last_updated_at: "2026-05-15T11:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffolded remediation packet; dispatching 6 phases via cli-codex gpt-5.5 high fast"
    next_safe_action: "Verify Stage 1 (A+B) results; proceed to Stage 2 (C+D parallel)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md (per-phase update)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000180026"
      session_id: "018-isolation-arc-remediation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Isolation Arc Remediation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 (closes 4 P0 + 5 P1 findings) |
| **Status** | in-progress |
| **Created** | 2026-05-15 |
| **Branch** | main |
| **Parent** | `026-graph-and-context-optimization/` |
| **Phase** | 018 |
| **Depends On** | `017-isolation-arc-deep-review` (the review that produced the findings) |
| **Predecessor** | `015-extracted-skills-isolation`, `016-skill-advisor-isolation-phase1`, `020-spec-kit-codegraph-decoupling` |
| **Reviewer** | Devin CLI + Cognition SWE-1.6 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Devin/SWE-1.6 deep-review of the isolation arc (017) returned CONDITIONAL with 4 P0 security/correctness findings and 5 P1 maintainability/future-coupling findings. This packet closes all 9 findings in 6 phases.

P0 = production blockers (path traversal + race condition in the marker file pattern).
P1 = should-fix (inlined-helper overreach, missing coverage verification, broad env passing, missing atomic write, no CI isolation rule).

Closing both tiers flips 017's verdict from CONDITIONAL → PASS.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Phase A — Path Validation (P0-1/4, P0-2/5)
Files: `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`, `system-code-graph/mcp_server/lib/readiness-marker.ts`.
Add `validateMarkerPath()` guard; reject any resolved path outside the expected code-graph directory.

### Phase B — Atomic Write + Retry (P0-3, P1-5)
Files: same two. Write marker to `.code-graph-readiness.json.tmp` then `rename()` atomically. Reader retries on JSON parse error once before failing.

### Phase C — CI Isolation Check (P1-6)
File: `.github/workflows/isolation-check.yml` (new).
PR-triggered grep audit: any `from.*system-code-graph` match in `spec-kit/mcp_server/` fails the build.

### Phase D — MCP Subprocess Env Allowlist (P1-4)
File: `code-graph-boundary.ts::processEnv()`.
Allowlist: `PATH`, `HOME`, `NODE_ENV`, `USER`, `SHELL`, `TMPDIR`, `LANG`, `LC_ALL`, plus the SPECKIT_/CODE_GRAPH_/MEMORY_ project namespace. Deny everything else.

### Phase E — Move compact-merger + budget-allocator to @spec-kit/shared (P1-2)
Files: `system-spec-kit/shared/`, `system-spec-kit/mcp_server/lib/context/{compact-merger,budget-allocator}.ts`, all importers.
Two-step: 1) move + add re-exports, 2) remove re-exports once tsc clean.

### Phase F — Structural-Contract Coverage Diff (P1-3)
Files: review/coverage-diff.md (new in 018 packet).
Compare assertions in pre-rewrite (parent of 0dba8febf) vs post-rewrite test; document removed cases + rationale.

### Out of Scope
- 8 P2 findings (deferred per 017 report §6)
- Operator parallel-track commits outside the isolation arc
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Phase |
|----|-------------|-------|
| REQ-001 | Path traversal guard on marker read | A |
| REQ-002 | Path traversal guard on marker write | A |
| REQ-003 | Atomic write (temp + rename) on marker | B |
| REQ-004 | Parse-error retry once on read | B |
| REQ-005 | CI fails on cross-skill import reintroduction | C |
| REQ-006 | MCP env passes only allowlist + project namespace | D |
| REQ-007 | compact-merger + budget-allocator live in @spec-kit/shared | E |
| REQ-008 | Coverage-diff documented for structural-contract rewrite | F |
| REQ-009 | All Devin's verification commands pass after each phase | A-F |
| REQ-010 | 017 verdict flips CONDITIONAL → PASS post-closeout | closing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 P0 + 5 P1 findings from 017 marked remediated with commit references
- **SC-002**: `tsc --noEmit` passes in spec-kit + spec-kit/shared + code-graph
- **SC-003**: CI isolation-check workflow added and tested against a synthetic violation
- **SC-004**: No new test regressions; 017's verification commands still pass
- **SC-005**: 017 review-report.md updated with remediation evidence (commit hashes)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:complexity -->
## 6. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | 6 phases, ~10 files |
| Risk | 12/25 | Mostly mechanical; Phase E has refactor risk |
| Research | 14/20 | Plan + analysis done in 017 review |
| Multi-agent | 18/25 | 5+ cli-codex dispatches with verification gates |
| **Total** | **61/95** | **Level 3** (multi-phase) |
<!-- /ANCHOR:complexity -->
