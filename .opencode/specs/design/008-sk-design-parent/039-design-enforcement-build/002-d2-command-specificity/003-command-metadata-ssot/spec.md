---
title: "Feature Specification: D2-R3 — command-metadata.json SSOT + surface-drift checker"
description: "Command metadata is fragmented across wrapper frontmatter, the hub, and the registry with no single authority or drift gate, so the design command surface silently diverges."
trigger_phrases:
  - "d2-r3 command metadata ssot"
  - "command metadata ssot design build"
  - "design command surface check spec"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/003-command-metadata-ssot"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgrade spec to Level 2; record drift baseline and aliases open item"
    next_safe_action: "Run D2-R2 to add per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r3-command-metadata-ssot"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does OpenCode command frontmatter support an aliases key, or are metadata aliases a hub-keyword projection only? (D2-R2 resolves)"
    answered_questions: []
---
# Feature Specification: D2-R3 — command-metadata.json SSOT + surface-drift checker

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The design command metadata is scattered across three unsynchronized places: the wrapper frontmatter, the hub `SKILL.md`, and `mode-registry.json`. No file owns the command surface and nothing gates divergence, so the surfaces drift apart silently and no check fails.

### Purpose
Establish one source of truth for the `/design:*` command surface and a deterministic checker that drift-gates the wrappers against it, while keeping `mode-registry.json` routing-only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `command-metadata.json` keyed by command, one record per `/design:*` command
- `design-command-surface-check.mjs`, a two-stage metadata-validation + surface-drift gate
- `ownerMode` constrained to a real `workflowMode`; alias-uniqueness across command records

### Out of Scope
- Rewriting wrapper `allowed-tools` - that is D2-R1 (tool policy)
- Rewriting wrapper `argument-hint` / `aliases` - that is D2-R2 (argument grammar)
- Mutating `mode-registry.json` - it stays routing/identity-only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Create | The command-surface SSOT (5 records) |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Create | Two-stage drift gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One SSOT record per command | `command-metadata.json` parses; exactly 5 records; all 11 fields present per record |
| REQ-002 | `ownerMode` bound to a `workflowMode` | Every `ownerMode` is a member of the `workflowMode` set read from `mode-registry.json` |
| REQ-003 | Deterministic drift gate | Checker reports per-command drift in sorted order with a stable exit-code contract (0/1/2) |
| REQ-004 | Registry untouched | `mode-registry.json` is byte-unchanged after the build |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Alias uniqueness | No alias is owned by two command records; checker reports `invalid=0` |
| REQ-006 | Evergreen artifacts | Neither artifact embeds a spec/packet/phase ID or spec path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` runs deterministically and honors the 0/1/2 exit-code contract
- **SC-002**: On the still-incomplete wrappers the checker reports non-zero drift (exit 1); on an aligned surface it would exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D2-R2 (argument grammar) | Pending | Consumes `argumentHint` + `aliases` to write per-command wrapper frontmatter; the residual drift clears when it lands |
| Dependency | D2-R1 (tool policy) | Landed in wrappers | Consumes `toolPolicy.mutatesWorkspace`; the four allowed-tools over-grants are already stripped |
| Risk | Drift gate reads as a failure | Med | The checker exits 1 by design until D2-R2; document the expected non-zero drift so it is not mistaken for a regression |
| Risk | Metadata `aliases` namespace confusion | Low | Command-surface aliases are distinct from `mode-registry.json` routing aliases; alias-uniqueness runs across command records only |

### Expected drift state (reconciled)

The checker is expected to report non-zero drift until D2-R1 and D2-R2 fully land. The implementer baselined `drift=14` (5 argument-hint + 5 aliases + 4 allowed-tools over-grant) against the fully generic wrappers. As of 2026-06-28 the independent re-measurement is `drift=10`: the four allowed-tools over-grants have cleared (D2-R1 landed in the wrappers) and all five descriptions already match the SSOT, leaving the 5 generic `<design request>` argument-hints and 5 missing aliases for D2-R2 to drive to `drift=0`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Checker completes a full five-wrapper sweep in well under one second on a warm Node runtime

### Security
- **NFR-S01**: Checker treats the wrappers and the registry as read-only; it never writes any file it inspects

### Reliability
- **NFR-R01**: Two consecutive runs produce byte-identical, sorted output (determinism)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing wrapper file: reported as a per-command `wrapper` drift entry, not a crash
- Absent `aliases` key in a wrapper: counted as drift (the surface needs explicit aliases)
- Generic `<design request>` argument-hint: flagged explicitly as drift (D2-R2 coupling)

### Error Scenarios
- Unreadable `mode-registry.json`: Stage 1 cannot validate `ownerMode`; checker exits 2 (invalid)
- Unknown CLI argument: usage error, exit 2

### State Transitions
- Wrapper partially aligned (allowed-tools fixed, argument-hint not): checker reports only the remaining field drifts, as it does today
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two new files, no edits to live skill logic |
| Risk | 6/25 | Read-only checker; registry untouched; reversible by deletion |
| Research | 6/20 | Field set + workflowMode binding sourced from research §5 |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- OpenCode command frontmatter `aliases` support is unconfirmed. D2-R2 must resolve it: if the loader honors an `aliases` key, add it to the wrappers; if not, treat the metadata `aliases` as the hub-keyword projection and relax the checker so a missing wrapper `aliases` key is no longer counted as drift.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification addendum (NFR, edge cases, complexity)
- SSOT + checker scope; wrapper rewrites deferred to D2-R1/R2
- Expected non-zero drift documented and reconciled (14 -> 10)
-->
