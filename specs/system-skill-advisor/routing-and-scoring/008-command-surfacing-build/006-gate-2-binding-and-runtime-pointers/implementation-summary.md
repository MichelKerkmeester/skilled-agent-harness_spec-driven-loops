---
title: "Implementation Summary"
description: "Built and verified on 2026-11-13. A surfaced command is bound to its own document through one Gate 2 bullet, carried to Cursor and Devin by a generated block and shown to a dispatched child as parent-named only. All nine acceptance criteria are Met."
trigger_phrases:
  - "gate 2 binding and runtime pointers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers"
    last_updated_at: "2026-11-12T20:30:00Z"
    last_updated_by: "planner"
    recent_action: "Planned phase 6 at Level 2"
    next_safe_action: "Run T001 and T002, then wave 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-gate-2-binding-and-runtime-pointers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-gate-2-binding-and-runtime-pointers |
| **Completed** | 2026-11-13. AC-001 to AC-009 are `Met` |
| **Level** | 2 |
| **Verified on** | The uncommitted working tree over `HEAD` `a57ce61a13` (committed 2026-11-13 01:58). The scratch outputs are dated 02:17 to 02:24 the same night |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A command the advisor names now comes with one rule on every runtime. `AGENTS.md` Gate 2 holds a new bullet, `- **Command in the brief.**`, which says to take the command or the skill path whole, to read the command document in full and follow it, what `run`, `start` and `ask` mean, that a typed command or explicit instruction outranks the policy and that the reply carries a `COMMAND:` token. The bullet is the 463-byte text the operator approved in `scratch/bullet-draft.txt`. It moves the delivery prefix to 16092 of 16384 bytes to the last anchor.

The manifest pins the bullet's marker as a 31st pin and its `derived` key was regenerated. The pointer generator writes a second block into `.cursor/rules/skill-routing.md` with the Gate 2 direct call and the bullet, so Cursor and Devin carry the rule with no brief.

In a dispatched child (`AI_SESSION_CHILD=1`) the brief renders a surfaced `start` or `ask` command, or a `run` command whose class is not `read-only`, as `(parent-named only)`. The class comes from a new `mutating` field on each `COMMAND_ROWS` row in `command-attach.ts`, which the deriver now emits from the same `commandPolicies` record as the policy.

