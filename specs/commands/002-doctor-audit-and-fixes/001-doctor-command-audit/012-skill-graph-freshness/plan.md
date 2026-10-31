---
title: "Implementation Plan: Phase 12: skill-graph-freshness"
description: "Audit `/doctor:speckit skill-graph-freshness` against this checkout and apply the evidence-backed keep verdict: the route, its workflow asset, its script, its flags and its presentation row all still match the system they cover."
trigger_phrases:
  - "skill graph freshness plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: skill-graph-freshness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) diagnostic script, YAML workflow asset, text presentation contract |
| **Framework** | The `/doctor:speckit` router over `.skilled/commands/doctor/` |
| **Storage** | Files only — the compiled `skill-graph.json`, the SQLite `skill-graph.sqlite` and the on-disk `graph-metadata.json` files are read, never written |
| **Testing** | `bash .skilled/commands/doctor/scripts/route-validate.sh`, `python3 yaml.safe_load`, the command catalog mirror check, the MCP mutation-class guard, the doctor script tests |

### Overview

Audit first, then apply. The phase inventoried every path, script, command, flag and variable the route and `doctor-skill-graph-freshness.yaml` name, ran the workflow's exact command read-only, probed detection with real foreign databases, and recomputed the panel's five sets with an independent implementation. The evidence supports `keep`, so the verdict is applied by leaving the route, the workflow asset, the script and the presentation row unchanged.
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
- [x] Tests passing (if applicable); the batch gates were rerun and the three `parent-skill-check-*.test.cjs` fixture failures match the pre-batch baseline
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Other: audit → verdict → apply over a read-only diagnostic. The doctor has no runtime of its own: one Node script reads three representations of the skill graph and prints a drift report. A `keep` verdict leaves that pipeline untouched.

### Key Components

- **`doctor-skill-graph-freshness.yaml`**: the workflow asset the route executes; its single phase runs the diagnostic script with no arguments and maps the exit code to `STATUS=OK`.
- **`skill-graph-freshness.cjs`**: the read-only panel comparing the compiled `skill-graph.json`, the SQLite `skill-graph.sqlite` and the depth-1 `graph-metadata.json` files across five sets — zombie, missing, ghost, family mismatch and null stamp.
- **`_routes.yaml` and `speckit.md`**: the route entry (read-only mutation class, no allowed flags, one script invocation, no MCP tools) and the router table; inspected, not changed here.
- **`doctor-speckit-presentation.txt`**: the shared presentation contract; the target's menu row, accepted answer, help row and manifest row were checked for parity and left unchanged.

### Data Flow

The router resolves the `skill-graph-freshness` target to its workflow. The workflow runs the one script invocation with no arguments; the script reads the compiled JSON, the SQLite database and the disk metadata files, prints source counts plus the five drift sets, and exits 0 as a report-only diagnostic. The audit read that flow from the sources, recorded it in `scratch/reality-check.md` and `scratch/doctor-run.log`, and the verdict changed nothing in it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The verdict for this phase is `keep`, so this section records why each surface stays unchanged.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` (producer) | Computes the five drift sets and prints the panel | unchanged — every named path, data shape and read-only property held | `node --check` exits 0; two identical runs exit 0; source hashes unchanged before and after (`scratch/doctor-run.log:102`, `:107`, `:627`) |
| `.skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml` (consumer) | Declares the single phase, its read-only boundary and the `STATUS=OK` mapping | unchanged — its asset, command, boundary and mapping match behaviour | the exact route command runs and exits 0; `route-validate.sh` D1/I1 PASS (`scratch/doctor-run.log:353`) |
| `.skilled/commands/doctor/_routes.yaml` (policy) | Declares the target, the read-only class, the empty flag and tool surfaces and one script invocation | unchanged — the route agrees with the script, the router and the presentation | `route-validate.sh` exit 0, K1/K2 PASS; the route block is outside the batch diff |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` (consumer) | Renders the menu, accepted answers, help rows and manifest | unchanged — the target's row 10 appears in all four displays | `route-validate.sh` J1 parity PASS, exit 0 |
| The three sources the panel reads (input) | Compiled JSON, SQLite database and disk metadata | unchanged — read-only on every run, including the foreign-database probes | before/after shasums and mtimes identical (`scratch/doctor-run.log:627`) |

Required inventories:
- Same-class producers: the script is the only producer of the panel. `scratch/reality-check.md:25` inventories every named path, script, command, flag and variable and marks each present, inert, unresolvable or absent by design, with the command that showed it.
- Consumers of changed symbols: none — no symbol changed. The consumers of the route's declaration are the router table, the presentation displays and the validator; `route-validate.sh` checks them with J1, I1 and K1/K2, exit 0.
- Matrix axes: source state (three sources agreeing / foreign databases / absent database) × run form (the route command with no arguments / `--json` / the environment override). The agreeing, foreign and absent rows were executed; `--json` produced byte-identical output because the script has no flag parser.
- Algorithm invariant: a missing or unreadable source is reported by name and never as a pass, and a read-only run leaves shasums and mtimes unchanged. The absent-database run exercised the first and the before/after hashes the second.
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
| Syntax | The diagnostic script | `node --check .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` → exit 0 |
| Asset parse | The workflow YAML and the route manifest | `python3 yaml.safe_load` → `YAML_OK` |
| Integration | The exact route command with no arguments, twice, then foreign and absent database sources | `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs`; `SYSTEM_SKILL_ADVISOR_DB_DIR` pointed at read-only databases |
| Cross-check | The panel's five sets against an independently written implementation over the same three sources | `node -e` three-way recomputation → identical result (`scratch/doctor-run.log:483`) |
| Route and presentation | Manifest, router table and all three presentation displays | `route-validate.sh` → exit 0, "9 routes validated, 2 warnings", J1 parity PASS |
| Batch gates | Every doctor asset YAML, the catalog mirror, the MCP guard, the doctor script tests | `python3 yaml.safe_load` → `YAML_OK`; catalog mirror check `STATUS=OK`; `GUARD PASS`; tests at baseline |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A provisioned worktree | Internal | Green | The doctor scripts cannot run |
| `.skilled/commands/doctor/_routes.yaml` and its validator | Internal | Green | The route and its display parity cannot be checked |
| Node.js | External | Green — v26.8.2 | The panel cannot run; `node:sqlite` is unavailable |
| Python 3 with PyYAML | External | Green | `route-validate.sh` cannot parse the manifest |
| The advisor runtime database `skill-graph.sqlite` | Internal | Green but untracked | Without it the panel degrades to a two-way diff, which is recorded as a finding |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the keep verdict proves wrong and the target needs an edit after all.
- **Procedure**: nothing to revert — this phase changed no production file. Re-read `scratch/reality-check.md` and `scratch/doctor-run.log`, apply the new verdict in the target's own workflow, then rerun `route-validate.sh` and confirm exit 0.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──► Phase 2 (Verdict) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Verdict |
| Verdict | Inventory | Verify |
| Verify | Verdict | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Low | Source reads plus the read-only runs and probes in `scratch/doctor-run.log` |
| Verdict | Low | One verdict with its evidence and findings in `scratch/proposal.md`; no file edit to apply `keep` |
| Verification | Low | Rerun the route validator and the batch gates |
| **Total** | | **One focused session, applied in a shared batch with no target edit** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A; no production file changed to apply this verdict
- [x] Feature flag configured — N/A
- [x] Monitoring alerts set — N/A

### Rollback Procedure
1. No file to restore for the target; `keep` changed nothing in the doctor.
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and confirm exit 0.
3. Rerun `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` and confirm the five sets print with exit 0.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
