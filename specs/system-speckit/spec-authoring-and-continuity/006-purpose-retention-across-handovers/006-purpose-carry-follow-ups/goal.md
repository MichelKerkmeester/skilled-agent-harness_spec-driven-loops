---
title: "Goal: Phase 6: purpose-carry-follow-ups"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/006-purpose-carry-follow-ups"
    last_updated_at: "2026-11-14T08:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ef52f514-275d-4013-b7bd-ab365324057d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: purpose-carry-follow-ups

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After this phase, no live phase parent carries the scaffold purpose sentence, the brief cached before a compaction names the active packet for folders under `specs/` and the resume workflow assets list the same brief rows as the presentation file.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] REQ-001: No live phase parent outside this packet carries the scaffold purpose sentence. This covers that one sentence only, and makes no claim that every live phase parent states a purpose. The first Measured Behavior command piped to `wc -l` prints `0`
- [x] REQ-002: `detectSpecFolder` in `compact-inject.ts` returns the folder for a `specs/` path and the merged brief prints its `Active spec folder:` line. `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-precompact.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, prints `Tests  18 passed (18)`
- [x] REQ-003: Both resume workflow assets list the presentation file's brief rows in order. `python3 <this folder>/scratch/check-brief-rows.py` with the presentation file and both assets prints `speckit-resume-auto.yaml match` and `speckit-resume-confirm.yaml match`
- [x] REQ-004: Each of the five rewritten parents still validates. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --strict` prints `RESULT: PASSED` on its first RESULT line for each parent, with no more errors or warnings than the baseline in `plan.md` section 5
- [x] REQ-005: The purpose line from phase 004 and the existing command checks are unchanged. `hook-session-start.vitest.ts` prints 23 passed, `test-phase-command-workflows.js` prints `Result: passed=148 failed=0`, `sync-runtime-mirrors.cjs --check` prints `PASS: 256 mirrors across 10 trees are in sync.` and the YAML load prints `yaml ok`
- [x] REQ-006: The runtime still typechecks and the built hook carries the fix. `npm run typecheck` and `npm run build` in `.skilled/skills/system-spec-kit/runtime` exit 0, and the second Measured Behavior command prints `specs/ -> "specs/system-speckit/x/y"` and `Active spec folder lines in brief: 1`
- [x] REQ-007: A test proves that a new phase parent which leaves Draft with an unfilled purpose fails the gate. `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts runtime/cli/tests/template-version-parity.vitest.ts runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts runtime/cli/tests/placeholder-token-gate.vitest.ts --config vitest.config.ts`, run from `.skilled/skills/system-spec-kit`, prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`, and `rg -c -F 'PLACEHOLDER_FILLED' .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` prints `1`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | Planned 2026-11-14, verified by an independent plan review |
| Phase built | Done | E1 to E15 applied by a DeepSeek V4.1 Flash max worker through cli-deepseek-harness on 2026-11-14, then every criterion rerun by the orchestrator |

### Deviations and findings

| Item | Note |
|------|------|
| Generated metadata | Rewriting the five parent `spec.md` files drifted each parent's `graph-metadata.json`, so REQ-004 first printed `Errors: 2` and `RESULT: FAILED`. `repair-derived.cjs --apply` re-derived the five files and each parent returned to its baseline with `RESULT: PASSED` |
<!-- /ANCHOR:log -->
