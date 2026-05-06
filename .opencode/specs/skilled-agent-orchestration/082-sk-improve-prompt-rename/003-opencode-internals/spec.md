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
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename/003-opencode-internals"
    last_updated_at: "2026-05-06T12:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase spec scaffold"
    next_safe_action: "Update .opencode consumers outside the sk-prompt skill folder"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Phase 003 Opencode Internals

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
- Update `.opencode/command/improve/prompt.md`, `.opencode/command/improve/README.txt`, and `.opencode/agent/improve-prompt.md` body refs.
- Update advisor scorer lanes `explicit.ts`, `lexical.ts`, `fusion.ts`, `skill_advisor.py`, advisor metadata, sync script, routing fixtures, and regression fixtures.
- Update five cli-* `assets/prompt_quality_card.md` mirrors and parent `SKILL.md` routing tables.
- Update listed cli manual playbooks, `deep-agent-improvement/SKILL.md`, and sk-code advisor integration docs.

### Out of Scope
- Editing `.opencode/skill/sk-prompt/**` skill-local content or `.opencode/specs/**`.
- Editing `.claude/`, `.codex/`, `.gemini/`, root docs, install guides, active changelogs outside this phase.
- Renaming `/improve:prompt`, `@improve-prompt`, or their filenames.
- Running final advisor rebuild and probe battery.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/improve/*`, `.opencode/agent/improve-prompt.md` | Modify | Dispatcher and agent body refs |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/**` | Modify | Scorer and fusion skill ID refs |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modify | TOKEN_BOOSTS, PHRASE_BOOSTS, aliases dict |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/{graph-metadata.json,scripts/**}` | Modify | Metadata, sync script, fixtures, labeled prompts |
| `.opencode/skill/cli-{claude-code,copilot,codex,gemini,opencode}/{SKILL.md,assets/prompt_quality_card.md}` | Modify | Mirrors and parent routing tables |
| `.opencode/skill/cli-copilot/manual_testing_playbook/**`, `.opencode/skill/cli-opencode/manual_testing_playbook/**` | Modify | Listed prompt-card playbooks |
| `.opencode/skill/deep-agent-improvement/SKILL.md`, `.opencode/skill/sk-code/**` | Modify | Cross-skill and advisor docs |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:implementation -->
## 4. IMPLEMENTATION APPROACH

Dispatch cli-codex gpt-5.5 medium fast for this phase. The executor should update `.opencode/` consumers by area, rerun the scoped `rg` after each cluster, and preserve command and agent names while changing only skill references.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:handoff -->
## 5. HANDOFF CRITERIA

- Scoped `.opencode/` grep outside specs and `sk-prompt` returns zero hits for `sk-improve-prompt`.
- Advisor fixtures and scoring code now expect `sk-prompt`.
- Five cli-* prompt quality card mirrors and parent routing tables use `sk-prompt`.

```bash
rg 'sk-improve-prompt' .opencode/ --glob '!**/specs/**' --glob '!**/sk-prompt/**'
bash .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/check-prompt-quality-card-sync.sh
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename/003-opencode-internals --strict
```
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: [../002-skill-folder-rename/spec.md](../002-skill-folder-rename/spec.md)
- **Successor Phase**: [../004-runtime-mirrors/spec.md](../004-runtime-mirrors/spec.md)
<!-- /ANCHOR:related -->