Each of the three hub `ROUTER.md` files gained one handoff bullet in section 4. The Gate 3 mutation notice and the standard `create.sh` next steps now name `/speckit:plan` and `/speckit:complete`. The hook reference gained a DSH row, a `dsh/` tree entry, a `### Starting a surfaced command` invocation table for seven runtimes and a render note for the child downgrade. A new parity test keeps the hook index, that table and the runtime enum in step. The `copilot` label is gone from `ADVISOR_RUNTIME_VALUES`, which now holds seven labels, and a new test pins how a stored record or tool input still carrying it is skipped or rejected.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `SSK` is `.skilled/skills/system-spec-kit/runtime`.

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | The Gate 2 command bullet |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modified | Pin `gate2-command` and the regenerated `derived` key |
| `SSK/cli/runtime-mirrors/sync-gate1-pointers.cjs` | Modified | Second block from the Gate 2 direct call and the bullet |
| `SSK/cli/tests/gate1-pointer-sync.vitest.ts` | Modified | Cases for the second block |
| `.cursor/rules/skill-routing.md` | Modified (generated) | Written by the generator |
| `SSK/cli/runtime-mirrors/README.md` | Modified | The generator's row names both blocks |
| `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-design/ROUTER.md`, `.skilled/skills/system-deep-loop/ROUTER.md` | Modified | One handoff bullet in section 4 each |
| `SSK/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | One line in `GATE_3_MUTATION_NOTICE` |
| `SSK/tests/hooks/spec-gate-core.test.mjs` | Modified | The pinned notice bytes |
| `SSK/cli/spec/create.sh` | Modified | Next step 6 names both commands and the goal step moves to 7 |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | DSH row, tree entry, invocation table and the child note |
| `ADV/lib/advisor-runtime-values.ts` | Modified | `copilot` removed |
| `ADV/tests/legacy/advisor-observability.vitest.ts` | Modified | Expects the seven labels |
| `ADV/bench/hook-brief-signal-noise.bench.ts` | Modified | `copilot` fixture row and header mention removed |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs`, `ADV/lib/command-attach.ts` | Modified | `mutating` on each `COMMAND_ROWS` row and on the `CommandRow` interface |
| `ADV/lib/render.ts` | Modified | Child-session downgrade |
| `ADV/tests/render-child-session.vitest.ts` | Created | Seven downgrade cases |
| `ADV/tests/hooks/advisor-runtime-list-parity.vitest.ts` | Created | Index, table and enum agree, and an extra index name is reported |
| `ADV/tests/legacy/runtime-label-removal.vitest.ts` | Created | Five cases for a stored or sent `copilot` label |
| Four compiled-routing activation manifests for `sk-design` and `system-deep-loop` | Modified (refreshed) | Deviation 1 below |
| `scratch/` | Created | Probes, worker briefs and logs, before and after output and `verification-evidence.txt` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran wave 0 (T001 and T002) itself, then dispatched DeepSeek v4.1 flash workers at max effort through OpenCode Go in three building waves. The worker logs in `scratch/logs/` name the model `deepseek-v4.1-flash-1017`. `scratch/briefs/` holds 12 wave 1 briefs (T003 to T014), 8 wave 2 briefs (T015 to T022) and 2 wave 3 briefs (T023 and T026). T024 and T025 are generator runs with no worker brief. The orchestrator then ran T027 to T034 one at a time and recorded each result in `scratch/verification-evidence.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Level 2, not the Level 1 the helper printed | The packet asks for `acceptance-criteria.md`, and `speckit-plan.yaml` says to go higher when the helper and judgment differ |
| Extend `sync-gate1-pointers.cjs` instead of writing a new generator | The agents-md check already runs its `--check` for the Cursor rule, so the second block is checked with no new wiring |
| Carry the `mutating` class on each `COMMAND_ROWS` row | The policy word alone cannot tell a read-only `run` from an add-only one, and the row had no class (T014) |
| Remove `copilot` and pin the old-record path with a test | The operator chose removal on 2026-11-12. Both metrics readers filter on the enum, so a stored record is skipped rather than thrown on |
| Refresh the two hub activation manifests instead of reverting the router bullets | The bullets are in scope and the refresh restored the served routes and the recall numbers |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every row quotes `scratch/verification-evidence.txt`, `scratch/after-check.txt` or `scratch/suite-after.txt`, unless it says it was rerun during closure on 2026-11-13.

| Check | Result |
|-------|--------|
| Manifest `--write`, then `--check` (T024) | Exit 0. `PASS: 44 sections, 31 pins, derived matches AGENTS.md`. `Budget: 16092 / 16384 bytes to the last anchor, 27575 / 32768 bytes total, 21 history bodies` |
| Cursor rule sync and `--check` (T025) | Both exit 0, `PASS: 1 instruction files carry the root Gate 1 and Gate 2 pointers`. `Command in the brief` and `skill-advisor.cjs advisor_recommend` each count 1 |
| agents-md check (T027) | `STATUS=OK rows=12 findings=0 unknown=0`, A4 `44 current`, A5 `31/31 pins hold`, A6 `16092 of 16384`, A10 `6/6 copies as expected` |
| Rule-copy canary (T028) | `OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).` |
| Pointer test (T029) | 7 passed and `--check` exit 0 |
| Spec gate test (T030) | `pass 107`, `fail 0` |
| Advisor typecheck and the four named tests (T031) | Typecheck exit 0. 4 files, 26 passed, 0 failed |
| `rg copilot` over the advisor `.ts` files (T031) | Only `runtime-label-removal.vitest.ts`, `settings-driven-invocation-parity.vitest.ts` and `hooks-parity-stress.vitest.ts` |
| Advisor `npm test` (T031) | 173 files passed. 1528 passed, 6 skipped, 0 failed |
| Child render test (T023) | 7 passed, 0 failed |
| Hub checks (T032) | `sk-doc exit=0`, `sk-design exit=0`, `system-deep-loop exit=0` |
| Build and hook probe on `disable comment hygiene gate` (T033) | Build exit 0. With the child variable: `sk-git → /doctor:git hooks (parent-named only)`. Without it: `sk-git → /doctor:git hooks (ask)` |
| Comment hygiene scan (T034) | Printed nothing |
| Floors after the change | Scorer `[159,50,20,5]`. Policy rollup `{"ask":17,"run":7,"start":20}`, the same counts as `scratch/before.txt` |
| Bullet line and draft (rerun) | `rg -c` printed 1 and the `diff` printed nothing, exit 0 |
| Router bullets, notice and `create.sh` lines (rerun) | `has two whole entries` counts 1 in each hub. `speckit:plan` counts 1 in `spec-gate-core.mjs` and `6. Plan the work with /speckit:plan` counts 1 in `create.sh` |
| Parity test and label tests (rerun) | Parity 2 passed. `runtime-label-removal.vitest.ts` 5 passed. With the observability test, 2 files and 17 passed |
| `node --check` on the generator and the spec gate core (rerun) | Both exit 0 |

### Before and After

| Number | Before (`scratch/before.txt`) | After |
|--------|-------------------------------|-------|
| Delivery prefix to the last anchor | 15629 of 16384 | 16092 of 16384 |
| Total delivery bytes | 27112 of 32768 | 27575 of 32768 |
| Manifest pins | 30 | 31 |
| History bodies | 20 | 21 |
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| The diff names only the files in `spec.md` section 3 | Four compiled-routing activation manifests also changed: `sk-design` and `system-deep-loop`, in the served copy under `.skilled/bin/lib/compiled-routing/013-live-activation/activation/` and the authored copy under the archived router-unification packet | The router bullet made both hubs serve `legacy` with cause `stale-manifest`, which dropped plain tune recall from 9 of 45 to 6 of 45. `compiled-route-manifest.cjs refresh` fixed it. After it the guard exited 0 and the sync check printed `all 7 hubs resolve` and `all 55 served copies match their authored files`. The capture printed typed 24 of 44, tune combined 9 of 45, holdout combined 0 of 44 and false offers 0 of 35. `sk-doc` stayed fresh |
| No other test files change | `command-brief-golden.vitest.ts` and `command-offer.vitest.ts` show in the working-tree diff | They belong to phase 005 (re-pin task) and phase 010, not this phase |
| T005 as first written | The DSH row says it is on unless the `promptAdvisor` row flag is `false` | Amended in `tasks.md` before the build |
| T014 only if the condition holds | It held. `COMMAND_ROWS` had no class, so the deriver and the `CommandRow` interface gained `mutating` | The child downgrade needs the class |
| T013 adds one line | The new line is step 6, so the two goal lines moved from 6 to 7 | Keeps the numbered list in order |
| Decision Q021 names DeepSeek workers through Pi | The workers ran through OpenCode Go | Delivery route set by the orchestrator for this phase |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The scope grew by four generated files.** Editing a hub `ROUTER.md` makes that hub's compiled route stale, so the four activation manifests were refreshed and added to `spec.md` section 3 on 2026-11-13. A later hub router edit needs the same refresh, which the pre-commit gate also performs.
2. **292 bytes stay free in the delivery prefix.** The next Gate 2 addition may not fit under A6.
3. **The child marker reads one variable.** A runtime that dispatches children without `AI_SESSION_CHILD=1` gets the normal policy word.
4. **One reader describes only block one.** `.skilled/CROSS-CLI.md` line 73 calls the generator's output the lookup pointer. It is not wrong for block one and sits outside this phase's scope.
5. **The bullet reaches running Claude sessions only after merge.** `~/.claude/CLAUDE.md` points at the main checkout's `AGENTS.md`.
<!-- /ANCHOR:limitations -->

---
