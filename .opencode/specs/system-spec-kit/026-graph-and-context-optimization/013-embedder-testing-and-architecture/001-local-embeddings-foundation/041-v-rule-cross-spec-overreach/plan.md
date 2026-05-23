---
title: "Implementation Plan: 040 V-rule cross-spec overreach fix"
description: "Three-phase plan for the V8 overreach source patch, regression tests, and live validation."
trigger_phrases:
  - "040 plan"
  - "V8 overreach plan"
importance_tier: "critical"
contextType: "spec"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored implementation plan"
    next_safe_action: "Finish source patch and run targeted verification"
    completion_pct: 20
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->
# Implementation Plan: 040 V-rule cross-spec overreach fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Node.js |
| **Component** | `scripts/lib/validate-memory-quality.ts` V8 rule |
| **Testing** | Vitest, build, direct CLI validation |
| **Runtime Boundary** | No MCP calls; validator invoked directly via Node |

### Overview

Patch V8 candidate extraction and path fallback logic so the validator distinguishes packet IDs from metric labels, ADR numbering, and nested path ancestry. Add focused regression tests and prove the live 037 ADR-003 file passes the quality gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. Quality Gates

### Definition of Ready
- [x] Gate 3 pre-bound to this 040 phase folder.
- [x] Source and existing V8 tests read before editing.
- [x] Scope limited to one source file, one new test file, and this packet.

### Definition of Done
- [ ] `npm run build` exits 0 from `.opencode/skills/system-spec-kit/scripts`.
- [ ] New V8 overreach Vitest passes.
- [ ] Existing V8 regex-narrow Vitest passes.
- [ ] Direct validation of 037 `decision-record.md` exits 0.
- [ ] Strict validation of this 040 packet exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. Architecture

### Pattern

No new subsystem. V8 keeps its existing current/ancestor/sibling/related allowlist and dominance checks. The patch adds small helper functions and explicit constants near the existing regex definitions.

### Key Components

- `SPEC_ID_REGEX`: still finds `NNN-slug` candidates.
- `isValidSpecIdCandidate()`: rejects metric suffixes and immediate ADR contexts.
- `extractSpecFolderFromFilePath()`: scans the path after `/specs/` and returns through the last numbered segment.
- `isHighCrossReferenceDocument()`: identifies docs that legitimately cross-reference more packets.
- V8 scatter logic: threshold is 2 for generic docs and 4 for decision/handover/implementation-summary docs.

### Data Flow

```
content/filePath
  -> spec_folder frontmatter or file-path fallback
  -> current + allowed spec IDs
  -> body/frontmatter candidate extraction
  -> V8 dominance + scattered-reference checks
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. Implementation Phases

### Phase 1: Setup
- [x] Read existing 037 packet shape.
- [x] Read V8 source and existing V8 regression test.
- [x] Create 040 packet directory and docs.

### Phase 2: Source Patch and Tests
- [x] Add metric suffix denylist and ADR-context candidate rejection.
- [x] Add nested file-path fallback extraction.
- [x] Add high-cross-reference document scatter threshold.
- [x] Add T040-01 through T040-05 Vitest coverage.

### Phase 3: Verification
- [ ] Build scripts package.
- [ ] Run new V8 overreach Vitest.
- [ ] Run existing V8 regex-narrow Vitest.
- [ ] Run live validator against 037 ADR-003.
- [ ] Strict-validate this packet.
- [ ] Update implementation-summary.md with actual evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. Testing Strategy

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | T040-01 through T040-05 V8 behavior | `npx vitest run ../scripts/tests/validate-memory-quality-v8-overreach.vitest.ts` |
| Regression | Existing V8 candidate calibration | `npx vitest run ../scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts` |
| Build | TypeScript compilation | `npm run build` |
| Live validation | 037 ADR-003 direct file validation | `node .../validate-memory-quality.js <037 decision-record.md>` |
| Packet validation | 040 docs | `validate.sh <040> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing scripts package install | Local npm | Available | Needed for build and Vitest |
| 037 decision-record.md | Local packet doc | Available | Needed for live validation |
| Strict spec validator | Local shell/Node | Available | Needed for final packet gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. Rollback Plan

Revert `validate-memory-quality.ts`, remove the new `validate-memory-quality-v8-overreach.vitest.ts`, and keep this 040 packet documenting the failed attempt. No runtime state or database mutation is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. Phase Dependencies (Level 2 addendum)

| Phase | Depends on | Blocks |
|-------|------------|--------|
| Phase 1 | Pre-bound Gate 3 | Phase 2 |
| Phase 2 | Source read complete | Phase 3 |
| Phase 3 | Patch and tests written | Final handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. Effort Estimation (Level 2 addendum)

| Phase | Wall-clock | Owner |
|-------|------------|-------|
| Setup | 10 min | main agent |
| Implementation | 20 min | main agent |
| Verification | 20 min | main agent |
| **Total** | **~50 min** | single autonomous dispatch |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. Enhanced Rollback (Level 2 addendum)

| Failure | Action |
|---------|--------|
| Build fails | Fix TypeScript in the same file; do not broaden scope |
| New Vitest fails | Adjust the candidate/scatter logic until requested semantics hold |
| Existing V8 regression fails | Preserve previous candidate exclusions before adding new ones |
| Live 037 ADR still fails | Capture exact V8 message and document as partial |
| Strict packet validation fails | Patch only 040 docs to satisfy canonical anchors |
<!-- /ANCHOR:enhanced-rollback -->
