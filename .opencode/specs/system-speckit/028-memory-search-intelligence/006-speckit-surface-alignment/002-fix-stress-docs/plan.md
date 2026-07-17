---
title: "Implementation Plan: Fix Stress Docs"
description: "Documentation-only remediation plan for five confirmed stress-test doc findings across catalog, playbook, and stress_test README surfaces."
trigger_phrases:
  - "stress docs implementation plan"
  - "stress harness doc repair plan"
  - "substrate cleanup documentation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/006-speckit-surface-alignment/002-fix-stress-docs"
    last_updated_at: "2026-07-05T09:52:31Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Patched stress docs"
    next_safe_action: "No further action"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stress-docs-fix-2026-07-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Spec folder was pre-approved by the user."
---
<!-- SPECKIT_TEMPLATE_SOURCE: level_1/plan.md | v2.2 -->
# Implementation Plan: Fix Stress Docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation for OpenCode system-spec-kit |
| **Framework** | system-spec-kit docs, sk-doc validation, Vitest stress harness references |
| **Storage** | None |
| **Testing** | `validate.sh --strict`, grep/read verification, targeted markdown validation where practical |

### Overview
This plan applies the smallest documentation-only edits that make the stress-test docs match the shipped harness. It uses real file discovery and source reads as the baseline, patches only the allowed docs, then records before/after evidence in this packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Audit report read and five stress findings identified.
- [x] Edit scope confirmed from user instruction.
- [x] Current system-spec-kit version verified as `3.7.1.0`.

### Definition of Done
- [x] All five findings repaired in scoped docs.
- [x] Spec docs record per-finding before/after.
- [x] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation alignment against source-of-truth files.

### Key Components
- **Catalog/playbook docs**: Operator entry points that now cross-reference automated stress evidence.
- **stress_test READMEs**: Domain-local inventories and behavior contracts for the opt-in Vitest harness.
- **Spec packet**: Implementation record and validation target for this documentation repair.

### Data Flow
Audit finding -> read real files/scripts -> patch scoped markdown -> run grep/read verification -> run strict spec validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `feature_catalog/stress-testing/category-overview.md` | Catalog inventory for stress testing. | Add automated harness awareness. | Compare to `mcp_server/stress_test/**` and `mcp_server/package.json`. |
| `manual_testing_playbook/stress-testing/` | Manual operator stress cycle. | Add harness cross-reference without replacing manual flow. | Read README and run-stress-cycle after patch. |
| `mcp_server/stress_test/**/README.md` | Automated harness domain docs. | Align file inventories and cleanup contract. | Glob real files and grep cleanup source/tests. |
| `SKILL.md` and changelog | Confirmed current by audit. | No action. | User explicitly forbade touching them. |

Required inventories:
- Same-class docs were identified by globbing `mcp_server/stress_test/**/*.md` and the in-scope stress-testing docs.
- Script command surface was verified in `.opencode/skills/system-spec-kit/mcp_server/package.json`.
- Substrate cleanup behavior was verified in `run-substrate-stress-harness.mjs` and `substrate-runner-harness.vitest.ts`.
- Algorithm invariant: documentation must describe current shipped files and commands, not planned or phantom artifacts.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create Level 1 spec packet from system-spec-kit scaffold.
- [x] Read audit report and target docs before edits.
- [x] Verify real stress_test files, package scripts, and current version.

### Phase 2: Implementation
- [x] Patch catalog/playbook automated harness references and version stamps.
- [x] Patch top-level and domain README inventories.
- [x] Patch substrate cleanup documentation.

### Phase 3: Verification
- [x] Run grep/read checks for each finding.
- [x] Run targeted markdown validation where practical.
- [x] Run `validate.sh --strict` on this spec folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source verification | Real stress files and npm scripts | Glob, Read, Grep |
| Markdown validation | Changed README/catalog/playbook docs | `validate_document.py` |
| Spec validation | New packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp_server/stress_test/**` | Internal docs/tests | Green | Required to verify file inventories. |
| `mcp_server/package.json` | Internal config | Green | Required to verify npm stress scripts. |
| system-spec-kit validation scripts | Internal tooling | Green | Required before completion claim. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation exposes a doc contract failure caused by this packet or user rejects the wording.
- **Procedure**: Revert only this packet's scoped markdown edits and spec folder files; do not touch unrelated worktree changes.
<!-- /ANCHOR:rollback -->
