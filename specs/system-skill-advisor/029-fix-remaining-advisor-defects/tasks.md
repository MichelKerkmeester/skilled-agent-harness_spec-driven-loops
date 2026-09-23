---
title: "Tasks: Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree and this packet in the earlier session (.worktrees/060-fix-remaining-advisor-defects, specs/system-skill-advisor/029-fix-remaining-advisor-defects)
- [x] T002 Read-only documentation sweep by the Devin DeepSeek V4.1 Flash reviewer, re-checked against the worktree in this session (six doc findings still applied, the code items were already fixed)
- [x] T003 Pre-flight round trip on `llmgateway/mimo-v2.6-pro` through cli-pi (returned a model reply)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Lane A pi dedup return: drop the dead receipt write, restore `return FULL_PI_DIRECTIVE_DELIVERY`, reword the module comment to "changed contribution" and add the route-head re-delivery test (.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts, .skilled/hooks/dispatch/pi/directive-dedup.test.ts)
- [x] T005 Lane B DB-dir expression: end at `env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? defaultDbDir`, one variable read once (.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts)
- [x] T006 Lane C spec-kit Claude hook root probe: check `.skilled` first on the upward walk and then `.opencode` (.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts)
- [x] T007 Lane D OpenCode plugin compiled-routing helper: `resolveCompiledRouteStatusModule()` checks the plugin's own root and then `.skilled/bin` (.opencode/plugins/system-skill-advisor.js)
- [x] T008 Lane E skill graph: repair five `graph-metadata.json` files with reciprocal sibling edges and corrected fields, regenerate `skill-graph.json` and seed the worktree's skill-graph database (.skilled/skills/cli-external-orchestration/graph-metadata.json, .skilled/skills/cli-jev/graph-metadata.json, .skilled/skills/cli-orca/graph-metadata.json, .skilled/skills/mcp-tooling/graph-metadata.json, .skilled/skills/sk-git/graph-metadata.json, .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json)
- [x] T009 Lane F golden-hub fixture: pass `NODE_PATH` to the checker because the hub copy lives in a bare tempdir with no `node_modules` ancestry (.skilled/skills/system-skill-advisor/runtime/tests/parent-skill-check-fixtures.vitest.ts)
- [x] T010 Lane G baselines: renew both baselines through the repository's capture tools and move the frozen counts alongside (.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json via capture-scorer-eval-baseline.mjs --write, .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json via capture-local-native-divergence-ledger.mjs --write, pythonCorrect 114 to 112 in .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts, pythonCorrect 109 to 106 and tsAlsoCorrect 100 to 99 in .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts, `rr-hub6-204`/`rr-hub6-207` out of both accepted-regression lists)
- [x] T011 Lane H documentation: bring the five stale surfaces up to date (.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md, .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md, .skilled/skills/system-skill-advisor/hooks/pi/README.md, .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md, .skilled/skills/system-skill-advisor/hooks/lib/README.md)
- [x] T012 Correct the two test comments that named ids absent from their lists and failed the comment-hygiene checker (.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts comment now states that `rr-hub6-204` and `rr-hub6-207` left the list and sits after the last entry, .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts comment lost the false clause and spells both ids out)
- [x] T013 Renew the divergence ledger with its capture tool and restore the reviewed reason (added 0, resolved 10, changed 1, 85 entries down to 75, and the human-reviewed reason and date 2026-09-07 for `rr-iter3-061` restored in place of the capture tool's keyword-based boilerplate)
- [x] T014 Correct packet 028's record with a note and repair its derived metadata, keeping its original numbers (specs/system-skill-advisor/028-restore-pi-advisor-brief/implementation-summary.md, specs/system-skill-advisor/028-restore-pi-advisor-brief/plan.md)
- [x] T022 Lane I repeated names in code: read or list each renamed variable once (.skilled/bin/system-skill-advisor-launcher.cjs, .opencode/plugins/system-skill-advisor.js, .skilled/commands/doctor/scripts/skill-graph-freshness.cjs, .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py, .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts)
- [x] T023 [P] Lane I repeated names in tests (.skilled/skills/system-skill-advisor/runtime/tests/state-containment.vitest.ts, .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts, .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-trust-gate.vitest.ts, .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-trusted-prompt-time.vitest.ts)
- [x] T024 [P] Lane I and J documentation: one variable in the two reference docs, no `CODEX_PROMPT_TIME` or `mk-*-launcher` in the bin README and kill-switch rows that name what each surface reads (.skilled/skills/system-skill-advisor/references/config/db-path-policy.md, .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md, .skilled/bin/README.md, .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md)
- [x] T025 Lane K shim test: the unavailable-branch case runs under `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` with no early return (.skilled/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Negative control on the Pi dedup suite: 8 of 15 fail against 028's `prompt-advisor.ts` and 15 of 15 pass against this packet's version, with this packet's file restored byte-identical afterwards
- [x] T016 Both builds exit 0 and the compiled fallback carries the single DB-dir read (advisor runtime build and spec-kit runtime build)
- [x] T017 Stdin smoke of the compiled hook: `status ok`, freshness `live`, 1941 ms, brief `Advisor: live; use sk-doc 0.94/0.12 pass.` (advisor status: freshness live, 21 skills)
- [x] T018 Advisor runtime battery: final run 891 passed, 0 failed, 7 skipped of 898, exit 0, 122.4 s
- [x] T019 Comment hygiene on the eight edited source and test files: exit 0, zero violations
- [x] T020 Packet 028 strict validation after its correction and derived-metadata repair: `RESULT: PASSED`, Errors 0, Warnings 0
- [x] T021 Derived-identity repair and strict packet validation (see the implementation summary's verification table for the recorded result)
- [x] T026 Lane I and K checks: the repeated-name search finds nothing, `node --check` passes on the four edited JavaScript files, `py_compile` passes on `skill_advisor.py`, the old and new allowlists hold the same members (21 and 41) and comment hygiene exits 0 on the eleven edited code and test files
- [x] T027 Advisor runtime build exits 0, the OpenCode plugin suite passes 29 of 29, the Pi dedup suite 15 of 15 and the doctor freshness script exits 0. The first battery after lane I ran 890 passed and 1 failed (the shim race), and after lane K it ran 891 passed, 0 failed and 7 skipped of 898, exit 0, 132.6 s
- [x] T028 Live Pi check in a three-turn RPC session: an `Advisor:` line on turn 1 (sk-git) and turn 3 (sk-doc), nothing on the byte-identical turn 2 while the advisor reported `ok` with a cache hit, and all three turns carry the line with `SPECKIT_PI_DIRECTIVE_DEDUP=0`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: a live three-turn Pi RPC session from the worktree recorded `Advisor: live; use sk-git 0.88/0.12 pass.` on the first prompt, nothing on its byte-identical repeat and `Advisor: live; use sk-doc 0.88/0.12 pass.` on a changed prompt (T028)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
