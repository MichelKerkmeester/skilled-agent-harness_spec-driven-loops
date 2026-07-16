---
title: "Implementation Plan: Phase 21: completion-verifier-wiring"
description: "Present the (a)/(b)/(c) supervisorVerifier design fork from the audit dossier, gate all implementation behind an explicit operator selection, then wire the selected verifier as the production default at the mk-goal.js:128/1197-1199 seam."
trigger_phrases:
  - "goal completion verifier wiring plan"
  - "supervisor verifier design fork plan"
  - "phase 021 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/021-completion-verifier-wiring"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored plan from spec.md's design-fork table and the e-3.1 dossier finding"
    next_safe_action: "Present the (a)/(b)/(c) fork; do not start Phase 2 until selection is recorded"
    blockers:
      - "HARD GATE: operator has not yet selected verifier design option (a), (b), or (c)"
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-supervisor.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which verifier design: (a) LLM via ctx.client, (b) structural/heuristic from evidence, or (c) hybrid (recommended)? Operator sign-off required before Phase 2 starts."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 21: completion-verifier-wiring

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (OpenCode plugin, `.opencode/plugins/mk-goal.js`, 1907 lines) |
| **Framework** | OpenCode plugin API (`tool()`, `options` injection seam); no build step |
| **Storage** | Flat JSON state files under `.opencode/skills/.goal-state/`; verdict fields on the goal record |
| **Testing** | `node --test` `.cjs` files in `.opencode/plugins/tests/`, including `mk-goal-supervisor.test.cjs` (injected-verifier contract) |

### Overview
`supervisorVerifier` is options-injectable only (`mk-goal.js:128`, `:1197-1199`). OpenCode's plugin loader never passes `options` to a plugin, so in every real (non-test) session the verifier resolves to "not configured" and `maybeVerifyGoal` always returns `not_met` — goals can never auto-complete in production, only via caps. This plan does two things in strict order: (1) present the three design options already tabulated in spec.md §3 and gate ALL implementation on an explicit operator selection (REQ-001, HARD GATE — precedent: phase 013's F-003/F-014 fork, where the fork was surfaced and decided rather than silently picked); (2) once selected, wire that design as the production default at the existing seam, preserving injected-verifier precedence so `mk-goal-supervisor.test.cjs` keeps passing unmodified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 020 landed with the mk-goal test suite green (serial `mk-goal.js` edit constraint: 016+017+019+020 then 021)
- [x] Problem statement clear and scope documented (spec.md, sourced from dossier §B e-3.1)
- [x] Design fork tabulated with trade-offs and a recommendation (spec.md §3, option (c))
- [ ] Operator has explicitly selected (a), (b), or (c) — **HARD GATE, blocks all of Phase 2 onward**

