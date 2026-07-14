---
title: "Implementation Plan: create-benchmark audit remediation"
description: "Fix the create-benchmark two-model audit findings across four disjoint surfaces via parallel Sonnet leaf agents, then verify links, tests, and packager check before commit."
trigger_phrases:
  - "create-benchmark remediation plan"
  - "benchmark audit fix plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-create-benchmark-audit-remediation"
    last_updated_at: "2026-07-14T08:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the remediation plan"
    next_safe_action: "Verify agent outputs, fill checklist"
    blockers: []
    key_files: []
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-benchmark audit remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON docs, Node/CJS runtime, vitest |
| **Framework** | system-spec-kit + sk-doc create-skill canon |
| **Storage** | Filesystem skill trees; no DB schema change |
| **Testing** | vitest (Lane B suites), package_skill.py --check, validate.sh |

### Overview
Fix every P0/P1/P2 finding from the two-model create-benchmark audit by fanning the work across four disjoint directory surfaces (create-benchmark docs; sk-doc hub metadata; deep-improvement code; deep-alignment index) so parallel leaf agents never touch the same file, then reconcile and verify centrally.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Findings confirmed by orchestrator against real files
- [x] P0 direction and spec folder operator-resolved
- [x] Surfaces partitioned so agents cannot collide

### Definition of Done
- [x] All acceptance criteria met
- [x] Lane B vitest suites pass; packager check PASS; 0 new broken links
- [x] validate.sh --strict Errors 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator + disjoint-surface leaf agents (fresh Sonnet 5), central verify-and-commit.

### Key Components
- **create-benchmark packet**: authoring docs/templates (Agent A).
- **sk-doc hub metadata**: routing projections (Agent B).
- **deep-improvement lane**: Lane B code/config + the dir rename (Agent C).
- **deep-alignment lane**: behavior-benchmark index vs baseline (Agent D).

### Data Flow
create-benchmark owns authoring templates → deep-improvement/deep-alignment consume them by reference → the sk-doc hub projects their routing keywords. Fixes keep all three views consistent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create-benchmark/SKILL.md`, `README.md`, refs/assets | Authoring canon for benchmark families | update | `package_skill.py --check`; `grep _shared`==0 |
| `sk-doc/hub-router.json`, `mode-registry.json` | Routing keyword projection | update | JSON valid; Lane A/D keywords present |
| `deep-improvement` Lane B dirs + resolver/tests/allowlist | Consumes fixtures/profiles | rename + update refs | vitest suites pass; resolver path exists |
| `deep-alignment/behavior_benchmark` index | Captured-run index | reconcile to baseline | no stale `300000`/`null` for measured scenarios |
| `deep-improvement/benchmark/*/skill-benchmark-report.json` | Frozen run history | unchanged | byte-identical |

Required inventories:
- Live refs to the two Lane B dirs: `rg -n 'benchmark_profiles|benchmark_fixtures' deep-improvement commands/deep`.
- `_shared` residue: `rg -n '_shared' create-benchmark`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Feature branch off origin/v4; packet scaffolded
- [x] Four surfaces partitioned; agents dispatched

### Phase 2: Core Implementation
- [x] Agent A create-benchmark doc fixes
- [x] Agent B hub routing keywords
- [x] Agent C Lane B rename + contract
- [x] Agent D deep-alignment reconciliation

### Phase 3: Verification
- [x] Orchestrator re-verifies each finding against files
- [x] Link/test/packager gates green
- [ ] validate.sh --strict Errors 0; commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Lane B fixture/profile resolution | vitest |
| Static | Skill package conformance | package_skill.py --check |
| Link | Repo-relative + markdown links | python resolver, grep |
| Spec | Packet integrity | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate.sh --strict` (system-spec-kit) | Internal | Green | Packet integrity cannot be gated |
| vitest Lane B suites (deep-improvement) | Internal | Green | P0 rename cannot be verified |
| `package_skill.py --check` | Internal | Green | create-benchmark packaging cannot be verified |
| Operator P0 direction (hyphen rename) | External | Green | Resolved before dispatch; unblocked the rename |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate regresses (broken link, vitest failure, packager fail) or the dir rename breaks a live consumer.
- **Procedure**: All work is on `fix/create-benchmark-audit-remediation`, isolated from `skilled/v4.0.0.0`. Discard the branch or `git revert` the commit to restore. The dir rename is a `git mv` (fully reversible). No non-git-reversible change.
<!-- /ANCHOR:rollback -->
