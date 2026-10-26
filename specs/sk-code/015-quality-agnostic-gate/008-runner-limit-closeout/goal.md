---
title: "Goal: Phase 8: runner-limit-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "runner limit closeout goal"
  - "quality runner budget goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/008-runner-limit-closeout"
    last_updated_at: "2026-10-26T11:19:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Amended D3 for the bounded files-scope guard listing and closed the packet"
    next_safe_action: "Hand the packet to the conductor for the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-runner-limit-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: runner-limit-closeout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every item the built-in runner phase left open, so one run over fifty changed files finishes under two seconds, a `present` pre-commit layer means a checker that exists and can run, a declared generated path is really checked with no write anywhere, and the guard's boundary is written down with the number behind it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The pre-commit layer reads `present` only when the checker path its hook names resolves to a regular file with the execute bit, and reads `broken` otherwise (ADR-001). |
| D2 | The freshness library's read-only mode is opt-in. Its writable default and the four session-start callers stay as they are (ADR-002). |
| D3 | A run reads the workspace listing at most once, bounded to the folders the scope reaches. A `--files` run takes no scope listing and one bounded untracked listing per guard snapshot, limited to the folders its named files sit in (ADR-003). |
| D4 | The budget is proven by five runs of one recorded command, with the machine and the HEAD beside the five lines. A timing figure is recorded and never asserted in a test (ADR-003). |
| D5 | The guard watches the target repository and the scope only. An ignored watch is added inside the scope within the measured budget, and the contract states the boundary either way (ADR-004). |
| D6 | The spec-folder checklist row is scoped by the repository that owns the declaring hub, not by the file's surface label, and the three JavaScript and CSS rows keep matching by path alone (ADR-005). |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test --test-reporter=tap --test-name-pattern='^unit: layers' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`, and the `unit: layers` case asserts `present` for a checker that exists, `broken` for a missing checker and `broken` for a checker without the execute bit. `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files .skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs --format json` still prints `"pre_commit_hygiene": "present"` for this repository's own hook.
- [x] `node --test --test-reporter=tap --test-name-pattern='^F20|^unit: dist read-only' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`, and a cache record written beside a dist entry fails fixture F20, which snapshots the `**/dist/**` folders a declared generated path lives in.
- [x] `for run in 1 2 3 4 5; do /usr/bin/time -p node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines, and each one reads under `2.00`.
- [x] `rg -c '91555|447' specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout/decision-record.md` prints `2`, and `rg -n 'ignored' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` prints the line that states what `withGuard` sees and what stays outside it.
- [x] `rg -c 'closed by' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints `4`, and `rg -c 'phase 005' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints `1`.
- [x] `node --test --test-reporter=tap --test-name-pattern='^F21|^F22' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`, and fixture F22 lists `spec-folder-authoring-checklist.md` for this repository's own spec files while fixture F21 lists nothing for a foreign repository.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout --strict --no-recursive` prints `RESULT: PASSED`.
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
| Packet documents authored | Done | `validate.sh --strict --no-recursive` printed `Summary: Errors: 0  Warnings: 0` then `RESULT: PASSED`, exit 0. `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)`. The placeholder scan printed nothing |
| Phase implementation | Done | Tasks T001 to T055 are `[x]` in `tasks.md`, and the strict validator printed `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Baseline under load | `tasks.md` T004 recorded 2.89 to 5.29 seconds for the fifty-file scope with the machine under load, against the 2.01 to 2.28 the plan records at `f69e5cd2e8`. The after numbers must come from the same command on the same machine |
| D3 amendment, 2026-10-26 | The review fix round gave each guard snapshot of a `--files` run one bounded untracked listing over the folders its named files sit in, so a file a check creates beside one is still caught. D3 had said no untracked listing at all, so it now states the bounded listing and keeps its ADR-003 reference |
<!-- /ANCHOR:log -->

---
