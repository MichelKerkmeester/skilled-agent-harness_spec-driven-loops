---
title: "Feature Specification: sk-doc playbook markdown-agent coverage"
description: "Add a 06--agent-dispatch section to the sk-doc manual testing playbook with three scenarios that dispatch the @markdown agent across cli-claude-code, cli-codex, and cli-opencode."
trigger_phrases:
  - "sk-doc playbook markdown agent"
  - "markdown agent dispatch coverage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 spec for sk-doc playbook markdown-agent coverage"
    next_safe_action: "Author scenario files SD-018, SD-019, SD-020 and execute them"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-004-sk-doc-playbook-markdown-agent-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-doc playbook markdown-agent coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-markdown-agent-rename |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 introduced the `@markdown` agent as the dedicated sk-doc documentation executor, but the sk-doc manual testing playbook was not updated. The playbook has zero scenarios that dispatch `@markdown` as an executor. Its preamble even claims "Each of the 3 CLI runtimes (cli-codex, cli-opencode)" — admitting an unfilled third-CLI slot. The dedicated documentation executor is therefore untested by the very playbook that owns sk-doc routing validation.

### Purpose
Close the gap: add a new `06--agent-dispatch/` section with three scenarios that actually dispatch the `@markdown` agent for `/create:changelog` across cli-claude-code, cli-codex, and cli-opencode; fix the playbook preamble to list the third CLI; execute the scenarios and persist evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add new playbook section `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/` with three scenario files (SD-018, SD-019, SD-020).
- Update `.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` index, preamble, Categories table, and Scenario Index.
- Execute each of the three scenarios sequentially (no parallel dispatch per CLI-dispatch reliability constraint).
- Capture evidence (prompt, transcript, intent, resources, latency, verdict) per playbook §Pass/Fail Grading.
- Persist evidence under `.opencode/specs/.../004-.../evidence/`.

### Out of Scope
- Scenarios for cli-copilot and cli-gemini (limited to the 3-CLI preamble intent per user decision).
- Refactoring existing scenarios 1-5 (`01--intent-detection/` through `05--token-cost-baseline/`).
- Modifying the `@markdown` agent itself, sk-doc SKILL.md routing logic, or the `/create:*` command surfaces.
- Re-running 003's existing 4-iteration deep-review.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/` | Create dir | New section folder. |
| `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/001-markdown-agent-cli-claude-code.md` | Create | SD-018 scenario. |
| `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/002-markdown-agent-cli-codex.md` | Create | SD-019 scenario. |
| `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/003-markdown-agent-cli-opencode.md` | Create | SD-020 scenario. |
| `.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` | Modify | Preamble fix + Categories table + Scenario Index + Global Preconditions note. |
| `.opencode/specs/.../004-.../evidence/SD-018-cli-claude-code.txt` | Create | Evidence transcript for SD-018. |
| `.opencode/specs/.../004-.../evidence/SD-019-cli-codex.txt` | Create | Evidence transcript for SD-019. |
| `.opencode/specs/.../004-.../evidence/SD-020-cli-opencode.txt` | Create | Evidence transcript for SD-020. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create three scenario files under `06--agent-dispatch/`. | `find .../06--agent-dispatch -name "*.md"` returns 3 files. |
| REQ-002 | Each scenario dispatches `@markdown` via its named CLI for the same comparable task. | YAML frontmatter has `execution_mode: dispatch_real` and Setup block uses the real CLI invocation, not the routing-trace `DO NOT execute` block. |
| REQ-003 | Fix the playbook preamble line that claims 3 CLI runtimes but lists 2. | Line currently reading `(cli-codex, cli-opencode)` updated to `(cli-codex, cli-opencode, cli-claude-code)`. |
| REQ-004 | Execute all three scenarios and capture evidence. | Three evidence files exist; each contains a PASS/PARTIAL/FAIL/SKIP verdict. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Register new section in the playbook index: Categories table + Scenario Index. | `grep -c "06--agent-dispatch" manual_testing_playbook.md` returns ≥ 2. |
| REQ-006 | Note in Global Preconditions that section 6 scenarios execute real work. | Note added below precondition 5. |
| REQ-007 | Populate `implementation-summary.md` with the cross-CLI results table after Stage D completes. | Table has 3 rows (SD-018/019/020) with verdict + key evidence-file path each. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Section `06--agent-dispatch/` exists with three scenarios; playbook index references all three.
- **SC-002**: Each scenario was executed via its named CLI and produced a verdict with reproducible evidence.
- **SC-003**: Preamble inconsistency is resolved (third CLI listed).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | DeepSeek tool-name regex rejects MCP names with `:` or `@` | cli-opencode dispatch may 400 against opencode skills index | Use `--pure` flag; pre-check vendored `node_modules/**/SKILL.md` paths. |
| Risk | CLI dispatch parallelism is unreliable (memory) | Concurrent runs silently fail or partially revert | Run the 3 scenarios sequentially, not in parallel. |
| Risk | Codex sandbox blocks sub-process network calls | sk-doc / `@markdown` could fail if embeddings or remote tools fire | Pass `-c sandbox_workspace_write.network_access=true` to `codex exec`. |
| Risk | `opencode run` hangs on stdin when stdout is redirected | Background dispatch silently stalls | Always append `</dev/null` to `opencode run` invocations. |
| Dependency | `@markdown` agent + `/create:*` command family must already be wired | Scenarios will fail with the agent unrouted | Verified shipped by 003-markdown-agent-rename + commit `ca2d9e094`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each scenario completes within 5 minutes of dispatch time (CLI cold-start + scaffold).
- **NFR-P02**: Evidence files stay under 50 KB each (transcript truncation if needed).

### Security
- **NFR-S01**: No secrets, tokens, or API keys persisted into evidence files.
- **NFR-S02**: Stub skill `sk-test-dummy` lives only in `evidence/` or `scratch/`, never under `.opencode/skills/` proper.

### Reliability
- **NFR-R01**: Each evidence file is reproducible by re-running its scenario's Setup block.
- **NFR-R02**: Verdicts use the existing playbook §Pass/Fail Grading rubric — no bespoke grading scheme.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing CLI binary: scenario records SKIP with the missing-binary blocker.
- Provider auth missing (e.g. `opencode providers list` lacks DeepSeek): scenario records SKIP with the auth blocker.
- `@markdown` agent not routed by a CLI's runtime: scenario records FAIL with routing-trace evidence.

### Error Scenarios
- Network refusal under codex sandbox: re-run with `-c sandbox_workspace_write.network_access=true`.
- DeepSeek 400 on tool-name regex: re-run with `--pure`.
- opencode hang on stdin: re-run with `</dev/null`.

### State Transitions
- Draft to active: scenario authoring complete, ready for execution.
- Active to complete: all three verdicts recorded with evidence-file pointers.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 3 scenario files + 1 index update + 3 evidence files. |
| Risk | 14/25 | CLI dispatch reliability + DeepSeek tool-name + sandbox network. |
| Research | 6/20 | Patterns established; just need execution + capture. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking planning.
<!-- /ANCHOR:questions -->
