---
title: "Feature Specification: D2-R1 — Strip tool over-grant from the read-and-guide /design:* wrappers"
description: "The four read-and-guide /design:* wrappers carry Write/Edit/Bash they never use, so a mutation-free command can silently mutate the workspace and drifts from the command-metadata.json toolPolicy SSOT."
trigger_phrases:
  - "d2-r1 tool over-grant"
  - "strip write edit bash design wrappers"
  - "read-and-guide least privilege spec"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/001-strip-tool-over-grant"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgrade spec to Level 2; record allowed-tools fix and the D2-R2 residual"
    next_safe_action: "Run D2-R2 to write per-command argument-hint and aliases to the wrappers"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r1-strip-tool-over-grant"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D2-R1 — Strip tool over-grant from the read-and-guide /design:* wrappers

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
The four read-and-guide `/design:*` wrappers (`audit`, `foundations`, `interface`, `motion`) only read source and cite the shared design reference base; they never mutate the workspace. Yet every wrapper shared the same mutating toolset `Read, Write, Edit, Bash, Glob, Grep`, granting Write/Edit/Bash the modes never legitimately use. That over-grant let a mutation-free command silently mutate the workspace and put the wrapper `allowed-tools` out of step with its `command-metadata.json` `toolPolicy.mutatesWorkspace: false`.

### Purpose
Give each read-and-guide wrapper a least-privilege toolset (`Read, Glob, Grep`) that matches its `toolPolicy.mutatesWorkspace: false` in the SSOT, while keeping `md-generator` — the only mutating mode — at its full toolset.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strip `Write, Edit, Bash` from the four read-and-guide wrapper `allowed-tools` lines, leaving `Read, Glob, Grep`
- Hold the `allowed-tools` projection in parity with `command-metadata.json` `toolPolicy.mutatesWorkspace`

### Out of Scope
- `md-generator.md` `allowed-tools` — the only `mutatesWorkspace: true` command stays at `Read, Write, Edit, Bash, Glob, Grep` (frozen)
- Per-command `argument-hint` and `aliases` — that is the sibling D2-R2 phase
- Editing `command-metadata.json` — it is the read-only SSOT for this phase
- Wrapper bridge prose (PURPOSE / INSTRUCTIONS / Return Status)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/design/audit.md` | Modify | `allowed-tools` → `Read, Glob, Grep` |
| `.opencode/commands/design/foundations.md` | Modify | `allowed-tools` → `Read, Glob, Grep` |
| `.opencode/commands/design/interface.md` | Modify | `allowed-tools` → `Read, Glob, Grep` |
| `.opencode/commands/design/motion.md` | Modify | `allowed-tools` → `Read, Glob, Grep` |
| `.opencode/commands/design/md-generator.md` | Unchanged | Mutating wrapper left intact (out of scope) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read-and-guide wrappers are least-privilege | All four wrappers declare exactly `allowed-tools: Read, Glob, Grep`; no Write/Edit/Bash remains |
| REQ-002 | Mutating wrapper preserved | `md-generator.md` `allowed-tools` is byte-unchanged at `Read, Write, Edit, Bash, Glob, Grep` |
| REQ-003 | SSOT parity | Each wrapper `allowed-tools` matches its `command-metadata.json` `toolPolicy.mutatesWorkspace`; the four allowed-tools drifts clear |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Bridges still load | Each of the four wrappers still parses and loads its mode as a thin bridge |
| REQ-005 | Evergreen artifacts | No spec/packet/phase ID or spec path is introduced into any wrapper file |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four read-and-guide wrappers carry only `Read, Glob, Grep`; `md-generator` is untouched
- **SC-002**: `design-command-surface-check.mjs` no longer reports an `allowed-tools` drift for the four wrappers (the allowed-tools drift cleared, dropping the surface drift from 14 to 10)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D2-R3 (command-metadata SSOT + checker) | Landed | `command-metadata.json` `toolPolicy` is the read-only SSOT this phase aligns to; the checker gates parity |
| Dependency | D2-R2 (argument grammar) | Pending | The residual surface drift (`argument-hint` + `aliases`) is the sibling D2-R2 phase's responsibility, not this phase's |
| Risk | Over-strip breaks a bridge | Low | Frontmatter-only edit; revert the affected `allowed-tools` line to the prior set and re-run the checker |
| Risk | Accidentally editing `md-generator` | Low | `md-generator` is explicitly out of scope and verified byte-unchanged |

### Residual surface drift (not this phase)

After this phase the `design-command-surface-check.mjs` surface drift drops from 14 to 10. The remaining 10 is exactly the per-command `argument-hint` (still the generic `<design request>`) plus the missing `aliases` across the five commands. Closing that residual to `drift=0` is the sibling **D2-R2** phase's responsibility; it is out of scope here.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: A `mutatesWorkspace: false` command must not declare Write/Edit/Bash; least privilege is the security posture this phase enforces

### Maintainability
- **NFR-M01**: The wrapper `allowed-tools` line is a projection of the SSOT `toolPolicy`; the checker keeps the projection honest

### Reliability
- **NFR-R01**: The edit is frontmatter-only and reversible by restoring a single `allowed-tools` line per wrapper
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A wrapper that already reads `Read, Glob, Grep`: no-op, no drift contributed
- `md-generator` carrying mutating tools: correct and expected (`mutatesWorkspace: true`), not flagged

### Error Scenarios
- A stripped wrapper that fails to parse: revert that wrapper's `allowed-tools` line and re-run the checker
- A wrapper still carrying Write/Edit/Bash after the edit: checker reports the allowed-tools drift; fix the wrapper

### State Transitions
- Partial alignment (allowed-tools fixed, argument-hint not): the checker reports only the remaining field drifts — the expected post-phase state until D2-R2 lands
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Four frontmatter lines; no live skill logic edited |
| Risk | 5/25 | Read-only-after edit; reversible per-wrapper; `md-generator` frozen |
| Research | 5/20 | Mode split sourced from `sk-design/SKILL.md` and the SSOT `toolPolicy` |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this phase. The residual `argument-hint` + `aliases` surface drift is tracked and owned by the sibling **D2-R2** phase, not an open question here.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification addendum (NFR, edge cases, complexity)
- Strip allowed-tools over-grant from four read-and-guide wrappers; md-generator frozen
- Residual argument-hint + aliases drift owned by sibling D2-R2
-->
