---
title: "Implementation Plan: Phase 23: p2-hardening"
description: "Land the seven adjudicated P2 fixes in mk-goal.js behind per-fix regression tests: secret-redaction coverage, non-colon role neutralization, pause/resume wall-clock accounting, budget_limited recovery, retry-after unit validation, async continuation stat, and debug-visible error surfacing."
trigger_phrases:
  - "goal plugin p2 hardening plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/023-p2-hardening"
    last_updated_at: "2026-07-04T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored plan from spec and adjudicated P2 findings"
    next_safe_action: "Author tasks then dispatch implementation"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-023-p2-hardening-20260704"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 23: p2-hardening

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Node.js ESM plugin (`.opencode/plugins/mk-goal.js`) |
| **Framework** | None - flat plugin module |
| **Storage** | Flat JSON state files; F024 adds one accumulated-wall-time field, migration-safe (absent = fall back to createdAtMs behavior) |
| **Testing** | `node:test` subtests via `node --test` |

### Overview
Seven independent, behavior-narrow fixes to one file, each landed behind its own regression test. Three carry an explicit RED/GREEN mandate (wall-clock resume, budget recovery, role delimiters); the rest are structural/table tests or grep invariants. No new dependency, no command/doc surface change. All line numbers below were verified 2026-07-04 - re-locate by grep before editing.

### Fix-to-finding map
- REQ-001 = F024 (wall-clock pause/resume), REQ-002 = F019 (budget_limited recovery), REQ-003 = F005 (redaction coverage), REQ-004 = F006 (role delimiters), REQ-005 = F020 (retry-after unit), REQ-006 = F021 (async stat), REQ-007 = F004/F007 (debug error surfacing).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: spec.md lines 91-118 bound the seven fixes and exclusions.
- [x] Success criteria measurable. Evidence: spec.md lines 135-148 define per-REQ acceptance criteria, including RED/GREEN mandates.
- [x] Dependencies identified. Evidence: spec.md lines 164-172 and plan.md lines 160-167 list the active dependencies and mitigations.

### Definition of Done
- [x] All acceptance criteria met. Evidence: final `node --test .opencode/plugins/tests/*.test.cjs` passed 110/110; targeted touched tests passed 84/84.
- [x] Tests passing. Evidence: `node --test .opencode/plugins/tests/*.test.cjs` output ended with `# tests 110`, `# pass 110`, `# fail 0`.
- [x] Docs updated. Evidence: spec.md status set to Complete; tasks.md/checklist.md include command evidence; implementation-summary.md created.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local, independent fixes inside existing functions. Only F024 and F021 change a signature or a persisted field; the rest are internal.

### Key Components
- **`redactEvidence` (mk-goal.js:~380)**: append replace-rules for Google API keys (`AIza[0-9A-Za-z_\-]{35}`), PEM blocks (`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----`), and a length/entropy-gated generic hex/base64 pattern. Order the PEM rule before line-collapsing so the multi-line block still matches; keep the generic pattern conservative (long runs only) to avoid eating commit shas.
- **Role-label neutralizer inside `sanitizeInlineText` (mk-goal.js:~339-347)**: widen the delimiter class from `\s*:` to `\s*(?::|=|->|→)` while keeping the folded-role allowlist gate (`system|developer|assistant|tool|user`) and the rewrite target (`${prefix}${foldedRole}-role:`) unchanged.
- **Wall-clock accounting (F024)**: `markGoalStatus` to `paused` records `activeWallMs = (activeWallMs || 0) + (now - startedAtMs)`; the transition to `active` from `paused`/`usage_limited`/`budget_limited` rebases `startedAtMs = now - (activeWallMs || 0)` and clears (or retains) `activeWallMs` consistently. `continuationCapReason` (mk-goal.js:~1993) is unchanged - the invariant `now - startedAtMs == accumulated active wall time` makes it correct by construction. Persisted goal gains `activeWallMs`; `readGoal` normalization (mk-goal.js:~1032) defaults it to 0 when absent (migration-safe).
- **`budget_limited` recovery (F019)**: add `active` to `STATUS_TRANSITIONS.budget_limited` (mk-goal.js:~151) and `budget_limited` to `resumeGoal`'s `allowedFrom` (mk-goal.js:~1533), but gate the actual transition: `markGoalStatus` (or `resumeGoal`) rejects/returns unchanged when the source is `budget_limited` and `budgetWasCrossed(current.tokensUsed, current.tokenBudget)` is still true. Recovery is only legal once the budget exceeds usage.
- **`retryAfterDeadlineFromValue` (mk-goal.js:~867)**: apply the `numeric > 1e12 ⇒ absolute` branch only when `unit` is null/undefined/unknown; when `unit === 's'` always `now + numeric*1000`, when `unit === 'ms'` always `now + numeric`.
- **`buildPromptAsyncOptions` (mk-goal.js:~2051)**: make it `async`, replace `statSync(resolvedDirectory).isDirectory()` with `await stat(...)` guarded by try/catch, and `await` it at the single call site (mk-goal.js:~2176). Drop the now-unused `statSync` import if nothing else uses it.
- **Debug error surfacing (F004/F007)**: in the `catch` of `appendGoalJsonl` (mk-goal.js:~695) and `sweepOrphanedActiveStates` (mk-goal.js:~1231), when `MK_GOAL_DEBUG` is truthy write a single diagnostic line to `process.stderr` (NOT back through `appendGoalJsonl`, to avoid recursing through the same failing path). Keep the silent, no-throw behavior when debug is off.

