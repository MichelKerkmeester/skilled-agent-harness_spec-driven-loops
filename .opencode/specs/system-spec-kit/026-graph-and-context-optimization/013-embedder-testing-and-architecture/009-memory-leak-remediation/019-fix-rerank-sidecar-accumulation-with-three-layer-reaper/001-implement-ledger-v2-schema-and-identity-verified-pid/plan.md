---
title: "Plan: Ledger v2 Schema and Identity-Verified PID Helpers"
description: "Canonical Level 2 plan for implementing rerank-sidecar ledger v2 owner identities and identity-verified liveness."
trigger_phrases:
  - "arc 010 005 001 plan"
  - "ledger v2 identity pid plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid"
    last_updated_at: "2026-05-23T11:30:00Z"
    last_updated_by: "codex"
    recent_action: "completed-ledger-v2-plan"
    next_safe_action: "Parent agent commit handoff"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100050010100050010100050010100050010100050010100050010100050010"
      session_id: "010-005-001-ledger-v2-identity-pid"
      parent_session_id: null
    completion_pct: 100
---

# Plan: Ledger v2 Schema and Identity-Verified PID Helpers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python, pytest, JSON fixtures |
| **Binding ADRs** | Arc 010/004/001 ADR-002, ADR-003, ADR-005 |
| **Primary Surface** | `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` |

This phase implements the foundation layer for the rerank-sidecar reaper: v2 owner identity rows, identity-verified process liveness, locked owner mutation helpers, and shared fixture cases for Python and later JS parity tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec folder path pre-approved by user prompt.
- [x] Binding predecessor ADRs and Files-to-Change contract identified.
- [x] Scope locked to `sidecar_ledger.py`, `test_sidecar_ledger.py`, shared fixture JSON, and this packet docs.

### Definition of Done

- [x] Scaffold validates with strict exit 0 before source edits.
- [x] v2 ledger schema writes and v1 compatibility are test-covered.
- [x] Identity liveness reasons are test-covered.
- [x] Owner prune/register helpers are lock-backed and test-covered.
- [x] Targeted pytest and final strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced

- Ledger payload writes follow ADR-003: `{"version": 2, "sidecars": [...]}`.
- Each v2 sidecar row can include owner identity records with PID, create timestamp, command, registration time, last-seen time, source, and owner id.
- Readers accept legacy array payloads and version 1 payloads.
- `process_liveness` validates PID identity with `kill(pid, 0)` plus `ps -p PID -o lstart= -o comm=`.
- Unknown liveness states fail open as alive with `reason: "unknown"`.
- Owner mutation helpers hold `fcntl.flock(LOCK_EX)` while reading, pruning/registering, and writing.

### Affected Surfaces

| Surface | Invariant |
|---------|-----------|
| `sidecar_ledger.py` schema | Preserve current row fields and add owner/reaper fields without breaking v1 reads. |
| `sidecar_ledger.py` liveness | Return structured reasons required by ADR-002 and fixtures. |
| `test_sidecar_ledger.py` | Mock `os.kill` and `subprocess.run` instead of relying on live process control. |
| `reaper-ledger-cases.json` | Keep fixture names and expected reasons language-neutral. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read predecessor ADRs, implementation handoff, research sections, F69/F102 precedent, current ledger source/tests, sibling canonical anchors, and attempt the required macOS `ps` command.

### Phase 2: Core Implementation

Add owner identity dataclasses/helpers, v2 serialization, v1 read compatibility, identity liveness, owner prune/register helpers, shared fixture JSON, and pytest coverage with the requested test class structure.

### Phase 3: Verification

Run targeted pytest, update checklist and implementation-summary with file:line evidence, run strict packet validation, and report commit handoff without committing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Required Test |
|-------------|---------------|
| Ledger v2 schema | Atomic write emits `version: 2`, `sidecars`, owner identity fields, and reaper policy. |
| Identity parser | Parse exact ADR-shaped `ps` output into create timestamp and command. |
| Liveness reasons | Cover `pid-1-orphaned`, `kill-0-eperm`, `kill-0-esrch`, `pid-recycled`, `ok`, and `unknown`. |
| Owner pruning/registering | Prune dead owners, drop empty-owner rows, and idempotently register current owner under lock. |
| v1 compatibility | Missing version and version 1 rows read without error and write back as v2 on mutation. |
| Fixture matrix | Parameterize over `reaper-ledger-cases.json` and assert expected liveness plus reap decision. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Arc 010/004/001 ADRs | Architecture contract | Available | Defines liveness/schema/parity requirements. |
| F69/F102 precedent | Implementation precedent | Available | Defines file-locking and structured liveness parity expectations. |
| macOS `ps` command | Runtime identity source | Sandbox-blocked in this session | Parser uses ADR format and tests mock command output. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If targeted pytest or strict validation fails after implementation, revert only this packet's source/test/fixture/doc hunks and leave unrelated dirty worktree files untouched. Later launcher/app reaper phases remain blocked until this foundation packet is corrected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | Predecessor docs and current ledger source | Phase 2 implementation |
| Phase 2: Core Implementation | Valid scaffold and confirmed scope | Phase 3 verification |
| Phase 3: Verification | Successful code/test edits | Parent commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Ledger schema/liveness | Medium | Adds dataclasses, parsing, serialization, and compatibility paths. |
| Tests and fixtures | Medium | Fixture matrix must remain cross-runtime friendly. |
| Documentation and validation | Small | Level 2 docs plus evidence handoff. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Record failed verification output in `implementation-summary.md` if any required command fails. Do not modify launcher, app, shell, docs, or JS surfaces from later phases while repairing this packet.
<!-- /ANCHOR:enhanced-rollback -->
