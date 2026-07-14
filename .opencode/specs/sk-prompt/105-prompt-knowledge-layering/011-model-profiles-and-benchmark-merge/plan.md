---
title: "Implementation Plan: model-profiles-and-benchmark-merge"
description: "Stage the benchmark rename, merge 006 into 005 as two eval subsets, repoint stale citations, and hygiene the registry."
trigger_phrases:
  - "benchmark merge plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/011-model-profiles-and-benchmark-merge"
    last_updated_at: "2026-06-03T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 011 plan"
    next_safe_action: "Validate then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: model-profiles-and-benchmark-merge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Benchmark folders + JSON registry + markdown citations |
| **Framework** | git rename staging; sk-doc benchmark synthesis shape |
| **Storage** | None |
| **Testing** | JSON parse + stale-id grep + guard + validate.sh --strict |

### Overview
Reconcile the user's on-disk benchmark rename in git, merge the two sibling MiniMax-vs-MiMo runs
into 005, repoint every stale citation, and hygiene the registry annotations. The repetitive
citation repoint was delegated to a subagent against an exact id mapping, then verified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Rename mapping confirmed 1:1; merge shape locked

### Definition of Done
- [ ] Merge done; citations repointed; JSON valid; guard green; validate --strict exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One benchmark per comparison, two eval subsets when a comparison spans two fixture sets.

### Key Components
- **benchmarks/005/** — the merged capability benchmark (two eval subsets + a top synthesis).
- **model-profiles.json** — the registry, evidence fields refreshed to the new ids.
- **profiles + indexes** — citations point at `benchmark 00N`.

### Data Flow
Profiles cite the registry; the registry cites the benchmark folder; the benchmark folder holds the run data.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the rename mapping + git state; read both synthesis files.

### Phase 2: Core Implementation
- [x] Merge 006→005 (two eval subsets) + author merged synthesis
- [x] Repoint ~40 stale citations (delegated, verified) + JSON hygiene
- [x] Scrub pattern-index ephemeral spec-phase refs

### Phase 3: Verification
- [ ] JSON valid + stale-id grep clean + guard green + validate --strict + stage rename + commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Merge subsets + 006 removed | ls/find |
| Citations | No stale ids in active docs | grep |
| Registry | Valid JSON | python3 -m json.tool |
| Doc | Spec-folder integrity | validate.sh --recursive --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| User's on-disk rename | Internal | Staged here | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a citation repoint is wrong or the JSON breaks.
- **Procedure**: per-file git revert; the merge is a local file reorg re-derivable from the run data.
<!-- /ANCHOR:rollback -->
