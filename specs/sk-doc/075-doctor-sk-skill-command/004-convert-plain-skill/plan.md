---
title: "Implementation Plan: Phase 4: convert-plain-skill"
description: "Extend sk-skill-convert.cjs with steps V1, V3(a) and V4 to V8 for a plain agent skill, reusing init_skill.py and the root-metadata and derived-file generators. Prove it with a plain fixture that ends strict PASS and a dropped-line fixture that fails the preservation check."
trigger_phrases:
  - "convert plain skill plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: convert-plain-skill

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS spawning Python 3 scaffolder and validators |
| **Framework** | None |
| **Storage** | Temp scaffold path for `init_skill.py`; backups under `.skilled/skills/.state/doctor-sk-skill/` |
| **Testing** | `node --test` |

### Overview
The converter copies the outside source under its frontmatter name, renders one intent and the body-ordered resource map, accepts workflow-agent prose through `--agent-output`, and checks preservation before resource rewrites, metadata scaffolding and V7/V8. Intent phrases and `allowed-tools` arrive through explicit approval flags. The plain fixture proves strict PASS and root-metadata exit 0; the dropped-line fixture proves the preservation gate stops the run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` exits 0 (phase 003 closed). Evidence: final suite passed 21/21.
- [x] Plain and dropped-line fixtures exist. Evidence: `tests/fixtures/sk-skill-convert/plain/{before,after,dropped}`.
- [x] Dependencies identified. Evidence: initializer, root metadata, derived generator and both validators run in integration tests.

### Definition of Done
- [x] All acceptance criteria met. Evidence: AC-001 through AC-007 are Met.
- [x] The plain fixture prints `Result: PASS` from `package_skill.py --check --strict` and `ci-skill-root-metadata.cjs --skill <fixture>` exits 0. Evidence: temp-copy integration test.
- [x] Docs updated (spec/plan/tasks). Evidence: phase spec, plan, tasks, acceptance criteria, goal and implementation summary agree on completion.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scripted steps around one agent step

### Key Components
- **`sk-skill-convert.cjs`**: orders V1 to V8, prints each in the plan, and runs `preserve`.
- **`lib/sk-skill-convert-transforms.cjs`**: link harvest for `RESOURCE_MAP`, frontmatter insert for resource docs, kebab rename with link rewrite, phrase proposal from the description, keyword comment and any old `INTENT_SIGNALS`.

### Data Flow
V1 copies the source to `.skilled/skills/<frontmatter-name>/` and snapshots it. V3(a) renders `ROUTER.md`; V4 takes the workflow agent's shaped `SKILL.md` and checks original body lines with `preserve --snapshot`. V5 edits and renames resource docs, V6 copies absent scaffold files and writes approved phrases, V7 regenerates metadata, and V8 runs both validators and stops on failure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase extends new scripts and fixes no reported finding.
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
| Unit | Link harvest, frontmatter insert, rename with link rewrite, phrase floor | `node --test` |
| Integration | Plain fixture end to end; dropped-line fixture fails `preserve` | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` |
| Manual | Strict and root-metadata gates on the converted fixture | `package_skill.py --check --strict`, `ci-skill-root-metadata.cjs --skill <fixture>` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `init_skill.py` | Internal | Green | No metadata scaffold |
| `ci-skill-root-metadata.cjs --fix`, `regenerate-skill-derived.cjs --write` | Internal | Green | No generated files |
| `package_skill.py`, `validate_skill_package.py` | Internal | Green | No V8 gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `preserve` fails, or V8 fails on the converted skill.
- **Procedure**: inside a run, restore from the backup folder and delete the staged copy the run created; for the code, revert the phase commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (fixtures) | Phase 003 closed | Implementation |
| Implementation (V1, V3(a), V4 to V8) | Setup | Verification |
| Verification (plain and dropped-line tests, gates) | Implementation | Phase 005 |
<!-- /ANCHOR:phase-deps -->

---
