---
title: "Feature Specification: deep-review :auto non-interactive setup bypass"
description: "Fix /spec_kit:deep-review:auto so the setup phase truly does not require interactive input — currently the markdown entrypoint asks for spec-folder/dimensions/scope confirmation even under :auto, hanging non-interactive dispatches on stdin EOF."
trigger_phrases:
  - "deep-review setup hang"
  - "deep-review :auto non-interactive bypass"
  - "F-Stage-E-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-deep-review-noninteractive-setup-bypass"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec"
    next_safe_action: "Author plan + tasks + checklist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-deep-review-noninteractive-setup-bypass"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: deep-review :auto non-interactive setup bypass

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Origin** | F-Stage-E-001 surfaced during 102/004 Stage E dispatch (`/spec_kit:deep-review:auto` against the 102 phase parent via cli-opencode + DeepSeek v4 Pro) — see `.opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage/implementation-summary.md` §Known Limitations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/spec_kit:deep-review:auto` advertises itself as non-interactive (`:auto` suffix → `execution_mode = AUTONOMOUS`). In practice, the markdown entrypoint at `.opencode/commands/spec_kit/deep-review.md` §0 UNIFIED SETUP PHASE still emits a `STATUS: BLOCKED` consolidated question block (Q0/Q1_type/Q_dims/Q1/Q3/Q-Exec) and waits on stdin before loading the YAML workflow. When dispatched non-interactively via `codex exec </dev/null` or `opencode run --pure ... </dev/null`, the session hits stdin EOF, emits the question, and exits 0 with no work done — silently. The user-side workaround (pre-binding every setup answer in the prompt) works but is brittle, undocumented in the command surface, and easy to forget.

Concrete incident: 2026-05-11 102/004 Stage E first dispatch hung 3 minutes at the setup gate; second dispatch (with pre-bound answers in the prompt) ran the full 5-iteration deep-review and converged.

### Purpose
Make `:auto` truly non-interactive. When the command detects sufficient resolved inputs (either from `$ARGUMENTS` flags or explicit pre-binding markers in the prompt body), it must skip the question block, persist resolved values to `deep-review-config.json`, and load the YAML workflow without a round-trip. When required inputs ARE missing, fail fast with an explicit error citing which inputs are unbound — never hang on stdin.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit `.opencode/commands/spec_kit/deep-review.md` §0 UNIFIED SETUP PHASE to identify which inputs are required vs which can be defaulted under `:auto`.
- Add a "non-interactive setup resolution" branch: when `execution_mode = AUTONOMOUS` AND all required inputs are present (either via `$ARGUMENTS` flags or pre-binding markers), skip the question block entirely.
- Define explicit pre-binding markers the command will accept: `PRE-BOUND SETUP ANSWERS:` block in prompt body, with named fields matching Q0/Q1_type/Q_dims/Q1/Q3/Q-Exec.
- Fail-fast error path: if `:auto` is set AND required inputs are missing, emit a clear error message naming the missing inputs and exit non-zero. Do NOT hang.
- Update the command's argument-hint and execution-protocol comments to document the non-interactive path.
- Add a test scenario under sk-doc playbook (or system-spec-kit playbook) that dispatches `:auto` non-interactively and verifies no stdin hang + workflow loads.

### Out of Scope
- The YAML workflow itself (`spec_kit_deep-review_auto.yaml`) — its iteration loop already runs non-interactively once loaded.
- The `:confirm` mode — keeps its existing interactive setup behavior.
- Equivalent gaps in `/spec_kit:deep-research:auto` or `/spec_kit:complete:auto` — those have similar architectures but are separate fix packets.
- Changing the SPAWN-AGENT path in cli-codex (different bug, resolved in 102/005 via inline-contract workaround).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/spec_kit/deep-review.md` | Modify | Add non-interactive setup branch; document pre-binding marker format; argument-hint update |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Possibly modify | If setup-resolution logic moves into YAML, update step_resolve_setup or equivalent |
| `.opencode/skills/sk-doc/manual_testing_playbook/` OR equivalent playbook scenario | Create | New scenario verifying non-interactive dispatch doesn't hang |
| `028-.../implementation-summary.md` | Modify post-impl | Document the resolved setup-resolution flow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `:auto` mode never hangs on stdin when required inputs are resolvable from `$ARGUMENTS` or pre-binding markers. | Dispatch `/spec_kit:deep-review:auto "specs/.../X" --max-iterations=5` via `codex exec </dev/null` succeeds end-to-end with no setup-phase question emitted. |
| REQ-002 | `:auto` mode fails fast (non-zero exit + clear error) when required inputs are genuinely missing. | Dispatch `/spec_kit:deep-review:auto ""` (empty arguments) emits an explicit missing-inputs error and exits non-zero within 10 seconds. |
| REQ-003 | Pre-binding marker format documented in the command markdown. | Reading `.opencode/commands/spec_kit/deep-review.md` reveals an explicit `PRE-BOUND SETUP ANSWERS:` schema with field names + types. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `:confirm` mode behavior unchanged. | Existing interactive setup tests still pass. |
| REQ-005 | Test scenario added that exercises non-interactive setup-bypass. | Scenario file exists; dispatch returns workflow-loaded evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `:auto` dispatch with full `$ARGUMENTS` set loads YAML workflow without emitting a setup question.
- **SC-002**: `:auto` dispatch with insufficient inputs exits non-zero with a named-missing-inputs error.
- **SC-003**: `:confirm` dispatch retains its existing interactive question block.
- **SC-004**: A re-dispatch of the 102/004 Stage E scenario (or equivalent) succeeds without the prompt-side pre-binding workaround we currently apply.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing dispatches that rely on the current behavior (silent stdin hang OR interactive default) break | Workflow regression for active reviews | Keep `:confirm` mode unchanged; only `:auto` mode gains the fail-fast/skip-question branch. |
| Risk | Pre-binding marker format conflicts with an existing convention | Markdown parser ambiguity | Use an unambiguous block-style marker (`PRE-BOUND SETUP ANSWERS:` followed by indented key=value lines) that doesn't collide with any other command convention. |
| Risk | YAML workflow setup-step assumes resolved values come from the question block | YAML steps fail if resolved values come from a different path | Audit `step_init` / `step_resolve_setup` and any YAML step that reads setup state; ensure both paths converge to the same `deep-review-config.json` shape. |
| Dependency | `/spec_kit:deep-review` command markdown is the canonical entrypoint | Setup changes must live in the markdown, not the YAML | Most edits land in the .md; YAML may need a small consumer-side update. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Non-interactive setup resolution adds < 1 second to dispatch wall-clock.
- **NFR-P02**: Fail-fast error path returns within 10 seconds when inputs are missing.

