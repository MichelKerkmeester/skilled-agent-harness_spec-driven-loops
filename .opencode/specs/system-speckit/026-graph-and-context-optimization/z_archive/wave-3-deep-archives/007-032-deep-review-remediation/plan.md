---
title: "Implementation Plan: 018 Deep-Review Remediation"
description: "File-by-file plan for fixing the 14 actionable findings from packet 017's deep-review."
trigger_phrases:
  - "018 plan"
  - "deep review remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/032-deep-review-remediation"
    last_updated_at: "2026-05-14T21:10:00Z"
    last_updated_by: "orchestrator-remediation"
    recent_action: "Authored plan"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "018-deep-review-remediation-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 018 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Apply 14 surgical fixes across 7 source files based on the 017 deep-review findings registry. Each edit is bounded to the file:line cited by the reviewer. No broader sweeps. Defer 3 findings with documented rationale.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- One edit per finding, surgical scope
- Launcher startup smoke test PASSES after launcher.cjs edits
- validate.sh --strict on 018 exits 0
- Commit message lists every finding addressed + deferrals
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Findings split into three classes:

1. **Doc clarifications (10 findings)** — F002, F003, F004, F005, F007, F008, F010, F013, F014, F015, F016, F020. Add explicit naming-convention paragraphs and namespace cross-references; document the SPECKIT_CODE_GRAPH_DB_DIR env override. No code changes for these.
2. **Launcher hardening (2 findings)** — F009 (env value validation), F019 (lock staleness detection). Conservative defensive additions inside `mk-code-index-launcher.cjs`; existing happy paths unchanged.
3. **Deferred (3 findings)** — F001 (already-resolved), F017 (build artifact maps — auto-resolves on rebuild), F018 (per-parameter test gaps — accepted).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| File | Edit Type |
|------|-----------|
| `.opencode/skills/system-code-graph/SKILL.md` | Naming convention paragraph (F002/F003) |
| `.opencode/skills/system-spec-kit/README.md` | Owner-table namespace clarification (F004) |
| `.opencode/skills/system-spec-kit/SKILL.md` | Tool-list parenthetical (F005) |
| `.opencode/bin/mk-code-index-launcher.cjs` | Error message (F007), env validator (F009), lock staleness (F019) |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Feature-to-tool reconciliation paragraph (F013/F014) |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | Scenario 011 schema cross-reference (F008/F015) |
| `.opencode/skills/system-code-graph/README.md` | DB_DIR override + mcp.json convention (F010/F016/F020) |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Doc Edits
- Apply F002 paragraph + F003-F005 namespace clarifications
- Apply F008/F010/F013/F014/F015/F016/F020 doc updates

### Phase 2: Launcher Hardening
- Apply F007 error message update
- Apply F009 env value validator
- Apply F019 lock staleness detection
- Verify launcher startup smoke test

### Phase 3: Verification
- validate.sh --strict on 018
- git diff scope review (no broader changes)
- Stage and commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- **Launcher smoke**: `timeout 5 node .opencode/bin/mk-code-index-launcher.cjs </dev/null` — expect `[mk-code-index-launcher]` prefix and clean env loading
- **Lock staleness**: not unit-tested here; defensive code added with explicit 5-min threshold; manual testing scenario follow-up
- **Doc edits**: visual review of diffs; strict-validate catches structural issues
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- Packet 017 findings registry (authoritative scope)
- Packets 010-016 shipped on main
- Launcher file accessible and editable (no live MCP children pinning it via `flock` etc.)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- Doc edits: `git revert <018-commit-sha>` restores prior content
- Launcher hardening: same git revert path; old startup path is preserved (validator change is additive, lock-staleness adds an `if` branch)
- No DB or runtime state changes — rollback is purely git
<!-- /ANCHOR:rollback -->
