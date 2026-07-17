---
title: "Feature Specification: 018 Deep-Review Remediation"
description: "Addresses the 1 P1 + 13 actionable P2 findings from packet 017's deep-review of the 010-016 code-graph remediation campaign. 3 findings deferred per reviewer recommendation."
trigger_phrases:
  - "018 deep review remediation"
  - "code graph p1 p2 fix"
  - "mk-code-index naming clarification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-032-deep-review-remediation"
    last_updated_at: "2026-05-14T21:10:00Z"
    last_updated_by: "orchestrator-remediation"
    recent_action: "Applied 14 finding fixes from 017 deep-review"
    next_safe_action: "Commit and verify launcher startup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "018-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 018 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 017 deep-reviewed the 010-016 code-graph remediation campaign and produced 1 P1 + 19 P2 findings. The reviewer's recommendation was "Ship as-is. Address P1 and batch-resolve P2s in a follow-up documentation packet." This packet IS that follow-up — it fixes the actionable findings (1 P1 + 13 P2s) and explicitly defers 3 (F001 already-resolved, F017 build-artifact maps, F018 per-parameter test scenarios).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (14 fixes)
- **F002 (P1):** Naming convention paragraph in system-code-graph/SKILL.md §7 (covers F003 too)
- **F004:** system-spec-kit/README.md table — add `mcp__mk_code_index__*` namespace clarification
- **F005:** system-spec-kit/SKILL.md — parenthetical MCP namespace + skill owner note
- **F007:** launcher error message — "mk-code-index skill (system-code-graph directory) not found"
- **F008/F015:** Document `TOOL_DEFINITIONS` alias via playbook scenario 011 cross-reference
- **F009:** Launcher env value-format hardening (reject embedded newlines/NUL bytes)
- **F010:** mcp.json underscore vs server hyphen convention noted in README + SKILL.md
- **F013/F014:** Feature catalog reconciliation paragraph (17 features ↔ 10 MCP tools; deep-loop boundary)
- **F016/F020:** SPECKIT_CODE_GRAPH_DB_DIR added to README config table
- **F019:** Bootstrap-lock staleness detection (5-min mtime check)

### Out of Scope (deferred per reviewer)
- **F001:** Already resolved during the review itself (state file cleanup verified complete)
- **F006/F011:** architecture.md §9 stale claim — file is currently 0 bytes (parallel-session-emptied); applies once content is restored
- **F012:** Launcher buildIfNeeded fallback path — inspected and verified to use the actual `@spec-kit/system-code-graph` package name + tsc-emit subdir; no fix needed
- **F017:** Build artifact source maps reference old paths — expected; resolves on next clean rebuild
- **F018:** Per-parameter test scenarios — accepted as-is per reviewer
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement | Acceptance Criteria |
|----|----------|-------------|---------------------|
| REQ-001 | P0 | F002 P1 finding addressed | system-code-graph/SKILL.md contains explicit naming-convention paragraph |
| REQ-002 | P1 | F009 + F019 launcher hardening | Launcher starts cleanly post-edit; env validator rejects newlines/NUL; lock staleness check with 5-min mtime threshold |
| REQ-003 | P1 | All other targeted P2s resolved | One edit each, surgical scope, no broader changes |
| REQ-004 | P1 | 3 deferred findings explained | implementation-summary §Known Limitations cites rationale |
| REQ-005 | P0 | Strict validate passes | `validate.sh --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 14 findings have a corresponding file:line diff
- 3 findings have a deferral rationale
- Launcher startup smoke test passes after the env-validator + lock-staleness edits
- validate.sh --strict on 018 packet exits 0
- Commit lands on main under the corrected git identity (MichelKerkmeester)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Dependencies
- 010-016 packets shipped
- 017 deep-review findings registry as authoritative scope

### Risks
- Parallel session emptied `architecture.md` — F006/F011 cannot be patched in this packet; tracked as deferred-due-to-file-state. Future packet should restore architecture.md from `1fcc5a1f5` commit if the content is wanted again.
- Launcher env-validator change is defensive; existing .env files don't contain newlines/NUL today, so behavior is unchanged for normal operation.

### Out of Scope (Won't Address)
- History rewrite for past commits attributed to `michelkerkmeester-barter` (separate concern; user can decide later)
- Restoring the parallel-emptied `architecture.md` (deferred to follow-up if needed)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Remediation scope is bounded; deferred findings have documented rationale.
<!-- /ANCHOR:questions -->
