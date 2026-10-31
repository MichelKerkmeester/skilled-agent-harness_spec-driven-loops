---
title: "Implementation Plan: Phase 13: speckit-retrieval"
description: "Audits /doctor:speckit speckit-retrieval against this checkout, applies the smallest fix for every claim that no longer matches, and records subsystem defects as findings rather than fixes."
trigger_phrases:
  - "speckit retrieval plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: speckit-retrieval

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, shell and YAML; the target is one workflow asset |
| **Framework** | The `/doctor` router: route manifest, router doc and shared presentation contract |
| **Storage** | None written by the phase; the audited target reads the committed trigger index |
| **Testing** | Read-only command runs, each recorded with its exit status in `scratch/doctor-run.log` |

### Overview
The phase read the route, the workflow asset, the presentation and the router in full, then ran every step they name in read-only form and saved the raw output in `scratch/doctor-run.log`. The evidence produced a `fix` verdict: the doctor's central lane works on this checkout, but six claims no longer match the system, one of them recommending a regeneration mode that does not exist. The fixes were applied as the smallest edit that removes each mismatch, and `route-validate.sh` re-proved parity across the route manifest, the router table and the presentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md` §2 and §3
- [x] Success criteria measurable: the route validator's exit status and the acceptance rows
- [x] Dependencies identified: a provisioned worktree with Node and ripgrep

### Definition of Done
- [x] All acceptance criteria met: AC-001 through AC-004 are Met
- [x] Tests passing: `route-validate.sh` exits 0 and the phase validator reports `RESULT: PASSED`
- [x] Docs updated: spec, plan, tasks, acceptance criteria, summary and goal log
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-then-apply: evidence first, then the smallest edit that removes each mismatch

### Key Components
- **Route entry**: the `speckit-retrieval` block in `_routes.yaml` declares the setup variables, flag schema and mutation class the router binds
- **Workflow asset**: `doctor-speckit-retrieval.yaml` holds the staleness signals, the read-only steps and the recommendation rules
- **Presentation contract**: `doctor-speckit-presentation.txt` owns every visible string, including the setup prompts the router asks

### Data Flow
The router resolves the target from `_routes.yaml` and runs the workflow asset phase by phase, reading the committed trigger index and the retrieval conventions. The audit inverted that order: it read the route, asset and presentation first, then ran each named step read-only, aggregated the signals into a verdict, and applied the fixes before re-running the parity gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `_routes.yaml` | Declares the route's setup variables, allowed flags and mutation class | Update: dropped `incremental`, fixed the asset-glob note | `route-validate.sh` B1 and J1 pass; no `--incremental` hit remains |
| `doctor-speckit-retrieval.yaml` | Holds the signals, the read-only steps and the recommendation rules | Update: removed the dead input and the incremental recommendation; corrected the Claude note, the class list, the glob count and the forbidden glob | Re-read of the diff; `route-validate.sh` D1 pass; `rg` probes clean |
| `doctor-speckit-presentation.txt` | Shared contract for every visible `/doctor:speckit` string | Update: removed the regeneration-mode prompt and the orphaned `--scope` prompt | `route-validate.sh` J1 parity pass |
| `speckit.md` | Router doc that names the resolved asset | Update: `doctor_<target>.yaml` to `doctor-<target>.yaml` | `route-validate.sh` J1 pass |
| Scripts and fixtures the target names | Supply the index, the lookups and the recipes the doctor reads | Unchanged: all present on this checkout | `scratch/reality-check.md` §1 to §3, each row with the command that showed it |

Required inventories:
- Same-class producers: `rg -n -- "--incremental" .skilled` returned the route and the validator's own copy, with no consuming script; `rg -n "doctor_\*"` returned only `doctor-update.yaml`, which the release-aware update redesign owns.
- Consumers of changed symbols: after the batch, `rg -n "incremental|doctor_\*|CLAUDE\.md"` over the four edited files returned no hits.
- Matrix axes: each named item is scored present, moved, missing or stale claim; each command's exit class is 0, 1 or 2+; each signal carries severity high, medium or low.
- Algorithm invariant: the forbidden-glob guard must match the real asset names (`doctor-*.yaml`, 14 files), and the manifest, router table and presentation must stay in J1 parity after every edit.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Audit, Apply and Verify phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Command probes | Every script, fixture and recipe the workflow names | `bash`, `node`, `rg` |
| Parity checks | Route manifest, router table and presentation displays | `route-validate.sh` |
| Manual | The workflow's phases run end to end in read-only order | `scratch/doctor-run.log` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Provisioned worktree with the named scripts runnable | Internal | Green | The audit cannot run; a missing script becomes a finding |
| Node v26.8.2 and ripgrep 15.2.0 | Host | Green | The lookup and recipe probes cannot be re-proved |
| `_routes.yaml` and `route-validate.sh` | Internal | Green | Route edits cannot be checked for parity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An applied edit breaks route parity or the doctor's own output
- **Procedure**: `git checkout --` the four edited doctor files, then rerun `route-validate.sh`. The audit artifacts in `scratch/` are untracked and unaffected.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit) ──────┐
                      ├──► Phase 2 (Apply) ──► Phase 3 (Verify)
Phase 1.5 (Evidence) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit | None | Apply, Evidence |
| Evidence log | Audit | Apply |
| Apply | Audit, Evidence log | Verify |
| Verify | Apply | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit | Med | 1-2 hours |
| Apply | Low | Under an hour as part of the shared batch |
| Verification | Low | Under an hour |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup: every edited file is tracked by git; the audit artifacts are untracked scratch
- [x] Feature flag: not applicable; the fix ships as text in doctor assets
- [x] Monitoring: `route-validate.sh` is the check that catches a broken route

### Rollback Procedure
1. Restore the four edited doctor files from git
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh`
3. Confirm a clean exit with J1 parity across the manifest, router table and presentation

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

