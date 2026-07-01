---
title: "Implementation Plan: Phase 13: design-fidelity-and-polish [template:level_1/plan.md]"
description: "Resolve the usage_limited design fork with operator input, fix packet-wide fingerprints, downgrade a completion overclaim, and add 2 small observability improvements."
trigger_phrases:
  - "implementation"
  - "plan"
  - "design fidelity polish"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/013-design-fidelity-and-polish"
    last_updated_at: "2026-07-01T10:04:53Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan from deep-research findings"
    next_safe_action: "Get operator decision on usage_limited before implementing"
    blockers:
      - "REQ-001 (operator decision) blocks REQ-002"
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-013"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: design-fidelity-and-polish

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (`mk-goal.js`), Markdown/YAML frontmatter (phase doc metadata) |
| **Framework** | N/A — direct edits, one design decision gate |
| **Storage** | Phase doc `_memory.continuity` frontmatter (fingerprint fix) |
| **Testing** | Existing `mk-goal-*.test.cjs` suite (must stay green after the `mk-goal.js` touches) |

### Overview
Five independent, low-blast-radius items: one requires an explicit operator decision before any implementation (`usage_limited`), the other four are direct fixes with no cross-dependency. Sequenced last in this remediation because none is a P0/P1 blocker.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [ ] Operator decision obtained for REQ-001 before REQ-002 implementation begins
- [x] Success criteria measurable

### Definition of Done
- [ ] REQ-001 decision recorded; REQ-002 implements it
- [ ] REQ-003 through REQ-006 landed
- [ ] Existing test suite still green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Independent point-fixes; no new components.

### Key Components
- **`VALID_STATUSES`/status-transition code** (`mk-goal.js:50-57`, various write sites): REQ-002's target, shape depends on the operator's REQ-001 decision.
- **Phase doc frontmatter** (`_memory.continuity.session_dedup.fingerprint`, 8 files): REQ-003's target.
- **`006-active-continuation/implementation-summary.md`**: REQ-004's target.
- **`fsyncDirectory`** (`mk-goal.js:697`): REQ-005's target.
- **`goalStateLines`/status builder** (`mk-goal.js:1402`): REQ-006's target.

### Data Flow
No shared data flow between these 5 items — each is independently scoped.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Lower-severity findings (P2/P3) from deep-research; no security/path-handling/persistence-critical surfaces beyond the already-safe `usage_limited` dormant-but-safe gates research already confirmed (injection/verifier/continuation gates all correctly exclude non-`active` statuses regardless of which `usage_limited` resolution is chosen).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `VALID_STATUSES` + write sites | `usage_limited` declared, never written (F-003/F-014) | Collapse or wire, per operator decision | `grep -n "usage_limited"` before/after; existing gates (injection/verifier/continuation) re-confirmed to still exclude non-active statuses correctly |
| Phase doc frontmatter (8 files) | All-zero fingerprint placeholder (F-012) | Recompute real values | `grep -rn "sha256:0000...0000"` returns zero hits post-fix |
| `006-active-continuation/implementation-summary.md` | Overclaims 100% completion (F-010) | Downgrade `completion_pct`, align `recent_action` | Read diff; `next_safe_action` and `recent_action` no longer contradict each other |
| `fsyncDirectory` | Silently swallows errors (F-016) | Add `MK_GOAL_DEBUG`-gated logging | Simulated fsync failure produces a log line under debug mode |
| `goalStateLines` | No store-health dimension (F-017) | Add a new status field | New field appears in `/goal show` and `mk_goal_status` output |

Required inventories:
- Same-class producers: `rg -n 'usage_limited' .opencode/plugins/mk-goal.js .opencode/skills/**/*.md` to find every reference needing update under either REQ-002 resolution.
- Consumers of changed symbols: `rg -n 'sha256:0000000000000000000000000000000000000000000000000000000000000000'` to find all 8+ fingerprint placeholders precisely.
- Matrix axes: (a) collapse vs wire for `usage_limited`, (b) 8 independent phase docs for the fingerprint fix, (c) debug-mode-on vs off for the fsync logging test, (d) store-health field present in both `/goal show` and `mk_goal_status` code paths (they share `goalStateLines`, so one fix should cover both — confirm this during implementation).
- Algorithm invariant: none of these 5 changes may alter the existing fail-closed/fail-open guarantees already confirmed by phases 010's fixes or the existing test suite — verify by re-running the full suite after each item.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] REQ-001: present both `usage_limited` forks to the operator (collapse vs wire, with research's documented trade-offs) and obtain a decision before proceeding to REQ-002.

### Phase 2: Core Implementation
- [ ] REQ-002: implement the operator's chosen `usage_limited` resolution.
- [ ] REQ-003: recompute real fingerprints across all 8 phase docs.
- [ ] REQ-004: downgrade phase 006's completion metadata.
- [ ] REQ-005: add `fsyncDirectory` error logging.
- [ ] REQ-006: add the store-health status dimension.

### Phase 3: Verification
- [ ] Existing test suite (plus phase 012's additions, if landed) still passes.
- [ ] `grep` confirms zero remaining all-zero fingerprints.
- [ ] Manual confirmation of the new store-health field and fsync-error log line.
- [ ] `implementation-summary.md` filled with fresh evidence, including the recorded REQ-001 operator decision.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (existing) | All `mk-goal.js` changes (REQ-002/005/006) must not break the current suite | `node --test` / direct execution |
| Manual | Fingerprint recomputation, completion-metadata downgrade, fsync logging, store-health field | Direct file inspection + `node -e` ad hoc invocation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Operator decision (REQ-001) | External (human input) | Required before REQ-002 | REQ-002 stays `[B]` blocked until decided; the other 4 requirements can proceed independently |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any of the 5 independent fixes regresses an existing test.
- **Procedure**: each item touches distinct, isolated surfaces (code vs 8 doc files vs 1 doc file) — revert per-item via `git checkout -- <files>` without affecting the others.
<!-- /ANCHOR:rollback -->
