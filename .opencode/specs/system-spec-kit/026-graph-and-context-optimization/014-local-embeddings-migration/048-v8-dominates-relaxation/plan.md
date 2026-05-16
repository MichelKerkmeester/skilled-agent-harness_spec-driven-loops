---
title: "Implementation Plan: 047 V8 dominates relaxation"
description: "Plan for V8 dominance threshold relaxation, parent-child allowlisting, and live handover verification."
trigger_phrases:
  - "047 plan"
  - "V8 dominates relaxation plan"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/048-v8-dominates-relaxation"
    last_updated_at: "2026-05-14T17:15:00Z"
    last_updated_by: "codex"
    recent_action: "Completed build, targeted tests, live validator, and strict validation"
    next_safe_action: "No further action required for packet 047"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->
# Implementation Plan: 047 V8 Dominates Relaxation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Node.js |
| **Component** | Memory quality validator V8 rule |
| **Testing** | Vitest, TypeScript build, direct CLI validation |
| **Runtime Boundary** | Local filesystem only; no network or agents |

### Overview

Patch the V8 dominance branch next to the existing scattered-foreign relaxation from packet 040. The source change adds named dominance thresholds by document type and makes parent-folder direct child IDs part of the allowed spec set.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 pre-bound to this 047 phase folder.
- [x] Skill routing pre-bound to none; applicable local skill instructions read.
- [x] Source and existing tests read before editing.
- [x] Scope locked to the validator, V8 test file, and 047 docs.

### Definition of Done

- [x] `npm run build` exits 0 from `.opencode/skills/system-spec-kit/scripts`.
- [x] Targeted V8 Vitest passes with T047 coverage.
- [x] Live parent handover validation exits 0 with `QUALITY_GATE_PASS`.
- [x] Strict validation of the 047 packet exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

No new subsystem. V8 still computes current, allowed, foreign, scattered, and dominance signals in one validation pass. The patch adds two small helpers:

- `getDominatesForeignSpecThresholds(filePath)` returns strict or relaxed dominance thresholds.
- `extractDirectChildSpecIds(resolvedSpecFolder)` enumerates and caches direct child folders.

### Data Flow

```
content/filePath
  -> spec_folder frontmatter or path fallback
  -> resolve spec folder
  -> current + ancestor + direct child + sibling + related allowlist
  -> body spec-id counts
  -> doc-type-specific dominance threshold
  -> V8 pass/fail
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read V8 source around dominance and scattered branches.
- [x] Read existing V8 overreach and regex-narrow tests.
- [x] Scaffold 047 packet docs.

### Phase 2: Source Patch and Tests

- [x] Add dominance threshold constants and helper.
- [x] Add cached direct-child folder enumeration.
- [x] Extend T047 Vitest coverage.

### Phase 3: Verification

- [x] Build scripts package.
- [x] Run targeted V8 Vitests.
- [x] Run live validator against parent handover.
- [x] Strict-validate this packet.
- [x] Fill implementation-summary.md with final evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Unit | T040 and T047 V8 overreach behavior | `npx vitest run ../scripts/tests/validate-memory-quality-v8-overreach.vitest.ts` |
| Regression | Existing V8 regex narrowing | `npx vitest run ../scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts` |
| Build | TypeScript compilation and dist refresh | `npm run build` |
| Live validation | Parent handover CLI quality gate | `node .opencode/skills/system-spec-kit/scripts/dist/memory/validate-memory-quality.js <handover.md>` |
| Packet validation | 047 documentation | `validate.sh <047> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing scripts package install | Local npm | Available | Required for build and Vitest. |
| Live 014 handover file | Local doc | Available | Required for reproduction and final check. |
| Packet 040 V8 changes | Prior local work | Present | This patch composes with scattered-foreign relaxation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the validator changes, remove the T047 additions from the V8 overreach test file, and leave this packet documenting the failed attempt. No database, network, branch, or commit state is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Pre-bound Gate 3 and source read | Phase 2 |
| Phase 2 | Existing V8 test context | Phase 3 |
| Phase 3 | Source and tests written | Final handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATION

| Phase | Wall Clock | Owner |
|-------|------------|-------|
| Setup | 10 min | codex |
| Implementation | 20 min | codex |
| Verification | 20 min | codex |
| **Total** | **~50 min** | single dispatch |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Failure | Action |
|---------|--------|
| Build fails | Fix TypeScript in the same source file. |
| T047 tests fail | Adjust threshold or allowlist logic without broadening scope. |
| Live handover still fails | Capture exact V8 output and document partial status. |
| Strict packet validation fails | Patch only 047 docs to satisfy canonical anchors. |
<!-- /ANCHOR:enhanced-rollback -->
