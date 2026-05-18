---
title: "Implementation Plan: Remediate 052 Deep-Review Findings"
description: "Plan for closing the 052 mk-spec-memory rename review findings with command namespace corrections, packet metadata refresh, runtime config parity, and registry resolution."
trigger_phrases:
  - "053 remediation plan"
  - "052 review closure plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/053-mk-spec-memory-rename-remediation"
    last_updated_at: "2026-05-15T05:59:52Z"
    last_updated_by: "main_agent"
    recent_action: "Planned scoped remediation for 052 review findings"
    next_safe_action: "Verify namespace grep, strict validation, and scoped git status"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:12f20e1ee5fc493b37d1517e7a18e91c48ddda24f847eac7eebd518c13d41fe2"
      session_id: "main-2026-05-15-053-remediation-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Remediate 052 Deep-Review Findings

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command contracts, YAML manifest, JSON runtime config, spec packet docs |
| **Framework** | OpenCode command and Spec Kit packet conventions |
| **Storage** | No runtime data migration |
| **Testing** | Grep checks, JSON parse, strict spec validation |

### Overview

This remediation keeps the 052 rename intact and fixes the review fallout. The implementation is a scoped patch: move extracted tool references to `mk-code-index` or `mk-skill-advisor`, refresh stale 052 packet docs, align VS Code to the launcher, and resolve review registry entries.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 points to this 053 packet.
- [x] Allowed write paths are explicit.
- [x] Review finding list is known.

### Definition of Done
- [x] Namespace leak grep returns zero.
- [x] New namespace greps are non-zero.
- [x] `validate.sh --strict` passes for 052 and 053.
- [x] Commit is staged by explicit allowed paths only.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Targeted remediation over existing command/config/spec docs.

### Key Components
- **Command allowlists**: Frontmatter and route manifests determine which MCP tools commands may call.
- **Runtime config**: `.vscode/mcp.json` should use the launcher path for env/state/lock behavior.
- **Packet metadata**: `spec.md`, `plan.md`, `graph-metadata.json`, and `implementation-summary.md` drive resume and validation truth.
- **Review registry**: Tracks finding lifecycle and points resolution to this packet.

### Data Flow

Command markdown exposes tool allowlists, route YAML supplies target-specific MCP lists, runtime configs start MCP servers, and spec packet metadata feeds validation and resume context.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Namespace Corrections
- [x] `/doctor` code graph and CCC entries point to `mcp__mk_code_index__*`.
- [x] `/doctor` advisor entries point to `mcp__mk_skill_advisor__advisor_*`.
- [x] `/memory:manage ccc` entries point to `mcp__mk_code_index__ccc_*`.

### Phase 2: Packet Metadata
- [x] Rewrite 052 `plan.md` from scaffold to actual shipped plan.
- [x] Mark 052 spec and graph metadata complete.
- [x] Update resource-map counts and implementation-summary validation evidence.

### Phase 3: Verification and Commit
- [x] Mark registry findings resolved.
- [ ] Run strict validation and namespace grep checks.
- [ ] Commit scoped files on `main`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static grep | Namespace ownership regressions | `grep -E`, `grep -c` |
| JSON syntax | Runtime configs and graph metadata | `node -e` JSON parse |
| Spec validation | 052 and 053 packet docs | `validate.sh --strict` |
| Git scope | Allowed write set only | `git status --short` and explicit staging |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mk-code-index namespace | MCP server alias | Green | Code graph and CCC command calls fail if wrong |
| mk-skill-advisor namespace | MCP server alias | Green | Advisor command calls fail if wrong |
| Spec validator | Local script | Green | Completion cannot be claimed without passing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails due to packet docs or namespace corrections break command contracts.
- **Procedure**: Revert this remediation commit only. The original 052 rename remains isolated in its prior commit.
<!-- /ANCHOR:rollback -->
