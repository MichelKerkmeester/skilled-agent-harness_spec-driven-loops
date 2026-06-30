---
title: "Feature Specification: D2-R2 — Per-mode argument grammar for the /design:* wrappers"
description: "The five /design:* wrappers share the identical placeholder argument-hint <design request>, teaching the caller nothing about the real inputs each mode consumes and drifting from the command-metadata.json SSOT."
trigger_phrases:
  - "d2-r2 arg grammar"
  - "per-mode argument hint design wrappers"
  - "design command arg grammar spec"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/002-per-mode-arg-grammar"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgrade spec to Level 2; record per-mode grammar and aliases resolution"
    next_safe_action: "Run the D2 invocation-example and return-contract phase next"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-d2-r2-per-mode-arg-grammar"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D2-R2 — Per-mode argument grammar for the /design:* wrappers

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
All five `/design:*` wrappers (`audit`, `foundations`, `interface`, `md-generator`, `motion`) shipped the identical placeholder `argument-hint: "<design request>"`. That generic hint teaches the caller nothing about the inputs each mode actually consumes, and it leaves the wrapper out of step with the per-command `argumentHint` field in `command-metadata.json`, so the surface checker reports an argument-hint drift on every command.

### Purpose
Give every `/design:*` command a real, mode-specific argument grammar — grounded in what that command's body and its mode `SKILL.md` genuinely read — sourced from `command-metadata.json` and projected byte-for-byte into each wrapper, so the hint tells the user exactly what to pass and the surface checker drift-gates the projection.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Set a real `argumentHint` per command in `command-metadata.json` and project it into each wrapper's `argument-hint` line so they are byte-identical
- Resolve the aliases drift question: gate aliases as a metadata-internal uniqueness check rather than a wrapper-drift comparison
- Drive the surface checker to `drift=0` across the five commands

### Out of Scope
- `allowed-tools` on any wrapper — that field is owned by the sibling D2-R1 phase and stays as that phase set it
- Wrapper bridge prose (PURPOSE / INSTRUCTIONS / Return Status)
- Projecting aliases into the wrappers — OpenCode command frontmatter has no `aliases` key

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/design/audit.md` | Modify | `argument-hint` → `<target> [--scope] [--score]` |
| `.opencode/commands/design/foundations.md` | Modify | `argument-hint` → `<axis> <target>` |
| `.opencode/commands/design/interface.md` | Modify | `argument-hint` → `<target> [--mode]` |
| `.opencode/commands/design/md-generator.md` | Modify | `argument-hint` → `<live-url> --output <dir>` |
| `.opencode/commands/design/motion.md` | Modify | `argument-hint` → `<component-state> [--library]` |
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Set `argumentHint` per command (the SSOT values) |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Aliases gated as a metadata-internal uniqueness check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No generic placeholder remains | No wrapper `argument-hint` equals `<design request>` |
| REQ-002 | Wrapper equals SSOT | Each wrapper `argument-hint` is byte-equal to its `command-metadata.json` `argumentHint` |
| REQ-003 | Surface drift cleared | `design-command-surface-check.mjs` reports `STATUS=PASS`, `invalid=0`, `drift=0` |
| REQ-004 | Aliases gated by uniqueness | The checker asserts each alias is owned by exactly one command; aliases are not a wrapper-drift field |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Grammar grounded in real inputs | Each `argumentHint` traces to a positional/flag the mode actually consumes per its `SKILL.md` |
| REQ-006 | Evergreen artifacts | No spec/packet/phase ID or spec path appears in any wrapper or in any `argumentHint` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five wrappers carry a grounded, mode-specific `argument-hint` that matches the SSOT verbatim; the generic `<design request>` is gone everywhere
- **SC-002**: `design-command-surface-check.mjs` reports `STATUS=PASS invalid=0 drift=0` with `commands=5 aliases=15`, and `node --check` on the checker passes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D2-R3 (command-metadata SSOT + checker) | Landed | `argumentHint` field + checker exist; this phase populates the field and drift-checks |
| Dependency | D2-R1 (allowed-tools least privilege) | Landed | Same five wrapper files; this phase edits only `argument-hint` and never touches `allowed-tools` |
| Risk | A grammar invented rather than grounded | Low | Each value is derived from the command body + mode `SKILL.md`; rollback restores the prior value |
| Risk | Aliases drift-gated against absent wrapper key | Low | Resolved by gating aliases as a metadata-internal uniqueness check, not a wrapper comparison |

### Aliases resolution

The open question was whether aliases should be drift-checked against the wrappers. They cannot be: OpenCode command frontmatter has no `aliases` key, so any wrapper-versus-metadata comparison would report a permanent false drift. This phase resolved it by keeping `aliases` out of the checker's `DRIFT_FIELDS` and instead asserting alias uniqueness inside the metadata (each alias owned by exactly one command). The 15 aliases are validated without ever being projected to the wrappers.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Usability
- **NFR-U01**: Each `argument-hint` names the real positional + flag slots a caller fills, so the command is self-describing at invocation time

### Maintainability
- **NFR-M01**: The wrapper `argument-hint` is a projection of the SSOT `argumentHint`; the checker keeps the projection honest

### Reliability
- **NFR-R01**: The edit is frontmatter-only and reversible by restoring a single `argument-hint` line per wrapper plus the metadata field
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A wrapper hint that is non-generic but disagrees with metadata: the checker reports an `argument-hint` drift until the two match
- A command with no flags (`foundations` = `<axis> <target>`): two positional slots, no optional brackets

### Error Scenarios
- A surviving `<design request>`: the checker flags it as a generic argument-hint drift
- A duplicate alias claimed by two commands: the metadata uniqueness check fails with the owning command named

### State Transitions
- Partial alignment (one wrapper updated, others not): the checker reports only the remaining argument-hint drifts until all five match the SSOT
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Five frontmatter lines + one metadata field + one checker logic tweak |
| Risk | 6/25 | Frontmatter + metadata edits; reversible per wrapper; aliases gate is additive |
| Research | 8/20 | Each grammar grounded in the command body + mode `SKILL.md` |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **RESOLVED — How should aliases be drift-gated?** OpenCode command frontmatter has no `aliases` key, so a wrapper-versus-metadata alias comparison would false-positive permanently. Resolved by treating aliases as a metadata-internal uniqueness check (each alias owned by exactly one command) and keeping them out of the checker's wrapper-drift fields. No other open questions for this phase.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification addendum (NFR, edge cases, complexity)
- Per-mode argument grammar on five wrappers; aliases resolved as metadata-internal uniqueness
- Completes the D2 P0 trio with D2-R3 (SSOT + checker) and D2-R1 (least privilege)
-->
