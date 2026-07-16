---
title: "Plan: Env and Config Behavior Closure for F17 F16 F40 F46"
description: "Plan for config-hash sanitization, shared sidecar env allowlist alignment, drop-with-warning env filtering, and prefix precedence fixtures."
trigger_phrases:
  - "020 002 plan"
  - "env config behavior plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Env and Config Behavior Closure for F17 F16 F40 F46

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, Node.js |
| **Framework** | Vitest mcp-server and bin suites |
| **Storage** | None for this change |
| **Testing** | Targeted Vitest, mcp-server typecheck, strict spec validation |

### Overview
This packet closes four deferred P2 findings in the rerank sidecar env/config boundary. The sequence is scaffold validation, F17 hash input validation, F16/F40 shared allowlist alignment, F46 prefix precedence, targeted fixtures, typecheck, docs completion, and final strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent 020 scope confirms bucket 1 owns F17, F16, F40, and F46.
- [x] F49 baseline confirms launcher allowlist shape.
- [x] Source/test files read before editing.
- [x] Scaffold strict validation passes before source edits.

### Definition of Done
- [ ] F17 invalid config-hash inputs reject before hashing.
- [ ] F16/F40 launcher and in-process env filtering use one allowlist helper.
- [ ] F46 overlap precedence is documented and tested.
- [ ] Requested vitest, typecheck, and strict validation commands exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared allowlist module plus source-local validation helpers. The CJS launcher and TypeScript in-process client both consume one allowlist source so exact keys and prefix families cannot drift.

### Key Components
- **`sidecar-env-allowlist.cjs`**: shared exact-key and prefix policy for sidecar child env filtering.
- **`ensure-rerank-sidecar.cjs`**: launcher surface for rerank sidecar process startup, config hash calculation, and child env construction.
- **`sidecar-client.ts`**: in-process embedder sidecar client that forks `sidecar-worker`.
- **Vitest fixtures**: encode the new error, warning, allowlist, and precedence contracts.

### Data Flow
Parent env entries enter a shared filter. Allowed entries pass to the child. Disallowed entries are dropped after a key-only stderr warning. Hash-relevant config keys are validated before canonicalization and hashing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ensure-rerank-sidecar.cjs` | Launcher and config-hash owner | Validate hash inputs and consume shared allowlist | `ensure-rerank-sidecar.vitest.ts` |
| `sidecar-client.ts` | In-process fork env filter | Consume shared allowlist and warn/drop rejected keys | `sidecar-hardening.vitest.ts` |
| `sidecar-hardening.vitest.ts` | Client hardening suite | Add env-warning and prefix-precedence fixtures | Embedders vitest |
| `ensure-rerank-sidecar.vitest.ts` | Launcher hardening suite | Add F17 invalid input fixtures | Bin vitest |

Baseline allowlist from F49:
- Exact keys: `HOME`, `LANG`, `PATH`, `TEMP`, `TMP`, `TMPDIR`, `TRANSFORMERS_OFFLINE`, `PYTORCH_ENABLE_MPS_FALLBACK`
- Prefixes: `LC_`, `SPECKIT_`, `RERANK_`, `HF_`
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold packet docs from sibling 020/001.
- [x] Read parent 020 spec and Bucket 6 ADR template.
- [x] Read F49 implementation summary and full target source/test files.
- [x] Strict-validate scaffold before source edits.

### Phase 2: Core Implementation
- [ ] Add shared sidecar env allowlist helper.
- [ ] Wire launcher and in-process client to shared allowlist.
- [ ] Add drop-with-warning behavior for rejected env keys.
- [ ] Add config-hash validation and `ConfigHashInputError`.
- [ ] Add prefix-overlap resolver with `SPECKIT_*` precedence and warning.

### Phase 3: Verification
- [ ] Run requested embedders vitest command.
- [ ] Run requested bin vitest command.
- [ ] Run mcp-server typecheck.
- [ ] Fill checklist, decision record, and implementation summary.
- [ ] Run final strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Env filter, warning, and prefix precedence | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` |
| Unit | Config-hash validation | `node node_modules/vitest/vitest.mjs run .opencode/bin/lib/ensure-rerank-sidecar.vitest.ts --config .opencode/vitest.config.bin.ts` |
| Compile | mcp-server TypeScript import/runtime shape | `npm run typecheck --workspace=@spec-kit/mcp-server` |
| Spec | Packet contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| F49 launcher baseline | Internal contract | Read | Cannot claim allowlist alignment |
| Vitest installs | Internal tooling | Present expected | Cannot prove fixture behavior |
| mcp-server workspace typecheck | Internal tooling | Present expected | Cannot claim TS safety |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any targeted test failure or typecheck failure that is not directly caused by this packet and fixable in scope.
- **Procedure**: Stop at first regression per parent rule, record the failure in `decision-record.md` DEFERRED section, and do not proceed to remaining findings.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent/predecessor reads | Core |
| Core | Scaffold validation | Verify |
| Verify | Fixture implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20-30 minutes |
| Core Implementation | Medium | 60-120 minutes |
| Verification | Medium | 30-60 minutes |
| **Total** | | **110-210 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Config-hash validation preserves existing valid hashes.
- [ ] Env allowlist matches F49 exact keys and prefixes.
- [ ] Dropped env warnings do not include values.

### Rollback Procedure
1. Restore prior env filtering and config hash behavior if targeted tests expose an in-scope regression.
2. Record any unrelated existing test failure in `decision-record.md` DEFERRED section and halt.
3. Re-run the failing targeted command after any rollback.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
