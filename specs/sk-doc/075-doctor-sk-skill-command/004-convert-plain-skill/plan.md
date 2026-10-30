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
The converter copies the outside source under its frontmatter name, renders one intent and the body-ordered resource map, accepts workflow-agent prose through `--agent-output`, and checks preservation before resource rewrites, metadata scaffolding and V7/V8. Intent phrases arrive through repeated `--approved-phrase` values; `allowed-tools` and an over-long description arrive through `--allowed-tools` and `--description-trim`, on both conversion paths, and are applied after the backup so the undo restores the original fields. Once both format validators pass, the six integration rows are planned, applied and reported. The plain fixture proves strict PASS and root-metadata exit 0; the dropped-line fixture proves the preservation gate stops the run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` exits 0 (phase 003 closed). Evidence: final suite passed 47/47.
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
- **`lib/sk-skill-convert-transforms.cjs`**: link harvest for `RESOURCE_MAP`, frontmatter insert for resource docs, kebab rename with link rewrite in every form a document spells a path, approval transforms for the two operator-set fields, and the preservation line rules.
- **`lib/sk-skill-integrate.cjs`**: the six integration rows I1 to I6, planned beside the conversion and applied only after the format gate passes.

### Data Flow
V1 copies the source to `.skilled/skills/<frontmatter-name>/` and snapshots it. V3(a) renders `ROUTER.md`; V4 takes the workflow agent's shaped `SKILL.md` and checks original body lines with `preserve --snapshot`. V5 edits and renames resource docs, V6 copies absent scaffold files and writes approved phrases, V7 regenerates metadata, and V8 runs both validators and stops on failure. A run that passes V8 plans its integration writes before the first byte and applies the rows after the gate, printing each row's result and each recorded write in the undo list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Two reviews of the shipped phase reported five P1 and seven P2 findings. Each is fixed in the two scripts and covered by a case that failed first:

| Finding | Surface | Fix |
|---------|---------|-----|
| P1-1 | `sk-skill-convert.cjs` | A symlink anywhere in the source tree is refused with `SOURCE_SYMLINK` before staging, so a copied link is never written through |
| P1-2 | `sk-skill-convert-transforms.cjs` | Heading lines are excluded only outside fences, using the fence scanner the router sections already rely on |
| P1-3 | `sk-skill-convert-transforms.cjs`, fixture | Rewriting covers reference definitions, HTML `href`/`src`, inline-code paths and paths with spaces, and a staged tree still naming an old key fails with `RESOURCE_LINK_STALE` |
| P1-4 | `sk-skill-convert.cjs`, test | The plain check runs `pythonExecutable(context)`; the test spawns the interpreter it was given |
| P1-5 | `acceptance-criteria.md` | All seven Met rows re-pointed at lines that hold the evidence after the fixes |
| P2-1 | `sk-skill-convert-transforms.cjs` | Preservation compares link targets verbatim, allowing only the planned rename map |
| P2-2 | `sk-skill-convert.cjs` | The snapshot carries the source references, and their lines are subtracted before SKILL.md lines are matched |
| P2-3 | `sk-skill-convert-transforms.cjs` | Prose matches prose, fenced lines match fenced lines, and an HTML comment is its own kind |
| P2-4 | `sk-skill-convert-transforms.cjs` | Table rows collapse internal whitespace runs before comparison |
| P2-5 | test | The result's command log is asserted for `ci-skill-root-metadata.cjs` and `validate_skill_package.py`, both with exit 0 |
| P2-6 | both scripts, test | Design step ids are gone from operator messages, the scaffold helper name and the cases; each describes the step |
| P2-7 | `plan.md`, `tasks.md`, `implementation-summary.md` | Test counts record the real numbers (47 conversion, 54 check, 23 integration) |
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
| Integration | Plain fixture end to end; dropped-line fixture fails `preserve`; a temp repo ends with both format gates, the Hermes check, the freshness panel and the changelog link | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` |
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
