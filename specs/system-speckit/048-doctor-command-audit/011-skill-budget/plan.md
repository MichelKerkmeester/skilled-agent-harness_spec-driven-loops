---
title: "Implementation Plan: Phase 11: skill-budget"
description: "Audit /doctor:speckit skill-budget against this checkout, decide keep, fix or retire from observed evidence, and apply the verdict: record the audit-script invocation in the route entry and name python3 as the interpreter in the workflow."
trigger_phrases:
  - "skill budget plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: skill-budget

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, YAML route manifest and workflow, Python 3 audit script |
| **Framework** | The doctor route manifest and workflow-asset pattern |
| **Storage** | None. The audit reads frontmatter and prints a report; nothing is written. |
| **Testing** | The recorded read-only run, route-validate.sh, a YAML parse, the catalog mirror check and the MCP mutation guard |

### Overview
The phase audits first and applies second. Every path, script, flag and environment variable the route and workflow name is checked against this checkout, then /doctor:speckit skill-budget runs once in its read-only form. The evidence yields one verdict, fix, and the two mismatches it found are corrected in the route entry and the workflow text.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-then-apply over a data-driven doctor target: inventory every named surface, run the target once read-only, decide one verdict from the evidence, then apply the smallest edits that make the manifest and workflow match the checkout.

### Key Components
- **Route entry** (`.skilled/commands/doctor/_routes.yaml`): the manifest's record of the target, its flags, its mutation class and the scripts it runs.
- **Workflow asset** (`.skilled/commands/doctor/assets/doctor-skill-budget.yaml`): the ordered activities, command mapping and output contract the router loads.
- **Audit script** (`.skilled/commands/doctor/scripts/audit_descriptions.py`): the read-only Python report over skill, command and agent description lengths.
- **Router and presentation** (`.skilled/commands/doctor/speckit.md`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`): the menu, the valid-targets table and the text shown to the operator.
- **Manifest validator** (`.skilled/commands/doctor/scripts/route-validate.sh`): the gate that checks the route entries, their scripts and their parity with the router and presentation.

### Data Flow
The router resolves skill-budget and loads the workflow asset. The workflow probes the advisor CLI warm-only, builds the audit command from the mapped flags, runs the Python script and captures its report and exit code. The operator reads the report; the route manifest and workflow text carry the fix this phase applied.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surfaces this phase touches, and the check that covered each.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Route entry (`.skilled/commands/doctor/_routes.yaml`) | Records the target's scripts and flags | Updated: the audit-script invocation is recorded | `route-validate.sh` exit 0; `PASS: I1` now covers `audit_descriptions.py` |
| Workflow asset (`.skilled/commands/doctor/assets/doctor-skill-budget.yaml`) | Tells the executor how to run the audit | Updated: the audit activity names `python3` | YAML parses; `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root .` exits 0 while direct execution exits 126 |
| Router, presentation and scripts README | Describe and index the target | Unchanged | `PASS: J1` parity; `scripts/README.md:105` already documents the `python3` form |

Required inventories:
- Same-class producers: `rg -n "audit_descriptions" .skilled/commands/doctor` shows the workflow and the route entry name the script; no other doctor workflow runs it, so the interpreter fix has one producer.
- Consumers of changed symbols: `rg -n "audit_descriptions|audit_script" .skilled/commands/doctor` shows the route entry, the workflow, `scripts/README.md` and route-validate's I1 check as consumers; all were re-checked.
- Matrix axes: invocation form (direct path, `python3 <script>`), output mode (human report, `--json`) and fail-over (off, on). The recorded run covers the rows in `scratch/doctor-run.log` STEPs 1-6.
- Algorithm invariant: no write path exists — the script has no write calls and the workflow issues no mutation. Adversarial cases: direct execution exits 126, the `python3` form exits 0, and `--fail-over=5600` exits 1 with the documented FAIL line.
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
| Unit | The audit script's flags and constants against their source of truth | `python3 … --help` and the `quick_validate` import probe (log STEP 7) |
| Integration | Route entry, workflow, router and presentation parity | `bash .skilled/commands/doctor/scripts/route-validate.sh`, a YAML parse over every doctor asset |
| Manual | One read-only `/doctor:speckit skill-budget` run | Orchestrator Bash probes recorded in `scratch/doctor-run.log` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `python3` (interpreter for the audit script) | External | Green | The script is mode 644, so the workflow must name the interpreter or the run exits 126 |
| `.skilled/commands/doctor/_routes.yaml` and `route-validate.sh` | Internal | Green | The route change is checked by the manifest validator |
| skill-advisor CLI warm-only probe | Internal | Green | A retryable exit 75 does not block the budget audit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `route-validate.sh` fails after the edits, or the audit script stops resolving from the route entry.
- **Procedure**: Revert the two text edits (`git checkout -- .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/assets/doctor-skill-budget.yaml`) and rerun `route-validate.sh`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Implementation) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, Verify |
| Implementation | Setup | Verify |
| Verify | Setup, Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour: read the route, workflow and router surfaces |
| Core Implementation | Med | One session: inventory, recorded run, verdict and the two text fixes |
| Verification | Low | Under an hour: route, YAML, mirror and guard checks |
| **Total** | | **About two sessions across one day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; nothing to back up
- [x] No feature flag; the target is read-only
- [x] `route-validate.sh` is the observable gate and runs before closure

### Rollback Procedure
1. Stop: no runtime action to disable; the target is read-only.
2. Revert the two text edits with `git checkout -- .skilled/commands/doctor/_routes.yaml .skilled/commands/doctor/assets/doctor-skill-budget.yaml`.
3. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and expect the pre-change `OK` line.
4. No user-facing surface changed; no notification required.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no data is written.
<!-- /ANCHOR:enhanced-rollback -->

---

