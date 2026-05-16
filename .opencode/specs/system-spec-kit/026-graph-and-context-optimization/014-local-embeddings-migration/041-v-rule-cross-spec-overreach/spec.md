---
title: "040 V-rule cross-spec overreach fix"
description: "Fix V8 cross-spec contamination overreach for ADR-like docs, metric labels, nested child packets, and current packet extraction."
trigger_phrases:
  - "040 V-rule cross-spec overreach fix"
  - "V8 cross-spec contamination overreach"
  - "ADR numeric prefix false positive"
  - "current spec nested path extraction"
related_specs:
  - "037-llama-cpp-embedding-worker-deep-dive"
importance_tier: "critical"
contextType: "spec"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/041-v-rule-cross-spec-overreach"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffolded 040 packet and began V8 source patch"
    next_safe_action: "Run build, targeted V8 vitests, live 037 ADR validation, then strict packet validation"
    blockers: []
    completion_pct: 20
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.2 -->
# Feature Specification: 040 V-rule cross-spec overreach fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-14 |
| **Branch** | main (pre-bound: no branch, no commit) |
| **Parent Spec** | ../spec.md (014-local-embeddings-migration phase parent) |
| **Phase** | 40 |
| **Predecessor** | 037-llama-cpp-embedding-worker-deep-dive |
| **Handoff Criteria** | V8 no longer rejects 037 ADR-003; targeted vitests pass; strict validate passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

The memory quality validator rejects ADR-like content with `V-rule hard block: V8 (cross-spec-contamination)`. A direct run against `037-llama-cpp-embedding-worker-deep-dive/decision-record.md` reports scattered foreign IDs such as `768-dimension`, `142-line`, `002-decouple-retention-from-governance`, and `005-substrate-stability-instrumentation`.

Four independent overreach modes cause the false block:

1. Metric labels like `768-dimension` and `142-line` fit the loose `NNN-word` shape even though they are vector dimensions and diff counts.
2. ADR titles such as `ADR-002-decouple-retention-from-governance` are decision numbers, not packet IDs.
3. Nested file-path fallback captures the first numbered path segment, so a file under `026/.../037/.../decision-record.md` is treated as current spec `026`, not `037`.
4. Decision records, handovers, and implementation summaries legitimately cross-reference related packets, so the generic scattered-foreign threshold is too low for those document types.

### Purpose

Make V8 precise enough to block real cross-spec contamination while allowing legitimate ADR and nested packet references. The fix must stay inside the validator logic and preserve existing allowlist behavior from current, ancestor, sibling, and `related_specs` detection.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Patch `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts`.
- Add `.opencode/skills/system-spec-kit/scripts/tests/validate-memory-quality-v8-overreach.vitest.ts`.
- Scaffold and maintain this Level-2 040 packet.
- Run build, targeted Vitest, existing V8 regression Vitest, live validation against 037 ADR-003, and strict packet validation.

### Out of Scope

- Memory MCP calls.
- Changes to any other packet docs.
- Changes outside the requested validator source and new Vitest file, except this 040 packet.
- Any branch creation, commit, or network use.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts` | Modify | Tighten V8 candidate extraction, ADR context filtering, nested current-spec path extraction, and doc-type scatter threshold |
| `.opencode/skills/system-spec-kit/scripts/tests/validate-memory-quality-v8-overreach.vitest.ts` | Create | Add T040-01 through T040-05 regression coverage |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/041-v-rule-cross-spec-overreach/*` | Create | Level-2 packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reject metric-suffix false positives | `768-dimension`, `142-line`, and similar unit labels are not returned as spec candidates and do not trigger V8 |
| REQ-002 | Reject ADR-number false positives | `ADR-NNN` and ADR-title contexts do not become packet IDs |
| REQ-003 | Extract current spec from the last numbered path segment | Direct validation of nested `037/.../decision-record.md` reports `current_spec:037-...` |
| REQ-004 | Live 037 ADR-003 validation passes V8 | Direct `validate-memory-quality.js` run on 037 `decision-record.md` exits 0 with `QUALITY_GATE_PASS` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Raise scatter threshold only for high-cross-reference docs | `decision-record.md`, `handover.md`, and `implementation-summary.md` allow 3 distinct single foreign references; generic docs do not |
| REQ-006 | Preserve generic scattered-foreign detection | Generic plan/tasks/spec-like docs with 4+ foreign IDs still fail V8 |
| REQ-007 | Preserve existing V8 regression behavior | Existing `validate-memory-quality-v8-regex-narrow.vitest.ts` remains green |
| REQ-008 | Keep the patch narrow | No code changes outside `validate-memory-quality.ts` and the new V8 overreach Vitest |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: New T040-01 through T040-05 Vitest file passes.
- **SC-002**: Existing V8 regex-narrow Vitest passes.
- **SC-003**: `npm run build` exits 0 from the scripts package.
- **SC-004**: Live validation of 037 ADR-003 exits 0.
- **SC-005**: This 040 packet strict-validates.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-relaxing V8 could allow real contamination in ADR docs | High | Keep dominance rule unchanged; only increase scattered distinct threshold for named doc basenames |
| Risk | ADR filtering could hide real packet references near the string `ADR-` | Medium | Limit lookback to the immediate ADR context only |
| Risk | Path fallback behavior differs between absolute and relative file paths | Medium | Normalize separators and scan path segments after `/specs/` |
| Dependency | Existing test harness imports TS source from `scripts/tests` | Low | Mirror the existing V8 regression test import pattern |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NFRs (Level 2 addendum)

| NFR | Target | Verification |
|-----|--------|--------------|
| Precision | No metric unit labels are treated as spec packets | T040-01 |
| Backward compatibility | Existing V8 tests still pass | Existing regex-narrow Vitest |
| Maintainability | New filtering rules are explicit constants, not opaque regex-only behavior | Source review |
| Performance | Candidate extraction stays linear over match count | Unit tests and build |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. Edge Cases (Level 2 addendum)

1. `768-dimension vector`, `142-line diff`, and `512-token context` are metric labels.
2. `ADR-002 covers retention` has no slug and must not become a spec ID.
3. `ADR-002-decouple-retention-from-governance` has a slug shape but is still an ADR title.
4. A decision record with three distinct one-off foreign packet references is acceptable context.
5. A generic `plan.md` with the same scattered references remains suspect and must fail.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. Open Questions

- None. The dispatch is pre-bound: no MCP, no agents, no branch, no commit, and the packet path is fixed.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## 10. Complexity (Level 2 addendum)

| Phase | Estimate | Notes |
|-------|----------|-------|
| Phase 1 - Setup | 10 min | Manual packet scaffold and source read |
| Phase 2 - Implementation | 20 min | Single validator patch plus one Vitest file |
| Phase 3 - Verification | 20 min | Build, two targeted Vitests, live validator, strict validate |
| **Total** | **~50 min** | Bounded local TypeScript change |

**Complexity score**: Medium. The source change is small, but V8 is a write-blocking rule, so regression coverage matters.
<!-- /ANCHOR:complexity -->
