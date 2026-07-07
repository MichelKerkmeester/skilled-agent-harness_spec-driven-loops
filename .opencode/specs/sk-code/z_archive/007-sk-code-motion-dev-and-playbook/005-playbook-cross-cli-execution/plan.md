---
title: "Implementation Plan: Phase 005 Cross-CLI Playbook Execution Harness"
description: "Execution plan for adding cross-stack scenario coverage and a read-only cross-CLI routing harness for Packet 069."
trigger_phrases:
  - "phase 005 plan"
  - "cross-cli harness plan"
  - "packet 069 routing audit plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/005-playbook-cross-cli-execution"
    last_updated_at: "2026-05-05T10:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Planned Phase 005 harness setup"
    next_safe_action: "Author scenarios, prompt, scripts, and root playbook update"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Phase 005 Cross-CLI Playbook Execution Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OPENCODE docs/scripts plus sk-code manual playbook |
| **Primary Skills** | `sk-doc`, `sk-code`, `system-spec-kit` |
| **Runtime Harness** | Bash scripts dispatching Codex, Copilot, Gemini, and OpenCode |
| **Verification** | strict spec validation, executable-bit check, file existence check, one Codex smoke test |

### Overview
Build the cross-stack routing audit package in three passes: author deterministic scenario contracts, update the root playbook index and counts, then add a universal prompt plus runner scripts. The harness analyzes routing decisions only; it does not allow the tested runtime to modify files or dispatch agents.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 005 spec folder was pre-approved by user dispatch.
- [x] Existing playbook examples and router references were read.
- [x] Write scope is limited to Phase 005 artifacts, the new CS playbook folder, and root playbook index updates.

### Definition of Done

- [ ] Seven CS scenario files exist and follow the sk-doc snippet shape.
- [ ] Root playbook counts and cross-reference tables agree.
- [ ] Runner scripts are executable and write structured YAML results.
- [ ] Phase and parent strict validation exit 0.
- [ ] One `run_codex.sh` smoke test produces raw and structured outputs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only routing analysis harness with one shared prompt template and thin per-CLI adapters.

### Key Components

- **Scenario contracts**: `CS-001..CS-007` define expected surface, reference loads, assets, agent dispatch, binary grading, and triage.
- **Universal prompt**: one YAML-only contract substituted with scenario id and user prompt.
- **Runner scripts**: CLI-specific wrappers collect wall-clock duration, raw transcript, best-effort token counts, YAML extraction, and pending verdict output.
- **Matrix driver**: CSV-driven orchestrator that applies a concurrency cap of 5 and delegates to runner scripts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Planning Artifacts

- Create Level 2 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`.

### Phase 2: Playbook Coverage

- Add `07--cross-stack-routing/` with CS-001 through CS-007.
- Update root playbook TOC, overview count, canonical package artifact list, Section 13, automated-test notes, feature cross-reference table, and footer totals.

### Phase 3: Harness Scripts

- Add `prompts/universal_test_prompt.md`.
- Add `run_codex.sh`, `run_copilot.sh`, `run_gemini.sh`, `run_opencode.sh`, and `run_matrix.sh`.
- Set executable bits.

### Phase 4: Verification

- Run Phase 005 strict validation.
- Run parent Packet 069 strict validation.
- Confirm seven scenario files and five executable scripts exist.
- Run the required Codex smoke test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Spec validation | Phase 005 docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-code/z_archive/007-sk-code-motion-dev-and-playbook/005-playbook-cross-cli-execution --strict` |
| Parent validation | Packet 069 phase parent | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-code/z_archive/007-sk-code-motion-dev-and-playbook --strict` |
| File existence | New CS scenarios | `ls .opencode/skills/sk-code/manual_testing_playbook/07--cross-stack-routing/` |
| Executable bits | Runner scripts | `ls -la specs/.../005-playbook-cross-cli-execution/scripts/` |
| Smoke test | Codex runner | `bash .../scripts/run_codex.sh SD-001 "<prompt>"` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `codex` CLI | External/runtime | Available on PATH at session start | Required for smoke test |
| `copilot`, `gemini`, `opencode` CLIs | External/runtime | Available on PATH at session start | Required later for full matrix, not this dispatch |
| Spec validator | Internal | Available | Required before completion claim |
| sk-code router docs | Internal | Read | Source for scenario expected markers and resource paths |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Remove the Phase 005 folder if spec validation fails before adoption.
- Remove `07--cross-stack-routing/` if scenario contracts prove structurally invalid.
- Revert only the root playbook edits if counts or section numbering are wrong.
- Keep raw smoke-test transcripts in `/tmp`; they are disposable and do not require repository rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
planning docs -> scenario files -> root playbook update -> runner scripts -> validation + smoke test
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Planning artifacts | Existing Packet 069 context | All later validation |
| Scenario files | Router and playbook exemplars | Root playbook Section 13 |
| Harness scripts | Universal prompt template | Smoke test |
| Verification | All authored files | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Planning artifacts | Low | 30 minutes |
| Scenario files | Medium | 75 minutes |
| Root playbook update | Medium | 30 minutes |
| Scripts and verification | Medium | 60 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist

- [x] Target files read before edits.
- [x] Existing unrelated dirty files identified and ignored.
- [ ] Validation evidence recorded after all edits.

### Data Reversal

- No database, memory index, or production runtime data is modified.
<!-- /ANCHOR:enhanced-rollback -->
