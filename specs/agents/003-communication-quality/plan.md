---
title: "Implementation Plan: AGENTS.md Communication Quality Section"
description: "Add a dedicated Communication Quality section to root AGENTS.md and reconcile .codex/AGENTS.md with net-new communication-craft principles."
trigger_phrases:
  - "communication quality"
  - "agents.md plan"
  - "voice reconciliation"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/003-communication-quality"
    last_updated_at: "2026-08-07T08:44:03Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented two-homes reconciliation plan"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".codex/AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: AGENTS.md Communication Quality Section

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Governance/instruction markdown (AGENTS.md family) |
| **Files** | `AGENTS.md` (root), `.codex/AGENTS.md` |
| **Storage** | None |
| **Testing** | `validate.sh --strict` + grep-based structural checks |

### Overview
Add a curated `## 8. COMMUNICATION QUALITY` section to the universal `AGENTS.md`, carrying only principles absent from both AGENTS.md files today, and make matching additive edits to the `.codex/AGENTS.md` voice spec so the two agree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source (`context/`) analyzed and net-new vs already-covered principles separated
- [x] Both target files read directly; symlink relationships confirmed
- [x] Placement and file scope confirmed with operator

### Definition of Done
- [x] Root §8 present; §8→§9, §9→§10 renumbered; cross-refs intact
- [x] `.codex/AGENTS.md` reconciled with no contradiction
- [x] Packet validates `--strict` with no errors
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two homes, one authority each. Root `AGENTS.md` = universal cross-runtime core (read by every runtime; mirrored to `CLAUDE.md` by symlink). `.codex/AGENTS.md` = Codex-specific deep voice spec. Root §8 is self-contained and does not reference `.codex`; the `.codex` file keeps its own reconciled edits so the two agree without pointing at each other.

### Net-new principles (the only additive content)
- **Writing**: one idea per sentence / SVO; atomic paragraphs; plain words + progressive jargon disclosure; lead-with-recommendation-but-don't-commit-early.
- **Recommendations & Honesty**: separate required vs optional; name the failure a best practice prevents.
- **Turn Framing**: Ask→Do (restate → 3-7 bullet approach → 1-2 clarifying questions).

### Data Flow
Source heuristics → filtered against existing coverage → net-new set → root §8 (all runtimes) + reconciled `.codex` edits (Codex).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Analysis
- [x] Read `context/` source and both AGENTS.md files directly
- [x] Separate net-new principles from already-covered / contested ones

### Phase 2: Edits
- [x] Insert root §8; renumber §8→§9, §9→§10
- [x] Apply 4 additive reconciliation edits to `.codex/AGENTS.md`

### Phase 3: Verification
- [x] Grep section headers (expect sequential 1..10) and §8/§9/§10 cross-refs
- [x] Confirm no duplication and no contradiction
- [x] `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Header sequence, cross-ref integrity | `grep -nE` |
| Contract | Spec-folder validity | `validate.sh --strict` |
| Manual | No-duplication / no-contradiction read | Direct read vs §1 and `.codex` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `CLAUDE.md → AGENTS.md` symlink | Internal | Green | If not a symlink, CLAUDE.md would drift (confirmed symlink) |
| `validate.sh` | Internal | Green | Cannot prove packet validity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reader confusion, contradiction with `.codex`, or validation failure.
- **Procedure**: `git checkout AGENTS.md .codex/AGENTS.md` to revert both edits; spec docs are additive and can be removed with `git clean` on the packet path. No runtime state to unwind (docs-only).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] Diff scoped to the two AGENTS.md files + packet docs
- [x] Symlink relationships confirmed (no hidden second copy to edit)

### Rollback Procedure
1. `git checkout -- AGENTS.md .codex/AGENTS.md`
2. Confirm `grep -nE '^## [0-9]+\.' AGENTS.md` shows the original 1..9 headers
3. No data reversal needed (documentation-only change)
<!-- /ANCHOR:enhanced-rollback -->
