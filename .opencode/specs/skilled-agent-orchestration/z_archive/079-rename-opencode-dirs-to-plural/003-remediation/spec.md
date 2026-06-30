---
title: "Feature Specification: 098 - 097 deep-review remediation"
description: "Phase parent for 7 remediation sub-phases addressing 22 active findings (P0=1, P1=12, P2=9) from packet 097 deep-review of the 093-096 track."
trigger_phrases:
  - "098 remediation"
  - "097 findings remediation"
  - "dist rebuild"
  - "sk-deep token replace"
  - "rename remediation"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase parent spec; Phase 001 (P0 dist rebuild) complete"
    next_safe_action: "Author Phase 002-007 stubs via cli-codex"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 14
    open_questions: []
    answered_questions: []
---
# Feature Specification: 098 - 097 deep-review remediation

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase-parent |
| **Priority** | P0 (release-blocking) |
| **Status** | In Progress (Phase 001 complete) |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
| **Sub-phases** | 7 |
| **Source** | packet 097 deep-review review-report.md (verdict FAIL, 22 active findings) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. ROOT PURPOSE

Packet 097 (`/speckit:deep-review:auto`, 10 iterations, gpt-5.5 high fast) ran an architectural cross-phase review of recently-shipped packets 093-096 and converged with a FAIL verdict driven by **1 P0** plus **12 P1** plus **9 P2** active findings. The single P0 (P0-001) blocks release; the P1 cluster captures dead-reference drift (`sk-deep-*` legacy tokens), 096 self-validation failures, narrative tautologies introduced by bulk sed, hook precedence weaknesses, unchecked checklist evidence, advisor state path drift, and Python support-tool singular-default residue. The P2 cluster captures install guide drift, Barter root README drift, and a dead Copilot guard branch.

Packet 098 is the remediation umbrella that converts each finding into a spec-governed change with file:line evidence, then re-runs `/speckit:deep-review:auto` on the same scope to confirm the verdict flips PASS.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SUB-PHASE CONTROL FILE

Phases execute sequentially in the order below. Phases 002-007 are independent of one another; only Phase 001 has a strict ordering position (P0 → must land first to unblock release).

| Phase | Title | Severity Cluster | Findings Resolved | Status |
|-------|-------|------------------|-------------------|--------|
| **001** | dist rebuild + CI guard | P0 | P0-001, P2-002, P2-008 | Complete |
| **002** | sk-deep-* token replacement | P1 | P1-002, P1-008, P1-009, P1-011, P1-012 | Pending |
| **003** | 096 narrative + smart-router validation repair | P1 | P1-004, P1-010, P1-013 | Pending |
| **004** | Hook tightening + resolver realpath | P1 | P1-006, P1-005 (downgraded P2) | Pending |
| **005** | Checklist evidence backfill | P1 | P1-007, P2-006 | Pending |
| **006** | Skill advisor + Python tools plural migration | P1 | P1-003, P1-014 | Pending |
| **007** | P2 doc drift sweep | P2 | P2-001, P2-003, P2-004, P2-005, P2-007 | Pending |

Out of scope: re-running 094 RCAF naturalization or 096 directory rename (both baseline). Auditing barter/coder/ sibling repo (intentionally separate per project memory). Auditing z_archive/, playbooks-archived/, review/iter-archive/ historical content.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. PARENT-LEVEL SUCCESS CRITERIA

| ID | Requirement | Evidence path |
|----|-------------|---------------|
| REQ-001 | All 7 sub-phases reach implementation-summary.md complete | `00N-*/implementation-summary.md` |
| REQ-002 | `validate.sh --strict 098-097-remediation` exits 0 (recursive) | run output |
| REQ-003 | `validate.sh --strict 096-rename-opencode-dirs-to-plural` exits 0 (was 2) | run output |
| REQ-004 | `mcp_server/dist/` rebuilt; no singular runtime globs | `rg '\.opencode/(skill\|agent\|command)/' dist/code_graph/` returns 0 |
| REQ-005 | Re-dispatched `/speckit:deep-review:auto` on 093-096 + 098 returns verdict PASS (or PASS hasAdvisories=true if P2 deferred) | new review-report.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. PARENT EXIT CRITERIA

- All 7 child phases marked `derived.status: complete` in their `graph-metadata.json`.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation --strict` exit 0.
- A final deep-review re-run on the 093-096 + 098 scope flips the verdict to PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. PARENT-LEVEL RISKS

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | dist rebuild surfaces unrelated TS errors | Medium | Phase 001 captures collateral test-file regex repair (P1-010 instance) |
| Risk | sk-deep-* token replacement misses cross-runtime mirrors | Medium | Phase 002 explicitly enumerates 5 surfaces with verification grep |
| Risk | Resolver tightening breaks legitimate edge cases | Low | Phase 004 adds attack-matrix tests before deployment |
| Risk | Doc drift sweep introduces stale references | Low | Phase 007 re-runs case-insensitive rg as final guard |
| Dependency | Phase 001 must land first | Required | Sequential ordering; other phases pending Phase 001 commit |
<!-- /ANCHOR:risks -->

---

## RELATED DOCUMENTS

- **Predecessor**: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/review-report.md`
- **Driving findings registry**: see `097-track-review/review/deep-review-findings-registry.json`
- **Sub-phase docs**: `00N-<name>/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
