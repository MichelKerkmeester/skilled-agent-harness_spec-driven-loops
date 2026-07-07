---
title: "Full spec-kit advisor import decoupling"
description: "Isolate system-spec-kit from advisor source imports by moving advisor-owned hooks, tests, and stress coverage into system-skill-advisor and replacing residual spec-kit imports with local seams or process-boundary gateways."
trigger_phrases:
  - "013/009/019"
  - "spec-kit advisor decoupling"
  - "full import isolation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling"
    last_updated_at: "2026-05-15T09:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed import decoupling unblock and validation repair."
    next_safe_action: "Commit and push scoped 019 changes."
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator narrowed scope to full import isolation."
      - "Memory full-suite failures are baseline-red and unchanged by decoupling."
---
# Full Spec-Kit Advisor Import Decoupling

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 019 completes the full import isolation slice: advisor-owned source, hooks, tests, and stress coverage live in `system-skill-advisor`; spec-kit retains only process-boundary compatibility stubs and local utilities. Advisor tests pass after the moved fixture path repair, and memory full-suite failures are classified as baseline-red because the failed test count did not increase.

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## PROBLEM & PURPOSE

### Problem Statement
`system-spec-kit/mcp_server` still contained advisor source imports after advisor extraction. That kept the packages coupled in-process and allowed advisor-owned hooks/tests to remain under spec-kit.

### Purpose
Make advisor code self-contained in `system-skill-advisor`, with spec-kit communicating through local utilities or process/MCP boundaries only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## SCOPE

### In Scope
- Move advisor prompt hooks for Claude, Codex, and Gemini into `system-skill-advisor/hooks`.
- Keep spec-kit runtime hook compatibility through thin executable stubs.
- Move advisor-owned unit and stress tests into `system-skill-advisor/mcp_server`.
- Remove spec-kit advisor schema imports and neutral advisor re-export seams.
- Keep the plugin bridge as a process-boundary gateway.

### Out of Scope
- Tool/server/skill ID renames.
- Fixing unrelated memory baseline-red failures.
- Reworking `review-10iter` artifacts.
- Replacing the plugin gateway with a new transport.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/hooks/` | Modify/Create | Advisor hook ownership |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/` | Modify/Create | Advisor unit and hook coverage |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/` | Modify/Create | Advisor stress coverage |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/` | Create | Process-boundary compatibility stubs |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | Drop advisor schema exposure |
| `019-spec-kit-advisor-decoupling/` | Modify | Verification and continuity docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Remove direct `system-skill-advisor` imports from spec-kit MCP code | Exact audit grep returns zero lines | Met |
| REQ-002 | Preserve runtime compatibility for old hook paths | Spec-kit hook paths execute advisor hooks as process stubs | Met |
| REQ-003 | Fix advisor suite regression introduced by moved test paths | Advisor `npm test` passes | Met |

### P1 - Required

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-004 | Classify memory full-suite failures | Post-change failed test count is not higher than baseline | Met |
| REQ-005 | Keep plugin bridge only as gateway | Bridge remains process-boundary and source imports stay absent | Met |
| REQ-006 | Validate packet docs | 019 and parent strict validation pass | Met |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA

- **SC-001**: Exact advisor import audit in spec-kit MCP returns zero.
- **SC-002**: Advisor vitest passes after moved test fixture repair.
- **SC-003**: Memory regression count introduced by decoupling is zero.
- **SC-004**: 019 and parent packets pass strict validation.
- **SC-005**: Commit contains no out-of-scope files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Future source imports cross the boundary | High | Keep exact import audit as a release gate |
| Dependency | Parallel-session dirty files | Medium | Stage only whitelisted decoupling paths |
| Risk | Memory suite remains baseline-red | Medium | Document unchanged failed test count and do not fix unrelated failures |
<!-- /ANCHOR:risks -->

---

## NON-FUNCTIONAL REQUIREMENTS

- Preserve existing IDs and runtime entrypoint names.
- Avoid force-push, branch creation, and `--no-verify`.
- Keep file changes scoped to 019 decoupling and validation repair.

---

## EDGE CASES

- Old runtime configs invoke spec-kit hook paths after hook logic moved.
- Advisor tests write reports into reorganized spec packet paths.
- Full memory suite remains red for pre-existing reasons.

---

## COMPLEXITY ASSESSMENT

Level 3 is warranted because this crosses package boundaries, test ownership, runtime hooks, and spec validation.

---

## RISK MATRIX

| Risk | Likelihood | Impact | Response |
|------|------------|--------|----------|
| Missing a hidden advisor import | Low | High | Exact and broad grep before commit |
| Staging unrelated dirty files | Medium | High | Explicit path staging and staged diff audit |
| Baseline-red tests mistaken for regressions | Medium | Medium | Stash baseline comparison |

---

## USER STORIES

1. As a maintainer, I can verify spec-kit no longer imports advisor source with one grep.
2. As an advisor maintainer, I can run advisor-owned tests from the advisor package.
3. As an operator, I can inspect the 019 packet and see which failures were baseline-red.

---

<!-- ANCHOR:questions -->
## OPEN QUESTIONS

- None. Operator pre-approved Existing 019 packet, commit, push, `main`, and `:auto` mode.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