### Definition of Done
- [ ] Operator selection recorded in spec.md Open Questions (moved to answered) and in `_memory.continuity.answered_questions`, with date and chooser, before any `mk-goal.js` diff exists (REQ-001)
- [ ] Selected verifier ships as the production default (REQ-002); acceptance criteria for REQ-003/REQ-004/REQ-005 met
- [ ] Full mk-goal test suite green, including unmodified injected-verifier precedence behavior
- [ ] Doc sync (goal_plugin.md, ENV_REFERENCE.md if new env, both feature catalogs, both playbooks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Design-fork-first, then additive default-fill at an existing injection seam. No change to the injection mechanism itself — the fix is a fallback default when `options.supervisorVerifier` is absent, not a new abstraction layer.

### Key Components (per selected option — do not implement until REQ-001 is satisfied)

- **`normalizeOptions` (`mk-goal.js:98-130`)**: currently reads `options.supervisorVerifier` with no fallback (`:128`). Gains a default-verifier fallback function when the option is absent, for whichever design is selected.
- **`maybeVerifyGoal` (region around `:1195-1279`)**: currently short-circuits to `not_met` with "Supervisor verifier is not configured" at `:1197-1199` when no verifier is injected. Gains a call into the default verifier instead of the hardcoded not-configured path; the early-return/applied-path envelope-shape gap noted in the dossier (e-2.5) is explicitly OUT of scope here (owned by phase 019) — the default verifier must conform to today's envelope shape, not change it.
- **Option (a) — LLM verifier**: a new function calling `ctx.client` (the session model handle) with the goal objective + captured evidence, parsing a structured verdict. Requires a way to reach `ctx.client` from the verification call path — confirm this handle's availability at implementation time; if unavailable at the verification call site, this option narrows to "requires plumbing `ctx` through," which is itself a design cost worth weighing before selection.
- **Option (b) — Structural/heuristic verifier**: deterministic rules over the same evidence shape `maybeVerifyGoal` already captures (e.g., checklist/tasks completion markers, explicit completion evidence strings) with conservative thresholds to avoid false auto-completes (dossier risk, spec.md §6).
- **Option (c) — Hybrid (recommended)**: (b) always runs as the default; one new env flag (name TBD at sign-off, working default `MK_GOAL_VERIFIER=heuristic|llm`, default `heuristic`) upgrades to (a) when set. This is the only option requiring a new `normalizeOptions` env read, following the existing env-override pattern already used for char caps (`:99-102`).
- **Verdict provenance (REQ-004)**: whichever option ships, the verdict envelope/status output gains a field identifying the verifier source (`injected` / `default-heuristic` / `default-llm`) so operators can audit structural vs. semantic completes.

### Data Flow
Unchanged for the injected path (tests keep passing). For the default path: `maybeVerifyGoal` resolves the effective verifier (injected > default) once per call via `normalizeOptions`, invokes it against the same evidence it already assembles, and stamps provenance on the resulting envelope before persisting/returning it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-goal.js:128` (`normalizeOptions` verifier read) | Reads `options.supervisorVerifier`, no fallback | Update: add default-verifier fallback per selected design | Unit test: no-options load resolves to the default, not `undefined` |
| `mk-goal.js:1195-1279` (`maybeVerifyGoal`) | Short-circuits to `not_met`/"not configured" when unconfigured (`:1197-1199`) | Update: call the resolved verifier (injected or default) instead of the hardcoded not-configured path | Production-shaped test (no options injection) reaches `complete` on satisfying evidence; unsatisfying evidence stays `not_met` |
| `mk-goal.js` env reads (`normalizeOptions`, `:99-102` pattern) | Owns char-cap env overrides today | Update (option (c) only): add the verifier-mode env flag | Env-override subtest; default unset behaves as `heuristic` |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Pins injected-verifier precedence and today's not-configured behavior | Update: keep injected-precedence assertions passing unmodified in behavior; add default-verifier met/not_met/error coverage | Full file run, fresh output pasted |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Canonical plugin reference (accurate 2026-07-03) | Update: document the default verifier and any new env | Grep for new verb/env/field names |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Env inventory (exactly 10 `MK_GOAL_*` vars today) | Update (option (a)/(c) only): add new env with code-matching default | Var count + default cross-checked against code |
| Both feature catalogs + both manual-testing playbooks | Capability inventory / operator scripts (audited accurate 2026-07-03) | Update: verifier capability row/steps, same six-surface discipline as phase 020 REQ-007 | Grep each new name |
| `mk-goal.js` action-enum / command-surface verbs (phase 020 scope) | Owns `history`/`resume`/doctor/`--budget` | Not a consumer — untouched here | No diff outside the verifier seam |

Required inventories:
- Confirm the exact not-configured short-circuit and its callers before editing: `rg -n "supervisorVerifier|not configured|maybeVerifyGoal" .opencode/plugins/mk-goal.js`.
- Confirm no other call site depends on the "always not_met without options" behavior as a feature (rather than a gap): `rg -n "not_met" .opencode/plugins/ .opencode/skills/`.
- Algorithm invariant (SC-004): the default verifier must never produce a false `met` verdict — adversarial cases: empty evidence, evidence present but not satisfying the criteria, malformed/partial evidence, evidence for a different objective than the current goal's.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Design Fork Sign-Off (HARD GATE — blocks everything below)
- [ ] Present the (a)/(b)/(c) table (spec.md §3) to the operator with the recommendation ((c)) and the pending env-flag-name sub-question
- [ ] Record the explicit selection in spec.md §7 (move to answered) and in `_memory.continuity.answered_questions`, with date and chooser
- [ ] Do NOT proceed to Phase 2 until this task is checked off with a recorded selection — a phase with implementation diffs but no recorded selection is a hard violation (REQ-001)

### Phase 2: Baseline (conditional on Phase 1)
- [ ] Confirm phase 020 landed; run the full mk-goal test suite and capture the green baseline
- [ ] Confirm the exact seam lines (`normalizeOptions` verifier read, `maybeVerifyGoal` not-configured short-circuit) still match the dossier's citations

### Phase 3: Default Verifier Implementation (conditional on Phase 1's selection)
- [ ] Implement the selected design's default verifier function against the existing evidence shape
- [ ] Wire it into `normalizeOptions`/`maybeVerifyGoal` as the fallback when `options.supervisorVerifier` is absent; injected verifier still takes precedence when present
- [ ] Add verdict provenance to the envelope/status output (REQ-004)
- [ ] If (c): add the env flag read, default `heuristic`

### Phase 4: Verification And Doc Sync
- [ ] Add default-verifier met/not_met/error-path tests; keep existing injected-precedence assertions passing unmodified
- [ ] Run full mk-goal test suite; paste fresh green output and report delta vs the Phase 2 baseline
- [ ] Doc sync: goal_plugin.md, ENV_REFERENCE.md (if new env), both feature catalogs, both playbooks — grep evidence pasted
- [ ] `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Injected-verifier precedence unchanged (existing `mk-goal-supervisor.test.cjs` assertions) | `node --test` |
| Unit | Default verifier: met / not_met / error paths against the selected design's criteria | Same runner |
| Unit | Negative path: unsatisfying/empty/malformed evidence stays `not_met` (SC-004) | Same runner, adversarial cases from the AFFECTED SURFACES invariant |
| Integration | Production-shaped load (no options injection) reaches `complete` on satisfying evidence (SC-002) | Same runner |
| Unit (option (c) only) | Env-flag override selects LLM tier; unset defaults to heuristic | Same runner |
| Manual | Verdict provenance visible in status output for both injected and default paths | Playbook step |
| Doc audit | Grep each new verb/env/field across the six doc surfaces | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator sign-off on the design fork (REQ-001) | Decision | Pending — HARD GATE | All of Phase 2 onward stalls; this is by design, not an oversight |
| Phase 020 (serial `mk-goal.js` edit constraint) | Internal | Pending | Cannot start Phase 2; parallel edits would conflict and invalidate the baseline |
| Availability of `ctx.client` at the verification call site (option (a)/(c) only) | Internal, unconfirmed | Unknown until implementation | If unavailable, narrows option (a)/(c)'s LLM tier feasibility; escalate back to the operator if discovered post-selection |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: mk-goal test suite regresses, the default verifier produces false auto-completes in the field, or injected-verifier precedence breaks
- **Procedure**: revert `mk-goal.js` via targeted `git checkout` of the pre-phase commit; the change is additive (a fallback path plus one optional env flag), so reverting restores today's "never auto-complete without options" behavior exactly; doc-surface edits revert file-by-file the same way
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
