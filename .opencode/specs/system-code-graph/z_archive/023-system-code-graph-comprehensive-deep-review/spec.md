---
title: "System Code Graph Comprehensive Deep Review (20 iterations, cli-devin SWE-1.6)"
description: "Twenty-iteration deep-review campaign of the standalone system-code-graph skill covering documentation alignment with sk-doc, hooks + plugins, tests + verification, runtime correctness, readiness contracts, cross-skill isolation, install + /doctor:mcp coverage. Dispatched via the newly-wired cli-devin executor (SWE-1.6 default model)."
trigger_phrases:
  - "037 system-code-graph comprehensive deep-review"
  - "system-code-graph 20-iter cli-devin review"
  - "cli-devin SWE-1.6 deep-review"
  - "code-graph release-readiness audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/023-system-code-graph-comprehensive-deep-review"
    last_updated_at: "2026-05-15T14:30:00Z"
    last_updated_by: "main-agent-037-init"
    recent_action: "packet_scaffolded"
    next_safe_action: "dispatch_iteration_001"
    blockers: []
    key_files:
      - "spec.md"
      - "review/deep-review-state.jsonl"
      - "review/iterations/"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-037-deep-review-cli-devin"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: System Code Graph Comprehensive Deep Review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Executor** | `cli-devin` (model: `swe-1.6`, permission-mode: `auto`) |
| **Iterations** | 20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `system-code-graph` skill has been through a multi-arc evolution: extraction from `system-spec-kit` (packet 014), MCP server rename `system_code_graph` → `mk-code-index` (packet 010), full spec-kit decoupling with CI isolation check (packets 015–020), sk-doc documentation alignment (025/035), and the just-shipped Install Guide + `/doctor:mcp` coverage (packet 026 Phase 2 → commit `1fc38a177`). No comprehensive deep-review covering ALL surfaces has been run since the package reached its current 1.0.0.0 state.

### Purpose

Run 20 iterations of deep review across the system-code-graph skill to confirm: (1) runtime correctness of the 10 MCP tools (`code_graph_scan/query/context/status/verify/apply`, `detect_changes`, `ccc_status/reindex/feedback`); (2) documentation alignment with sk-doc templates and conventions; (3) test coverage + verification gates; (4) hooks + plugins + cross-skill integration; (5) readiness contract semantics; (6) spec-kit isolation (zero `from 'system-spec-kit'` imports); (7) install + `/doctor` discoverability across all 6 runtime configs. Surface P0/P1/P2 findings per dimension, then synthesize a release-readiness verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- All files under `.opencode/skills/system-code-graph/` (source, schemas, handlers, lib, tools, tests, stress_test, README, SKILL.md, ARCHITECTURE.md, INSTALL_GUIDE.md, feature_catalog/, manual_testing_playbook/, mcp_server/database/, package.json, tsconfig.json, vitest.config.ts).
- The `mk-code-index` launcher at `.opencode/bin/mk-code-index-launcher.cjs`.
- Cross-skill consumers of `code_graph_*` MCP tools (search references in `.opencode/skills/system-spec-kit/`, `.opencode/skills/sk-code/`, `.opencode/skills/sk-doc/`, etc.).
- The `/doctor code-graph` route at `.opencode/commands/doctor/_routes.yaml` and `assets/doctor_code-graph.yaml`.
- The `/doctor:mcp install` + `debug` registration for `mk_code_index`.
- The CI isolation check at `.github/workflows/isolation-check.yml`.
- Master install README §10.4 mk_code_index section.

### Out of Scope

- Source code changes to `system-spec-kit`, `system-skill-advisor`, `sk-doc`, `sk-code`, or any other skill (review is READ-ONLY).
- Re-running the 017-isolation-arc-deep-review (which already shipped CONDITIONAL → PASS for the isolation arc).
- The `mk_skill_advisor` skill (separate review packet if needed).
- External MCP servers (`cocoindex_code`, `code_mode`, `sequential_thinking`).
- Performance benchmarking (separate stress-test packet).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 20 iterations dispatch successfully | `review/iterations/iteration-{001..020}.md` exist and are non-empty. |
| REQ-002 | State JSONL captures every iteration | `review/deep-review-state.jsonl` has ≥20 records with required fields (type=iteration, run, focus, findingsCount, newInfoRatio, timestamp). |
| REQ-003 | Each iteration covers a distinct review dimension | Iteration focus topics in JSONL are unique (no duplicates across the 20 runs). |
| REQ-004 | Final review-report.md is synthesized | `review/review-report.md` exists with: executive verdict, P0/P1/P2 findings tables, dimension-by-dimension summary, release-readiness recommendation. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Executor wiring shipped before campaign | commit `d4dff643f` "feat(deep-review): wire cli-devin as a first-class executor" landed on origin/main. |
| REQ-006 | Convergence is tracked across iterations | `newInfoRatio` in JSONL trends downward (or surfaces explicit no-convergence). |
| REQ-007 | Findings cite file:line evidence | P0/P1/P2 entries reference specific code/doc paths, not vague "needs improvement" boilerplate. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20 iteration markdown files + 20 JSONL records, no missing artifacts.
- **SC-002**: `review-report.md` ships with PASS / CONDITIONAL / FAIL verdict for system-code-graph at the v1.0.0.0 release boundary.
- **SC-003**: All P0 findings (if any) have an actionable remediation path documented.
- **SC-004**: The cli-devin executor wiring proves stable across 20 sequential dispatches (no recurring dispatch failures).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin first real-world run on this dispatch chain | Per-iteration dispatch may surface edge cases the smoke test didn't cover. | Run iteration 1 fully (smoke baseline) before launching the remaining 19. |
| Risk | SWE-1.6 model hallucinates plausible CLI flags or non-existent consumer files | Findings could be false-positive without bundle verification. | Use the cli-devin-bundle-verification-gate pattern (grep-verify file paths + smoke-run validation commands) when iteration findings cite specific commands. |
| Risk | 20 iterations × Devin credits | Cost. | Sequential dispatch; abort if convergence reached at iter ≤15. |
| Dependency | `mk_code_index` MCP server reachable from cli-devin's runtime environment | cli-devin needs to inspect graph state. | Devin runs locally with full access; no remote MCP gate needed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
