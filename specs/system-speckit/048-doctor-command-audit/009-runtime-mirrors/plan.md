---
title: "Implementation Plan: Phase 9: runtime-mirrors"
description: "Audit the `/doctor:speckit runtime-mirrors` route, workflow and route entry against this checkout, decide keep, fix or retire, and apply the fix verdict to the route invocations, the workflow checker inventory and result contract, and the presentation menu."
trigger_phrases:
  - "runtime mirrors plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: runtime-mirrors

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) checkers, Python 3 route validator, Bash gate scripts |
| **Framework** | None — CLI checkers, YAML workflow assets and a text presentation contract |
| **Storage** | None; the checkers report to stdout and write nothing |
| **Testing** | Read-only checker runs, `route-validate.sh`, YAML parse, command-catalog mirror check, MCP mutation-class guard |

### Overview
Audit first, apply second. The phase inventoried every path, script, command, flag and variable that the runtime-mirrors route and workflow name, ran the checkers read-only on this checkout, and used the result to decide fix. The applied fix makes the route invoke both Pi checkers, runs the Codex hooks check with the worktree allowance the installer needs, runs the command-catalog checker from the workflow, defines an error result for a refused or incomplete check, and shows the target in the startup menu.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable); the three pre-existing `parent-skill-check-*.test.cjs` fixture failures match the pre-batch baseline
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only diagnostic pipeline with an audit-then-apply loop: inventory, read-only run, verdict, applied fix, verification.

### Key Components
- **Route row** (`.skilled/commands/doctor/_routes.yaml`): declares the target, its setup variables, its allowed flags, its mutation class and the eight script invocations the workflow runs.
- **Workflow asset** (`.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`): owns the upstream checker inventory, the execution steps, the 64 hook adapter path checks and the `STATUS=OK`/`DRIFT`/`ERROR` contract.
- **Mirror checkers** (`.skilled/skills/system-spec-kit/runtime/cli/`, `.skilled/commands/doctor/scripts/`): the runtime, Codex and Pi sync checkers plus the agent-roster and command-catalog checker scripts.
- **Presentation contract** (`.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`): owns the visible startup menu, the help block and the accepted-answer table.
- **Route validator** (`.skilled/commands/doctor/scripts/route-validate.py`): checks manifest, router and presentation parity.

### Data Flow
The `/doctor:speckit` router resolves `runtime-mirrors` to `doctor-runtime-mirrors.yaml`. The workflow runs each upstream checker with `--check` where the checker supports it, runs the roster and command-catalog checkers read-only, runs the Codex hooks installer with `--check --allow-worktree`, and tests each of the 64 hook adapter paths with a plain path-existence read. It aggregates the per-surface results into a `STATUS=OK`, `STATUS=DRIFT` or `STATUS=ERROR` report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The verdict for this phase is fix, so this section records the surfaces the fix touches.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/_routes.yaml` (consumer) | Lists the script invocations the route runs | Updated: added both Pi checkers after the Codex prompt check; the Codex hooks check now carries `--allow-worktree` | `route-validate.sh` exit 0 — `PASS: I1` script resolution, `OK: 9 routes validated, 2 warnings` |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` (producer) | Declares the upstream checker inventory, the steps and the result contract | Updated: added the command-catalog asset and step; aligned the action text with the declared checkers; defined `STATUS=ERROR` | YAML parse `YAML_OK`; `route-validate.sh` exit 0 |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` (display) | Shows the startup menu and the help block | Updated: menu shows `12) Check runtime mirrors` and `13) Check router reach`; the help prompt now reads `Press 1-2, 6-13, H, 0, or X.` | `PASS: J1` parity across all three presentation displays; menu read on this checkout |
| `.skilled/bin/install-codex-hooks.mjs` (upstream tool) | Compares the user-global hooks file when anchored to a real checkout | Unchanged; the route now passes its existing `--allow-worktree` option | The `--check` branch returns before any write; the audit run without the flag refused on the linked worktree |

Required inventories:
- Same-class producers: `rg -n 'STATUS=' .skilled/commands/doctor/assets` lists the result contract in the runtime-mirrors asset; the checkers themselves print their own affirmative output and exit codes rather than sharing one status vocabulary.
- Consumers of the changed invocations: `rg -ln 'sync-agents-pi|sync-prompts-pi|command-catalog-mirror-check|install-codex-hooks' .skilled/commands/doctor` returns the route row, the workflow asset, the router document and the presentation text.
- Matrix axes: checker set (runtime, Codex agents, Codex prompts, Pi agents, Pi prompts, roster, catalog, hooks) × invocation form (no flag / `--check` / `--check --allow-worktree`) × result state (in sync / drift / refusal or missing affirmative output). The in-sync and refusal rows were executed; the write-producing repairs were listed and skipped.
- Algorithm invariant: a check may count as in sync only when it prints an affirmative result; a refusal, an error or a missing affirmative output is an error, never a silent pass. Adversarial cases: the linked-worktree refusal and an installer that can return exit 0 without an affirmative result.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Audit, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each upstream checker and the route validator, exercised through its own `--check` or read-only form | Node checkers, `route-validate.sh` |
| Integration | Route schema, asset existence, script resolution and presentation parity | `route-validate.sh`, `python3 yaml.safe_load`, `command-catalog-mirror-check.cjs`, `check-mcp-mutation-class.sh` |
| Manual | One read-only run of the full checker set, and a look at the visible startup menu | `scratch/doctor-run.log` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Route manifest and validator (`.skilled/commands/doctor/_routes.yaml`, `route-validate.sh`) | Internal | Green | Route and menu parity cannot be checked |
| Mirror checkers (`.skilled/skills/system-spec-kit/runtime/cli/`, `.skilled/commands/doctor/scripts/`) | Internal | Green | A missing checker is reported as an error rather than a pass |
| Codex hooks installer (`.skilled/bin/install-codex-hooks.mjs`) | Internal | Green | The user-global hooks parity check refuses on a linked worktree unless the route passes `--allow-worktree` |
| Provisioned worktree | Internal | Green | Relative script paths in the route do not resolve |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `route-validate.sh` fails, a checker no longer resolves from the route, or the visible menu no longer matches the accepted-answer table.
- **Procedure**: revert the three target files (`.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`) and rerun `bash .skilled/commands/doctor/scripts/route-validate.sh`. These files moved in a batch with other doctor targets, so revert only the hunks that belong to runtime-mirrors.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Audit (inventory + read-only run) ──► Apply (fix) ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | Apply |
| Apply | Audit | Verify |
| Verify | Apply | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Low | 1 hour |
| Apply | Med | 2-4 hours |
| Verify | Low | 1 hour |
| **Total** | | **Same day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — no data changes; every file is tracked in git
- [x] Feature flag configured — not applicable; the route is always available
- [x] Monitoring alerts set — not applicable; the run prints its own status lines

### Rollback Procedure
1. Revert the three target files listed in the rollback plan.
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`.
3. Confirm the validator reports parity again and the menu still shows the target.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

