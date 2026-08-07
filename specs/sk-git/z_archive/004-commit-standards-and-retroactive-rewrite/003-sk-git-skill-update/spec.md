---
title: "Phase 003: sk-git Skill Update"
description: "Apply the Phase 002 commit-standard to the sk-git skill across all 4 runtime mirrors (.opencode/, .claude/, .codex/, .gemini/). Refresh GIT-007 trailer test against the locked policy."
trigger_phrases:
  - "112-sk-git-skill-update"
  - "sk-git update commit standards"
  - "GIT-007 trailer test refresh"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/004-commit-standards-and-retroactive-rewrite/003-sk-git-skill-update"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase 003 docs; awaits phase 002 lock"
    next_safe_action: "Apply phase 002 ADRs to sk-git across 4 runtime mirrors"
    blockers:
      - "Phase 002 must close with 7 ADRs Accepted before sk-git content can be authored."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 003: sk-git Skill Update

<!-- SPECKIT_LEVEL: 1 -->
<!-- NOTE: Upgrade to Level 2 on activation. Pre-staged checklist.md scaffolds the L2 mirror-parity verification. -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (upgrade to 2 on activation — checklist.md pre-staged) |
| **Priority** | P1 |
| **Status** | Pending (blocked on Phase 002 close) |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-commit-standards-definition |
| **Successor** | 004-cli-devin-rewrite-prompts |
| **Handoff Criteria** | sk-git core files in `.opencode/`, `.claude/`, `.codex/`, `.gemini/` byte-identical; GIT-007 manual test passes against new trailer policy; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the 112 packet. Phase 002 produces `commit-standards.md`, `derivation-heuristics.md`, and 7 Accepted ADRs. This phase is the mechanical step that takes those outputs and applies them to the `sk-git` skill content.

**Scope Boundary**: Skill content authoring only. No commit history touched. No `commit-msg` hook authored (deferred). The same content must land in all 4 runtime mirrors as byte-identical copies (per `feedback_new_agent_mirror_all_runtimes`).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-git documents commit standards in two places — SKILL.md §3 and `assets/commit_message_template.md` — and both are partially stale relative to the decisions locked in Phase 002. The runtime mirrors (.claude/, .codex/, .gemini/) also need to receive byte-identical updates so the skill behaves consistently regardless of which runtime is active.

### Purpose
Synchronize sk-git skill content to match the canonical Phase 002 standard, and refresh the GIT-007 manual-test scenario so it validates against the new trailer policy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update `.opencode/skills/sk-git/SKILL.md` §3 (lines 177–196 — type/scope priority logic).
- Update `.opencode/skills/sk-git/assets/commit_message_template.md` (lines 53–95 — template content).
- Update `.opencode/skills/sk-git/references/commit_workflows.md` (6-step commit analysis workflow).
- Refresh `.opencode/skills/sk-git/manual_testing_playbook/` GIT-007 scenario if trailer policy shifted in ADR-003.
- Mirror identical content to `.claude/skills/sk-git/`, `.codex/skills/sk-git/`, `.gemini/skills/sk-git/`.
- Run GIT-007 manual test scenario against the new content.

### Out of Scope

- `commit-msg` hook / `commitlint` config (deferred unless user adds as explicit ask).
- `.gitmessage` template at repo root (deferred unless user adds as explicit ask).
- AGENTS_Barter sibling sync (separate repo via symlink — sync only if the standard applies there, decided by user).
- Updating sk-git version / changelog bump (decide during execution based on actual delta magnitude).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/SKILL.md` | Modify | §3 type/scope priority, body policy, trailer policy, packet-ID handling |
| `.opencode/skills/sk-git/assets/commit_message_template.md` | Modify | Worked examples reflecting the locked standard |
| `.opencode/skills/sk-git/references/commit_workflows.md` | Modify | 6-step workflow updated to reference new derivation heuristics |
| `.opencode/skills/sk-git/manual_testing_playbook/GIT-007-*.md` | Modify | Trailer test updated if ADR-003 changed trailer policy |
| `.claude/skills/sk-git/**` | Modify (mirror) | Byte-identical copy from .opencode |
| `.codex/skills/sk-git/**` | Modify (mirror) | Byte-identical copy from .opencode |
| `.gemini/skills/sk-git/**` | Modify (mirror) | Byte-identical copy from .opencode |
| `implementation-summary.md` | Update | Fill at phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | sk-git SKILL.md §3 reflects all 7 Phase 002 ADRs | Manual diff review against `decision-record.md` |
| REQ-002 | `commit_message_template.md` includes worked examples for: happy-path, merge, revert, packet-ID-legacy-rewrite, unrecoverable-diff | 5+ examples present in the template |
| REQ-003 | `commit_workflows.md` references `derivation-heuristics.md` | Cross-link present in step where type/scope is derived |
| REQ-004 | GIT-007 manual test passes against new trailer policy | Run GIT-007; report pass/fail in `implementation-summary.md` |
| REQ-005 | 4-runtime mirror parity | `diff -r .opencode/skills/sk-git/ .claude/skills/sk-git/` empty (excluding any per-runtime metadata files like `.runtime-marker`); same for .codex and .gemini |
| REQ-006 | `validate.sh --strict` passes | Exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 6 REQs pass.
- A new contributor reading the updated `sk-git` skill can write a compliant commit without consulting the Phase 002 standards document directly.
- Mirror parity is byte-perfect across the 4 runtime dirs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Standards drift while authoring**: if mid-write we discover a Phase 002 gap, we reopen Phase 002, not patch in this phase.
- **Runtime-specific divergence**: `.claude/`, `.codex/`, `.gemini/` mirrors may have accumulated drift. Use the 4-runtime parity diff before edit to identify pre-existing drift; surface in `implementation-summary.md`.
- **GIT-007 test breakage**: the canonical trailer string may have changed; the test must be updated in lockstep, not after.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does AGENTS_Barter sibling repo need the same update? Defer answer to phase execution (decide based on whether Barter authors commits using sk-git or its own conventions).
- Should sk-git changelog be bumped? Decide based on actual content delta magnitude (semver-style — major if rules change, minor if only examples).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessor: `../002-commit-standards-definition/spec.md` (must close first)
- Successor: `../004-cli-devin-rewrite-prompts/spec.md`
- Inputs (from Phase 002): `commit-standards.md`, `derivation-heuristics.md`, `decision-record.md`
- Files to be modified: see Scope table above
