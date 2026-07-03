---
title: "Implementation Plan: Phase 20: capability-additions"
description: "Add history/resume/doctor verbs, --budget routing, env-configurable autonomy caps, retry-after recovery, and broader limit detection to mk-goal.js and goal_opencode.md, with synchronized doc updates across all six surfaces."
trigger_phrases:
  - "goal plugin capability additions plan"
  - "phase 020 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/020-capability-additions"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored plan from spec.md and the e-3 dossier backlog"
    next_safe_action: "Start Phase 1 baseline once phases 016-019 are green"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 20: capability-additions

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
| **Language/Stack** | JavaScript (OpenCode plugin, `.opencode/plugins/mk-goal.js`, 1907 lines) + Markdown command router (`goal_opencode.md`) |
| **Framework** | OpenCode plugin API (`tool()`, event hooks); no build step |
| **Storage** | Flat JSON state files under `.opencode/skills/.goal-state/`, archive under `.archive/` |
| **Testing** | `node --test` `.cjs` files in `.opencode/plugins/tests/` (subtest style per phase 018) |

### Overview
Seven small-to-medium additive capabilities from the audit's e-3 backlog, all following patterns that already exist in the plugin: new actions extend the `GOAL_ACTIONS` enum (`mk-goal.js:71`) and the `executeGoalAction` dispatch; env caps copy the char-cap override pattern (`mk-goal.js:99-102`); the doctor verb reuses the sweep dir-walk (`mk-goal.js:874-902`); history reads the same `.archive/` dir the archiver already writes (`mk-goal.js:635,828`). The one Medium item (e-3.8 retry-after recovery) extends `recordProviderUsageLimit` (`mk-goal.js:1354-1369`) with a recovery deadline. Every new verb/env lands together with its documentation across all six doc surfaces (P0, REQ-007).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 016, 017, 019 landed with mk-goal test suite green (serial `mk-goal.js` constraint)
- [x] Problem statement clear and scope documented (spec.md, sourced from dossier §B e-3)
- [x] Success criteria measurable (SC-001 through SC-005)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-009)
- [ ] Full mk-goal test suite green; new coverage for each verb/env/detection path
- [ ] Doc-sync grep passes on all six surfaces (REQ-007)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive extension of existing dispatch/enum/env patterns; no new abstraction layer, no state-schema change (the only new persisted field is the e-3.8 recovery deadline).

### Key Components
- **`GOAL_ACTIONS` + `executeGoalAction`** (`mk-goal.js:71` + tool dispatch): gains `history`, `resume`, and a doctor/health action; `goal_opencode.md` routes the new verbs.
- **`markGoalStatus`** (`mk-goal.js:1029-1047`): `resume` uses it to set `active` and clear `continuationSuppressed`/`continuationSuppressedReason`; allowed only from `paused`/`usage_limited`.
- **`normalizeOptions`** (`mk-goal.js:98-130`): gains `MK_GOAL_MAX_AUTO_TURNS`/`MK_GOAL_MAX_WALL_MS` reads mirroring the four existing char-cap envs.
- **429 detection** (`mk-goal.js:1131`): widened matcher (string codes, other error classes, quota-message patterns) behind one predicate function so tests can table-drive it.
- **`recordProviderUsageLimit`** (`mk-goal.js:1354-1369`): stores a recovery deadline derived from retry-after; continuation gating checks the deadline and un-suppresses lazily (working assumption; see spec Open Questions).
- **Status/preview output** (`goalStateLines` region): surfaces remaining auto-turns, remaining wall budget, and token budget.

