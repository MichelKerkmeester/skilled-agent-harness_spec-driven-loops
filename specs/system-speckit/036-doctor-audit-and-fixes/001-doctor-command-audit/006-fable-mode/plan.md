---
title: "Implementation Plan: Phase 6: fable-mode"
description: "Audits the /doctor:speckit fable-mode target and applies a fix verdict: the check requires a caller-supplied artifact directory instead of a missing default, the route forwards the baseline override, and the presentation describes metric drift."
trigger_phrases:
  - "fable mode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: fable-mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS diagnostic script), YAML workflow assets, Markdown router and presentation |
| **Framework** | Doctor command layout: router + workflow YAML + presentation contract |
| **Storage** | Deep-loop artifact directories (read-only) and the committed `fable-baseline.json` snapshot |
| **Testing** | No-argument check run, `node --check`, YAML parse, `route-validate.sh`, catalog mirror and mutation-class checks |

### Overview
Audit first, then apply. The phase inventoried every path, command, flag and variable the fable-mode route and workflow named, ran the read-only check once, and set the verdict to fix. The fix removed the script's default target — a research corpus that is absent from this checkout — made the artifact directory required, forwarded the baseline override the route already accepted, and aligned the presentation with metric drift and a directory setup prompt.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2-3; inventory in `scratch/reality-check.md`)
- [x] Success criteria measurable (`acceptance-criteria.md`, AC-001 to AC-004)
- [x] Dependencies identified (provisioned worktree; `_routes.yaml` and its validator)

### Definition of Done
- [x] All acceptance criteria met (`acceptance-criteria.md`, 4 of 4 Met)
- [x] Tests passing (if applicable) (`node --check`, no-argument run, YAML parse, route validation)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-then-apply: a thin Markdown router binds a workflow YAML that drives one read-only Node diagnostic.

### Key Components
- **`speckit.md`**: router that resolves the fable-mode target and its setup values.
- **`doctor-fable-mode.yaml`**: the read-only workflow — inputs, execution step and status rendering.
- **`fable-mode-check.cjs`**: the diagnostic; requires a target directory, renders five metrics against the baseline and exits 2 on a missing target.
- **`fable-metrics.cjs`**: the metric library that discovers lineages and aggregates the five behavioral measures.
- **`doctor-speckit-presentation.txt`**: user-visible target wording and the fable-mode setup prompt.

### Data Flow
`/doctor:speckit fable-mode` resolves `target_dir` — asking through the setup prompt when it was not passed — and an optional baseline override. The route invokes `node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir "{target_dir}" --baseline "{baseline}"` once. The script resolves the directory, discovers lineages, aggregates the five behavioral metrics and renders each current value with its delta against the baseline; the exit code is the status. It never writes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/scripts/fable-mode-check.cjs` | Produces the read-only metric report the workflow renders | update | No-argument run: exit 2, `pass --dir <path>`; pre-fix log: exit 2, target not found |
| `.skilled/commands/doctor/_routes.yaml` (fable-mode entry) | Declares flags, setup variables and the invocation | update | `route-validate.sh` exit 0, 9 routes validated; J1 router/manifest/presentation parity PASS |
| `.skilled/commands/doctor/assets/doctor-fable-mode.yaml` | Workflow contract for inputs and execution | update | `python3 yaml.safe_load`: YAML_OK; execution step names both flags |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | User-visible target row and setup prompts | update | `fable-mode` row reads "Report fable-5 behavioral metric drift against the baseline"; "Fable Mode Artifact Directory" prompt present |
| Deep-loop artifact corpus and baseline snapshot (the inspected subsystem) | The data the diagnostic reads | unchanged | The stale recorded corpus path is a recorded finding, not fixed |

Required inventories:
- Same-class producers: the two flags (`--dir`, `--baseline`) appear across seven surfaces — route allowlist, route setup variables, route invocation, workflow inputs, workflow execution step, script parser and presentation prompt. The removed default target was the script's only fixed-path fallback.
- Consumers of changed symbols: `_routes.yaml` and `doctor-fable-mode.yaml` consume the diagnostic; the presentation consumes the targets table and setup variables. `route-validate.sh` J1 checks manifest, router and all three presentation displays in parity (PASS).
- Matrix axes: how the target arrives (`--dir`, positional path, absent) and how the baseline arrives (`--baseline`, defaulted). Five rows — (`--dir`, `--baseline`), (`--dir`, default), (positional, `--baseline`), (positional, default), (absent, anything) — with the last row exiting 2 by name.
- Algorithm invariant: the run never falls back to a fixed path; it resolves the caller's directory and fails by name when none is given, and it never writes.

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
| Unit | The script's argument parsing is inline; checked statically and through the no-argument path | `node --check`; no-argument run (exit 2) |
| Integration | The read-only diagnostic against this checkout (missing default target) and the route's invocation form | `scratch/doctor-run.log`; post-fix no-argument run |
| Manual | Router, workflow and presentation parity | `route-validate.sh`, `python3 yaml.safe_load` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Provisioned worktree | Internal | Green | The diagnostic needs a checkout to resolve its scripts |
| `_routes.yaml` and its validator | Internal | Green | The route stays valid; `route-validate.sh` exits 0 with 2 warnings |
| Deep-loop artifact corpus | Internal | Red | No default corpus exists in this checkout; callers must pass `--dir`, and the check fails by name when they do not |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the diagnostic misreports metrics, or `route-validate.sh` stops exiting 0.
- **Procedure**: `git checkout --` the four changed files (the diagnostic, the fable-mode route entry, the workflow asset and the presentation file), or revert the commit that carries this phase; nothing is committed yet.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours: inventory and one read-only run |
| Core Implementation | Med | 2-3 hours: script default removal, route and workflow wiring, presentation prompt |
| Verification | Low | 1-2 hours: no-argument run, YAML parse, route validation, catalog and guard checks |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — no data changes; every edit is uncommitted in this worktree
- [x] Feature flag configured — not applicable; `/doctor:speckit fable-mode` is invoked directly
- [x] Monitoring alerts set — not applicable; failures surface in the script's own STATUS line and exit code

### Rollback Procedure
1. Stop invoking the changed target; compare against the previous assets with `git diff` in this worktree.
2. `git checkout --` the changed files, or revert the phase commit.
3. Run the no-argument check and `bash .skilled/commands/doctor/scripts/route-validate.sh` to confirm the restored state.
4. Tell the operator which check changed so the audit verdict can be revisited.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — the phase ships no data migration and the diagnostic writes nothing.
<!-- /ANCHOR:enhanced-rollback -->

---

