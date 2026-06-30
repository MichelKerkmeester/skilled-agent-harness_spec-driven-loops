---
title: "Implementation Summary: Env and Config Behavior Closure for F17 F16 F40 F46"
description: "Planned-state summary for sidecar env/config behavior closure; final implementation evidence will be filled after verification."
trigger_phrases:
  - "020 002 implementation summary"
  - "env config implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior"
    last_updated_at: "2026-05-23T12:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded"
    next_safe_action: "Validate scaffold, then implement F17/F16/F40/F46"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
    session_dedup:
      fingerprint: "sha256:0200020200020200020200020200020200020200020200020200020200020200"
      session_id: "020-002-f17-f16-f40-f46-env-config"
      parent_session_id: null
    completion_pct: 10
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
| **Spec Folder** | 002-fix-deferred-p2s-for-env-and-config-behavior |
| **Status** | Draft |
| **Completed** | Pending |
| **Level** | 2 |
| **Findings Closed** | Pending: F17, F16, F40, F46 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Planned changes:

| Finding | Planned Closure |
|---------|-----------------|
| F17 | Validate config-hash inputs before hashing and reject malformed values with `ConfigHashInputError` |
| F16 | Drop disallowed in-process env vars with stderr warnings instead of forwarding them |
| F40 | Use one shared allowlist between launcher and in-process sidecar env filters |
| F46 | Document and test prefix overlap precedence where `SPECKIT_*` wins on equal setting conflicts |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Planned modify | F17 validation and shared allowlist |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Planned modify | F17 fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Planned modify | F16/F40/F46 behavior |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Planned modify | F16/F40/F46 fixtures |
| `.opencode/bin/lib/sidecar-env-allowlist.cjs` | Planned create | Shared allowlist source |
| Packet docs | Modified | Level 2 scaffold and ADRs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Pending implementation. Scaffold copied canonical anchors from 020/001, then rewrote packet content for bucket 1 env/config behavior.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Validate before config hashing | Sidecar identity must not normalize malformed or oversized config silently |
| Shared env allowlist | Prevents F49 launcher and in-process client drift |
| Warning plus drop for disallowed env | Gives operators a migration window without leaking values |
| `SPECKIT_*` wins equal setting conflict | Spec Kit-owned client favors Spec Kit namespace and announces overlap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after scaffold | PASS |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | Pending |
| `node node_modules/vitest/vitest.mjs run .opencode/bin/lib/ensure-rerank-sidecar.vitest.ts --config .opencode/vitest.config.bin.ts` | Pending |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | Pending |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` final | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. No limitations identified at scaffold time.
<!-- /ANCHOR:limitations -->
