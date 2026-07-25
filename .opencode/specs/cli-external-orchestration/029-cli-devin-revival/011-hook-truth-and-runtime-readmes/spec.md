---
title: "Feature Specification: Devin hook truth and runtime README parity"
description: "Reconcile current documentation with the corrected Devin hook registration schema and observed live behavior, align runtime mirror READMEs, restore Cursor mirror parity, and remove obsolete Zed MCP registrations that retain exposed credentials."
trigger_phrases:
  - "Devin hook truth"
  - "runtime hook README parity"
  - "Cursor hook mirror"
  - "Zed MCP cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes"
    last_updated_at: "2026-07-25T10:15:41Z"
    last_updated_by: "opencode"
    recent_action: "Reconciled hook truth, runtime mirrors, Cursor discovery and local Zed MCP settings"
    next_safe_action: "Rotate or revoke the removed credentials in the provider dashboards"
    blockers: []
    key_files: ["../hook-testing-results.md", ".devin/hooks.v1.json", ".claude/hooks/README.md", ".cursor/hooks/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-hook-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Provider-side credential rotation requires operator access to the affected services."]
    answered_questions: ["Use the current branch and preserve unrelated concurrent changes.", "Remove the obsolete Zed figma, web-to-mcp, and spec_kit_memory registrations.", "Correct the stale Zed code_mode path."]
---
# Feature Specification: Devin Hook Truth and Runtime README Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Devin hooks are live under `devin -p` when `.devin/hooks.v1.json` uses top-level event arrays with nested matcher groups. This phase removes current-state claims based on the superseded wrapper schema, preserves the failed experiments as historical evidence, aligns runtime hook documentation and removes obsolete external MCP registrations that retain exposed credentials.

**Key Decisions**: Treat observed live payloads and the current registration schema as authoritative. Preserve negative tests 1-9 as explicitly superseded history rather than deleting them.

**Critical Dependencies**: `.devin/hooks.v1.json`, the live evidence in `../hook-testing-results.md` and access by the operator to rotate provider-side credentials.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-25 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 11 of 11 |
| **Predecessor** | `../010-devin-feature-catalog/spec.md` (sequential neighbor only, not a dependency) |
| **Successor** | None |
| **Handoff Criteria** | Current docs describe live hooks, runtime READMEs validate, Cursor mirror parity is restored, obsolete Zed MCP registrations are absent and recursive strict validation passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The registration file was originally written with an unsupported wrapper shape. Negative tests against that shape were misinterpreted as proof that Devin ignored hooks under `-p`, and that false conclusion propagated through current spec docs and seven hook READMEs. Three runtime mirror READMEs also fail the repository README validator, Cursor lacks one expected discovery symlink and the user's Zed config retains obsolete MCP registrations with plaintext credentials and stale paths.

### Purpose

Make every current operational surface agree with the corrected schema and verified behavior without erasing the historical evidence that explains the earlier mistake.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Correct current-state hook claims in the parent packet, phases 004, 006, 008 and 010, the handover, the test record and the continuation prompt.
- Refresh seven Devin hook READMEs and the Claude, Codex and Cursor discovery-mirror READMEs from current filesystem and wiring evidence.
- Add the missing Cursor `mcp-route-guard.mjs` discovery symlink without repointing `.cursor/hooks.json`.
- Remove `figma`, `web-to-mcp` and `spec_kit_memory` from the user's Zed `context_servers`, then correct the `code_mode` path.
- Remove local plaintext copies of the exposed credentials and report provider-side rotation as an operator-only security action.
- Refresh generated metadata and run all phase, README, schema, mirror and configuration gates.

### Out of Scope

