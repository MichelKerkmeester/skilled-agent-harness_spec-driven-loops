---
title: "Implementation Plan: Compression Exclusion Guard Utility"
description: "Build a reusable, dependency-free guard (DENY_PATH + DENY_KEYS + citation-survival + raw-hash) that any future compression path must pass through, so control-plane data (generated JSON, metadata, MCP envelopes, state files, diffs, citations) can never reach a compressor."
trigger_phrases:
  - "compression exclusion guard"
  - "deny path deny keys"
  - "compression safety guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-headroom-utilization/003-compression-exclusion-guard"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the compression-exclusion-guard phase"
    next_safe_action: "Decide the guard module location and language"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-003-compression-exclusion-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Compression Exclusion Guard Utility

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Scope** | #2 — Exclusion guard utility |
| **Dependency posture** | None to build. Phase 006 (compress pilot) depends on this guard. |
| **Output** | Scoped, reviewable artifacts under this phase folder |
| **Testing** | Evidence in the report + `validate.sh` |

### Overview
Implement the DENY_PATH/DENY_KEYS guard from the research as a small TS module with a single `guard(artifact)` entrypoint that canonicalizes the path, rejects denied paths, recursively rejects denied JSON keys, captures raw sha256, extracts citations, and returns an allow/deny verdict. Cover it with positive and negative fixtures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Dependencies resolved (None to build. Phase 006 (compress pilot) depends on this guard.)
- [ ] Scope and acceptance criteria confirmed from spec.md

### Definition of Done
- [ ] All P0 requirements met with evidence
- [ ] Report artifact written; `validate.sh` green; STOP for review
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Key Components
- **Path filter**: `DENY_PATH` regexes (generated JSON, state, deltas, canonical docs, instruction files, diffs).
- **Key filter**: `DENY_KEYS` set (jsonrpc/method/params/result/readiness/source_fingerprint/_memory/...).
- **Citation + hash**: extract `[SOURCE:]` set, compute raw sha256.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Scoped to this phase folder and the explicitly named targets in spec.md §3. No authoritative artifact is mutated, and the vendored `../../external/` tree is read-only.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| this phase's artifacts | phase output | create | files present + `validate.sh` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] T001 Port DENY_PATH / DENY_KEYS from the research into a typed module
- [ ] T002 Add the allowlisted copied-bundle artifact kind

### Phase 2: Core
- [ ] T003 Implement guard(): canonicalize → deny-path → recursive deny-key → hash → citation extract
- [ ] T004 Wire raw-on-any-exception fail-safe

### Phase 3: Verification
- [ ] T005 Author positive + negative fixtures; assert 100% rejection of excluded classes
- [ ] T006 Run the test suite green; STOP for review
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence | P0 acceptance criteria | report artifact, measured deltas |
| Validation | spec-folder hygiene | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None to build. Phase 006 (compress pilot) depends on this guard. | Internal | Planned | Phase cannot start/complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Approach fails or evidence is negative.
- **Procedure**: Artifacts are isolated under this phase folder; delete them. No authoritative artifact or vendored upstream is mutated, so rollback is a directory removal.
<!-- /ANCHOR:rollback -->
