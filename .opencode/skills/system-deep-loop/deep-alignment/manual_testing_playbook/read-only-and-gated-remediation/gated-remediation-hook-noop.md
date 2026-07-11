---
title: "DAL-025 -- Gated remediation hook is an enterable no-op"
description: "Verify remediate-hook.cjs proves the post-REPORT transition exists and is safe to enter while performing no remediation action: it returns not_implemented, touches no files or git, accepts --confirm without acting, and cites the operator-gate rule."
version: 1.0.0.0
---

# DAL-025 -- Gated remediation hook is an enterable no-op

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-025`.

---

## 1. OVERVIEW

This scenario validates alignment invariant 4 (gated remediation) for `DAL-025`. The objective is to verify that `remediate-hook.cjs` is the concrete, callable proof that the post-REPORT transition exists and is safe to enter while performing NO remediation action: `enterRemediateHook()` always returns `{status:'not_implemented', state:'REMEDIATE'}`, touches no files or git, accepts `--confirm` without acting on it, cites ADR-005 invariant 4 and SKILL.md's ungated-remediation NEVER rule, and carries a `safetyDiscipline` list for the eventual real implementation.

### WHY THIS MATTERS

Remediation must be a separate, opt-in, operator-approved pass — never an automatic follow-on to a read-only audit. The hook proves the state machine's REPORT->REMEDIATE transition is wired and testable today without any code that could modify the repo, so a future implementation replaces the hook's body, not its call site. This is a critical-path scenario.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the hook is enterable, returns not_implemented, mutates nothing, and stays gated behind an explicit operator opt-in.
- Real user request: After the audit, does it fix the findings automatically?
- Prompt: `Validate the deep-alignment gated-remediation hook: it is enterable, returns not_implemented, mutates nothing, and stays gated behind an explicit operator opt-in.`
- Expected execution process: Call the hook via CLI and module against a fixture directory, snapshot the directory before/after to confirm zero mutation, pass `--confirm` to confirm it is accepted-but-not-actionable, and read the returned message + safetyDiscipline.
- Desired user-facing outcome: The user is told the audit never auto-fixes anything; remediation is a separate, explicitly-approved pass that is not implemented yet, and the hook currently proves the transition is safe to enter.
- Expected signals: `enterRemediateHook()` returns `status:'not_implemented'`, `state:'REMEDIATE'`, a message citing ADR-005 invariant 4 and SKILL.md's ungated-remediation NEVER rule, and a `safetyDiscipline` list (scoped staging / worktree-when-diverged / doc-only when concurrent); `--confirm` is parsed but not actionable; the wiring test asserts `alignment/` file listing is identical before and after the hook runs.
- Pass/fail posture: PASS if the hook returns not_implemented, mutates nothing (with or without --confirm), and cites the gate. FAIL if it performs any file/git action or returns anything other than not_implemented.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the before/after snapshot brackets the hook call.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-alignment gated-remediation hook: it is enterable, returns not_implemented, mutates nothing, and stays gated behind an explicit operator opt-in.
### Commands
1. `bash: D=$(mktemp -d); mkdir -p "$D/alignment"; printf 'x' > "$D/alignment/sentinel.txt"; BEFORE=$(ls -laR "$D/alignment"); node .opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs --spec-folder "$D" --confirm --json; AFTER=$(ls -laR "$D/alignment"); [ "$BEFORE" = "$AFTER" ] && echo "UNCHANGED (expected)" || echo "MUTATED (FAIL)"`
2. `bash: rg -n 'not_implemented|REMEDIATE|operator-gated|ADR-005 invariant 4|safetyDiscipline|scoped staging|no file writes, no git operations' .opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs`
3. `bash: rg -n 'Run remediation without an explicit|Gated remediation|separate, opt-in' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
4. `bash: rg -n 'enterRemediateHook|beforeFiles|afterFiles|not_implemented' .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs`
### Expected
Command 1 prints the hook's `status:'not_implemented'` JSON and `UNCHANGED (expected)` — the `alignment/` directory (including the sentinel) is byte-identical before and after, even with `--confirm`. Command 2 shows the returned message citing ADR-005 invariant 4 and the SKILL.md NEVER rule plus the `safetyDiscipline` list and the "no file writes, no git operations" comment. Command 3 shows SKILL.md's gated-remediation rule. Command 4 shows the wiring test's before/after equality assertion.
### Evidence
Capture the not_implemented JSON, the UNCHANGED snapshot comparison, the cited-gate source, and the wiring-test before/after assertion.
### Pass/Fail
PASS if the hook returns not_implemented, mutates nothing (with or without --confirm), and cites the gate. FAIL if it performs any file/git action or returns anything other than not_implemented.
### Failure Triage
Any difference in the before/after snapshot is a hard FAIL of the read-only-hook contract. If `--confirm` triggers a real action, the gate has been prematurely opened (this must remain phase-future work).
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `read-only-and-gated-remediation/` | Invariant category; the remediation hook is exercised directly on a fixture here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs` | `enterRemediateHook` no-op, cited gate, safetyDiscipline |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` | Asserts `alignment/` listing is identical before/after the hook |
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Alignment invariant 4; NEVER-#4 (ungated remediation) |
| `.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md` | §7 the REMEDIATE hook point (ADR-005 invariant 4) |

---

## 5. SOURCE METADATA

- Group: READ-ONLY AND GATED REMEDIATION
- Playbook ID: DAL-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `read-only-and-gated-remediation/gated-remediation-hook-noop.md`
- Criticality: Critical-path scenario (see root §5 hard rule).