### Security
- **NFR-S01**: No new secrets, tokens, or credentials handled.
- **NFR-S02**: Pre-binding markers do not introduce arbitrary command execution paths.

### Reliability
- **NFR-R01**: Behavior is deterministic — same `$ARGUMENTS` + same pre-binding markers always produce the same resolved `deep-review-config.json`.
- **NFR-R02**: No regressions in `:confirm` mode.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `$ARGUMENTS` has target but no flags: AUTONOMOUS mode falls back to defaults for maxIterations / convergenceThreshold / executor.
- `$ARGUMENTS` empty AND no pre-binding markers: fail fast with named missing inputs.
- Target points at a phase parent: AUTONOMOUS picks "parent-level review of all children" as the default scope (no question).
- Target points at non-existent path: fail fast within `step_resolve_target`.

### Error Scenarios
- Malformed pre-binding markers: fail fast with parse-error message naming the offending line.
- Unknown setup field in pre-binding markers: warn but continue, applying known fields.
- Auth missing for selected executor (e.g. `--executor=cli-codex` but codex not installed): fail at executor-config validation, not at setup.

### State Transitions
- Setup blocked → Setup resolved: skip if AUTONOMOUS + resolvable; ask if INTERACTIVE; fail if AUTONOMOUS + unresolvable.
- Setup resolved → YAML loaded: identical for both paths.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Touches command markdown + possibly YAML + needs a verification scenario; well-bounded surface. |
| Risk | 12/25 | Existing flows must not break; verification across :auto + :confirm + missing-input cases. |
| Research | 8/20 | Need to understand the existing setup flow + YAML init step; some upstream exploration. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Pre-binding marker spelling: `PRE-BOUND SETUP ANSWERS:` (matches workaround used in 102/004 Stage E) or `SETUP_RESOLVED:` (tighter machine-parseable form) — decide during implementation based on parser readability.
- Should the non-interactive setup-bypass also apply to `/spec_kit:deep-research:auto`, `/spec_kit:complete:auto`, and `/spec_kit:implement:auto`? Out of scope here but worth tracking as follow-on packets if the bypass pattern works.
<!-- /ANCHOR:questions -->
