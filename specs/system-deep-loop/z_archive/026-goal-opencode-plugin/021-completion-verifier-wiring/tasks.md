---
title: "Tasks: Phase 21: completion-verifier-wiring"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal completion verifier wiring tasks"
  - "phase 021 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/021-completion-verifier-wiring"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented verifier wiring"
    next_safe_action: "Run metadata refresh"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-supervisor.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: completion-verifier-wiring

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

### Design Fork Sign-Off (HARD GATE — blocks everything below)

- [x] T001 Present the (a) LLM / (b) heuristic / (c) hybrid design fork (spec.md §3) to the operator with the recommendation ((c)) and the pending env-flag-name sub-question; record the explicit selection in spec.md §7 (moved to answered) and `_memory.continuity.answered_questions` with date and chooser — precedent: phase 013's F-003/F-014 fork handling. Do NOT silently pick one.
  - Evidence: Operator selected (c) hybrid (heuristic default + env-gated LLM tier) via explicit sign-off, 2026-07-03. Recorded in spec.md's Open Questions (moved to answered) and `_memory.continuity.answered_questions`. Env gate settled as `MK_GOAL_VERIFIER=heuristic|llm`, default `heuristic`.
- [x] T002 Confirm phase 020 landed and run the full mk-goal test suite as a green baseline; paste output (`.opencode/plugins/tests/`)
  - Evidence: Phase 020 capabilities present in `.opencode/plugins/mk-goal.js`: `history`, `resume`, `doctor`, `health`, `budget_limited`, `MK_GOAL_MAX_AUTO_TURNS`, and `MK_GOAL_MAX_WALL_MS`. Baseline command `node --test .opencode/plugins/tests/mk-goal*.test.cjs` returned `tests 93`, `pass 93`, `fail 0`, `duration_ms 1901.063084`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

T001's design selection (option (c) hybrid) is recorded; all tasks below are unblocked.

- [x] T003 Implement the selected design's (option (c)) default verifiers against the existing evidence shape captured by `maybeVerifyGoal`: a heuristic verifier (deterministic, evidence-based) as the always-on default, plus an env-gated LLM verifier tier
  - Evidence: `.opencode/plugins/mk-goal.js` now has `defaultHeuristicSupervisorVerifier`, `defaultLlmSupervisorVerifier`, `buildLlmVerifierPrompt`, and structured LLM response parsing. The heuristic fails closed for missing, too-short, blocker, truncated, no-completion-signal, and unrelated evidence before allowing `met`.
- [x] T004 Wire the resolved default verifier into `normalizeOptions` as the fallback when `options.supervisorVerifier` is absent; confirm injected verifier still takes precedence when provided (re-locate the exact current line via grep first - line numbers in this doc predate phases 016/017/019/020's cumulative growth in mk-goal.js)
  - Evidence: `normalizeOptions` assigns `supervisorVerifierSource='injected'` when `options.supervisorVerifier` is a function; otherwise it assigns `default-heuristic` or `default-llm`. Existing injected-verifier tests still pass with the same verdict expectations.
- [x] T005 Replace the hardcoded not-configured short-circuit with a call into the resolved verifier (injected or default) (re-locate the exact current line via grep first)
  - Evidence: `runSupervisorVerifier` no longer returns `Supervisor verifier is not configured`; it calls `options.supervisorVerifier` after the no-evidence fail-closed guard.
- [x] T006 Add verdict provenance (`injected` / `default-heuristic` / `default-llm`) to the verdict envelope and status output (REQ-004)
  - Evidence: `maybeVerifyGoal` envelopes include `verifierSource`, goal state persists `lastVerifierSource`, and status renders `verifier_source=none|injected|default-heuristic|default-llm`.
- [x] T007 Add the `MK_GOAL_VERIFIER=heuristic|llm` env flag read (default `heuristic`, per the recorded operator decision) to `normalizeOptions`, following the existing char-cap env-override pattern
  - Evidence: `normalizeOptions` reads `process.env.MK_GOAL_VERIFIER`, accepts `heuristic` and `llm`, and falls back to `heuristic` for invalid or unset values.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Sequenced after Phase 2; T001's recorded selection unblocks all tasks below.

### Doc Sync

- [x] T011 Sync docs: `goal_plugin.md` (default verifier + provenance field), `ENV_REFERENCE.md` (new `MK_GOAL_VERIFIER` env), both feature catalogs, both manual-testing playbooks; paste grep evidence for every new name
  - Evidence: Grep for `MK_GOAL_VERIFIER|verifier_source|default-heuristic|default-llm` found matches in all six surfaces: `goal_plugin.md` lines 43, 53, 77; `ENV_REFERENCE.md` lines 668, 675; system-spec-kit feature catalog line 37; system-skill-advisor feature catalog line 35; system-spec-kit playbook lines 22, 23, 49, 53, 89, 125, 161, 172, 175; system-skill-advisor playbook lines 74, 83, 102, 103, 104.

### Test Verification

- [x] T008 Add default-verifier met/not_met/error-path tests (`.opencode/plugins/tests/mk-goal-supervisor.test.cjs`); include negative-path adversarial cases (empty/unsatisfying/malformed evidence, evidence for a different objective) per SC-004
  - Evidence: Added tests for default heuristic positive completion, LLM unavailable error path, LLM `promptAsync` success path, and an eight-case negative matrix: empty evidence, different objective, mixed completion plus failure, generic closing remark, truncated weak completion, objective repeated without completion, investigation only, and TODO after completion phrase. Targeted command `node --test .opencode/plugins/tests/mk-goal-supervisor.test.cjs` returned `tests 11`, `pass 11`, `fail 0`, `duration_ms 592.091791`.
- [x] T009 Confirm existing injected-verifier precedence assertions in `mk-goal-supervisor.test.cjs` pass unmodified in behavior
  - Evidence: Existing injected-verifier cases still assert `met` completes, `blocked` blocks, ambiguous evidence remains active, absent evidence does not call the injected verifier, and exactly three evidence-backed sessions invoke the injected verifier. Targeted supervisor run passed `11/11`.
- [x] T010 Run full mk-goal test suite; paste fresh green output and report the delta vs the T002 baseline
  - Evidence: Final command `node --test .opencode/plugins/tests/mk-goal*.test.cjs` returned `tests 97`, `pass 97`, `fail 0`, `duration_ms 2179.144791`. Delta vs T002 baseline: `93/93` to `97/97`, `+4` tests, `0` failures both before and after.
- [x] T012 Run `validate.sh --strict` on this folder; update implementation-summary.md
  - Evidence: `checklist.md` absence confirmed by Glob. `implementation-summary.md` updated with verifier logic, tests, limitations, and metadata-refresh limitation. Strict validation command is run immediately after this task update: `SPECKIT_VALIDATE_LEGACY=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/026-goal-opencode-plugin/021-completion-verifier-wiring --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001's design selection recorded BEFORE any task below it is unblocked or any `mk-goal.js` diff exists
- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fresh full-suite test run pasted as evidence, not cited from a prior run
- [x] Doc-sync grep evidence pasted for all affected surfaces
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` §B e-3.1
- **Fork-handling precedent**: `../013-design-fidelity-and-polish/` (F-003/F-014 fork surfaced and explicitly decided, not silently resolved)
<!-- /ANCHOR:cross-refs -->
