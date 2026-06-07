---
title: "Implementation Plan: Deep-command @general + setup hard-blocker gates"
description: "Copy the canonical model-benchmark Phase 0 block into the 5 deep commands missing it (adapted per command), ensure every command's setup phase is a BLOCKED gate, and standardize the 2 existing commands."
trigger_phrases:
  - "deep command gate plan"
  - "phase 0 gate plan"
  - "unskippable setup plan"
  - "deep command hard blocker plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-deep-command-gate-hardening"
    last_updated_at: "2026-06-07T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan for deep-command gate hardening"
    next_safe_action: "Verify gates via grep, then validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-context-loop.md"
      - ".opencode/commands/deep/start-model-benchmark-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-136-deep-command-gate-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep-command @general + setup hard-blocker gates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command entrypoints (`.opencode/commands/deep/*.md`) |
| **Framework** | deep-loop command contract (EXECUTION PROTOCOL → gates → setup → YAML) |
| **Storage** | Static command docs (no DB) |
| **Testing** | `rg` presence/order checks, `validate.sh --strict` |

### Overview
The model-benchmark command already carries the canonical Phase 0 block. We copy it (adapted: skill name, restart line, indicator) into the 5 commands missing it, amend each EXECUTION PROTOCOL so Phase 0 is step 1 and the BLOCKED setup phase is step 2, and standardize the 2 existing commands. No YAML or skill logic changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Canonical Phase 0 block identified (model-benchmark L7-58)
- [x] Per-command insertion points + setup-phase strength surveyed
- [x] Enforcement level (markdown) confirmed with the user

### Definition of Done
- [x] All 7 commands carry Phase 0 + a BLOCKED setup gate
- [x] Per-command skill/restart text correct; boxes aligned
- [x] `validate.sh --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Uniform two-gate command preamble. Each deep command: `> EXECUTION PROTOCOL` (first action = Run Phase 0) → `# PHASE 0: @GENERAL AGENT VERIFICATION` (STATUS:☐ BLOCKED) → the BLOCKED unified setup phase → YAML/Run.

### Key Components
- **Gate 1**: Phase 0 @general self-check (canonical block, per-command substitutions).
- **Gate 2**: the unified setup phase as a STATUS:☐ BLOCKED gate (STOP/wait interactive; fail-fast :auto).

### Data Flow
Command read → Gate 1 (verify orchestrator) → Gate 2 (resolve + confirm/fail-fast setup) → load YAML / run script.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| context/research/review/ask-ai-council `.md` | Had EXECUTION PROTOCOL + strong setup, no Phase 0 | add Phase 0; renumber first-action; normalize setup marker | `rg PHASE 0` + `rg "Run Phase 0"` |
| start-skill-benchmark-loop `.md` | Thin; stub Phase 0; no BLOCKED setup | add EXECUTION PROTOCOL + Phase 0 + BLOCKED Setup | `rg PHASE 0` + `rg "STATUS: ☐ BLOCKED"` |
| start-model-benchmark-loop `.md` | Had Phase 0; broken display box | fix box alignment | read box lines |
| start-agent-improvement-loop `.md` | Conformant | no change | `rg PHASE 0` |

Required inventories:
- Presence: `for f in .opencode/commands/deep/*.md; do rg -l "PHASE 0: @GENERAL AGENT VERIFICATION" $f; done` → 7.
- Order: each `> **YOUR FIRST ACTION` block lists Run Phase 0 as step 1.
- No logic touched: `git diff` shows only preamble/setup-marker edits, no YAML asset changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify canonical Phase 0 block + per-command insertion anchors
- [x] Survey setup-phase blocker strength across all 7

### Phase 2: Core Implementation
- [x] Add Phase 0 + renumber first-action in context/research/review/ask-ai-council
- [x] Add EXECUTION PROTOCOL + Phase 0 + BLOCKED Setup to skill-benchmark
- [x] Fix model-benchmark display box; normalize setup `STATUS` markers to `☐ BLOCKED`

### Phase 3: Verification
- [x] grep presence/order/restart-line/box across all 7
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Presence | Phase 0 on all 7 | `rg` |
| Order | first-action lists Phase 0 step 1 | `rg` |
| Consistency | restart lines + box alignment + markers | `rg`, Read |
| Doc | spec validity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| model-benchmark canonical Phase 0 | Internal | Green | No template to copy |
| Existing strong setup phases | Internal | Green | More setup hardening needed |
| `validate.sh` strict | Internal | Green | Cannot confirm completion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate wording breaks command execution.
- **Procedure**: `git checkout` the affected command `.md` files; gates are isolated preamble edits with no logic dependencies.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | survey done |
| Core Implementation | Med | repetitive edits across 6 files |
| Verification | Low | scripted greps |
| **Total** | Low-Med | **~1-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations (static docs)
- [x] Reversible via git
- [x] No YAML/asset changes

### Rollback Procedure
1. `git checkout` the deep command `.md` files.
2. Re-run the presence grep to confirm prior state.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
