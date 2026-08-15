---
title: "Implementation Plan: Packaging and Activation Fixes"
description: "Build communication projection during install, ship its wrapper and example, and verify a real LM Studio configuration path."
trigger_phrases:
  - "packaging-and-activation-fixes"
  - "implementation plan"
  - "communication projection prepare script"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/032-packaging-and-activation-fixes"
    last_updated_at: "2026-08-15T09:15:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed the install, packing, and LM Studio implementation plan."
    next_safe_action: "Use the verified package activation flow."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-032-packaging-and-activation-fixes-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Packaging and Activation Fixes

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Update the package manifest so install builds the existing TypeScript output and packing includes the operator wrapper and local enablement example. Convert the example into one real LM Studio configuration. Normalize its documented API base at the loader boundary, then prove parsing, fail-closed behavior, packed contents, install output, and the complete package gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The package scripts, files allowlist, loader kinds, example, wrapper, plugin, and research findings were read.
- [x] Baseline `npm run check` passed 76 files and 406 tests.
- [x] The existing `lmstudio` kind was confirmed as the correct local OpenAI-compatible route.

### Definition of Done

- [x] Install produces `dist/index.js` through `prepare`.
- [x] The packed file list includes the wrapper and example.
- [x] Focused configuration tests pass for the shipped example and fail-closed cases.
- [x] Final `npm run check` and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The package manifest owns build and artifact projection. The existing loader remains the configuration authority. LM Studio keeps its existing kind and provider-family mapping. A narrow endpoint resolver converts only an LM Studio `/v1` base URL into the concrete chat-completions route used by the transport.

| Component | Responsibility |
|-----------|----------------|
| Package lifecycle | Build ignored TypeScript output during install and pack |
| Package allowlist and bin map | Ship only required operator and built surfaces |
| Enablement example | Provide one copy-paste local LM Studio configuration |
| Local provider loader | Validate config and resolve the actual request endpoint |
| Tests | Read the real example and inspect the real packed artifact |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Package manifest | Build and package projection | Add lifecycle, allowlist, and bin metadata | Install proof and tarball rehearsal |
| Enablement example | Operator copy source | Make LM Studio the sole provider block | Shipped-example parser test |
| Local provider loader | Config validation and record construction | Normalize the LM Studio API base | Focused loader tests |
| Wrapper | Executable runtime entry point | Ship unchanged | Tarball file list and full package gate |
| Package lockfile | Install resolution | Refresh package-local bin metadata | Plain `npm install` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read the required package and research surfaces.
- [x] Capture the full package gate baseline.
- [x] Create this approved phase packet from the required sibling.

### Phase 2: Implementation

- [x] Add `prepare`, operator files, and wrapper bin mapping to the package manifest.
- [x] Replace the decorative example with the real LM Studio provider block.
- [x] Normalize the LM Studio API base in the loader.
- [x] Add focused parsing and packed-artifact assertions.

### Phase 3: Verification

- [x] Run focused tests.
- [x] Remove generated `dist/`, run `npm install`, and confirm install rebuilds it.
- [x] Run final `npm run check`.
- [x] Complete packet evidence, regenerate metadata, and run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Observable Result |
|------|-------------------|
| Shipped example parse | A valid local-offline LM Studio config targets `/v1/chat/completions` |
| Negative parser controls | Absent and malformed input return null without throwing |
| Release rehearsal pack | Tarball file list contains the wrapper and example |
| Fresh install proof | `prepare` invokes build and recreates `dist/index.js` |
| Authoritative package gate | Typecheck, build, 76 or more test files, and import smoke pass |
| Packet gate | Strict validator reports zero errors and warnings |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Use |
|------------|--------|-----|
| Existing TypeScript build | Available | `prepare` delegates to it |
| Existing `lmstudio` loader kind | Available | Selects the local OpenAI-compatible provider record |
| Existing release rehearsal | Available | Creates and clean-installs a real tarball |
| Phase 031 research | Complete | Supplies the verified findings and scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Remove the `prepare` script, operator allowlist entries, and wrapper bin mapping.
- Restore the prior example and endpoint handling.
- Remove the focused assertions.
- Rerun the same package and packet gates.

No data migration, persisted canonical content change, or hosted provider change is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Research findings -> Manifest and example -> Loader normalization -> Focused tests -> Package gate -> Packet closeout
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Manifest and example | Verified Phase 031 findings | Loader and packaging tests |
| Loader normalization | Existing `lmstudio` kind | Focused config tests |
| Verification | All scoped edits | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Package and config edits | Low | Less than one day |
| Focused and full verification | Medium | Less than one day |
| Packet closeout | Low | Less than one day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Baseline `npm run check` passed 76 files and 406 tests. [evidence: `npm run check` baseline]
- [x] The original package allowlist and example shape were recorded. [evidence: `spec.md` problem statement]
- [x] The wrapper and plugin import dependency on `dist/` was confirmed. [evidence: `bin/cli-output-wrapper.mjs` and `.opencode/plugins/mk-communication-projection.js`]

### Procedure

1. Restore the prior package manifest and package lock metadata.
2. Restore the prior example and remove LM Studio base normalization.
3. Remove the focused assertions added by this phase.
4. Rerun `npm run check` and strict packet validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: restore only package files and tests. No canonical or persisted user data changes.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 031 findings
        |
        v
Package manifest ---- Enablement example
        |                    |
        v                    v
Install proof       Loader normalization
        |                    |
        +------ tests -------+
                   |
                   v
          Full package gate
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Package lifecycle | Existing build | Install-built `dist/` | Entry-point load |
| Package allowlist | Existing wrapper and example | Consumer operator files | Tarball activation |
| Loader normalization | Existing LM Studio kind | Concrete request endpoint | Local projection |
| Verification | All scoped edits | Objective receipts | Packet closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Update lifecycle and package projection** - critical.
2. **Make the LM Studio example loader-valid** - critical.
3. **Run install, tarball, package, and packet gates** - critical.

**Parallel opportunities**:

- Loader tests and package manifest assertions are independent after the edits land.
- Packet evidence can be drafted while the package gate runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Package activation metadata complete | `prepare`, allowlist, and bin map present | Complete |
| M2 | LM Studio example complete | Real example parses to chat completions | Complete |
| M3 | Closeout accepted | Package and strict packet gates pass | Complete |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: use the existing build and loader authorities. Add package projection metadata and one narrow LM Studio endpoint normalization rather than creating a new provider kind or launcher-side config parser.

**Status**: Accepted and implemented. Full rationale is in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the named package, plugin, research, and standards surfaces before edits.
- Capture the full package baseline before implementation.
- Keep changes inside the approved package and phase packet.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order and collect evidence after each observable check. |
| TASK-SCOPE | Modify only the package and this approved packet. |
| TASK-PROOF | Rerun focused checks, `npm run check`, metadata generation, and strict validation. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> TASK=T### EVIDENCE=<receipt>`.

### Blocked Task Protocol

If a package check fails, stop completion, diagnose the exact failure, apply a bounded correction, and rerun the authoritative gate.
