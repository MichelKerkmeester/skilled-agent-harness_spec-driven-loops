---
title: "Feature Specification: Phase 005 Cross-CLI Playbook Execution Harness"
description: "Phase 005 adds a read-only cross-CLI harness for auditing sk-code routing decisions against Packet 069 manual playbook scenarios. It authors seven cross-stack routing scenarios, updates the root playbook index, and creates deterministic runner scripts without executing the full matrix."
trigger_phrases:
  - "phase 005 cross cli execution"
  - "cross-cli playbook harness"
  - "packet 069 routing audit"
  - "sk-code cross-stack routing scenarios"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/005-playbook-cross-cli-execution"
    last_updated_at: "2026-05-05T10:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored harness and captured sandbox-blocked Codex smoke test"
    next_safe_action: "Rerun run_codex.sh SD-001 in a network-enabled shell"
    blockers:
      - "Nested Codex cannot connect to wss://api.openai.com/v1/responses from this sandbox."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "prompts/universal_test_prompt.md"
      - "scripts/run_matrix.sh"
      - "../../../.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Will the required Codex smoke test pass in a network-enabled execution environment?"
    answered_questions:
      - "Gate 3 was pre-approved by user dispatch for this phase folder."
      - "The full cross-CLI matrix is out of scope for this dispatch; only one codex smoke test is required."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 005 Cross-CLI Playbook Execution Harness

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Blocked |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Packet** | `005-playbook-cross-cli-execution` |
| **Parent Packet** | `specs/sk-code/z_archive/007-sk-code-motion-dev-and-playbook` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 069 now has Motion.dev peer references and manual playbook coverage, but it lacks a repeatable way to ask multiple AI runtimes how they would route the same sk-code scenarios. Without a deterministic prompt and runner harness, cross-CLI routing audits depend on ad hoc transcripts and cannot reliably catch misroutes across Codex, Copilot, Gemini, and OpenCode.

### Purpose
Create a read-only execution harness plus seven cross-stack routing scenarios so Phase D aggregation can compare runtime routing decisions against the sk-code smart-router contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author Level 2 Phase 005 spec artifacts and canonical metadata files.
- Add seven `CS-*` cross-stack routing scenario files under the sk-code manual testing playbook.
- Update the root sk-code playbook counts, table of contents, Section 13, automated-test notes, feature cross-reference table, and footer totals.
- Add one universal YAML prompt template and five shell runner scripts for cross-CLI read-only dispatch.
- Smoke-test one scenario through `run_codex.sh` only.

### Out of Scope
- Running the full cross-CLI matrix.
- Assigning final verdicts for scenario results beyond the initial `pending` runner output.
- Modifying sk-code router implementation, Motion.dev references, or existing MR/CB scenario behavior.
- Editing files outside the user-approved scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `005-playbook-cross-cli-execution/*.md` | Create | Level 2 planning artifacts and implementation summary |
| `005-playbook-cross-cli-execution/*.json` | Create | Canonical description and graph metadata |
| `005-playbook-cross-cli-execution/prompts/universal_test_prompt.md` | Create | Cross-runtime read-only routing analysis prompt |
| `005-playbook-cross-cli-execution/scripts/*.sh` | Create | CLI runners and matrix orchestrator |
| `.opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/*.md` | Create | Seven CS scenario contracts |
| `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md` | Modify | Root playbook index, counts, Section 13, and cross-references |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Seven CS scenario files are sk-doc compliant | Each file has frontmatter plus sections `## 1. OVERVIEW` through `## 5. SOURCE METADATA` and binary pass/fail criteria |
| REQ-002 | Universal prompt is deterministic YAML-only | `universal_test_prompt.md` instructs runtimes to analyze routing only and emit the required YAML shape |
| REQ-003 | Every runner dispatch is read-only sandboxed | Scripts include no project write action beyond transcript/result capture and use read-only/no-agent language in prompts |
| REQ-004 | Final verdict cannot tolerate critical-path misroutes | Checklist and playbook release rules make CS-001, CS-002, and CS-003 critical-path scenarios |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Root playbook reflects 24 scenarios across 7 categories | Overview, TOC, category list, automated-test notes, feature table, and footer totals agree |
| REQ-006 | Runner scripts persist structured result YAML | Each runner writes `/tmp/skc-<ID>-<cli>.txt` and `results/<ID>-<cli>.yaml` with pending verdict |
| REQ-007 | Matrix driver handles CLI lists and concurrency cap | `run_matrix.sh` reads `SCENARIO_ID,USER_PROMPT,CLI_LIST` CSV rows and caps concurrent jobs at 5 |
| REQ-008 | Spec metadata is canonical enough for graph traversal | `description.json` and `graph-metadata.json` include packet id, parent id, status, trigger phrases, and source docs |

### P2 - Polish

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Scenario contracts paste detection markers verbatim where applicable | WEBFLOW/OPENCODE/UNKNOWN scenarios include the marker lines from `references/router/code_surface_detection.md` |
| REQ-010 | Runner output is easy to inspect | Each result includes model, duration, token placeholders, top advisor skill, surface, loaded refs, agent, excerpt, and pending verdict |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 005 strict spec validation exits 0.
- **SC-002**: Parent Packet 069 recursive strict validation exits 0.
- **SC-003**: Seven CS scenario files exist with IDs CS-001 through CS-007.
- **SC-004**: All five runner scripts are executable.
- **SC-005**: `run_codex.sh SD-001 "<prompt>"` produces both `/tmp/skc-SD-001-codex.txt` and `results/SD-001-codex.yaml`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | CLI binaries | Smoke test can fail if `codex` is unavailable or rejects nested execution | Report exact failure and keep scripts executable for operator rerun |
| Risk | YAML parsing drift | Runtime may wrap YAML in prose or code fences | Runner strips fences best-effort and stores raw transcript for audit |
| Risk | Token footer differences | CLIs do not share token-count footer formats | Store `null` when counts are not surfaced rather than fabricating values |
| Risk | Root playbook section numbering | Manual renumbering can break anchors | Validate by grepping TOC and section headings after patch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Scripts must be POSIX-friendly Bash with `set -euo pipefail`.
- Runner writes must stay inside `/tmp` and the Phase 005 `results/` directory.
- Scenario prose must be deterministic, operator-facing, and sk-doc compliant.
- Harness dispatches must be read-only routing analysis, not implementation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A CLI can return valid YAML inside a fenced block; the runner should normalize it before storing the structured YAML result.
- A CLI can fail before producing YAML; the runner should still write a pending result with a response excerpt and raw transcript path.
- Scenario prompts that mention Motion.dev without Webflow markers should not be promoted to WEBFLOW surface.
- OPENCODE target paths that mention Motion.dev preview code must keep OPENCODE precedence and load Motion.dev only as supplementary context.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ESTIMATION

| Dimension | Estimate | Rationale |
|-----------|----------|-----------|
| Files touched | Medium | Multiple docs plus five scripts, but no production runtime logic |
| Behavioral risk | Medium | Runner scripts execute external CLIs and parse loosely structured output |
| Documentation risk | Medium | Root playbook counts and cross-reference tables must stay synchronized |
| Verification complexity | Medium | Requires spec validation, chmod checks, file existence checks, and one nested CLI smoke test |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for setup. Phase D aggregation will decide final verdict scoring after real cross-CLI results exist.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Implementation Plan**: `plan.md`
- **Task Ledger**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Universal Prompt**: `prompts/universal_test_prompt.md`
- **Root Playbook**: `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md`
<!-- /ANCHOR:related-docs -->
