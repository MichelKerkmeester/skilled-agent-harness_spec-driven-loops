---
title: "Validation + cleanup: full test suite, gold queries, stale-ref cleanup, parent completion"
description: "Final validation and cleanup phase for system-code-graph extraction."
trigger_phrases:
  - "code graph validation cleanup"
  - "phase 006 validation and cleanup"
  - "system-code-graph final validation"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-2-merges/007-020-validation-and-cleanup"
    last_updated_at: "2026-05-14T08:43:25Z"
    last_updated_by: "codex"
    recent_action: "Validated extraction, removed old DB fallback, and cleared stale active references"
    next_safe_action: "Commit + ship"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140006"
      session_id: "006-validation-and-cleanup"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Validation + cleanup: full test suite, gold queries, stale-ref cleanup, parent completion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `006-validation-and-cleanup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001-005 completed the design, scaffold, physical source/database move, consumer rewire, and documentation/runtime migration for extracting code-graph into `.opencode/skills/system-code-graph/`. The final phase needed to prove the new package is buildable and testable from its new location, confirm the copied DB is valid, remove the old fallback DB only after validation, clear active stale source-path references, and mark parent phase 014 complete.

### Purpose
Run the requested typecheck, Vitest, gold-query, DB-readiness, stale-reference, and recursive spec validation gates, then update the 006 packet and parent manifests with evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the 006 Level 2 spec packet.
- Fix validation-only fallout from the package move.
- Run the full code-graph test suite and targeted system-spec-kit handler smoke.
- Verify old/new code-graph DB node counts match, then remove the old system-spec-kit DB fallback.
- Clear active stale references to `system-spec-kit/mcp_server/code_graph`.
- Mark 014 and the 007 phase-map row complete after validation.

### Out of Scope
- Code-graph algorithm changes.
- Tool-id changes.
- Git commit or PR creation.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Typecheck both system-spec-kit and system-code-graph. | Both commands exit 0. |
| REQ-002 | Run full system-code-graph Vitest suite. | Full suite exits 0. |
| REQ-003 | Run gold-query verifier. | Targeted verifier exits 0. |
| REQ-004 | Validate DB handoff before deletion. | Old/new node counts match and new count is non-zero before deleting old DB. |
| REQ-005 | Clear active stale old-path references. | Stale reference count is 0 outside migration-history exclusions. |
| REQ-006 | Validate packet and parent recursively. | Strict validation exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Typecheck exit 0.
- **SC-002**: Full code-graph Vitest exit 0.
- **SC-003**: Gold-query verifier passes.
- **SC-004**: Old code-graph DB fallback is deleted only after matching row counts.
- **SC-005**: `STALE_REFS_REMAINING=0`.
- **SC-006**: Parent 014 and 007 phase map are marked complete.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting fallback DB too early | Live code-graph reads could lose fallback state | Delete only after typecheck, full Vitest, gold verifier, and matching DB counts. |
| Risk | Generated dist retained stale fixture paths | Stale reference scan remains non-zero | Update generated bench output path alongside source benchmark fixture paths. |
| Risk | Test fixtures drift from new readiness metadata | False test failures after extraction | Update test-only manual seeding to write scope and candidate-manifest metadata. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-Q01 | Quality | Validation evidence is captured in `implementation-summary.md`. |
| NFR-S01 | Safety | Old DB deletion is gated by matching node counts. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- `npx tsc` in the new skill tried to fetch `tsc` because local `.bin` delegates to the system-spec-kit mcp_server package, which does not expose `tsc`; the local installed system-spec-kit compiler was used for offline verification.
- Vitest temp workspaces must not live under `.opencode/skills/system-code-graph`, because default scan policy excludes skill internals.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | <500 | Validation fallout plus spec docs |
| **Surface area** | Medium | Test config, test fixtures, verification handler allowlist, stale docs/dist references |
| **Risk** | Medium | DB fallback deletion was gated by full validation and count parity |
| **Reversibility** | High | File edits and old DB deletion are visible in git/status; new DB remains intact |
<!-- /ANCHOR:complexity -->