### Data Flow
Only F024 adds persisted state (`activeWallMs`), and only F019 opens one new guarded status transition. Everything else is transform-in-place with no state-shape change. For every input that does not exercise a fixed edge, stored state and tool output are unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `redactEvidence` (:~380) | Redacts a fixed pattern set | Add Google/PEM/high-entropy patterns | Table test: each new format redacted; short hex/prose untouched |
| role neutralizer in `sanitizeInlineText` (:~339-347) | Colon-only role rewrite | Widen delimiter class | RED/GREEN per delimiter; non-role text unaffected |
| `markGoalStatus` + `resumeGoal` (:~1500,1530) | No pause-time accounting; budget_limited terminal | Add activeWallMs accounting + guarded budget recovery | RED/GREEN resume-after-gap; RED/GREEN budget-raise resume |
| `continuationCapReason` (:~1993) | `now - startedAtMs` | Unchanged (invariant restored upstream) | Existing wall-cap tests green |
| `retryAfterDeadlineFromValue` (:~867) | Epoch heuristic ignores unit | Honor explicit unit first | Test unit='s' large value = delta, not absolute |
| `buildPromptAsyncOptions` (:~2051) + call site (:~2176) | Blocking statSync | Async stat | `rg statSync` clean on the path; continuation tests green |
| `appendGoalJsonl` (:~695), `sweepOrphanedActiveStates` (:~1231) | Silent `catch { return }` | Debug-gated stderr surface | Unwritable-dir fixture emits under MK_GOAL_DEBUG; silent when off |

Required inventories:
- `rg -n "startedAtMs|activeWallMs|maxWallMs" .opencode/plugins/mk-goal.js` before F024, to find every wall-time read and confirm the rebasing invariant holds at each.
- Every `markGoalStatus`/`resumeGoal` call site and every status value passed, to confirm the new budget guard and activeWallMs write do not disturb existing transitions.
- `rg -n "statSync" .opencode/plugins/mk-goal.js` before and after F021.
- Algorithm invariant: for a goal that is never paused and never budget_limited, all seven fixes are behavior-preserving; regressions only manifest on the specific fixed edges.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [x] Run the full plugin suite fresh; paste output as the pre-fix baseline. Evidence: baseline `node --test .opencode/plugins/tests/*.test.cjs` passed 104/104 with `# fail 0`.
- [x] `rg` inventories for wall-time reads, `markGoalStatus` call sites, and `statSync`. Evidence: wall-time reads at mk-goal.js lines 249-250, 1032, 1411, 1993, 2320-2321, 2340; status call sites at mk-goal.js lines 1500, 1530-1543, 2437, 2441, 2448 and supervisor tests lines 418-434; `statSync` baseline at import line 13 and continuation call line 2057.