- Changing hook adapter behavior or `.devin/hooks.v1.json`, whose corrected schema already passes the current contract.
- Rewriting archived deprecation packets or deleting negative test evidence.
- Claiming `PermissionRequest`, `PostCompaction`, `run_subagent` or the deny branch has been observed when it has not.
- Modifying unrelated dirty files, committing or pushing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../spec.md`, `../handover.md`, `../hook-testing-results.md`, `../goal-prompt.md` | Modify | Reconcile parent current state and continuation guidance. |
| `../004-devin-hook-adapter-layer/*.md`, `../008-devin-hook-parity/*.md` | Modify | Supersede dormant conclusions while preserving dated evidence. |
| `../006-devin-manual-testing-playbook/spec.md`, `../010-devin-feature-catalog/{spec,checklist,decision-record}.md` | Modify | Replace planned dormant enums with observed and unobserved event states. |
| `.opencode/skills/**/hooks/devin/README.md` | Modify | Document live wiring and retain only real caveats. |
| `.claude/hooks/README.md`, `.codex/hooks/README.md`, `.cursor/hooks/README.md` | Modify | Add validator-conformant current-state orientation and inventories. |
| `.cursor/hooks/mcp-route-guard.mjs` | Create symlink | Restore discovery mirror parity. |
| `~/.config/zed/settings.json` | Modify | Remove obsolete MCP registrations and fix the Code Mode path. |
| `011-hook-truth-and-runtime-readmes/*` | Create/Modify | Record scope, decisions, tasks, evidence and completion state. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Current documentation must state that six of eight Devin lifecycle events fired under the corrected schema. | Current-state grep finds no unqualified packet-wide dormancy claim. Tests 1-9 remain labeled superseded. |
| REQ-002 | Runtime hook READMEs must describe only verified files, fields and behavior. | All eleven target READMEs pass `validate_document.py`; unobserved-event caveats remain explicit. |
| REQ-003 | Cursor discovery mirror must expose the approved MCP route guard without changing execution wiring. | The symlink resolves to the runtime hook and `.cursor/hooks.json` remains unchanged. |
| REQ-004 | Obsolete external MCP registrations and local credential copies must be removed from Zed. | The three server keys and their secret-bearing blocks are absent; `code_mode` points to `.opencode/skills/mcp-code-mode/mcp-server/dist/index.js`. |
| REQ-005 | Hook registration truth must remain intact. | The JSON has 8 events, 11 matcher groups, 19 command entries and no `version` or `hooks` wrapper. |
| REQ-006 | Packet and child metadata must agree after all edits. | Recursive strict validation reports 0 errors and 0 warnings. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Provider-side credentials exposed in Zed must be rotated or explicitly handed back to the operator. | Local values are gone and the final report identifies provider rotation as the only operator-only action if it cannot be verified locally. |
| REQ-008 | Concurrent work must remain untouched. | Final target diff contains only allowlisted paths and unrelated dirty state is preserved. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every current hook status distinguishes verified live events from events and branches that remain unobserved.
- **SC-002**: All eleven hook README targets pass the shared document validator.
- **SC-003**: Cursor has a resolving `mcp-route-guard.mjs` mirror symlink and no wiring file changed.
- **SC-004**: Zed no longer contains the three obsolete servers or plaintext credentials and retains a valid Code Mode registration.
- **SC-005**: The phase and parent pass recursive strict Spec Kit validation with zero errors and warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Corrected `.devin/hooks.v1.json` and captured live evidence | Documentation could repeat the original unsupported-schema inference. | Recount the registration and retain the observed-event matrix in every canonical summary. |
| Dependency | Provider dashboards | Local cleanup cannot prove remote credential revocation. | Remove local values immediately and name provider-side rotation as operator-only. |
| Risk | Broad documentation sweep | A historical negative test could be erased or a current claim left contradictory. | Preserve tests 1-9 under an explicit superseded heading and run focused status greps. |
| Risk | Dirty shared branch | Concurrent work could be overwritten. | Use an explicit target allowlist and inspect target status before and after each edit batch. |
| Risk | External JSONC edit | A malformed Zed file could break startup. | Make the smallest block removal and validate with a JSONC-capable parser or Zed tooling. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Hook runtime behavior and command count remain unchanged.

### Security

- **NFR-S01**: No credential value may be copied into repository docs, patches or final output.

### Reliability

- **NFR-R01**: Documentation must remain accurate if an event has not yet occurred; absence of an observation is not reported as failure.

---

## 8. EDGE CASES

### Evidence Boundaries

- `PermissionRequest` and `PostCompaction` did not occur in the verified session, so their registration is confirmed but live behavior remains unobserved.
- `run_subagent` and the dispatch deny branch remain structurally tested but not observed end to end.
- True interactive mode remains outside the available headless test environment.

### Configuration Boundaries

- Removing disabled Zed registrations still matters because their credential values remain readable at rest.
- The external Zed file is outside git, so rollback depends on the captured pre-edit content rather than `git revert`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Cross-runtime documentation, packet history, symlink and external config. |
| Risk | 19/25 | Exposed credentials, external config and contradictory operational claims. |
| Research | 14/20 | Live evidence and current filesystem inventory already exist. |
| Multi-Agent | 8/15 | One executor, but concurrent shared-worktree activity is present. |
| Coordination | 12/15 | Parent plus four child phases and generated metadata must agree. |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Current docs retain false packet-wide dormancy | H | H | Focused grep and source-by-source correction. |
| R-002 | Credential remains valid after local removal | H | M | Operator rotates or revokes it at the provider. |
| R-003 | Concurrent session changes an allowlisted target | H | M | Re-read target diff immediately before each patch. |
| R-004 | Metadata fingerprints become stale | M | H | Regenerate description and graph metadata after content settles. |

---

## 11. USER STORIES

### US-001: Trust Hook Documentation (Priority: P0)

**As a** maintainer, **I want** current hook docs to match the corrected registration and observed payloads, **so that** I do not disable or redesign working safeguards based on a false conclusion.

**Acceptance Criteria**:
1. Given a current hook README or phase summary, when it describes Devin behavior, then it says which events fired and which remain unobserved.

---

### US-002: Remove Obsolete Secret-Bearing Registrations (Priority: P0)

**As an** operator, **I want** obsolete Zed MCP registrations removed, **so that** disabled integrations no longer retain exposed credentials or stale paths.

**Acceptance Criteria**:
1. Given the updated Zed settings, when `context_servers` is inspected, then only the approved sequential-thinking and Code Mode entries remain.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Provider-side rotation cannot be verified from the repository. The operator must revoke and replace the exposed credentials in the affected provider dashboards.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Specification**: See `../spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Canonical Hook Evidence**: See `../hook-testing-results.md`
