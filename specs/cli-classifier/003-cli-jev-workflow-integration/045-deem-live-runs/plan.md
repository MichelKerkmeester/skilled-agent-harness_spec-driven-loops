---
title: "Implementation Plan: Phase 45: deem-live-runs"
description: "Fix the three recorded cli-deem findings through SWE, then run every scorer's Deem arm once on the local server from one script, sequentially, and record each result line."
trigger_phrases:
  - "deem live runs plan"
  - "deem arm results plan"
  - "local deem measurement plan"
  - "cli-deem findings plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 45: deem-live-runs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, TypeScript through tsx, and one Python scorer |
| **Framework** | None |
| **Storage** | Each run's `--out` folder under `~/.skilled/.labels/runs/045-deem-20261002/` |
| **Testing** | `node --test` for cli-deem, and the live runs themselves |

### Overview
SWE 2 max on cli-devin fixes the three cli-deem findings. Once its edit lands, one script runs all 20 Deem arms one after another, each with its recorded label file, and keeps stdout, stderr and the exit status. The session reads each result line into `goal.md`. One DeepSeek V4.1 Flash review covers the fixes and the run record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md` sections 2 and 3, from the `--deem` inventory and 042's `gates.md`.
- [x] Success criteria measurable. Evidence: `goal.md` section 3 names a command and a count for each.
- [x] Dependencies identified. Evidence: `spec.md` Phase Context.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a batch of offline scorers, each with its own Deem arm.

### Key Components
- **`cli-deem.mjs`**: the client every Deem arm spawns.
- **The 20 scorers**: each checks Deem's health, asks its questions and prints a verdict or a stop line.
- **The run script**: `<scratchpad>/w45/run-deem.sh`, outside the repository.

### Data Flow
The script runs one scorer. The scorer checks Deem's health, spawns `cli-deem` per question, writes `calls.jsonl` and `report.json` to its `--out` folder and prints its result. The script records the exit status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `buildQuestion()` in `cli-deem.mjs` | Sends a score with 1 or 11 levels | Update | `cli-deem.test.mjs` count cases |
| Fake choice answers | Carry `temperature` | Update | The suite and DEE-006 |
| Wire contract and README | Say Deem rejects `criteria` | Update | `validate_document.py` |
| The 20 scorers | Run their Deem arms | Unchanged | One live run each |

Required inventory: `git grep -l -e "--deem" -- '*.cjs' '*.mjs' '*.ts'` lists the 19 JS and TS scorers, and `hvr_reader_lens.py` is the Python one.
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
| Unit | `buildQuestion()` counts and the fixtures | `node --test` |
| Integration | All 20 Deem arms on the local server | The run script |
| Manual | Reading each result line against its gate | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local Deem server | Internal | Green | Every arm prints its skip line |
| 042's label files | Internal | Green | A scorer without one stops at its gate |
| SWE 2 max and DeepSeek V4.1 Flash | External | Green | The fixes or the review wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix breaks a suite that passed at its baseline, or a run shows a client fault.
- **Procedure**: `git revert` that fix's commit. Each fix is its own commit.
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
| Setup | Low | Baselines and briefs |
| Core Implementation | Low | One worker run and 20 scorer runs |
| Verification | Med | Reading 20 results and one review |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes). Evidence: no data changes, and every fix is its own commit.
- [x] Feature flag configured. Evidence: the scorers' model arms run only behind `--jev` or `--deem`.
- [x] Monitoring alerts set. Evidence: not applicable to offline scripts.

### Rollback Procedure
1. `git revert <commit>` for the fix at fault.
2. Rerun that fix's suite, and any affected scorer run, from the reverted state.
3. Record the revert in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
