---
title: "Goal: Phase 7: hook-deadline-margins"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins"
    last_updated_at: "2026-10-10T17:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-007-hook-deadline-margins"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: hook-deadline-margins

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the Claude prompt-submit shim stop reading stdin at a deadline and give every spec-kit hook entry whose host allows 3 seconds a stdin deadline that leaves at least 1000 ms for its work, while every fail-open answer and every existing hook suite stays as it is.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `runtime/hooks/claude/user-prompt-submit.ts` gets an inlined, event-based stdin read with a 500 ms deadline and its 1 MB cap, and imports no sibling module, because its suite runs the `.ts` source directly. |
| D2 | The seven entries registered with `"timeout":3` in `cli/runtime-mirrors/hook-registry.json` read with `SHORT_HOST_STDIN_TIMEOUT_MS = 500`, defined in `shared-stdin.ts` and `lib/hook-adapter-shared.mjs`. Every other entry keeps 3000 ms, and the 1800 ms `withTimeout` in the Claude lifecycle hooks stays. |
| D3 | The shim's 2500 ms and the Codex adapters' 2800 ms child timeouts stay, and the case where a held-open stdin meets a child that runs to its own timeout is recorded as a residual. |
| D4 | `runtime/hooks/lib/hook-stdin-deadline.test.mjs` is replaced whole by the planner's copy, and the release is `system-spec-kit` 2.7.2.0 with `changelog/v2.7.2.0.md`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` prints `ℹ tests 39`, `ℹ pass 39` and `ℹ fail 0` and exits 0.
- [ ] `grep -n 'readSync' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` prints nothing and exits 1.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/measure-open-stdin.mjs` prints `entries=7 late=0 margin_ms=1000 runs=3` and exits 0.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/compare-fail-open.mjs` prints `cases=66 mismatches=0` and exits 0.
- [ ] `cd .skilled/skills/system-spec-kit/runtime && npx --no-install vitest run tests/hook-*.vitest.ts tests/hooks-*.vitest.ts tests/user-prompt-submit-shim.vitest.ts tests/directive-lifecycle-*.vitest.ts tests/edge-cases.vitest.ts tests/completion-evidence-sentinel.vitest.ts && node --test tests/hooks/*.test.mjs` prints `Tests  290 passed (290)`, `ℹ pass 181` and `ℹ fail 0` and exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins --strict` prints `RESULT: PASSED`.
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
| The deadline test passes 39 of 39 | Passed | `node --test hooks/lib/hook-stdin-deadline.test.mjs` -> exit 0, `ℹ tests 39`, `ℹ pass 39`, `ℹ fail 0` |
| The shim has no `readSync` left | Passed | `grep -n 'readSync' hooks/claude/user-prompt-submit.ts` -> no output, exit 1 |
| Every 3 second entry exits with at least 1000 ms to spare | Passed | `scratch/measure-open-stdin.mjs` -> exit 0, `entries=7 late=0 margin_ms=1000 runs=3` (medians 538 to 765 ms) |
| Every fail-open answer matches the recorded baseline | Passed | `scratch/compare-fail-open.mjs` -> exit 0, `cases=66 mismatches=0` |
| The vitest hook set and the node hook tests keep their counts | Passed | vitest `Tests  290 passed (290)`, node `ℹ pass 181`, `ℹ fail 0`, exit 0 |
| This folder validates strict | Passed | `validate.sh <folder> --strict` -> `Errors: 0  Warnings: 0`, `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Contracts read | Verifier read `.skilled/skills/sk-code/SKILL.md`, `sk-code-opencode/SKILL.md`, `sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md`, `.skilled/skills/sk-doc/SKILL.md` and `sk-doc/sk-create-changelog/SKILL.md` before judging the diff |
| Hermes mirror | `sync-skills-hermes.cjs --check` prints `DRIFT system-spec-kit` plus five sibling sk-code lines. Orchestrator runs the generator once after every build |
| Review | No defects found, so `scratch/fix-units.json` is `[]`. `run-all-drift-guards.sh` printed `all 4 guards PASSED` |
| Not covered by any test | The shim's 1 MB overflow path is exercised by no suite, before or after this phase. A manual 2.2 MB probe of `dist/hooks/claude/user-prompt-submit.js` printed `INPUT_OVERFLOW` and `{}` with exit 0 |
| Orchestrator steps | Done on 2026-10-10. Hermes `--check` prints `PASS: 70 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints `sk-code fresh` after the re-mint and archive copy, and the trigger index `--check` exits 0 |
<!-- /ANCHOR:log -->
