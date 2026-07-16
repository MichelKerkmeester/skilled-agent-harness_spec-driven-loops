---
title: "Implementation Plan: Phase 4: commands-scripts-data"
description: "Token-replace the skill path in the deep_*.yaml workflows, the pre-commit hook, the agent ref, and benchmark run-pointers; validate the YAML paths."
trigger_phrases:
  - "sk-prompt-models commands plan"
  - "deep yaml path rename plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-models-rename/004-commands-scripts-data"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/004-commands-scripts-data"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: commands-scripts-data

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML/Markdown/Shell/JSON edits |
| **Framework** | deep-loop command workflows |
| **Storage** | file-based |
| **Testing** | rg sweep; YAML parse |

### Overview
Token-replace `sk-prompt-small-model` across the deep_model-benchmark + deep_context command YAMLs (output/promote/framing paths), the model-benchmark prose doc, the pre-commit hook, the agent ref, and any benchmark run-pointers. Confirm with a commands/scripts/agents rg sweep and a YAML parse.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 2 done (benchmarks dir lives under the new path)

### Definition of Done
- [x] All command/script/agent/run-pointer paths updated
- [x] `rg` over commands/scripts/agents = 0; YAMLs parse
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Path repointing. The workflows consume the skill's benchmarks dir + SKILL.md by hardcoded path; repoint them all.

### Key Components
- **deep_model-benchmark_{auto,confirm}.yaml**: benchmark output + promote paths.
- **deep_context_{auto,confirm}.yaml**: prompt_framing loader.
- **pre-commit hook / agent / run-pointers**: misc path refs.

### Data Flow
1. Replace token in the command YAMLs + docs.
2. Replace in the hook + agent + run-pointers.
3. rg sweep + YAML parse to confirm.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Commands
- [x] Token-replace in deep_model-benchmark_{auto,confirm}.yaml + deep_context_{auto,confirm}.yaml + model-benchmark.md

### Phase 2: Scripts/agents/pointers
- [x] Update pre-commit hook, the agent ref, and benchmark run-pointers

### Phase 3: Verify
- [x] `rg` over commands/scripts/agents = 0; YAML parse; write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sweep | No residual old name in commands/scripts/agents | `rg` |
| Parse | Edited YAMLs valid | a YAML parser / dry workflow read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 (new benchmarks dir) | Internal | Pending | Paths would point at a dead dir |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A workflow path or YAML parse breaks.
- **Procedure**: `git checkout` the edited files; text-only, fully reversible.
<!-- /ANCHOR:rollback -->