### Data Flow
Unchanged for existing verbs. `history` and doctor are read-only fan-ins over `<stateDir>` + `.archive/`. `resume` and budget-set are ordinary queued mutations through the existing per-session mutation queue.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/mk-goal.js` `GOAL_ACTIONS`/dispatch | Owns the action enum and tool execution | Update: add `history`, `resume`, doctor/health (e-3.2/e-3.4/e-3.5) | New subtests per action; existing action tests unchanged |
| `.opencode/plugins/mk-goal.js` `normalizeOptions` | Owns env-override reads | Update: add `MK_GOAL_MAX_AUTO_TURNS`, `MK_GOAL_MAX_WALL_MS` (e-3.7) | Env-override subtests; defaults unchanged when env unset |
| `.opencode/plugins/mk-goal.js` 429 detection + `recordProviderUsageLimit` | Owns provider-limit handling | Update: widen detection (e-3.9), add retry-after deadline + un-suppression (e-3.8) | Table-driven detection tests; recovery round-trip test |
| `.opencode/commands/goal_opencode.md` | Command router: verbs and envelope contract | Update: route `history`/`resume`/doctor + `--budget N` (e-3.6); document new outputs | Contract lines grep; manual round-trip |
| `.opencode/plugins/tests/mk-goal-*.test.cjs` | Regression suite (all green 2026-07-03) | Update/Create: coverage for every new path | `node --test` full run, fresh output pasted |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Canonical plugin reference | Update: new verbs/envs/status fields (REQ-007) | Grep each new name |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Env inventory (exactly 10 `MK_GOAL_*` today) | Update: add new vars, defaults matching code | Var count + defaults cross-checked against code |
| Both feature catalogs (`system-spec-kit/feature_catalog/18--ux-hooks/`, `system-skill-advisor/feature_catalog/07--hooks-and-plugin/`) | Capability inventory (audited accurate 2026-07-03) | Update: new capabilities (REQ-007) | Grep each new verb/env |
| Both manual-testing playbooks (`system-spec-kit/manual_testing_playbook/18--ux-hooks/`, `system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/`) | Operator test scripts | Update: steps for new verbs (REQ-007) | Grep each new verb |
| `mk-goal.js` verifier/completion path | Owns auto-completion | Not a consumer — untouched here (phase 021) | No diff in `maybeVerifyGoal` region |

Required inventories:
- Action-enum consumers before adding verbs: `rg -n "GOAL_ACTIONS|executeGoalAction" .opencode/plugins/ .opencode/commands/goal_opencode.md`.
- Env-name collisions before adding vars: `rg -n "MK_GOAL_MAX_AUTO_TURNS|MK_GOAL_MAX_WALL_MS" .opencode/` (expect zero pre-change).
- Doc-sync verification after implementation: `rg -ln "<each-new-verb-or-env>"` across the six doc surfaces + `goal_opencode.md`.
- Algorithm invariant (e-3.9): the widened detector must never classify non-limit errors as usage limits — adversarial cases: statusCode 429 as string vs number, 4xx non-429, quota wording in unrelated error text, missing `data`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline And Inventory
- [ ] Confirm phases 016/017/019 landed; run the full mk-goal test suite and capture the green baseline
- [ ] Run the action-enum and env-collision inventories (above)

### Phase 2: Command-Surface Verbs
- [ ] e-3.2 `history`: new read-only action listing `.archive/` records; route in `goal_opencode.md`
- [ ] e-3.4 doctor/health: read-only action reporting state/archive counts, log sizes, last-sweep time, orphan candidates
- [ ] e-3.5 `resume`: mutation clearing `continuationSuppressed`, valid from `paused`/`usage_limited` only
- [ ] e-3.6 `--budget N`: parse in `goal_opencode.md`, pass `tokenBudget`; reject invalid N

### Phase 3: Autonomy And Provider Limits
- [ ] e-3.7 env caps `MK_GOAL_MAX_AUTO_TURNS`/`MK_GOAL_MAX_WALL_MS` + remaining-budget surfacing in status
- [ ] e-3.9 widen provider-limit detection behind one predicate
- [ ] e-3.8 retry-after recovery deadline + lazy un-suppression

### Phase 4: Doc Sync And Verification
- [ ] Update `goal_plugin.md`, `ENV_REFERENCE.md`, both catalogs, both playbooks with every new verb/env (REQ-007)
- [ ] Record the e-3.10 deferral confirmation in implementation-summary (REQ-009 — no code)
- [ ] Full test suite green; doc-sync grep evidence pasted; validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/Regression | Each new action (`history`, `resume`, doctor), env caps, `--budget` validation | `node --test` subtests in `.opencode/plugins/tests/` |
| Unit (table-driven) | Widened 429 detection matrix (number/string codes, error classes, quota patterns, negatives) | Same runner |
| Regression | `usage_limited` -> retry-after deadline -> un-suppression round trip | Same runner |
| Manual | `/goal history|resume|doctor|set ... --budget N` envelopes via playbook steps | Both manual-testing playbooks |
| Doc audit | Grep each new verb/env across the six doc surfaces | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 016/017/019 (serial `mk-goal.js` edits) | Internal | Pending | Cannot start; parallel edits would conflict and invalidate baselines |
| Phase 018 test restructure | Internal | Pending | New tests would be written in the old monolithic style and need re-conversion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: mk-goal test suite regresses, a new verb corrupts state files, or doc surfaces drift from shipped behavior
- **Procedure**: revert `mk-goal.js` + `goal_opencode.md` via targeted `git checkout` of the pre-phase commit; all additions are additive (new enum values, new envs, new read-only verbs), so reverting restores the exact phase-019 behavior; doc-surface edits revert file-by-file the same way
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
