---
title: "Implementation Plan: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue"
description: "Establish the doctor tooling's existing test surface, capture a baseline across it, remove the Sequential Thinking definitions surgically, then re-run every captured check and compare."
trigger_phrases:
  - "decommissioned server plan"
  - "mcp doctor removal plan"
  - "doctor baseline verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2, YAML, plain text |
| **Framework** | OpenCode doctor command family (`_routes.yaml` + interactive YAML workflows) |
| **Storage** | None; all state is on-disk configuration |
| **Testing** | `bash -n`, `route-validate.sh` (+ `--self-test`), `check-mcp-mutation-class.sh`, `scripts/tests/*.test.cjs`, live `mcp-doctor.sh --json` |

### Overview

The work is a deletion, so the risk lives entirely in what the deletion might take with it. The approach is therefore baseline-first: find how this tooling is already tested, run all of it and record the numbers, then delete by verified line number rather than by pattern substitution, then re-run the same set and compare against the recorded numbers. A live `mcp-doctor.sh --json` run before and after acts as the negative control — the before-run is what proves the defect was real rather than cosmetic.
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
- [x] Tests passing (baseline captured and compared, not merely re-run)
- [x] Docs updated (spec/plan/tasks/acceptance-criteria/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Router plus workflow assets. `_routes.yaml` maps a route to a YAML workflow asset and a script; the shell script does the probing, and the presentation text file supplies the operator-facing report shapes. A server appears in all four layers, so retiring one means removing it from all four or leaving an inconsistency the route parity check will not catch.

### Key Components

- **`mcp-doctor.sh`**: the executable probe. Owns per-server `diagnose_*` functions, the dispatch list, and the config-wiring server array.
- **`doctor-mcp-install.yaml`**: the install workflow's server definitions, install-guide pointers and prerequisite matrix.
- **`doctor-mcp-debug.yaml`**: the debug workflow's repair actions and install-guide pointers.
- **`doctor-mcp-presentation.txt`**: operator-facing report table shapes, one row per server.

### Data Flow

`/doctor:mcp <sub-action>` resolves through `_routes.yaml` to a YAML asset, which instructs the agent to run `mcp-doctor.sh --json`. The script's JSON check list feeds the report tables whose shapes come from the presentation file. A server named in the YAML but absent from the script yields an unfillable report row; a server in the script but absent from the YAML yields a check with no repair path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp-doctor.sh` (producer) | Runs the `npx` probe and records the checks | Update — function, dispatch, config array and help text removed | `bash -n` exit 0; live `--json` run shows 0 sequential checks |
| `doctor-mcp-install.yaml` (policy) | Declares the server as installable | Update — definition, 2 guide pointers, 2 rows, prerequisite retargeted | `yaml.safe_load` parses; `servers` keys = 3 live servers |
| `doctor-mcp-debug.yaml` (policy) | Declares the reinstall repair action | Update — repair block, 2 guide pointers, 1 row, invariant sentence | `yaml.safe_load` parses; `repair_actions` keys = 3 live servers |
| `doctor-mcp-presentation.txt` (display) | Report table shapes | Update — 4 rows removed | `route-validate.sh` J1 parity check passes |
| `_routes.yaml` (router) | Maps routes to assets and scripts | Unchanged — names no server | `rg -n "sequential" _routes.yaml` returns only `workflow: sequential*` shape values |
| `.opencode/scripts/*cleanup*` (consumer) | Reaps orphaned MCP processes by command-line match | Not a consumer of the doctor contract — left unchanged | Package still cached at `~/.npm/_npx/a5ef1724d9b0391f/`, so the orphan remains possible |
| `mcp-route-guard` (policy) | Suppresses a Code Mode routing nudge for internal tokens | Unchanged — removal would be a regression | `mcp-route-guard.test.cjs:102,152` assert the token is exempt/internal |
| `deep-ai-council` (consumer) | Depth-1 dispatch instructs use of the server inline | Out of scope — needs a design decision | `references/convergence/depth-dispatch.md:45,188,233` |

Required inventories:
- Same-class producers: `rg -n "server-sequential-thinking" .opencode/commands/doctor/` — 6 sites before, 0 after.
- Consumers of changed symbols: `rg -ni "sequential" .opencode/commands/doctor/` — 10 residual matches, all `workflow: sequential*` shape descriptors, semantically unrelated.
- Matrix axes: four file layers (script, install YAML, debug YAML, presentation) × two operations (definition, report row). Every cell inspected.
- Algorithm invariant: `should_run "$name"` is a pure string comparison against `FILTER_SERVER`, so a retired name can never dispatch. Adversarial case — `--server sequential_thinking` — executed after the change and confirmed inert.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state. The three phases below describe what each one is for.

### Phase 1: Verify the claims and capture a baseline

Confirm the decommission against all four runtime configs and against the commit that performed it, then establish how the doctor tooling is already tested and run every one of those checks before touching a file. This phase exists because the change is a deletion inside executable tooling: without recorded starting numbers, a pre-existing failure is indistinguishable from damage.

### Phase 2: Delete by verified line number

Read each of the four files in full, resolve exact boundaries, and assert each target line's content immediately before removing it so a stale offset aborts rather than cutting the wrong line. Two edits are not pure deletions and are called out in `implementation-summary.md`: the `npx` prerequisite is retargeted rather than dropped, and one corrupt sentence the edit lands on is repaired rather than left as a fragment.

### Phase 3: Compare, decide, and document

Re-run the whole baseline set and compare against the recorded numbers rather than merely checking for green. Re-run each search that originally found an item. Then settle the third item on evidence, and record the reasoning whichever way it goes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Both doctor shell scripts | `bash -n` (per `scripts/README.md` §7) |
| Schema | Both doctor YAML assets | `python3 -c "yaml.safe_load(...)"` plus key-set assertion |
| Contract | Route manifest, assets, script paths, display parity | `route-validate.sh`, `route-validate.sh --self-test` |
| Policy | Read-only versus mutating classification | `check-mcp-mutation-class.sh` |
| Unit | Doctor script test suite | `node scripts/tests/*.test.cjs` |
| Manual | Live diagnostic behavior, before and after | `bash mcp-doctor.sh --json`, `--server sequential_thinking`, `--help` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `route-validate.py` (PyYAML) | Internal | Green | No contract check for display parity |
| Node.js ≥ 20.11 | External | Green | `scripts/tests/*.test.cjs` cannot run |
| Concurrent session under `specs/sk-doc/040` | Internal | Yellow | Working-tree noise; does not block this packet's files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `/doctor:mcp install` or `debug` misbehaves, or any captured check regresses below baseline.
- **Procedure**: `git checkout -- .opencode/commands/doctor/` restores all four files; `mkdir -p specs/sk-doc/039-create-repo-rules` restores the removed directory. Nothing was committed, so no history rewrite is involved.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Verify claims + baseline) ──► Phase 2 (Edit) ──► Phase 3 (Compare + document)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Verify claims + baseline | None | Edit |
| Edit | Verify claims + baseline | Compare |
| Compare + document | Edit | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Verify claims + baseline | Medium | 30-45 minutes |
| Core Implementation | Low | 15 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **~1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured (`before-full.json`, `before-seq.json` in `scratch/`)
- [x] No feature flag needed — change is a static-file deletion
- [x] No monitoring alerts apply

### Rollback Procedure
1. `git checkout -- .opencode/commands/doctor/`
2. `mkdir -p specs/sk-doc/039-create-repo-rules`
3. Re-run `bash .opencode/commands/doctor/scripts/mcp-doctor.sh --json` and confirm the check count returns to 40
4. No stakeholders to notify — the change is not user-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
