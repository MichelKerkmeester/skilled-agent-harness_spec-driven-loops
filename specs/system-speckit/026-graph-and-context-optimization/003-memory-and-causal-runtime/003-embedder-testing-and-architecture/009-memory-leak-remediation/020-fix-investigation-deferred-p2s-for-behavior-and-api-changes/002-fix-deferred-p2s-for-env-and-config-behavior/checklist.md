---
title: "Checklist: Env and Config Behavior Closure for F17 F16 F40 F46"
description: "Verification checklist for config hash validation, sidecar env allowlist alignment, and prefix precedence behavior."
trigger_phrases:
  - "020 002 checklist"
  - "env config checklist"
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
    key_files: []
    session_dedup:
      fingerprint: "sha256:0200020200020200020200020200020200020200020200020200020200020200"
      session_id: "020-002-f17-f16-f40-f46-env-config"
      parent_session_id: null
    completion_pct: 10
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: Env and Config Behavior Closure for F17 F16 F40 F46

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P0] Scaffold strict validation passes before source edits: `validate.sh .../002-fix-deferred-p2s-for-env-and-config-behavior --strict` exit 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [ ] CHK-010 [P0] F17 config validation rejects invalid values before hashing
- [ ] CHK-011 [P0] F17 errors include rejected key and omit rejected value
- [ ] CHK-012 [P0] F16/F40 env allowlist is shared between launcher and in-process client
- [ ] CHK-013 [P0] F16 dropped env vars warn to stderr and do not throw
- [ ] CHK-014 [P0] F46 prefix precedence is implemented and documented in code/ADR
- [ ] CHK-015 [P0] Forbidden sibling bucket files remain untouched
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [ ] CHK-020 [P0] Embedders vitest passes: `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts`
- [ ] CHK-021 [P0] Bin vitest passes: `node node_modules/vitest/vitest.mjs run .opencode/bin/lib/ensure-rerank-sidecar.vitest.ts --config .opencode/vitest.config.bin.ts`
- [ ] CHK-022 [P0] Typecheck passes: `npm run typecheck --workspace=@spec-kit/mcp-server`
- [ ] CHK-023 [P0] Final strict spec validation passes: `validate.sh ... --strict` exit 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] F17 closure row cites oversized, non-string, unprintable-byte, and valid-hash fixtures
- [ ] CHK-FIX-002 [P0] F16 closure row cites drop-with-warning fixture
- [ ] CHK-FIX-003 [P0] F40 closure row cites shared allowlist parity evidence
- [ ] CHK-FIX-004 [P0] F46 closure row cites precedence fixture
- [ ] CHK-FIX-005 [P1] ADR records F17 hash sanitization policy
- [ ] CHK-FIX-006 [P1] ADR records F16/F40 shared allowlist and drop-with-warning behavior
- [ ] CHK-FIX-007 [P1] ADR records F46 prefix precedence and affected-consumer list
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P0] Rejected values are not logged
- [ ] CHK-032 [P1] Env filtering reduces parent-env leakage relative to the prior in-process client behavior
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `decision-record.md` includes at least three ADRs
- [ ] CHK-042 [P1] `implementation-summary.md` includes verification and handoff
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [ ] CHK-050 [P1] Temp files remain outside the repo or in packet-local scratch only
- [ ] CHK-051 [P1] No git commit or branch mutation performed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 3/16 |
| P1 Items | 8 | 0/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending

### Finding Closure

| Finding | Status | Evidence |
|---------|--------|----------|
| F17 | Pending | Config-hash sanitization fixture pending |
| F16 | Pending | Env drop-with-warning fixture pending |
| F40 | Pending | Shared allowlist parity fixture pending |
| F46 | Pending | Prefix precedence fixture pending |
<!-- /ANCHOR:summary -->
