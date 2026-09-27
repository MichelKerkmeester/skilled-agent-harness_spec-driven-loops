---
title: "Tasks: Cross-CLI Manual Testing of the Advisor Refinements"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cross cli testing tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cross-CLI Manual Testing of the Advisor Refinements

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

- [x] T001 Select the scenarios that exercise changed logic. Evidence: a search of both playbooks for the changed surfaces gave nine scenarios. `doctor-update-tier-aware-default` matched only incidentally and the deep-review fan-out scenarios are out of scope, see `spec.md`.
- [x] T002 Read each cli skill contract and run its auth pre-flight. Evidence: codex "Logged in using ChatGPT", devin "Logged in", cursor account present, opencode 1.18.32 with LLM Gateway configured, pi 0.87.1.
- [x] T003 Settle the three operator decisions. Evidence: Grok 4.7 added to the allowlist first, danger-full-access for Codex, two dispatches at a time.
- [x] T004 Confirm the builds under test are current. Evidence: the compiled hooks, renderer and CLI are newer than their sources, so no scenario rebuilds anything.
- [x] T005 Probe Cursor's default sandbox for local sockets. Evidence: a connect to a missing socket returned `ENOENT`, not `EPERM`, so Cursor keeps `--auto-review --sandbox enabled`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Live-test the eight Grok 4.7 ids. Evidence: `cursor-agent -p ... --model <id> --mode ask` returned `PONG` with exit 0 and empty stderr for all eight.
- [x] T007 Add the ids to both runtime allowlists and their tests (`executor-config.ts`, `fanout-run.cjs`, `executor-config.vitest.ts`, `fanout-run.vitest.ts`). Evidence: 257 of 257 pass before and after, `npm run typecheck` exit 0, `node --check` clean, comment hygiene clean.
- [x] T008 [P] Update the cli-cursor roster, references and changelog for Grok 4.7 (`.skilled/skills/cli-external-orchestration/cli-cursor/`). Evidence: three MiMo briefs, each diff reviewed, `validate_document.py` 0 issues on all nine files, `package_skill.py --check` PASS, `changelog/v1.5.0.0.md` and `version: 1.5.0.0`.
- [x] T009 Run the nine scenarios in each of the five CLIs and the casual probes (`evidence/`). Evidence: `evidence/ledger.tsv` holds 45 scenario dispatches and 4 probes, all exit 0, with 49 reports under `evidence/reports/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Check every FAIL and BLOCKED report against its evidence, rerunning it alone where contention could explain it. Evidence: the CL-006 message, the CP-003 skipped records per run window and the Pi test failure were reproduced by the orchestrator. Each FAIL is classified in `implementation-summary.md`.
- [x] T011 Read the diagnostics records by dispatch window and record native delivery per runtime. Evidence: `evidence/native-diagnostics.jsonl`, 39 records. Pi and Devin 9 ok each, Codex 6 ok and 8 fail_open in pairs, none from OpenCode or Cursor.
- [x] T012 Confirm no run wrote outside `evidence/` or touched the daemon or database. Evidence: one tracked file, an archived `test-results-composite.md`, was rewritten by Cursor's unscoped vitest and restored from HEAD. Sandbox daemons rewrote the live generation and launcher state files, which is a code defect phase 9 owns. No report shows a run stopping the live daemon. The live daemon was replaced at about 18:52 UTC for a reason not established, since other sessions share this checkout.
- [x] T013 Run `validate.sh --strict` on this phase and require `RESULT: PASSED`. Evidence: `RESULT: PASSED` after the derived metadata was repaired on 2026-09-27.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
