---
title: "Implementation Summary: API Response Shape Closure for F9 F32 F39 F97 F99"
description: "Planned-state summary for sidecar-client API response-shape closure; final implementation evidence will be filled after verification."
trigger_phrases:
  - "020 004 implementation summary"
  - "api response shape implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200040200040200040200040200040200040200040200040200040200040200"
      session_id: "020-004-api-response-shape"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-fix-deferred-p2s-for-api-response-shape |
| **Status** | Complete |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
| **Findings Closed** | F9, F32, F39, F97, F99 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Implemented changes:

| Finding | Planned Closure |
|---------|-----------------|
| F9 | Removed the production named export of `buildSidecarEnv`; exposed test access through `sidecar-client.testables.ts`; added a fixture proving the production module does not export it |
| F32 | Added canonical worker info fields `lastRequestAt`, `idleForMs`, and `requestCount` while preserving deprecated snake_case aliases |
| F39 | Aligned worker info response naming to camelCase and covered both-name presence in hardening tests |
| F97 | Added canonical `dimensions` on `SidecarClient`; kept `dim` as a deprecated one-release alias with warning |
| F99 | Replaced the unsafe pending resolution cast with `unknown` map entries plus discriminator-narrowing via `isPendingRequest()` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modified | API/test export, response alias, and pending-map fixes |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts` | Modified | Test-only helper export surface |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modified | F9/F32/F39/F97/F99 regression fixtures |
| Packet docs | Modified | Level 2 scaffold, checklist, ADRs, and verification plan |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Implementation stayed inside the approved three source/test files. The response compatibility layer is additive: canonical names are present immediately, and legacy names remain readable through getter aliases that warn once per process. F99 stayed local to `sidecar-client.ts`, so no DEFERRED-AGAIN escalation or sibling consumer changes were needed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Use `sidecar-client.testables.ts` for F9 | Keeps test-only helper access out of production exports |
| Emit both old and new response names | Avoids a hard public API break during this release |
| Warn once on legacy alias reads | Gives consumers a migration signal without stderr spam |
| Narrow pending entries by discriminator | Keeps type safety local to `sidecar-client.ts` and avoids unsafe casts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| Scaffold strict validation | PASS: errors 0, warnings 0, exit 0 |
| `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | PASS: 4 files, 47 tests, exit 0 |
| `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` | PASS: exit 0 |
| Final strict validation | PASS: errors 0, warnings 0, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. Legacy aliases are intentionally temporary and should be removed after the one-release compatibility window.
<!-- /ANCHOR:limitations -->
