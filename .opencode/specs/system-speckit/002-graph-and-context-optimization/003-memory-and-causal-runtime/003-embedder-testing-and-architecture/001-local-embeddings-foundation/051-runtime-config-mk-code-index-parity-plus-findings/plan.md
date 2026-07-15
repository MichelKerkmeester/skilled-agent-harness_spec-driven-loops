---
title: "Implementation Plan: Runtime config mk-code-index parity plus findings"
description: "Plan for aligning runtime MCP configs and remediating bounded deep-review findings without broadening scope."
trigger_phrases:
  - "016 implementation plan"
  - "mk-code-index parity plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/051-runtime-config-mk-code-index-parity-plus-findings"
    last_updated_at: "2026-05-14T19:27:55Z"
    last_updated_by: "codex"
    recent_action: "Plan completed with verification evidence"
    next_safe_action: "Use deferred packet names for broad P2 work"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "016-runtime-config-mk-code-index-parity-plus-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Runtime config mk-code-index parity plus findings

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, TOML, JavaScript, TypeScript test, Markdown |
| **Framework** | OpenCode system tooling and MCP runtime configs |
| **Storage** | Local SQLite launcher state, not modified intentionally |
| **Testing** | JSON parse, TOML parse, Node syntax, focused Vitest, strict spec validation, OpenCode MCP smoke |

### Overview

The implementation has two lanes. Track A applies the canonical `mk_code_index` config identity to stale runtime mirrors. Track B applies only bounded finding fixes, then records broader P2 work as follow-on packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md` scope and requirements.
- [x] Success criteria measurable. Evidence: `SC-001` through `SC-005`.
- [x] Dependencies identified. Evidence: commit SHA mismatch and runtime smoke limits documented in `spec.md`.

### Definition of Done
- [x] Runtime config parity committed. Evidence: commit `2ad7f79fa`.
- [x] Bounded review fixes committed. Evidence: commit `b74e0c95e`.
- [x] Deferred findings named. Evidence: `implementation-summary.md` deferred tables.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical config parity plus finding-ledger remediation.

### Key Components
- **Runtime config mirrors**: keep client-specific formats but converge on the same MCP server id and launcher path.
- **mk-code-index launcher**: retain skill directory slug while using runtime identity in config and logs.
- **Shared daemon evidence runner**: keep two explicit MCP clients, one for memory and one for CocoIndex.

### Data Flow

Runtime clients read their config, start `.opencode/bin/mk-code-index-launcher.cjs`, and expose stable tool IDs through the normalized `mcp__mk_code_index__*` namespace. The shared-daemon runner separately connects to `spec_kit_memory` and `cocoindex_code`, then dispatches playbook calls by server prefix.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime configs | Start MCP servers for four clients | Rename stale code-graph key/path where needed | `rg` legacy-name check plus parse checks |
| Launcher fallback | Builds missing dist entrypoint | Derive nested dist dir from `path.basename(kitDir)` | `node --check .opencode/bin/mk-code-index-launcher.cjs` |
| Shared-daemon runner | Executes MCP playbook scenarios | Broaden error pattern detection | `node --check _sandbox/.../run-mcp-direct.mjs` |
| Runner helper test | Covers parser and routing helpers | Use primary client keys | Focused Vitest PASS |
| 045 docs | Traceability source for shared-daemon runner | Reconcile shipped two-client state | 045 strict validation PASS |

Required inventories:
- Same-class producers: `rg -n "system_code_graph|system-code-graph-launcher" opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json`.
- Consumers of changed symbols: `rg -n "selectClientForServer|responseFailureMessage|mk_code_index|mk-code-index-launcher" <changed files>`.
- Matrix axes: config file format (JSON/TOML), MCP client, finding priority, and bounded-vs-follow-on remediation class.
- Algorithm invariant: tool IDs and env vars stay stable while only server identity changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 3 packet 016.
- [x] Read rename commit, review reports, runtime configs, launchers, and prior 015 context.
- [x] Decide canonical server id: `mk_code_index`.

### Phase 2: Core Implementation
- [x] Track A: update stale runtime config mirrors.
- [x] Track B: apply bounded 017 and 048 finding fixes.
- [x] Record non-bounded findings as named follow-on packets.

### Phase 3: Verification
- [x] Parse JSON/TOML configs.
- [x] Run OpenCode MCP smoke.
- [x] Run focused syntax/test/spec validation.
- [x] Strict validate packet 016.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | JSON, TOML, JS/MJS/CJS | `node`, `python3.11`, `node --check` |
| Unit | Shared-daemon helper routing | `npx vitest run tests/shared-daemon-runner-helpers.vitest.ts` |
| Integration | OpenCode MCP listing | `opencode mcp list` |
| Spec validation | 045 and 016 packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode` CLI | Internal runtime | Green for mk_code_index smoke | Without it, only static config checks would be available. |
| Local `50cfabb6e2` commit | Git history | Green | Establishes canonical rename because requested SHA is absent. |
| Vitest dependency under system-spec-kit | Internal test tooling | Green | Focused helper test verifies routing change. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `mk_code_index` fails to start in all runtime clients because of the config rename.
- **Procedure**: revert commits `b74e0c95e`, `2ad7f79fa`, and the final packet-doc commit if needed, then rerun `opencode mcp list` and config parse checks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Report/config reading and packet scaffold |
| Core Implementation | Medium | Config edits plus bounded review fixes |
| Verification | Medium | Static checks, runtime smoke, strict validation |
| **Total** | | **Single dispatch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Atomic commits created by logical scope.
- [x] Runtime config diff limited to code-graph MCP blocks.
- [x] No force push performed.

### Rollback Procedure
1. Revert the logical commits in reverse order.
2. Validate JSON/TOML syntax.
3. Rerun `opencode mcp list`.
4. Reopen deferred packets if broad hardening remains desired.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Required reading -> Track A config parity -> Track B bounded fixes -> Packet close-out
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Required reading | Existing reports/configs | Canonical id and finding ledger | Track A and Track B |
| Track A | Canonical id | Config parity commit | Runtime smoke |
| Track B | Finding ledger | Bounded findings commit | Packet summary |
| Packet docs | Track A and Track B evidence | Completion ledger | Strict validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Canonical rename confirmation** - critical because config identity depends on it.
2. **Runtime config edits** - critical because Track A is the highest priority surface.
3. **P1 finding triage** - critical because P1 cannot be silently deferred.
4. **Strict validation** - critical because completion claims require it.

**Total Critical Path**: completed in this dispatch.

**Parallel Opportunities**:
- Config syntax checks and review-report grep can run independently.
- 045 packet validation and focused Vitest can run independently.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M1: Config parity | Complete | Commit `2ad7f79fa` |
| M2: Bounded finding fixes | Complete | Commit `b74e0c95e` |
| M3: Packet close-out | Complete | Final docs and strict validation |
<!-- /ANCHOR:milestones -->
