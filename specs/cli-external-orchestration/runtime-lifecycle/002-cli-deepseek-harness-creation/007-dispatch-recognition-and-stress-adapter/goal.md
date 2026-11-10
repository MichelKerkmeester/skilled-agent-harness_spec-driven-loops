---
title: "Goal: Phase 7: dispatch-recognition-and-stress-adapter"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dispatch recognition and stress adapter goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/007-dispatch-recognition-and-stress-adapter"
    last_updated_at: "2026-11-06T08:02:05Z"
    last_updated_by: "codex"
    recent_action: "Recorded strict validation result"
    next_safe_action: "Resolve remaining task-checklist gaps"
    blockers: ["Baseline counts incomplete", "Test-first order unproven"]
    key_files: ["evidence/dispatch-audit-after.txt", "evidence/rule-checks-after.txt", "evidence/stress-dsh-pi-hermes-verbose.txt", "evidence/sibling-diff.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-007-dispatch-recognition-and-stress-adapter"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: dispatch-recognition-and-stress-adapter

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every dsh task dispatch is recognized and checked against the packet's hard rules, and the stress matrix covers the kind through a shim.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hook matches `dsh (--profile )?headless` with a task or `-`, through env and shell wrappers, and never `dsh plugin`, `--dump-*` or `--help` |
| D2 | The rule checks flag a missing `-`, a missing `--approval-policy never`, a missing route patch and a repo-root cwd, each by its `hard-rules.json` id |
| D3 | `adapter-shim-core.cjs` changes only if it cannot express a dsh JSON event stream with a separate exit code |
| D4 | No test spawns the real `dsh` binary |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `node --test .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` passes with the dsh positive cases and the `dsh plugin`, `--help` and `--dump-config` negative cases
- [ ] `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` passes with cases for a missing `-`, a missing `--approval-policy never`, a missing route patch and a repo-root cwd
- [ ] vitest on `tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts` passes
- [ ] `cli-pi.vitest.ts` and `cli-hermes.vitest.ts` pass and `git diff --exit-code` on both exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Hook recognition (dsh task shape) | Built. AC-001 is met | `evidence/dispatch-audit-after.txt`: 23 files and 2854 tests pass under Vitest. The earlier `node --test` command failed because this file uses Vitest APIs (`evidence/node-test-dispatch-audit.txt`). The spec and acceptance now name Vitest |
| Rule checks (twelve ids) | Built and passing | `evidence/rule-checks-after.txt`: 50 pass, 0 fail. The current suite checks the twelve ids declared in `hard-rules.json` |
| Standalone dsh shim | Built | `evidence/task-verify-outputs.txt`: `node --check` passes and no credential read was found. The stress log records shim-only dsh coverage |
| Stress subject and suite | Built and passing | `evidence/stress-cli-adapter-after.txt`: 9 files, 169 pass, 9 skipped. `evidence/stress-dsh-pi-hermes-verbose.txt`: dsh 18 pass and 1 live-probe skip |
| Sibling suites and shared core | Unchanged against HEAD | `evidence/sibling-diff.txt`: exit 0 for cli-pi, cli-hermes and adapter-shim-core |
| Shim-core decision (T003, CHK-003) | Recorded: core unchanged | The core writes plain text. The dsh stream needs JSON event lines and a separate exit status. Pi and Hermes depend on the core as it is |
| Dependencies (T001) | Landed | `evidence/dependencies-landed.txt`: `hard-rules.json` and `buildDshLineageCommand` exist |
| Validation | Passed | `evidence/closeout-validation.txt` reports `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Runner command | The original `node --test` invocation failed because the audit file uses Vitest APIs (`evidence/node-test-dispatch-audit.txt`). The spec and acceptance criterion now name the passing Vitest command (`evidence/dispatch-audit-after.txt`) |
| Expanded scope | The closeout records all twelve rule ids and `cli-codex.vitest.ts` in the spec. The current rule suite passes 50 tests (`evidence/rule-checks-after.txt`) |
| Existing hook case | The DISPATCH_SHAPES list case in `dispatch-audit.test.mjs` now includes the dsh shape. The HEAD version fails under the new hook code (note in `evidence/part-one-checks.txt`). CHK-011 is ticked on the edited case, which passes |
| Pre-fix evidence | `evidence/part-one-checks.txt` shows 45 rule-check passes before the loosening fix. The current count is 50 (`evidence/rule-checks-after.txt`). The older file stays as history |
| Pre-edit records | The Pi and Hermes baseline counts and a pre-edit audit run were not captured. T002 and CHK-002 stay open |
| Stress README (CHK-041) | `tests/stress/cli-adapter/README.md` does not say the dsh live smoke waits on a keyed run. The README is outside this closeout's write scope |
| Real dsh binary (CHK-032) | `dsh` resolves to `/Users/michelkerkme/.local/bin/dsh`. Fixtures place the shim first on PATH, but no run records that the real binary was never spawned |
| Plan negatives (CHK-040) | `spec.md` and AC-001 list all eight negative forms and CHK-021 points to REQ-001. `plan.md` still lists three and is outside this closeout scope |
| Evidence location (CHK-050) | Run logs sit in `evidence/`, as the brief asked. The checklist asks for `scratch/` |
| Negative cases first (T004) | Nothing is committed, so the order of the negative cases against the regex cannot be shown. T004 stays open |
<!-- /ANCHOR:log -->
