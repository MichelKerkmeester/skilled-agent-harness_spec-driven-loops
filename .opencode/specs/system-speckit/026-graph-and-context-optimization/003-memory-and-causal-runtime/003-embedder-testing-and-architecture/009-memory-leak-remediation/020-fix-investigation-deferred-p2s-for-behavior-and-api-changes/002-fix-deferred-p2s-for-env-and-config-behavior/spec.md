---
title: "Spec: Env and Config Behavior Closure for F17 F16 F40 F46"
description: "Level 2 packet closing deferred P2 rerank sidecar findings for config-hash validation, env allowlist alignment, and config-prefix precedence."
trigger_phrases:
  - "020 002 env config behavior"
  - "F17 F16 F40 F46 sidecar"
  - "rerank sidecar env allowlist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior"
    last_updated_at: "2026-05-23T12:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded"
    next_safe_action: "Validate scaffold, then implement F17/F16/F40/F46"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
      - ".opencode/bin/lib/ensure-rerank-sidecar.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200020200020200020200020200020200020200020200020200020200020200"
      session_id: "020-002-f17-f16-f40-f46-env-config"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "User pre-approved this Level 2 spec folder and branch main."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Env and Config Behavior Closure for F17 F16 F40 F46

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (020 deferred P2 bucket parent) |
| **Predecessors** | `../001-fix-deferred-p2s-for-test-only-and-shared-exports/decision-record.md`; `../../017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode/implementation-summary.md`; `../../015-deep-research-drift-and-simplification/research/findings-registry.json` |
| **Handoff Criteria** | F17/F16/F40/F46 closed; requested vitest suites green; mcp-server typecheck green; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four deferred P2 findings remain in the rerank sidecar env/config surface. F17 allows malformed config values to enter the canonical hash. F16 and F40 report env allowlist drift between launcher and in-process sidecar clients. F46 requires a documented config-prefix precedence rule where `SPECKIT_*` and `RERANK_*` can express the same sidecar intent.

### Purpose
Close the four findings with bounded behavior changes, regression fixtures, and ADRs that make the operator-visible migration rules explicit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add config-hash input validation in `.opencode/bin/lib/ensure-rerank-sidecar.cjs`.
- Reject non-string, oversize, or unprintable config values before hashing, without logging values.
- Align `sidecar-client.ts` env filtering with the F49 launcher allowlist.
- Drop disallowed env keys with stderr warnings naming keys only.
- Document and test config-prefix precedence for overlapping `SPECKIT_*` and `RERANK_*` inputs.
- Add fixtures to `sidecar-hardening.vitest.ts` and `ensure-rerank-sidecar.vitest.ts`.

### Out of Scope
- Modifying `registry.ts`, `index.ts`, `sidecar-worker.ts`, `execution-router.ts`, or `reindex.ts`.
- Changing provider selection, embedding request behavior, or rerank worker internals.
- Git commit or branch mutation.
- Broad env/config documentation outside this packet unless required by changed code comments.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modify | Add config-hash validation and use shared sidecar env allowlist |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modify | Add F17 validation fixtures and launcher allowlist coverage |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modify | Use shared allowlist, warn/drop rejected env vars, document prefix precedence |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modify | Add env drop-warning and prefix precedence fixtures |
| `.opencode/bin/lib/sidecar-env-allowlist.cjs` | Create | Shared allowlist source consumed by launcher and in-process client |
| `<this-folder>/*.md` | Modify | Record plan, ADRs, checklist evidence, verification, and handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F17 config hash validation | `canonicalConfigHash()` throws `ConfigHashInputError` for non-string, >4KB total, and unprintable-byte values before hashing |
| REQ-002 | Secret-safe F17 errors | Error messages include the rejected key and omit the rejected value |
| REQ-003 | F16/F40 allowlist alignment | `sidecar-client.ts` and `ensure-rerank-sidecar.cjs` use the same allowlist helper |
| REQ-004 | F16 migration window | Dropped env keys emit stderr warnings and do not throw |
| REQ-005 | F46 prefix precedence | Overlap resolution documents and tests `SPECKIT_*` winning over `RERANK_*` with a stderr warning |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve targeted tests | Requested embedders vitest and bin vitest commands exit 0 |
| REQ-007 | Preserve type safety | `npm run typecheck --workspace=@spec-kit/mcp-server` exits 0 |
| REQ-008 | Preserve packet docs | `validate.sh <spec-folder> --strict` exits 0 before source edits and at completion |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F17, F16, F40, and F46 are marked closed in `checklist.md`.
- **SC-002**: Invalid config-hash inputs fail closed with `ConfigHashInputError`.
- **SC-003**: Launcher and in-process env filtering share one allowlist.
- **SC-004**: Disallowed env keys are dropped with stderr warnings, not hard errors.
- **SC-005**: Prefix overlap behavior is documented and covered by a fixture.
- **SC-006**: All requested verification commands exit 0 unless halt-on-first-regression triggers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Env allowlist changes are observable | Medium | Drop with warning instead of hard error and document affected consumers in ADR |
| Risk | Config validation rejects a previously tolerated malformed env | Medium | Limit validation to hash-relevant keys and include key-only error messages |
| Risk | Prefix precedence could surprise operators | Medium | Prefer `SPECKIT_*`, warn on overlap, and cover with a fixture |
| Dependency | F49 launcher baseline | High | Use exact/prefix allowlist from `017/.../004.../implementation-summary.md` and current launcher helper |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Env filtering and config validation stay linear in the number of env entries and hash config keys.

### Security
- **NFR-S01**: Rejected env/config values are never written to stderr.
- **NFR-S02**: Disallowed parent env keys are not forwarded to child processes.

### Reliability
- **NFR-R01**: Existing valid configs produce unchanged hashes.
- **NFR-R02**: Targeted test suites pass before completion.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Total canonical hash input values must not exceed 4KB.
- Config-hash values must be strings with printable characters only.

### Error Scenarios
- Rejected config values throw `ConfigHashInputError` with the rejected key, not the value.
- Rejected env keys warn once per key per filter call and are dropped.

### State Transitions
- Empty config values keep the existing default/fallback behavior where current code already treats empty strings as unset.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two source files plus focused fixtures and packet docs |
| Risk | 14/25 | Env and config behavior changes are visible but bounded |
| Research | 8/20 | Requires F49 baseline and deferred finding registry reads |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. User specified the closure behavior and halt-on-first-regression rule.
<!-- /ANCHOR:questions -->
