---
title: "Implementation Plan: Phase 11: agent-lane-note"
description: "Edit one awareness note in the canonical @deep-agent-improvement agent file and copy it byte-identical into the 3 runtime mirrors, including the codex TOML developer_instructions string."
trigger_phrases:
  - "agent lane note plan"
  - "lane awareness mirror sync"
  - "deep-agent-improvement agent plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/011-agent-lane-note"
    last_updated_at: "2026-05-29T07:36:07Z"
    last_updated_by: "build-agent"
    recent_action: "Plan filled for Lane awareness note across 4 mirrors"
    next_safe_action: "Edit 4 mirror notes byte-identical then validate"
    blockers: []
    key_files:
      - ".opencode/agents/deep-agent-improvement.md"
      - ".claude/agents/deep-agent-improvement.md"
      - ".gemini/agents/deep-agent-improvement.md"
      - ".codex/agents/deep-agent-improvement.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-agent-lane-note"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: agent-lane-note

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + TOML (agent prompt files) |
| **Framework** | OpenCode agent runtime + .claude / .gemini / .codex mirrors |
| **Storage** | None |
| **Testing** | md5-compare of the note line + validate.sh --strict |

### Overview
Replace the single "Mode awareness" note in the canonical agent file with a "Lane awareness" note that frames the skill as two co-equal lanes and clarifies Lane B dispatches MODELS through one agent only. Copy that prose byte-identical into the .claude and .gemini markdown mirrors and into the .codex TOML developer_instructions string.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] md5 of Lane awareness line matches across 4 mirrors
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical-source-plus-mirrors: .opencode is canonical, the other 3 are packaging mirrors kept byte-identical.

### Key Components
- **Canonical agent note**: the source-of-truth prose in `.opencode/agents/deep-agent-improvement.md`.
- **Three mirrors**: .claude markdown, .gemini markdown, and .codex TOML string field.

### Data Flow
Edit canonical note, then apply identical text to each mirror, then md5-compare all 4 to confirm byte-identity.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate the Mode awareness note in all 4 mirrors
- [x] Confirm pre-edit byte-identity via md5

### Phase 2: Core Implementation
- [ ] Edit canonical .opencode note to Lane awareness
- [ ] Apply identical note to .claude and .gemini markdown mirrors
- [ ] Apply identical prose to .codex TOML developer_instructions string

### Phase 3: Verification
- [ ] md5-compare the Lane awareness line across all 4 mirrors
- [ ] Confirm no "Mode awareness" string remains
- [ ] Run validate.sh --strict until PASSED
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Byte-identity | Lane awareness note across 4 mirrors | grep + md5 |
| Doc gate | 011 phase folder | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 009 two-lane framing | Internal | Green | Note vocabulary would lack a source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Note text wrong or mirrors drift.
- **Procedure**: Revert the 4 mirror edits with git checkout of the agent files.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
