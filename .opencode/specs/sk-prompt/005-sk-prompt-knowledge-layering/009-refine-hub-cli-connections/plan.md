---
title: "Implementation Plan: refine-hub-cli-connections"
description: "Dependency-ordered remediation of the C1–C10 research backlog: STAR/fallback fix first, then K1 pointer-ization, mechanics + cluster + checklist, then the K2 guard extension + CI wiring last."
trigger_phrases:
  - "refine hub cli plan"
  - "c1 c10 remediation"
  - "keystone pointer-ize guard cluster"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/009-refine-hub-cli-connections"
    last_updated_at: "2026-06-03T06:14:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 009 plan"
    next_safe_action: "Implement C3 STAR/fallback fix"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: refine-hub-cli-connections

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON docs; one Bash guard script; git hook/CI config |
| **Framework** | spec-kit skills (`sk-prompt`, `sk-prompt-models`, `cli-*`, `system-skill-advisor`) |
| **Storage** | None (file edits) |
| **Testing** | The extended `check-prompt-quality-card-sync.sh` guard + `grep` invariants + `validate.sh --strict` |

### Overview
Implement the converged C1–C10 backlog from `../research/research.md`. The technical approach is
"single home + pointer": move each duplicated fact to its one canonical surface, replace the
copies with links, then teach the sync guard to enforce that and wire it into the commit path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (research converged)
- [x] Success criteria measurable (SC-001..005 in spec.md)
- [x] Dependencies identified (C9 ← C1 + C8; C1/C2 ← C3)

### Definition of Done
- [ ] All C-items implemented or explicitly deferred with reason
- [ ] Extended guard green on clean tree, red on each planted regression
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary) + per-skill changelogs
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-ownership + pointer (the "guardable-restatement rule"): restate a fact only where there is
a 1:1 machine-diffable relationship to its source (profile↔registry row); everywhere many-to-one,
link.

### Key Components
- **Canonical card** (`sk-prompt/assets/cli_prompt_quality_card.md`): the single home of the precedence rule + Tier-3 triggers.
- **Hub** (`sk-prompt-models`): per-model profiles + registry + `_index.md` + pattern-index.
- **Executors** (`cli-*`): mechanics only; pointers for craft.
- **Guard** (`check-prompt-quality-card-sync.sh`): the regression gate, extended + CI-wired.

### Data Flow
Operator → `cli-*/SKILL.md` (mechanics + pointers) → canonical card (craft) + hub profile
(per-model choice) → registry (data). The guard verifies the pointers stay pointers and the
3-way registry↔profile↔`_index` set stays complete.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt/assets/cli_prompt_quality_card.md` | Canonical precedence + Tier-3 triggers (producer) | unchanged (it is correct) | grep: still the only enumeration |
| `cli-*/SKILL.md` Tier-3 lines | Consumers that drifted (4/5) / restate (cli-devin) | update → pointer | grep: no enumeration remains |
| `sk-prompt-models/SKILL.md` STAR list + checklist | Hub policy doc | update (C3, C8) | grep STAR; one checklist |
| `references/models/swe-1.6.md`, `_index.md` | Profile + index restating registry | update to match `fallback: null` | diff vs registry |
| `cli-{opencode,devin}` cards + 4 cluster profiles | Navigability endpoints | add bidirectional links | round-trip grep |
| `cli-opencode/graph-metadata.json` | Discovery triggers | add kimi/qwen/glm | advisor probe |
| `check-prompt-quality-card-sync.sh` + CI/hook | Regression gate | extend + wire | planted-regression test |

Required inventories:
- Precedence enumeration sites: `rg -n 'compliance.*(privacy|security)|stakeholder' .opencode/skills/cli-*/SKILL.md`.
- STAR references: `rg -n 'STAR' .opencode/skills/sk-prompt-models`.
- Cluster link round-trip: `rg -n 'prompt_quality_card|models/(deepseek|kimi|qwen|glm)' .opencode/skills/cli-*/assets/prompt_quality_card.md`.
- Invariant: every fact appears as an enumeration in exactly one file; every other mention is a link.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] C7 dispatch matrix confirmed (kimi/qwen/glm → cli-opencode; qwen exclusive)
- [ ] Read each target file's exact current state before editing (READ-FIRST law)

### Phase 2: Core Implementation (dependency order)
- [ ] **C3** STAR/fallback fix (hub SKILL.md + swe-1.6.md) — unblocks C1/C2
- [ ] **C4** _index.md fallback column (tail of C3)
- [ ] **C1** pointer-ize Tier-3 in all 5 cli SKILL.md (keystone K1)
- [ ] **C2** pointer-ize cli-devin framework restatement (K1)
- [ ] **C5** defer mechanics: mimo + minimax-m3 wrappers → rule + pointer
- [ ] **C8** reconcile + complete the new-provider checklist
- [ ] **C6** cluster DRY note + bidirectional card↔profile links (keystone K3)
- [ ] **C7** add kimi/qwen/glm to cli-opencode triggers (K3)
- [ ] **C9** extend + CI-wire the sync guard (keystone K2) — after C1 + C8
- [ ] **C10** refresh hub graph-metadata.json

### Phase 3: Verification
- [ ] Extended guard: exit 0 clean; non-zero on each planted regression (precedence-inline, missing _index row, unreachable model)
- [ ] grep invariants (SC-002, SC-003, SC-004)
- [ ] `validate.sh --recursive --strict` on the 130 parent → exit 0 (SC-005)
- [ ] Per-skill changelog entries
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | Drift/pointer/completeness/reachability invariants | `check-prompt-quality-card-sync.sh` (extended) |
| Invariant | STAR-clean, pointer-only, cluster round-trip | `rg` / `grep` |
| Doc | Spec-folder integrity | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Research backlog C1–C10 | Internal | Green (converged) | — |
| C3 before C1/C2 | Internal | Sequenced | Pointer text would re-cite STAR |
| C1 + C8 before C9 | Internal | Sequenced | Guard would lock a dirty state |
| Repo CI/hook surface for C9 | Internal | Yellow | Fall back to a documented git hook entry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: guard cannot be made green, or a pointer-ization breaks an existing in-skill link.
- **Procedure**: all changes are isolated doc/JSON/script edits on `main`; revert per-file via git. No data migration, no runtime state, so per-C revert is safe and independent.
<!-- /ANCHOR:rollback -->