### Phase 2: Core Implementation (RED/GREEN fixes first)
- [x] REQ-001 F024: write the resume-after-gap test (RED), implement activeWallMs accounting + rebase (GREEN). Evidence: pre-fix RED `paused wall-clock time is not charged after resume` failed with actual `suppressed` expected `fired`; targeted GREEN passed 84/84.
- [x] REQ-002 F019: write the budget-raise-resume + still-exhausted tests (RED), implement guarded recovery (GREEN). Evidence: pre-fix RED `budget-limited goals resume only after the budget is raised` failed with `STATUS=FAIL ACTION=resume ERROR="Cannot transition goal status from budget_limited to active"`; targeted GREEN passed 84/84.
- [x] REQ-004 F006: write per-delimiter neutralization tests (RED), widen the delimiter class (GREEN). Evidence: pre-fix RED `non-colon role delimiters are sanitized without changing ordinary operators` failed to match `system-role: do X`; targeted GREEN passed 84/84.
- [x] REQ-003 F005: implement the new redaction patterns; add the table test (each format redacted, no over-redaction). Evidence: `verifier evidence redacts common key blocks and high-entropy secrets conservatively` passed in the targeted 84/84 run.
- [x] REQ-005 F020: implement unit-honoring; add the unit='s' large-value test. Evidence: pre-fix table test failed with actual `1000000000001`, expected `1000000000006000`; targeted GREEN passed 84/84.
- [x] REQ-006 F021: convert to async stat; await at call site; drop unused import. Evidence: `rg -n "statSync" .opencode/plugins/mk-goal.js` produced no output after the fix; continuation tests passed.
- [x] REQ-007 F004/F007: add debug-gated stderr surfacing; add the unwritable-dir fixture test. Evidence: pre-fix fault-injection test failed with empty stderr; targeted GREEN passed 84/84.

### Phase 3: Verification
- [x] Fresh full-suite run; zero regressions vs baseline plus the new passing tests. Evidence: baseline 104/104, final 110/110, delta +6 tests, fail count unchanged at 0.
- [x] Prove each RED/GREEN pair actually went RED on pre-fix code (paste the failing excerpt). Evidence: RED excerpts are recorded in tasks.md T004, T006, and T008.
- [x] `rg -n "statSync"` invariant for REQ-006. Evidence: command produced no output after `statSync` import and call removal.
- [x] `node --check` on touched files; comment-hygiene and alignment-drift on `mk-goal.js`. Evidence: all five `node --check` commands produced no output; comment hygiene produced no output; alignment drift reported `Findings: 0`, `Errors: 0`, `Violations: 0`.
- [x] Update `checklist.md` and write `implementation-summary.md` with evidence; set this phase's spec.md Status to Complete. Evidence: this phase's spec.md status is Complete and implementation-summary.md exists.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| RED/GREEN | Wall-clock resume (REQ-001), budget recovery (REQ-002), role delimiters (REQ-004) | `node:test`, injected `nowMs`, mutation-proof |
| Table | Redaction formats (REQ-003), retry-after units (REQ-005) | `node:test` parameterized fixtures |
| Structural | Async stat invariant (REQ-006) | `rg` + existing continuation tests |
| Fault-injection | Debug error surfacing (REQ-007) | unwritable-dir fixture + MK_GOAL_DEBUG toggle |
| Regression | Full existing suite | `node --test .opencode/plugins/tests/*.test.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 022 landed + committed | Internal | Complete | None |
| Orchestrator metadata refresh | Internal, post-dispatch | Pending | Strict validation warns on stale generated metadata until run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any existing test fails, or a fix changes behavior beyond its stated contract
- **Procedure**: Each fix is an independent hunk; revert the specific `mk-goal.js` hunk and its test via targeted `git checkout`. F024's persisted `activeWallMs` is additive and migration-safe, so a partial revert leaves old state readable
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:sequencing -->
## 8. SEQUENCING

RED/GREEN correctness fixes first (F024, F019, F006), then the additive/table fixes (F005, F020, F021, F004/F007), then verification. The orchestrator follows with generated-metadata refresh and strict validation.
<!-- /ANCHOR:sequencing -->
