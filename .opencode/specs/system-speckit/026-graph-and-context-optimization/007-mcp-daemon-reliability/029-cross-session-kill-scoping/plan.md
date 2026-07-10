---
title: "Implementation Plan: Cross-Session Kill Scoping [system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/029-cross-session-kill-scoping/plan]"
description: "Forensics-first: rank root causes from logs and source, ship the unowned P0 scoping fix and the marker-gated integrity probe, drill both, salvage the live index."
trigger_phrases:
  - "kill scoping plan"
  - "integrity gate plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/029-cross-session-kill-scoping"
    last_updated_at: "2026-06-06T17:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Both fixes shipped and drilled; live index salvaged"
    next_safe_action: "Run an embedding reconcile pass on the recovered index"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cross-Session Kill Scoping

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | bash (cleanup script) + TypeScript (mcp_server store) |
| **Framework** | Existing hook/daemon architecture — unchanged |
| **Storage** | context-index.sqlite (salvage target) |
| **Testing** | Scratch-process drills + corruption drills + tsc |
<!-- /ANCHOR:summary -->

### Overview
Read-only forensics ranked the cross-session cleanup kill as the dominant disconnect path; the fix set is the smallest change that makes the kill provably scoped, plus a boot-time refusal to serve corruption, plus salvage of the already-damaged live index.

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root causes ranked with file:line evidence; already-owned causes left with their phases

### Definition of Done
- [x] All requirements drilled with evidence
- [x] Live index quick_check ok post-swap
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal in-place hardening; no architecture changes.

### Key Components
- Cleanup scoping: identity-required + bounded upward ppid-chain re-proof at kill time
- Integrity gate: marker-gated quick_check at DB open, fail-fast onto the existing checkpoint sentinel path
- Salvage: sqlite3 .recover into a verified candidate, reversible swap

### Data Flow
Stop hook → cleanup (identity-proofed kills only). Daemon boot → marker present? → probe → ok: continue / fail: sentinel + refuse.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| session-cleanup.sh | Stop-hook reaper | scoped + logged | 3 drills |
| vector-index-store.ts open path | DB init | marker-gated probe | corruption drills A/B + tsc + build |
| context-index.sqlite | live index | salvage swap | quick_check ok, 9,888/9,890 rows |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Forensics: logs, cleanup source, proxy limits, lease/lockdir verification (two items already shipped)

### Phase 2: Core Execution
- [x] F1 scoping fix; F2 integrity gate + corruption sentinel writer; dist rebuild

### Phase 3: Verification
- [x] Drills 1-3 (scoping), drills A/B (integrity), live-DB probe, salvage + swap + post-swap probe
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioral drills | Scoping (3 scenarios) + integrity (2 scenarios) | scratch processes + scratch DBs |
| Static | mcp_server typecheck + full build | tsc --build |
| Data | Live index pre/post salvage | sqlite3 quick_check + row counts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing checkpoint sentinel machinery | Internal | Green | F2 reuses it rather than inventing recovery |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Either fix regresses normal cleanup/boot behavior.
- **Procedure**: git revert (both fixes are isolated); DB swap reverses by restoring `.corrupt-20260606` (kept on disk).
<!-- /ANCHOR:rollback -->
