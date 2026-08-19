---
title: "Implementation Plan: sk-prompt Persona-Injection Alignment"
description: "How the canonical Persona Injection section is installed into the CLI Prompt Quality Card via a pre-written cli-devin build, an independent cline/DeepSeek tool-free verify, and orchestrator reconciliation."
trigger_phrases:
  - "sk-prompt alignment plan"
  - "canonical persona section install plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/004-sk-prompt-alignment"
    last_updated_at: "2026-08-19T11:31:00Z"
    last_updated_by: "claude"
    recent_action: "Card section installed + verified; sk-prompt-improve audited (no edit needed)"
    next_safe_action: "Author P5 verification sweep"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-004-skprompt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-prompt Persona-Injection Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Domain** | Canonical CLI prompt-craft asset (`cli-prompt-quality-card.md`) |
| **Build executor** | `cli-devin` — Gemini 3.7 Flash @ high, `markdown` persona inlined (dogfood) |
| **Verify executor** | `cli-opencode` / cline — DeepSeek V4 Flash @ xhigh, `review` persona, tool-free |
| **Inputs** | `../002-persona-injection-contract/scratch/persona-injection-contract.md` `§1`–`§6` |
| **Output** | 1 modified card + an sk-prompt-improve audit determination |

### Overview
Phase 004 installs the canonical Persona Injection section into the card that all six cli-* mode SKILLs already reference. The orchestrator pre-wrote the section from the P2 contract; `cli-devin` inserted it as §6 and renumbered the trailing sections; `cline`/DeepSeek verified the content tool-free; the orchestrator reconciled and confirmed no `sk-prompt-improve` edit was required.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] P2 contract complete + validated
- [x] P3 mode rules reference the "Persona Injection" section name (the target)
- [x] Card insertion point + renumber anchors pinned

### Definition of Done
- [x] Canonical section present in the card
- [x] Card diff is insertion + renumber only (`64 insertions(+)`, `3 deletions(-)`)
- [x] Independent verify returns no P0/P1
- [x] `sk-prompt-improve` audited; determination recorded
- [x] `validate.sh --strict` passes for this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pre-written canonical section + build + independent verify + reconcile. Same dual-executor pattern as P3, applied to a single canonical file.

### Key Components
- **Canonical section**: rule + resolution table (§6.1) + native-vs-inline table (§6.2) + inline block (§6.3) + guard/exceptions (§6.4).
- **Build dispatch**: three anchored edits (insert §6, renumber 6→7 / 7→8 / 8→9).
- **Verify dispatch**: tool-free `cline`/DeepSeek review of the section against the contract (C1–C7).

### Data Flow
1. Orchestrator pre-writes the section from contract `§1`–`§6`.
2. `cli-devin` inserts §6 and renumbers the trailing headers.
3. Orchestrator confirms the diff is insertion + renumber only.
4. `cline` verifies the section content against the contract.
5. Orchestrator reconciles (Devin-path clarification) and audits `sk-prompt-improve`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the card; pin the insertion point (before `## 6. COMMON...`) + the two trailing headers
- [x] Pre-write the canonical Persona Injection section from the P2 contract

### Phase 2: Core Implementation
- [x] Dispatch `cli-devin` (Gemini Flash, `markdown` persona) to insert §6 + renumber 6/7/8 → 7/8/9
- [x] Confirm the diff is insertion + renumber only; verify final section order

### Phase 3: Verification
- [x] Dispatch `cline`/DeepSeek tool-free (`review` persona) to verify the section vs the contract (C1–C7)
- [x] Reconcile findings (Devin-path clarification); audit `sk-prompt-improve`; run `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Structural | Card sections | `git diff --stat` + `rg "^## [0-9]"` — confirm order 1-5,6 Persona,7,8,9 |
| Content-accuracy | §6 vs contract | Independent `cline`/DeepSeek review (C1–C7) |
| Coverage | sk-prompt-improve | `rg` for dispatch-packaging refs; determine if any owns persona injection |
| Gate | Phase folder | `validate.sh <folder> --strict` Errors:0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| P2 contract | Internal | Green | No section content without it |
| P3 mode rules | Internal | Green | Define the reference target name |
| `cli-devin` / `cli-opencode` | External CLI | Green | Build + verify executors |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The section is inaccurate, or the renumber corrupts a trailing section.
- **Procedure**: `git checkout -- .opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` restores the card; re-run with corrected content. Isolated worktree, nothing pushed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──> Build ──> Verify ──> Reconcile
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | P2 contract | Build |
| Build | Setup | Verify |
| Verify | Build | Reconcile |
| Reconcile | Verify | P5 |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | pre-write canonical section |
| Build | Low | one dispatch, insert + renumber |
| Verify | Low | one tool-free dispatch |
| Reconcile | Low | one clarification + audit |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-dispatch Checklist
- [x] Single target file identified; no other file in scope
- [x] Isolated worktree; committed baseline recoverable

### Rollback Procedure
1. `git checkout -- .../cli-prompt-quality-card.md`.
2. Re-run with corrected section content.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:l2-rollback -->
