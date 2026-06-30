---
title: "Implementation Plan: Phase 3: cross-skill-and-code-refs"
description: "Token-replace the skill ref across 8 sibling skills + the hardcoded code/config, card-sync guard path first, then run the guard."
trigger_phrases:
  - "sk-prompt-models cross-skill plan"
  - "card-sync guard path update"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-sk-prompt-models-rename/003-cross-skill-and-code-refs"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/003-cross-skill-and-code-refs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: cross-skill-and-code-refs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown/JSON/YAML/TS/Python/Shell edits |
| **Framework** | none |
| **Storage** | file-based |
| **Testing** | card-sync guard; secret-scrubber vitest; rg sweep |

### Overview
Update the card-sync guard's hardcoded path FIRST (it is the model-registry gate), then token-replace the skill ref across the 8 sibling skills and the remaining hardcoded code/config (reviewer-regression.json, secret-scrubber test, executor-config comment). Leave the GENERATED advisor index for phase 6.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 2 done (new folder exists)

### Definition of Done
- [x] Card-sync guard path updated; guard runs clean
- [x] All 8 skills + code/config refs updated; secret-scrubber suite passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gate-first ordering. Fix the card-sync guard path before broad edits so the gate is usable as a check throughout.

### Key Components
- **card-sync guard `.sh`**: the model-registry completeness gate (hardcoded path).
- **8 sibling skills**: path/prose refs to the prompt-craft hub.
- **code/config**: reviewer-regression.json, secret-scrubber test, executor-config comment.

### Data Flow
1. Update guard path.
2. Token-replace across the 8 skills + code/config.
3. Run the guard + the secret-scrubber suite + an rg sweep.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Gate first
- [x] Update the card-sync guard `.sh` hardcoded `H` path; run the guard to confirm it resolves the new path

### Phase 2: Cross-skill + code/config
- [x] Token-replace across cli-opencode, deep-loop-workflows, sk-prompt, cli-codex, cli-claude-code, system-spec-kit, deep-loop-runtime, system-skill-advisor (non-generated)
- [x] Update reviewer-regression.json `outputsDir`, secret-scrubber fixture, executor-config comment

### Phase 3: Verify
- [x] Run the secret-scrubber vitest; `rg` over each skill = 0 (minus generated/logs); write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | Registry resolves under new path | card-sync guard `.sh` |
| Unit | Test fixture string updated | `secret-scrubber.vitest.ts` |
| Sweep | No residual cross-skill old name | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 (new folder) | Internal | Pending | Refs would point at a non-existent path |
| card-sync guard | Internal | Available | Cannot verify registry resolution |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate or test breaks.
- **Procedure**: `git checkout` the edited files; text-only, fully reversible.
<!-- /ANCHOR:rollback -->
