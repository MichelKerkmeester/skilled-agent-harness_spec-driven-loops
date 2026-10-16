---
title: "Implementation Plan: Phase 8: out-of-scope-cleanup"
description: "Verify each of the four out-of-scope issues against the code, then fix it with one DeepSeek dispatch per change and a check that proves it, or reject it with evidence."
trigger_phrases:
  - "out of scope cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: out-of-scope-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, Node.js CommonJS, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | unittest and pytest for the drift verifier, node:test for the doctor scripts |

### Overview
Four small fixes, each verified against the code before it is planned. The drift verifier's router walk gains the evidence skip its language scan already has. The phrase-reach probe gets a node:test suite. The Hermes header loses its semicolons, together with the pattern that recognises it. sk-create-command states one gate position.

Verification results, read before planning:
- Issue 1 holds. `run-all-drift-guards.sh` fails with 16 `ROUTER-DEAD-PATH` errors, all in `specs/system-skill-advisor/035-doctor-command-routing/review/lineages/deepseek-max/evidence/pre/SKILL.md`. `is_unscanned_record_path()` already skips `specs/**/evidence/` in `iter_code_files()`, but `check_router_paths()` never calls it. The verifier has a test file, so the fix gets a test.
- Issue 2 holds. `tests/` has no suite for `doctor-phrase-reach.cjs`, and `mcp-doctor-lib.sh` is covered by `mcp-doctor.test.sh`, so the new suite makes every script covered.
- Issue 3 holds with one correction. 57 skill mirrors carry two header semicolons, while the 11 agent mirrors carry one, the marker comment. `hvr_scan.py` flags both as hard blockers. The marker is also matched by `GENERATED_SKILL_COPY_RE` in the drift verifier, so the pattern changes with it.
- Issue 4 holds, but the proposed direction does not. Of the nine shipped commands with a `MANDATORY INPUT GATE`, eight place it after the H1 and only `doctor/git.md` places it right after the frontmatter. Both templates' skeletons also show it after the H1. The prose statements that say "immediately after frontmatter" are the ones that change.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place extension of existing scripts and docs. No new module.

### Key Components
- **`verify_alignment_drift.py`**: `check_router_paths()` and `GENERATED_SKILL_COPY_RE`.
- **`doctor-phrase-reach.cjs`**: read-only, so the test drives it as a process, against the repository for the passing run and against a throwaway copy with a stubbed freshness library for the stale build.
- **`sync-skills-hermes.cjs`**: `GENERATED_MARKER` and the skill header in `renderSkill()`.
- **sk-create-command**: `SKILL.md`, `README.md`, two references, `assets/command-template.md` and two playbook files.

### Data Flow
The Hermes header flows from the generator into 68 mirrors, and the drift verifier reads the marker back to skip those mirrors. Both ends change in the same task.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Each code fix gets a mutation check: put the old code back and confirm the new test fails.
- Baselines before any edit: the drift verifier suite passes 27 tests, the drift guards fail one guard with 16 errors and the Hermes sync check passes 68 copies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new dependency. The phrase-reach happy path needs the advisor runtime built, which CI does before the doctor runner.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped diff and rerun `sync-skills-hermes.cjs` to regenerate the old headers. Every target is backed up under the scratch dispatch folder before its dispatch.
<!-- /ANCHOR:rollback -->

---

