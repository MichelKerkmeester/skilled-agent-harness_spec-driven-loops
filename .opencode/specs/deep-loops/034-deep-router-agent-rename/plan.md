---
title: "Implementation Plan: Rename the deep router agent to deep-loop"
description: "A scoped, mechanical rename of the primary deep-loop router agent from `deep` to `deep-loop` across three runtime mirrors, plus the bare `@deep` references in the orchestrate routing mirrors. No behavior change; identity only."
trigger_phrases:
  - "deep router rename plan"
  - "deep-loop agent plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "deep-loops/034-deep-router-agent-rename"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "claude-code"
    recent_action: "Planned the scoped rename and its verification path"
    next_safe_action: "Validate, commit the tracked rename, and push"
    blockers: []
    key_files:
      - ".opencode/agents/deep-loop.md"
      - ".claude/agents/deep-loop.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-deep-router-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Rename the deep router agent to deep-loop

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions (OpenCode / Claude / Codex runtimes) |
| **Framework** | Deep-loop agent routing |
| **Storage** | None |
| **Testing** | Ripgrep reference verification |

### Overview
Rename the primary router agent `deep` to `deep-loop`. The rename is identity-only: the file name, the `name:` frontmatter field, the intra-file mirror notes, and the bare `@deep` references in the three orchestrate routing mirrors. No routing logic, command, or registry entry changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Reference verification passing (zero bare `@deep` router refs remain)
- [x] Docs updated (spec/plan/tasks/summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Cross-runtime mirrored agent definitions. The router agent is defined once per runtime directory (`.opencode/agents/`, `.claude/agents/`, `.codex/agents/`) and kept in parity.

### Key Components
- **Router agent definition**: `deep-loop.md` - resolves `/deep:*` requests through `mode-registry.json` and dispatches one leaf agent.
- **Orchestrate mirrors**: `orchestrate.md` - carry a routing boundary that forbids Task-dispatching the router directly.

### Data Flow
User `/deep:*` request → router agent (`deep-loop`) resolves the mode via the registry → dispatches the matching leaf agent. The rename touches only the router's identity, not this flow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Rename
- [x] `git mv` the two tracked router files (`.opencode`, `.claude`) `deep.md` → `deep-loop.md`
- [x] Rename the untracked codex router mirror on disk for runtime parity
- [x] Set `name: deep-loop` and repoint the mirror-note paths in all three files

### Phase 2: Reference update
- [x] Replace bare `@deep` → `@deep-loop` in the three orchestrate mirrors using a negative-lookahead pattern that spares `@deep-<mode>`

### Phase 3: Verification
- [x] Confirm zero bare `@deep` router refs remain in live files
- [x] Confirm `name: deep-loop` in all three mirrors and codex parity with opencode
- [x] Strict spec validation and scoped commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reference | Bare `@deep` router refs across live agent/orchestrate files | ripgrep with `@deep(?![-\w])` |
| Parity | Codex mirror vs opencode mirror | diff |
| Spec | Level-1 doc integrity | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mode-registry.json unchanged | Internal | Green | Router resolution would break if the registry named the router by bare name (it does not) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A runtime fails to resolve the router under `deep-loop`, or a leaf dispatch breaks.
- **Procedure**: `git revert` the rename commit (restores `deep.md` and the original `@deep` references); the untracked codex mirror is renamed back on disk manually.
<!-- /ANCHOR:rollback -->
