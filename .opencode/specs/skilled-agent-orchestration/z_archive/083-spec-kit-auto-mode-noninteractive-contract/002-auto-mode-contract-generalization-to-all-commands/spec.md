---
title: "Feature Specification: auto-mode-contract generalization to all commands"
description: "Lift the three-tier :auto contract from /deep:start-review-loop (Phase 1) into a shared reference and migrate 11 remaining /spec_kit/, /create/, /deep/ commands to cite it; full live :auto dispatch verification per command."
trigger_phrases:
  - "auto mode contract generalization"
  - "spec-kit :auto rollout"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/002-auto-mode-contract-generalization-to-all-commands"
    last_updated_at: "2026-05-11T12:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 spec"
    next_safe_action: "Dispatch cli-codex group 1 (spec_kit commands)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-002-auto-mode-contract-generalization"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: auto-mode-contract generalization to all commands

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
| **Phase** | 2 of 2 |
| **Predecessor** | 001-deep-review-three-tier-setup |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 1 introduced the three-tier `:auto` contract for `/deep:start-review-loop`. The same architecture and same stdin-hang gap affect 11 other commands across `/spec_kit/`, `/create/`, and `/deep/`. Inlining the three-tier flow into every command duplicates ~300 LOC and risks drift; lifting it into a shared reference doc preserves a single source of truth and keeps each command lean.

### Purpose
Author the shared `auto_mode_contract.md` reference, refactor Phase-1's deep-review to cite it, migrate 11 remaining commands to the same pattern, and verify each one via a live non-interactive `:auto` dispatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md` (Level 2 sk-doc reference; §1-8 — three-tier flow, PRE-BOUND ANSWERS grammar, default-resolution-table format, Tier-3 error template, `:confirm` invariance, verification protocol, adoption checklist, out-of-scope).
- Refactor `/deep:start-review-loop` §0 to cite the shared contract (replacing the inline three-tier sections from 001).
- Migrate 11 commands' §0 to cite the shared contract + provide their own per-field default table + PRE-BOUND ANSWERS field list:
  - `/speckit:` — deep-research, complete, implement, plan, resume (5)
  - `/create:` — sk-skill, agent, changelog, feature-catalog, testing-playbook, folder_readme (6)
  - `/deep:` — agent (1)
- Update each migrated command's frontmatter `argument-hint` to reference the new bypass capability.
- Preserve each command's `:confirm` consolidated Q-block path untouched (regression-check).
- Full live `:auto` dispatch verification: one transcript per command captured under `evidence/`.

### Out of Scope
- `/prompt` and `agent_router` — no paired YAML / dispatch-only.
- YAML asset edits unless a live verification surfaces a hard requirement.
- Cross-command `:auto` integration tests (chained dispatches).
- Skill-internal `:auto` flows (sk-doc, sk-code, etc.).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md` | Create | Shared three-tier `:auto` contract reference |
| `.opencode/commands/deep/start-review-loop.md` | Modify | Refactor §0 to cite shared contract |
| `.opencode/commands/speckit/{deep-research,complete,implement,plan,resume}.md` | Modify | Migrate §0 to shared contract pattern |
| `.opencode/commands/create/{sk-skill,agent,changelog,feature-catalog,testing-playbook,folder_readme}.md` | Modify | Same |
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modify | Same |
| `002/evidence/` | Create dir + 12 files | Live dispatch transcripts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared `auto_mode_contract.md` exists with all required sections | `grep -c "^## §[1-8]" auto_mode_contract.md` returns ≥7 |
| REQ-002 | All 12 commands (deep-review + 11 migrated) cite the shared contract | `grep -l "auto_mode_contract.md" .opencode/commands/{spec_kit,create,deep}/*.md \| wc -l` returns ≥12 |
| REQ-003 | 12 live `:auto` dispatch evidence files captured | `find 002/evidence -name "*.txt" \| wc -l` returns ≥12 |
| REQ-004 | ≥10/12 PASS verdicts on live dispatches | Per-evidence-file footer verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each command's `:confirm` consolidated Q-block path untouched | Per-command read-back diff confirms no `:confirm` regression |
| REQ-006 | Each migrated command's frontmatter `argument-hint` updated | grep for new bypass capability mention per command |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Shared contract doc exists and is cited by all 12 in-scope commands.
- **SC-002**: 11 commands migrated; deep-review (Phase 1) refactored to match the shared-contract pattern.
- **SC-003**: 12/12 evidence files exist; ≥10/12 PASS.
- **SC-004**: No `:confirm` regression in any of the 12 commands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Per-command Q-block field shapes differ; one-size-fits-all template may not fit | Some commands' Tier-2 logic needs unique tweaks | Per-command default table is command-specific; codex dispatch reads each command's current §0 and authors a tailored table |
| Risk | Live `:auto` dispatches produce side effects (file writes outside `/tmp`) | Polluting production spec folders or skills tree | Every live-dispatch prompt forbids writes outside `/tmp`; pre-answers Gate 3 with "D) Skip" |
| Risk | Codex SpawnAgent allowlist gap re-emerges in some dispatch | Codex falls back to sub-agent and hits Gate 3 | Use inline-contract pattern per `feedback_codex_spawnagent_allowlist.md` |
| Risk | CLI dispatch unreliability under parallelism | Concurrent codex runs silently fail | Sequential dispatches only; 3 codex groups + 12 live verifications all serial |
| Dependency | `auto_mode_contract.md` must exist before any command migration | Per-command edits would have no citation target | Stage B authors the contract first |
| Dependency | deep-review.md refactor must land first as the reference example | Other migrations would lack a working template | Stage B refactors deep-review before Stage C kicks off |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-command codex migration completes within 5 min wall-clock.
- **NFR-P02**: Per-command live `:auto` dispatch verification completes within 5 min wall-clock (setup-phase resolution check, not full YAML loop).

### Security
- **NFR-S01**: No secrets, tokens, or credentials persisted in any evidence file.
- **NFR-S02**: All live-dispatch outputs land in `/tmp/` only; never under `.opencode/skills/`, `.opencode/agents/`, or production spec folders.

### Reliability
- **NFR-R01**: Each migrated command's `:confirm` path retains exact existing behavior.
- **NFR-R02**: Every PASS verdict cites file:line evidence in the transcript.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Command has no `:auto` mode (e.g., `agent_router`): skip from scope.
- Command has `:auto` but no paired YAML (e.g., `/prompt`): skip — no setup-phase surface.
- Command's `:auto` path already implements partial three-tier: codex audits and aligns rather than overwriting.

### Error Scenarios
- Per-command codex migration partially applies: rollback via `git restore <command-md>`; retry with tightened prompt.
- Live dispatch hangs: kill the process; mark as FAIL with stdin-hang diagnostic in evidence; flag as separate finding.
- Live dispatch writes outside `/tmp`: HARD STOP; immediate rollback; treat as P0 in implementation-summary.

### State Transitions
- Draft → Active: 002 spec authored.
- Active → Complete: 12 PASS-or-PARTIAL evidence files exist; strict-validate exit 0; implementation-summary populated.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 12 commands + 1 shared doc + 12 live verifications |
| Risk | 14/25 | Per-command idiosyncrasies; live verification side-effect risk |
| Research | 8/20 | Pattern established by 001; per-command field mapping is mechanical |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking planning.
<!-- /ANCHOR:questions -->
