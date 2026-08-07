---
title: "Tasks: Pi Dispatch Authorization Boundary Hardening"
description: "Ordered implementation and verification tasks for the Pi dispatch enforcement boundary."
trigger_phrases:
  - "Pi dispatch hardening tasks"
  - "dispatch tokenizer tasks"
  - "Pi tool_call matrix"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening"
    last_updated_at: "2026-08-04T22:26:28Z"
    last_updated_by: "phase006-evidence-refresh"
    recent_action: "Refreshed validator-recognized evidence receipts"
    next_safe_action: "Hand off evidence inventory to Phase 007"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
    session_dedup:
      fingerprint: "sha256:a97c688463b450774bf89e9e7230d5fef9d4b92217bc65cd8bb816092162d91b"
      session_id: "2026-08-04-cli-038-006-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi Dispatch Authorization Boundary Hardening

<!-- SPECKIT_LEVEL: 2 -->

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

Every task names its evidence command or artifact. Pure helper evidence is never recorded as Pi `tool_call` integration evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Record the current partial-fix source diff and inventory every `DISPATCH_SHAPES`/`matchDispatchShape` consumer. [TESTED: inventory and baseline commands]
  - [EVIDENCE: `implementation-summary.md` records the matcher inventory, baseline Pi 13/13, shared audit 327/327, Node rules 7/7, and diff check exit 0.]
- [x] T002 [P0] Reproduce the raw-text negative control without launching a CLI: exercise direct `devin -p`, `printf "devin -p task"`, `echo`, quoted prose, separators, `$CLI`, alias-shaped input, and an unknown wrapper. [TESTED: deterministic negative-control probe]
  - [EVIDENCE: `dispatch-audit.test.mjs` covers the negative-control forms and the final shared suite passes 351/351 tests.]
- [x] T003 [P1] Freeze the bounded inspector contract: direct/ambiguous/none outcomes, quote and escape handling, top-level separator rules, transparent-wrapper allowlist, opaque-indirection policy, and maximum command length. [SOURCE: implementation-summary.md] [TESTED: pure inspector matrix]
  - [EVIDENCE: `implementation-summary.md` records the 32,768-character bound and the shared inspector matrix passes 351/351 tests.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Carry the executor identity from the inspected command into Pi authorization and reject `cli-pi` before user override or deep-loop handling (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`). [TESTED: Pi suite 27/27 combined tests, including named factory self-deny]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` — PASS, 27/27 combined tests, exit 0; 27 is not a factory-only count.]
- [x] T005 [P1] Capture raw user text at the pre-transform boundary, replace it for each interactive/RPC turn, and bind it to the session; remove authorization dependence on transformed advisor/directive text (`.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` and Pi guard). [TESTED: reverse-order and session matrix]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` — PASS, 27/27 tests including reverse-order and session-mismatch rows, exit 0.]
- [x] T006 [P1] Implement positive override grammar and conservative denial for negated, quoted, variable-assignment, alias, command-substitution, and unknown-wrapper mentions. [TESTED: pure and factory authorization rows]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` — PASS, 27/27 tests covering positive and conservative-denial rows, exit 0.]
- [x] T007 [P1] Expand shared and Pi dispatch tests across every supported executor, separator, wrapper, direct/ambiguous/none outcome, runtime, and tool axis. [TESTED: shared 351/351; Pi combined suite 27/27]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` — PASS, 351/351 shared-core assertions; the Pi suite separately passes 27/27 combined pure/factory tests.]
- [x] T008 [P0] Add the real extension-factory integration harness: register the default Pi factory, capture `input` and `tool_call`, invoke the same matrix with injected advisor/directive text, run both extension registration orders, test session mismatch, and assert native `subagent` is unaffected. [TESTED: named registered ExtensionAPI callback cases within the combined Pi suite]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` — PASS, 27/27 combined tests, exit 0; the registered factory describe block invokes the recorded `input` and `tool_call` callbacks, so this result is not a factory-only count.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Run the combined Pi helper/factory suite, shared audit suite, Node rule suite, and headless Pi startup smoke; inspect output and exit status separately. [TESTED: focused suites and live smoke]
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` PASS 27/27 combined tests; `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` PASS 351/351; `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` PASS 7/7; headless Pi smoke exit 0.]
- [x] T010 [P1] Inspect the scoped diff for accidental runtime-surface changes, source comments containing ephemeral identifiers or paths, mirror drift, and whitespace errors. [TESTED: diff, marker scan, readlink]
  - [EVIDENCE: `git diff --check` exit 0; scoped marker scan found no forbidden markers; all three mirror `readlink` checks resolve to canonical sources.]
- [x] T011 [P1] Hand off a machine-readable evidence inventory to Phase 007, labeling pure helper, shared matcher, registered Pi `tool_call`, and live startup evidence separately. [SOURCE: implementation-summary.md] [TESTED: final command receipts]
  - [EVIDENCE: `implementation-summary.md` records 351/351 shared-core assertions, the combined 27/27 Pi helper/factory suite with named callback cases, 7/7 rule-core, and live startup exit 0 evidence classes.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are marked `[x]` with observed output, or an explicitly approved deferral is recorded.
  - [EVIDENCE: `tasks.md` contains completed task rows with focused command results and no blocked deferrals.]
- [x] No blocked P0 task remains.
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes the combined 27/27 Pi suite, including the named P0 factory rows, exit 0; the suite total is not a factory-only count.]
- [x] `cli-pi` self-dispatch is blocked through the registered factory.
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes the self-dispatch row within 27/27 tests, exit 0.]
- [x] Executor mismatch, raw matcher false-positive, variable/alias bypass, quoted/negated mention, and transformed-text authorization rows are all explained by passing evidence.
  - [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` passes 351/351 and the Pi suite passes 27/27 tests, both exit 0.]
- [x] Pure helper coverage and actual Pi `tool_call` coverage are reported as separate evidence classes.
  - [EVIDENCE: `implementation-summary.md` separates the 351/351 shared-core suite from the named pure and registered-factory boundaries inside the combined 27/27 Pi suite.]
- [x] Rollback boundary and residual limitations are recorded in `implementation-summary.md`.
  - [EVIDENCE: `implementation-summary.md` contains the rollback boundary and four documented residual limitations.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](spec.md).
- **Plan**: See [plan.md](plan.md).
- **Checklist**: See [checklist.md](checklist.md).
- **Parent packet**: See [../spec.md](../spec.md).
- **Next phase**: See [../007-dispatch-validation-evidence/tasks.md](../007-dispatch-validation-evidence/tasks.md).
<!-- /ANCHOR:cross-refs -->
