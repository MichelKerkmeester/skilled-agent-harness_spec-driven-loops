---
title: "Implementation Plan: Phase 11: cross-surface-references"
description: "Find every list that names the sk-doc create modes, add the goal mode to each, regenerate the advisor command bridges without losing committed wording, and bring the two pinned counts in step."
trigger_phrases:
  - "create-goal references plan"
  - "command bridge regeneration"
  - "create asset roster plan"
  - "mode count update"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: cross-surface-references

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript, Python |
| **Framework** | sk-doc hub, skill advisor command bridges |
| **Storage** | None |
| **Testing** | `unittest`, `vitest`, sk-doc validators, bridge `--check` |

### Overview
Search the repository for documents that name a sibling create mode or command but not the goal mode, then add it where the list is meant to be complete. Regenerate the advisor command bridges from their authored inputs, and rebuild the two pinned counts from what is on disk.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Enumerations follow their source: `mode-registry.json` for mode and packet counts, `command-metadata.json` for commands, and the asset folder for the command roster.

### Key Components
- **Command-bridge deriver**: reads each skill's `command-metadata.json` plus `allow-list.json` and `scoring-compatibility.json`, then writes the generated JSON and the generated blocks in the TypeScript and Python scorers.
- **Agent mirrors**: the Claude, Pi and Codex copies are edited alongside the source, Cursor and Devin link to the Claude copy, and Hermes is regenerated.

### Data Flow
`command-metadata.json` → `derive-command-bridges.cjs` → generated JSON, `projection.ts`, `skill_advisor.py`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Root and hub READMEs | List sibling create commands | Update | `validate_document.py` 0 issues, HVR counts unchanged |
| `@markdown` agent and mirrors | Valid-command gate and template map | Update | `check-agent-mirror-sync.cjs` OK, Hermes check PASS |
| Advisor command bridges | Projection of declared commands | Regenerate | `--check` reports `fresh` |
| Create asset roster, advisor census | Pinned counts | Update | Both suites pass |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Create asset roster, advisor metadata census | `unittest`, `vitest` |
| Integration | Bridge projection freshness, advisor suite, agent mirror sync | `derive-command-bridges.cjs --check`, `vitest run`, mirror checkers |
| Manual | README and catalog wording and counts | `validate_document.py`, `hvr_scan.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc `command-metadata.json` | Internal | Green | The bridge would lack its source |
| Python 3 and the advisor's node modules | Internal | Green | The advisor suite could not run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An advisor or command test fails on the committed tree.
- **Procedure**: `git revert` the phase commit, then rerun `derive-command-bridges.cjs --check`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (find the lists) ──► Core (docs, agent, bridges, counts) ──► Verify (tests, checks, validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Low | About an hour |
| Verification | Medium | About an hour |
| **Total** | | **A few hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Only this phase's files staged
- [x] No feature flag needed
- [x] Bridge check fresh before commit

### Rollback Procedure
1. `git revert` the phase commit.
2. Rerun `derive-command-bridges.cjs --check` and the create command asset tests.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
