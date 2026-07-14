---
title: "Feature Specification: Command-layer Gemini cleanup"
description: "Remove orphaned cli-gemini executor branches and stray Gemini surface references across the whole command layer (5 YAML assets + 4 command docs) so no command workflow dispatches a deleted skill or advertises an unsupported Gemini surface."
trigger_phrases:
  - "command yaml gemini cleanup"
  - "cli-gemini executor branch removal"
  - "gemini surface reference cleanup"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/002-command-yaml-gemini-cleanup"
    last_updated_at: "2026-06-08T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed command-layer cleanup (5 YAML + 4 command docs)"
    next_safe_action: "None; phase complete, orchestrator validates centrally"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
      - ".opencode/commands/deep/start-research-loop.md"
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/commands/deep/start-model-benchmark-loop.md"
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
    session_dedup:
      fingerprint: "sha256:f7db64454e905a8f6eb18b181b6dfb8ec5319a92d3d3d197fb97daba610df28e"
      session_id: "command-yaml-gemini-cleanup-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope is the whole command layer: 5 YAML assets plus 4 command docs."
      - "Remove orphaned cli-gemini executor branches and stray Gemini surface references across command YAML and command docs."
      - "Leave deep-loop-runtime executor-config.ts resolveGeminiSandboxMode as dead-but-harmless code."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Command-layer Gemini cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation` |
| **Predecessor** | `001-runtime-surface-and-skill-deletion` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase `001-runtime-surface-and-skill-deletion` deleted the `cli-gemini` skill and the project `.gemini/` runtime surface, but it left orphaned `cli-gemini` executor branches and stray "Gemini" surface references across the whole command layer: both the command-layer YAML assets and the command `.md` docs that drive them. The deep research/review loop assets still carried an `if_cli_gemini:` executor branch that imports `resolveGeminiSandboxMode` and dispatches the `gemini` binary as a `cli-gemini` executor, the cli-opencode/cli-devin self-invocation guard surface lists still named `Gemini`, and `doctor_mcp_install.yaml` still advertised `gemini` in its runtime `valid_values`. In parallel, four deep command docs still listed `cli-gemini` in their executor option lists, carried gemini example commands, and one had a stale ASCII box and Q-Exec option lettering that assumed `cli-gemini` was still present.

### Purpose

Remove the orphaned executor branches and stray Gemini surface references across the entire command layer (5 YAML assets and 4 command docs) so no command workflow dispatches a deleted skill or advertises an unsupported Gemini surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the `if_cli_gemini:` executor branch from the four deep research/review loop YAML assets.
- Strip `Gemini/` from the cli-opencode and cli-devin self-invocation guard surface lists in those four YAMLs.
- Remove `gemini` from the runtime `valid_values` list in `doctor_mcp_install.yaml`.
- Remove `cli-gemini` from the executor option lists in the four deep command docs.
- Re-letter the Q-Exec option choices in the command docs after dropping the `cli-gemini` option.
- Fix the stale ASCII box that assumed `cli-gemini` was still an executor option.
- Remove gemini example commands from the command docs.

### Out of Scope
- The `deep-loop-runtime` skill lib (`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`, `resolveGeminiSandboxMode`) - may remain as dead-but-harmless code; not a command-layer surface.
- Historical specs under `specs/**` and `.opencode/specs/**` - preserved as historical records.
- User-home Gemini CLI state `~/.gemini` - operator-local, not a project surface.
- `.geminiignore` - a Gemini CLI ignore file, not the deleted project runtime directory.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modify | Remove `if_cli_gemini:` executor branch; strip `Gemini/` from cli-opencode/cli-devin self-invocation guard surface lists. |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Modify | Same as above. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Same as above. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Same as above. |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Modify | Remove `gemini` from the runtime `valid_values` list. |
| `.opencode/commands/deep/start-research-loop.md` | Modify | Remove `cli-gemini` from executor lists; re-letter Q-Exec options; fix ASCII box; remove gemini example commands. |
| `.opencode/commands/deep/start-review-loop.md` | Modify | Same as above. |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modify | Same as above. |
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modify | Same as above. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The whole command layer carries no Gemini references. | `grep -rniE "gemini" .opencode/commands` returns ZERO matches (exit 1). |
| REQ-002 | All five edited YAMLs remain valid YAML. | Each of the five edited files parses as valid YAML with no parse errors. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No executor enum/whitelist in any command YAML lists `cli-gemini`. | Targeted search across command YAMLs returns no executor enum/whitelist entry naming `cli-gemini` (verified: none did). |
| REQ-004 | The four deep command docs list only supported executors. | No command `.md` doc lists `cli-gemini` as an executor option, Q-Exec option lettering is contiguous, the ASCII box has no `cli-gemini` row, and no gemini example commands remain. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A case-insensitive `gemini` search across the whole `.opencode/commands` tree returns zero matches.
- **SC-002**: The four deep YAMLs no longer contain an `if_cli_gemini:` executor branch and the cli-opencode/cli-devin self-invocation guard surface lists no longer name `Gemini`.
- **SC-003**: `doctor_mcp_install.yaml` runtime `valid_values` no longer lists `gemini`.
- **SC-004**: All five edited YAMLs still parse as valid YAML.
- **SC-005**: The four deep command docs no longer list `cli-gemini` as an executor option, carry contiguous Q-Exec option lettering, have a corrected ASCII box, and contain no gemini example commands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing the `if_cli_gemini:` branch breaks YAML block structure or indentation | High | Re-parse each edited file as YAML after the edit. |
| Risk | An over-broad edit strips a non-Gemini sibling executor branch | Medium | Restrict edits to the named branch and the named surface-list tokens only. |
| Risk | A stray Gemini token survives in a comment or example string | Medium | Run the case-insensitive command-YAML sweep (REQ-001) as the closing check. |
| Dependency | Phase `001-runtime-surface-and-skill-deletion` already deleted the `cli-gemini` skill and `.gemini/` surface | Green | Predecessor completed; this phase removes the residual command-layer references. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance change is expected; this is command-asset reference cleanup.

### Security
- **NFR-S01**: No secrets are introduced or exposed while removing executor branches.

### Reliability
- **NFR-R01**: Command workflows must select only supported executors (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-devin`) and must not dispatch a deleted `cli-gemini` skill.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- User-home Gemini state: `~/.gemini` references, if any exist outside command YAMLs, stay out of scope.
- Gemini ignore file: `.geminiignore` stays out of scope because it is a Gemini CLI ignore file, not the deleted project surface.

### Error Scenarios
- Dead-but-harmless lib reference: `resolveGeminiSandboxMode` in `deep-loop-runtime/lib` is no longer imported by any command YAML after the branch removal, so its presence does not reintroduce a Gemini executor surface.
- Q-Exec option re-lettering: dropping the `cli-gemini` option leaves a gap in the option letters; the command docs must re-letter the remaining options to stay contiguous, or a stale letter reference breaks the prompt flow.

### State Transitions
- Partial edit: if only some of the nine files are edited, REQ-001 fails because a residual `gemini` token remains; verification must cover all nine.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Nine command-layer files (5 YAML + 4 docs), surgical branch, token, option, and example removal. |
| Risk | 8/25 | YAML block-structure breakage and broken Q-Exec lettering are the main failure modes; no runtime serving path. |
| Research | 4/20 | Predecessor inventory and targeted command-layer grep only. |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope, out-of-scope, and acceptance criteria are bound by the predecessor phase and the dispatch contract.
<!-- /ANCHOR:questions -->
