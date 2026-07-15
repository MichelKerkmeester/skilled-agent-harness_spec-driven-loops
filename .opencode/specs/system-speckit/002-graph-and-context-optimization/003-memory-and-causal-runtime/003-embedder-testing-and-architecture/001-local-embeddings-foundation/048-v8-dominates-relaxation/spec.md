---
title: "047 V8 dominates relaxation"
description: "Relax V8 foreign-spec dominance detection for high-cross-reference docs and parent handovers without removing the safety check."
trigger_phrases:
  - "047 V8 dominates relaxation"
  - "foreign spec ids dominate rendered content"
  - "parent handover V8"
  - "direct child spec allowlist"
related_specs:
  - "041-v-rule-cross-spec-overreach"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/048-v8-dominates-relaxation"
    last_updated_at: "2026-05-14T17:15:00Z"
    last_updated_by: "codex"
    recent_action: "Completed V8 dominance relaxation and verified live handover"
    next_safe_action: "No further action required for packet 047"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 047 V8 Dominates Relaxation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Depends On** | `041-v-rule-cross-spec-overreach` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 040 fixed V8 overreach for scattered foreign spec IDs, but V8 still has a separate dominance branch that fails when a single foreign spec ID appears repeatedly. Parent-level handover docs intentionally summarize many child packets, so repeated child packet references are expected rather than contamination.

The live parent handover at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/handover.md` currently fails with `body:foreign spec ids dominate rendered content` while reporting `current_spec:014-local-embeddings-migration`.

### Purpose

Keep V8's dominance signal for real contamination while allowing high-cross-reference documents and parent handovers to mention legitimate related packet IDs. The fix must preserve strict behavior for generic docs such as `plan.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts`.
- Extend `.opencode/skills/system-spec-kit/scripts/tests/validate-memory-quality-v8-overreach.vitest.ts`.
- Add this Level-2 047 packet.
- Verify build, targeted Vitest, live handover validation, and strict packet validation.

### Out of Scope

- Rewriting the parent handover content.
- Removing the V8 dominance check.
- Changing unrelated V-rules or memory-save routing.
- Branch creation, commits, network access, or spawned agents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts` | Modify | Add dominance thresholds and cached direct-child allowlist enumeration. |
| `.opencode/skills/system-spec-kit/scripts/tests/validate-memory-quality-v8-overreach.vitest.ts` | Modify | Add T047-01 through T047-05 coverage. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/048-v8-dominates-relaxation/*` | Create | Level-2 packet docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Relax dominance thresholds for high-cross-reference docs. | `decision-record.md` with four repeated foreign mentions passes V8. |
| REQ-002 | Preserve strict generic-doc dominance. | `plan.md` with four repeated foreign mentions fails V8. |
| REQ-003 | Allow direct child spec IDs in parent docs. | Parent `handover.md` references to direct child folders do not count as foreign. |
| REQ-004 | Preserve unrelated dominance detection in parent handovers. | Parent `handover.md` with five unrelated mentions fails V8. |
| REQ-005 | Live parent handover passes. | Direct CLI validation exits 0 with `QUALITY_GATE_PASS`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep 040 regressions green. | Existing T040 and regex-narrow V8 tests pass. |
| REQ-007 | Cache child enumeration per validator invocation process. | Repeated validations reuse direct-child scan results by resolved folder path. |
| REQ-008 | Keep the patch narrow. | No source changes outside the validator and V8 regression test. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- T047-01 through T047-05 pass in the V8 overreach Vitest file.
- `validate-memory-quality-v8-regex-narrow.vitest.ts` remains green.
- `npm run build` exits 0 from `.opencode/skills/system-spec-kit/scripts`.
- Direct live validation of the 014 parent handover exits 0.
- This 047 packet strict-validates.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-relaxing V8 could hide real contamination. | High | Keep generic docs strict and keep unrelated handover dominance failing at five mentions. |
| Risk | Parent-child allowlist could allow unrelated folders. | Medium | Only direct directories matching `^[0-9]{3}-` under the resolved spec folder are allowlisted. |
| Risk | Live CLI uses built dist, not TS source. | Medium | Run `npm run build` before live validation. |
| Dependency | Existing 040 test file. | Low | Extend in place to keep V8 coverage consolidated. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NFRS

| NFR | Target | Verification |
|-----|--------|--------------|
| Precision | Legitimate child packet references are not foreign. | T047-03 |
| Safety | Unrelated repeated handover references still fail. | T047-04 |
| Maintainability | Thresholds are named constants and helper functions. | Source review and build |
| Performance | Child folder scan is cached by resolved folder. | Source review and tests |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

1. `decision-record.md` can compare a sibling or prior packet four times without becoming contaminated.
2. `plan.md` remains strict for the same four repeated references.
3. Parent `handover.md` can mention direct child packets repeatedly.
4. Parent `handover.md` still fails when a non-child unrelated spec dominates.
5. The live 014 handover has older Setup A references and must pass after the relaxed handover threshold.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. The dispatch is pre-bound to phase folder 047 with no branch, no commits, and no spawned agents.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

| Phase | Estimate | Notes |
|-------|----------|-------|
| Setup | 10 min | Read V8 source, existing tests, and packet templates. |
| Implementation | 20 min | Single validator patch plus V8 test extension. |
| Verification | 20 min | Build, targeted Vitest, live validator, strict validate. |
| **Total** | **~50 min** | Bounded local TypeScript change. |

**Complexity score**: Medium. V8 is a write-blocking quality gate, so narrow regression coverage matters.
<!-- /ANCHOR:complexity -->
