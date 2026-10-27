---
title: "Implementation Plan: Phase 23: deep-review-remediation"
description: "Fix the two confirmed P1s at their source with tests that fail first, fix the P2 code paths, and correct the records and docs the review found stale."
trigger_phrases:
  - "deep review remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 23: deep-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (validator), bash and awk (shell rule, scaffolder), Markdown and JSON (records) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest in the spec-kit runtime, `validate.sh --strict` |

### Overview
Two Opus medium lanes fix the code: one owns `orchestrator.ts` and the shell placeholder rule, the other owns `create.sh`. A third lane records a disposition for each phase 020 audit finding. The conductor corrects the docs and records, then reruns the build, the suite and recursive strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each finding adjudicated against the code in `../review/review-report.md`
- [x] The operator chose to narrow phase 010 REQ-001 for SOL-001

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] The spec-kit runtime build exits 0 and the touched test files pass
- [ ] `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer: each change lands where the wrong value is first made.

### Key Components
- **Token-gated fence tracking** in `validatePlaceholders` and the awk `v23` branch: remember the opening marker and close only on a matching one.
- **`--path` resolver** in `create.sh`: resolve an existing target before the containment check.
- **`snapshotPacketFiles`**: digest only the file types the repair writes.

### Data Flow
A doc line goes through fence tracking, then the marker scan, then the finding list. A `--path` value goes through parent resolution, then target resolution when it exists, then the tmp and repository containment checks, then `mkdir`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `orchestrator.ts` token-gated fence | Decides PLACEHOLDER_FILLED for v2.3 docs | Update | New nested-fence test |
| `check-placeholders.sh` v23 awk branch | Shell twin of the same rule | Update | Shell case in the same test, or parity test |
| Legacy (pre-v2.3) fence toggle | Decides verdicts of existing packets | Unchanged: D2 | Strict census unchanged |
| `create.sh --path` | Scaffolds an explicit folder | Update | New symlink test |
| `create.sh --track` | Scaffolds under `specs/<track>` | Unchanged: deliberate symlink support | `create-track-containment.vitest.ts` passes |
| `runDraftAutoRepair` snapshot | Names every file the repair rewrote | Update | Auto-repair tests pass |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup reads the adjudicated report, Implementation runs the three lanes and the conductor's doc fixes, and Verification reruns the build, tests and validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Nested fences in both scanners; `--path` through an existing symlink | vitest, each failing first |
| Integration | The spec-kit runtime suite and recursive strict validation of packet 054 | vitest, `validate.sh` |
| Manual | Spot-check of the phase 020 dispositions | `node -e` over `findings.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The spec-kit runtime build | Internal | Green | Compiled validator tests read stale code |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an existing packet's strict verdict changes, or `create.sh` refuses a path it used to accept inside the repository.
- **Procedure**: revert the phase commit; the record and doc edits revert with it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The review report | Implementation |
| Implementation | Nothing beyond setup; the three lanes share no file | Verification |
| Verification | All lanes and the rebuilt runtime | Close |
<!-- /ANCHOR:phase-deps -->
