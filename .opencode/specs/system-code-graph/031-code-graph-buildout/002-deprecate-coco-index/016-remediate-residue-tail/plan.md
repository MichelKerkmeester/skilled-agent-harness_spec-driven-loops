---
title: "Implementation Plan: Close the CocoIndex/rerank deprecation residue tail + record the completeness verdict [template:level_1/plan.md]"
description: "Verify-first sweep (inline-quoted excludes to avoid the shell-mangling false-negative) → classify every hit → fix only the 2 pure-doc dead-path tail items → defer the cross-encoder-subsystem comment → record the verdict."
trigger_phrases:
  - "residue tail plan"
  - "completeness verdict plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/002-deprecate-coco-index/016-remediate-residue-tail"
    last_updated_at: "2026-05-25T16:50:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored plan from the exhaustive sweep verdict"
    next_safe_action: "Commit the residue-tail packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-residue-tail-001"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Close the CocoIndex/rerank deprecation residue tail + record the completeness verdict

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs (deep-loop README, manual_testing_playbook) |
| **Framework** | OpenCode skill docs |
| **Storage** | N/A |
| **Testing** | `rg` grep gates + filesystem existence checks |

### Overview
An exhaustive repo-wide sweep (with the corrected inline-quoted-excludes methodology) classified every coco/ccc/rerank hit into keep-buckets (live pipeline, accurate-history, frozen, generated, legit-prose) vs a 2-item live-doc residue tail. Fix the 2; defer the cross-encoder-subsystem comment; record the verdict.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (grep + existence checks)
- [x] Dependencies identified (014/015 prior packets)

### Definition of Done
- [x] 2 tail items fixed; referenced targets confirmed deleted via `rg --files`
- [x] Kept-exceptions + deferred item documented
- [ ] Commit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation cleanup + completeness verification — no architecture change.

### Key Components
- **Sweep methodology**: per-token greps with `--hidden` + inline-quoted `-g '!...'` excludes (NOT a shell variable — that mangles).
- **Triage rule**: a ref that presents a DELETED artifact as present/usable = residue; accurate-history / frozen / generated / live-subsystem = keep.

### Data Flow
Repo → exhaustive sweep → per-hit classification → fix residue / enumerate keeps.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-loop/README.md:35` | helper-list doc | remove `sidecar_ledger.py` line | `rg --files` → file gone (0) |
| `manual_testing_playbook.md:3314-3316` | test scenario | "CCC stubs/trio" → code_graph handler names | grep no "CCC stubs/trio" |
| `sidecar-client.ts:170` | LIVE embedder code (cross-encoder zone) | DEFER | `ensure-rerank-sidecar.cjs` gone but `cross-encoder.ts` live + `027-xce` arc → operator decision |

Required inventory (done): exhaustive `rg --hidden -i '<per-token>'` with inline-quoted excludes; filesystem existence (`rg --files`) for every referenced artifact before fix-vs-keep.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Exhaustive sweep (corrected methodology) + per-hit triage
- [x] Filesystem existence checks for referenced artifacts

### Phase 2: Core Implementation
- [x] Remove deep-loop README dead `sidecar_ledger.py` line
- [x] Reframe playbook "CCC stubs/trio" → code_graph handler names

### Phase 3: Verification
- [x] grep gates + existence confirmations
- [ ] Commit + record verdict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep gate | 2 tail items removed/reframed | `rg` |
| Existence | referenced artifacts confirmed deleted | `rg --files` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 014/015 prior remediation packets | Internal | Green | precondition met |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a removed line turns out to reference a live file.
- **Procedure**: `git checkout -- <doc>` (2 doc files, no code).
<!-- /ANCHOR:rollback -->
