---
title: "Feature Specification: Phase 003 Opencode Internals"
description: "Update active .opencode references outside the renamed skill folder so internal commands, agents, scorer lanes, advisor fixtures, and cli-* mirrors point at sk-prompt. Excludes packet specs and the renamed skill folder itself."
trigger_phrases:
  - "082 phase 003"
  - "sk-improve-prompt opencode internals"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/068-sk-improve-prompt-rename/003-opencode-internals"
    last_updated_at: "2026-05-06T11:12:38Z"
    last_updated_by: "codex"
    recent_action: "Phase 003 refs rotated; rebuild blocked"
    next_safe_action: "Resolve rebuild blocker"
    blockers:
      - "advisor_rebuild fails because .opencode/skills/deep-agent-improvement/graph-metadata.json has skill_id sk-improve-agent while folder is deep-agent-improvement"
      - "Broad .opencode grep still finds Phase 005 files that Phase 003 constraints forbid editing"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-003"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Should the deep-agent-improvement skill_id/folder mismatch be corrected before Phase 004?"
    answered_questions: []
---
# Feature Specification: Phase 003 Opencode Internals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Pending |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `082-sk-improve-prompt-rename` |
| **Phase** | 003 of 006 |
| **Handoff Criteria** | `rg 'sk-improve-prompt' .opencode/ --glob '!**/specs/**' --glob '!**/sk-prompt/**'` returns 0 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the skill folder is renamed, active `.opencode/` consumers still load, score, document, or test the old skill ID. These references include high-risk advisor code and fixtures, plus mirrored prompt quality cards that must stay synchronized.

### Purpose
Phase 003 updates every `.opencode/` reference outside specs and the renamed skill folder so internal dispatch, advisor scoring, regression fixtures, and cli-* mirrors use `sk-prompt`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `.opencode/commands/prompt.md`, `.opencode/commands/README.txt`, and `.opencode/agents/improve-prompt.md` body refs.
- Update advisor scorer lanes `explicit.ts`, `lexical.ts`, `fusion.ts`, `skill_advisor.py`, advisor metadata, sync script, routing fixtures, and regression fixtures.
- Update five cli-* `assets/prompt_quality_card.md` mirrors and parent `SKILL.md` routing tables.
- Update listed cli manual playbooks, `deep-agent-improvement/SKILL.md`, and sk-code advisor integration docs.

### Out of Scope
- Editing `.opencode/skills/sk-prompt/**` skill-local content or `.opencode/specs/**`.
- Editing `.claude/`, `.codex/`, `.gemini/`, root docs, install guides, active changelogs outside this phase.
- Renaming `/prompt`, `@improve-prompt`, or their filenames.
- Running final advisor rebuild and probe battery.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/*`, `.opencode/agents/improve-prompt.md` | Modify | Dispatcher and agent body refs |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/**` | Modify | Scorer and fusion skill ID refs |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modify | TOKEN_BOOSTS, PHRASE_BOOSTS, aliases dict |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/{graph-metadata.json,scripts/**}` | Modify | Metadata, sync script, fixtures, labeled prompts |
| `.opencode/skills/cli-{claude-code,copilot,codex,gemini,opencode}/{SKILL.md,assets/prompt_quality_card.md}` | Modify | Mirrors and parent routing tables |
| `.opencode/skills/cli-copilot/manual_testing_playbook/**`, `.opencode/skills/cli-opencode/manual_testing_playbook/**` | Modify | Listed prompt-card playbooks |
| `.opencode/skills/deep-agent-improvement/SKILL.md`, `.opencode/skills/sk-code/**` | Modify | Cross-skill and advisor docs |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rotate Phase 003-owned `.opencode/` references from `sk-improve-prompt` to `sk-prompt`. | Explicit Phase 003 file-list grep returns zero old-name hits. |
| REQ-002 | Preserve command and agent names. | `/prompt` and `@improve-prompt` filenames/names are unchanged. |
| REQ-003 | Preserve code and fixture syntax. | JSON, JSONL, and Python syntax checks pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Rebuild advisor graph after source rotations. | Advisor rebuild completes, or a blocker is documented with exact failure evidence. |
| REQ-005 | Probe prompt routing. | `"improve my prompt"` routes top-1 to `sk-prompt`. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Scoped `.opencode/` grep outside specs and `sk-prompt` returns zero hits for `sk-improve-prompt`.
- Advisor fixtures and scoring code now expect `sk-prompt`.
- Five cli-* prompt quality card mirrors and parent routing tables use `sk-prompt`.

```bash
rg 'sk-improve-prompt' .opencode/ --glob '!**/specs/**' --glob '!**/sk-prompt/**'
bash .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/check-prompt-quality-card-sync.sh
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/z_archive/068-sk-improve-prompt-rename/003-opencode-internals --strict
```
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Broad `.opencode/` grep includes Phase 005 files | Phase 003 cannot make that command return zero without violating explicit constraints | Document residuals and leave Phase 005 for its phase |
| Dependency | Advisor graph metadata consistency | Rebuild aborts before indexing if any skill metadata ID does not match its folder | Document blocker and fix in the owning packet or with explicit approval |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the `deep-agent-improvement` graph metadata `skill_id` mismatch be fixed before Phase 004, or should it remain with the agent rename packet?

### Related Documents

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: [../002-skill-folder-rename/spec.md](../002-skill-folder-rename/spec.md)
- **Successor Phase**: [../004-runtime-mirrors/spec.md](../004-runtime-mirrors/spec.md)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rename must not add runtime overhead; it only changes literals and docs.

### Security
- **NFR-S01**: No secrets, auth paths, or policy logic are introduced.

### Reliability
- **NFR-R01**: Advisor fixtures and syntax-valid config files remain parseable after the rename.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Missing cli-copilot files: document absence and avoid recreating deleted files.
- Phase 005 residuals in broad grep: classify them without editing out-of-phase files.
- Advisor rebuild blocker: record exact metadata mismatch and avoid widening scope without approval.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Files | 25/70 | Broad but mechanical source-reference rotation across existing Phase 003 files. |
| Risk | 20/70 | Advisor scoring and fixtures affect routing behavior. |
| Research | 10/70 | Phase 001 inventory supplied the target ledger. |
| **Total** | **55/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
