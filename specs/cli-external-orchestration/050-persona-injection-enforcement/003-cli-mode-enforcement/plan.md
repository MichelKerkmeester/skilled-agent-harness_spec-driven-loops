---
title: "Implementation Plan: CLI Mode + Hub Persona-Injection Enforcement"
description: "How the persona-injection contract is applied to the six mode SKILLs and the hub via a pre-written-block cli-devin build, an independent cline/DeepSeek tool-free verify, and orchestrator reconciliation."
trigger_phrases:
  - "cli mode enforcement plan"
  - "persona rule build verify plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/003-cli-mode-enforcement"
    last_updated_at: "2026-08-19T11:12:00Z"
    last_updated_by: "claude"
    recent_action: "Build (cli-devin) + verify (cline) + reconcile complete"
    next_safe_action: "Author P4 sk-prompt alignment"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-003-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: CLI Mode + Hub Persona-Injection Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Domain** | External-CLI dispatch enforcement (6 mode SKILLs + hub) |
| **Build executor** | `cli-devin` — Gemini 3.7 Flash @ high (`gemini-3-7-flash-high`), `markdown` persona inlined (dogfood) |
| **Verify executor** | `cli-opencode` / cline — DeepSeek V4 Flash @ xhigh (`cline-pass/cline-pass/deepseek-v4-flash`), `review` persona, tool-free |
| **Inputs** | `../002-persona-injection-contract/scratch/persona-injection-contract.md` `§3`/`§7` |
| **Output** | 7 modified `SKILL.md` files (6 modes + hub) |

### Overview
Phase 003 applies the P2 contract to every dispatch surface. The orchestrator pre-writes the exact rule text per file (its design authority), `cli-devin` applies the insertions verbatim (the plan-named build executor), `cline`/DeepSeek independently verifies tool-free, and the orchestrator reconciles the findings and runs the authoritative gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] P2 contract complete + validated (`002-persona-injection-contract`)
- [x] Per-file insertion anchors pinned (each file's `### ⛔ NEVER` boundary)
- [x] `cli-devin` available + authenticated (`devin auth status` = "Logged in")

### Definition of Done
- [x] All 6 mode SKILLs carry one persona rule; hub carries ALWAYS + REFERENCES bullets
- [x] Diff is pure insertion (`13 insertions(+)`, 0 deletions)
- [x] Independent verify returns no P0/P1
- [x] `validate.sh --strict` passes for this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pre-written-block build + independent verify + orchestrator reconcile. The orchestrator owns the design (exact rule text); the build executor is reduced to precise verbatim insertion; a second model adversarially checks the result; the orchestrator reconciles and gates.

### Key Components
- **Per-file rule blocks**: seven pre-written blocks (`scratch/p3-rule-blocks` capture), each mirroring its file's rule style and stating that mode's `§3` verdict.
- **Build dispatch**: `devin -p --model gemini-3-7-flash-high --permission-mode accept-edits`, `markdown` persona inlined, `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 ... </dev/null`.
- **Verify dispatch**: `opencode run --model cline-pass/cline-pass/deepseek-v4-flash --variant xhigh`, `review` persona inlined, TOOL-FREE (all source inlined; the cline-pass transport leaks DeepSeek tool-call markup otherwise).

### Data Flow
1. Orchestrator pre-writes the 7 blocks from contract `§3`/`§7`.
2. `cli-devin` inserts each block before its file's `### ⛔ NEVER` boundary.
3. Orchestrator reads the scoped `git diff` — confirms pure insertion + correct placement/numbering/cross-refs.
4. `cline` verifies each rule against contract `§3` (C1–C6).
5. Orchestrator reconciles findings and runs `validate.sh --strict`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the build executor SKILL (`cli-devin/SKILL.md`) per the CLI-dispatch preload rule
- [x] Pin each file's insertion anchor + next rule number
- [x] Pre-write the 7 rule blocks from contract `§3`

### Phase 2: Core Implementation
- [x] Dispatch `cli-devin` (Gemini Flash, `markdown` persona) to apply the 7 insertions
- [x] Verify the scoped diff is pure insertion with correct placement/numbering/cross-refs

### Phase 3: Verification
- [x] Read the verify executor SKILL (`cli-opencode/SKILL.md`) per the CLI-dispatch preload rule
- [x] Dispatch `cline`/DeepSeek tool-free (`review` persona) to verify against contract `§3`
- [x] Reconcile findings; run `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Structural | 7 edits | `git diff --stat` — confirm `13 insertions(+)`, 0 deletions, only the 7 target files |
| Contract-accuracy | Each mode's verdict | Independent `cline`/DeepSeek review vs contract `§3` (C1–C6) |
| Cross-reference | Card path + manifest rule number | Verify `../../sk-prompt/...` depth per mode, `../sk-prompt/...` for hub, manifest Rule 11/14 |
| Gate | Phase folder | `validate.sh <folder> --strict` Errors:0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| P2 contract | Internal | Green (validated) | No verdicts or block text without it |
| `cli-devin` (Gemini Flash) | External CLI | Green (authed) | Build executor per plan |
| `cli-opencode` / cline | External CLI | Green (tool-free) | Independent verify leg |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rule is inaccurate against contract `§3`, or the diff touches anything beyond the 7 files.
- **Procedure**: `git checkout -- .opencode/skills/cli-external-orchestration/` restores all 7 files to the committed baseline; re-run the build with corrected blocks. Work is in an isolated worktree, nothing pushed/merged.
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
| Reconcile | Verify | P4 |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | pre-write 7 exact blocks |
| Build | Low | one dispatch, verbatim insertion |
| Verify | Low | one tool-free dispatch |
| Reconcile | Low | one parity clause + gate |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-dispatch Checklist
- [x] 7 target files identified; no file outside the packet in scope
- [x] Isolated worktree; committed baseline recoverable

### Rollback Procedure
1. `git checkout -- .opencode/skills/cli-external-orchestration/` to restore the 7 files.
2. Re-run the build with corrected blocks.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:l2-rollback -->
