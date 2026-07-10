---
title: "Feature Specification: Phase 1: cli-opencode-content-hygiene"
description: "Fixes 5 pre-existing content bugs in the live cli-opencode skill surfaced by a whole-program deep review: a pkill safety-rule self-contradiction, a stale retired-skill table row, a missing share-confirmation note, a default-dispatch recipe that violated the skill's own no-top-level-`--agent` contract, and 6 corrupted manual-testing-playbook filename links."
trigger_phrases:
  - "cli-opencode content hygiene"
  - "pkill self-contradiction fix"
  - "cli-opencode stale codex row"
  - "cli-opencode broken playbook links"
  - "phase 001 cli-opencode"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/001-cli-opencode-content-hygiene"
    last_updated_at: "2026-07-10T05:33:00Z"
    last_updated_by: "claude"
    recent_action: "F1 kill form corrected after cross-verify"
    next_safe_action: "Run validate --strict"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/README.md"
      - ".opencode/skills/cli-opencode/changelog/v1.3.15.3.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-001-cli-opencode-content-hygiene"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 5 WS-A findings confirmed against live files before editing; none were caused by the GPT-5.6 rename"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: cli-opencode-content-hygiene

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-sk-prompt-124-remediation |
| **Handoff Criteria** | cli-opencode fixes land and this phase validates `--strict`; phase 002 runs independently in parallel on a disjoint tree, so no blocking handoff is required. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Fix all open deep-review findings across cli-opencode, the sk-prompt 124 hub, and the 125/126 planning packets specification.

**Scope Boundary**: Strictly `.opencode/skills/cli-opencode/**`. No changes outside that tree, and no reversal of the in-flight v1.3.15.2 GPT-5.6 model-roster rename already present in the same files.

**Dependencies**:
- The whole-program deep review (`.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/review-report.md` §3 WS-A) that surfaced findings F1-F4, plus a Fable-5 finding (A-P1-3) that surfaced F5.
- The fix manifest `phase1-cli-opencode.md` (scratchpad input) that specified the exact fix for each finding with file:line evidence.

**Deliverables**:
- All 5 WS-A findings fixed in the live `cli-opencode` skill files.
- `SKILL.md` version bumped 1.3.15.2 → 1.3.15.3 with a matching changelog entry.
- This Level 1 spec-kit packet, validated `--strict` 0/0.

**Changelog**:
- `.opencode/skills/cli-opencode/changelog/v1.3.15.3.md` (authored as part of this phase's implementation).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The live `cli-opencode` skill carried 5 real content bugs surfaced by a whole-program deep review: a safety-rule self-contradiction between SKILL.md ALWAYS Rule 5 and Rule 16 (Rule 16's cleanup command did exactly what Rule 5 forbids), a stale retired-`cli-codex` row mislabeled as `cli-opencode` in the README sibling-boundary table, a parallel-session quick start that omitted the skill's own share-confirmation hard_rule, a default-dispatch recipe that itself violated the skill's documented no-top-level-`--agent` contract, and 6 corrupted filename links left by a concurrent session's blanket find/replace. None were caused by the v1.3.15.2 GPT-5.6 rename sharing the same working tree.

### Purpose
Every WS-A finding is fixed in the live file, verified against file:line evidence before and after, without touching the in-flight GPT-5.6 rename or any file outside `cli-opencode`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F1: `SKILL.md` Rule 16 pkill self-contradiction fix (real safety bug).
- F2: `README.md` stale `cli-codex` sibling-boundary row removal.
- F3: `README.md` parallel-session share-confirmation note.
- F4: `README.md` default-dispatch `--agent` recipe fix.
- F5: 6 corrupted manual-testing-playbook filename links.
- `SKILL.md` version bump 1.3.15.2 → 1.3.15.3 and a matching changelog entry.

### Out of Scope
- Reverting or altering the v1.3.15.2 GPT-5.6 model-roster rename - already in the working tree; this phase builds on top of it, not a revert.
- `graph-metadata.json`'s `causal_summary` "four sibling cli-* skills" wording (stale since the cli-codex retirement, last touched 2026-06-03) - flagged during verification but not one of the 5 WS-A findings; left for a future pass.
- sk-prompt-124 remediation and 125/126 packet advisory refinements - owned by sibling phases 002 and 003 of this same parent packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | F1 pkill scoping fix + version bump 1.3.15.2 → 1.3.15.3 |
| `.opencode/skills/cli-opencode/README.md` | Modify | F2 stale row deleted, F3 share-confirm note added, F4 `--agent` recipe fixed |
| `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | Modify | F5: 4 corrupted filename links repaired |
| `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/deepseek-v4-direct-with-sk-prompt-models.md` | Modify | F5: 1 corrupted filename link repaired |
| `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/kimi-k2-7-direct-with-sk-prompt-models.md` | Modify | F5: 1 corrupted filename link repaired |
| `.opencode/skills/cli-opencode/changelog/v1.3.15.3.md` | Create | Changelog entry documenting all 5 fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix the Rule 16 vs Rule 5 pkill self-contradiction (real safety bug). | `SKILL.md` Rule 16 no longer contains a blanket `pkill -9 -f "opencode run"`; it kills only a captured PID and cross-references Rule 5. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Delete the stale retired-cli-codex sibling-boundary row. | `README.md` "Sibling Boundaries" table lists exactly 2 rows: `cli-opencode` and `cli-claude-code`. |
| REQ-003 | Surface the share-confirmation gate in the parallel-session quick start. | `README.md` Step 4 references the `share-requires-confirmation` hard_rule before the `--share` code block. |
| REQ-004 | Align the default-dispatch recipe with the no-top-level-`--agent` rule. | `README.md` Step 3 code block contains no `--agent` flag; the agent-profile intent moves into the prompt body. |
| REQ-005 | Repair the 6 corrupted filename links. | `grep -rn "with-sk-prompt/prompt-models" .opencode/skills/cli-opencode/` returns 0 matches. |
| REQ-006 | Bump the version and add a changelog entry. | `SKILL.md` frontmatter reads `version: 1.3.15.3`; `changelog/v1.3.15.3.md` exists and documents all 5 fixes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 WS-A findings verified against live files with file:line evidence, fixed, and re-verified after editing.
- **SC-002**: `SKILL.md` version reads `1.3.15.3` and a matching changelog entry exists.
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/001-cli-opencode-content-hygiene --strict` returns 0 errors / 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | v1.3.15.2 GPT-5.6 rename, uncommitted in the same working tree | Medium - a blanket edit could collide with or revert in-flight rename content. | Read each live file immediately before editing; use targeted `Edit` on exact matched strings, never a blanket replace; `git diff --stat` scoped to `cli-opencode/` after editing to confirm only intended files changed. |
| Risk | The Rule 16 PID-scoped kill under-scopes and leaves real orphans behind. | Low - this is a documentation instruction, not executable automation. | Preserve the original cleanup intent (own process group + own children) explicitly in the rule text. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All 5 fixes were fully specified in the fix manifest with file:line evidence; no ambiguity required a decision during implementation.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
