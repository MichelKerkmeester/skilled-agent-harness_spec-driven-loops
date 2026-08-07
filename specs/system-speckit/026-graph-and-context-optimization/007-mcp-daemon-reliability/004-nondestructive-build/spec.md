---
title: "Feature Specification: Non-destructive mcp-server build (stop wiping live dist on rebuild — RC-4)"
description: "The mcp_server build's prebuild step rmSync-wipes the live dist/ before recompiling, which crashes any running daemon mid-rebuild (MODULE_NOT_FOUND on lazy imports) and defeats tsc incremental builds. This packet removes the destructive auto-clean so rebuilds are non-destructive and incremental."
trigger_phrases:
  - "non-destructive mcp build"
  - "prebuild clean wipes dist"
  - "rebuild crashes daemon RC-4"
  - "tsc incremental build dist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/004-nondestructive-build"
    last_updated_at: "2026-05-28T20:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Removed destructive prebuild clean; build now incremental + non-destructive; verified"
    next_safe_action: "None; F4 complete pending strict validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000310"
      session_id: "031-nondestructive-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Only mcp_server had the destructive prebuild clean; shared + scripts already build incrementally"
      - "Composite tsc + project references make a dist.next staging dir fight outDir; in-place incremental is the correct fix here"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Non-destructive mcp-server build (stop wiping live dist on rebuild — RC-4)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `@spec-kit/mcp-server` build runs `prebuild` → `clean` → `rmSync('dist', {recursive,force})`, deleting the **live** `dist/` before `tsc --build` repopulates it over several seconds. Any running daemon that lazy-imports a module during that window hits `MODULE_NOT_FOUND` and crashes (RC-4 in packet 030). The wipe also deletes `dist/tsconfig.tsbuildinfo`, forcing a full (slow) recompile every time instead of an incremental one.

### Purpose
Rebuilding the mcp-server no longer destroys the live `dist/`, so a running daemon survives a rebuild, and builds become incremental (fast).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the destructive auto-`prebuild` clean from `@spec-kit/mcp-server`.
- Keep an explicit `clean` and add an explicit `rebuild` (clean + build) for intentional full rebuilds.
- Verify the build stays complete, non-destructive, and incremental with no orphan/freshness regression.

### Out of Scope
- `@spec-kit/shared` and `@spec-kit/scripts` builds — verified they have no destructive prebuild (already `tsc --build` only).
- A `dist.next` staging-dir + atomic-rename build — the composite tsc + project-references setup makes per-invocation `outDir` redirection fragile; in-place incremental already satisfies "never destroy the live dist" for this build.
- The other 030 fixes (F1′/F2′/F3′) — separate packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modify | Drop `prebuild` auto-clean; add `rebuild`; keep `clean` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `npm run build` must not delete the live `dist/` | After a build, `dist/` and its required artifacts are present throughout; no `rmSync(dist)` runs on the default build path |
| REQ-002 | The build must still produce a complete, correct `dist/` | `finalize-dist.mjs` `assertRequiredArtifacts()` passes; `context-server.js`, `api/index.js`, `hooks/codex/session-start.js` present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Builds are incremental (tsbuildinfo preserved) | A no-op rebuild completes in ~1s and reuses `dist/tsconfig.tsbuildinfo` |
| REQ-004 | An explicit full-clean path remains available | `npm run rebuild` (clean + build) and `npm run clean` exist and work |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rebuilding mcp-server while a daemon runs no longer wipes the live `dist/` (RC-4 closed on the default path).
- **SC-002**: No regression — `dist-freshness` and source/dist orphan tests still pass against the rebuilt dist.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dropping auto-clean could let orphan `.js` (from deleted `.ts`) accumulate | Low | `finalize-dist.mjs` removes known stale roots; `dist-freshness` + orphan tests catch orphans; `npm run rebuild` does a full clean when needed |
| Risk | A from-scratch (post-clean) build still has a brief partial-tree window | Low | Default path is now incremental (few files change); full clean is opt-in and run when no daemon must stay up |
| Dependency | tsc composite build + `dist/tsconfig.tsbuildinfo` | Green | Preserved by not wiping dist; enables incrementality |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A no-op incremental rebuild completes in ~1s (measured), vs minutes for a full wipe+rebuild.
- **NFR-P02**: No additional steady-state cost; the change removes work (the wipe) rather than adding it.

### Security
- **NFR-S01**: No security surface change; build scripts only.
- **NFR-S02**: No new file writes outside `dist/`.

### Reliability
- **NFR-R01**: A running daemon survives a default rebuild (live `dist/` never deleted).
- **NFR-R02**: `finalize-dist.mjs` fails the build loudly if a required artifact is missing.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty/absent dist (first build): tsc builds it from scratch; finalize asserts completeness.
- Stale orphan `.js`: caught by `dist-freshness`/orphan tests; cleared via `npm run rebuild`.
- Renamed/deleted source: incremental build leaves an orphan until a `rebuild`; tests flag it.

### Error Scenarios
- tsc compile error: `build` fails before finalize; existing dist is left intact (non-destructive) so the daemon keeps the last-good build.
- Missing required artifact after build: `assertRequiredArtifacts()` throws, failing the build loudly.
- Concurrent rebuild: tsc's own `.tsbuildinfo` locking handles overlap; no dist wipe to race on.

### State Transitions
- Partial build interrupted: last-good `dist/` remains usable (nothing was pre-deleted).
- Switch incremental→full: `npm run rebuild` performs an explicit clean then build.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One package.json; 3 script lines |
| Risk | 12/25 | Build infra (daemon startup depends on dist); mitigated by tests + finalize asserts |
| Research | 4/20 | Root cause already established in packet 030 |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The full `dist.next` atomic-rename variant is documented as out-of-scope (composite-tsc fragility); revisit only if a from-scratch build must run against a live daemon.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
