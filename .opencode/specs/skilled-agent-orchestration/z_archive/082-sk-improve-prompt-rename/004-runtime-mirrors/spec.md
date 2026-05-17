---
title: "Feature Specification: Phase 004 Runtime Mirrors"
description: "Update non-OpenCode runtime mirror bodies so Claude, Codex, and Gemini agent or command mirrors reference sk-prompt. Agent filenames and agent names remain unchanged."
trigger_phrases:
  - "082 phase 004"
  - "sk-improve-prompt runtime mirrors"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename/004-runtime-mirrors"
    last_updated_at: "2026-05-06T13:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase complete via direct sed (CLI dispatch unreliability rule applied)"
    next_safe_action: "Phase 005 root and config"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
# Feature Specification: Phase 004 Runtime Mirrors

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Pending |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `082-sk-improve-prompt-rename` |
| **Phase** | 004 of 006 |
| **Handoff Criteria** | `rg 'sk-improve-prompt' .claude/ .codex/ .gemini/` returns 0 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Runtime mirror files outside `.opencode/` still contain skill-loading references to the old skill ID. These body references must move to `sk-prompt`, while visible agent and command names stay stable.

### Purpose
Phase 004 updates only `.claude/`, `.codex/`, and `.gemini/` mirror bodies that reference `sk-improve-prompt`, then proves those runtime trees have no remaining active refs.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `.claude/agents/improve-prompt.md` body references.
- Update `.codex/agents/improve-prompt.toml` body references.
- Update `.gemini/agents/improve-prompt.md` body references.
- Update `.gemini/commands/improve/README.txt`.
- Verify and update `.gemini/commands/create/prompt.toml` if it contains old skill references.

### Out of Scope
- Renaming agent files, agent names, `/improve:prompt` command mirrors, or command files.
- Editing `.opencode/` internals, skill-local files, root docs, or install guides.
- Updating generated graph data, advisor fixtures, or final recursive validation state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/agents/improve-prompt.md` | Modify | Claude agent body refs only |
| `.codex/agents/improve-prompt.toml` | Modify | Codex agent body refs only |
| `.gemini/agents/improve-prompt.md` | Modify | Gemini agent body refs only |
| `.gemini/commands/improve/README.txt` | Modify | Gemini command README body refs |
| `.gemini/commands/create/prompt.toml` | Verify/Modify | Update only if old refs exist |
<!-- /ANCHOR:scope -->

---


<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Phase scope is mechanical reference rotation. Acceptance criteria covered in HANDOFF CRITERIA.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All in-scope files have zero `sk-improve-prompt` literal references
- Phase folder strict validation passes
- Advisor / runtime continues to dispatch correctly to `sk-prompt`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Race against parallel orchestration sessions touching overlapping files (mitigated: direct sed under heavy parallelism, per memory rule)
- Generated index files (`descriptions.json`) cannot be hand-rotated; refresh via `generate-context.js` during final memory save
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at completion.
<!-- /ANCHOR:questions -->

---


<!-- ANCHOR:implementation -->
## 4. IMPLEMENTATION APPROACH

Dispatch cli-codex gpt-5.5 medium fast for this phase. The executor should edit mirror body text only, verify filenames and public agent names are unchanged, and then run the runtime-tree grep as the phase gate.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:handoff -->
## 5. HANDOFF CRITERIA

- Runtime mirror bodies load or mention `sk-prompt` instead of `sk-improve-prompt`.
- Agent files remain named `improve-prompt`.
- `rg 'sk-improve-prompt' .claude/ .codex/ .gemini/` returns 0.

```bash
rg 'sk-improve-prompt' .claude/ .codex/ .gemini/
test -f .claude/agents/improve-prompt.md && test -f .codex/agents/improve-prompt.toml && test -f .gemini/agents/improve-prompt.md
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename/004-runtime-mirrors --strict
```
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: [../003-opencode-internals/spec.md](../003-opencode-internals/spec.md)
- **Successor Phase**: [../005-root-and-config/spec.md](../005-root-and-config/spec.md)
<!-- /ANCHOR:related -->
