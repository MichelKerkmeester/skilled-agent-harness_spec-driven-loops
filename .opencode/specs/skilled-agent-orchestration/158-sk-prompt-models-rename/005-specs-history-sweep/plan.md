---
title: "Implementation Plan: Phase 5: specs-history-sweep"
description: "Run the guarded bulk token replace across spec/log/archive/changelog text files, excluding binaries, with the history-care parenthetical."
trigger_phrases:
  - "sk-prompt-models specs sweep plan"
  - "guarded bulk replace plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/005-specs-history-sweep"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan scaffolded; not started"
    next_safe_action: "Run the guarded bulk replace"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/005-specs-history-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: specs-history-sweep

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell bulk text replace |
| **Framework** | none |
| **Storage** | file-based |
| **Testing** | rg sweep; git diff --stat (no binary); validate.sh on touched active docs |

### Overview
Run the phase-1 replace command across the spec/log/archive/changelog TEXT set, restricted to text globs and excluding the phase-1 REGENERATE/binary list. Then hand-apply the history-care parenthetical to the enumerated rename-documenting changelog line(s). Confirm with an rg sweep + a `git diff --stat` that shows no binary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 1 TEXT-REPLACE set + binary exclusion list + history-care lines defined

### Definition of Done
- [ ] Bulk replace applied; only history-care lines remain
- [ ] No binary in `git diff`; touched active docs still validate
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guarded bulk replace. Text-glob-scoped find+replace with an explicit binary/REGENERATE exclusion, plus a small hand-edit for history accuracy.

### Key Components
- **replace command**: the phase-1 text-scoped command (e.g. `rg -l ... -g '!*.sqlite' | xargs perl -pi -e ...` or equivalent).
- **history-care edits**: the enumerated changelog line(s).

### Data Flow
1. Run the guarded bulk replace over the spec/history text set.
2. Hand-fix the history-care line(s).
3. rg sweep + git diff --stat verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Bulk replace
- [ ] Run the phase-1 text-scoped replace over `.opencode/specs/**` (binary-excluded)

### Phase 2: History-care
- [ ] Hand-apply the clarifying parenthetical to the rename-documenting changelog line(s)

### Phase 3: Verify
- [ ] `rg "sk-prompt-small-model" .opencode/specs` = 0 (or only history-care lines); `git diff --stat` has no binary; touched active docs validate; write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sweep | Residual old name in specs | `rg` |
| Binary guard | No DB string-edited | `git diff --stat` + `file` |
| Structure | Touched active spec docs valid | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 map (exclusions + history-care lines) | Internal | Pending | Risk of binary corruption / falsified history |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Bulk replace touches a binary or breaks a doc.
- **Procedure**: `git checkout` the affected paths; re-scope the replace globs; re-run. Text-only changes, fully reversible.
<!-- /ANCHOR:rollback -->
