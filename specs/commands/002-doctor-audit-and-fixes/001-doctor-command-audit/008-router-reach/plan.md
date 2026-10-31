---
title: "Implementation Plan: Phase 8: router-reach"
description: "Audit the `/doctor:speckit router-reach` route, workflow and script against this checkout, decide keep, fix or retire, and apply the fix verdict to the probe, the route, the workflow, the presentation and the route validator."
trigger_phrases:
  - "router reach plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: router-reach

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) script, Python 3 validator, Bash gate scripts |
| **Framework** | None — CLI scripts, YAML workflow assets and a text presentation contract |
| **Storage** | None; the diagnostic writes its report to stdout |
| **Testing** | Live probe run, `route-validate.sh`, YAML parse, command-catalog mirror check, MCP mutation-class guard |

### Overview

Audit first, apply second. The phase inventoried every path, script, flag and variable that the `router-reach` route and workflow name, ran the workflow read-only on this checkout, and used the result to decide `fix`. The applied fix makes the probe fail closed on a degraded advisor response, wires the already-allowed `--concurrency` flag through the workflow to the script, shows the target in the numeric startup menu, and makes the route validator measure parity against that visible menu.
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

- **Diagnostic script** (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`): probes each declared phrase against the skill advisor and classifies each result as wrong-hub, outranked, no-reach, allowed or probe-error.
- **Route row** (`.skilled/commands/doctor/_routes.yaml`): declares the target, its setup variables, its allowed flags, its mutation class and the script invocation.
- **Workflow asset** (`.skilled/commands/doctor/assets/doctor-router-reach.yaml`): owns the read-only procedure, the flag mapping and the `RESULT: PASSED|FAILED` contract.
- **Presentation contract** (`.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`): owns the visible startup menu, the help block and the accepted-answer table.
- **Route validator** (`.skilled/commands/doctor/scripts/route-validate.py`): checks manifest, router and presentation parity, including which accepted answers are actually displayed.

### Data Flow

The `/doctor:speckit` router resolves `router-reach` to `doctor-router-reach.yaml`. The workflow runs the diagnostic script through Bash, adding `--hub <id>` and `--concurrency <n>` when supplied; otherwise the script uses its own defaults. The script asks the advisor for each declared phrase, counts the rows, writes the report to stdout and exits 1 when a probe row fails. The operator reads the `RESULT` line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The verdict for this phase is fix, so this section records the surfaces the fix touches.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` (producer) | Parses the advisor envelope and classifies each phrase | Updated: reject degraded, not-live or generation-less responses before scoring; document `--concurrency` | Live probe run `--hub sk-doc --limit 5` ends `RESULT: PASSED`, advisor generation 3 |
| `.skilled/commands/doctor/_routes.yaml` (consumer) | Declares `setup_vars` and the allowed flags | Updated: `concurrency` added to `setup_vars` | `route-validate.sh` exit 0; `PASS: A1`, `PASS: B2` |
| `.skilled/commands/doctor/assets/doctor-router-reach.yaml` (consumer) | Maps resolved flags onto the script argv | Updated: declares, validates and maps `--concurrency <n>` | `PASS: I1` script resolution; YAML parse `YAML_OK` |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` (consumer) | Displays the startup menu and help block | Updated: shows `12) Check runtime mirrors` and `13) Check router reach` | `PASS: J1` parity against the visible menu |
| `.skilled/commands/doctor/scripts/route-validate.py` (validator) | Measures presentation parity | Updated: menu set built from the visible startup numbers | `PASS: J1`; the pre-fix menu gap now fails parity |

Required inventories:
- Same-class producers: `rg -n 'degraded|trustState|generation|concurrency' .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` returns one response parser (lines 148-154) and the concurrency parse (lines 180-181); no other consumer of the advisor envelope.
- Consumers of the router-reach name: `rg -ln 'router-reach' .skilled/commands/doctor` returns the route row, the workflow asset, the presentation text and the router document.
- Matrix axes: advisor response state (live / degraded / not-live / missing generation) × supplied flags (none / `--hub` / `--concurrency` / `--limit`). The live row was executed; the other response states are rejected by the new gate.
- Algorithm invariant: a phrase may count as reached only from a live, generation-bearing advisor response; any other envelope is a probe error, never a silent no-reach. Adversarial cases: a degraded envelope, an absent trust state, and a non-integer generation.
<!-- /ANCHOR:affected-surfaces -->

---
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Response classification at the probe boundary (live vs degraded vs not-live vs missing generation) | `ci-router-vocabulary-reach.cjs`, live `skill-advisor.cjs` |
| Integration | Route schema, asset existence, script resolution and presentation parity | `route-validate.sh`, `python3 yaml.safe_load`, `command-catalog-mirror-check.cjs`, `check-mcp-mutation-class.sh` |
| Manual | One live probe run on a single hub, and a look at the visible startup menu | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub sk-doc --limit 5` |
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live skill advisor (`.skilled/bin/skill-advisor.cjs`) | Internal | Green | The probe cannot judge reach; it now fails closed instead of scoring an empty envelope |
| Route manifest and validator (`.skilled/commands/doctor/_routes.yaml`, `route-validate.py`) | Internal | Green | Route and menu parity cannot be checked |
| Provisioned worktree | Internal | Green | Relative script paths in the route do not resolve |
<!-- /ANCHOR:dependencies -->

---
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `route-validate.sh` fails, the probe reports a false failure from the new response gate, or the visible menu no longer matches the accepted-answer table.
- **Procedure**: revert the five changed files (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/assets/doctor-router-reach.yaml`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`, `.skilled/commands/doctor/scripts/route-validate.py`) and rerun `bash .skilled/commands/doctor/scripts/route-validate.sh`.
<!-- /ANCHOR:rollback -->

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
- [x] Monitoring alerts set — not applicable; the probe prints its own `RESULT` line

### Rollback Procedure
1. Revert the five changed files listed in the rollback plan.
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and the `--hub sk-doc --limit 5` probe.
3. Confirm the validator and the probe report the pre-fix behavior again.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

