---
title: "Feature Specification: 016 Manual Testing Verification"
description: "Manual testing verification packet for the mk-code-index rename and post-014 work. Layer-1 execution of every scenario in the manual_testing_playbook plus Layer-2 smoke probes."
trigger_phrases:
  - "016 manual testing verification"
  - "code-graph manual testing"
  - "mk-code-index verification"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/030-manual-testing-verification"
    last_updated_at: "2026-05-14T20:05:00Z"
    last_updated_by: "orchestrator-patch"
    recent_action: "Patched docs to satisfy strict template scaffolding"
    next_safe_action: "Run deep-review on 010-016 campaign"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-manual-testing-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 016 Manual Testing Verification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After the 7-packet code-graph remediation campaign (010-015) shipped, the system-code-graph skill needed end-to-end manual verification: the `mk-code-index` MCP rename, sk-doc alignment work, the tsconfig fix from 009, and the architecture.md content all needed independent observation, not just unit tests. This packet executes the manual_testing_playbook scenarios plus six new post-rename smoke probes to confirm operational soundness before the campaign closes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Execute all 15 existing scenarios in `.opencode/skills/system-code-graph/manual_testing_playbook/`
- Create 6 new Layer-2 smoke scenarios for post-rename gaps
- Verify MCP tool surface, launcher startup, `.claude/mcp.json` config, database path, dist build, unicode-normalization fix
- Record per-scenario PASS / FAIL / SKIP with concrete evidence

### Out of Scope
- Modifying production source code, MCP launchers, or `.claude/mcp.json` (verification-only)
- Killing live MCP child processes
- Any work outside the 016 packet folder
- Scenarios that require disposable workspace mutations (logged as SKIP)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement | Acceptance Criteria |
|----|----------|-------------|---------------------|
| REQ-001 | P0 | Run every existing manual_testing_playbook scenario | Per-scenario verdict captured with evidence in checklist.md |
| REQ-002 | P0 | Verify mk-code-index launcher starts cleanly | stderr shows `[mk-code-index-launcher]` prefix; no legacy names |
| REQ-003 | P0 | Verify 10-tool MCP surface | JSON-RPC tools/list returns exactly 10 tools with correct names |
| REQ-004 | P0 | Verify `.claude/mcp.json` rename | `mk_code_index` key present; `system_code_graph` key absent |
| REQ-005 | P0 | Verify database canonical path | `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` is active DB |
| REQ-006 | P1 | Verify 009 tsconfig fix in dist | `dist/system-spec-kit/shared/unicode-normalization.js` present after fresh tsc |
| REQ-007 | P1 | Create 6 new smoke scenarios where coverage was missing | Numbered 016-021 in playbook |
| REQ-008 | P1 | Validate strict on 016 packet | `validate.sh --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 21 executed scenarios resolved to PASS / SKIP with documented evidence (FAIL = 0)
- All Layer-2 Post-Rename Smoke Probes (016-021) PASS
- 016 packet validates strict (0 errors, 0 warnings)
- Verdict CONDITIONAL is acceptable when hasAdvisories=true comes from non-blocking issues only
- Commit on main with co-author trailer
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Dependencies
- 010-015 packets shipped (rename, docs, READMEs, architecture, README)
- 009 tsconfig fix in dist
- node-llama-cpp Metal binary functional (verified earlier via 041 Option A)

### Risks
- SKIP scenarios (5 out of 15 in Layer 1) require disposable workspace; production-side testing cannot validate those — mitigated by Layer-2 smoke probes covering equivalent read-path behavior
- Strict template scaffolding (sk-doc anchored sections) was missed in initial opencode-glm-5.1 output — addressed via this patched spec/plan/tasks rewrite

### Out of Scope (Won't Address)
- Modifying source files based on findings (verification-only; findings drive follow-up packets if needed)
- Mutating live MCP databases
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Campaign complete; advisories listed in implementation-summary.md.
<!-- /ANCHOR:questions -->
