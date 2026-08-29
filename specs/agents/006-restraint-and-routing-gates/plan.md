---
title: "Implementation Plan: Pre-Write Restraint and Artifact Routing in AGENTS.md"
description: "Make the restraint doctrine that already exists inside sk-code fire before the first write, by adding an artifact-type trigger to Gate 2 and six pointer-rules to AGENTS.md sections 1, 4, and 8."
trigger_phrases:
  - "restraint routing plan"
  - "agents.md plan"
  - "gate 2 artifact trigger"
  - "implementation"
  - "plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-restraint-and-routing-gates"
    last_updated_at: "2026-08-29T13:43:03Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Executed the nine-line edit map against AGENTS.md"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/sk-code/shared/references/universal/code-quality-standards.md"
      - ".opencode/skills/sk-code/sk-code-review/assets/test-quality-checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-agents-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Pre-Write Restraint and Artifact Routing in AGENTS.md

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Governance/instruction markdown (AGENTS.md family) |
| **Files** | `AGENTS.md` (root, symlinked as `CLAUDE.md` and into every consuming repo) |
| **Storage** | None |
| **Testing** | `validate.sh --strict` + grep-based structural checks + a duplication read against the three source skills |

### Overview
Add one artifact-type trigger to `GATE 2` and six short rules across §1, §4, and §8. Every added rule is a pointer to a contract that already exists in a skill; none restates it. Three existing lines are tightened rather than added to.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The three candidate source skills read directly (`sk-code` shared references, `sk-doc` SKILL.md, `sk-communication` SKILL.md)
- [x] Existing coverage mapped per operator ask, so additions are net-new rather than restatements
- [x] Prior bloat-audit baseline read, so the diff does not re-add what that audit removed
- [x] Enforcement strength, session scope, and line budget confirmed with the operator

### Definition of Done
- [x] Six rules added and three lines tightened; section headers still 1..10
- [x] No added line duplicates the ladder rungs' rationale, the `sk-doc` mode table, or the test-smell list
- [x] `git diff --stat AGENTS.md` shows ≤ 12 changed lines
- [x] Packet validates `--strict` with no errors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
**Root routes, skill decides.** AGENTS.md is loaded on every turn in every runtime, which makes it the only place a rule can fire *before* a skill is invoked — and the worst place to store detail, because detail there is unconditional context cost and drifts from the skill that owns it. So every rule added here does one of two things: it names a trigger (when to reach for a contract) or it names a location (which contract). The rungs, the smells, and the mode tables stay where they are.

### Why the gap exists
The doctrine is not missing; it is late. `sk-code`'s Design Restraint Ladder is explicitly a pre-write reflex, but it only loads once `sk-code` is invoked, and Gate 2 invokes on advisor confidence, which is a property of the *prompt*, not of what the agent is about to write. A prompt like "make the button green" scores low, routes nowhere, and reaches the first write with no restraint loaded. Binding the gate to artifact type closes that path without raising the advisor threshold.

### The six additions and three tightenings

| # | Section | Kind | Rule |
|---|---------|------|------|
| 1 | §2 Gate 2 | Add | Artifact trigger: first code write → `sk-code` surface+mode; first `.md` write → `sk-doc` mode; spec docs → `system-spec-kit` |
| 2 | §2 Gate 2 | Tighten | Output line also reports the resolved artifact route |
| 3 | §2 Gate 2 | Tighten | Skip line exempts single-line edits to a file already read this session |
| 4 | §4 Planning | Add | Restraint ladder pointer, rungs named in order, authority cited |
| 5 | §4 Planning | Add | Read the system before the file; SYSTEMS and SCOPE lenses as a pre-write pass |
| 6 | §4 Debugging | Tighten | Repeat attempt → level up to the seam; a fix that special-cases the caller signals the wrong seam |
| 7 | §4 Quality | Add | Test restraint: a test earns its place by failing for one real reason a current test cannot catch |
| 8 | §1 Plan-Workflow Lock | Add | Step 4: propose the doctrine amendment, do not absorb it |
| 9 | §8 Communication | Add | Reader does not follow → change modality via `sk-communication`, not volume |

### Data Flow
Operator ask → mapped against existing coverage in AGENTS.md and the three skills → net-new set (3 rules) + reachability set (3 pointers) + tightenings (3 lines) → applied in place, no new section.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Analysis
- [x] Read `AGENTS.md` in full and map the sections each operator ask lands in
- [x] Read `sk-code` shared references, `sk-doc` SKILL.md, `sk-communication` SKILL.md for existing coverage
- [x] Separate net-new rules from reachability pointers from tightenings

### Phase 2: Edits
- [x] Apply the Gate 2 artifact trigger and its two tightenings
- [x] Apply the three §4 additions and the §4 debugging tightening
- [x] Apply the §1 doctrine-amendment step and the §8 comprehension rule

### Phase 3: Verification
- [x] Grep section headers (expect sequential 1..10) and confirm no cross-reference moved
- [x] Negative control: confirm each net-new phrase was absent from `AGENTS.md` before the edit
- [x] Duplication read of each added line against its cited source file
- [x] `git diff --stat AGENTS.md` within budget; `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Header sequence, cross-ref integrity, diff size | `grep -nE`, `git diff --stat` |
| Negative control | Each net-new phrase absent from the pre-edit file | `git show HEAD:AGENTS.md \| grep` |
| Contract | Spec-folder validity | `validate.sh --strict` |
| Manual | No-duplication read against `code-quality-standards.md`, `test-quality-checklist.md`, `sk-doc/SKILL.md`, `sk-communication/SKILL.md` | Direct read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `CLAUDE.md → AGENTS.md` symlink | Internal | Green | Confirmed symlink; a single edit covers both, and every consuming repo |
| `validate.sh` reachable in-repo | Internal | Green | Editing from the Public checkout, so the `.opencode` symlink no-op does not apply |
| Source skills unchanged during the edit | Internal | Green | Pointers would dangle if a cited file moved mid-session |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: gate fatigue in practice, a pointer proving stale, or validation failure.
- **Procedure**: `git checkout -- AGENTS.md` reverts every edit in one step; packet docs are additive and removable on the packet path. No runtime state to unwind (documentation-only change).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] `git status AGENTS.md` clean before editing, so the diff is attributable to this packet alone
- [x] Symlink topology confirmed (no second physical copy to edit)
- [x] Baseline line count recorded (542 lines) for the diff-size check

### Rollback Procedure
1. `git checkout -- AGENTS.md`
2. Confirm `grep -c '' AGENTS.md` returns the 542-line baseline
3. Confirm `grep -nE '^## [0-9]+\.' AGENTS.md` shows headers 1..10 unchanged
4. No data reversal needed (documentation-only change)
<!-- /ANCHOR:enhanced-rollback -->
