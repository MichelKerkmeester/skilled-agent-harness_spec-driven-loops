---
title: "Feature Specification: deep-review :auto non-interactive setup bypass"
description: "Fix /deep:start-review-loop:auto so the setup phase truly does not require interactive input — currently the markdown entrypoint asks for spec-folder/dimensions/scope confirmation even under :auto, hanging non-interactive dispatches on stdin EOF."
trigger_phrases:
  - "deep-review setup hang"
  - "deep-review :auto non-interactive bypass"
  - "F-Stage-E-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/018-deep-review-three-tier-setup"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec"
    next_safe_action: "Author plan + tasks + checklist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-001-deep-review-three-tier-setup"
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
| **Status** | Complete |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Origin** | F-Stage-E-001 surfaced during 102/004 Stage E dispatch (`/deep:start-review-loop:auto` against the 102 phase parent via cli-opencode + DeepSeek v4 Pro) — see `.opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage/implementation-summary.md` §Known Limitations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/deep:start-review-loop:auto` advertises itself as autonomous (`:auto` suffix → `execution_mode = AUTONOMOUS`). In practice, the markdown entrypoint at `.opencode/commands/deep/start-review-loop.md` §0 UNIFIED SETUP PHASE always emits a `STATUS: BLOCKED` consolidated question block (Q0/Q1_type/Q_dims/Q1/Q3/Q-Exec) and waits on stdin before loading the YAML workflow. When dispatched non-interactively via `codex exec </dev/null` or `opencode run --pure ... </dev/null`, the session hits stdin EOF, emits the question, and exits 0 with no work done — silently. The user-side workaround (pre-binding every setup answer in the prompt) works but is brittle, undocumented in the command surface, and easy to forget.

Concrete incident: 2026-05-11 102/004 Stage E first dispatch hung 3 minutes at the setup gate; second dispatch (with pre-bound answers in the prompt) ran the full 5-iteration deep-review and converged.

### Purpose
Make `:auto` smartly autonomous via a **three-tier setup-resolution contract** (see `feedback_auto_mode_ask_only_when_ambiguous.md`):

1. **Resolve confidently first** — when the command can resolve every required input from `$ARGUMENTS` flags, a `PRE-BOUND SETUP ANSWERS:` block in the prompt body, or documented sensible defaults, skip the question block entirely. Persist resolved values to `deep-review-config.json` and load the YAML workflow without a round-trip.

2. **Ask one targeted clarification when genuinely ambiguous** — when exactly one or two fields are genuinely ambiguous AND no sensible default exists (e.g. target path matches multiple candidates, or a destructive-scope choice has no safe default), emit ONE narrow question rather than the full Q0..Q-Exec block. If stdin is closed and no answer arrives, fall through to step 3.

3. **Fail fast as last resort** — when required inputs are genuinely unresolvable AND no defaults rescue them AND targeted-clarification produced no answer, exit non-zero with a clear named-missing-inputs error. Never hang on stdin.

`:auto` does NOT mean "never ask" (too rigid) and does NOT mean "always ask the full block" (too soft). It means "ask only when uncertain or ambiguous."
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit `.opencode/commands/deep/start-review-loop.md` §0 UNIFIED SETUP PHASE to identify which inputs are required vs which can be defaulted under `:auto`, and which carry sensible defaults vs which require explicit user choice.
- Add the three-tier setup-resolution branch under `:auto`:
  - **Tier 1 (resolve)**: when `execution_mode = AUTONOMOUS` AND every required input is present via `$ARGUMENTS` flags, `PRE-BOUND SETUP ANSWERS:` block, OR documented defaults, skip the question block and load YAML.
  - **Tier 2 (targeted ask)**: when 1-2 fields are genuinely ambiguous (e.g. target path matches multiple candidates) AND no sensible default exists, emit ONE narrow question naming only the ambiguous field. Wait briefly; fall through to Tier 3 if no answer.
  - **Tier 3 (fail fast)**: when truly unresolvable, exit non-zero with a clear named-missing-inputs error.
- Define the `PRE-BOUND SETUP ANSWERS:` block schema in the command markdown, with named fields matching Q0/Q1_type/Q_dims/Q1/Q3/Q-Exec.
- Document each setup field's default-resolution rule (so reviewers can audit which inputs need targeted asks vs. which can default).
- Update the command's argument-hint and execution-protocol comments to document the three-tier path.
- Add a test scenario covering all three tiers: resolvable (Tier 1 pass), ambiguous (Tier 2 targeted ask), unresolvable (Tier 3 fail-fast).

### Out of Scope
- The YAML workflow itself (`deep_start-review-loop_auto.yaml`) — its iteration loop already runs non-interactively once loaded.
- The `:confirm` mode — keeps its existing interactive setup behavior.
- Equivalent gaps in `/deep:start-research-loop:auto` or `/speckit:complete:auto` — those have similar architectures but are separate fix packets.
- Changing the SPAWN-AGENT path in cli-codex (different bug, resolved in 102/005 via inline-contract workaround).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/start-review-loop.md` | Modify | Add non-interactive setup branch; document pre-binding marker format; argument-hint update |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Possibly modify | If setup-resolution logic moves into YAML, update step_resolve_setup or equivalent |
| `.opencode/skills/sk-doc/manual_testing_playbook/` OR equivalent playbook scenario | Create | New scenario verifying non-interactive dispatch doesn't hang |
| `028-.../implementation-summary.md` | Modify post-impl | Document the resolved setup-resolution flow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Tier 1 (resolve): `:auto` skips the question block when required inputs are resolvable from `$ARGUMENTS`, pre-binding markers, or sensible defaults. | Dispatch `/deep:start-review-loop:auto "specs/.../X" --max-iterations=5` via `codex exec </dev/null` succeeds end-to-end with no setup-phase question emitted. |
| REQ-002 | Tier 2 (targeted ask): when 1-2 fields are ambiguous AND no default exists, `:auto` emits ONE narrow question — never the full Q0..Q-Exec block. | Construct an ambiguous-target case (e.g. target string matches two spec folders); dispatch emits a single clarification question naming only the ambiguous field, not the consolidated block. |
| REQ-003 | Tier 3 (fail fast): `:auto` exits non-zero with a clear named-missing-inputs error when truly unresolvable AND targeted-clarification gets no answer. | Dispatch `/deep:start-review-loop:auto ""` (empty arguments) via `codex exec </dev/null` exits non-zero within 10 seconds with an explicit missing-inputs error. |
| REQ-004 | Pre-binding marker schema documented in the command markdown. | Reading `.opencode/commands/deep/start-review-loop.md` reveals an explicit `PRE-BOUND SETUP ANSWERS:` schema with field names + types + a documented default-resolution rule per field. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `:confirm` mode behavior unchanged. | Existing interactive setup tests still pass; `:confirm` still emits the full consolidated question block. |
| REQ-006 | Test scenario covers all three tiers (resolvable / ambiguous / unresolvable). | Scenario file exists; three dispatch verdicts captured as evidence. |
| REQ-007 | Each setup field's default-resolution rule documented inline. | For every field in the schema, the command markdown notes how it resolves (flag / marker / default / requires-ask). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001 (Tier 1)**: `:auto` dispatch with resolvable inputs loads YAML workflow without emitting any setup question.
- **SC-002 (Tier 2)**: `:auto` dispatch with one ambiguous field emits a single targeted question naming only that field — not the full consolidated block.
- **SC-003 (Tier 3)**: `:auto` dispatch with truly unresolvable inputs exits non-zero with a named-missing-inputs error within 10 seconds.
- **SC-004**: `:confirm` dispatch retains its existing full-block interactive question behavior.
- **SC-005**: A re-dispatch of the 102/004 Stage E scenario (or equivalent) succeeds without the prompt-side pre-binding workaround currently applied — the command's own Tier 1 resolution covers it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing dispatches that rely on the current behavior (silent stdin hang OR interactive default) break | Workflow regression for active reviews | Keep `:confirm` mode unchanged; only `:auto` mode gains the fail-fast/skip-question branch. |
| Risk | Pre-binding marker format conflicts with an existing convention | Markdown parser ambiguity | Use an unambiguous block-style marker (`PRE-BOUND SETUP ANSWERS:` followed by indented key=value lines) that doesn't collide with any other command convention. |
| Risk | YAML workflow setup-step assumes resolved values come from the question block | YAML steps fail if resolved values come from a different path | Audit `step_init` / `step_resolve_setup` and any YAML step that reads setup state; ensure both paths converge to the same `deep-review-config.json` shape. |
| Dependency | `/deep:start-review-loop` command markdown is the canonical entrypoint | Setup changes must live in the markdown, not the YAML | Most edits land in the .md; YAML may need a small consumer-side update. |
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
- Should the non-interactive setup-bypass also apply to `/deep:start-research-loop:auto`, `/speckit:complete:auto`, and `/speckit:implement:auto`? Out of scope here but worth tracking as follow-on packets if the bypass pattern works.
<!-- /ANCHOR:questions -->
