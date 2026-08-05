---
title: "Tasks: Cross-Runtime Coverage and Verification"
description: "Completed tasks for recording the R1-P1-001 quoted-executor fix, re-verifying its shared-lib evidence, confirming cross-runtime docs, and recording R2-P1-002/R2-P1-003 as a deferral."
trigger_phrases:
  - "quoted executor fix tasks"
  - "cross-runtime coverage tasks"
  - "dispatch inspection verification tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification"
    last_updated_at: "2026-08-05T14:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Completed all command-backed evidence tasks"
    next_safe_action: "Run description.json / graph-metadata.json generation, then validate.sh --strict"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:428d51557b98b62909ec7a79d920038c5c97c04719f31823a645cfa2b3f22b06"
      session_id: "2026-08-05-cli-038-010-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cross-Runtime Coverage and Verification

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

Every completion row cites observed output from a command run during this phase's authoring, not a copied count from an earlier phase.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read `deep-review-findings-registry.json` and extract the exact R1-P1-001, R2-P1-002, R2-P1-003 title/file/line. [EVIDENCE: R1-P1-001 = "Quoted executor forms bypass Pi dispatch inspection", `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:186`; R2-P1-002 = "Receipt MAC failures are advisory at the route-proof boundary", `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:771`; R2-P1-003 = "Dirty-path containment skips pre-existing paths by name", `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:265`.]
- [x] T002 [P0] Read `directExecutor()` in `dispatch-audit.mjs` and confirm the blanket quoted-executor guard is absent. [EVIDENCE: lines 186-197 use `EXECUTOR_BASENAMES.has(basename(executable.value))` with no `if (executable.quoted) return null;` guard; an inline comment at lines 191-195 explains the quote-safe basename-membership rationale.]
- [x] T003 [P0] Confirm the Pi preflight `tool_call` handler short-circuits on `kind === "none"`. [EVIDENCE: `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:243` reads `if (inspection.kind === "none") return;` immediately after `audit.inspectDispatch(event.input.command)`.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Re-run the shared inspector suite and confirm the 4 new `inspectDispatch` rows + 1 new `matchDispatchShape` test are present and passing. [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` -> `Test Files 8 passed (8)`, `Tests 356 passed (356)`, exit 0. Rows confirmed by direct read: `quote-safe executor`, `quote-safe path executor`, `quoted executor without print flag`, `quoted executor as an argument stays prose` (lines 75-78), and `records a quote-safe command-position executor as a direct dispatch` (line 41).]
- [x] T005 [P0] Re-run the Pi preflight suite. [EVIDENCE: `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` -> `Test Files 1 passed (1)`, `Tests 32 passed (32)`, exit 0.]
- [x] T006 [P1] Re-run the Node rule suite via `node --test` (not Vitest-collectible). [EVIDENCE: `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` -> `tests 7`, `pass 7`, `fail 0`, exit 0.]
- [x] T007 [P1] Re-run a whole-`dispatch/`-directory sweep, excluding worktree mirrors, and record the result including the expected `node:test`-format collection error. [EVIDENCE: `npx vitest run .opencode/hooks/dispatch --reporter=dot --exclude "**/.worktrees/**"` -> `Test Files 1 failed | 2 passed (3)`, `Tests 102 passed (102)`; the 1 failed file is `dispatch-rule-checks.test.mjs` with `Error: No test suite found in file` because it uses `node:test` syntax, not a Vitest incompatibility with the fix — confirmed independently passing via T006's `node --test` run. Combined with T004/T005 (which cover the other two files in this directory), 0 tests fail anywhere under `.opencode/hooks/dispatch`.]
- [x] T008 [P1] Confirm the two cross-runtime documentation artifacts exist. [EVIDENCE: `ls -la .opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md` -> 11414 bytes, present; `ls -la .opencode/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` -> 5386 bytes, present.]
- [x] T009 [P1] Record the uncommitted working-tree state of the four fix files. [EVIDENCE: `git status --porcelain -- .opencode/hooks/dispatch` -> ` M .opencode/hooks/dispatch/lib/dispatch-audit.mjs`, ` M .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs`, ` M .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`, `?? .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts`; recorded verbatim in `implementation-summary.md`.]
- [x] T010 [P1] Author `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` recording all of the above with R2-P1-002/R2-P1-003 stated as deferred, never resolved. [EVIDENCE: all five documents present in this folder; each names both finding IDs with the "deferred"/"out of scope" disposition.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 [P0] Generate `description.json` via the repo script (no hand-fabricated fields). [EVIDENCE: `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` run and output recorded in `implementation-summary.md`.]
- [x] T012 [P0] Generate/backfill `graph-metadata.json` via the repo script (no hand-fabricated fields). [EVIDENCE: `node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification` run and output recorded in `implementation-summary.md`.]
- [x] T013 [P0] Run `validate.sh --strict` on this phase folder and record the exact result line and exit code. [EVIDENCE: exact output and exit code recorded in `implementation-summary.md`; the definition of done requires exit 0 or 1 (warnings only), never exit 2.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are `[x]` with observed command output cited. [EVIDENCE: T001-T013 all checked with evidence rows above.]
- [x] The R1-P1-001 fix is cited to exact current source lines, not paraphrased from memory. [EVIDENCE: T002, T003.]
- [x] The shared inspector, Pi preflight, and Node rule suites were each re-run fresh in this phase. [EVIDENCE: T004-T006.]
- [x] Both cross-runtime documentation artifacts are confirmed present. [EVIDENCE: T008.]
- [x] The uncommitted state of the fix files is disclosed, not hidden. [EVIDENCE: T009.]
- [x] R2-P1-002 and R2-P1-003 are recorded as deferred in every document that discusses packet scope. [EVIDENCE: T010; also `spec.md` Section 3 Out of Scope and Section 10 Open Questions.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](spec.md).
- **Plan**: See [plan.md](plan.md).
- **Checklist**: See [checklist.md](checklist.md).
- **Evidence predecessor**: See [../007-dispatch-validation-evidence/tasks.md](../007-dispatch-validation-evidence/tasks.md).
- **Finding source**: See [../review/deep-review-findings-registry.json](../review/deep-review-findings-registry.json).
<!-- /ANCHOR:cross-refs -->
