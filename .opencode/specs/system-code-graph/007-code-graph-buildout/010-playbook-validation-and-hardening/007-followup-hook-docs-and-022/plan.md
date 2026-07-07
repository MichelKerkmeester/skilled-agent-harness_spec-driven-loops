---
title: "Implementation Plan: Hook-Doc Reconciliation + 022 Re-verify (029 Phase 007)"
description: "Correct stale hook artifact paths in 5 docs and re-verify 022 transitive expansion."
trigger_phrases:
  - "hook doc reconciliation plan"
  - "022 transitive plan"
  - "029 phase 007 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 007 plan"
    next_safe_action: "Edit the 5 stale-path docs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Hook-Doc Reconciliation + 022 Re-verify (029 Phase 007)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs + cli-opencode re-run |
| **Framework** | Devin hooks docs + mk-code-index blast_radius |
| **Storage** | None |
| **Testing** | `rg` path checks + `test -f` + blast_radius counts |

### Overview
Correct the non-existent hook artifact path to the real flat dist path across 5 active docs; re-dispatch 022 against a deep-dependency subject to show transitive > nontransitive.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Real artifact path confirmed (`system-spec-kit/mcp_server/dist/hooks/devin/session-start.js`)
- [x] 5 stale-path docs enumerated

### Definition of Done
- [ ] No active doc cites the non-existent path
- [ ] deferred_decisions carries a dated resolution note
- [ ] 022 transitive verdict resolved
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc edit + verification re-run.

### Key Components
- **5 docs** — stale path → real path.
- **022 re-run** — deep-dependency subject.

### Data Flow
Edit docs → rg/test-f verify; dispatch 022 → capture counts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| deferred_decisions.md | migration tracker | correct path + dated note | rg + read |
| 4 hook READMEs | deprecation notices | correct artifact path | rg + test -f |
| 022 blast_radius | re-verify transitive | re-dispatch deep subject | counts: transitive > nontransitive |

Required inventories:
- All stale-path occurrences: `rg -l 'system-code-graph/dist/system-spec-kit/mcp_server/hooks' .` → 5 active docs in scope; 029 packet records + 026/008 historical packet excluded (they document the finding).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm real artifact path + enumerate in-scope docs

### Phase 2: Core Implementation
- [ ] Fix 4 hook READMEs (artifact path → flat dist)
- [ ] Fix deferred_decisions stale paths + add 2026-05-27 resolution note
- [ ] Re-dispatch 022 with a deep-dependency subject

### Phase 3: Verification
- [ ] rg: no active doc cites the non-existent path; devin artifact `test -f` ok
- [ ] 022 transitive verdict recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | doc path correctness | rg, test -f |
| Integration | blast_radius transitive | cli-opencode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mk-code-index runtime (022 re-run) | Internal | Green | transitive unverified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: doc edit introduces a wrong path.
- **Procedure**: `git checkout --` the affected docs.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Doc fixes ──┐
            ├──► Verification
022 re-run ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Doc fixes | None | Verification |
| 022 re-run | None | Verification |
| Verification | both | parent rollup |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5 min |
| Core | Low-Med | 30 min |
| Verification | Low | 10 min |
| **Total** | | **~45 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Docs git-tracked (revertable)

### Rollback Procedure
1. `git checkout --` the 5 docs
2. Discard 022 evidence if re-run invalid

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
