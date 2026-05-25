---
title: "Implementation Plan: 116/008 — Playbooks and Default Calibration"
description: "Level 2 plan for Phase H manual playbooks, SKILL.md version bump, metadata refresh, and verification."
trigger_phrases:
  - "deep-review playbook"
  - "review-depth manual scenario"
  - "SKILL version bump"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Populated Level 2 implementation plan."
    next_safe_action: "Execute playbook authoring, version bump, and verification."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1160088200000000000000000000000000000000000000000000000000000000"
      session_id: "116-008-plan"
      parent_session_id: "116-008-playbooks-and-default-calibration"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Default calibration is deferred rather than implemented."
---
# Implementation Plan: 116/008 — Playbooks and Default Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `deep-review` skill docs and Phase 008 spec packet |
| **Testing** | Spec validator, playbook grep checks, `tests/deep-loop/` Vitest run |
| **Primary Constraint** | No production code or default-value changes |
| **Rollout Mode** | Operator-facing manual playbooks |

### Overview
Phase H turns the completed v2 review-depth contract into six manual scenarios. The plan is deliberately documentation-first: capture the shipped Phase B-G behaviors in operator language, bump the skill version metadata, refresh spec metadata, and verify. Default calibration remains a follow-on because R8 P2 requires production data first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase parent and research baseline read.
- [x] Phase 002-007 implementation summaries read.
- [x] Active modification surfaces identified.
- [x] Level 2 template pattern inspected.

### Definition of Done
- [x] Phase 008 docs validate under strict mode.
- [x] `manual_testing_playbook/README.md` plus six scenarios exist.
- [x] Required manifest names appear across the playbook.
- [x] `SKILL.md` diff shows only the version line.
- [x] `tests/deep-loop/` Vitest result is documented.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-backed documentation rollout. The playbook files describe how to manually exercise already-shipped validator, reducer, STOP-gate, and graph vocabulary behavior without adding a new runner or changing production logic.

### Key Components
- **Phase 008 spec packet**: canonical documentation and verification evidence for this phase.
- **Root playbook README**: operator index for the six v2 review-depth scenarios.
- **Scenario files**: one scenario per shipped behavior surface.
- **`SKILL.md` version**: metadata marker for the manual playbook rollout.

### Data Flow
1. Prior phases define v2 artifacts and runtime behavior.
2. Phase H scenarios translate those artifacts into manual operator checks.
3. Metadata refresh indexes Phase H for future resume/search.
4. Verification records strict validation, grep coverage, and test status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec Docs + Manifest Review
- [x] Read Phase 116 parent and research R8 P2.
- [x] Read Phase 002-007 implementation summaries.
- [x] Replace Phase 008 scaffold docs with Level 2 packet content.
- [x] Create Level 2 checklist.

### Phase 2: Playbook Scenarios
- [x] Create `manual_testing_playbook/README.md`.
- [x] Create six requested `scenario-*.md` files.
- [x] Verify the required artifact names appear across the playbook.

### Phase 3: `SKILL.md` Frontmatter Bump
- [x] Update only the `version:` line in `.opencode/skills/deep-review/SKILL.md`.
- [x] Verify the diff contains no body changes.

### Phase 4: Verification
- [x] Refresh Phase 008 metadata; exact `generate-context.js` command was attempted and aborted, then package metadata helpers refreshed JSON files.
- [x] Run strict spec validation.
- [x] Run requested grep coverage checks.
- [x] Run the full `tests/deep-loop/` Vitest command and document result.
- [x] Finalize `implementation-summary.md` with Commit Handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Metadata refresh | Phase 008 `description.json` and `graph-metadata.json` | `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json ...` |
| Spec validation | Level 2 packet contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration --strict` |
| Playbook inventory | Requested root files | `ls .opencode/skills/deep-review/manual_testing_playbook/` |
| Playbook coverage | Required manifest names | `grep -r "$name" .opencode/skills/deep-review/manual_testing_playbook/` |
| Skill version diff | Narrow frontmatter bump | `git diff -- .opencode/skills/deep-review/SKILL.md` |
| Deep-loop regression | Existing deep-loop tests | `pnpm vitest run --no-coverage --reporter=verbose tests/deep-loop/ 2>&1 \| tail -100` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 fixture files | Automated anchors | Shipped | Manual scenarios lose fixture references. |
| Phase 004 validator codes | Runtime contract | Shipped | Warn/strict scenarios become speculative. |
| Phase 005 reducer fields | Runtime contract | Shipped | Search debt scenario cannot define expected output. |
| Phase 006 STOP gates | Runtime contract | Shipped | Gate scenarios cannot name expected blocker. |
| Phase 007 graph vocabulary | Runtime contract | Shipped | Graph scenario cannot verify node persistence. |
| Root `pnpm vitest` availability | Verification environment | Unknown | Result is documented if command cannot execute. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert Phase 008 spec packet changes.
- Remove the seven root playbook files added in Phase H.
- Revert the `SKILL.md` version-line change.
- Leave pre-existing manual playbook category folders untouched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 docs/context
        |
        v
Phase 2 playbooks ---> Phase 3 SKILL.md version
        |                       |
        +----------+------------+
                   v
             Phase 4 verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Spec docs + manifest review | Prior phase summaries | Playbook scenario accuracy |
| Playbook scenarios | Manifest review | Grep coverage and operator rollout |
| `SKILL.md` version bump | Playbook scope fixed | Final diff verification |
| Verification | Docs, scenarios, version bump | Commit handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Spec docs + manifest review | Medium | 45 minutes |
| Playbook scenarios | Medium | 60-90 minutes |
| `SKILL.md` version bump | Low | 5 minutes |
| Verification and handoff | Medium | 30 minutes |
| **Total** | | **2.5-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Active modification surfaces are known.
- [x] Existing manual playbook category files are treated as read-only.
- [x] Default calibration is deferred before any config edit.

### Rollback Procedure
1. Revert the Phase 008 docs and metadata files.
2. Remove root `README.md` and `scenario-*.md` files added under `manual_testing_playbook/`.
3. Revert the single `SKILL.md` version-line change.
4. Re-run strict spec validation if rollback is partial.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: file revert only.
<!-- /ANCHOR:enhanced-rollback -->
