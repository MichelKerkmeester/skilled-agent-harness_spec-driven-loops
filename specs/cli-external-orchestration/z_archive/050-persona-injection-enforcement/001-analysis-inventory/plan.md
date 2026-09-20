---
title: "Implementation Plan: Persona-Injection Gap Analysis & Dispatch-Point Inventory"
description: "How the analysis is produced: a cli-devin (Gemini 3.7 Flash @ high) read-only sweep dispatched WITH the context/code agent persona inlined, writing a structured per-mode inventory the orchestrator then verifies claim-by-claim."
trigger_phrases:
  - "persona injection analysis plan"
  - "cli-devin read-only inventory dispatch"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/001-analysis-inventory"
    last_updated_at: "2026-08-19T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Phase 001 plan"
    next_safe_action: "Dispatch cli-devin to produce the inventory"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-001-analysis"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Persona-Injection Gap Analysis & Dispatch-Point Inventory

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Domain** | OpenCode skill/agent documentation + CLI dispatch contracts |
| **Executor** | cli-devin, model `gemini-3-7-flash-high` (fallback `glm-5-2`) |
| **Dispatch persona** | `context` (read-only exploration) with `code`-analysis lens, inlined into the prompt |
| **Output** | `scratch/dispatch-point-inventory.md` |

### Overview
Phase 001 is a read-only investigation. The orchestrator (this Claude session) composes ONE cli-devin dispatch that inlines the resolved agent persona (dogfooding the rule this whole packet adds), points the dispatched model at the exact files, and demands a structured inventory with `file:line` evidence. On return, the orchestrator verifies every load-bearing claim against the real files before accepting, then records the summary. No source files are modified in this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Devin CLI available + authenticated (3000.4.25, logged in)
- [x] cli-devin/SKILL.md read (CLI dispatch preload rule)
- [x] Target file list known (6 modes + hub + sk-prompt + agents roster)

### Definition of Done
- [ ] Inventory artifact exists with all P0 requirements satisfied
- [ ] Every native-vs-inline verdict carries a `file:line` citation
- [ ] Orchestrator has spot-verified a sample of claims against source
- [ ] `validate.sh --strict` passes for this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single read-only delegated sweep + orchestrator verification. No multi-agent fan-out needed (one coherent inventory is easier to verify than fragments).

### Key Components
- **Dispatch prompt**: task + inlined `context` persona + exact file list + required output schema.
- **Inventory artifact**: per-mode table (dispatch surface → persona-loaded? → mechanism → evidence).
- **Verification pass**: orchestrator re-reads a sample of cited lines to confirm no hallucination.

### Data Flow
1. Orchestrator composes the persona-injected dispatch prompt.
2. cli-devin (Gemini 3.7 Flash @ high) reads the target files and writes `scratch/dispatch-point-inventory.md`.
3. Orchestrator verifies cited `file:line` claims.
4. Orchestrator records the findings summary in `implementation-summary.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm devin availability + auth
- [x] Read cli-devin/SKILL.md + cli-prompt-quality-card (dispatch preload)
- [ ] Compose the persona-injected dispatch prompt

### Phase 2: Core Implementation
- [ ] Dispatch cli-devin to produce the inventory artifact
- [ ] Capture output + exit status

### Phase 3: Verification
- [ ] Verify a sample of `file:line` claims against source
- [ ] Confirm all 6 modes + hub + sk-prompt are covered
- [ ] Record findings summary; run validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Coverage | All 6 modes + hub + sk-prompt present in the inventory | Cross-check against mode-registry.json |
| Evidence | Every verdict cites file:line | Orchestrator spot-reads cited lines |
| Completeness | No dispatch surface omitted | Compare against fanout-run.cjs + each mode's dispatch section |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| devin CLI | External | Green (3000.4.25, authed) | Fallback to GLM 5.2 high, else orchestrator does the read itself |
| cli-devin SKILL contract | Internal | Green | N/A |
| deep-loop fanout runtime | Internal | Green | Direct `devin -p` reference path documented |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Inventory is unreliable or incomplete after verification.
- **Procedure**: Discard `scratch/dispatch-point-inventory.md`; re-dispatch with a tighter prompt or fall back to orchestrator-direct reads. No source files touched, so nothing to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──> Dispatch ──> Verify ──> Record
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Dispatch |
| Dispatch | Setup | Verify |
| Verify | Dispatch | Record |
| Record | Verify | P2 |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done |
| Dispatch | Medium | 1 cli-devin round-trip |
| Verify | Medium | orchestrator spot-checks |
| Record | Low | short |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-dispatch Checklist
- [x] No source files in scope (read-only phase)
- [x] Output confined to `scratch/`

### Rollback Procedure
1. Delete `scratch/dispatch-point-inventory.md`.
2. Re-dispatch or fall back to direct reads.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:l2-rollback -->
